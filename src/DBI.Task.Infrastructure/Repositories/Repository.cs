using System.Linq.Expressions;
using MongoDB.Driver;
using DBI.Task.Domain.Entities;
using DBI.Task.Infrastructure.Data;

namespace DBI.Task.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly IMongoCollection<T> _collection;

    public Repository(IMongoDbContext context)
    {
        _collection = GetCollection(context);
    }

    private IMongoCollection<T> GetCollection(IMongoDbContext context)
    {
        var typeName = typeof(T).Name.ToLowerInvariant();
        return typeName switch
        {
            "user" => (IMongoCollection<T>)context.Users,
            "project" => (IMongoCollection<T>)context.Projects,
            "sprint" => (IMongoCollection<T>)context.Sprints,
            "taskitem" => (IMongoCollection<T>)context.Tasks,
            "comment" => (IMongoCollection<T>)context.Comments,
            "attachment" => (IMongoCollection<T>)context.Attachments,
            "notification" => (IMongoCollection<T>)context.Notifications,
            "activitylog" => (IMongoCollection<T>)context.ActivityLogs,
            _ => context.GetCollection<T>(typeName + "s")
        };
    }

    public virtual async System.Threading.Tasks.Task<T?> GetByIdAsync(string id)
    {
        var filter = Builders<T>.Filter.Eq(e => e.Id, id);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public virtual async System.Threading.Tasks.Task<IEnumerable<T>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public virtual async System.Threading.Tasks.Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await _collection.Find(predicate).ToListAsync();
    }

    public virtual async System.Threading.Tasks.Task<T?> FindOneAsync(Expression<Func<T, bool>> predicate)
    {
        return await _collection.Find(predicate).FirstOrDefaultAsync();
    }

    public virtual async System.Threading.Tasks.Task<T> AddAsync(T entity)
    {
        await _collection.InsertOneAsync(entity);
        return entity;
    }

    public virtual async System.Threading.Tasks.Task UpdateAsync(T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        var filter = Builders<T>.Filter.Eq(e => e.Id, entity.Id);
        await _collection.ReplaceOneAsync(filter, entity);
    }

    public virtual async System.Threading.Tasks.Task DeleteAsync(string id)
    {
        var filter = Builders<T>.Filter.Eq(e => e.Id, id);
        await _collection.DeleteOneAsync(filter);
    }

    public virtual async System.Threading.Tasks.Task<long> CountAsync(Expression<Func<T, bool>>? predicate = null)
    {
        if (predicate == null)
            return await _collection.CountDocumentsAsync(_ => true);
        return await _collection.CountDocumentsAsync(predicate);
    }

    public virtual async System.Threading.Tasks.Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
    {
        return await _collection.Find(predicate).AnyAsync();
    }
}

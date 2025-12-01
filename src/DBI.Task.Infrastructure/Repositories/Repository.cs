using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using DBI.Task.Infrastructure.Data;

namespace DBI.Task.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly DBITaskDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(DBITaskDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async System.Threading.Tasks.Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async System.Threading.Tasks.Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async System.Threading.Tasks.Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.Where(predicate).ToListAsync();
    }

    public virtual async System.Threading.Tasks.Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async System.Threading.Tasks.Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    public virtual async System.Threading.Tasks.Task DeleteAsync(T entity)
    {
        _dbSet.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public virtual async System.Threading.Tasks.Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null)
    {
        if (predicate == null)
            return await _dbSet.CountAsync();
        return await _dbSet.CountAsync(predicate);
    }
}

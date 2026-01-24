using System.Linq.Expressions;
using DBI.Task.Domain.Entities;

namespace DBI.Task.Infrastructure.Repositories;

public interface IRepository<T> where T : BaseEntity
{
    System.Threading.Tasks.Task<T?> GetByIdAsync(string id);
    System.Threading.Tasks.Task<IEnumerable<T>> GetAllAsync();
    System.Threading.Tasks.Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    System.Threading.Tasks.Task<T?> FindOneAsync(Expression<Func<T, bool>> predicate);
    System.Threading.Tasks.Task<T> AddAsync(T entity);
    System.Threading.Tasks.Task UpdateAsync(T entity);
    System.Threading.Tasks.Task DeleteAsync(string id);
    System.Threading.Tasks.Task<long> CountAsync(Expression<Func<T, bool>>? predicate = null);
    System.Threading.Tasks.Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
}

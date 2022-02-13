using System.Threading.Tasks;
using CloudIEP.Data.Models;

namespace CloudIEP.Data;

// Borrowed from Microsoft's Azure Samples repo for CosmosDB Repository pattern
//
// GitHub:
// https://github.com/Azure-Samples/PartitionedRepository/blob/master/TodoService.Core/Interfaces/IRepository.cs
public interface IRepository<T> where T : Entity
{
    Task<T[]> GetAllAsync();
    Task<T> GetByIdAsync(string id);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}

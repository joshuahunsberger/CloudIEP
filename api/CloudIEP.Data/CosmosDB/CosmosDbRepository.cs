using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using Microsoft.Azure.Cosmos;

namespace CloudIEP.Data.CosmosDB;

// Borrowed from Microsoft's Azure Samples repo for CosmosDB Repository pattern
//
// GitHub:
// https://github.com/Azure-Samples/PartitionedRepository/tree/master/TodoService.Infrastructure/Data

public abstract class CosmosDbRepository<T> : IRepository<T>, IDocumentCollectionContext<T> where T : Entity
{
    private readonly ICosmosDbClientFactory _cosmosDbClientFactory;

    protected CosmosDbRepository(ICosmosDbClientFactory cosmosDbClientFactory)
    {
        _cosmosDbClientFactory = cosmosDbClientFactory;
    }

    public async Task<T[]> GetAllAsync()
    {
        var cosmosDbClient = _cosmosDbClientFactory.GetClient(CollectionName);
        var documents = await cosmosDbClient.ReadDocumentsAsync<T>();
        return documents.ToArray();
    }

    public async Task<T> GetByIdAsync(string id)
    {
        try
        {
            var cosmosDbClient = _cosmosDbClientFactory.GetClient(CollectionName);
            var response = await cosmosDbClient.ReadDocumentAsync<T>(id, ResolvePartitionKey(id));
            return response.Resource;
        }
        catch (CosmosException e)
        {
            if (e.StatusCode == HttpStatusCode.NotFound)
            {
                throw new EntityNotFoundException();
            }

            throw;
        }
    }

    public async Task<T> AddAsync(T entity)
    {
        try
        {
            entity.Id = GenerateId(entity);
            var cosmosDbClient = _cosmosDbClientFactory.GetClient(CollectionName);
            var response = await cosmosDbClient.CreateDocumentAsync<T>(entity, ResolvePartitionKey(entity.Id));
            return response.Resource;
        }
        catch (CosmosException e)
        {
            if (e.StatusCode == HttpStatusCode.Conflict)
            {
                throw new EntityAlreadyExistsException();
            }

            throw;
        }
    }

    public async Task UpdateAsync(T entity)
    {
        try
        {
            var cosmosDbClient = _cosmosDbClientFactory.GetClient(CollectionName);
            await cosmosDbClient.ReplaceDocumentAsync<T>(entity.Id, entity, ResolvePartitionKey(entity.Id));
        }
        catch (CosmosException e)
        {
            if (e.StatusCode == HttpStatusCode.NotFound)
            {
                throw new EntityNotFoundException();
            }

            throw;
        }
    }

    public async Task DeleteAsync(T entity)
    {
        try
        {
            var cosmosDbClient = _cosmosDbClientFactory.GetClient(CollectionName);
            await cosmosDbClient.DeleteDocumentAsync<T>(entity.Id, ResolvePartitionKey(entity.Id));
        }
        catch (CosmosException e)
        {
            if (e.StatusCode == HttpStatusCode.NotFound)
            {
                throw new EntityNotFoundException();
            }

            throw;
        }
    }

    public abstract string CollectionName { get; }
    public virtual string GenerateId(T entity) => Guid.NewGuid().ToString();
    public virtual PartitionKey? ResolvePartitionKey(string entityId) => null;
}

﻿using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;

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
            var document = await cosmosDbClient.ReadDocumentAsync(id, new RequestOptions
            {
                PartitionKey = ResolvePartitionKey(id)
            });

            return JsonConvert.DeserializeObject<T>(document.ToString());
        }
        catch (DocumentClientException e)
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
            var document = await cosmosDbClient.CreateDocumentAsync(entity);
            return JsonConvert.DeserializeObject<T>(document.ToString());
        }
        catch (DocumentClientException e)
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
            await cosmosDbClient.ReplaceDocumentAsync(entity.Id, entity);
        }
        catch (DocumentClientException e)
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
            await cosmosDbClient.DeleteDocumentAsync(entity.Id, new RequestOptions
            {
                PartitionKey = ResolvePartitionKey(entity.Id)
            });
        }
        catch (DocumentClientException e)
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
    public virtual PartitionKey ResolvePartitionKey(string entityId) => null;
}

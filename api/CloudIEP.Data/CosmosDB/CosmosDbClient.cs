using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;

namespace CloudIEP.Data.CosmosDB;

// Borrowed from Microsoft's Azure Samples repo for CosmosDB Repository pattern
//
// GitHub:
// https://github.com/Azure-Samples/PartitionedRepository/tree/master/TodoService.Infrastructure/Data

public interface ICosmosDbClient
{
    Task<ItemResponse<T>> ReadDocumentAsync<T>(string documentId, PartitionKey? partitionKey = null,
        ItemRequestOptions options = null, CancellationToken cancellationToken = default(CancellationToken));

    Task<IEnumerable<T>> ReadDocumentsAsync<T>(QueryRequestOptions options = null, CancellationToken cancellationToken = default);

    Task<ItemResponse<T>> CreateDocumentAsync<T>(T document, PartitionKey? partitionKey = null, 
        ItemRequestOptions options = null, CancellationToken cancellationToken = default(CancellationToken));

    Task<ItemResponse<T>> ReplaceDocumentAsync<T>(string documentId, T document, PartitionKey? partitionKey = null, 
        ItemRequestOptions options = null, CancellationToken cancellationToken = default(CancellationToken));

    Task<ItemResponse<T>> DeleteDocumentAsync<T>(string documentId, PartitionKey? partitionKey,
        ItemRequestOptions options = null, CancellationToken cancellationToken = default(CancellationToken));
}

public class CosmosDbClient : ICosmosDbClient
{
    private readonly string _databaseName;
    private readonly string _containerName;
    private readonly CosmosClient _cosmosClient;
    private readonly Container _container;

    public CosmosDbClient(string databaseName, string containerName, CosmosClient cosmosClient)
    {
        _databaseName = databaseName ?? throw new ArgumentNullException(nameof(databaseName));
        _containerName = containerName ?? throw new ArgumentNullException(nameof(containerName));
        _cosmosClient = cosmosClient ?? throw new ArgumentNullException(nameof(cosmosClient));
        _container = _cosmosClient.GetContainer(_databaseName, _containerName);
    }

    public async Task<ItemResponse<T>> ReadDocumentAsync<T>(string documentId, PartitionKey? partitionKey = null,
        ItemRequestOptions options = null, CancellationToken cancellationToken = default(CancellationToken))
    {
        return await _container.ReadItemAsync<T>(documentId, partitionKey ?? PartitionKey.None, options, cancellationToken);
    }

    public async Task<IEnumerable<T>> ReadDocumentsAsync<T>(QueryRequestOptions options = null, CancellationToken cancellationToken = default)
    {
        var queryDefinition = new QueryDefinition("SELECT * FROM c");
        var query = _container.GetItemQueryIterator<T>(queryDefinition, requestOptions: options);
        
        var returnList = new List<T>();
        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync(cancellationToken);
            returnList.AddRange(response);
        }
        return returnList;
    }

    public async Task<ItemResponse<T>> CreateDocumentAsync<T>(T document, PartitionKey? partitionKey = null, 
        ItemRequestOptions options = null, CancellationToken cancellationToken = default(CancellationToken))
    {
        return await _container.CreateItemAsync<T>(document, partitionKey, options, cancellationToken);
    }

    public async Task<ItemResponse<T>> ReplaceDocumentAsync<T>(string documentId, T document, PartitionKey? partitionKey = null, 
        ItemRequestOptions options = null, CancellationToken cancellationToken = default(CancellationToken))
    {
        return await _container.ReplaceItemAsync<T>(document, documentId, partitionKey, options, cancellationToken);
    }

    public async Task<ItemResponse<T>> DeleteDocumentAsync<T>(string documentId, PartitionKey? partitionKey,
        ItemRequestOptions options = null, CancellationToken cancellationToken = default(CancellationToken))
    {
        return await _container.DeleteItemAsync<T>(documentId, partitionKey ?? PartitionKey.None, options, cancellationToken);
    }
}

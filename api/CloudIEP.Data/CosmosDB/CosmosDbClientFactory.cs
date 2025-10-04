using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;

namespace CloudIEP.Data.CosmosDB;

// Borrowed from Microsoft's Azure Samples repo for CosmosDB Repository pattern
//
// GitHub:
// https://github.com/Azure-Samples/PartitionedRepository/tree/master/TodoService.Infrastructure/Data

public interface ICosmosDbClientFactory
{
    ICosmosDbClient GetClient(string collectionName);
}

public class CosmosDbClientFactory : ICosmosDbClientFactory
{
    private readonly string _databaseName;
    private readonly List<string> _collectionNames;
    private readonly CosmosClient _cosmosClient;

    public CosmosDbClientFactory(string databaseName, List<string> collectionNames, CosmosClient cosmosClient)
    {
        _databaseName = databaseName ?? throw new ArgumentNullException(nameof(databaseName));
        _collectionNames = collectionNames ?? throw new ArgumentNullException(nameof(collectionNames));
        _cosmosClient = cosmosClient ?? throw new ArgumentNullException(nameof(cosmosClient));
    }

    public ICosmosDbClient GetClient(string collectionName)
    {
        if (!_collectionNames.Contains(collectionName))
        {
            throw new ArgumentException($"Unable to find collection: {collectionName}");
        }

        return new CosmosDbClient(_databaseName, collectionName, _cosmosClient);
    }

    public async Task EnsureDbSetupAsync()
    {
        var database = _cosmosClient.GetDatabase(_databaseName);
        await database.ReadAsync();

        foreach (var collectionName in _collectionNames)
        {
            var container = database.GetContainer(collectionName);
            await container.ReadContainerAsync();
        }
    }
}

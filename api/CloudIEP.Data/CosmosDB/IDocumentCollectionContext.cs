using CloudIEP.Data.Models;
using Microsoft.Azure.Documents;

namespace CloudIEP.Data.CosmosDB;

// Borrowed from Microsoft's Azure Samples repo for CosmosDB Repository pattern
//
// GitHub:
// https://github.com/Azure-Samples/PartitionedRepository/tree/master/TodoService.Infrastructure/Data

public interface IDocumentCollectionContext<in T> where T : Entity
{
    string CollectionName { get; }

    string GenerateId(T entity);

    PartitionKey ResolvePartitionKey(string entityId);
}

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;

namespace CloudIEP.Data.CosmosDB;

// Borrowed from Microsoft's Azure Samples repo for CosmosDB Repository pattern
//
// GitHub:
// https://github.com/Azure-Samples/PartitionedRepository/tree/master/TodoService.Infrastructure/Data

public interface ICosmosDbClient
{
    Task<Document> ReadDocumentAsync(string documentId, RequestOptions options = null,
        CancellationToken cancellationToken = default(CancellationToken));

    Task<IEnumerable<T>> ReadDocumentsAsync<T>(RequestOptions options = null, CancellationToken cancellationToken = default);

    Task<Document> CreateDocumentAsync(object document, RequestOptions options = null,
        bool disableAutomaticIdGeneration = false,
        CancellationToken cancellationToken = default(CancellationToken));

    Task<Document> ReplaceDocumentAsync(string documentId, object document, RequestOptions options = null,
        CancellationToken cancellationToken = default(CancellationToken));

    Task<Document> DeleteDocumentAsync(string documentId, RequestOptions options = null,
        CancellationToken cancellationToken = default(CancellationToken));
}

public class CosmosDbClient : ICosmosDbClient
{
    private readonly string _databaseName;
    private readonly string _collectionName;
    private readonly IDocumentClient _documentClient;

    public CosmosDbClient(string databaseName, string collectionName, IDocumentClient documentClient)
    {
        _databaseName = databaseName ?? throw new ArgumentNullException(nameof(databaseName));
        _collectionName = collectionName ?? throw new ArgumentNullException(nameof(collectionName));
        _documentClient = documentClient ?? throw new ArgumentNullException(nameof(documentClient));
    }

    public async Task<Document> ReadDocumentAsync(string documentId, RequestOptions options = null,
        CancellationToken cancellationToken = default(CancellationToken))
    {
        return await _documentClient.ReadDocumentAsync(
            UriFactory.CreateDocumentUri(_databaseName, _collectionName, documentId), options, cancellationToken);
    }

    public async Task<IEnumerable<T>> ReadDocumentsAsync<T>(RequestOptions options = null, CancellationToken cancellationToken = default)
    {
        using var queryable = _documentClient
            .CreateDocumentQuery<T>(UriFactory.CreateDocumentCollectionUri(_databaseName, _collectionName), new FeedOptions { MaxItemCount = 10 })
            .AsDocumentQuery();
        var returnList = new List<T>();
        while (queryable.HasMoreResults)
        {
            foreach (T t in await queryable.ExecuteNextAsync<T>(cancellationToken))
            {
                returnList.Add(t);
            }
        }
        return returnList;
    }

    public async Task<Document> CreateDocumentAsync(object document, RequestOptions options = null,
        bool disableAutomaticIdGeneration = false, CancellationToken cancellationToken = default(CancellationToken))
    {
        return await _documentClient.CreateDocumentAsync(
            UriFactory.CreateDocumentCollectionUri(_databaseName, _collectionName), document, options,
            disableAutomaticIdGeneration, cancellationToken);
    }

    public async Task<Document> ReplaceDocumentAsync(string documentId, object document,
        RequestOptions options = null, CancellationToken cancellationToken = default(CancellationToken))
    {
        return await _documentClient.ReplaceDocumentAsync(
            UriFactory.CreateDocumentUri(_databaseName, _collectionName, documentId), document, options,
            cancellationToken);
    }

    public async Task<Document> DeleteDocumentAsync(string documentId, RequestOptions options = null,
        CancellationToken cancellationToken = default(CancellationToken))
    {
        return await _documentClient.DeleteDocumentAsync(
            UriFactory.CreateDocumentUri(_databaseName, _collectionName, documentId), options, cancellationToken);
    }
}

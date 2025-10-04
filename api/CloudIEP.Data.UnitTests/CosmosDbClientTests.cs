using System;
using System.Threading;
using CloudIEP.Data.CosmosDB;
using Microsoft.Azure.Cosmos;
using Moq;
using Xunit;

namespace CloudIEP.Data.UnitTests;

// Tests for examples borrowed from Azure-Samples on GitHub:
// https://github.com/Azure-Samples/PartitionedRepository/blob/master/TodoService.Infrastructure.UnitTests/Data/CosmosDbClientTests.cs
public class CosmosDbClientFixture : IDisposable
{
    public string DatabaseName { get; } = "foo";
    public string CollectionName { get; } = "bar";
    public string DocumentId { get; } = "foobar";
    public object Document { get; } = new { Id = "foobar", Note = "Note" };

    public CosmosDbClient CreateCosmosDbClientForTesting(CosmosClient cosmosClient)
    {
        return new CosmosDbClient(DatabaseName, CollectionName, cosmosClient);
    }

    public void Dispose() { }
}

public class CosmosDbClientTests : IClassFixture<CosmosDbClientFixture>
{
    private readonly CosmosDbClientFixture _fixture;

    public CosmosDbClientTests(CosmosDbClientFixture fixture)
    {
        _fixture = fixture;
    }

    [Theory]
    [InlineData(null, null, null, "databaseName")]
    [InlineData("foo", null, null, "containerName")]
    [InlineData("foo", "bar", null, "cosmosClient")]
    public void CosmosDbClient_WithNullArgument_ShouldThrowArgumentNullException(string databaseName,
        string containerName, CosmosClient cosmosClient, string paramName)
    {
        var ex = Assert.Throws<ArgumentNullException>(() =>
            new CosmosDbClient(databaseName, containerName, cosmosClient));

        Assert.Equal(paramName, ex.ParamName);
    }

    [Fact]
    public void CosmosDbClient_WithNonNullArguments_ShouldReturnNewInstance()
    {
        var cosmosClientStub = new Mock<CosmosClient>();
        var sut = _fixture.CreateCosmosDbClientForTesting(cosmosClientStub.Object);

        Assert.NotNull(sut);
    }

    [Fact]
    public async void ReadDocumentAsync_WhenCalled_ShouldCallReadItemOnContainer()
    {
        var containerMock = new Mock<Container>();
        var cosmosClientMock = new Mock<CosmosClient>();
        containerMock.Setup(x => x.ReadItemAsync<object>(It.IsAny<string>(), It.IsAny<PartitionKey>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Mock.Of<ItemResponse<object>>());
        cosmosClientMock.Setup(x => x.GetContainer(_fixture.DatabaseName, _fixture.CollectionName)).Returns(containerMock.Object);
        var sut = _fixture.CreateCosmosDbClientForTesting(cosmosClientMock.Object);

        await sut.ReadDocumentAsync<object>(_fixture.DocumentId);

        containerMock.Verify(x => x.ReadItemAsync<object>(_fixture.DocumentId, It.IsAny<PartitionKey>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async void CreateDocumentAsync_WhenCalled_ShouldCallCreateItemOnContainer()
    {
        var containerMock = new Mock<Container>();
        var cosmosClientMock = new Mock<CosmosClient>();
        containerMock.Setup(x => x.CreateItemAsync<object>(It.IsAny<object>(), It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Mock.Of<ItemResponse<object>>());
        cosmosClientMock.Setup(x => x.GetContainer(_fixture.DatabaseName, _fixture.CollectionName)).Returns(containerMock.Object);
        var sut = _fixture.CreateCosmosDbClientForTesting(cosmosClientMock.Object);

        await sut.CreateDocumentAsync<object>(_fixture.Document);

        containerMock.Verify(x => x.CreateItemAsync<object>(_fixture.Document, It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async void ReplaceAsync_WhenCalled_ShouldCallReplaceItemOnContainer()
    {
        var containerMock = new Mock<Container>();
        var cosmosClientMock = new Mock<CosmosClient>();
        containerMock.Setup(x => x.ReplaceItemAsync<object>(It.IsAny<object>(), It.IsAny<string>(), It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Mock.Of<ItemResponse<object>>());
        cosmosClientMock.Setup(x => x.GetContainer(_fixture.DatabaseName, _fixture.CollectionName)).Returns(containerMock.Object);
        var sut = _fixture.CreateCosmosDbClientForTesting(cosmosClientMock.Object);

        await sut.ReplaceDocumentAsync<object>(_fixture.DocumentId, _fixture.Document);

        containerMock.Verify(x => x.ReplaceItemAsync<object>(_fixture.Document, _fixture.DocumentId, It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async void DeleteAsync_WhenCalled_ShouldCallDeleteItemOnContainer()
    {
        var containerMock = new Mock<Container>();
        var cosmosClientMock = new Mock<CosmosClient>();
        containerMock.Setup(x => x.DeleteItemAsync<object>(It.IsAny<string>(), It.IsAny<PartitionKey>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Mock.Of<ItemResponse<object>>());
        cosmosClientMock.Setup(x => x.GetContainer(_fixture.DatabaseName, _fixture.CollectionName)).Returns(containerMock.Object);
        var sut = _fixture.CreateCosmosDbClientForTesting(cosmosClientMock.Object);

        await sut.DeleteDocumentAsync<object>(_fixture.DocumentId, PartitionKey.None);

        containerMock.Verify(x => x.DeleteItemAsync<object>(_fixture.DocumentId, PartitionKey.None, It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using CloudIEP.Data.CosmosDB;
using Microsoft.Azure.Cosmos;
using Moq;
using Xunit;

namespace CloudIEP.Data.UnitTests;

// Tests for examples borrowed from Azure-Samples on GitHub:
// https://github.com/Azure-Samples/PartitionedRepository/blob/master/TodoService.Infrastructure.UnitTests/Data/CosmosDbClientFactoryTests.cs
public class CosmosDbClientFactoryFixture : IDisposable
{
    public string DatabaseName { get; } = "foobar";
    public List<string> CollectionNames { get; } = new List<string> { "foo", "bar" };

    public CosmosDbClientFactory CreateCosmosDbClientFactoryForTesting(CosmosClient cosmosClient)
    {
        return new CosmosDbClientFactory(DatabaseName, CollectionNames, cosmosClient);
    }

    public void Dispose() { }
}

public class CosmosDbClientFactoryTests : IClassFixture<CosmosDbClientFactoryFixture>
{
    private readonly CosmosDbClientFactoryFixture _fixture;

    public CosmosDbClientFactoryTests(CosmosDbClientFactoryFixture fixture)
    {
        _fixture = fixture;
    }

    [Theory]
    [InlineData(null, null, null, "databaseName")]
    [InlineData("foo", null, null, "collectionNames")]
    [InlineData("foo", new[] { "bar" }, null, "cosmosClient")]
    public void CosmosDbClientFactory_WithNullArgument_ShouldThrowArgumentNullException(string databaseName,
        IEnumerable<string> collectionNames, CosmosClient cosmosClient, string paramName)
    {
        var ex = Assert.Throws<ArgumentNullException>(() =>
            new CosmosDbClientFactory(databaseName, collectionNames?.ToList(), cosmosClient));

        Assert.Equal(paramName, ex.ParamName);
    }

    [Fact]
    public void CosmosClientFactory_WithNonNullArguments_ShouldCreateNewInstance()
    {
        var cosmosClientStub = new Mock<CosmosClient>();
        var sut = _fixture.CreateCosmosDbClientFactoryForTesting(cosmosClientStub.Object);

        Assert.NotNull(sut);
    }

    [Fact]
    public void GetClient_WithNonExistingCollectionName_ShouldThrowArgumentException()
    {
        var cosmosClientStub = new Mock<CosmosClient>();
        var sut = _fixture.CreateCosmosDbClientFactoryForTesting(cosmosClientStub.Object);
        const string collectionName = "abc";

        var ex = Assert.Throws<ArgumentException>(() => sut.GetClient(collectionName));

        Assert.Equal($"Unable to find collection: {collectionName}", ex.Message);
    }

    [Fact]
    public void GetClient_WithExistingCollectionName_ShouldReturnNewCosmosClient()
    {
        var cosmosClientStub = new Mock<CosmosClient>();
        var sut = _fixture.CreateCosmosDbClientFactoryForTesting(cosmosClientStub.Object);
        var collectionName = _fixture.CollectionNames[0];

        var result = sut.GetClient(collectionName);

        Assert.NotNull(result);
    }

    [Fact]
    public async void EnsureDbSetupAsync_WhenCalled_ShouldVerifyDatabaseAndCollectionsExistence()
    {
        var databaseMock = new Mock<Database>();
        var containerMock = new Mock<Container>();
        var cosmosClientMock = new Mock<CosmosClient>();
        
        cosmosClientMock.Setup(x => x.GetDatabase(_fixture.DatabaseName)).Returns(databaseMock.Object);
        databaseMock.Setup(x => x.ReadAsync(It.IsAny<RequestOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Mock.Of<DatabaseResponse>());
        databaseMock.Setup(x => x.GetContainer(It.IsAny<string>())).Returns(containerMock.Object);
        containerMock.Setup(x => x.ReadContainerAsync(It.IsAny<ContainerRequestOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Mock.Of<ContainerResponse>());
        
        var sut = _fixture.CreateCosmosDbClientFactoryForTesting(cosmosClientMock.Object);

        await sut.EnsureDbSetupAsync();

        cosmosClientMock.Verify(x => x.GetDatabase(_fixture.DatabaseName), Times.Once);
        databaseMock.Verify(x => x.ReadAsync(It.IsAny<RequestOptions>(), It.IsAny<CancellationToken>()), Times.Once);
        databaseMock.Verify(x => x.GetContainer(_fixture.CollectionNames[0]), Times.Once);
        databaseMock.Verify(x => x.GetContainer(_fixture.CollectionNames[1]), Times.Once);
    }
}

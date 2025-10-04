using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using CloudIEP.Data.CosmosDB;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using Microsoft.Azure.Cosmos;
using Moq;
using Xunit;

namespace CloudIEP.Data.UnitTests;

// Tests for examples borrowed from Azure-Samples on GitHub:
// https://github.com/Azure-Samples/PartitionedRepository/blob/master/TodoService.Infrastructure.UnitTests/Data/CosmosDbRepositoryTests.cs
public class FakeEntity : Entity
{
    public string Note { get; set; }
}

public class CosmosDbRepositoryFixture : IDisposable
{
    public string CollectionName { get; } = "fakeCollection";

    public FakeEntity FakeEntity { get; } = new FakeEntity { Note = "fakeNote" };

    public CosmosDbRepository<FakeEntity> CreateCosmosDbRepositoryForTesting(ICosmosDbClient cosmosDbClient)
    {
        var factoryStub = new Mock<ICosmosDbClientFactory>();
        factoryStub.Setup(x => x.GetClient(CollectionName)).Returns(cosmosDbClient);

        var sut = new Mock<CosmosDbRepository<FakeEntity>>(factoryStub.Object);
        sut.Setup(x => x.CollectionName).Returns(CollectionName);
        sut.CallBase = true;

        return sut.Object;
    }

    public CosmosException CreateCosmosExceptionForTesting(HttpStatusCode statusCode)
    {
        return new CosmosException("Test exception", statusCode, 0, "test", 0);
    }
    public void Dispose() { }
}

public class CosmosDbRepositoryTests : IClassFixture<CosmosDbRepositoryFixture>
{
    private readonly CosmosDbRepositoryFixture _fixture;

    public CosmosDbRepositoryTests(CosmosDbRepositoryFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task GetByIdAsync_WhenCosmosExceptionWithStatusCodeNotFoundIsCaught_ShouldThrowEntityNotFoundException()
    {
        var clientStub = new Mock<ICosmosDbClient>();
        clientStub.Setup(x =>
                x.ReadDocumentAsync<FakeEntity>(It.IsAny<string>(), It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .Throws(_fixture.CreateCosmosExceptionForTesting(HttpStatusCode.NotFound));
        var sut = _fixture.CreateCosmosDbRepositoryForTesting(clientStub.Object);

        await Assert.ThrowsAsync<EntityNotFoundException>(async () => await sut.GetByIdAsync(""));
    }

    [Fact]
    public async Task GetByIdAsync_WhenCosmosExceptionWithStatusCodeBesidesNotFoundIsCaught_ShouldRethrow()
    {
        var clientStub = new Mock<ICosmosDbClient>();
        clientStub.Setup(x =>
                x.ReadDocumentAsync<FakeEntity>(It.IsAny<string>(), It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .Throws(_fixture.CreateCosmosExceptionForTesting(HttpStatusCode.BadRequest));
        var sut = _fixture.CreateCosmosDbRepositoryForTesting(clientStub.Object);

        var ce = await Assert.ThrowsAsync<CosmosException>(async () => await sut.GetByIdAsync(""));

        Assert.Equal(HttpStatusCode.BadRequest, ce.StatusCode);
    }

    [Fact]
    public async Task GetByIdAsync_WhenIdExists_ShouldReturnDocumentWithTheId()
    {
        var responseMock = new Mock<ItemResponse<FakeEntity>>();
        responseMock.Setup(x => x.Resource).Returns(_fixture.FakeEntity);
        var clientStub = new Mock<ICosmosDbClient>();
        clientStub.Setup(x =>
                x.ReadDocumentAsync<FakeEntity>(_fixture.FakeEntity.Id, It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(responseMock.Object);
        var sut = _fixture.CreateCosmosDbRepositoryForTesting(clientStub.Object);

        var result = await sut.GetByIdAsync(_fixture.FakeEntity.Id);

        Assert.NotNull(result);
        Assert.Equal(_fixture.FakeEntity.Id, result.Id);
        Assert.Equal(_fixture.FakeEntity.Note, result.Note);
    }

    [Fact]
    public async Task AddAsync_WhenCosmosExceptionWithStatusCodeConflictIsCaught_ShouldThrowEntityAlreadyExistsException()
    {
        var clientStub = new Mock<ICosmosDbClient>();
        clientStub.Setup(
                x => x.CreateDocumentAsync<FakeEntity>(It.IsAny<FakeEntity>(), It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .Throws(_fixture.CreateCosmosExceptionForTesting(HttpStatusCode.Conflict));
        var sut = _fixture.CreateCosmosDbRepositoryForTesting(clientStub.Object);

        await Assert.ThrowsAsync<EntityAlreadyExistsException>(async () => await sut.AddAsync(new FakeEntity()));
    }

    [Fact]
    public async Task AddAsync_WhenCosmosExceptionWithStatusCodeBesidesConflictIsCaught_ShouldRethrow()
    {
        var clientStub = new Mock<ICosmosDbClient>();
        clientStub.Setup(
                x => x.CreateDocumentAsync<FakeEntity>(It.IsAny<FakeEntity>(), It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .Throws(_fixture.CreateCosmosExceptionForTesting(HttpStatusCode.BadRequest));
        var sut = _fixture.CreateCosmosDbRepositoryForTesting(clientStub.Object);

        var ce = await Assert.ThrowsAsync<CosmosException>(
            async () => await sut.AddAsync(new FakeEntity()));

        Assert.Equal(HttpStatusCode.BadRequest, ce.StatusCode);
    }

    [Fact]
    public async Task AddAsync_GivenAnEntity_ShouldAddTheEntityAndReturnIt()
    {
        var responseMock = new Mock<ItemResponse<FakeEntity>>();
        responseMock.Setup(x => x.Resource).Returns(_fixture.FakeEntity);
        var clientStub = new Mock<ICosmosDbClient>();
        clientStub.Setup(x => x.CreateDocumentAsync<FakeEntity>(_fixture.FakeEntity, It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(responseMock.Object);
        var sut = _fixture.CreateCosmosDbRepositoryForTesting(clientStub.Object);

        var result = await sut.AddAsync(_fixture.FakeEntity);

        Assert.NotNull(result);
        Assert.True(Guid.TryParse(result.Id, out _));
        Assert.Equal(_fixture.FakeEntity.Note, result.Note);
    }

    [Fact]
    public async Task UpdateAsync_WhenCosmosExceptionIsCaughtWithStatusCodeNotFound_ShouldThrowEntityNotFoundExistsException()
    {
        var clientStub = new Mock<ICosmosDbClient>();
        clientStub.Setup(x =>
                x.ReplaceDocumentAsync<FakeEntity>(It.IsAny<string>(), It.IsAny<FakeEntity>(), It.IsAny<PartitionKey?>(),
                    It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .Throws(_fixture.CreateCosmosExceptionForTesting(HttpStatusCode.NotFound));
        var sut = _fixture.CreateCosmosDbRepositoryForTesting(clientStub.Object);

        await Assert.ThrowsAsync<EntityNotFoundException>(async () => await sut.UpdateAsync(new FakeEntity()));
    }

    [Fact]
    public async Task UpdateAsync_WhenCosmosExceptionIsCaughtWithStatusCodeBesidesNotFound_ShouldRethrow()
    {
        var clientStub = new Mock<ICosmosDbClient>();
        clientStub.Setup(x =>
                x.ReplaceDocumentAsync<FakeEntity>(It.IsAny<string>(), It.IsAny<FakeEntity>(), It.IsAny<PartitionKey?>(),
                    It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .Throws(_fixture.CreateCosmosExceptionForTesting(HttpStatusCode.BadRequest));
        var sut = _fixture.CreateCosmosDbRepositoryForTesting(clientStub.Object);

        var ce = await Assert.ThrowsAsync<CosmosException>(async () =>
            await sut.UpdateAsync(new FakeEntity()));

        Assert.Equal(HttpStatusCode.BadRequest, ce.StatusCode);
    }

    [Fact]
    public async Task UpdateAsync_GivenAnEntity_ShouldCallReplaceDocumentAsync()
    {
        var responseMock = new Mock<ItemResponse<FakeEntity>>();
        var clientMock = new Mock<ICosmosDbClient>();
        clientMock.Setup(
                x => x.ReplaceDocumentAsync<FakeEntity>(
                    It.IsAny<string>(),
                    It.IsAny<FakeEntity>(),
                    It.IsAny<PartitionKey?>(),
                    It.IsAny<ItemRequestOptions>(),
                    It.IsAny<CancellationToken>()))
            .ReturnsAsync(responseMock.Object);
        var sut = _fixture.CreateCosmosDbRepositoryForTesting(clientMock.Object);

        await sut.UpdateAsync(_fixture.FakeEntity);

        clientMock.Verify(
            x => x.ReplaceDocumentAsync<FakeEntity>(
                It.Is<string>(entityId => entityId == _fixture.FakeEntity.Id),
                It.Is<FakeEntity>(entity =>
                    entity.Id == _fixture.FakeEntity.Id && entity.Note == _fixture.FakeEntity.Note),
                It.IsAny<PartitionKey?>(),
                It.IsAny<ItemRequestOptions>(),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WhenCosmosExceptionWithStatusCodeNotFoundIsCaught_ShouldThrowEntityNotFoundException()
    {
        var clientStub = new Mock<ICosmosDbClient>();
        clientStub.Setup(x => x.DeleteDocumentAsync<FakeEntity>(It.IsAny<string>(), It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .Throws(_fixture.CreateCosmosExceptionForTesting(HttpStatusCode.NotFound));
        var sut = _fixture.CreateCosmosDbRepositoryForTesting(clientStub.Object);

        await Assert.ThrowsAsync<EntityNotFoundException>(async () => await sut.DeleteAsync(new FakeEntity()));
    }

    [Fact]
    public async Task DeleteAsync_WhenCosmosExceptionWithStatusCodeBesidesNotFoundIsCaught_ShouldRethrow()
    {
        var clientStub = new Mock<ICosmosDbClient>();
        clientStub.Setup(x => x.DeleteDocumentAsync<FakeEntity>(It.IsAny<string>(), It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .Throws(_fixture.CreateCosmosExceptionForTesting(HttpStatusCode.BadRequest));
        var sut = _fixture.CreateCosmosDbRepositoryForTesting(clientStub.Object);

        var ce = await Assert.ThrowsAsync<CosmosException>(async () =>
            await sut.DeleteAsync(new FakeEntity()));

        Assert.Equal(HttpStatusCode.BadRequest, ce.StatusCode);
    }

    [Fact]
    public async Task DeleteAsync_GivenAnEntity_ShouldCallDeleteDocumentAsync()
    {
        var responseMock = new Mock<ItemResponse<FakeEntity>>();
        var clientMock = new Mock<ICosmosDbClient>();
        clientMock.Setup(x => x.DeleteDocumentAsync<FakeEntity>(It.IsAny<string>(), It.IsAny<PartitionKey?>(), It.IsAny<ItemRequestOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(responseMock.Object);
        var sut = _fixture.CreateCosmosDbRepositoryForTesting(clientMock.Object);

        await sut.DeleteAsync(_fixture.FakeEntity);

        clientMock.Verify(
            x => x.DeleteDocumentAsync<FakeEntity>(
                It.Is<string>(entityId => entityId == _fixture.FakeEntity.Id),
                It.IsAny<PartitionKey?>(),
                It.IsAny<ItemRequestOptions>(),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }
}

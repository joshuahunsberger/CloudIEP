using System;
using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using CloudIEP.Domain.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CloudIEP.Data.UnitTests;

public class UserServiceTests
{
    private CloudIEPDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<CloudIEPDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new CloudIEPDbContext(options);
    }

    [Fact]
    public async Task GetOrCreateUserFromTokenAsync_WhenUserExists_ShouldReturnExistingUser()
    {
        await using var context = CreateContext();
        var existing = new User { Id = "auth0|111", Auth0Id = "auth0|111", FirstName = "Existing" };
        context.Users.Add(existing);
        await context.SaveChangesAsync();

        var service = new UserService(context);
        var result = await service.GetOrCreateUserFromTokenAsync("auth0|111");

        Assert.NotNull(result);
        Assert.Equal("Existing", result.FirstName);
    }

    [Fact]
    public async Task GetOrCreateUserFromTokenAsync_WhenUserDoesNotExist_ShouldCreateNewUser()
    {
        await using var context = CreateContext();
        var service = new UserService(context);

        var result = await service.GetOrCreateUserFromTokenAsync("auth0|new-user");

        Assert.NotNull(result);
        Assert.Equal("auth0|new-user", result.Id);
        Assert.Equal("auth0|new-user", result.Auth0Id);

        var userInDb = await context.Users.FindAsync("auth0|new-user");
        Assert.NotNull(userInDb);
    }

    [Fact]
    public async Task UpdateFirstNameAsync_WhenUserExists_ShouldUpdateFirstName()
    {
        await using var context = CreateContext();
        var user = new User { Id = "auth0|123", Auth0Id = "auth0|123", FirstName = "Old" };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var service = new UserService(context);
        await service.UpdateFirstNameAsync("auth0|123", "NewFirst");

        var userInDb = await context.Users.FindAsync("auth0|123");
        Assert.NotNull(userInDb);
        Assert.Equal("NewFirst", userInDb.FirstName);
    }

    [Fact]
    public async Task UpdateFirstNameAsync_WhenNotFound_ShouldThrowEntityNotFoundException()
    {
        await using var context = CreateContext();
        var service = new UserService(context);

        await Assert.ThrowsAsync<EntityNotFoundException>(() => service.UpdateFirstNameAsync("non-existent", "Name"));
    }

    [Fact]
    public async Task UpdateLastNameAsync_WhenUserExists_ShouldUpdateLastName()
    {
        await using var context = CreateContext();
        var user = new User { Id = "auth0|123", Auth0Id = "auth0|123", LastName = "Old" };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var service = new UserService(context);
        await service.UpdateLastNameAsync("auth0|123", "NewLast");

        var userInDb = await context.Users.FindAsync("auth0|123");
        Assert.NotNull(userInDb);
        Assert.Equal("NewLast", userInDb.LastName);
    }

    [Fact]
    public async Task UpdateLastNameAsync_WhenNotFound_ShouldThrowEntityNotFoundException()
    {
        await using var context = CreateContext();
        var service = new UserService(context);

        await Assert.ThrowsAsync<EntityNotFoundException>(() => service.UpdateLastNameAsync("non-existent", "Name"));
    }
}

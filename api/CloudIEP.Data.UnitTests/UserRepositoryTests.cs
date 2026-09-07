using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CloudIEP.Data.UnitTests;

public class UserRepositoryTests
{
    private CloudIEPDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<CloudIEPDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new CloudIEPDbContext(options);
    }

    [Fact]
    public async Task AddAsync_ShouldUseAuth0IdAsEntityIdWhenIdNotSet()
    {
        using var context = CreateContext();
        var repo = new UserRepository(context);

        var user = new User
        {
            Auth0Id = "auth0|123456",
            FirstName = "Jane",
            LastName = "Doe"
        };

        var result = await repo.AddAsync(user);

        Assert.NotNull(result);
        Assert.Equal("auth0|123456", result.Id);
        Assert.Equal("Jane", result.FirstName);

        var retrieved = await context.Users.FindAsync("auth0|123456");
        Assert.NotNull(retrieved);
        Assert.Equal("auth0|123456", retrieved.Id);
    }

    [Fact]
    public async Task GetByIdAsync_WhenExists_ShouldReturnUser()
    {
        using var context = CreateContext();
        var repo = new UserRepository(context);

        var user = new User
        {
            Auth0Id = "auth0|999",
            FirstName = "Teacher",
            LastName = "One"
        };
        await repo.AddAsync(user);

        var result = await repo.GetByIdAsync("auth0|999");

        Assert.NotNull(result);
        Assert.Equal("auth0|999", result.Id);
        Assert.Equal("Teacher", result.FirstName);
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ShouldThrowEntityNotFoundException()
    {
        using var context = CreateContext();
        var repo = new UserRepository(context);

        await Assert.ThrowsAsync<EntityNotFoundException>(() => repo.GetByIdAsync("non-existent-user"));
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdatePropertiesAndStudents()
    {
        using var context = CreateContext();
        var repo = new UserRepository(context);

        var user = new User
        {
            Auth0Id = "auth0|user1",
            FirstName = "Original",
            LastName = "Name",
            Students = [new StudentPreview { Id = "s1", FullName = "Student One" }]
        };
        await repo.AddAsync(user);

        var updated = new User
        {
            Id = "auth0|user1",
            Auth0Id = "auth0|user1",
            FirstName = "Updated",
            LastName = "Name",
            Students =
            [
                new StudentPreview { Id = "s1", FullName = "Student One" },
                new StudentPreview { Id = "s2", FullName = "Student Two" }
            ]
        };

        await repo.UpdateAsync(updated);

        var retrieved = await repo.GetByIdAsync("auth0|user1");
        Assert.Equal("Updated", retrieved.FirstName);
        Assert.Equal(2, retrieved.Students.Count);
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemoveUser()
    {
        using var context = CreateContext();
        var repo = new UserRepository(context);

        var user = new User { Auth0Id = "auth0|del", FirstName = "DeleteMe" };
        await repo.AddAsync(user);

        await repo.DeleteAsync(user);

        await Assert.ThrowsAsync<EntityNotFoundException>(() => repo.GetByIdAsync("auth0|del"));
    }
}

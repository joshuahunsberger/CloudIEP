using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CloudIEP.Data.UnitTests;

public class StudentRepositoryTests
{
    private CloudIEPDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<CloudIEPDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new CloudIEPDbContext(options);
    }

    [Fact]
    public async Task AddAsync_ShouldAddStudentAndGenerateId()
    {
        using var context = CreateContext();
        var repo = new StudentRepository(context);

        var student = new Student
        {
            FirstName = "Alice",
            LastName = "Johnson",
            TeacherId = "teacher-1"
        };

        var result = await repo.AddAsync(student);

        Assert.NotNull(result);
        Assert.False(string.IsNullOrWhiteSpace(result.Id));
        Assert.Equal("Alice", result.FirstName);

        var retrieved = await context.Students.FindAsync(result.Id);
        Assert.NotNull(retrieved);
        Assert.Equal("Alice", retrieved.FirstName);
    }

    [Fact]
    public async Task GetByIdAsync_WhenExists_ShouldReturnStudent()
    {
        using var context = CreateContext();
        var repo = new StudentRepository(context);

        var student = new Student
        {
            Id = "student-123",
            FirstName = "Bob",
            LastName = "Smith"
        };
        await repo.AddAsync(student);

        var result = await repo.GetByIdAsync("student-123");

        Assert.NotNull(result);
        Assert.Equal("student-123", result.Id);
        Assert.Equal("Bob", result.FirstName);
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ShouldThrowEntityNotFoundException()
    {
        using var context = CreateContext();
        var repo = new StudentRepository(context);

        await Assert.ThrowsAsync<EntityNotFoundException>(() => repo.GetByIdAsync("non-existent"));
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllStudents()
    {
        using var context = CreateContext();
        var repo = new StudentRepository(context);

        await repo.AddAsync(new Student { Id = "s1", FirstName = "One" });
        await repo.AddAsync(new Student { Id = "s2", FirstName = "Two" });

        var results = await repo.GetAllAsync();

        Assert.Equal(2, results.Length);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdatePropertiesAndGoals()
    {
        using var context = CreateContext();
        var repo = new StudentRepository(context);

        var student = new Student
        {
            Id = "student-1",
            FirstName = "Original",
            LastName = "Name",
            Goals = [new GoalPreview { GoalId = "g1", GoalName = "Goal 1" }]
        };
        await repo.AddAsync(student);

        // Update in a detached manner
        var updated = new Student
        {
            Id = "student-1",
            FirstName = "Updated",
            LastName = "Name",
            Goals =
            [
                new GoalPreview { GoalId = "g1", GoalName = "Goal 1" },
                new GoalPreview { GoalId = "g2", GoalName = "Goal 2" }
            ]
        };

        await repo.UpdateAsync(updated);

        var retrieved = await repo.GetByIdAsync("student-1");
        Assert.Equal("Updated", retrieved.FirstName);
        Assert.Equal(2, retrieved.Goals.Count);
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemoveStudent()
    {
        using var context = CreateContext();
        var repo = new StudentRepository(context);

        var student = new Student { Id = "student-del", FirstName = "DeleteMe" };
        await repo.AddAsync(student);

        await repo.DeleteAsync(student);

        await Assert.ThrowsAsync<EntityNotFoundException>(() => repo.GetByIdAsync("student-del"));
    }
}

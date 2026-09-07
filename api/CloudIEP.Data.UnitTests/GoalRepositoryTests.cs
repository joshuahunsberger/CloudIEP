using System;
using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CloudIEP.Data.UnitTests;

public class GoalRepositoryTests
{
    private CloudIEPDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<CloudIEPDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new CloudIEPDbContext(options);
    }

    [Fact]
    public async Task AddAsync_ShouldAddGoalAndGenerateId()
    {
        using var context = CreateContext();
        var repo = new GoalRepository(context);

        var goal = new Goal
        {
            GoalName = "Math Goal",
            StudentId = "student-1",
            Category = "Math"
        };

        var result = await repo.AddAsync(goal);

        Assert.NotNull(result);
        Assert.False(string.IsNullOrWhiteSpace(result.Id));
        Assert.Equal("Math Goal", result.GoalName);

        var retrieved = await context.Goals.FindAsync(result.Id);
        Assert.NotNull(retrieved);
    }

    [Fact]
    public async Task GetByIdAsync_WhenExists_ShouldReturnGoal()
    {
        using var context = CreateContext();
        var repo = new GoalRepository(context);

        var goal = new Goal
        {
            Id = "goal-1",
            GoalName = "Reading Goal",
            StudentId = "student-1"
        };
        await repo.AddAsync(goal);

        var result = await repo.GetByIdAsync("goal-1");

        Assert.NotNull(result);
        Assert.Equal("goal-1", result.Id);
        Assert.Equal("Reading Goal", result.GoalName);
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ShouldThrowEntityNotFoundException()
    {
        using var context = CreateContext();
        var repo = new GoalRepository(context);

        await Assert.ThrowsAsync<EntityNotFoundException>(() => repo.GetByIdAsync("non-existent-goal"));
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateObjectivesAndObservations()
    {
        using var context = CreateContext();
        var repo = new GoalRepository(context);

        var goal = new Goal
        {
            Id = "goal-1",
            GoalName = "Original Goal",
            StudentId = "student-1",
            Objectives = [new Objective { ObjectiveName = "Obj 1", Complete = false }],
            Observations = [new Observation { ObservationDate = DateTime.Today, SuccessCount = 1, TotalCount = 5 }]
        };
        await repo.AddAsync(goal);

        var updated = new Goal
        {
            Id = "goal-1",
            GoalName = "Updated Goal Name",
            StudentId = "student-1",
            Objectives =
            [
                new Objective { ObjectiveName = "Obj 1", Complete = true },
                new Objective { ObjectiveName = "Obj 2", Complete = false }
            ],
            Observations =
            [
                new Observation { ObservationDate = DateTime.Today, SuccessCount = 1, TotalCount = 5 },
                new Observation { ObservationDate = DateTime.Today.AddDays(1), SuccessCount = 3, TotalCount = 5 }
            ]
        };

        await repo.UpdateAsync(updated);

        var retrieved = await repo.GetByIdAsync("goal-1");
        Assert.Equal("Updated Goal Name", retrieved.GoalName);
        Assert.Equal(2, retrieved.Objectives.Count);
        Assert.Equal(2, retrieved.Observations.Count);
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemoveGoal()
    {
        using var context = CreateContext();
        var repo = new GoalRepository(context);

        var goal = new Goal { Id = "goal-del", GoalName = "To Delete", StudentId = "s1" };
        await repo.AddAsync(goal);

        await repo.DeleteAsync(goal);

        await Assert.ThrowsAsync<EntityNotFoundException>(() => repo.GetByIdAsync("goal-del"));
    }
}

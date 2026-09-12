using System;
using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using CloudIEP.Domain.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CloudIEP.Data.UnitTests;

public class GoalServiceTests
{
    private CloudIEPDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<CloudIEPDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new CloudIEPDbContext(options);
    }

    [Fact]
    public async Task CreateGoalAsync_WhenStudentExists_ShouldCreateGoalAndAddPreviewToStudent()
    {
        await using var context = CreateContext();
        var student = new Student { Id = "student-1", FirstName = "John", LastName = "Doe" };
        context.Students.Add(student);
        await context.SaveChangesAsync();

        var service = new GoalService(context);

        var goal = new Goal
        {
            StudentId = "student-1",
            GoalName = "Math Addition",
            Category = "Math"
        };

        var created = await service.CreateGoalAsync(goal);

        Assert.NotNull(created);
        Assert.False(string.IsNullOrWhiteSpace(created.Id));
        Assert.Equal("Math Addition", created.GoalName);

        var studentInDb = await context.Students.FindAsync("student-1");
        Assert.NotNull(studentInDb);
        Assert.Single(studentInDb.Goals);
        Assert.Equal(created.Id, studentInDb.Goals[0].GoalId);
        Assert.Equal("Math Addition", studentInDb.Goals[0].GoalName);
    }

    [Fact]
    public async Task CreateGoalAsync_WhenStudentDoesNotExist_ShouldThrowEntityNotFoundException()
    {
        await using var context = CreateContext();
        var service = new GoalService(context);

        var goal = new Goal { StudentId = "non-existent-student", GoalName = "Goal" };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => service.CreateGoalAsync(goal));
    }

    [Fact]
    public async Task CreateGoalAsync_WhenStudentIdEmpty_ShouldThrowArgumentException()
    {
        await using var context = CreateContext();
        var service = new GoalService(context);

        var goal = new Goal { StudentId = "", GoalName = "Goal" };

        await Assert.ThrowsAsync<ArgumentException>(() => service.CreateGoalAsync(goal));
    }

    [Fact]
    public async Task GetGoalByIdAsync_WhenExists_ShouldReturnGoal()
    {
        await using var context = CreateContext();
        var goal = new Goal { Id = "g1", GoalName = "Reading Comprehension", StudentId = "s1" };
        context.Goals.Add(goal);
        await context.SaveChangesAsync();

        var service = new GoalService(context);
        var result = await service.GetGoalByIdAsync("g1");

        Assert.NotNull(result);
        Assert.Equal("g1", result.Id);
        Assert.Equal("Reading Comprehension", result.GoalName);
    }

    [Fact]
    public async Task GetGoalByIdAsync_WhenNotFound_ShouldThrowEntityNotFoundException()
    {
        await using var context = CreateContext();
        var service = new GoalService(context);

        await Assert.ThrowsAsync<EntityNotFoundException>(() => service.GetGoalByIdAsync("invalid-goal"));
    }

    [Fact]
    public async Task UpdateGoalAsync_ShouldUpdateGoalAndSyncStudentPreview()
    {
        await using var context = CreateContext();
        var student = new Student
        {
            Id = "student-1",
            FirstName = "Jane",
            LastName = "Doe",
            Goals = [new GoalPreview { GoalId = "g1", GoalName = "Old Goal" }]
        };
        var goal = new Goal { Id = "g1", GoalName = "Old Goal", StudentId = "student-1" };
        context.Students.Add(student);
        context.Goals.Add(goal);
        await context.SaveChangesAsync();

        var service = new GoalService(context);

        var updatedGoal = new Goal
        {
            Id = "g1",
            StudentId = "student-1",
            GoalName = "Updated Goal Name",
            Objectives = [new Objective { ObjectiveName = "Obj 1", Complete = true }],
            Observations = [new Observation { ObservationDate = DateTime.Today, SuccessCount = 5, TotalCount = 10 }]
        };

        await service.UpdateGoalAsync(updatedGoal);

        var goalInDb = await context.Goals.FindAsync("g1");
        Assert.NotNull(goalInDb);
        Assert.Equal("Updated Goal Name", goalInDb.GoalName);
        Assert.Single(goalInDb.Objectives);
        Assert.Single(goalInDb.Observations);

        var studentInDb = await context.Students.FindAsync("student-1");
        Assert.NotNull(studentInDb);
        Assert.Single(studentInDb.Goals);
        Assert.Equal("Updated Goal Name", studentInDb.Goals[0].GoalName);
    }

    [Fact]
    public async Task DeleteGoalAsync_ShouldRemoveGoalAndSyncStudentPreview()
    {
        await using var context = CreateContext();
        var student = new Student
        {
            Id = "student-1",
            FirstName = "Jane",
            LastName = "Doe",
            Goals = [new GoalPreview { GoalId = "g1", GoalName = "To Delete" }]
        };
        var goal = new Goal { Id = "g1", GoalName = "To Delete", StudentId = "student-1" };
        context.Students.Add(student);
        context.Goals.Add(goal);
        await context.SaveChangesAsync();

        var service = new GoalService(context);
        await service.DeleteGoalAsync("g1");

        var goalInDb = await context.Goals.FindAsync("g1");
        Assert.Null(goalInDb);

        var studentInDb = await context.Students.FindAsync("student-1");
        Assert.NotNull(studentInDb);
        Assert.Empty(studentInDb.Goals);
    }

    [Fact]
    public async Task AddObservationAsync_ShouldAppendObservationToGoal()
    {
        await using var context = CreateContext();
        var goal = new Goal { Id = "g1", GoalName = "Goal with Obs", StudentId = "s1" };
        context.Goals.Add(goal);
        await context.SaveChangesAsync();

        var service = new GoalService(context);
        var obs = new Observation { ObservationDate = DateTime.Today, SuccessCount = 4, TotalCount = 5 };

        await service.AddObservationAsync("g1", obs);

        var goalInDb = await context.Goals.FindAsync("g1");
        Assert.NotNull(goalInDb);
        Assert.Single(goalInDb.Observations);
        Assert.Equal(4, goalInDb.Observations[0].SuccessCount);
    }
}

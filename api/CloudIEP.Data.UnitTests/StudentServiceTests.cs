using System;
using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using CloudIEP.Domain.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CloudIEP.Data.UnitTests;

public class StudentServiceTests
{
    private CloudIEPDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<CloudIEPDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new CloudIEPDbContext(options);
    }

    [Fact]
    public async Task CreateStudentAsync_WhenTeacherExists_ShouldCreateStudentAndAddPreviewToTeacher()
    {
        await using var context = CreateContext();
        var teacher = new User { Id = "teacher-1", Auth0Id = "teacher-1", FirstName = "Teach", LastName = "Er" };
        context.Users.Add(teacher);
        await context.SaveChangesAsync();

        var service = new StudentService(context);

        var student = new Student
        {
            FirstName = "Alice",
            LastName = "Johnson",
            DateOfBirth = new DateTime(2015, 1, 1)
        };

        var created = await service.CreateStudentAsync(student, "teacher-1");

        Assert.NotNull(created);
        Assert.False(string.IsNullOrWhiteSpace(created.Id));
        Assert.Equal("teacher-1", created.TeacherId);

        var teacherInDb = await context.Users.FindAsync("teacher-1");
        Assert.NotNull(teacherInDb);
        Assert.Single(teacherInDb.Students);
        Assert.Equal(created.Id, teacherInDb.Students[0].Id);
        Assert.Equal("Alice Johnson", teacherInDb.Students[0].FullName);
    }

    [Fact]
    public async Task CreateStudentAsync_WhenTeacherDoesNotExist_ShouldThrowEntityNotFoundException()
    {
        await using var context = CreateContext();
        var service = new StudentService(context);

        var student = new Student { FirstName = "Bob", LastName = "Builder" };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => service.CreateStudentAsync(student, "non-existent-teacher"));
    }

    [Fact]
    public async Task GetStudentByIdAsync_WhenExists_ShouldReturnStudent()
    {
        await using var context = CreateContext();
        var student = new Student { Id = "student-1", FirstName = "Charlie", LastName = "Brown" };
        context.Students.Add(student);
        await context.SaveChangesAsync();

        var service = new StudentService(context);
        var result = await service.GetStudentByIdAsync("student-1");

        Assert.NotNull(result);
        Assert.Equal("Charlie", result.FirstName);
    }

    [Fact]
    public async Task GetStudentByIdAsync_WhenNotFound_ShouldThrowEntityNotFoundException()
    {
        await using var context = CreateContext();
        var service = new StudentService(context);

        await Assert.ThrowsAsync<EntityNotFoundException>(() => service.GetStudentByIdAsync("invalid-id"));
    }

    [Fact]
    public async Task GetAllStudentsAsync_ShouldReturnAll()
    {
        await using var context = CreateContext();
        context.Students.AddRange(
            new Student { Id = "s1", FirstName = "One" },
            new Student { Id = "s2", FirstName = "Two" }
        );
        await context.SaveChangesAsync();

        var service = new StudentService(context);
        var all = await service.GetAllStudentsAsync();

        Assert.Equal(2, all.Length);
    }

    [Fact]
    public async Task UpdateStudentAsync_ShouldUpdateStudentAndSyncTeacherPreview()
    {
        await using var context = CreateContext();
        var teacher = new User
        {
            Id = "teacher-1",
            Auth0Id = "teacher-1",
            Students = [new StudentPreview { Id = "s1", FullName = "Old Name" }]
        };
        var student = new Student { Id = "s1", FirstName = "Old", LastName = "Name", TeacherId = "teacher-1" };
        context.Users.Add(teacher);
        context.Students.Add(student);
        await context.SaveChangesAsync();

        var service = new StudentService(context);

        var updatedStudent = new Student
        {
            Id = "s1",
            FirstName = "New",
            LastName = "Name",
            TeacherId = "teacher-1",
            Goals = [new GoalPreview { GoalId = "g1", GoalName = "Goal 1" }]
        };

        await service.UpdateStudentAsync(updatedStudent, "teacher-1");

        var studentInDb = await context.Students.FindAsync("s1");
        Assert.NotNull(studentInDb);
        Assert.Equal("New", studentInDb.FirstName);
        Assert.Single(studentInDb.Goals);

        var teacherInDb = await context.Users.FindAsync("teacher-1");
        Assert.NotNull(teacherInDb);
        Assert.Single(teacherInDb.Students);
        Assert.Equal("New Name", teacherInDb.Students[0].FullName);
    }

    [Fact]
    public async Task DeleteStudentAsync_ShouldRemoveStudentAndSyncTeacherPreview()
    {
        await using var context = CreateContext();
        var teacher = new User
        {
            Id = "teacher-1",
            Auth0Id = "teacher-1",
            Students = [new StudentPreview { Id = "s1", FullName = "To Delete" }]
        };
        var student = new Student { Id = "s1", FirstName = "To", LastName = "Delete", TeacherId = "teacher-1" };
        context.Users.Add(teacher);
        context.Students.Add(student);
        await context.SaveChangesAsync();

        var service = new StudentService(context);
        await service.DeleteStudentAsync("s1", "teacher-1");

        var studentInDb = await context.Students.FindAsync("s1");
        Assert.Null(studentInDb);

        var teacherInDb = await context.Users.FindAsync("teacher-1");
        Assert.NotNull(teacherInDb);
        Assert.Empty(teacherInDb.Students);
    }
}

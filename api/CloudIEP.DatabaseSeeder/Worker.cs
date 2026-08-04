using CloudIEP.Data;
using CloudIEP.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace CloudIEP.DatabaseSeeder;

public class Worker(
    ILogger<Worker> logger,
    IServiceScopeFactory serviceScopeFactory,
    IHostApplicationLifetime hostApplicationLifetime) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var context = serviceScopeFactory.CreateScope().ServiceProvider.GetRequiredService<CloudIEPDbContext>();

        await context.Database.EnsureCreatedAsync(stoppingToken);

        // Set up students and goals
        var studentCount = await context.Students.CountAsync(stoppingToken);
        var goalCount = await context.Goals.CountAsync(stoppingToken);

        if (studentCount == 0 && goalCount == 0)
        {
            logger.LogInformation("Seeding students and goals...");

            var student1Id = Guid.NewGuid().ToString();
            var student2Id = Guid.NewGuid().ToString();

            var goal1Id = Guid.NewGuid().ToString();
            var goal2Id = Guid.NewGuid().ToString();
            var goal3Id = Guid.NewGuid().ToString();

            var student1 = new Student
            {
                Id = student1Id,
                FirstName = "John",
                LastName = "Doe",
                DateOfBirth = new DateTime(2012, 5, 14),
                TeacherId = "test-teacher-1",
                Goals =
                [
                    new GoalPreview
                    {
                        GoalId = goal1Id,
                        GoalName = "Math: Double Digit Addition"
                    },
                    new GoalPreview
                    {
                        GoalId = goal2Id,
                        GoalName = "Reading: Main Idea & Key Details"
                    }
                ]
            };

            var student2 = new Student
            {
                Id = student2Id,
                FirstName = "Jane",
                LastName = "Smith",
                DateOfBirth = new DateTime(2013, 9, 20),
                TeacherId = "test-teacher-1",
                Goals =
                [
                    new GoalPreview
                    {
                        GoalId = goal3Id,
                        GoalName = "Behavior: Self-Regulation During Transitions"
                    }
                ]
            };

            var goal1 = new Goal
            {
                Id = goal1Id,
                StudentId = student1Id,
                GoalName = "Math: Double Digit Addition",
                GoalDescription =
                    "Student will correctly add two 2-digit numbers with and without regrouping in 4 out of 5 trials.",
                Category = "Mathematics",
                BeginDate = new DateTime(2026, 5, 1),
                EndDate = new DateTime(2026, 12, 31),
                GoalPercentage = 80,
                Objectives =
                [
                    new Objective { ObjectiveName = "Add two 2-digit numbers without regrouping", Complete = true },
                    new Objective { ObjectiveName = "Add two 2-digit numbers with regrouping", Complete = false }
                ],
                Observations =
                [
                    new Observation { ObservationDate = new DateTime(2026, 5, 5), SuccessCount = 3, TotalCount = 10 },
                    new Observation { ObservationDate = new DateTime(2026, 5, 12), SuccessCount = 5, TotalCount = 10 },
                    new Observation { ObservationDate = new DateTime(2026, 5, 19), SuccessCount = 6, TotalCount = 10 },
                    new Observation { ObservationDate = new DateTime(2026, 5, 26), SuccessCount = 8, TotalCount = 10 }
                ]
            };

            var goal2 = new Goal
            {
                Id = goal2Id,
                StudentId = student1Id,
                GoalName = "Reading: Main Idea & Key Details",
                GoalDescription =
                    "Student will identify the main idea and 2 supporting details from a grade-level passage with 75% accuracy.",
                Category = "Reading Comprehension",
                BeginDate = new DateTime(2026, 5, 1),
                EndDate = new DateTime(2026, 12, 31),
                GoalPercentage = 75,
                Objectives =
                [
                    new Objective { ObjectiveName = "Identify main idea in a 1-page passage", Complete = true },
                    new Objective { ObjectiveName = "Identify supporting details", Complete = false }
                ],
                Observations =
                [
                    new Observation { ObservationDate = new DateTime(2026, 5, 7), SuccessCount = 4, TotalCount = 8 },
                    new Observation { ObservationDate = new DateTime(2026, 5, 14), SuccessCount = 6, TotalCount = 8 },
                    new Observation { ObservationDate = new DateTime(2026, 5, 21), SuccessCount = 7, TotalCount = 8 }
                ]
            };

            var goal3 = new Goal
            {
                Id = goal3Id,
                StudentId = student2Id,
                GoalName = "Behavior: Self-Regulation During Transitions",
                GoalDescription =
                    "Student will transition between activities within 2 minutes using visual countdown cues in 9 out of 10 opportunities.",
                Category = "Behavior",
                BeginDate = new DateTime(2026, 6, 1),
                EndDate = new DateTime(2026, 12, 31),
                GoalPercentage = 90,
                Objectives =
                [
                    new Objective
                        { ObjectiveName = "Use 5-second countdown strategy before transition", Complete = true },
                    new Objective { ObjectiveName = "Transition to next activity independently", Complete = false }
                ],
                Observations =
                [
                    new Observation { ObservationDate = new DateTime(2026, 6, 5), SuccessCount = 2, TotalCount = 5 },
                    new Observation { ObservationDate = new DateTime(2026, 6, 12), SuccessCount = 4, TotalCount = 5 },
                    new Observation { ObservationDate = new DateTime(2026, 6, 19), SuccessCount = 5, TotalCount = 5 }
                ]
            };

            context.Students.AddRange(student1, student2);
            context.Goals.AddRange(goal1, goal2, goal3);

            await context.SaveChangesAsync(stoppingToken);
        }

        logger.LogInformation("Database seeding finished.");
        hostApplicationLifetime.StopApplication();
    }
}

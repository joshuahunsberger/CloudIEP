using CloudIEP.Data;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;

namespace CloudIEP.Domain.Services;

public interface IGoalService
{
    Task<Goal> GetGoalByIdAsync(string goalId);
    Task<Goal> CreateGoalAsync(Goal goal);
    Task UpdateGoalAsync(Goal goal);
    Task DeleteGoalAsync(string goalId);
    Task AddObservationAsync(string goalId, Observation observation);
}

public class GoalService : IGoalService
{
    private readonly CloudIEPDbContext _context;

    public GoalService(CloudIEPDbContext context)
    {
        _context = context;
    }

    public async Task<Goal> GetGoalByIdAsync(string goalId)
    {
        var goal = await _context.Goals.FindAsync(goalId);
        return goal ?? throw new EntityNotFoundException();
    }

    public async Task<Goal> CreateGoalAsync(Goal goal)
    {
        if (string.IsNullOrWhiteSpace(goal.StudentId))
        {
            throw new ArgumentException("Student must be set to create goal.", nameof(goal));
        }

        var student = await _context.Students.FindAsync(goal.StudentId);
        if (student == null)
        {
            throw new EntityNotFoundException("Student does not exist.");
        }

        if (string.IsNullOrWhiteSpace(goal.Id))
        {
            goal.Id = Guid.NewGuid().ToString();
        }

        _context.Goals.Add(goal);

        student.Goals.Add(new GoalPreview
        {
            GoalId = goal.Id,
            GoalName = goal.GoalName
        });

        await _context.SaveChangesAsync();
        return goal;
    }

    public async Task UpdateGoalAsync(Goal goal)
    {
        var existing = await _context.Goals.FindAsync(goal.Id);
        if (existing == null)
        {
            throw new EntityNotFoundException();
        }

        var student = await _context.Students.FindAsync(goal.StudentId);
        if (student == null)
        {
            throw new EntityNotFoundException("Student does not exist.");
        }

        _context.Entry(existing).CurrentValues.SetValues(goal);
        existing.Objectives = goal.Objectives;
        existing.Observations = goal.Observations;

        student.Goals = student.Goals.Where(g => g.GoalId != goal.Id).ToList();
        student.Goals.Add(new GoalPreview
        {
            GoalId = goal.Id,
            GoalName = goal.GoalName
        });

        await _context.SaveChangesAsync();
    }

    public async Task DeleteGoalAsync(string goalId)
    {
        var goal = await _context.Goals.FindAsync(goalId);
        if (goal == null)
        {
            throw new EntityNotFoundException();
        }

        var student = await _context.Students.FindAsync(goal.StudentId);
        student?.Goals = student.Goals.Where(g => g.GoalId != goalId).ToList();

        _context.Goals.Remove(goal);
        await _context.SaveChangesAsync();
    }

    public async Task AddObservationAsync(string goalId, Observation observation)
    {
        var goal = await _context.Goals.FindAsync(goalId);
        if (goal == null)
        {
            throw new EntityNotFoundException();
        }

        goal.Observations.Add(observation);
        await _context.SaveChangesAsync();
    }
}

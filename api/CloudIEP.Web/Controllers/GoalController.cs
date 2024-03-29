﻿using System.Linq;
using System.Threading.Tasks;
using CloudIEP.Data;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudIEP.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GoalController : Controller
{
    private readonly IGoalRepository _goalRepository;
    private readonly IStudentRepository _studentRepository;

    public GoalController(IGoalRepository goalRepository, IStudentRepository studentRepository)
    {
        _goalRepository = goalRepository;
        _studentRepository = studentRepository;
    }

    [HttpPost]
    public async Task<ActionResult<Goal>> CreateGoal(Goal goal)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        if (string.IsNullOrWhiteSpace(goal.StudentId))
        {
            return BadRequest("Student must be set to create goal.");
        }

        var student = await GetStudent(goal.StudentId);
        if (student == null) return BadRequest("Student does not exist.");

        var goalResponse = await _goalRepository.AddAsync(goal);
        await AddGoalToStudent(student, goal);

        return Ok(goalResponse);
    }

    [HttpGet("{goalId}")]
    public async Task<ActionResult<Goal>> GetGoal(string goalId)
    {
        try
        {
            var goal = await _goalRepository.GetByIdAsync(goalId);
            return Ok(goal);
        }
        catch (EntityNotFoundException)
        {
            return NotFound(goalId);
        }
    }

    [HttpPut("{goalId}")]
    public async Task<ActionResult> UpdateGoal(string goalId, Goal goal)
    {
        if (goal.Id != goalId)
        {
            return BadRequest(goal.Id);
        }

        var student = await GetStudent(goal.StudentId);
        if (student == null) return BadRequest("Student doesn't exist.");

        try
        {
            await _goalRepository.UpdateAsync(goal);
            await UpdateGoalForStudent(student, goal);

            return NoContent();
        }
        catch (EntityNotFoundException)
        {
            return NotFound(goalId);
        }
    }

    [HttpDelete("{goalId}")]
    public async Task<ActionResult> DeleteGoal(string goalId)
    {
        try
        {
            var goal = await _goalRepository.GetByIdAsync(goalId);
            var student = await GetStudent(goal.StudentId);
            await _goalRepository.DeleteAsync(goal);
            await RemoveGoalFromStudent(student, goalId);

            return NoContent();
        }
        catch (EntityNotFoundException)
        {
            return NotFound(goalId);
        }
    }

    [HttpPost("{goalId}/observation")]
    public async Task<ActionResult> AddObservation(string goalId, Observation observation)
    {
        try
        {
            var goal = await _goalRepository.GetByIdAsync(goalId);
            goal.Observations.Add(observation);
            await _goalRepository.UpdateAsync(goal);
            return NoContent();
        }
        catch (EntityNotFoundException)
        {
            return NotFound(goalId);
        }
    }

    private async Task<Student> GetStudent(string studentId)
    {
        try
        {
            return await _studentRepository.GetByIdAsync(studentId);
        }
        catch (EntityNotFoundException)
        {
            return null;
        }
    }

    private async Task AddGoalToStudent(Student student, Goal goal)
    {
        var goalPreview = new GoalPreview
        {
            GoalId = goal.Id,
            GoalName = goal.GoalName
        };
        student.Goals.Add(goalPreview);
        await _studentRepository.UpdateAsync(student);
    }

    private async Task UpdateGoalForStudent(Student student, Goal goal)
    {
        student.Goals = student.Goals.Where(g => g.GoalId != goal.Id).ToList();
        await AddGoalToStudent(student, goal);
    }

    private async Task RemoveGoalFromStudent(Student student, string goalId)
    {
        student.Goals = student.Goals.Where(g => g.GoalId != goalId).ToList();
        await _studentRepository.UpdateAsync(student);
    }
}

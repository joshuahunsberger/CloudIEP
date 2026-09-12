using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using CloudIEP.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudIEP.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GoalController : Controller
{
    private readonly IGoalService _goalService;

    public GoalController(IGoalService goalService)
    {
        _goalService = goalService;
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

        try
        {
            var goalResponse = await _goalService.CreateGoalAsync(goal);
            return Ok(goalResponse);
        }
        catch (EntityNotFoundException)
        {
            return BadRequest("Student does not exist.");
        }
    }

    [HttpGet("{goalId}")]
    public async Task<ActionResult<Goal>> GetGoal(string goalId)
    {
        try
        {
            var goal = await _goalService.GetGoalByIdAsync(goalId);
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

        try
        {
            await _goalService.UpdateGoalAsync(goal);
            return NoContent();
        }
        catch (EntityNotFoundException e)
        {
            if (e.Message == "Student does not exist.")
            {
                return BadRequest("Student doesn't exist.");
            }
            return NotFound(goalId);
        }
    }

    [HttpDelete("{goalId}")]
    public async Task<ActionResult> DeleteGoal(string goalId)
    {
        try
        {
            await _goalService.DeleteGoalAsync(goalId);
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
            await _goalService.AddObservationAsync(goalId, observation);
            return NoContent();
        }
        catch (EntityNotFoundException)
        {
            return NotFound(goalId);
        }
    }
}

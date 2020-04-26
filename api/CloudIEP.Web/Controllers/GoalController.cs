using System.Threading.Tasks;
using CloudIEP.Data;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudIEP.Web.Controllers
{
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
    }
}

using System.Linq;
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
    public class StudentController : Controller
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IUserRepository _userRepository;

        public StudentController(IStudentRepository studentRepository, IUserRepository userRepository)
        {
            _studentRepository = studentRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<ActionResult<Student>> CreateStudent(Student student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var user = await GetUser();
            if (user == null) return BadRequest("You need to create a user account first.");

            student.TeacherId = user.Id;

            var studentResponse = await _studentRepository.AddAsync(student);
            await AddStudentToUser(user, studentResponse);

            return Ok(studentResponse);
        }

        [HttpGet("{studentId}")]
        public async Task<ActionResult<Student>> GetStudent(string studentId)
        {
            try
            {
                var student = await _studentRepository.GetByIdAsync(studentId);
                return Ok(student);
            }
            catch (EntityNotFoundException)
            {
                return NotFound(studentId);
            }
        }

        [HttpGet]
        public async Task<ActionResult<Student[]>> GetStudents()
        {
            var students = await _studentRepository.GetAllAsync();
            return Ok(students);
        }

        [HttpPut("{studentId}")]
        public async Task<ActionResult> UpdateStudent(string studentId, Student student)
        {
            if (student.Id != studentId)
            {
                return BadRequest(student.Id);
            }

            var user = await GetUser();
            if (user == null) return BadRequest("You need to create a user account first.");

            try
            {
                if (studentId == null)
                {
                    return NotFound(studentId);
                }

                await _studentRepository.UpdateAsync(student);
                await UpdateStudentForUser(user, student);

                return NoContent();
            }
            catch (EntityNotFoundException)
            {
                return NotFound(studentId);
            }
        }

        [HttpDelete("{studentId}")]
        public async Task<ActionResult> DeleteStudent(string studentId)
        {
            try
            {
                var user = await GetUser();
                if (user == null) return BadRequest("You need to create a user account first.");

                var student = await _studentRepository.GetByIdAsync(studentId);

                await _studentRepository.DeleteAsync(student);
                await RemoveStudentFromUser(user, studentId);

                return NoContent();
            }
            catch (EntityNotFoundException)
            {
                return NotFound(studentId);
            }
        }

        private async Task<User> GetUser()
        {
            var userId = HttpContext.User.Identity.Name;
            try
            {
                return await _userRepository.GetByIdAsync(userId);
            }
            catch (EntityNotFoundException)
            {
                return null;
            }
        }

        private async Task AddStudentToUser(User user, Student student)
        {
            var studentPreview = new StudentPreview
            {
                Id = student.Id,
                FullName = $"{student.FirstName} {student.LastName}",
            };
            user.Students.Add(studentPreview);
            await _userRepository.UpdateAsync(user);
        }

        private async Task UpdateStudentForUser(User user, Student student)
        {
            user.Students = user.Students.Where(s => s.Id != student.Id).ToList();
            await AddStudentToUser(user, student);
        }

        private async Task RemoveStudentFromUser(User user, string studentId)
        {
            user.Students = user.Students.Where(s => s.Id != studentId).ToList();
            await _userRepository.UpdateAsync(user);
        }
    }
}

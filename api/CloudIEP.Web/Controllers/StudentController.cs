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

        public StudentController(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        [HttpPost]
        public async Task<ActionResult<Student>> CreateStudent(Student student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var studentResponse = await _studentRepository.AddAsync(student);
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

            try
            {
                if (studentId == null)
                {
                    return NotFound(studentId);
                }

                await _studentRepository.UpdateAsync(student);
                return Ok();
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
                var student = await _studentRepository.GetByIdAsync(studentId);

                await _studentRepository.DeleteAsync(student);

                return NoContent();
            }
            catch (EntityNotFoundException)
            {
                return NotFound(studentId);
            }
        }
    }
}

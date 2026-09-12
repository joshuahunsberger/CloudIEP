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
public class StudentController : Controller
{
    private readonly IStudentService _studentService;

    public StudentController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpPost]
    public async Task<ActionResult<Student>> CreateStudent(Student student)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var userId = HttpContext.User.Identity?.Name;
        try
        {
            var studentResponse = await _studentService.CreateStudentAsync(student, userId);
            return Ok(studentResponse);
        }
        catch (EntityNotFoundException)
        {
            return BadRequest("You need to create a user account first.");
        }
    }

    [HttpGet("{studentId}")]
    public async Task<ActionResult<Student>> GetStudent(string studentId)
    {
        try
        {
            var student = await _studentService.GetStudentByIdAsync(studentId);
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
        var students = await _studentService.GetAllStudentsAsync();
        return Ok(students);
    }

    [HttpPut("{studentId}")]
    public async Task<ActionResult> UpdateStudent(string studentId, Student student)
    {
        if (student.Id != studentId)
        {
            return BadRequest(student.Id);
        }

        var userId = HttpContext.User.Identity?.Name;
        try
        {
            await _studentService.UpdateStudentAsync(student, userId);
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
        var userId = HttpContext.User.Identity?.Name;
        try
        {
            await _studentService.DeleteStudentAsync(studentId, userId);
            return NoContent();
        }
        catch (EntityNotFoundException)
        {
            return NotFound(studentId);
        }
    }
}

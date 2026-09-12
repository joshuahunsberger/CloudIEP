using CloudIEP.Data;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace CloudIEP.Domain.Services;

public interface IStudentService
{
    Task<Student[]> GetAllStudentsAsync();
    Task<Student> GetStudentByIdAsync(string studentId);
    Task<Student> CreateStudentAsync(Student student, string teacherId);
    Task UpdateStudentAsync(Student student, string teacherId);
    Task DeleteStudentAsync(string studentId, string teacherId);
}

public class StudentService : IStudentService
{
    private readonly CloudIEPDbContext _context;

    public StudentService(CloudIEPDbContext context)
    {
        _context = context;
    }

    public async Task<Student[]> GetAllStudentsAsync()
    {
        return await _context.Students.ToArrayAsync();
    }

    public async Task<Student> GetStudentByIdAsync(string studentId)
    {
        var student = await _context.Students.FindAsync(studentId);
        return student ?? throw new EntityNotFoundException();
    }

    public async Task<Student> CreateStudentAsync(Student student, string teacherId)
    {
        var user = await _context.Users.FindAsync(teacherId);
        if (user == null)
        {
            throw new EntityNotFoundException("Teacher account does not exist.");
        }

        if (string.IsNullOrWhiteSpace(student.Id))
        {
            student.Id = Guid.NewGuid().ToString();
        }
        student.TeacherId = teacherId;

        _context.Students.Add(student);

        user.Students.Add(new StudentPreview
        {
            Id = student.Id,
            FullName = $"{student.FirstName} {student.LastName}"
        });

        await _context.SaveChangesAsync();
        return student;
    }

    public async Task UpdateStudentAsync(Student student, string teacherId)
    {
        var existing = await _context.Students.FindAsync(student.Id);
        if (existing == null)
        {
            throw new EntityNotFoundException();
        }

        var user = await _context.Users.FindAsync(teacherId);
        if (user == null)
        {
            throw new EntityNotFoundException("Teacher account does not exist.");
        }

        _context.Entry(existing).CurrentValues.SetValues(student);
        existing.Goals = student.Goals;

        user.Students = user.Students.Where(s => s.Id != student.Id).ToList();
        user.Students.Add(new StudentPreview
        {
            Id = student.Id,
            FullName = $"{student.FirstName} {student.LastName}"
        });

        await _context.SaveChangesAsync();
    }

    public async Task DeleteStudentAsync(string studentId, string teacherId)
    {
        var student = await _context.Students.FindAsync(studentId);
        if (student == null)
        {
            throw new EntityNotFoundException();
        }

        var user = await _context.Users.FindAsync(teacherId);
        if (user == null)
        {
            throw new EntityNotFoundException("Teacher account does not exist.");
        }

        _context.Students.Remove(student);
        user.Students = user.Students.Where(s => s.Id != studentId).ToList();

        await _context.SaveChangesAsync();
    }
}

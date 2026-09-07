using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;

namespace CloudIEP.Data;

public interface IStudentRepository : IRepository<Student>
{
}

public class StudentRepository : EfRepository<Student>, IStudentRepository
{
    public StudentRepository(CloudIEPDbContext context) : base(context) { }

    public override async Task UpdateAsync(Student entity)
    {
        var existing = await DbSet.FindAsync(entity.Id);
        if (existing == null)
        {
            throw new EntityNotFoundException();
        }

        Context.Entry(existing).CurrentValues.SetValues(entity);
        existing.Goals = entity.Goals;
        await Context.SaveChangesAsync();
    }
}

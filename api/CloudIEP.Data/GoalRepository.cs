using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;

namespace CloudIEP.Data;

public interface IGoalRepository : IRepository<Goal>
{
}

public class GoalRepository : EfRepository<Goal>, IGoalRepository
{
    public GoalRepository(CloudIEPDbContext context) : base(context) { }

    public override async Task UpdateAsync(Goal entity)
    {
        var existing = await DbSet.FindAsync(entity.Id);
        if (existing == null)
        {
            throw new EntityNotFoundException();
        }

        Context.Entry(existing).CurrentValues.SetValues(entity);
        existing.Objectives = entity.Objectives;
        existing.Observations = entity.Observations;
        await Context.SaveChangesAsync();
    }
}

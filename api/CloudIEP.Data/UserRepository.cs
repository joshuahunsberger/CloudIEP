using System.Threading.Tasks;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;

namespace CloudIEP.Data;

public interface IUserRepository : IRepository<User>
{
}

public class UserRepository : EfRepository<User>, IUserRepository
{
    public UserRepository(CloudIEPDbContext context) : base(context) { }

    protected override string GenerateId(User entity) => entity.Auth0Id;

    public override async Task UpdateAsync(User entity)
    {
        var existing = await DbSet.FindAsync(entity.Id);
        if (existing == null)
        {
            throw new EntityNotFoundException();
        }

        Context.Entry(existing).CurrentValues.SetValues(entity);
        existing.Students = entity.Students;
        await Context.SaveChangesAsync();
    }
}

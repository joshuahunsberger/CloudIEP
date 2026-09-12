using CloudIEP.Data;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;

namespace CloudIEP.Domain.Services;

public interface IUserService
{
    Task<User> GetOrCreateUserFromTokenAsync(string auth0Id);
    Task UpdateFirstNameAsync(string userId, string firstName);
    Task UpdateLastNameAsync(string userId, string lastName);
}

public class UserService : IUserService
{
    private readonly CloudIEPDbContext _context;

    public UserService(CloudIEPDbContext context)
    {
        _context = context;
    }

    public async Task<User> GetOrCreateUserFromTokenAsync(string auth0Id)
    {
        var existing = await _context.Users.FindAsync(auth0Id);
        if (existing != null)
        {
            return existing;
        }

        var user = new User
        {
            Id = auth0Id,
            Auth0Id = auth0Id
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task UpdateFirstNameAsync(string userId, string firstName)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new EntityNotFoundException();
        }

        user.FirstName = firstName;
        await _context.SaveChangesAsync();
    }

    public async Task UpdateLastNameAsync(string userId, string lastName)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new EntityNotFoundException();
        }

        user.LastName = lastName;
        await _context.SaveChangesAsync();
    }
}

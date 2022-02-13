using System.Threading.Tasks;
using CloudIEP.Data;
using CloudIEP.Data.Exceptions;
using CloudIEP.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudIEP.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : Controller
{
    private readonly IUserRepository _userRepository;

    public UserController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUserFromToken()
    {
        var userId = HttpContext.User.Identity.Name;
        try
        {
            var existingUser = await _userRepository.GetByIdAsync(userId);
            return Ok(existingUser);
        }
        catch (EntityNotFoundException)
        {
            var user = new User { Auth0Id = userId };
            var userResponse = await _userRepository.AddAsync(user);
            return Ok(userResponse);
        }

    }

    [HttpPost("FirstName")]
    public async Task<ActionResult> UpdateFirstName([FromBody] string firstName)
    {
        var userId = HttpContext.User.Identity.Name;

        try
        {
            var user = await _userRepository.GetByIdAsync(userId);
            user.FirstName = firstName;
            await _userRepository.UpdateAsync(user);
            return NoContent();
        }
        catch (EntityNotFoundException)
        {
            return NotFound(userId);
        }
    }

    [HttpPost("LastName")]
    public async Task<ActionResult> UpdateLastName([FromBody] string lastName)
    {
        var userId = HttpContext.User.Identity.Name;

        try
        {
            var user = await _userRepository.GetByIdAsync(userId);
            user.LastName = lastName;
            await _userRepository.UpdateAsync(user);
            return NoContent();
        }
        catch (EntityNotFoundException)
        {
            return NotFound(userId);
        }
    }
}

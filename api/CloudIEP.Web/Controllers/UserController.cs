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
public class UserController : Controller
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUserFromToken()
    {
        var userId = HttpContext.User.Identity?.Name;
        var user = await _userService.GetOrCreateUserFromTokenAsync(userId);
        return Ok(user);
    }

    [HttpPost("FirstName")]
    public async Task<ActionResult> UpdateFirstName([FromBody] string firstName)
    {
        var userId = HttpContext.User.Identity?.Name;

        try
        {
            await _userService.UpdateFirstNameAsync(userId, firstName);
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
        var userId = HttpContext.User.Identity?.Name;

        try
        {
            await _userService.UpdateLastNameAsync(userId, lastName);
            return NoContent();
        }
        catch (EntityNotFoundException)
        {
            return NotFound(userId);
        }
    }
}

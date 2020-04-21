﻿using System.Threading.Tasks;
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
    }
}
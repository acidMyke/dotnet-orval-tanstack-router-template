using System.Security.Claims;
using DotnetOrvalTemplate.Api.Data;
using DotnetOrvalTemplate.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DotnetOrvalTemplate.Api.Features.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    AppDbContext dbContext,
    IPasswordHasher passwordHasher,
    JwtTokenService jwtTokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Username and password are required.");
        }

        var normalizedUsername = request.Username.Trim().ToLowerInvariant();

        var exists = await dbContext.Users.AnyAsync(x => x.Username == normalizedUsername);
        if (exists)
        {
            return Conflict("Username already exists.");
        }

        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            Username = normalizedUsername,
            PasswordHash = passwordHasher.HashPassword(request.Password),
            IsGuest = false
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return Ok(ToAuthResponse(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Username and password are required.");
        }

        var normalizedUsername = request.Username.Trim().ToLowerInvariant();
        var user = await dbContext.Users.SingleOrDefaultAsync(x => x.Username == normalizedUsername);

        if (user is null || !passwordHasher.VerifyPassword(user.PasswordHash, request.Password))
        {
            return Unauthorized("Invalid credentials.");
        }

        return Ok(ToAuthResponse(user));
    }

    [HttpPost("guest")]
    public async Task<ActionResult<AuthResponse>> GuestLogin()
    {
        var guestName = $"guest-{Guid.NewGuid():N}";
        var guestUser = new AppUser
        {
            Id = Guid.NewGuid(),
            Username = guestName,
            PasswordHash = passwordHasher.HashPassword(Guid.NewGuid().ToString("N")),
            IsGuest = true
        };

        dbContext.Users.Add(guestUser);
        await dbContext.SaveChangesAsync();

        return Ok(ToAuthResponse(guestUser));
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<MeResponse> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub") ?? string.Empty;
        var username = User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue("unique_name") ?? string.Empty;
        var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        return Ok(new MeResponse(userId, username, role));
    }

    private AuthResponse ToAuthResponse(AppUser user)
    {
        var token = jwtTokenService.CreateToken(user);
        return new AuthResponse(token, user.Username, user.IsGuest ? "guest" : "user");
    }
}

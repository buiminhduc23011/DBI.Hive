using Microsoft.AspNetCore.Mvc;
using DBI.Task.Application.Services;
using DBI.Task.Application.DTOs;

namespace DBI.Task.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async System.Threading.Tasks.Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        if (result == null)
            return BadRequest(new { message = "User already exists" });

        return Ok(result);
    }

    [HttpPost("login")]
    public async System.Threading.Tasks.Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        if (result == null)
            return Unauthorized(new { message = "Invalid credentials" });

        return Ok(result);
    }

    [HttpPost("refresh-token")]
    public async System.Threading.Tasks.Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var result = await _authService.RefreshTokenAsync(request.RefreshToken);
        if (result == null)
            return Unauthorized(new { message = "Invalid or expired refresh token" });

        return Ok(result);
    }

    [HttpPost("revoke-token")]
    public async System.Threading.Tasks.Task<IActionResult> RevokeToken([FromBody] RefreshTokenRequest request)
    {
        var result = await _authService.RevokeTokenAsync(request.RefreshToken);
        if (!result)
            return BadRequest(new { message = "Invalid refresh token" });

        return Ok(new { message = "Token revoked successfully" });
    }
}

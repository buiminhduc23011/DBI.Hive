using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DBI.Task.Application.Services;
using System.Security.Claims;

namespace DBI.Task.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async System.Threading.Tasks.Task<IActionResult> GetDashboard([FromQuery] bool myTasksOnly = false)
    {
        // Always get current user to filter by their projects
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";

        var dashboard = await _dashboardService.GetDashboardDataAsync(userId, myTasksOnly);
        return Ok(dashboard);
    }
}

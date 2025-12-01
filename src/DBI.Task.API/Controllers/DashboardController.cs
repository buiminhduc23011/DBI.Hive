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
        int? userId = null;
        if (myTasksOnly)
        {
            userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        var dashboard = await _dashboardService.GetDashboardDataAsync(userId);
        return Ok(dashboard);
    }
}

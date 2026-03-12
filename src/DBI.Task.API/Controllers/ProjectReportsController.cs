using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DBI.Task.Application.Services;
using DBI.Task.Application.DTOs;
using System.Security.Claims;

namespace DBI.Task.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProjectReportsController : ControllerBase
{
    private readonly IProjectReportService _reportService;

    public ProjectReportsController(IProjectReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("{projectId}")]
    public async System.Threading.Tasks.Task<IActionResult> GetReports(string projectId)
    {
        var reports = await _reportService.GetProjectReportsAsync(projectId);
        return Ok(reports);
    }

    [HttpGet("{projectId}/latest")]
    public async System.Threading.Tasks.Task<IActionResult> GetLatestReport(string projectId)
    {
        var report = await _reportService.GetLatestProjectReportAsync(projectId);
        if (report == null) return NotFound();
        return Ok(report);
    }

    [HttpPost]
    public async System.Threading.Tasks.Task<IActionResult> CreateReport([FromBody] CreateProjectReportRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        
        try 
        {
            var report = await _reportService.CreateProjectReportAsync(request, userId);
            return CreatedAtAction(nameof(GetLatestReport), new { projectId = request.ProjectId }, report);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

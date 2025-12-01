using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DBI.Task.Infrastructure.Data;
using DBI.Task.Infrastructure.Repositories;
using DBI.Task.Domain.Entities;
using DBI.Task.Application.DTOs;
using System.Security.Claims;

namespace DBI.Task.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly DBITaskDbContext _context;
    private readonly IRepository<Project> _projectRepository;

    public ProjectsController(DBITaskDbContext context, IRepository<Project> projectRepository)
    {
        _context = context;
        _projectRepository = projectRepository;
    }

    [HttpGet]
    public async System.Threading.Tasks.Task<IActionResult> GetProjects([FromQuery] bool includeArchived = false)
    {
        var query = _context.Projects.AsQueryable();
        
        if (!includeArchived)
            query = query.Where(p => !p.IsArchived);

        var projects = await query
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Color = p.Color,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                IsArchived = p.IsArchived,
                TaskCount = p.Tasks.Count,
                CompletedTaskCount = p.Tasks.Count(t => t.Status == Domain.Enums.TaskItemStatus.Done)
            })
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> GetProject(int id)
    {
        var project = await _context.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null)
            return NotFound();

        var dto = new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            Color = project.Color,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt,
            IsArchived = project.IsArchived,
            TaskCount = project.Tasks.Count,
            CompletedTaskCount = project.Tasks.Count(t => t.Status == Domain.Enums.TaskItemStatus.Done)
        };

        return Ok(dto);
    }

    [HttpPost]
    public async System.Threading.Tasks.Task<IActionResult> CreateProject([FromBody] CreateProjectRequest request)
    {
        var project = new Project
        {
            Name = request.Name,
            Description = request.Description,
            Color = request.Color ?? "#1e40af",
            CreatedAt = DateTime.UtcNow
        };

        project = await _projectRepository.AddAsync(project);

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        await _context.ActivityLogs.AddAsync(new ActivityLog
        {
            Action = "created",
            EntityType = "Project",
            EntityId = project.Id,
            Description = $"Created project: {project.Name}",
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
    }

    [HttpPut("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> UpdateProject(int id, [FromBody] UpdateProjectRequest request)
    {
        var project = await _projectRepository.GetByIdAsync(id);
        if (project == null)
            return NotFound();

        if (request.Name != null)
            project.Name = request.Name;
        if (request.Description != null)
            project.Description = request.Description;
        if (request.Color != null)
            project.Color = request.Color;
        if (request.IsArchived.HasValue)
            project.IsArchived = request.IsArchived.Value;

        project.UpdatedAt = DateTime.UtcNow;
        await _projectRepository.UpdateAsync(project);

        return Ok(project);
    }

    [HttpDelete("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> DeleteProject(int id)
    {
        var project = await _projectRepository.GetByIdAsync(id);
        if (project == null)
            return NotFound();

        await _projectRepository.DeleteAsync(project);
        return NoContent();
    }
}

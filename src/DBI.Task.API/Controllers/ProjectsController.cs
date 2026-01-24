using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
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
    private readonly IMongoDbContext _context;
    private readonly IRepository<Project> _projectRepository;

    public ProjectsController(IMongoDbContext context, IRepository<Project> projectRepository)
    {
        _context = context;
        _projectRepository = projectRepository;
    }

    [HttpGet]
    public async System.Threading.Tasks.Task<IActionResult> GetProjects([FromQuery] bool includeArchived = false)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        
        var filterBuilder = Builders<Project>.Filter;
        var userFilter = filterBuilder.Or(
            filterBuilder.Eq(p => p.OwnerId, userId),
            filterBuilder.AnyEq(p => p.MemberIds, userId),
            filterBuilder.Eq(p => p.OwnerId, "") // Include legacy projects without owner
        );
        
        var filter = includeArchived 
            ? userFilter
            : filterBuilder.And(userFilter, filterBuilder.Eq(p => p.IsArchived, false));

        var projects = await _context.Projects.Find(filter).ToListAsync();
        
        var projectDtos = new List<ProjectDto>();
        foreach (var p in projects)
        {
            var taskCount = await _context.Tasks.CountDocumentsAsync(t => t.ProjectId == p.Id);
            var completedCount = await _context.Tasks.CountDocumentsAsync(
                t => t.ProjectId == p.Id && t.Status == Domain.Enums.TaskItemStatus.Done);

            projectDtos.Add(new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Color = p.Color,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                IsArchived = p.IsArchived,
                TaskCount = (int)taskCount,
                CompletedTaskCount = (int)completedCount,
                OwnerId = p.OwnerId,
                MemberIds = p.MemberIds
            });
        }

        return Ok(projectDtos);
    }

    [HttpGet("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> GetProject(string id)
    {
        var project = await _projectRepository.GetByIdAsync(id);
        if (project == null)
            return NotFound();

        var taskCount = await _context.Tasks.CountDocumentsAsync(t => t.ProjectId == id);
        var completedCount = await _context.Tasks.CountDocumentsAsync(
            t => t.ProjectId == id && t.Status == Domain.Enums.TaskItemStatus.Done);

        var dto = new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            Color = project.Color,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt,
            IsArchived = project.IsArchived,
            TaskCount = (int)taskCount,
            CompletedTaskCount = (int)completedCount,
            OwnerId = project.OwnerId,
            MemberIds = project.MemberIds
        };

        return Ok(dto);
    }

    [HttpPost]
    public async System.Threading.Tasks.Task<IActionResult> CreateProject([FromBody] CreateProjectRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        
        var project = new Project
        {
            Name = request.Name,
            Description = request.Description,
            Color = request.Color ?? "#1e40af",
            OwnerId = userId,
            MemberIds = new List<string>(),
            CreatedAt = DateTime.UtcNow
        };

        project = await _projectRepository.AddAsync(project);

        var activityLog = new ActivityLog
        {
            Action = "created",
            EntityType = "Project",
            EntityId = project.Id,
            Description = $"Created project: {project.Name}",
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };
        await _context.ActivityLogs.InsertOneAsync(activityLog);

        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
    }

    [HttpPut("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> UpdateProject(string id, [FromBody] UpdateProjectRequest request)
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
    public async System.Threading.Tasks.Task<IActionResult> DeleteProject(string id)
    {
        var project = await _projectRepository.GetByIdAsync(id);
        if (project == null)
            return NotFound();

        // Delete all related tasks, sprints, etc.
        await _context.Tasks.DeleteManyAsync(t => t.ProjectId == id);
        await _context.Sprints.DeleteManyAsync(s => s.ProjectId == id);
        
        await _projectRepository.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/members")]
    public async System.Threading.Tasks.Task<IActionResult> AddMember(string id, [FromBody] AddMemberRequest request)
    {
        var project = await _projectRepository.GetByIdAsync(id);
        if (project == null)
            return NotFound();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        if (project.OwnerId != userId)
            return Forbid();

        // Find user by email
        var user = await _context.Users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
        if (user == null)
            return BadRequest(new { message = "User not found with this email" });

        if (!project.MemberIds.Contains(user.Id))
        {
            project.MemberIds.Add(user.Id);
            project.MemberRoles[user.Id] = request.Role;
            project.UpdatedAt = DateTime.UtcNow;
            await _projectRepository.UpdateAsync(project);
        }
        else
        {
            // Update role if member already exists
            project.MemberRoles[user.Id] = request.Role;
            project.UpdatedAt = DateTime.UtcNow;
            await _projectRepository.UpdateAsync(project);
        }

        return Ok(project);
    }

    [HttpDelete("{id}/members/{memberId}")]
    public async System.Threading.Tasks.Task<IActionResult> RemoveMember(string id, string memberId)
    {
        var project = await _projectRepository.GetByIdAsync(id);
        if (project == null)
            return NotFound();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        if (project.OwnerId != userId)
            return Forbid();

        project.MemberIds.Remove(memberId);
        project.MemberRoles.Remove(memberId);
        project.UpdatedAt = DateTime.UtcNow;
        await _projectRepository.UpdateAsync(project);

        return Ok(project);
    }
}

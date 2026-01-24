using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DBI.Task.Application.Services;
using DBI.Task.Application.DTOs;
using System.Security.Claims;

namespace DBI.Task.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async System.Threading.Tasks.Task<IActionResult> GetTasks([FromQuery] TaskFilterRequest filter)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        var tasks = await _taskService.GetTasksAsync(filter, userId);
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> GetTask(string id)
    {
        var task = await _taskService.GetTaskByIdAsync(id);
        if (task == null)
            return NotFound();

        return Ok(task);
    }

    [HttpGet("backlog")]
    public async System.Threading.Tasks.Task<IActionResult> GetBacklogTasks([FromQuery] string? projectId = null)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        var tasks = await _taskService.GetBacklogTasksAsync(projectId, userId);
        return Ok(tasks);
    }

    [HttpPost]
    public async System.Threading.Tasks.Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        var task = await _taskService.CreateTaskAsync(request, userId);
        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> UpdateTask(string id, [FromBody] UpdateTaskRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        var task = await _taskService.UpdateTaskAsync(id, request, userId);
        
        if (task == null)
            return NotFound();

        return Ok(task);
    }

    [HttpDelete("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> DeleteTask(string id)
    {
        var result = await _taskService.DeleteTaskAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
}

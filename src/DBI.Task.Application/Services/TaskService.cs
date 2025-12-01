using Microsoft.EntityFrameworkCore;
using DBI.Task.Infrastructure.Data;
using DBI.Task.Infrastructure.Repositories;
using DBI.Task.Domain.Entities;
using DBI.Task.Application.DTOs;

namespace DBI.Task.Application.Services;

public interface ITaskService
{
    System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetTasksAsync(TaskFilterRequest filter);
    System.Threading.Tasks.Task<TaskDto?> GetTaskByIdAsync(int id);
    System.Threading.Tasks.Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, int userId);
    System.Threading.Tasks.Task<TaskDto?> UpdateTaskAsync(int id, UpdateTaskRequest request, int userId);
    System.Threading.Tasks.Task<bool> DeleteTaskAsync(int id);
    System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetBacklogTasksAsync(int? projectId = null);
}

public class TaskService : ITaskService
{
    private readonly DBITaskDbContext _context;
    private readonly IRepository<TaskItem> _taskRepository;

    public TaskService(DBITaskDbContext context, IRepository<TaskItem> taskRepository)
    {
        _context = context;
        _taskRepository = taskRepository;
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetTasksAsync(TaskFilterRequest filter)
    {
        var query = _context.Tasks
            .Include(t => t.Project)
            .Include(t => t.Sprint)
            .Include(t => t.AssignedTo)
            .AsQueryable();

        if (filter.ProjectId.HasValue)
            query = query.Where(t => t.ProjectId == filter.ProjectId.Value);

        if (filter.SprintId.HasValue)
            query = query.Where(t => t.SprintId == filter.SprintId.Value);

        if (filter.AssignedToId.HasValue)
            query = query.Where(t => t.AssignedToId == filter.AssignedToId.Value);

        if (filter.Status.HasValue)
            query = query.Where(t => t.Status == filter.Status.Value);

        if (filter.Priority.HasValue)
            query = query.Where(t => t.Priority == filter.Priority.Value);

        if (filter.DeadlineFrom.HasValue)
            query = query.Where(t => t.Deadline >= filter.DeadlineFrom.Value);

        if (filter.DeadlineTo.HasValue)
            query = query.Where(t => t.Deadline <= filter.DeadlineTo.Value);

        if (!string.IsNullOrWhiteSpace(filter.SearchText))
            query = query.Where(t => t.Title.Contains(filter.SearchText) || 
                                   (t.Description != null && t.Description.Contains(filter.SearchText)));

        if (!filter.IncludeBacklog)
            query = query.Where(t => t.Status != Domain.Enums.TaskItemStatus.Backlog);

        var tasks = await query.OrderBy(t => t.OrderIndex).ToListAsync();
        return tasks.Select(MapToDto);
    }

    public async System.Threading.Tasks.Task<TaskDto?> GetTaskByIdAsync(int id)
    {
        var task = await _context.Tasks
            .Include(t => t.Project)
            .Include(t => t.Sprint)
            .Include(t => t.AssignedTo)
            .Include(t => t.Comments)
            .Include(t => t.Attachments)
            .FirstOrDefaultAsync(t => t.Id == id);

        return task == null ? null : MapToDto(task);
    }

    public async System.Threading.Tasks.Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, int userId)
    {
        var maxOrder = await _context.Tasks
            .Where(t => t.ProjectId == request.ProjectId && t.Status == Domain.Enums.TaskItemStatus.Todo)
            .MaxAsync(t => (int?)t.OrderIndex) ?? 0;

        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            ProjectId = request.ProjectId,
            SprintId = request.SprintId,
            AssignedToId = request.AssignedToId,
            Priority = request.Priority,
            Deadline = request.Deadline,
            Status = Domain.Enums.TaskItemStatus.Todo,
            OrderIndex = maxOrder + 1,
            CreatedAt = DateTime.UtcNow
        };

        task = await _taskRepository.AddAsync(task);

        // Create activity log
        await _context.ActivityLogs.AddAsync(new ActivityLog
        {
            Action = "created",
            EntityType = "Task",
            EntityId = task.Id,
            Description = $"Created task: {task.Title}",
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        });

        // Create notification if assigned to someone
        if (task.AssignedToId.HasValue)
        {
            var assignedUser = await _context.Users.FindAsync(task.AssignedToId.Value);
            var creator = await _context.Users.FindAsync(userId);
            
            if (assignedUser != null && creator != null)
            {
                await _context.Notifications.AddAsync(new Notification
                {
                    Title = "New Task Assigned",
                    Message = $"{creator.FullName} assigned you a task: {task.Title}",
                    UserId = task.AssignedToId.Value,
                    TaskId = task.Id,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _context.SaveChangesAsync();

        return (await GetTaskByIdAsync(task.Id))!;
    }

    public async System.Threading.Tasks.Task<TaskDto?> UpdateTaskAsync(int id, UpdateTaskRequest request, int userId)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return null;

        var changes = new List<string>();

        if (request.Title != null && task.Title != request.Title)
        {
            changes.Add($"title: '{task.Title}' → '{request.Title}'");
            task.Title = request.Title;
        }

        if (request.Description != null && task.Description != request.Description)
        {
            task.Description = request.Description;
            changes.Add("description updated");
        }

        if (request.Status.HasValue && task.Status != request.Status.Value)
        {
            changes.Add($"status: {task.Status} → {request.Status.Value}");
            task.Status = request.Status.Value;
            if (request.Status.Value == Domain.Enums.TaskItemStatus.Done)
                task.CompletedAt = DateTime.UtcNow;
        }

        if (request.Priority.HasValue && task.Priority != request.Priority.Value)
        {
            changes.Add($"priority: {task.Priority} → {request.Priority.Value}");
            task.Priority = request.Priority.Value;
        }

        if (request.SprintId.HasValue && task.SprintId != request.SprintId.Value)
        {
            task.SprintId = request.SprintId.Value;
            changes.Add("sprint changed");
        }

        if (request.AssignedToId.HasValue && task.AssignedToId != request.AssignedToId.Value)
        {
            task.AssignedToId = request.AssignedToId.Value;
            changes.Add("assignee changed");
        }

        if (request.Deadline.HasValue && task.Deadline != request.Deadline.Value)
        {
            task.Deadline = request.Deadline.Value;
            changes.Add("deadline changed");
        }

        if (request.OrderIndex.HasValue && task.OrderIndex != request.OrderIndex.Value)
        {
            task.OrderIndex = request.OrderIndex.Value;
        }

        task.UpdatedAt = DateTime.UtcNow;
        await _taskRepository.UpdateAsync(task);

        if (changes.Any())
        {
            await _context.ActivityLogs.AddAsync(new ActivityLog
            {
                Action = "updated",
                EntityType = "Task",
                EntityId = task.Id,
                Description = $"Updated task '{task.Title}': {string.Join(", ", changes)}",
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }

        return await GetTaskByIdAsync(id);
    }

    public async System.Threading.Tasks.Task<bool> DeleteTaskAsync(int id)
    {
        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null)
            return false;

        await _taskRepository.DeleteAsync(task);
        return true;
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetBacklogTasksAsync(int? projectId = null)
    {
        var query = _context.Tasks
            .Include(t => t.Project)
            .Include(t => t.AssignedTo)
            .Where(t => t.Status == Domain.Enums.TaskItemStatus.Backlog);

        if (projectId.HasValue)
            query = query.Where(t => t.ProjectId == projectId.Value);

        var tasks = await query.OrderBy(t => t.CreatedAt).ToListAsync();
        return tasks.Select(MapToDto);
    }

    private TaskDto MapToDto(TaskItem task)
    {
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            ProjectId = task.ProjectId,
            ProjectName = task.Project?.Name ?? "",
            SprintId = task.SprintId,
            SprintName = task.Sprint?.Name,
            AssignedToId = task.AssignedToId,
            AssignedToName = task.AssignedTo?.FullName,
            Deadline = task.Deadline,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            CompletedAt = task.CompletedAt,
            OrderIndex = task.OrderIndex,
            CommentCount = task.Comments?.Count ?? 0,
            AttachmentCount = task.Attachments?.Count ?? 0
        };
    }
}

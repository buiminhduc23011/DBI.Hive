using MongoDB.Driver;
using DBI.Task.Infrastructure.Data;
using DBI.Task.Infrastructure.Repositories;
using DBI.Task.Domain.Entities;
using DBI.Task.Application.DTOs;

namespace DBI.Task.Application.Services;

public interface ITaskService
{
    System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetTasksAsync(TaskFilterRequest filter, string userId);
    System.Threading.Tasks.Task<TaskDto?> GetTaskByIdAsync(string id);
    System.Threading.Tasks.Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, string userId);
    System.Threading.Tasks.Task<TaskDto?> UpdateTaskAsync(string id, UpdateTaskRequest request, string userId);
    System.Threading.Tasks.Task<bool> DeleteTaskAsync(string id);
    System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetBacklogTasksAsync(string? projectId, string userId);
}

public class TaskService : ITaskService
{
    private readonly IMongoDbContext _context;
    private readonly IRepository<TaskItem> _taskRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<Sprint> _sprintRepository;

    public TaskService(
        IMongoDbContext context,
        IRepository<TaskItem> taskRepository,
        IRepository<User> userRepository,
        IRepository<Project> projectRepository,
        IRepository<Sprint> sprintRepository)
    {
        _context = context;
        _taskRepository = taskRepository;
        _userRepository = userRepository;
        _projectRepository = projectRepository;
        _sprintRepository = sprintRepository;
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetTasksAsync(TaskFilterRequest filter,
        string userId)
    {
        // Get user's active (non-archived) projects (owner or member)
        var projectFilter = Builders<Project>.Filter.And(
            Builders<Project>.Filter.Eq(p => p.IsArchived, false),
            Builders<Project>.Filter.Or(
                Builders<Project>.Filter.Eq(p => p.OwnerId, userId),
                Builders<Project>.Filter.AnyEq(p => p.MemberIds, userId),
                Builders<Project>.Filter.Eq(p => p.OwnerId, "") // Legacy projects without owner
            )
        );
        var userProjects = await _context.Projects.Find(projectFilter).ToListAsync();
        var userProjectIds = userProjects.Select(p => p.Id).ToList();

        var filterBuilder = Builders<TaskItem>.Filter;
        var filters = new List<FilterDefinition<TaskItem>>();

        // Filter by user's projects
        filters.Add(filterBuilder.In(t => t.ProjectId, userProjectIds));

        if (!string.IsNullOrEmpty(filter.ProjectId))
            filters.Add(filterBuilder.Eq(t => t.ProjectId, filter.ProjectId));

        if (!string.IsNullOrEmpty(filter.SprintId))
            filters.Add(filterBuilder.Eq(t => t.SprintId, filter.SprintId));

        if (!string.IsNullOrEmpty(filter.AssignedToId))
            filters.Add(filterBuilder.Eq(t => t.AssignedToId, filter.AssignedToId));

        if (filter.Status.HasValue)
            filters.Add(filterBuilder.Eq(t => t.Status, filter.Status.Value));

        if (filter.Priority.HasValue)
            filters.Add(filterBuilder.Eq(t => t.Priority, filter.Priority.Value));

        if (filter.DeadlineFrom.HasValue)
            filters.Add(filterBuilder.Gte(t => t.Deadline, filter.DeadlineFrom.Value));

        if (filter.DeadlineTo.HasValue)
            filters.Add(filterBuilder.Lte(t => t.Deadline, filter.DeadlineTo.Value));

        if (!string.IsNullOrWhiteSpace(filter.SearchText))
        {
            var searchFilter = filterBuilder.Or(
                filterBuilder.Regex(t => t.Title, new MongoDB.Bson.BsonRegularExpression(filter.SearchText, "i")),
                filterBuilder.Regex(t => t.Description, new MongoDB.Bson.BsonRegularExpression(filter.SearchText, "i"))
            );
            filters.Add(searchFilter);
        }

        if (!filter.IncludeBacklog)
            filters.Add(filterBuilder.Ne(t => t.Status, Domain.Enums.TaskItemStatus.Backlog));

        var combinedFilter = filters.Any()
            ? filterBuilder.And(filters)
            : filterBuilder.Empty;

        var tasks = await _context.Tasks
            .Find(combinedFilter)
            .SortBy(t => t.OrderIndex)
            .ToListAsync();

        return tasks.Select(t => MapToDto(t)).ToList();
    }

    public async System.Threading.Tasks.Task<TaskDto?> GetTaskByIdAsync(string id)
    {
        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null) return null;

        // Get comment and attachment counts
        var commentCount = await _context.Comments.CountDocumentsAsync(c => c.TaskId == id);
        var attachmentCount = await _context.Attachments.CountDocumentsAsync(a => a.TaskId == id);

        return MapToDto(task, (int)commentCount, (int)attachmentCount);
    }

    public async System.Threading.Tasks.Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, string userId)
    {
        // Get max order index
        var maxOrder = await _context.Tasks
            .Find(t => t.ProjectId == request.ProjectId && t.Status == Domain.Enums.TaskItemStatus.Todo)
            .SortByDescending(t => t.OrderIndex)
            .Limit(1)
            .FirstOrDefaultAsync();

        var nextOrder = (maxOrder?.OrderIndex ?? 0) + 1;

        // Get related entities for denormalization
        var project = await _projectRepository.GetByIdAsync(request.ProjectId);
        Sprint? sprint = null;
        User? assignee = null;

        if (!string.IsNullOrEmpty(request.SprintId))
            sprint = await _sprintRepository.GetByIdAsync(request.SprintId);

        if (!string.IsNullOrEmpty(request.AssignedToId))
            assignee = await _userRepository.GetByIdAsync(request.AssignedToId);

        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            ProjectId = request.ProjectId,
            ProjectName = project?.Name,
            SprintId = request.SprintId,
            SprintName = sprint?.Name,
            AssignedToId = request.AssignedToId,
            AssignedToName = assignee?.FullName,
            Priority = request.Priority,
            StartDate = request.StartDate,
            Deadline = request.Deadline,
            Status = request.Status ?? Domain.Enums.TaskItemStatus.Todo,
            OrderIndex = nextOrder,
            CreatedAt = DateTime.UtcNow
        };

        task = await _taskRepository.AddAsync(task);

        // Create activity log
        var currentUser = await _userRepository.GetByIdAsync(userId);
        var activityLog = new ActivityLog
        {
            Action = "created",
            EntityType = "Task",
            EntityId = task.Id,
            Description = $"Created task: {task.Title}",
            UserId = userId,
            UserName = currentUser?.FullName,
            CreatedAt = DateTime.UtcNow
        };
        await _context.ActivityLogs.InsertOneAsync(activityLog);

        // Create notification if assigned to someone
        if (!string.IsNullOrEmpty(task.AssignedToId) && task.AssignedToId != userId)
        {
            var notification = new Notification
            {
                Title = "New Task Assigned",
                Message = $"{currentUser?.FullName ?? "Someone"} assigned you a task: {task.Title}",
                UserId = task.AssignedToId,
                TaskId = task.Id,
                CreatedAt = DateTime.UtcNow
            };
            await _context.Notifications.InsertOneAsync(notification);
        }

        return MapToDto(task);
    }

    public async System.Threading.Tasks.Task<TaskDto?> UpdateTaskAsync(string id, UpdateTaskRequest request,
        string userId)
    {
        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null) return null;

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

        if (request.SprintId != null && task.SprintId != request.SprintId)
        {
            task.SprintId = request.SprintId;
            var sprint = await _sprintRepository.GetByIdAsync(request.SprintId);
            task.SprintName = sprint?.Name;
            changes.Add("sprint changed");
        }

        if (request.AssignedToId != null && task.AssignedToId != request.AssignedToId)
        {
            task.AssignedToId = request.AssignedToId;
            var assignee = await _userRepository.GetByIdAsync(request.AssignedToId);
            task.AssignedToName = assignee?.FullName;
            changes.Add("assignee changed");
        }

        if (request.StartDate.HasValue && task.StartDate != request.StartDate.Value)
        {
            task.StartDate = request.StartDate.Value;
            changes.Add("start date changed");
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
            var currentUser = await _userRepository.GetByIdAsync(userId);
            var activityLog = new ActivityLog
            {
                Action = "updated",
                EntityType = "Task",
                EntityId = task.Id,
                Description = $"Updated task '{task.Title}': {string.Join(", ", changes)}",
                UserId = userId,
                UserName = currentUser?.FullName,
                CreatedAt = DateTime.UtcNow
            };
            await _context.ActivityLogs.InsertOneAsync(activityLog);
        }

        return await GetTaskByIdAsync(id);
    }

    public async System.Threading.Tasks.Task<bool> DeleteTaskAsync(string id)
    {
        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null) return false;

        // Delete related comments and attachments
        await _context.Comments.DeleteManyAsync(c => c.TaskId == id);
        await _context.Attachments.DeleteManyAsync(a => a.TaskId == id);

        await _taskRepository.DeleteAsync(id);
        return true;
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetBacklogTasksAsync(string? projectId,
        string userId)
    {
        // Get user's active (non-archived) projects (owner or member)
        var projectFilter = Builders<Project>.Filter.And(
            Builders<Project>.Filter.Eq(p => p.IsArchived, false),
            Builders<Project>.Filter.Or(
                Builders<Project>.Filter.Eq(p => p.OwnerId, userId),
                Builders<Project>.Filter.AnyEq(p => p.MemberIds, userId),
                Builders<Project>.Filter.Eq(p => p.OwnerId, "") // Legacy projects without owner
            )
        );
        var userProjects = await _context.Projects.Find(projectFilter).ToListAsync();
        var userProjectIds = userProjects.Select(p => p.Id).ToList();

        var filter = Builders<TaskItem>.Filter.And(
            Builders<TaskItem>.Filter.Eq(t => t.Status, Domain.Enums.TaskItemStatus.Backlog),
            Builders<TaskItem>.Filter.In(t => t.ProjectId, userProjectIds)
        );

        if (!string.IsNullOrEmpty(projectId))
            filter = filter & Builders<TaskItem>.Filter.Eq(t => t.ProjectId, projectId);

        var tasks = await _context.Tasks
            .Find(filter)
            .SortBy(t => t.CreatedAt)
            .ToListAsync();

        return tasks.Select(t => MapToDto(t)).ToList();
    }

    private TaskDto MapToDto(TaskItem task, int? commentCount = null, int? attachmentCount = null)
    {
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            ProjectId = task.ProjectId,
            ProjectName = task.ProjectName ?? "",
            SprintId = task.SprintId,
            SprintName = task.SprintName,
            AssignedToId = task.AssignedToId,
            AssignedToName = task.AssignedToName,
            StartDate = task.StartDate,
            Deadline = task.Deadline,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            CompletedAt = task.CompletedAt,
            OrderIndex = task.OrderIndex,
            CommentCount = commentCount ?? 0,
            AttachmentCount = attachmentCount ?? 0
        };
    }
}

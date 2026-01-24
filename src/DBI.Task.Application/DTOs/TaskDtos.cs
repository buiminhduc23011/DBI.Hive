using DBI.Task.Domain.Enums;

namespace DBI.Task.Application.DTOs;

public class TaskDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskItemStatus Status { get; set; }
    public Priority Priority { get; set; }
    public string ProjectId { get; set; } = string.Empty;
    public string ProjectName { get; set; } = string.Empty;
    public string? SprintId { get; set; }
    public string? SprintName { get; set; }
    public string? AssignedToId { get; set; }
    public string? AssignedToName { get; set; }
    public DateTime? Deadline { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int OrderIndex { get; set; }
    public int CommentCount { get; set; }
    public int AttachmentCount { get; set; }
}

public class CreateTaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ProjectId { get; set; } = string.Empty;
    public string? SprintId { get; set; }
    public string? AssignedToId { get; set; }
    public Priority Priority { get; set; } = Priority.Medium;
    public TaskItemStatus? Status { get; set; }
    public DateTime? Deadline { get; set; }
}

public class UpdateTaskRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public TaskItemStatus? Status { get; set; }
    public Priority? Priority { get; set; }
    public string? SprintId { get; set; }
    public string? AssignedToId { get; set; }
    public DateTime? Deadline { get; set; }
    public int? OrderIndex { get; set; }
}

public class TaskFilterRequest
{
    public string? ProjectId { get; set; }
    public string? SprintId { get; set; }
    public string? AssignedToId { get; set; }
    public TaskItemStatus? Status { get; set; }
    public Priority? Priority { get; set; }
    public DateTime? DeadlineFrom { get; set; }
    public DateTime? DeadlineTo { get; set; }
    public string? SearchText { get; set; }
    public bool IncludeBacklog { get; set; } = false;
}

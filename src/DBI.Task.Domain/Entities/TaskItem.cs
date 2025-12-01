using DBI.Task.Domain.Enums;

namespace DBI.Task.Domain.Entities;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;
    public Priority Priority { get; set; } = Priority.Medium;
    
    public int ProjectId { get; set; }
    public int? SprintId { get; set; }
    public int? AssignedToId { get; set; }
    
    public DateTime? Deadline { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    public int OrderIndex { get; set; } // For Kanban board ordering
    
    // Navigation properties
    public Project Project { get; set; } = null!;
    public Sprint? Sprint { get; set; }
    public User? AssignedTo { get; set; }
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
}

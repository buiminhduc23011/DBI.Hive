namespace DBI.Task.Domain.Entities;

public class ActivityLog
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty; // e.g., "created", "updated", "deleted", "moved"
    public string EntityType { get; set; } = string.Empty; // e.g., "Task", "Project", "Comment"
    public int EntityId { get; set; }
    public string? Description { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public User User { get; set; } = null!;
}

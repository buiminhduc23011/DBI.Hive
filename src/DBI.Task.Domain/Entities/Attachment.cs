namespace DBI.Task.Domain.Entities;

public class Attachment
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public int TaskId { get; set; }
    public int UploadedById { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public TaskItem Task { get; set; } = null!;
    public User UploadedBy { get; set; } = null!;
}

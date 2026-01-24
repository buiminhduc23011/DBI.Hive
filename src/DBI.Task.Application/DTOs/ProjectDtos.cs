namespace DBI.Task.Application.DTOs;

public class ProjectDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Color { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsArchived { get; set; }
    public int TaskCount { get; set; }
    public int CompletedTaskCount { get; set; }
    public string OwnerId { get; set; } = string.Empty;
    public List<string> MemberIds { get; set; } = new();
}

public class CreateProjectRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Color { get; set; }
}

public class UpdateProjectRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public bool? IsArchived { get; set; }
}

public class AddMemberRequest
{
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "Member"; // "Manager" or "Member"
}

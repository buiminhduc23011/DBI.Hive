namespace DBI.Task.Application.DTOs;

public class ProjectReportDto
{
    public string Id { get; set; } = string.Empty;
    public string ProjectId { get; set; } = string.Empty;
    public string? ProjectName { get; set; }
    public string ReporterId { get; set; } = string.Empty;
    public string? ReporterName { get; set; }
    public string Content { get; set; } = string.Empty;
    public string Status { get; set; } = "OnTrack";
    public int ProgressPercentage { get; set; }
    public DateTime ReportDate { get; set; }
}

public class CreateProjectReportRequest
{
    public string ProjectId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Status { get; set; } = "OnTrack";
    public int ProgressPercentage { get; set; }
}

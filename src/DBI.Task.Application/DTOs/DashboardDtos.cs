namespace DBI.Task.Application.DTOs;

public class DashboardDto
{
    public int TotalProjects { get; set; }
    public int ActiveProjects { get; set; }
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int OverdueTasks { get; set; }
    public int DueTodayTasks { get; set; }
    public int DueThisWeekTasks { get; set; }
    public int MyTasks { get; set; }
    public List<TaskDto> RecentTasks { get; set; } = new();
    public List<TaskDto> OverdueTasksList { get; set; } = new();
    public List<ProjectProgressDto> ProjectProgress { get; set; } = new();
}

public class ProjectProgressDto
{
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public double ProgressPercentage { get; set; }
}

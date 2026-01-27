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

    // Smart Task Display - phân loại theo deadline
    public List<TaskDto> TodayTasks { get; set; } = new();
    public List<TaskDto> ThisWeekTasks { get; set; } = new();
    public List<TaskDto> LaterTasks { get; set; } = new();
    public List<TaskDto> NoDeadlineTasks { get; set; } = new();

    // Gantt Chart - tất cả tasks có deadline (bao gồm Done)
    public List<TaskDto> GanttTasks { get; set; } = new();
}

public class ProjectProgressDto
{
    public string ProjectId { get; set; } = string.Empty;
    public string ProjectName { get; set; } = string.Empty;
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public double ProgressPercentage { get; set; }
}

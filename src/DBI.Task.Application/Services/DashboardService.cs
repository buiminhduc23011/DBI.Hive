using MongoDB.Driver;
using DBI.Task.Infrastructure.Data;
using DBI.Task.Application.DTOs;
using DBI.Task.Domain.Entities;

namespace DBI.Task.Application.Services;

public interface IDashboardService
{
    System.Threading.Tasks.Task<DashboardDto> GetDashboardDataAsync(string userId, bool myTasksOnly = false);
}

public class DashboardService : IDashboardService
{
    private readonly IMongoDbContext _context;

    public DashboardService(IMongoDbContext context)
    {
        _context = context;
    }

    public async System.Threading.Tasks.Task<DashboardDto> GetDashboardDataAsync(string userId,
        bool myTasksOnly = false)
    {
        // Sử dụng local timezone (Vietnam) thay vì UTC để đảm bảo "hôm nay" chính xác
        var localTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); // UTC+7
        var localNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, localTimeZone);
        var today = localNow.Date;
        var endOfWeek = today.AddDays(7);

        // Get user's projects (owner or member)
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

        // Project counts
        var totalProjects = userProjects.Count;

        // Task filters - only tasks from user's projects
        var taskFilter = Builders<TaskItem>.Filter.In(t => t.ProjectId, userProjectIds);
        if (myTasksOnly)
        {
            taskFilter = taskFilter & Builders<TaskItem>.Filter.Eq(t => t.AssignedToId, userId);
        }

        var totalTasks = await _context.Tasks.CountDocumentsAsync(taskFilter);

        var completedFilter =
            taskFilter & Builders<TaskItem>.Filter.Eq(t => t.Status, Domain.Enums.TaskItemStatus.Done);
        var completedTasks = await _context.Tasks.CountDocumentsAsync(completedFilter);

        var overdueFilter = taskFilter &
                            Builders<TaskItem>.Filter.Lt(t => t.Deadline, today) &
                            Builders<TaskItem>.Filter.Ne(t => t.Status, Domain.Enums.TaskItemStatus.Done) &
                            Builders<TaskItem>.Filter.Ne(t => t.Deadline, null);
        var overdueTasks = await _context.Tasks.CountDocumentsAsync(overdueFilter);

        var dueTodayFilter = taskFilter &
                             Builders<TaskItem>.Filter.Gte(t => t.Deadline, today) &
                             Builders<TaskItem>.Filter.Lt(t => t.Deadline, today.AddDays(1)) &
                             Builders<TaskItem>.Filter.Ne(t => t.Status, Domain.Enums.TaskItemStatus.Done);
        var dueTodayTasks = await _context.Tasks.CountDocumentsAsync(dueTodayFilter);

        var dueThisWeekFilter = taskFilter &
                                Builders<TaskItem>.Filter.Gte(t => t.Deadline, today) &
                                Builders<TaskItem>.Filter.Lte(t => t.Deadline, endOfWeek) &
                                Builders<TaskItem>.Filter.Ne(t => t.Status, Domain.Enums.TaskItemStatus.Done);
        var dueThisWeekTasks = await _context.Tasks.CountDocumentsAsync(dueThisWeekFilter);

        // Recent tasks - chỉ lấy task chưa hoàn thành (pending)
        var pendingFilter = taskFilter & Builders<TaskItem>.Filter.Ne(t => t.Status, Domain.Enums.TaskItemStatus.Done);
        var recentTasks = await _context.Tasks
            .Find(pendingFilter)
            .SortByDescending(t => t.CreatedAt)
            .Limit(5)
            .ToListAsync();

        // Overdue tasks list
        var overdueTasksList = await _context.Tasks
            .Find(overdueFilter)
            .SortBy(t => t.Deadline)
            .Limit(10)
            .ToListAsync();

        // Smart Task Display - phân loại theo deadline
        // Today tasks (deadline hôm nay, chưa hoàn thành)
        var todayTasksList = await _context.Tasks
            .Find(dueTodayFilter)
            .SortBy(t => t.Deadline)
            .Limit(10)
            .ToListAsync();

        // This week tasks (deadline từ ngày mai đến cuối tuần, chưa hoàn thành)
        var thisWeekOnlyFilter = taskFilter &
                                 Builders<TaskItem>.Filter.Gt(t => t.Deadline, today.AddDays(1)) &
                                 Builders<TaskItem>.Filter.Lte(t => t.Deadline, endOfWeek) &
                                 Builders<TaskItem>.Filter.Ne(t => t.Status, Domain.Enums.TaskItemStatus.Done);
        var thisWeekTasksList = await _context.Tasks
            .Find(thisWeekOnlyFilter)
            .SortBy(t => t.Deadline)
            .Limit(10)
            .ToListAsync();

        // Later tasks (deadline sau tuần này, chưa hoàn thành)
        var laterFilter = taskFilter &
                          Builders<TaskItem>.Filter.Gt(t => t.Deadline, endOfWeek) &
                          Builders<TaskItem>.Filter.Ne(t => t.Status, Domain.Enums.TaskItemStatus.Done);
        var laterTasksList = await _context.Tasks
            .Find(laterFilter)
            .SortBy(t => t.Deadline)
            .Limit(10)
            .ToListAsync();

        // No deadline tasks (không có deadline, chưa hoàn thành)
        var noDeadlineFilter = taskFilter &
                               Builders<TaskItem>.Filter.Eq(t => t.Deadline, null) &
                               Builders<TaskItem>.Filter.Ne(t => t.Status, Domain.Enums.TaskItemStatus.Done);
        var noDeadlineTasksList = await _context.Tasks
            .Find(noDeadlineFilter)
            .SortByDescending(t => t.CreatedAt)
            .Limit(10)
            .ToListAsync();

        // Gantt tasks - tất cả tasks có deadline (bao gồm cả Done để hiển thị trên Gantt)
        var ganttFilter = taskFilter &
                          Builders<TaskItem>.Filter.Ne(t => t.Deadline, null);
        var ganttTasksList = await _context.Tasks
            .Find(ganttFilter)
            .SortBy(t => t.Deadline)
            .Limit(30)
            .ToListAsync();

        // Project progress - only user's projects
        var projects = userProjects.Take(10).ToList();

        var projectProgress = new List<ProjectProgressDto>();
        foreach (var project in projects)
        {
            var projectTaskFilter = Builders<TaskItem>.Filter.Eq(t => t.ProjectId, project.Id);
            var projectTotalTasks = await _context.Tasks.CountDocumentsAsync(projectTaskFilter);
            var projectCompletedTasks = await _context.Tasks.CountDocumentsAsync(
                projectTaskFilter & Builders<TaskItem>.Filter.Eq(t => t.Status, Domain.Enums.TaskItemStatus.Done)
            );

            projectProgress.Add(new ProjectProgressDto
            {
                ProjectId = project.Id,
                ProjectName = project.Name,
                TotalTasks = (int)projectTotalTasks,
                CompletedTasks = (int)projectCompletedTasks,
                ProgressPercentage = projectTotalTasks > 0
                    ? Math.Round((double)projectCompletedTasks / projectTotalTasks * 100, 1)
                    : 0
            });
        }

        return new DashboardDto
        {
            TotalProjects = (int)totalProjects,
            ActiveProjects = (int)totalProjects,
            TotalTasks = (int)totalTasks,
            CompletedTasks = (int)completedTasks,
            OverdueTasks = (int)overdueTasks,
            DueTodayTasks = (int)dueTodayTasks,
            DueThisWeekTasks = (int)dueThisWeekTasks,
            MyTasks = myTasksOnly ? (int)totalTasks : 0,
            RecentTasks = recentTasks.Select(MapToTaskDto).ToList(),
            OverdueTasksList = overdueTasksList.Select(MapToTaskDto).ToList(),
            ProjectProgress = projectProgress,
            // Smart Task Display
            TodayTasks = todayTasksList.Select(MapToTaskDto).ToList(),
            ThisWeekTasks = thisWeekTasksList.Select(MapToTaskDto).ToList(),
            LaterTasks = laterTasksList.Select(MapToTaskDto).ToList(),
            NoDeadlineTasks = noDeadlineTasksList.Select(MapToTaskDto).ToList(),
            // Gantt Chart - bao gồm tất cả tasks có deadline
            GanttTasks = ganttTasksList.Select(MapToTaskDto).ToList()
        };
    }

    private TaskDto MapToTaskDto(TaskItem t)
    {
        return new TaskDto
        {
            Id = t.Id,
            Title = t.Title,
            Status = t.Status,
            Priority = t.Priority,
            ProjectId = t.ProjectId,
            ProjectName = t.ProjectName ?? "",
            AssignedToId = t.AssignedToId,
            AssignedToName = t.AssignedToName,
            Deadline = t.Deadline,
            CreatedAt = t.CreatedAt
        };
    }
}

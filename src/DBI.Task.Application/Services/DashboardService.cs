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

    public async System.Threading.Tasks.Task<DashboardDto> GetDashboardDataAsync(string userId, bool myTasksOnly = false)
    {
        var now = DateTime.UtcNow;
        var today = now.Date;
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

        var completedFilter = taskFilter & Builders<TaskItem>.Filter.Eq(t => t.Status, Domain.Enums.TaskItemStatus.Done);
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

        // Recent tasks
        var recentTasks = await _context.Tasks
            .Find(taskFilter)
            .SortByDescending(t => t.CreatedAt)
            .Limit(5)
            .ToListAsync();

        // Overdue tasks list
        var overdueTasks_List = await _context.Tasks
            .Find(overdueFilter)
            .SortBy(t => t.Deadline)
            .Limit(10)
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
            OverdueTasksList = overdueTasks_List.Select(MapToTaskDto).ToList(),
            ProjectProgress = projectProgress
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

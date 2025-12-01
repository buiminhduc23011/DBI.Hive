using Microsoft.EntityFrameworkCore;
using DBI.Task.Infrastructure.Data;
using DBI.Task.Application.DTOs;

namespace DBI.Task.Application.Services;

public interface IDashboardService
{
    System.Threading.Tasks.Task<DashboardDto> GetDashboardDataAsync(int? userId = null);
}

public class DashboardService : IDashboardService
{
    private readonly DBITaskDbContext _context;

    public DashboardService(DBITaskDbContext context)
    {
        _context = context;
    }

    public async System.Threading.Tasks.Task<DashboardDto> GetDashboardDataAsync(int? userId = null)
    {
        var now = DateTime.UtcNow;
        var today = now.Date;
        var endOfWeek = today.AddDays(7);

        var tasksQuery = _context.Tasks.AsQueryable();
        if (userId.HasValue)
        {
            var myTasksQuery = tasksQuery.Where(t => t.AssignedToId == userId.Value);
            var myTasks = await myTasksQuery.CountAsync();
            tasksQuery = myTasksQuery;
        }

        var totalProjects = await _context.Projects.CountAsync(p => !p.IsArchived);
        var totalTasks = await tasksQuery.CountAsync();
        var completedTasks = await tasksQuery.CountAsync(t => t.Status == Domain.Enums.TaskItemStatus.Done);
        var overdueTasks = await tasksQuery.CountAsync(t => 
            t.Deadline.HasValue && 
            t.Deadline.Value < now && 
            t.Status != Domain.Enums.TaskItemStatus.Done);
        var dueTodayTasks = await tasksQuery.CountAsync(t => 
            t.Deadline.HasValue && 
            t.Deadline.Value.Date == today && 
            t.Status != Domain.Enums.TaskItemStatus.Done);
        var dueThisWeekTasks = await tasksQuery.CountAsync(t => 
            t.Deadline.HasValue && 
            t.Deadline.Value.Date >= today && 
            t.Deadline.Value.Date <= endOfWeek && 
            t.Status != Domain.Enums.TaskItemStatus.Done);

        var recentTasks = await _context.Tasks
            .Include(t => t.Project)
            .Include(t => t.AssignedTo)
            .Where(t => userId == null || t.AssignedToId == userId.Value)
            .OrderByDescending(t => t.CreatedAt)
            .Take(5)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                Priority = t.Priority,
                ProjectName = t.Project.Name,
                AssignedToName = t.AssignedTo != null ? t.AssignedTo.FullName : null,
                Deadline = t.Deadline,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        var overdueTasksList = await _context.Tasks
            .Include(t => t.Project)
            .Include(t => t.AssignedTo)
            .Where(t => t.Deadline.HasValue && 
                       t.Deadline.Value < now && 
                       t.Status != Domain.Enums.TaskItemStatus.Done &&
                       (userId == null || t.AssignedToId == userId.Value))
            .OrderBy(t => t.Deadline)
            .Take(10)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                Priority = t.Priority,
                ProjectName = t.Project.Name,
                AssignedToName = t.AssignedTo != null ? t.AssignedTo.FullName : null,
                Deadline = t.Deadline,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        var projectProgress = await _context.Projects
            .Where(p => !p.IsArchived)
            .Select(p => new ProjectProgressDto
            {
                ProjectId = p.Id,
                ProjectName = p.Name,
                TotalTasks = p.Tasks.Count,
                CompletedTasks = p.Tasks.Count(t => t.Status == Domain.Enums.TaskItemStatus.Done),
                ProgressPercentage = p.Tasks.Count > 0 
                    ? Math.Round((double)p.Tasks.Count(t => t.Status == Domain.Enums.TaskItemStatus.Done) / p.Tasks.Count * 100, 1)
                    : 0
            })
            .Take(10)
            .ToListAsync();

        return new DashboardDto
        {
            TotalProjects = totalProjects,
            ActiveProjects = totalProjects,
            TotalTasks = totalTasks,
            CompletedTasks = completedTasks,
            OverdueTasks = overdueTasks,
            DueTodayTasks = dueTodayTasks,
            DueThisWeekTasks = dueThisWeekTasks,
            MyTasks = userId.HasValue ? totalTasks : 0,
            RecentTasks = recentTasks,
            OverdueTasksList = overdueTasksList,
            ProjectProgress = projectProgress
        };
    }
}

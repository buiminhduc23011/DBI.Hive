using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using DBI.Task.Infrastructure.Data;
using DBI.Task.Domain.Entities;

namespace DBI.Task.Infrastructure.Services;

public class NotificationBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<NotificationBackgroundService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(15); // Check every 15 minutes

    public NotificationBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<NotificationBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async System.Threading.Tasks.Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Notification Background Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CheckAndSendNotifications();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in notification background service");
            }

            await System.Threading.Tasks.Task.Delay(_checkInterval, stoppingToken);
        }
    }

    private async System.Threading.Tasks.Task CheckAndSendNotifications()
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<DBITaskDbContext>();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

        var now = DateTime.UtcNow;
        var reminderWindow = now.AddHours(24); // Send reminder 24 hours before deadline

        // Find tasks that are approaching deadline and haven't been completed
        var tasksNeedingReminder = await dbContext.Tasks
            .Include(t => t.AssignedTo)
            .Where(t => t.Deadline.HasValue 
                     && t.Deadline.Value <= reminderWindow 
                     && t.Deadline.Value > now
                     && t.Status != Domain.Enums.TaskItemStatus.Done
                     && t.AssignedToId.HasValue)
            .ToListAsync();

        foreach (var task in tasksNeedingReminder)
        {
            // Check if we already sent a notification for this task recently
            var existingNotification = await dbContext.Notifications
                .Where(n => n.TaskId == task.Id 
                         && n.UserId == task.AssignedToId!.Value
                         && n.CreatedAt > now.AddHours(-23)) // Don't send more than once per day
                .FirstOrDefaultAsync();

            if (existingNotification == null && task.AssignedTo != null)
            {
                // Create in-app notification
                var notification = new Notification
                {
                    Title = "Task Deadline Reminder",
                    Message = $"Task '{task.Title}' is due on {task.Deadline:yyyy-MM-dd HH:mm}",
                    UserId = task.AssignedToId!.Value,
                    TaskId = task.Id,
                    CreatedAt = now
                };

                await dbContext.Notifications.AddAsync(notification);

                // Send email notification
                await emailService.SendTaskDeadlineReminderAsync(
                    task.AssignedTo.Email,
                    task.Title,
                    task.Deadline.Value);

                _logger.LogInformation($"Sent reminder for task {task.Id} to user {task.AssignedTo.Email}");
            }
        }

        // Find overdue tasks
        var overdueTasks = await dbContext.Tasks
            .Include(t => t.AssignedTo)
            .Where(t => t.Deadline.HasValue 
                     && t.Deadline.Value < now
                     && t.Status != Domain.Enums.TaskItemStatus.Done
                     && t.AssignedToId.HasValue)
            .ToListAsync();

        foreach (var task in overdueTasks)
        {
            var existingNotification = await dbContext.Notifications
                .Where(n => n.TaskId == task.Id 
                         && n.UserId == task.AssignedToId!.Value
                         && n.Message.Contains("overdue")
                         && n.CreatedAt > now.AddHours(-23))
                .FirstOrDefaultAsync();

            if (existingNotification == null && task.AssignedTo != null)
            {
                var notification = new Notification
                {
                    Title = "Task Overdue",
                    Message = $"Task '{task.Title}' is overdue (was due {task.Deadline:yyyy-MM-dd HH:mm})",
                    UserId = task.AssignedToId!.Value,
                    TaskId = task.Id,
                    CreatedAt = now
                };

                await dbContext.Notifications.AddAsync(notification);
                _logger.LogInformation($"Created overdue notification for task {task.Id}");
            }
        }

        await dbContext.SaveChangesAsync();
    }
}

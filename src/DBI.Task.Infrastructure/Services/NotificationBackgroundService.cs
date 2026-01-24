using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
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
        var context = scope.ServiceProvider.GetRequiredService<IMongoDbContext>();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

        var now = DateTime.UtcNow;
        var reminderWindow = now.AddHours(24); // Send reminder 24 hours before deadline

        // Find tasks that are approaching deadline and haven't been completed
        var filter = Builders<TaskItem>.Filter.And(
            Builders<TaskItem>.Filter.Lt(t => t.Deadline, reminderWindow),
            Builders<TaskItem>.Filter.Gt(t => t.Deadline, now),
            Builders<TaskItem>.Filter.Ne(t => t.Status, Domain.Enums.TaskItemStatus.Done),
            Builders<TaskItem>.Filter.Ne(t => t.AssignedToId, null)
        );

        var tasksNeedingReminder = await context.Tasks.Find(filter).ToListAsync();

        foreach (var task in tasksNeedingReminder)
        {
            if (string.IsNullOrEmpty(task.AssignedToId)) continue;

            // Check if we already sent a notification for this task recently
            var notificationFilter = Builders<Notification>.Filter.And(
                Builders<Notification>.Filter.Eq(n => n.TaskId, task.Id),
                Builders<Notification>.Filter.Eq(n => n.UserId, task.AssignedToId),
                Builders<Notification>.Filter.Gt(n => n.CreatedAt, now.AddHours(-23))
            );

            var existingNotification = await context.Notifications.Find(notificationFilter).FirstOrDefaultAsync();

            if (existingNotification == null)
            {
                // Get user for email
                var user = await context.Users.Find(u => u.Id == task.AssignedToId).FirstOrDefaultAsync();

                if (user != null)
                {
                    // Create in-app notification
                    var notification = new Notification
                    {
                        Title = "Task Deadline Reminder",
                        Message = $"Task '{task.Title}' is due on {task.Deadline:yyyy-MM-dd HH:mm}",
                        UserId = task.AssignedToId,
                        TaskId = task.Id,
                        CreatedAt = now
                    };

                    await context.Notifications.InsertOneAsync(notification);

                    // Send email notification
                    if (task.Deadline.HasValue)
                    {
                        await emailService.SendTaskDeadlineReminderAsync(
                            user.Email,
                            task.Title,
                            task.Deadline.Value);
                    }

                    _logger.LogInformation($"Sent reminder for task {task.Id} to user {user.Email}");
                }
            }
        }

        // Find overdue tasks
        var overdueFilter = Builders<TaskItem>.Filter.And(
            Builders<TaskItem>.Filter.Lt(t => t.Deadline, now),
            Builders<TaskItem>.Filter.Ne(t => t.Status, Domain.Enums.TaskItemStatus.Done),
            Builders<TaskItem>.Filter.Ne(t => t.AssignedToId, null)
        );

        var overdueTasks = await context.Tasks.Find(overdueFilter).ToListAsync();

        foreach (var task in overdueTasks)
        {
            if (string.IsNullOrEmpty(task.AssignedToId)) continue;

            var overdueNotificationFilter = Builders<Notification>.Filter.And(
                Builders<Notification>.Filter.Eq(n => n.TaskId, task.Id),
                Builders<Notification>.Filter.Eq(n => n.UserId, task.AssignedToId),
                Builders<Notification>.Filter.Regex(n => n.Message, "overdue"),
                Builders<Notification>.Filter.Gt(n => n.CreatedAt, now.AddHours(-23))
            );

            var existingNotification = await context.Notifications.Find(overdueNotificationFilter).FirstOrDefaultAsync();

            if (existingNotification == null)
            {
                var notification = new Notification
                {
                    Title = "Task Overdue",
                    Message = $"Task '{task.Title}' is overdue (was due {task.Deadline:yyyy-MM-dd HH:mm})",
                    UserId = task.AssignedToId,
                    TaskId = task.Id,
                    CreatedAt = now
                };

                await context.Notifications.InsertOneAsync(notification);
                _logger.LogInformation($"Created overdue notification for task {task.Id}");
            }
        }
    }
}

using System.Security.Cryptography;
using System.Text;
using MongoDB.Driver;
using DBI.Task.Domain.Entities;
using DBI.Task.Domain.Enums;

namespace DBI.Task.Infrastructure.Data;

public class DbSeeder
{
    private readonly IMongoDbContext _context;

    public DbSeeder(IMongoDbContext context)
    {
        _context = context;
    }

    public async System.Threading.Tasks.Task SeedAsync()
    {
        // Check if already seeded
        if (await _context.Users.Find(_ => true).AnyAsync())
        {
            Console.WriteLine("Database already seeded.");
            return;
        }

        Console.WriteLine("🌱 Seeding database...");

        // Create Admin User
        var adminUser = new User
        {
            Email = "admin@dbi.com",
            FullName = "DBI Administrator",
            PasswordHash = HashPassword("Admin@123"),
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow,
            AvatarUrl = null
        };

        await _context.Users.InsertOneAsync(adminUser);

        // Create Demo User
        var demoUser = new User
        {
            Email = "demo@dbi.com",
            FullName = "Demo User",
            PasswordHash = HashPassword("Demo@123"),
            Role = UserRole.Member,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Users.InsertOneAsync(demoUser);

        // Create Sample Project
        var project1 = new Project
        {
            Name = "DBI Task Application",
            Description = "Main task management system for DBI ecosystem",
            Color = "#1e40af",
            IsArchived = false,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Projects.InsertOneAsync(project1);

        var project2 = new Project
        {
            Name = "Mobile App Development",
            Description = "React Native mobile application",
            Color = "#3b82f6",
            IsArchived = false,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Projects.InsertOneAsync(project2);

        // Create Sprint
        var sprint1 = new Sprint
        {
            Name = "Sprint 1 - Foundation",
            Description = "Initial setup and core features",
            ProjectId = project1.Id,
            StartDate = DateTime.UtcNow.AddDays(-7),
            EndDate = DateTime.UtcNow.AddDays(7),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Sprints.InsertOneAsync(sprint1);

        // Create Sample Tasks
        var tasks = new List<TaskItem>
        {
            new TaskItem
            {
                Title = "Setup Backend Infrastructure",
                Description = "Configure ASP.NET Core and MongoDB",
                Status = TaskItemStatus.Done,
                Priority = Priority.High,
                ProjectId = project1.Id,
                ProjectName = project1.Name,
                SprintId = sprint1.Id,
                SprintName = sprint1.Name,
                AssignedToId = adminUser.Id,
                AssignedToName = adminUser.FullName,
                Deadline = DateTime.UtcNow.AddDays(-2),
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                CompletedAt = DateTime.UtcNow.AddDays(-2),
                OrderIndex = 1
            },
            new TaskItem
            {
                Title = "Implement Authentication",
                Description = "JWT authentication with refresh tokens",
                Status = TaskItemStatus.Done,
                Priority = Priority.Critical,
                ProjectId = project1.Id,
                ProjectName = project1.Name,
                SprintId = sprint1.Id,
                SprintName = sprint1.Name,
                AssignedToId = adminUser.Id,
                AssignedToName = adminUser.FullName,
                Deadline = DateTime.UtcNow.AddDays(-1),
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                CompletedAt = DateTime.UtcNow.AddDays(-1),
                OrderIndex = 2
            },
            new TaskItem
            {
                Title = "Create React Frontend",
                Description = "Setup Vite + React + TypeScript + Tailwind CSS",
                Status = TaskItemStatus.InProgress,
                Priority = Priority.High,
                ProjectId = project1.Id,
                ProjectName = project1.Name,
                SprintId = sprint1.Id,
                SprintName = sprint1.Name,
                AssignedToId = demoUser.Id,
                AssignedToName = demoUser.FullName,
                Deadline = DateTime.UtcNow.AddDays(2),
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                OrderIndex = 3
            },
            new TaskItem
            {
                Title = "Implement Kanban Board",
                Description = "Drag & drop functionality with dnd-kit",
                Status = TaskItemStatus.InProgress,
                Priority = Priority.Medium,
                ProjectId = project1.Id,
                ProjectName = project1.Name,
                SprintId = sprint1.Id,
                SprintName = sprint1.Name,
                AssignedToId = demoUser.Id,
                AssignedToName = demoUser.FullName,
                Deadline = DateTime.UtcNow.AddDays(3),
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                OrderIndex = 4
            },
            new TaskItem
            {
                Title = "Setup Dashboard",
                Description = "Create dashboard with statistics and charts",
                Status = TaskItemStatus.Todo,
                Priority = Priority.Medium,
                ProjectId = project1.Id,
                ProjectName = project1.Name,
                SprintId = sprint1.Id,
                SprintName = sprint1.Name,
                AssignedToId = null,
                Deadline = DateTime.UtcNow.AddDays(5),
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                OrderIndex = 5
            },
            new TaskItem
            {
                Title = "Add Email Notifications",
                Description = "SMTP setup for deadline reminders",
                Status = TaskItemStatus.Backlog,
                Priority = Priority.Low,
                ProjectId = project1.Id,
                ProjectName = project1.Name,
                SprintId = null,
                AssignedToId = null,
                Deadline = DateTime.UtcNow.AddDays(10),
                CreatedAt = DateTime.UtcNow,
                OrderIndex = 6
            },
            new TaskItem
            {
                Title = "Mobile App UI Design",
                Description = "Design screens for the mobile app",
                Status = TaskItemStatus.Todo,
                Priority = Priority.High,
                ProjectId = project2.Id,
                ProjectName = project2.Name,
                SprintId = null,
                AssignedToId = demoUser.Id,
                AssignedToName = demoUser.FullName,
                Deadline = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                OrderIndex = 1
            },
            new TaskItem
            {
                Title = "API Integration",
                Description = "Connect mobile app to backend API",
                Status = TaskItemStatus.Backlog,
                Priority = Priority.Medium,
                ProjectId = project2.Id,
                ProjectName = project2.Name,
                SprintId = null,
                AssignedToId = null,
                Deadline = DateTime.UtcNow.AddDays(14),
                CreatedAt = DateTime.UtcNow,
                OrderIndex = 2
            }
        };

        await _context.Tasks.InsertManyAsync(tasks);

        // Create sample comments
        var comment1 = new Comment
        {
            Content = "Great progress on this task!",
            TaskId = tasks[0].Id,
            UserId = demoUser.Id,
            UserName = demoUser.FullName,
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };

        var comment2 = new Comment
        {
            Content = "Need to add more test coverage.",
            TaskId = tasks[1].Id,
            UserId = adminUser.Id,
            UserName = adminUser.FullName,
            CreatedAt = DateTime.UtcNow.AddHours(-12)
        };

        await _context.Comments.InsertManyAsync(new[] { comment1, comment2 });

        // Create sample notifications
        var notification1 = new Notification
        {
            Title = "Task Assigned",
            Message = "You have been assigned to 'Create React Frontend'",
            UserId = demoUser.Id,
            TaskId = tasks[2].Id,
            IsRead = false,
            CreatedAt = DateTime.UtcNow.AddDays(-3)
        };

        var notification2 = new Notification
        {
            Title = "Deadline Reminder",
            Message = "Task 'Implement Kanban Board' is due in 3 days",
            UserId = demoUser.Id,
            TaskId = tasks[3].Id,
            IsRead = false,
            CreatedAt = DateTime.UtcNow.AddHours(-6)
        };

        await _context.Notifications.InsertManyAsync(new[] { notification1, notification2 });

        Console.WriteLine("✅ Database seeded successfully!");
        Console.WriteLine("📧 Admin: admin@dbi.com | Password: Admin@123");
        Console.WriteLine("📧 Demo: demo@dbi.com | Password: Demo@123");
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}

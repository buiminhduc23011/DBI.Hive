using DBI.Task.Domain.Entities;
using DBI.Task.Domain.Enums;
using DBI.Task.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DBI.Task.Infrastructure.Data;

public class DbSeeder
{
    private readonly DBITaskDbContext _context;

    public DbSeeder(DBITaskDbContext context)
    {
        _context = context;
    }

    public async System.Threading.Tasks.Task SeedAsync()
    {
        // Check if already seeded
        if (await _context.Users.AnyAsync())
        {
            return; // Database already has data
        }

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

        await _context.Users.AddAsync(adminUser);
        await _context.SaveChangesAsync();

        // Create Demo User
        var demoUser = new User
        {
            Email = "demo@dbi.com",
            FullName = "Demo User",
            PasswordHash = HashPassword("Demo@123"),
            Role = UserRole.Member,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Users.AddAsync(demoUser);
        await _context.SaveChangesAsync();

        // Create Sample Project
        var project1 = new Project
        {
            Name = "DBI Task Application",
            Description = "Main task management system for DBI ecosystem",
            Color = "#1e40af",
            IsArchived = false,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Projects.AddAsync(project1);
        await _context.SaveChangesAsync();

        var project2 = new Project
        {
            Name = "Mobile App Development",
            Description = "React Native mobile application",
            Color = "#3b82f6",
            IsArchived = false,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Projects.AddAsync(project2);
        await _context.SaveChangesAsync();

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

        await _context.Sprints.AddAsync(sprint1);
        await _context.SaveChangesAsync();

        // Create Sample Tasks
        var tasks = new List<Domain.Entities.TaskItem>
        {
            new Domain.Entities.TaskItem
            {
                Title = "Setup Backend Infrastructure",
                Description = "Configure ASP.NET Core, EF Core, and SQL Server",
                Status = TaskItemStatus.Done,
                Priority = Priority.High,
                ProjectId = project1.Id,
                SprintId = sprint1.Id,
                AssignedToId = adminUser.Id,
                Deadline = DateTime.UtcNow.AddDays(-2),
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                CompletedAt = DateTime.UtcNow.AddDays(-2),
                OrderIndex = 1
            },
            new Domain.Entities.TaskItem
            {
                Title = "Implement Authentication",
                Description = "JWT authentication with refresh tokens",
                Status = TaskItemStatus.Done,
                Priority = Priority.Critical,
                ProjectId = project1.Id,
                SprintId = sprint1.Id,
                AssignedToId = adminUser.Id,
                Deadline = DateTime.UtcNow.AddDays(-1),
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                CompletedAt = DateTime.UtcNow.AddDays(-1),
                OrderIndex = 2
            },
            new Domain.Entities.TaskItem
            {
                Title = "Create React Frontend",
                Description = "Setup Vite + React + TypeScript + Tailwind CSS",
                Status = TaskItemStatus.InProgress,
                Priority = Priority.High,
                ProjectId = project1.Id,
                SprintId = sprint1.Id,
                AssignedToId = demoUser.Id,
                Deadline = DateTime.UtcNow.AddDays(2),
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                OrderIndex = 3
            },
            new Domain.Entities.TaskItem
            {
                Title = "Implement Kanban Board",
                Description = "Drag & drop functionality with dnd-kit",
                Status = TaskItemStatus.InProgress,
                Priority = Priority.Medium,
                ProjectId = project1.Id,
                SprintId = sprint1.Id,
                AssignedToId = demoUser.Id,
                Deadline = DateTime.UtcNow.AddDays(3),
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                OrderIndex = 4
            },
            new Domain.Entities.TaskItem
            {
                Title = "Design Dashboard UI",
                Description = "Create metrics, charts, and overview widgets",
                Status = TaskItemStatus.Review,
                Priority = Priority.Medium,
                ProjectId = project1.Id,
                SprintId = sprint1.Id,
                AssignedToId = adminUser.Id,
                Deadline = DateTime.UtcNow.AddDays(1),
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                OrderIndex = 5
            },
            new Domain.Entities.TaskItem
            {
                Title = "Setup Email Notifications",
                Description = "Configure SMTP and notification templates",
                Status = TaskItemStatus.Todo,
                Priority = Priority.Low,
                ProjectId = project1.Id,
                SprintId = sprint1.Id,
                AssignedToId = null,
                Deadline = DateTime.UtcNow.AddDays(5),
                CreatedAt = DateTime.UtcNow,
                OrderIndex = 6
            },
            new Domain.Entities.TaskItem
            {
                Title = "Write API Documentation",
                Description = "Document all endpoints with examples",
                Status = TaskItemStatus.Todo,
                Priority = Priority.Medium,
                ProjectId = project1.Id,
                AssignedToId = null,
                Deadline = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                OrderIndex = 7
            },
            new Domain.Entities.TaskItem
            {
                Title = "Mobile App Design",
                Description = "UI/UX design for React Native app",
                Status = TaskItemStatus.Backlog,
                Priority = Priority.Low,
                ProjectId = project2.Id,
                AssignedToId = null,
                Deadline = DateTime.UtcNow.AddDays(14),
                CreatedAt = DateTime.UtcNow,
                OrderIndex = 1
            }
        };

        await _context.Tasks.AddRangeAsync(tasks);
        await _context.SaveChangesAsync();

        // Add some comments
        var comment1 = new Comment
        {
            Content = "Backend setup completed successfully! All tests passing.",
            TaskId = tasks[0].Id,
            UserId = adminUser.Id,
            CreatedAt = DateTime.UtcNow.AddDays(-2)
        };

        var comment2 = new Comment
        {
            Content = "Working on the Kanban drag & drop feature. Making good progress!",
            TaskId = tasks[3].Id,
            UserId = demoUser.Id,
            CreatedAt = DateTime.UtcNow.AddHours(-3)
        };

        await _context.Comments.AddRangeAsync(comment1, comment2);
        await _context.SaveChangesAsync();

        // Create welcome notification for demo user
        var notification = new Notification
        {
            Title = "Welcome to DBI Task!",
            Message = "You've been added to the DBI Task Application project. Check out your assigned tasks!",
            UserId = demoUser.Id,
            TaskId = null,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Notifications.AddAsync(notification);
        await _context.SaveChangesAsync();

        Console.WriteLine("✅ Database seeded successfully!");
        Console.WriteLine("📧 Admin: admin@dbi.com | Password: Admin@123");
        Console.WriteLine("📧 Demo: demo@dbi.com | Password: Demo@123");
    }

    private string HashPassword(string password)
    {
        // Same hashing logic as AuthService (SHA256)
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}

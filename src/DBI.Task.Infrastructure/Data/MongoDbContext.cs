using MongoDB.Driver;
using DBI.Task.Domain.Entities;

namespace DBI.Task.Infrastructure.Data;

public interface IMongoDbContext
{
    IMongoCollection<User> Users { get; }
    IMongoCollection<Project> Projects { get; }
    IMongoCollection<Sprint> Sprints { get; }
    IMongoCollection<TaskItem> Tasks { get; }
    IMongoCollection<Comment> Comments { get; }
    IMongoCollection<Attachment> Attachments { get; }
    IMongoCollection<Notification> Notifications { get; }
    IMongoCollection<ActivityLog> ActivityLogs { get; }
    IMongoCollection<T> GetCollection<T>(string name);
}

public class MongoDbContext : IMongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(MongoDbSettings settings)
    {
        var client = new MongoClient(settings.ConnectionString);
        _database = client.GetDatabase(settings.DatabaseName);
        
        // Create indexes
        CreateIndexes();
    }

    public IMongoCollection<User> Users => _database.GetCollection<User>("users");
    public IMongoCollection<Project> Projects => _database.GetCollection<Project>("projects");
    public IMongoCollection<Sprint> Sprints => _database.GetCollection<Sprint>("sprints");
    public IMongoCollection<TaskItem> Tasks => _database.GetCollection<TaskItem>("tasks");
    public IMongoCollection<Comment> Comments => _database.GetCollection<Comment>("comments");
    public IMongoCollection<Attachment> Attachments => _database.GetCollection<Attachment>("attachments");
    public IMongoCollection<Notification> Notifications => _database.GetCollection<Notification>("notifications");
    public IMongoCollection<ActivityLog> ActivityLogs => _database.GetCollection<ActivityLog>("activityLogs");

    public IMongoCollection<T> GetCollection<T>(string name) => _database.GetCollection<T>(name);

    private void CreateIndexes()
    {
        // User indexes
        var userEmailIndex = new CreateIndexModel<User>(
            Builders<User>.IndexKeys.Ascending(u => u.Email),
            new CreateIndexOptions { Unique = true }
        );
        Users.Indexes.CreateOne(userEmailIndex);

        // Task indexes
        var taskProjectIndex = new CreateIndexModel<TaskItem>(
            Builders<TaskItem>.IndexKeys.Ascending(t => t.ProjectId)
        );
        var taskStatusIndex = new CreateIndexModel<TaskItem>(
            Builders<TaskItem>.IndexKeys.Ascending(t => t.Status)
        );
        var taskAssignedToIndex = new CreateIndexModel<TaskItem>(
            Builders<TaskItem>.IndexKeys.Ascending(t => t.AssignedToId)
        );
        var taskDeadlineIndex = new CreateIndexModel<TaskItem>(
            Builders<TaskItem>.IndexKeys.Ascending(t => t.Deadline)
        );
        Tasks.Indexes.CreateMany(new[] { taskProjectIndex, taskStatusIndex, taskAssignedToIndex, taskDeadlineIndex });

        // Comment indexes
        var commentTaskIndex = new CreateIndexModel<Comment>(
            Builders<Comment>.IndexKeys.Ascending(c => c.TaskId)
        );
        Comments.Indexes.CreateOne(commentTaskIndex);

        // Notification indexes
        var notificationUserIndex = new CreateIndexModel<Notification>(
            Builders<Notification>.IndexKeys.Ascending(n => n.UserId)
        );
        Notifications.Indexes.CreateOne(notificationUserIndex);

        // Sprint indexes
        var sprintProjectIndex = new CreateIndexModel<Sprint>(
            Builders<Sprint>.IndexKeys.Ascending(s => s.ProjectId)
        );
        Sprints.Indexes.CreateOne(sprintProjectIndex);
    }
}

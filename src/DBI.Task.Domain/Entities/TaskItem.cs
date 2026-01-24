using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using DBI.Task.Domain.Enums;

namespace DBI.Task.Domain.Entities;

public class TaskItem : BaseEntity
{
    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("description")]
    public string? Description { get; set; }

    [BsonElement("status")]
    [BsonRepresentation(BsonType.String)]
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;

    [BsonElement("priority")]
    [BsonRepresentation(BsonType.String)]
    public Priority Priority { get; set; } = Priority.Medium;

    [BsonElement("projectId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProjectId { get; set; } = string.Empty;

    [BsonElement("sprintId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? SprintId { get; set; }

    [BsonElement("assignedToId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? AssignedToId { get; set; }

    [BsonElement("deadline")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime? Deadline { get; set; }

    [BsonElement("completedAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime? CompletedAt { get; set; }

    [BsonElement("orderIndex")]
    public int OrderIndex { get; set; }

    // Denormalized fields for faster queries
    [BsonElement("projectName")]
    public string? ProjectName { get; set; }

    [BsonElement("sprintName")]
    public string? SprintName { get; set; }

    [BsonElement("assignedToName")]
    public string? AssignedToName { get; set; }
}

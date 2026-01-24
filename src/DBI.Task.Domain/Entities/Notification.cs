using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DBI.Task.Domain.Entities;

public class Notification : BaseEntity
{
    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("message")]
    public string Message { get; set; } = string.Empty;

    [BsonElement("type")]
    public string Type { get; set; } = "general";

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("taskId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? TaskId { get; set; }

    [BsonElement("isRead")]
    public bool IsRead { get; set; } = false;
}

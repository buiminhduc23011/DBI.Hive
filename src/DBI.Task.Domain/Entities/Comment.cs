using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DBI.Task.Domain.Entities;

public class Comment : BaseEntity
{
    [BsonElement("content")]
    public string Content { get; set; } = string.Empty;

    [BsonElement("taskId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string TaskId { get; set; } = string.Empty;

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("userName")]
    public string? UserName { get; set; }

    [BsonElement("userAvatarUrl")]
    public string? UserAvatarUrl { get; set; }
}

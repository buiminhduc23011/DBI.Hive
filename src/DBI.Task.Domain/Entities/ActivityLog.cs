using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DBI.Task.Domain.Entities;

public class ActivityLog : BaseEntity
{
    [BsonElement("action")]
    public string Action { get; set; } = string.Empty;

    [BsonElement("entityType")]
    public string EntityType { get; set; } = string.Empty;

    [BsonElement("entityId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string EntityId { get; set; } = string.Empty;

    [BsonElement("description")]
    public string? Description { get; set; }

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("userName")]
    public string? UserName { get; set; }
}

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DBI.Task.Domain.Entities;

public class Project : BaseEntity
{
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("description")]
    public string? Description { get; set; }

    [BsonElement("color")]
    public string? Color { get; set; }

    [BsonElement("isArchived")]
    public bool IsArchived { get; set; } = false;

    [BsonElement("ownerId")]
    public string OwnerId { get; set; } = string.Empty;

    [BsonElement("memberIds")]
    public List<string> MemberIds { get; set; } = new();

    [BsonElement("memberRoles")]
    public Dictionary<string, string> MemberRoles { get; set; } = new();
}

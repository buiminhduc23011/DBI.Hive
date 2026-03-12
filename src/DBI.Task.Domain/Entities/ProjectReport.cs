using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DBI.Task.Domain.Entities;

public class ProjectReport : BaseEntity
{
    [BsonElement("projectId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProjectId { get; set; } = string.Empty;

    [BsonElement("projectName")]
    public string? ProjectName { get; set; }

    [BsonElement("reporterId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ReporterId { get; set; } = string.Empty;

    [BsonElement("reporterName")]
    public string? ReporterName { get; set; }

    [BsonElement("content")]
    public string Content { get; set; } = string.Empty;

    [BsonElement("status")]
    public string Status { get; set; } = "OnTrack"; // OnTrack, AtRisk, Delayed, Completed

    [BsonElement("progressPercentage")]
    public int ProgressPercentage { get; set; }

    [BsonElement("reportDate")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime ReportDate { get; set; } = DateTime.UtcNow;
}

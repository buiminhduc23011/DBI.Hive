using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using DBI.Task.Domain.Enums;

namespace DBI.Task.Domain.Entities;

public class User : BaseEntity
{
    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("username")]
    public string? Username { get; set; }

    [BsonElement("passwordHash")]
    public string PasswordHash { get; set; } = string.Empty;

    [BsonElement("fullName")]
    public string FullName { get; set; } = string.Empty;

    [BsonElement("avatarUrl")]
    public string? AvatarUrl { get; set; }

    [BsonElement("role")]
    [BsonRepresentation(BsonType.String)]
    public UserRole Role { get; set; } = UserRole.Member;

    [BsonElement("lastLoginAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime? LastLoginAt { get; set; }

    [BsonElement("refreshToken")]
    public string? RefreshToken { get; set; }

    [BsonElement("refreshTokenExpiryTime")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime? RefreshTokenExpiryTime { get; set; }

    // User Preferences
    [BsonElement("theme")]
    public string Theme { get; set; } = "light"; // "light" or "dark"

    [BsonElement("language")]
    public string Language { get; set; } = "vi"; // "vi" or "en"
}

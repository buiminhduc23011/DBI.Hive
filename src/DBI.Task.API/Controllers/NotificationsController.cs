using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using DBI.Task.Infrastructure.Data;
using DBI.Task.Application.DTOs;
using System.Security.Claims;

namespace DBI.Task.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly IMongoDbContext _context;

    public NotificationsController(IMongoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async System.Threading.Tasks.Task<IActionResult> GetNotifications([FromQuery] bool unreadOnly = false)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";

        var filterBuilder = Builders<Domain.Entities.Notification>.Filter;
        var filter = filterBuilder.Eq(n => n.UserId, userId);
        
        if (unreadOnly)
            filter = filterBuilder.And(filter, filterBuilder.Eq(n => n.IsRead, false));

        var notifications = await _context.Notifications
            .Find(filter)
            .SortByDescending(n => n.CreatedAt)
            .Limit(50)
            .ToListAsync();

        var notificationDtos = notifications.Select(n => new NotificationDto
        {
            Id = n.Id,
            Title = n.Title,
            Message = n.Message,
            Type = n.Type ?? "general",
            TaskId = n.TaskId,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt
        }).ToList();

        return Ok(notificationDtos);
    }

    [HttpPut("{id}/read")]
    public async System.Threading.Tasks.Task<IActionResult> MarkAsRead(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        
        var filter = Builders<Domain.Entities.Notification>.Filter.And(
            Builders<Domain.Entities.Notification>.Filter.Eq(n => n.Id, id),
            Builders<Domain.Entities.Notification>.Filter.Eq(n => n.UserId, userId)
        );

        var notification = await _context.Notifications.Find(filter).FirstOrDefaultAsync();
        if (notification == null)
            return NotFound();

        var update = Builders<Domain.Entities.Notification>.Update.Set(n => n.IsRead, true);
        await _context.Notifications.UpdateOneAsync(filter, update);

        return NoContent();
    }

    [HttpPut("read-all")]
    public async System.Threading.Tasks.Task<IActionResult> MarkAllAsRead()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        
        var filter = Builders<Domain.Entities.Notification>.Filter.And(
            Builders<Domain.Entities.Notification>.Filter.Eq(n => n.UserId, userId),
            Builders<Domain.Entities.Notification>.Filter.Eq(n => n.IsRead, false)
        );

        var update = Builders<Domain.Entities.Notification>.Update.Set(n => n.IsRead, true);
        await _context.Notifications.UpdateManyAsync(filter, update);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> Delete(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        
        var filter = Builders<Domain.Entities.Notification>.Filter.And(
            Builders<Domain.Entities.Notification>.Filter.Eq(n => n.Id, id),
            Builders<Domain.Entities.Notification>.Filter.Eq(n => n.UserId, userId)
        );

        var result = await _context.Notifications.DeleteOneAsync(filter);
        if (result.DeletedCount == 0)
            return NotFound();

        return NoContent();
    }
}

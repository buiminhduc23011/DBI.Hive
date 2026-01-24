using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using DBI.Task.Infrastructure.Data;
using DBI.Task.Domain.Entities;
using DBI.Task.Application.DTOs;
using System.Security.Claims;

namespace DBI.Task.API.Controllers;

[Authorize]
[ApiController]
[Route("api/tasks/{taskId}/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly IMongoDbContext _context;

    public CommentsController(IMongoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async System.Threading.Tasks.Task<IActionResult> GetComments(string taskId)
    {
        var filter = Builders<Comment>.Filter.Eq(c => c.TaskId, taskId);
        var comments = await _context.Comments
            .Find(filter)
            .SortBy(c => c.CreatedAt)
            .ToListAsync();

        // Get user details for comments
        var userIds = comments.Select(c => c.UserId).Distinct().ToList();
        var usersFilter = Builders<User>.Filter.In(u => u.Id, userIds);
        var users = await _context.Users.Find(usersFilter).ToListAsync();
        var userDict = users.ToDictionary(u => u.Id, u => u);

        var commentDtos = comments.Select(c => {
            userDict.TryGetValue(c.UserId, out var user);
            return new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                TaskId = c.TaskId,
                UserId = c.UserId,
                UserName = user?.FullName ?? c.UserName ?? "Unknown",
                UserAvatar = user?.AvatarUrl ?? c.UserAvatarUrl,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            };
        }).ToList();

        return Ok(commentDtos);
    }

    [HttpPost]
    public async System.Threading.Tasks.Task<IActionResult> CreateComment(string taskId, [FromBody] CreateCommentRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";

        // Get user info for denormalization
        var user = await _context.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        
        var comment = new Comment
        {
            Content = request.Content,
            TaskId = taskId,
            UserId = userId,
            UserName = user?.FullName ?? "Unknown",
            UserAvatarUrl = user?.AvatarUrl,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Comments.InsertOneAsync(comment);

        var commentDto = new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            TaskId = comment.TaskId,
            UserId = comment.UserId,
            UserName = comment.UserName,
            UserAvatar = comment.UserAvatarUrl,
            CreatedAt = comment.CreatedAt
        };

        return CreatedAtAction(nameof(GetComments), new { taskId }, commentDto);
    }

    [HttpDelete("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> DeleteComment(string taskId, string id)
    {
        var filter = Builders<Comment>.Filter.And(
            Builders<Comment>.Filter.Eq(c => c.Id, id),
            Builders<Comment>.Filter.Eq(c => c.TaskId, taskId)
        );

        var comment = await _context.Comments.Find(filter).FirstOrDefaultAsync();
        if (comment == null)
            return NotFound();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
        if (comment.UserId != userId)
            return Forbid();

        await _context.Comments.DeleteOneAsync(filter);

        return NoContent();
    }
}

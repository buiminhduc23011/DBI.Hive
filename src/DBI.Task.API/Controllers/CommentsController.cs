using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    private readonly DBITaskDbContext _context;

    public CommentsController(DBITaskDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async System.Threading.Tasks.Task<IActionResult> GetComments(int taskId)
    {
        var comments = await _context.Comments
            .Include(c => c.User)
            .Where(c => c.TaskId == taskId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                TaskId = c.TaskId,
                UserId = c.UserId,
                UserName = c.User.FullName,
                UserAvatar = c.User.AvatarUrl,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .ToListAsync();

        return Ok(comments);
    }

    [HttpPost]
    public async System.Threading.Tasks.Task<IActionResult> CreateComment(int taskId, [FromBody] CreateCommentRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var comment = new Comment
        {
            Content = request.Content,
            TaskId = taskId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();

        var commentDto = await _context.Comments
            .Include(c => c.User)
            .Where(c => c.Id == comment.Id)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                TaskId = c.TaskId,
                UserId = c.UserId,
                UserName = c.User.FullName,
                UserAvatar = c.User.AvatarUrl,
                CreatedAt = c.CreatedAt
            })
            .FirstAsync();

        return CreatedAtAction(nameof(GetComments), new { taskId }, commentDto);
    }

    [HttpDelete("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> DeleteComment(int taskId, int id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null || comment.TaskId != taskId)
            return NotFound();

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        if (comment.UserId != userId)
            return Forbid();

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

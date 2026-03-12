using MongoDB.Driver;
using DBI.Task.Infrastructure.Data;
using DBI.Task.Infrastructure.Repositories;
using DBI.Task.Domain.Entities;
using DBI.Task.Application.DTOs;

namespace DBI.Task.Application.Services;

public interface IProjectReportService
{
    System.Threading.Tasks.Task<IEnumerable<ProjectReportDto>> GetProjectReportsAsync(string projectId);
    System.Threading.Tasks.Task<ProjectReportDto> CreateProjectReportAsync(CreateProjectReportRequest request, string userId);
    System.Threading.Tasks.Task<ProjectReportDto?> GetLatestProjectReportAsync(string projectId);
}

public class ProjectReportService : IProjectReportService
{
    private readonly IMongoDbContext _context;
    private readonly IRepository<ProjectReport> _reportRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Project> _projectRepository;

    public ProjectReportService(
        IMongoDbContext context,
        IRepository<ProjectReport> reportRepository,
        IRepository<User> userRepository,
        IRepository<Project> projectRepository)
    {
        _context = context;
        _reportRepository = reportRepository;
        _userRepository = userRepository;
        _projectRepository = projectRepository;
    }

    public async System.Threading.Tasks.Task<IEnumerable<ProjectReportDto>> GetProjectReportsAsync(string projectId)
    {
        var reports = await _context.ProjectReports
            .Find(r => r.ProjectId == projectId)
            .SortByDescending(r => r.ReportDate)
            .ToListAsync();

        return reports.Select(r => MapToDto(r)).ToList();
    }

    public async System.Threading.Tasks.Task<ProjectReportDto?> GetLatestProjectReportAsync(string projectId)
    {
        var report = await _context.ProjectReports
            .Find(r => r.ProjectId == projectId)
            .SortByDescending(r => r.ReportDate)
            .FirstOrDefaultAsync();

        return report != null ? MapToDto(report) : null;
    }

    public async System.Threading.Tasks.Task<ProjectReportDto> CreateProjectReportAsync(CreateProjectReportRequest request, string userId)
    {
        var project = await _projectRepository.GetByIdAsync(request.ProjectId);
        var user = await _userRepository.GetByIdAsync(userId);
        
        if (project == null) throw new ArgumentException("Project not found");

        var report = new ProjectReport
        {
            ProjectId = request.ProjectId,
            ProjectName = project.Name,
            ReporterId = userId,
            ReporterName = user?.FullName,
            Content = request.Content,
            Status = request.Status,
            ProgressPercentage = request.ProgressPercentage,
            ReportDate = DateTime.UtcNow
        };

        report = await _reportRepository.AddAsync(report);
        
        // Log activity
        var activityLog = new ActivityLog
        {
            Action = "reported",
            EntityType = "Project",
            EntityId = project.Id,
            Description = $"Submitted progress report: {request.Status} ({request.ProgressPercentage}%)",
            UserId = userId,
            UserName = user?.FullName,
            CreatedAt = DateTime.UtcNow
        };
        await _context.ActivityLogs.InsertOneAsync(activityLog);

        return MapToDto(report);
    }

    private ProjectReportDto MapToDto(ProjectReport report)
    {
        return new ProjectReportDto
        {
            Id = report.Id,
            ProjectId = report.ProjectId,
            ProjectName = report.ProjectName,
            ReporterId = report.ReporterId,
            ReporterName = report.ReporterName,
            Content = report.Content,
            Status = report.Status,
            ProgressPercentage = report.ProgressPercentage,
            ReportDate = report.ReportDate
        };
    }
}

using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace DBI.Task.Infrastructure.Services;

public interface IEmailService
{
    System.Threading.Tasks.Task SendEmailAsync(string to, string subject, string body);
    System.Threading.Tasks.Task SendTaskDeadlineReminderAsync(string userEmail, string taskTitle, DateTime deadline);
    System.Threading.Tasks.Task SendTaskAssignedNotificationAsync(string userEmail, string taskTitle, string assignedBy);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUsername;
    private readonly string _smtpPassword;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
        _smtpServer = _configuration["Email:SmtpServer"] ?? "smtp.gmail.com";
        _smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
        _smtpUsername = _configuration["Email:Username"] ?? "";
        _smtpPassword = _configuration["Email:Password"] ?? "";
        _fromEmail = _configuration["Email:FromEmail"] ?? "noreply@dbi.com";
        _fromName = _configuration["Email:FromName"] ?? "DBI Task";
    }

    public async System.Threading.Tasks.Task SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            using var message = new MailMessage();
            message.From = new MailAddress(_fromEmail, _fromName);
            message.To.Add(new MailAddress(to));
            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = true;

            using var smtpClient = new SmtpClient(_smtpServer, _smtpPort);
            smtpClient.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
            smtpClient.EnableSsl = true;

            await smtpClient.SendMailAsync(message);
        }
        catch (Exception ex)
        {
            // Log error - in production, use proper logging
            Console.WriteLine($"Email sending failed: {ex.Message}");
        }
    }

    public async System.Threading.Tasks.Task SendTaskDeadlineReminderAsync(string userEmail, string taskTitle, DateTime deadline)
    {
        var subject = $"[DBI Task] Reminder: Task '{taskTitle}' deadline approaching";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2 style='color: #1e40af;'>Task Deadline Reminder</h2>
                <p>This is a reminder that your task is due soon:</p>
                <div style='background-color: #f3f4f6; padding: 15px; border-left: 4px solid #1e40af;'>
                    <p><strong>Task:</strong> {taskTitle}</p>
                    <p><strong>Deadline:</strong> {deadline:yyyy-MM-dd HH:mm}</p>
                </div>
                <p>Please ensure to complete this task on time.</p>
                <br>
                <p style='color: #6b7280; font-size: 12px;'>This is an automated message from DBI Task Management System.</p>
            </body>
            </html>
        ";

        await SendEmailAsync(userEmail, subject, body);
    }

    public async System.Threading.Tasks.Task SendTaskAssignedNotificationAsync(string userEmail, string taskTitle, string assignedBy)
    {
        var subject = $"[DBI Task] New task assigned: '{taskTitle}'";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2 style='color: #1e40af;'>New Task Assigned</h2>
                <p>You have been assigned a new task:</p>
                <div style='background-color: #f3f4f6; padding: 15px; border-left: 4px solid #10b981;'>
                    <p><strong>Task:</strong> {taskTitle}</p>
                    <p><strong>Assigned by:</strong> {assignedBy}</p>
                </div>
                <p>Please check your DBI Task dashboard for more details.</p>
                <br>
                <p style='color: #6b7280; font-size: 12px;'>This is an automated message from DBI Task Management System.</p>
            </body>
            </html>
        ";

        await SendEmailAsync(userEmail, subject, body);
    }
}

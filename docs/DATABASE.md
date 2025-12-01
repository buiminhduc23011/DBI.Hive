# Database Schema - DBI Task

## Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Project   │────────>│   Sprint    │────────>│  TaskItem   │
└─────────────┘         └─────────────┘         └─────────────┘
      │                                                  │
      │                                                  │
      │                                          ┌───────┴───────┐
      │                                          │               │
      │                                          v               v
      │                                  ┌─────────────┐ ┌─────────────┐
      │                                  │   Comment   │ │ Attachment  │
      │                                  └─────────────┘ └─────────────┘
      │                                          │               │
      │                                          │               │
      │                                          v               v
      │                                      ┌──────────────────────┐
      └─────────────────────────────────────>│        User          │
                                              └──────────────────────┘
                                                       │
                                               ┌───────┴────────┐
                                               v                v
                                      ┌─────────────┐  ┌─────────────┐
                                      │Notification │  │ActivityLog  │
                                      └─────────────┘  └─────────────┘
```

## Tables

### Users
Core user information and authentication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | int | PK, Identity | Primary key |
| Email | nvarchar(255) | NOT NULL, Unique | User email (login) |
| PasswordHash | nvarchar(MAX) | NOT NULL | Hashed password |
| FullName | nvarchar(255) | NOT NULL | Display name |
| AvatarUrl | nvarchar(500) | NULL | Profile picture URL |
| Role | int | NOT NULL | 0=Viewer, 1=Member, 2=Admin |
| RefreshToken | nvarchar(MAX) | NULL | JWT refresh token |
| RefreshTokenExpiryTime | datetime2 | NULL | Token expiry |
| CreatedAt | datetime2 | NOT NULL | Registration date |
| LastLoginAt | datetime2 | NULL | Last login timestamp |

### Projects
Container for tasks and sprints.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | int | PK, Identity | Primary key |
| Name | nvarchar(255) | NOT NULL | Project name |
| Description | nvarchar(MAX) | NULL | Project description |
| Color | nvarchar(20) | NULL | UI color (hex) |
| IsArchived | bit | NOT NULL, Default: 0 | Archive status |
| CreatedAt | datetime2 | NOT NULL | Creation date |
| UpdatedAt | datetime2 | NULL | Last update |

### Sprints
Organize tasks by time periods or phases.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | int | PK, Identity | Primary key |
| Name | nvarchar(255) | NOT NULL | Sprint name |
| Description | nvarchar(MAX) | NULL | Sprint description |
| ProjectId | int | FK → Projects | Parent project |
| StartDate | datetime2 | NOT NULL | Sprint start |
| EndDate | datetime2 | NOT NULL | Sprint end |
| IsActive | bit | NOT NULL, Default: 0 | Active status |
| CreatedAt | datetime2 | NOT NULL | Creation date |

### Tasks
Individual work items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | int | PK, Identity | Primary key |
| Title | nvarchar(500) | NOT NULL | Task title |
| Description | nvarchar(MAX) | NULL | Detailed description |
| Status | int | NOT NULL, Default: 0 | 0=Todo, 1=InProgress, 2=Review, 3=Done, 4=Backlog |
| Priority | int | NOT NULL, Default: 1 | 0=Low, 1=Medium, 2=High, 3=Critical |
| ProjectId | int | FK → Projects | Parent project |
| SprintId | int | FK → Sprints, NULL | Associated sprint |
| AssignedToId | int | FK → Users, NULL | Assigned user |
| Deadline | datetime2 | NULL | Due date |
| OrderIndex | int | NOT NULL | Kanban board order |
| CreatedAt | datetime2 | NOT NULL | Creation date |
| UpdatedAt | datetime2 | NULL | Last update |
| CompletedAt | datetime2 | NULL | Completion timestamp |

### Comments
Task discussions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | int | PK, Identity | Primary key |
| Content | nvarchar(MAX) | NOT NULL | Comment text |
| TaskId | int | FK → Tasks | Parent task |
| UserId | int | FK → Users | Comment author |
| CreatedAt | datetime2 | NOT NULL | Posted date |
| UpdatedAt | datetime2 | NULL | Edit timestamp |

### Attachments
File uploads for tasks.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | int | PK, Identity | Primary key |
| FileName | nvarchar(255) | NOT NULL | Original filename |
| FilePath | nvarchar(1000) | NOT NULL | Storage path |
| FileSize | bigint | NOT NULL | Size in bytes |
| ContentType | nvarchar(100) | NOT NULL | MIME type |
| TaskId | int | FK → Tasks | Parent task |
| UploadedById | int | FK → Users | Uploader |
| UploadedAt | datetime2 | NOT NULL | Upload timestamp |

### Notifications
In-app and email notifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | int | PK, Identity | Primary key |
| Title | nvarchar(255) | NOT NULL | Notification title |
| Message | nvarchar(MAX) | NOT NULL | Full message |
| UserId | int | FK → Users | Recipient |
| TaskId | int | FK → Tasks, NULL | Related task |
| IsRead | bit | NOT NULL, Default: 0 | Read status |
| CreatedAt | datetime2 | NOT NULL | Sent timestamp |

### ActivityLogs
Audit trail for actions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | int | PK, Identity | Primary key |
| Action | nvarchar(50) | NOT NULL | Action type (created, updated, deleted, moved) |
| EntityType | nvarchar(50) | NOT NULL | Entity type (Task, Project, Comment) |
| EntityId | int | NOT NULL | Entity ID |
| Description | nvarchar(MAX) | NULL | Human-readable description |
| UserId | int | FK → Users | Actor |
| CreatedAt | datetime2 | NOT NULL | Action timestamp |

## Indexes

Recommended indexes for performance:

- `Users`: `IX_Users_Email` (unique)
- `Tasks`: `IX_Tasks_ProjectId`, `IX_Tasks_AssignedToId`, `IX_Tasks_Status`, `IX_Tasks_Deadline`
- `Comments`: `IX_Comments_TaskId`
- `Notifications`: `IX_Notifications_UserId_IsRead`
- `ActivityLogs`: `IX_ActivityLogs_EntityType_EntityId`

## Foreign Key Relationships

- **Tasks → Projects**: ON DELETE RESTRICT
- **Tasks → Sprints**: ON DELETE SET NULL
- **Tasks → Users (AssignedTo)**: ON DELETE SET NULL
- **Comments → Tasks**: ON DELETE CASCADE
- **Comments → Users**: ON DELETE RESTRICT
- **Attachments → Tasks**: ON DELETE CASCADE
- **Notifications → Tasks**: ON DELETE CASCADE
- **ActivityLogs → Users**: ON DELETE RESTRICT

## Sample Data Size Estimates

For 100 users, 50 projects, 500 tasks:
- Users: ~50 KB
- Projects: ~20 KB
- Sprints: ~30 KB
- Tasks: ~500 KB
- Comments: ~1 MB (assuming 5 comments per task)
- Attachments: variable (metadata only)
- Notifications: ~200 KB
- ActivityLogs: ~500 KB

**Total estimated database size**: ~2.5 MB (excluding file attachments)

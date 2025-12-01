# DBI Task API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All endpoints except `/auth/*` require JWT authentication.

**Header:**
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "dGVzdC4uLg==",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "Member"
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Refresh Token
```http
POST /auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "dGVzdC4uLg=="
}
```

---

## Project Endpoints

### Get All Projects
```http
GET /projects?includeArchived=false
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Website Redesign",
    "description": "Redesign company website",
    "color": "#1e40af",
    "taskCount": 15,
    "completedTaskCount": 8,
    "isArchived": false,
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### Get Project by ID
```http
GET /projects/{id}
```

### Create Project
```http
POST /projects
```

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "color": "#3b82f6"
}
```

### Update Project
```http
PUT /projects/{id}
```

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "isArchived": false
}
```

### Delete Project
```http
DELETE /projects/{id}
```

---

## Task Endpoints

### Get Tasks with Filtering
```http
GET /tasks?projectId=1&status=0&assignedToId=2
```

**Query Parameters:**
- `projectId` (int, optional)
- `sprintId` (int, optional)
- `assignedToId` (int, optional)
- `status` (int, optional) - 0: Todo, 1: InProgress, 2: Review, 3: Done, 4: Backlog
- `priority` (int, optional) - 0: Low, 1: Medium, 2: High, 3: Critical
- `deadlineFrom` (datetime, optional)
- `deadlineTo` (datetime, optional)
- `searchText` (string, optional)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Implement login feature",
    "description": "Create JWT-based authentication",
    "status": 1,
    "priority": 2,
    "projectId": 1,
    "projectName": "Website Redesign",
    "assignedToId": 2,
    "assignedToName": "John Doe",
    "deadline": "2024-02-01T00:00:00Z",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### Get Task by ID
```http
GET /tasks/{id}
```

### Get Backlog Tasks
```http
GET /tasks/backlog?projectId=1
```

### Create Task
```http
POST /tasks
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "projectId": 1,
  "sprintId": 1,
  "assignedToId": 2,
  "priority": 1,
  "deadline": "2024-02-15T00:00:00Z"
}
```

### Update Task
```http
PUT /tasks/{id}
```

**Request Body:**
```json
{
  "title": "Updated Task Title",
  "status": 2,
  "priority": 3
}
```

### Delete Task
```http
DELETE /tasks/{id}
```

---

## Dashboard Endpoint

### Get Dashboard Data
```http
GET /dashboard?myTasksOnly=false
```

**Response:**
```json
{
  "totalProjects": 5,
  "totalTasks": 45,
  "completedTasks": 20,
  "overdueTasks": 3,
  "dueTodayTasks": 5,
  "dueThisWeekTasks": 12,
  "recentTasks": [...],
  "overdueTasks": [...],
  "projectProgress": [...]
}
```

---

## Comment Endpoints

### Get Task Comments
```http
GET /tasks/{taskId}/comments
```

### Create Comment
```http
POST /tasks/{taskId}/comments
```

**Request Body:**
```json
{
  "content": "This is a comment"
}
```

### Delete Comment
```http
DELETE /tasks/{taskId}/comments/{id}
```

---

## Notification Endpoints

### Get Notifications
```http
GET /notifications?unreadOnly=true
```

### Mark as Read
```http
PUT /notifications/{id}/read
```

### Mark All as Read
```http
PUT /notifications/read-all
```

---

## Error Responses

All endpoints may return these error codes:

**400 Bad Request:**
```json
{
  "message": "Validation error description"
}
```

**401 Unauthorized:**
```json
{
  "message": "Invalid credentials"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "An error occurred"
}
```

---

## Rate Limiting

Not implemented yet. Consider adding in production.

## Pagination

Not implemented yet. All list endpoints return full results.

## Webhooks

Webhook endpoints are defined but not yet fully implemented:

```http
POST /webhooks/task-created
POST /webhooks/task-updated
POST /webhooks/task-completed
```

For DBI ecosystem integration.

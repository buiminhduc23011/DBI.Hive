# DBI Task

A modern task management system for team collaboration, using ASP.NET Core 8 and React 19.

[![Version](https://img.shields.io/badge/Version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()
[![.NET](https://img.shields.io/badge/.NET-8.0-purple)]()
[![React](https://img.shields.io/badge/React-19-61DAFB)]()

## Features

| Feature | Description |
|---------|-------------|
| **Kanban Board** | Visual agile task management with drag & drop |
| **Backlog & Sprints** | Organize work items by sprints and phases |
| **Calendar View** | Schedule and visualize task deadlines |
| **Dashboard** | Real-time overview of project progress and stats |
| **Collaboration** | Comments, file attachments, and activity logs |
| **Personalization** | Dark/Light mode, English/Vietnamese (i18n) support |
| **Notifications** | Email alerts and in-app reminders |
| **Security** | Role-based (Admin/Member/Viewer) & JWT Authentication |

## Architecture

The project follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles:

```
DBI.Hive/
├── src/
│   ├── DBI.Task.Domain/           # Core Entities (Project, Task, Sprint, User)
│   ├── DBI.Task.Application/      # DTOs, CQRS, Interfaces, Business Logic
│   ├── DBI.Task.Infrastructure/   # MongoDB Context, Repositories, Services
│   └── DBI.Task.API/              # REST Controllers, Middleware, SignalR
├── client/                         # React SPA (Vite + TypeScript + Tailwind)
├── deploy/                         # Automated deployment scripts for Windows
├── docs/                           # Technical documentation
└── docker-compose.yml              # Container orchestration
```

## Tech Stack

**Backend**
- **Framework:** ASP.NET Core 8.0 Web API
- **Database:** MongoDB
- **Auth:** JWT with Refresh Tokens
- **Mail:** SMTP (Gmail/Custom)

**Frontend**
- **Core:** React 19, TypeScript, Vite
- **State:** Zustand
- **UI:** TailwindCSS, Lucide Icons
- **Drag & Drop:** dnd-kit

**DevOps**
- Docker & Docker Compose
- Windows PowerShell Automation

## Quick Start

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) or Docker

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/DBI.Hive.git
cd DBI.Hive

# Configure environment
cp .env.example .env

# Start services
docker-compose up -d
```

- **Frontend:** `http://localhost:3000`
- **API Swagger:** `http://localhost:5000/swagger`

### Option 2: Local Development

**Backend:**
```bash
cd src/DBI.Task.API
dotnet restore
dotnet run
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

### Option 3: Windows Deployment

Automated deployment on Windows Server via PowerShell:

```powershell
cd deploy
.\install.ps1
```

See [WINDOWS_DEPLOYMENT.md](docs/WINDOWS_DEPLOYMENT.md) for full details.

## Configuration

| Setting | Environment Variable | Default |
|---------|----------------------|---------|
| Database Connection | `MongoDB__ConnectionString` | `mongodb://localhost:27017` |
| Database Name | `MongoDB__DatabaseName` | `DBITaskDB` |
| JWT Secret | `Jwt__Secret` | *(Set in .env)* |
| SMTP Server | `Email__SmtpServer` | `smtp.gmail.com` |

## Documentation

- [API Reference](docs/API.md) - Endpoints and schemas.
- [Database Schema](docs/DATABASE.md) - MongoDB collections structure.
- [Deployment Guide](docs/DEPLOYMENT.md) - Docker/Linux deployment.
- [Windows Deployment](docs/WINDOWS_DEPLOYMENT.md) - IIS/Windows Service guide.

## Roadmap

- [ ] Real-time updates with SignalR
- [ ] Advanced Gantt Chart
- [ ] Mobile App (React Native)
- [ ] Time Tracking & Reporting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**DBI Team** - Built for high-performance collaboration.
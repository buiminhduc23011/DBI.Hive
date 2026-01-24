# DBI Task - Task Management System

A modern, full-stack task management application for the DBI ecosystem, built with ASP.NET Core and React.

![DBI Task](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

### Core Functionality
- **Project Management** - Organize tasks by projects and sprints/phases
- **Kanban Board** - Visual task management with drag & drop
- **Backlog Management** - Store and prioritize pending tasks
- **Dashboard** - Real-time overview of tasks, deadlines, and progress
- **Task Filtering** - Advanced filtering by project, assignee, status, priority, and deadline
- **Comments & Attachments** - Collaborate with team members
- **Notifications** - Email and in-app notifications for deadlines and assignments
- **Activity Logging** - Track all changes and actions
- **Timeline View** - Visualize project schedules

### Technical Features
- **JWT Authentication** with refresh tokens
- **Role-based Access Control** (Admin, Member, Viewer)
- **RESTful API** with Swagger documentation
- **Background Jobs** for automatic notifications
- **Webhook Infrastructure** for DBI ecosystem integration
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🏗️ Tech Stack

### Backend
- **ASP.NET Core 8.0** - Web API framework
- **MongoDB** - NoSQL Database
- **MongoDB.Driver** - Database driver
- **JWT** - Authentication
- **SMTP** - Email notifications

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **dnd-kit** - Drag & drop
- **Axios** - HTTP client
- **Lucide React** - Icons

### DevOps
- **Docker** & **Docker Compose**
- **Nginx** - Reverse proxy for frontend

## 📁 Project Structure

```
DBI.Hive/
├── src/
│   ├── DBI.Task.Domain/          # Domain entities and enums
│   ├── DBI.Task.Infrastructure/  # Data access and services
│   ├── DBI.Task.Application/     # Business logic and DTOs
│   └── DBI.Task.API/             # REST API controllers
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page components
│   │   ├── stores/               # Zustand stores
│   │   └── services/             # API services
│   └── public/
├── docs/                          # Documentation
├── docker-compose.yml             # Container orchestration
└── DBI.Task.sln                  # Solution file
```

## 🚀 Quick Start

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional)

### Option 1: Run with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/DBI.Hive.git
   cd DBI.Hive
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000
   - Swagger UI: http://localhost:5000/swagger

### Option 2: Run Locally

#### Backend
```bash
cd src/DBI.Task.API
dotnet restore
dotnet ef database update
dotnet run
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

## 📦 Database Migration

Create and apply migrations:

```bash
cd src/DBI.Task.API
dotnet ef migrations add InitialCreate --project ../DBI.Task.Infrastructure
dotnet ef database update
```

## 🔑 Default Credentials

After first run, register a new account or use seed data (if implemented).

## 📚 API Documentation

Once the API is running, visit:
- Swagger UI: `http://localhost:5000/swagger`
- See [docs/API.md](docs/API.md) for detailed endpoint documentation

## 🎨 UI Screenshots

### Dashboard
![Dashboard](docs/images/dashboard.png)

### Kanban Board
![Kanban](docs/images/kanban.png)

## 🧪 Testing

### Backend Tests
```bash
cd src/DBI.Task.API
dotnet test
```

### Frontend Tests
```bash
cd client
npm test
```

## 🌍 Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment guides:
- Ubuntu VPS
- Azure App Service
- AWS ECS

## 🔧 Configuration

### Email Notifications
Configure SMTP settings in `appsettings.json` or environment variables:
```json
{
  "Email": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": "587",
    "Username": "your-email@gmail.com",
    "Password": "your-app-password"
  }
}
```

### JWT Settings
```json
{
  "Jwt": {
    "Secret": "your-secret-key-min-32-characters",
    "Issuer": "DBI.Task.API",
    "Audience": "DBI.Task.Client",
    "ExpiryMinutes": "60"
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Timeline/Gantt view is a placeholder - full implementation pending
- File upload size limited to 10MB

## 🗺️ Roadmap

- [ ] Real-time collaboration with SignalR
- [ ] Advanced Gantt chart view
- [ ] Mobile app (React Native)
- [ ] MS Teams integration
- [ ] Advanced reporting and analytics
- [ ] Task templates
- [ ] Time tracking

## 💬 Support

For questions or issues:
- Open an issue on GitHub
- Contact: support@dbi.com

## 👏 Acknowledgments

- Built with ❤️ for the DBI ecosystem
- Icons by [Lucide](https://lucide.dev/)
- UI inspired by modern task management tools

---

**Made with ❤️ by DBI Team**
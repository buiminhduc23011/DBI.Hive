# DBI Task - Quick Start Guide

## ✅ BUILD SUCCESSFUL!

Chúc mừng! Tất cả namespace conflicts đã được sửa và project build thành công!

## 🚀 Chạy Dự Án

### 1. Setup Database

Tạo và chạy migration đầu tiên:

```bash
# Đã tạo migration InitialCreate
# Cập nhật database
cd src/DBI.Task.API
dotnet ef database update
```

### 2. Chạy Backend API

```bash
cd src/DBI.Task.API
dotnet run
```

API sẽ chạy tại: `http://localhost:5000`
Swagger UI: `http://localhost:5000/swagger`

### 3. Chạy Frontend

Mở terminal mới:

```bash
cd client
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 4. Hoặc Chạy với Docker

```bash
# Copy environment file
cp .env.example .env
# Chỉnh sửa .env nếu cần

# Start all services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📊 Test Ứng Dụng

### Đăng Ký User Đầu Tiên

1. Mở browser tại `http://localhost:3000`
2. Click "Sign up"
3. Nhập thông tin đăng ký
4. Đăng nhập

### Tạo Project và Tasks

1. Navigate to "Projects"
2. Create new project
3. Add tasks
4. Drag tasks between columns in Kanban board

## 🔧 Configuration

### Email Notifications

Chỉnh sửa `src/DBI.Task.API/appsettings.json`:

```json
{
  "Email": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": "587",
    "Username": "your-email@gmail.com",
    "Password": "your-app-password",
    "FromEmail": "noreply@dbi.com"
  }
}
```

### JWT Settings

```json
{
  "Jwt": {
    "Secret": "Change_This_To_A_Secure_Secret_Key_At_Least_32_Characters_Long",
    "ExpiryMinutes": "60"
  }
}
```

## 📝 API Endpoints

Xem documentation đầy đủ tại: `docs/API.md`

Key endpoints:
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/dashboard` - Dashboard data
- `GET /api/projects` - Danh sách projects
- `GET /api/tasks` - Danh sách tasks (với filter)
- `PUT /api/tasks/{id}` - Update task (move trong Kanban)

## 🎯 Tính Năng Đã Hoàn Thành

✅ Complete authentication với JWT + Refresh Token
✅ Project management
✅ Task CRUD với advanced filtering
✅ Kanban board với drag & drop
✅ Dashboard với metrics và progress tracking
✅ Email notifications (cần config SMTP)
✅ Background jobs cho deadline reminders
✅ Activity logging
✅ Comments system  
✅ Role-based access control
✅ Docker containerization
✅ Comprehensive documentation

## 🐛 Known Issues & Next Steps

### Tính năng còn cảnhoàn thiện:
- Sprint management UI (backend ready)
- File upload/download endpoints
- Advanced timeline/Gantt view
- Real-time notifications với SignalR
- Unit tests

### Security Notes:
- ⚠️ Thay đổi JWT Secret trong production
- ⚠️ Sử dụng BCrypt cho password hashing trong production (hiện tại dùng SHA256)
- ⚠️ Configure HTTPS cho production

## 📚 Documentation

- `README.md` - Tổng quan dự án
- `docs/API.md` - API endpoints documentation
- `docs/DATABASE.md` - Database schema
- `docs/DEPLOYMENT.md` - Deployment guides
- `PROJECT_STATUS.md` - Project status và architecture

## 💡 Tips

1. **Development Mode**: Sử dụng `dotnet watch run` để auto-reload API
2. **Database Reset**: `dotnet ef database drop` sau đó `dotnet ef database update`
3. **View Database**: Sử dụng SQL Server Management Studio hoặc Azure Data Studio
4. **Frontend Dev**: `npm run dev` có HMR (Hot Module Replacement)

## 🎉 Chúc Mừng!

Dự án DBI Task đã sẵn sàng để phát triển và deploy!

---

**Tạo bởi**: Antigravity AI
**Ngày**: 2024-12-01
**Version**: 1.0.0

# 🎯 Tài Khoản Mặc Định & Sample Data

## ✅ Database Seeder Đã Tạo!

Dự án đã được tích hợp **automatic database seeding** khi khởi động.

## 👤 Tài Khoản Mặc Định

### Admin Account
```
Email: admin@dbi.com
Password: Admin@123
Role: Admin
```

### Demo Account
```
Email: demo@dbi.com
Password: Demo@123
Role: Member
```

## 📊 Sample Data Được Tạo

### Projects (2)
1. **DBI Task Application** - Main project
2. **Mobile App Development** - Secondary project

### Sprint (1)
- **Sprint 1 - Foundation** (đang active)

### Tasks (8)
- ✅ 2 tasks hoàn thành (Done)
- 🔄 2 tasks đang làm (In Progress)
- 👀 1 task đang review (Review)
- 📝 2 tasks chưa bắt đầu (Todo)
- 📦 1 task trong backlog (Backlog)

### Comments & Notifications
- Sample comments trên tasks
- Welcome notification cho demo user

## 🚀 Cách Sử Dụng

### 1. Start Backend
```bash
cd src/DBI.Task.API
dotnet run
```

Khi start, backend sẽ **tự động**:
1. ✅ Apply database migrations
2. ✅ Seed dữ liệu nếu database trống
3. ✅ In ra console thông tin accounts

### 2. Login và Test

Mở http://localhost:3000 và:

1. **Login với Admin:**
   - Email: `admin@dbi.com`
   - Password: `Admin@123`
   - Xem dashboard với metrics
   - Test full CRUD operations

2. **Login với Demo:**
   - Email: `demo@dbi.com`
   - Password: `Demo@123`
   - Xem tasks được assign
   - Test Kanban board

## 📝 Console Output Khi Seed

```
✅ Database seeded successfully!
📧 Admin: admin@dbi.com | Password: Admin@123
📧 Demo: demo@dbi.com | Password: Demo@123
```

## 🔄 Reset Database

Nếu muốn reset và seed lại:

```bash
cd src/DBI.Task.API
dotnet ef database drop
dotnet run
# Database sẽ tự động migrate và seed lại
```

## 🎨 Test Scenarios

### Dashboard
- Login với admin để xem metrics đầy đủ
- 2 projects, 8 tasks
- Progress bars cho mỗi project

### Kanban Board
- Drag tasks giữa các columns
- 4 columns: Todo → In Progress → Review → Done
- Tasks với different priorities

### Backlog
- 1 task trong backlog
- Test move từ backlog vào sprint

**Tất cả đã sẵn sàng! Chỉ cần start backend và login! 🎉**

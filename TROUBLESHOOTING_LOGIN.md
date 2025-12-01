# 🔍 Troubleshooting: Login Failed

## Checklist Kiểm Tra:

### 1. ✅ Backend Đang Chạy?
Kiểm tra terminal backend xem có log này không:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
```

Nếu chưa chạy:
```bash
cd src/DBI.Task.API
dotnet run
```

### 2. ✅ Database Đã Được Seeded?
Khi backend khởi động, phải thấy log:
```
✅ Database seeded successfully!
📧 Admin: admin@dbi.com | Password: Admin@123
📧 Demo: demo@dbi.com | Password: Demo@123
```

**Nếu KHÔNG thấy** → Database chưa có data!

#### Fix: Reset Database
```bash
cd src/DBI.Task.API

# Drop database
dotnet ef database drop --force

# Apply migrations và auto-seed
dotnet run
```

### 3. ✅ Kiểm Tra Response Từ API

Mở **Browser Console** (F12) → Tab **Network** → Thử login lại

Xem response của `/api/auth/login`:
- **200**: Login thành công
- **400**: Validation error (email/password format)
- **401**: Invalid credentials (sai email/password)
- **500**: Server error (database connection issue)

### 4. ✅ Test API Trực Tiếp

Dùng Swagger hoặc Postman test:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@dbi.com",
  "password": "Admin@123"
}
```

Response phải có dạng:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "...",
  "user": {
    "id": 1,
    "email": "admin@dbi.com",
    "fullName": "DBI Administrator",
    "role": "Admin"
  }
}
```

### 5. ✅ Kiểm Tra Connection String

File: `src/DBI.Task.API/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=DBITaskDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;"
  }
}
```

Đảm bảo:
- SQL Server đang chạy
- Password đúng
- Database name: `DBITaskDB`

### 6. ✅ Xem Backend Logs

Trong terminal backend, xem có error nào không:
- Database connection errors
- Migration errors
- Authentication errors

## 🚀 Quick Fix - Recommended:

```bash
# Terminal 1 - Reset database và start backend
cd src/DBI.Task.API
dotnet ef database drop --force
dotnet run
# Đợi thấy "Database seeded successfully!"

# Terminal 2 - Restart frontend
cd client
# Ctrl+C để stop
npm run dev

# Browser
# Mở http://localhost:3000
# Login: admin@dbi.com / Admin@123
```

## 📝 Response Status Meanings:

| Status | Meaning | Solution |
|--------|---------|----------|
| 200 | ✅ Success | Should work! |
| 400 | ❌ Bad Request | Check email/password format |
| 401 | ❌ Unauthorized | Wrong credentials or user doesn't exist |
| 500 | ❌ Server Error | Check backend logs & database |

## 💡 Most Common Issue:

**Database chưa có users!**

Solution:
```bash
cd src/DBI.Task.API
dotnet ef database drop --force
dotnet run
```

Chờ thấy "Database seeded successfully!" trong console!

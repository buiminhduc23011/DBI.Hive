# 🎯 Backend Port Fixed!

## Vấn Đề:
Backend chạy ở port ngẫu nhiên (59863, 59864) thay vì port 5000.

## Đã Fix:
Created `launchSettings.json` để fix port về 5000.

## 🔄 RESTART Backend:

```bash
# Stop backend hiện tại (Ctrl+C)
cd src/DBI.Task.API
dotnet run --launch-profile http
```

Hoặc đơn giản:
```bash
dotnet run
```

## ✅ Sau Khi Restart:

Bạn sẽ thấy:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
```

## 📝 URLs:

- **API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger
- **Frontend**: http://localhost:3000

## 🔍 Kiểm Tra Database Seeding:

Khi backend start, nếu database trống, bạn sẽ thấy:
```
✅ Database seeded successfully!
📧 Admin: admin@dbi.com | Password: Admin@123
📧 Demo: demo@dbi.com | Password: Demo@123
```

Nếu database đã có data, không thấy message (normal).

## 🧪 Test:

1. **Mở Swagger**: http://localhost:5000/swagger
2. **Test Login Endpoint**:
   - Expand `POST /api/auth/login`
   - Click "Try it out"
   - Body:
     ```json
     {
       "email": "admin@dbi.com",
       "password": "Admin@123"
     }
     ```
   - Execute

3. **Frontend Login**: http://localhost:3000

**Restart backend và mọi thứ sẽ OK! 🚀**

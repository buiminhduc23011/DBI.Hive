# Windows Deployment Guide - DBI Task

Hướng dẫn deploy DBI Task trên máy Windows.

## Prerequisites (Yêu cầu)

- **Windows 10/11 Pro** hoặc **Windows Server 2019+** (cần Hyper-V)
- **Docker Desktop for Windows** (WSL2 backend)
- **Git** (để clone repository)

---

## Option 1: Docker Compose (Khuyên dùng)

### Bước 1: Cài đặt Docker Desktop

1. Tải Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Cài đặt và khởi động lại máy
3. Mở Docker Desktop và đảm bảo engine đang chạy

### Bước 2: Clone và cấu hình

```powershell
# Clone repository
git clone https://github.com/yourusername/DBI.Hive.git
cd DBI.Hive

# Tạo file cấu hình
Copy-Item .env.example .env

# Chỉnh sửa file .env (thay đổi passwords, SMTP, etc.)
notepad .env
```

### Bước 3: Khởi động services

```powershell
# Build và start tất cả services
docker-compose up -d --build

# Kiểm tra status
docker-compose ps

# Xem logs
docker-compose logs -f
```

### Bước 4: Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000
- **API Docs**: http://localhost:5000/swagger

### Bước 5: Dừng services

```powershell
docker-compose down

# Xóa cả data (cẩn thận!)
docker-compose down -v
```

---

## Option 2: Chạy thủ công (Không dùng Docker)

### Bước 1: Cài đặt dependencies

1. **.NET 8 SDK**: https://dotnet.microsoft.com/download/dotnet/8.0
2. **Node.js 18+**: https://nodejs.org/
3. **MongoDB Community Server**: https://www.mongodb.com/try/download/community

### Bước 2: Cấu hình MongoDB

```powershell
# Tạo thư mục data
mkdir C:\data\db

# Khởi động MongoDB (hoặc chạy như Windows Service)
mongod --dbpath C:\data\db
```

### Bước 3: Chạy Backend API

```powershell
cd src\DBI.Task.API

# Restore packages
dotnet restore

# Cấu hình appsettings.json hoặc dùng User Secrets
dotnet user-secrets set "MongoDB:ConnectionString" "mongodb://localhost:27017"
dotnet user-secrets set "MongoDB:DatabaseName" "DBITaskDB"
dotnet user-secrets set "Jwt:Secret" "DBI_Task_Secret_Key_Min_32_Characters_Required"

# Chạy API
dotnet run --urls "http://localhost:5000"
```

### Bước 4: Chạy Frontend

```powershell
cd client

# Cài đặt packages
npm install

# Chạy development server
npm run dev

# Hoặc build production
npm run build
npm run preview
```

---

## Cấu hình Windows Firewall

Mở ports cho phép truy cập từ network:

```powershell
# Mở port cho Frontend
netsh advfirewall firewall add rule name="DBI-Task-Web" dir=in action=allow protocol=TCP localport=3000

# Mở port cho API
netsh advfirewall firewall add rule name="DBI-Task-API" dir=in action=allow protocol=TCP localport=5000

# Mở port cho MongoDB (nếu cần remote access)
netsh advfirewall firewall add rule name="MongoDB" dir=in action=allow protocol=TCP localport=27017
```

---

## Chạy như Windows Service

### Sử dụng NSSM (Non-Sucking Service Manager)

1. Tải NSSM: https://nssm.cc/download
2. Giải nén và thêm vào PATH

```powershell
# Cài đặt API như service
nssm install DBI-Task-API "C:\Program Files\dotnet\dotnet.exe" "run --urls http://localhost:5000"
nssm set DBI-Task-API AppDirectory "C:\path\to\DBI.Hive\src\DBI.Task.API"
nssm start DBI-Task-API

# Cài đặt Frontend (serve build folder)
npm install -g serve
nssm install DBI-Task-Web "serve" "-s dist -l 3000"
nssm set DBI-Task-Web AppDirectory "C:\path\to\DBI.Hive\client"
nssm start DBI-Task-Web
```

---

## Troubleshooting

### Docker không start
- Kiểm tra Hyper-V đã bật: `bcdedit /set hypervisorlaunchtype auto`
- Khởi động lại máy

### Port đã được sử dụng
```powershell
# Tìm process đang dùng port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <pid> /F
```

### MongoDB connection refused
- Kiểm tra MongoDB service: `Get-Service MongoDB`
- Kiểm tra firewall rules

### API không kết nối được database
- Verify connection string trong `appsettings.json`
- Đảm bảo MongoDB đang chạy trên đúng port

---

## Ports sử dụng

| Service  | Port  | Mô tả            |
|----------|-------|------------------|
| Frontend | 3000  | React App (Nginx)|
| API      | 5000  | ASP.NET Core API |
| MongoDB  | 27017 | Database         |

---

## Default Accounts

Sau khi deploy, tài khoản mặc định:
- **Username**: `admin`
- **Password**: Xem trong `DbSeeder.cs`

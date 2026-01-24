# DBI Task - Windows Deployment Package

Đây là thư mục chứa các scripts để deploy DBI Task lên máy Windows.

## Cách sử dụng

1. Copy toàn bộ thư mục `deploy` sang máy đích
2. Mở PowerShell với quyền Administrator
3. Chạy: `.\install.ps1`

## Cấu trúc

```
deploy/
├── install.ps1           # Script cài đặt chính (chạy 1 lần)
├── uninstall.ps1         # Gỡ cài đặt
├── config.ps1            # Cấu hình (ports, paths)
├── tools/
│   └── nssm.exe          # Service manager
├── api/                  # Published .NET API
├── web/                  # Built React frontend
└── mongodb/              # MongoDB portable (optional)
```

## Yêu cầu máy đích

- Windows 10/11 hoặc Windows Server 2019+
- .NET 8 Runtime (script sẽ tự cài nếu chưa có)
- Node.js không cần thiết (frontend đã build sẵn)

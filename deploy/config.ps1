# ============================================
# DBI Task - Configuration
# ============================================

# Đường dẫn cài đặt
$global:InstallPath = "C:\DBI-Task"

# Ports
$global:ApiPort = 5000
$global:WebPort = 3000
$global:MongoPort = 27017

# MongoDB
$global:MongoDataPath = "$InstallPath\mongodb\data"
$global:MongoVersion = "7.0.5"

# Service names
$global:ApiServiceName = "DBI-Task-API"
$global:WebServiceName = "DBI-Task-Web"
$global:MongoServiceName = "DBI-Task-MongoDB"

# API Configuration
$global:JwtSecret = "DBI_Task_Secret_Key_Min_32_Characters_Required_For_Security_$(Get-Random)"
$global:MongoConnectionString = "mongodb://localhost:$MongoPort"
$global:DatabaseName = "DBITaskDB"

# Logging
$global:LogPath = "$InstallPath\logs"

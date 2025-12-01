# Deployment Guide - DBI Task

This guide covers deployment options for the DBI Task application.

## Table of Contents
1. [Docker Deployment (Any Platform)](#docker-deployment)
2. [Ubuntu VPS Deployment](#ubuntu-vps-deployment)
3. [Azure Deployment](#azure-deployment)
4. [AWS Deployment](#aws-deployment)

---

## Docker Deployment

The easiest way to deploy DBI Task on any platform.

### Prerequisites
- Docker Engine 20+
- Docker Compose 2+

### Steps

1. **Clone and configure:**
   ```bash
   git clone https://github.com/yourusername/DBI.Hive.git
   cd DBI.Hive
   cp .env.example .env
   nano .env  # Edit configuration
   ```

2. **Start services:**
   ```bash
   docker-compose up -d
   ```

3. **Check status:**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

---

## Ubuntu VPS Deployment

Deploy on Ubuntu 20.04/22.04 LTS.

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y git curl

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Application Deployment

```bash
# Clone repository
cd /opt
sudo git clone https://github.com/yourusername/DBI.Hive.git
cd DBI.Hive

# Configure environment
sudo cp .env.example .env
sudo nano .env

# Start services
sudo docker-compose up -d
```

### 3. Nginx Reverse Proxy (Optional)

```bash
# Install Nginx
sudo apt install -y nginx

# Create configuration
sudo nano /etc/nginx/sites-available/dbi-task
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/dbi-task /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 4. Firewall Configuration

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 5. Automatic Startup

```bash
# Create systemd service
sudo nano /etc/systemd/system/dbi-task.service
```

Service file:
```ini
[Unit]
Description=DBI Task Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/DBI.Hive
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable dbi-task
sudo systemctl start dbi-task
```

---

## Azure Deployment

### Option 1: Azure Container Instances

```bash
# Login to Azure
az login

# Create resource group
az group create --name dbi-task-rg --location eastus

# Create container registry
az acr create --resource-group dbi-task-rg \
  --name dbitaskregistry --sku Basic

# Build and push images
az acr build --registry dbitaskregistry \
  --image dbi-task-api:latest ./src/DBI.Task.API

az acr build --registry dbitaskregistry \
  --image dbi-task-web:latest ./client

# Create SQL Database
az sql server create --name dbi-task-sql \
  --resource-group dbi-task-rg \
  --location eastus --admin-user sqladmin \
  --admin-password YourStrong@Passw0rd

az sql db create --resource-group dbi-task-rg \
  --server dbi-task-sql --name DBITaskDB \
  --service-objective S0

# Deploy containers (use Azure Portal or ARM templates)
```

### Option 2: Azure App Service

```bash
# Create App Service Plan
az appservice plan create --name dbi-task-plan \
  --resource-group dbi-task-rg --sku B1 --is-linux

# Create web apps
az webapp create --resource-group dbi-task-rg \
  --plan dbi-task-plan --name dbi-task-api \
  --deployment-container-image-name dbitaskregistry.azurecr.io/dbi-task-api:latest

az webapp create --resource-group dbi-task-rg \
  --plan dbi-task-plan --name dbi-task-web \
  --deployment-container-image-name dbitaskregistry.azurecr.io/dbi-task-web:latest

# Configure web app settings
az webapp config appsettings set --resource-group dbi-task-rg \
  --name dbi-task-api --settings ConnectionStrings__DefaultConnection="..."
```

---

## AWS Deployment

### Using AWS ECS (Elastic Container Service)

1. **Setup ECR (Container Registry):**
   ```bash
   aws ecr create-repository --repository-name dbi-task-api
   aws ecr create-repository --repository-name dbi-task-web
   
   # Build and push
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   docker build -t dbi-task-api ./src/DBI.Task.API
   docker tag dbi-task-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/dbi-task-api:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/dbi-task-api:latest
   ```

2. **Create RDS Database:**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier dbi-task-db \
     --db-instance-class db.t3.small \
     --engine sqlserver-ex \
     --master-username admin \
     --master-user-password YourStrong@Passw0rd \
     --allocated-storage 20
   ```

3. **Create ECS Cluster:**
   ```bash
   aws ecs create-cluster --cluster-name dbi-task-cluster
   ```

4. **Create Task Definitions and Services** (use AWS Console or CloudFormation)

---

## Monitoring and Maintenance

### Logs
```bash
# Docker logs
docker-compose logs -f --tail=100

# Specific service
docker-compose logs -f api

# Database logs
docker-compose logs -f db
```

### Backup Database

```bash
# Manual backup
docker exec -it dbi-task-db /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong@Passw0rd' \
  -Q "BACKUP DATABASE DBITaskDB TO DISK='/var/opt/mssql/backup/DBITaskDB.bak'"

# Copy backup to host
docker cp dbi-task-db:/var/opt/mssql/backup/DBITaskDB.bak ./backup/
```

### Updates

```bash
# Pull latest code
cd /opt/DBI.Hive
git pull

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Run migrations
docker-compose exec api dotnet ef database update
```

### Health Checks

```bash
# Check API health
curl http://localhost:5000/health

# Check frontend
curl http://localhost:3000

# Check database
docker-compose exec db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -Q "SELECT @@VERSION"
```

---

## Troubleshooting

### Container won't start
```bash
docker-compose logs <service-name>
docker-compose ps
```

### Database connection issues
- Check connection string in environment variables
- Verify database container is healthy: `docker-compose ps`
- Check firewall rules

### Frontend can't reach API
- Verify CORS settings in `appsettings.json`
- Check API URL in frontend `.env`
- Inspect browser console for errors

### Performance issues
- Monitor resource usage: `docker stats`
- Check database query performance
- Review background service logs

---

## Security Checklist

- [ ] Change default passwords
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Database backups
- [ ] Secure email credentials
- [ ] Rate limiting (production)
- [ ] Set up monitoring/alerting

---

## Cost Estimates

### VPS Hosting (DigitalOcean/Vultr)
- **Small**: $10-20/month (2GB RAM, 1 vCPU)
- **Medium**: $40-60/month (4GB RAM, 2 vCPU)

### Azure
- **App Service**: $50-100/month (Basic tier)
- **SQL Database**: $15-30/month (Basic tier)
- **Total**: ~$65-130/month

### AWS
- **ECS + RDS**: $50-150/month
- Depends on usage and reserved instances

---

For additional support, contact: support@dbi.com

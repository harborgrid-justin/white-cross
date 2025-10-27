# White Cross Healthcare Platform - Docker Development Setup

This document provides instructions for running the White Cross Healthcare Platform using Docker containers to properly isolate and debug communication between the Next.js frontend and Hapi.js backend.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Hapi.js       │    │   PostgreSQL    │
│   Frontend      │────│   Backend       │────│   Database      │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Redis       │
                    │     Cache       │
                    │   Port: 6379    │
                    └─────────────────┘

All services connected via: white-cross-network (Docker bridge network)
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git repository cloned
- PowerShell (Windows) or Bash (Linux/macOS)

### Windows (PowerShell)
```powershell
# Navigate to project root
cd f:\temp\white-cross

# Start all services
.\scripts\docker-dev.ps1 start

# Check status
.\scripts\docker-dev.ps1 status

# View logs
.\scripts\docker-dev.ps1 logs

# Test connectivity
.\scripts\docker-dev.ps1 test
```

### Linux/macOS (Bash)
```bash
# Navigate to project root
cd /path/to/white-cross

# Make script executable
chmod +x scripts/docker-dev.sh

# Start all services
./scripts/docker-dev.sh start

# Check status  
./scripts/docker-dev.sh status

# View logs
./scripts/docker-dev.sh logs

# Test connectivity
./scripts/docker-dev.sh test
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `start` | Build and start all services (default) |
| `stop` | Stop all services |
| `restart` | Restart all services |
| `status` | Show service status and URLs |
| `logs` | Show recent logs from all services |
| `test` | Test connectivity between services |
| `debug` | Start debug container for network troubleshooting |
| `clean` | Clean up containers, volumes, and images |

## 🌐 Service URLs

When running in Docker:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 🔧 Environment Configuration

The Docker setup uses `.env.docker` for configuration:

```env
# Database
DB_NAME=white_cross_dev
DB_USER=postgres
DB_PASSWORD=postgres

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
INTERNAL_API_URL=http://backend:3001/api/v1

# CORS
CORS_ORIGIN=http://localhost:3000,http://nextjs:3000
```

## 🔍 Container Communication

### External Access (Host → Container)
- Next.js: `http://localhost:3000`
- Backend: `http://localhost:3001/api/v1`

### Internal Communication (Container → Container)
- Next.js → Backend: `http://backend:3001/api/v1`
- Backend → Database: `postgresql://postgres:postgres@postgres:5432/white_cross_dev`
- Backend → Redis: `redis://redis:6379`

## 🐛 Debugging Network Issues

### 1. Check Service Status
```powershell
.\scripts\docker-dev.ps1 status
```

### 2. View Container Logs
```powershell
# All services
.\scripts\docker-dev.ps1 logs

# Specific service
docker-compose -f docker-compose.nextjs.yml logs -f backend
docker-compose -f docker-compose.nextjs.yml logs -f nextjs
```

### 3. Test Connectivity
```powershell
# Automated connectivity test
.\scripts\docker-dev.ps1 test

# Manual testing
docker-compose -f docker-compose.nextjs.yml exec nextjs curl http://backend:3001/api/v1/health
```

### 4. Network Debugging Container
```powershell
# Start debug container
.\scripts\docker-dev.ps1 debug

# Enter debug container
docker exec -it white-cross-debug /bin/bash

# Inside debug container, test connectivity
curl http://backend:3001/api/v1/health
curl http://nextjs:3000
ping postgres
ping redis
```

### 5. Inspect Docker Network
```powershell
# List networks
docker network ls

# Inspect white-cross network
docker network inspect white-cross-network

# Check container IPs
docker-compose -f docker-compose.nextjs.yml ps
```

## 🔧 Common Issues and Solutions

### Issue: "Connection Refused" between containers

**Symptoms:**
- Frontend shows network errors
- Backend logs show no incoming requests
- `curl` from debug container fails

**Solution:**
```powershell
# Check if services are actually running
docker-compose -f docker-compose.nextjs.yml ps

# Restart services in correct order
docker-compose -f docker-compose.nextjs.yml down
.\scripts\docker-dev.ps1 start
```

### Issue: Environment variables not loaded

**Symptoms:**
- API calls go to wrong URLs
- CORS errors in browser

**Solution:**
```powershell
# Verify .env.docker exists and has correct values
Get-Content .env.docker

# Rebuild containers to pick up new env vars
docker-compose -f docker-compose.nextjs.yml up --build -d
```

### Issue: Database connection failures

**Symptoms:**
- Backend fails to start
- Database migration errors

**Solution:**
```powershell
# Check database health
docker-compose -f docker-compose.nextjs.yml exec postgres pg_isready -U postgres

# Check database logs
docker-compose -f docker-compose.nextjs.yml logs postgres

# Reset database if needed
docker-compose -f docker-compose.nextjs.yml down -v
.\scripts\docker-dev.ps1 start
```

### Issue: Next.js build failures

**Symptoms:**
- Next.js container exits immediately
- Build errors in logs

**Solution:**
```powershell
# Check Next.js logs for build errors
docker-compose -f docker-compose.nextjs.yml logs nextjs

# Clear Next.js cache and rebuild
docker-compose -f docker-compose.nextjs.yml down
docker volume rm white-cross-nextjs-logs
.\scripts\docker-dev.ps1 start
```

## 📝 Development Workflow

### 1. Code Changes
- Make changes to source code
- Containers automatically reload (hot reload enabled)
- Check logs for any errors

### 2. Database Changes
- Update models in `backend/src/database/models/`
- Create migration: `docker-compose -f docker-compose.nextjs.yml exec backend npx sequelize-cli migration:generate --name your-migration`
- Run migration: `docker-compose -f docker-compose.nextjs.yml exec backend npx sequelize-cli db:migrate`

### 3. Dependency Changes
- Update `package.json`
- Rebuild containers: `docker-compose -f docker-compose.nextjs.yml up --build -d`

### 4. Environment Changes
- Update `.env.docker`
- Restart services: `.\scripts\docker-dev.ps1 restart`

## 🧹 Cleanup

### Stop Services
```powershell
.\scripts\docker-dev.ps1 stop
```

### Complete Cleanup (removes all data)
```powershell
.\scripts\docker-dev.ps1 clean
```

### Reset Everything
```powershell
# Complete reset - removes containers, volumes, images
docker-compose -f docker-compose.nextjs.yml down -v --rmi all
docker system prune -af
docker volume prune -f
```

## 📊 Monitoring and Health Checks

### Service Health Endpoints
- Backend: `http://localhost:3001/api/v1/health`
- Next.js: `http://localhost:3000/api/health`

### Container Health Status
```powershell
# Check health status of all containers
docker-compose -f docker-compose.nextjs.yml ps

# Detailed health information
docker inspect white-cross-backend | Select-String -Pattern "Health"
```

### Resource Usage
```powershell
# Container resource usage
docker stats

# System resource usage
docker system df
```

This Docker setup provides isolated, reproducible environments that make it easier to debug communication issues between the frontend and backend services.
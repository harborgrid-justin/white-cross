# White Cross Healthcare Platform - Docker Setup Guide

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Service Architecture](#service-architecture)
- [Environment Configuration](#environment-configuration)
- [Common Operations](#common-operations)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

## Overview

The White Cross Healthcare Platform uses Docker Compose to orchestrate multiple services:

- **Frontend**: Next.js application (port 3000)
- **Backend**: NestJS API server (ports 3001, 3002)
- **Database**: PostgreSQL 16 (port 5432)
- **Cache/Queue**: Redis 7 (port 6379)
- **Monitoring**: Prometheus (port 9090)

## Prerequisites

### Required Software
- Docker Engine 20.10+ ([Install Docker](https://docs.docker.com/engine/install/))
- Docker Compose 2.0+ ([Install Docker Compose](https://docs.docker.com/compose/install/))

### Verify Installation
```bash
docker --version
docker-compose --version
```

### System Requirements
- **Development**: 8GB RAM minimum, 16GB recommended
- **Production**: 16GB RAM minimum, 32GB recommended
- **Disk Space**: 10GB minimum for images and volumes

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd white-cross
```

### 2. Configure Environment Variables
```bash
cp .env.docker.example .env
# Edit .env with your preferred editor
nano .env
```

### 3. Start Development Environment
```bash
docker-compose -f docker-compose.dev.yml up
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Backend WebSocket: http://localhost:3002
- Prometheus: http://localhost:9090

## Development Setup

### Starting Development Environment

```bash
# Start all services in foreground (see logs)
docker-compose -f docker-compose.dev.yml up

# Start all services in background (detached mode)
docker-compose -f docker-compose.dev.yml up -d

# Start specific services
docker-compose -f docker-compose.dev.yml up frontend backend
```

### Development Features

#### Hot Reload
- **Frontend**: Automatic reload on code changes in `frontend/src/`
- **Backend**: Automatic restart on code changes in `backend/src/`

#### Debug Ports
- **Backend Debug Port**: 9229 (Node.js Inspector)

Connect your IDE debugger to `localhost:9229` for backend debugging.

#### Volume Mounts
Development setup mounts source code directories for live changes:
- `./frontend/src` → `/app/src` (read-only)
- `./backend/src` → `/app/src` (read-only)

#### Viewing Logs
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend

# Last 100 lines
docker-compose -f docker-compose.dev.yml logs --tail=100 backend
```

#### Stopping Services
```bash
# Stop all services (keeps containers)
docker-compose -f docker-compose.dev.yml stop

# Stop and remove containers
docker-compose -f docker-compose.dev.yml down

# Stop and remove containers + volumes (clean slate)
docker-compose -f docker-compose.dev.yml down -v
```

### Database Management in Development

#### Access PostgreSQL CLI
```bash
docker-compose -f docker-compose.dev.yml exec postgres psql -U whitecross -d whitecross_dev
```

#### Run Database Migrations
```bash
docker-compose -f docker-compose.dev.yml exec backend npm run migration:run
```

#### Seed Database
```bash
docker-compose -f docker-compose.dev.yml exec backend npm run seed:all
```

#### Database Backup
```bash
docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U whitecross whitecross_dev > backup.sql
```

#### Database Restore
```bash
cat backup.sql | docker-compose -f docker-compose.dev.yml exec -T postgres psql -U whitecross -d whitecross_dev
```

### Redis Management in Development

#### Access Redis CLI
```bash
docker-compose -f docker-compose.dev.yml exec redis redis-cli
```

#### Clear Redis Cache
```bash
docker-compose -f docker-compose.dev.yml exec redis redis-cli FLUSHALL
```

### Rebuilding Services

After changing Dockerfiles or dependencies:

```bash
# Rebuild all services
docker-compose -f docker-compose.dev.yml build

# Rebuild specific service
docker-compose -f docker-compose.dev.yml build backend

# Rebuild without cache (clean build)
docker-compose -f docker-compose.dev.yml build --no-cache

# Rebuild and restart
docker-compose -f docker-compose.dev.yml up --build
```

## Production Deployment

### Pre-Deployment Checklist

- [ ] Update all passwords in `.env` file
- [ ] Generate strong JWT secrets
- [ ] Configure CORS_ORIGIN for your production domain
- [ ] Update NEXT_PUBLIC_API_URL to production backend URL
- [ ] Review and adjust resource limits in docker-compose.yml
- [ ] Set up SSL/TLS certificates (use reverse proxy like Nginx/Traefik)
- [ ] Configure database backups
- [ ] Set up monitoring and alerting
- [ ] Review security settings

### Generate Secure Secrets

```bash
# Generate JWT secrets
openssl rand -base64 64

# Generate PostgreSQL password
openssl rand -base64 32

# Generate Redis password
openssl rand -hex 32
```

### Starting Production Environment

```bash
# Build images
docker-compose build

# Start services in detached mode
docker-compose up -d

# View service status
docker-compose ps

# Check health status
docker-compose ps --format json | jq '.[] | {name: .Name, health: .Health}'
```

### Production Monitoring

#### Health Checks
```bash
# Check all services health status
docker-compose ps

# Check specific service health
docker inspect whitecross-backend --format='{{.State.Health.Status}}'

# View health check logs
docker inspect whitecross-backend --format='{{range .State.Health.Log}}{{.Output}}{{end}}'
```

#### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 24 hours
docker-compose logs --since 24h

# Export logs
docker-compose logs > logs-$(date +%Y%m%d).txt
```

#### Prometheus Metrics
Access Prometheus at http://localhost:9090 to view:
- Backend API metrics
- Request rates and response times
- Error rates
- System resource usage

### Production Database Backups

#### Automated Daily Backups (Cron Job)
```bash
# Add to crontab (crontab -e)
0 2 * * * cd /path/to/white-cross && docker-compose exec -T postgres pg_dump -U whitecross whitecross > /backups/whitecross-$(date +\%Y\%m\%d).sql

# With compression
0 2 * * * cd /path/to/white-cross && docker-compose exec -T postgres pg_dump -U whitecross whitecross | gzip > /backups/whitecross-$(date +\%Y\%m\%d).sql.gz
```

#### Manual Backup
```bash
docker-compose exec postgres pg_dump -U whitecross whitecross > backup-$(date +%Y%m%d-%H%M%S).sql
```

#### Restore from Backup
```bash
# Stop backend to prevent connections
docker-compose stop backend

# Restore database
cat backup-20251103.sql | docker-compose exec -T postgres psql -U whitecross -d whitecross

# Start backend
docker-compose start backend
```

### Scaling Services

```bash
# Scale backend to 3 instances (requires load balancer)
docker-compose up -d --scale backend=3

# Note: Scaling requires additional configuration for:
# - Load balancing
# - Shared session storage (Redis)
# - Database connection pooling
```

### Updates and Rollbacks

#### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart services
docker-compose build
docker-compose up -d

# Check logs for errors
docker-compose logs -f
```

#### Rollback
```bash
# Switch to previous version
git checkout <previous-commit>

# Rebuild and restart
docker-compose build
docker-compose up -d
```

### Stopping Production Services

```bash
# Graceful stop (keeps volumes)
docker-compose down

# Force stop (if containers hang)
docker-compose kill
docker-compose down
```

## Service Architecture

### Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Host Network                         │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼─────┐         ┌────▼─────┐         ┌────▼─────┐
   │ frontend │         │ backend  │         │ monitor  │
   │  -net    │         │  -net    │         │  -net    │
   └────┬─────┘         └────┬─────┘         └────┬─────┘
        │                     │                     │
   ┌────▼─────┐         ┌────▼─────┐         ┌────▼─────┐
   │ Frontend │         │ Backend  │         │Prometheus│
   │  :3000   │◄────────┤  :3001   │         │  :9090   │
   └──────────┘         │  :3002   │         └──────────┘
                        └────┬─────┘
                             │
                   ┌─────────┴─────────┐
                   │                   │
              ┌────▼─────┐       ┌────▼─────┐
              │  db-net  │       │ Redis    │
              └────┬─────┘       │  :6379   │
                   │             └──────────┘
              ┌────▼─────┐
              │PostgreSQL│
              │  :5432   │
              └──────────┘
```

### Network Segmentation

- **frontend-net**: Frontend service isolation
- **backend-net**: Frontend-Backend communication
- **db-net**: Backend-Database communication
- **monitor-net**: Prometheus monitoring access

### Data Persistence

#### Named Volumes
- `postgres-data`: PostgreSQL database files
- `redis-data`: Redis persistence and snapshots
- `prometheus-data`: Prometheus metrics storage
- `backend-uploads`: File uploads storage

#### Volume Management
```bash
# List volumes
docker volume ls | grep whitecross

# Inspect volume
docker volume inspect whitecross-postgres-data

# Backup volume
docker run --rm -v whitecross-postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data

# Restore volume
docker run --rm -v whitecross-postgres-data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres-backup.tar.gz -C /
```

### Resource Limits

#### Production Limits
| Service    | CPU Limit | Memory Limit | CPU Reservation | Memory Reservation |
|------------|-----------|--------------|-----------------|-------------------|
| Frontend   | 0.5       | 512M         | 0.25            | 256M              |
| Backend    | 1.0       | 1G           | 0.5             | 512M              |
| PostgreSQL | 0.5       | 512M         | 0.25            | 256M              |
| Redis      | 0.25      | 256M         | 0.1             | 128M              |
| Prometheus | 0.5       | 512M         | 0.25            | 256M              |

#### Adjusting Limits
Edit `docker-compose.yml` under `deploy.resources` for each service.

## Environment Configuration

### Required Environment Variables

| Variable | Description | Default | Production Required |
|----------|-------------|---------|-------------------|
| `POSTGRES_DB` | Database name | whitecross | ✓ |
| `POSTGRES_USER` | Database user | whitecross | ✓ |
| `POSTGRES_PASSWORD` | Database password | changeme | ✓ |
| `JWT_SECRET` | JWT signing secret | (see example) | ✓ |
| `JWT_REFRESH_SECRET` | JWT refresh secret | (see example) | ✓ |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 | ✓ |
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:3001 | ✓ |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_PASSWORD` | Redis password | (empty) |
| `LOG_LEVEL` | Logging level | info |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking | (empty) |
| `PROMETHEUS_PORT` | Prometheus port | 9090 |

### Environment Files

- **`.env`**: Your local environment configuration (git-ignored)
- **`.env.docker.example`**: Template with documentation
- **`backend/.env.example`**: Backend-specific variables
- **`frontend/.env.example`**: Frontend-specific variables

## Common Operations

### Service Management

```bash
# Start specific service
docker-compose start backend

# Stop specific service
docker-compose stop backend

# Restart specific service
docker-compose restart backend

# Remove service containers
docker-compose rm backend
```

### Executing Commands in Containers

```bash
# Run command in running container
docker-compose exec backend npm run migration:run

# Run command in new container (if service is stopped)
docker-compose run backend npm run migration:run

# Open shell in container
docker-compose exec backend sh
docker-compose exec postgres sh
```

### Cleaning Up

```bash
# Remove stopped containers
docker-compose rm

# Remove containers and networks (keeps volumes)
docker-compose down

# Remove containers, networks, and volumes (CAUTION: data loss)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Clean up unused Docker resources
docker system prune -a
```

## Troubleshooting

### Common Issues

#### Service Won't Start

**Symptoms**: Service exits immediately or fails health check

**Solutions**:
```bash
# Check logs
docker-compose logs backend

# Check service status
docker-compose ps

# Inspect container
docker inspect whitecross-backend

# Try rebuilding
docker-compose build backend
docker-compose up backend
```

#### Port Already in Use

**Symptoms**: Error: "port is already allocated"

**Solutions**:
```bash
# Find process using port (Linux/Mac)
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env file
echo "FRONTEND_PORT=3001" >> .env
```

#### Database Connection Failed

**Symptoms**: Backend can't connect to PostgreSQL

**Solutions**:
```bash
# Check if postgres is healthy
docker-compose ps postgres

# Check postgres logs
docker-compose logs postgres

# Verify environment variables
docker-compose exec backend env | grep DB_

# Test connection manually
docker-compose exec backend node -e "const { Sequelize } = require('sequelize'); const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, { host: process.env.DB_HOST, dialect: 'postgres' }); db.authenticate().then(() => console.log('OK')).catch(e => console.log('Error:', e.message));"
```

#### Redis Connection Failed

**Symptoms**: Backend can't connect to Redis

**Solutions**:
```bash
# Check if redis is healthy
docker-compose ps redis

# Check redis logs
docker-compose logs redis

# Test redis connection
docker-compose exec redis redis-cli ping
```

#### Out of Memory

**Symptoms**: Containers killed or restarted unexpectedly

**Solutions**:
```bash
# Check Docker memory usage
docker stats

# Increase Docker Desktop memory limit (Mac/Windows)
# Docker Desktop → Settings → Resources → Memory

# Adjust service memory limits in docker-compose.yml
```

#### Hot Reload Not Working (Development)

**Symptoms**: Code changes don't trigger reload

**Solutions**:
```bash
# Enable polling in .env
echo "WATCHPACK_POLLING=true" >> .env

# Restart services
docker-compose -f docker-compose.dev.yml restart

# Check volume mounts
docker-compose -f docker-compose.dev.yml exec backend ls -la /app/src
```

#### Build Failures

**Symptoms**: Docker build fails

**Solutions**:
```bash
# Clear build cache
docker-compose build --no-cache backend

# Remove node_modules volume
docker volume rm whitecross-backend-dev-node-modules

# Check Dockerfile
cat backend/Dockerfile
```

### Health Check Debugging

```bash
# View health check status
docker inspect whitecross-backend --format='{{json .State.Health}}' | jq

# Manually run health check command
docker-compose exec backend node -e "require('http').get('http://localhost:3001/health/live', (r) => {console.log('Status:', r.statusCode)})"

# Disable health check temporarily (docker-compose.yml)
# Comment out healthcheck section
```

### Network Issues

```bash
# List Docker networks
docker network ls

# Inspect network
docker network inspect whitecross-backend-net

# Test connectivity between services
docker-compose exec backend ping postgres
docker-compose exec frontend ping backend

# Test DNS resolution
docker-compose exec backend nslookup postgres
```

### Performance Issues

```bash
# Monitor resource usage
docker stats

# Check container processes
docker-compose exec backend top

# Check disk usage
docker system df
docker system df -v

# Clean up disk space
docker system prune -a
docker volume prune
```

## Security Best Practices

### Production Security Checklist

- [ ] **Strong Secrets**: Generate cryptographically secure secrets for JWT and database passwords
- [ ] **No Default Passwords**: Change all default passwords in `.env`
- [ ] **Environment Security**: Never commit `.env` files to version control
- [ ] **Network Segmentation**: Keep database and Redis on internal networks (not exposed to host)
- [ ] **SSL/TLS**: Use reverse proxy (Nginx/Traefik) with SSL certificates for production
- [ ] **Regular Updates**: Keep Docker images and dependencies updated
- [ ] **Resource Limits**: Configure appropriate CPU and memory limits
- [ ] **Logging**: Centralize logs and set up monitoring/alerting
- [ ] **Backups**: Implement automated database backups with offsite storage
- [ ] **Access Control**: Restrict SSH access and use key-based authentication
- [ ] **Firewall**: Configure firewall rules to allow only necessary ports
- [ ] **Security Scanning**: Regularly scan Docker images for vulnerabilities

### Docker Security

```bash
# Scan images for vulnerabilities
docker scan whitecross-backend

# Use read-only filesystems where possible
# Add to docker-compose.yml:
# read_only: true

# Drop unnecessary capabilities
# Add to docker-compose.yml:
# cap_drop:
#   - ALL
# cap_add:
#   - NET_BIND_SERVICE
```

### Database Security

- Use strong, unique passwords
- Enable SSL connections in production
- Regular security patches
- Implement backup encryption
- Restrict database user permissions

### Secrets Management

For production, consider using Docker secrets or external secret management:

```bash
# Using Docker secrets (Swarm mode)
echo "my-secret-password" | docker secret create postgres_password -

# In docker-compose.yml:
secrets:
  postgres_password:
    external: true

services:
  postgres:
    secrets:
      - postgres_password
```

Or use external secret management solutions:
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault
- Google Secret Manager

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment/docker)
- [NestJS Docker Guide](https://docs.nestjs.com/recipes/prisma#docker)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
- [Prometheus Documentation](https://prometheus.io/docs/)

## Support

For issues or questions:
1. Check this documentation
2. Review Docker Compose logs
3. Consult service-specific documentation
4. Contact the development team

---

**Last Updated**: 2025-11-03
**Version**: 1.0.0

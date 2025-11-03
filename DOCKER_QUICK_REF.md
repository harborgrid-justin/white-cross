# Docker Quick Reference Card

**White Cross Healthcare Platform** | Quick Command Reference

---

## Quick Start

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose up -d
```

---

## Service Management

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart service
docker-compose restart backend

# View status
docker-compose ps

# View logs (live)
docker-compose logs -f

# View service logs
docker-compose logs -f backend
```

---

## Health Checks

```bash
# All services
docker-compose ps

# Backend
curl http://localhost:3001/health

# Frontend
curl http://localhost:3000/api/health

# PostgreSQL
docker exec whitecross-postgres pg_isready -U whitecross -d whitecross

# Redis
docker exec whitecross-redis redis-cli ping
```

---

## Database Operations

### PostgreSQL

```bash
# Connect
docker exec -it whitecross-postgres psql -U whitecross -d whitecross

# Backup
docker exec whitecross-postgres pg_dump -U whitecross whitecross > backup.sql

# Restore
docker exec -i whitecross-postgres psql -U whitecross -d whitecross < backup.sql

# Query
docker exec whitecross-postgres psql -U whitecross -d whitecross -c "SELECT COUNT(*) FROM users;"
```

### Redis

```bash
# Connect
docker exec -it whitecross-redis redis-cli

# Info
docker exec whitecross-redis redis-cli INFO

# Keys (DB 0 - Cache)
docker exec whitecross-redis redis-cli -n 0 KEYS '*'

# Keys (DB 1 - Queue)
docker exec whitecross-redis redis-cli -n 1 KEYS '*'

# Clear cache
docker exec whitecross-redis redis-cli -n 0 FLUSHDB
```

---

## Container Access

```bash
# Backend shell
docker exec -it whitecross-backend sh

# Frontend shell
docker exec -it whitecross-frontend sh

# PostgreSQL shell
docker exec -it whitecross-postgres psql -U whitecross -d whitecross

# Redis CLI
docker exec -it whitecross-redis redis-cli
```

---

## Migrations

```bash
# Run migrations
docker exec whitecross-backend npm run migration:run

# Migration status
docker exec whitecross-backend npm run migration:status

# Revert last migration
docker exec whitecross-backend npm run migration:revert
```

---

## Logs and Monitoring

```bash
# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend

# With timestamps
docker-compose logs -t backend

# Resource usage
docker stats

# Specific containers
docker stats whitecross-backend whitecross-postgres
```

---

## Build and Update

```bash
# Build all
docker-compose build

# Build specific service
docker-compose build backend

# Build without cache
docker-compose build --no-cache

# Update and restart
docker-compose up -d --build backend
```

---

## Volume Management

```bash
# List volumes
docker volume ls | grep whitecross

# Inspect volume
docker volume inspect whitecross-postgres-data

# Backup volume
docker run --rm \
  -v whitecross-postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup.tar.gz /data

# Remove volume (DANGER)
docker volume rm whitecross-postgres-data
```

---

## Troubleshooting

```bash
# View service status
docker-compose ps

# Check logs
docker-compose logs --tail=200 backend

# Test connectivity
docker exec whitecross-backend ping postgres
docker exec whitecross-backend ping redis

# Test ports
docker exec whitecross-backend nc -zv postgres 5432
docker exec whitecross-backend nc -zv redis 6379

# Restart service
docker-compose restart backend

# Force recreate
docker-compose up -d --force-recreate backend

# Clean rebuild
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

---

## Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove with volumes (DANGER)
docker-compose down -v

# Remove unused images
docker image prune

# Remove all unused
docker system prune

# Remove everything (DANGER)
docker system prune -a --volumes
```

---

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend API | 3001 | http://localhost:3001 |
| WebSocket | 3002 | http://localhost:3002 |
| PostgreSQL | 5432 | postgres://localhost:5432 |
| Redis | 6379 | redis://localhost:6379 |
| Prometheus | 9090 | http://localhost:9090 |

---

## Environment Variables

Key variables in `.env`:

```bash
# Ports
FRONTEND_PORT=3000
BACKEND_PORT=3001
PROMETHEUS_PORT=9090

# Database
POSTGRES_DB=whitecross
POSTGRES_USER=whitecross
POSTGRES_PASSWORD=changeme

# JWT
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# CORS
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Container Names

| Service | Production | Development |
|---------|-----------|-------------|
| Frontend | whitecross-frontend | whitecross-frontend-dev |
| Backend | whitecross-backend | whitecross-backend-dev |
| PostgreSQL | whitecross-postgres | whitecross-postgres-dev |
| Redis | whitecross-redis | whitecross-redis-dev |
| Prometheus | whitecross-prometheus | whitecross-prometheus-dev |

---

## Common Workflows

### Start Fresh Development

```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml logs -f
```

### Update Backend Code

```bash
docker-compose build backend
docker-compose up -d backend
docker-compose logs -f backend
```

### Reset Database

```bash
docker-compose down -v postgres
docker-compose up -d postgres
docker exec whitecross-backend npm run migration:run
```

### Production Deploy

```bash
git pull origin main
docker-compose build --no-cache
docker-compose up -d --force-recreate
docker exec whitecross-backend npm run migration:run
docker-compose ps
```

---

## Backup Strategy

### Daily Backup Script

```bash
#!/bin/bash
DATE=$(date +%Y%m%d)

# Database
docker exec whitecross-postgres pg_dump -U whitecross whitecross > backup-$DATE.sql

# Volumes
docker run --rm -v whitecross-postgres-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres-data-$DATE.tar.gz /data

docker run --rm -v whitecross-redis-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/redis-data-$DATE.tar.gz /data

docker run --rm -v whitecross-backend-uploads:/data -v $(pwd):/backup \
  alpine tar czf /backup/uploads-$DATE.tar.gz /data
```

---

## Health Check Endpoints

```bash
# Backend - Liveness (fast)
curl http://localhost:3001/health/live

# Backend - Readiness (checks dependencies)
curl http://localhost:3001/health/ready

# Backend - Full health
curl http://localhost:3001/health

# Frontend
curl http://localhost:3000/api/health

# Prometheus
curl http://localhost:9090/-/healthy
```

---

## Network Testing

```bash
# From backend to PostgreSQL
docker exec whitecross-backend ping -c 3 postgres

# From backend to Redis
docker exec whitecross-backend ping -c 3 redis

# DNS resolution
docker exec whitecross-backend nslookup postgres

# Port connectivity
docker exec whitecross-backend nc -zv postgres 5432
docker exec whitecross-backend nc -zv redis 6379
```

---

## Resource Monitoring

```bash
# Live stats (all containers)
docker stats

# Specific containers
docker stats whitecross-backend whitecross-postgres whitecross-redis

# Single snapshot
docker stats --no-stream

# Formatted output
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

---

## Emergency Procedures

### Service Not Starting

```bash
# 1. Check logs
docker-compose logs --tail=200 backend

# 2. Check health
docker-compose ps

# 3. Restart service
docker-compose restart backend

# 4. Force recreate
docker-compose up -d --force-recreate backend

# 5. Clean rebuild
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

### Database Connection Issues

```bash
# 1. Check PostgreSQL health
docker exec whitecross-postgres pg_isready -U whitecross -d whitecross

# 2. Check from backend
docker exec whitecross-backend ping postgres

# 3. Test connection
docker exec whitecross-postgres psql -U whitecross -d whitecross -c "SELECT 1;"

# 4. Restart database
docker-compose restart postgres

# 5. Check logs
docker-compose logs postgres
```

### Out of Memory

```bash
# 1. Check usage
docker stats

# 2. Identify culprit
docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}"

# 3. Restart service
docker-compose restart <service>

# 4. Increase limits in docker-compose.yml
# deploy:
#   resources:
#     limits:
#       memory: 2G
```

---

## Security Reminders

- [ ] Change default passwords
- [ ] Generate strong JWT secrets
- [ ] Set Redis password in production
- [ ] Don't expose database ports in production
- [ ] Use HTTPS in production
- [ ] Regular backups
- [ ] Monitor logs for suspicious activity
- [ ] Keep Docker images updated

---

**For detailed documentation, see:**
- Setup Guide: [DOCKER_SETUP.md](./DOCKER_SETUP.md)
- API Reference: [DOCKER_API.md](./DOCKER_API.md)
- Database Setup: [scripts/DATABASE_SETUP.md](./scripts/DATABASE_SETUP.md)

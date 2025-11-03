# Docker Infrastructure API Reference

**Version**: 1.0.0
**Last Updated**: 2025-11-03
**Platform**: White Cross Healthcare Platform

---

## Table of Contents

- [Service API Reference](#service-api-reference)
  - [PostgreSQL Service](#postgresql-service)
  - [Redis Service](#redis-service)
  - [Backend Service](#backend-service)
  - [Frontend Service](#frontend-service)
  - [Prometheus Service](#prometheus-service)
- [Environment Variables Reference](#environment-variables-reference)
- [Health Check Endpoints](#health-check-endpoints)
- [Service Dependencies](#service-dependencies)
- [Volume Management](#volume-management)
- [Network Architecture](#network-architecture)
- [Docker CLI Command Reference](#docker-cli-command-reference)
- [Quick Reference Guide](#quick-reference-guide)
- [Deployment Workflows](#deployment-workflows)
- [CI/CD Integration](#cicd-integration)

---

## Service API Reference

### PostgreSQL Service

**Service Name**: `postgres`
**Container Name**: `whitecross-postgres` (prod) / `whitecross-postgres-dev` (dev)
**Image**: `postgres:16-alpine`
**Restart Policy**: `unless-stopped`

#### Ports

| Internal Port | External Port | Protocol | Purpose |
|--------------|---------------|----------|---------|
| 5432 | 5432 | TCP | PostgreSQL Database |

**Note**: Expose port only for development/debugging. Comment out in production for security.

#### Volumes

| Host Path | Container Path | Mode | Purpose |
|-----------|---------------|------|---------|
| `postgres-data` | `/var/lib/postgresql/data` | rw | Database persistence |

#### Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `POSTGRES_DB` | `whitecross` | Yes | Database name |
| `POSTGRES_USER` | `whitecross` | Yes | Database user |
| `POSTGRES_PASSWORD` | `changeme` | Yes | Database password |
| `POSTGRES_INITDB_ARGS` | `-E UTF8` | No | Init arguments |
| `PGDATA` | `/var/lib/postgresql/data/pgdata` | No | Data directory |

#### Health Check

```yaml
test: ["CMD-SHELL", "pg_isready -U whitecross -d whitecross"]
interval: 10s
timeout: 5s
retries: 5
start_period: 10s
```

**Health Check Command**:
```bash
docker exec whitecross-postgres pg_isready -U whitecross -d whitecross
```

**Expected Output**: `postgres:5432 - accepting connections`

#### Resource Limits (Production)

| Resource | Limit | Reservation |
|----------|-------|-------------|
| CPU | 0.5 cores | 0.25 cores |
| Memory | 512MB | 256MB |

#### Networks

- **Production**: `db-net`
- **Development**: `dev-net`

#### Connection String

```
postgresql://whitecross:password@postgres:5432/whitecross
```

#### CLI Operations

```bash
# Connect to PostgreSQL CLI
docker exec -it whitecross-postgres psql -U whitecross -d whitecross

# Execute SQL query
docker exec whitecross-postgres psql -U whitecross -d whitecross -c "SELECT version();"

# Database backup
docker exec whitecross-postgres pg_dump -U whitecross whitecross > backup.sql

# Database restore
docker exec -i whitecross-postgres psql -U whitecross -d whitecross < backup.sql

# List databases
docker exec whitecross-postgres psql -U whitecross -c "\l"

# List tables
docker exec whitecross-postgres psql -U whitecross -d whitecross -c "\dt"

# Database size
docker exec whitecross-postgres psql -U whitecross -d whitecross -c "SELECT pg_size_pretty(pg_database_size('whitecross'));"
```

---

### Redis Service

**Service Name**: `redis`
**Container Name**: `whitecross-redis` (prod) / `whitecross-redis-dev` (dev)
**Image**: `redis:7-alpine`
**Restart Policy**: `unless-stopped`

#### Ports

| Internal Port | External Port | Protocol | Purpose |
|--------------|---------------|----------|---------|
| 6379 | 6379 | TCP | Redis Cache/Queue |

**Note**: Expose port only for development/debugging. Comment out in production.

#### Volumes

| Host Path | Container Path | Mode | Purpose |
|-----------|---------------|------|---------|
| `redis-data` | `/data` | rw | Redis persistence (RDB/AOF) |

#### Command Arguments (Production)

```yaml
command: >
  redis-server
  --appendonly yes
  --appendfsync everysec
  --maxmemory 256mb
  --maxmemory-policy allkeys-lru
  --save 900 1
  --save 300 10
  --save 60 10000
```

#### Database Allocation

| Database | Purpose | TTL | Eviction Policy |
|----------|---------|-----|-----------------|
| DB 0 | Cache (sessions, API responses) | Short (5-15 min) | allkeys-lru |
| DB 1 | Queues (Bull queue management) | Long/None | noeviction |

#### Health Check

```yaml
test: ["CMD", "redis-cli", "ping"]
interval: 10s
timeout: 5s
retries: 5
start_period: 5s
```

**Health Check Command**:
```bash
docker exec whitecross-redis redis-cli ping
```

**Expected Output**: `PONG`

#### Resource Limits (Production)

| Resource | Limit | Reservation |
|----------|-------|-------------|
| CPU | 0.25 cores | 0.1 cores |
| Memory | 256MB | 128MB |

#### Networks

- **Production**: `db-net`
- **Development**: `dev-net`

#### Connection String

```
# Cache (DB 0)
redis://redis:6379/0

# Queue (DB 1)
redis://redis:6379/1
```

#### CLI Operations

```bash
# Connect to Redis CLI
docker exec -it whitecross-redis redis-cli

# Check server info
docker exec whitecross-redis redis-cli INFO

# Memory usage
docker exec whitecross-redis redis-cli INFO memory

# Keyspace statistics
docker exec whitecross-redis redis-cli INFO keyspace

# Get all keys in DB 0 (cache)
docker exec whitecross-redis redis-cli -n 0 KEYS '*'

# Get all keys in DB 1 (queue)
docker exec whitecross-redis redis-cli -n 1 KEYS '*'

# Database size (DB 0)
docker exec whitecross-redis redis-cli -n 0 DBSIZE

# Database size (DB 1)
docker exec whitecross-redis redis-cli -n 1 DBSIZE

# Clear cache (DB 0)
docker exec whitecross-redis redis-cli -n 0 FLUSHDB

# Get specific key
docker exec whitecross-redis redis-cli GET "white-cross:session:user123"

# Monitor commands in real-time
docker exec whitecross-redis redis-cli MONITOR

# Check slow queries
docker exec whitecross-redis redis-cli SLOWLOG GET 10
```

---

### Backend Service

**Service Name**: `backend`
**Container Name**: `whitecross-backend` (prod) / `whitecross-backend-dev` (dev)
**Base Image**: `node:20-alpine`
**Dockerfile**: `backend/Dockerfile` (prod) / `backend/Dockerfile.dev` (dev)
**Restart Policy**: `unless-stopped`

#### Ports

| Internal Port | External Port | Protocol | Purpose |
|--------------|---------------|----------|---------|
| 3001 | 3001 | TCP | HTTP API Server |
| 3002 | 3002 | TCP | WebSocket Server |
| 9229 | 9229 | TCP | Node.js Debug Port (dev only) |

#### Volumes

**Production**:
| Host Path | Container Path | Mode | Purpose |
|-----------|---------------|------|---------|
| `backend-uploads` | `/app/uploads` | rw | File uploads |

**Development**:
| Host Path | Container Path | Mode | Purpose |
|-----------|---------------|------|---------|
| `./backend/src` | `/app/src` | ro | Hot reload (source) |
| `./backend/test` | `/app/test` | ro | Hot reload (tests) |
| `backend-dev-node-modules` | `/app/node_modules` | rw | Node modules |
| `./backend/uploads` | `/app/uploads` | rw | File uploads |

#### Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `NODE_ENV` | `production` | Yes | Node environment |
| `PORT` | `3001` | Yes | API server port |
| `DB_HOST` | `postgres` | Yes | PostgreSQL host |
| `DB_PORT` | `5432` | Yes | PostgreSQL port |
| `DB_USERNAME` | `whitecross` | Yes | Database user |
| `DB_PASSWORD` | - | Yes | Database password |
| `DB_NAME` | `whitecross` | Yes | Database name |
| `REDIS_HOST` | `redis` | Yes | Redis host |
| `REDIS_PORT` | `6379` | Yes | Redis port |
| `REDIS_PASSWORD` | - | No | Redis password |
| `REDIS_DB` | `0` | Yes | Redis cache database |
| `REDIS_QUEUE_DB` | `1` | Yes | Redis queue database |
| `JWT_SECRET` | - | Yes | JWT signing secret |
| `JWT_REFRESH_SECRET` | - | Yes | JWT refresh secret |
| `CORS_ORIGIN` | `http://localhost:3000` | Yes | CORS allowed origin |
| `LOG_LEVEL` | `info` | No | Log level (error/warn/info/debug) |
| `WS_PORT` | `3002` | Yes | WebSocket port |
| `WS_PATH` | `/socket.io` | Yes | WebSocket path |
| `WS_CORS_ORIGIN` | `http://localhost:3000` | Yes | WebSocket CORS origin |

#### Build Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Build environment |

#### Health Check

```yaml
test: ["CMD-SHELL", "node -e \"require('http').get('http://localhost:3001/health/live', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))\""]
interval: 30s
timeout: 10s
retries: 3
start_period: 60s
```

**Health Check Endpoints**:
```bash
# Liveness probe (lightweight)
curl http://localhost:3001/health/live

# Readiness probe (checks dependencies)
curl http://localhost:3001/health/ready

# Full health check (detailed status)
curl http://localhost:3001/health
```

**Expected Response (200 OK)**:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  }
}
```

#### Resource Limits (Production)

| Resource | Limit | Reservation |
|----------|-------|-------------|
| CPU | 1.0 core | 0.5 cores |
| Memory | 1GB | 512MB |

#### Networks

- **Production**: `backend-net`, `db-net`
- **Development**: `dev-net`

#### Service Dependencies

- `postgres` (condition: service_healthy)
- `redis` (condition: service_healthy)

#### CLI Operations

```bash
# View backend logs
docker logs -f whitecross-backend

# Execute command in backend container
docker exec whitecross-backend npm run migration:status

# Run database migrations
docker exec whitecross-backend npm run migration:run

# Access backend shell
docker exec -it whitecross-backend sh

# Check Node.js version
docker exec whitecross-backend node --version

# Check npm version
docker exec whitecross-backend npm --version

# View environment variables
docker exec whitecross-backend env

# Test backend API
docker exec whitecross-backend wget -O- http://localhost:3001/health/live

# Restart backend service
docker-compose restart backend
```

---

### Frontend Service

**Service Name**: `frontend`
**Container Name**: `whitecross-frontend` (prod) / `whitecross-frontend-dev` (dev)
**Base Image**: `node:20-alpine`
**Dockerfile**: `frontend/Dockerfile` (prod) / `frontend/Dockerfile.dev` (dev)
**Restart Policy**: `unless-stopped`

#### Ports

| Internal Port | External Port | Protocol | Purpose |
|--------------|---------------|----------|---------|
| 3000 | 3000 | TCP | Next.js HTTP Server |

#### Volumes

**Production**: None (standalone build)

**Development**:
| Host Path | Container Path | Mode | Purpose |
|-----------|---------------|------|---------|
| `./frontend/src` | `/app/src` | ro | Hot reload (source) |
| `./frontend/public` | `/app/public` | ro | Hot reload (public assets) |
| `./frontend/types` | `/app/types` | ro | Hot reload (TypeScript types) |
| `./frontend/.env.local` | `/app/.env.local` | ro | Local environment |
| `frontend-dev-node-modules` | `/app/node_modules` | rw | Node modules |
| `frontend-dev-next` | `/app/.next` | rw | Next.js build cache |

#### Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `NODE_ENV` | `production` | Yes | Node environment |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Yes | Backend API URL |
| `NEXT_PUBLIC_ENVIRONMENT` | `production` | Yes | Application environment |
| `NEXT_PUBLIC_SENTRY_DSN` | - | No | Sentry error tracking DSN |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | `true` | No | Enable analytics |
| `WATCHPACK_POLLING` | `false` | No | File watching polling (dev) |

#### Build Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | - | Backend API URL (build-time) |
| `NEXT_PUBLIC_ENVIRONMENT` | `production` | Environment (build-time) |
| `NEXT_PUBLIC_SENTRY_DSN` | - | Sentry DSN (build-time) |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | `true` | Enable analytics (build-time) |

#### Health Check

```yaml
test: ["CMD-SHELL", "node -e \"require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))\""]
interval: 30s
timeout: 10s
retries: 3
start_period: 40s
```

**Health Check Endpoint**:
```bash
curl http://localhost:3000/api/health
```

**Expected Response (200 OK)**:
```json
{
  "status": "ok"
}
```

#### Resource Limits (Production)

| Resource | Limit | Reservation |
|----------|-------|-------------|
| CPU | 0.5 cores | 0.25 cores |
| Memory | 512MB | 256MB |

#### Networks

- **Production**: `frontend-net`, `backend-net`
- **Development**: `dev-net`

#### Service Dependencies

- `backend` (condition: service_healthy)

#### CLI Operations

```bash
# View frontend logs
docker logs -f whitecross-frontend

# Access frontend shell
docker exec -it whitecross-frontend sh

# Check Next.js build info
docker exec whitecross-frontend ls -la .next

# View environment variables
docker exec whitecross-frontend env

# Test frontend health
curl http://localhost:3000/api/health

# Test frontend homepage
curl http://localhost:3000

# Restart frontend service
docker-compose restart frontend
```

---

### Prometheus Service

**Service Name**: `prometheus`
**Container Name**: `whitecross-prometheus` (prod) / `whitecross-prometheus-dev` (dev)
**Image**: `prom/prometheus:latest`
**Restart Policy**: `unless-stopped`

#### Ports

| Internal Port | External Port | Protocol | Purpose |
|--------------|---------------|----------|---------|
| 9090 | 9090 | TCP | Prometheus UI/API |

#### Volumes

| Host Path | Container Path | Mode | Purpose |
|-----------|---------------|------|---------|
| `./prometheus.yml` | `/etc/prometheus/prometheus.yml` | ro | Prometheus config |
| `prometheus-data` | `/prometheus` | rw | Metrics storage |

#### Command Arguments

```yaml
command:
  - '--config.file=/etc/prometheus/prometheus.yml'
  - '--storage.tsdb.path=/prometheus'
  - '--storage.tsdb.retention.time=15d'  # 15d prod, 7d dev
  - '--web.console.libraries=/usr/share/prometheus/console_libraries'
  - '--web.console.templates=/usr/share/prometheus/consoles'
  - '--log.level=info'  # debug in dev
```

#### Health Check

```yaml
test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:9090/-/healthy || exit 1"]
interval: 30s
timeout: 10s
retries: 3
start_period: 30s
```

**Health Check Endpoints**:
```bash
# Health endpoint
curl http://localhost:9090/-/healthy

# Readiness endpoint
curl http://localhost:9090/-/ready

# Prometheus UI
http://localhost:9090
```

#### Resource Limits (Production)

| Resource | Limit | Reservation |
|----------|-------|-------------|
| CPU | 0.5 cores | 0.25 cores |
| Memory | 512MB | 256MB |

#### Networks

- **Production**: `monitor-net`, `backend-net`
- **Development**: `dev-net`

#### CLI Operations

```bash
# View Prometheus logs
docker logs -f whitecross-prometheus

# Access Prometheus shell
docker exec -it whitecross-prometheus sh

# Check Prometheus config
docker exec whitecross-prometheus promtool check config /etc/prometheus/prometheus.yml

# Query Prometheus API
curl 'http://localhost:9090/api/v1/query?query=up'

# Get targets
curl http://localhost:9090/api/v1/targets

# Reload config
curl -X POST http://localhost:9090/-/reload

# Restart Prometheus service
docker-compose restart prometheus
```

---

## Environment Variables Reference

### Global Variables

| Variable | Production Default | Development Default | Description |
|----------|-------------------|---------------------|-------------|
| `NODE_ENV` | `production` | `development` | Node.js environment |
| `NEXT_PUBLIC_ENVIRONMENT` | `production` | `development` | Application environment |

### Port Configuration

| Variable | Default | Service | Description |
|----------|---------|---------|-------------|
| `FRONTEND_PORT` | `3000` | Frontend | Frontend HTTP port |
| `BACKEND_PORT` | `3001` | Backend | Backend API port |
| `WS_PORT` | `3002` | Backend | WebSocket port |
| `PROMETHEUS_PORT` | `9090` | Prometheus | Prometheus UI port |

### PostgreSQL Configuration

| Variable | Production | Development | Required | Description |
|----------|-----------|-------------|----------|-------------|
| `POSTGRES_DB` | `whitecross` | `whitecross_dev` | Yes | Database name |
| `POSTGRES_USER` | `whitecross` | `whitecross` | Yes | Database user |
| `POSTGRES_PASSWORD` | *change required* | `dev_password` | Yes | Database password |

### Redis Configuration

| Variable | Production | Development | Required | Description |
|----------|-----------|-------------|----------|-------------|
| `REDIS_PASSWORD` | *recommended* | - | No | Redis password |

### JWT Configuration

| Variable | Production | Development | Required | Description |
|----------|-----------|-------------|----------|-------------|
| `JWT_SECRET` | *change required* | `dev-jwt-secret` | Yes | JWT signing secret |
| `JWT_REFRESH_SECRET` | *change required* | `dev-refresh-secret` | Yes | JWT refresh secret |

**Generate Production Secrets**:
```bash
# Generate JWT_SECRET
openssl rand -base64 64

# Generate JWT_REFRESH_SECRET
openssl rand -base64 64
```

### CORS Configuration

| Variable | Production | Development | Required | Description |
|----------|-----------|-------------|----------|-------------|
| `CORS_ORIGIN` | *set to domain* | `http://localhost:3000` | Yes | Allowed CORS origin |

### Frontend Configuration

| Variable | Production | Development | Required | Description |
|----------|-----------|-------------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | *set to backend URL* | `http://localhost:3001` | Yes | Backend API URL |
| `NEXT_PUBLIC_SENTRY_DSN` | *optional* | - | No | Sentry error tracking |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | `true` | `true` | No | Enable analytics |

### Logging Configuration

| Variable | Production | Development | Required | Description |
|----------|-----------|-------------|----------|-------------|
| `LOG_LEVEL` | `info` | `debug` | No | Log level (error/warn/info/debug) |

---

## Health Check Endpoints

### Backend Health Endpoints

#### Liveness Probe
```
GET http://localhost:3001/health/live
```

**Purpose**: Lightweight check to verify application is running
**Checks**: None (just returns OK)
**Response Time**: <10ms
**Use Case**: Kubernetes liveness probe, container health check

**Response** (200 OK):
```json
{
  "status": "ok"
}
```

#### Readiness Probe
```
GET http://localhost:3001/health/ready
```

**Purpose**: Verify application can handle requests
**Checks**: Database connection, Redis connection
**Response Time**: <100ms
**Use Case**: Kubernetes readiness probe, load balancer check

**Response** (200 OK):
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  }
}
```

**Response** (503 Service Unavailable):
```json
{
  "status": "error",
  "info": {
    "database": { "status": "down" },
    "redis": { "status": "up" }
  }
}
```

#### Full Health Check
```
GET http://localhost:3001/health
```

**Purpose**: Detailed health status with all dependencies
**Checks**: Database, Redis, memory usage, disk usage
**Response Time**: <200ms
**Use Case**: Monitoring dashboard, detailed diagnostics

**Response** (200 OK):
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up", "responseTime": "5ms" },
    "redis": { "status": "up", "responseTime": "2ms" },
    "memory": { "status": "ok", "heap": "150MB", "limit": "1GB" },
    "disk": { "status": "ok", "usage": "45%" }
  },
  "error": {},
  "details": {
    "database": { "type": "postgres", "version": "16.0" },
    "redis": { "type": "redis", "version": "7.0" }
  }
}
```

### Frontend Health Endpoint

```
GET http://localhost:3000/api/health
```

**Response** (200 OK):
```json
{
  "status": "ok",
  "environment": "production",
  "version": "1.0.0"
}
```

### Database Health Check

```bash
# PostgreSQL
docker exec whitecross-postgres pg_isready -U whitecross -d whitecross

# Expected: postgres:5432 - accepting connections
```

### Redis Health Check

```bash
# Redis
docker exec whitecross-redis redis-cli ping

# Expected: PONG
```

### Prometheus Health Check

```bash
# Health
curl http://localhost:9090/-/healthy

# Readiness
curl http://localhost:9090/-/ready

# Expected: Prometheus is Healthy/Ready.
```

---

## Service Dependencies

### Dependency Graph

```
frontend
  └── backend (healthy)
        ├── postgres (healthy)
        └── redis (healthy)

prometheus
  └── backend (running, for metrics scraping)
```

### Startup Order

1. **PostgreSQL** - Starts first, no dependencies
2. **Redis** - Starts first, no dependencies
3. **Backend** - Waits for PostgreSQL and Redis to be healthy
4. **Frontend** - Waits for Backend to be healthy
5. **Prometheus** - Starts independently, scrapes metrics from Backend

### Health Check Dependencies

```yaml
backend:
  depends_on:
    postgres:
      condition: service_healthy
    redis:
      condition: service_healthy

frontend:
  depends_on:
    backend:
      condition: service_healthy
```

### Dependency Matrix

| Service | PostgreSQL | Redis | Backend | Frontend | Prometheus |
|---------|-----------|-------|---------|----------|-----------|
| **PostgreSQL** | - | - | - | - | - |
| **Redis** | - | - | - | - | - |
| **Backend** | Required (healthy) | Required (healthy) | - | - | - |
| **Frontend** | - | - | Required (healthy) | - | - |
| **Prometheus** | - | - | Optional (metrics) | - | - |

---

## Volume Management

### Production Volumes

| Volume Name | Service | Mount Point | Size | Purpose | Backup Required |
|------------|---------|-------------|------|---------|----------------|
| `whitecross-postgres-data` | postgres | `/var/lib/postgresql/data` | ~5-50GB | Database storage | Yes (critical) |
| `whitecross-redis-data` | redis | `/data` | ~100MB-1GB | Redis persistence | Yes (queues) |
| `whitecross-prometheus-data` | prometheus | `/prometheus` | ~1-10GB | Metrics storage | No |
| `whitecross-backend-uploads` | backend | `/app/uploads` | ~1-100GB | File uploads | Yes (user data) |

### Development Volumes

| Volume Name | Service | Mount Point | Size | Purpose |
|------------|---------|-------------|------|---------|
| `whitecross-postgres-dev-data` | postgres | `/var/lib/postgresql/data` | ~1-5GB | Dev database |
| `whitecross-redis-dev-data` | redis | `/data` | ~50MB | Dev cache/queue |
| `whitecross-prometheus-dev-data` | prometheus | `/prometheus` | ~500MB | Dev metrics |
| `whitecross-backend-dev-node-modules` | backend | `/app/node_modules` | ~500MB | Backend deps |
| `whitecross-frontend-dev-node-modules` | frontend | `/app/node_modules` | ~500MB | Frontend deps |
| `whitecross-frontend-dev-next` | frontend | `/app/.next` | ~100MB | Next.js cache |

### Volume Operations

#### List Volumes
```bash
# List all volumes
docker volume ls

# List White Cross volumes only
docker volume ls | grep whitecross
```

#### Inspect Volume
```bash
# Detailed volume info
docker volume inspect whitecross-postgres-data

# Get mount point
docker volume inspect whitecross-postgres-data --format '{{ .Mountpoint }}'
```

#### Backup Volume
```bash
# PostgreSQL data backup
docker run --rm \
  -v whitecross-postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-$(date +%Y%m%d-%H%M%S).tar.gz /data

# Redis data backup
docker run --rm \
  -v whitecross-redis-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/redis-$(date +%Y%m%d-%H%M%S).tar.gz /data

# Backend uploads backup
docker run --rm \
  -v whitecross-backend-uploads:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/uploads-$(date +%Y%m%d-%H%M%S).tar.gz /data
```

#### Restore Volume
```bash
# Stop services first
docker-compose down

# Restore PostgreSQL data
docker run --rm \
  -v whitecross-postgres-data:/data \
  -v $(pwd):/backup \
  alpine sh -c "cd / && tar xzf /backup/postgres-20251103-120000.tar.gz"

# Start services
docker-compose up -d
```

#### Remove Volume
```bash
# Remove single volume (data will be lost!)
docker volume rm whitecross-postgres-data

# Remove all White Cross volumes
docker volume ls -q | grep whitecross | xargs docker volume rm
```

#### Clear Development Data
```bash
# Stop development services
docker-compose -f docker-compose.dev.yml down

# Remove development volumes
docker volume rm whitecross-postgres-dev-data
docker volume rm whitecross-redis-dev-data

# Restart with fresh data
docker-compose -f docker-compose.dev.yml up -d
```

---

## Network Architecture

### Production Networks

```
┌─────────────────────────────────────────────────────────┐
│                    External Network                     │
│                         (Host)                          │
└─────────────┬──────────────────────┬────────────────────┘
              │                      │
              │ Port 3000            │ Port 9090
              ▼                      ▼
      ┌───────────────┐      ┌──────────────┐
      │   Frontend    │      │  Prometheus  │
      │   Container   │      │  Container   │
      └───────┬───────┘      └──────┬───────┘
              │                     │
              │ frontend-net        │ monitor-net
              │                     │
              ▼                     ▼
      ┌───────────────────────────────┐
      │       backend-net             │
      │  ┌─────────────────────────┐  │
      │  │   Backend Container     │  │
      │  │   Port 3001 (API)       │  │
      │  │   Port 3002 (WebSocket) │  │
      │  └───────────┬─────────────┘  │
      └──────────────┼─────────────────┘
                     │
                     │ db-net
                     │
         ┌───────────┴────────────┐
         │                        │
         ▼                        ▼
  ┌─────────────┐         ┌─────────────┐
  │  PostgreSQL │         │    Redis    │
  │  Container  │         │  Container  │
  │  Port 5432  │         │  Port 6379  │
  └─────────────┘         └─────────────┘
```

### Network Configuration

| Network Name | Driver | Purpose | Connected Services |
|-------------|--------|---------|-------------------|
| `whitecross-frontend-net` | bridge | Frontend ↔ Backend | frontend, backend |
| `whitecross-backend-net` | bridge | Backend ↔ Monitoring | backend, frontend, prometheus |
| `whitecross-db-net` | bridge | Backend ↔ Databases | backend, postgres, redis |
| `whitecross-monitor-net` | bridge | Monitoring | prometheus |

### Development Network

| Network Name | Driver | Purpose | Connected Services |
|-------------|--------|---------|-------------------|
| `whitecross-dev-net` | bridge | All services | All development containers |

### Network Operations

#### List Networks
```bash
# List all networks
docker network ls

# List White Cross networks
docker network ls | grep whitecross
```

#### Inspect Network
```bash
# Detailed network info
docker network inspect whitecross-backend-net

# List connected containers
docker network inspect whitecross-backend-net --format '{{range .Containers}}{{.Name}} {{end}}'
```

#### Test Network Connectivity

```bash
# From backend to PostgreSQL
docker exec whitecross-backend ping -c 3 postgres

# From backend to Redis
docker exec whitecross-backend ping -c 3 redis

# DNS resolution test
docker exec whitecross-backend nslookup postgres
docker exec whitecross-backend nslookup redis

# Port connectivity test
docker exec whitecross-backend nc -zv postgres 5432
docker exec whitecross-backend nc -zv redis 6379
```

#### Network Security

```mermaid
graph TD
    A[External] -->|Port 3000| B[Frontend]
    A -->|Port 9090| C[Prometheus]
    B -->|backend-net| D[Backend]
    C -->|monitor-net| D
    D -->|db-net| E[PostgreSQL]
    D -->|db-net| F[Redis]

    style E fill:#f9f,stroke:#333,stroke-width:2px
    style F fill:#f9f,stroke:#333,stroke-width:2px
```

**Security Notes**:
- PostgreSQL and Redis are NOT directly accessible from external network
- Only Backend can connect to databases (via db-net)
- Frontend cannot directly access databases
- For production, comment out port mappings for PostgreSQL and Redis

---

## Docker CLI Command Reference

### Container Management

#### Start Services

```bash
# Start all services (production)
docker-compose up -d

# Start all services (development)
docker-compose -f docker-compose.dev.yml up -d

# Start specific service
docker-compose up -d backend

# Start with build (force rebuild)
docker-compose up -d --build

# Start without detach (view logs)
docker-compose up
```

#### Stop Services

```bash
# Stop all services
docker-compose down

# Stop without removing containers
docker-compose stop

# Stop specific service
docker-compose stop backend

# Stop and remove volumes (DANGER: data loss)
docker-compose down -v
```

#### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend

# Restart with new environment variables
docker-compose up -d --force-recreate backend
```

### Image Management

#### Build Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend

# Build without cache
docker-compose build --no-cache

# Build with progress
docker-compose build --progress=plain

# Build and start
docker-compose up -d --build
```

#### List Images

```bash
# List all images
docker images

# List White Cross images
docker images | grep whitecross

# List with size
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

#### Remove Images

```bash
# Remove specific image
docker rmi whitecross-backend

# Remove dangling images
docker image prune

# Remove all unused images
docker image prune -a

# Remove specific service image
docker-compose down --rmi local
```

### Log Management

#### View Logs

```bash
# View all logs
docker-compose logs

# Follow logs (live tail)
docker-compose logs -f

# View specific service logs
docker-compose logs backend

# Follow specific service logs
docker-compose logs -f backend frontend

# View last N lines
docker-compose logs --tail=100 backend

# View logs with timestamps
docker-compose logs -t backend

# View logs since timestamp
docker-compose logs --since "2025-11-03T10:00:00" backend

# View logs between timestamps
docker-compose logs --since "2025-11-03T10:00:00" --until "2025-11-03T11:00:00" backend
```

#### Export Logs

```bash
# Export logs to file
docker-compose logs > docker-logs.txt

# Export specific service logs
docker-compose logs backend > backend-logs.txt

# Export with timestamps
docker-compose logs -t backend > backend-logs-$(date +%Y%m%d).txt
```

### Service Status

#### Check Status

```bash
# View service status
docker-compose ps

# View with resource usage
docker stats

# View specific services
docker-compose ps backend postgres redis

# View all containers (including stopped)
docker-compose ps -a
```

#### Health Checks

```bash
# View health status
docker inspect --format='{{.State.Health.Status}}' whitecross-backend

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' whitecross-backend

# Check all services health
docker-compose ps --format "table {{.Name}}\t{{.Status}}"
```

### Resource Usage

#### Monitor Resources

```bash
# Live resource monitoring
docker stats

# Monitor specific containers
docker stats whitecross-backend whitecross-postgres

# Format output
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# No stream (single snapshot)
docker stats --no-stream
```

#### Resource Limits

```bash
# View container resource limits
docker inspect whitecross-backend --format='{{.HostConfig.Memory}}'

# Update resource limits (requires restart)
docker update --memory="1g" --cpus="1.0" whitecross-backend
```

### Shell Access

#### Access Container Shell

```bash
# Backend shell
docker exec -it whitecross-backend sh

# Frontend shell
docker exec -it whitecross-frontend sh

# PostgreSQL psql
docker exec -it whitecross-postgres psql -U whitecross -d whitecross

# Redis CLI
docker exec -it whitecross-redis redis-cli
```

#### Execute Commands

```bash
# Run command in container
docker exec whitecross-backend npm run migration:status

# Run as specific user
docker exec -u node whitecross-backend whoami

# Run with environment variable
docker exec -e DEBUG=true whitecross-backend npm test
```

### File Operations

#### Copy Files

```bash
# Copy from container to host
docker cp whitecross-backend:/app/logs/app.log ./app.log

# Copy from host to container
docker cp ./config.json whitecross-backend:/app/config.json

# Copy directory
docker cp whitecross-backend:/app/uploads ./uploads-backup
```

### Database Operations

#### PostgreSQL

```bash
# Database backup
docker exec whitecross-postgres pg_dump -U whitecross whitecross > backup.sql

# Database restore
docker exec -i whitecross-postgres psql -U whitecross -d whitecross < backup.sql

# Run SQL query
docker exec whitecross-postgres psql -U whitecross -d whitecross -c "SELECT COUNT(*) FROM users;"

# Run SQL file
docker exec -i whitecross-postgres psql -U whitecross -d whitecross < script.sql

# Database size
docker exec whitecross-postgres psql -U whitecross -d whitecross -c "SELECT pg_size_pretty(pg_database_size('whitecross'));"

# Active connections
docker exec whitecross-postgres psql -U whitecross -d whitecross -c "SELECT count(*) FROM pg_stat_activity;"
```

#### Redis

```bash
# Connect to Redis CLI
docker exec -it whitecross-redis redis-cli

# Run Redis command
docker exec whitecross-redis redis-cli INFO memory

# Save snapshot
docker exec whitecross-redis redis-cli SAVE

# Get all keys (DB 0)
docker exec whitecross-redis redis-cli -n 0 KEYS '*'

# Flush cache (DB 0)
docker exec whitecross-redis redis-cli -n 0 FLUSHDB

# Monitor commands
docker exec whitecross-redis redis-cli MONITOR
```

### Troubleshooting Commands

#### Diagnose Issues

```bash
# View container processes
docker top whitecross-backend

# Inspect container configuration
docker inspect whitecross-backend

# View container changes
docker diff whitecross-backend

# View port mappings
docker port whitecross-backend

# Network connectivity
docker exec whitecross-backend ping postgres
docker exec whitecross-backend nc -zv postgres 5432

# DNS resolution
docker exec whitecross-backend nslookup postgres
```

#### Debug Failed Containers

```bash
# View exit code
docker inspect whitecross-backend --format='{{.State.ExitCode}}'

# View error logs
docker logs --tail=100 whitecross-backend

# Start container with shell (override command)
docker run -it --entrypoint sh whitecross-backend

# View container events
docker events --filter container=whitecross-backend
```

### Cleanup Commands

#### Clean Up Resources

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything unused
docker system prune

# Remove everything including volumes (DANGER)
docker system prune -a --volumes

# Remove specific service
docker-compose rm -f backend

# Remove all White Cross containers
docker ps -a | grep whitecross | awk '{print $1}' | xargs docker rm -f
```

---

## Quick Reference Guide

### Common Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development
docker-compose -f docker-compose.dev.yml down

# Rebuild after code changes
docker-compose -f docker-compose.dev.yml up -d --build backend

# Access backend shell
docker exec -it whitecross-backend-dev sh

# Run migrations
docker exec whitecross-backend-dev npm run migration:run

# Reset development database
docker-compose -f docker-compose.dev.yml down -v postgres
docker-compose -f docker-compose.dev.yml up -d postgres
```

### Common Production Commands

```bash
# Start production environment
docker-compose up -d

# View service status
docker-compose ps

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Update service with new image
docker-compose pull backend
docker-compose up -d backend

# Backup database
docker exec whitecross-postgres pg_dump -U whitecross whitecross > backup-$(date +%Y%m%d).sql

# View resource usage
docker stats
```

### Health Check Commands

```bash
# Check all services
docker-compose ps

# Backend health
curl http://localhost:3001/health

# Frontend health
curl http://localhost:3000/api/health

# PostgreSQL health
docker exec whitecross-postgres pg_isready -U whitecross -d whitecross

# Redis health
docker exec whitecross-redis redis-cli ping

# Prometheus health
curl http://localhost:9090/-/healthy
```

### Database Commands

```bash
# PostgreSQL shell
docker exec -it whitecross-postgres psql -U whitecross -d whitecross

# Run migrations
docker exec whitecross-backend npm run migration:run

# Migration status
docker exec whitecross-backend npm run migration:status

# Backup database
docker exec whitecross-postgres pg_dump -U whitecross whitecross > backup.sql

# Restore database
docker exec -i whitecross-postgres psql -U whitecross -d whitecross < backup.sql

# Redis CLI
docker exec -it whitecross-redis redis-cli

# Clear cache
docker exec whitecross-redis redis-cli -n 0 FLUSHDB
```

### Troubleshooting Commands

```bash
# View backend logs
docker logs -f whitecross-backend

# Test backend API
curl http://localhost:3001/health

# Test database connection
docker exec whitecross-backend psql -h postgres -U whitecross -d whitecross -c "SELECT 1;"

# Test Redis connection
docker exec whitecross-backend redis-cli -h redis ping

# Network connectivity
docker exec whitecross-backend ping postgres
docker exec whitecross-backend ping redis

# Resource usage
docker stats whitecross-backend whitecross-postgres whitecross-redis

# Restart service
docker-compose restart backend
```

---

## Deployment Workflows

### Local Development Workflow

#### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd white-cross

# 2. Copy environment file
cp .env.docker.example .env

# 3. Build images
docker-compose -f docker-compose.dev.yml build

# 4. Start services
docker-compose -f docker-compose.dev.yml up -d

# 5. Check service status
docker-compose -f docker-compose.dev.yml ps

# 6. View logs
docker-compose -f docker-compose.dev.yml logs -f

# 7. Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Prometheus: http://localhost:9090
```

#### Daily Development

```bash
# Start services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f backend frontend

# Make code changes (hot reload enabled)

# Run tests
docker exec whitecross-backend-dev npm test

# Run migrations (if needed)
docker exec whitecross-backend-dev npm run migration:run

# Stop services
docker-compose -f docker-compose.dev.yml down
```

#### Troubleshooting Development Issues

```bash
# Rebuild after dependency changes
docker-compose -f docker-compose.dev.yml up -d --build backend

# Clear node_modules cache
docker volume rm whitecross-backend-dev-node-modules
docker-compose -f docker-compose.dev.yml up -d --build backend

# Reset database
docker-compose -f docker-compose.dev.yml down -v postgres
docker-compose -f docker-compose.dev.yml up -d postgres

# View detailed logs
docker-compose -f docker-compose.dev.yml logs --tail=200 backend

# Access backend shell for debugging
docker exec -it whitecross-backend-dev sh
```

### Production Deployment Workflow

#### Initial Production Deployment

```bash
# 1. Prepare environment
cp .env.docker.example .env
nano .env  # Update production values

# 2. Generate secrets
export JWT_SECRET=$(openssl rand -base64 64)
export JWT_REFRESH_SECRET=$(openssl rand -base64 64)
export POSTGRES_PASSWORD=$(openssl rand -base64 32)

# 3. Update .env with secrets
echo "JWT_SECRET=$JWT_SECRET" >> .env
echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET" >> .env
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> .env

# 4. Build production images
docker-compose build --no-cache

# 5. Start services
docker-compose up -d

# 6. Wait for services to be healthy
docker-compose ps

# 7. Run database migrations
docker exec whitecross-backend npm run migration:run

# 8. Verify deployment
curl http://localhost:3001/health
curl http://localhost:3000/api/health

# 9. Create initial backup
docker exec whitecross-postgres pg_dump -U whitecross whitecross > initial-backup-$(date +%Y%m%d).sql
```

#### Production Updates

```bash
# 1. Backup database
docker exec whitecross-postgres pg_dump -U whitecross whitecross > backup-$(date +%Y%m%d).sql

# 2. Pull latest code
git pull origin main

# 3. Build new images
docker-compose build backend frontend

# 4. Update backend (with zero downtime)
docker-compose up -d --no-deps --build backend

# 5. Run migrations
docker exec whitecross-backend npm run migration:run

# 6. Update frontend
docker-compose up -d --no-deps --build frontend

# 7. Verify health
curl http://localhost:3001/health
curl http://localhost:3000/api/health

# 8. Monitor logs
docker-compose logs -f --tail=100
```

#### Rollback Procedure

```bash
# 1. Stop services
docker-compose down

# 2. Checkout previous version
git checkout <previous-commit-hash>

# 3. Restore database (if needed)
docker-compose up -d postgres
docker exec -i whitecross-postgres psql -U whitecross -d whitecross < backup-YYYYMMDD.sql

# 4. Rebuild and restart
docker-compose build
docker-compose up -d

# 5. Verify
docker-compose ps
curl http://localhost:3001/health
```

### Backup and Restore Workflow

#### Daily Backup

```bash
#!/bin/bash
# backup.sh - Daily backup script

DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/backups/whitecross"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker exec whitecross-postgres pg_dump -U whitecross whitecross \
  > $BACKUP_DIR/postgres-$DATE.sql

# Backup volumes
docker run --rm \
  -v whitecross-postgres-data:/data \
  -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/postgres-data-$DATE.tar.gz /data

docker run --rm \
  -v whitecross-redis-data:/data \
  -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/redis-data-$DATE.tar.gz /data

docker run --rm \
  -v whitecross-backend-uploads:/data \
  -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/uploads-$DATE.tar.gz /data

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

#### Restore from Backup

```bash
#!/bin/bash
# restore.sh - Restore from backup

BACKUP_DATE="20251103-120000"
BACKUP_DIR="/backups/whitecross"

# 1. Stop services
docker-compose down

# 2. Restore PostgreSQL data volume
docker run --rm \
  -v whitecross-postgres-data:/data \
  -v $BACKUP_DIR:/backup \
  alpine sh -c "cd / && tar xzf /backup/postgres-data-$BACKUP_DATE.tar.gz"

# 3. Restore Redis data volume
docker run --rm \
  -v whitecross-redis-data:/data \
  -v $BACKUP_DIR:/backup \
  alpine sh -c "cd / && tar xzf /backup/redis-data-$BACKUP_DATE.tar.gz"

# 4. Restore uploads volume
docker run --rm \
  -v whitecross-backend-uploads:/data \
  -v $BACKUP_DIR:/backup \
  alpine sh -c "cd / && tar xzf /backup/uploads-$BACKUP_DATE.tar.gz"

# 5. Start services
docker-compose up -d

# 6. Verify
docker-compose ps
curl http://localhost:3001/health

echo "Restore completed: $BACKUP_DATE"
```

---

## CI/CD Integration

### GitHub Actions

#### Build and Test

```yaml
name: Build and Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Create .env file
        run: cp .env.docker.example .env

      - name: Build images
        run: docker-compose build

      - name: Start services
        run: docker-compose up -d

      - name: Wait for services
        run: |
          timeout 120 sh -c 'until docker-compose ps | grep healthy; do sleep 5; done'

      - name: Run backend tests
        run: docker exec whitecross-backend npm test

      - name: Run migrations
        run: docker exec whitecross-backend npm run migration:run

      - name: Health check
        run: |
          curl -f http://localhost:3001/health || exit 1
          curl -f http://localhost:3000/api/health || exit 1

      - name: Stop services
        run: docker-compose down -v
```

#### Deploy to Production

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup SSH
        uses: webfactory/ssh-agent@v0.5.4
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

      - name: Deploy to server
        run: |
          ssh user@production-server << 'EOF'
            cd /opt/white-cross
            git pull origin main
            docker-compose pull
            docker-compose up -d --no-deps --build backend frontend
            docker exec whitecross-backend npm run migration:run
            docker-compose ps
          EOF

      - name: Verify deployment
        run: |
          ssh user@production-server << 'EOF'
            curl -f http://localhost:3001/health || exit 1
            curl -f http://localhost:3000/api/health || exit 1
          EOF
```

### GitLab CI

```yaml
# .gitlab-ci.yml

stages:
  - build
  - test
  - deploy

variables:
  DOCKER_DRIVER: overlay2

build:
  stage: build
  script:
    - cp .env.docker.example .env
    - docker-compose build
    - docker-compose push

test:
  stage: test
  script:
    - cp .env.docker.example .env
    - docker-compose up -d
    - timeout 120 sh -c 'until docker-compose ps | grep healthy; do sleep 5; done'
    - docker exec whitecross-backend npm test
    - docker exec whitecross-backend npm run migration:run
    - curl -f http://localhost:3001/health || exit 1
    - docker-compose down -v

deploy-production:
  stage: deploy
  only:
    - main
  script:
    - ssh user@production-server << 'EOF'
        cd /opt/white-cross
        git pull origin main
        docker-compose pull
        docker-compose up -d --no-deps --build backend frontend
        docker exec whitecross-backend npm run migration:run
      EOF
```

### Docker Registry Integration

#### Build and Push

```bash
# Tag images
docker tag whitecross-backend:latest registry.example.com/whitecross/backend:latest
docker tag whitecross-backend:latest registry.example.com/whitecross/backend:v1.0.0
docker tag whitecross-frontend:latest registry.example.com/whitecross/frontend:latest
docker tag whitecross-frontend:latest registry.example.com/whitecross/frontend:v1.0.0

# Login to registry
docker login registry.example.com

# Push images
docker push registry.example.com/whitecross/backend:latest
docker push registry.example.com/whitecross/backend:v1.0.0
docker push registry.example.com/whitecross/frontend:latest
docker push registry.example.com/whitecross/frontend:v1.0.0

# Update docker-compose.yml to use registry images
# backend:
#   image: registry.example.com/whitecross/backend:v1.0.0
# frontend:
#   image: registry.example.com/whitecross/frontend:v1.0.0
```

#### Pull and Deploy

```bash
# Pull images from registry
docker-compose pull

# Deploy with registry images
docker-compose up -d
```

---

## Appendix

### Service Port Reference

| Service | Port | Protocol | Access | Purpose |
|---------|------|----------|--------|---------|
| Frontend | 3000 | HTTP | Public | Next.js web application |
| Backend API | 3001 | HTTP | Public | NestJS REST API |
| Backend WebSocket | 3002 | WebSocket | Public | Socket.io real-time |
| Backend Debug | 9229 | TCP | Dev only | Node.js debugger |
| PostgreSQL | 5432 | TCP | Internal | Database |
| Redis | 6379 | TCP | Internal | Cache/Queue |
| Prometheus | 9090 | HTTP | Admin | Monitoring UI |

### Docker Compose File Reference

| File | Purpose | Use Case |
|------|---------|----------|
| `docker-compose.yml` | Production configuration | Production deployment |
| `docker-compose.dev.yml` | Development configuration | Local development |
| `prometheus.yml` | Prometheus configuration | Metrics scraping |
| `.env.docker.example` | Environment template | Configuration reference |

### Volume Size Estimates

| Volume | Development | Production (Small) | Production (Large) |
|--------|------------|-------------------|-------------------|
| PostgreSQL | 1-5 GB | 5-50 GB | 50-500 GB |
| Redis | 50-100 MB | 100 MB - 1 GB | 1-10 GB |
| Prometheus | 100-500 MB | 1-5 GB | 5-50 GB |
| Backend Uploads | 100 MB | 1-10 GB | 10-100 GB |
| Node Modules (dev) | 500 MB | - | - |

### Security Checklist

- [ ] Strong `POSTGRES_PASSWORD` set
- [ ] Strong `JWT_SECRET` and `JWT_REFRESH_SECRET` set
- [ ] `REDIS_PASSWORD` set for production
- [ ] PostgreSQL port not exposed in production
- [ ] Redis port not exposed in production
- [ ] `CORS_ORIGIN` set to production domain
- [ ] `NEXT_PUBLIC_API_URL` set to production backend
- [ ] SSL/TLS configured for external access
- [ ] Regular backups configured
- [ ] Monitoring and alerting configured
- [ ] Docker images from trusted sources
- [ ] Container resource limits set
- [ ] Non-root users in containers
- [ ] Secrets not committed to version control

---

**End of Docker Infrastructure API Reference**

For setup instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md)
For database details, see [scripts/DATABASE_SETUP.md](./scripts/DATABASE_SETUP.md)

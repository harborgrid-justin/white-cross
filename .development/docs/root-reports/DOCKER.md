# White Cross Healthcare Platform - Docker Architecture

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Configurations](#environment-configurations)
- [Development Workflow](#development-workflow)
- [Testing with Playwright](#testing-with-playwright)
- [Production Deployment](#production-deployment)
- [Service Details](#service-details)
- [Networking](#networking)
- [Health Checks](#health-checks)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)
- [Performance Optimization](#performance-optimization)

---

## Overview

This Docker architecture provides a comprehensive containerized deployment solution for the White Cross Healthcare Platform with:

- **Multi-stage builds** for optimized image sizes
- **Three environment configurations**: Production, Development, and Testing
- **Dedicated Playwright test container** for reliable E2E testing
- **Comprehensive health checks** preventing race conditions
- **Security hardening** with non-root users and minimal attack surface
- **Hot-reload support** for efficient local development
- **CI/CD ready** with optimized build caching

### Container Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Docker Network Bridge                      │
│                  (white-cross-network)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Frontend  │  │  Backend  │  │PostgreSQL│  │  Redis   │ │
│  │  (Nginx)  │◄─┤  (Hapi)   │◄─┤   (DB)   │  │ (Cache)  │ │
│  │   :8080   │  │   :3001   │  │  :5432   │  │  :6379   │ │
│  └───────────┘  └───────────┘  └──────────┘  └──────────┘ │
│       ▲              ▲              ▲              ▲        │
│       │              │              │              │        │
│       │         ┌────┴──────────────┴──────────────┘        │
│       │         │                                           │
│       │    ┌────▼──────┐                                    │
│       │    │ Playwright │                                   │
│       └────┤   Tests    │                                   │
│            │  Container │                                   │
│            └────────────┘                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

- **Docker**: 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: 2.0+ ([Install Docker Compose](https://docs.docker.com/compose/install/))
- **Git**: For cloning the repository
- **At least 4GB RAM** available for Docker
- **At least 10GB disk space** for images and volumes

### Verify Installation

```bash
docker --version
# Docker version 20.10.0 or higher

docker-compose --version
# Docker Compose version 2.0.0 or higher
```

---

## Quick Start

### Development Environment (Recommended for Local Development)

```bash
# 1. Clone the repository
git clone <repository-url>
cd white-cross

# 2. Copy environment file
cp .env.docker.dev .env.docker

# 3. Start all services with hot-reload
docker-compose -f docker-compose.dev.new.yml up

# 4. Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# API Docs: http://localhost:3001/docs
# Adminer (DB UI): http://localhost:8080
# Redis Commander: http://localhost:8081
# Mailhog (Email): http://localhost:8025
```

### Run E2E Tests

```bash
# Run all Playwright tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Run specific browser tests
docker-compose -f docker-compose.test.yml run playwright npx playwright test --project=chromium

# Run tests in headed mode (for debugging)
docker-compose -f docker-compose.test.yml run playwright npx playwright test --headed

# View test report
docker-compose -f docker-compose.test.yml run playwright npx playwright show-report
```

### Production Deployment

```bash
# 1. Copy and configure production environment
cp .env.docker.example .env.docker
# Edit .env.docker with production values

# 2. Build and start production services
docker-compose -f docker-compose.prod.yml up -d

# 3. Access the application
# Frontend: http://localhost:8080
# Backend API: http://localhost:3001
# Health Check: http://localhost:3001/health
```

---

## Environment Configurations

### 1. Production (`docker-compose.prod.yml`)

**Purpose**: Optimized for production deployment with security and performance.

**Features**:
- Multi-stage builds with minimal runtime dependencies
- Non-root users for security
- Health checks with proper timeouts
- Log rotation configured
- Resource limits applied
- Restart policies enabled
- Persistent volumes for data
- No development tools or hot-reload

**Usage**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Environment File**: `.env.docker` (copy from `.env.docker.example`)

### 2. Development (`docker-compose.dev.new.yml`)

**Purpose**: Local development with hot-reload and development tools.

**Features**:
- Source code mounted as volumes (hot-reload)
- Development tools included (Adminer, Redis Commander, Mailhog)
- Debug ports exposed
- Swagger API documentation enabled
- Detailed logging
- No resource limits for flexibility

**Usage**:
```bash
docker-compose -f docker-compose.dev.new.yml up
```

**Environment File**: `.env.docker.dev` (pre-configured)

### 3. Testing (`docker-compose.test.yml`)

**Purpose**: Isolated E2E testing environment with Playwright.

**Features**:
- Isolated test database and Redis
- Playwright container with all browsers
- tmpfs for faster test execution
- Test-optimized configuration (reduced bcrypt rounds)
- Automatic cleanup after tests
- Artifact collection (screenshots, videos, reports)

**Usage**:
```bash
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

**Environment File**: `.env.docker.test` (pre-configured)

---

## Development Workflow

### Starting Development Environment

```bash
# Start all services
docker-compose -f docker-compose.dev.new.yml up

# Start in detached mode
docker-compose -f docker-compose.dev.new.yml up -d

# View logs
docker-compose -f docker-compose.dev.new.yml logs -f

# View specific service logs
docker-compose -f docker-compose.dev.new.yml logs -f backend
```

### Making Code Changes

- **Backend**: Changes are automatically detected and server restarts (nodemon)
- **Frontend**: Changes trigger hot module replacement (Vite HMR)

### Database Management

```bash
# Access Adminer (Database UI)
open http://localhost:8080

# Run migrations manually
docker-compose -f docker-compose.dev.new.yml exec backend npm run db:migrate

# Run seeders
docker-compose -f docker-compose.dev.new.yml exec backend npm run db:seed

# Access PostgreSQL CLI
docker-compose -f docker-compose.dev.new.yml exec postgres psql -U postgres -d white_cross_dev
```

### Redis Management

```bash
# Access Redis Commander (Redis UI)
open http://localhost:8081

# Access Redis CLI
docker-compose -f docker-compose.dev.new.yml exec redis redis-cli
```

### Email Testing with Mailhog

```bash
# View sent emails
open http://localhost:8025

# SMTP server available at: localhost:1025
```

### Stopping Services

```bash
# Stop all services
docker-compose -f docker-compose.dev.new.yml down

# Stop and remove volumes
docker-compose -f docker-compose.dev.new.yml down -v

# Stop and remove images
docker-compose -f docker-compose.dev.new.yml down --rmi all
```

---

## Testing with Playwright

### Running All Tests

```bash
# Run all tests with all browsers
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Run tests and cleanup
docker-compose -f docker-compose.test.yml up --abort-on-container-exit && \
docker-compose -f docker-compose.test.yml down
```

### Running Specific Tests

```bash
# Run only Chromium tests
docker-compose -f docker-compose.test.yml run playwright \
  npx playwright test --project=chromium

# Run only Firefox tests
docker-compose -f docker-compose.test.yml run playwright \
  npx playwright test --project=firefox

# Run only WebKit tests
docker-compose -f docker-compose.test.yml run playwright \
  npx playwright test --project=webkit

# Run specific test file
docker-compose -f docker-compose.test.yml run playwright \
  npx playwright test frontend/tests/e2e/01-authentication/login.spec.ts

# Run tests matching a pattern
docker-compose -f docker-compose.test.yml run playwright \
  npx playwright test --grep "@smoke"
```

### Debugging Tests

```bash
# Run in headed mode (see browser)
docker-compose -f docker-compose.test.yml run playwright \
  npx playwright test --headed

# Run in debug mode
docker-compose -f docker-compose.test.yml run playwright \
  npx playwright test --debug

# Run with UI mode
docker-compose -f docker-compose.test.yml run \
  -p 9323:9323 \
  playwright \
  npx playwright test --ui --ui-host=0.0.0.0
```

### Viewing Test Results

```bash
# Show HTML report
docker-compose -f docker-compose.test.yml run \
  -p 9323:9323 \
  playwright \
  npx playwright show-report --host=0.0.0.0

# Copy reports from container
docker cp white-cross-playwright-test:/app/playwright-report ./playwright-report
docker cp white-cross-playwright-test:/app/test-results ./test-results
```

### Test Artifacts

Test artifacts are stored in Docker volumes and can be accessed:

- **HTML Reports**: `playwright-report` volume
- **Test Results**: `playwright_test_results` volume
- **Screenshots**: Included in test results
- **Videos**: Included in test results (on failure)

---

## Production Deployment

### Prerequisites

1. **Secure Environment Variables**: Never use default/dev credentials
2. **SSL/TLS Certificates**: Required for HTTPS (use reverse proxy like Nginx/Traefik)
3. **Backup Strategy**: Configure database and volume backups
4. **Monitoring**: Set up monitoring and alerting (Sentry, DataDog, etc.)

### Deployment Steps

```bash
# 1. Prepare environment
cp .env.docker.example .env.docker
# Edit .env.docker with production credentials

# 2. Build images
docker-compose -f docker-compose.prod.yml build

# 3. Start services
docker-compose -f docker-compose.prod.yml up -d

# 4. Verify health
curl http://localhost:3001/health
curl http://localhost:8080/health

# 5. View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Database Migrations

Migrations run automatically on backend container startup via `docker-entrypoint.sh`.

To run manually:

```bash
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate
```

To disable automatic migrations, set `RUN_MIGRATIONS=false` in environment.

### Scaling Services

```bash
# Scale backend to 3 instances
docker-compose -f docker-compose.prod.yml up -d --scale backend=3

# Note: Requires load balancer configuration (Nginx, HAProxy, etc.)
```

### Updating Services

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Or rebuild specific service
docker-compose -f docker-compose.prod.yml up -d --build backend
```

---

## Service Details

### Backend Service

**Image**: `white-cross-backend:latest`

**Technology**: Node.js 18, TypeScript, Hapi.js, Sequelize ORM

**Ports**:
- `3001`: HTTP API
- `9229`: Debug port (development only)

**Health Check**: `GET /health`

**Volumes**:
- Production: Logs only
- Development: Source code mounted

**Environment Variables**: See `.env.docker.example`

### Frontend Service

**Image**: `white-cross-frontend:latest`

**Technology**: React 19, TypeScript, Vite, Nginx

**Ports**:
- `8080`: HTTP (production)
- `5173`: Vite dev server (development)

**Health Check**: `GET /health`

**Nginx Configuration**: `frontend/nginx.conf.new`

### PostgreSQL Service

**Image**: `postgres:15-alpine`

**Port**: `5432`

**Health Check**: `pg_isready`

**Volumes**: `postgres_data`

**Environment Variables**:
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

### Redis Service

**Image**: `redis:7-alpine`

**Port**: `6379`

**Health Check**: `redis-cli ping`

**Volumes**: `redis_data`

**Persistence**: AOF (Append Only File) enabled

### Playwright Service

**Image**: `mcr.microsoft.com/playwright:v1.56.1-jammy`

**Browsers**: Chromium, Firefox, WebKit

**Environment Variables**:
- `PLAYWRIGHT_BASE_URL`: Frontend URL
- `API_BASE_URL`: Backend API URL
- `PLAYWRIGHT_WORKERS`: Parallel workers (default: 4)

---

## Networking

### Network Configuration

All services run on a dedicated bridge network: `white-cross-network`

**Subnet**: `172.28.0.0/16` (production), `172.29.0.0/16` (test)

**DNS Resolution**: Services can communicate using service names:
- `http://backend:3001` - Backend API
- `http://frontend:8080` - Frontend
- `postgres:5432` - PostgreSQL
- `redis:6379` - Redis

### Service Communication

```
User Browser → Frontend (Nginx) → Backend (Hapi) → PostgreSQL
                                 → Redis

Playwright Tests → Frontend → Backend → PostgreSQL (Test DB)
```

### Exposed Ports

**Production**:
- `3001` - Backend API
- `8080` - Frontend

**Development**:
- `3001` - Backend API
- `5173` - Frontend Dev Server
- `9229` - Backend Debug
- `5432` - PostgreSQL
- `6379` - Redis
- `8080` - Adminer
- `8081` - Redis Commander
- `8025` - Mailhog Web UI
- `1025` - Mailhog SMTP

---

## Health Checks

### Backend Health Check

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "OK",
  "timestamp": "2025-10-24T14:30:00.000Z",
  "uptime": 123.45,
  "environment": "production",
  "database": "connected",
  "redis": "connected"
}
```

**Configuration**:
- Interval: 30s
- Timeout: 10s
- Retries: 3
- Start Period: 60s

### Database Health Check

**Command**: `pg_isready -U $USER -d $DB`

**Configuration**:
- Interval: 10s
- Timeout: 5s
- Retries: 5

### Redis Health Check

**Command**: `redis-cli ping`

**Configuration**:
- Interval: 10s
- Timeout: 5s
- Retries: 5

### Checking Service Health

```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Check specific service health
docker inspect --format='{{json .State.Health}}' white-cross-backend-prod

# View health check logs
docker-compose -f docker-compose.prod.yml logs backend | grep health
```

---

## Troubleshooting

### Common Issues

#### 1. Services Not Starting

**Symptoms**: Container exits immediately after starting

**Solutions**:
```bash
# Check logs
docker-compose -f docker-compose.*.yml logs backend

# Check for port conflicts
lsof -i :3001
lsof -i :5173

# Verify environment variables
docker-compose -f docker-compose.*.yml config

# Rebuild containers
docker-compose -f docker-compose.*.yml up --build
```

#### 2. Database Connection Errors

**Symptoms**: Backend can't connect to PostgreSQL

**Solutions**:
```bash
# Verify PostgreSQL is healthy
docker-compose -f docker-compose.*.yml ps postgres

# Check database credentials
docker-compose -f docker-compose.*.yml exec postgres \
  psql -U $DB_USER -d $DB_NAME -c '\conninfo'

# Wait for database to be ready
docker-compose -f docker-compose.*.yml logs postgres | grep "ready"

# Manually test connection
docker-compose -f docker-compose.*.yml exec backend \
  node -e "require('./dist/config/database').checkDatabaseHealth()"
```

#### 3. Frontend Can't Reach Backend

**Symptoms**: API calls fail from frontend

**Solutions**:
```bash
# Verify backend is running
curl http://localhost:3001/health

# Check CORS configuration
# Ensure CORS_ORIGIN matches frontend URL

# Verify network connectivity
docker-compose -f docker-compose.*.yml exec frontend curl http://backend:3001/health

# Check browser console for errors
```

#### 4. Hot Reload Not Working

**Symptoms**: Code changes don't reflect in running application

**Solutions**:
```bash
# Verify volumes are mounted
docker-compose -f docker-compose.dev.new.yml ps -v

# Restart services
docker-compose -f docker-compose.dev.new.yml restart

# Check file permissions
ls -la backend/src
ls -la frontend/src

# For Mac users: Ensure file sharing is enabled in Docker Desktop
```

#### 5. Playwright Tests Failing

**Symptoms**: Tests timeout or fail unexpectedly

**Solutions**:
```bash
# Verify services are healthy
docker-compose -f docker-compose.test.yml ps

# Check service logs
docker-compose -f docker-compose.test.yml logs backend-test
docker-compose -f docker-compose.test.yml logs frontend-test

# Run tests in headed mode
docker-compose -f docker-compose.test.yml run playwright \
  npx playwright test --headed

# Increase timeout
docker-compose -f docker-compose.test.yml run \
  -e PLAYWRIGHT_TIMEOUT=120000 \
  playwright npx playwright test
```

#### 6. Out of Disk Space

**Symptoms**: Cannot create container or build image

**Solutions**:
```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Clean everything (careful!)
docker system prune -a --volumes
```

### Viewing Logs

```bash
# All services
docker-compose -f docker-compose.*.yml logs -f

# Specific service
docker-compose -f docker-compose.*.yml logs -f backend

# Last 100 lines
docker-compose -f docker-compose.*.yml logs --tail=100 backend

# Since timestamp
docker-compose -f docker-compose.*.yml logs --since 2025-10-24T14:00:00 backend
```

### Accessing Container Shell

```bash
# Access backend shell
docker-compose -f docker-compose.*.yml exec backend sh

# Access frontend shell
docker-compose -f docker-compose.*.yml exec frontend sh

# Access database shell
docker-compose -f docker-compose.*.yml exec postgres psql -U $DB_USER -d $DB_NAME
```

---

## Security Best Practices

### 1. Environment Variables

- Never commit `.env.docker` to version control
- Use strong, random passwords for database and Redis
- Use at least 32-character random strings for JWT secrets
- Rotate secrets regularly
- Use Docker secrets in production (Swarm/Kubernetes)

### 2. Container Security

- Run as non-root user (implemented in all Dockerfiles)
- Use official base images (Alpine Linux)
- Apply security updates regularly
- Scan images for vulnerabilities:
  ```bash
  docker scan white-cross-backend:latest
  ```

### 3. Network Security

- Use dedicated bridge network (isolates from other containers)
- Expose only necessary ports
- Use reverse proxy with SSL/TLS for production
- Implement rate limiting on API endpoints

### 4. Database Security

- Use strong passwords
- Enable SSL/TLS for database connections in production
- Regular backups
- Restrict database access to application only

### 5. Application Security

- Enable all security headers (configured in Nginx)
- Implement CORS properly
- Use HTTPS in production
- Enable CSRF protection
- Regular security audits

---

## Performance Optimization

### Build Performance

```bash
# Use BuildKit for parallel builds
export DOCKER_BUILDKIT=1
docker-compose -f docker-compose.*.yml build

# Use build cache
docker-compose -f docker-compose.*.yml build --parallel

# Optimize layer caching (already implemented in Dockerfiles)
```

### Runtime Performance

1. **Resource Limits**: Configure in docker-compose.yml
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1.0'
         memory: 1G
       reservations:
         cpus: '0.5'
         memory: 512M
   ```

2. **Connection Pooling**: Already configured in backend
   - Database: Min 2, Max 10 connections
   - Redis: Connection reuse enabled

3. **Caching**:
   - Redis for API response caching
   - Nginx for static asset caching
   - Browser caching headers configured

4. **Database Optimization**:
   - Use indexes on frequently queried fields
   - Regular VACUUM and ANALYZE
   - Monitor slow queries

### Monitoring Performance

```bash
# Container stats
docker stats

# Specific service stats
docker stats white-cross-backend-prod

# Database connections
docker-compose -f docker-compose.*.yml exec postgres \
  psql -U $DB_USER -d $DB_NAME -c "SELECT count(*) FROM pg_stat_activity;"

# Redis info
docker-compose -f docker-compose.*.yml exec redis redis-cli INFO
```

---

## Backup and Restore

### Database Backup

```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U $DB_USER $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backups (add to crontab)
0 2 * * * cd /path/to/white-cross && \
  docker-compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U white_cross_user white_cross | \
  gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

### Database Restore

```bash
# Restore from backup
docker-compose -f docker-compose.prod.yml exec -T postgres \
  psql -U $DB_USER $DB_NAME < backup_20251024_140000.sql

# Or with gzip
gunzip -c backup_20251024.sql.gz | \
  docker-compose -f docker-compose.prod.yml exec -T postgres \
  psql -U $DB_USER $DB_NAME
```

### Volume Backup

```bash
# Backup volume
docker run --rm \
  -v white-cross-postgres-data-prod:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/postgres_data_$(date +%Y%m%d).tar.gz -C /data .

# Restore volume
docker run --rm \
  -v white-cross-postgres-data-prod:/data \
  -v $(pwd)/backups:/backup \
  alpine tar xzf /backup/postgres_data_20251024.tar.gz -C /data
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and test
        run: |
          cp .env.docker.test .env.docker
          docker-compose -f docker-compose.test.yml up \
            --abort-on-container-exit \
            --exit-code-from playwright

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Playwright Documentation](https://playwright.dev/)
- [PostgreSQL Docker Documentation](https://hub.docker.com/_/postgres)
- [Nginx Docker Documentation](https://hub.docker.com/_/nginx)
- [Redis Docker Documentation](https://hub.docker.com/_/redis)

---

## Support

For issues and questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review container logs
3. Check service health status
4. Open an issue on GitHub

---

## License

MIT License - See LICENSE file for details

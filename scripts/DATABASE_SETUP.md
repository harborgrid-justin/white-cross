# Database Setup Guide - White Cross Healthcare Platform

This guide provides comprehensive instructions for setting up and managing the PostgreSQL and Redis databases for the White Cross Healthcare Platform in a Docker environment.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [PostgreSQL Setup](#postgresql-setup)
- [Redis Setup](#redis-setup)
- [Database Migrations](#database-migrations)
- [Connection Configuration](#connection-configuration)
- [Health Checks](#health-checks)
- [Data Persistence](#data-persistence)
- [Backup and Recovery](#backup-and-recovery)
- [Troubleshooting](#troubleshooting)

## Overview

The White Cross Healthcare Platform uses:
- **PostgreSQL 15**: Primary database for application data, user information, health records, and audit logs
- **Redis 7**: In-memory data store for caching (DB 0) and queue management (DB 1)

Both databases run in Docker containers with data persistence, health checks, and proper initialization scripts.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Backend application configured with Sequelize ORM
- Environment variables properly set

## PostgreSQL Setup

### Container Configuration

The PostgreSQL container uses the official `postgres:15-alpine` image with custom initialization scripts.

#### docker-compose.yml Configuration

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: whitecross-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: whitecross
      POSTGRES_USER: whitecross_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./scripts/db-init:/docker-entrypoint-initdb.d:ro
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U whitecross_user -d whitecross"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    networks:
      - whitecross-network

volumes:
  postgres-data:
    driver: local

networks:
  whitecross-network:
    driver: bridge
```

### Initialization Scripts

Initialization scripts in `scripts/db-init/` are automatically executed on first container startup:

1. **01-init-database.sh**: Creates database user, grants permissions, enables extensions

The script:
- Creates the `whitecross_user` database user (idempotent)
- Grants ALL privileges on database, schema, tables, and sequences
- Sets default privileges for future objects
- Enables `uuid-ossp` extension for UUID generation
- Enables `pgcrypto` extension for encryption functions

### Database Structure

After initialization, the PostgreSQL database includes:

```
whitecross (database)
├── public schema
│   └── (tables created by Sequelize migrations)
├── Extensions
│   ├── uuid-ossp
│   └── pgcrypto
└── Grants
    └── whitecross_user (ALL privileges)
```

### Starting PostgreSQL

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Check initialization logs
docker logs whitecross-postgres

# Verify database is ready
docker exec whitecross-postgres pg_isready -U whitecross_user -d whitecross
```

## Redis Setup

### Container Configuration

The Redis container uses the official `redis:7-alpine` image with custom configuration.

#### docker-compose.yml Configuration

```yaml
services:
  redis:
    image: redis:7-alpine
    container_name: whitecross-redis
    restart: unless-stopped
    command: redis-server /usr/local/etc/redis/redis.conf
    volumes:
      - redis-data:/data
      - ./scripts/redis.conf:/usr/local/etc/redis/redis.conf:ro
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 10s
    networks:
      - whitecross-network

volumes:
  redis-data:
    driver: local
```

### Redis Configuration

The `scripts/redis.conf` file configures Redis with:

**Persistence**:
- RDB snapshots: 15 min (1 key), 5 min (10 keys), 1 min (10K keys)
- AOF (Append Only File): Enabled with everysec fsync
- Combined RDB+AOF for optimal recovery

**Memory Management**:
- Max memory: 512MB
- Eviction policy: allkeys-lru (Least Recently Used)
- Memory samples: 5

**Database Allocation**:
- **DB 0**: Cache (sessions, API responses, frequently accessed data)
- **DB 1**: Queue management (Bull queues for background jobs)

### Starting Redis

```bash
# Start Redis container
docker-compose up -d redis

# Check Redis is running
docker exec whitecross-redis redis-cli ping
# Expected output: PONG

# Check database info
docker exec whitecross-redis redis-cli INFO keyspace
```

## Database Migrations

### Migration Strategy

The application uses Sequelize CLI for database schema migrations. Migrations should be executed from the backend container after PostgreSQL is ready.

### Migration Execution

#### Automated (Recommended)

Add to backend container startup script:

```bash
#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
./scripts/wait-for-it.sh postgres:5432 -t 60 -- echo "PostgreSQL is ready"

# Run migrations
cd /app/backend
npm run migration:run

# Start application
npm run start:prod
```

#### Manual Execution

```bash
# From host machine
docker-compose exec backend npm run migration:run

# Or enter backend container
docker-compose exec backend sh
cd /app/backend
npm run migration:run
```

### Migration Files Location

Migration files are located in:
- Path: `backend/src/migrations/`
- Format: `YYYYMMDDHHMMSS-description.js`
- Tracked by: `SequelizeMeta` table in PostgreSQL

**Note**: Current migration files have `.bak` extensions and need to be renamed:

```bash
# Restore migrations from .bak files
cd backend/src/migrations
for file in *.js.bak; do
  mv "$file" "${file%.bak}"
done
```

### Creating New Migrations

```bash
# Generate new migration
docker-compose exec backend npm run migration:generate -- --name add-new-feature

# This creates: backend/src/migrations/YYYYMMDDHHMMSS-add-new-feature.js
```

### Rolling Back Migrations

```bash
# Rollback last migration
docker-compose exec backend npm run migration:revert

# Or use the rollback script
docker-compose exec backend ./scripts/rollback-migration.sh
```

## Connection Configuration

### Backend Environment Variables

Configure the backend to connect to PostgreSQL and Redis:

```env
# PostgreSQL Connection
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=whitecross_user
DB_PASSWORD=your_secure_password_here
DB_NAME=whitecross

# Redis Cache Connection (DB 0)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=
REDIS_USERNAME=
REDIS_TTL_DEFAULT=300
REDIS_CONNECTION_TIMEOUT=5000
REDIS_MAX_RETRIES=3
REDIS_RETRY_DELAY=1000

# Redis Queue Connection (DB 1)
REDIS_QUEUE_DB=1

# Cache Configuration
CACHE_KEY_PREFIX=white-cross
CACHE_ENABLE_COMPRESSION=false
CACHE_COMPRESSION_THRESHOLD=1024
CACHE_ENABLE_L1=true
CACHE_L1_MAX_SIZE=1000
CACHE_L1_TTL=60
```

### Connection String Examples

**PostgreSQL**:
```
postgresql://whitecross_user:password@postgres:5432/whitecross
```

**Redis Cache (DB 0)**:
```
redis://redis:6379/0
```

**Redis Queue (DB 1)**:
```
redis://redis:6379/1
```

### Sequelize Configuration

The backend uses Sequelize with configuration in `backend/src/database/config/database.config.js`:

```javascript
module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'whitecross_user',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'whitecross',
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}
```

## Health Checks

### PostgreSQL Health Check

```bash
# Check if PostgreSQL is ready to accept connections
docker exec whitecross-postgres pg_isready -U whitecross_user -d whitecross

# Check connection from backend container
docker-compose exec backend psql -h postgres -U whitecross_user -d whitecross -c "SELECT version();"

# Check database size
docker exec whitecross-postgres psql -U whitecross_user -d whitecross -c \
  "SELECT pg_size_pretty(pg_database_size('whitecross'));"
```

### Redis Health Check

```bash
# Ping Redis
docker exec whitecross-redis redis-cli ping

# Check Redis info
docker exec whitecross-redis redis-cli INFO server

# Check memory usage
docker exec whitecross-redis redis-cli INFO memory

# Check keyspace statistics
docker exec whitecross-redis redis-cli INFO keyspace

# Test cache database (DB 0)
docker exec whitecross-redis redis-cli -n 0 SET test "hello"
docker exec whitecross-redis redis-cli -n 0 GET test
docker exec whitecross-redis redis-cli -n 0 DEL test

# Test queue database (DB 1)
docker exec whitecross-redis redis-cli -n 1 INFO keyspace
```

## Data Persistence

### PostgreSQL Data Volume

Data persists in the `postgres-data` Docker volume:

```bash
# List volumes
docker volume ls | grep postgres

# Inspect volume
docker volume inspect whitecross_postgres-data

# Backup volume
docker run --rm \
  -v whitecross_postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup-$(date +%Y%m%d).tar.gz /data
```

### Redis Data Volume

Data persists in the `redis-data` Docker volume:

```bash
# List volumes
docker volume ls | grep redis

# Inspect volume
docker volume inspect whitecross_redis-data

# Check persistence files
docker exec whitecross-redis ls -lh /data
# Should show: dump.rdb, appendonly.aof
```

## Backup and Recovery

### PostgreSQL Backup

#### Logical Backup (pg_dump)

```bash
# Full database backup
docker exec whitecross-postgres pg_dump -U whitecross_user whitecross > \
  backup-$(date +%Y%m%d-%H%M%S).sql

# Compressed backup
docker exec whitecross-postgres pg_dump -U whitecross_user whitecross | \
  gzip > backup-$(date +%Y%m%d-%H%M%S).sql.gz

# Schema only
docker exec whitecross-postgres pg_dump -U whitecross_user whitecross --schema-only > \
  schema-$(date +%Y%m%d).sql

# Data only
docker exec whitecross-postgres pg_dump -U whitecross_user whitecross --data-only > \
  data-$(date +%Y%m%d).sql
```

#### Volume Backup

```bash
# Stop backend (to ensure consistency)
docker-compose stop backend

# Backup volume
docker run --rm \
  -v whitecross_postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-volume-$(date +%Y%m%d).tar.gz /data

# Restart backend
docker-compose start backend
```

### PostgreSQL Restore

#### From pg_dump File

```bash
# Stop backend
docker-compose stop backend

# Drop and recreate database (if needed)
docker exec whitecross-postgres psql -U postgres -c "DROP DATABASE IF EXISTS whitecross;"
docker exec whitecross-postgres psql -U postgres -c "CREATE DATABASE whitecross OWNER whitecross_user;"

# Restore from backup
cat backup-20251103.sql | docker exec -i whitecross-postgres \
  psql -U whitecross_user whitecross

# Or from compressed backup
gunzip -c backup-20251103.sql.gz | docker exec -i whitecross-postgres \
  psql -U whitecross_user whitecross

# Restart backend
docker-compose start backend
```

#### From Volume Backup

```bash
# Stop all services
docker-compose down

# Remove existing volume
docker volume rm whitecross_postgres-data

# Restore volume
docker run --rm \
  -v whitecross_postgres-data:/data \
  -v $(pwd):/backup \
  alpine sh -c "cd / && tar xzf /backup/postgres-volume-20251103.tar.gz"

# Start services
docker-compose up -d
```

### Redis Backup

Redis automatically persists data via RDB and AOF files in the `/data` directory.

#### Manual Backup

```bash
# Trigger immediate save
docker exec whitecross-redis redis-cli BGSAVE

# Wait for save to complete
docker exec whitecross-redis redis-cli LASTSAVE

# Copy RDB file
docker cp whitecross-redis:/data/dump.rdb redis-backup-$(date +%Y%m%d).rdb

# Copy AOF file
docker cp whitecross-redis:/data/appendonly.aof redis-backup-$(date +%Y%m%d).aof
```

#### Volume Backup

```bash
# Backup Redis volume
docker run --rm \
  -v whitecross_redis-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/redis-volume-$(date +%Y%m%d).tar.gz /data
```

### Redis Restore

```bash
# Stop Redis
docker-compose stop redis

# Copy backup files to volume
docker cp redis-backup-20251103.rdb whitecross-redis:/data/dump.rdb
docker cp redis-backup-20251103.aof whitecross-redis:/data/appendonly.aof

# Or restore volume
docker-compose down
docker volume rm whitecross_redis-data
docker run --rm \
  -v whitecross_redis-data:/data \
  -v $(pwd):/backup \
  alpine sh -c "cd / && tar xzf /backup/redis-volume-20251103.tar.gz"

# Restart Redis
docker-compose up -d redis
```

## Troubleshooting

### PostgreSQL Issues

#### Cannot Connect to Database

```bash
# Check container is running
docker ps | grep postgres

# Check logs
docker logs whitecross-postgres

# Check network connectivity
docker-compose exec backend ping postgres

# Test connection
docker exec whitecross-postgres pg_isready -U whitecross_user -d whitecross
```

#### Permission Denied Errors

```bash
# Check user grants
docker exec whitecross-postgres psql -U whitecross_user -d whitecross -c \
  "SELECT * FROM information_schema.role_table_grants WHERE grantee = 'whitecross_user';"

# Re-run initialization (requires volume removal)
docker-compose down
docker volume rm whitecross_postgres-data
docker-compose up -d postgres
```

#### Migrations Fail

```bash
# Check SequelizeMeta table
docker exec whitecross-postgres psql -U whitecross_user -d whitecross -c \
  "SELECT * FROM \"SequelizeMeta\" ORDER BY name;"

# Check migration files exist
docker-compose exec backend ls -la /app/backend/src/migrations/

# Run migrations manually with verbose output
docker-compose exec backend npm run migration:run
```

#### Database Full / Out of Space

```bash
# Check database size
docker exec whitecross-postgres psql -U whitecross_user -d whitecross -c \
  "SELECT pg_size_pretty(pg_database_size('whitecross'));"

# Check table sizes
docker exec whitecross-postgres psql -U whitecross_user -d whitecross -c \
  "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
   FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"

# Vacuum database
docker exec whitecross-postgres psql -U whitecross_user -d whitecross -c "VACUUM FULL;"
```

### Redis Issues

#### Cannot Connect to Redis

```bash
# Check container is running
docker ps | grep redis

# Check logs
docker logs whitecross-redis

# Test connection
docker exec whitecross-redis redis-cli ping

# Check from backend
docker-compose exec backend nc -zv redis 6379
```

#### Memory Issues

```bash
# Check memory usage
docker exec whitecross-redis redis-cli INFO memory

# Check evicted keys
docker exec whitecross-redis redis-cli INFO stats | grep evicted

# Increase max memory (edit redis.conf)
# maxmemory 1024mb

# Restart Redis
docker-compose restart redis
```

#### Data Loss / Persistence Issues

```bash
# Check persistence status
docker exec whitecross-redis redis-cli INFO persistence

# Check RDB/AOF files
docker exec whitecross-redis ls -lh /data

# Force save
docker exec whitecross-redis redis-cli BGSAVE
docker exec whitecross-redis redis-cli BGREWRITEAOF

# Check last save time
docker exec whitecross-redis redis-cli LASTSAVE
```

#### Queue Not Processing

```bash
# Check queue keys (DB 1)
docker exec whitecross-redis redis-cli -n 1 KEYS "bull:*"

# Check queue stats
docker exec whitecross-redis redis-cli -n 1 INFO keyspace

# Check queue size
docker exec whitecross-redis redis-cli -n 1 LLEN "bull:email-queue:wait"

# Clear failed queue (if needed)
docker exec whitecross-redis redis-cli -n 1 DEL "bull:email-queue:failed"
```

### General Docker Issues

#### Containers Won't Start

```bash
# Check all container status
docker-compose ps

# Check specific service logs
docker-compose logs postgres
docker-compose logs redis

# Restart services
docker-compose restart

# Recreate containers
docker-compose down
docker-compose up -d
```

#### Network Issues

```bash
# Check network exists
docker network ls | grep whitecross

# Inspect network
docker network inspect whitecross_whitecross-network

# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

#### Volume Issues

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect whitecross_postgres-data

# Remove dangling volumes
docker volume prune

# Remove specific volume (WARNING: deletes data)
docker-compose down
docker volume rm whitecross_postgres-data
```

## Monitoring and Maintenance

### Regular Maintenance Tasks

1. **Monitor database size**: Track growth trends
2. **Vacuum PostgreSQL**: Run VACUUM ANALYZE periodically
3. **Monitor slow queries**: Enable and review slow query logs
4. **Monitor Redis memory**: Track memory usage and eviction rates
5. **Backup regularly**: Automated daily backups recommended
6. **Test restore process**: Verify backups are valid
7. **Update images**: Keep PostgreSQL and Redis images updated
8. **Monitor disk space**: Ensure adequate space for volumes

### Useful Monitoring Commands

```bash
# PostgreSQL active connections
docker exec whitecross-postgres psql -U whitecross_user -d whitecross -c \
  "SELECT count(*) as connections, state FROM pg_stat_activity GROUP BY state;"

# Redis memory trend
watch -n 5 'docker exec whitecross-redis redis-cli INFO memory | grep used_memory_human'

# Database growth over time
docker exec whitecross-postgres psql -U whitecross_user -d whitecross -c \
  "SELECT current_date, pg_size_pretty(pg_database_size('whitecross'));"
```

## Security Best Practices

1. **Use strong passwords**: Set complex DB_PASSWORD and REDIS_PASSWORD
2. **Network isolation**: Keep databases on internal Docker network only
3. **No exposed ports**: Don't expose ports in production (use backend as proxy)
4. **Regular updates**: Keep PostgreSQL and Redis images updated
5. **Encrypted backups**: Encrypt backup files before storing externally
6. **Audit logs**: Monitor audit_logs table for suspicious access
7. **Principle of least privilege**: Application user has minimal necessary permissions
8. **SSL/TLS**: Enable SSL for PostgreSQL connections in production

## Additional Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/15/
- Redis Documentation: https://redis.io/documentation
- Sequelize Documentation: https://sequelize.org/
- Docker Compose: https://docs.docker.com/compose/
- Backend Database Module: `backend/src/database/README.md`

## Support

For issues or questions:
1. Check this documentation and troubleshooting section
2. Review container logs: `docker-compose logs`
3. Consult backend database module documentation
4. Contact the development team

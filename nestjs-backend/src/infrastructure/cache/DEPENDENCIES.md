# Cache Service Dependencies

## Required NPM Packages

Add these dependencies to your `package.json`:

```json
{
  "dependencies": {
    "ioredis": "^5.3.2",
    "@nestjs/event-emitter": "^2.0.4",
    "@nestjs/schedule": "^4.0.0",
    "@nestjs/terminus": "^10.2.1",
    "@nestjs/config": "^3.1.1"
  }
}
```

## Installation Command

```bash
npm install ioredis @nestjs/event-emitter @nestjs/schedule @nestjs/terminus @nestjs/config
```

## Package Details

### ioredis (v5.3.2)
- **Purpose**: Redis client for Node.js
- **Features**: Connection pooling, cluster support, automatic reconnection
- **License**: MIT
- **Size**: ~200KB
- **Documentation**: https://github.com/redis/ioredis

### @nestjs/event-emitter (v2.0.4)
- **Purpose**: Event-driven architecture support
- **Features**: Typed events, async handlers, event filtering
- **Used For**: Cache event notifications (hits, misses, invalidations)
- **Documentation**: https://docs.nestjs.com/techniques/events

### @nestjs/schedule (v4.0.0)
- **Purpose**: Task scheduling with cron expressions
- **Features**: Cron jobs, intervals, timeouts
- **Used For**: Cache warming strategies
- **Documentation**: https://docs.nestjs.com/techniques/task-scheduling

### @nestjs/terminus (v10.2.1)
- **Purpose**: Health checks and monitoring
- **Features**: Custom health indicators, graceful shutdown
- **Used For**: Cache health monitoring
- **Documentation**: https://docs.nestjs.com/recipes/terminus

### @nestjs/config (v3.1.1)
- **Purpose**: Configuration management
- **Features**: Environment variables, validation, type safety
- **Used For**: Cache configuration from .env
- **Documentation**: https://docs.nestjs.com/techniques/configuration

## Peer Dependencies

These should already be installed in your NestJS project:

```json
{
  "peerDependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  }
}
```

## Optional Dependencies

For advanced features:

```json
{
  "devDependencies": {
    "@types/ioredis": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

## Redis Server Requirements

### Minimum Version
- **Redis**: 5.0 or higher
- **Recommended**: Redis 6.2 or higher for best performance

### Redis Features Used
- Basic GET/SET operations
- EXPIRE for TTL
- DEL for deletions
- KEYS for pattern matching
- INCRBY/DECRBY for atomic operations
- SETEX for set with expiry

### Redis Deployment Options

1. **Local Development**:
```bash
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# Using Homebrew (macOS)
brew install redis
brew services start redis
```

2. **Production**:
- AWS ElastiCache
- Redis Cloud
- Google Cloud Memorystore
- Azure Cache for Redis
- Self-hosted Redis Cluster

## Environment Setup

Create a `.env` file with these variables:

```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Cache Configuration
CACHE_KEY_PREFIX=cache
CACHE_ENABLE_L1=true
CACHE_L1_MAX_SIZE=1000
REDIS_TTL_DEFAULT=300

# Optional
CACHE_ENABLE_COMPRESSION=true
CACHE_COMPRESSION_THRESHOLD=1024
CACHE_ENABLE_LOGGING=false
```

## Compatibility Matrix

| NestJS Version | ioredis Version | Node Version |
|----------------|-----------------|--------------|
| 10.x           | 5.x             | 18.x, 20.x   |
| 9.x            | 5.x             | 16.x, 18.x   |

## Docker Compose Example

For local development:

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  redis-data:
```

Start with:
```bash
docker-compose up -d
```

## Troubleshooting

### Installation Issues

**Problem**: `npm install ioredis` fails
```bash
# Solution: Clear npm cache
npm cache clean --force
npm install ioredis
```

**Problem**: TypeScript errors
```bash
# Solution: Install type definitions
npm install --save-dev @types/ioredis @types/node
```

### Runtime Issues

**Problem**: "Redis connection refused"
```bash
# Check Redis is running
redis-cli ping
# Should return "PONG"

# Check connection settings
echo $REDIS_HOST
echo $REDIS_PORT
```

**Problem**: "Module not found: @nestjs/event-emitter"
```bash
# Ensure all dependencies are installed
npm install
# Or install specifically
npm install @nestjs/event-emitter
```

## Security Considerations

### Redis Authentication
```bash
# Enable Redis password in production
REDIS_PASSWORD=your-secure-password
```

### Redis ACL (Redis 6+)
```bash
# Create limited-privilege user
redis-cli ACL SETUSER cacheuser on >password ~cache:* +get +set +del +expire
REDIS_PASSWORD=password
```

### Network Security
- Use TLS/SSL for Redis connections in production
- Restrict Redis access to application servers only
- Use VPC/private networks
- Enable firewall rules

## Performance Optimization

### Connection Pooling
```typescript
// ioredis automatically handles connection pooling
// Adjust pool size via environment
REDIS_CONNECTION_POOL_SIZE=10
```

### Redis Memory
```bash
# Set Redis max memory
redis-cli CONFIG SET maxmemory 2gb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

### Monitoring
```bash
# Monitor Redis performance
redis-cli --stat
redis-cli --bigkeys
redis-cli INFO memory
```

## Version Upgrade Path

### From ioredis 4.x to 5.x
- No breaking changes for basic operations
- Update import statements if using TypeScript
- Review new features: better TypeScript support, improved error handling

### From @nestjs/schedule 3.x to 4.x
- Update cron syntax if using advanced features
- Review migration guide: https://docs.nestjs.com/migration-guide

## Support and Resources

- **Redis Documentation**: https://redis.io/documentation
- **ioredis GitHub**: https://github.com/redis/ioredis
- **NestJS Documentation**: https://docs.nestjs.com
- **Stack Overflow**: Tag with `nestjs`, `ioredis`, `redis`

## License Compliance

All dependencies use MIT license, compatible with commercial use.

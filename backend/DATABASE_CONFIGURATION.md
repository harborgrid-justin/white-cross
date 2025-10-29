# Database Configuration Guide

## Overview

The White Cross Healthcare Platform uses PostgreSQL as its primary database with Sequelize ORM. This guide covers all aspects of database configuration, connection pooling, SSL/TLS settings, and deployment considerations.

## Configuration Architecture

### Configuration Files

1. **database.config.ts** (`src/database/config/database.config.ts`)
   - Main TypeScript configuration
   - Used by NestJS application at runtime
   - Supports both DATABASE_URL and individual parameters
   - Includes connection pooling, SSL/TLS, and retry logic

2. **.sequelizerc** (`backend/.sequelizerc`)
   - Sequelize CLI configuration
   - Defines paths for migrations, seeders, models, and config

3. **sequelize.js** (`backend/config/sequelize.js`)
   - CommonJS configuration for Sequelize CLI
   - Used for running migrations and seeders
   - Environment-specific configurations

4. **database.module.ts** (`src/database/database.module.ts`)
   - NestJS database module
   - Integrates configuration with Sequelize ORM
   - Registers all models and services

## Environment Variables

### Connection Parameters

#### Option 1: DATABASE_URL (Recommended for Cloud Deployments)

```bash
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

**Format**: `postgresql://[user]:[password]@[host]:[port]/[database]?[options]`

**Examples**:
- Local: `postgresql://postgres:password@localhost:5432/whitecross`
- Cloud with SSL: `postgresql://user:pass@db.example.com:5432/production?sslmode=require`
- Heroku-style: `postgres://user:pass@ec2-host.compute.amazonaws.com:5432/dbname`

**Query Parameters**:
- `sslmode=require` - Enables SSL/TLS connection
- `ssl=true` - Alternative SSL enablement

#### Option 2: Individual Parameters (Recommended for Local Development)

```bash
# Connection
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=whitecross
DB_DIALECT=postgres
```

### Connection Pooling

Connection pooling prevents connection exhaustion and improves performance by reusing database connections.

```bash
# Minimum number of connections in pool
DB_POOL_MIN=2              # Development: 2, Production: 5

# Maximum number of connections in pool
DB_POOL_MAX=10             # Development: 10, Production: 20

# Time (milliseconds) before releasing idle connection
DB_POOL_IDLE=10000         # Default: 10 seconds

# Time (milliseconds) to wait for connection before timeout
DB_POOL_ACQUIRE=30000      # Default: 30 seconds

# Time (milliseconds) between connection eviction runs
DB_POOL_EVICT=5000         # Default: 5 seconds
```

**Recommended Settings by Environment**:

| Environment | MIN | MAX | IDLE   | ACQUIRE | EVICT |
|-------------|-----|-----|--------|---------|-------|
| Development | 2   | 10  | 10000  | 30000   | 5000  |
| Test        | 1   | 5   | 5000   | 15000   | 5000  |
| Production  | 5   | 20  | 10000  | 30000   | 5000  |

### SSL/TLS Configuration

SSL/TLS encryption is essential for production database connections.

```bash
# Enable SSL/TLS
DB_SSL=true                # Set to 'true' for production

# Certificate validation
DB_SSL_REJECT_UNAUTHORIZED=true  # Set to 'false' for self-signed certificates
```

**When to Use**:
- **Production**: Always enable SSL (`DB_SSL=true`)
- **Cloud Deployments**: SSL is typically required (use `sslmode=require` in DATABASE_URL)
- **Self-Signed Certificates**: Set `DB_SSL_REJECT_UNAUTHORIZED=false`
- **Local Development**: SSL not required (`DB_SSL=false`)

### Logging Configuration

```bash
# Enable SQL query logging (optional)
DB_LOGGING=false
```

**Default Behavior** (if not set):
- **Development**: Logging enabled (console.log)
- **Production**: Logging disabled
- **Test**: Logging disabled

### Timezone Configuration

```bash
# Database timezone
DB_TIMEZONE=+00:00         # UTC (recommended)
```

## Configuration Priority

The system follows this priority order for database configuration:

1. **DATABASE_URL** (highest priority)
   - If set, this takes precedence over individual parameters
   - Commonly used in cloud deployments (Heroku, Railway, Render, etc.)

2. **Individual DB_* Parameters**
   - Used if DATABASE_URL is not set
   - Recommended for local development

3. **Default Values**
   - Applied if neither DATABASE_URL nor individual parameters are set
   - Defaults: localhost:5432, postgres user, whitecross database

## Usage Examples

### Local Development

**.env file**:
```bash
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=whitecross
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_SSL=false
```

### Docker Compose

**docker-compose.yml**:
```yaml
backend:
  environment:
    NODE_ENV: development
    DATABASE_URL: postgresql://white_cross_user:white_cross_password@postgres:5432/white_cross
    DB_POOL_MIN: 2
    DB_POOL_MAX: 10
```

### Production (Cloud with SSL)

**.env file**:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://produser:securepass@db.example.com:5432/production?sslmode=require
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_LOGGING=false
```

### Production (Individual Parameters)

**.env file**:
```bash
NODE_ENV=production
DB_HOST=db.example.com
DB_PORT=5432
DB_USERNAME=produser
DB_PASSWORD=securepassword
DB_NAME=production
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_LOGGING=false
```

## Sequelize CLI Usage

The Sequelize CLI is configured to work with the same environment variables as the application.

### Running Migrations

```bash
# Run all pending migrations
npm run migration:run
# or
npx sequelize-cli db:migrate

# Undo last migration
npm run migration:undo
# or
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all
```

### Creating Migrations

```bash
# Create a new migration
npx sequelize-cli migration:generate --name add-user-table
```

### Running Seeders

```bash
# Run all seeders
npx sequelize-cli db:seed:all

# Run specific seeder
npx sequelize-cli db:seed --seed 20231029000000-demo-users.js

# Undo last seeder
npx sequelize-cli db:seed:undo

# Undo all seeders
npx sequelize-cli db:seed:undo:all
```

### Environment-Specific Commands

```bash
# Run migrations in production
NODE_ENV=production npx sequelize-cli db:migrate

# Run migrations in test
NODE_ENV=test npx sequelize-cli db:migrate

# Run migrations in development (default)
npx sequelize-cli db:migrate
```

## Connection Pooling Best Practices

### Understanding Pool Settings

1. **MIN (Minimum Connections)**
   - Always maintained in the pool
   - Ensures fast response times for initial requests
   - Set higher in production for better performance

2. **MAX (Maximum Connections)**
   - Hard limit on concurrent connections
   - Prevents database overload
   - Consider your PostgreSQL `max_connections` setting

3. **IDLE Timeout**
   - How long a connection can sit idle before being released
   - Shorter timeouts free resources faster
   - Longer timeouts reduce connection overhead

4. **ACQUIRE Timeout**
   - How long to wait for an available connection
   - Should be longer than expected query time
   - Prevents request failures during high load

### Calculating Pool Size

**Formula**: `max_pool_size = ((core_count * 2) + effective_spindle_count)`

**Example**:
- 4 CPU cores, SSD storage
- Max pool: (4 * 2) + 1 = 9
- Recommended: 10-15 connections per application instance

**PostgreSQL max_connections**:
- Default: 100 connections
- Typical production: 200-400 connections
- Reserve connections for maintenance and monitoring

## SSL/TLS Security

### Certificate Validation

```bash
# Production (strict validation)
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true

# Development with self-signed certificate
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

### Cloud Provider SSL

**AWS RDS**:
```bash
DATABASE_URL=postgresql://user:pass@rds.amazonaws.com:5432/db?sslmode=require
DB_SSL=true
```

**Heroku Postgres**:
```bash
# Heroku automatically adds SSL
DATABASE_URL=postgres://user:pass@ec2-host.compute.amazonaws.com:5432/dbname
```

**DigitalOcean**:
```bash
DATABASE_URL=postgresql://user:pass@db.digitalocean.com:25060/db?sslmode=require
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
```

## Troubleshooting

### Connection Refused

**Symptom**: `ECONNREFUSED` error

**Solutions**:
1. Check PostgreSQL is running: `pg_isready`
2. Verify host and port: `DB_HOST=localhost DB_PORT=5432`
3. Check firewall rules
4. Verify PostgreSQL is listening on correct interface

### SSL Connection Failed

**Symptom**: `SSL connection failed` or `certificate verify failed`

**Solutions**:
1. Check if database supports SSL
2. Set `DB_SSL_REJECT_UNAUTHORIZED=false` for self-signed certificates
3. Use `sslmode=require` in DATABASE_URL
4. Verify certificate chain is complete

### Pool Exhaustion

**Symptom**: `TimeoutError: ResourceRequest timed out`

**Solutions**:
1. Increase `DB_POOL_MAX` (e.g., from 10 to 20)
2. Increase `DB_POOL_ACQUIRE` timeout (e.g., to 60000ms)
3. Check for connection leaks (missing `await` or error handling)
4. Reduce `DB_POOL_IDLE` to release connections faster
5. Optimize slow queries

### Authentication Failed

**Symptom**: `password authentication failed for user`

**Solutions**:
1. Verify `DB_USERNAME` and `DB_PASSWORD`
2. Check user exists: `psql -U postgres -c "\du"`
3. Verify user has access to database
4. Check `pg_hba.conf` authentication method

### Database Not Found

**Symptom**: `database "dbname" does not exist`

**Solutions**:
1. Create database: `createdb whitecross`
2. Verify `DB_NAME` environment variable
3. Check DATABASE_URL database name
4. Run initialization scripts

## Performance Optimization

### Query Optimization

1. **Enable Logging in Development**:
   ```bash
   DB_LOGGING=true
   ```
   - Identify slow queries
   - Analyze query patterns

2. **Use Indexes**:
   - Create migrations with appropriate indexes
   - Index foreign keys
   - Index frequently queried columns

3. **Optimize Pool Size**:
   - Monitor connection usage
   - Adjust based on application load
   - Consider read replicas for read-heavy workloads

### Monitoring

1. **Connection Metrics**:
   - Active connections
   - Idle connections
   - Connection wait time

2. **Query Metrics**:
   - Query execution time
   - Slow query log
   - Query frequency

3. **Database Metrics**:
   - CPU usage
   - Memory usage
   - Disk I/O

## Deployment Considerations

### Environment-Specific Settings

| Setting           | Development | Test  | Production |
|-------------------|-------------|-------|------------|
| DB_POOL_MIN       | 2           | 1     | 5          |
| DB_POOL_MAX       | 10          | 5     | 20         |
| DB_SSL            | false       | false | true       |
| DB_LOGGING        | true        | false | false      |
| synchronize       | false       | false | false      |

### Migration Strategy

1. **Development**: Run migrations automatically on startup (optional)
2. **Staging**: Run migrations as part of deployment pipeline
3. **Production**: Run migrations manually with verification

### Backup Strategy

1. **Automated Backups**: Daily automated backups
2. **Point-in-Time Recovery**: Enable WAL archiving
3. **Backup Testing**: Regular restore testing
4. **Retention Policy**: 30 days for daily, 12 months for monthly

### Scaling Considerations

1. **Vertical Scaling**: Increase database instance size
2. **Connection Pooling**: Use PgBouncer for large deployments
3. **Read Replicas**: Separate read and write workloads
4. **Sharding**: For very large datasets (advanced)

## Security Checklist

- [ ] SSL/TLS enabled in production
- [ ] Strong database passwords
- [ ] Least privilege access for database users
- [ ] Network firewall rules configured
- [ ] Regular security updates applied
- [ ] Audit logging enabled
- [ ] Backup encryption enabled
- [ ] No hardcoded credentials in code
- [ ] Environment variables secured
- [ ] Database connection strings not logged

## Additional Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NestJS Sequelize Integration](https://docs.nestjs.com/techniques/database#sequelize-integration)
- [Connection Pooling Best Practices](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [PostgreSQL SSL Configuration](https://www.postgresql.org/docs/current/ssl-tcp.html)

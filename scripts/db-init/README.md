# Database Initialization Scripts

This directory contains PostgreSQL initialization scripts that run when the database container is first created.

## Scripts

### 01-init-database.sh
Main initialization script that:
- Creates the application database user
- Grants proper permissions for Sequelize migrations
- Enables required PostgreSQL extensions (uuid-ossp, pgcrypto)
- Sets default privileges for future database objects

## Usage with Docker

These scripts are automatically executed by the PostgreSQL Docker image when the container is first initialized. Mount this directory to `/docker-entrypoint-initdb.d/` in your docker-compose.yml:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    volumes:
      - ./scripts/db-init:/docker-entrypoint-initdb.d
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: whitecross
      POSTGRES_USER: whitecross_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

## Script Execution Order

Scripts in this directory are executed in alphabetical order:
1. `01-init-database.sh` - Database and user initialization

## Notes

- Scripts must be idempotent (can be run multiple times safely)
- Scripts run with superuser privileges
- Scripts only execute on first container initialization (when data volume is empty)
- To re-initialize, remove the PostgreSQL data volume

## Environment Variables

The following environment variables should be set in docker-compose.yml:

| Variable | Description | Default |
|----------|-------------|---------|
| POSTGRES_DB | Database name | whitecross |
| POSTGRES_USER | Database username | whitecross_user |
| POSTGRES_PASSWORD | Database password | (must be set) |

## Health Checks

After initialization, verify database health with:

```bash
docker exec <container-name> pg_isready -U whitecross_user -d whitecross
```

## Migration Execution

After the database is initialized, run Sequelize migrations from the backend container:

```bash
# Wait for database to be ready
./scripts/wait-for-it.sh postgres:5432 -t 60

# Run migrations
cd backend && npm run migration:run
```

## Troubleshooting

### Database already exists error
If you see "database already exists" errors:
- This is normal if the data volume persists between container restarts
- Scripts only run on first initialization
- To force re-initialization, remove the volume: `docker volume rm <volume-name>`

### Permission denied errors
If migrations fail with permission errors:
- Verify the database user has proper grants
- Check that default privileges are set correctly
- Review the initialization script logs

### Extensions not available
If UUID or crypto functions fail:
- Verify extensions are enabled: `SELECT * FROM pg_extension;`
- Check PostgreSQL image includes required extensions
- Ensure initialization script completed successfully

#!/bin/bash
#
# Database Health Check Script
# Verifies database connection and configuration
#
# Usage:
#   ./scripts/check-database-health.sh
#

set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

echo "=========================================="
echo "Database Health Check"
echo "=========================================="
echo ""

# Check PostgreSQL client
if ! command -v psql &> /dev/null; then
    echo "✗ PostgreSQL client not installed"
    exit 1
fi
echo "✓ PostgreSQL client installed"

# Check database connection
echo ""
echo "Testing database connection..."
if [ -n "$DATABASE_URL" ]; then
    echo "Using DATABASE_URL"
    if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
        echo "✓ Database connection successful"
    else
        echo "✗ Database connection failed"
        exit 1
    fi
    CONN_STRING="$DATABASE_URL"
else
    echo "Using individual parameters"
    export PGPASSWORD="$DB_PASSWORD"
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
        echo "✓ Database connection successful"
    else
        echo "✗ Database connection failed"
        exit 1
    fi
    CONN_STRING="postgresql://$DB_USERNAME:****@$DB_HOST:$DB_PORT/$DB_NAME"
fi

# Check PostgreSQL version
echo ""
echo "PostgreSQL version:"
if [ -n "$DATABASE_URL" ]; then
    psql "$DATABASE_URL" -t -c "SELECT version()"
else
    export PGPASSWORD="$DB_PASSWORD"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -t -c "SELECT version()"
fi

# Check active connections
echo ""
echo "Active connections:"
if [ -n "$DATABASE_URL" ]; then
    psql "$DATABASE_URL" -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()"
else
    export PGPASSWORD="$DB_PASSWORD"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()"
fi

# Check max connections
echo ""
echo "Max connections configured:"
if [ -n "$DATABASE_URL" ]; then
    psql "$DATABASE_URL" -t -c "SHOW max_connections"
else
    export PGPASSWORD="$DB_PASSWORD"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -t -c "SHOW max_connections"
fi

# Check migration status
echo ""
echo "Migration status:"
if [ -n "$DATABASE_URL" ]; then
    MIGRATION_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT count(*) FROM sequelize_meta" 2>/dev/null || echo "0")
else
    export PGPASSWORD="$DB_PASSWORD"
    MIGRATION_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -t -c "SELECT count(*) FROM sequelize_meta" 2>/dev/null || echo "0")
fi
echo "Applied migrations: $MIGRATION_COUNT"

# Check SSL status
echo ""
echo "SSL Configuration:"
if [ "$DB_SSL" = "true" ]; then
    echo "✓ SSL enabled"
    echo "  Reject unauthorized: ${DB_SSL_REJECT_UNAUTHORIZED:-true}"
else
    echo "⚠ SSL disabled (not recommended for production)"
fi

# Check pool configuration
echo ""
echo "Connection Pool Configuration:"
echo "  Min connections: ${DB_POOL_MIN:-2}"
echo "  Max connections: ${DB_POOL_MAX:-10}"
echo "  Idle timeout: ${DB_POOL_IDLE:-10000}ms"
echo "  Acquire timeout: ${DB_POOL_ACQUIRE:-30000}ms"

# Summary
echo ""
echo "=========================================="
echo "Health Check Complete"
echo "=========================================="
echo ""
echo "Connection: $CONN_STRING"
echo "Status: ✓ All checks passed"
echo ""

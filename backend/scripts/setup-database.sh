#!/bin/bash
#
# Database Setup Script
# Initializes PostgreSQL database for White Cross Healthcare Platform
#
# Usage:
#   ./scripts/setup-database.sh [environment]
#
# Environments: development (default), test, production
#

set -e  # Exit on error

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Get environment (default to development)
ENVIRONMENT=${1:-development}
export NODE_ENV=$ENVIRONMENT

echo "=========================================="
echo "White Cross Database Setup"
echo "Environment: $ENVIRONMENT"
echo "=========================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL client (psql) is not installed"
    echo "Install PostgreSQL client tools to continue"
    exit 1
fi

# Check if database credentials are set
if [ -z "$DB_HOST" ] && [ -z "$DATABASE_URL" ]; then
    echo "Error: Database connection not configured"
    echo "Set either DATABASE_URL or DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME"
    exit 1
fi

echo "Step 1: Testing database connection..."
if [ -n "$DATABASE_URL" ]; then
    # Test connection using DATABASE_URL
    if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
        echo "✓ Database connection successful"
    else
        echo "✗ Database connection failed"
        echo "Please check your DATABASE_URL and ensure PostgreSQL is running"
        exit 1
    fi
else
    # Test connection using individual parameters
    export PGPASSWORD="$DB_PASSWORD"
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d postgres -c "SELECT 1" > /dev/null 2>&1; then
        echo "✓ Database server connection successful"
    else
        echo "✗ Database server connection failed"
        echo "Please check your database credentials and ensure PostgreSQL is running"
        exit 1
    fi
fi

echo ""
echo "Step 2: Creating database (if not exists)..."
if [ -n "$DATABASE_URL" ]; then
    # Extract database name from URL
    DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
    psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1 || \
        psql "$(echo $DATABASE_URL | sed "s/\/$DB_NAME/?/g")" -c "CREATE DATABASE $DB_NAME"
else
    export PGPASSWORD="$DB_PASSWORD"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d postgres -c "CREATE DATABASE $DB_NAME" 2>/dev/null || \
        echo "Database '$DB_NAME' already exists or creation not needed"
fi
echo "✓ Database ready"

echo ""
echo "Step 3: Running migrations..."
if npm run migration:run 2>&1; then
    echo "✓ Migrations completed successfully"
else
    echo "✗ Migration failed"
    echo "Check the error messages above"
    exit 1
fi

echo ""
if [ "$ENVIRONMENT" = "development" ] || [ "$ENVIRONMENT" = "test" ]; then
    read -p "Do you want to run seeders (sample data)? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Step 4: Running seeders..."
        if npm run seed:run 2>&1; then
            echo "✓ Seeders completed successfully"
        else
            echo "⚠ Seeder warnings (this may be expected)"
        fi
    else
        echo "Step 4: Skipping seeders"
    fi
else
    echo "Step 4: Skipping seeders (production environment)"
fi

echo ""
echo "=========================================="
echo "Database setup completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Start the application: npm run start:dev"
echo "  2. Check database connection in application logs"
echo "  3. Access the API at http://localhost:3001"
echo ""

#!/bin/sh
# =============================================================================
# Docker Entrypoint for White Cross Backend
# Handles database migrations and health checks before starting the server
# =============================================================================

set -e

echo "🚀 White Cross Backend - Starting initialization..."
echo "Environment: ${NODE_ENV:-production}"

# Function to wait for database
wait_for_database() {
    echo "⏳ Waiting for PostgreSQL to be ready..."

    max_attempts=30
    attempt=0

    until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_NAME" -c '\q' 2>/dev/null; do
        attempt=$((attempt + 1))

        if [ $attempt -ge $max_attempts ]; then
            echo "❌ Failed to connect to database after $max_attempts attempts"
            exit 1
        fi

        echo "   Attempt $attempt/$max_attempts - Database not ready yet, waiting..."
        sleep 2
    done

    echo "✅ PostgreSQL is ready!"
}

# Function to wait for Redis
wait_for_redis() {
    echo "⏳ Waiting for Redis to be ready..."

    max_attempts=30
    attempt=0

    if [ -n "$REDIS_PASSWORD" ]; then
        redis_cmd="redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD ping"
    else
        redis_cmd="redis-cli -h $REDIS_HOST -p $REDIS_PORT ping"
    fi

    until $redis_cmd 2>/dev/null | grep -q "PONG"; do
        attempt=$((attempt + 1))

        if [ $attempt -ge $max_attempts ]; then
            echo "❌ Failed to connect to Redis after $max_attempts attempts"
            exit 1
        fi

        echo "   Attempt $attempt/$max_attempts - Redis not ready yet, waiting..."
        sleep 2
    done

    echo "✅ Redis is ready!"
}

# Function to run database migrations
run_migrations() {
    echo "🔄 Running database migrations..."

    if [ -f "node_modules/.bin/sequelize-cli" ]; then
        npx sequelize-cli db:migrate
        echo "✅ Migrations completed successfully"
    elif [ -f "node_modules/.bin/sequelize" ]; then
        npx sequelize db:migrate
        echo "✅ Migrations completed successfully"
    else
        echo "⚠️  Sequelize CLI not found, skipping migrations"
        echo "   Migrations should be run manually or handled by application startup"
    fi
}

# Function to seed database (only in development)
seed_database() {
    if [ "$NODE_ENV" = "development" ] && [ "$RUN_SEEDS" = "true" ]; then
        echo "🌱 Seeding database (development only)..."

        if [ -f "node_modules/.bin/sequelize-cli" ]; then
            npx sequelize-cli db:seed:all
            echo "✅ Database seeded successfully"
        else
            echo "⚠️  Sequelize CLI not found, skipping seeds"
        fi
    fi
}

# Main execution
main() {
    # Wait for services to be ready
    wait_for_database
    wait_for_redis

    # Run migrations
    if [ "$RUN_MIGRATIONS" != "false" ]; then
        run_migrations
    else
        echo "⏭️  Skipping migrations (RUN_MIGRATIONS=false)"
    fi

    # Seed database if needed
    seed_database

    echo ""
    echo "✨ Initialization complete!"
    echo "🎯 Starting application..."
    echo ""

    # Execute the main command (passed as arguments to this script)
    exec "$@"
}

# Run main function with all script arguments
main "$@"

#!/bin/bash
set -e

# PostgreSQL Initialization Script for White Cross Healthcare Platform
# This script runs during PostgreSQL container initialization
# It creates the database, user, and sets proper permissions

echo "Starting PostgreSQL initialization for White Cross Healthcare Platform..."

# Environment variables (should be provided by Docker)
POSTGRES_DB="${POSTGRES_DB:-whitecross}"
POSTGRES_USER="${POSTGRES_USER:-whitecross_user}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-changeme}"

echo "Database name: ${POSTGRES_DB}"
echo "Database user: ${POSTGRES_USER}"

# Create user if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create the application user (idempotent)
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${POSTGRES_USER}') THEN
            CREATE USER ${POSTGRES_USER} WITH PASSWORD '${POSTGRES_PASSWORD}';
            RAISE NOTICE 'User ${POSTGRES_USER} created';
        ELSE
            RAISE NOTICE 'User ${POSTGRES_USER} already exists';
        END IF;
    END
    \$\$;

    -- Grant necessary privileges
    GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_USER};

    -- Grant schema privileges (needed for Sequelize migrations)
    GRANT ALL ON SCHEMA public TO ${POSTGRES_USER};
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${POSTGRES_USER};
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${POSTGRES_USER};

    -- Set default privileges for future objects
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${POSTGRES_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${POSTGRES_USER};

    -- Enable UUID extension (used by the application)
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Enable pgcrypto extension (for encryption functions)
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- Display success message
    SELECT 'Database initialization completed successfully' AS status;
EOSQL

echo "PostgreSQL initialization completed successfully!"

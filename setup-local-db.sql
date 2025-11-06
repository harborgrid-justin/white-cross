-- PostgreSQL Local Database Setup for White Cross
-- Run this script as postgres superuser to create the development database

-- Create the database user
CREATE USER white_cross_dev WITH PASSWORD 'dev_password_change_me';

-- Create the development database
CREATE DATABASE white_cross_dev WITH OWNER white_cross_dev;

-- Create the test database
CREATE DATABASE white_cross_test WITH OWNER white_cross_dev;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE white_cross_dev TO white_cross_dev;
GRANT ALL PRIVILEGES ON DATABASE white_cross_test TO white_cross_dev;

-- Connect to the development database and grant schema privileges
\c white_cross_dev;
GRANT ALL ON SCHEMA public TO white_cross_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO white_cross_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO white_cross_dev;

-- Connect to the test database and grant schema privileges
\c white_cross_test;
GRANT ALL ON SCHEMA public TO white_cross_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO white_cross_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO white_cross_dev;

-- Enable UUID extension (required for the app)
\c white_cross_dev;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c white_cross_test;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\echo 'Database setup complete!'
\echo 'You can now run: npm run dev from the backend directory'
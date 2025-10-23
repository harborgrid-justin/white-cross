#!/bin/bash

# White Cross - Automated Setup and Test Script
# This script helps verify the build and database setup

set -e  # Exit on error

echo "================================"
echo "White Cross - Setup Verification"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check builds
echo "Step 1: Verifying builds..."
echo "----------------------------"

if [ -f "backend/dist/index.js" ] && [ -f "frontend/dist/index.html" ]; then
    echo -e "${GREEN}✅ Both frontend and backend are built${NC}"
else
    echo -e "${YELLOW}⚠️  Builds not found. Running builds now...${NC}"
    npm run build
fi

echo ""

# Step 2: Check environment files
echo "Step 2: Checking environment files..."
echo "--------------------------------------"

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ Backend .env exists${NC}"
else
    echo -e "${RED}❌ Backend .env missing${NC}"
    echo "   Please copy backend/.env.example to backend/.env"
    exit 1
fi

if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✅ Frontend .env exists${NC}"
else
    echo -e "${RED}❌ Frontend .env missing${NC}"
    echo "   Please copy frontend/.env.example to frontend/.env"
    exit 1
fi

echo ""

# Step 3: Check database connection
echo "Step 3: Testing database connection..."
echo "---------------------------------------"

cd backend
if node test-db-connection.js > /tmp/db-test.log 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
    cat /tmp/db-test.log | grep "Current Database\|Current User\|Found.*tables"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    echo ""
    echo "Error details:"
    cat /tmp/db-test.log | tail -20
    echo ""
    echo "Please check your DATABASE_URL in backend/.env"
    echo ""
    echo "Options:"
    echo "1. Start local Docker PostgreSQL: docker-compose up -d postgres"
    echo "2. Use Neon cloud database: Update DATABASE_URL with your Neon connection string"
    exit 1
fi
cd ..

echo ""

# Step 4: Check if migrations are needed
echo "Step 4: Checking database schema..."
echo "------------------------------------"

cd backend
TABLE_COUNT=$(node -e "
const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: process.env.DATABASE_URL.includes('neon') ? { require: true, rejectUnauthorized: false } : false },
  logging: false
});
sequelize.query('SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = \\'public\\'')
  .then(([results]) => { console.log(results[0].count); process.exit(0); })
  .catch(() => { console.log('0'); process.exit(0); });
" 2>/dev/null || echo "0")

if [ "$TABLE_COUNT" -gt "10" ]; then
    echo -e "${GREEN}✅ Database schema exists ($TABLE_COUNT tables)${NC}"
else
    echo -e "${YELLOW}⚠️  Database schema missing or incomplete${NC}"
    echo "   Running migrations..."
    npx sequelize-cli db:migrate || true
fi
cd ..

echo ""

# Step 5: Check if database is seeded
echo "Step 5: Checking seed data..."
echo "------------------------------"

cd backend
STUDENT_COUNT=$(node -e "
const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: process.env.DATABASE_URL.includes('neon') ? { require: true, rejectUnauthorized: false } : false },
  logging: false
});
sequelize.query('SELECT COUNT(*) as count FROM \"Students\"')
  .then(([results]) => { console.log(results[0].count); process.exit(0); })
  .catch(() => { console.log('0'); process.exit(0); });
" 2>/dev/null || echo "0")

if [ "$STUDENT_COUNT" -gt "100" ]; then
    echo -e "${GREEN}✅ Database is seeded ($STUDENT_COUNT students)${NC}"
else
    echo -e "${YELLOW}⚠️  Database needs seeding${NC}"
    echo "   Would you like to seed the database now? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        npm run seed
    else
        echo "   You can seed later with: cd backend && npm run seed"
    fi
fi
cd ..

echo ""

# Step 6: Summary
echo "================================"
echo "Setup Verification Complete"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start the frontend (in a new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open browser to: http://localhost:5173"
echo ""
echo "4. Login with:"
echo "   Email: nurse@whitecross.health"
echo "   Password: admin123"
echo ""
echo "5. Verify all pages load with data from database"
echo ""
echo "For detailed testing guide, see: SETUP_AND_TEST_GUIDE.md"
echo ""

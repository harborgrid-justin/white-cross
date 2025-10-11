# Sequelize Migration - Quick Start Guide

## 🚀 Getting Started with the Migration

This guide provides the essential steps to begin the Prisma → Sequelize migration for the White Cross Healthcare Platform.

---

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Git access to repository
- Database backup capabilities
- Development environment setup

---

## Step 1: Install Dependencies (5 minutes)

```bash
# Navigate to backend directory
cd backend

# Install Sequelize and PostgreSQL driver
npm install sequelize@^6.35.0 pg@^8.11.3 pg-hstore@^2.3.4

# Install TypeScript types
npm install -D @types/sequelize

# Install Sequelize CLI globally (for migrations)
npm install -g sequelize-cli

# Remove Prisma (keep until migration complete)
# npm uninstall @prisma/client prisma
```

---

## Step 2: Environment Configuration (5 minutes)

Update your `.env` file:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/whitecross

# Sequelize Pool Configuration
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_CONNECTION_TIMEOUT=60000

# Migration Settings (development only)
SEQUELIZE_AUTO_SYNC=false  # NEVER true in production
SEQUELIZE_LOGGING=true     # Enable for debugging

# Existing variables (keep these)
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=3001
```

---

## Step 3: Create Directory Structure (2 minutes)

```bash
# From backend directory
mkdir -p src/database/models
mkdir -p src/database/migrations
mkdir -p src/database/services
mkdir -p src/database/config
mkdir -p src/database/seeders
```

---

## Step 4: Copy Agent-Generated Files

### From Database Architect Agent Output:

**Copy Sequelize Configuration:**
```bash
# The agent provided backend/src/config/sequelize.ts
# Copy to: src/database/config/sequelize.ts
```

**Copy Model Files:**
```bash
# Copy all model files from agent output to:
# src/database/models/index.ts
# src/database/models/User.ts
# src/database/models/Student.ts
# (and all other 50+ models)
```

**Copy Migration Files:**
```bash
# Copy migration files from agent output to:
# src/database/migrations/00001-create-enums.ts
# src/database/migrations/00002-create-administration.ts
# (and all 13 migration files)
```

### From Node.js Engineer Agent Output:

**Copy Base Service:**
```bash
# Copy BaseService.ts to:
# src/database/services/BaseService.ts
```

**Updated Service Files:**
```bash
# Update existing services with Sequelize patterns
# See SEQUELIZE_MIGRATION_PLAN.md Part 2 for conversion patterns
```

---

## Step 5: Initial Database Setup (10 minutes)

### Create Development Database Backup

```bash
# Full PostgreSQL backup
pg_dump -h localhost -U postgres whitecross > backup_$(date +%Y%m%d).sql

# Verify backup
ls -lh backup_*.sql
```

### Initialize Sequelize

```bash
# Initialize Sequelize CLI (if not done)
npx sequelize-cli init

# This creates:
# - config/config.json (configure for your database)
# - migrations/ folder
# - models/ folder
# - seeders/ folder
```

### Configure Sequelize CLI

Edit `config/config.json`:

```json
{
  "development": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": false
    }
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}
```

---

## Step 6: Run Initial Migration (15 minutes)

```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Run all migrations
npx sequelize-cli db:migrate

# Expected output:
# == 00001-create-enums: migrating =======
# == 00001-create-enums: migrated (0.123s)
# == 00002-create-administration: migrating =======
# ... (all 13 migrations)

# Verify tables created
psql -h localhost -U postgres whitecross -c "\dt"
```

### Verify Schema

```bash
# Check tables exist
psql -h localhost -U postgres whitecross -c "
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name;
"

# Should show 50+ tables (User, Student, Medication, etc.)
```

---

## Step 7: Test Sequelize Models (10 minutes)

Create a test file: `src/database/test-connection.ts`

```typescript
import { sequelize, User, Student } from './models';

async function testConnection() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Test User model
    const userCount = await User.count();
    console.log(`✅ Found ${userCount} users`);

    // Test Student model
    const studentCount = await Student.count();
    console.log(`✅ Found ${studentCount} students`);

    // Test association
    const students = await Student.findAll({
      include: [{ model: User, as: 'nurse' }],
      limit: 5
    });
    console.log(`✅ Loaded ${students.length} students with nurse association`);

    // Test create
    const testUser = await User.create({
      email: `test-${Date.now()}@example.com`,
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
      role: 'NURSE'
    });
    console.log(`✅ Created test user: ${testUser.id}`);

    // Cleanup
    await testUser.destroy();
    console.log('✅ Cleanup complete');

    await sequelize.close();
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testConnection();
```

Run the test:

```bash
npx ts-node src/database/test-connection.ts
```

---

## Step 8: Update One Service as Proof of Concept (20 minutes)

Let's update `userService.ts` first:

**Before (Prisma):**
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const userService = {
  async getUsers(filters: any) {
    return await prisma.user.findMany({
      where: filters,
      include: { nurseManagedStudents: true }
    });
  }
};
```

**After (Sequelize):**
```typescript
import { User, Student } from '../database/models';
import { BaseService } from '../database/services/BaseService';

class UserService extends BaseService<User> {
  constructor() {
    super(User);
  }

  async getUsers(filters: any) {
    const where = this.buildWhereClause(filters);

    return await User.findAll({
      where,
      include: [{
        model: Student,
        as: 'nurseManagedStudents'
      }]
    });
  }
}

export const userService = new UserService();
```

---

## Step 9: Update Authentication Middleware (15 minutes)

**File: `src/middleware/auth.ts`**

**Find and replace:**
```typescript
// OLD
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const user = await prisma.user.findUnique({
  where: { id: payload.userId },
  select: { id: true, email: true, role: true, isActive: true }
});

// NEW
import { User } from '../database/models';

const user = await User.findByPk(payload.userId, {
  attributes: ['id', 'email', 'role', 'isActive']
});
```

---

## Step 10: Test Authentication Flow (10 minutes)

```bash
# Start the server
npm run dev

# Test health check
curl http://localhost:3001/health

# Test login (should still work with Sequelize)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nurse@example.com",
    "password": "password123"
  }'

# Expected response:
# {
#   "success": true,
#   "data": {
#     "token": "eyJhbGci...",
#     "user": { "id": "...", "email": "nurse@example.com", ... }
#   }
# }
```

---

## Step 11: Parallel Operation (Transition Phase)

During migration, both Prisma and Sequelize can coexist:

```typescript
// Keep Prisma running for non-migrated services
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Import Sequelize for migrated services
import { sequelize, User, Student } from './database/models';

// Example: Use Sequelize for users, Prisma for others (temporarily)
const user = await User.findByPk(userId);  // Sequelize
const report = await prisma.complianceReport.findMany();  // Prisma (not migrated yet)
```

---

## Step 12: Gradual Service Migration

Migrate services in this order (lowest to highest risk):

1. ✅ **UserService** (authentication-critical but simple)
2. ✅ **DistrictService, SchoolService** (low complexity)
3. ✅ **StudentService** (core model, moderate complexity)
4. ✅ **EmergencyContactService** (simple, dependent on Student)
5. ✅ **HealthRecordService** (complex, high importance)
6. ✅ **MedicationService** (complex scheduling logic)
7. ✅ **AppointmentService** (complex availability logic)
8. ✅ **IncidentReportService** (moderate complexity)
9. ✅ **InventoryService** (raw SQL conversions)
10. ✅ **ComplianceService** (HIPAA-critical)

---

## Step 13: Continuous Testing

After each service migration:

```bash
# Run unit tests
npm test

# Run specific service tests
npm test -- userService

# Test API endpoints
npm run test:api

# Check for TypeScript errors
npm run type-check
```

---

## Step 14: Monitor Performance

Install monitoring tools:

```bash
npm install --save-dev clinic
```

Profile queries:

```typescript
// Enable Sequelize query logging
sequelize.options.logging = (sql, timing) => {
  if (timing && timing > 1000) {
    console.warn(`⚠️ SLOW QUERY (${timing}ms):`, sql.substring(0, 200));
  }
};
```

---

## Step 15: Final Prisma Removal

**Only after ALL services migrated:**

```bash
# Remove Prisma dependencies
npm uninstall @prisma/client prisma

# Remove Prisma files
rm -rf prisma/

# Remove Prisma imports from code
grep -r "from '@prisma/client'" src/
# (ensure no results)

# Final test
npm run build
npm test
npm start
```

---

## Troubleshooting

### Issue: "Cannot find module 'sequelize'"

```bash
npm install sequelize pg pg-hstore
```

### Issue: "Migration already executed"

```bash
# Rollback last migration
npx sequelize-cli db:migrate:undo

# Re-run migration
npx sequelize-cli db:migrate
```

### Issue: "Association not found"

Check that associations are defined in `models/index.ts`:

```typescript
// Ensure associations are setup
User.hasMany(Student, { foreignKey: 'nurseId', as: 'nurseManagedStudents' });
Student.belongsTo(User, { foreignKey: 'nurseId', as: 'nurse' });
```

### Issue: "Slow queries"

Add indexes:

```sql
CREATE INDEX idx_students_nurse ON students(nurse_id);
CREATE INDEX idx_health_records_student ON health_records(student_id);
```

---

## Next Steps

1. ✅ Complete this quick start guide
2. ✅ Review full migration plan: `SEQUELIZE_MIGRATION_PLAN.md`
3. ✅ Migrate remaining services one by one
4. ✅ Run comprehensive tests
5. ✅ Deploy to staging
6. ✅ Schedule production migration

---

## Resources

- **Full Migration Plan**: `SEQUELIZE_MIGRATION_PLAN.md`
- **Sequelize Docs**: https://sequelize.org/docs/v6/
- **Query Conversion Guide**: See Part 2.2 in migration plan
- **HIPAA Compliance**: See Part 6.4 in migration plan

---

## Support

If you encounter issues:

1. Check `SEQUELIZE_MIGRATION_PLAN.md` troubleshooting section
2. Review agent outputs for detailed implementation
3. Test in development environment first
4. Create database backups before any changes

**Estimated Time for Quick Start**: ~2-3 hours
**Estimated Time for Full Migration**: 4-5 weeks

---

**Status**: Ready to Begin ✅
**Last Updated**: 2025-10-10

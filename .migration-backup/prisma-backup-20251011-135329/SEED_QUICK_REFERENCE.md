# Database Seeding Quick Reference

## Quick Commands

```bash
# Navigate to backend directory
cd backend

# Basic seeding
npm run seed                # Base seed only (~500 students, basic data)
npm run seed:enhanced       # Enhanced health data (run after base seed)
npm run db:seed-all         # Run both base + enhanced

# Database reset
npm run db:reset            # Clear DB and re-seed (DESTRUCTIVE!)

# Database management
npm run migrate             # Run migrations
npm run generate            # Generate Prisma client
npm run studio              # Open Prisma Studio
```

## What Gets Created

### Base Seed (`npm run seed`)
- 1 District, 5 Schools
- 17 Users (4 admins, 7 nurses, 3 counselors, 3 viewers)
- 500 Students (K-12, distributed across schools)
- 1,000 Emergency Contacts (2 per student)
- ~1,000 Health Records
- ~100 Allergies (20% of students)
- ~50 Chronic Conditions (10% of students)
- 12 Medications + Inventory
- ~75 Appointments
- ~25 Incident Reports
- 22 Permissions, 4 Roles
- 27 System Configurations
- 35 Nurse Availability Records

### Enhanced Seed (`npm run seed:enhanced`)
- ~4,500 Vaccinations (age-appropriate, 90% compliance)
- ~1,250 Health Screenings (vision, hearing, scoliosis, BMI)
- ~850 Growth Measurements (height, weight, BMI tracking)
- ~100 Vital Signs (for recent appointments)
- 5 Communication Templates
- 4 Training Modules

## Login Credentials

### Production Accounts (Password: `admin123`)
- **Super Admin**: `admin@whitecross.health`
- **Nurse**: `nurse@whitecross.health`
- **District Admin**: `district.admin@unifiedschools.edu`
- **School Admin**: `school.admin@centralhigh.edu`
- **Counselor**: `counselor@centralhigh.edu`
- **Viewer**: `viewer@centralhigh.edu`

### Test Accounts (for Cypress)
- **Admin**: `admin@school.edu` (Password: `AdminPassword123!`)
- **Nurse**: `nurse@school.edu` (Password: `testNursePassword`)
- **Counselor**: `counselor@school.edu` (Password: `CounselorPassword123!`)
- **Read-Only**: `readonly@school.edu` (Password: `ReadOnlyPassword123!`)

## File Structure

```
backend/prisma/
├── seed.ts                    # Base seed script
├── seed.enhanced.ts           # Enhanced health data seed
├── reset-database.ts          # Database reset utility
├── SEEDING_GUIDE.md           # Comprehensive documentation
├── SEED_QUICK_REFERENCE.md    # This file
└── seed-data/                 # Helper modules
    ├── generators.ts          # Data generation utilities
    └── medications.ts         # Medication reference data
```

## Common Workflows

### Fresh Development Environment
```bash
cd backend
npm run db:reset        # Clear and re-seed (will prompt for confirmation)
# Type "yes" to confirm
# Type "y" when asked about enhanced seed
```

### Update After Schema Changes
```bash
cd backend
npm run migrate         # Apply schema changes
npm run seed            # Re-seed base data
```

### Testing E2E Tests
```bash
cd backend
npm run db:reset        # Fresh database
cd ../frontend
npm run test:e2e        # Run Cypress tests
```

### Add More Data (Without Clearing)
```bash
# WARNING: May cause unique constraint errors if data exists
npm run seed:enhanced   # Add enhanced data only
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "No students found" | Run `npm run seed` first |
| "Unique constraint failed" | Run `npm run db:reset` |
| "Database connection failed" | Check `.env` DATABASE_URL |
| Seeds too slow | Run base seed only, skip enhanced |

## Data Characteristics

- **Realistic**: Age-appropriate data, proper medical terminology
- **HIPAA-Compliant**: All data is synthetic/fake
- **Comprehensive**: Covers all major platform features
- **Relational Integrity**: All foreign keys properly linked
- **Testable**: Includes test accounts for automation

## Performance

| Operation | Time (approx) | Records Created |
|-----------|---------------|-----------------|
| Base Seed | 30-60 seconds | ~3,500 |
| Enhanced Seed | 30-45 seconds | ~7,500 |
| Full Reset | 60-120 seconds | ~11,000 |

*Times vary based on hardware and database configuration*

## Next Steps

1. Run base seed: `npm run seed`
2. Start backend: `npm run dev`
3. Start frontend: `cd ../frontend && npm run dev`
4. Login with any account above
5. Explore the seeded data

## Full Documentation

For detailed information, see `SEEDING_GUIDE.md`

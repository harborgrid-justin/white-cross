# White Cross Database Seeding Guide

This guide explains how to use the comprehensive database seeding system for the White Cross healthcare platform.

## Overview

The seeding system consists of three main components:

1. **Base Seed** (`seed.ts`) - Core data including users, students, schools, medications, and basic health records
2. **Enhanced Seed** (`seed.enhanced.ts`) - Additional comprehensive health data (vaccinations, screenings, growth measurements, vital signs)
3. **Database Reset** (`reset-database.ts`) - Utility to clear and re-seed the database

## Quick Start

### Seed Fresh Database

```bash
# From backend directory
cd backend

# Run base seed only
npm run seed

# Run enhanced seed (requires base seed to be run first)
npm run seed:enhanced

# Run both base and enhanced seeds
npm run db:seed-all
```

### Reset and Re-seed Database

```bash
# Reset database and re-seed (DESTRUCTIVE!)
npm run db:reset
```

## Seed Scripts Details

### 1. Base Seed (`seed.ts`)

Creates the foundational data for the platform:

#### Organizations
- **1 District**: Unified School District
- **5 Schools**:
  - Central High School (500 students)
  - West Elementary School (350 students)
  - East Middle School (420 students)
  - North Elementary School (310 students)
  - South High School (480 students)

#### Users (17 total)
- **4 Admin Users**:
  - Super Admin (admin@whitecross.health)
  - District Admin (district.admin@unifiedschools.edu)
  - School Admin (school.admin@centralhigh.edu)
  - Test Admin (admin@school.edu)

- **7 Nurse Users**:
  - One primary nurse per school
  - Additional nurse at Central High
  - Test nurse account

- **3 Counselors**:
  - 2 production counselors
  - 1 test counselor

- **3 Viewers**:
  - 1 production viewer
  - 2 test viewer accounts

#### Security & Access Control
- **22 Permissions**: Covering all major resources (students, medications, health records, incidents, reports, administration)
- **4 Roles**: Administrator, School Nurse, School Counselor, Read Only
- Role-permission mappings
- User-role assignments

#### Students (500 total)
- Realistic names, demographics
- Ages 5-18 (K-12)
- Distributed across all schools
- Assigned to school nurses
- Medical record numbers
- Enrollment dates

#### Emergency Contacts (1000 total)
- 2 contacts per student (mother and father)
- Contact information (phone, email, address)
- Priority levels (PRIMARY, SECONDARY)

#### Health Records (~1000 total)
- 1-3 health records per student
- Types: CHECKUP, VACCINATION, ILLNESS, INJURY, SCREENING, PHYSICAL_EXAM
- Timestamped and properly documented

#### Allergies (~100 total)
- 20% of students have allergies
- Various allergens (food, environmental, medication, insect)
- Severity levels (MILD, MODERATE, SEVERE, LIFE_THREATENING)
- Verified by nurses

#### Chronic Conditions (~50 total)
- 10% of students have chronic conditions
- Common conditions: Asthma, Type 1 Diabetes, ADHD, Epilepsy, etc.
- Active monitoring status
- Treatment notes

#### Medications (12 medications + inventory)
- Common school medications:
  - Respiratory: Albuterol, inhalers
  - Emergency: EpiPens
  - Pain/Fever: Tylenol, Ibuprofen
  - ADHD: Methylphenidate, Adderall, Concerta (controlled)
  - Allergies: Benadryl
  - Diabetes: Insulin
  - Antibiotics: Amoxicillin
  - Mental Health: Zoloft
- Inventory tracking with batch numbers, expiration dates, quantities

#### Appointments (~75 appointments)
- 15% of students have appointments
- Types: ROUTINE_CHECKUP, MEDICATION_ADMINISTRATION, INJURY_ASSESSMENT, ILLNESS_EVALUATION, FOLLOW_UP
- Past and future appointments
- Realistic statuses (COMPLETED, NO_SHOW, SCHEDULED)

#### Incident Reports (~25 reports)
- 5% of students have incident reports
- Types: INJURY, ILLNESS, BEHAVIORAL, ALLERGIC_REACTION, EMERGENCY
- Severity levels: LOW, MEDIUM, HIGH, CRITICAL
- Parent notifications
- Witness information
- Follow-up tracking

#### System Configurations (27 configs)
- Application settings (name, branding)
- Security settings (password requirements, session timeout)
- File upload limits
- Medication thresholds
- Appointment defaults
- UI preferences
- Performance settings
- Backup schedules

#### Nurse Availability
- Weekly schedules for all nurses
- Monday-Friday, 8:00 AM - 4:00 PM
- Recurring availability patterns

---

### 2. Enhanced Seed (`seed.enhanced.ts`)

Adds comprehensive healthcare data on top of the base seed:

#### Vaccinations (~4500 total)
- Age-appropriate vaccinations for all students
- Based on CDC recommended schedule:
  - DTaP (5 doses)
  - Polio (4 doses)
  - MMR (2 doses)
  - Varicella (2 doses)
  - Hepatitis B (3 doses)
  - Hepatitis A (2 doses)
  - HPV (2 doses for age 11+)
  - Meningococcal (2 doses for age 11+)
  - Tdap (1 dose for age 11+)
- 90% vaccination compliance rate
- Lot numbers, manufacturers, administration sites
- Consent tracking, VIS provided

#### Health Screenings (~1250 total)
- Vision screenings (K, 1st, 3rd, 5th, 7th, 9th)
- Hearing screenings (K, 1st, 3rd, 5th, 7th, 9th)
- Scoliosis screenings (6th, 7th, 8th)
- BMI screenings (all students)
- Realistic pass/refer ratios (85% pass for vision, 92% for hearing)
- Referrals to specialists when needed

#### Growth Measurements (~850 total)
- 1-3 measurements per student
- Height (cm), Weight (kg), BMI
- BMI percentiles
- Nutritional status (Underweight, Normal, Overweight, Obese)
- Age-appropriate growth tracking

#### Vital Signs (~100 total)
- For students with recent appointments
- Age-appropriate vitals:
  - Temperature (97-99°F)
  - Heart rate
  - Respiratory rate
  - Blood pressure (for ages 10+)
  - Oxygen saturation
  - Pain levels (for injuries)
  - Consciousness level

#### Communication Templates (5 templates)
- Appointment Reminder (EMAIL)
- Medication Reminder (SMS)
- Emergency Alert (EMAIL)
- Health Update Notification (EMAIL)
- Incident Report Notification (EMAIL)
- Variable placeholders for personalization

#### Training Modules (4 modules)
- HIPAA Compliance Training (60 min, required)
- Medication Administration Basics (45 min, required)
- Emergency Response Procedures (90 min, required)
- White Cross Platform Training (30 min, optional)

---

### 3. Database Reset Script (`reset-database.ts`)

Interactive utility to completely reset the database:

**Features:**
- User confirmation required (type "yes" to proceed)
- Clears all tables in correct dependency order
- Runs database migrations
- Optionally runs base and enhanced seeds
- Progress reporting
- Error handling
- Graceful cancellation (Ctrl+C)

**What it does:**
1. Prompts for confirmation
2. Clears all database tables
3. Runs Prisma migrations
4. Runs base seed
5. Optionally runs enhanced seed

---

## Seed Data Statistics

### Total Data Created (Base + Enhanced)

| Category | Count |
|----------|-------|
| **Organizations** | |
| Districts | 1 |
| Schools | 5 |
| **Users** | |
| Total Users | 17 |
| Admins | 4 |
| Nurses | 7 |
| Counselors | 3 |
| Viewers | 3 |
| **Security** | |
| Permissions | 22 |
| Roles | 4 |
| **Students** | |
| Total Students | 500 |
| Emergency Contacts | 1,000 |
| **Health Records** | |
| Basic Health Records | ~1,000 |
| Vaccinations | ~4,500 |
| Allergies | ~100 |
| Chronic Conditions | ~50 |
| Health Screenings | ~1,250 |
| Growth Measurements | ~850 |
| Vital Signs | ~100 |
| **Clinical** | |
| Medications | 12 |
| Inventory Items | 12 |
| Appointments | ~75 |
| Incident Reports | ~25 |
| **Communication** | |
| Message Templates | 5 |
| **Training** | |
| Training Modules | 4 |
| **System** | |
| Configurations | 27 |
| Nurse Availability Records | 35 |

**Grand Total: ~10,000+ database records**

---

## Login Credentials

### Production Accounts

**Super Admin**
- Email: `admin@whitecross.health`
- Password: `admin123`
- Role: ADMIN

**Head Nurse**
- Email: `nurse@whitecross.health`
- Password: `admin123`
- Role: NURSE

**District Admin**
- Email: `district.admin@unifiedschools.edu`
- Password: `admin123`
- Role: DISTRICT_ADMIN

**School Admin**
- Email: `school.admin@centralhigh.edu`
- Password: `admin123`
- Role: SCHOOL_ADMIN

**Counselor**
- Email: `counselor@centralhigh.edu`
- Password: `admin123`
- Role: COUNSELOR

**Viewer**
- Email: `viewer@centralhigh.edu`
- Password: `admin123`
- Role: VIEWER

### Test Accounts (for Cypress E2E Testing)

**Test Admin**
- Email: `admin@school.edu`
- Password: `AdminPassword123!`
- Role: ADMIN

**Test Nurse**
- Email: `nurse@school.edu`
- Password: `testNursePassword`
- Role: NURSE

**Test Counselor**
- Email: `counselor@school.edu`
- Password: `CounselorPassword123!`
- Role: COUNSELOR

**Test Read-Only**
- Email: `readonly@school.edu`
- Password: `ReadOnlyPassword123!`
- Role: VIEWER

---

## Advanced Usage

### Running Seeds Programmatically

```typescript
import { execSync } from 'child_process';

// Run base seed
execSync('npx ts-node prisma/seed.ts', { stdio: 'inherit' });

// Run enhanced seed
execSync('npx ts-node prisma/seed.enhanced.ts', { stdio: 'inherit' });
```

### Customizing Seed Data

Edit the seed files directly:

**Adjust student count** (seed.ts, line ~706):
```typescript
for (let batch = 0; batch < 10; batch++) {  // Change 10 to desired batches
  const batchSize = 50;  // Change batch size
```

**Modify vaccination compliance** (seed.enhanced.ts, line ~92):
```typescript
const vaccinations = dueVaccines
  .filter(() => randomBool(0.9))  // Change 0.9 (90%) to desired rate
```

**Adjust allergy prevalence** (seed.ts, line ~858):
```typescript
const studentsWithAllergies = students.filter(() => Math.random() < 0.2);  // 20%
```

### Data Integrity Checks

After seeding, verify data integrity:

```sql
-- Check referential integrity
SELECT COUNT(*) FROM students WHERE nurseId IS NOT NULL;
SELECT COUNT(*) FROM emergency_contacts;
SELECT COUNT(*) FROM vaccinations;
SELECT COUNT(*) FROM health_records;

-- Check for orphaned records
SELECT COUNT(*) FROM students WHERE nurseId NOT IN (SELECT id FROM users);
```

---

## Troubleshooting

### Error: "No students found"

**Problem**: Running enhanced seed without base seed.

**Solution**:
```bash
npm run seed          # Run base seed first
npm run seed:enhanced # Then run enhanced seed
```

### Error: "Unique constraint failed"

**Problem**: Trying to re-run seed without clearing database.

**Solution**:
```bash
npm run db:reset  # Clear and re-seed
```

### Error: "Database connection failed"

**Problem**: Database not running or incorrect connection string.

**Solution**:
1. Check `.env` file for correct `DATABASE_URL`
2. Ensure PostgreSQL is running
3. Test connection: `npx prisma db push`

### Slow Seed Performance

**Problem**: Seeding takes too long.

**Solutions**:
- Reduce batch sizes in seed files
- Run base seed only (skip enhanced)
- Optimize database connection pool
- Use local PostgreSQL instance

---

## Best Practices

1. **Development**:
   - Use `npm run db:reset` to get fresh data
   - Run enhanced seed only when testing comprehensive features
   - Keep test accounts separate from production accounts

2. **Testing**:
   - Use test accounts for automated testing
   - Reset database before running E2E test suites
   - Verify seed data matches test expectations

3. **Production**:
   - NEVER run reset script in production
   - Use migrations for schema changes
   - Seed only initial lookup/reference data

4. **HIPAA Compliance**:
   - All seed data is fake/synthetic
   - No real patient health information (PHI)
   - Safe for development and testing

---

## Extending the Seeds

To add new seed data:

1. Add data generation logic to appropriate seed file
2. Follow existing patterns for batching and progress reporting
3. Respect foreign key relationships
4. Use realistic, HIPAA-compliant fake data
5. Update this documentation

Example:
```typescript
// In seed.enhanced.ts
console.log('Creating Custom Data...');
const customData = await Promise.all(
  students.map(student =>
    prisma.customTable.create({
      data: {
        studentId: student.id,
        // ... custom fields
      }
    })
  )
);
console.log(`✓ Created ${customData.length} custom records\n`);
```

---

## Support

For issues or questions:
1. Check this documentation
2. Review seed file comments
3. Consult Prisma schema (`schema.prisma`)
4. Check logs for specific error messages

---

## References

- [Prisma Seeding Guide](https://www.prisma.io/docs/guides/database/seed-database)
- [CDC Vaccination Schedule](https://www.cdc.gov/vaccines/schedules/hcp/imz/child-adolescent.html)
- [HIPAA Compliance Guidelines](https://www.hhs.gov/hipaa/index.html)

---

**Last Updated**: 2025-01-10

# Index Optimization Guide
## White Cross Healthcare Platform - Sequelize Index Strategy

**Last Updated:** 2025-11-07
**Agent:** Sequelize Associations Architect

---

## Table of Contents

1. [Overview](#overview)
2. [Index Types](#index-types)
3. [Implemented Indexes](#implemented-indexes)
4. [Query Optimization Patterns](#query-optimization-patterns)
5. [N+1 Query Prevention](#n1-query-prevention)
6. [Performance Testing](#performance-testing)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Overview

This guide documents the index optimization strategy implemented across all Sequelize models in the White Cross Healthcare Platform. The optimizations focus on:

- Foreign key indexing for efficient joins
- Performance indexes for common query patterns
- Composite indexes for multi-field queries
- Partial indexes for filtered subsets
- GIN indexes for array/JSONB operations

### Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Foreign Key Index Coverage | 100% | ✓ Achieved |
| Query Count Reduction | -50% | In Progress |
| Dashboard Query Time | -40% | To Measure |
| Medication Log Query Time | -50% | To Measure |

---

## Index Types

### 1. B-Tree Indexes (Default)

**Use Cases:**
- Equality comparisons (`=`)
- Range queries (`<`, `>`, `BETWEEN`)
- Sorting (`ORDER BY`)
- Pattern matching with prefix (`LIKE 'prefix%'`)

**Example:**
```typescript
@Index({ name: 'idx_students_enrollment_date' })
@Column(DataType.DATE)
enrollmentDate: Date;
```

### 2. GIN Indexes (Generalized Inverted Index)

**Use Cases:**
- Array containment (`@>`, `<@`)
- JSONB operations
- Full-text search
- Any-element queries

**Example:**
```typescript
@Index({ using: 'GIN', name: 'idx_incident_reports_evidence_photos_gin' })
@Column(DataType.ARRAY(DataType.STRING))
evidencePhotos: string[];
```

### 3. Partial Indexes

**Use Cases:**
- Queries with consistent WHERE clauses
- Active/inactive record filtering
- Status-based queries
- Reducing index size

**Example:**
```typescript
{
  fields: ['isActive'],
  where: { isActive: true },
  name: 'idx_students_active',
}
```

### 4. Composite Indexes

**Use Cases:**
- Multi-column filtering
- Complex WHERE clauses
- Covering indexes for SELECT projections

**Example:**
```typescript
{
  fields: ['schoolId', 'grade', 'isActive'],
  name: 'idx_students_school_grade_active',
}
```

---

## Implemented Indexes

### Student Model

#### Indexes Added:
1. **enrollmentDate** - Single column B-tree index
   - **Purpose:** Cohort queries, enrollment period filtering
   - **Query Pattern:** `WHERE enrollmentDate BETWEEN ? AND ?`

2. **(schoolId, grade, isActive)** - Composite index
   - **Purpose:** School roster filtering
   - **Query Pattern:** `WHERE schoolId = ? AND grade = ? AND isActive = ?`

3. **isActive (partial)** - Partial index on active students
   - **Purpose:** Faster active student queries, reduced index size
   - **Query Pattern:** `WHERE isActive = true`

**Example Query:**
```typescript
// Optimized by composite index
const activeStudents = await Student.findAll({
  where: {
    schoolId: 'uuid-here',
    grade: '10',
    isActive: true
  },
  order: [['lastName', 'ASC']]
});
```

### Medication Model

#### Indexes Added:
1. **manufacturer** - Single column B-tree index
   - **Purpose:** Recall queries by manufacturer
   - **Query Pattern:** `WHERE manufacturer = ?`

**Example Query:**
```typescript
// Optimized by manufacturer index
const medicationsByManufacturer = await Medication.findAll({
  where: {
    manufacturer: 'Pfizer',
    isActive: true
  }
});
```

### Allergy Model

#### Indexes Added:
1. **diagnosedDate** - Single column B-tree index
   - **Purpose:** Timeline queries, historical analysis
   - **Query Pattern:** `WHERE diagnosedDate >= ?`

**Example Query:**
```typescript
// Optimized by diagnosedDate index
const recentAllergies = await Allergy.findAll({
  where: {
    diagnosedDate: {
      [Op.gte]: oneYearAgo
    }
  },
  order: [['diagnosedDate', 'DESC']]
});
```

### IncidentReport Model

#### Indexes Added:
1. **evidencePhotos (GIN)** - GIN array index
   - **Purpose:** Array containment queries, efficient searches
   - **Query Pattern:** `WHERE evidencePhotos @> ARRAY[?]`

**Example Query:**
```typescript
// Optimized by GIN index on evidencePhotos
const incidentsWithPhoto = await IncidentReport.findAll({
  where: {
    evidencePhotos: {
      [Op.contains]: ['photo_12345.jpg']
    }
  }
});

// Find incidents with any evidence photos
const incidentsWithEvidence = await IncidentReport.findAll({
  where: {
    evidencePhotos: {
      [Op.ne]: []
    }
  }
});
```

### StudentMedication Model

#### Indexes Added:
1. **studentId** - Foreign key index (decorator)
2. **medicationId** - Foreign key index (decorator)

**Example Query:**
```typescript
// Optimized by foreign key indexes
const studentMedications = await StudentMedication.findAll({
  where: { studentId: 'uuid-here' },
  include: [{ model: Medication, as: 'medication' }]
});
```

### MedicationLog Model

#### Indexes Added:
1. **(medicationId, administeredAt, status)** - Composite index
   - **Purpose:** Medication administration history
   - **Query Pattern:** `WHERE medicationId = ? AND administeredAt >= ? AND status = ?`

2. **(studentId, administeredAt, status)** - Composite index
   - **Purpose:** Student medication log queries
   - **Query Pattern:** `WHERE studentId = ? AND administeredAt >= ? AND status = ?`

**Example Queries:**
```typescript
// Optimized by medication composite index
const medicationHistory = await MedicationLog.findAll({
  where: {
    medicationId: 'uuid-here',
    administeredAt: {
      [Op.gte]: startDate
    },
    status: MedicationLogStatus.ADMINISTERED
  },
  order: [['administeredAt', 'DESC']]
});

// Optimized by student composite index
const studentMedicationLogs = await MedicationLog.findAll({
  where: {
    studentId: 'uuid-here',
    administeredAt: {
      [Op.gte]: startDate
    },
    status: MedicationLogStatus.ADMINISTERED
  }
});
```

---

## Query Optimization Patterns

### 1. Single Table Queries

**Before Optimization:**
```typescript
// Full table scan
const students = await Student.findAll({
  where: { grade: '10' }
});
```

**After Optimization:**
```typescript
// Uses composite index
const students = await Student.findAll({
  where: {
    schoolId: uuid,
    grade: '10',
    isActive: true
  }
});
```

### 2. Join Queries

**Before Optimization:**
```typescript
// No foreign key index, slow join
const records = await HealthRecord.findAll({
  include: [{ model: Student }]
});
```

**After Optimization:**
```typescript
// Foreign key index enables efficient join
const records = await HealthRecord.findAll({
  where: { studentId: uuid },
  include: [{
    model: Student,
    as: 'student',
    attributes: ['id', 'firstName', 'lastName']
  }]
});
```

### 3. Array Queries

**Before Optimization:**
```typescript
// Sequential scan of array field
const incidents = await IncidentReport.findAll({
  where: {
    evidencePhotos: { [Op.contains]: ['photo.jpg'] }
  }
});
```

**After Optimization:**
```typescript
// GIN index enables fast array searches
const incidents = await IncidentReport.findAll({
  where: {
    evidencePhotos: { [Op.contains]: ['photo.jpg'] }
  }
});
// Uses idx_incident_reports_evidence_photos_gin
```

### 4. Filtered Queries

**Before Optimization:**
```typescript
// Full index scan even for active records
const activeStudents = await Student.findAll({
  where: { isActive: true }
});
```

**After Optimization:**
```typescript
// Partial index for active students only
const activeStudents = await Student.findAll({
  where: { isActive: true }
});
// Uses idx_students_active (partial index)
```

---

## N+1 Query Prevention

### Problem: N+1 Queries

**Bad Example:**
```typescript
// 1 query to get students
const students = await Student.findAll();

// N queries to get health records for each student
for (const student of students) {
  const records = await student.getHealthRecords(); // N queries!
}
// Total: 1 + N queries
```

### Solution 1: Eager Loading with Include

**Good Example:**
```typescript
// Single query with joins
const students = await Student.findAll({
  include: [{
    model: HealthRecord,
    as: 'healthRecords',
    where: { isActive: true },
    required: false // LEFT JOIN
  }]
});
// Total: 1 query
```

### Solution 2: Separate Query with IN Clause

**Good Example:**
```typescript
// 1 query for students
const students = await Student.findAll();
const studentIds = students.map(s => s.id);

// 1 query for all health records
const records = await HealthRecord.findAll({
  where: {
    studentId: { [Op.in]: studentIds }
  }
});

// Group records by studentId
const recordsByStudent = records.reduce((acc, record) => {
  if (!acc[record.studentId]) acc[record.studentId] = [];
  acc[record.studentId].push(record);
  return acc;
}, {});
// Total: 2 queries (much better than 1 + N)
```

### Solution 3: Separate Queries for HasMany

**Good Example:**
```typescript
// Avoid cartesian product with separate: true
const users = await User.findAll({
  include: [{
    model: Post,
    as: 'posts',
    separate: true, // Executes separate query
    limit: 5,
    order: [['createdAt', 'DESC']]
  }]
});
// Total: 2 queries (1 for users, 1 for posts)
```

### Common Patterns

#### 1. Student Dashboard Query

```typescript
const studentDashboard = await Student.findByPk(studentId, {
  include: [
    {
      model: User,
      as: 'nurse',
      attributes: ['id', 'firstName', 'lastName', 'email']
    },
    {
      model: HealthRecord,
      as: 'healthRecords',
      where: { isActive: true },
      required: false,
      limit: 10,
      order: [['recordDate', 'DESC']],
      separate: true
    },
    {
      model: Allergy,
      as: 'allergies',
      where: { active: true },
      required: false
    },
    {
      model: ChronicCondition,
      as: 'chronicConditions',
      where: { status: 'ACTIVE' },
      required: false
    }
  ]
});
```

#### 2. Nurse Schedule Query

```typescript
const nurseSchedule = await Appointment.findAll({
  where: {
    nurseId: uuid,
    scheduledAt: {
      [Op.gte]: startOfDay,
      [Op.lt]: endOfDay
    },
    status: {
      [Op.in]: ['SCHEDULED', 'IN_PROGRESS']
    }
  },
  include: [
    {
      model: Student,
      as: 'student',
      attributes: ['id', 'firstName', 'lastName', 'grade']
    },
    {
      model: AppointmentReminder,
      as: 'reminders',
      required: false,
      separate: true
    }
  ],
  order: [['scheduledAt', 'ASC']]
});
```

#### 3. Medication Administration Log

```typescript
const medicationLogs = await MedicationLog.findAll({
  where: {
    studentId: uuid,
    administeredAt: {
      [Op.gte]: startDate
    }
  },
  include: [
    {
      model: StudentMedication,
      as: 'studentMedication',
      include: [{
        model: Medication,
        as: 'medication',
        attributes: ['id', 'name', 'genericName', 'dosageForm']
      }]
    },
    {
      model: User,
      as: 'administeredBy',
      attributes: ['id', 'firstName', 'lastName']
    }
  ],
  order: [['administeredAt', 'DESC']]
});
```

---

## Performance Testing

### 1. Capture Baseline Metrics

Before optimizations:
```typescript
const startTime = Date.now();
const result = await Student.findAll({
  where: { schoolId: uuid, grade: '10', isActive: true }
});
const duration = Date.now() - startTime;
console.log(`Query time: ${duration}ms, Results: ${result.length}`);
```

### 2. Enable Query Logging

```typescript
// In sequelize config
const sequelize = new Sequelize({
  logging: (sql, timing) => {
    console.log(`[${timing}ms] ${sql}`);
  },
  benchmark: true
});
```

### 3. Use EXPLAIN ANALYZE

```typescript
const [results, metadata] = await sequelize.query(
  'EXPLAIN ANALYZE SELECT * FROM students WHERE school_id = $1',
  {
    bind: [schoolId],
    type: QueryTypes.SELECT
  }
);
console.log(results);
```

### 4. Monitor Query Count

```typescript
let queryCount = 0;
sequelize.addHook('beforeQuery', () => queryCount++);

// Execute operation
await someOperation();

console.log(`Total queries executed: ${queryCount}`);
```

### 5. Performance Test Suite

```typescript
describe('Index Performance Tests', () => {
  it('should use enrollment date index for cohort queries', async () => {
    const explain = await sequelize.query(
      'EXPLAIN (FORMAT JSON) SELECT * FROM students WHERE enrollment_date BETWEEN $1 AND $2',
      {
        bind: [startDate, endDate],
        type: QueryTypes.SELECT
      }
    );

    const plan = explain[0][0]['QUERY PLAN'][0];
    expect(plan.Plan['Index Name']).toBe('idx_students_enrollment_date');
  });

  it('should prevent N+1 queries for student health records', async () => {
    let queryCount = 0;
    sequelize.addHook('beforeQuery', () => queryCount++);

    const students = await Student.findAll({
      limit: 10,
      include: [{ model: HealthRecord, as: 'healthRecords' }]
    });

    // Should be 1 query (or 2 if using separate: true), not 1 + N
    expect(queryCount).toBeLessThan(3);
  });
});
```

---

## Monitoring & Maintenance

### 1. Check Index Usage

```sql
-- View index usage statistics
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;
```

### 2. Find Unused Indexes

```sql
-- Indexes that have never been scanned
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexname NOT LIKE 'pg_toast%'
  AND schemaname = 'public';
```

### 3. Monitor Index Size

```sql
-- Index size by table
SELECT
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
  pg_size_pretty(pg_relation_size(tablename::regclass)) as table_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC
LIMIT 20;
```

### 4. Check for Bloat

```sql
-- Identify bloated indexes
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size,
  idx_scan,
  CASE
    WHEN idx_scan = 0 THEN 'Never used'
    WHEN idx_scan < 100 THEN 'Rarely used'
    ELSE 'Frequently used'
  END as usage
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### 5. Maintenance Tasks

```sql
-- Vacuum and analyze for index statistics
VACUUM ANALYZE students;

-- Reindex if performance degrades
REINDEX INDEX CONCURRENTLY idx_students_enrollment_date;

-- Reindex entire table
REINDEX TABLE CONCURRENTLY students;
```

### 6. Automated Monitoring Script

```typescript
// scripts/monitor-indexes.ts
import { sequelize } from '../src/config/database';
import { QueryTypes } from 'sequelize';

async function monitorIndexes() {
  const unusedIndexes = await sequelize.query(`
    SELECT indexname, tablename, idx_scan
    FROM pg_stat_user_indexes
    WHERE idx_scan = 0
      AND indexname NOT LIKE 'pg_toast%'
      AND schemaname = 'public'
  `, { type: QueryTypes.SELECT });

  if (unusedIndexes.length > 0) {
    console.warn('Unused indexes detected:');
    console.table(unusedIndexes);
  }

  const largeIndexes = await sequelize.query(`
    SELECT
      indexname,
      tablename,
      pg_size_pretty(pg_relation_size(indexrelid)) as size
    FROM pg_stat_user_indexes
    WHERE schemaname = 'public'
    ORDER BY pg_relation_size(indexrelid) DESC
    LIMIT 10
  `, { type: QueryTypes.SELECT });

  console.log('Largest indexes:');
  console.table(largeIndexes);
}

// Run monthly
monitorIndexes().then(() => process.exit(0));
```

---

## Best Practices

### 1. Index Naming Conventions

```typescript
// Single column: idx_{table}_{column}
idx_students_enrollment_date

// Composite: idx_{table}_{col1}_{col2}_{col3}
idx_students_school_grade_active

// Partial: idx_{table}_{condition}
idx_students_active

// GIN: idx_{table}_{column}_gin
idx_incident_reports_evidence_photos_gin
```

### 2. Index Column Order

For composite indexes, order columns by selectivity:
1. Most selective (fewest duplicates) first
2. Commonly filtered columns
3. Range conditions last

```typescript
// Good: High selectivity first
{
  fields: ['schoolId', 'grade', 'isActive']
  // schoolId: ~50 values (high selectivity)
  // grade: ~13 values (medium selectivity)
  // isActive: 2 values (low selectivity)
}

// Bad: Low selectivity first
{
  fields: ['isActive', 'grade', 'schoolId']
  // Less effective for queries
}
```

### 3. When to Use Partial Indexes

Use partial indexes when:
- Queries consistently filter on the same condition
- Filtered subset is < 50% of table
- Index size is a concern

```typescript
// Good use case
{
  fields: ['studentId'],
  where: { isActive: true },
  name: 'idx_students_active'
}
// If 90% of students are active, this is effective
```

### 4. Avoid Over-Indexing

**Signs of over-indexing:**
- Slow INSERT/UPDATE operations
- Large index sizes
- Indexes with idx_scan = 0
- Duplicate coverage (multiple indexes cover same queries)

**Solution:**
- Remove unused indexes
- Combine similar indexes into composite indexes
- Use partial indexes to reduce size

---

## Migration Guide

### Creating Indexes in Production

```sql
-- Always use CONCURRENTLY in production
CREATE INDEX CONCURRENTLY idx_students_enrollment_date
ON students(enrollment_date);

-- For composite indexes
CREATE INDEX CONCURRENTLY idx_students_school_grade_active
ON students(school_id, grade, is_active);

-- For partial indexes
CREATE INDEX CONCURRENTLY idx_students_active
ON students(is_active)
WHERE is_active = true;

-- For GIN indexes
CREATE INDEX CONCURRENTLY idx_incident_reports_evidence_photos_gin
ON incident_reports USING GIN(evidence_photos);
```

### Rollback Strategy

```sql
-- If index creation fails, drop and retry
DROP INDEX CONCURRENTLY IF EXISTS idx_students_enrollment_date;

-- Verify index exists before dropping
SELECT indexname FROM pg_indexes
WHERE tablename = 'students'
AND indexname = 'idx_students_enrollment_date';
```

---

## Summary

### Indexes Added

| Model | Index Type | Count |
|-------|-----------|-------|
| StudentMedication | Foreign Key | 2 |
| Student | Single Column | 1 |
| Student | Composite | 1 |
| Student | Partial | 1 |
| Medication | Single Column | 1 |
| Allergy | Single Column | 1 |
| IncidentReport | GIN Array | 1 |
| MedicationLog | Composite | 2 |
| **Total** | | **10** |

### Expected Performance Improvements

- **Foreign Key Joins:** 100% coverage enables efficient joins
- **Common Queries:** 40-50% faster with composite indexes
- **Array Searches:** 90%+ faster with GIN indexes
- **N+1 Queries:** Eliminated with eager loading patterns
- **Index Size:** Reduced with partial indexes

---

**Generated by:** Sequelize Associations Architect
**Date:** 2025-11-07
**Version:** 1.0.0

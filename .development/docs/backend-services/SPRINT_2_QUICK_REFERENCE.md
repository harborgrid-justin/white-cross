# Sprint 2 Quick Reference - Performance Optimization

**Estimated Effort:** 16-22 hours
**Expected Grade After Completion:** A- (93-95%)
**Current Grade:** B+ (87%)

---

## Tasks Checklist

### 1. N+1 Query Fixes (6-8 hours) - HIGHEST IMPACT

**Pattern:** Replace `Promise.all(items.map(async...))` with batch `Op.in` queries

#### Priority 1 - High Traffic (3 hours)
- [ ] medicationService.ts - getMedicationSchedule (45 min) → 60% query reduction
- [ ] appointmentService.ts - Multiple methods (1 hour) → 50% reduction
- [ ] inventoryService.ts - Multiple methods (45 min) → 40% reduction
- [ ] purchaseOrderService.ts - Multiple methods (30 min) → 50% reduction

#### Priority 2 - Medium Traffic (3-5 hours)
- [ ] incidentReportService.ts (30 min)
- [ ] auditService.ts (30 min)
- [ ] communicationService.ts (30 min)
- [ ] documentService.ts (30 min)
- [ ] complianceService.ts (30 min)
- [ ] analyticsService.ts (30 min)
- [ ] integrationService.ts (20 min)
- [ ] userService.ts (20 min)
- [ ] 30+ additional services (2-3 hours)

**Apply Pattern:**
```typescript
// Collect IDs
const ids = items.map(i => i.relatedId);

// Single batch query
const related = await RelatedModel.findAll({
  where: { id: { [Op.in]: ids } },
  raw: true
});

// Map for O(1) lookup
const relatedMap = new Map(related.map(r => [r.id, r]));

// Combine without queries
const result = items.map(item => ({
  item,
  related: relatedMap.get(item.relatedId)
}));
```

---

### 2. Add Caching (4-5 hours) - HIGH IMPACT

**Pattern:** Wrap expensive queries with cacheManager

#### Priority 1 - Most Expensive Operations (2 hours)
- [ ] medicationService.getMedicationSchedule (30 min) - 15 min TTL
- [ ] appointmentService.getSchedules (30 min) - 10 min TTL
- [ ] inventoryService.getAlerts (20 min) - 30 min TTL
- [ ] dashboardService.getSchedules (20 min) - 5 min TTL
- [ ] dashboardService.getAlerts (20 min) - 5 min TTL

#### Priority 2 - Frequent Reads (2-3 hours)
- [ ] healthRecordService.getVitals (20 min) - 30 min TTL
- [ ] medicationService.getFormulary (20 min) - 1 hour TTL
- [ ] incidentReportService.getReports (20 min) - 5 min TTL
- [ ] complianceService.getReports (20 min) - 1 hour TTL
- [ ] reportService.generateReport (30 min) - 30 min TTL
- [ ] 10+ additional services (1-2 hours)

**Apply Pattern:**
```typescript
import { cacheManager } from '../shared/cache/CacheManager';

static async getExpensiveData(id: string) {
  const cacheKey = `my-data:${id}`;
  const cached = cacheManager.get<MyType>(cacheKey);
  if (cached) return cached;

  const data = await this.performExpensiveQuery(id);
  cacheManager.set(cacheKey, data, 15 * 60 * 1000, ['my-data', `my-data:${id}`]);
  return data;
}

// Don't forget cache invalidation!
static async updateData(id: string, updates: any) {
  const result = await this.update(id, updates);
  cacheManager.invalidateByTag(`my-data:${id}`);
  return result;
}
```

---

### 3. Fix Pagination Counts (2 hours) - DATA CORRECTNESS

**Pattern:** Add `distinct: true` to all `findAndCountAll` with `include`

#### All Services with Pagination + Joins
- [ ] dashboardService.ts - Line 335 (5 min)
- [ ] medicationService.ts - Line 254 (5 min)
- [ ] reportService.ts - Multiple methods (15 min)
- [ ] appointmentService.ts - getPaginated (5 min)
- [ ] healthRecordService.ts - getPaginated (5 min)
- [ ] incidentReportService.ts - getPaginated (5 min)
- [ ] studentService.ts - Some methods (10 min)
- [ ] purchaseOrderService.ts - getPaginated (5 min)
- [ ] communicationService.ts - getPaginated (5 min)
- [ ] documentService.ts - getPaginated (5 min)
- [ ] auditService.ts - getPaginated (5 min)
- [ ] complianceService.ts - getPaginated (5 min)
- [ ] 11+ additional services (45 min)

**Apply Pattern:**
```typescript
const { rows, count } = await Model.findAndCountAll({
  where: {...},
  include: [{ model: RelatedModel }],
  offset,
  limit,
  distinct: true // ✅ ADD THIS LINE
});
```

---

### 4. Select Optimization (5-6 hours) - BANDWIDTH REDUCTION

**Pattern:** Add `attributes` arrays to every `include`

#### High-Traffic Services (3 hours)
- [ ] studentService.ts - 15+ includes (30 min)
- [ ] medicationService.ts - 12+ includes (25 min)
- [ ] healthRecordService.ts - 10+ includes (20 min)
- [ ] appointmentService.ts - 8+ includes (15 min)
- [ ] reportService.ts - 10+ includes (20 min)
- [ ] dashboardService.ts - 8+ includes (15 min)
- [ ] purchaseOrderService.ts - 7+ includes (15 min)
- [ ] incidentReportService.ts - 6+ includes (10 min)
- [ ] vendorService.ts - 5+ includes (10 min)
- [ ] inventoryService.ts - 5+ includes (10 min)

#### Remaining Services (2-3 hours)
- [ ] 40+ services with 3-5 includes each (2-3 hours)

**Apply Pattern:**
```typescript
// BEFORE - loads ALL fields
include: [
  {
    model: RelatedModel,
    as: 'related'
  }
]

// AFTER - loads only needed fields
include: [
  {
    model: RelatedModel,
    as: 'related',
    attributes: ['id', 'name', 'field1', 'field2'] // ✅ ADD THIS
  }
]
```

**Expected Impact:** 30-40% reduction in data transfer

---

### 5. Transaction Cleanup (2-3 hours) - STABILITY

**Pattern:** Add proper rollback before early throws

#### Services with Transaction Issues
- [ ] healthRecordService.ts - 3 methods (20 min)
- [ ] medicationService.ts - 2 methods (15 min)
- [ ] appointmentService.ts - 2 methods (15 min)
- [ ] purchaseOrderService.ts - 2 methods (15 min)
- [ ] incidentReportService.ts - 1 method (10 min)
- [ ] vendorService.ts - 1 method (10 min)
- [ ] documentService.ts - 1 method (10 min)
- [ ] complianceService.ts - 1 method (10 min)
- [ ] auditService.ts - 1 method (10 min)
- [ ] communicationService.ts - 1 method (10 min)
- [ ] 4+ additional services (40 min)

**Apply Pattern:**
```typescript
static async deleteRecord(id: string) {
  const transaction = await sequelize.transaction();
  try {
    const record = await Model.findByPk(id, { transaction });

    if (!record) {
      await transaction.rollback(); // ✅ ADD THIS
      throw new Error('Not found');
    }

    await record.destroy({ transaction });
    await transaction.commit();
    return { success: true };

  } catch (error) {
    // ✅ ADD FINISHED CHECK
    if (transaction && !(transaction as any).finished) {
      await transaction.rollback();
    }
    throw error;
  }
}
```

---

## Execution Strategy

### Day 1 (8 hours)
**Morning (4 hours):**
- Fix 10 highest-traffic N+1 patterns
- Add caching to 5 most expensive operations

**Afternoon (4 hours):**
- Fix distinct: true in 15 services
- Transaction cleanup in 7 services

**Expected Impact:** 60% of total improvement

### Day 2 (8 hours)
**Morning (4 hours):**
- Select optimization in top 15 services
- Add caching to 10 more services

**Afternoon (4 hours):**
- Fix remaining 20 N+1 patterns
- Transaction cleanup in remaining 7 services

**Expected Impact:** 90% of total improvement

### Day 3 (2-6 hours)
**Polish:**
- Select optimization in remaining 30+ services
- Add caching to final 5 services
- Fix distinct: true in remaining 8 services
- Testing and validation

**Expected Impact:** Final 10% + quality assurance

---

## Testing Checklist

After each batch of changes:

- [ ] Run integration tests
- [ ] Verify response shapes unchanged
- [ ] Check query counts reduced (log before/after)
- [ ] Monitor cache hit rates
- [ ] Test pagination counts accurate
- [ ] Verify no connection leaks
- [ ] Load test with 100+ concurrent users

---

## Monitoring During Sprint 2

### Query Count Tracking
```typescript
// Add to middleware or logger
const queryCountBefore = 15; // Log this
// ... perform operation ...
const queryCountAfter = 3; // Log this
logger.info(`Query reduction: ${queryCountBefore} → ${queryCountAfter}`);
```

### Cache Hit Rate
```typescript
const stats = cacheManager.getStats();
logger.info(`Cache hit rate: ${stats.hitRate}%`);
// Target: >70% by end of Sprint 2
```

### Connection Pool
```sql
SELECT state, COUNT(*) FROM pg_stat_activity
WHERE datname = current_database() GROUP BY state;
-- Target: <40% usage
```

---

## Expected Results After Sprint 2

| Metric | Current | After Sprint 2 | Total Improvement |
|--------|---------|----------------|-------------------|
| **N+1 Queries Fixed** | 5/47 (11%) | 47/47 (100%) | ✅ Zero remaining |
| **Services Cached** | 2/22 (9%) | 22/22 (100%) | ✅ All high-traffic |
| **Pagination Fixed** | 0/23 (0%) | 23/23 (100%) | ✅ All accurate |
| **Includes Optimized** | 0/100+ (0%) | 100/100+ (100%) | ✅ All optimized |
| **Transactions Fixed** | 1/15 (7%) | 15/15 (100%) | ✅ Zero leaks |
| **Cache Hit Rate** | 65% | 75-80% | +15% |
| **Query Reduction** | 80-87% | 85-92% | +5-7% |
| **Response Time** | 76% faster | 85-90% faster | +9-14% |
| **Performance Grade** | B+ (87%) | A- to A (93-98%) | +6-11% |

---

## Quick Reference: File Locations

### Templates & Guides
- `backend/src/services/FINAL_PERFORMANCE_REPORT.md` - Complete 45KB guide
- `backend/src/services/PERFORMANCE_EXECUTIVE_SUMMARY.md` - Quick overview
- `backend/src/services/SPRINT_2_QUICK_REFERENCE.md` - This file

### Infrastructure
- `backend/src/shared/cache/CacheManager.ts` - Cache implementation
- `backend/src/database/config/sequelize.ts` - Pool & timeouts

### Examples of Fixed Patterns
- `backend/src/services/studentService.ts` - N+1 fix + caching + transaction
- `backend/src/services/reportService.ts` - 3 N+1 fixes (Op.in + Map pattern)
- `backend/src/services/healthRecordService.ts` - N+1 fix + caching
- `backend/src/services/vendorService.ts` - Batch metrics calculation

---

**Start with highest impact items (N+1 queries), then caching, then everything else.**
**Track progress: Check off items as completed, log query reductions, monitor cache hit rates.**
**Goal: A- grade (93-95%) after 16-22 hours of systematic optimization.**

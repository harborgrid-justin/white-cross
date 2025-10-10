## Migration Plan: Legacy to SOA-Compliant Medication Architecture

### Executive Summary

This document outlines the migration strategy from the current monolithic `medicationsApi.ts` (483 lines, 20+ methods) to a modern, SOA-compliant, healthcare-focused architecture with separated domain services, React Query hooks, and comprehensive safety features.

**Migration Duration**: 5 weeks
**Risk Level**: Medium (healthcare-critical system)
**Rollback Strategy**: Feature flags + dual-mode operation

---

## Current Architecture Analysis

### Existing Implementation (`frontend/src/services/modules/medicationsApi.ts`)

**Problems Identified:**

1. **Monolithic Service**: Single class with 20+ methods covering all medication domains
2. **No Domain Separation**: Formulary, prescriptions, administration, inventory all mixed
3. **Inconsistent Caching**: React Query used inconsistently
4. **Missing Safety Features**:
   - No Five Rights verification
   - No barcode scanning
   - No offline support
   - No LASA warnings
5. **Limited Validation**: Basic Zod validation, no healthcare-specific checks
6. **No Audit Logging**: Missing compliance requirements
7. **PHI Risk**: No cleanup mechanisms on errors

### Current Dependencies

```typescript
// Components using medicationsApi
frontend/src/pages/Medications.tsx
frontend/src/hooks/useMedicationsData.ts
frontend/src/hooks/useMedicationAdministration.ts
frontend/src/components/medications/**/*.tsx
```

---

## New Architecture Overview

### Domain-Specific API Clients

```
medication/
├── api/
│   ├── MedicationFormularyApi.ts    (Formulary management)
│   ├── PrescriptionApi.ts            (Prescription CRUD)
│   ├── AdministrationApi.ts          (Administration workflow)
│   ├── InventoryApi.ts               (Stock management)
│   └── AdverseReactionApi.ts         (Safety reporting)
├── hooks/
│   ├── useMedicationFormulary.ts     (Formulary queries)
│   ├── usePrescriptions.ts           (Prescription management)
│   ├── useMedicationAdministration.ts (Admin workflow)
│   ├── useOfflineQueue.ts            (Offline support)
│   ├── useMedicationSafety.ts        (Safety checks)
│   └── useMedicationSession.ts       (Session management)
├── components/
│   ├── FiveRightsVerification/       (Five Rights workflow)
│   ├── BarcodeScanner/               (Barcode scanning)
│   ├── AllergyWarning/               (Allergy alerts)
│   └── MedicationErrorBoundary/      (Error handling)
└── utils/
    ├── doseCalculator.ts
    ├── barcodeParser.ts
    └── phiCleaner.ts
```

---

## Migration Phases

### Phase 1: Foundation Setup (Week 1)

**Goal**: Create new API clients without breaking existing code

**Tasks:**

1. **Create Domain API Clients** (Days 1-3)
   - [ ] Implement `MedicationFormularyApi.ts`
   - [ ] Implement `PrescriptionApi.ts`
   - [ ] Implement `AdministrationApi.ts`
   - [ ] Create comprehensive types
   - [ ] Add Zod validation schemas

2. **Unit Testing** (Days 4-5)
   - [ ] Test each API client method
   - [ ] Mock API responses
   - [ ] Validate error handling
   - [ ] Test validation schemas

3. **Deploy to Staging** (End of Week 1)
   - [ ] Deploy new services (unused)
   - [ ] Monitor for import errors
   - [ ] Run integration tests

**Success Criteria:**
- All API clients pass unit tests
- No breaking changes to existing code
- Staging deployment successful

---

### Phase 2: React Query Hook Migration (Week 2)

**Goal**: Create new hooks and test in parallel with old implementation

**Tasks:**

1. **Create Custom Hooks** (Days 1-3)
   - [ ] Implement `useMedicationFormulary.ts`
   - [ ] Implement `usePrescriptions.ts`
   - [ ] Implement `useMedicationAdministration.ts`
   - [ ] Configure caching strategies
   - [ ] Add query key factories

2. **Dual-Mode Testing** (Days 4-5)
   - [ ] Add feature flag: `ENABLE_NEW_MEDICATION_API`
   - [ ] Create adapter layer for backward compatibility
   - [ ] A/B test with small user group
   - [ ] Monitor error rates

3. **Performance Benchmarking**
   - [ ] Measure query response times
   - [ ] Monitor cache hit rates
   - [ ] Validate offline queue
   - [ ] Test concurrent users

**Success Criteria:**
- New hooks perform ≥ 20% better
- Cache hit rate > 80%
- Zero data loss in offline mode
- Error rate < 0.1%

---

### Phase 3: Component Updates (Week 3)

**Goal**: Update UI components to use new hooks

**Tasks:**

1. **Five Rights Verification** (Days 1-2)
   - [ ] Create `FiveRightsVerification` component
   - [ ] Implement barcode scanning
   - [ ] Add patient photo confirmation
   - [ ] Create LASA warnings
   - [ ] Add dose calculator

2. **Update Core Components** (Days 3-4)
   - [ ] Migrate `Medications.tsx` to new hooks
   - [ ] Update `MedicationsListTab.tsx`
   - [ ] Update `MedicationsInventoryTab.tsx`
   - [ ] Update `MedicationsRemindersTab.tsx`
   - [ ] Update `MedicationsAdverseReactionsTab.tsx`

3. **Error Boundary Implementation** (Day 5)
   - [ ] Create `MedicationErrorBoundary`
   - [ ] Implement PHI cleanup
   - [ ] Add fallback UI
   - [ ] Test error scenarios

**Success Criteria:**
- All components render correctly
- Five Rights verification passes
- Error boundary catches all errors
- PHI cleanup verified

---

### Phase 4: Safety Features (Week 4)

**Goal**: Implement healthcare safety features

**Tasks:**

1. **Offline Queue** (Days 1-2)
   - [ ] Implement IndexedDB queue
   - [ ] Create sync mechanism
   - [ ] Add visual indicators
   - [ ] Test offline scenarios

2. **Session Monitoring** (Day 3)
   - [ ] Implement 15-minute timeout
   - [ ] Add inactivity detection
   - [ ] Create warning modal
   - [ ] Test timeout scenarios

3. **Barcode Integration** (Day 4)
   - [ ] Integrate barcode library
   - [ ] Add camera permissions
   - [ ] Implement manual entry fallback
   - [ ] Test with actual barcodes

4. **Comprehensive E2E Testing** (Day 5)
   - [ ] Full administration workflow
   - [ ] Five Rights verification
   - [ ] Offline queue sync
   - [ ] Error scenarios
   - [ ] Session timeout

**Success Criteria:**
- Offline queue 99% reliable
- Session timeout works correctly
- Barcode scan success rate > 95%
- All E2E tests pass

---

### Phase 5: Cleanup & Go-Live (Week 5)

**Goal**: Remove old implementation and deploy to production

**Tasks:**

1. **Remove Old Code** (Days 1-2)
   - [ ] Delete `medicationsApi.ts` (old)
   - [ ] Remove old hooks
   - [ ] Update imports across codebase
   - [ ] Clean up unused types

2. **Documentation** (Day 3)
   - [ ] Update API documentation
   - [ ] Create user training materials
   - [ ] Document troubleshooting guide
   - [ ] Create runbook for support

3. **Production Deployment** (Day 4)
   - [ ] Deploy to production (20% rollout)
   - [ ] Monitor error rates
   - [ ] Gather user feedback
   - [ ] Increase to 100% if successful

4. **Post-Deployment** (Day 5)
   - [ ] Monitor performance
   - [ ] Address user feedback
   - [ ] Create incident response plan
   - [ ] Schedule retrospective

**Success Criteria:**
- Zero critical bugs
- User satisfaction > 90%
- Performance meets SLAs
- Compliance audit passes

---

## Feature Flag Strategy

### Environment Variables

```bash
# .env.development
VITE_ENABLE_NEW_MEDICATION_API=true
VITE_ENABLE_FIVE_RIGHTS=true
VITE_ENABLE_BARCODE_SCANNING=true
VITE_ENABLE_OFFLINE_QUEUE=true

# .env.production
VITE_ENABLE_NEW_MEDICATION_API=false  # Start with false
VITE_ENABLE_FIVE_RIGHTS=false
VITE_ENABLE_BARCODE_SCANNING=false
VITE_ENABLE_OFFLINE_QUEUE=false
```

### Feature Flag Implementation

```typescript
// src/config/features.ts
export const features = {
  useNewMedicationAPI: import.meta.env.VITE_ENABLE_NEW_MEDICATION_API === 'true',
  enableFiveRights: import.meta.env.VITE_ENABLE_FIVE_RIGHTS === 'true',
  enableBarcodeScanning: import.meta.env.VITE_ENABLE_BARCODE_SCANNING === 'true',
  enableOfflineQueue: import.meta.env.VITE_ENABLE_OFFLINE_QUEUE === 'true',
};

// Usage in components
import { features } from '@/config/features';

function MedicationAdministration() {
  const { recordAdministration } = features.useNewMedicationAPI
    ? useNewMedicationAdministration()  // New implementation
    : useOldMedicationAdministration(); // Old implementation

  // ...
}
```

---

## Rollback Strategy

### Triggers for Rollback

1. **Critical Bugs**:
   - Medication administration failures > 1%
   - Data loss detected
   - Security breach

2. **Performance Issues**:
   - Response time > 5 seconds
   - Cache miss rate > 50%
   - Database errors > 5%

3. **User Issues**:
   - User satisfaction < 70%
   - Support tickets > 50/day
   - Training issues

### Rollback Procedure

1. **Immediate** (< 5 minutes):
   ```bash
   # Set feature flags to false
   VITE_ENABLE_NEW_MEDICATION_API=false

   # Redeploy frontend
   npm run build
   npm run deploy
   ```

2. **Database Rollback** (if needed):
   ```sql
   -- Restore from backup
   -- Revert migrations
   ```

3. **Communication**:
   - Notify all nurses
   - Update status page
   - Inform stakeholders

---

## Testing Strategy

### Unit Tests

**API Clients:**
```typescript
describe('MedicationFormularyApi', () => {
  it('searches formulary with filters', async () => {
    const result = await formularyApi.searchFormulary('amoxicillin', {
      category: 'antibiotic',
      isActive: true,
    });
    expect(result.medications).toHaveLength(5);
  });

  it('throws error for invalid NDC', async () => {
    await expect(
      formularyApi.getMedicationByNDC('invalid')
    ).rejects.toThrow('Failed to fetch medication by NDC');
  });
});
```

**Custom Hooks:**
```typescript
describe('useMedicationAdministration', () => {
  it('enforces Five Rights verification', () => {
    const { verifyFiveRights } = renderHook(() => useMedicationAdministration());

    const result = verifyFiveRights({
      studentBarcode: 'wrong-barcode',
      // ... other data
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('PATIENT VERIFICATION FAILED');
  });
});
```

### Integration Tests

```typescript
describe('Medication Administration Flow', () => {
  it('completes full administration workflow', async () => {
    // 1. Init session
    const session = await initiateAdministration(prescriptionId);

    // 2. Scan patient barcode
    const patientScan = await scanBarcode(studentBarcode);
    expect(patientScan.valid).toBe(true);

    // 3. Scan medication barcode
    const medScan = await scanBarcode(medicationBarcode);
    expect(medScan.valid).toBe(true);

    // 4. Verify Five Rights
    const verification = await verifyFiveRights(fiveRightsData);
    expect(verification.valid).toBe(true);

    // 5. Record administration
    const log = await recordAdministration(administrationData);
    expect(log.status).toBe('administered');
  });
});
```

### E2E Tests (Cypress)

```typescript
describe('Medication Administration E2E', () => {
  it('prevents administration with wrong patient', () => {
    cy.login('nurse@school.edu');
    cy.visit('/medications/administer');

    // Select prescription
    cy.selectPrescription('John Doe - Amoxicillin');

    // Wrong barcode
    cy.scanBarcode('wrong-student-barcode');

    // Should show error
    cy.get('[data-testid="verification-error"]')
      .should('contain', 'PATIENT VERIFICATION FAILED');

    // Cannot proceed
    cy.get('[data-testid="complete-administration"]')
      .should('be.disabled');
  });

  it('queues administration when offline', () => {
    cy.login('nurse@school.edu');
    cy.visit('/medications/administer');

    // Complete Five Rights verification
    cy.completeFiveRightsVerification();

    // Go offline
    cy.goOffline();

    // Record administration
    cy.get('[data-testid="complete-administration"]').click();

    // Should show queued message
    cy.get('[data-testid="offline-queued"]')
      .should('contain', 'Queued for sync');

    // Check offline queue
    cy.get('[data-testid="offline-queue-count"]')
      .should('contain', '1');

    // Go online
    cy.goOnline();

    // Should auto-sync
    cy.get('[data-testid="sync-success"]', { timeout: 10000 })
      .should('be.visible');
  });
});
```

### Performance Tests

```typescript
describe('Performance Benchmarks', () => {
  it('loads formulary in < 500ms', async () => {
    const start = performance.now();
    await formularyApi.searchFormulary('test');
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(500);
  });

  it('caches formulary for 24 hours', async () => {
    // First call
    await formularyApi.searchFormulary('amoxicillin');

    // Second call (should hit cache)
    const start = performance.now();
    await formularyApi.searchFormulary('amoxicillin');
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(50); // Cache hit
  });
});
```

---

## Risk Mitigation

### High-Risk Areas

1. **Medication Administration**
   - **Risk**: Wrong medication given to patient
   - **Mitigation**:
     - Mandatory Five Rights verification
     - Server-side double-check
     - No optimistic updates
     - Barcode verification required

2. **Offline Queue**
   - **Risk**: Data loss when offline
   - **Mitigation**:
     - IndexedDB persistence
     - Automatic sync on reconnection
     - Visual indicators
     - Manual retry option

3. **PHI Exposure**
   - **Risk**: Patient data leaked on errors
   - **Mitigation**:
     - Error boundary with PHI cleanup
     - Sanitized error logging
     - Session timeout
     - Screen lock

### Monitoring & Alerts

**Key Metrics:**
- Administration success rate (target: > 99%)
- Five Rights verification pass rate (target: > 95%)
- Offline queue sync success (target: > 99%)
- Session timeout compliance (target: 100%)
- Barcode scan success (target: > 95%)

**Alerts:**
```typescript
// Alert on critical failures
if (administrationFailureRate > 0.01) {
  alertOps('CRITICAL: Medication administration failure rate exceeded 1%');
  triggerRollback();
}

// Alert on offline queue issues
if (offlineQueueSyncFailures > 10) {
  alertOps('WARNING: Multiple offline queue sync failures');
  notifyEngineering();
}
```

---

## Training Plan

### Nurse Training (2 hours)

**Module 1: Five Rights Verification (30 min)**
- Overview of Five Rights
- Barcode scanning workflow
- Patient photo verification
- Common errors and how to fix

**Module 2: Offline Mode (30 min)**
- Understanding offline queue
- Visual indicators
- Manual sync process
- What to do if sync fails

**Module 3: Safety Features (30 min)**
- Allergy warnings
- LASA medications
- Drug interactions
- Session timeout

**Module 4: Hands-On Practice (30 min)**
- Simulated administrations
- Error scenarios
- Offline practice
- Q&A

### Administrator Training (1 hour)

**Module 1: System Overview (20 min)**
- Architecture changes
- Performance improvements
- New features

**Module 2: Monitoring (20 min)**
- Dashboard metrics
- Alert thresholds
- Troubleshooting

**Module 3: Rollback Procedure (20 min)**
- When to rollback
- How to execute
- Post-rollback steps

---

## Success Metrics

### Week 1 (Foundation)
- [ ] All API clients implemented
- [ ] 100% unit test coverage
- [ ] Staging deployment successful

### Week 2 (Hooks)
- [ ] All custom hooks created
- [ ] Performance benchmarks met
- [ ] A/B testing complete

### Week 3 (Components)
- [ ] All components migrated
- [ ] Five Rights verification working
- [ ] Error boundary tested

### Week 4 (Safety)
- [ ] Offline queue reliable
- [ ] Barcode scanning > 95% success
- [ ] E2E tests passing

### Week 5 (Production)
- [ ] Old code removed
- [ ] Production deployment successful
- [ ] User satisfaction > 90%
- [ ] Zero critical bugs

---

## Post-Migration Monitoring

### First 24 Hours
- Monitor every administration
- Review all error logs
- User feedback collection
- Performance metrics

### First Week
- Daily error review
- User satisfaction surveys
- Performance analysis
- Incident reports

### First Month
- Weekly retrospectives
- Feature enhancement planning
- Training adjustments
- Documentation updates

---

## Appendix A: API Mapping

| Old Method | New API Client | New Hook |
|-----------|---------------|----------|
| `medicationsApi.getAll()` | `formularyApi.searchFormulary()` | `useMedicationFormulary()` |
| `medicationsApi.getById()` | `formularyApi.getMedicationById()` | `useMedicationFormulary()` |
| `medicationsApi.create()` | `formularyApi.createMedication()` | `useMedicationFormulary()` |
| `medicationsApi.assignToStudent()` | `prescriptionApi.createPrescription()` | `usePrescriptions()` |
| `medicationsApi.getStudentMedications()` | `prescriptionApi.getStudentPrescriptions()` | `usePrescriptions()` |
| `medicationsApi.logAdministration()` | `administrationApi.recordAdministration()` | `useMedicationAdministration()` |
| `medicationsApi.getReminders()` | `administrationApi.getUpcomingReminders()` | `useMedicationAdministration()` |
| `medicationsApi.reportAdverseReaction()` | `adverseReactionApi.reportReaction()` | `useAdverseReactions()` |

---

## Appendix B: Breaking Changes

### Removed Features
- None (all features preserved or enhanced)

### Changed Interfaces
```typescript
// OLD
interface LogAdministrationRequest {
  studentMedicationId: string;
  scheduledTime: string;
  dosage: string;
  status: 'administered' | 'missed' | 'refused' | 'held';
  notes?: string;
}

// NEW (enhanced with Five Rights)
interface AdministrationRecord {
  sessionId: string;
  prescriptionId: string;
  studentId: string;
  medicationId: string;
  dosageAdministered: string;
  route: AdministrationRoute;
  administeredAt: string;
  administeredBy: string;
  fiveRightsData: FiveRightsData;  // NEW
  witnessId?: string;
  witnessSignature?: string;
  notes?: string;
}
```

### Migration Helpers
```typescript
// Adapter for backward compatibility
function adaptOldToNew(oldRequest: LogAdministrationRequest): AdministrationRecord {
  return {
    sessionId: generateSessionId(),
    prescriptionId: oldRequest.studentMedicationId,
    // ... map other fields
    fiveRightsData: {
      // Auto-fill with defaults (require manual verification later)
      studentBarcode: '',
      patientPhotoConfirmed: false,
      // ...
    },
  };
}
```

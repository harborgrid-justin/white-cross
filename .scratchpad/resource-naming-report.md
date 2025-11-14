# REST Resource Naming Standardization Report

**Date:** 2025-11-14
**Project:** White Cross Healthcare API
**Agent:** NestJS Controllers Architect (R3S0RC)
**Audit References:** `.scratchpad/api-audit.md`, `.scratchpad/controllers-audit.md`

---

## Executive Summary

This report documents all required changes to standardize REST resource naming conventions across 100+ NestJS controllers. The standardization addresses two major violation categories:

1. **Singular vs. Plural Resource Names** - 9 controllers using singular nouns
2. **Action-Based vs. Resource-Based Endpoints** - 15+ endpoints using action verbs

**Impact:** These changes are **BREAKING** and require API consumer updates.

**Timeline:** Estimated 3-4 days for implementation, testing, and documentation.

---

## Category 1: Singular to Plural Controller Names

### Issue
REST convention dictates collection endpoints use **plural nouns**, not singular. Currently 9 controllers violate this principle.

### Changes Required

#### 1.1 Incident Reports Controller
**Current:**
```typescript
@Controller('incident-report')  // ❌ Singular
@ApiTags('incident-report')
```

**New:**
```typescript
@Controller('incident-reports')  // ✅ Plural
@ApiTags('Incident Reports')
```

**File:** `backend/src/incident-report/incident-report.controller.ts`
**Lines:** 30-31
**Note:** This creates inconsistency - other incident controllers already use `incident-reports` plural

**Routes Changed:**
- `GET /incident-report` → `GET /incident-reports`
- `POST /incident-report` → `POST /incident-reports`
- `GET /incident-report/:id` → `GET /incident-reports/:id`
- `PATCH /incident-report/:id` → `PATCH /incident-reports/:id`
- `DELETE /incident-report/:id` → `DELETE /incident-reports/:id`

---

#### 1.2 Health Records Controller
**Current:**
```typescript
@Controller('health-record')  // ❌ Singular
@ApiTags('health-record-crud')
```

**New:**
```typescript
@Controller('health-records')  // ✅ Plural
@ApiTags('Health Records')
```

**Files:**
- `backend/src/health-record/controllers/health-record-crud.controller.ts` (Line 60)
- `backend/src/health-record/controllers/health-record-compliance.controller.ts` (Line 36)

**Note:** Some sub-controllers already use plural: `health-records/screenings`, `health-records/allergies`

**Routes Changed:**
- `GET /health-record` → `GET /health-records`
- `POST /health-record` → `POST /health-records`
- `GET /health-record/:id` → `GET /health-records/:id`
- `GET /health-record/student/:studentId` → `GET /health-records/student/:studentId`
- `PATCH /health-record/:id` → `PATCH /health-records/:id`
- `DELETE /health-record/:id` → `DELETE /health-records/:id`

---

#### 1.3 Health Domains Controller
**Current:**
```typescript
@Controller('health-domain')  // ❌ Singular
@ApiTags('health-domain')
```

**New:**
```typescript
@Controller('health-domains')  // ✅ Plural
@ApiTags('Health Domains')
```

**File:** `backend/src/health-domain/health-domain.controller.ts` (Line 33)

**Routes Changed:**
- `POST /health-domain/records` → `POST /health-domains/records`
- `GET /health-domain/records/:id` → `GET /health-domains/records/:id`
- `PUT /health-domain/records/:id` → `PUT /health-domains/records/:id`
- `DELETE /health-domain/records/:id` → `DELETE /health-domains/records/:id`
- `POST /health-domain/allergies` → `POST /health-domains/allergies`
- `GET /health-domain/allergies` → `GET /health-domains/allergies`
- All other nested routes under `/health-domain/*`

---

#### 1.4 Emergency Broadcasts Controller
**Current:**
```typescript
@Controller('emergency-broadcast')  // ❌ Singular
```

**New:**
```typescript
@Controller('emergency-broadcasts')  // ✅ Plural
@ApiTags('Emergency Broadcasts')
```

**File:** `backend/src/services/communication/emergency-broadcast/emergency-broadcast.controller.ts` (Line 35)

**Routes Changed:**
- `POST /emergency-broadcast` → `POST /emergency-broadcasts`
- `GET /emergency-broadcast` → `GET /emergency-broadcasts`
- `GET /emergency-broadcast/:id` → `GET /emergency-broadcasts/:id`
- `PATCH /emergency-broadcast/:id` → `PATCH /emergency-broadcasts/:id`
- `DELETE /emergency-broadcast/:id` → `DELETE /emergency-broadcasts/:id`

---

#### 1.5 Emergency Contacts Controller
**Current:**
```typescript
@Controller('emergency-contact')  // ❌ Singular
```

**New:**
```typescript
@Controller('emergency-contacts')  // ✅ Plural
@ApiTags('Emergency Contacts')
```

**File:** `backend/src/services/communication/emergency-contact/emergency-contact.controller.ts` (Line 39)

**Routes Changed:**
- `POST /emergency-contact` → `POST /emergency-contacts`
- `GET /emergency-contact` → `GET /emergency-contacts`
- `GET /emergency-contact/:id` → `GET /emergency-contacts/:id`
- `PATCH /emergency-contact/:id` → `PATCH /emergency-contacts/:id`
- `DELETE /emergency-contact/:id` → `DELETE /emergency-contacts/:id`

---

#### 1.6 Academic Transcripts Controller
**Current:**
```typescript
@Controller('academic-transcript')  // ❌ Singular
```

**New:**
```typescript
@Controller('academic-transcripts')  // ✅ Plural
@ApiTags('Academic Transcripts')
```

**File:** `backend/src/services/academic-transcript/academic-transcript.controller.ts` (Line 27)

**Routes Changed:**
- `POST /academic-transcript` → `POST /academic-transcripts`
- `GET /academic-transcript/:id` → `GET /academic-transcripts/:id`
- `GET /academic-transcript/student/:studentId` → `GET /academic-transcripts/student/:studentId`

---

#### 1.7 Health Risk Assessments Controller
**Current:**
```typescript
@Controller('health-risk-assessment')  // ❌ Singular
```

**New:**
```typescript
@Controller('health-risk-assessments')  // ✅ Plural
@ApiTags('Health Risk Assessments')
```

**File:** `backend/src/health-risk-assessment/health-risk-assessment.controller.ts` (Line 23)

**Routes Changed:**
- `POST /health-risk-assessment` → `POST /health-risk-assessments`
- `GET /health-risk-assessment` → `GET /health-risk-assessments`
- `GET /health-risk-assessment/:id` → `GET /health-risk-assessments/:id`

---

#### 1.8 Medication Interactions Controller
**Current:**
```typescript
@Controller('medication-interaction')  // ❌ Singular
```

**New:**
```typescript
@Controller('medication-interactions')  // ✅ Plural
@ApiTags('Medication Interactions')
```

**File:** `backend/src/medication-interaction/medication-interaction.controller.ts` (Line 15)

**Routes Changed:**
- `POST /medication-interaction/check` → `POST /medication-interactions/check`
- `GET /medication-interaction` → `GET /medication-interactions`

---

#### 1.9 Allergies Controller
**Current:**
```typescript
@Controller('allergy')  // ❌ Singular
@ApiTags('Allergies')  // ✅ Tag is already plural!
```

**New:**
```typescript
@Controller('allergies')  // ✅ Plural
@ApiTags('Allergies')
```

**File:** `backend/src/services/allergy/allergy.controller.ts` (Line 38)
**Note:** Swagger tag is already plural, only controller route needs change

**Routes Changed:**
- `POST /allergy` → `POST /allergies`
- `GET /allergy` → `GET /allergies`
- `GET /allergy/:id` → `GET /allergies/:id`
- `GET /allergy/student/:studentId` → `GET /allergies/student/:studentId`
- `PATCH /allergy/:id` → `PATCH /allergies/:id`
- `DELETE /allergy/:id` → `DELETE /allergies/:id`

**Conflict:** Note that `health-records/allergies` already exists - consider consolidation

---

## Category 2: Action-Based to Resource-Based Endpoints

### Issue
REST APIs should use **resource nouns** with HTTP verbs, not **action verbs** in URLs.

### Changes Required

#### 2.1 Follow-Up Notes Endpoints

**Current (Action-Based):**
```typescript
@Post(':id/follow-up-notes')  // ❌ Action verb "follow-up-notes"
async addFollowUpNotes(
  @Param('id', ParseUUIDPipe) id: string,
  @Body('notes') notes: string,
  @Body('completedBy') completedBy: string,
)
```

**New (Resource-Based):**
```typescript
@Post(':id/notes')  // ✅ Resource noun, POST implies creation
// OR better:
@Post('incident-reports/:id/follow-ups')  // ✅ Nested resource
async createFollowUp(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() createFollowUpDto: CreateFollowUpDto,
)
```

**Files:**
- `backend/src/incident-report/controllers/incident-status.controller.ts` (Line 37)
- `backend/src/incident-report/incident-report.controller.ts` (Line 324)

**Routes Changed:**
- `POST /incident-reports/:id/follow-up-notes` → `POST /incident-reports/:id/follow-ups`

**HTTP Method:** POST is correct (creating a resource)

---

#### 2.2 Parent Notification Endpoints

**Current (Action-Based):**
```typescript
@Post(':id/parent-notified')  // ❌ Action verb "parent-notified"
async markParentNotified(@Param('id', ParseUUIDPipe) id: string)
```

**New (Resource-Based - Option 1: PATCH):**
```typescript
@Patch(':id')  // ✅ Update incident resource
async updateIncident(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() updateDto: { parentNotified: true, notifiedAt: Date, notifiedBy: string }
)
```

**New (Resource-Based - Option 2: POST):**
```typescript
@Post(':id/notifications')  // ✅ Create notification resource
async createNotification(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() createNotificationDto: CreateNotificationDto
)
```

**Files:**
- `backend/src/incident-report/controllers/incident-status.controller.ts` (Line 58)
- `backend/src/incident-report/incident-report.controller.ts` (Line 339)

**Recommendation:** Use **Option 2 (POST notifications)** to maintain audit trail

**Routes Changed:**
- `POST /incident-reports/:id/parent-notified` → `POST /incident-reports/:id/notifications`

**HTTP Method Change:** POST → POST (remains same, but conceptually different - creating notification vs. marking notified)

---

#### 2.3 Change Password Endpoints

**Current (Action-Based):**
```typescript
@Post('change-password')  // ❌ Action verb
@Post(':id/change-password')  // ❌ Action verb
async changePassword(@Body() dto: ChangePasswordDto)
```

**New (Resource-Based):**
```typescript
@Patch('me/password')  // ✅ Update password resource (current user)
@Patch(':id/password')  // ✅ Update password resource (specific user)
async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto)
```

**Files:**
- `backend/src/services/auth/auth.controller.ts` (Line 168)
- `backend/src/services/user/user.controller.ts` (Line 190)

**Routes Changed:**
- `POST /auth/change-password` → `PATCH /auth/me/password`
- `POST /users/:id/change-password` → `PATCH /users/:id/password`

**HTTP Method Change:** POST → PATCH (updating existing resource, not creating new)

**Breaking Change:** HTTP method changed from POST to PATCH

---

#### 2.4 Mark Prescription Picked Up

**Current (Action-Based):**
```typescript
@Patch(':id/mark-picked-up')  // ❌ Action verb
async markPickedUp(@Param('id') id: string)
```

**New (Resource-Based):**
```typescript
@Patch(':id')  // ✅ Update prescription resource
async updatePrescription(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() updateDto: { status: 'PICKED_UP', pickedUpAt: Date, pickedUpBy: string }
)
```

**File:** `backend/src/services/clinical/controllers/prescription.controller.ts` (Line 103)

**Routes Changed:**
- `PATCH /clinical/prescriptions/:id/mark-picked-up` → `PATCH /clinical/prescriptions/:id`

**HTTP Method:** PATCH is correct (remains same)

**Note:** Generic `PATCH :id` already exists - consolidate into single endpoint with flexible DTO

---

#### 2.5 Verify Barcode Endpoints

**Current (Action-Based):**
```typescript
@Post('verify-barcode')  // ❌ Action verb
async verifyBarcode(@Body() dto: VerifyBarcodeDto)
```

**New (Resource-Based - Option 1):**
```typescript
@Post('barcode-verifications')  // ✅ Create verification resource
async createBarcodeVerification(@Body() dto: CreateBarcodeVerificationDto)
```

**New (Resource-Based - Option 2):**
```typescript
@Post('scans')  // ✅ Create scan resource
async createScan(@Body() createScanDto: CreateScanDto)
```

**File:** `backend/src/services/student/controllers/student-barcode.controller.ts` (Line 79)

**Recommendation:** Use **Option 1** for clarity

**Routes Changed:**
- `POST /students/verify-barcode` → `POST /students/barcode-verifications`

**HTTP Method:** POST is correct (creating verification record)

---

#### 2.6 Verify Medication Administration

**Current (Action-Based):**
```typescript
@Post('barcode/verify-medication')  // ❌ Action verb
async verifyMedication(@Body() dto: VerifyMedicationAdministrationDto)
```

**New (Resource-Based):**
```typescript
@Post('medication-verifications')  // ✅ Create verification resource
async createMedicationVerification(@Body() dto: CreateMedicationVerificationDto)
```

**File:** `backend/src/advanced-features/advanced-features.controller.ts` (Line 266)

**Routes Changed:**
- `POST /advanced-features/barcode/verify-medication` → `POST /advanced-features/medication-verifications`

---

#### 2.7 Verify Email (Authentication)

**Current (Action-Based):**
```typescript
@Post('verify-email')  // ❌ Action verb
@Get('verify-reset-token')  // ❌ Action verb
```

**New (Resource-Based):**
```typescript
@Post('email-verifications')  // ✅ Create verification
@Get('reset-tokens/:token')  // ✅ Get token resource
```

**File:** `backend/src/services/auth/auth.controller.ts` (Lines 533, 553)

**Routes Changed:**
- `POST /auth/verify-email` → `POST /auth/email-verifications`
- `GET /auth/verify-reset-token?token=xxx` → `GET /auth/reset-tokens/:token`

---

## Category 3: HTTP Method Corrections

### Issue
Some endpoints use incorrect HTTP methods for their operations.

### Changes Required

#### 3.1 DELETE Should Return 204 No Content

**Current:**
```typescript
@Delete('follow-up-action/:actionId')
@HttpCode(HttpStatus.OK)  // ❌ Should be 204
@ApiResponse({ status: 200 })  // ❌ Should be 204
```

**New:**
```typescript
@Delete('follow-up-action/:actionId')
@HttpCode(HttpStatus.NO_CONTENT)  // ✅ 204 No Content
@ApiResponse({ status: 204, description: 'Deleted successfully' })
async deleteFollowUpAction(...): Promise<void>  // ✅ Return void
```

**Affected Files:**
- Multiple controllers with DELETE operations returning 200

**Pattern:** All DELETE operations should return 204 when no response body is needed

---

#### 3.2 POST Create Should Return 201 Created

**Current:**
```typescript
@Post()
// No @HttpCode decorator - defaults to 200 ❌
async create(@Body() dto: CreateDto)
```

**New:**
```typescript
@Post()
@HttpCode(HttpStatus.CREATED)  // ✅ Explicit 201
async create(@Body() dto: CreateDto)
```

**Affected Files:**
- Multiple controllers missing explicit 201 status

---

## Summary of All Route Changes

### Breaking Changes Count
- **Controller Name Changes:** 9 controllers
- **Endpoint Path Changes:** 15+ endpoints
- **HTTP Method Changes:** 3 endpoints (POST → PATCH for password changes)

### Complete Route Migration Table

| Old Route | New Route | HTTP Method Change | File |
|-----------|-----------|-------------------|------|
| `POST /incident-report` | `POST /incident-reports` | No change | incident-report.controller.ts |
| `POST /incident-reports/:id/follow-up-notes` | `POST /incident-reports/:id/follow-ups` | No change | incident-status.controller.ts |
| `POST /incident-reports/:id/parent-notified` | `POST /incident-reports/:id/notifications` | No change | incident-status.controller.ts |
| `GET /health-record` | `GET /health-records` | No change | health-record-crud.controller.ts |
| `POST /health-domain/*` | `POST /health-domains/*` | No change | health-domain.controller.ts |
| `POST /emergency-broadcast` | `POST /emergency-broadcasts` | No change | emergency-broadcast.controller.ts |
| `POST /emergency-contact` | `POST /emergency-contacts` | No change | emergency-contact.controller.ts |
| `POST /academic-transcript` | `POST /academic-transcripts` | No change | academic-transcript.controller.ts |
| `POST /health-risk-assessment` | `POST /health-risk-assessments` | No change | health-risk-assessment.controller.ts |
| `POST /medication-interaction/check` | `POST /medication-interactions/check` | No change | medication-interaction.controller.ts |
| `POST /allergy` | `POST /allergies` | No change | allergy.controller.ts |
| `POST /auth/change-password` | `PATCH /auth/me/password` | **POST → PATCH** | auth.controller.ts |
| `POST /users/:id/change-password` | `PATCH /users/:id/password` | **POST → PATCH** | user.controller.ts |
| `PATCH /:id/mark-picked-up` | `PATCH /:id` | No change | prescription.controller.ts |
| `POST /students/verify-barcode` | `POST /students/barcode-verifications` | No change | student-barcode.controller.ts |
| `POST /advanced-features/barcode/verify-medication` | `POST /advanced-features/medication-verifications` | No change | advanced-features.controller.ts |
| `POST /auth/verify-email` | `POST /auth/email-verifications` | No change | auth.controller.ts |
| `GET /auth/verify-reset-token` | `GET /auth/reset-tokens/:token` | **Query → Path param** | auth.controller.ts |

---

## API Consumer Migration Guide

### For Frontend/Mobile Applications

#### Step 1: Update Base URLs (All Applications)

Replace all occurrences of singular resource names with plural:

```javascript
// Before
const response = await api.get('/incident-report');
const response = await api.post('/health-record', data);
const response = await api.get('/allergy/student/123');

// After
const response = await api.get('/incident-reports');
const response = await api.post('/health-records', data);
const response = await api.get('/allergies/student/123');
```

#### Step 2: Update Action-Based Endpoints

```javascript
// Before
await api.post(`/incident-reports/${id}/follow-up-notes`, { notes, completedBy });
await api.post(`/incident-reports/${id}/parent-notified`, { method, notifiedBy });

// After
await api.post(`/incident-reports/${id}/follow-ups`, { notes, completedBy });
await api.post(`/incident-reports/${id}/notifications`, { method, notifiedBy, type: 'PARENT' });
```

#### Step 3: Update HTTP Methods for Password Changes

```javascript
// Before
await api.post('/auth/change-password', { currentPassword, newPassword });
await api.post(`/users/${userId}/change-password`, { currentPassword, newPassword });

// After - HTTP method changed to PATCH
await api.patch('/auth/me/password', { currentPassword, newPassword });
await api.patch(`/users/${userId}/password`, { currentPassword, newPassword });
```

#### Step 4: Update Verification Endpoints

```javascript
// Before
await api.post('/students/verify-barcode', { barcode });
await api.post('/auth/verify-email', { token });
await api.get('/auth/verify-reset-token', { params: { token } });

// After
await api.post('/students/barcode-verifications', { barcode });
await api.post('/auth/email-verifications', { token });
await api.get(`/auth/reset-tokens/${token}`);
```

### For Third-Party Integrations

1. **Update OpenAPI/Swagger client generation** - regenerate clients after changes
2. **Update hardcoded URLs** - search for all singular resource names
3. **Update request libraries** - check method types (POST vs PATCH)
4. **Test error handling** - ensure 404 errors are caught for old routes

### Backward Compatibility Considerations

**Option 1: No Backward Compatibility (Recommended)**
- Clean break, force all consumers to update
- Clear deprecation timeline (e.g., 30 days notice)
- Provide migration guide and tooling

**Option 2: Route Aliases (Temporary)**
```typescript
// Add deprecated route aliases
@Controller('incident-report')  // Old (deprecated)
@Controller('incident-reports')  // New (canonical)
export class IncidentReportsController {
  // Single controller handles both routes temporarily
}
```

**Recommendation:** Use Option 1 with 30-day notice period and clear communication

---

## Swagger/OpenAPI Documentation Changes

### Tags Standardization

All controllers should use Title Case tags matching resource names:

```typescript
// Before
@ApiTags('incident-report')
@ApiTags('health-record-crud')
@ApiTags('health-domain')

// After
@ApiTags('Incident Reports')
@ApiTags('Health Records')
@ApiTags('Health Domains')
```

### Response Schema Updates

All DTOs referencing old resource names should be updated for consistency.

---

## Implementation Checklist

### Phase 1: Controller Route Changes (Day 1)
- [ ] Update `incident-report.controller.ts` → `incident-reports`
- [ ] Update `health-record-crud.controller.ts` → `health-records`
- [ ] Update `health-record-compliance.controller.ts` → `health-records`
- [ ] Update `health-domain.controller.ts` → `health-domains`
- [ ] Update `emergency-broadcast.controller.ts` → `emergency-broadcasts`
- [ ] Update `emergency-contact.controller.ts` → `emergency-contacts`
- [ ] Update `academic-transcript.controller.ts` → `academic-transcripts`
- [ ] Update `health-risk-assessment.controller.ts` → `health-risk-assessments`
- [ ] Update `medication-interaction.controller.ts` → `medication-interactions`
- [ ] Update `allergy.controller.ts` → `allergies`

### Phase 2: Action-Based Endpoint Refactoring (Day 2)
- [ ] Refactor `follow-up-notes` → `follow-ups` (2 files)
- [ ] Refactor `parent-notified` → `notifications` (2 files)
- [ ] Refactor `change-password` → `me/password` or `:id/password` (2 files)
- [ ] Refactor `mark-picked-up` → update `:id` (1 file)
- [ ] Refactor `verify-barcode` → `barcode-verifications` (1 file)
- [ ] Refactor `verify-medication` → `medication-verifications` (1 file)
- [ ] Refactor `verify-email` → `email-verifications` (1 file)
- [ ] Refactor `verify-reset-token` → `reset-tokens/:token` (1 file)

### Phase 3: HTTP Method Corrections (Day 2)
- [ ] Add `@HttpCode(HttpStatus.CREATED)` to all POST create operations
- [ ] Change DELETE operations to return 204 No Content
- [ ] Update `@ApiResponse` decorators with correct status codes

### Phase 4: Swagger Documentation (Day 3)
- [ ] Update all `@ApiTags` to Title Case
- [ ] Update `@ApiOperation` summaries for refactored endpoints
- [ ] Update `@ApiResponse` descriptions
- [ ] Verify Swagger UI displays correct routes

### Phase 5: Testing (Day 3)
- [ ] Update e2e tests with new routes
- [ ] Update integration tests
- [ ] Update unit tests
- [ ] Manual Swagger UI testing
- [ ] Postman collection updates

### Phase 6: Documentation (Day 4)
- [ ] Update README with new routes
- [ ] Create migration guide for API consumers
- [ ] Update CHANGELOG with breaking changes
- [ ] Notify all stakeholders

---

## Risk Assessment

### High Risk
- **Password change endpoints** - security-critical, method change (POST → PATCH)
- **Incident report routes** - heavily used across application
- **Health record routes** - core domain functionality

### Medium Risk
- **Notification endpoints** - affects automated notifications
- **Verification endpoints** - affects onboarding flows

### Low Risk
- **Allergy controller** - limited usage
- **Academic transcript** - limited usage

### Mitigation Strategies
1. **Staged rollout** - deploy to staging for 1 week
2. **Comprehensive testing** - full regression test suite
3. **Communication** - notify all teams 2 weeks in advance
4. **Monitoring** - watch 404 error rates post-deployment
5. **Rollback plan** - keep previous version ready for quick rollback

---

## Estimated Effort

### Development: 2 days
- Controller route changes: 4 hours
- Endpoint refactoring: 8 hours
- HTTP method fixes: 2 hours
- Swagger updates: 2 hours

### Testing: 1 day
- Unit test updates: 3 hours
- Integration test updates: 2 hours
- E2E test updates: 2 hours
- Manual testing: 1 hour

### Documentation: 0.5 days
- Migration guide: 2 hours
- CHANGELOG: 1 hour
- README updates: 1 hour

**Total: 3.5 days**

---

## Success Criteria

1. ✅ All controllers use plural resource names
2. ✅ Zero action-based endpoints (all resource-based)
3. ✅ Consistent HTTP method usage
4. ✅ All tests passing
5. ✅ Swagger documentation accurate
6. ✅ Zero breaking changes to consumers (with route aliases)
7. ✅ API consistency score improved by 60%

---

## References

- [REST API Best Practices](https://restfulapi.net/resource-naming/)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md)
- [Google API Design Guide](https://cloud.google.com/apis/design/resources)
- NestJS Controllers Documentation
- Internal audit: `.scratchpad/api-audit.md`
- Internal audit: `.scratchpad/controllers-audit.md`

---

**Report Completed By:** NestJS Controllers Architect
**Agent ID:** R3S0RC
**Date:** 2025-11-14

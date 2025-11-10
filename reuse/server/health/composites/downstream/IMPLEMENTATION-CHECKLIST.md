# Security Implementation Checklist

Use this checklist when adding security to each downstream composite file.

## File: `___________________________`

### [ ] Phase 1: Add Imports

```typescript
import {
  Injectable,
  Logger,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  RbacGuard,
  PhiAccessGuard,
  UserRole,
  PhiAccessType,
  AuditLoggingService,
  EncryptionService,
  AuditLoggingInterceptor,
  UserPayload,
} from '../shared';
import {
  Roles,
  RequirePhiAccess,
  CurrentUser,
  IpAddress,
  AccessReason,
} from '../shared/decorators/auth.decorators';
import { AuditLog } from '../shared/decorators/audit-log.decorator';
```

### [ ] Phase 2: Update Service Constructor

```typescript
constructor(
  private readonly auditService: AuditLoggingService,
  private readonly encryptionService: EncryptionService,
) {}
```

### [ ] Phase 3: Create/Update DTOs

- [ ] Create DTO files in `shared/dto/` if not exists
- [ ] Add validation decorators (@IsString, @IsNotEmpty, etc.)
- [ ] Add API documentation decorators (@ApiProperty)
- [ ] Replace all `any` types with proper DTOs

### [ ] Phase 4: Add Audit Logging to Service Methods

```typescript
async yourMethod(data: YourDto, user: UserPayload, ip: string) {
  // Add audit logging
  await this.auditService.logPhiAccess({
    userId: user.id,
    userRole: user.role,
    patientId: data.patientId,
    action: PhiAccessType.VIEW_MEDICAL_RECORDS, // Choose appropriate type
    resourceType: 'your_resource_type',
    resourceId: data.resourceId,
    accessReason: 'Reason for access',
    ipAddress: ip,
    outcome: 'success',
  });
  
  // Existing business logic
}
```

### [ ] Phase 5: Create Controller

```typescript
@Controller('api/v1/your-endpoint')
@ApiTags('Your Service Name')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard, PhiAccessGuard)
@UseInterceptors(AuditLoggingInterceptor)
export class YourController {
  constructor(private readonly yourService: YourService) {}

  @Post()
  @ApiOperation({ summary: 'Endpoint description' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Roles(UserRole.PHYSICIAN, UserRole.NURSE) // Choose appropriate roles
  @RequirePhiAccess(PhiAccessType.VIEW_MEDICAL_RECORDS) // Choose appropriate type
  async yourEndpoint(
    @Body() dto: YourDto,
    @CurrentUser() user: UserPayload,
    @IpAddress() ip: string,
    @AccessReason() reason: string,
  ) {
    return this.yourService.yourMethod(dto, user, ip);
  }
}
```

### [ ] Phase 6: Export Both Service and Controller

```typescript
// Export both service and controller
export { YourController };
export default YourService;
```

### [ ] Phase 7: Security Review

- [ ] All endpoints have authentication (@UseGuards(JwtAuthGuard))
- [ ] All endpoints have authorization (@Roles, @RequirePermissions)
- [ ] All PHI access has PHI guard (@RequirePhiAccess)
- [ ] All request bodies use validated DTOs
- [ ] All PHI access is logged with audit service
- [ ] Sensitive data is encrypted where needed
- [ ] Controlled substances have additional audit logging
- [ ] Break-glass access is enabled where appropriate

### [ ] Phase 8: Documentation

- [ ] JSDoc comments on all public methods
- [ ] API documentation with Swagger decorators
- [ ] Security requirements documented in comments
- [ ] Example usage in comments

### [ ] Phase 9: Testing (Manual Verification)

- [ ] Test with valid JWT token → Success
- [ ] Test without JWT token → 401 Unauthorized
- [ ] Test with wrong role → 403 Forbidden
- [ ] Test with invalid data → 400 Bad Request
- [ ] Verify audit logs created in console
- [ ] Test break-glass access if applicable

## Common Patterns

### Pattern: Read Patient Data

```typescript
@Get('patients/:id/data')
@Roles(UserRole.PHYSICIAN, UserRole.NURSE, UserRole.CARE_COORDINATOR)
@RequirePhiAccess(PhiAccessType.VIEW_MEDICAL_RECORDS)
@AllowBreakGlass() // If emergency access allowed
async getPatientData(
  @Param('id') patientId: string,
  @CurrentUser() user: UserPayload,
  @IpAddress() ip: string,
  @AccessReason() reason: string,
) {
  return this.service.getData(patientId, user, ip);
}
```

### Pattern: Write/Modify Patient Data

```typescript
@Post('patients/:id/data')
@Roles(UserRole.PHYSICIAN, UserRole.NURSE)
@RequirePhiAccess(PhiAccessType.EDIT_MEDICAL_RECORDS)
@AuditLog({
  eventType: AuditEventType.MEDICAL_RECORD_MODIFY,
  severity: AuditSeverity.HIGH,
  resourceType: 'medical_record',
})
async updatePatientData(
  @Param('id') patientId: string,
  @Body() dto: UpdateDataDto,
  @CurrentUser() user: UserPayload,
  @IpAddress() ip: string,
) {
  return this.service.updateData(patientId, dto, user, ip);
}
```

### Pattern: Prescribe Medication

```typescript
@Post('prescriptions')
@Roles(UserRole.PHYSICIAN, UserRole.NURSE)
@RequirePhiAccess(PhiAccessType.PRESCRIBE_MEDICATIONS)
@AuditMedication('prescribed')
async prescribe(
  @Body() dto: PrescriptionDto,
  @CurrentUser() user: UserPayload,
  @IpAddress() ip: string,
) {
  return this.service.prescribe(dto, user, ip);
}
```

### Pattern: View Lab Results

```typescript
@Get('patients/:id/labs')
@Roles(UserRole.PHYSICIAN, UserRole.NURSE, UserRole.LAB_TECH)
@RequirePhiAccess(PhiAccessType.VIEW_LAB_RESULTS)
async getLabResults(
  @Param('id') patientId: string,
  @CurrentUser() user: UserPayload,
  @IpAddress() ip: string,
  @AccessReason() reason: string,
) {
  return this.service.getLabResults(patientId, user, ip);
}
```

### Pattern: Administrative Reports (No PHI)

```typescript
@Get('reports/summary')
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
// No PHI access guard needed for de-identified data
async getSummaryReport(
  @Query() queryDto: ReportQueryDto,
  @CurrentUser() user: UserPayload,
) {
  return this.service.generateReport(queryDto);
}
```

## Role Selection Guide

| Role | Use When |
|------|----------|
| `PHYSICIAN` | Full clinical access, prescribing authority |
| `NURSE` | Patient care, medication administration |
| `PHARMACIST` | Medication management, prescriptions |
| `LAB_TECH` | Laboratory results and orders |
| `RADIOLOGIST` | Imaging orders and results |
| `BILLING` | Billing and insurance information |
| `CARE_COORDINATOR` | Care coordination, care plans |
| `ADMIN` | Administrative functions |
| `PATIENT` | Self-access to own records |

## PHI Access Type Guide

| Type | Use When |
|------|----------|
| `VIEW_BASIC` | Name, DOB, contact info |
| `VIEW_MEDICAL_RECORDS` | Full medical history access |
| `VIEW_LAB_RESULTS` | Laboratory test results |
| `VIEW_MEDICATIONS` | Medication lists |
| `VIEW_PRESCRIPTIONS` | Prescription history |
| `EDIT_MEDICAL_RECORDS` | Modifying medical records |
| `PRESCRIBE_MEDICATIONS` | Writing prescriptions |
| `VIEW_BILLING` | Billing information |
| `VIEW_INSURANCE` | Insurance information |
| `EMERGENCY_ACCESS` | Break-glass emergency access |

## Audit Event Type Guide

| Type | Use When |
|------|----------|
| `PHI_VIEW` | Viewing any PHI |
| `PHI_CREATE` | Creating new PHI records |
| `PHI_UPDATE` | Updating existing PHI |
| `MEDICAL_RECORD_MODIFY` | Modifying medical records |
| `MEDICATION_PRESCRIBED` | Prescribing medications |
| `MEDICATION_ADMINISTERED` | Administering medications |
| `CONTROLLED_SUBSTANCE_PRESCRIBED` | Prescribing controlled substances |
| `BREAK_GLASS_ACCESS` | Emergency break-glass access |
| `CDS_ALERT_TRIGGERED` | Clinical decision support alert |
| `CDS_ALERT_OVERRIDDEN` | Overriding CDS alert |

## Notes

- **Always** log PHI access in service methods
- **Never** log sensitive data (passwords, DEA numbers, SSNs) in regular logs
- **Always** use DTOs with validation decorators
- **Always** document security requirements in comments
- **Test** each endpoint after adding security
- **Review** audit logs to ensure logging is working

---

**Last Updated:** 2025-11-10
**Version:** 1.0.0

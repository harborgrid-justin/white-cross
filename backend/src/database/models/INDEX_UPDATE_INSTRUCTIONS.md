# Model Index Update Instructions

## Overview
This document explains how to update `index.ts` after creating new Sequelize models.

## Current Status
- **Created Models:** 9/44+ (20%)
- **Index File:** PREPARED with all associations mapped
- **Status:** WAITING for other agents to complete model creation

## Completed Work

The `index.ts` file has been **fully prepared** with:

1. ✅ **All model imports** - Structured by category with TODO comments
2. ✅ **All associations mapped** - Complete relationship definitions from Prisma schema
3. ✅ **CASCADE delete protection** - All Student-related PHI data protected
4. ✅ **Proper export structure** - Ready for activation as models are created
5. ✅ **Sequelize instance exported** - Available for use

## What Other Agents Need to Do

### Step 1: Create Model Files
Other agents are creating models in these directories:
- `backend/src/database/models/medications/` (3 models)
- `backend/src/database/models/inventory/` (8 models)
- `backend/src/database/models/healthcare/` (7+ models)
- `backend/src/database/models/incidents/` (2 models)
- `backend/src/database/models/compliance/` (6 models)
- `backend/src/database/models/security/` (8 models)
- `backend/src/database/models/communication/` (3 models)
- `backend/src/database/models/documents/` (3 models)
- `backend/src/database/models/integration/` (2 models)
- `backend/src/database/models/administration/` (7+ models)

### Step 2: Activate Imports and Exports
When a model file is created, uncomment the corresponding lines in `index.ts`:

**Example:** When creating `StudentMedication.ts`:

1. Uncomment the import:
```typescript
// Before:
// import { StudentMedication } from './medications/StudentMedication';

// After:
import { StudentMedication } from './medications/StudentMedication';
```

2. Uncomment the association:
```typescript
// Before:
// Student.hasMany(StudentMedication, {
//   foreignKey: 'studentId',
//   as: 'medications',
//   onDelete: 'CASCADE',
// });

// After:
Student.hasMany(StudentMedication, {
  foreignKey: 'studentId',
  as: 'medications',
  onDelete: 'CASCADE',
});
```

3. Uncomment the export:
```typescript
// Before:
// StudentMedication,

// After:
StudentMedication,
```

## Model Categories and Associations

### Medications (3 models)
- `StudentMedication` - Links students to medications
- `MedicationLog` - Tracks medication administration
- `MedicationInventory` - Manages medication stock

### Inventory (8 models)
- `InventoryItem` - Physical inventory items
- `InventoryTransaction` - Stock movements
- `MaintenanceLog` - Equipment maintenance
- `Vendor` - Supplier information
- `PurchaseOrder` - Purchase orders
- `PurchaseOrderItem` - PO line items
- `BudgetCategory` - Budget categories
- `BudgetTransaction` - Budget transactions

### Healthcare Extended (7+ models)
- `Allergy` - Student allergies
- `ChronicCondition` - Chronic health conditions
- `Vaccination` - Immunization records
- `Screening` - Health screenings
- `GrowthMeasurement` - Height/weight tracking
- `VitalSigns` - Vital sign measurements
- `NurseAvailability` - Nurse scheduling
- `AppointmentWaitlist` - Appointment waiting list
- `AppointmentReminder` - Appointment reminders

### Incidents Extended (2 models)
- `WitnessStatement` - Incident witness statements
- `FollowUpAction` - Incident follow-up actions

### Compliance (6 models)
- `ComplianceReport` - Compliance reports
- `ComplianceChecklistItem` - Compliance checklist items
- `ConsentForm` - Consent forms
- `ConsentSignature` - Consent signatures
- `PolicyDocument` - Policy documents
- `PolicyAcknowledgment` - Policy acknowledgments

### Security (8 models)
- `Role` - User roles
- `Permission` - System permissions
- `RolePermission` - Role-permission mapping
- `UserRoleAssignment` - User-role mapping
- `Session` - User sessions
- `LoginAttempt` - Login attempt tracking
- `SecurityIncident` - Security incidents
- `IpRestriction` - IP whitelist/blacklist

### Communication (3 models)
- `MessageTemplate` - Message templates
- `Message` - Messages
- `MessageDelivery` - Message delivery tracking

### Documents (3 models)
- `Document` - Document storage
- `DocumentSignature` - Document signatures
- `DocumentAuditTrail` - Document audit trail

### Integration (2 models)
- `IntegrationConfig` - Integration configurations
- `IntegrationLog` - Integration logs

### Administration Extended (7+ models)
- `SystemConfiguration` - System settings
- `ConfigurationHistory` - Configuration change history
- `BackupLog` - Backup logs
- `PerformanceMetric` - Performance metrics
- `License` - License management
- `TrainingModule` - Training modules
- `TrainingCompletion` - Training completions
- `AuditLog` - System audit log

## Important Notes

### CASCADE Delete Rules
All Student-related associations MUST include `onDelete: 'CASCADE'` for HIPAA compliance:
- EmergencyContacts
- StudentMedications
- HealthRecords
- Appointments
- IncidentReports
- Allergies
- ChronicConditions
- Vaccinations
- Screenings
- GrowthMeasurements
- VitalSigns
- AppointmentWaitlist

### Association Aliases
All associations use proper aliases matching the Prisma schema:
- `as: 'nurseManagedStudents'` - User → Students
- `as: 'emergencyContacts'` - Student → EmergencyContacts
- `as: 'healthRecords'` - Student → HealthRecords
- etc.

### Prisma Schema Reference
All associations reference their line numbers in the Prisma schema for traceability:
```typescript
// ============ USER ASSOCIATIONS (lines 22-40 in Prisma) ============
```

## Verification Checklist

After all models are created, verify:
- [ ] All 44+ model files exist
- [ ] All imports are uncommented
- [ ] All associations are uncommented
- [ ] All exports are uncommented
- [ ] No TypeScript errors
- [ ] setupAssociations() runs without errors
- [ ] All CASCADE deletes are in place for PHI data

## Testing the Index

Once all models are created and activated:

```bash
# From backend directory
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Test sequelize connection
node -e "require('./dist/database/models').sequelize.authenticate().then(() => console.log('✅ Sequelize connected')).catch(e => console.error('❌ Error:', e))"
```

## Contact
If you have questions about the index structure or associations, refer to:
- `backend/prisma/schema.prisma` - Source of truth for relationships
- `backend/src/database/models/index.ts` - Current implementation
- This document - Update instructions

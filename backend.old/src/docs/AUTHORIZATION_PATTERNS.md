# Authorization Patterns Guide
**White Cross Healthcare Platform - Backend Security**

## Overview

This guide provides comprehensive patterns for implementing authorization checks in service methods. All service methods that access, modify, or delete data MUST implement appropriate authorization checks.

## Core Principles

### 1. Defense in Depth
- Authorization checks at BOTH route level AND service level
- Never rely solely on route-level authorization
- Service methods should verify authorization independently

### 2. Principle of Least Privilege
- Users get minimum permissions necessary
- Default deny approach - explicitly grant access
- Role hierarchy: ADMIN > DOCTOR > NURSE > STAFF > PARENT/GUARDIAN > STUDENT

### 3. PHI Protection (HIPAA Compliance)
- All PHI access must be authorized and logged
- Healthcare providers and admins can access student PHI
- Parents can only access their own children's PHI
- Students can only access their own PHI

## Role Hierarchy

```
ADMIN (100)         - Full system access
  └── DOCTOR (80)   - Medical authority, prescribing
      └── NURSE (60) - Care delivery, medication administration
          └── STAFF (50) - General administrative tasks
              └── PARENT/GUARDIAN (30) - Child's information only
                  └── STUDENT (10) - Own information only
```

## Authorization Utility Functions

### Role-Based Authorization

```typescript
import {
  requireAdmin,
  requireRole,
  requireMinimumRole,
  requireStaff,
  requireHealthcareProvider,
  createAuthContext
} from '../utils/authorizationUtils';

// Require specific role
requireAdmin(context); // Admin only
requireHealthcareProvider(context); // Doctor or Nurse
requireStaff(context); // Doctor, Nurse, or Staff

// Require one of multiple roles
requireRole(context, [UserRole.DOCTOR, UserRole.NURSE], 'prescribe medication');

// Require minimum role level
requireMinimumRole(context, UserRole.NURSE, 'access health records');
```

### Resource Ownership Authorization

```typescript
import {
  requireOwnership,
  requireOwnershipOrAdmin,
  requireOwnershipOrStaff
} from '../utils/authorizationUtils';

// User must own the resource
requireOwnership(context, { ownerId: userId }, 'profile');

// User must own resource OR be admin
requireOwnershipOrAdmin(context, { ownerId: userId }, 'profile');

// User must own resource OR be staff
requireOwnershipOrStaff(context, { ownerId: studentId }, 'health record');
```

### PHI Access Authorization

```typescript
import {
  requireStudentPHIAccess,
  requireHealthRecordModifyPermission
} from '../utils/authorizationUtils';

// Verify user can access student's PHI
requireStudentPHIAccess(context, studentId, parentStudentRelationships);

// Verify user can modify health records (healthcare provider only)
requireHealthRecordModifyPermission(context);
```

### Specialized Authorization

```typescript
import {
  requireNurseMatch,
  requireDoctorMatch,
  requireMessageAccess
} from '../utils/authorizationUtils';

// Verify nurse ID matches authenticated user
requireNurseMatch(context, data.nurseId);

// Verify doctor ID matches authenticated user
requireDoctorMatch(context, prescription.doctorId);

// Verify user is message participant
requireMessageAccess(context, message.senderId, message.recipientId);
```

## Implementation Patterns

### Pattern 1: Admin-Only Operations

**Use Case:** Create/update/delete system configuration, user management (except self)

```typescript
import { requireAdmin, createAuthContext } from '../utils/authorizationUtils';
import { AuthorizationError } from '../errors/ServiceError';

class UserService {
  static async deleteUser(
    userId: string,
    authenticatedUser: any
  ): Promise<void> {
    // Create authorization context
    const context = createAuthContext(authenticatedUser);

    // Require admin role
    requireAdmin(context);

    // Prevent self-deletion
    if (context.userId === userId) {
      throw new AuthorizationError('Cannot delete your own account');
    }

    // Proceed with deletion
    await User.destroy({ where: { id: userId } });

    logger.info(`User ${userId} deleted by admin ${context.userId}`);
  }
}
```

### Pattern 2: Self or Admin

**Use Case:** User profile updates, password changes

```typescript
import { requireOwnershipOrAdmin, createAuthContext } from '../utils/authorizationUtils';

class UserService {
  static async updateUser(
    userId: string,
    updateData: UpdateUserData,
    authenticatedUser: any
  ): Promise<User> {
    // Create authorization context
    const context = createAuthContext(authenticatedUser);

    // User can update own profile OR admin can update any profile
    requireOwnershipOrAdmin(context, { ownerId: userId }, 'profile');

    // Role changes require admin
    if (updateData.role && context.userRole !== UserRole.ADMIN) {
      throw new AuthorizationError('Only admins can change user roles');
    }

    // Proceed with update
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await user.update(updateData);
    return user;
  }
}
```

### Pattern 3: Healthcare Provider Operations

**Use Case:** Create/update health records, prescribe medications

```typescript
import {
  requireHealthcareProvider,
  requireDoctorMatch,
  createAuthContext
} from '../utils/authorizationUtils';
import { logPHICreate } from '../utils/auditUtils';

class MedicationService {
  static async prescribeMedication(
    prescriptionData: PrescriptionData,
    authenticatedUser: any,
    ipAddress: string
  ): Promise<Prescription> {
    // Create authorization context
    const context = createAuthContext(authenticatedUser);

    // Only healthcare providers can prescribe
    requireHealthcareProvider(context);

    // Doctor ID in data must match authenticated doctor (unless admin)
    requireDoctorMatch(context, prescriptionData.doctorId);

    // Create prescription
    const prescription = await Prescription.create(prescriptionData);

    // Audit log for PHI
    logPHICreate(
      context.userId,
      context.userRole,
      AuditResourceType.PRESCRIPTION,
      prescription.id,
      prescriptionData.studentId,
      ipAddress
    );

    logger.info(`Prescription ${prescription.id} created by ${context.userRole} ${context.userId}`);

    return prescription;
  }
}
```

### Pattern 4: Nurse-Specific Operations

**Use Case:** Medication administration, vital signs recording

```typescript
import {
  requireNurseMatch,
  requireStudentPHIAccess,
  createAuthContext
} from '../utils/authorizationUtils';
import { logMedicationAdministration } from '../utils/auditUtils';

class MedicationService {
  static async logMedicationAdministration(
    logData: MedicationLogData,
    authenticatedUser: any,
    ipAddress: string
  ): Promise<MedicationLog> {
    // Create authorization context
    const context = createAuthContext(authenticatedUser);

    // Verify nurse ID matches authenticated user (prevents impersonation)
    requireNurseMatch(context, logData.nurseId);

    // Verify nurse has access to this student's information
    // This would require fetching parent-student relationships if user is parent
    requireStudentPHIAccess(context, logData.studentId);

    // Create medication log
    const log = await MedicationLog.create(logData);

    // Comprehensive audit logging
    logMedicationAdministration(
      context.userId,
      logData.studentId,
      logData.medicationId,
      logData.dosage,
      ipAddress
    );

    logger.info(`Medication administered to student ${logData.studentId} by nurse ${context.userId}`);

    return log;
  }
}
```

### Pattern 5: PHI Read Access (Healthcare Provider or Parent)

**Use Case:** Viewing health records, medications, appointments

```typescript
import {
  requireStudentPHIAccess,
  createAuthContext
} from '../utils/authorizationUtils';
import { logPHIAccess } from '../utils/auditUtils';

class HealthRecordService {
  static async getStudentHealthRecords(
    studentId: string,
    authenticatedUser: any,
    ipAddress: string
  ): Promise<HealthRecord[]> {
    // Create authorization context
    const context = createAuthContext(authenticatedUser);

    // Fetch parent-student relationships if needed
    const parentStudentRelationships = await this.getParentStudentRelationships();

    // Verify authorization to access this student's PHI
    requireStudentPHIAccess(context, studentId, parentStudentRelationships);

    // Fetch health records
    const records = await HealthRecord.findAll({
      where: { studentId },
      order: [['recordDate', 'DESC']]
    });

    // Audit log PHI access
    for (const record of records) {
      logPHIAccess(
        context.userId,
        context.userRole,
        AuditResourceType.HEALTH_RECORD,
        record.id,
        studentId,
        ipAddress,
        'Viewing health records'
      );
    }

    return records;
  }
}
```

### Pattern 6: PHI Modification (Healthcare Provider Only)

**Use Case:** Updating health records, modifying medications

```typescript
import {
  requireHealthRecordModifyPermission,
  requireStudentPHIAccess,
  createAuthContext
} from '../utils/authorizationUtils';
import { logPHIUpdate } from '../utils/auditUtils';

class HealthRecordService {
  static async updateHealthRecord(
    recordId: string,
    updateData: UpdateHealthRecordData,
    authenticatedUser: any,
    ipAddress: string
  ): Promise<HealthRecord> {
    // Create authorization context
    const context = createAuthContext(authenticatedUser);

    // Only healthcare providers can modify health records
    requireHealthRecordModifyPermission(context);

    // Fetch existing record
    const record = await HealthRecord.findByPk(recordId);
    if (!record) {
      throw new NotFoundError('Health record not found');
    }

    // Verify access to this student's PHI
    requireStudentPHIAccess(context, record.studentId);

    // Track changed fields for audit
    const changedFields = Object.keys(updateData);

    // Update record
    await record.update(updateData);

    // Audit log PHI modification
    logPHIUpdate(
      context.userId,
      context.userRole,
      AuditResourceType.HEALTH_RECORD,
      record.id,
      record.studentId,
      ipAddress,
      changedFields
    );

    logger.info(`Health record ${recordId} updated by ${context.userRole} ${context.userId}`);

    return record;
  }
}
```

### Pattern 7: Message/Communication Access

**Use Case:** Reading messages, viewing conversations

```typescript
import {
  requireMessageAccess,
  createAuthContext
} from '../utils/authorizationUtils';

class CommunicationService {
  static async getMessage(
    messageId: string,
    authenticatedUser: any
  ): Promise<Message> {
    // Create authorization context
    const context = createAuthContext(authenticatedUser);

    // Fetch message
    const message = await Message.findByPk(messageId);
    if (!message) {
      throw new NotFoundError('Message not found');
    }

    // Verify user is sender or recipient (or admin)
    requireMessageAccess(context, message.senderId, message.recipientId);

    // Mark as read if recipient
    if (context.userId === message.recipientId && !message.readAt) {
      await message.update({ readAt: new Date() });
    }

    return message;
  }
}
```

### Pattern 8: Document Access with PHI Flag

**Use Case:** Downloading documents, viewing attachments

```typescript
import {
  requireOwnershipOrStaff,
  requireStudentPHIAccess,
  createAuthContext
} from '../utils/authorizationUtils';
import { logDocumentDownload, logPHIAccess } from '../utils/auditUtils';

class DocumentService {
  static async downloadDocument(
    documentId: string,
    authenticatedUser: any,
    ipAddress: string
  ): Promise<Buffer> {
    // Create authorization context
    const context = createAuthContext(authenticatedUser);

    // Fetch document metadata
    const document = await Document.findByPk(documentId);
    if (!document) {
      throw new NotFoundError('Document not found');
    }

    // Verify ownership or staff access
    requireOwnershipOrStaff(context, { ownerId: document.uploadedBy }, 'document');

    // If document contains PHI, verify PHI access
    if (document.isPHI && document.studentId) {
      requireStudentPHIAccess(context, document.studentId);

      // Audit log PHI access
      logPHIAccess(
        context.userId,
        context.userRole,
        AuditResourceType.DOCUMENT,
        document.id,
        document.studentId,
        ipAddress,
        'Document download'
      );
    }

    // Regular document access audit log
    logDocumentDownload(
      context.userId,
      context.userRole,
      document.id,
      document.fileName,
      document.studentId,
      ipAddress,
      document.isPHI
    );

    // Retrieve and return document content
    const content = await this.getDocumentContent(document.storageKey);
    return content;
  }
}
```

## Service Method Authorization Checklist

For EVERY service method, ask:

### 1. Who can perform this action?
- [ ] Admin only
- [ ] Healthcare provider (Doctor/Nurse)
- [ ] Specific role (Doctor, Nurse, Staff)
- [ ] Resource owner
- [ ] Resource owner OR staff
- [ ] Resource owner OR admin
- [ ] Message participant (sender/recipient)

### 2. Does this access PHI?
- [ ] Yes - Implement requireStudentPHIAccess()
- [ ] Yes - Add PHI audit logging (logPHIAccess, logPHICreate, logPHIUpdate, logPHIDelete)
- [ ] No - Regular authorization only

### 3. Does this modify data?
- [ ] Yes - Verify user has modify permission
- [ ] Yes - Add audit logging for data modification
- [ ] No - Read-only access authorization

### 4. Does this involve user impersonation risk?
- [ ] Nurse actions - Use requireNurseMatch()
- [ ] Doctor actions - Use requireDoctorMatch()
- [ ] Other user-specific actions - Verify user ID matches

### 5. Does this involve organizational boundaries?
- [ ] Yes - Verify same organization (requireSameOrganization)
- [ ] Yes - Verify same school (requireSameSchool)
- [ ] No - No organizational boundary checks needed

## Testing Authorization

### Unit Test Pattern

```typescript
describe('MedicationService.logMedicationAdministration', () => {
  it('should allow nurse to log medication for their ID', async () => {
    const nurseUser = { id: 'nurse123', role: 'NURSE' };
    const logData = { nurseId: 'nurse123', studentId: 'student456', ... };

    const result = await MedicationService.logMedicationAdministration(
      logData,
      nurseUser,
      '127.0.0.1'
    );

    expect(result).toBeDefined();
  });

  it('should prevent nurse from logging as different nurse', async () => {
    const nurseUser = { id: 'nurse123', role: 'NURSE' };
    const logData = { nurseId: 'nurse999', studentId: 'student456', ... };

    await expect(
      MedicationService.logMedicationAdministration(logData, nurseUser, '127.0.0.1')
    ).rejects.toThrow(AuthorizationError);
  });

  it('should allow admin to log as any nurse', async () => {
    const adminUser = { id: 'admin123', role: 'ADMIN' };
    const logData = { nurseId: 'nurse999', studentId: 'student456', ... };

    const result = await MedicationService.logMedicationAdministration(
      logData,
      adminUser,
      '127.0.0.1'
    );

    expect(result).toBeDefined();
  });

  it('should prevent parent from accessing unauthorized student PHI', async () => {
    const parentUser = { id: 'parent123', role: 'PARENT' };
    const logData = { nurseId: 'nurse123', studentId: 'other-student', ... };

    await expect(
      MedicationService.logMedicationAdministration(logData, parentUser, '127.0.0.1')
    ).rejects.toThrow(AuthorizationError);
  });
});
```

## Common Mistakes to Avoid

### ❌ DON'T: Skip authorization in service methods
```typescript
// BAD - No authorization check
static async updateUser(userId: string, data: UpdateData) {
  await User.update(data, { where: { id: userId } });
}
```

### ✅ DO: Always check authorization
```typescript
// GOOD - Authorization checked
static async updateUser(userId: string, data: UpdateData, authenticatedUser: any) {
  const context = createAuthContext(authenticatedUser);
  requireOwnershipOrAdmin(context, { ownerId: userId }, 'profile');
  await User.update(data, { where: { id: userId } });
}
```

### ❌ DON'T: Trust client-provided user IDs for authorization
```typescript
// BAD - Client can send any userId
static async deleteRecord(recordId: string, userId: string) {
  requireAdmin({ userId, userRole: 'ADMIN' }); // Client provides these!
}
```

### ✅ DO: Use authenticated user from session/JWT
```typescript
// GOOD - User from authentication middleware
static async deleteRecord(recordId: string, authenticatedUser: any) {
  const context = createAuthContext(authenticatedUser); // Server-verified
  requireAdmin(context);
}
```

### ❌ DON'T: Forget PHI audit logging
```typescript
// BAD - No audit log for PHI access
static async getHealthRecord(recordId: string, authenticatedUser: any) {
  requireStaff(createAuthContext(authenticatedUser));
  return await HealthRecord.findByPk(recordId);
}
```

### ✅ DO: Always log PHI access
```typescript
// GOOD - PHI access logged
static async getHealthRecord(recordId: string, authenticatedUser: any, ipAddress: string) {
  const context = createAuthContext(authenticatedUser);
  requireStaff(context);

  const record = await HealthRecord.findByPk(recordId);

  logPHIAccess(context.userId, context.userRole, AuditResourceType.HEALTH_RECORD,
    record.id, record.studentId, ipAddress);

  return record;
}
```

## Summary

- **ALWAYS** add authorization checks to service methods
- **ALWAYS** use authenticated user from request, never trust client data
- **ALWAYS** log PHI access for HIPAA compliance
- **FOLLOW** the principle of least privilege
- **TEST** authorization thoroughly with different roles
- **DOCUMENT** any special authorization requirements

For questions or clarifications, refer to:
- `backend/src/utils/authorizationUtils.ts` - Authorization functions
- `backend/src/utils/auditUtils.ts` - Audit logging functions
- `backend/src/errors/ServiceError.ts` - Error classes

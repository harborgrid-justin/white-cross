# Emergency Contact Validation - Quick Reference

**Last Updated:** 2025-10-11

---

## Quick Validation Rules

### Phone Numbers ✅
```javascript
// VALID Examples
"+1-555-123-4567"     // US with country code
"(555) 123-4567"      // US format
"5551234567"          // Plain digits
"+44 20 1234 5678"    // UK format
"+33 1 42 86 82 00"   // France format

// INVALID Examples
"123-4567"            // Too short
"1111111111"          // All same digit
"555-CALL-NOW"        // Contains letters
```

### Emails ✅
```javascript
// VALID Examples
"parent@example.com"
"contact+tag@domain.co.uk"
"name.surname@company.org"

// INVALID Examples
"tempmail@tempmail.com"       // Disposable domain
"invalid@"                     // Missing domain
"@example.com"                 // Missing local part
```

### Relationships ✅
```javascript
// VALID Values (case-insensitive)
"PARENT"
"GUARDIAN"
"SIBLING"
"GRANDPARENT"
"AUNT_UNCLE"
"FAMILY_FRIEND"
"NEIGHBOR"
"OTHER"

// INVALID Examples
"Friend"              // Not in list
"Cousin"              // Use OTHER instead
```

### Priority Rules 🚨
```javascript
// Business Rules
✓ Student MUST have at least 1 PRIMARY contact
✓ Student can have at most 2 PRIMARY contacts
✗ Cannot delete the only PRIMARY contact
✗ Cannot deactivate the only PRIMARY contact
✗ Cannot downgrade the only PRIMARY to SECONDARY
```

### Notification Channels ✅
```javascript
// Valid Channels
["sms"]                      // SMS only
["email"]                    // Email only (requires email address)
["sms", "email"]             // Both
["sms", "email", "voice"]    // All three

// Cross-Field Validation
If "email" in channels → email field REQUIRED
If "sms" in channels → phone field REQUIRED (always required anyway)
If "voice" in channels → phone field REQUIRED (always required anyway)
```

---

## Common Error Scenarios

### Creating Contact

**Error:** "Student already has 2 primary contacts"
**Solution:** Change one existing PRIMARY to SECONDARY first

**Error:** "Email address is required when email is selected as a notification channel"
**Solution:** Provide email field when selecting email channel

**Error:** "Phone number cannot be all the same digit"
**Solution:** Use a valid phone number (not 1111111111)

### Updating Contact

**Error:** "Cannot change priority from PRIMARY"
**Solution:** Add another PRIMARY contact before downgrading this one

**Error:** "Cannot deactivate the only active PRIMARY contact"
**Solution:** Add another PRIMARY contact before deactivating

### Deleting Contact

**Error:** "Cannot delete the only active PRIMARY contact"
**Solution:** Add another PRIMARY contact before deleting

---

## Code Examples

### Backend - Create Contact
```typescript
const contactData = {
  studentId: "uuid-here",
  firstName: "Jane",
  lastName: "Doe",
  relationship: "PARENT",
  phoneNumber: "+1-555-123-4567",
  email: "jane.doe@example.com",
  priority: ContactPriority.PRIMARY,
  notificationChannels: ["sms", "email"],
  preferredContactMethod: "SMS",
  canPickupStudent: true,
  notes: "Preferred contact for emergencies"
};

const contact = await EmergencyContactService.createEmergencyContact(contactData);
```

### Frontend - Form Validation
```typescript
import { createEmergencyContactSchema } from '@/validation';

const formData = {
  studentId: studentId,
  firstName: "John",
  lastName: "Smith",
  relationship: "GUARDIAN",
  phoneNumber: "(555) 987-6543",
  email: "john.smith@example.com",
  priority: ContactPriority.PRIMARY,
  notificationChannels: ["sms", "email", "voice"],
  canPickupStudent: true
};

// Validate
const result = createEmergencyContactSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.errors);
}
```

### React Hook Form Integration
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emergencyContactFormSchema } from '@/validation';

const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm({
  resolver: zodResolver(emergencyContactFormSchema)
});

const onSubmit = async (data) => {
  try {
    await emergencyContactsApi.create(data);
  } catch (error) {
    console.error(error);
  }
};
```

---

## Migration Checklist

### For Developers
- [ ] Review new fields in EmergencyContact model
- [ ] Update forms to include new fields (optional)
- [ ] Handle PRIMARY contact enforcement in UI
- [ ] Test notification channel validation
- [ ] Update tests for new validation rules

### For Database Admins
- [ ] Run migration to add new columns
- [ ] Verify indexes created
- [ ] Check existing data compatibility
- [ ] Set default values for existing records

### For QA
- [ ] Test PRIMARY contact enforcement
- [ ] Test phone number validation (international)
- [ ] Test email validation (disposable domains)
- [ ] Test notification channel validation
- [ ] Test cross-field validation
- [ ] Test error messages

---

## Field Reference

| Field | Required | Type | Max Length | Default |
|-------|----------|------|------------|---------|
| firstName | Yes | String | 100 | - |
| lastName | Yes | String | 100 | - |
| relationship | Yes | Enum | - | - |
| phoneNumber | Yes | String | 20 | - |
| email | No | String | 255 | - |
| address | No | Text | 500 | - |
| priority | Yes | Enum | - | PRIMARY |
| preferredContactMethod | No | Enum | - | ANY |
| verificationStatus | No | Enum | - | UNVERIFIED |
| notificationChannels | No | JSON Array | - | ["sms","email"] |
| canPickupStudent | No | Boolean | - | false |
| notes | No | Text | 1000 | - |

---

## Enums Reference

### ContactPriority
- `PRIMARY` - Main emergency contact
- `SECONDARY` - Backup contact
- `EMERGENCY_ONLY` - Only contact in emergencies

### PreferredContactMethod
- `SMS` - Text messages
- `EMAIL` - Email messages
- `VOICE` - Phone calls
- `ANY` - Any method available

### VerificationStatus
- `UNVERIFIED` - Not yet verified
- `PENDING` - Verification in progress
- `VERIFIED` - Successfully verified
- `FAILED` - Verification failed

---

## Related Files

**Backend:**
- `backend/src/database/models/core/EmergencyContact.ts`
- `backend/src/services/emergencyContactService.ts`

**Frontend:**
- `frontend/src/types/student.types.ts`
- `frontend/src/validation/emergencyContactSchemas.ts`
- `frontend/src/services/modules/emergencyContactsApi.ts`

**Documentation:**
- `docs/EMERGENCY_CONTACT_VALIDATION_SUMMARY.md` - Full details
- `docs/EMERGENCY_CONTACT_QUICK_REFERENCE.md` - This file

---

## Support

For detailed information, see the comprehensive summary:
`docs/EMERGENCY_CONTACT_VALIDATION_SUMMARY.md`

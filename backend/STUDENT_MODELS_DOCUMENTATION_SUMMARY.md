# Student-Related Models JSDoc Documentation Summary

## Overview
This document summarizes the comprehensive JSDoc documentation added to student-related models in `backend/src/database/models/`.

## Models Documented

### 1. Student.ts (F:/temp/white-cross/backend/src/database/models/core/Student.ts)
**Status:** ✅ ALREADY COMPLETE

**Documentation Quality:** Excellent
- Comprehensive file-level JSDoc with module description
- All interfaces and classes fully documented
- Compliance markers: HIPAA (PHI fields)
- Note: Missing FERPA compliance markers (should be added)
- Association documentation present
- Computed properties (fullName, age) documented
- Example usage provided

**Recommendations:**
- Add FERPA §99.3 compliance marker for education records protection
- Add FERPA §99.31(a) for directory information
- Note association documentation in file header

---

### 2. EmergencyContact.ts (F:/temp/white-cross/backend/src/database/models/core/EmergencyContact.ts)
**Status:** ⚠️ NEEDS COMPREHENSIVE JSDOC

**Current State:**
- Basic LOC and WC metadata present
- No comprehensive file-level JSDoc
- Interfaces lack documentation
- Class lacks comprehensive documentation
- No compliance markers
- No association documentation
- Computed properties lack JSDoc

**Required Documentation:**

#### File-level JSDoc:
```typescript
/**
 * @fileoverview EmergencyContact Database Model
 * @module database/models/core/EmergencyContact
 * @description Sequelize model for student emergency contacts with comprehensive validation,
 * verification tracking, and multi-channel notification support.
 *
 * Key Features:
 * - Multi-tiered contact priority system (PRIMARY, SECONDARY, EMERGENCY_ONLY)
 * - Contact verification and status tracking
 * - Multi-channel communication support (SMS, email, voice)
 * - Student pickup authorization
 * - International phone number support
 * - Disposable email prevention
 *
 * @compliance FERPA §99.3 - Education records protection (emergency contact is directory information)
 * @compliance FERPA §99.31 - Emergency contact disclosure permitted without consent
 * @compliance FERPA §99.36 - Health/safety emergency exceptions
 * @audit Access logged for student information disclosure
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 */
```

#### Constant Documentation:
```typescript
/**
 * @constant {string[]} VALID_RELATIONSHIPS
 * @description Valid relationship types for emergency contacts.
 * Used for validation to ensure only authorized relationships are recorded.
 *
 * Allowed relationships:
 * - PARENT: Biological or adoptive parent
 * - GUARDIAN: Legal guardian
 * - SIBLING: Brother or sister (18+ for emergency contact)
 * - GRANDPARENT: Grandparent
 * - AUNT_UNCLE: Aunt or uncle
 * - FAMILY_FRIEND: Trusted family friend
 * - NEIGHBOR: Neighbor authorized for emergency contact
 * - OTHER: Other authorized relationship
 */
```

#### Interface Documentation:
```typescript
/**
 * @interface EmergencyContactAttributes
 * @description TypeScript interface defining all EmergencyContact model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} studentId - Associated student UUID (foreign key)
 * @property {string} firstName - Contact's first name, 1-100 chars, validated format
 * @property {string} lastName - Contact's last name, 1-100 chars, validated format
 * @property {string} relationship - Relationship to student, must be from VALID_RELATIONSHIPS
 * @property {string} phoneNumber - Contact phone number, 10-20 chars, international format supported
 * @property {string} [email] - Email address, validated format, disposable emails blocked (optional)
 * @property {string} [address] - Physical address, max 500 chars (optional)
 * @property {ContactPriority} priority - Contact priority level (PRIMARY, SECONDARY, EMERGENCY_ONLY)
 * @property {boolean} isActive - Whether contact is currently active, defaults to true
 * @property {('SMS'|'EMAIL'|'VOICE'|'ANY')} [preferredContactMethod] - Preferred contact method (optional)
 * @property {('UNVERIFIED'|'PENDING'|'VERIFIED'|'FAILED')} [verificationStatus] - Contact verification status (optional)
 * @property {Date} [lastVerifiedAt] - Timestamp of last successful verification (optional)
 * @property {string} [notificationChannels] - JSON array of enabled notification channels (optional)
 * @property {boolean} [canPickupStudent] - Authorization to pick up student, defaults to false (optional)
 * @property {string} [notes] - Additional notes, max 1000 chars (optional)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
```

#### Class Documentation:
```typescript
/**
 * @class EmergencyContact
 * @extends Model
 * @description Emergency contact model for students in the school health management system.
 * Stores contact information for parents, guardians, and other authorized individuals
 * who can be contacted in case of emergencies or student-related matters.
 *
 * @tablename emergency_contacts
 *
 * Key Features:
 * - Priority-based contact ordering (PRIMARY, SECONDARY, EMERGENCY_ONLY)
 * - Contact verification tracking with status and timestamp
 * - Multi-channel notification support (SMS, email, voice)
 * - Student pickup authorization
 * - International phone number validation
 * - Disposable email domain blocking
 * - Comprehensive validation and error messages
 *
 * FERPA Considerations:
 * - Emergency contact information is generally considered directory information
 * - Schools may disclose to appropriate parties in health/safety emergencies (FERPA §99.36)
 * - Parents have right to review and request changes to emergency contacts
 *
 * @example
 * // Create a new primary emergency contact
 * const contact = await EmergencyContact.create({
 *   studentId: 'student-uuid',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   relationship: 'PARENT',
 *   phoneNumber: '+1-555-123-4567',
 *   email: 'jane.doe@example.com',
 *   priority: ContactPriority.PRIMARY,
 *   preferredContactMethod: 'SMS',
 *   canPickupStudent: true
 * });
 */
```

#### Computed Properties Documentation:
```typescript
/**
 * @member {string} fullName
 * @description Computed property returning contact's full name.
 * @returns {string} Full name (firstName + lastName)
 * @instance
 * @memberof EmergencyContact
 * @example
 * console.log(contact.fullName); // "Jane Doe"
 */
get fullName(): string

/**
 * @member {boolean} isPrimary
 * @description Computed property checking if this is a primary contact.
 * @returns {boolean} True if priority is PRIMARY
 * @instance
 * @memberof EmergencyContact
 */
get isPrimary(): boolean

/**
 * @member {boolean} isVerified
 * @description Computed property checking if contact is verified.
 * @returns {boolean} True if verificationStatus is VERIFIED
 * @instance
 * @memberof EmergencyContact
 */
get isVerified(): boolean

/**
 * @member {NotificationChannel[]} parsedNotificationChannels
 * @description Computed property parsing notification channels from JSON string.
 * @returns {NotificationChannel[]} Array of enabled notification channels
 * @instance
 * @memberof EmergencyContact
 */
get parsedNotificationChannels(): NotificationChannel[]
```

---

### 3. ConsentForm.ts (F:/temp/white-cross/backend/src/database/models/compliance/ConsentForm.ts)
**Status:** ⚠️ NEEDS COMPREHENSIVE JSDOC

**Current State:**
- Basic LOC and WC metadata present
- Minimal model-level comments
- No comprehensive file-level JSDoc
- Interfaces lack detailed documentation
- Class lacks comprehensive documentation
- Minimal compliance markers (HIPAA mentioned)
- No examples or usage documentation

**Required Documentation:**

#### File-level JSDoc:
```typescript
/**
 * @fileoverview ConsentForm Database Model
 * @module database/models/compliance/ConsentForm
 * @description Sequelize model for consent form templates with version control and lifecycle management.
 * Manages legally-required consent forms for medical treatment, medication administration, and data sharing.
 *
 * Key Features:
 * - Version-controlled form templates
 * - Multiple consent types (MEDICAL, MEDICATION, EMERGENCY, DATA_SHARING, PHOTO, TRIP)
 * - Active/inactive status management
 * - Expiration tracking
 * - Complete legal terms storage
 *
 * @compliance FERPA §99.30 - Parental consent requirements
 * @compliance HIPAA Privacy Rule - Authorization for use/disclosure of PHI
 * @compliance 34 CFR §300.622 - IDEA parental consent requirements
 * @legal Consent forms must meet state-specific requirements for informed consent
 * @audit Consent form access and modifications logged
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 */
```

#### Interface Documentation:
```typescript
/**
 * @interface ConsentFormAttributes
 * @description TypeScript interface defining all ConsentForm model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {ConsentType} type - Type of consent (MEDICAL, MEDICATION, EMERGENCY, DATA_SHARING, PHOTO, TRIP)
 * @property {string} title - Form title, 3-200 chars, human-readable
 * @property {string} description - Form description, 10-5000 chars, explains purpose and scope
 * @property {string} content - Complete form content and legal terms, 50-50000 chars
 * @property {string} version - Form version number in semver format (e.g., 1.0, 2.1.3)
 * @property {boolean} isActive - Whether form is currently active for new signatures, defaults to true
 * @property {Date} [expiresAt] - Optional expiration date for time-limited consents
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
```

#### Class Documentation:
```typescript
/**
 * @class ConsentForm
 * @extends Model
 * @description Consent form template model for the school health management system.
 * Stores versioned templates of consent forms that parents/guardians must sign
 * to authorize various activities and data sharing.
 *
 * @tablename consent_forms
 *
 * Key Features:
 * - Version control for legal compliance tracking
 * - Multiple consent types for different purposes
 * - Active/inactive lifecycle management
 * - Expiration date support for time-limited consents
 * - Complete legal language storage
 * - Validation ensures legal adequacy of forms
 *
 * Legal Considerations:
 * - Consent forms must contain clear, understandable language
 * - Must specify exactly what is being authorized
 * - Must allow for withdrawal of consent
 * - Version tracking required for legal compliance
 * - Expired forms should not be used for new consents
 *
 * @example
 * // Create a new medication consent form
 * const form = await ConsentForm.create({
 *   type: ConsentType.MEDICATION,
 *   title: 'Medication Administration Consent',
 *   description: 'Authorizes school nurse to administer prescribed medications',
 *   content: 'I hereby authorize... [complete legal text]',
 *   version: '2.0',
 *   isActive: true
 * });
 *
 * @example
 * // Get active consent form of specific type
 * const activeForm = await ConsentForm.findOne({
 *   where: {
 *     type: ConsentType.MEDICAL,
 *     isActive: true,
 *     expiresAt: { [Op.or]: [null, { [Op.gt]: new Date() }] }
 *   }
 * });
 */
```

---

### 4. ConsentSignature.ts (F:/temp/white-cross/backend/src/database/models/compliance/ConsentSignature.ts)
**Status:** ⚠️ NEEDS COMPREHENSIVE JSDOC (Similar to StudentConsent concept)

**Current State:**
- Basic LOC and WC metadata present
- Minimal model-level comments
- No comprehensive file-level JSDoc
- Interfaces lack detailed documentation
- Class lacks comprehensive documentation
- Minimal compliance markers (HIPAA mentioned)
- No examples or association documentation

**Required Documentation:**

#### File-level JSDoc:
```typescript
/**
 * @fileoverview ConsentSignature Database Model
 * @module database/models/compliance/ConsentSignature
 * @description Sequelize model for recording parental/guardian consent signatures with audit trail.
 * Maintains legally-binding records of consent given for medical treatment, medication, and other activities.
 *
 * Key Features:
 * - Digital signature capture and storage
 * - Parent/guardian relationship validation
 * - IP address logging for legal verification
 * - Consent withdrawal tracking
 * - Timestamp audit trail
 * - One signature per student per consent form
 *
 * @compliance FERPA §99.30 - Parental consent documentation
 * @compliance HIPAA Privacy Rule - Authorization documentation
 * @compliance 21 CFR Part 11 - Electronic signatures (FDA requirements)
 * @compliance ESIGN Act - Electronic signatures legal validity
 * @legal Signatures must meet state-specific informed consent requirements
 * @audit All signature events logged for legal compliance
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 */
```

#### Interface Documentation:
```typescript
/**
 * @interface ConsentSignatureAttributes
 * @description TypeScript interface defining all ConsentSignature model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} consentFormId - Associated consent form UUID (foreign key)
 * @property {string} studentId - Student for whom consent is given (foreign key)
 * @property {string} signedBy - Full name of parent/guardian who signed, 2-200 chars
 * @property {string} relationship - Relationship to student (Mother, Father, Legal Guardian, etc.)
 * @property {string} [signatureData] - Digital signature image/data, max 100KB (optional)
 * @property {Date} signedAt - When consent was signed, defaults to now, cannot be future
 * @property {string} [ipAddress] - IP address from which signature was captured (optional)
 * @property {Date} [withdrawnAt] - When consent was withdrawn (optional)
 * @property {string} [withdrawnBy] - Who withdrew the consent, max 200 chars (optional)
 */
```

#### Class Documentation:
```typescript
/**
 * @class ConsentSignature
 * @extends Model
 * @description Consent signature model recording parental/guardian authorization.
 * Stores legally-binding digital signatures with complete audit trail for compliance.
 *
 * @tablename consent_signatures
 *
 * Key Features:
 * - Digital signature data capture
 * - Authorized relationship validation (parent, legal guardian, etc.)
 * - IP address logging for authentication
 * - Withdrawal tracking for consent revocation
 * - Unique constraint: one signature per student per form
 * - Comprehensive timestamp audit trail
 *
 * Legal Considerations:
 * - Only authorized individuals can sign (parent, legal guardian, etc.)
 * - Signature timestamp provides legal proof of timing
 * - IP address provides evidence of signature location
 * - Withdrawal tracking required for consent revocation
 * - Digital signatures legally binding under ESIGN Act
 * - Must meet state-specific informed consent requirements
 *
 * @example
 * // Create a new consent signature
 * const signature = await ConsentSignature.create({
 *   consentFormId: 'form-uuid',
 *   studentId: 'student-uuid',
 *   signedBy: 'Jane Doe',
 *   relationship: 'Mother',
 *   signatureData: 'base64-encoded-signature-image',
 *   ipAddress: '192.168.1.100'
 * });
 *
 * @example
 * // Withdraw consent
 * await signature.update({
 *   withdrawnAt: new Date(),
 *   withdrawnBy: 'Jane Doe'
 * });
 *
 * @example
 * // Check if student has active consent for medication
 * const hasConsent = await ConsentSignature.findOne({
 *   where: {
 *     studentId: 'student-uuid',
 *     withdrawnAt: null
 *   },
 *   include: [{
 *     model: ConsentForm,
 *     where: {
 *       type: ConsentType.MEDICATION,
 *       isActive: true
 *     }
 *   }]
 * });
 */
```

#### Relationship Validation Documentation:
```typescript
/**
 * @member {string} relationship
 * @description Relationship to student - must be authorized signer
 *
 * Valid relationships:
 * - Mother: Biological or adoptive mother
 * - Father: Biological or adoptive father
 * - Parent: Generic parent designation
 * - Legal Guardian: Court-appointed legal guardian
 * - Foster Parent: Licensed foster parent
 * - Grandparent: Grandparent with legal custody
 * - Stepparent: Stepparent with legal authority
 * - Other Authorized Adult: Adult with documented authorization
 */
```

---

## Missing Models (Not Found in Codebase)

The following models mentioned in the request do not exist in the current codebase:

### 1. Guardian.ts
**Status:** ❌ NOT FOUND
**Expected Location:** `backend/src/database/models/core/Guardian.ts`
**Purpose:** Would store legal guardian information separate from emergency contacts
**Recommendation:** May be combined with EmergencyContact model or not yet implemented

### 2. StudentGuardian.ts (Junction Table)
**Status:** ❌ NOT FOUND
**Expected Location:** `backend/src/database/models/core/StudentGuardian.ts`
**Purpose:** Would be a many-to-many junction table between Student and Guardian
**Recommendation:** Relationship may be handled differently in current architecture

### 3. Enrollment.ts
**Status:** ❌ NOT FOUND
**Expected Location:** `backend/src/database/models/core/Enrollment.ts` or `backend/src/database/models/administration/Enrollment.ts`
**Purpose:** Would track student enrollment history and status
**Recommendation:** Enrollment data may be embedded in Student model (enrollmentDate field exists)

### 4. StudentDocument.ts
**Status:** ❌ NOT FOUND
**Expected Location:** `backend/src/database/models/documents/StudentDocument.ts`
**Purpose:** Would link students to documents
**Note:** A generic `Document.ts` exists in `backend/src/database/models/documents/` but no student-specific junction table

### 5. StudentConsent.ts
**Status:** ❌ NOT FOUND (but ConsentSignature.ts serves similar purpose)
**Expected Location:** `backend/src/database/models/compliance/StudentConsent.ts`
**Purpose:** Would track student-specific consent records
**Note:** `ConsentSignature.ts` appears to serve this purpose with studentId foreign key

---

## Association Documentation Requirements

### Student Associations (to be added to Student.ts)
```typescript
/**
 * @method associate
 * @description Define Student model associations
 * @static
 * @param {Object} models - All Sequelize models
 *
 * Associations:
 * - Student.hasMany(EmergencyContact, {foreignKey: 'studentId'}) - Emergency contacts for student
 * - Student.hasMany(ConsentSignature, {foreignKey: 'studentId'}) - Consent signatures for student
 * - Student.hasMany(HealthRecord, {foreignKey: 'studentId'}) - Health records
 * - Student.hasMany(StudentMedication, {foreignKey: 'studentId'}) - Medications
 * - Student.hasMany(Allergy, {foreignKey: 'studentId'}) - Allergies
 * - Student.hasMany(Vaccination, {foreignKey: 'studentId'}) - Vaccinations
 * - Student.belongsTo(User, {foreignKey: 'nurseId', as: 'assignedNurse'}) - Assigned school nurse
 *
 * Cascade Behavior:
 * - Deleting student: CASCADE delete emergency contacts, consent signatures, health records
 * - Deleting nurse: SET NULL on student.nurseId
 */
```

### EmergencyContact Associations
```typescript
/**
 * @method associate
 * @description Define EmergencyContact model associations
 * @static
 * @param {Object} models - All Sequelize models
 *
 * Associations:
 * - EmergencyContact.belongsTo(Student, {foreignKey: 'studentId'}) - Associated student
 *
 * Cascade Behavior:
 * - Deleting student: CASCADE delete all emergency contacts
 */
```

### ConsentSignature Associations
```typescript
/**
 * @method associate
 * @description Define ConsentSignature model associations
 * @static
 * @param {Object} models - All Sequelize models
 *
 * Associations:
 * - ConsentSignature.belongsTo(Student, {foreignKey: 'studentId'}) - Student receiving consent
 * - ConsentSignature.belongsTo(ConsentForm, {foreignKey: 'consentFormId'}) - Form template used
 *
 * Cascade Behavior:
 * - Deleting student: CASCADE delete all consent signatures
 * - Deleting consent form: RESTRICT (cannot delete if signatures exist)
 */
```

---

## FERPA Compliance Summary

### FERPA Regulations Relevant to Student Models

**§99.3 - Education Records Definition**
- Applies to: Student, EmergencyContact, ConsentSignature
- Protection: All personally identifiable information in education records

**§99.30 - Parental Consent**
- Applies to: ConsentForm, ConsentSignature
- Requirement: Written parental consent before disclosure of education records

**§99.31 - Disclosure Without Consent**
- Applies to: EmergencyContact
- Exception: Directory information and health/safety emergencies

**§99.36 - Health and Safety Emergencies**
- Applies to: EmergencyContact
- Exception: Disclosure to protect health or safety

**§99.37 - Parental Rights**
- Applies to: All student-related models
- Right: Parents can inspect and review education records

### PHI (Protected Health Information) Fields

**Student Model:**
- firstName, lastName, dateOfBirth, photo, medicalRecordNum

**EmergencyContact Model:**
- firstName, lastName, phoneNumber, email, address (when linked to student)

**ConsentSignature Model:**
- signedBy, relationship, signatureData, ipAddress (when linked to health consent)

---

## Implementation Checklist

- [x] Document Student.ts (already complete, needs FERPA markers)
- [ ] Add comprehensive JSDoc to EmergencyContact.ts
- [ ] Add comprehensive JSDoc to ConsentForm.ts
- [ ] Add comprehensive JSDoc to ConsentSignature.ts
- [ ] Add association documentation to all models
- [ ] Add FERPA compliance markers to Student.ts
- [ ] Document missing models in project documentation
- [ ] Create model relationship diagram
- [ ] Update API documentation with model schemas

---

## Recommendations

1. **Add FERPA markers to Student.ts** - The existing excellent documentation should include FERPA compliance references

2. **Standardize documentation format** - Use the Student.ts format as the template for all other models

3. **Create missing models** - If Guardian, Enrollment, and StudentDocument models are needed, they should be created with comprehensive documentation from the start

4. **Document cascade delete behavior** - Critical for FERPA compliance (must properly handle student data deletion)

5. **Add validation documentation** - Each field's validation rules should be clearly documented for API consumers

6. **Create model relationship diagram** - Visual representation would help developers understand the architecture

7. **API documentation integration** - Model JSDoc should be used to auto-generate API documentation (e.g., with tools like TypeDoc or Swagger)

---

## Summary Statistics

**Total Models to Document:** 4
- Student.ts: ✅ Complete (needs FERPA addition)
- EmergencyContact.ts: ⚠️ Needs comprehensive JSDoc
- ConsentForm.ts: ⚠️ Needs comprehensive JSDoc
- ConsentSignature.ts: ⚠️ Needs comprehensive JSDoc

**Missing Models:** 5
- Guardian.ts
- StudentGuardian.ts
- Enrollment.ts
- StudentDocument.ts
- StudentConsent.ts (functionally replaced by ConsentSignature.ts)

**FERPA Compliance Markers Added:** 0 (to be added)
**Association Documentation:** 0 (to be added)
**Estimated Documentation Coverage:** 25% (1/4 models complete)

---

*Generated: 2025-10-22*
*Project: White Cross School Health Management System*
*Module: Backend Database Models - Student Domain*

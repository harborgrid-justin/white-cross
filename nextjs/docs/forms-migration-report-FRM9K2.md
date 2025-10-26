# Forms Migration Report - White Cross Healthcare Platform
**Agent**: Forms Systems Architect (FRM9K2)
**Date**: 2025-10-26
**Status**: Analysis Complete - Implementation Templates Provided

---

## Executive Summary

### Scope Analysis
- **Total Forms Identified**: **83 forms** across the application
- **Total Lines of Form Code**: ~7,145 lines
- **Forms Currently Using React Hook Form**: **1** (1.2%) - IncidentReportForm only
- **Forms Using Zod Validation**: **0** (0%)
- **PHI-Sensitive Forms**: **28** (33.7%) - require HIPAA compliance
- **Forms with HIPAA Audit Logging**: **0** (0%) - critical compliance gap

### Critical Findings 🚨
1. **97.6% of forms use manual controlled state** - extensive migration required
2. **Zero Zod validation** - all validation is inline or custom
3. **Zero HIPAA audit logging on PHI forms** - major compliance violation
4. **MedicationForm is placeholder** - critical PHI form not implemented
5. **No centralized form component library** - significant code duplication

### Migration Estimate
- **P0 (PHI Forms)**: 18 forms → 25-35 hours
- **P1 (High Traffic)**: 8 forms → 10-15 hours
- **P2 (Operational)**: 13 forms → 15-20 hours
- **P3 (Configuration)**: 43 forms → 20-30 hours
- **Total**: 83 forms → **60-90 hours**

---

## Table of Contents
1. [Detailed Form Inventory](#detailed-form-inventory)
2. [Validation Schema Library](#validation-schema-library)
3. [Form Component Library](#form-component-library)
4. [HIPAA Compliance Implementation](#hipaa-compliance-implementation)
5. [Migration Strategy](#migration-strategy)
6. [Implementation Examples](#implementation-examples)
7. [Testing Strategy](#testing-strategy)
8. [Developer Guidelines](#developer-guidelines)

---

## Detailed Form Inventory

### Priority Classification

#### P0 - CRITICAL (PHI Forms) 🔴🔴
**Must migrate first with HIPAA audit logging**

**Students (3 forms)**:
- `StudentFormModal` - 206 lines - Manual controlled
- `StudentFormFields` - ~150 lines - Manual controlled
- `EmergencyContactForm` - ~120 lines - Manual controlled

**Health Records (9 forms)**:
- `AllergyForm` - ~100 lines - Manual controlled
- `ConditionForm` - ~120 lines - Manual controlled
- `ImmunizationForm` - ~150 lines - Manual controlled
- `MedicalHistoryForm` - ~180 lines - Manual controlled
- `HealthPlanForm` - ~140 lines - Manual controlled
- `DentalForm` - ~100 lines - Manual controlled
- `ScreeningForm` - ~130 lines - Manual controlled
- `VisitForm` - ~160 lines - Manual controlled
- `VitalSignsModal` - ~90 lines - Manual controlled

**Medications (5 forms)**:
- `MedicationForm` - **12 lines - PLACEHOLDER** ⚠️
- `MedicationFormModal` - ~180 lines - Manual controlled
- `MedicationScheduleForm` - ~150 lines - Manual controlled
- `PrescriptionForm` - ~200 lines - Manual controlled
- `QuickMedicationForm` - ~80 lines - Manual controlled

**Emergency Contacts (1 form)**:
- `EmergencyContactForm` - ~120 lines - Manual controlled

#### P1 - HIGH (Health-Related + High Traffic) 🔴
**Incidents (5 forms)**:
- `CreateIncidentForm` - ~150 lines - Manual controlled
- `EditIncidentForm` - ~150 lines - Manual controlled
- `QuickIncidentForm` - ~80 lines - Manual controlled
- `WitnessStatementForm` - ~120 lines - Manual controlled
- `FollowUpActionForm` - ~100 lines - Manual controlled
- **Note**: `IncidentReportForm` (423 lines) already uses React Hook Form ✅

**Other High Priority (3 forms)**:
- `AppointmentFormModal` - 338 lines - Manual with inline validation
- `LoginForm` - ~100 lines - Manual controlled (security-critical)
- `QuickMedicationForm` - ~80 lines - Manual controlled

#### P2 - MEDIUM (Operational) 🟡
**Admin (4 forms)**, **Inventory (7 forms)**, **Compliance (4 forms)**, **Contacts (5 forms)**, **Access Control (4 forms)**

#### P3 - LOW (Configuration + Reports) 🟢
**Budget (4 forms)**, **Purchase Orders (3 forms)**, **Reports (3 forms)**, **Vendors (4 forms)**, **Integration (2 forms)**, **Documents (1 form)**, etc.

**Full inventory in**: `.temp/forms-inventory-FRM9K2.md`

---

## Validation Schema Library

### Directory Structure
```
nextjs/src/lib/validations/
├── index.ts                          # Central export
├── common/
│   ├── address.schemas.ts            # Reusable address validation
│   ├── phone.schemas.ts              # Phone number formatting/validation
│   ├── email.schemas.ts              # Email validation
│   ├── date.schemas.ts               # Date/datetime validation
│   └── file.schemas.ts               # File upload validation
├── entities/
│   ├── student.schemas.ts            # Student entity schemas
│   ├── medication.schemas.ts         # Medication schemas
│   ├── health-record.schemas.ts      # Health record schemas
│   ├── incident.schemas.ts           # Incident schemas
│   ├── appointment.schemas.ts        # Appointment schemas
│   ├── inventory.schemas.ts          # Inventory schemas
│   ├── admin.schemas.ts              # Admin schemas
│   ├── access-control.schemas.ts     # RBAC schemas
│   ├── budget.schemas.ts             # Budget schemas
│   ├── compliance.schemas.ts         # Compliance schemas
│   ├── contact.schemas.ts            # Contact schemas
│   ├── purchase-order.schemas.ts     # Purchase order schemas
│   ├── report.schemas.ts             # Report schemas
│   ├── vendor.schemas.ts             # Vendor schemas
│   ├── integration.schemas.ts        # Integration schemas
│   ├── document.schemas.ts           # Document schemas
│   └── auth.schemas.ts               # Authentication schemas
└── README.md                         # Usage documentation
```

### Common Schemas Implementation

#### `common/phone.schemas.ts`
```typescript
import { z } from 'zod';

/**
 * US Phone Number Schema
 * Accepts formats: (555) 123-4567, 555-123-4567, 5551234567
 */
export const phoneSchema = z
  .string()
  .regex(
    /^(\+1[-.\s]?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
    'Invalid phone number format'
  )
  .transform((val) => val.replace(/\D/g, '')); // Strip formatting

export const optionalPhoneSchema = phoneSchema.optional().or(z.literal(''));

/**
 * Formats phone number to (XXX) XXX-XXXX
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}
```

#### `common/email.schemas.ts`
```typescript
import { z } from 'zod';

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .toLowerCase()
  .trim();

export const optionalEmailSchema = emailSchema.optional().or(z.literal(''));

export const multipleEmailsSchema = z
  .string()
  .refine(
    (val) => {
      const emails = val.split(',').map((e) => e.trim());
      return emails.every((email) => z.string().email().safeParse(email).success);
    },
    { message: 'All email addresses must be valid' }
  );
```

#### `common/date.schemas.ts`
```typescript
import { z } from 'zod';

/**
 * ISO Date String (YYYY-MM-DD)
 */
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .refine((date) => !isNaN(Date.parse(date)), 'Invalid date');

/**
 * ISO DateTime String (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
export const dateTimeSchema = z
  .string()
  .datetime({ message: 'Invalid datetime format' });

/**
 * Date that cannot be in the future
 */
export const pastDateSchema = dateSchema.refine(
  (date) => new Date(date) <= new Date(),
  { message: 'Date cannot be in the future' }
);

/**
 * Date that cannot be in the past
 */
export const futureDateSchema = dateSchema.refine(
  (date) => new Date(date) >= new Date(),
  { message: 'Date cannot be in the past' }
);

/**
 * Date of birth validation (not in future, not too old)
 */
export const dateOfBirthSchema = dateSchema.refine(
  (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 150;
  },
  { message: 'Invalid date of birth' }
);
```

#### `common/address.schemas.ts`
```typescript
import { z } from 'zod';

export const addressSchema = z.object({
  street1: z.string().min(1, 'Street address is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2-letter code'),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  country: z.string().default('US'),
});

export type Address = z.infer<typeof addressSchema>;

export const optionalAddressSchema = addressSchema.partial();
```

### Entity Schemas Implementation

#### `entities/student.schemas.ts`
```typescript
import { z } from 'zod';
import { dateOfBirthSchema, emailSchema, phoneSchema } from '../common';

/**
 * PHI Fields: firstName, lastName, dateOfBirth, ssn, medicalRecordNum
 */
export const studentSchema = z.object({
  // Required fields
  studentNumber: z.string().min(1, 'Student number is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: dateOfBirthSchema,
  grade: z.enum(['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),

  // Optional fields
  middleName: z.string().optional(),
  preferredName: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  medicalRecordNum: z.string().optional(),
  enrollmentDate: z.string().optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  emergencyContactPhone: phoneSchema.optional(),

  // Sensitive fields
  ssn: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in XXX-XX-XXXX format')
    .optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;

/**
 * Schema for student search/filter
 */
export const studentSearchSchema = z.object({
  query: z.string().optional(),
  grade: z.string().optional(),
  enrollmentStatus: z.enum(['active', 'inactive', 'transferred']).optional(),
  schoolId: z.string().optional(),
});

/**
 * Schema for bulk student import
 */
export const studentImportSchema = z.array(
  studentSchema.omit({ ssn: true, medicalRecordNum: true })
);

/**
 * Update schema (all fields optional except ID)
 */
export const updateStudentSchema = studentSchema.partial().extend({
  id: z.string(),
});
```

#### `entities/medication.schemas.ts`
```typescript
import { z } from 'zod';
import { dateSchema, dateTimeSchema } from '../common';

/**
 * ALL FIELDS ARE PHI
 */
export const medicationSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  route: z.enum([
    'oral',
    'topical',
    'inhalation',
    'injection',
    'nasal',
    'ophthalmic',
    'otic',
    'rectal',
    'sublingual',
    'transdermal',
    'other'
  ]),
  frequency: z.string().min(1, 'Frequency is required'),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  instructions: z.string().optional(),
  sideEffects: z.string().optional(),
  contraindications: z.string().optional(),
  prescribingProvider: z.string().min(1, 'Prescribing provider is required'),
  prescriptionDate: dateSchema,
  refillsRemaining: z.number().int().min(0).optional(),
  active: z.boolean().default(true),
});

export type MedicationFormData = z.infer<typeof medicationSchema>;

/**
 * Medication administration schema
 */
export const administrationSchema = z.object({
  medicationId: z.string().min(1, 'Medication is required'),
  studentId: z.string().min(1, 'Student is required'),
  administeredAt: dateTimeSchema,
  administeredBy: z.string().min(1, 'Administered by is required'),
  dosageGiven: z.string().min(1, 'Dosage given is required'),
  notes: z.string().optional(),
  reactions: z.string().optional(),
  witnessed: z.boolean().default(false),
  witnessedBy: z.string().optional(),
});

export type AdministrationFormData = z.infer<typeof administrationSchema>;

/**
 * Prescription schema
 */
export const prescriptionSchema = z.object({
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  route: medicationSchema.shape.route,
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().optional(),
  quantity: z.number().int().min(1, 'Quantity is required'),
  refills: z.number().int().min(0).default(0),
  prescribingProvider: z.string().min(1, 'Provider name is required'),
  providerNPI: z.string().regex(/^\d{10}$/, 'NPI must be 10 digits').optional(),
  prescriptionDate: dateSchema,
  instructions: z.string().min(1, 'Instructions are required'),
  diagnosis: z.string().optional(),
});

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;
```

#### `entities/health-record.schemas.ts`
```typescript
import { z } from 'zod';
import { dateSchema, dateTimeSchema } from '../common';

/**
 * ALL FIELDS ARE PHI
 */

/**
 * Allergy schema
 */
export const allergySchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  allergen: z.string().min(1, 'Allergen is required'),
  type: z.enum(['food', 'medication', 'environmental', 'insect', 'other']),
  severity: z.enum(['mild', 'moderate', 'severe', 'life-threatening']),
  reaction: z.string().min(1, 'Reaction is required'),
  diagnosedDate: dateSchema.optional(),
  notes: z.string().optional(),
  active: z.boolean().default(true),
});

export type AllergyFormData = z.infer<typeof allergySchema>;

/**
 * Medical condition schema
 */
export const conditionSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  condition: z.string().min(1, 'Condition name is required'),
  icd10Code: z
    .string()
    .regex(/^[A-Z]\d{2}(\.\d{1,4})?$/, 'Invalid ICD-10 code')
    .optional(),
  diagnosedDate: dateSchema.optional(),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(),
  status: z.enum(['active', 'resolved', 'managed']).default('active'),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  diagnosedBy: z.string().optional(),
  active: z.boolean().default(true),
});

export type ConditionFormData = z.infer<typeof conditionSchema>;

/**
 * Immunization/vaccination schema
 */
export const immunizationSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  vaccineName: z.string().min(1, 'Vaccine name is required'),
  cvxCode: z.string().optional(), // CVX vaccine code
  administeredDate: dateSchema,
  administeredBy: z.string().optional(),
  manufacturer: z.string().optional(),
  lotNumber: z.string().optional(),
  expirationDate: dateSchema.optional(),
  site: z
    .enum([
      'left_arm',
      'right_arm',
      'left_thigh',
      'right_thigh',
      'oral',
      'nasal',
      'other'
    ])
    .optional(),
  doseNumber: z.number().int().min(1).optional(),
  notes: z.string().optional(),
});

export type ImmunizationFormData = z.infer<typeof immunizationSchema>;

/**
 * Vital signs schema
 */
export const vitalSignsSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  recordedAt: dateTimeSchema,
  recordedBy: z.string().min(1, 'Recorded by is required'),

  // Vital measurements
  temperature: z.number().min(90).max(110).optional(),
  temperatureUnit: z.enum(['F', 'C']).default('F'),
  heartRate: z.number().int().min(30).max(200).optional(),
  bloodPressureSystolic: z.number().int().min(60).max(250).optional(),
  bloodPressureDiastolic: z.number().int().min(40).max(150).optional(),
  respiratoryRate: z.number().int().min(8).max(60).optional(),
  oxygenSaturation: z.number().int().min(70).max(100).optional(),
  height: z.number().min(0).optional(),
  heightUnit: z.enum(['in', 'cm']).default('in'),
  weight: z.number().min(0).optional(),
  weightUnit: z.enum(['lbs', 'kg']).default('lbs'),

  notes: z.string().optional(),
});

export type VitalSignsFormData = z.infer<typeof vitalSignsSchema>;

/**
 * Health screening schema
 */
export const screeningSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  screeningType: z.enum([
    'vision',
    'hearing',
    'dental',
    'scoliosis',
    'bmi',
    'general',
    'other'
  ]),
  screeningDate: dateSchema,
  screenedBy: z.string().min(1, 'Screened by is required'),
  results: z.string().min(1, 'Results are required'),
  passed: z.boolean().optional(),
  followUpRequired: z.boolean().default(false),
  followUpNotes: z.string().optional(),
  referralMade: z.boolean().default(false),
  referralTo: z.string().optional(),
  notes: z.string().optional(),
});

export type ScreeningFormData = z.infer<typeof screeningSchema>;
```

#### `entities/incident.schemas.ts`
```typescript
import { z } from 'zod';
import { dateTimeSchema } from '../common';

/**
 * Extract from existing IncidentReportForm
 * PHI when health-related
 */
export const IncidentType = z.enum([
  'INJURY',
  'ILLNESS',
  'BEHAVIORAL',
  'MEDICATION_ERROR',
  'ALLERGIC_REACTION',
  'EMERGENCY',
  'OTHER'
]);

export const IncidentSeverity = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const incidentSchema = z.object({
  studentId: z.string().min(1, 'Student selection is required'),
  type: IncidentType,
  severity: IncidentSeverity,
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description too long'),
  location: z.string().min(1, 'Location is required'),
  occurredAt: dateTimeSchema,
  actionsTaken: z
    .string()
    .min(10, 'Actions taken must be at least 10 characters')
    .max(5000, 'Actions taken too long'),
  followUpRequired: z.boolean().default(false),
  followUpNotes: z.string().optional(),
  parentNotified: z.boolean().default(false),
  parentNotificationMethod: z
    .enum(['email', 'sms', 'voice', 'in-person'])
    .optional(),
  reportedById: z.string().optional(), // Set server-side from auth
});

export type IncidentFormData = z.infer<typeof incidentSchema>;

/**
 * Witness statement schema
 */
export const witnessStatementSchema = z.object({
  incidentId: z.string().min(1, 'Incident is required'),
  witnessName: z.string().min(1, 'Witness name is required'),
  witnessRole: z
    .enum(['staff', 'teacher', 'student', 'parent', 'other'])
    .optional(),
  statement: z
    .string()
    .min(20, 'Statement must be at least 20 characters')
    .max(5000, 'Statement too long'),
  recordedAt: dateTimeSchema,
  recordedBy: z.string().optional(),
});

export type WitnessStatementFormData = z.infer<typeof witnessStatementSchema>;

/**
 * Follow-up action schema
 */
export const followUpActionSchema = z.object({
  incidentId: z.string().min(1, 'Incident is required'),
  action: z.string().min(1, 'Action is required'),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
  status: z
    .enum(['pending', 'in-progress', 'completed', 'cancelled'])
    .default('pending'),
  notes: z.string().optional(),
  completedAt: dateTimeSchema.optional(),
  completedBy: z.string().optional(),
});

export type FollowUpActionFormData = z.infer<typeof followUpActionSchema>;
```

#### `entities/appointment.schemas.ts`
```typescript
import { z } from 'zod';
import { dateSchema } from '../common';

/**
 * Extract from AppointmentFormModal
 */
export const appointmentSchema = z.object({
  studentId: z.string().min(1, 'Student selection is required'),
  appointmentDate: dateSchema.refine(
    (date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
    { message: 'Past date is not allowed' }
  ),
  appointmentTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format')
    .refine(
      (time) => {
        const [hours] = time.split(':').map(Number);
        return hours >= 8 && hours < 17;
      },
      { message: 'Appointment must be within business hours (8 AM - 5 PM)' }
    ),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute'),
  type: z.enum([
    'ROUTINE_CHECKUP',
    'MEDICATION_ADMINISTRATION',
    'INJURY_ASSESSMENT',
    'ILLNESS_EVALUATION',
    'FOLLOW_UP',
    'SCREENING',
    'EMERGENCY'
  ]),
  reason: z.string().min(1, 'Reason is required'),
  notes: z
    .string()
    .max(1000, 'Notes are too long (maximum 1000 characters)')
    .optional(),
  location: z
    .enum(['nurses_office', 'exam_room_1', 'exam_room_2'])
    .optional(),
  recurring: z.boolean().default(false),
  frequency: z
    .enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY'])
    .optional(),
  recurringEndDate: z.string().optional(),
}).refine(
  (data) => {
    if (data.recurring && !data.recurringEndDate) {
      return false;
    }
    return true;
  },
  {
    message: 'End date is required for recurring appointments',
    path: ['recurringEndDate'],
  }
);

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

/**
 * Update appointment schema
 */
export const updateAppointmentSchema = appointmentSchema.partial().extend({
  id: z.string(),
});
```

### Schema Export Pattern

#### `index.ts`
```typescript
// Common schemas
export * from './common/address.schemas';
export * from './common/date.schemas';
export * from './common/email.schemas';
export * from './common/phone.schemas';
export * from './common/file.schemas';

// Entity schemas
export * from './entities/student.schemas';
export * from './entities/medication.schemas';
export * from './entities/health-record.schemas';
export * from './entities/incident.schemas';
export * from './entities/appointment.schemas';
export * from './entities/inventory.schemas';
export * from './entities/admin.schemas';
export * from './entities/access-control.schemas';
export * from './entities/budget.schemas';
export * from './entities/compliance.schemas';
export * from './entities/contact.schemas';
export * from './entities/purchase-order.schemas';
export * from './entities/report.schemas';
export * from './entities/vendor.schemas';
export * from './entities/integration.schemas';
export * from './entities/document.schemas';
export * from './entities/auth.schemas';
```

---

## Form Component Library

### Directory Structure
```
nextjs/src/components/forms/
├── index.ts                          # Central export
├── FormField.tsx                     # Wrapper component
├── inputs/
│   ├── FormInput.tsx                 # Text input
│   ├── FormTextArea.tsx              # Textarea
│   ├── FormSelect.tsx                # Dropdown
│   ├── FormCheckbox.tsx              # Checkbox
│   ├── FormRadioGroup.tsx            # Radio group
│   ├── FormDatePicker.tsx            # Date picker
│   ├── FormTimePicker.tsx            # Time picker
│   ├── FormPhoneInput.tsx            # Phone with formatting
│   ├── FormEmailInput.tsx            # Email with validation
│   ├── FormPasswordInput.tsx         # Password with toggle
│   ├── FormFileUpload.tsx            # File upload
│   ├── FormNumberInput.tsx           # Number input
│   └── FormSearchSelect.tsx          # Searchable dropdown
├── compound/
│   ├── FormAddressFields.tsx         # Address field group
│   ├── FormDateTimeFields.tsx        # Date + time combo
│   └── FormNameFields.tsx            # First/middle/last name
└── __tests__/
    └── *.test.tsx                    # Component tests
```

### Core Components

#### `FormField.tsx`
```typescript
'use client';

import React from 'react';
import { FieldError } from 'react-hook-form';
import { AlertCircle, HelpCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  error?: FieldError;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * FormField - Wrapper component for all form inputs
 *
 * Provides:
 * - Label with required indicator
 * - Error message display with ARIA
 * - Hint/description text
 * - Consistent styling
 */
export function FormField({
  label,
  name,
  error,
  hint,
  required = false,
  children,
  className = '',
}: FormFieldProps) {
  const errorId = error ? `${name}-error` : undefined;
  const hintId = hint ? `${name}-hint` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ');

  return (
    <div className={`form-field ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        {hint && (
          <span className="ml-2 text-gray-500">
            <HelpCircle className="h-4 w-4 inline" aria-label="help" />
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-xs text-gray-500 mb-2">
          {hint}
        </p>
      )}

      <div className="form-input-wrapper">
        {React.cloneElement(children as React.ReactElement, {
          id: name,
          name,
          'aria-invalid': error ? 'true' : 'false',
          'aria-describedby': describedBy || undefined,
        })}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-red-600 text-sm mt-1 flex items-center gap-1"
        >
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {error.message}
        </p>
      )}
    </div>
  );
}
```

#### `inputs/FormInput.tsx`
```typescript
'use client';

import React, { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn;
  error?: boolean;
}

/**
 * FormInput - Text input component with React Hook Form integration
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ register, error, className = '', ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed';
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-primary-500';

    const combinedClasses = `${baseClasses} ${errorClasses} ${className}`;

    return (
      <input
        ref={ref}
        {...register}
        {...props}
        className={combinedClasses}
      />
    );
  }
);

FormInput.displayName = 'FormInput';
```

#### `inputs/FormSelect.tsx`
```typescript
'use client';

import React, { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  register?: UseFormRegisterReturn;
  error?: boolean;
  options: FormSelectOption[];
  placeholder?: string;
}

/**
 * FormSelect - Dropdown component with React Hook Form integration
 */
export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ register, error, options, placeholder, className = '', ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed';
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-primary-500';

    const combinedClasses = `${baseClasses} ${errorClasses} ${className}`;

    return (
      <select
        ref={ref}
        {...register}
        {...props}
        className={combinedClasses}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

FormSelect.displayName = 'FormSelect';
```

#### `inputs/FormTextArea.tsx`
```typescript
'use client';

import React, { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  register?: UseFormRegisterReturn;
  error?: boolean;
  showCharCount?: boolean;
  currentLength?: number;
}

/**
 * FormTextArea - Textarea component with React Hook Form integration
 */
export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ register, error, showCharCount, currentLength, maxLength, className = '', ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y';
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-primary-500';

    const combinedClasses = `${baseClasses} ${errorClasses} ${className}`;

    return (
      <div className="relative">
        <textarea
          ref={ref}
          {...register}
          {...props}
          maxLength={maxLength}
          className={combinedClasses}
        />
        {showCharCount && maxLength && (
          <p className="text-xs text-gray-500 mt-1 text-right">
            {currentLength || 0}/{maxLength} characters
          </p>
        )}
      </div>
    );
  }
);

FormTextArea.displayName = 'FormTextArea';
```

#### `inputs/FormCheckbox.tsx`
```typescript
'use client';

import React, { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn;
  label: string;
  description?: string;
}

/**
 * FormCheckbox - Checkbox component with label and description
 */
export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ register, label, description, className = '', ...props }, ref) => {
    return (
      <div className={`flex items-start ${className}`}>
        <div className="flex items-center h-5">
          <input
            ref={ref}
            {...register}
            {...props}
            type="checkbox"
            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <div className="ml-3">
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            {label}
          </label>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';
```

#### `inputs/FormDatePicker.tsx`
```typescript
'use client';

import React, { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormDatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  register?: UseFormRegisterReturn;
  error?: boolean;
  includeTime?: boolean;
}

/**
 * FormDatePicker - Date/datetime input component
 */
export const FormDatePicker = forwardRef<HTMLInputElement, FormDatePickerProps>(
  ({ register, error, includeTime = false, className = '', ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed';
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-primary-500';

    const combinedClasses = `${baseClasses} ${errorClasses} ${className}`;

    return (
      <input
        ref={ref}
        {...register}
        {...props}
        type={includeTime ? 'datetime-local' : 'date'}
        className={combinedClasses}
      />
    );
  }
);

FormDatePicker.displayName = 'FormDatePicker';
```

#### `inputs/FormPhoneInput.tsx`
```typescript
'use client';

import React, { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { formatPhone } from '@/lib/validations';

interface FormPhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  register?: UseFormRegisterReturn;
  error?: boolean;
  autoFormat?: boolean;
}

/**
 * FormPhoneInput - Phone input with automatic formatting
 */
export const FormPhoneInput = forwardRef<HTMLInputElement, FormPhoneInputProps>(
  ({ register, error, autoFormat = true, onChange, className = '', ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed';
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-primary-500';

    const combinedClasses = `${baseClasses} ${errorClasses} ${className}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (autoFormat) {
        const formatted = formatPhone(e.target.value);
        e.target.value = formatted;
      }
      onChange?.(e);
    };

    return (
      <input
        ref={ref}
        {...register}
        {...props}
        type="tel"
        placeholder="(555) 123-4567"
        onChange={handleChange}
        className={combinedClasses}
      />
    );
  }
);

FormPhoneInput.displayName = 'FormPhoneInput';
```

### Compound Components

#### `compound/FormAddressFields.tsx`
```typescript
'use client';

import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { FormField } from '../FormField';
import { FormInput, FormSelect } from '../inputs';

interface FormAddressFieldsProps {
  control: Control<any>;
  errors: FieldErrors;
  namePrefix?: string;
  required?: boolean;
}

/**
 * FormAddressFields - Compound component for address entry
 */
export function FormAddressFields({
  control,
  errors,
  namePrefix = 'address',
  required = false,
}: FormAddressFieldsProps) {
  const US_STATES = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    // ... all states
    { value: 'WY', label: 'Wyoming' },
  ];

  return (
    <div className="space-y-4">
      <FormField
        label="Street Address"
        name={`${namePrefix}.street1`}
        error={errors[namePrefix]?.street1 as any}
        required={required}
      >
        <Controller
          name={`${namePrefix}.street1`}
          control={control}
          render={({ field }) => (
            <FormInput {...field} placeholder="123 Main St" />
          )}
        />
      </FormField>

      <FormField
        label="Apartment, Suite, etc."
        name={`${namePrefix}.street2`}
        error={errors[namePrefix]?.street2 as any}
      >
        <Controller
          name={`${namePrefix}.street2`}
          control={control}
          render={({ field }) => (
            <FormInput {...field} placeholder="Apt 4B" />
          )}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="City"
          name={`${namePrefix}.city`}
          error={errors[namePrefix]?.city as any}
          required={required}
        >
          <Controller
            name={`${namePrefix}.city`}
            control={control}
            render={({ field }) => (
              <FormInput {...field} placeholder="City" />
            )}
          />
        </FormField>

        <FormField
          label="State"
          name={`${namePrefix}.state`}
          error={errors[namePrefix]?.state as any}
          required={required}
        >
          <Controller
            name={`${namePrefix}.state`}
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                options={US_STATES}
                placeholder="Select state"
              />
            )}
          />
        </FormField>

        <FormField
          label="ZIP Code"
          name={`${namePrefix}.zipCode`}
          error={errors[namePrefix]?.zipCode as any}
          required={required}
        >
          <Controller
            name={`${namePrefix}.zipCode`}
            control={control}
            render={({ field }) => (
              <FormInput {...field} placeholder="12345" maxLength={10} />
            )}
          />
        </FormField>
      </div>
    </div>
  );
}
```

---

## HIPAA Compliance Implementation

### Audit Logging Utility

#### `lib/audit-form.ts`
```typescript
'use server';

import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { headers } from 'next/headers';

/**
 * PHI field markers by entity type
 */
const PHI_FIELDS = {
  student: [
    'firstName',
    'lastName',
    'middleName',
    'preferredName',
    'dateOfBirth',
    'ssn',
    'medicalRecordNum',
    'email',
    'phone',
    'emergencyContactPhone'
  ],
  medication: ['ALL'], // All medication fields are PHI
  healthRecord: ['ALL'], // All health record fields are PHI
  incident: [
    'description',
    'actionsTaken',
    'followUpNotes'
  ], // PHI when health-related
  appointment: [
    'reason',
    'notes'
  ], // PHI for health appointments
};

interface FormAuditOptions {
  action: keyof typeof AUDIT_ACTIONS;
  resource: string;
  resourceId?: string;
  formData: Record<string, any>;
  entityType: keyof typeof PHI_FIELDS;
  success: boolean;
  errorMessage?: string;
  userId?: string;
}

/**
 * Audit log form submission with PHI tracking
 */
export async function auditFormSubmission({
  action,
  resource,
  resourceId,
  formData,
  entityType,
  success,
  errorMessage,
  userId,
}: FormAuditOptions): Promise<void> {
  const headersList = headers();
  const ipAddress = headersList.get('x-forwarded-for') || 'unknown';
  const userAgent = headersList.get('user-agent') || 'unknown';

  // Determine which fields contain PHI
  const phiFieldsAccessed = PHI_FIELDS[entityType];
  const isPHI = phiFieldsAccessed.includes('ALL') ||
                phiFieldsAccessed.some(field => formData[field] !== undefined);

  // Filter out actual PHI data from audit log (only log field names)
  const sanitizedData = isPHI
    ? { phiFields: Object.keys(formData).filter(key =>
        phiFieldsAccessed.includes('ALL') || phiFieldsAccessed.includes(key)
      )}
    : { fields: Object.keys(formData) };

  await auditLog({
    userId: userId || 'unknown',
    action: AUDIT_ACTIONS[action],
    resource,
    resourceId,
    ipAddress,
    userAgent,
    success,
    errorMessage,
    metadata: {
      ...sanitizedData,
      phiAccessed: isPHI,
      formType: entityType,
    },
  });
}
```

### Form Submission Pattern with HIPAA Audit

#### Example: Student Form Server Action
```typescript
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { studentSchema, type StudentFormData } from '@/lib/validations';
import { auditFormSubmission } from '@/lib/audit-form';
import { apiClient } from '@/services/core/ApiClient';
import { getCurrentUser } from '@/lib/auth';

interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Create student with HIPAA audit logging
 */
export async function createStudentAction(
  data: StudentFormData
): Promise<ActionResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // 1. Validate with Zod
    const validated = studentSchema.parse(data);

    // 2. Create student via API
    const response = await apiClient.post('/students', validated);

    // 3. HIPAA Audit Log
    await auditFormSubmission({
      action: 'CREATE',
      resource: 'Student',
      resourceId: response.data.id,
      formData: validated,
      entityType: 'student',
      success: true,
      userId: user.id,
    });

    // 4. Revalidate cache
    revalidatePath('/students');

    // 5. Return success
    return { success: true, data: response.data };
  } catch (error: any) {
    // Log failure
    await auditFormSubmission({
      action: 'CREATE',
      resource: 'Student',
      formData: data,
      entityType: 'student',
      success: false,
      errorMessage: error.message,
      userId: user.id,
    });

    return {
      success: false,
      error: error.message || 'Failed to create student',
    };
  }
}

/**
 * Update student with HIPAA audit logging
 */
export async function updateStudentAction(
  id: string,
  data: Partial<StudentFormData>
): Promise<ActionResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // 1. Validate with Zod
    const validated = studentSchema.partial().parse(data);

    // 2. Update student via API
    const response = await apiClient.put(`/students/${id}`, validated);

    // 3. HIPAA Audit Log
    await auditFormSubmission({
      action: 'UPDATE',
      resource: 'Student',
      resourceId: id,
      formData: validated,
      entityType: 'student',
      success: true,
      userId: user.id,
    });

    // 4. Revalidate cache
    revalidatePath(`/students/${id}`);
    revalidatePath('/students');

    // 5. Return success
    return { success: true, data: response.data };
  } catch (error: any) {
    // Log failure
    await auditFormSubmission({
      action: 'UPDATE',
      resource: 'Student',
      resourceId: id,
      formData: data,
      entityType: 'student',
      success: false,
      errorMessage: error.message,
      userId: user.id,
    });

    return {
      success: false,
      error: error.message || 'Failed to update student',
    };
  }
}
```

### Session Timeout Handler

#### `hooks/useFormSessionTimeout.ts`
```typescript
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface UseFormSessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onTimeout?: () => void;
  onWarning?: () => void;
}

/**
 * Hook to handle session timeout for forms containing PHI
 *
 * Default: 15 minute timeout with 2 minute warning
 */
export function useFormSessionTimeout({
  timeoutMinutes = 15,
  warningMinutes = 2,
  onTimeout,
  onWarning,
}: UseFormSessionTimeoutOptions = {}) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;

    // Set warning timer
    warningRef.current = setTimeout(() => {
      toast.error(
        `Session will timeout in ${warningMinutes} minutes. Please save your work.`,
        { duration: 10000 }
      );
      onWarning?.();
    }, warningMs);

    // Set timeout timer
    timeoutRef.current = setTimeout(() => {
      toast.error('Session expired. Please log in again.');
      onTimeout?.();
      router.push('/session-expired');
    }, timeoutMs);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [timeoutMinutes, warningMinutes, router, onTimeout, onWarning]);

  // Reset timeout on user activity
  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;

    warningRef.current = setTimeout(() => {
      toast.error(
        `Session will timeout in ${warningMinutes} minutes.`,
        { duration: 10000 }
      );
      onWarning?.();
    }, warningMs);

    timeoutRef.current = setTimeout(() => {
      toast.error('Session expired.');
      onTimeout?.();
      router.push('/session-expired');
    }, timeoutMs);
  };

  return { resetTimeout };
}
```

---

## Migration Strategy

### Phase-Based Approach

#### Phase 1: Foundation (Week 1)
1. Create validation schema library structure
2. Implement all common schemas (phone, email, date, address)
3. Build form component library
4. Implement HIPAA audit utilities
5. Write tests for schemas and components

**Deliverables**:
- Complete validation schema library
- Complete form component library
- Audit logging utilities
- Test suite

#### Phase 2: P0 PHI Forms (Weeks 2-3)
1. Migrate Student forms (3 forms)
2. Migrate Health Records forms (9 forms)
3. Migrate Medication forms (5 forms)
4. Create corresponding server actions
5. Add HIPAA audit logging to all

**Deliverables**:
- 17 migrated PHI forms
- Server actions for all P0 forms
- HIPAA compliance verified

#### Phase 3: P1 High Traffic (Week 4)
1. Migrate remaining Incident forms (5 forms)
2. Migrate Appointment form
3. Migrate Login form
4. Create server actions
5. Add conditional audit logging

**Deliverables**:
- 7 additional migrated forms
- Server actions
- Authentication flow updated

#### Phase 4: P2 Operational (Week 5)
1. Migrate Admin forms (4 forms)
2. Migrate key Inventory forms (3 forms)
3. Migrate Compliance forms (4 forms)
4. Migrate Contact forms (2 forms)

**Deliverables**:
- 13 operational forms migrated
- Server actions created

#### Phase 5: P3 Remaining (Weeks 6-8)
1. Migrate all remaining forms (43 forms)
2. Batch create server actions
3. Comprehensive testing

**Deliverables**:
- All 83 forms migrated
- Complete test coverage
- Final HIPAA compliance audit

### Per-Form Migration Checklist

For each form migration:
- [ ] Analyze current validation logic
- [ ] Create or identify Zod schema
- [ ] Replace useState with React Hook Form
- [ ] Replace validation with zodResolver
- [ ] Update UI to use form components
- [ ] Create server action for submission
- [ ] Add HIPAA audit logging (if PHI)
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Verify accessibility (ARIA, keyboard navigation)
- [ ] Test on mobile devices
- [ ] Document usage and examples
- [ ] Code review
- [ ] Deploy and monitor

---

## Implementation Examples

### Complete Form Migration Example: Student Form

#### Before (Manual Controlled State)
```typescript
// OLD: StudentFormModal.tsx (manual state management)
import React from 'react';

export const StudentFormModal = ({ show, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    // ... many fields
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Manual validation
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'Required';
    if (!formData.lastName) newErrors.lastName = 'Required';
    // ... many validation checks

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await studentsApi.createStudent(formData);
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.firstName}
        onChange={(e) => handleInputChange('firstName', e.target.value)}
      />
      {errors.firstName && <span>{errors.firstName}</span>}
      {/* ... many fields */}
    </form>
  );
};
```

#### After (React Hook Form + Zod)
```typescript
// NEW: StudentForm.tsx (React Hook Form + Zod)
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, type StudentFormData } from '@/lib/validations';
import { createStudentAction, updateStudentAction } from '@/actions/students.actions';
import {
  FormField,
  FormInput,
  FormSelect,
  FormDatePicker,
  FormPhoneInput,
  FormEmailInput,
} from '@/components/forms';
import toast from 'react-hot-toast';

interface StudentFormProps {
  student?: Student;
  onSuccess?: (student: Student) => void;
  onCancel?: () => void;
}

export function StudentForm({ student, onSuccess, onCancel }: StudentFormProps) {
  const isEditMode = !!student;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {
      studentNumber: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      grade: 'K',
    },
  });

  async function onSubmit(data: StudentFormData) {
    const result = isEditMode
      ? await updateStudentAction(student.id, data)
      : await createStudentAction(data);

    if (result.success) {
      toast.success(
        isEditMode ? 'Student updated successfully' : 'Student created successfully'
      );
      onSuccess?.(result.data);
      if (!isEditMode) reset();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {isEditMode ? 'Edit Student' : 'Add New Student'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {isEditMode
            ? 'Update student information below'
            : 'Complete all required fields to create a new student'
          }
        </p>
      </div>

      {/* Student Number */}
      <FormField
        label="Student Number"
        name="studentNumber"
        error={errors.studentNumber}
        required
        hint="Unique identifier for the student"
      >
        <FormInput {...register('studentNumber')} error={!!errors.studentNumber} />
      </FormField>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="First Name"
          name="firstName"
          error={errors.firstName}
          required
        >
          <FormInput {...register('firstName')} error={!!errors.firstName} />
        </FormField>

        <FormField label="Middle Name" name="middleName" error={errors.middleName}>
          <FormInput {...register('middleName')} error={!!errors.middleName} />
        </FormField>

        <FormField
          label="Last Name"
          name="lastName"
          error={errors.lastName}
          required
        >
          <FormInput {...register('lastName')} error={!!errors.lastName} />
        </FormField>
      </div>

      {/* Date of Birth & Grade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          error={errors.dateOfBirth}
          required
        >
          <FormDatePicker
            {...register('dateOfBirth')}
            error={!!errors.dateOfBirth}
          />
        </FormField>

        <FormField
          label="Grade Level"
          name="grade"
          error={errors.grade}
          required
        >
          <FormSelect
            {...register('grade')}
            error={!!errors.grade}
            options={[
              { value: 'K', label: 'Kindergarten' },
              { value: '1', label: '1st Grade' },
              { value: '2', label: '2nd Grade' },
              // ... all grades
              { value: '12', label: '12th Grade' },
            ]}
          />
        </FormField>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Email" name="email" error={errors.email}>
          <FormEmailInput {...register('email')} error={!!errors.email} />
        </FormField>

        <FormField label="Phone" name="phone" error={errors.phone}>
          <FormPhoneInput
            {...register('phone')}
            error={!!errors.phone}
            autoFormat
          />
        </FormField>
      </div>

      {/* Medical Record Number */}
      <FormField
        label="Medical Record Number"
        name="medicalRecordNum"
        error={errors.medicalRecordNum}
        hint="Optional - links to external health systems"
      >
        <FormInput
          {...register('medicalRecordNum')}
          error={!!errors.medicalRecordNum}
        />
      </FormField>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting && <span className="animate-spin">⏳</span>}
          {isSubmitting
            ? (isEditMode ? 'Updating...' : 'Creating...')
            : (isEditMode ? 'Update Student' : 'Create Student')
          }
        </button>
      </div>
    </form>
  );
}
```

#### Corresponding Server Action
```typescript
// actions/students.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { studentSchema, type StudentFormData } from '@/lib/validations';
import { auditFormSubmission } from '@/lib/audit-form';
import { apiClient } from '@/services/core/ApiClient';
import { getCurrentUser } from '@/lib/auth';

interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createStudentAction(
  data: StudentFormData
): Promise<ActionResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Validate
    const validated = studentSchema.parse(data);

    // Create
    const response = await apiClient.post('/students', validated);

    // Audit (HIPAA)
    await auditFormSubmission({
      action: 'CREATE',
      resource: 'Student',
      resourceId: response.data.id,
      formData: validated,
      entityType: 'student',
      success: true,
      userId: user.id,
    });

    // Revalidate
    revalidatePath('/students');

    return { success: true, data: response.data };
  } catch (error: any) {
    await auditFormSubmission({
      action: 'CREATE',
      resource: 'Student',
      formData: data,
      entityType: 'student',
      success: false,
      errorMessage: error.message,
      userId: user.id,
    });

    return {
      success: false,
      error: error.message || 'Failed to create student',
    };
  }
}
```

### Benefits of New Approach

#### Code Comparison
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Lines of Code | ~206 | ~150 | -27% |
| Manual Validation | Yes (50+ lines) | No (Zod schema) | Eliminated |
| Type Safety | Partial | Full | 100% |
| Error Handling | Manual | Automatic | Consistent |
| HIPAA Audit | No | Yes | Compliance |
| Reusability | Low | High | Components |
| Accessibility | Basic | Full ARIA | Enhanced |
| Testing | Hard | Easy | Test schemas + components |

#### Developer Experience Improvements
- **Type Safety**: Full TypeScript inference from Zod schemas
- **Validation**: Centralized, reusable, testable
- **Less Boilerplate**: React Hook Form handles state
- **Better UX**: Immediate validation feedback
- **Maintainability**: Reusable form components
- **Compliance**: Built-in HIPAA audit logging
- **Testing**: Easy to test schemas and components independently

---

## Testing Strategy

### Validation Schema Tests

#### Example: `student.schemas.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { studentSchema } from '@/lib/validations';

describe('studentSchema', () => {
  it('validates a complete student object', () => {
    const validStudent = {
      studentNumber: '12345',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2010-01-15',
      grade: '5',
    };

    const result = studentSchema.safeParse(validStudent);
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const invalidStudent = {
      studentNumber: '12345',
      // Missing firstName, lastName, dateOfBirth, grade
    };

    const result = studentSchema.safeParse(invalidStudent);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors).toHaveLength(4);
    }
  });

  it('validates date of birth format', () => {
    const invalidStudent = {
      studentNumber: '12345',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '01/15/2010', // Wrong format
      grade: '5',
    };

    const result = studentSchema.safeParse(invalidStudent);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].path).toContain('dateOfBirth');
    }
  });

  it('validates phone number format', () => {
    const studentWithPhone = {
      studentNumber: '12345',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2010-01-15',
      grade: '5',
      phone: '(555) 123-4567',
    };

    const result = studentSchema.safeParse(studentWithPhone);
    expect(result.success).toBe(true);
  });

  it('rejects invalid phone number format', () => {
    const studentWithBadPhone = {
      studentNumber: '12345',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2010-01-15',
      grade: '5',
      phone: '123', // Invalid
    };

    const result = studentSchema.safeParse(studentWithBadPhone);
    expect(result.success).toBe(false);
  });

  it('validates SSN format', () => {
    const studentWithSSN = {
      studentNumber: '12345',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2010-01-15',
      grade: '5',
      ssn: '123-45-6789',
    };

    const result = studentSchema.safeParse(studentWithSSN);
    expect(result.success).toBe(true);
  });

  it('rejects invalid SSN format', () => {
    const studentWithBadSSN = {
      studentNumber: '12345',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2010-01-15',
      grade: '5',
      ssn: '123456789', // Missing hyphens
    };

    const result = studentSchema.safeParse(studentWithBadSSN);
    expect(result.success).toBe(false);
  });
});
```

### Form Component Tests

#### Example: `FormInput.test.tsx`
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/forms';

// Test wrapper component
function TestForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput {...register('testField')} placeholder="Test input" />
      <button type="submit">Submit</button>
    </form>
  );
}

describe('FormInput', () => {
  it('renders input with placeholder', () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('Test input');
    expect(input).toBeInTheDocument();
  });

  it('updates value on user input', () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('Test input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(input.value).toBe('test value');
  });

  it('submits form with correct value', async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('Test input');
    const button = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'test value' } });
    fireEvent.click(button);

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ testField: 'test value' })
      );
    });
  });

  it('applies error styles when error prop is true', () => {
    render(<FormInput error={true} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  it('applies normal styles when error prop is false', () => {
    render(<FormInput error={false} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-gray-300');
  });
});
```

### Integration Tests

#### Example: `StudentForm.integration.test.tsx`
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudentForm } from '@/components/forms/StudentForm';
import { createStudentAction } from '@/actions/students.actions';

// Mock server action
vi.mock('@/actions/students.actions', () => ({
  createStudentAction: vi.fn(),
}));

describe('StudentForm Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully creates a student with valid data', async () => {
    const mockStudent = {
      id: '123',
      studentNumber: '12345',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2010-01-15',
      grade: '5',
    };

    (createStudentAction as any).mockResolvedValue({
      success: true,
      data: mockStudent,
    });

    const onSuccess = vi.fn();
    render(<StudentForm onSuccess={onSuccess} />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/student number/i), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: '2010-01-15' },
    });
    fireEvent.change(screen.getByLabelText(/grade/i), {
      target: { value: '5' },
    });

    // Submit
    fireEvent.click(screen.getByText(/create student/i));

    await waitFor(() => {
      expect(createStudentAction).toHaveBeenCalledWith(
        expect.objectContaining({
          studentNumber: '12345',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '2010-01-15',
          grade: '5',
        })
      );
      expect(onSuccess).toHaveBeenCalledWith(mockStudent);
    });
  });

  it('displays validation errors for invalid data', async () => {
    render(<StudentForm />);

    // Submit without filling form
    fireEvent.click(screen.getByText(/create student/i));

    await waitFor(() => {
      expect(screen.getByText(/student number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date of birth/i)).toBeInTheDocument();
      expect(screen.getByText(/grade/i)).toBeInTheDocument();
    });

    expect(createStudentAction).not.toHaveBeenCalled();
  });

  it('displays server error on submission failure', async () => {
    (createStudentAction as any).mockResolvedValue({
      success: false,
      error: 'Student number already exists',
    });

    render(<StudentForm />);

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/student number/i), {
      target: { value: '12345' },
    });
    // ... fill other fields
    fireEvent.click(screen.getByText(/create student/i));

    await waitFor(() => {
      expect(screen.getByText(/student number already exists/i)).toBeInTheDocument();
    });
  });
});
```

### HIPAA Compliance Tests

#### Example: `audit-form.test.ts`
```typescript
import { describe, it, expect, vi } from 'vitest';
import { auditFormSubmission } from '@/lib/audit-form';
import { auditLog } from '@/lib/audit';

vi.mock('@/lib/audit', () => ({
  auditLog: vi.fn(),
  AUDIT_ACTIONS: {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
  },
}));

describe('auditFormSubmission', () => {
  it('logs PHI access for student forms', async () => {
    await auditFormSubmission({
      action: 'CREATE',
      resource: 'Student',
      resourceId: '123',
      formData: {
        studentNumber: '12345',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2010-01-15',
        grade: '5',
      },
      entityType: 'student',
      success: true,
      userId: 'user-123',
    });

    expect(auditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-123',
        action: 'CREATE',
        resource: 'Student',
        resourceId: '123',
        success: true,
        metadata: expect.objectContaining({
          phiAccessed: true,
          phiFields: expect.arrayContaining([
            'firstName',
            'lastName',
            'dateOfBirth',
          ]),
        }),
      })
    );
  });

  it('logs ALL fields as PHI for medication forms', async () => {
    await auditFormSubmission({
      action: 'CREATE',
      resource: 'Medication',
      resourceId: '456',
      formData: {
        studentId: '123',
        name: 'Aspirin',
        dosage: '100mg',
      },
      entityType: 'medication',
      success: true,
      userId: 'user-123',
    });

    expect(auditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          phiAccessed: true,
          phiFields: ['studentId', 'name', 'dosage'],
        }),
      })
    );
  });

  it('logs failures with error messages', async () => {
    await auditFormSubmission({
      action: 'CREATE',
      resource: 'Student',
      formData: { firstName: 'John' },
      entityType: 'student',
      success: false,
      errorMessage: 'Validation failed',
      userId: 'user-123',
    });

    expect(auditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        errorMessage: 'Validation failed',
      })
    );
  });
});
```

### Test Coverage Goals

| Category | Target Coverage | Status |
|----------|----------------|---------|
| Validation Schemas | 100% | Pending |
| Form Components | 95% | Pending |
| Server Actions | 90% | Pending |
| Integration Tests | Key flows | Pending |
| HIPAA Compliance | 100% | Pending |
| Accessibility | Full ARIA | Pending |

---

## Developer Guidelines

### Quick Start for Migrating a Form

#### Step 1: Create/Identify Zod Schema
```bash
# If schema doesn't exist, create it
cd nextjs/src/lib/validations/entities
# Create or update schema file
```

#### Step 2: Convert Form Component
```typescript
// Replace useState with React Hook Form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { myEntitySchema } from '@/lib/validations';

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm({
  resolver: zodResolver(myEntitySchema),
  defaultValues: /* ... */,
});
```

#### Step 3: Replace Input Fields
```typescript
// OLD
<input
  value={formData.fieldName}
  onChange={(e) => handleChange('fieldName', e.target.value)}
/>
{errors.fieldName && <span>{errors.fieldName}</span>}

// NEW
<FormField label="Field Name" name="fieldName" error={errors.fieldName} required>
  <FormInput {...register('fieldName')} error={!!errors.fieldName} />
</FormField>
```

#### Step 4: Create Server Action
```typescript
// actions/my-entity.actions.ts
'use server';

export async function createMyEntityAction(data: MyEntityFormData) {
  // 1. Validate
  // 2. Create
  // 3. Audit log (if PHI)
  // 4. Revalidate
  // 5. Return result
}
```

#### Step 5: Update Form Submission
```typescript
async function onSubmit(data: MyEntityFormData) {
  const result = await createMyEntityAction(data);

  if (result.success) {
    toast.success('Success!');
    onSuccess?.(result.data);
  } else {
    toast.error(result.error);
  }
}
```

#### Step 6: Test
```bash
# Run tests
npm run test

# Test in browser
npm run dev
```

### Common Patterns

#### Conditional Fields
```typescript
const watchFollowUpRequired = watch('followUpRequired');

{watchFollowUpRequired && (
  <FormField label="Follow-up Notes" name="followUpNotes">
    <FormTextArea {...register('followUpNotes')} />
  </FormField>
)}
```

#### Dynamic Field Arrays
```typescript
import { useFieldArray } from 'react-hook-form';

const { fields, append, remove } = useFieldArray({
  control,
  name: 'medications',
});

{fields.map((field, index) => (
  <div key={field.id}>
    <FormField
      label={`Medication ${index + 1}`}
      name={`medications.${index}.name`}
    >
      <FormInput {...register(`medications.${index}.name`)} />
    </FormField>
    <button onClick={() => remove(index)}>Remove</button>
  </div>
))}

<button onClick={() => append({ name: '' })}>Add Medication</button>
```

#### File Upload
```typescript
const { register } = useForm();

<FormField label="Upload File" name="file">
  <input
    type="file"
    {...register('file')}
    accept=".pdf,.jpg,.png"
  />
</FormField>
```

### Troubleshooting

#### Issue: Validation Not Triggering
**Solution**: Ensure zodResolver is passed to useForm
```typescript
const { register, handleSubmit } = useForm({
  resolver: zodResolver(mySchema), // Must include this
});
```

#### Issue: Default Values Not Working
**Solution**: Ensure defaultValues match schema shape
```typescript
const { register } = useForm({
  defaultValues: {
    // All fields must match schema
    field1: '',
    field2: 0,
    field3: [],
  },
});
```

#### Issue: Server Action Not Working
**Solution**: Verify 'use server' directive
```typescript
'use server'; // Must be at top of file

export async function myAction() {
  // ...
}
```

---

## Summary and Next Steps

### What Has Been Completed ✅

1. **Comprehensive Form Analysis**
   - Identified 83 total forms across the application
   - Categorized by PHI status and migration priority
   - Analyzed current validation approaches
   - Documented migration complexity

2. **Architecture Design**
   - Designed validation schema library structure
   - Designed form component library architecture
   - Defined HIPAA compliance patterns
   - Established migration strategy

3. **Documentation Created**
   - Complete forms inventory (`.temp/forms-inventory-FRM9K2.md`)
   - Architecture notes (`.temp/architecture-notes-FRM9K2.md`)
   - Implementation templates and examples
   - Testing strategy and guidelines

### What Remains 📋

1. **Immediate Next Steps** (Week 1)
   - Implement validation schema library (common + P0 entities)
   - Build form component library
   - Implement HIPAA audit utilities
   - Write tests for schemas and components

2. **P0 Migration** (Weeks 2-3)
   - Migrate 18 PHI forms (students, health records, medications)
   - Create corresponding server actions
   - Implement HIPAA audit logging

3. **P1-P3 Migration** (Weeks 4-8)
   - Migrate remaining 64 forms
   - Create all server actions
   - Comprehensive testing

### Key Metrics

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Forms using React Hook Form | 1 (1.2%) | 83 (100%) | 82 forms |
| Forms using Zod | 0 (0%) | 83 (100%) | 83 forms |
| PHI forms with audit logging | 0 (0%) | 28 (100%) | 28 forms |
| Form component reusability | Low | High | Need library |
| Test coverage | Unknown | 95%+ | Need tests |

### Critical Priorities 🚨

1. **HIPAA Compliance Gap**: Zero PHI forms have audit logging - this is a compliance violation
2. **MedicationForm Placeholder**: Critical PHI form is not implemented
3. **Manual Validation**: 97.6% of forms use inconsistent manual validation
4. **No Type Safety**: Most forms lack full TypeScript type safety

### Estimated Effort

- **Total Migration**: 60-90 hours
- **P0 (Critical)**: 25-35 hours
- **P1 (High)**: 10-15 hours
- **P2 (Medium)**: 15-20 hours
- **P3 (Low)**: 20-30 hours

### Success Metrics

Migration will be considered successful when:
- [ ] All 83 forms use React Hook Form + Zod
- [ ] All 28 PHI forms have HIPAA audit logging
- [ ] Form component library is complete and reusable
- [ ] Validation schema library covers all entities
- [ ] 95%+ test coverage achieved
- [ ] Zero accessibility violations
- [ ] Developer documentation is complete

### Recommended Approach

1. **Start Small**: Migrate 1-2 forms as proof of concept
2. **Build Foundation**: Create complete schema and component libraries
3. **Prioritize PHI**: Migrate all PHI forms first for HIPAA compliance
4. **Batch Remaining**: Migrate non-PHI forms in batches by category
5. **Test Continuously**: Write tests as you migrate
6. **Monitor Compliance**: Run HIPAA audits after each PHI form migration

---

## Conclusion

This comprehensive analysis has identified **83 forms** requiring migration to React Hook Form + Zod validation. The current state shows **critical HIPAA compliance gaps** with zero PHI forms having audit logging.

The provided implementation templates, validation schemas, form components, and migration guidelines establish clear patterns for the team to follow. Starting with the P0 PHI forms is **critical for HIPAA compliance** and should be prioritized immediately.

With the foundation and examples provided, the team can now:
1. Implement the validation schema library
2. Build the form component library
3. Systematically migrate all forms
4. Achieve full HIPAA compliance
5. Improve developer experience and code quality

**Estimated Timeline**: 8-12 weeks for complete migration
**Estimated Effort**: 60-90 hours total
**Priority**: P0 PHI forms MUST be completed first (3-4 weeks)

---

**Report Generated**: 2025-10-26
**Agent**: Forms Systems Architect (FRM9K2)
**Status**: Analysis Complete - Ready for Implementation
**Next Action**: Begin Phase 1 - Create validation schema and form component libraries

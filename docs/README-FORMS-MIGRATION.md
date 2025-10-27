# Forms Migration Guide - React Hook Form + Zod

## Overview

This guide explains how to migrate forms in the White Cross Healthcare Platform from manual controlled state to React Hook Form + Zod validation with HIPAA compliance.

## Quick Start

### 1. Simple Form Example

```typescript
import { useForm } from 'react-hook-form';
import { loginSchema, zodResolver, type Login } from '@/lib/validations';
import { FormInput, FormCheckbox } from '@/components/forms';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: Login) => {
    // Data is already validated by Zod
    await api.login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        name="email"
        label="Email"
        type="email"
        required
        error={errors.email}
        register={register}
      />

      <FormInput
        name="password"
        label="Password"
        type="password"
        required
        error={errors.password}
        register={register}
      />

      <FormCheckbox
        name="rememberMe"
        label="Remember me"
        register={register}
      />

      <button type="submit">Sign in</button>
    </form>
  );
};
```

### 2. PHI Form with HIPAA Audit Logging

```typescript
import { useForm } from 'react-hook-form';
import {
  createStudentSchema,
  zodResolver,
  type CreateStudent,
  STUDENT_PHI_FIELDS
} from '@/lib/validations';
import { useFormAudit } from '@/lib/hipaa';
import { FormInput, FormDatePicker, FormSelect } from '@/components/forms';

const StudentForm = () => {
  const form = useForm<CreateStudent>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: { /* ... */ }
  });

  const { register, handleSubmit, formState: { errors } } = form;

  // Enable HIPAA audit logging
  const { logSubmission, logCancel } = useFormAudit({
    formName: 'create-student-form',
    phiFields: STUDENT_PHI_FIELDS,
    form,
    enabled: true
  });

  const onSubmit = async (data: CreateStudent) => {
    // Log submission for HIPAA compliance
    await logSubmission(data);

    // Submit data
    await studentsApi.create(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* PHI fields are marked with isPhi prop */}
      <FormInput
        name="firstName"
        label="First Name"
        required
        isPhi
        error={errors.firstName}
        register={register}
      />

      <FormDatePicker
        name="dateOfBirth"
        label="Date of Birth"
        required
        isPhi
        error={errors.dateOfBirth}
        register={register}
      />

      <FormSelect
        name="gender"
        label="Gender"
        required
        options={GENDERS.map(g => ({ value: g, label: g }))}
        error={errors.gender}
        register={register}
      />

      <button type="submit">Create Student</button>
    </form>
  );
};
```

## Available Validation Schemas

### Common Schemas
Located in `@/lib/validations`:

- `addressSchema` - US address validation
- `phoneSchema` - US phone number validation
- `emailSchema` - Email validation
- `dateSchema` - Date validation
- `dateOfBirthSchema` - DOB with age validation
- `fileSchema` - File upload validation

### Entity Schemas
Located in `@/lib/validations`:

- **Student**: `createStudentSchema`, `updateStudentSchema`, `studentSearchSchema`
- **Medication**: `createMedicationSchema`, `medicationAdministrationSchema`, `prescriptionSchema`
- **Health Records**: `allergySchema`, `immunizationSchema`, `conditionSchema`, `vitalSignsSchema`
- **Incidents**: `createIncidentSchema`, `witnessStatementSchema`, `followUpActionSchema`
- **Appointments**: `createAppointmentSchema`, `rescheduleAppointmentSchema`
- **Auth**: `loginSchema`, `registerSchema`, `changePasswordSchema`
- **Admin**: `createUserSchema`, `createSchoolSchema`, `createDistrictSchema`

## Available Form Components

Import from `@/components/forms`:

- `FormField` - Base wrapper (rarely used directly)
- `FormInput` - Text input (text, email, password, number, tel, url)
- `FormTextArea` - Multi-line text input
- `FormSelect` - Dropdown selection
- `FormCheckbox` - Checkbox with label
- `FormDatePicker` - Date input with calendar

### Component Props

All form components share these common props:

```typescript
{
  name: string;           // Field name (must match schema)
  label?: string;         // Field label
  required?: boolean;     // Show required indicator
  isPhi?: boolean;        // Mark as PHI field
  hint?: string;          // Helper text
  disabled?: boolean;     // Disabled state
  error?: FieldError;     // Error from React Hook Form
  register: UseFormRegister; // RHF register function
  className?: string;     // Additional CSS classes
}
```

## HIPAA Compliance

### When to Use Audit Logging

Use `useFormAudit` for forms containing PHI (Protected Health Information):

- Student personal information
- Medical records (allergies, medications, immunizations)
- Health assessments
- Any form marked with PHI fields in the schema

### How Audit Logging Works

```typescript
const { form, logSubmission, logCancel } = useFormAudit({
  formName: 'your-form-name',
  phiFields: ['firstName', 'lastName', 'dateOfBirth'], // PHI fields
  form: useForm<YourType>({ resolver: zodResolver(schema) }),
  enabled: true
});
```

**Automatic Logging**:
- Form access (when component mounts)
- PHI field views (when field gains focus)
- PHI field edits (when field value changes)
- Form cancellation (when component unmounts without submission)

**Manual Logging**:
- Form submission: `await logSubmission(data)`
- Form cancellation: `await logCancel()`

### PHI Field Marking

Mark PHI fields visually with `isPhi` prop:

```typescript
<FormInput
  name="firstName"
  label="First Name"
  isPhi  // Shows PHI badge
  error={errors.firstName}
  register={register}
/>
```

## Migration Checklist

### For Each Form:

1. **Choose Schema**
   - [ ] Find existing schema in `@/lib/validations`
   - [ ] Or create new schema if needed

2. **Initialize React Hook Form**
   - [ ] Import `useForm` and `zodResolver`
   - [ ] Set up form with `resolver: zodResolver(schema)`
   - [ ] Define default values

3. **Replace Manual State**
   - [ ] Remove `useState` for form fields
   - [ ] Remove manual `onChange` handlers
   - [ ] Replace with `register` function

4. **Update Form Inputs**
   - [ ] Replace manual inputs with form components
   - [ ] Pass `register` and `error` props
   - [ ] Mark PHI fields with `isPhi`

5. **Add HIPAA Logging (if PHI)**
   - [ ] Import `useFormAudit`
   - [ ] Wrap form with audit logging
   - [ ] Call `logSubmission` in submit handler

6. **Test**
   - [ ] Test all validation rules
   - [ ] Test error messages display
   - [ ] Test HIPAA audit logs (if PHI)
   - [ ] Test accessibility

## Common Patterns

### Conditional Fields

```typescript
const watchFollowUp = watch('followUpRequired');

return (
  <form>
    <FormCheckbox
      name="followUpRequired"
      label="Follow-up Required"
      register={register}
    />

    {watchFollowUp && (
      <FormTextArea
        name="followUpNotes"
        label="Follow-up Notes"
        register={register}
      />
    )}
  </form>
);
```

### Dynamic Default Values

```typescript
const form = useForm<StudentType>({
  resolver: zodResolver(studentSchema),
  defaultValues: isEditMode
    ? {
        id: student.id,
        firstName: student.firstName,
        // ...
      }
    : {
        firstName: '',
        enrollmentDate: new Date().toISOString().split('T')[0]
      }
});
```

### Custom Validation

```typescript
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});
```

### Async Validation

```typescript
const onSubmit = async (data: FormData) => {
  try {
    // Validate against backend
    await api.validate(data);
    // Submit
    await api.submit(data);
  } catch (error) {
    // Set form errors
    setError('root', { message: error.message });
  }
};
```

## Performance Tips

1. **Use `watch` sparingly** - Only watch fields you need for conditional rendering
2. **Memoize heavy computations** - Use `useMemo` for complex transformations
3. **Avoid re-creating schemas** - Define schemas outside components
4. **Use `Controller` for complex inputs** - For third-party components

## Troubleshooting

### Validation Not Working
- Check schema is passed to `zodResolver`
- Verify field names match schema exactly
- Check default values match schema types

### Errors Not Displaying
- Verify `error` prop is passed to component
- Check `errors` object from `formState`
- Ensure field name is correct

### HIPAA Logging Not Working
- Verify `phiFields` array contains correct field names
- Check backend API endpoint `/api/v1/audit/logs` exists
- Verify authentication token is valid

## Examples

See complete examples in `.examples/`:
- `LoginForm-MIGRATED.tsx` - Simple form
- `StudentFormModal-MIGRATED.tsx` - Complex PHI form with HIPAA

## Resources

- React Hook Form: https://react-hook-form.com/
- Zod Validation: https://zod.dev/
- HIPAA Compliance: See `.temp/completion-summary-RHF8Z1.md`
- Original Forms Inventory: `.temp/forms-inventory-FRM9K2.md`

## Support

For questions:
1. Check migration examples in `.examples/`
2. Review schema documentation in `frontend/src/lib/validations/`
3. Consult completion summary in `.temp/completion-summary-RHF8Z1.md`

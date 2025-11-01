# Fix TS2322 Type Assignment Errors - Implementation Plan

**Agent ID**: P6K3M9 (TypeScript Architect)
**Task**: Fix all 472 TS2322 type assignment errors
**Reference Work**: Building on previous type system improvements from agents X7Y3Z9 and A1B2C3

## Error Categories Identified

1. **Component Prop Type Mismatches** (~350 errors)
   - Button variant: "outline" | "destructive" not in allowed variants
   - Button size: "icon" not in allowed sizes
   - Select onValueChange type mismatches
   - Switch/Checkbox prop type mismatches
   - Modal size prop mismatches
   - FormField control prop type mismatches

2. **Appointment Type Mismatches** (~30 errors)
   - Appointment vs AppointmentData type incompatibilities
   - SchedulingFormProps type mismatches
   - API response type assertions

3. **Communications Type Mismatches** (~40 errors)
   - Broadcast form types
   - Message composer types
   - Template form types

4. **API Response Types** (~30 errors)
   - Unknown to specific type assertions needed

5. **Budget Directory** (TBD - need to scan)

## Implementation Strategy

### Phase 1: Component Type Extensions (CRITICAL - affects most errors)
- Extend Button variant type to include "outline" | "destructive"
- Extend Button size type to include "icon"
- Fix Select component prop types
- Fix Switch/Checkbox component prop types
- Fix Modal component prop types
- Fix FormField component prop types

### Phase 2: Appointments Directory
- Create type mapping utilities for Appointment <-> AppointmentData
- Add proper type assertions for API responses
- Extend SchedulingFormProps type

### Phase 3: Communications Directory
- Fix broadcast form type mismatches
- Fix message composer type mismatches
- Fix template form type mismatches
- Fix notification settings type mismatches

### Phase 4: Budget Directory
- Scan for TS2322 errors
- Apply appropriate fixes

### Phase 5: API Response Types
- Add type assertion utilities for API responses
- Ensure proper typing throughout

### Phase 6: Verification
- Run type-check to confirm all TS2322 errors resolved
- Document any remaining issues

## Timeline
- Phase 1: Component Types - 20 mins
- Phase 2: Appointments - 15 mins
- Phase 3: Communications - 20 mins
- Phase 4: Budget - 10 mins
- Phase 5: API Types - 10 mins
- Phase 6: Verification - 5 mins

**Total Estimated Time**: 80 minutes

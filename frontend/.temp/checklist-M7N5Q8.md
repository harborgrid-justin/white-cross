# Checklist: Fix TS2305 Module Export Errors - Agent 6

## Agent ID: M7N5Q8

## Analysis
- ✅ Parse all TS2305 errors from error logs
- ✅ Categorize errors by type (types, schemas, components, actions, third-party)
- ✅ Create prioritized fix list

## Type Definition Fixes
- ✅ Verify BudgetVariance export in @/types/budget (already exists)
- ✅ Verify DocumentMetadata export in @/types/documents (already exists)
- ✅ Verify RootState export in @/stores/reduxStore (already exists)
- ✅ Verify getStorageStats export in @/stores/reduxStore (already exists)

## Schema Fixes
- ✅ Verify updateProfileSchema in @/schemas/settings.schemas (already exists)
- ✅ Verify changeEmailSchema in @/schemas/settings.schemas (already exists)
- ✅ Verify verifyEmailSchema in @/schemas/settings.schemas (already exists)
- ✅ Verify changePasswordSchema in @/schemas/settings.schemas (already exists)
- ✅ Verify setupMFASchema in @/schemas/settings.schemas (already exists)
- ✅ Verify updateNotificationPreferencesSchema in @/schemas/settings.schemas (already exists)
- ✅ Verify updatePrivacySettingsSchema in @/schemas/settings.schemas (already exists)
- ✅ Verify exportUserDataSchema in @/schemas/settings.schemas (already exists)
- ✅ Verify UpdateProfileInput in @/schemas/settings.schemas (already exists)
- ✅ Verify ChangePasswordInput in @/schemas/settings.schemas (already exists)

## Component Fixes
- ✅ Add default export to AllergyModal
- ✅ Add default export to CarePlanModal
- ✅ Add default export to ConditionModal
- ✅ Add default export to ConfirmationModal
- ✅ Add default export to DetailsModal
- ✅ Add default export to MeasurementModal
- ✅ Add default export to VaccinationModal
- ✅ Add default export to Badge component
- ✅ Add default export to Checkbox component
- ✅ Add default export to SearchInput component
- ✅ Add default export to Switch component

## Action Fixes
- ✅ Verify deleteBroadcastAction in communications.actions (already exists)
- ✅ Verify markAsReadAction in communications.actions (already exists)

## Third-Party Type Declarations
- ⚠️ Identified @tanstack/react-query export issues (likely version mismatch)
- ⚠️ Identified @apollo/client export issues (likely version mismatch)
- Note: These may require package updates or type declaration files

## Validation
- ✅ All component default exports added
- ✅ All existing exports verified
- ✅ Generate summary report
- ✅ Update all tracking documents

# TypeScript TS2554 Error Fix Checklist - F2T9K5

## Phase 1: NextResponse.json() Fixes
- [ ] Fix src/app/api/appointments/[id]/route.ts (4 errors)
- [ ] Fix src/app/api/appointments/route.ts (1 error)
- [ ] Fix src/app/api/communications/broadcasts/route.ts (1 error)
- [ ] Fix src/app/api/communications/messages/route.ts (1 error)
- [ ] Fix src/app/api/health-records/[id]/route.ts (5 errors)
- [ ] Fix src/app/api/health-records/route.ts (3 errors)
- [ ] Fix src/app/api/incidents/[id]/route.ts (4 errors)
- [ ] Fix src/app/api/incidents/route.ts (1 error)
- [ ] Fix src/app/api/medications/[id]/administer/route.ts (2 errors)
- [ ] Fix src/app/api/medications/[id]/route.ts (4 errors)
- [ ] Fix src/app/api/medications/route.ts (1 error)
- [ ] Fix src/app/api/students/[id]/route.ts (4 errors)
- [ ] Fix src/app/api/students/route.ts (1 error)
- [ ] Fix src/app/inventory/actions.ts (13 errors)

## Phase 2: Zod Schema .refine() Fixes
- [ ] Fix src/features/data-transfer/validation/schemas.ts (4 errors)
- [ ] Fix src/features/notifications/types/notification.ts (2 errors)
- [ ] Fix src/features/notifications/types/reminder.ts (3 errors)
- [ ] Fix src/features/search/types/search.types.ts (3 errors)
- [ ] Fix src/lib/validations/notification.schemas.ts (1 error)
- [ ] Fix src/lib/validations/report.schemas.ts (2 errors)
- [ ] Fix src/schemas/admin.schemas.ts (11 errors)
- [ ] Fix src/schemas/compliance/compliance.schemas.ts (3 errors)
- [ ] Fix src/schemas/documentSchemas.ts (4 errors)
- [ ] Fix src/schemas/documents.ts (3 errors)
- [ ] Fix src/schemas/inventory.schemas.ts (5 errors)
- [ ] Fix src/schemas/role.schemas.ts (5 errors)
- [ ] Fix src/schemas/settings.schemas.ts (5 errors)
- [ ] Fix src/schemas/transaction.schemas.ts (2 errors)
- [ ] Fix src/schemas/user.schemas.ts (3 errors)
- [ ] Fix src/services/modules/health/screeningsApi.ts (3 errors)
- [ ] Fix src/services/modules/healthAssessmentsApi.ts (1 error)
- [ ] Fix src/services/modules/validation.ts (2 errors)

## Phase 3: Query Hook Mutation Fixes
- [ ] Fix src/services/core/QueryHooksFactory.ts (14 errors)
- [ ] Fix src/lib/query/hooks/useAppointments.ts (6 errors)
- [ ] Fix src/lib/query/hooks/useMedications.ts (6 errors)
- [ ] Fix src/lib/query/hooks/useStudents.ts (6 errors)

## Phase 4: Component & Hook Fixes
- [ ] Fix src/components/features/shared/DataTable.tsx (5 errors)
- [ ] Fix src/components/ui/overlays/Tooltip.tsx (2 errors)
- [ ] Fix src/contexts/AuthContext.tsx (2 errors)
- [ ] Fix src/features/notifications/components/NotificationCenter.tsx (1 error)
- [ ] Fix src/features/notifications/components/ReminderScheduler.tsx (1 error)
- [ ] Fix src/features/search/hooks/useAutocomplete.ts (1 error)
- [ ] Fix src/features/search/hooks/useSearch.ts (1 error)
- [ ] Fix src/hooks/domains/access-control/index.ts (1 error)
- [ ] Fix src/hooks/domains/dashboard/composites/useDashboardComposites.ts (2 errors)
- [ ] Fix src/hooks/domains/health/queries/useHealthRecords.ts (4 errors)
- [ ] Fix src/hooks/domains/inventory/useInventoryManagement.ts (1 error)
- [ ] Fix src/hooks/domains/medications/queries/useMedicationQueries.ts (1 error)
- [ ] Fix src/hooks/domains/medications/queries/useMedicationsData.ts (1 error)
- [ ] Fix src/hooks/domains/students/mutations/useStudentMutations.ts (3 errors)
- [ ] Fix src/hooks/shared/useAudit.ts (1 error)
- [ ] Fix src/hooks/utilities/useStudentsRoute.ts (1 error)
- [ ] Fix src/hooks/utilities/useStudentsRouteEnhanced.ts (1 error)
- [ ] Fix src/app/api/auth/login/__tests__/route.test.ts (13 errors)

## Phase 5: Validation
- [ ] Run npm run type-check to verify all fixes
- [ ] Count remaining TS2554 errors (should be 0)
- [ ] Update all tracking documents
- [ ] Create completion summary

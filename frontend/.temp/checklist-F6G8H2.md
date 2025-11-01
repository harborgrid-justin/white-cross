# Execution Checklist - TS2345 Error Fixes (F6G8H2)

## Pre-Implementation
- [x] Scan .temp/ for existing agent work
- [x] Generate unique tracking ID (F6G8H2)
- [x] Analyze all 276 TS2345 errors
- [x] Create task status, plan, and checklist
- [ ] Read first batch of error files

## Phase 1: Utility Functions
- [ ] Create type utility functions file or identify existing utils
- [ ] Add `cn()` helper for className handling
- [ ] Add `ensureString()` helper
- [ ] Add type guards for common patterns

## Phase 2: Conditional ClassName Fixes
- [ ] Fix CommunicationComposeTab.tsx
- [ ] Fix CommunicationEmergencyTab.tsx
- [ ] Fix CommunicationHistoryTab.tsx
- [ ] Fix DataTable.tsx
- [ ] Fix EmptyState.tsx
- [ ] Fix ExportButton.tsx
- [ ] Fix FilterPanel.tsx
- [ ] Fix StatusTimeline.tsx
- [ ] Fix TagSelector.tsx
- [ ] Fix StudentCard.tsx
- [ ] Fix Accordion.tsx
- [ ] Fix Skeleton.tsx
- [ ] Fix Combobox.tsx
- [ ] Fix Drawer.tsx

## Phase 3: API Call Object Fixes
- [ ] Fix InboxContent.tsx - add offset property
- [ ] Fix BroadcastsContent.tsx - add offset property
- [ ] Fix TemplatesContent.tsx - add offset property
- [ ] Fix NotificationBell.tsx - add offset and grouped properties

## Phase 4: React Hook Form Fixes
- [ ] Fix CustomReportBuilder.tsx
- [ ] Fix NewTemplateContent.tsx
- [ ] Fix BroadcastForm.tsx
- [ ] Fix FollowUpForm.tsx
- [ ] Fix IncidentReportForm.tsx
- [ ] Fix WitnessStatementForm.tsx

## Phase 5: QueryClient Fixes
- [ ] Fix useNotifications.ts (3 locations)
- [ ] Fix useReminders.ts (6 locations)
- [ ] Fix MessageInbox.tsx (2 locations)
- [ ] Fix NotificationBell.tsx

## Phase 6: UseQueryOptions Fixes
- [ ] Fix useComplianceComposites.ts (7 locations)
- [ ] Fix useDocumentComposites.ts (3 locations)
- [ ] Fix useEmergencyComposites.ts (5 locations)

## Phase 7: Literal Type Fixes
- [ ] Fix appointment hooks (8 locations)
- [ ] Fix medication hooks (8 locations)
- [ ] Fix errors.ts (2 locations)

## Phase 8: Remaining Errors
- [ ] Process all remaining files systematically
- [ ] Fix middleware.enhanced.ts
- [ ] Fix custom-reports page
- [ ] Fix invoices page
- [ ] Fix MedicationsContent.tsx
- [ ] Fix SchedulingForm.tsx
- [ ] Fix AccessDenied.tsx
- [ ] Fix health record queries
- [ ] Fix medication administration service
- [ ] Fix document queries
- [ ] And 170+ more...

## Verification
- [ ] Run npm run type-check
- [ ] Verify all TS2345 errors are resolved
- [ ] Create completion summary
- [ ] Update all tracking documents
- [ ] Move files to .temp/completed/

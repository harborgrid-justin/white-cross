# TS2322 Fix Checklist - P6K3M9

## Phase 1: Component Type Extensions
- [ ] Read Button component type definitions
- [ ] Extend Button variant type to include "outline" | "destructive"
- [ ] Extend Button size type to include "icon"
- [ ] Read Select component type definitions
- [ ] Fix Select onValueChange prop type
- [ ] Read Switch component type definitions
- [ ] Fix Switch prop types (checked, onCheckedChange)
- [ ] Read Checkbox component type definitions
- [ ] Fix Checkbox prop types (checked, onCheckedChange)
- [ ] Read Modal component type definitions
- [ ] Fix Modal size prop to include "lg"
- [ ] Read FormField component type definitions
- [ ] Fix FormField control prop type

## Phase 2: Appointments Directory
- [ ] Fix src/app/(dashboard)/appointments/[id]/edit/page.tsx
- [ ] Fix src/app/(dashboard)/appointments/new/page.tsx
- [ ] Fix src/app/(dashboard)/appointments/search/page.tsx
- [ ] Fix src/hooks/domains/appointments/mutations/useAppointmentMutations.ts
- [ ] Fix src/hooks/domains/appointments/queries/useAppointments.ts
- [ ] Fix src/services/modules/appointmentsApi.ts

## Phase 3: Communications Directory
- [ ] Fix InboxContent.tsx
- [ ] Fix CommunicationTemplatesTab.tsx
- [ ] Fix BroadcastDetailContent.tsx
- [ ] Fix BroadcastsContent.tsx
- [ ] Fix NewBroadcastContent.tsx
- [ ] Fix ComposeContent.tsx
- [ ] Fix MessageDetailContent.tsx
- [ ] Fix NotificationsContent.tsx
- [ ] Fix NotificationSettingsContent.tsx
- [ ] Fix TemplatesContent.tsx
- [ ] Fix NewTemplateContent.tsx
- [ ] Fix BroadcastForm.tsx
- [ ] Fix MessageComposer.tsx
- [ ] Fix MessageInbox.tsx
- [ ] Fix MessageList.tsx
- [ ] Fix MessageThread.tsx
- [ ] Fix NotificationBell.tsx

## Phase 4: Budget Directory
- [ ] Scan budget directory for TS2322 errors
- [ ] Fix any budget-related type errors

## Phase 5: API Response Types
- [ ] Add type assertions for appointment API responses
- [ ] Add type assertions for other API responses

## Phase 6: Verification
- [ ] Run type-check command
- [ ] Verify TS2322 error count reduced
- [ ] Document results

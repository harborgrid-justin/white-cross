# Dynamic Rendering Standardization Checklist

## Phase 1: Quote Standardization - (auth) Group
- [ ] /app/(auth)/access-denied/page.tsx

## Phase 2: Quote Standardization - (dashboard) Group

### Dashboard & Analytics
- [ ] /app/(dashboard)/dashboard/page.tsx
- [ ] /app/(dashboard)/analytics/page.tsx
- [ ] /app/(dashboard)/analytics/appointment-analytics/page.tsx
- [ ] /app/(dashboard)/analytics/custom-reports/new/page.tsx
- [ ] /app/(dashboard)/analytics/custom-reports/[id]/page.tsx
- [ ] /app/(dashboard)/analytics/custom-reports/page.tsx
- [ ] /app/(dashboard)/analytics/incident-trends/page.tsx
- [ ] /app/(dashboard)/analytics/inventory-analytics/page.tsx
- [ ] /app/(dashboard)/analytics/medication-compliance/page.tsx
- [ ] /app/(dashboard)/analytics/export/page.tsx
- [ ] /app/(dashboard)/analytics/health-metrics/page.tsx

### Appointments
- [ ] /app/(dashboard)/appointments/calendar/page.tsx (already single quotes)
- [ ] /app/(dashboard)/appointments/list/page.tsx
- [ ] /app/(dashboard)/appointments/today/page.tsx
- [ ] /app/(dashboard)/appointments/upcoming/page.tsx
- [ ] /app/(dashboard)/appointments/recurring/page.tsx

### Communications
- [ ] /app/(dashboard)/communications/messages/page.tsx
- [ ] /app/(dashboard)/communications/messages/[id]/page.tsx
- [ ] /app/(dashboard)/communications/compose/page.tsx
- [ ] /app/(dashboard)/communications/settings/page.tsx
- [ ] /app/(dashboard)/communications/broadcasts/page.tsx
- [ ] /app/(dashboard)/communications/broadcasts/[id]/page.tsx
- [ ] /app/(dashboard)/communications/broadcasts/new/page.tsx
- [ ] /app/(dashboard)/communications/templates/page.tsx
- [ ] /app/(dashboard)/communications/templates/[id]/page.tsx
- [ ] /app/(dashboard)/communications/templates/new/page.tsx
- [ ] /app/(dashboard)/communications/notifications/page.tsx
- [ ] /app/(dashboard)/communications/notifications/settings/page.tsx

### Incidents (Critical - Real-time)
- [ ] /app/(dashboard)/incidents/page.tsx
- [ ] /app/(dashboard)/incidents/[id]/page.tsx
- [ ] /app/(dashboard)/incidents/[id]/edit/page.tsx
- [ ] /app/(dashboard)/incidents/new/page.tsx
- [ ] /app/(dashboard)/incidents/analytics/page.tsx
- [ ] /app/(dashboard)/incidents/behavioral/page.tsx
- [ ] /app/(dashboard)/incidents/emergency/page.tsx
- [ ] /app/(dashboard)/incidents/illness/page.tsx
- [ ] /app/(dashboard)/incidents/injury/page.tsx
- [ ] /app/(dashboard)/incidents/safety/page.tsx
- [ ] /app/(dashboard)/incidents/pending-review/page.tsx
- [ ] /app/(dashboard)/incidents/requires-action/page.tsx
- [ ] /app/(dashboard)/incidents/reports/page.tsx
- [ ] /app/(dashboard)/incidents/resolved/page.tsx
- [ ] /app/(dashboard)/incidents/settings/page.tsx
- [ ] /app/(dashboard)/incidents/under-investigation/page.tsx
- [ ] /app/(dashboard)/incidents/trending/page.tsx
- [ ] /app/(dashboard)/incidents/[id]/follow-up/page.tsx
- [ ] /app/(dashboard)/incidents/[id]/follow-up/new/page.tsx
- [ ] /app/(dashboard)/incidents/[id]/follow-up/[followUpId]/page.tsx
- [ ] /app/(dashboard)/incidents/[id]/witnesses/page.tsx
- [ ] /app/(dashboard)/incidents/[id]/witnesses/add/page.tsx
- [ ] /app/(dashboard)/incidents/[id]/witnesses/[witnessId]/page.tsx
- [ ] /app/(dashboard)/incidents/[id]/witnesses/[witnessId]/statement/page.tsx

### Medications
- [ ] /app/(dashboard)/medications/page.tsx (already single quotes)
- [ ] /app/(dashboard)/medications/[id]/page.tsx
- [ ] /app/(dashboard)/medications/[id]/edit/page.tsx
- [ ] /app/(dashboard)/medications/[id]/administrations/page.tsx
- [ ] /app/(dashboard)/medications/[id]/administration-log/page.tsx
- [ ] /app/(dashboard)/medications/[id]/administration-log/[logId]/page.tsx
- [ ] /app/(dashboard)/medications/new/page.tsx
- [ ] /app/(dashboard)/medications/administration-completed/page.tsx (already single quotes)
- [ ] /app/(dashboard)/medications/administration-due/page.tsx (already single quotes)
- [ ] /app/(dashboard)/medications/administration-missed/page.tsx (already single quotes)
- [ ] /app/(dashboard)/medications/administration-overdue/page.tsx (already single quotes)
- [ ] /app/(dashboard)/medications/administration-rules/page.tsx
- [ ] /app/(dashboard)/medications/administration-schedule/page.tsx
- [ ] /app/(dashboard)/medications/categories/page.tsx
- [ ] /app/(dashboard)/medications/controlled-substances/page.tsx
- [ ] /app/(dashboard)/medications/emergency/page.tsx
- [ ] /app/(dashboard)/medications/interactions/page.tsx
- [ ] /app/(dashboard)/medications/inventory/page.tsx
- [ ] /app/(dashboard)/medications/inventory/[id]/page.tsx
- [ ] /app/(dashboard)/medications/inventory/[id]/adjust/page.tsx
- [ ] /app/(dashboard)/medications/inventory/expiring/page.tsx
- [ ] /app/(dashboard)/medications/inventory/low-stock/page.tsx
- [ ] /app/(dashboard)/medications/over-the-counter/page.tsx
- [ ] /app/(dashboard)/medications/prescriptions/page.tsx
- [ ] /app/(dashboard)/medications/prescriptions/new/page.tsx
- [ ] /app/(dashboard)/medications/prescriptions/[id]/page.tsx
- [ ] /app/(dashboard)/medications/prescriptions/[id]/refill/page.tsx
- [ ] /app/(dashboard)/medications/reports/page.tsx
- [ ] /app/(dashboard)/medications/reports/administration/page.tsx
- [ ] /app/(dashboard)/medications/reports/compliance/page.tsx
- [ ] /app/(dashboard)/medications/reports/expiration/page.tsx (already single quotes)
- [ ] /app/(dashboard)/medications/reports/inventory/page.tsx (already single quotes)
- [ ] /app/(dashboard)/medications/reports/refills/page.tsx (already single quotes)
- [ ] /app/(dashboard)/medications/schedule/page.tsx (already single quotes)
- [ ] /app/(dashboard)/medications/settings/page.tsx

### Inventory
- [ ] /app/(dashboard)/inventory/page.tsx
- [ ] /app/(dashboard)/inventory/items/page.tsx (already single quotes)
- [ ] /app/(dashboard)/inventory/items/[id]/page.tsx
- [ ] /app/(dashboard)/inventory/items/[id]/edit/page.tsx
- [ ] /app/(dashboard)/inventory/items/new/page.tsx
- [ ] /app/(dashboard)/inventory/categories/page.tsx
- [ ] /app/(dashboard)/inventory/counts/page.tsx
- [ ] /app/(dashboard)/inventory/expiring/page.tsx
- [ ] /app/(dashboard)/inventory/locations/page.tsx
- [ ] /app/(dashboard)/inventory/low-stock/page.tsx
- [ ] /app/(dashboard)/inventory/reports/page.tsx
- [ ] /app/(dashboard)/inventory/settings/page.tsx
- [ ] /app/(dashboard)/inventory/stock/page.tsx
- [ ] /app/(dashboard)/inventory/stock/adjust/page.tsx
- [ ] /app/(dashboard)/inventory/stock/issue/page.tsx
- [ ] /app/(dashboard)/inventory/stock/receive/page.tsx
- [ ] /app/(dashboard)/inventory/stock/transfer/page.tsx
- [ ] /app/(dashboard)/inventory/transactions/page.tsx (already single quotes)
- [ ] /app/(dashboard)/inventory/transactions/[id]/page.tsx

### Compliance
- [ ] /app/(dashboard)/compliance/audits/page.tsx
- [ ] /app/(dashboard)/compliance/policies/page.tsx
- [ ] /app/(dashboard)/compliance/reports/page.tsx
- [ ] /app/(dashboard)/compliance/training/page.tsx

### Documents & Forms
- [ ] /app/(dashboard)/documents/page.tsx
- [ ] /app/(dashboard)/documents/templates/page.tsx
- [ ] /app/(dashboard)/documents/upload/page.tsx
- [ ] /app/(dashboard)/forms/page.tsx
- [ ] /app/(dashboard)/forms/new/page.tsx

## Phase 3: Other Routes (Lower Priority)
- [ ] /app/broadcasts/page.tsx
- [ ] /app/communication/page.tsx
- [ ] /app/communication/history/page.tsx
- [ ] /app/communication/templates/page.tsx

## Phase 4: Gap Analysis
- [ ] Review (dashboard)/appointments group for missing dynamic exports
- [ ] Review (dashboard)/billing group for missing dynamic exports
- [ ] Review (dashboard)/students group for missing dynamic exports
- [ ] Review (dashboard)/staff group for missing dynamic exports
- [ ] Review (dashboard)/immunizations group for missing dynamic exports
- [ ] Review (dashboard)/reports group for missing dynamic exports
- [ ] Review (dashboard)/profile group for missing dynamic exports
- [ ] Review (dashboard)/settings group for missing dynamic exports

## Phase 5: Validation
- [ ] Run TypeScript compiler check
- [ ] Verify no breaking changes
- [ ] Document static route patterns (if any)

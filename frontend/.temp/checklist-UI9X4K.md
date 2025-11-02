# UI/UX Import Error Synthesis - Implementation Checklist
**Agent ID**: UI9X4K

---

## Phase 1: Infrastructure ✅

### Node Modules & Dependencies
- [ ] Delete node_modules directory
- [ ] Delete package-lock.json
- [ ] Run `npm install`
- [ ] Verify @types/jsonwebtoken installed
- [ ] Verify clsx and tailwind-merge installed
- [ ] Run `npm list` to check for missing dependencies
- [ ] Run `npx tsc --noEmit` to verify type resolution

---

## Phase 2: UI Component Export Consistency

### Fix Missing Default Exports
- [ ] Review SearchInput export pattern
- [ ] Add SelectOption export to select.tsx
- [ ] Add Modal export to dialog.tsx (or verify correct import path)
- [ ] Verify Badge default export (already fixed by R4C7T2)
- [ ] Verify Checkbox default export (already fixed by R4C7T2)
- [ ] Verify Switch default export (already fixed by R4C7T2)

### Update Barrel Export Files
- [ ] Update `@/components/ui/input` index to export SearchInput
- [ ] Update `@/components/ui/select` index to export SelectOption
- [ ] Update `@/components/ui/dialog` index to export Modal
- [ ] Verify all UI component barrel exports

### Inventory Component Exports
- [ ] Fix InventoryCategoriesContent export (default vs named)
- [ ] Fix PhysicalCountsContent export
- [ ] Fix ExpiringItemsContent export
- [ ] Fix EditInventoryItemContent export
- [ ] Fix InventoryItemDetailContent export
- [ ] Fix NewInventoryItemContent export
- [ ] Fix InventoryLocationsContent export
- [ ] Fix LowStockAlertsContent export
- [ ] Fix InventoryReportsContent export
- [ ] Fix InventorySettingsContent export
- [ ] Fix StockAdjustmentContent export
- [ ] Fix IssueStockContent export
- [ ] Fix StockLevelsContent export
- [ ] Fix ReceiveStockContent export
- [ ] Fix TransferStockContent export
- [ ] Fix TransactionDetailContent export
- [ ] Fix TransactionHistoryContent export

---

## Phase 3: Action & Hook Module Resolution

### Action Function Name Fixes
- [ ] Fix cancelBroadcastAction → cancelBroadcast
- [ ] Fix acknowledgeBroadcastAction → acknowledgeBroadcast
- [ ] Fix archiveMessageAction → archiveMessages
- [ ] Fix deleteMessageAction → deleteMessages
- [ ] Verify all communications.actions exports

### Hook Barrel Exports
- [ ] Verify useToast exported from @/hooks (done by M5N7P2)
- [ ] Verify usePermissions exported from @/hooks (done by M5N7P2)
- [ ] Verify useStudentAllergies created/exported
- [ ] Verify useStudentPhoto created/exported
- [ ] Verify useConnectionMonitor exists
- [ ] Verify useOfflineQueue exists
- [ ] Verify documents hooks exist

### Missing Actions Files
- [ ] Verify @/actions/incidents.actions exists
- [ ] Verify @/actions/appointments.actions exists
- [ ] Verify @/actions/alerts.actions exists
- [ ] Add missing action exports if needed

---

## Phase 4: Type Definition & Advanced Patterns

### Document Types
- [ ] Verify DocumentMetadata exported from @/types/documents
- [ ] Verify SignatureWorkflow exported
- [ ] Verify Signature exported
- [ ] Verify SignatureStatus exported
- [ ] Verify WorkflowStatus exported
- [ ] Verify DocumentListResponse exported

### Redux Store Exports
- [ ] Verify RootState exported from @/stores/reduxStore
- [ ] Verify AppDispatch exported
- [ ] Verify store exported
- [ ] Verify getStorageStats exported
- [ ] Verify isValidRootState exported

### Medication API Types
- [ ] Add FormularyFilters export
- [ ] Add DrugInteraction export
- [ ] Add DrugMonograph export
- [ ] Add BarcodeResult export
- [ ] Add LASAMedication export
- [ ] Add Medication export
- [ ] Add MedicationInventory export
- [ ] Add MedicationReminder export
- [ ] Add AdverseReaction export
- [ ] Add AdverseReactionFormData export
- [ ] Add MedicationAlert export

### Settings Schema Exports
- [ ] Add updateProfileSchema export
- [ ] Add changeEmailSchema export
- [ ] Add verifyEmailSchema export
- [ ] Add changePasswordSchema export
- [ ] Add setupMFASchema export
- [ ] Add updateNotificationPreferencesSchema export
- [ ] Add updatePrivacySettingsSchema export
- [ ] Add exportUserDataSchema export
- [ ] Add UpdateProfileInput type export
- [ ] Add ChangePasswordInput type export

### Health Records Modal Exports
- [ ] Add default export to AllergyModal
- [ ] Add default export to CarePlanModal
- [ ] Add default export to ConditionModal
- [ ] Add default export to ConfirmationModal
- [ ] Add default export to DetailsModal
- [ ] Add default export to MeasurementModal
- [ ] Add default export to VaccinationModal

### Missing Utility Modules
- [ ] Create/locate routeUtils module
- [ ] Verify DatePicker component path
- [ ] Fix test-utils imports (or exclude from build)

---

## Validation & Testing

### TypeScript Compilation
- [ ] Run `npx tsc --noEmit` - verify 0 import errors
- [ ] Check for any new errors introduced

### Build Testing
- [ ] Run `npm run build` - verify successful build
- [ ] Check bundle size is reasonable

### Runtime Testing
- [ ] Test UI components render correctly
- [ ] Test action functions execute
- [ ] Test hooks provide data
- [ ] Test type safety in IDE

---

## Documentation
- [ ] Update import patterns in CLAUDE.md if needed
- [ ] Document any breaking changes
- [ ] Create migration guide if necessary

---

**Total Items**: 95+ checklist items across 4 phases

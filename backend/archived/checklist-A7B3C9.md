# Repository `any` Type Elimination Checklist

## Phase 1: Foundation Types

### Base Repository
- [ ] Fix `model: any` → `ModelStatic<TModel>` (lines 62, 69)
- [ ] Fix `rows.map((row: any)` → `rows.map((row: TModel)` (line 154)
- [ ] Fix `results.map((r: any)` → `results.map((r: TModel)` (line 436)
- [ ] Fix `where: { id } as any` → proper WhereOptions (lines 263, 343)
- [ ] Fix `data as any` casts (lines 191, 268, 414)
- [ ] Fix `buildWhereClause(where: any)` (line 517)
- [ ] Fix `buildOrderClause(orderBy: any)` (line 545)
- [ ] Fix `buildIncludeClause` return `any[]` (line 501)
- [ ] Fix `calculateChanges` parameters `any` (lines 565-566)
- [ ] Fix `calculateChanges` return type (line 567)
- [ ] Fix `sanitizeForAudit(data: any): any` (line 622)

### Interfaces
- [ ] Fix `details?: any` in RepositoryError (repository.interface.ts line 64)

## Phase 2: High-Priority Repositories

- [ ] user.repository.ts
- [ ] student.repository.ts
- [ ] health-record.repository.ts
- [ ] medication.repository.ts
- [ ] appointment.repository.ts

## Phase 3: Remaining Implementation Files (77 files)

- [ ] academic-transcript.repository.ts
- [ ] alert.repository.ts
- [ ] alert-rule.repository.ts
- [ ] allergy.repository.ts
- [ ] api-key.repository.ts
- [ ] appointment-reminder.repository.ts
- [ ] appointment-slot.repository.ts
- [ ] appointment-waitlist.repository.ts
- [ ] attendance.repository.ts
- [ ] audit-log.repository.ts
- [ ] broadcast.repository.ts
- [ ] budget.repository.ts
- [ ] chronic-condition.repository.ts
- [ ] clinic.repository.ts
- [ ] clinic-visit.repository.ts
- [ ] compliance-checklist-item.repository.ts
- [ ] compliance-report.repository.ts
- [ ] compliance-violation.repository.ts
- [ ] consent-form.repository.ts
- [ ] consent-signature.repository.ts
- [ ] contact.repository.ts
- [ ] dashboard-config.repository.ts
- [ ] data-retention-policy.repository.ts
- [ ] device.repository.ts
- [ ] district.repository.ts
- [ ] document.repository.ts
- [ ] document-permission.repository.ts
- [ ] document-version.repository.ts
- [ ] drug-interaction.repository.ts
- [ ] emergency-broadcast.repository.ts
- [ ] emergency-contact.repository.ts
- [ ] expense.repository.ts
- [ ] feature-flag.repository.ts
- [ ] grade.repository.ts
- [ ] grade-transition.repository.ts
- [ ] growth-tracking.repository.ts
- [ ] health-assessment.repository.ts
- [ ] health-metric.repository.ts
- [ ] health-risk-assessment.repository.ts
- [ ] health-screening.repository.ts
- [ ] immunization.repository.ts
- [ ] incident-follow-up.repository.ts
- [ ] incident-report.repository.ts
- [ ] integration-config.repository.ts
- [ ] inventory-item.repository.ts
- [ ] inventory-transaction.repository.ts
- [ ] ip-restriction.repository.ts
- [ ] lab-result.repository.ts
- [ ] medical-history.repository.ts
- [ ] medication-log.repository.ts
- [ ] message.repository.ts
- [ ] message-template.repository.ts
- [ ] notification.repository.ts
- [ ] nurse.repository.ts
- [ ] parent-guardian.repository.ts
- [ ] pdf-template.repository.ts
- [ ] permission.repository.ts
- [ ] policy-document.repository.ts
- [ ] prescription.repository.ts
- [ ] push-token.repository.ts
- [ ] regulatory-submission.repository.ts
- [ ] report-template.repository.ts
- [ ] role.repository.ts
- [ ] school.repository.ts
- [ ] security-incident.repository.ts
- [ ] session.repository.ts
- [ ] stock-level.repository.ts
- [ ] supplier.repository.ts
- [ ] sync-state.repository.ts
- [ ] system-config.repository.ts
- [ ] threat-detection.repository.ts
- [ ] treatment-plan.repository.ts
- [ ] vital-signs.repository.ts
- [ ] webhook.repository.ts

## Validation Steps

- [ ] Run `npm run build` - verify no TypeScript errors
- [ ] Run `npm test` - verify all tests pass
- [ ] Check for any remaining `any` types with grep
- [ ] Generate summary report

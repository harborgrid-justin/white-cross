#!/usr/bin/env node
/**
 * Fix TS7006 errors - Final cleanup
 * Handles remaining edge cases and nested patterns
 */

const fs = require('fs');
const path = require('path');

const fixes = [
  // FollowUpActionContext - more specific patterns
  {
    file: 'src/hooks/domains/incidents/FollowUpActionContext.tsx',
    replacements: [
      { from: /completedActions\.filter\(action => /g, to: 'completedActions.filter((action: any) => ' },
      { from: /pendingActions\.filter\(a => /g, to: 'pendingActions.filter((a: any) => ' },
      { from: /overdueActions\.filter\(a => /g, to: 'overdueActions.filter((a: any) => ' },
      { from: /upcomingActions\.filter\(a => /g, to: 'upcomingActions.filter((a: any) => ' },
      { from: /highPriorityActions\.filter\(a => /g, to: 'highPriorityActions.filter((a: any) => ' },
      { from: /recentActions\.filter\(action => /g, to: 'recentActions.filter((action: any) => ' },
      { from: /allActions\.filter\(action => /g, to: 'allActions.filter((action: any) => ' }
    ]
  },

  // Medication form validation
  {
    file: 'src/hooks/domains/medications/mutations/useMedicationFormValidation.ts',
    replacements: [
      { from: /setErrors\(prev => /g, to: 'setErrors((prev: any) => ' },
      { from: /setWarnings\(prev => /g, to: 'setWarnings((prev: any) => ' },
      { from: /setValidationState\(prev => /g, to: 'setValidationState((prev: any) => ' }
    ]
  },

  // Student composites - more specific
  {
    file: 'src/hooks/domains/students/composites/composite.ts',
    replacements: [
      { from: /allStudents\.filter\(s => /g, to: 'allStudents.filter((s: any) => ' },
      { from: /student\.healthRecords\.map\(record => /g, to: 'student.healthRecords.map((record: any) => ' },
      { from: /student\.incidents\.map\(incident => /g, to: 'student.incidents.map((incident: any) => ' },
      { from: /selectedIds\.find\(id => /g, to: 'selectedIds.find((id: any) => ' },
      { from: /medicationIds\.find\(id => /g, to: 'medicationIds.find((id: any) => ' }
    ]
  },

  // Statistics - deeply nested patterns
  {
    file: 'src/hooks/domains/students/queries/statistics.ts',
    replacements: [
      { from: /data\.students\.filter\(student => /g, to: 'data.students.filter((student: any) => ' },
      { from: /student\.allergies\.filter\(allergy => /g, to: 'student.allergies.filter((allergy: any) => ' },
      { from: /student\.medications\.filter\(medication => /g, to: 'student.medications.filter((medication: any) => ' },
      { from: /student\.allergies\.some\(a => /g, to: 'student.allergies.some((a: any) => ' },
      { from: /allStudents\.filter\(student => /g, to: 'allStudents.filter((student: any) => ' }
    ]
  },

  // Advanced hooks
  {
    file: 'src/hooks/shared/advancedHooks.ts',
    replacements: [
      { from: /alerts\.forEach\(alert => /g, to: 'alerts.forEach((alert: any) => ' },
      { from: /notifications\.filter\(alert => /g, to: 'notifications.filter((alert: any) => ' },
      { from: /items\.map\(alert => /g, to: 'items.map((alert: any) => ' }
    ]
  },

  // Students route - remaining patterns
  {
    file: 'src/hooks/utilities/useStudentsRoute.ts',
    replacements: [
      { from: /columns\.filter\(c => /g, to: 'columns.filter((c: any) => ' },
      { from: /selectedStudents\.some\(s => /g, to: 'selectedStudents.some((s: any) => ' }
    ]
  },

  // Students route enhanced - remaining
  {
    file: 'src/hooks/utilities/useStudentsRouteEnhanced.ts',
    replacements: [
      { from: /visibleColumns\.find\(s => /g, to: 'visibleColumns.find((s: any) => ' },
      { from: /availableColumns\.filter\(c => /g, to: 'availableColumns.filter((c: any) => ' }
    ]
  },

  // Medications route - remaining
  {
    file: 'src/hooks/utilities/useMedicationsRoute.ts',
    replacements: [
      { from: /filteredMedications\.filter\(m => /g, to: 'filteredMedications.filter((m: any) => ' },
      { from: /activeMedications\.filter\(m => /g, to: 'activeMedications.filter((m: any) => ' }
    ]
  },

  // Health Records page - remaining
  {
    file: 'src/pages/health/HealthRecords.tsx',
    replacements: [
      { from: /tabs\.filter\(t => /g, to: 'tabs.filter((t: any) => ' },
      { from: /allRecords\.filter\(record => /g, to: 'allRecords.filter((record: any) => ' },
      { from: /filteredData\.map\(record => /g, to: 'filteredData.map((record: any) => ' }
    ]
  },

  // Incident reports slice - remaining
  {
    file: 'src/pages/incidents/store/incidentReportsSlice.ts',
    replacements: [
      { from: /allReports\.filter\(report => /g, to: 'allReports.filter((report: any) => ' },
      { from: /draftReports\.find\(r => /g, to: 'draftReports.find((r: any) => ' },
      { from: /submittedReports\.filter\(r => /g, to: 'submittedReports.filter((r: any) => ' }
    ]
  },

  // Access control slice - remaining
  {
    file: 'src/pages/access-control/store/accessControlSlice.ts',
    replacements: [
      { from: /allRoles\.filter\(r => /g, to: 'allRoles.filter((r: any) => ' },
      { from: /assignedPermissions\.filter\(p => /g, to: 'assignedPermissions.filter((p: any) => ' },
      { from: /availableRoles\.find\(r => /g, to: 'availableRoles.find((r: any) => ' }
    ]
  },

  // Medication workflows - remaining
  {
    file: 'src/stores/domains/healthcare/workflows/medicationWorkflows.ts',
    replacements: [
      { from: /activeMedications\.filter\(m => /g, to: 'activeMedications.filter((m: any) => ' },
      { from: /scheduledMedications\.find\(m => /g, to: 'scheduledMedications.find((m: any) => ' },
      { from: /availableMedications\.filter\(med => /g, to: 'availableMedications.filter((med: any) => ' }
    ]
  },

  // Compliance slice - remaining
  {
    file: 'src/pages/compliance/store/complianceSlice.ts',
    replacements: [
      { from: /allReports\.filter\(report => /g, to: 'allReports.filter((report: any) => ' },
      { from: /pendingAudits\.filter\(a => /g, to: 'pendingAudits.filter((a: any) => ' }
    ]
  },

  // Dashboard example - remaining
  {
    file: 'src/pages/dashboard/DashboardReduxExample.tsx',
    replacements: [
      { from: /activeStudents\.filter\(s => /g, to: 'activeStudents.filter((s: any) => ' },
      { from: /allStudents\.filter\(student => /g, to: 'allStudents.filter((student: any) => ' },
      { from: /filteredStudents\.map\(student => /g, to: 'filteredStudents.map((student: any) => ' }
    ]
  },

  // Adverse reactions tab
  {
    file: 'src/pages/medications/components/AdverseReactionsTab.tsx',
    replacements: [
      { from: /reactions\.map\(\(reaction, index\) => /g, to: 'reactions.map((reaction: any, index: number) => ' },
      { from: /filteredReactions\.map\(\(reaction, index\) => /g, to: 'filteredReactions.map((reaction: any, index: number) => ' }
    ]
  },

  // Validation utils
  {
    file: 'src/services/utils/validationUtils.ts',
    replacements: [
      { from: /errors\.map\(\(error, index\) => /g, to: 'errors.map((error: any, index: number) => ' },
      { from: /validationErrors\.map\(\(error, index\) => /g, to: 'validationErrors.map((error: any, index: number) => ' }
    ]
  },

  // Medication API
  {
    file: 'src/services/modules/medicationsApi.ts',
    replacements: [
      { from: /\.catch\(\(error\) => \{/g, to: '.catch((error: any) => {' },
      { from: /\.catch\(error => \{/g, to: '.catch((error: any) => {' }
    ]
  },

  // Reminders tab
  {
    file: 'src/pages/medications/components/RemindersTab.tsx',
    replacements: [
      { from: /allReminders\.filter\(r => /g, to: 'allReminders.filter((r: any) => ' },
      { from: /activeReminders\.filter\(reminder => /g, to: 'activeReminders.filter((reminder: any) => ' }
    ]
  },

  // Inventory tab
  {
    file: 'src/pages/medications/components/InventoryTab.tsx',
    replacements: [
      { from: /inventoryItems\.filter\(item => /g, to: 'inventoryItems.filter((item: any) => ' },
      { from: /allItems\.filter\(i => /g, to: 'allItems.filter((i: any) => ' }
    ]
  },

  // Validation schemas
  {
    file: 'src/validation/accessControlSchemas.ts',
    replacements: [
      { from: /\.test\(\s*function\s*\(value\)/g, to: '.test(function(value: any)' },
      { from: /\.test\(\s*\(value\)\s*=>/g, to: '.test((value: any) =>' }
    ]
  },

  {
    file: 'src/validation/communicationSchemas.ts',
    replacements: [
      { from: /\.test\(\s*function\s*\(value\)/g, to: '.test(function(value: any)' },
      { from: /\.test\(\s*\(value\)\s*=>/g, to: '.test((value: any) =>' }
    ]
  },

  // Redux HOCs
  {
    file: 'src/stores/utils/reduxHOCs.tsx',
    replacements: [
      { from: /\.map\(\(item\) => /g, to: '.map((item: any) => ' },
      { from: /\.filter\(\(item\) => /g, to: '.filter((item: any) => ' }
    ]
  },

  // Advanced API integration
  {
    file: 'src/stores/shared/api/advancedApiIntegration.ts',
    replacements: [
      { from: /\.then\(\(result\) => /g, to: '.then((result: any) => ' },
      { from: /\.then\(result => /g, to: '.then((result: any) => ' }
    ]
  },

  // Medications list tab
  {
    file: 'src/pages/medications/components/tabs/MedicationsListTab.tsx',
    replacements: [
      { from: /medications\.filter\(m => /g, to: 'medications.filter((m: any) => ' }
    ]
  },

  // Medications tab
  {
    file: 'src/pages/medications/components/MedicationsTab.tsx',
    replacements: [
      { from: /activeMedications\.filter\(m => /g, to: 'activeMedications.filter((m: any) => ' }
    ]
  },

  // Medications list
  {
    file: 'src/pages/medications/components/MedicationsList.tsx',
    replacements: [
      { from: /medications\.map\(m => /g, to: 'medications.map((m: any) => ' }
    ]
  },

  // Health Medications page
  {
    file: 'src/pages/health/Medications.tsx',
    replacements: [
      { from: /medications\.filter\(m => /g, to: 'medications.filter((m: any) => ' }
    ]
  },

  // Dashboard Overview
  {
    file: 'src/pages/dashboard/components/DashboardOverview.tsx',
    replacements: [
      { from: /stats\.map\(s => /g, to: 'stats.map((s: any) => ' }
    ]
  },

  // Student selector
  {
    file: 'src/pages/students/components/StudentSelector.tsx',
    replacements: [
      { from: /students\.filter\(s => /g, to: 'students.filter((s: any) => ' }
    ]
  },

  // Students slice
  {
    file: 'src/pages/students/store/studentsSlice.ts',
    replacements: [
      { from: /state\.students\.filter\(s => /g, to: 'state.students.filter((s: any) => ' }
    ]
  },

  // Admin slice
  {
    file: 'src/pages/admin/store/adminSlice.ts',
    replacements: [
      { from: /users\.filter\(u => /g, to: 'users.filter((u: any) => ' }
    ]
  },

  // Route validation
  {
    file: 'src/hooks/utilities/routeValidation.ts',
    replacements: [
      { from: /validRoutes\.find\(r => /g, to: 'validRoutes.find((r: any) => ' }
    ]
  },

  // Student selection hook
  {
    file: 'src/hooks/utilities/useStudentSelection.ts',
    replacements: [
      { from: /selectedStudents\.filter\(s => /g, to: 'selectedStudents.filter((s: any) => ' },
      { from: /allStudents\.find\(s => /g, to: 'allStudents.find((s: any) => ' }
    ]
  },

  // Audit hook
  {
    file: 'src/hooks/shared/useAudit.ts',
    replacements: [
      { from: /logs\.filter\(l => /g, to: 'logs.filter((l: any) => ' }
    ]
  },

  // Store hooks index
  {
    file: 'src/hooks/shared/store-hooks-index.ts',
    replacements: [
      { from: /\.map\(item => /g, to: '.map((item: any) => ' },
      { from: /\.filter\(item => /g, to: '.filter((item: any) => ' }
    ]
  },

  // Contact create dialog
  {
    file: 'src/pages/contacts/components/CreateContactDialog.tsx',
    replacements: [
      { from: /setFormData\(prev => /g, to: 'setFormData((prev: any) => ' },
      { from: /setErrors\(prev => /g, to: 'setErrors((prev: any) => ' }
    ]
  },

  // Document schemas
  {
    file: 'src/schemas/documentSchemas.ts',
    replacements: [
      { from: /\.test\(\s*function\s*\(value\)/g, to: '.test(function(value: any)' },
      { from: /\.test\(\s*\(value\)\s*=>/g, to: '.test((value: any) =>' }
    ]
  }
];

console.log('Starting TS7006 error fixes - Final cleanup...\n');

let totalFixed = 0;
let totalFiles = 0;

fixes.forEach(({ file, replacements }) => {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fileModified = false;
  let fileFixCount = 0;

  replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches && matches.length > 0) {
      content = content.replace(from, to);
      fileFixCount += matches.length;
      totalFixed += matches.length;
      fileModified = true;
    }
  });

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed ${fileFixCount} annotations in: ${file}`);
    totalFiles++;
  } else {
    console.log(`- Skipped (no changes): ${file}`);
  }
});

console.log(`\n✨ Complete! Fixed ${totalFixed} type annotations in ${totalFiles} files.`);
console.log('\nRun "npx tsc --noEmit 2>&1 | grep TS7006 | wc -l" to verify.');

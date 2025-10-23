#!/usr/bin/env node
/**
 * Fix TS7006 errors - Batch 3: Remaining files
 */

const fs = require('fs');
const path = require('path');

const fixes = [
  // Incident reports slice - more specific patterns
  {
    file: 'src/pages/incidents/store/incidentReportsSlice.ts',
    replacements: [
      { from: /state\.reports\.find\(report => /g, to: 'state.reports.find((report: any) => ' },
      { from: /state\.reports\.filter\(r => /g, to: 'state.reports.filter((r: any) => ' },
      { from: /\.reports\.filter\(r => /g, to: '.reports.filter((r: any) => ' },
      { from: /reports\.filter\(report => /g, to: 'reports.filter((report: any) => ' },
      { from: /reports\.some\(report => /g, to: 'reports.some((report: any) => ' },
      { from: /reports\.map\(report => /g, to: 'reports.map((report: any) => ' },
      { from: /\.reduce\(\(acc, report\) =>/g, to: '.reduce((acc: any, report: any) =>' },
      { from: /\.reduce\(\(acc, r\) =>/g, to: '.reduce((acc: any, r: any) =>' },
      { from: /byStatus\.find\(r => /g, to: 'byStatus.find((r: any) => ' }
    ]
  },

  // Health records API - catch and reduce patterns
  {
    file: 'src/services/modules/healthRecordsApi.ts',
    replacements: [
      { from: /\.reduce\(\(acc, err\) => \{/g, to: '.reduce((acc: any, err: any) => {' },
      { from: /catch\(\(error: any\) => \{/g, to: 'catch((error: any) => {' }
    ]
  },

  // Administration Service
  {
    file: 'src/services/modules/AdministrationService.ts',
    replacements: [
      { from: /\.reduce\(\(acc, err\) => \{/g, to: '.reduce((acc: any, err: any) => {' },
      { from: /catch\(error => \{/g, to: 'catch((error: any) => {' },
      { from: /\.catch\(error => \{/g, to: '.catch((error: any) => {' },
      { from: /catch\(\(error\) => \{/g, to: 'catch((error: any) => {' },
      { from: /\.catch\(\(error\) => \{/g, to: '.catch((error: any) => {' }
    ]
  },

  // Administration API
  {
    file: 'src/services/modules/administrationApi.ts',
    replacements: [
      { from: /\.reduce\(\(acc, err\) => \{/g, to: '.reduce((acc: any, err: any) => {' },
      { from: /catch\(error => \{/g, to: 'catch((error: any) => {' },
      { from: /\.catch\(error => \{/g, to: '.catch((error: any) => {' },
      { from: /catch\(\(error\) => \{/g, to: 'catch((error: any) => {' },
      { from: /\.catch\(\(error\) => \{/g, to: '.catch((error: any) => {' }
    ]
  },

  // Access control slice
  {
    file: 'src/pages/access-control/store/accessControlSlice.ts',
    replacements: [
      { from: /state\.roles\.find\(r => /g, to: 'state.roles.find((r: any) => ' },
      { from: /state\.permissions\.filter\(p => /g, to: 'state.permissions.filter((p: any) => ' },
      { from: /roles\.filter\(r => /g, to: 'roles.filter((r: any) => ' },
      { from: /permissions\.filter\(p => /g, to: 'permissions.filter((p: any) => ' },
      { from: /builder\.addCase\([^,]+, \(state, \{ payload \}\) =>/g, to: function(match) {
          return match.replace('(state, { payload })', '(state: any, { payload }: any)');
        }
      }
    ]
  },

  // Health Records page
  {
    file: 'src/pages/health/HealthRecords.tsx',
    replacements: [
      { from: /setTabs\(prev => /g, to: 'setTabs((prev: any) => ' },
      { from: /setActiveTab\(prev => /g, to: 'setActiveTab((prev: any) => ' },
      { from: /setRecords\(prev => /g, to: 'setRecords((prev: any) => ' },
      { from: /\.filter\(record => /g, to: '.filter((record: any) => ' },
      { from: /\.find\(record => /g, to: '.find((record: any) => ' },
      { from: /\.map\(record => /g, to: '.map((record: any) => ' },
      { from: /records\.filter\(r => /g, to: 'records.filter((r: any) => ' }
    ]
  },

  // Compliance slice
  {
    file: 'src/pages/compliance/store/complianceSlice.ts',
    replacements: [
      { from: /state\.reports\.find\(r => /g, to: 'state.reports.find((r: any) => ' },
      { from: /state\.audits\.filter\(a => /g, to: 'state.audits.filter((a: any) => ' }
    ]
  },

  // Follow-up action context
  {
    file: 'src/hooks/domains/incidents/FollowUpActionContext.tsx',
    replacements: [
      { from: /actions\.filter\(action => /g, to: 'actions.filter((action: any) => ' },
      { from: /state\.actions\.filter\(action => /g, to: 'state.actions.filter((action: any) => ' }
    ]
  },

  // Medication workflows
  {
    file: 'src/stores/domains/healthcare/workflows/medicationWorkflows.ts',
    replacements: [
      { from: /medications\.filter\(m => /g, to: 'medications.filter((m: any) => ' },
      { from: /medications\.find\(m => /g, to: 'medications.find((m: any) => ' },
      { from: /state\.medications\.filter\(m => /g, to: 'state.medications.filter((m: any) => ' }
    ]
  },

  // Student route utilities (remaining)
  {
    file: 'src/hooks/utilities/useMedicationsRoute.ts',
    replacements: [
      { from: /medications\.filter\(m => /g, to: 'medications.filter((m: any) => ' },
      { from: /logs\.filter\(l => /g, to: 'logs.filter((l: any) => ' }
    ]
  },

  // Student statistics (remaining)
  {
    file: 'src/hooks/domains/students/queries/statistics.ts',
    replacements: [
      { from: /\.reduce\(\(acc, s\) =>/g, to: '.reduce((acc: any, s: any) =>' },
      { from: /data\.students\.filter\(s => /g, to: 'data.students.filter((s: Student) => ' }
    ]
  },

  // Student composites
  {
    file: 'src/hooks/domains/students/composites/composite.ts',
    replacements: [
      { from: /students\.filter\(s => /g, to: 'students.filter((s: any) => ' },
      { from: /records\.map\(record => /g, to: 'records.map((record: any) => ' },
      { from: /incidents\.map\(incident => /g, to: 'incidents.map((incident: any) => ' },
      { from: /ids\.find\(id => /g, to: 'ids.find((id: any) => ' }
    ]
  },

  // Validation schemas
  {
    file: 'src/validation/communicationSchemas.ts',
    replacements: [
      { from: /\.test\(/g, to: '.test(' },
      { from: /function\(value\)/g, to: 'function(value: any)' }
    ]
  },

  {
    file: 'src/validation/accessControlSchemas.ts',
    replacements: [
      { from: /function\(value\)/g, to: 'function(value: any)' }
    ]
  },

  // Validation utils
  {
    file: 'src/services/utils/validationUtils.ts',
    replacements: [
      { from: /\.map\(\(error, index\) =>/g, to: '.map((error: any, index: any) =>' }
    ]
  },

  // Medications API
  {
    file: 'src/services/modules/medicationsApi.ts',
    replacements: [
      { from: /catch\(error => \{/g, to: 'catch((error: any) => {' },
      { from: /catch\(\(error\) => \{/g, to: 'catch((error: any) => {' }
    ]
  },

  // Auth API
  {
    file: 'src/services/modules/authApi.ts',
    replacements: [
      { from: /\.reduce\(\(acc, err\) => \{/g, to: '.reduce((acc: any, err: any) => {' }
    ]
  },

  // Reminders tab
  {
    file: 'src/pages/medications/components/RemindersTab.tsx',
    replacements: [
      { from: /reminders\.filter\(r => /g, to: 'reminders.filter((r: any) => ' },
      { from: /\.filter\(reminder => /g, to: '.filter((reminder: any) => ' }
    ]
  },

  // Inventory tab
  {
    file: 'src/pages/medications/components/InventoryTab.tsx',
    replacements: [
      { from: /inventory\.filter\(item => /g, to: 'inventory.filter((item: any) => ' },
      { from: /\.filter\(i => /g, to: '.filter((i: any) => ' }
    ]
  },

  // Dashboard example
  {
    file: 'src/pages/dashboard/DashboardReduxExample.tsx',
    replacements: [
      { from: /\.filter\(s => /g, to: '.filter((s: any) => ' },
      { from: /\.filter\(student => /g, to: '.filter((student: any) => ' },
      { from: /\.map\(student => /g, to: '.map((student: any) => ' }
    ]
  },

  // Adverse reactions tab
  {
    file: 'src/pages/medications/components/AdverseReactionsTab.tsx',
    replacements: [
      { from: /\.map\(\(reaction, index\) =>/g, to: '.map((reaction: any, index: any) =>' }
    ]
  },

  // Advanced hooks
  {
    file: 'src/hooks/shared/advancedHooks.ts',
    replacements: [
      { from: /setRetries\(prev => /g, to: 'setRetries((prev: any) => ' },
      { from: /\.then\(data => /g, to: '.then((data: any) => ' }
    ]
  },

  // Advanced API integration
  {
    file: 'src/stores/shared/api/advancedApiIntegration.ts',
    replacements: [
      { from: /\.then\(result => /g, to: '.then((result: any) => ' }
    ]
  }
];

console.log('Starting TS7006 error fixes - Batch 3...\n');

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
    if (typeof to === 'function') {
      const matches = content.match(from);
      if (matches && matches.length > 0) {
        content = content.replace(from, to);
        fileFixCount += matches.length;
        totalFixed += matches.length;
        fileModified = true;
      }
    } else {
      const matches = content.match(from);
      if (matches && matches.length > 0) {
        content = content.replace(from, to);
        fileFixCount += matches.length;
        totalFixed += matches.length;
        fileModified = true;
      }
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

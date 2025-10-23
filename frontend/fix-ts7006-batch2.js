#!/usr/bin/env node
/**
 * Fix TS7006 errors - Batch 2: Route utilities and Redux slices
 */

const fs = require('fs');
const path = require('path');

const fixes = [
  // Medication route utilities
  {
    file: 'src/hooks/utilities/useMedicationsRoute.ts',
    replacements: [
      { from: /onSuccess: \(medication\) =>/g, to: 'onSuccess: (medication: any) =>' },
      { from: /onError: \(error\) =>/g, to: 'onError: (error: any) =>' },
      { from: /onSuccess: \(log\) =>/g, to: 'onSuccess: (log: any) =>' },
      { from: /onSuccess: \(inventory\) =>/g, to: 'onSuccess: (inventory: any) =>' },
      { from: /onSuccess: \(reaction\) =>/g, to: 'onSuccess: (reaction: any) =>' },
      { from: /\.find\(medication => /g, to: '.find((medication: any) => ' },
      { from: /\.find\(m => /g, to: '.find((m: any) => ' },
      { from: /\.sort\(\(a, b\) =>/g, to: '.sort((a: any, b: any) =>' },
      { from: /\.map\(item => /g, to: '.map((item: any) => ' },
      { from: /setState\(prev => /g, to: 'setState((prev: any) => ' }
    ]
  },

  // Student route utilities - enhanced
  {
    file: 'src/hooks/utilities/useStudentsRouteEnhanced.ts',
    replacements: [
      { from: /onSuccess: \(student\) =>/g, to: 'onSuccess: (student: any) =>' },
      { from: /onError: \(error\) =>/g, to: 'onError: (error: any) =>' },
      { from: /onSettled: \(data\) =>/g, to: 'onSettled: (data: any) =>' },
      { from: /setState\(prev => /g, to: 'setState((prev: any) => ' },
      { from: /setFilters\(prev => /g, to: 'setFilters((prev: any) => ' },
      { from: /setColumns\(prev => /g, to: 'setColumns((prev: any) => ' },
      { from: /\.find\(s => /g, to: '.find((s: any) => ' },
      { from: /\.some\(s => /g, to: '.some((s: any) => ' },
      { from: /\.map\(id => /g, to: '.map((id: any) => ' }
    ]
  },

  // Student route utilities - standard
  {
    file: 'src/hooks/utilities/useStudentsRoute.ts',
    replacements: [
      { from: /onSuccess: \(student\) =>/g, to: 'onSuccess: (student: any) =>' },
      { from: /onError: \(error\) =>/g, to: 'onError: (error: any) =>' },
      { from: /setState\(prev => /g, to: 'setState((prev: any) => ' },
      { from: /setFilters\(prev => /g, to: 'setFilters((prev: any) => ' },
      { from: /\.find\(c => /g, to: '.find((c: any) => ' },
      { from: /\.filter\(s => /g, to: '.filter((s: any) => ' },
      { from: /\.some\(s => /g, to: '.some((s: any) => ' },
      { from: /\.map\(id => /g, to: '.map((id: any) => ' }
    ]
  },

  // Incident reports slice
  {
    file: 'src/pages/incidents/store/incidentReportsSlice.ts',
    replacements: [
      { from: /\.filter\(report => /g, to: '.filter((report: any) => ' },
      { from: /\.filter\(r => /g, to: '.filter((r: any) => ' },
      { from: /\.find\(r => /g, to: '.find((r: any) => ' },
      { from: /\.map\(r => /g, to: '.map((r: any) => ' },
      { from: /\.sort\(\(a, b\) =>/g, to: '.sort((a: any, b: any) =>' },
      { from: /state\.filter\(incident => /g, to: 'state.filter((incident: any) => ' },
      { from: /builder\.addCase\([^,]+, \(state, action\) =>/g, to: function(match) {
          return match.replace('(state, action)', '(state: any, action: any)');
        }
      }
    ]
  },

  // Health records API
  {
    file: 'src/services/modules/healthRecordsApi.ts',
    replacements: [
      { from: /catch\(\(error\) => \{/g, to: 'catch((error: any) => {' },
      { from: /catch\(error => \{/g, to: 'catch((error: any) => {' },
      { from: /catch\(err => \{/g, to: 'catch((err: any) => {' },
      { from: /catch\(\(err\) => \{/g, to: 'catch((err: any) => {' }
    ]
  },

  // Access control slice
  {
    file: 'src/pages/access-control/store/accessControlSlice.ts',
    replacements: [
      { from: /\.filter\(role => /g, to: '.filter((role: any) => ' },
      { from: /\.filter\(perm => /g, to: '.filter((perm: any) => ' },
      { from: /\.filter\(r => /g, to: '.filter((r: any) => ' },
      { from: /\.find\(r => /g, to: '.find((r: any) => ' },
      { from: /\.map\(r => /g, to: '.map((r: any) => ' },
      { from: /builder\.addCase\([^,]+, \(state, action\) =>/g, to: function(match) {
          return match.replace('(state, action)', '(state: any, action: any)');
        }
      }
    ]
  },

  // Administration Service
  {
    file: 'src/services/modules/AdministrationService.ts',
    replacements: [
      { from: /catch\(\(error\) => \{/g, to: 'catch((error: any) => {' },
      { from: /catch\(error => \{/g, to: 'catch((error: any) => {' },
      { from: /catch\(err => \{/g, to: 'catch((err: any) => {' }
    ]
  },

  // Administration API
  {
    file: 'src/services/modules/administrationApi.ts',
    replacements: [
      { from: /catch\(\(error\) => \{/g, to: 'catch((error: any) => {' },
      { from: /catch\(error => \{/g, to: 'catch((error: any) => {' },
      { from: /catch\(err => \{/g, to: 'catch((err: any) => {' }
    ]
  },

  // Compliance slice
  {
    file: 'src/pages/compliance/store/complianceSlice.ts',
    replacements: [
      { from: /\.filter\(report => /g, to: '.filter((report: any) => ' },
      { from: /\.filter\(r => /g, to: '.filter((r: any) => ' },
      { from: /\.find\(r => /g, to: '.find((r: any) => ' },
      { from: /builder\.addCase\([^,]+, \(state, action\) =>/g, to: function(match) {
          return match.replace('(state, action)', '(state: any, action: any)');
        }
      }
    ]
  },

  // Health Records page
  {
    file: 'src/pages/health/HealthRecords.tsx',
    replacements: [
      { from: /onSuccess: \(data\) =>/g, to: 'onSuccess: (data: any) =>' },
      { from: /onError: \(error\) =>/g, to: 'onError: (error: any) =>' },
      { from: /setState\(prev => /g, to: 'setState((prev: any) => ' },
      { from: /\.filter\(record => /g, to: '.filter((record: any) => ' },
      { from: /\.filter\(r => /g, to: '.filter((r: any) => ' },
      { from: /\.map\(r => /g, to: '.map((r: any) => ' }
    ]
  },

  // Medication workflows
  {
    file: 'src/stores/domains/healthcare/workflows/medicationWorkflows.ts',
    replacements: [
      { from: /\.filter\(med => /g, to: '.filter((med: any) => ' },
      { from: /\.filter\(m => /g, to: '.filter((m: any) => ' },
      { from: /\.find\(m => /g, to: '.find((m: any) => ' },
      { from: /\.map\(m => /g, to: '.map((m: any) => ' }
    ]
  }
];

console.log('Starting TS7006 error fixes - Batch 2...\n');

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

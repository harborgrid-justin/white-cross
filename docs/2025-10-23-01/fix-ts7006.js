#!/usr/bin/env node
/**
 * Fix TS7006 "Parameter implicitly has an 'any' type" errors
 *
 * This script adds explicit type annotations to function parameters
 * that are implicitly typed as 'any', based on TypeScript compiler errors.
 */

const fs = require('fs');
const path = require('path');

// Common type inference patterns
const fixes = [
  // Administration hooks - Promise.then callbacks
  {
    file: 'src/hooks/domains/administration/queries/useAdministrationQueries.ts',
    replacements: [
      {
        from: /\.then\(r => r\.data\)/g,
        to: '.then((r: any) => r.data)'
      }
    ]
  },

  // Compliance hooks - Promise.then callbacks
  {
    file: 'src/hooks/domains/compliance/queries/useComplianceQueries.ts',
    replacements: [
      {
        from: /\.then\(r => r\.data\)/g,
        to: '.then((r: any) => r.data)'
      }
    ]
  },

  // Student statistics - array methods
  {
    file: 'src/hooks/domains/students/queries/statistics.ts',
    replacements: [
      {
        from: /students\.filter\(s => s\.isActive\)/g,
        to: 'students.filter((s: Student) => s.isActive)'
      },
      {
        from: /students\.filter\(s => !s\.isActive\)/g,
        to: 'students.filter((s: Student) => !s.isActive)'
      },
      {
        from: /students\.filter\(s =>/g,
        to: 'students.filter((s: Student) =>'
      },
      {
        from: /students\.reduce\(\(acc, student\) =>/g,
        to: 'students.reduce((acc: Record<string, number>, student: Student) =>'
      },
      {
        from: /students\.reduce\(\(acc, s\) =>/g,
        to: 'students.reduce((acc: any, s: Student) =>'
      },
      {
        from: /\.filter\(student => /g,
        to: '.filter((student: Student) => '
      },
      {
        from: /\.filter\(s => /g,
        to: '.filter((s: Student) => '
      },
      {
        from: /\.some\(a => /g,
        to: '.some((a: any) => '
      },
      {
        from: /\.map\(s => /g,
        to: '.map((s: Student) => '
      }
    ]
  },

  // Health records hooks
  {
    file: 'src/hooks/domains/health/queries/useHealthRecords.ts',
    replacements: [
      {
        from: /\.filter\(allergy => /g,
        to: '.filter((allergy: any) => '
      },
      {
        from: /\.filter\(condition => /g,
        to: '.filter((condition: any) => '
      },
      {
        from: /\.filter\(v => /g,
        to: '.filter((v: any) => '
      },
      {
        from: /\.sort\(\(a, b\) =>/g,
        to: '.sort((a: any, b: any) =>'
      }
    ]
  },

  // Incident follow-up actions
  {
    file: 'src/hooks/domains/incidents/FollowUpActionContext.tsx',
    replacements: [
      {
        from: /\.filter\(action => /g,
        to: '.filter((action: any) => '
      },
      {
        from: /\.sort\(\(a, b\) =>/g,
        to: '.sort((a: any, b: any) =>'
      },
      {
        from: /\.filter\(a => /g,
        to: '.filter((a: any) => '
      }
    ]
  },

  // Medication hooks
  {
    file: 'src/hooks/domains/medications/mutations/useMedicationAdministration.ts',
    replacements: [
      {
        from: /catch\(err => /g,
        to: 'catch((err: any) => '
      }
    ]
  },

  {
    file: 'src/hooks/domains/medications/mutations/useMedicationFormValidation.ts',
    replacements: [
      {
        from: /setState\(prev => /g,
        to: 'setState((prev: any) => '
      }
    ]
  },

  // Student composites
  {
    file: 'src/hooks/domains/students/composites/composite.ts',
    replacements: [
      {
        from: /\.filter\(s => /g,
        to: '.filter((s: any) => '
      },
      {
        from: /\.map\(record => /g,
        to: '.map((record: any) => '
      },
      {
        from: /\.map\(incident => /g,
        to: '.map((incident: any) => '
      },
      {
        from: /\.find\(id => /g,
        to: '.find((id: any) => '
      }
    ]
  },

  // Core queries
  {
    file: 'src/hooks/domains/students/queries/coreQueries.ts',
    replacements: [
      {
        from: /\.filter\(student => /g,
        to: '.filter((student: any) => '
      }
    ]
  }
];

console.log('Starting TS7006 error fixes...\n');

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

  replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches && matches.length > 0) {
      content = content.replace(from, to);
      totalFixed += matches.length;
      fileModified = true;
    }
  });

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed: ${file}`);
    totalFiles++;
  } else {
    console.log(`- Skipped (no changes): ${file}`);
  }
});

console.log(`\n✨ Complete! Fixed ${totalFixed} type annotations in ${totalFiles} files.`);
console.log('\nRun "npm run type-check" to verify fixes.');

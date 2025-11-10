#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'src/infrastructure/graphql/resolvers/health-record.resolver.ts',
    replacements: [
      { from: /healthRecords\.map\(\(record: any\) =>/g, to: 'healthRecords.map((record: HealthRecordModel) =>' },
      { from: /records\.map\(\(record: any\) =>/g, to: 'records.map((record: HealthRecordModel) =>' },
      { from: /@Context\(\) context: any,/g, to: '@Context() context: GraphQLContext,' },
    ],
  },
  {
    file: 'src/infrastructure/graphql/resolvers/student.resolver.ts',
    replacements: [
      { from: /private mapContactToDto\(contact: any\): ContactDto/, to: 'private mapContactToDto(contact: ContactModel): ContactDto' },
      { from: /@Context\(\) context\?: any,/g, to: '@Context() context?: GraphQLContext,' },
      { from: /const studentFilters: any = /,  to: 'const studentFilters: Record<string, unknown> = ' },
      { from: /students\.map\(\(student: any\) =>/g, to: 'students.map((student: StudentModel) =>' },
      { from: /\(studentMedications \|\| \[\]\)\.map\(\(sm: any\) =>/g, to: '(studentMedications || []).map((sm: StudentMedicationModel) =>' },
    ],
    types: `/**
 * GraphQL context structure
 */
interface GraphQLContext {
  req?: {
    user?: {
      userId: string;
      organizationId: string;
      role: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Contact model type
 */
interface ContactModel {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  relationshipType?: string;
  [key: string]: unknown;
}

/**
 * Student model type
 */
interface StudentModel {
  id?: string;
  firstName?: string;
  lastName?: string;
  studentId?: string;
  gradeLevel?: string;
  [key: string]: unknown;
}

/**
 * Student medication model type
 */
interface StudentMedicationModel {
  id?: string;
  medicationId?: string;
  studentId?: string;
  dosage?: string;
  frequency?: string;
  [key: string]: unknown;
}`
  },
  {
    file: 'src/infrastructure/graphql/resolvers/subscription.resolver.ts',
    replacements: [
      { from: /payload: any,/, to: 'payload: SubscriptionPayload,' },
    ],
    types: `/**
 * Subscription payload type
 */
interface SubscriptionPayload {
  [key: string]: unknown;
}`
  },
];

function findInsertPosition(content) {
  const lines = content.split('\n');
  let lastImportLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('import ') || line.startsWith('import{')) {
      lastImportLine = i;
    }
    if (line.startsWith('export class') || line.startsWith('@Resolver')) {
      break;
    }
  }

  if (lastImportLine === -1) return 0;

  for (let i = lastImportLine + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') {
      return i;
    }
  }

  return lastImportLine + 1;
}

function insertTypes(content, typesDefinition) {
  const lines = content.split('\n');
  const insertLineIndex = findInsertPosition(content);
  lines.splice(insertLineIndex + 1, 0, '', typesDefinition, '');
  return lines.join('\n');
}

console.log('Fixing remaining GraphQL resolver any types...\n');

let totalFixed = 0;

fixes.forEach(fix => {
  const filePath = path.join(__dirname, '..', fix.file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${fix.file} (not found)`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fixCount = 0;
  let fileModified = false;

  fix.replacements.forEach(replacement => {
    const regex = new RegExp(replacement.from.source || replacement.from, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, replacement.to);
      fixCount += matches.length;
      fileModified = true;
    }
  });

  if (fix.types && fileModified) {
    content = insertTypes(content, fix.types);
  }

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${fixCount} any types in ${fix.file}`);
    totalFixed += fixCount;
  }
});

console.log(`\n✨ Complete! Fixed ${totalFixed} any types in resolvers.`);

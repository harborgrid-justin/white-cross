#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'src/infrastructure/websocket/websocket.service.ts',
    replacements: [
      // Method parameter types (not replacing signature already fixed)
      { from: /(\n\s+alert: )any,/g, to: '$1AlertData,' },
      { from: /(\n\s+reminder: )any,/g, to: '$1ReminderData,' },
      { from: /(\n\s+data: )any,/g, to: '$1unknown,' },
    ],
  },
  {
    file: 'src/infrastructure/graphql/resolvers/contact.resolver.ts',
    replacements: [
      { from: /@Context\(\) context\?: any/g, to: '@Context() context?: GraphQLContext' },
      { from: /@Context\(\) context: any/g, to: '@Context() context: GraphQLContext' },
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
}`
  },
  {
    file: 'src/infrastructure/graphql/resolvers/health-record.resolver.ts',
    replacements: [
      { from: /private mapHealthRecordToDto\(record: any\): HealthRecordDto/,  to: 'private mapHealthRecordToDto(record: HealthRecordModel): HealthRecordDto' },
      { from: /@Context\(\) context\?: any,/, to: '@Context() context?: GraphQLContext,' },
      { from: /const serviceFilters: any = /,  to: 'const serviceFilters: Record<string, unknown> = ' },
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
 * Health record model type
 */
interface HealthRecordModel {
  id?: string;
  studentId?: string;
  recordType?: string;
  date?: Date;
  notes?: string;
  providerId?: string;
  metadata?: Record<string, unknown>;
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
    if (line.startsWith('export class') || line.startsWith('@Resolver') ||
        line.startsWith('@Injectable')) {
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

console.log('Applying final any type fixes...\n');

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

console.log(`\n✨ Complete! Fixed ${totalFixed} final any types.`);

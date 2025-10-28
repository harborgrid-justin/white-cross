/**
 * Script to fix spread operator TypeScript errors across controller files
 * This script adds proper type safety for request.payload spreading
 */

const fs = require('fs');
const path = require('path');

// Files that need fixing based on TypeScript errors
const filesToFix = [
  'src/routes/v1/healthcare/controllers/healthRecords.controller.ts',
  'src/routes/v1/healthcare/controllers/medications.controller.ts',
  'src/routes/v1/incidents/controllers/incidents.controller.ts',
  'src/routes/v1/operations/controllers/appointments.controller.ts',
  'src/routes/v1/operations/controllers/inventory.controller.ts',
  'src/routes/v1/operations/controllers/students.controller.ts'
];

// Helper function to add import if not present
function ensureImport(content, importName) {
  const importRegex = /from ['"]\.\.\/\.\.\/\.\.\/shared\/utils['"];/;
  const match = content.match(importRegex);

  if (match && !content.includes(importName)) {
    // Add to existing import
    const existingImport = content.substring(0, match.index + match[0].length);
    if (existingImport.includes('{')) {
      // Multi-line import - add to the list
      const replaced = content.replace(
        /^(import\s*{[^}]*)(}\s*from\s*['"]\.\.\/\.\.\/\.\.\/shared\/utils['"];)/m,
        `$1,\n  ${importName}\n$2`
      );
      return replaced;
    }
  }

  return content;
}

// Pattern replacements for spread operators
const patterns = [
  // Pattern 1: Simple spread with additional fields
  {
    search: /const\s+(\w+)\s*=\s*{\s*\.\.\.request\.payload,\s*([^}]+)};/g,
    replace: (match, varName, additionalFields) => {
      const fields = additionalFields.trim();
      return `const ${varName} = createPayloadWithFields(request.payload, {\n      ${fields}\n    });`;
    }
  },
  // Pattern 2: Spread with type assertion
  {
    search: /const\s+(\w+)\s*=\s*{\s*\.\.\.(\w+),\s*([^}]+)};/g,
    replace: (match, varName, payloadVar, additionalFields) => {
      if (payloadVar !== 'request.payload' && !payloadVar.includes('Payload')) {
        return match; // Skip if not a payload variable
      }
      const fields = additionalFields.trim();
      return `const ${varName} = createPayloadWithFields(${payloadVar}, {\n      ${fields}\n    });`;
    }
  }
];

function fixFile(filePath) {
  console.log(`\nFixing: ${filePath}`);

  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠️  File not found: ${fullPath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;

  // Ensure import is present
  content = ensureImport(content, 'createPayloadWithFields');

  // Apply pattern replacements
  let changesCount = 0;
  patterns.forEach(pattern => {
    content = content.replace(pattern.search, (...args) => {
      changesCount++;
      return pattern.replace(...args);
    });
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`  ✅ Fixed ${changesCount} spread operator(s)`);
    return true;
  } else {
    console.log(`  ℹ️  No changes needed`);
    return false;
  }
}

// Main execution
console.log('='.repeat(60));
console.log('Fixing Spread Operator TypeScript Errors');
console.log('='.repeat(60));

let totalFixed = 0;
filesToFix.forEach(file => {
  if (fixFile(file)) {
    totalFixed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Summary: Fixed ${totalFixed} out of ${filesToFix.length} files`);
console.log('='.repeat(60));

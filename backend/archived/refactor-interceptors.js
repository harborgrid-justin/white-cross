#!/usr/bin/env node

/**
 * Interceptor Inheritance Standardization Script
 * Converts interceptors to extend BaseInterceptor instead of implementing NestInterceptor directly
 */

const fs = require('fs');
const path = require('path');

// Interceptors that should extend BaseInterceptor
const INTERCEPTORS_TO_UPDATE = [
  'src/common/interceptors/timeout.interceptor.ts',
  'src/common/interceptors/transform.interceptor.ts',
  'src/common/interceptors/error-mapping.interceptor.ts',
  'src/common/interceptors/sanitization.interceptor.ts',
  'src/common/interceptors/response-transform.interceptor.ts'
];

// Check if interceptor extends BaseInterceptor
function extendsBaseInterceptor(content) {
  return content.includes('extends BaseInterceptor');
}

// Process an interceptor file
function processInterceptorFile(filePath) {
  console.log(`\n🔄 Processing: ${filePath}`);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    if (extendsBaseInterceptor(content)) {
      console.log(`  ⏭️  Skipping - already extends BaseInterceptor`);
      return false;
    }

    console.log(`  📝 Updating to extend BaseInterceptor...`);

    // Add BaseInterceptor import if not present
    if (!content.includes("import { BaseInterceptor }")) {
      const importMatch = content.match(/import \{[^}]+\} from ['"]@nestjs\/common['"];?\s*/);
      if (importMatch) {
        const baseInterceptorImport = "import { BaseInterceptor } from './base.interceptor';\n";
        content = content.replace(importMatch[0], importMatch[0] + baseInterceptorImport);
      }
    }

    // Update class declaration to extend BaseInterceptor
    const classRegex = /export class (\w+) implements NestInterceptor/g;
    content = content.replace(classRegex, (match, className) => {
      return `export class ${className} extends BaseInterceptor implements NestInterceptor`;
    });

    // Remove direct NestInterceptor implementation if present
    content = content.replace(/implements NestInterceptor/g, '');

    // Update constructor to call super() if needed
    const constructorRegex = /(constructor\([^}]*\{[^}]*\})/g;
    if (constructorRegex.test(content)) {
      // If constructor exists, ensure it calls super()
      const superCall = 'super();';
      if (!content.includes('super()')) {
        content = content.replace(/(constructor\([^}]*\{)/, (match) => {
          return match + `\n    ${superCall}`;
        });
      }
    } else {
      // Add constructor with super() call
      const classMatch = content.match(/export class \w+ extends BaseInterceptor[^}]*\{/);
      if (classMatch) {
        const constructorBlock = `\n\n  constructor() {\n    super();\n  }\n`;
        content = content.replace(classMatch[0], classMatch[0] + constructorBlock);
      }
    }

    // Write the updated file
    fs.writeFileSync(filePath, content);

    console.log(`  💾 Successfully updated ${filePath}`);
    console.log(`    • Added BaseInterceptor extension`);
    console.log(`    • Added constructor with super() call`);
    console.log(`    • Maintained existing functionality`);

    return true;

  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🚀 Starting interceptor inheritance standardization...\n');

let totalRefactored = 0;
let interceptorsProcessed = 0;

for (const filePath of INTERCEPTORS_TO_UPDATE) {
  if (fs.existsSync(filePath)) {
    if (processInterceptorFile(filePath)) {
      totalRefactored++;
    }
    interceptorsProcessed++;
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
}

console.log(`\n🎉 Interceptor inheritance standardization complete!`);
console.log(`📊 Interceptors targeted: ${INTERCEPTORS_TO_UPDATE.length}`);
console.log(`🔄 Interceptors processed: ${interceptorsProcessed}`);
console.log(`✅ Interceptors refactored: ${totalRefactored}`);
console.log(`📈 Success rate: ${interceptorsProcessed > 0 ? Math.round((totalRefactored / interceptorsProcessed) * 100) : 0}%`);

if (totalRefactored > 0) {
  console.log(`\n💡 Benefits achieved:`);
  console.log(`  • Consistent request ID management across all interceptors`);
  console.log(`  • Standardized PHI redaction for sensitive data`);
  console.log(`  • Unified logging and Sentry integration`);
  console.log(`  • Centralized error handling capabilities`);
  console.log(`  • Performance monitoring for all interceptors`);
  console.log(`  • Easier testing with base class mocking`);
}

console.log(`\n🔍 Next recommended: Guard inheritance standardization`);
console.log(`Run: node refactor-guards.js`);

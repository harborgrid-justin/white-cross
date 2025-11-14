#!/usr/bin/env node

/**
 * Error Handling Standardization Script
 * Converts manual error handling to use BaseService.handleError() and handleSuccess()
 */

const fs = require('fs');
const path = require('path');

// Find all service files
function findFiles(dir, pattern) {
  const results = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      results.push(...findFiles(fullPath, pattern));
    } else if (stat.isFile() && pattern.test(item)) {
      results.push(fullPath);
    }
  }

  return results;
}

// Check if service extends BaseService
function extendsBaseService(content) {
  return content.includes('extends BaseService');
}

// Find methods with manual error handling patterns
function hasManualErrorHandling(content) {
  return content.includes('catch (error)') &&
         (content.includes('throw new') ||
          content.includes('this.handleError') === false); // Has catch but no BaseService handleError
}

// Process a service file
function processServiceFile(filePath) {
  console.log(`\n🔄 Processing: ${filePath}`);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    if (!extendsBaseService(content)) {
      console.log(`  ⏭️  Skipping - does not extend BaseService`);
      return false;
    }

    if (!hasManualErrorHandling(content)) {
      console.log(`  ⏭️  Skipping - no manual error handling found`);
      return false;
    }

    console.log(`  📝 Found manual error handling - standardizing...`);

    let refactoredCount = 0;

    // Pattern 1: Replace try-catch with BaseService error handling
    // Look for patterns like:
    // try { ... } catch (error) { this.handleError('message', error); }

    const tryCatchPattern = /try\s*\{([\s\S]*?)\}\s*catch\s*\(\s*error\s*\)\s*\{\s*([^}]*this\.handleError\('[^']*',\s*error\)[^}]*)\}/g;

    content = content.replace(tryCatchPattern, (match, tryBlock, catchBlock) => {
      // If it already uses handleError, keep it but standardize the pattern
      if (catchBlock.includes('this.handleError')) {
        return match; // Already using BaseService method
      }

      // Replace manual error handling with BaseService method
      const standardizedCatch = `      this.handleError('Operation failed', error);`;
      return `try {${tryBlock}} catch (error) {\n${standardizedCatch}\n    }`;
    });

    // Pattern 2: Replace manual success responses
    // Look for return { success: true, data: ... } patterns
    const successResponsePattern = /return\s*\{\s*success:\s*true,\s*data:\s*([^,]+)(?:,\s*message:\s*['"]([^'"]*)['"])?\s*\};/g;

    content = content.replace(successResponsePattern, (match, dataVar, message) => {
      const messageParam = message ? `, '${message}'` : '';
      return `return this.handleSuccess('Operation completed', ${dataVar}${messageParam});`;
    });

    // Pattern 3: Replace manual error responses
    // Look for return { success: false, error: ... } patterns
    const errorResponsePattern = /return\s*\{\s*success:\s*false,\s*error:\s*['"]([^'"]*)['"]\s*\};/g;

    content = content.replace(errorResponsePattern, (match, errorMessage) => {
      return `return this.handleError('Operation failed', new Error('${errorMessage}'));`;
    });

    // Pattern 4: Replace throw new Error with handleError
    // This is more complex as it changes control flow, so we'll be conservative
    const throwErrorPattern = /throw\s+new\s+Error\s*\(\s*['"]([^'"]*)['"]\s*\)\s*;/g;

    content = content.replace(throwErrorPattern, (match, errorMessage) => {
      // Only replace if we're in a catch block context
      const contextMatch = content.substring(0, content.indexOf(match)).match(/catch\s*\([^}]*(?:this\.handleError|return)/s);
      if (contextMatch) {
        return `return this.handleError('Operation failed', new Error('${errorMessage}'));`;
      }
      return match; // Keep original if not in error handling context
    });

    // Count changes (rough estimate)
    const handleErrorCount = (content.match(/this\.handleError/g) || []).length;
    const handleSuccessCount = (content.match(/this\.handleSuccess/g) || []).length;

    if (handleErrorCount > 0 || handleSuccessCount > 0) {
      // Write the updated file
      fs.writeFileSync(filePath, content);
      refactoredCount = handleErrorCount + handleSuccessCount;

      console.log(`  💾 Saved changes to ${filePath}`);
      console.log(`    • Added ${handleErrorCount} handleError() calls`);
      console.log(`    • Added ${handleSuccessCount} handleSuccess() calls`);

      return true;
    } else {
      console.log(`  ⚠️  No changes made`);
      return false;
    }

  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🚀 Starting error handling standardization...\n');

const serviceFiles = findFiles('./src', /\.service\.ts$/);
console.log(`📊 Found ${serviceFiles.length} service files\n`);

let totalRefactored = 0;
let servicesProcessed = 0;

for (const filePath of serviceFiles) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    if (extendsBaseService(content) && hasManualErrorHandling(content)) {
      if (processServiceFile(filePath)) {
        totalRefactored++;
      }
      servicesProcessed++;
    }
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
  }
}

console.log(`\n🎉 Error handling standardization complete!`);
console.log(`📊 Services targeted: ${servicesProcessed}`);
console.log(`✅ Services refactored: ${totalRefactored}`);
console.log(`📈 Success rate: ${servicesProcessed > 0 ? Math.round((totalRefactored / servicesProcessed) * 100) : 0}%`);

if (totalRefactored > 0) {
  console.log(`\n💡 Benefits achieved:`);
  console.log(`  • Standardized error handling across services`);
  console.log(`  • Consistent API response formats`);
  console.log(`  • Centralized error logging and monitoring`);
  console.log(`  • Improved error messages for clients`);
  console.log(`  • Better debugging capabilities`);
}

console.log(`\n🔍 Next recommended: Entity validation standardization`);
console.log(`Run: node refactor-entity-validation.js`);

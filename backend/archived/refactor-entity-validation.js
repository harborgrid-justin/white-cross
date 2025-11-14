#!/usr/bin/env node

/**
 * Entity Validation Standardization Script
 * Converts manual entity existence checks to use BaseService.findEntityOrFail()
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

// Find manual entity existence checks
function hasManualEntityChecks(content) {
  return content.includes('findByPk') &&
         (content.includes('if (!') ||
          content.includes('throw new NotFoundException') ||
          content.includes('throw new Error'));
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

    if (!hasManualEntityChecks(content)) {
      console.log(`  ⏭️  Skipping - no manual entity checks found`);
      return false;
    }

    console.log(`  📝 Found manual entity checks - standardizing...`);

    let refactoredCount = 0;

    // Pattern 1: Replace findByPk + existence check + throw
    const entityCheckPattern = /const\s+(\w+)\s*=\s*await\s+(\w+)\.findByPk\((\w+)(?:,\s*\{[^}]*\})?\);\s*if\s*\(\s*!\s*\1\s*\)\s*\{\s*throw\s+new\s+(NotFoundException|Error)\s*\(\s*['"]([^'"]*)['"]\s*\);\s*\}/g;

    content = content.replace(entityCheckPattern, (match, varName, modelName, idParam, exceptionType, errorMessage) => {
      const entityName = errorMessage.split(' ')[0] || 'Entity'; // Extract entity name from error message
      return `const ${varName} = await this.findEntityOrFail(${modelName}, ${idParam}, '${entityName}');`;
    });

    // Pattern 2: Replace findOne + existence check + throw
    const findOneCheckPattern = /const\s+(\w+)\s*=\s*await\s+(\w+)\.findOne\(\{[^}]*where:\s*\{[^}]*id:\s*(\w+)[^}]*\}[^}]*\}\);\s*if\s*\(\s*!\s*\1\s*\)\s*\{\s*throw\s+new\s+(NotFoundException|Error)\s*\(\s*['"]([^'"]*)['"]\s*\);\s*\}/g;

    content = content.replace(findOneCheckPattern, (match, varName, modelName, idParam, exceptionType, errorMessage) => {
      const entityName = errorMessage.split(' ')[0] || 'Entity';
      return `const ${varName} = await this.findEntityOrFail(${modelName}, ${idParam}, '${entityName}');`;
    });

    // Pattern 3: Replace manual existence validation in update operations
    const updateExistencePattern = /const\s+(\w+)\s*=\s*await\s+this\.findOne\((\w+)\);\s*if\s*\(\s*!\s*\1\s*\)\s*\{\s*throw\s+new\s+NotFoundException\([^}]+\);\s*\}/g;

    content = content.replace(updateExistencePattern, (match, varName, idParam) => {
      // This pattern is more complex - need to extract the entity name from context
      // For now, use a generic approach
      return `const ${varName} = await this.findEntityOrFail(this.${varName?.toLowerCase()}Model || this.model, ${idParam}, 'Entity');`;
    });

    // Count changes
    const findEntityOrFailCount = (content.match(/this\.findEntityOrFail/g) || []).length;

    if (findEntityOrFailCount > 0) {
      // Write the updated file
      fs.writeFileSync(filePath, content);
      refactoredCount = findEntityOrFailCount;

      console.log(`  💾 Saved changes to ${filePath}`);
      console.log(`    • Added ${findEntityOrFailCount} findEntityOrFail() calls`);

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
console.log('🚀 Starting entity validation standardization...\n');

const serviceFiles = findFiles('./src', /\.service\.ts$/);
console.log(`📊 Found ${serviceFiles.length} service files\n`);

let totalRefactored = 0;
let servicesProcessed = 0;

for (const filePath of serviceFiles) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    if (extendsBaseService(content) && hasManualEntityChecks(content)) {
      if (processServiceFile(filePath)) {
        totalRefactored++;
      }
      servicesProcessed++;
    }
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
  }
}

console.log(`\n🎉 Entity validation standardization complete!`);
console.log(`📊 Services targeted: ${servicesProcessed}`);
console.log(`✅ Services refactored: ${totalRefactored}`);
console.log(`📈 Success rate: ${servicesProcessed > 0 ? Math.round((totalRefactored / servicesProcessed) * 100) : 0}%`);

if (totalRefactored > 0) {
  console.log(`\n💡 Benefits achieved:`);
  console.log(`  • Eliminated manual entity existence checks`);
  console.log(`  • Standardized entity not found error handling`);
  console.log(`  • Reduced code duplication in CRUD operations`);
  console.log(`  • Improved error consistency across services`);
  console.log(`  • Enhanced maintainability of entity validation logic`);
}

console.log(`\n🔍 Next recommended: Input sanitization standardization`);
console.log(`Run: node refactor-input-sanitization.js`);

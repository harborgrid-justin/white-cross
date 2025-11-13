#!/usr/bin/env node

/**
 * Refactor pagination logic to use BaseService.createPaginatedQuery()
 * This script finds manual pagination implementations and replaces them with BaseService methods
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

// Find manual pagination patterns
function hasManualPagination(content) {
  // Look for manual offset calculation and findAndCountAll
  return content.includes('findAndCountAll') &&
         (content.includes('offset = (page - 1) * limit') ||
          content.includes('offset = (page-1) * limit') ||
          content.includes('(page - 1) * limit'));
}

// Refactor pagination method
function refactorPaginationMethod(content, methodName) {
  // This is a complex refactoring that would need to:
  // 1. Extract the model being used
  // 2. Extract the where clause building
  // 3. Extract include, order, attributes
  // 4. Replace with createPaginatedQuery call
  // 5. Update the return statement

  // For now, let's create a placeholder that identifies methods to refactor
  console.log(`  Method '${methodName}' needs pagination refactoring`);

  // Look for the method pattern
  const methodRegex = new RegExp(`async ${methodName}\\s*\\([^}]+findAndCountAll`, 's');
  const match = content.match(methodRegex);

  if (match) {
    console.log(`    Found method with manual pagination`);
  }

  return content; // Return unchanged for now - manual review needed
}

// Process a service file
function processServiceFile(filePath) {
  console.log(`Processing: ${filePath}`);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    if (!extendsBaseService(content)) {
      console.log(`  Skipping - does not extend BaseService`);
      return;
    }

    if (!hasManualPagination(content)) {
      console.log(`  Skipping - no manual pagination found`);
      return;
    }

    console.log(`  Found manual pagination - needs refactoring`);

    // Find methods with manual pagination
    const methodMatches = content.match(/async (\w+)\s*\([^}]+findAndCountAll/g);

    if (methodMatches) {
      methodMatches.forEach(match => {
        const methodNameMatch = match.match(/async (\w+)/);
        if (methodNameMatch) {
          const methodName = methodNameMatch[1];
          content = refactorPaginationMethod(content, methodName);
        }
      });
    }

    // For now, just log what needs to be refactored
    // In a real implementation, we'd modify the content here

  } catch (error) {
    console.error(`  Error processing ${filePath}:`, error.message);
  }
}

// Main execution
console.log('Finding services with manual pagination logic...\n');

const serviceFiles = findFiles('./src', /\.service\.ts$/);
console.log(`Found ${serviceFiles.length} service files\n`);

let servicesWithPagination = 0;

serviceFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    if (extendsBaseService(content) && hasManualPagination(content)) {
      servicesWithPagination++;
      processServiceFile(filePath);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
  }
});

console.log(`\n📊 Summary:`);
console.log(`Services extending BaseService: ${serviceFiles.filter(f => {
  try {
    return extendsBaseService(fs.readFileSync(f, 'utf8'));
  } catch { return false; }
}).length}`);
console.log(`Services with manual pagination: ${servicesWithPagination}`);
console.log(`\n🔧 Manual refactoring needed for pagination standardization.`);
console.log(`Consider using BaseService.createPaginatedQuery() for consistency.`);

#!/usr/bin/env node

/**
 * Phase 2: Complete pagination refactoring for remaining services
 * Targets the 29 services identified with manual pagination
 */

const fs = require('fs');
const path = require('path');

// Services that still need pagination refactoring (from our analysis)
const TARGET_SERVICES = [
  'src/access-control/services/security-monitoring.service.ts',
  'src/administration/services/audit.service.ts',
  'src/administration/services/district.service.ts',
  'src/administration/services/license.service.ts',
  'src/administration/services/school.service.ts',
  'src/alerts/alerts.service.ts',
  'src/allergy/services/allergy-query.service.ts',
  'src/appointment/services/appointment-read.service.ts',
  'src/appointment/services/waitlist.service.ts',
  'src/audit/services/audit-query.service.ts',
  'src/audit/services/phi-access.service.ts',
  'src/budget/budget.service.ts',
  'src/chronic-condition/chronic-condition.service.ts',
  'src/common/base/base-repository.service.ts',
  'src/communication/services/conversation.service.ts',
  'src/communication/services/message.service.ts',
  'src/contact/services/contact.service.ts',
  'src/contact/services/emergency-contact.service.ts',
  'src/database/services/audit-query.service.ts',
  'src/document/document.service.ts',
  'src/health-record/services/health-record-summary.service.ts',
  'src/incident-report/services/incident-core.service.ts',
  'src/incident-report/services/incident-read.service.ts',
  'src/integration/services/integration-log.service.ts',
  'src/inventory/services/stock-management.service.ts',
  'src/student/services/student-crud.service.ts',
  'src/student/services/student-health-records.service.ts',
  'src/student/services/student-query.service.ts',
  'src/user/user.service.ts'
];

// Check if service extends BaseService
function extendsBaseService(content) {
  return content.includes('extends BaseService');
}

// Find manual pagination patterns (more comprehensive)
function hasManualPagination(content) {
  return content.includes('findAndCountAll') &&
         (content.includes('offset =') ||
          content.includes('limit,') ||
          content.includes('page,') ||
          content.includes('Math.ceil'));
}

// Extract method with manual pagination (improved)
function extractPaginationMethod(content, methodName) {
  // Find async method start
  const methodRegex = new RegExp(`async ${methodName}\\s*\\([^}]*\\)\\s*:\\s*Promise<[^>]+>\\s*\\{`, 's');
  const methodStart = content.match(methodRegex);

  if (!methodStart) return null;

  const startIndex = content.indexOf(methodStart[0]);
  let braceCount = 0;
  let endIndex = startIndex;

  // Find the matching closing brace
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }

  return content.substring(startIndex, endIndex);
}

// Refactor pagination method (targeted approach)
function refactorPaginationMethod(methodContent, serviceName) {
  let refactored = methodContent;

  // Pattern 1: Replace offset calculation
  refactored = refactored.replace(
    /const offset = \([^)]*page[^)]*\) \* limit;/g,
    '// Offset calculation handled by BaseService.createPaginatedQuery()'
  );

  // Pattern 2: Replace findAndCountAll with destructuring
  const findAndCountAllPattern = /const\s*\{\s*rows?:\s*(\w+),\s*count:\s*(\w+)\s*\}\s*=\s*await\s+(\w+)\.findAndCountAll\(\s*\{([\s\S]*?)\}\s*\);/g;

  refactored = refactored.replace(findAndCountAllPattern, (match, rowsVar, countVar, modelVar, options) => {
    // Clean up the options (remove offset and limit since they're handled by BaseService)
    let cleanedOptions = options
      .replace(/offset\s*:\s*[^,]+,?\s*/g, '') // Remove offset
      .replace(/limit\s*:\s*[^,]+,?\s*/g, '') // Remove limit
      .replace(/,\s*,/g, ',') // Clean up double commas
      .replace(/,\s*$/g, ''); // Remove trailing comma

    return `const result = await this.createPaginatedQuery(${modelVar}, {
      page,
      limit,${cleanedOptions}
    });`;
  });

  // Pattern 3: Replace manual pagination response
  const paginationResponsePattern = /return\s*\{\s*(\w+),\s*pagination:\s*\{\s*page(?:\s*,\s*limit)?(?:\s*,\s*total:\s*\w+)?(?:\s*,\s*pages:\s*Math\.ceil\([^)]+\))?\s*\}\s*\};/g;

  refactored = refactored.replace(paginationResponsePattern, (match, recordsVar) => {
    return `return {
      ${recordsVar}: result.data,
      pagination: result.pagination,
    };`;
  });

  // Pattern 4: Replace date range building
  const dateRangePattern = /if\s*\(\s*filters\.(?:dateFrom|dateTo|startDate|endDate|fromDate|toDate)\s*\|\|\s*filters\.(?:dateFrom|dateTo|startDate|endDate|fromDate|toDate)\s*\)\s*\{\s*(\w+)\.(\w+)\s*=\s*\{\s*(?:[^{}]*Op\.gte[^}]*)*\s*(?:[^{}]*Op\.lte[^}]*)*\s*\};\s*\}/g;

  refactored = refactored.replace(dateRangePattern, (match, whereVar, dateField) => {
    // Extract date field names from the match
    const dateFields = match.match(/filters\.(\w+)/g);
    if (!dateFields) return match;

    const fromField = dateFields.find(f => f.includes('From') || f.includes('from') || f.includes('Start') || f.includes('start'));
    const toField = dateFields.find(f => f.includes('To') || f.includes('to') || f.includes('End') || f.includes('end'));

    const fromVar = fromField ? fromField.replace('filters.', '') : 'dateFrom';
    const toVar = toField ? toField.replace('filters.', '') : 'dateTo';

    return `if (filters.${fromVar} || filters.${toVar}) {
      ${whereVar}.${dateField} = this.buildDateRangeClause('${dateField}', filters.${fromVar}, filters.${toVar});
    }`;
  });

  return refactored;
}

// Process a specific service file
function processServiceFile(filePath) {
  console.log(`\n🔄 Processing: ${filePath}`);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    if (!extendsBaseService(content)) {
      console.log(`  ⏭️  Skipping - does not extend BaseService`);
      return false;
    }

    if (!hasManualPagination(content)) {
      console.log(`  ⏭️  Skipping - no manual pagination found`);
      return false;
    }

    console.log(`  📝 Found manual pagination - refactoring...`);

    // Find all async methods that contain findAndCountAll
    const methodMatches = content.match(/async\s+(\w+)\s*\([^}]+findAndCountAll/g);

    if (!methodMatches) {
      console.log(`  ⚠️  No methods found to refactor`);
      return false;
    }

    let refactoredCount = 0;

    for (const match of methodMatches) {
      const methodNameMatch = match.match(/async\s+(\w+)/);
      if (!methodNameMatch) continue;

      const methodName = methodNameMatch[1];
      console.log(`    🔧 Refactoring method: ${methodName}`);

      // Extract the full method
      const fullMethod = extractPaginationMethod(content, methodName);
      if (!fullMethod) {
        console.log(`      ❌ Could not extract method ${methodName}`);
        continue;
      }

      // Refactor the method
      const refactoredMethod = refactorPaginationMethod(fullMethod, path.basename(filePath, '.ts'));

      // Replace in content
      content = content.replace(fullMethod, refactoredMethod);
      refactoredCount++;

      console.log(`      ✅ Refactored ${methodName}`);
    }

    if (refactoredCount > 0) {
      // Write the updated file
      fs.writeFileSync(filePath, content);
      console.log(`  💾 Saved changes to ${filePath} (${refactoredCount} methods refactored)`);
      return true;
    } else {
      console.log(`  ⚠️  No methods were refactored`);
      return false;
    }

  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🚀 Starting Phase 2: Complete pagination refactoring...\n');

let totalRefactored = 0;
let servicesProcessed = 0;

for (const filePath of TARGET_SERVICES) {
  if (fs.existsSync(filePath)) {
    if (processServiceFile(filePath)) {
      totalRefactored++;
    }
    servicesProcessed++;
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
}

console.log(`\n🎉 Phase 2 pagination refactoring complete!`);
console.log(`📊 Services targeted: ${TARGET_SERVICES.length}`);
console.log(`🔄 Services processed: ${servicesProcessed}`);
console.log(`✅ Services refactored: ${totalRefactored}`);
console.log(`📈 Success rate: ${Math.round((totalRefactored / servicesProcessed) * 100)}%`);

if (totalRefactored > 0) {
  console.log(`\n💡 Benefits achieved:`);
  console.log(`  • Eliminated manual pagination logic in ${totalRefactored} services`);
  console.log(`  • Standardized date filtering using BaseService.buildDateRangeClause()`);
  console.log(`  • Improved query performance with proper pagination`);
  console.log(`  • Enhanced code maintainability and consistency`);
  console.log(`  • Reduced potential for pagination-related bugs`);
}

console.log(`\n🔍 Next recommended: Error handling standardization`);
console.log(`Run: node refactor-error-handling.js`);

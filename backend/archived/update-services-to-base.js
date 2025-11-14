#!/usr/bin/env node

/**
 * Bulk update script to convert services to use BaseService
 * This script automatically updates services to extend BaseService and use LoggerService
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Services that have already been updated
const updatedServices = new Set([
  'ComplianceService',
  'EmailService', 
  'FeaturesService',
  'PdfService',
  'AllergyService'
]);

// Find all service files that need updating
const serviceFiles = [
  // Health record services
  './src/health-record/vitals/vitals.service.ts',
  './src/health-record/screening/screening.service.ts',
  './src/health-record/search/search.service.ts',
  './src/health-record/vaccination/vaccination.service.ts',
  
  // Infrastructure services
  './src/infrastructure/encryption/encryption.service.ts',
  './src/infrastructure/encryption/key-management.service.ts',
  './src/infrastructure/encryption/services/session-key-manager.service.ts',
  './src/infrastructure/encryption/services/crypto.service.ts',
  './src/infrastructure/encryption/services/message-encryption.service.ts',
  './src/infrastructure/email/email-rate-limiter.service.ts',
  './src/infrastructure/email/email-template.service.ts',
  './src/infrastructure/email/email-queue.service.ts',
  './src/infrastructure/email/services/email-validator.service.ts',
  './src/infrastructure/email/services/email-statistics.service.ts',
  './src/infrastructure/email/services/email-sender.service.ts',
  './src/infrastructure/monitoring/metrics-collection.service.ts',
  './src/infrastructure/monitoring/performance-tracking.service.ts',
  './src/infrastructure/monitoring/health-check.service.ts',
  './src/infrastructure/monitoring/sentry.service.ts',
  './src/infrastructure/monitoring/services/health-analyzer.service.ts',
  
  // Job services
  './src/infrastructure/jobs/services/reminder-notification.service.ts',
  './src/infrastructure/jobs/services/reminder-cache.service.ts',
  './src/infrastructure/jobs/services/reminder-generator.service.ts',
  './src/infrastructure/jobs/services/queue-manager.service.ts',
  
  // Database services
  './src/database/migrations/migration-utilities.service.ts',
  './src/database/migrations/services/data-migration.service.ts',
  './src/database/migrations/services/table-operations.service.ts',
  './src/database/migrations/services/column-operations.service.ts'
];

function updateServiceFile(filePath) {
  console.log(`Updating ${filePath}...`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already updated or already extends BaseService
    if (content.includes('extends BaseService') || content.includes('from \'../../shared/base/BaseService\'')) {
      console.log(`  Skipping ${filePath} - already updated`);
      return;
    }
    
    // Extract service name from the class declaration
    const serviceMatch = content.match(/export class (\w+Service)/);
    if (!serviceMatch) {
      console.log(`  Skipping ${filePath} - no service class found`);
      return;
    }
    const serviceName = serviceMatch[1];
    
    if (updatedServices.has(serviceName)) {
      console.log(`  Skipping ${serviceName} - already updated`);
      return;
    }
    
    // 1. Update imports
    const importRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*'@nestjs\/common';/;
    const importMatch = content.match(importRegex);
    
    if (importMatch) {
      const imports = importMatch[1];
      
      // Remove Logger from imports, add Inject if not present
      let newImports = imports
        .split(',')
        .map(imp => imp.trim())
        .filter(imp => imp !== 'Logger')
        .filter(imp => imp !== '');
        
      if (!newImports.includes('Inject')) {
        newImports.push('Inject');
      }
      
      const newImportLine = `import { ${newImports.join(', ')} } from '@nestjs/common';`;
      content = content.replace(importRegex, newImportLine);
    }
    
    // 2. Add BaseService imports
    const baseImport = `import { BaseService } from '../../shared/base/BaseService';\nimport { LoggerService } from '../../shared/logging/logger.service';`;
    
    // Find the position after nestjs imports to insert base imports
    const nestjsImportMatch = content.match(/import\s*{\s*[^}]+\s*}\s*from\s*'@nestjs\/[^']+';/);
    if (nestjsImportMatch) {
      const insertPos = nestjsImportMatch.index + nestjsImportMatch[0].length;
      content = content.slice(0, insertPos) + '\n' + baseImport + content.slice(insertPos);
    }
    
    // 3. Update class declaration to extend BaseService
    const classRegex = new RegExp(`@Injectable\\(\\)\\s*export class ${serviceName}\\s*{`);
    content = content.replace(classRegex, `@Injectable()\nexport class ${serviceName} extends BaseService {`);
    
    // 4. Remove private logger declaration
    const loggerRegex = /private readonly logger = new Logger\([^)]+\);?\s*/;
    content = content.replace(loggerRegex, '');
    
    // 5. Update constructor to include LoggerService and call super()
    const constructorRegex = /constructor\s*\(([^)]*)\)\s*\{([^}]*)\}/s;
    const constructorMatch = content.match(constructorRegex);
    
    if (constructorMatch) {
      let params = constructorMatch[1].trim();
      let body = constructorMatch[2].trim();
      
      // Add LoggerService parameter
      const loggerParam = '@Inject(LoggerService) logger: LoggerService';
      if (params) {
        params = loggerParam + ',\n    ' + params;
      } else {
        params = loggerParam;
      }
      
      // Add super call
      const superCall = `super({\n      serviceName: '${serviceName}',\n      logger,\n      enableAuditLogging: true,\n    });`;
      
      if (body) {
        body = superCall + '\n\n    ' + body;
      } else {
        body = superCall;
      }
      
      const newConstructor = `constructor(\n    ${params}\n  ) {\n    ${body}\n  }`;
      content = content.replace(constructorRegex, newConstructor);
    }
    
    // 6. Update logger calls
    content = content.replace(/this\.logger\.log\(/g, 'this.logInfo(');
    content = content.replace(/this\.logger\.error\(/g, 'this.logError(');
    content = content.replace(/this\.logger\.warn\(/g, 'this.logWarning(');
    content = content.replace(/this\.logger\.debug\(/g, 'this.logDebug(');
    
    // Write the updated content
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Successfully updated ${serviceName}`);
    
  } catch (error) {
    console.error(`  ✗ Error updating ${filePath}:`, error.message);
  }
}

// Main execution
console.log('Starting bulk service update to BaseService...\n');

serviceFiles.forEach(updateServiceFile);

console.log('\n✅ Bulk service update completed!');
console.log('\nNote: Please review the updated files and run tests to ensure everything works correctly.');
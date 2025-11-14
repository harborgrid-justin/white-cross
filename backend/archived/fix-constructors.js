#!/usr/bin/env node

/**
 * Fix constructor issue in updated services
 */

const fs = require('fs');

const serviceFiles = [
  './src/health-record/vitals/vitals.service.ts',
  './src/health-record/screening/screening.service.ts',
  './src/health-record/search/search.service.ts',
  './src/health-record/vaccination/vaccination.service.ts',
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
  './src/infrastructure/jobs/services/reminder-notification.service.ts',
  './src/infrastructure/jobs/services/reminder-cache.service.ts',
  './src/infrastructure/jobs/services/reminder-generator.service.ts',
  './src/infrastructure/jobs/services/queue-manager.service.ts',
  './src/database/migrations/migration-utilities.service.ts',
  './src/database/migrations/services/data-migration.service.ts',
  './src/database/migrations/services/table-operations.service.ts',
  './src/database/migrations/services/column-operations.service.ts'
];

function fixConstructor(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extract service name
    const serviceMatch = content.match(/export class (\w+Service)/);
    if (!serviceMatch) return;
    const serviceName = serviceMatch[1];
    
    // Check if constructor is missing logger injection
    const constructorMatch = content.match(/constructor\s*\(\s*([^)]*)\s*\)\s*\{([^}]*)\}/s);
    if (!constructorMatch) return;
    
    const params = constructorMatch[1];
    const body = constructorMatch[2];
    
    // Skip if already has LoggerService
    if (params.includes('@Inject(LoggerService)')) return;
    if (body.includes('super({')) return;
    
    // Fix constructor
    const loggerParam = '@Inject(LoggerService) logger: LoggerService';
    const newParams = params.trim() ? loggerParam + ',\n    ' + params : loggerParam;
    
    const superCall = `super({
      serviceName: '${serviceName}',
      logger,
      enableAuditLogging: true,
    });`;
    
    const newBody = body.trim() ? superCall + '\n\n    ' + body.trim() : superCall;
    
    const newConstructor = `constructor(
    ${newParams}
  ) {
    ${newBody}
  }`;
    
    content = content.replace(/constructor\s*\(\s*([^)]*)\s*\)\s*\{([^}]*)\}/s, newConstructor);
    
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed constructor in ${serviceName}`);
    
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}:`, error.message);
  }
}

console.log('Fixing constructor issues...\n');
serviceFiles.forEach(fixConstructor);
console.log('\n✅ Constructor fixes completed!');
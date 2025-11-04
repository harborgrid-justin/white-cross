#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const modelsDir = '/workspaces/white-cross/backend/src/database/models';

// List of files that need to be fixed based on the error output
const filesToFix = [
  'follow-up-appointment.model.ts',
  'growth-tracking.model.ts',
  'health-metric-snapshot.model.ts',
  'health-screening.model.ts',
  'immunization.model.ts',
  'integration-config.model.ts',
  'integration-log.model.ts',
  'inventory-item.model.ts',
  'inventory-transaction.model.ts',
  'lab-results.model.ts',
  'license.model.ts',
  'maintenance-log.model.ts',
  'medical-history.model.ts',
  'medication-log.model.ts',
  'mental-health-record.model.ts',
  'message-delivery.model.ts',
  'message-reaction.model.ts',
  'message-read.model.ts',
  'message-template.model.ts',
  'message.model.ts',
  'performance-metric.model.ts',
  'phi-disclosure-audit.model.ts',
  'phi-disclosure.model.ts',
  'policy-acknowledgment.model.ts',
  'policy-document.model.ts',
  'purchase-order-item.model.ts',
  'purchase-order.model.ts',
  'push-notification.model.ts',
  'remediation-action.model.ts',
  'report-execution.model.ts',
  'report-schedule.model.ts',
  'report-template.model.ts',
  'sis-sync-conflict.model.ts',
  'student-drug-allergy.model.ts',
  'student-medication.model.ts',
  'supplier.model.ts',
  'sync-conflict.model.ts',
  'sync-queue-item.model.ts',
  'sync-session.model.ts',
  'sync-state.model.ts',
  'system-config.model.ts',
  'threat-detection.model.ts',
  'training-module.model.ts',
  'treatment-plan.model.ts',
  'vaccination.model.ts',
  'vendor.model.ts',
  'webhook.model.ts',
  'witness-statement.model.ts'
];

function fixImportStatement(content) {
  // Fix malformed import statements with extra commas or incorrect syntax
  return content.replace(
    /import\s*{\s*([^}]+)\s*}\s*,\s*([^}]+)\s*}\s*from\s*'sequelize-typescript';/gs,
    (match, group1, group2) => {
      // Combine both groups and clean up
      const combined = (group1 + ',' + group2)
        .split(',')
        .map(item => item.trim())
        .filter(item => item && item !== '')
        .join(',\n  ');
      
      return `import {\n  ${combined}\n} from 'sequelize-typescript';`;
    }
  );
}

function fixTrailingCommas(content) {
  // Fix trailing commas in object literals
  return content.replace(/,(\s*[}\]])/g, '$1');
}

// Process each file
filesToFix.forEach(filename => {
  const filePath = path.join(modelsDir, filename);
  
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix import statements
      content = fixImportStatement(content);
      
      // Fix trailing commas
      content = fixTrailingCommas(content);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filename}`);
    } catch (error) {
      console.error(`Error processing ${filename}:`, error.message);
    }
  } else {
    console.log(`File not found: ${filename}`);
  }
});

console.log('Import fixes completed!');
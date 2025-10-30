const fs = require('fs');
const path = require('path');

// List of all models that have field mappings that need to be removed
const modelsToFix = [
  'src/database/models/witness-statement.model.ts',
  'src/database/models/vaccination.model.ts',
  'src/database/models/sync-queue-item.model.ts',
  'src/database/models/sync-conflict.model.ts',
  'src/database/models/student.model.ts',
  'src/database/models/student-medication.model.ts',
  'src/database/models/report-template.model.ts',
  'src/database/models/report-schedule.model.ts',
  'src/database/models/report-execution.model.ts',
  'src/database/models/remediation-action.model.ts',
  'src/database/models/push-notification.model.ts',
  'src/database/models/prescription.model.ts',
  'src/database/models/policy-document.model.ts',
  'src/database/models/policy-acknowledgment.model.ts',
  'src/database/models/phi-disclosure.model.ts',
  'src/database/models/phi-disclosure-audit.model.ts',
  'src/database/models/mental-health-record.model.ts',
  'src/database/models/medication-log.model.ts',
  'src/database/models/incident-report.model.ts',
  'src/database/models/follow-up-appointment.model.ts',
  'src/database/models/emergency-contact.model.ts',
  'src/database/models/drug-interaction.model.ts',
  'src/database/models/drug-catalog.model.ts',
  'src/database/models/device-token.model.ts',
  'src/database/models/delivery-log.model.ts',
  'src/database/models/data-retention-policy.model.ts',
  'src/database/models/contact.model.ts',
  'src/database/models/consent-signature.model.ts',
  'src/database/models/consent-form.model.ts',
  'src/database/models/compliance-violation.model.ts',
  'src/database/models/compliance-report.model.ts',
  'src/database/models/clinical-protocol.model.ts',
  'src/database/models/clinical-note.model.ts',
  'src/database/models/clinic-visit.model.ts',
  'src/database/models/chronic-condition.model.ts',
  'src/database/models/budget-transaction.model.ts',
  'src/database/models/budget-category.model.ts',
  'src/database/models/appointment.model.ts',
  'src/database/models/appointment-waitlist.model.ts',
  'src/database/models/appointment-reminder.model.ts',
  'src/database/models/allergy.model.ts',
  'src/database/models/alert.model.ts',
  'src/database/models/alert-rule.model.ts',
  'src/database/models/alert-preferences.model.ts',
  'src/database/models/academic-transcript.model.ts'
];

console.log(`🔧 Fixing ${modelsToFix.length} models with field mapping issues...`);

let fixedCount = 0;
let skippedCount = 0;
let errorCount = 0;

function removeFieldMappings(content) {
  let modified = content;
  
  // Remove field mappings with various patterns
  // Pattern 1: field: 'name', (with comma)
  modified = modified.replace(/\s+field:\s*'[^']*',\s*\n/g, '\n');
  
  // Pattern 2: field: 'name' (without comma, but maybe before closing brace)
  modified = modified.replace(/\s+field:\s*'[^']*'\s*\n/g, '\n');
  
  // Pattern 3: Inside column definition - ,\n    field: 'name',
  modified = modified.replace(/,\s*\n\s+field:\s*'[^']*',/g, ',');
  
  // Pattern 4: Inside column definition - ,\n    field: 'name'
  modified = modified.replace(/,\s*\n\s+field:\s*'[^']*'/g, '');
  
  // Pattern 5: field: 'name', at start of options
  modified = modified.replace(/\{\s*field:\s*'[^']*',/g, '{');
  
  // Clean up any formatting issues
  modified = modified.replace(/,\s*,/g, ',');
  modified = modified.replace(/,\s*\}/g, '\n  }');
  modified = modified.replace(/,\s*\)/g, ')');
  modified = modified.replace(/\{\s*,/g, '{');
  
  // Fix any double newlines
  modified = modified.replace(/\n\n+/g, '\n\n');
  
  return modified;
}

modelsToFix.forEach(modelPath => {
  const fullPath = path.join(__dirname, modelPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${modelPath}`);
    errorCount++;
    return;
  }
  
  try {
    const originalContent = fs.readFileSync(fullPath, 'utf8');
    const modifiedContent = removeFieldMappings(originalContent);
    
    if (modifiedContent !== originalContent) {
      fs.writeFileSync(fullPath, modifiedContent);
      console.log(`✅ Fixed: ${modelPath}`);
      fixedCount++;
    } else {
      console.log(`ℹ️  No changes needed: ${modelPath}`);
      skippedCount++;
    }
  } catch (error) {
    console.log(`❌ Error processing ${modelPath}: ${error.message}`);
    errorCount++;
  }
});

console.log('\n📊 Summary:');
console.log(`✅ Fixed: ${fixedCount} models`);
console.log(`ℹ️  Skipped: ${skippedCount} models`);
console.log(`❌ Errors: ${errorCount} models`);
console.log(`🎯 Total processed: ${fixedCount + skippedCount + errorCount} models`);

if (fixedCount > 0) {
  console.log('\n🎉 Field mapping cleanup completed! All models should now use camelCase consistently.');
  console.log('💡 Run "npm run start:dev" to test database synchronization.');
}
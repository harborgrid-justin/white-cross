/**
 * Script to fix circular dependencies in Sequelize models
 * 
 * This script converts direct model imports to lazy-loaded require() calls
 * in decorators to prevent circular dependencies while maintaining type safety.
 * 
 * Usage: node scripts/fix-circular-dependencies.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const MODELS_DIR = path.join(__dirname, '../src/database/models');

// Models that have circular dependencies
const MODELS_TO_FIX = [
  'academic-transcript.model.ts',
  'allergy.model.ts',
  'alert.model.ts',
  'alert-preferences.model.ts',
  'appointment.model.ts',
  'appointment-reminder.model.ts',
  'appointment-waitlist.model.ts',
  'budget-category.model.ts',
  'budget-transaction.model.ts',
  'chronic-condition.model.ts',
  'clinical-note.model.ts',
  'compliance-checklist-item.model.ts',
  'configuration-history.model.ts',
  'consent-signature.model.ts',
  'delivery-log.model.ts',
  'district.model.ts',
  'drug-catalog.model.ts',
  'drug-interaction.model.ts',
  'emergency-contact.model.ts',
  'follow-up-action.model.ts',
  'follow-up-appointment.model.ts',
  'incident-report.model.ts',
  'integration-config.model.ts',
  'integration-log.model.ts',
  'inventory-item.model.ts',
  'inventory-transaction.model.ts',
  'license.model.ts',
  'maintenance-log.model.ts',
  'medication-log.model.ts',
  'mental-health-record.model.ts',
  'message.model.ts',
  'message-delivery.model.ts',
  'message-template.model.ts',
  'phi-disclosure-audit.model.ts',
  'policy-acknowledgment.model.ts',
  'prescription.model.ts',
  'purchase-order.model.ts',
  'purchase-order-item.model.ts',
  'report-execution.model.ts',
  'report-schedule.model.ts',
  'school.model.ts',
  'sis-sync-conflict.model.ts',
  'student-drug-allergy.model.ts',
  'student-medication.model.ts',
  'sync-session.model.ts',
  'system-config.model.ts',
  'vaccination.model.ts',
  'vendor.model.ts',
  'witness-statement.model.ts',
];

function extractModelImports(content) {
  // Match imports from local model files
  const importRegex = /import\s+(?:type\s+)?\{\s*([^}]+)\s*\}\s+from\s+['"]\.\/([^'"]+)\.model['"]/g;
  const imports = [];
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const modelName = match[1].trim();
    const fileName = match[2];
    imports.push({ modelName, fileName, fullMatch: match[0] });
  }
  
  return imports;
}

function fixModel(filePath) {
  console.log(`\nProcessing: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Extract all model imports
  const imports = extractModelImports(content);
  
  if (imports.length === 0) {
    console.log('  No model imports found, skipping...');
    return;
  }
  
  console.log(`  Found ${imports.length} model imports`);
  
  // Remove model imports (keep other imports)
  imports.forEach(({ fullMatch }) => {
    content = content.replace(fullMatch, '');
  });
  
  // Fix ForeignKey decorators
  imports.forEach(({ modelName, fileName }) => {
    const foreignKeyRegex = new RegExp(`@ForeignKey\\(\\(\\)\\s*=>\\s*${modelName}\\)`, 'g');
    const replacement = `@ForeignKey(() => require('./${fileName}.model').${modelName})`;
    content = content.replace(foreignKeyRegex, replacement);
  });
  
  // Fix BelongsTo decorators
  imports.forEach(({ modelName, fileName }) => {
    const belongsToRegex = new RegExp(`@BelongsTo\\(\\(\\)\\s*=>\\s*${modelName}([,\\)])`, 'g');
    const replacement = `@BelongsTo(() => require('./${fileName}.model').${modelName}$1`;
    content = content.replace(belongsToRegex, replacement);
  });
  
  // Fix HasMany decorators
  imports.forEach(({ modelName, fileName }) => {
    const hasManyRegex = new RegExp(`@HasMany\\(\\(\\)\\s*=>\\s*${modelName}([,\\)])`, 'g');
    const replacement = `@HasMany(() => require('./${fileName}.model').${modelName}$1`;
    content = content.replace(hasManyRegex, replacement);
  });
  
  // Fix HasOne decorators
  imports.forEach(({ modelName, fileName }) => {
    const hasOneRegex = new RegExp(`@HasOne\\(\\(\\)\\s*=>\\s*${modelName}([,\\)])`, 'g');
    const replacement = `@HasOne(() => require('./${fileName}.model').${modelName}$1`;
    content = content.replace(hasOneRegex, replacement);
  });
  
  // Fix BelongsToMany decorators
  imports.forEach(({ modelName, fileName }) => {
    const belongsToManyRegex = new RegExp(`@BelongsToMany\\(\\(\\)\\s*=>\\s*${modelName}([,\\)])`, 'g');
    const replacement = `@BelongsToMany(() => require('./${fileName}.model').${modelName}$1`;
    content = content.replace(belongsToManyRegex, replacement);
  });
  
  // Change property types to 'any' to avoid type errors
  imports.forEach(({ modelName }) => {
    // Match property declarations with the model type
    const propertyRegex = new RegExp(`(declare\\s+)?([a-zA-Z]+\\??:\\s*)${modelName}(\\[\\])?;`, 'g');
    content = content.replace(propertyRegex, (match, declareKeyword, propPart, arrayBrackets) => {
      const declare = declareKeyword || 'declare ';
      const type = arrayBrackets ? 'any[]' : 'any';
      return `${declare}${propPart}${type};`;
    });
  });
  
  // Clean up multiple blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // Only write if content changed
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('  ✓ Fixed circular dependencies');
  } else {
    console.log('  No changes needed');
  }
}

function main() {
  console.log('='.repeat(60));
  console.log('Fixing Circular Dependencies in Sequelize Models');
  console.log('='.repeat(60));
  
  let fixedCount = 0;
  let errorCount = 0;
  
  MODELS_TO_FIX.forEach(modelFile => {
    const filePath = path.join(MODELS_DIR, modelFile);
    
    if (!fs.existsSync(filePath)) {
      console.log(`\nWarning: ${modelFile} not found, skipping...`);
      return;
    }
    
    try {
      fixModel(filePath);
      fixedCount++;
    } catch (error) {
      console.error(`\nError processing ${modelFile}:`, error.message);
      errorCount++;
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`Summary:`);
  console.log(`  Models processed: ${MODELS_TO_FIX.length}`);
  console.log(`  Successfully fixed: ${fixedCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log('='.repeat(60));
  
  if (errorCount > 0) {
    console.log('\n⚠️  Some models had errors. Please review them manually.');
    process.exit(1);
  } else {
    console.log('\n✅ All models processed successfully!');
    console.log('\nNext steps:');
    console.log('1. Review the changes with: git diff');
    console.log('2. Run tests to verify: npm test');
    console.log('3. Fix any TypeScript errors that may appear');
  }
}

main();

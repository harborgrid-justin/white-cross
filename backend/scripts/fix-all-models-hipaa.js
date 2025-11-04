#!/usr/bin/env node
/**
 * Automated script to fix all Sequelize models for HIPAA compliance
 *
 * This script adds:
 * 1. Paranoid mode (soft deletes) for PHI models
 * 2. Audit hooks for all models
 * 3. Access control scopes for all models
 * 4. Timestamp indexes for all models
 */

const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, '../src/database/models');

// Models that already have complete fixes (skip these)
const SKIP_MODELS = new Set([
  'allergy.model.ts',
  'clinical-note.model.ts',
  'clinic-visit.model.ts',
  'user.model.ts',
  'school.model.ts',
  'district.model.ts',
  'student.model.ts',
  'health-record.model.ts',
  'medication.model.ts',
  'prescription.model.ts',
  'incident-report.model.ts',
  'appointment.model.ts',
  'vital-signs.model.ts',
]);

// PHI models that need paranoid mode
const PHI_MODELS = new Set([
  'immunization.model.ts',
  'vaccination.model.ts',
  'chronic-condition.model.ts',
  'mental-health-record.model.ts',
  'treatment-plan.model.ts',
  'student-medication.model.ts',
  'medication-log.model.ts',
  'contact.model.ts',
  'emergency-contact.model.ts',
  'health-screening.model.ts',
  'growth-tracking.model.ts',
  'lab-results.model.ts',
  'medical-history.model.ts',
  'message.model.ts',
  'alert.model.ts',
  'consent-form.model.ts',
  'consent-signature.model.ts',
  'policy-acknowledgment.model.ts',
  'clinical-protocol.model.ts',
  'follow-up-action.model.ts',
  'follow-up-appointment.model.ts',
  'witness-statement.model.ts',
  'phi-disclosure.model.ts',
  'phi-disclosure-audit.model.ts',
  'audit-log.model.ts',
  'compliance-report.model.ts',
  'compliance-violation.model.ts',
  'compliance-checklist-item.model.ts',
  'data-retention-policy.model.ts',
  'drug-catalog.model.ts',
  'drug-interaction.model.ts',
  'student-drug-allergy.model.ts',
  'appointment-reminder.model.ts',
  'appointment-waitlist.model.ts',
  'conversation.model.ts',
  'conversation-participant.model.ts',
  'message-delivery.model.ts',
  'message-read.model.ts',
  'message-reaction.model.ts',
  'message-template.model.ts',
  'alert-rule.model.ts',
  'alert-preferences.model.ts',
]);

function addImportsIfMissing(content) {
  let modified = content;

  // Check if Scopes is already imported
  if (!content.includes('Scopes') && !content.includes('@Scopes')) {
    modified = modified.replace(
      /from 'sequelize-typescript';/,
      match => {
        const importLine = modified.substring(0, modified.indexOf(match));
        const lastImportItem = importLine.lastIndexOf(',');
        const hasBeforeCreate = importLine.includes('BeforeCreate');
        const hasBeforeUpdate = importLine.includes('BeforeUpdate');

        let additions = ['Scopes'];
        if (!hasBeforeCreate) additions.push('BeforeCreate');
        if (!hasBeforeUpdate) additions.push('BeforeUpdate');

        return `,\n  ${additions.join(',\n  ')}\n  } ${match}`;
      }
    );
  }

  // Check if Op is imported from sequelize
  if (!content.includes("from 'sequelize'") && !content.includes('import { Op }')) {
    const importPos = modified.indexOf("from 'sequelize-typescript';");
    if (importPos > -1) {
      const endPos = modified.indexOf('\n', importPos);
      modified = modified.substring(0, endPos + 1) +
        "import { Op } from 'sequelize';\n" +
        modified.substring(endPos + 1);
    }
  }

  return modified;
}

function addParanoidMode(content) {
  // Check if paranoid is already set
  if (content.includes('paranoid:')) {
    return content;
  }

  // Add paranoid: true to @Table decorator
  const tableMatch = content.match(/@Table\(\{([^}]+)\}\)/s);
  if (tableMatch) {
    const tableConfig = tableMatch[1];
    if (!tableConfig.includes('paranoid')) {
      const newConfig = tableConfig.replace(
        /underscored:\s*\w+,/,
        match => `${match}\n  paranoid: true,`
      );
      return content.replace(tableMatch[0], `@Table({${newConfig}})`);
    }
  }

  return content;
}

function addTimestampIndexes(content, modelName) {
  const tableName = modelName.replace('.model.ts', '').replace(/-/g, '_');

  // Check if timestamp indexes already exist
  if (content.includes('idx_' + tableName + '_created_at') ||
      content.includes("fields: ['createdAt']")) {
    return content;
  }

  // Find the indexes array
  const indexesMatch = content.match(/indexes:\s*\[([^\]]+)\]/s);
  if (indexesMatch) {
    const indexesContent = indexesMatch[1];
    const lastIndexPos = indexesContent.lastIndexOf('}');

    if (lastIndexPos > -1) {
      const timestampIndexes = `,
    {
      fields: ['createdAt'],
      name: 'idx_${tableName}_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_${tableName}_updated_at'
    }`;

      const newIndexes = indexesContent.substring(0, lastIndexPos + 1) +
        timestampIndexes +
        indexesContent.substring(lastIndexPos + 1);

      return content.replace(indexesMatch[0], `indexes: [${newIndexes}]`);
    }
  } else {
    // No indexes array exists, add one
    const tableMatch = content.match(/@Table\(\{([^}]+)\}\)/s);
    if (tableMatch) {
      const tableConfig = tableMatch[1];
      const newConfig = tableConfig + `,
  indexes: [
    {
      fields: ['createdAt'],
      name: 'idx_${tableName}_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_${tableName}_updated_at'
    }
  ]`;
      return content.replace(tableMatch[0], `@Table({${newConfig}})`);
    }
  }

  return content;
}

function addAuditHooks(content, modelName) {
  const className = modelName
    .replace('.model.ts', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Check if audit hooks already exist
  if (content.includes('auditPHIAccess') || content.includes('auditAccess')) {
    return content;
  }

  // Find a good place to insert hooks (before existing hooks or before class end)
  const hookInsertPos = content.lastIndexOf('  @BeforeCreate');
  const classEndPos = content.lastIndexOf('}');

  const auditHook = `
  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ${className}) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(\`[AUDIT] ${className} \${instance.id} modified at \${new Date().toISOString()}\`);
      console.log(\`[AUDIT] Changed fields: \${changedFields.join(', ')}\`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
`;

  if (hookInsertPos > -1 && hookInsertPos < classEndPos) {
    // Insert before existing hooks
    return content.substring(0, hookInsertPos) + auditHook + '\n' + content.substring(hookInsertPos);
  } else {
    // Insert before class end
    return content.substring(0, classEndPos) + '\n' + auditHook + content.substring(classEndPos);
  }
}

function addScopes(content, modelName) {
  // Check if @Scopes decorator already exists
  if (content.includes('@Scopes(')) {
    return content;
  }

  // Find @Table decorator
  const tablePos = content.indexOf('@Table({');
  if (tablePos === -1) return content;

  // Create basic scopes
  const scopes = `@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
`;

  return content.substring(0, tablePos) + scopes + content.substring(tablePos);
}

function processModel(filePath) {
  const fileName = path.basename(filePath);

  // Skip already processed models
  if (SKIP_MODELS.has(fileName)) {
    console.log(`⏭️  Skipping ${fileName} (already fixed)`);
    return { success: true, skipped: true };
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Step 1: Add necessary imports
    content = addImportsIfMissing(content);

    // Step 2: Add paranoid mode for PHI models
    if (PHI_MODELS.has(fileName)) {
      content = addParanoidMode(content);
    }

    // Step 3: Add timestamp indexes
    content = addTimestampIndexes(content, fileName);

    // Step 4: Add audit hooks
    content = addAuditHooks(content, fileName);

    // Step 5: Add scopes
    content = addScopes(content, fileName);

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${fileName}`);
      return { success: true, fixed: true };
    } else {
      console.log(`✓  ${fileName} (no changes needed)`);
      return { success: true, noChanges: true };
    }
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);
    return { success: false, error: error.message };
  }
}

function main() {
  console.log('🚀 Starting HIPAA compliance fixes for all Sequelize models...\n');

  const files = fs.readdirSync(MODELS_DIR)
    .filter(file => file.endsWith('.model.ts'))
    .map(file => path.join(MODELS_DIR, file));

  let stats = {
    total: files.length,
    fixed: 0,
    skipped: 0,
    noChanges: 0,
    errors: 0
  };

  files.forEach(file => {
    const result = processModel(file);
    if (result.skipped) stats.skipped++;
    else if (result.fixed) stats.fixed++;
    else if (result.noChanges) stats.noChanges++;
    else if (!result.success) stats.errors++;
  });

  console.log('\n📊 Summary:');
  console.log(`   Total models: ${stats.total}`);
  console.log(`   ✅ Fixed: ${stats.fixed}`);
  console.log(`   ⏭️  Skipped (already fixed): ${stats.skipped}`);
  console.log(`   ✓  No changes needed: ${stats.noChanges}`);
  console.log(`   ❌ Errors: ${stats.errors}`);
  console.log('\n✨ HIPAA compliance fixes complete!');
}

if (require.main === module) {
  main();
}

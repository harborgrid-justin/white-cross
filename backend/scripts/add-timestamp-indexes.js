#!/usr/bin/env node
/**
 * Script to add timestamp indexes to all models that are missing them
 */

const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, '../src/database/models');

function addTimestampIndexesToModel(filePath) {
  const fileName = path.basename(filePath);
  const tableName = fileName.replace('.model.ts', '').replace(/-/g, '_');

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Check if timestamp indexes already exist
    if (content.includes(`idx_${tableName}_created_at`) ||
        (content.includes("fields: ['createdAt']") && content.includes("name: 'idx_"))) {
      console.log(`✓  ${fileName} (already has timestamp indexes)`);
      return { success: true, noChanges: true };
    }

    // Find the indexes array closing bracket
    const indexesRegex = /indexes:\s*\[([\s\S]*?)\n\s*\]/;
    const match = content.match(indexesRegex);

    if (!match) {
      console.log(`⚠️  ${fileName} (no indexes array found)`);
      return { success: true, noIndexes: true };
    }

    const indexesContent = match[1];
    const fullMatch = match[0];

    // Add timestamp indexes before the closing bracket
    const newIndexes = `indexes: [${indexesContent},
    {
      fields: ['createdAt'],
      name: 'idx_${tableName}_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_${tableName}_updated_at'
    }
  ]`;

    content = content.replace(fullMatch, newIndexes);

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Added timestamp indexes to ${fileName}`);
      return { success: true, fixed: true };
    } else {
      console.log(`✓  ${fileName} (no changes)`);
      return { success: true, noChanges: true };
    }
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);
    return { success: false, error: error.message };
  }
}

function main() {
  console.log('🚀 Adding timestamp indexes to all models...\n');

  const files = fs.readdirSync(MODELS_DIR)
    .filter(file => file.endsWith('.model.ts'))
    .map(file => path.join(MODELS_DIR, file));

  let stats = {
    total: files.length,
    fixed: 0,
    noChanges: 0,
    noIndexes: 0,
    errors: 0
  };

  files.forEach(file => {
    const result = addTimestampIndexesToModel(file);
    if (result.fixed) stats.fixed++;
    else if (result.noChanges) stats.noChanges++;
    else if (result.noIndexes) stats.noIndexes++;
    else if (!result.success) stats.errors++;
  });

  console.log('\n📊 Summary:');
  console.log(`   Total models: ${stats.total}`);
  console.log(`   ✅ Fixed: ${stats.fixed}`);
  console.log(`   ✓  Already had indexes: ${stats.noChanges}`);
  console.log(`   ⚠️  No indexes array: ${stats.noIndexes}`);
  console.log(`   ❌ Errors: ${stats.errors}`);
  console.log('\n✨ Timestamp indexes complete!');
}

if (require.main === module) {
  main();
}

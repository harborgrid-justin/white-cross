const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all model files recursively, including subfolders
const modelFiles = glob.sync('**/*.model.ts', { 
  cwd: __dirname,
  absolute: true,
  ignore: ['node_modules/**', 'dist/**', '*.spec.ts', '*.test.ts']
});

console.log(`🔍 Searching recursively for all .model.ts files...`);
console.log(`Found ${modelFiles.length} model files (including subfolders)`);

const problematicModels = [];
const modelsWithFieldMappings = [];

modelFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hasUnderscoredfFalse = content.includes('underscored: false');
  const hasFieldMappings = content.includes("field: '");
  
  const relativePath = path.relative(__dirname, filePath);
  
  if (hasUnderscoredfFalse && hasFieldMappings) {
    problematicModels.push(relativePath);
    console.log(`❌ CRITICAL: ${relativePath}`);
    console.log(`   - Has underscored: false`);
    console.log(`   - Has field mappings (creates SQL conflicts)`);
  } else if (hasFieldMappings) {
    modelsWithFieldMappings.push(relativePath);
    console.log(`⚠️  CHECK: ${relativePath} (has field mappings)`);
  } else {
    console.log(`✅ OK: ${relativePath}`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`✅ Clean models: ${modelFiles.length - problematicModels.length - modelsWithFieldMappings.length}`);
console.log(`⚠️  Models with field mappings: ${modelsWithFieldMappings.length}`);
console.log(`❌ Critical conflicts: ${problematicModels.length}`);

if (problematicModels.length > 0) {
  console.log(`\n🚨 CRITICAL ISSUES FOUND: ${problematicModels.length} models`);
  console.log('These models have underscored: false but still use field mappings:');
  problematicModels.forEach(model => {
    console.log(`  - ${model}`);
  });
}

if (modelsWithFieldMappings.length > 0) {
  console.log(`\n⚠️  MODELS WITH FIELD MAPPINGS: ${modelsWithFieldMappings.length}`);
  console.log('These models have field mappings (may need review):');
  modelsWithFieldMappings.forEach(model => {
    console.log(`  - ${model}`);
  });
}

if (problematicModels.length > 0 || modelsWithFieldMappings.length > 0) {
  console.log('\n💡 SOLUTION: Remove all field: mappings from these models to use camelCase consistently.');
}
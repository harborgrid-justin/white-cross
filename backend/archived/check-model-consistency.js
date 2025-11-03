const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all model files
const modelFiles = glob.sync('**/**.model.ts', { 
  cwd: path.join(__dirname, 'src'),
  absolute: true 
});

console.log(`Found ${modelFiles.length} model files`);

const problematicModels = [];

modelFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hasUnderscoredfFalse = content.includes('underscored: false');
  const hasFieldMappings = content.includes("field: '");
  
  if (hasUnderscoredfFalse && hasFieldMappings) {
    const relativePath = path.relative(path.join(__dirname, 'src'), filePath);
    problematicModels.push(relativePath);
    
    console.log(`❌ ISSUE: ${relativePath}`);
    console.log(`   - Has underscored: false`);
    console.log(`   - Has field mappings (creates SQL conflicts)`);
  } else if (hasFieldMappings) {
    const relativePath = path.relative(path.join(__dirname, 'src'), filePath);
    console.log(`⚠️  CHECK: ${relativePath} (has field mappings)`);
  } else {
    const relativePath = path.relative(path.join(__dirname, 'src'), filePath);
    console.log(`✅ OK: ${relativePath}`);
  }
});

console.log(`\n🚨 CRITICAL ISSUES FOUND: ${problematicModels.length} models`);
console.log('These models have underscored: false but still use field mappings, causing SQL conflicts:');
problematicModels.forEach(model => {
  console.log(`  - ${model}`);
});

if (problematicModels.length > 0) {
  console.log('\n💡 SOLUTION: Remove all field: mappings from these models to use camelCase consistently.');
}
const fs = require('fs');
const path = require('path');

// Get list of model files with underscored: true
const modelsDir = path.join(__dirname, 'src', 'database', 'models');

function getAllModelFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllModelFiles(fullPath));
    } else if (entry.endsWith('.model.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixUnderscoredSetting(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file has underscored: true
  if (content.includes('underscored: true')) {
    console.log(`Fixing ${filePath}`);
    
    // Replace underscored: true with underscored: false
    const newContent = content.replace(/underscored:\s*true/g, 'underscored: false');
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`  ✅ Fixed underscored setting`);
    return true;
  }
  
  return false;
}

console.log('🔧 Fixing underscored settings in all models...\n');

const modelFiles = getAllModelFiles(modelsDir);
let fixedCount = 0;

for (const modelFile of modelFiles) {
  if (fixUnderscoredSetting(modelFile)) {
    fixedCount++;
  }
}

console.log(`\n✅ Fixed ${fixedCount} model files to use underscored: false`);
console.log('\nAll models now use camelCase column names consistently.');
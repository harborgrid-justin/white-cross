const fs = require('fs');
const path = require('path');

// List of critical models that have underscored: false but field mappings
const criticalModels = [
  'src/database/models/audit-log.model.ts',
  'src/database/models/user.model.ts'
];

criticalModels.forEach(modelPath => {
  const fullPath = path.join(__dirname, modelPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${modelPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  // Remove field mappings with various whitespace patterns
  content = content.replace(/\s+field: '[^']*',?\n/g, '\n');
  content = content.replace(/,\s*field: '[^']*'/g, '');
  content = content.replace(/field: '[^']*',?\s*/g, '');
  
  // Clean up any double commas or trailing commas before closing braces
  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/,\s*\}/g, '\n  }');
  content = content.replace(/,\s*\)/g, ')');
  
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Fixed field mappings in: ${modelPath}`);
  } else {
    console.log(`ℹ️  No changes needed for: ${modelPath}`);
  }
});

console.log('✅ Critical model fixes completed!');
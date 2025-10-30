const fs = require('fs');
const path = require('path');

/**
 * Fix Sequelize enum SQL generation bug that puts USING clause after COMMENT
 * This is a temporary workaround for models with enum fields that have comments
 */
function fixEnumSqlBug() {
  const modelsDir = path.join(__dirname, 'src', 'database', 'models');
  
  // Models known to have enum fields that cause SQL generation issues
  const problematicModels = [
    'follow-up-action.model.ts',
    'audit-log.model.ts', 
    'incident-report.model.ts',
    'emergency-contact.model.ts',
    'mental-health-record.model.ts',
    'lab-result.model.ts',
    'medical-history.model.ts',
    'vital-sign.model.ts',
    'clinical-note.model.ts',
    'clinical-protocol.model.ts',
    'prescription.model.ts',
    'treatment-plan.model.ts',
    'clinic-visit.model.ts'
  ];
  
  problematicModels.forEach(modelFile => {
    const filePath = path.join(modelsDir, modelFile);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Model ${modelFile} not found, skipping...`);
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove comments from enum fields temporarily to avoid SQL generation bug
    let newContent = content.replace(
      /(type:\s*DataTypes\.ENUM\([^)]+\),?\s*)comment:\s*['"][^'"]*['"],?\s*/g,
      (match, enumType) => {
        console.log(`🔧 Removing comment from enum field in ${modelFile}`);
        modified = true;
        return enumType;
      }
    );
    
    // Also handle multi-line enum definitions
    newContent = newContent.replace(
      /(type:\s*DataTypes\.ENUM\(\s*\[[^\]]+\]\s*\),?\s*)comment:\s*['"][^'"]*['"],?\s*/g,
      (match, enumType) => {
        console.log(`🔧 Removing comment from multi-line enum field in ${modelFile}`);
        modified = true;
        return enumType;
      }
    );
    
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed enum SQL bug in ${modelFile}`);
    } else {
      console.log(`ℹ️  No enum comments found in ${modelFile}`);
    }
  });
}

console.log('🚀 Starting enum SQL bug fix...');
fixEnumSqlBug();
console.log('✨ Enum SQL bug fix completed!');
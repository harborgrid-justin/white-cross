#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

/**
 * Script to add default exports to Sequelize model files
 * This is required for Sequelize-TypeScript to properly load the models
 */

async function fixModelExports() {
  console.log('🔧 Fixing model default exports...');
  
  // Find all model files
  const modelFiles = await glob('src/database/models/*.model.ts', { 
    cwd: path.join(__dirname, '../../') 
  });

  let filesFixed = 0;

  for (const modelFile of modelFiles) {
    try {
      const fullPath = path.join(__dirname, '../../', modelFile);
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // Check if file already has a default export
      if (content.includes('export default ')) {
        console.log(`✅ ${modelFile} - Already has default export`);
        continue;
      }

      // Extract the class name from the export
      const classMatch = content.match(/export class (\w+)/);
      if (!classMatch) {
        console.warn(`⚠️  ${modelFile} - No export class found`);
        continue;
      }

      const className = classMatch[1];

      // Add default export at the end of the file
      const updatedContent = content + `\n// Default export for Sequelize-TypeScript\nexport default ${className};\n`;

      // Write the updated content
      fs.writeFileSync(fullPath, updatedContent, 'utf-8');
      
      console.log(`✅ ${modelFile} - Added default export for ${className}`);
      filesFixed++;

    } catch (error) {
      console.error(`❌ ${modelFile} - Error:`, error);
    }
  }

  console.log(`\n🎉 Fixed ${filesFixed} model files with missing default exports`);
}

if (require.main === module) {
  fixModelExports().catch(console.error);
}

export { fixModelExports };

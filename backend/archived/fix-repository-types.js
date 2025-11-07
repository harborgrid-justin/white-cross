const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

async function fixRepositoryFiles() {
  console.log('Starting to fix repository type annotations...');
  
  // Find all repository implementation files
  const repositoryFiles = await glob('src/database/repositories/impl/*.repository.ts', {
    cwd: process.cwd(),
  });
  
  console.log(`Found ${repositoryFiles.length} repository files to fix`);
  
  let fixedCount = 0;
  
  for (const filePath of repositoryFiles) {
    try {
      console.log(`Processing ${filePath}...`);
      let content = await fs.readFile(filePath, 'utf8');
      let modified = false;
      
      // Check if imports need to be fixed
      if (content.includes('import { IAuditLogger }') && !content.includes('import type { IAuditLogger }')) {
        content = content.replace(
          /import { IAuditLogger }/g,
          'import type { IAuditLogger }'
        );
        modified = true;
      }
      
      if (content.includes('import { ICacheManager }') && !content.includes('import type { ICacheManager }')) {
        content = content.replace(
          /import { ICacheManager }/g,
          'import type { ICacheManager }'
        );
        modified = true;
      }
      
      // Fix constructor parameter types
      const constructorRegex = /@Inject\('IAuditLogger'\)\s+auditLogger(?!\s*:\s*IAuditLogger)/g;
      if (constructorRegex.test(content)) {
        content = content.replace(
          /@Inject\('IAuditLogger'\)\s+auditLogger/g,
          "@Inject('IAuditLogger') auditLogger: IAuditLogger"
        );
        modified = true;
      }
      
      const cacheManagerRegex = /@Inject\('ICacheManager'\)\s+cacheManager(?!\s*:\s*ICacheManager)/g;
      if (cacheManagerRegex.test(content)) {
        content = content.replace(
          /@Inject\('ICacheManager'\)\s+cacheManager/g,
          "@Inject('ICacheManager') cacheManager: ICacheManager"
        );
        modified = true;
      }
      
      if (modified) {
        await fs.writeFile(filePath, content);
        fixedCount++;
        console.log(`✓ Fixed ${filePath}`);
      } else {
        console.log(`  Skipped ${filePath} (already correct or no issues found)`);
      }
    } catch (error) {
      console.error(`✗ Error processing ${filePath}:`, error.message);
    }
  }
  
  console.log(`\nCompleted! Fixed ${fixedCount} out of ${repositoryFiles.length} files.`);
}

fixRepositoryFiles().catch(console.error);
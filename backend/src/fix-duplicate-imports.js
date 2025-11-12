#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define import patterns to fix
const importFixes = [
  {
    // Fix audit logger imports
    pattern: /import\s*{\s*([^}]*)\s*}\s*from\s*['"][^'"]*\/database\/interfaces\/audit\/audit-logger\.interface['"];?/g,
    replacement: 'import { $1 } from "../../database/interfaces";'
  },
  {
    // Fix cache manager imports
    pattern: /import\s*{\s*([^}]*)\s*}\s*from\s*['"][^'"]*\/database\/interfaces\/cache\/cache-manager\.interface['"];?/g,
    replacement: 'import { $1 } from "../../database/interfaces";'
  },
  {
    // Fix type-only audit logger imports
    pattern: /import\s*type\s*{\s*([^}]*)\s*}\s*from\s*['"][^'"]*\/database\/interfaces\/audit\/audit-logger\.interface['"];?/g,
    replacement: 'import type { $1 } from "../../database/interfaces";'
  },
  {
    // Fix type-only cache manager imports
    pattern: /import\s*type\s*{\s*([^}]*)\s*}\s*from\s*['"][^'"]*\/database\/interfaces\/cache\/cache-manager\.interface['"];?/g,
    replacement: 'import type { $1 } from "../../database/interfaces";'
  },
  {
    // Fix sanitizeSensitiveData function imports
    pattern: /import\s*{\s*sanitizeSensitiveData\s*}\s*from\s*['"][^'"]*\/database\/interfaces\/audit\/audit-logger\.interface['"];?/g,
    replacement: 'import { sanitizeSensitiveData } from "../../database/interfaces";'
  },
  {
    // Fix individual model imports - use barrel export
    pattern: /import\s*{\s*([^}]*)\s*}\s*from\s*['"][^'"]*\/database\/models\/[^\/]+\.model['"];?/g,
    replacement: 'import { $1 } from "../../database/models";'
  },
  {
    // Fix model index imports
    pattern: /import\s*{\s*([^}]*)\s*}\s*from\s*['"][^'"]*\/database\/models['"];?/g,
    replacement: 'import { $1 } from "../../database/models";'
  },
  {
    // Fix export statements for models
    pattern: /export\s*{\s*([^}]*)\s*}\s*from\s*['"][^'"]*\/database\/models\/[^\/]+\.model['"];?/g,
    replacement: 'export { $1 } from "../../database/models";'
  },
  {
    // Fix database types imports
    pattern: /import\s*{\s*([^}]*)\s*}\s*from\s*['"][^'"]*\/database\/types['"];?/g,
    replacement: 'import { $1 } from "../../database/types";'
  }
];

function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Apply each fix pattern
    importFixes.forEach(fix => {
      const matches = content.match(fix.pattern);
      if (matches) {
        const newContent = content.replace(fix.pattern, fix.replacement);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
    });

    // Special handling for files that need different relative paths
    const relativePath = path.relative(path.dirname(filePath), 'backend/src/database/interfaces');
    const correctedPath = relativePath.replace(/\\/g, '/');
    
    if (modified) {
      // Fix the relative path based on file location
      content = content.replace(
        /from\s*["']\.\.\/\.\.\/database\/interfaces["']/g,
        `from "${correctedPath}"`
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed imports in: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
  return false;
}

function main() {
  console.log('Starting duplicate import fixes...');
  
  // Find all TypeScript files with deep relative imports
  const patterns = [
    '**/repositories/impl/*.ts',
    'health-domain/repositories/impl/*.ts',
    'database/repositories/impl/*.ts',
    'database/repositories/generic-repository.factory.ts',
    'health-record/**/*.ts',
    'services/healthcare/*.ts',
    'infrastructure/**/*.ts',
    'auth/**/*.ts',
    'middleware/**/*.ts'
  ];
  
  let totalFixed = 0;
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern);
    console.log(`Found ${files.length} files matching pattern: ${pattern}`);
    
    files.forEach(file => {
      if (fixImportsInFile(file)) {
        totalFixed++;
      }
    });
  });
  
  console.log(`\nCompleted! Fixed imports in ${totalFixed} files.`);
}

if (require.main === module) {
  main();
}

module.exports = { fixImportsInFile, importFixes };

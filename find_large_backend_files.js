#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return 0;
  }
}

function findLargeFiles(dir, minLines = 300) {
  const results = [];
  
  function scanDirectory(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanDirectory(itemPath);
        } else if (stat.isFile()) {
          // Skip test and spec files
          if (item.includes('.spec.') || item.includes('.test.') || 
              item.endsWith('.spec.ts') || item.endsWith('.test.ts')) {
            continue;
          }
          
          // Only check TypeScript files
          if (item.endsWith('.ts') || item.endsWith('.js')) {
            const lineCount = countLines(itemPath);
            if (lineCount > minLines) {
              const relativePath = path.relative('/workspaces/white-cross/backend/src', itemPath);
              results.push({
                path: relativePath,
                fullPath: itemPath,
                lines: lineCount
              });
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${currentDir}:`, error.message);
    }
  }
  
  scanDirectory(dir);
  return results.sort((a, b) => b.lines - a.lines);
}

const srcDir = '/workspaces/white-cross/backend/src';
const largeFiles = findLargeFiles(srcDir);

console.log(`Found ${largeFiles.length} files larger than 300 lines in backend/src:`);
console.log('='.repeat(80));

largeFiles.forEach((file, index) => {
  console.log(`${index + 1}. ${file.path} (${file.lines} lines)`);
});

// Also output as JSON for further processing
fs.writeFileSync('large_backend_files.json', JSON.stringify(largeFiles, null, 2));
console.log('\nDetailed results saved to large_backend_files.json');

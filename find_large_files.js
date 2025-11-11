const fs = require('fs');
const path = require('path');

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

function findFiles(dir, extensions = ['.ts', '.tsx']) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (extensions.some(ext => item.endsWith(ext))) {
        const lines = countLines(fullPath);
        files.push({ path: fullPath.replace(/\\/g, '/'), lines });
      }
    }
  }
  
  scan(dir);
  return files;
}

const files = findFiles('./frontend/src');
const largeFiles = files
  .filter(file => file.lines > 300)
  .sort((a, b) => b.lines - a.lines);

console.log('Files larger than 300 lines:');
largeFiles.forEach(file => {
  console.log(`${file.lines} lines: ${file.path}`);
});

console.log(`\nTotal files checked: ${files.length}`);
console.log(`Large files (>300 LOC): ${largeFiles.length}`);

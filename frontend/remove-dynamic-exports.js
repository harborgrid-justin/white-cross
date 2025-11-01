const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript and TSX files
const files = glob.sync('src/**/*.{ts,tsx}', { cwd: __dirname });

let totalFixed = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file contains the problematic export
  if (content.includes("export const dynamic = 'force-dynamic';")) {
    console.log(`Fixing: ${file}`);
    
    // Remove the export line and any related comments
    content = content.replace(/\/\/ Force dynamic rendering[^\n]*\n/g, '');
    content = content.replace(/export const dynamic = 'force-dynamic';\n/g, '');
    content = content.replace(/export const dynamic = 'force-dynamic';/g, '');
    
    // Also remove runtime exports that might be incompatible
    content = content.replace(/export const runtime = 'edge';\n/g, '');
    content = content.replace(/export const runtime = 'edge';/g, '');
    
    fs.writeFileSync(filePath, content);
    totalFixed++;
  }
});

console.log(`Fixed ${totalFixed} files by removing dynamic exports.`);

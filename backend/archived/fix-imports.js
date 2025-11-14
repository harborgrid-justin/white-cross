const fs = require('fs');
const path = require('path');

// Define the mapping of old import paths to new ones
const importMappings = {
  "'../../emergency-broadcast/emergency-broadcast.enums'": "'../../../services/communication/emergency-broadcast/emergency-broadcast.enums'",
  '"../../emergency-broadcast/emergency-broadcast.enums"': '"../../../services/communication/emergency-broadcast/emergency-broadcast.enums"',
  "'@/emergency-broadcast'": "'../emergency-broadcast.enums'",
  '"@/emergency-broadcast"': '"../emergency-broadcast.enums"',
  "'@/contact'": "'../../contact/enums'",
  '"@/contact"': '"../../contact/enums"',
  "'@/contact/services'": "'../../contact/services'",
  '"@/contact/services"': '"../../contact/services"',
  // Add more mappings as needed for other moved services
  // For example, if there were imports from '../../emergency-contact/'
  // "'../../emergency-contact/something'": "'../../../services/communication/emergency-contact/something'",
};

function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    for (const [oldImport, newImport] of Object.entries(importMappings)) {
      if (content.includes(oldImport)) {
        content = content.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
        changed = true;
        console.log(`Fixed import in ${filePath}: ${oldImport} -> ${newImport}`);
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
      walkDirectory(filePath);
    } else if (stat.isFile() && file.endsWith('.ts')) {
      fixImportsInFile(filePath);
    }
  }
}

// Start from the src directory
const srcDir = path.join(__dirname, 'src');
console.log('Starting import fix process...');
walkDirectory(srcDir);
console.log('Import fix process completed.');
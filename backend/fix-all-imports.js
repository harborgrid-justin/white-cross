const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'src/database/models');
const files = fs.readdirSync(modelsDir).filter(file => file.endsWith('.model.ts'));

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern 1: Fix imports with trailing commas like } ,
  content = content.replace(/}\s*,\s*\n\s*} from 'sequelize-typescript';/g, (match) => {
    modified = true;
    return "} from 'sequelize-typescript';";
  });

  // Pattern 2: Fix imports with trailing commas in middle like }, \n } from
  content = content.replace(/},\s*\n\s*} from 'sequelize-typescript';/g, (match) => {
    modified = true;
    return "} from 'sequelize-typescript';";
  });

  // Pattern 3: Fix standalone trailing commas at end of object/array
  content = content.replace(/,\s*\n\s*}\s*\]\s*\)\s*\n/g, (match) => {
    modified = true;
    return match.replace(',', '');
  });

  // Pattern 4: Fix trailing commas in index definitions
  content = content.replace(/\{\s*fields:\s*\[[^\]]+\]\s*\}\s*,\s*,/g, (match) => {
    modified = true;
    return match.replace(',,', ',');
  });

  // Pattern 5: Fix standalone trailing comma at end of line
  content = content.replace(/,\s*\n(?=\s*[\}\]])/g, (match) => {
    modified = true;
    return '\n';
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

let fixedCount = 0;

files.forEach(file => {
  const filePath = path.join(modelsDir, file);
  if (fixFile(filePath)) {
    console.log(`Fixed: ${file}`);
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} files!`);
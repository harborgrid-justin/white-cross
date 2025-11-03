const fs = require('fs');

const data = JSON.parse(fs.readFileSync('FILE_HEADERS_MAP.json', 'utf-8'));

console.log('=== KEY FILE LOCATOR CODES ===\n');

// Group by category
const categories = {
  'Entry Point': [],
  'Routes': [],
  'Controllers': [],
  'Services': [],
  'Models': [],
  'Middleware': [],
  'Config': [],
  'Utils': []
};

data.files.forEach(file => {
  const path = file.filePath;
  if (path === 'index.ts') categories['Entry Point'].push(file);
  else if (path.includes('/routes/')) categories['Routes'].push(file);
  else if (path.includes('/controllers/')) categories['Controllers'].push(file);
  else if (path.includes('/services/') && !path.includes('/database/')) categories['Services'].push(file);
  else if (path.includes('/models/')) categories['Models'].push(file);
  else if (path.includes('/middleware/')) categories['Middleware'].push(file);
  else if (path.includes('/config/')) categories['Config'].push(file);
  else if (path.includes('/utils/')) categories['Utils'].push(file);
});

Object.entries(categories).forEach(([cat, files]) => {
  if (files.length > 0) {
    console.log('## ' + cat);
    files.slice(0, 10).forEach(f => {
      console.log(f.locatorCode + ' | ' + f.filePath);
    });
    if (files.length > 10) {
      console.log('... and ' + (files.length - 10) + ' more');
    }
    console.log('');
  }
});

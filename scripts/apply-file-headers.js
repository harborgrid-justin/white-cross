/**
 * Script to apply generated file headers to all backend/src files
 * Reads from FILE_HEADERS_MAP.json and updates files
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate header comment for a file
 */
function generateHeader(fileInfo) {
  const lines = [];

  lines.push('/**');
  lines.push(` * LOC: ${fileInfo.locatorCode}`);
  lines.push(` * ${fileInfo.description}`);
  lines.push(' *');
  lines.push(` * UPSTREAM (imports from):`);
  if (fileInfo.upstreamFiles.length === 0) {
    lines.push(' *   - None (leaf node)');
  } else {
    fileInfo.upstreamFiles.slice(0, 5).forEach(file => {
      const fileName = file.split('/').pop() || file;
      lines.push(` *   - ${fileName} (${file})`);
    });
    if (fileInfo.upstreamFiles.length > 5) {
      lines.push(` *   - ... and ${fileInfo.upstreamFiles.length - 5} more`);
    }
  }
  lines.push(' *');
  lines.push(` * DOWNSTREAM (imported by):`);
  if (fileInfo.downstreamFiles.length === 0) {
    lines.push(' *   - None (not imported)');
  } else {
    fileInfo.downstreamFiles.slice(0, 5).forEach(file => {
      const fileName = file.split('/').pop() || file;
      lines.push(` *   - ${fileName} (${file})`);
    });
    if (fileInfo.downstreamFiles.length > 5) {
      lines.push(` *   - ... and ${fileInfo.downstreamFiles.length - 5} more`);
    }
  }
  lines.push(' */');

  return lines.join('\n');
}

/**
 * Remove existing LOC header if present
 */
function removeExistingHeader(content) {
  // Match the LOC header pattern at the start of file
  const headerPattern = /^\/\*\*\s*\n\s*\*\s*LOC:.*?\*\/\s*\n?/s;
  return content.replace(headerPattern, '');
}

/**
 * Apply header to a single file
 */
function applyHeaderToFile(fileInfo, baseDir) {
  const filePath = path.join(baseDir, fileInfo.filePath);

  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove any existing LOC header
    content = removeExistingHeader(content);

    // Generate new header
    const header = generateHeader(fileInfo);

    // Add header to top of file
    const newContent = header + '\n\n' + content;

    // Write back to file
    fs.writeFileSync(filePath, newContent, 'utf-8');

    return true;
  } catch (error) {
    console.error(`❌ Error processing ${fileInfo.filePath}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  const mapFile = path.join(__dirname, '..', 'FILE_HEADERS_MAP.json');
  const backendSrcDir = path.join(__dirname, '..', 'backend', 'src');

  console.log('📖 Reading dependency map...');
  const mapData = JSON.parse(fs.readFileSync(mapFile, 'utf-8'));

  console.log(`📝 Processing ${mapData.files.length} files...`);

  let successCount = 0;
  let errorCount = 0;

  for (const fileInfo of mapData.files) {
    const success = applyHeaderToFile(fileInfo, backendSrcDir);
    if (success) {
      successCount++;
      if (successCount % 50 === 0) {
        console.log(`   Processed ${successCount} files...`);
      }
    } else {
      errorCount++;
    }
  }

  console.log(`\n✅ Complete!`);
  console.log(`   Successfully updated: ${successCount} files`);
  console.log(`   Errors: ${errorCount} files`);

  // Show a few examples
  console.log('\n📋 Example updated files:');
  mapData.files.slice(0, 3).forEach(fileInfo => {
    console.log(`   ✓ ${fileInfo.filePath} [${fileInfo.locatorCode}]`);
  });
}

main().catch(console.error);

/**
 * Script to generate file headers with locator codes and dependency mapping
 * for all backend/src files in the White Cross healthcare platform
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface FileInfo {
  filePath: string;
  locatorCode: string;
  imports: string[];
  exports: string[];
  description: string;
  upstreamFiles: string[];
  downstreamFiles: string[];
}

interface DependencyMap {
  [filePath: string]: {
    imports: string[];
    exportedBy: string[];
  };
}

/**
 * Generate a unique 10-character alphanumeric locator code
 */
function generateLocatorCode(filePath: string): string {
  // Create a hash from the file path to ensure consistency
  const hash = crypto.createHash('sha256').update(filePath).digest('hex');
  // Take first 10 characters and make them uppercase for readability
  return hash.substring(0, 10).toUpperCase();
}

/**
 * Extract import statements from a TypeScript/JavaScript file
 */
function extractImports(content: string, currentFile: string): string[] {
  const imports: string[] = [];

  // Match various import patterns
  const importPatterns = [
    /import\s+.*\s+from\s+['"](.+)['"]/g,
    /import\s+['"](.+)['"]/g,
    /require\s*\(['"](.+)['"]\)/g,
  ];

  importPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const importPath = match[1];

      // Only track relative imports (local files)
      if (importPath.startsWith('.') || importPath.startsWith('@/')) {
        imports.push(importPath);
      }
    }
  });

  return [...new Set(imports)]; // Remove duplicates
}

/**
 * Resolve relative import paths to absolute file paths
 */
function resolveImportPath(importPath: string, currentFile: string, baseDir: string): string | null {
  let resolvedPath = importPath;

  // Handle @ alias (maps to src/)
  if (importPath.startsWith('@/')) {
    resolvedPath = importPath.replace('@/', '');
    resolvedPath = path.join(baseDir, resolvedPath);
  } else if (importPath.startsWith('.')) {
    const currentDir = path.dirname(currentFile);
    resolvedPath = path.join(currentDir, importPath);
  } else {
    return null; // External package
  }

  // Try different extensions
  const extensions = ['.ts', '.js', '.tsx', '.jsx', '/index.ts', '/index.js'];

  for (const ext of extensions) {
    const fullPath = resolvedPath + ext;
    if (fs.existsSync(fullPath)) {
      return path.relative(baseDir, fullPath).replace(/\\/g, '/');
    }
  }

  // Check if it exists as-is
  if (fs.existsSync(resolvedPath)) {
    return path.relative(baseDir, resolvedPath).replace(/\\/g, '/');
  }

  return null;
}

/**
 * Infer file description based on path and content
 */
function inferDescription(filePath: string, content: string): string {
  const pathParts = filePath.split('/');
  const fileName = pathParts[pathParts.length - 1].replace(/\.(ts|js)x?$/, '');

  // Check for existing comments or JSDoc
  const commentMatch = content.match(/\/\*\*?\s*\n?\s*\*?\s*(.+)/);
  if (commentMatch && commentMatch[1] && !commentMatch[1].includes('LOC:')) {
    return commentMatch[1].trim();
  }

  // Infer from directory structure
  if (filePath.includes('/controllers/')) return `${fileName} controller - handles HTTP requests`;
  if (filePath.includes('/services/')) return `${fileName} service - business logic layer`;
  if (filePath.includes('/models/')) return `${fileName} model - database schema definition`;
  if (filePath.includes('/middleware/')) return `${fileName} middleware - request processing`;
  if (filePath.includes('/routes/')) return `${fileName} routes - API endpoint definitions`;
  if (filePath.includes('/utils/')) return `${fileName} utilities - helper functions`;
  if (filePath.includes('/validators/')) return `${fileName} validators - input validation schemas`;
  if (filePath.includes('/config/')) return `${fileName} configuration - app settings`;
  if (filePath.includes('/types/')) return `${fileName} types - TypeScript type definitions`;
  if (filePath.includes('/shared/')) return `${fileName} shared - reusable components`;

  return `${fileName} - ${pathParts[pathParts.length - 2] || 'core'} component`;
}

/**
 * Get all TypeScript/JavaScript files in a directory recursively
 */
function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        getAllFiles(filePath, fileList);
      }
    } else if (/\.(ts|js)x?$/.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Build dependency map for all files
 */
function buildDependencyMap(files: string[], baseDir: string): Map<string, FileInfo> {
  const fileMap = new Map<string, FileInfo>();
  const dependencyGraph = new Map<string, Set<string>>();

  // First pass: collect all imports
  files.forEach(file => {
    const relativePath = path.relative(baseDir, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf-8');
    const imports = extractImports(content, file);

    const resolvedImports = imports
      .map(imp => resolveImportPath(imp, file, baseDir))
      .filter(Boolean) as string[];

    fileMap.set(relativePath, {
      filePath: relativePath,
      locatorCode: generateLocatorCode(relativePath),
      imports: resolvedImports,
      exports: [],
      description: inferDescription(relativePath, content),
      upstreamFiles: resolvedImports,
      downstreamFiles: [],
    });

    dependencyGraph.set(relativePath, new Set(resolvedImports));
  });

  // Second pass: build downstream dependencies
  fileMap.forEach((fileInfo, filePath) => {
    fileInfo.imports.forEach(importedFile => {
      const importedFileInfo = fileMap.get(importedFile);
      if (importedFileInfo) {
        importedFileInfo.downstreamFiles.push(filePath);
      }
    });
  });

  return fileMap;
}

/**
 * Generate header comment for a file
 */
function generateHeader(fileInfo: FileInfo): string {
  const lines: string[] = [];

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
 * Main execution
 */
async function main() {
  const backendSrcDir = path.join(__dirname, '..', 'backend', 'src');

  console.log('🔍 Scanning backend/src directory...');
  const files = getAllFiles(backendSrcDir);
  console.log(`📁 Found ${files.length} files`);

  console.log('🔗 Building dependency map...');
  const fileMap = buildDependencyMap(files, backendSrcDir);

  console.log('📝 Generating headers...');
  const outputFile = path.join(__dirname, '..', 'FILE_HEADERS_MAP.json');

  const outputData = {
    generatedAt: new Date().toISOString(),
    totalFiles: files.length,
    files: Array.from(fileMap.values()),
  };

  fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
  console.log(`✅ Dependency map saved to ${outputFile}`);

  // Generate sample headers for first 10 files
  console.log('\n📋 Sample headers:');
  Array.from(fileMap.values()).slice(0, 3).forEach(fileInfo => {
    console.log(`\n${fileInfo.filePath}:`);
    console.log(generateHeader(fileInfo));
  });

  console.log(`\n✅ Analysis complete! Total files: ${fileMap.size}`);
}

main().catch(console.error);

/**
 * Image Migration Script
 *
 * Automatically migrates plain <img> tags to Next.js OptimizedImage component
 * Run with: npx tsx src/scripts/migrate-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface ImageMatch {
  file: string;
  line: number;
  original: string;
  suggested: string;
}

/**
 * Parse <img> tag and extract attributes
 */
function parseImgTag(imgTag: string): Record<string, string> {
  const attrs: Record<string, string> = {};

  // Extract src
  const srcMatch = imgTag.match(/src=["']([^"']+)["']/);
  if (srcMatch) attrs.src = srcMatch[1];

  // Extract alt
  const altMatch = imgTag.match(/alt=["']([^"']+)["']/);
  if (altMatch) attrs.alt = altMatch[1];

  // Extract className
  const classMatch = imgTag.match(/className=["']([^"']+)["']/);
  if (classMatch) attrs.className = classMatch[1];

  // Extract width
  const widthMatch = imgTag.match(/width=["']?(\d+)["']?/);
  if (widthMatch) attrs.width = widthMatch[1];

  // Extract height
  const heightMatch = imgTag.match(/height=["']?(\d+)["']?/);
  if (heightMatch) attrs.height = heightMatch[1];

  // Extract loading
  const loadingMatch = imgTag.match(/loading=["']([^"']+)["']/);
  if (loadingMatch) attrs.loading = loadingMatch[1];

  return attrs;
}

/**
 * Generate OptimizedImage component from img tag
 */
function generateOptimizedImage(attrs: Record<string, string>): string {
  const props: string[] = [];

  // Required props
  if (attrs.src) props.push(`src="${attrs.src}"`);
  if (attrs.alt) props.push(`alt="${attrs.alt}"`);

  // Dimensions
  if (attrs.width) props.push(`width={${attrs.width}}`);
  if (attrs.height) props.push(`height={${attrs.height}}`);

  // Optional props
  if (attrs.className) props.push(`className="${attrs.className}"`);

  // Priority for above-the-fold images
  const priority = attrs.loading === 'eager' ? 'priority' : '';
  if (priority) props.push(priority);

  return `<OptimizedImage ${props.join(' ')} />`;
}

/**
 * Scan files for plain <img> tags
 */
async function scanForImages(directory: string): Promise<ImageMatch[]> {
  const matches: ImageMatch[] = [];

  // Find all TSX/JSX files
  const files = await glob(`${directory}/**/*.{tsx,jsx}`, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  });

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Skip if already using OptimizedImage or Next Image
      if (line.includes('OptimizedImage') || line.includes('next/image')) {
        return;
      }

      // Find <img> tags
      const imgMatches = line.match(/<img[^>]+>/g);
      if (imgMatches) {
        imgMatches.forEach((imgTag) => {
          const attrs = parseImgTag(imgTag);
          if (attrs.src) {
            matches.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              original: imgTag,
              suggested: generateOptimizedImage(attrs),
            });
          }
        });
      }
    });
  }

  return matches;
}

/**
 * Automatically replace <img> tags with OptimizedImage
 */
async function migrateImages(directory: string, dryRun = true): Promise<void> {
  const matches = await scanForImages(directory);

  if (matches.length === 0) {
    console.log('✅ No plain <img> tags found. All images are optimized!');
    return;
  }

  console.log(`\n🔍 Found ${matches.length} plain <img> tag(s) to migrate:\n`);

  // Group by file
  const fileGroups = matches.reduce((acc, match) => {
    if (!acc[match.file]) acc[match.file] = [];
    acc[match.file].push(match);
    return acc;
  }, {} as Record<string, ImageMatch[]>);

  for (const [file, fileMatches] of Object.entries(fileGroups)) {
    console.log(`\n📄 ${file}:`);

    if (!dryRun) {
      let content = fs.readFileSync(file, 'utf-8');

      // Check if import already exists
      const hasOptimizedImageImport = content.includes(
        "from '@/components/common/OptimizedImage'"
      );

      // Add import if not present
      if (!hasOptimizedImageImport) {
        const importStatement = "import OptimizedImage from '@/components/common/OptimizedImage';\n";

        // Find the last import statement
        const lines = content.split('\n');
        let lastImportIndex = -1;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ')) {
            lastImportIndex = i;
          }
        }

        if (lastImportIndex >= 0) {
          lines.splice(lastImportIndex + 1, 0, importStatement);
          content = lines.join('\n');
        } else {
          content = importStatement + content;
        }
      }

      // Replace all img tags
      for (const match of fileMatches) {
        content = content.replace(match.original, match.suggested);
      }

      fs.writeFileSync(file, content, 'utf-8');
    }

    // Show replacements
    fileMatches.forEach((match, index) => {
      console.log(`  ${index + 1}. Line ${match.line}:`);
      console.log(`     - ${match.original}`);
      console.log(`     + ${match.suggested}`);
    });

    if (!dryRun) {
      console.log(`  ✅ Migrated ${fileMatches.length} image(s)`);
    }
  }

  if (dryRun) {
    console.log(
      '\n💡 This was a dry run. To apply changes, run with --apply flag:\n   npx tsx src/scripts/migrate-images.ts --apply\n'
    );
  } else {
    console.log(`\n✅ Successfully migrated ${matches.length} images!\n`);
    console.log('📝 Next steps:');
    console.log('   1. Review the changes');
    console.log('   2. Test your application');
    console.log('   3. Commit the changes\n');
  }
}

/**
 * Generate migration report
 */
async function generateReport(directory: string): Promise<void> {
  const matches = await scanForImages(directory);

  console.log('\n📊 Image Migration Report\n');
  console.log(`Total plain <img> tags found: ${matches.length}\n`);

  // Files affected
  const uniqueFiles = new Set(matches.map((m) => m.file));
  console.log(`Files affected: ${uniqueFiles.size}\n`);

  // List files
  console.log('Files with plain <img> tags:');
  uniqueFiles.forEach((file) => {
    const count = matches.filter((m) => m.file === file).length;
    console.log(`  - ${file} (${count} image${count > 1 ? 's' : ''})`);
  });

  console.log('');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const report = args.includes('--report');
  const directory = args.find((arg) => !arg.startsWith('--')) || 'src';

  console.log('🖼️  Image Migration Tool for Next.js\n');
  console.log(`Scanning directory: ${directory}\n`);

  if (report) {
    await generateReport(directory);
  } else {
    await migrateImages(directory, !apply);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { scanForImages, migrateImages, generateReport };

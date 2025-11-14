/**
 * Bundle Analyzer Script
 *
 * Analyzes the Next.js production bundle to identify optimization opportunities.
 * Generates a detailed report of bundle sizes, chunk analysis, and recommendations.
 *
 * Usage:
 *   npm run build && node scripts/analyze-bundle.js
 *
 * @since 1.2.0
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function analyzeBuildDir() {
  const buildDir = path.join(__dirname, '../.next');

  if (!fs.existsSync(buildDir)) {
    console.error(`${colors.red}Error: Build directory not found. Run 'npm run build' first.${colors.reset}`);
    process.exit(1);
  }

  const staticDir = path.join(buildDir, 'static');
  const chunksDir = path.join(staticDir, 'chunks');

  console.log(`\n${colors.bright}${colors.cyan}📊 Next.js Bundle Analysis${colors.reset}\n`);
  console.log(`${colors.bright}Analyzing: ${colors.reset}.next/static/chunks/\n`);

  // Analyze chunks
  if (fs.existsSync(chunksDir)) {
    const chunks = fs.readdirSync(chunksDir)
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const filePath = path.join(chunksDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          path: filePath,
        };
      })
      .sort((a, b) => b.size - a.size);

    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);

    console.log(`${colors.bright}Top 10 Largest Chunks:${colors.reset}\n`);
    chunks.slice(0, 10).forEach((chunk, index) => {
      const percentage = ((chunk.size / totalSize) * 100).toFixed(2);
      const color = chunk.size > 250000 ? colors.red : chunk.size > 100000 ? colors.yellow : colors.green;

      console.log(
        `${index + 1}. ${color}${formatBytes(chunk.size).padEnd(12)}${colors.reset} ` +
        `${colors.bright}${chunk.name}${colors.reset} ` +
        `${colors.yellow}(${percentage}%)${colors.reset}`
      );
    });

    console.log(`\n${colors.bright}Bundle Statistics:${colors.reset}\n`);
    console.log(`Total Chunks: ${chunks.length}`);
    console.log(`Total Size: ${formatBytes(totalSize)}`);
    console.log(`Average Chunk Size: ${formatBytes(totalSize / chunks.length)}`);

    // Check for large chunks
    const largeChunks = chunks.filter(c => c.size > 250000);
    if (largeChunks.length > 0) {
      console.log(`\n${colors.red}⚠️  Warning: ${largeChunks.length} chunk(s) larger than 250KB detected${colors.reset}`);
      console.log(`${colors.yellow}Consider code splitting or lazy loading for these chunks.${colors.reset}`);
    }

    // Identify heavy libraries
    console.log(`\n${colors.bright}Heavy Library Detection:${colors.reset}\n`);
    const heavyLibraries = {
      'recharts': chunks.find(c => c.name.includes('recharts') || c.size > 300000),
      'fullcalendar': chunks.find(c => c.name.includes('fullcalendar') || c.size > 200000),
      'lodash': chunks.find(c => c.name.includes('lodash')),
      'moment': chunks.find(c => c.name.includes('moment')),
    };

    Object.entries(heavyLibraries).forEach(([lib, chunk]) => {
      if (chunk) {
        console.log(`${colors.yellow}📦 ${lib}: ${formatBytes(chunk.size)}${colors.reset}`);
      }
    });

    // Recommendations
    console.log(`\n${colors.bright}${colors.green}✅ Recommendations:${colors.reset}\n`);
    console.log(`1. Lazy load charts using React.lazy() or next/dynamic`);
    console.log(`2. Use tree-shaking for large libraries`);
    console.log(`3. Consider code splitting for route-specific components`);
    console.log(`4. Replace heavy date libraries with date-fns or native Intl`);
    console.log(`5. Analyze with: npx @next/bundle-analyzer`);

    console.log(`\n${colors.bright}For detailed analysis, run:${colors.reset}`);
    console.log(`${colors.cyan}ANALYZE=true npm run build${colors.reset}\n`);
  } else {
    console.error(`${colors.red}Error: Chunks directory not found${colors.reset}`);
  }
}

// Run analysis
analyzeBuildDir();

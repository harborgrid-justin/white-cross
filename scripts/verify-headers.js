/**
 * Script to verify header standards across all backend/src files
 */

const fs = require('fs');
const path = require('path');

function getAllFiles(dir, fileList = []) {
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

function analyzeHeader(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let hasLOC = false;
  let hasWCCode = false;
  let wcCodeCount = 0;
  let hasUpstream = false;
  let hasDownstream = false;
  let hasPurpose = false;

  // Count WC- codes
  const wcMatches = content.match(/WC-[A-Z]+-[A-Z0-9]+-\d+/g);
  wcCodeCount = wcMatches ? wcMatches.length : 0;

  // Check for specific patterns
  hasLOC = content.includes('LOC:');
  hasWCCode = wcCodeCount > 0;
  hasUpstream = content.includes('UPSTREAM (imports from):');
  hasDownstream = content.includes('DOWNSTREAM (imported by):');
  hasPurpose = content.includes('Purpose:');

  return {
    hasLOC,
    hasWCCode,
    wcCodeCount,
    hasUpstream,
    hasDownstream,
    hasPurpose,
    isDual: hasLOC && wcCodeCount > 1, // LOC header + original WC header
    isCompliant: hasLOC && hasUpstream && hasDownstream
  };
}

async function main() {
  const backendSrcDir = path.join(__dirname, '..', 'backend', 'src');
  const files = getAllFiles(backendSrcDir);

  console.log('🔍 Analyzing header patterns across', files.length, 'files...\n');

  const stats = {
    total: files.length,
    withLOC: 0,
    withWCCode: 0,
    dualHeader: 0,
    compliant: 0,
    locOnly: 0
  };

  const examples = {
    dual: [],
    locOnly: [],
    wcOnly: []
  };

  files.forEach(file => {
    const relativePath = path.relative(backendSrcDir, file).replace(/\\/g, '/');
    const analysis = analyzeHeader(file);

    if (analysis.hasLOC) stats.withLOC++;
    if (analysis.hasWCCode) stats.withWCCode++;
    if (analysis.isDual) {
      stats.dualHeader++;
      if (examples.dual.length < 5) examples.dual.push(relativePath);
    }
    if (analysis.isCompliant) stats.compliant++;
    if (analysis.hasLOC && !analysis.isDual) {
      stats.locOnly++;
      if (examples.locOnly.length < 5) examples.locOnly.push(relativePath);
    }
    if (analysis.hasWCCode && !analysis.hasLOC) {
      if (examples.wcOnly.length < 5) examples.wcOnly.push(relativePath);
    }
  });

  console.log('📊 HEADER ANALYSIS RESULTS\n');
  console.log('Total files:', stats.total);
  console.log('Files with LOC header:', stats.withLOC);
  console.log('Files with WC codes:', stats.withWCCode);
  console.log('Files with DUAL headers (LOC + detailed WC):', stats.dualHeader);
  console.log('Files LOC-compliant (has LOC, UPSTREAM, DOWNSTREAM):', stats.compliant);
  console.log('Files with LOC only (no dual header):', stats.locOnly);

  console.log('\n📋 EXAMPLES\n');

  if (examples.dual.length > 0) {
    console.log('✅ Files with DUAL headers (LOC + detailed):');
    examples.dual.forEach(f => console.log('   -', f));
    console.log('');
  }

  if (examples.locOnly.length > 0) {
    console.log('📝 Files with LOC header only:');
    examples.locOnly.forEach(f => console.log('   -', f));
    console.log('');
  }

  if (examples.wcOnly.length > 0) {
    console.log('⚠️  Files with WC code but no LOC:');
    examples.wcOnly.forEach(f => console.log('   -', f));
    console.log('');
  }

  // Calculate percentages
  const dualPercentage = ((stats.dualHeader / stats.total) * 100).toFixed(1);
  const compliantPercentage = ((stats.compliant / stats.total) * 100).toFixed(1);

  console.log('✅ COMPLIANCE SUMMARY\n');
  console.log(`LOC Header Coverage: ${stats.withLOC}/${stats.total} (${((stats.withLOC / stats.total) * 100).toFixed(1)}%)`);
  console.log(`Dual Header Coverage: ${stats.dualHeader}/${stats.total} (${dualPercentage}%)`);
  console.log(`Full Compliance: ${stats.compliant}/${stats.total} (${compliantPercentage}%)`);

  if (stats.compliant === stats.total) {
    console.log('\n🎉 ALL FILES ARE COMPLIANT! ✅');
  } else {
    console.log(`\n⚠️  ${stats.total - stats.compliant} files need attention`);
  }
}

main().catch(console.error);

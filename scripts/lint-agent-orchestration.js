#!/usr/bin/env node
/**
 * Lint agent specification files for orchestration compliance.
 * Checks:
 * 1. Presence of CRITICAL REQUIREMENT phrase.
 * 2. Reference to `_standard-orchestration.md` in orchestration section.
 * 3. Mandatory section heading `Orchestration Capabilities` (case-insensitive, partial allowed).
 *
 * Exit codes:
 * 0 - All compliant
 * 1 - Non-compliance found
 */

const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.resolve(__dirname, '..', '.claude', 'agents');
const CRITICAL_PHRASE = 'CRITICAL REQUIREMENT';
const TEMPLATE_REF = '_standard-orchestration.md';
const ORCH_KEYWORD = 'Orchestration Capabilities';

function getAgentFiles(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && f !== '_standard-orchestration.md' && f !== 'README.md')
    .map(f => path.join(dir, f));
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const hasCritical = content.includes(CRITICAL_PHRASE);
  const hasTemplateRef = content.includes(TEMPLATE_REF);
  const hasOrchestrationHeading = lines.some(l => /orchestration capabilities/i.test(l));

  const problems = [];
  if (!hasCritical) problems.push('Missing CRITICAL REQUIREMENT phrase');
  if (!hasTemplateRef) problems.push('Missing reference to _standard-orchestration.md');
  if (!hasOrchestrationHeading) problems.push('Missing orchestration heading');

  return { file: path.basename(filePath), problems };
}

function main() {
  const files = getAgentFiles(AGENTS_DIR);
  const results = files.map(analyzeFile);
  const failures = results.filter(r => r.problems.length > 0);

  if (failures.length === 0) {
    console.log('All agent specs are orchestration-compliant.');
    process.exit(0);
  } else {
    console.log('\nAgent Orchestration Lint Report (non-compliant files):');
    failures.forEach(f => {
      console.log(`- ${f.file}: ${f.problems.join('; ')}`);
    });
    console.log(`\nTotal non-compliant files: ${failures.length}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

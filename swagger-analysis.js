#!/usr/bin/env node

/**
 * Swagger/OpenAPI Documentation Gap Analysis for NestJS Controllers
 * Analyzes all controllers in the backend/ directory for missing or incomplete Swagger documentation
 */

const fs = require('fs');
const path = require('path');

// Recursively find all controller files
function findControllerFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findControllerFiles(filePath, fileList);
    } else if (file.endsWith('.controller.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Analyze a single controller file
function analyzeController(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relativePath = filePath.replace('/home/user/white-cross/backend/src/', '');

  const issues = {
    file: relativePath,
    controllerIssues: [],
    endpointIssues: [],
  };

  // Check for controller-level decorators
  const hasApiTags = /@ApiTags/.test(content);
  const hasApiBearerAuth = /@ApiBearerAuth/.test(content);
  const hasController = /@Controller/.test(content);

  if (!hasApiTags && hasController) {
    issues.controllerIssues.push('Missing @ApiTags decorator');
  }

  if (!hasApiBearerAuth && hasController && !/@Public/.test(content)) {
    issues.controllerIssues.push('Missing @ApiBearerAuth decorator (may require authentication)');
  }

  // Find all HTTP method decorators and check for documentation
  const httpMethods = ['@Get', '@Post', '@Put', '@Patch', '@Delete', '@Options', '@Head'];

  httpMethods.forEach(method => {
    const regex = new RegExp(`${method}\\([^)]*\\)|${method}\\s*$`, 'gm');
    const matches = content.match(regex);

    if (matches) {
      matches.forEach((match, index) => {
        const matchIndex = content.indexOf(match);
        const lineNumber = content.substring(0, matchIndex).split('\n').length;

        // Get context around the method (100 lines before to capture decorators)
        const startLine = Math.max(0, lineNumber - 20);
        const endLine = Math.min(lines.length, lineNumber + 10);
        const context = lines.slice(startLine, endLine).join('\n');

        // Extract method name
        const methodNameMatch = context.match(/async\s+(\w+)\s*\(|(\w+)\s*\(/);
        const methodName = methodNameMatch ? (methodNameMatch[1] || methodNameMatch[2]) : 'unknown';

        // Check for endpoint documentation
        const hasApiOperation = /@ApiOperation/.test(context);
        const hasApiResponse = /@ApiResponse/.test(context);
        const hasApiParam = /@ApiParam/.test(context) || !/:(\w+)/.test(match); // Has param decorator or no path params
        const hasApiQuery = /@ApiQuery/.test(context);
        const hasApiBody = /@ApiBody/.test(context) || !['@Post', '@Put', '@Patch'].includes(method);

        const endpointIssue = {
          method: method.replace('@', ''),
          methodName,
          line: lineNumber,
          issues: []
        };

        if (!hasApiOperation) {
          endpointIssue.issues.push('Missing @ApiOperation decorator');
        }

        if (!hasApiResponse) {
          endpointIssue.issues.push('Missing @ApiResponse decorator(s)');
        }

        // Check for path parameters
        if (/:(\w+)/.test(match) && !/@ApiParam/.test(context)) {
          endpointIssue.issues.push('Has path parameter(s) but missing @ApiParam decorator');
        }

        // Check for request body for POST/PUT/PATCH
        if (['@Post', '@Put', '@Patch'].includes(method) && !/@ApiBody/.test(context)) {
          // Check if method has @Body parameter
          if (/@Body\(/.test(context) || /@Body\s/.test(context)) {
            endpointIssue.issues.push('Has @Body parameter but missing @ApiBody decorator');
          }
        }

        if (endpointIssue.issues.length > 0) {
          issues.endpointIssues.push(endpointIssue);
        }
      });
    }
  });

  return issues;
}

// Main analysis function
function main() {
  const backendSrcDir = '/home/user/white-cross/backend/src';
  const controllerFiles = findControllerFiles(backendSrcDir);

  console.log(`\n${'='.repeat(100)}`);
  console.log('NESTJS SWAGGER/OPENAPI DOCUMENTATION GAP ANALYSIS');
  console.log(`${'='.repeat(100)}\n`);
  console.log(`Total Controllers Found: ${controllerFiles.length}\n`);

  const allIssues = [];
  let totalControllerIssues = 0;
  let totalEndpointIssues = 0;
  let controllersWithIssues = 0;

  controllerFiles.forEach(file => {
    const issues = analyzeController(file);

    if (issues.controllerIssues.length > 0 || issues.endpointIssues.length > 0) {
      allIssues.push(issues);
      controllersWithIssues++;
      totalControllerIssues += issues.controllerIssues.length;
      totalEndpointIssues += issues.endpointIssues.length;
    }
  });

  // Summary
  console.log(`${'='.repeat(100)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(100)}\n`);
  console.log(`Controllers with Documentation Issues: ${controllersWithIssues} / ${controllerFiles.length}`);
  console.log(`Total Controller-Level Issues: ${totalControllerIssues}`);
  console.log(`Total Endpoint-Level Issues: ${totalEndpointIssues}`);
  console.log(`Total Issues: ${totalControllerIssues + totalEndpointIssues}\n`);

  // Detailed breakdown
  console.log(`${'='.repeat(100)}`);
  console.log('DETAILED FINDINGS');
  console.log(`${'='.repeat(100)}\n`);

  allIssues.forEach((issue, index) => {
    console.log(`${index + 1}. FILE: ${issue.file}`);
    console.log(`   ${'─'.repeat(96)}`);

    if (issue.controllerIssues.length > 0) {
      console.log(`   CONTROLLER-LEVEL ISSUES:`);
      issue.controllerIssues.forEach(i => {
        console.log(`     ✗ ${i}`);
      });
    }

    if (issue.endpointIssues.length > 0) {
      console.log(`   ENDPOINT-LEVEL ISSUES:`);
      issue.endpointIssues.forEach(endpoint => {
        console.log(`     ${endpoint.method} ${endpoint.methodName}() [Line ${endpoint.line}]`);
        endpoint.issues.forEach(i => {
          console.log(`       ✗ ${i}`);
        });
      });
    }

    console.log('');
  });

  // Save detailed report to JSON
  const reportPath = '/home/user/white-cross/swagger-gaps-report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    summary: {
      totalControllers: controllerFiles.length,
      controllersWithIssues,
      totalControllerIssues,
      totalEndpointIssues,
      totalIssues: totalControllerIssues + totalEndpointIssues
    },
    details: allIssues
  }, null, 2));

  console.log(`${'='.repeat(100)}`);
  console.log(`Detailed JSON report saved to: ${reportPath}`);
  console.log(`${'='.repeat(100)}\n`);
}

main();

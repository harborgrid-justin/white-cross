"use strict";
/**
 * Quality Checks - Enterprise Standards Validation
 * Validates all kits follow enterprise standards
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQualityChecksOnDirectory = runQualityChecksOnDirectory;
exports.printQualityResults = printQualityResults;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Checks for error handling patterns
 * @param filePath - Path to file
 * @returns Array of issues
 */
function checkErrorHandling(filePath) {
    const issues = [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    // Check for try-catch blocks
    const hasTryCatch = /try\s*{[\s\S]*?}\s*catch\s*\(/g.test(content);
    const hasFunctions = /(?:function|async\s+function|=>\s*{)/g.test(content);
    if (hasFunctions && !hasTryCatch) {
        issues.push({
            file: fileName,
            category: 'Error Handling',
            severity: 'warning',
            message: 'No try-catch blocks found. Consider adding error handling',
        });
    }
    // Check for error throwing
    const hasThrow = /throw\s+new\s+(\w+Error)/g.test(content);
    if (!hasThrow && hasFunctions) {
        issues.push({
            file: fileName,
            category: 'Error Handling',
            severity: 'info',
            message: 'No explicit error throwing found. Ensure proper error propagation',
        });
    }
    // Check for NestJS exception filters
    if (content.includes('@nestjs/common') && !content.includes('HttpException')) {
        issues.push({
            file: fileName,
            category: 'Error Handling',
            severity: 'info',
            message: 'Consider using NestJS HttpException for consistent error handling',
        });
    }
    return issues;
}
/**
 * Checks for Zod schema validation
 * @param filePath - Path to file
 * @returns Array of issues
 */
function checkZodSchemas(filePath) {
    const issues = [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    // Check if file has DTOs or input validation needs
    const hasDTOs = /class\s+\w+Dto/g.test(content) || /interface\s+I\w+Input/g.test(content);
    const hasZod = content.includes('import') && content.includes('zod');
    if (hasDTOs && !hasZod) {
        issues.push({
            file: fileName,
            category: 'Validation',
            severity: 'warning',
            message: 'DTOs found without Zod validation schemas',
        });
    }
    // Check for z.object() schemas
    if (hasZod) {
        const hasSchemas = /z\.object\s*\(/g.test(content);
        if (!hasSchemas) {
            issues.push({
                file: fileName,
                category: 'Validation',
                severity: 'warning',
                message: 'Zod imported but no schemas defined',
            });
        }
    }
    return issues;
}
/**
 * Checks for Swagger decorators
 * @param filePath - Path to file
 * @returns Array of issues
 */
function checkSwaggerDecorators(filePath) {
    const issues = [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    // Check if file is a controller
    const isController = /@Controller\s*\(/g.test(content);
    if (isController) {
        // Check for required Swagger decorators
        const hasApiTags = /@ApiTags\s*\(/g.test(content);
        const hasApiOperation = /@ApiOperation\s*\(/g.test(content);
        const hasApiResponse = /@ApiResponse\s*\(/g.test(content);
        if (!hasApiTags) {
            issues.push({
                file: fileName,
                category: 'Documentation',
                severity: 'error',
                message: 'Controller missing @ApiTags decorator',
            });
        }
        if (!hasApiOperation) {
            issues.push({
                file: fileName,
                category: 'Documentation',
                severity: 'warning',
                message: 'Controller endpoints missing @ApiOperation decorators',
            });
        }
        if (!hasApiResponse) {
            issues.push({
                file: fileName,
                category: 'Documentation',
                severity: 'warning',
                message: 'Controller endpoints missing @ApiResponse decorators',
            });
        }
    }
    // Check for DTOs with ApiProperty
    const hasDTOs = /class\s+\w+Dto/g.test(content);
    if (hasDTOs) {
        const hasApiProperty = /@ApiProperty\s*\(/g.test(content);
        if (!hasApiProperty) {
            issues.push({
                file: fileName,
                category: 'Documentation',
                severity: 'error',
                message: 'DTOs missing @ApiProperty decorators',
            });
        }
    }
    return issues;
}
/**
 * Checks for proper file header documentation
 * @param filePath - Path to file
 * @returns Array of issues
 */
function checkFileHeader(filePath) {
    const issues = [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    // Check for file header comment
    const hasFileHeader = content.startsWith('/**');
    if (!hasFileHeader) {
        issues.push({
            file: fileName,
            category: 'Documentation',
            severity: 'error',
            message: 'Missing file header documentation',
            line: 1,
        });
        return issues;
    }
    // Check for required header fields
    const requiredFields = [
        { field: 'File:', name: 'File path' },
        { field: 'Locator:', name: 'Locator code' },
        { field: 'Purpose:', name: 'Purpose description' },
        { field: 'Upstream:', name: 'Upstream dependencies' },
        { field: 'Downstream:', name: 'Downstream consumers' },
        { field: 'Exports:', name: 'Export count' },
    ];
    requiredFields.forEach(({ field, name }) => {
        if (!content.includes(field)) {
            issues.push({
                file: fileName,
                category: 'Documentation',
                severity: 'warning',
                message: `File header missing ${name} field`,
                line: 1,
            });
        }
    });
    // Check for HIPAA compliance note
    if (!content.includes('HIPAA')) {
        issues.push({
            file: fileName,
            category: 'Compliance',
            severity: 'info',
            message: 'Consider adding HIPAA compliance notes for healthcare context',
            line: 1,
        });
    }
    return issues;
}
/**
 * Checks for security best practices
 * @param filePath - Path to file
 * @returns Array of issues
 */
function checkSecurityPatterns(filePath) {
    const issues = [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    // Check for hardcoded secrets
    const secretPatterns = [
        { pattern: /password\s*[:=]\s*['"][^'"]+['"]/gi, message: 'Possible hardcoded password' },
        { pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi, message: 'Possible hardcoded API key' },
        { pattern: /secret\s*[:=]\s*['"][^'"]+['"]/gi, message: 'Possible hardcoded secret' },
        { pattern: /token\s*[:=]\s*['"][^'"]+['"]/gi, message: 'Possible hardcoded token' },
    ];
    secretPatterns.forEach(({ pattern, message }) => {
        const matches = content.match(pattern);
        if (matches) {
            issues.push({
                file: fileName,
                category: 'Security',
                severity: 'error',
                message: `${message}: ${matches[0].substring(0, 50)}...`,
            });
        }
    });
    // Check for SQL injection risks
    if (content.includes('query') && content.includes('${')) {
        issues.push({
            file: fileName,
            category: 'Security',
            severity: 'error',
            message: 'Possible SQL injection risk - use parameterized queries',
        });
    }
    // Check for XSS risks
    if (content.includes('innerHTML') || content.includes('dangerouslySetInnerHTML')) {
        issues.push({
            file: fileName,
            category: 'Security',
            severity: 'error',
            message: 'Possible XSS risk - sanitize user input',
        });
    }
    return issues;
}
/**
 * Checks for performance best practices
 * @param filePath - Path to file
 * @returns Array of issues
 */
function checkPerformancePatterns(filePath) {
    const issues = [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    // Check for n+1 query patterns
    const hasLoop = /for\s*\(|while\s*\(|forEach\s*\(/g.test(content);
    const hasQuery = /find\s*\(|findOne\s*\(|query\s*\(/g.test(content);
    if (hasLoop && hasQuery) {
        issues.push({
            file: fileName,
            category: 'Performance',
            severity: 'warning',
            message: 'Possible N+1 query pattern - consider eager loading or batch queries',
        });
    }
    // Check for missing indexes hint
    if (content.includes('@Table') && !content.includes('@Index')) {
        issues.push({
            file: fileName,
            category: 'Performance',
            severity: 'info',
            message: 'Database model without indexes - consider adding for frequently queried fields',
        });
    }
    // Check for caching opportunities
    if (content.includes('find') && !content.includes('cache') && !content.includes('Cache')) {
        issues.push({
            file: fileName,
            category: 'Performance',
            severity: 'info',
            message: 'Database queries without caching - consider caching frequently accessed data',
        });
    }
    return issues;
}
/**
 * Runs all quality checks on a file
 * @param filePath - Path to file
 * @returns Array of issues
 */
function runQualityChecks(filePath) {
    const issues = [];
    issues.push(...checkFileHeader(filePath));
    issues.push(...checkErrorHandling(filePath));
    issues.push(...checkZodSchemas(filePath));
    issues.push(...checkSwaggerDecorators(filePath));
    issues.push(...checkSecurityPatterns(filePath));
    issues.push(...checkPerformancePatterns(filePath));
    return issues;
}
/**
 * Runs quality checks on all files in directory
 * @param directory - Directory to check
 * @returns Quality check result
 */
function runQualityChecksOnDirectory(directory) {
    const files = fs
        .readdirSync(directory)
        .filter((f) => f.endsWith('.prod.ts') || (f.endsWith('.ts') && !f.endsWith('.spec.ts') && !f.endsWith('.d.ts')))
        .map((f) => path.join(directory, f));
    const allIssues = [];
    const checksPerFile = 6; // Number of check categories
    files.forEach((file) => {
        const issues = runQualityChecks(file);
        allIssues.push(...issues);
    });
    const totalChecks = files.length * checksPerFile;
    const passedChecks = totalChecks - allIssues.length;
    return {
        totalFiles: files.length,
        filesChecked: files.length,
        issues: allIssues,
        passedChecks,
        totalChecks,
    };
}
/**
 * Prints quality check results
 * @param result - Quality check result
 */
function printQualityResults(result) {
    console.log('\n🏆 Enterprise Quality Standards Report\n');
    console.log('='.repeat(80));
    const score = result.totalChecks > 0
        ? ((result.passedChecks / result.totalChecks) * 100).toFixed(1)
        : '0.0';
    console.log(`\nFiles checked: ${result.filesChecked}`);
    console.log(`Quality score: ${result.passedChecks}/${result.totalChecks} checks passed (${score}%)\n`);
    // Group issues by severity
    const errors = result.issues.filter((i) => i.severity === 'error');
    const warnings = result.issues.filter((i) => i.severity === 'warning');
    const info = result.issues.filter((i) => i.severity === 'info');
    console.log(`❌ Errors: ${errors.length}`);
    console.log(`⚠️  Warnings: ${warnings.length}`);
    console.log(`ℹ️  Info: ${info.length}\n`);
    if (result.issues.length === 0) {
        console.log('✅ All quality checks passed!');
    }
    else {
        // Group by category
        const byCategory = new Map();
        result.issues.forEach((issue) => {
            if (!byCategory.has(issue.category)) {
                byCategory.set(issue.category, []);
            }
            byCategory.get(issue.category).push(issue);
        });
        byCategory.forEach((issues, category) => {
            console.log(`\n📂 ${category} (${issues.length} issues):`);
            // Group by file
            const byFile = new Map();
            issues.forEach((issue) => {
                if (!byFile.has(issue.file)) {
                    byFile.set(issue.file, []);
                }
                byFile.get(issue.file).push(issue);
            });
            byFile.forEach((fileIssues, file) => {
                console.log(`\n   📄 ${file}`);
                fileIssues.forEach((issue) => {
                    const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
                    const lineStr = issue.line ? ` (Line ${issue.line})` : '';
                    console.log(`      ${icon} ${issue.message}${lineStr}`);
                });
            });
        });
    }
    console.log('\n' + '='.repeat(80) + '\n');
}
// CLI execution
if (require.main === module) {
    const directory = process.argv[2] || process.cwd();
    const result = runQualityChecksOnDirectory(directory);
    printQualityResults(result);
    // Save report
    const reportsDir = path.join(directory, '.qa-reports');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }
    const reportPath = path.join(reportsDir, `quality-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
    console.log(`📄 Report saved to: ${reportPath}\n`);
    // Exit with error code if critical issues found
    const hasErrors = result.issues.some((i) => i.severity === 'error');
    process.exit(hasErrors ? 1 : 0);
}
//# sourceMappingURL=quality-checks.js.map
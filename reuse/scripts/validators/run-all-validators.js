"use strict";
/**
 * Run All Validators
 * Executes all validation scripts and aggregates results
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
exports.runAllValidators = runAllValidators;
const typescript_strict_validator_1 = require("./typescript-strict-validator");
const jsdoc_validator_1 = require("./jsdoc-validator");
const export_validator_1 = require("./export-validator");
const naming_validator_1 = require("./naming-validator");
const dependency_validator_1 = require("./dependency-validator");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Runs all validators and generates a comprehensive report
 * @param directory - Directory to validate
 * @returns Validation summary
 */
function runAllValidators(directory) {
    console.log('\n' + '='.repeat(80));
    console.log('🔍 WHITE CROSS REUSABLE FUNCTION LIBRARY - QUALITY VALIDATION');
    console.log('='.repeat(80));
    console.log(`\nDirectory: ${directory}`);
    console.log(`Timestamp: ${new Date().toISOString()}\n`);
    const summary = {
        timestamp: new Date().toISOString(),
        directory,
        results: {
            strictMode: { passed: false, details: '' },
            jsdoc: { passed: false, coverage: 0, details: '' },
            exports: { passed: false, coverage: 0, details: '' },
            naming: { passed: false, compliance: 0, details: '' },
            dependencies: { passed: false, circularCount: 0, details: '' },
        },
        overallPassed: false,
    };
    // 1. TypeScript Strict Mode Validation
    console.log('1️⃣  Running TypeScript Strict Mode Validation...\n');
    try {
        const strictResults = (0, typescript_strict_validator_1.validateTypeScriptStrict)(directory);
        (0, typescript_strict_validator_1.printStrictModeResults)(strictResults);
        const strictPassed = strictResults.every((r) => r.compliant);
        summary.results.strictMode = {
            passed: strictPassed,
            details: strictPassed
                ? 'All files comply with strict mode'
                : `${strictResults.filter((r) => !r.compliant).length} files have issues`,
        };
    }
    catch (error) {
        console.error('❌ TypeScript validation failed:', error);
        summary.results.strictMode = { passed: false, details: String(error) };
    }
    // 2. JSDoc Completeness Validation
    console.log('\n2️⃣  Running JSDoc Completeness Validation...\n');
    try {
        const jsdocResults = (0, jsdoc_validator_1.validateJSDocInDirectory)(directory);
        (0, jsdoc_validator_1.printJSDocResults)(jsdocResults);
        const coverage = jsdocResults.totalElements > 0
            ? (jsdocResults.documented / jsdocResults.totalElements) * 100
            : 0;
        const jsdocPassed = coverage >= 90;
        summary.results.jsdoc = {
            passed: jsdocPassed,
            coverage,
            details: `${jsdocResults.documented}/${jsdocResults.totalElements} elements documented (${coverage.toFixed(1)}%)`,
        };
    }
    catch (error) {
        console.error('❌ JSDoc validation failed:', error);
        summary.results.jsdoc = { passed: false, coverage: 0, details: String(error) };
    }
    // 3. Export Consistency Validation
    console.log('\n3️⃣  Running Export Consistency Validation...\n');
    try {
        const exportResults = (0, export_validator_1.validateExportsInDirectory)(directory);
        (0, export_validator_1.printExportResults)(exportResults);
        const exportCoverage = exportResults.totalDeclarations > 0
            ? (exportResults.exported / exportResults.totalDeclarations) * 100
            : 0;
        const exportPassed = exportResults.issues.length === 0;
        summary.results.exports = {
            passed: exportPassed,
            coverage: exportCoverage,
            details: `${exportResults.exported}/${exportResults.totalDeclarations} declarations exported (${exportCoverage.toFixed(1)}%)`,
        };
    }
    catch (error) {
        console.error('❌ Export validation failed:', error);
        summary.results.exports = { passed: false, coverage: 0, details: String(error) };
    }
    // 4. Naming Convention Validation
    console.log('\n4️⃣  Running Naming Convention Validation...\n');
    try {
        const namingResults = (0, naming_validator_1.validateNamingInDirectory)(directory);
        (0, naming_validator_1.printNamingResults)(namingResults);
        const compliance = namingResults.totalElements > 0
            ? (namingResults.compliant / namingResults.totalElements) * 100
            : 0;
        const namingPassed = compliance >= 95;
        summary.results.naming = {
            passed: namingPassed,
            compliance,
            details: `${namingResults.compliant}/${namingResults.totalElements} elements compliant (${compliance.toFixed(1)}%)`,
        };
    }
    catch (error) {
        console.error('❌ Naming validation failed:', error);
        summary.results.naming = { passed: false, compliance: 0, details: String(error) };
    }
    // 5. Dependency Analysis
    console.log('\n5️⃣  Running Dependency Analysis...\n');
    try {
        const dependencyResults = (0, dependency_validator_1.validateDependencies)(directory);
        (0, dependency_validator_1.printDependencyResults)(dependencyResults);
        const dependencyPassed = dependencyResults.circularDependencies.length === 0;
        summary.results.dependencies = {
            passed: dependencyPassed,
            circularCount: dependencyResults.circularDependencies.length,
            details: dependencyPassed
                ? 'No circular dependencies'
                : `${dependencyResults.circularDependencies.length} circular dependencies found`,
        };
    }
    catch (error) {
        console.error('❌ Dependency analysis failed:', error);
        summary.results.dependencies = { passed: false, circularCount: -1, details: String(error) };
    }
    // Overall assessment
    summary.overallPassed = Object.values(summary.results).every((r) => r.passed);
    // Print summary
    printValidationSummary(summary);
    // Save report
    saveValidationReport(summary, directory);
    return summary;
}
/**
 * Prints validation summary
 * @param summary - Validation summary
 */
function printValidationSummary(summary) {
    console.log('\n' + '='.repeat(80));
    console.log('📋 VALIDATION SUMMARY');
    console.log('='.repeat(80) + '\n');
    const checks = [
        { name: 'TypeScript Strict Mode', result: summary.results.strictMode },
        { name: 'JSDoc Documentation', result: summary.results.jsdoc },
        { name: 'Export Consistency', result: summary.results.exports },
        { name: 'Naming Conventions', result: summary.results.naming },
        { name: 'Dependency Analysis', result: summary.results.dependencies },
    ];
    checks.forEach((check) => {
        const icon = check.result.passed ? '✅' : '❌';
        console.log(`${icon} ${check.name}`);
        console.log(`   ${check.result.details}\n`);
    });
    console.log('='.repeat(80));
    if (summary.overallPassed) {
        console.log('✅ ALL VALIDATIONS PASSED');
    }
    else {
        console.log('❌ SOME VALIDATIONS FAILED - SEE DETAILS ABOVE');
    }
    console.log('='.repeat(80) + '\n');
}
/**
 * Saves validation report to file
 * @param summary - Validation summary
 * @param directory - Directory being validated
 */
function saveValidationReport(summary, directory) {
    const reportsDir = path.join(directory, '.qa-reports');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }
    const reportPath = path.join(reportsDir, `validation-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
    console.log(`📄 Report saved to: ${reportPath}\n`);
}
// CLI execution
if (require.main === module) {
    const directory = process.argv[2] || process.cwd();
    const summary = runAllValidators(directory);
    // Exit with error code if validation failed
    process.exit(summary.overallPassed ? 0 : 1);
}
//# sourceMappingURL=run-all-validators.js.map
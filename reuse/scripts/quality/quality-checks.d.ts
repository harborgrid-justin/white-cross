/**
 * Quality Checks - Enterprise Standards Validation
 * Validates all kits follow enterprise standards
 */
interface QualityIssue {
    file: string;
    category: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    line?: number;
}
interface QualityCheckResult {
    totalFiles: number;
    filesChecked: number;
    issues: QualityIssue[];
    passedChecks: number;
    totalChecks: number;
}
/**
 * Runs quality checks on all files in directory
 * @param directory - Directory to check
 * @returns Quality check result
 */
export declare function runQualityChecksOnDirectory(directory: string): QualityCheckResult;
/**
 * Prints quality check results
 * @param result - Quality check result
 */
export declare function printQualityResults(result: QualityCheckResult): void;
export {};
//# sourceMappingURL=quality-checks.d.ts.map
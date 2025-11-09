/**
 * Run All Validators
 * Executes all validation scripts and aggregates results
 */
interface ValidationSummary {
    timestamp: string;
    directory: string;
    results: {
        strictMode: {
            passed: boolean;
            details: string;
        };
        jsdoc: {
            passed: boolean;
            coverage: number;
            details: string;
        };
        exports: {
            passed: boolean;
            coverage: number;
            details: string;
        };
        naming: {
            passed: boolean;
            compliance: number;
            details: string;
        };
        dependencies: {
            passed: boolean;
            circularCount: number;
            details: string;
        };
    };
    overallPassed: boolean;
}
/**
 * Runs all validators and generates a comprehensive report
 * @param directory - Directory to validate
 * @returns Validation summary
 */
export declare function runAllValidators(directory: string): ValidationSummary;
export {};
//# sourceMappingURL=run-all-validators.d.ts.map
/**
 * TypeScript Strict Mode Compliance Validator
 * Ensures all kit files comply with strict TypeScript settings
 */
interface ValidationResult {
    file: string;
    compliant: boolean;
    issues: string[];
}
/**
 * Validates TypeScript strict mode compliance across all kit files
 * @param directory - Directory to validate
 * @returns Array of validation results
 */
export declare function validateTypeScriptStrict(directory: string): ValidationResult[];
/**
 * Prints validation results to console
 * @param results - Validation results
 */
export declare function printStrictModeResults(results: ValidationResult[]): void;
export {};
//# sourceMappingURL=typescript-strict-validator.d.ts.map
"use strict";
/**
 * Naming Convention Validator
 * Ensures consistent naming conventions across all kit files
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
exports.validateNaming = validateNaming;
exports.validateNamingInDirectory = validateNamingInDirectory;
exports.printNamingResults = printNamingResults;
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Naming convention rules
 */
const NAMING_RULES = {
    interface: /^I[A-Z][a-zA-Z0-9]*$/, // IPascalCase
    type: /^[A-Z][a-zA-Z0-9]*$/, // PascalCase
    class: /^[A-Z][a-zA-Z0-9]*$/, // PascalCase
    enum: /^[A-Z][a-zA-Z0-9]*$/, // PascalCase
    function: /^[a-z][a-zA-Z0-9]*$/, // camelCase
    variable: /^[a-z][a-zA-Z0-9]*$/, // camelCase
    constant: /^[A-Z][A-Z0-9_]*$/, // UPPER_SNAKE_CASE
    parameter: /^[a-z][a-zA-Z0-9]*$/, // camelCase
    property: /^[a-z][a-zA-Z0-9]*$/, // camelCase
};
/**
 * Converts a name to suggested format
 * @param name - Original name
 * @param format - Target format
 * @returns Suggested name
 */
function suggestName(name, format) {
    switch (format) {
        case 'interface':
            return 'I' + toPascalCase(name);
        case 'type':
        case 'class':
        case 'enum':
            return toPascalCase(name);
        case 'constant':
            return toUpperSnakeCase(name);
        case 'function':
        case 'variable':
        case 'parameter':
        case 'property':
            return toCamelCase(name);
        default:
            return name;
    }
}
/**
 * Converts string to PascalCase
 * @param str - Input string
 * @returns PascalCase string
 */
function toPascalCase(str) {
    return str
        .replace(/[_-](.)/g, (_, char) => char.toUpperCase())
        .replace(/^(.)/, (_, char) => char.toUpperCase())
        .replace(/^I/, '');
}
/**
 * Converts string to camelCase
 * @param str - Input string
 * @returns camelCase string
 */
function toCamelCase(str) {
    return str
        .replace(/[_-](.)/g, (_, char) => char.toUpperCase())
        .replace(/^(.)/, (_, char) => char.toLowerCase())
        .replace(/^I/, '');
}
/**
 * Converts string to UPPER_SNAKE_CASE
 * @param str - Input string
 * @returns UPPER_SNAKE_CASE string
 */
function toUpperSnakeCase(str) {
    return str
        .replace(/([A-Z])/g, '_$1')
        .toUpperCase()
        .replace(/^_/, '');
}
/**
 * Validates naming conventions in a TypeScript file
 * @param filePath - Path to the TypeScript file
 * @returns Validation result
 */
function validateNaming(filePath) {
    const sourceFile = ts.createSourceFile(filePath, fs.readFileSync(filePath, 'utf-8'), ts.ScriptTarget.Latest, true);
    const issues = [];
    let totalElements = 0;
    let compliant = 0;
    /**
     * Validates a name against a pattern
     * @param name - Name to validate
     * @param pattern - Regex pattern
     * @param elementType - Type of element
     * @param line - Line number
     */
    function validateName(name, pattern, elementType, line) {
        // Skip private members
        if (name.startsWith('_'))
            return;
        totalElements++;
        if (!pattern.test(name)) {
            const suggestion = suggestName(name, elementType);
            issues.push({
                file: path.basename(filePath),
                element: name,
                elementType,
                issue: `Does not follow ${elementType} naming convention`,
                line: line + 1,
                suggestion,
            });
        }
        else {
            compliant++;
        }
    }
    /**
     * Checks if a variable is a constant
     * @param node - Variable declaration node
     * @returns True if constant
     */
    function isConstant(node) {
        const parent = node.parent;
        if (ts.isVariableDeclarationList(parent)) {
            return (parent.flags & ts.NodeFlags.Const) !== 0;
        }
        return false;
    }
    /**
     * Visits AST nodes recursively
     * @param node - TypeScript AST node
     */
    function visit(node) {
        const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        if (ts.isInterfaceDeclaration(node) && node.name) {
            validateName(node.name.text, NAMING_RULES.interface, 'interface', line);
        }
        else if (ts.isTypeAliasDeclaration(node) && node.name) {
            validateName(node.name.text, NAMING_RULES.type, 'type', line);
        }
        else if (ts.isClassDeclaration(node) && node.name) {
            validateName(node.name.text, NAMING_RULES.class, 'class', line);
        }
        else if (ts.isEnumDeclaration(node) && node.name) {
            validateName(node.name.text, NAMING_RULES.enum, 'enum', line);
        }
        else if (ts.isFunctionDeclaration(node) && node.name) {
            validateName(node.name.text, NAMING_RULES.function, 'function', line);
        }
        else if (ts.isVariableDeclaration(node) && node.name && ts.isIdentifier(node.name)) {
            const isConst = isConstant(node);
            const name = node.name.text;
            // Check if it's a constant (uppercase) or regular variable
            if (isConst && name === name.toUpperCase()) {
                validateName(name, NAMING_RULES.constant, 'constant', line);
            }
            else {
                validateName(name, NAMING_RULES.variable, 'variable', line);
            }
        }
        else if (ts.isParameter(node) && node.name && ts.isIdentifier(node.name)) {
            validateName(node.name.text, NAMING_RULES.parameter, 'parameter', line);
        }
        else if (ts.isPropertyDeclaration(node) && node.name && ts.isIdentifier(node.name)) {
            validateName(node.name.text, NAMING_RULES.property, 'property', line);
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return {
        totalElements,
        compliant,
        issues,
    };
}
/**
 * Validates naming conventions across all files in a directory
 * @param directory - Directory to scan
 * @returns Aggregated validation results
 */
function validateNamingInDirectory(directory) {
    const files = fs
        .readdirSync(directory)
        .filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && !f.endsWith('.d.ts'))
        .map((f) => path.join(directory, f));
    const aggregateResult = {
        totalElements: 0,
        compliant: 0,
        issues: [],
    };
    files.forEach((file) => {
        const result = validateNaming(file);
        aggregateResult.totalElements += result.totalElements;
        aggregateResult.compliant += result.compliant;
        aggregateResult.issues.push(...result.issues);
    });
    return aggregateResult;
}
/**
 * Prints naming validation results
 * @param result - Validation result
 */
function printNamingResults(result) {
    console.log('\n🏷️  Naming Convention Report\n');
    console.log('='.repeat(80));
    const compliance = result.totalElements > 0
        ? ((result.compliant / result.totalElements) * 100).toFixed(1)
        : '0.0';
    console.log(`\nNaming Compliance: ${result.compliant}/${result.totalElements} elements (${compliance}%)\n`);
    if (result.issues.length === 0) {
        console.log('✅ All elements follow naming conventions');
    }
    else {
        console.log(`❌ ${result.issues.length} naming issues found:\n`);
        // Group by file
        const issuesByFile = new Map();
        result.issues.forEach((issue) => {
            if (!issuesByFile.has(issue.file)) {
                issuesByFile.set(issue.file, []);
            }
            issuesByFile.get(issue.file).push(issue);
        });
        issuesByFile.forEach((fileIssues, file) => {
            console.log(`\n📄 ${file} (${fileIssues.length} issues)`);
            fileIssues.forEach((issue) => {
                console.log(`   Line ${issue.line} - ${issue.elementType}: ${issue.element}`);
                console.log(`      • ${issue.issue}`);
                if (issue.suggestion) {
                    console.log(`      → Suggestion: ${issue.suggestion}`);
                }
            });
        });
    }
    console.log('\n' + '='.repeat(80) + '\n');
}
// CLI execution
if (require.main === module) {
    const directory = process.argv[2] || process.cwd();
    const result = validateNamingInDirectory(directory);
    printNamingResults(result);
    // Exit with error code if compliance is below 95%
    const compliance = result.totalElements > 0
        ? (result.compliant / result.totalElements) * 100
        : 0;
    process.exit(compliance < 95 ? 1 : 0);
}
//# sourceMappingURL=naming-validator.js.map
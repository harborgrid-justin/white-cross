#!/usr/bin/env node

/**
 * @fileoverview JSDoc Template Generator for Service Files
 * @description Utility script to automatically generate JSDoc comment templates
 * for TypeScript service files in the backend services directory.
 *
 * @author White Cross Medical Team
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

/**
 * Generates file-level JSDoc comment
 * @param {string} serviceName - Name of the service
 * @param {string} modulePath - Module path relative to services
 * @returns {string} JSDoc comment block
 */
function generateFileJSDoc(serviceName, modulePath) {
  return `/**
 * @fileoverview ${serviceName} Service
 * @module services/${modulePath}
 * @description Business logic layer for ${serviceName.toLowerCase()} operations
 *
 * @requires ../database/models - Database models
 * @requires ../utils/logger - Application logging utility
 * @requires sequelize - ORM for database operations
 *
 * @exports ${serviceName}Service - Main service class
 *
 * @author White Cross Medical Team
 * @version 1.0.0
 * @since ${new Date().toISOString().split('T')[0]}
 *
 * @example
 * import { ${serviceName}Service } from './services/${modulePath}';
 * const result = await ${serviceName}Service.methodName(params);
 */\n\n`;
}

/**
 * Generates class JSDoc comment
 * @param {string} className - Name of the class
 * @returns {string} JSDoc comment block
 */
function generateClassJSDoc(className) {
  return `/**
 * @class ${className}
 * @description Service class handling ${className.replace('Service', '').toLowerCase()} business logic
 *
 * @example
 * const result = await ${className}.methodName({ param: value });
 */\n`;
}

/**
 * Generates method JSDoc comment
 * @param {string} methodName - Name of the method
 * @param {boolean} isAsync - Whether the method is async
 * @param {boolean} isStatic - Whether the method is static
 * @returns {string} JSDoc comment block
 */
function generateMethodJSDoc(methodName, isAsync = true, isStatic = true) {
  return `  /**
   * @method ${methodName}
   * @description [TODO: Add description]
   * ${isAsync ? '@async' : ''}
   * ${isStatic ? '@static' : ''}
   *
   * @param {Object} params - Method parameters
   * @param {Type} params.paramName - [TODO: Add parameter description]
   *
   * @returns {${isAsync ? 'Promise<' : ''}Object${isAsync ? '>' : ''}} [TODO: Add return description]
   * @returns {Array<Object>} returns.data - Result data array
   * @returns {Object} returns.pagination - Pagination metadata
   *
   * @throws {ValidationError} When parameters are invalid
   * @throws {NotFoundError} When resource doesn't exist
   * @throws {DatabaseError} When database operation fails
   *
   * @example
   * const result = await ${methodName}({ paramName: value });
   * console.log(result.data);
   */\n`;
}

/**
 * Generates interface JSDoc comment
 * @param {string} interfaceName - Name of the interface
 * @returns {string} JSDoc comment block
 */
function generateInterfaceJSDoc(interfaceName) {
  return `/**
 * @interface ${interfaceName}
 * @description [TODO: Add interface description]
 *
 * @property {Type} propertyName - [TODO: Add property description]
 */\n`;
}

/**
 * Analyzes a TypeScript file and extracts class and method names
 * @param {string} fileContent - Content of the TypeScript file
 * @returns {Object} Extracted information
 */
function analyzeFile(fileContent) {
  const info = {
    className: null,
    methods: [],
    interfaces: []
  };

  // Extract class name
  const classMatch = fileContent.match(/export class (\w+)/);
  if (classMatch) {
    info.className = classMatch[1];
  }

  // Extract method names
  const methodRegex = /(?:static\s+)?async\s+(\w+)\s*\(|(?:static\s+)?(\w+)\s*\([^)]*\)\s*:\s*\w+/g;
  let match;
  while ((match = methodRegex.exec(fileContent)) !== null) {
    const methodName = match[1] || match[2];
    if (methodName && !methodName.startsWith('_')) {
      info.methods.push(methodName);
    }
  }

  // Extract interface names
  const interfaceRegex = /export interface (\w+)/g;
  while ((match = interfaceRegex.exec(fileContent)) !== null) {
    info.interfaces.push(match[1]);
  }

  return info;
}

/**
 * Adds JSDoc comments to a service file
 * @param {string} filePath - Path to the service file
 * @param {boolean} dryRun - If true, only shows what would be done
 */
function addJSDocToFile(filePath, dryRun = false) {
  console.log(`\nProcessing: ${filePath}`);

  const content = fs.readFileSync(filePath, 'utf8');

  // Check if file already has comprehensive JSDoc
  if (content.includes('@fileoverview') && content.includes('@module')) {
    console.log('  ✓ Already documented (skipping)');
    return;
  }

  const fileInfo = analyzeFile(content);

  if (!fileInfo.className) {
    console.log('  ✗ No class found (skipping)');
    return;
  }

  // Extract service name and module path
  const relativePath = path.relative(
    path.join(__dirname, '../src/services'),
    filePath
  ).replace(/\\/g, '/').replace('.ts', '');

  const serviceName = fileInfo.className.replace('Service', '');

  console.log(`  Found class: ${fileInfo.className}`);
  console.log(`  Found ${fileInfo.methods.length} methods`);
  console.log(`  Found ${fileInfo.interfaces.length} interfaces`);

  // Generate JSDoc template
  let jsdocTemplate = generateFileJSDoc(serviceName, relativePath);

  if (dryRun) {
    console.log('  → Would add file-level JSDoc');
    console.log('  → Would add class JSDoc for:', fileInfo.className);
    fileInfo.methods.forEach(method => {
      console.log(`  → Would add method JSDoc for: ${method}`);
    });
  } else {
    // This is a simplified version - in production, you'd want more sophisticated parsing
    console.log('  ✓ JSDoc template generated (manual review required)');
    console.log('  → Save template to:', filePath + '.jsdoc.template');

    fs.writeFileSync(
      filePath + '.jsdoc.template',
      jsdocTemplate +
      generateClassJSDoc(fileInfo.className) +
      fileInfo.methods.map(m => generateMethodJSDoc(m)).join('\n')
    );
  }
}

/**
 * Recursively processes all service files
 * @param {string} dir - Directory to process
 * @param {boolean} dryRun - If true, only shows what would be done
 */
function processDirectory(dir, dryRun = false) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath, dryRun);
    } else if (entry.name.endsWith('.ts') && !entry.name.includes('.test.') && !entry.name.includes('.spec.')) {
      addJSDocToFile(fullPath, dryRun);
    }
  }
}

// Main execution
if (require.main === module) {
  const servicesDir = path.join(__dirname, '../src/services');
  const dryRun = process.argv.includes('--dry-run');

  console.log('='.repeat(60));
  console.log('JSDoc Template Generator for Service Files');
  console.log('='.repeat(60));
  console.log(`\nServices Directory: ${servicesDir}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'GENERATE TEMPLATES'}\n`);

  if (!fs.existsSync(servicesDir)) {
    console.error('Error: Services directory not found!');
    process.exit(1);
  }

  processDirectory(servicesDir, dryRun);

  console.log('\n' + '='.repeat(60));
  console.log('Processing Complete!');
  console.log('='.repeat(60));

  if (dryRun) {
    console.log('\nThis was a dry run. Run without --dry-run to generate templates.');
  } else {
    console.log('\nTemplates generated with .jsdoc.template extension.');
    console.log('Review and merge them into the source files.');
  }
}

module.exports = {
  generateFileJSDoc,
  generateClassJSDoc,
  generateMethodJSDoc,
  generateInterfaceJSDoc,
  analyzeFile
};

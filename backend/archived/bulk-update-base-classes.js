#!/usr/bin/env node

/**
 * Bulk update script to convert controllers and services to extend BaseController/BaseService
 * This script automatically updates all controllers and services to extend their respective base classes
 */

const fs = require('fs');
const path = require('path');

// Find all controller and service files
function findFiles(dir, pattern) {
  const results = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      results.push(...findFiles(fullPath, pattern));
    } else if (stat.isFile() && pattern.test(item)) {
      results.push(fullPath);
    }
  }

  return results;
}

function updateControllerFile(filePath) {
  console.log(`Updating controller: ${filePath}`);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already extends BaseController
    if (content.includes('extends BaseController')) {
      console.log(`  Skipping - already extends BaseController`);
      return;
    }

    // Extract controller name
    const controllerMatch = content.match(/export class (\w+Controller)/);
    if (!controllerMatch) {
      console.log(`  Skipping - no controller class found`);
      return;
    }
    const controllerName = controllerMatch[1];

    // Add BaseController import
    const baseImport = `import { BaseController } from '../common/base/base-controller';`;

    // Find the position after the last import to insert base import
    const importMatches = content.match(/import\s+.*from\s+['"][^'"]+['"];?\s*$/gm);
    if (importMatches && importMatches.length > 0) {
      const lastImport = importMatches[importMatches.length - 1];
      const insertPos = content.indexOf(lastImport) + lastImport.length;
      content = content.slice(0, insertPos) + '\n' + baseImport + content.slice(insertPos);
    }

    // Update class declaration to extend BaseController
    const classRegex = new RegExp(`export class ${controllerName}\\s*{`);
    content = content.replace(classRegex, `export class ${controllerName} extends BaseController {`);

    // Write the updated content
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Successfully updated ${controllerName}`);

  } catch (error) {
    console.error(`  ✗ Error updating ${filePath}:`, error.message);
  }
}

function updateServiceFile(filePath) {
  console.log(`Updating service: ${filePath}`);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already extends BaseService
    if (content.includes('extends BaseService')) {
      console.log(`  Skipping - already extends BaseService`);
      return;
    }

    // Extract service name
    const serviceMatch = content.match(/export class (\w+Service)/);
    if (!serviceMatch) {
      console.log(`  Skipping - no service class found`);
      return;
    }
    const serviceName = serviceMatch[1];

    // Add BaseService imports
    const baseImport = `import { BaseService } from '../../common/base';\nimport { LoggerService } from '../../shared/logging/logger.service';\nimport { Inject } from '@nestjs/common';`;

    // Find the position after the last import to insert base import
    const importMatches = content.match(/import\s+.*from\s+['"][^'"]+['"];?\s*$/gm);
    if (importMatches && importMatches.length > 0) {
      const lastImport = importMatches[importMatches.length - 1];
      const insertPos = content.indexOf(lastImport) + lastImport.length;
      content = content.slice(0, insertPos) + '\n' + baseImport + content.slice(insertPos);
    }

    // Update class declaration to extend BaseService
    const classRegex = new RegExp(`export class ${serviceName}\\s*{`);
    content = content.replace(classRegex, `export class ${serviceName} extends BaseService {`);

    // Remove private logger declaration
    const loggerRegex = /private readonly logger = new Logger\([^)]+\);?\s*/;
    content = content.replace(loggerRegex, '');

    // Update constructor to include LoggerService and call super()
    const constructorRegex = /constructor\s*\(([^)]*)\)\s*\{([^}]*)\}/s;
    const constructorMatch = content.match(constructorRegex);

    if (constructorMatch) {
      let params = constructorMatch[1].trim();
      let body = constructorMatch[2].trim();

      // Add LoggerService parameter
      const loggerParam = '@Inject(LoggerService) logger: LoggerService';
      if (params) {
        params = loggerParam + ',\n    ' + params;
      } else {
        params = loggerParam;
      }

      // Add super call
      const superCall = `super({\n      serviceName: '${serviceName}',\n      logger,\n      enableAuditLogging: true,\n    });`;

      if (body) {
        body = superCall + '\n\n    ' + body;
      } else {
        body = superCall;
      }

      const newConstructor = `constructor(\n    ${params}\n  ) {\n    ${body}\n  }`;
      content = content.replace(constructorRegex, newConstructor);
    } else {
      // Add constructor if none exists
      const constructorStr = `constructor(
    @Inject(LoggerService) logger: LoggerService
  ) {
    super({
      serviceName: '${serviceName}',
      logger,
      enableAuditLogging: true,
    });
  }`;

      // Find class declaration and add constructor after it
      const classDeclarationRegex = new RegExp(`export class ${serviceName} extends BaseService \\{`);
      content = content.replace(classDeclarationRegex, `export class ${serviceName} extends BaseService {\n  ${constructorStr}\n`);
    }

    // Update logger calls
    content = content.replace(/this\.logger\.log\(/g, 'this.logInfo(');
    content = content.replace(/this\.logger\.error\(/g, 'this.logError(');
    content = content.replace(/this\.logger\.warn\(/g, 'this.logWarning(');
    content = content.replace(/this\.logger\.debug\(/g, 'this.logDebug(');
    content = content.replace(/this\.logger\.verbose\(/g, 'this.logVerbose(');

    // Write the updated content
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Successfully updated ${serviceName}`);

  } catch (error) {
    console.error(`  ✗ Error updating ${filePath}:`, error.message);
  }
}

// Main execution
console.log('Starting bulk update of controllers and services to extend base classes...\n');

// Find all controller files
const controllerFiles = findFiles('./src', /\.controller\.ts$/);
console.log(`Found ${controllerFiles.length} controller files`);

// Find all service files
const serviceFiles = findFiles('./src', /\.service\.ts$/);
console.log(`Found ${serviceFiles.length} service files\n`);

// Update controllers
console.log('Updating controllers...');
controllerFiles.forEach(updateControllerFile);

// Update services
console.log('\nUpdating services...');
serviceFiles.forEach(updateServiceFile);

console.log('\n✅ Bulk update completed!');
console.log('\nNote: Please review the updated files and run tests to ensure everything works correctly.');

#!/usr/bin/env node

/**
 * Repository Generator Script
 * Generates repository interfaces and implementations for models
 * following the existing pattern in the codebase.
 */

const fs = require('fs');
const path = require('path');

// Model to domain mapping based on directory structure
const modelDomains = {
  'GrowthMeasurement': 'healthcare',
  'Screening': 'healthcare',
  'Vaccination': 'healthcare',
  'VitalSigns': 'healthcare',
  'MedicationInventory': 'medication',
  'MedicationLog': 'medication',
  'StudentMedication': 'medication',
  'InventoryItem': 'inventory',
  'InventoryTransaction': 'inventory',
  'PurchaseOrder': 'inventory',
  'PurchaseOrderItem': 'inventory',
  'Vendor': 'inventory',
  'IpRestriction': 'security',
  'LoginAttempt': 'security',
  'Permission': 'security',
  'Role': 'security',
  'RolePermission': 'security',
  'SecurityIncident': 'security',
  'Session': 'security',
  'UserRoleAssignment': 'security',
  'ComplianceChecklistItem': 'compliance',
  'ComplianceReport': 'compliance',
  'ConsentForm': 'compliance',
  'ConsentSignature': 'compliance',
  'PolicyAcknowledgment': 'compliance',
  'PolicyDocument': 'compliance',
  'Message': 'communication',
  'MessageDelivery': 'communication',
  'MessageTemplate': 'communication',
  'Document': 'documents',
  'DocumentAuditTrail': 'documents',
  'DocumentSignature': 'documents',
  'FollowUpAction': 'incidents',
  'IncidentReport': 'incidents',
  'WitnessStatement': 'incidents',
  'IntegrationConfig': 'integration',
  'IntegrationLog': 'integration',
  'BackupLog': 'administration',
  'ConfigurationHistory': 'administration',
  'License': 'administration',
  'MaintenanceLog': 'administration',
  'PerformanceMetric': 'administration',
  'SystemConfiguration': 'administration',
  'TrainingCompletion': 'administration',
  'TrainingModule': 'administration',
  'AppointmentReminder': 'operations',
  'AppointmentWaitlist': 'operations',
  'Contact': 'core',
  'EmergencyContact': 'core',
  'NurseAvailability': 'operations',
  'BudgetCategory': 'budget',
  'BudgetTransaction': 'budget'
};

// Models that need repositories
const modelsToGenerate = Object.keys(modelDomains);

/**
 * Generate repository interface
 */
function generateInterface(modelName) {
  const interfaceName = `I${modelName}Repository`;
  
  return `/**
 * @fileoverview ${modelName} repository interface.
 * Auto-generated repository interface for ${modelName} data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * ${modelName} repository interface
 * Extends base repository with ${modelName}-specific operations
 */
export interface ${interfaceName} extends IRepository<any, any, any> {
  // Add ${modelName}-specific methods here if needed
}

/**
 * Create ${modelName} DTO
 */
export interface Create${modelName}DTO {
  [key: string]: any;
}

/**
 * Update ${modelName} DTO
 */
export interface Update${modelName}DTO {
  [key: string]: any;
}
`;
}

/**
 * Generate repository implementation
 */
function generateImplementation(modelName, domain) {
  const repositoryName = `${modelName}Repository`;
  const interfaceName = `I${modelName}Repository`;
  
  return `/**
 * ${repositoryName} Implementation
 * Auto-generated repository for ${modelName} data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { ${modelName} } from '../../models/${domain}/${modelName}';
import {
  ${interfaceName},
  Create${modelName}DTO,
  Update${modelName}DTO
} from '../interfaces/${interfaceName}';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class ${repositoryName}
  extends BaseRepository<${modelName}, any, any>
  implements ${interfaceName}
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(${modelName}, auditLogger, cacheManager, '${modelName}');
  }

  /**
   * Custom ${modelName}-specific methods can be added here
   */
}
`;
}

/**
 * Main generation function
 */
function generateRepositories() {
  const baseDir = path.join(__dirname, '..');
  const interfacesDir = path.join(baseDir, 'src/database/repositories/interfaces');
  const implDir = path.join(baseDir, 'src/database/repositories/impl');
  
  // Ensure directories exist
  if (!fs.existsSync(interfacesDir)) {
    fs.mkdirSync(interfacesDir, { recursive: true });
  }
  if (!fs.existsSync(implDir)) {
    fs.mkdirSync(implDir, { recursive: true });
  }
  
  let generated = 0;
  let skipped = 0;
  
  console.log('Generating repositories...\n');
  
  for (const modelName of modelsToGenerate) {
    const domain = modelDomains[modelName];
    const interfacePath = path.join(interfacesDir, `I${modelName}Repository.ts`);
    const implPath = path.join(implDir, `${modelName}Repository.ts`);
    
    // Check if files already exist
    const interfaceExists = fs.existsSync(interfacePath);
    const implExists = fs.existsSync(implPath);
    
    if (interfaceExists && implExists) {
      console.log(`⏭️  Skipping ${modelName} (already exists)`);
      skipped++;
      continue;
    }
    
    // Generate interface
    if (!interfaceExists) {
      const interfaceContent = generateInterface(modelName);
      fs.writeFileSync(interfacePath, interfaceContent);
      console.log(`✅ Generated interface: I${modelName}Repository.ts`);
    }
    
    // Generate implementation
    if (!implExists) {
      const implContent = generateImplementation(modelName, domain);
      fs.writeFileSync(implPath, implContent);
      console.log(`✅ Generated implementation: ${modelName}Repository.ts`);
    }
    
    generated++;
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Generated: ${generated} repositories`);
  console.log(`   Skipped: ${skipped} repositories`);
  console.log(`   Total: ${modelsToGenerate.length} models processed`);
  
  // Update index files
  updateIndexFiles(baseDir);
}

/**
 * Update index.ts files to export new repositories
 */
function updateIndexFiles(baseDir) {
  console.log('\n📝 Updating index files...');
  
  // Update interfaces index
  const interfacesIndexPath = path.join(baseDir, 'src/database/repositories/interfaces/index.ts');
  const interfaceExports = modelsToGenerate
    .map(model => `export * from './I${model}Repository';`)
    .join('\n');
  
  const interfacesIndexContent = `/**
 * Repository Interfaces Index
 * Auto-generated exports
 */

export * from './IRepository';
${interfaceExports}
`;
  
  fs.writeFileSync(interfacesIndexPath, interfacesIndexContent);
  console.log('✅ Updated interfaces/index.ts');
  
  // Update implementations index  
  const implIndexPath = path.join(baseDir, 'src/database/repositories/impl/index.ts');
  const implExports = ['Allergy', 'Appointment', 'AuditLog', 'ChronicCondition', 
    'District', 'HealthRecord', 'Medication', 'School', 'Student', 'User', ...modelsToGenerate]
    .sort()
    .map(model => `export * from './${model}Repository';`)
    .join('\n');
  
  const implIndexContent = `/**
 * Repository Implementations Index
 * Auto-generated exports
 */

${implExports}
`;
  
  fs.writeFileSync(implIndexPath, implIndexContent);
  console.log('✅ Updated impl/index.ts');
}

// Run the generator
try {
  generateRepositories();
  console.log('\n✨ Repository generation complete!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error generating repositories:', error);
  process.exit(1);
}

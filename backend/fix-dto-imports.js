const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Mapping of old DTO names to new names and their file paths
const dtoMappings = [
  // ChangePasswordDto
  { old: 'ChangePasswordDto', new: 'AuthChangePasswordDto', path: 'src/auth/dto/change-password.dto' },
  { old: 'ChangePasswordDto', new: 'UserChangePasswordDto', path: 'src/user/dto/change-password.dto' },

  // CreateSecurityIncidentDto
  { old: 'CreateSecurityIncidentDto', new: 'SecurityCreateIncidentDto', path: 'src/security/dto/security-incident.dto' },
  { old: 'CreateSecurityIncidentDto', new: 'AccessControlCreateIncidentDto', path: 'src/access-control/dto/create-security-incident.dto' },

  // CreateIpRestrictionDto
  { old: 'CreateIpRestrictionDto', new: 'SecurityCreateIpRestrictionDto', path: 'src/security/dto/ip-restriction.dto' },
  { old: 'CreateIpRestrictionDto', new: 'AccessControlCreateIpRestrictionDto', path: 'src/access-control/dto/create-ip-restriction.dto' },

  // GenerateReportDto
  { old: 'GenerateReportDto', new: 'AcademicGenerateReportDto', path: 'src/academic-transcript/dto/generate-report.dto' },
  { old: 'GenerateReportDto', new: 'ComplianceGenerateReportDto', path: 'src/compliance/dto/compliance-report.dto' },
  { old: 'GenerateReportDto', new: 'AnalyticsGenerateReportDto', path: 'src/analytics/dto/report-generation.dto' },

  // GenerateCustomReportDto
  { old: 'GenerateCustomReportDto', new: 'PdfGenerateCustomReportDto', path: 'src/pdf/dto/generate-custom-report.dto' },
  { old: 'GenerateCustomReportDto', new: 'AnalyticsGenerateCustomReportDto', path: 'src/analytics/dto/custom-reports.dto' },

  // UpdatePreferencesDto
  { old: 'UpdatePreferencesDto', new: 'MobileUpdatePreferencesDto', path: 'src/mobile/dto/update-preferences.dto' },
  { old: 'UpdatePreferencesDto', new: 'AlertsUpdatePreferencesDto', path: 'src/alerts/dto/update-preferences.dto' },

  // CreateHealthRecordDto
  { old: 'CreateHealthRecordDto', new: 'HealthRecordCreateDto', path: 'src/health-record/dto/create-health-record.dto' },
  { old: 'CreateHealthRecordDto', new: 'HealthDomainCreateRecordDto', path: 'src/health-domain/dto/create-health-record.dto' },

  // UpdateHealthRecordDto
  { old: 'UpdateHealthRecordDto', new: 'HealthRecordUpdateDto', path: 'src/health-record/dto/update-health-record.dto' },
  { old: 'UpdateHealthRecordDto', new: 'HealthDomainUpdateRecordDto', path: 'src/health-domain/dto/update-health-record.dto' },

  // UpdateAllergyDto
  { old: 'UpdateAllergyDto', new: 'AllergyUpdateDto', path: 'src/allergy/dto/update-allergy.dto' },
  { old: 'UpdateAllergyDto', new: 'HealthRecordUpdateAllergyDto', path: 'src/health-record/allergy/dto/update-allergy.dto' },
  { old: 'UpdateAllergyDto', new: 'HealthDomainUpdateAllergyDto', path: 'src/health-domain/dto/update-allergy.dto' },
  { old: 'UpdateAllergyDto', new: 'ClinicalUpdateAllergyDto', path: 'src/clinical/dto/drug/update-allergy.dto' },

  // CreateChronicConditionDto
  { old: 'CreateChronicConditionDto', new: 'ChronicConditionCreateDto', path: 'src/chronic-condition/dto/create-chronic-condition.dto' },
  { old: 'CreateChronicConditionDto', new: 'HealthDomainCreateChronicConditionDto', path: 'src/health-domain/dto/create-chronic-condition.dto' },

  // UpdateChronicConditionDto
  { old: 'UpdateChronicConditionDto', new: 'ChronicConditionUpdateDto', path: 'src/chronic-condition/dto/update-chronic-condition.dto' },
  { old: 'UpdateChronicConditionDto', new: 'HealthDomainUpdateChronicConditionDto', path: 'src/health-domain/dto/update-chronic-condition.dto' },

  // CreateEmergencyContactDto
  { old: 'CreateEmergencyContactDto', new: 'EmergencyContactCreateDto', path: 'src/emergency-contact/dto/create-emergency-contact.dto' },
  { old: 'CreateEmergencyContactDto', new: 'ContactCreateEmergencyDto', path: 'src/contact/dto/create-emergency-contact.dto' },

  // UpdateEmergencyContactDto
  { old: 'UpdateEmergencyContactDto', new: 'EmergencyContactUpdateDto', path: 'src/emergency-contact/dto/update-emergency-contact.dto' },
  { old: 'UpdateEmergencyContactDto', new: 'ContactUpdateEmergencyDto', path: 'src/contact/dto/update-emergency-contact.dto' },

  // VerifyContactDto
  { old: 'VerifyContactDto', new: 'EmergencyVerifyContactDto', path: 'src/emergency-contact/dto/verify-contact.dto' },
  { old: 'VerifyContactDto', new: 'ContactVerifyDto', path: 'src/contact/dto/verify-contact.dto' },

  // BulkUpdateDto
  { old: 'BulkUpdateDto', new: 'StudentBulkUpdateDto', path: 'src/student/dto/bulk-update.dto' },
  { old: 'BulkUpdateDto', new: 'ConfigurationBulkUpdateDto', path: 'src/configuration/dto/bulk-update.dto' },

  // ScanBarcodeDto
  { old: 'ScanBarcodeDto', new: 'StudentScanBarcodeDto', path: 'src/student/dto/scan-barcode.dto' },
  { old: 'ScanBarcodeDto', new: 'AdvancedFeaturesScanBarcodeDto', path: 'src/advanced-features/dto/scan-barcode.dto' },
];

// Helper to determine which new DTO name to use based on file path
function getNewDtoName(oldName, filePath) {
  for (const mapping of dtoMappings) {
    if (mapping.old === oldName) {
      // Extract module name from file path
      const pathParts = filePath.replace(/\\/g, '/').split('/');
      const moduleName = pathParts.find((part, idx) => {
        // Look for module directory
        return idx > 0 && pathParts[idx - 1] === 'src';
      });

      // Match based on module directory
      const mappingModule = mapping.path.split('/')[1]; // Get module from mapping path
      if (moduleName === mappingModule) {
        return mapping.new;
      }
    }
  }
  return null;
}

// Find all TypeScript files
function findAllTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        findAllTsFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

console.log('Starting import statement fix process...\n');

const srcPath = path.join(__dirname, 'src');
const tsFiles = findAllTsFiles(srcPath);

let updatedCount = 0;
let errorCount = 0;

// Process each file
tsFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const relativePath = path.relative(__dirname, filePath);

    // Check each old DTO name
    const uniqueOldNames = [...new Set(dtoMappings.map(m => m.old))];

    uniqueOldNames.forEach(oldName => {
      // Look for imports of this DTO
      const importRegex = new RegExp(`import\\s*{([^}]*\\b${oldName}\\b[^}]*)}\\s*from\\s*['"]([^'"]+)['"]`, 'g');

      content = content.replace(importRegex, (match, imports, importPath) => {
        // Determine the new name based on the file being processed
        const newName = getNewDtoName(oldName, filePath);

        if (newName && imports.includes(oldName)) {
          modified = true;
          // Replace the old name with the new name in the import list
          const updatedImports = imports.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
          return `import {${updatedImports}} from '${importPath}'`;
        }

        return match;
      });

      // Also handle exports in index files
      const exportRegex = new RegExp(`export\\s*{([^}]*\\b${oldName}\\b[^}]*)}\\s*from\\s*['"]([^'"]+)['"]`, 'g');

      content = content.replace(exportRegex, (match, exports, exportPath) => {
        const newName = getNewDtoName(oldName, filePath);

        if (newName && exports.includes(oldName)) {
          modified = true;
          const updatedExports = exports.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
          return `export {${updatedExports}} from '${exportPath}'`;
        }

        return match;
      });

      // Handle PartialType and OmitType that extend these DTOs
      const partialTypeRegex = new RegExp(`PartialType\\(${oldName}\\)`, 'g');
      content = content.replace(partialTypeRegex, (match) => {
        const newName = getNewDtoName(oldName, filePath);
        if (newName) {
          modified = true;
          return `PartialType(${newName})`;
        }
        return match;
      });

      const omitTypeRegex = new RegExp(`OmitType\\(${oldName},`, 'g');
      content = content.replace(omitTypeRegex, (match) => {
        const newName = getNewDtoName(oldName, filePath);
        if (newName) {
          modified = true;
          return `OmitType(${newName},`;
        }
        return match;
      });
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated ${relativePath}`);
      updatedCount++;
    }
  } catch (error) {
    console.error(`✗ Error processing ${relativePath}:`, error.message);
    errorCount++;
  }
});

console.log(`\n✅ Import fix process completed!`);
console.log(`   Updated: ${updatedCount} files`);
console.log(`   Errors: ${errorCount} files`);

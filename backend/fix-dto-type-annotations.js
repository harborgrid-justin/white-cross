const fs = require('fs');
const path = require('path');

// Mapping of module paths to DTO renames
const moduleToRenameMap = {
  'academic-transcript': {
    'GenerateReportDto': 'AcademicGenerateReportDto'
  },
  'access-control': {
    'CreateSecurityIncidentDto': 'AccessControlCreateIncidentDto',
    'CreateIpRestrictionDto': 'AccessControlCreateIpRestrictionDto'
  },
  'advanced-features': {
    'ScanBarcodeDto': 'AdvancedFeaturesScanBarcodeDto'
  },
  'alerts': {
    'UpdatePreferencesDto': 'AlertsUpdatePreferencesDto'
  },
  'allergy': {
    'UpdateAllergyDto': 'AllergyUpdateDto'
  },
  'analytics': {
    'GenerateReportDto': 'AnalyticsGenerateReportDto',
    'GenerateCustomReportDto': 'AnalyticsGenerateCustomReportDto'
  },
  'auth': {
    'ChangePasswordDto': 'AuthChangePasswordDto'
  },
  'chronic-condition': {
    'CreateChronicConditionDto': 'ChronicConditionCreateDto',
    'UpdateChronicConditionDto': 'ChronicConditionUpdateDto'
  },
  'clinical': {
    'UpdateAllergyDto': 'ClinicalUpdateAllergyDto'
  },
  'compliance': {
    'GenerateReportDto': 'ComplianceGenerateReportDto'
  },
  'configuration': {
    'BulkUpdateDto': 'ConfigurationBulkUpdateDto'
  },
  'contact': {
    'CreateEmergencyContactDto': 'ContactCreateEmergencyDto',
    'UpdateEmergencyContactDto': 'ContactUpdateEmergencyDto',
    'VerifyContactDto': 'ContactVerifyDto'
  },
  'emergency-contact': {
    'CreateEmergencyContactDto': 'EmergencyContactCreateDto',
    'UpdateEmergencyContactDto': 'EmergencyContactUpdateDto',
    'VerifyContactDto': 'EmergencyVerifyContactDto'
  },
  'health-domain': {
    'CreateHealthRecordDto': 'HealthDomainCreateRecordDto',
    'UpdateHealthRecordDto': 'HealthDomainUpdateRecordDto',
    'UpdateAllergyDto': 'HealthDomainUpdateAllergyDto',
    'CreateChronicConditionDto': 'HealthDomainCreateChronicConditionDto',
    'UpdateChronicConditionDto': 'HealthDomainUpdateChronicConditionDto'
  },
  'health-record': {
    'CreateHealthRecordDto': 'HealthRecordCreateDto',
    'UpdateHealthRecordDto': 'HealthRecordUpdateDto',
    'UpdateAllergyDto': 'HealthRecordUpdateAllergyDto'
  },
  'mobile': {
    'UpdatePreferencesDto': 'MobileUpdatePreferencesDto'
  },
  'pdf': {
    'GenerateCustomReportDto': 'PdfGenerateCustomReportDto'
  },
  'security': {
    'CreateSecurityIncidentDto': 'SecurityCreateIncidentDto',
    'CreateIpRestrictionDto': 'SecurityCreateIpRestrictionDto'
  },
  'student': {
    'BulkUpdateDto': 'StudentBulkUpdateDto',
    'ScanBarcodeDto': 'StudentScanBarcodeDto'
  },
  'user': {
    'ChangePasswordDto': 'UserChangePasswordDto'
  }
};

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

function getModuleFromPath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  const match = normalized.match(/src\/([^\/]+)\//);
  return match ? match[1] : null;
}

console.log('Starting DTO type annotation fix process...\n');

const srcPath = path.join(__dirname, 'src');
const tsFiles = findAllTsFiles(srcPath);

let updatedCount = 0;
let errorCount = 0;

tsFiles.forEach(filePath => {
  try {
    const module = getModuleFromPath(filePath);
    if (!module || !moduleToRenameMap[module]) {
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const relativePath = path.relative(__dirname, filePath);
    const renameMap = moduleToRenameMap[module];

    Object.entries(renameMap).forEach(([oldName, newName]) => {
      // Replace in @ApiBody decorators
      const apiBodyRegex = new RegExp(`(@ApiBody\\(\\s*\\{[^}]*type:\\s*)${oldName}([\\s,}])`, 'g');
      if (apiBodyRegex.test(content)) {
        content = content.replace(apiBodyRegex, `$1${newName}$2`);
        modified = true;
      }

      // Replace in type annotations (parameters, return types, etc)
      const typeAnnotationRegex = new RegExp(`(:\\s*)${oldName}([\\s,\\)\\[\\]<>])`, 'g');
      if (typeAnnotationRegex.test(content)) {
        content = content.replace(typeAnnotationRegex, `$1${newName}$2`);
        modified = true;
      }

      // Replace in extends clauses
      const extendsRegex = new RegExp(`(extends\\s+)${oldName}([\\s{])`, 'g');
      if (extendsRegex.test(content)) {
        content = content.replace(extendsRegex, `$1${newName}$2`);
        modified = true;
      }

      // Replace in array types
      const arrayTypeRegex = new RegExp(`(:\\s*)${oldName}(\\[\\])`, 'g');
      if (arrayTypeRegex.test(content)) {
        content = content.replace(arrayTypeRegex, `$1${newName}$2`);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated ${relativePath}`);
      updatedCount++;
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    errorCount++;
  }
});

console.log(`\n✅ Type annotation fix process completed!`);
console.log(`   Updated: ${updatedCount} files`);
console.log(`   Errors: ${errorCount} files`);

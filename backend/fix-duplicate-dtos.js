const fs = require('fs');
const path = require('path');

// Mapping of file paths to new DTO names
const dtoRenames = {
  // ChangePasswordDto
  'src/auth/dto/change-password.dto.ts': { old: 'ChangePasswordDto', new: 'AuthChangePasswordDto' },
  'src/user/dto/change-password.dto.ts': { old: 'ChangePasswordDto', new: 'UserChangePasswordDto' },

  // CreateSecurityIncidentDto
  'src/security/dto/security-incident.dto.ts': { old: 'CreateSecurityIncidentDto', new: 'SecurityCreateIncidentDto' },
  'src/access-control/dto/create-security-incident.dto.ts': { old: 'CreateSecurityIncidentDto', new: 'AccessControlCreateIncidentDto' },

  // CreateIpRestrictionDto
  'src/security/dto/ip-restriction.dto.ts': { old: 'CreateIpRestrictionDto', new: 'SecurityCreateIpRestrictionDto' },
  'src/access-control/dto/create-ip-restriction.dto.ts': { old: 'CreateIpRestrictionDto', new: 'AccessControlCreateIpRestrictionDto' },

  // GenerateReportDto
  'src/academic-transcript/dto/generate-report.dto.ts': { old: 'GenerateReportDto', new: 'AcademicGenerateReportDto' },
  'src/compliance/dto/compliance-report.dto.ts': { old: 'GenerateReportDto', new: 'ComplianceGenerateReportDto' },
  'src/analytics/dto/report-generation.dto.ts': { old: 'GenerateReportDto', new: 'AnalyticsGenerateReportDto' },

  // GenerateCustomReportDto
  'src/pdf/dto/generate-custom-report.dto.ts': { old: 'GenerateCustomReportDto', new: 'PdfGenerateCustomReportDto' },
  'src/analytics/dto/custom-reports.dto.ts': { old: 'GenerateCustomReportDto', new: 'AnalyticsGenerateCustomReportDto' },

  // UpdatePreferencesDto
  'src/mobile/dto/update-preferences.dto.ts': { old: 'UpdatePreferencesDto', new: 'MobileUpdatePreferencesDto' },
  'src/alerts/dto/update-preferences.dto.ts': { old: 'UpdatePreferencesDto', new: 'AlertsUpdatePreferencesDto' },

  // CreateHealthRecordDto
  'src/health-record/dto/create-health-record.dto.ts': { old: 'CreateHealthRecordDto', new: 'HealthRecordCreateDto' },
  'src/health-domain/dto/create-health-record.dto.ts': { old: 'CreateHealthRecordDto', new: 'HealthDomainCreateRecordDto' },

  // UpdateHealthRecordDto
  'src/health-record/dto/update-health-record.dto.ts': { old: 'UpdateHealthRecordDto', new: 'HealthRecordUpdateDto' },
  'src/health-domain/dto/update-health-record.dto.ts': { old: 'UpdateHealthRecordDto', new: 'HealthDomainUpdateRecordDto' },

  // UpdateAllergyDto
  'src/allergy/dto/update-allergy.dto.ts': { old: 'UpdateAllergyDto', new: 'AllergyUpdateDto' },
  'src/health-record/allergy/dto/update-allergy.dto.ts': { old: 'UpdateAllergyDto', new: 'HealthRecordUpdateAllergyDto' },
  'src/health-domain/dto/update-allergy.dto.ts': { old: 'UpdateAllergyDto', new: 'HealthDomainUpdateAllergyDto' },
  'src/clinical/dto/drug/update-allergy.dto.ts': { old: 'UpdateAllergyDto', new: 'ClinicalUpdateAllergyDto' },

  // CreateChronicConditionDto
  'src/chronic-condition/dto/create-chronic-condition.dto.ts': { old: 'CreateChronicConditionDto', new: 'ChronicConditionCreateDto' },
  'src/health-domain/dto/create-chronic-condition.dto.ts': { old: 'CreateChronicConditionDto', new: 'HealthDomainCreateChronicConditionDto' },

  // UpdateChronicConditionDto
  'src/chronic-condition/dto/update-chronic-condition.dto.ts': { old: 'UpdateChronicConditionDto', new: 'ChronicConditionUpdateDto' },
  'src/health-domain/dto/update-chronic-condition.dto.ts': { old: 'UpdateChronicConditionDto', new: 'HealthDomainUpdateChronicConditionDto' },

  // CreateEmergencyContactDto
  'src/emergency-contact/dto/create-emergency-contact.dto.ts': { old: 'CreateEmergencyContactDto', new: 'EmergencyContactCreateDto' },
  'src/contact/dto/create-emergency-contact.dto.ts': { old: 'CreateEmergencyContactDto', new: 'ContactCreateEmergencyDto' },

  // UpdateEmergencyContactDto
  'src/emergency-contact/dto/update-emergency-contact.dto.ts': { old: 'UpdateEmergencyContactDto', new: 'EmergencyContactUpdateDto' },
  'src/contact/dto/update-emergency-contact.dto.ts': { old: 'UpdateEmergencyContactDto', new: 'ContactUpdateEmergencyDto' },

  // VerifyContactDto
  'src/emergency-contact/dto/verify-contact.dto.ts': { old: 'VerifyContactDto', new: 'EmergencyVerifyContactDto' },
  'src/contact/dto/verify-contact.dto.ts': { old: 'VerifyContactDto', new: 'ContactVerifyDto' },

  // BulkUpdateDto
  'src/student/dto/bulk-update.dto.ts': { old: 'BulkUpdateDto', new: 'StudentBulkUpdateDto' },
  'src/configuration/dto/bulk-update.dto.ts': { old: 'BulkUpdateDto', new: 'ConfigurationBulkUpdateDto' },

  // ScanBarcodeDto
  'src/student/dto/scan-barcode.dto.ts': { old: 'ScanBarcodeDto', new: 'StudentScanBarcodeDto' },
  'src/advanced-features/dto/scan-barcode.dto.ts': { old: 'ScanBarcodeDto', new: 'AdvancedFeaturesScanBarcodeDto' },
};

console.log('Starting DTO rename process...\n');

Object.entries(dtoRenames).forEach(([filePath, { old: oldName, new: newName }]) => {
  const fullPath = path.join(__dirname, filePath);

  try {
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Replace class name
      const classRegex = new RegExp(`export class ${oldName}`, 'g');
      content = content.replace(classRegex, `export class ${newName}`);

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Renamed ${oldName} to ${newName} in ${filePath}`);
    } else {
      console.log(`⚠ File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log('\n✅ DTO rename process completed!');
console.log('\n⚠️  Note: You may need to update import statements in controllers and services.');

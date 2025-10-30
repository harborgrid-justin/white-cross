const fs = require('fs');
const path = require('path');

// Common field name mappings from snake_case to camelCase
const fieldMappings = {
  'user_id': 'userId',
  'school_id': 'schoolId',
  'district_id': 'districtId',
  'student_id': 'studentId',
  'is_active': 'isActive',
  'started_at': 'startedAt',
  'check_in_time': 'checkInTime',
  'check_out_time': 'checkOutTime',
  'attended_by': 'attendedBy',
  'visit_id': 'visitId',
  'created_by': 'createdBy',
  'updated_by': 'updatedBy',
  'due_date': 'dueDate',
  'completed_at': 'completedAt',
  'report_id': 'reportId',
  'report_type': 'reportType',
  'created_at': 'createdAt',
  'updated_at': 'updatedAt',
  'deleted_at': 'deletedAt',
  'appointment_id': 'appointmentId',
  'nurse_id': 'nurseId',
  'scheduled_at': 'scheduledAt',
  'recurring_group_id': 'recurringGroupId',
  'recurring_frequency': 'recurringFrequency',
  'recurring_end_date': 'recurringEndDate',
  'imported_by': 'importedBy',
  'imported_at': 'importedAt',
  'import_source': 'importSource',
  'entity_type': 'entityType',
  'entity_id': 'entityId',
  'user_name': 'userName',
  'previous_values': 'previousValues',
  'new_values': 'newValues',
  'ip_address': 'ipAddress',
  'user_agent': 'userAgent',
  'request_id': 'requestId',
  'session_id': 'sessionId',
  'is_phi': 'isPHI',
  'compliance_type': 'complianceType',
  'error_message': 'errorMessage',
  'zip_code': 'zipCode',
  'total_enrollment': 'totalEnrollment',
  'student_number': 'studentNumber',
  'first_name': 'firstName',
  'last_name': 'lastName',
  'date_of_birth': 'dateOfBirth',
  'medical_record_num': 'medicalRecordNum',
  'enrollment_date': 'enrollmentDate',
  'phone_number': 'phoneNumber',
  'preferred_contact_method': 'preferredContactMethod',
  'verification_status': 'verificationStatus',
  'last_verified_at': 'lastVerifiedAt',
  'notification_channels': 'notificationChannels',
  'can_pickup_student': 'canPickupStudent',
  'academic_year': 'academicYear',
  'created_by_id': 'createdById',
  'conversation_id': 'conversationId',
  'consent_form_id': 'consentFormId',
  'auto_delete': 'autoDelete',
  'last_reviewed_at': 'lastReviewedAt',
  'alert_id': 'alertId',
  'last_attempt': 'lastAttempt',
  'recipient_id': 'recipientId',
  'device_id': 'deviceId',
  'is_valid': 'isValid',
  'expires_at': 'expiresAt',
  'config_key': 'configKey',
  'changed_by': 'changedBy',
  'configuration_id': 'configurationId',
  'drug1_id': 'drug1Id',
  'drug2_id': 'drug2Id',
  'rxnorm_id': 'rxnormId',
  'rxnorm_code': 'rxnormCode',
  'generic_name': 'genericName',
  'drug_class': 'drugClass',
  'violation_type': 'violationType',
  'reported_by': 'reportedBy',
  'assigned_to': 'assignedTo',
  'discovered_at': 'discoveredAt',
  'original_visit_id': 'originalVisitId',
  'scheduled_date': 'scheduledDate',
  'last_sync_at': 'lastSyncAt',
  'integration_id': 'integrationId',
  'integration_type': 'integrationType',
  'license_key': 'licenseKey',
  'record_type': 'recordType',
  'risk_level': 'riskLevel',
  'counselor_id': 'counselorId',
  'record_date': 'recordDate',
  'follow_up_required': 'followUpRequired',
  'follow_up_date': 'followUpDate',
  'message_id': 'messageId',
  'treatment_plan_id': 'treatmentPlanId',
  'violation_id': 'violationId',
  'resolved_at': 'resolvedAt',
  'effective_date': 'effectiveDate',
  'review_date': 'reviewDate',
  'approved_by': 'approvedBy',
  'policy_id': 'policyId',
  'triggered_by': 'triggeredBy',
  'disclosure_date': 'disclosureDate',
  'disclosure_id': 'disclosureId',
  'is_required': 'isRequired',
  'metric_type': 'metricType',
  'recorded_at': 'recordedAt',
  'administration_date': 'administrationDate',
  'vaccine_type': 'vaccineType',
  'compliance_status': 'complianceStatus',
  'next_due_date': 'nextDueDate',
  'expiration_date': 'expirationDate',
  'incident_report_id': 'incidentReportId'
};

// Get list of model files
const modelsDir = path.join(__dirname, 'src', 'database', 'models');

function getAllModelFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllModelFiles(fullPath));
    } else if (entry.endsWith('.model.ts') && entry !== 'index.ts') {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixIndexFieldReferences(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Find and replace snake_case field references in index definitions
  const indexFieldPattern = /fields:\s*\[([^\]]+)\]/g;
  
  content = content.replace(indexFieldPattern, (match, fieldsList) => {
    let newFieldsList = fieldsList;
    let fieldChanged = false;
    
    // Replace each field mapping
    Object.entries(fieldMappings).forEach(([snakeCase, camelCase]) => {
      const fieldPattern = new RegExp(`'${snakeCase}'`, 'g');
      if (fieldPattern.test(newFieldsList)) {
        newFieldsList = newFieldsList.replace(fieldPattern, `'${camelCase}'`);
        fieldChanged = true;
      }
    });
    
    if (fieldChanged) {
      changed = true;
      return `fields: [${newFieldsList}]`;
    }
    
    return match;
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

console.log('🔧 Fixing index field references to use camelCase...\n');

const modelFiles = getAllModelFiles(modelsDir);
let fixedCount = 0;

for (const modelFile of modelFiles) {
  const relativePath = path.relative(modelsDir, modelFile);
  
  if (fixIndexFieldReferences(modelFile)) {
    console.log(`✅ Fixed ${relativePath}`);
    fixedCount++;
  }
}

console.log(`\n✅ Fixed ${fixedCount} model files with camelCase index field references`);
console.log('\nAll index definitions now use consistent camelCase field names.');
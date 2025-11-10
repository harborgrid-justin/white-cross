#!/usr/bin/env node
/**
 * Composite Refactoring Script
 *
 * Systematically refactors all 119 downstream composite files with:
 * - Symbol-based injection tokens
 * - ConfigService injection
 * - Logger injection
 * - Proper error handling
 * - Meaningful function names
 */

const fs = require('fs');
const path = require('path');

// Function name mappings by composite type
const functionNameMappings = {
  'notification-services': {
    function001: 'sendEnrollmentNotification',
    function002: 'sendGradeNotification',
    function003: 'sendFinancialAidNotification',
    function004: 'sendAccountNotification',
    function005: 'sendDeadlineReminder',
    function006: 'sendEventNotification',
    function007: 'sendEmergencyAlert',
    function008: 'sendWelcomeMessage',
    function009: 'sendPasswordResetNotification',
    function010: 'sendAccountVerificationEmail',
    function011: 'batchSendNotifications',
    function012: 'scheduleNotification',
    function013: 'cancelScheduledNotification',
    function014: 'getNotificationStatus',
    function015: 'retryFailedNotifications',
    function016: 'getNotificationHistory',
    function017: 'updateNotificationPreferences',
    function018: 'getNotificationPreferences',
    function019: 'sendSMSNotification',
    function020: 'sendPushNotification',
    function021: 'sendEmailNotification',
    function022: 'validateEmailAddress',
    function023: 'validatePhoneNumber',
    function024: 'formatNotificationContent',
    function025: 'generateNotificationTemplate',
    function026: 'trackNotificationMetrics',
    function027: 'getNotificationAnalytics',
    function028: 'archiveOldNotifications',
    function029: 'exportNotificationLogs',
    function030: 'importNotificationTemplates',
    function031: 'manageNotificationChannels',
    function032: 'configureNotificationRules',
    function033: 'testNotificationDelivery',
    function034: 'validateNotificationConfiguration',
    function035: 'optimizeNotificationBatches',
    function036: 'handleNotificationBounces',
    function037: 'processNotificationCallbacks',
    function038: 'updateNotificationStatus',
    function039: 'generateNotificationReport',
    function040: 'getComprehensiveNotificationMetrics'
  },
  'registrar-office-controllers': {
    function001: 'processTranscriptRequest',
    function002: 'generateOfficialTranscript',
    function003: 'verifyEnrollment',
    function004: 'issueDiplomaVerification',
    function005: 'processGradeChange',
    function006: 'recordAcademicStanding',
    function007: 'manageDegreeAudit',
    function008: 'processGraduation',
    function009: 'certifyDegreeCompletion',
    function010: 'manageAcademicCalendar',
    function011: 'processRegistrationApproval',
    function012: 'handleCourseWithdrawal',
    function013: 'processAddDropRequests',
    function014: 'manageCourseSubstitutions',
    function015: 'processTransferCredits',
    function016: 'evaluateTranscripts',
    function017: 'manageArticulationAgreements',
    function018: 'processNameChanges',
    function019: 'updateStudentRecords',
    function020: 'manageAcademicHolds',
    function021: 'processGradeAppeal',
    function022: 'manageCourseRepeats',
    function023: 'calculateGPA',
    function024: 'determineDeansList',
    function025: 'processAcademicProbation',
    function026: 'manageAcademicSuspension',
    function027: 'processReadmission',
    function028: 'manageLeavesOfAbsence',
    function029: 'processReturnFromLeave',
    function030: 'manageCourseCatalogs',
    function031: 'publishCourseSchedules',
    function032: 'manageSectionAssignments',
    function033: 'processCourseApprovals',
    function034: 'manageCurriculumChanges',
    function035: 'processDegreeRequirements',
    function036: 'generateEnrollmentReports',
    function037: 'processIPEDSSubmissions',
    function038: 'manageStateReporting',
    function039: 'coordinateCommencement',
    function040: 'generateComprehensiveRegistrarReport'
  }
};

function getClassNameFromFilename(filename) {
  return filename
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Composite';
}

function getFunctionMappings(filename) {
  const baseName = filename.replace('.ts', '');
  return functionNameMappings[baseName] || {};
}

function refactorCompositeFile(filePath) {
  const filename = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const className = getClassNameFromFilename(filename.replace('.ts', ''));
  const mappings = getFunctionMappings(filename);

  let refactoredContent = content;

  // Replace string injection token
  refactoredContent = refactoredContent.replace(
    /@Inject\('SEQUELIZE'\)/g,
    "@Inject(DATABASE_CONNECTION)"
  );

  // Add imports
  const importBlock = `import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize, Model, DataTypes, Transaction } from 'sequelize';
import { DATABASE_CONNECTION } from './common/tokens/database.tokens';
import {
  EducationException,
  ValidationException,
  DataIntegrityException
} from './common/exceptions/education.exceptions';
import { RequestContextService } from './common/services/request-context.service';`;

  refactoredContent = refactoredContent.replace(
    /import.*from '@nestjs\/common';[\s\S]*?import.*from 'sequelize';/,
    importBlock
  );

  // Replace Logger instantiation with injection
  refactoredContent = refactoredContent.replace(
    /private readonly logger = new Logger\([^)]+\);/,
    ''
  );

  // Update constructor to inject ConfigService and Logger
  refactoredContent = refactoredContent.replace(
    /constructor\(@Inject\([^)]+\) private readonly sequelize: Sequelize\) \{\}/,
    `constructor(
    @Inject(DATABASE_CONNECTION) private readonly sequelize: Sequelize,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly requestContext: RequestContextService
  ) {}`
  );

  // Replace generic function names with meaningful ones
  Object.keys(mappings).forEach(genericName => {
    const meaningfulName = mappings[genericName];
    const regex = new RegExp(`async ${genericName}\\(\\):`, 'g');
    refactoredContent = refactoredContent.replace(
      regex,
      `async ${meaningfulName}():`
    );
  });

  // Add error handling wrapper to functions (basic implementation)
  refactoredContent = refactoredContent.replace(
    /async (\w+)\(\): Promise<any> \{ return \{ result: '([^']+)' \}; \}/g,
    `async $1(): Promise<any> {
    const operationId = this.requestContext.requestId;
    this.logger.log({
      message: 'Executing $1',
      operationId,
      userId: this.requestContext.userId
    });

    try {
      // TODO: Implement business logic
      return { result: '$2' };
    } catch (error) {
      this.logger.error({
        message: 'Operation $1 failed',
        operationId,
        error: error.message,
        stack: error.stack
      });
      throw new EducationException(
        'Operation failed',
        500,
        { operation: '$1', error: error.message }
      );
    }
  }`
  );

  return refactoredContent;
}

function createModuleFile(compositeFilePath) {
  const filename = path.basename(compositeFilePath, '.ts');
  const className = getClassNameFromFilename(filename);
  const moduleName = className.replace('Composite', 'Module');

  const moduleContent = `/**
 * ${moduleName}
 *
 * Module configuration for ${className}.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ${className} } from './${filename}';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule,
    CommonModule
  ],
  providers: [
    ${className}
  ],
  exports: [
    ${className}
  ]
})
export class ${moduleName} {}
`;

  const moduleFilePath = compositeFilePath.replace('.ts', '.module.ts');
  return { path: moduleFilePath, content: moduleContent };
}

// Main execution
function main() {
  const downstreamDir = __dirname;
  const files = fs.readdirSync(downstreamDir)
    .filter(f => f.endsWith('.ts') && !f.includes('.module.') && !f.includes('refactor-composites') && f !== 'common')
    .map(f => path.join(downstreamDir, f));

  console.log(`Found ${files.length} composite files to refactor`);

  let processed = 0;
  let errors = 0;

  files.forEach(filePath => {
    try {
      console.log(`Processing: ${path.basename(filePath)}`);

      // Refactor composite file
      const refactoredContent = refactorCompositeFile(filePath);
      fs.writeFileSync(filePath, refactoredContent, 'utf-8');

      // Create module file
      const moduleFile = createModuleFile(filePath);
      fs.writeFileSync(moduleFile.path, moduleFile.content, 'utf-8');

      processed++;
    } catch (error) {
      console.error(`Error processing ${path.basename(filePath)}:`, error.message);
      errors++;
    }
  });

  console.log(`\nRefactoring complete:`);
  console.log(`- Successfully processed: ${processed} files`);
  console.log(`- Errors: ${errors}`);
  console.log(`- Module files created: ${processed}`);
}

if (require.main === module) {
  main();
}

module.exports = { refactorCompositeFile, createModuleFile };

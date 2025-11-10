# Regulatory Filing Submission Kit - Usage Guide

## Quick Start Examples

### Example 1: Basic Filing Generation and Submission

```typescript
import {
  generateFilingForm,
  createFilingFromTemplate,
  validateFilingData,
  submitFilingElectronically,
  trackSubmissionProgress,
} from './regulatory-filing-submission-kit';

async function submitSEC10K() {
  // Step 1: Generate template
  const template = generateFilingForm('SEC', 'SEC_10K', '1.0');

  // Step 2: Create filing from template
  const filing = createFilingFromTemplate(template, {
    entityName: 'Acme Corporation',
    entityId: 'CIK0000789019',
    reportingPeriod: '2023-12-31',
    preparerName: 'John Doe',
    preparerEmail: 'john@example.com',
    auditorName: 'Ernst & Young',
    auditorOpinion: 'unqualified',
  });

  // Step 3: Validate filing
  const validation = validateFilingData(filing, template);
  if (!validation.isValid) {
    console.error('Filing validation failed:', validation.errors);
    return;
  }

  console.log(`Filing is ${validation.completionPercentage}% complete`);

  // Step 4: Submit electronically
  const submission = await submitFilingElectronically(
    filing,
    'https://www.sec.gov/api/submit',
    {
      username: 'filer_user',
      password: 'secure_password',
      clientId: 'myapp_client_123',
    }
  );

  console.log(`Filing submitted: ${submission.submissionId}`);

  // Step 5: Track progress
  const progress = await trackSubmissionProgress(
    submission.submissionId,
    'https://www.sec.gov/api/status'
  );

  console.log(`Current status: ${progress.status} (${progress.progress}%)`);

  return submission;
}
```

### Example 2: Multi-Jurisdiction Compliance Check

```typescript
import {
  generateFilingForm,
  createFilingFromTemplate,
  validateMultiJurisdictionFiling,
  mapFilingToJurisdiction,
} from './regulatory-filing-submission-kit';

async function submitToMultipleJurisdictions() {
  const template = generateFilingForm('SEC', 'SEC_10K');
  const baseFiling = createFilingFromTemplate(template, {
    entityName: 'Global Corporation Inc',
    entityId: 'CIK0000123456',
    reportingPeriod: '2023-12-31',
    preparerName: 'Jane Smith',
    preparerEmail: 'jane@example.com',
  });

  // Validate for multiple jurisdictions
  const jurisdictions = ['SEC', 'FCA', 'FINRA'];
  const jurisdictionRequirements = new Map();

  // Populate requirements (would come from config/database)
  jurisdictionRequirements.set('SEC', {
    jurisdiction: 'SEC',
    supportedFilingTypes: ['SEC_10K', 'SEC_10Q'],
    requiredFields: {
      SEC_10K: ['entityName', 'entityId', 'reportingPeriod', 'auditorName'],
    },
    submissionMethods: [
      {
        method: 'api' as const,
        endpoint: 'https://www.sec.gov/api/submit',
        authentication: 'oauth2' as const,
        isActive: true,
      },
    ],
    fileFormats: ['XML', 'JSON'],
    signatureRequired: true,
    encryptionRequired: true,
    deadline: '90 days after fiscal year end',
  });

  const validation = validateMultiJurisdictionFiling(
    baseFiling,
    jurisdictions,
    jurisdictionRequirements
  );

  // Check validation results per jurisdiction
  validation.forEach((result, jurisdiction) => {
    if (result.isValid) {
      console.log(`✓ ${jurisdiction}: Compliant`);
    } else {
      console.log(`✗ ${jurisdiction}: ${result.errors.join(', ')}`);
    }
  });

  // Map and submit to each jurisdiction
  for (const jurisdiction of jurisdictions) {
    const mapped = mapFilingToJurisdiction(
      baseFiling,
      'SEC',
      jurisdiction,
      jurisdictionRequirements
    );

    console.log(`Filing mapped for ${jurisdiction}: ${mapped.filingId}`);
  }
}
```

### Example 3: Handling Rejections and Resubmissions

```typescript
import {
  handleRejection,
  generateRejectionReport,
  generateCorrectionForm,
  createResubmissionWorkflow,
  createAmendment,
  submitAmendment,
} from './regulatory-filing-submission-kit';

async function handleFilingRejection(rejectionData, originalFilingId) {
  // Step 1: Process rejection
  const rejection = handleRejection(rejectionData, originalFilingId);

  // Step 2: Generate and print rejection report
  const report = generateRejectionReport(rejection);
  console.log(report);

  // Step 3: Generate correction form with guidance
  const originalFiling = { /* ... */ };
  const correctionForm = generateCorrectionForm(rejection, originalFiling);

  console.log('Fields requiring correction:');
  correctionForm.rejectedFields.forEach(field => {
    const correction = correctionForm.suggestedCorrections[field];
    console.log(`  ${field}:`);
    console.log(`    Current: ${correction.currentValue}`);
    console.log(`    Instruction: ${correction.instruction}`);
  });

  // Step 4: Create resubmission workflow
  const workflow = createResubmissionWorkflow(
    rejection.rejectionId,
    originalFilingId,
    3 // max 3 retry attempts
  );

  console.log(`Resubmission workflow created: ${workflow.workflowId}`);
  console.log(`Allowed resubmission date: ${rejection.allowedResubmissionDate}`);

  // Step 5: Make corrections and create amendment
  const correctedData = {
    ...correctionForm.suggestedCorrections,
    auditorName: 'Deloitte & Touche',
    netCapital: 5000000,
  };

  const amendment = createAmendment(
    originalFilingId,
    correctedData,
    'Corrected auditor information and recalculated net capital per rejection feedback'
  );

  console.log(`Amendment created: ${amendment.amendmentId}`);

  // Step 6: Submit amendment
  const amendmentResult = await submitAmendment(
    amendment,
    'https://www.sec.gov/api/submit',
    {
      username: 'filer_user',
      password: 'secure_password',
      clientId: 'myapp_client_123',
    }
  );

  console.log(`Amendment submitted: ${amendmentResult.submissionId}`);

  return { workflow, amendment, amendmentResult };
}
```

### Example 4: Batch Filing Operations

```typescript
import {
  createFilingFromTemplate,
  batchValidateFilings,
  batchSubmitFilings,
  generateBatchReport,
  generateFilingAnalytics,
} from './regulatory-filing-submission-kit';

async function batchSubmitQuarterlyFilings() {
  const filings = [
    {
      company: 'Acme Corp',
      cik: 'CIK0000789019',
      quarter: 'Q1',
    },
    {
      company: 'Tech Industries',
      cik: 'CIK0000456789',
      quarter: 'Q1',
    },
    {
      company: 'Finance Group',
      cik: 'CIK0000123456',
      quarter: 'Q1',
    },
  ];

  // Step 1: Generate template
  const template = generateFilingForm('SEC', 'SEC_10Q');

  // Step 2: Create filing objects
  const filingObjects = filings.map(f =>
    createFilingFromTemplate(template, {
      entityName: f.company,
      entityId: f.cik,
      reportingPeriod: '2024-03-31',
      preparerName: 'Compliance Officer',
      preparerEmail: 'compliance@company.com',
      financialStatements: true,
      mdAndA: true,
    })
  );

  // Step 3: Create batch
  const batch = {
    batchId: `BATCH_10Q_${Date.now()}`,
    jurisdiction: 'SEC',
    filingType: 'SEC_10Q',
    filings: filingObjects,
    status: 'pending' as const,
    successCount: 0,
    failureCount: 0,
    results: [],
  };

  // Step 4: Validate batch before submission
  const validationResults = batchValidateFilings(batch, template);

  let allValid = true;
  validationResults.forEach((result, filingId) => {
    if (!result.isValid) {
      console.error(`Filing ${filingId} validation failed:`);
      result.errors.forEach(error =>
        console.error(`  - ${error.field}: ${error.message}`)
      );
      allValid = false;
    } else {
      console.log(`✓ Filing ${filingId} validated (${result.completionPercentage}% complete)`);
    }
  });

  if (!allValid) {
    console.log('Batch validation failed. Aborting submission.');
    return;
  }

  // Step 5: Submit batch
  const submittedBatch = await batchSubmitFilings(
    batch,
    'https://www.sec.gov/api/submit',
    {
      username: 'batch_filer',
      password: 'secure_password',
      clientId: 'batch_app_456',
    }
  );

  // Step 6: Generate batch report
  const report = generateBatchReport(submittedBatch);

  console.log('\n' + report.summary);
  console.log('\nStatistics:');
  console.log(`  Total: ${report.statistics.totalFilings}`);
  console.log(`  Successful: ${report.statistics.successCount}`);
  console.log(`  Failed: ${report.statistics.failureCount}`);
  console.log(`  Success Rate: ${report.statistics.successRate}%`);

  console.log('\nDetailed Results:');
  report.details.forEach(detail => {
    const status = detail.status === 'success' ? '✓' : '✗';
    console.log(`  ${status} ${detail.filingId}: ${detail.status}`);
    if (detail.error) {
      console.log(`     Error: ${detail.error}`);
    }
  });

  return submittedBatch;
}
```

### Example 5: Deadline Management and Calendar

```typescript
import {
  calculateDeadlines,
  getUpcomingDeadlines,
  createRegulatoryCalendarEntry,
} from './regulatory-filing-submission-kit';

function manageRegulatoryCalendar() {
  // Step 1: Calculate deadlines for specific filing
  const deadlines = calculateDeadlines(
    'SEC',
    'SEC_10K',
    new Date('2023-12-31') // Fiscal year end
  );

  console.log('10-K Filing Deadlines:');
  console.log(`  Due: ${deadlines.dueDate.toISOString()}`);
  console.log(`  Warning: ${deadlines.warningDate.toISOString()}`);
  console.log(`  Critical: ${deadlines.criticalDate.toISOString()}`);

  // Step 2: Create calendar events
  const eventRepository = new Map();

  const q1Event = createRegulatoryCalendarEntry(
    {
      jurisdiction: 'SEC',
      eventType: 'quarterly_earnings',
      eventName: '2024 Q1 Earnings Release',
      eventDate: new Date('2024-04-15'),
      dueDate: new Date('2024-04-22'),
      relatedFilingTypes: ['SEC_10Q'],
      details: {
        fiscalQuarter: 'Q1',
        year: 2024,
      },
    },
    eventRepository
  );

  const q1Filing = createRegulatoryCalendarEntry(
    {
      jurisdiction: 'SEC',
      eventType: 'filing_deadline',
      eventName: '2024 Q1 10-Q Filing',
      eventDate: new Date('2024-05-15'),
      relatedFilingTypes: ['SEC_10Q'],
    },
    eventRepository
  );

  // Step 3: Get upcoming deadlines
  const upcomingEvents = getUpcomingDeadlines(
    'SEC',
    90, // Next 90 days
    eventRepository
  );

  console.log('\nUpcoming Events (Next 90 Days):');
  upcomingEvents.forEach(event => {
    console.log(`  ${event.eventDate.toISOString()} - ${event.eventName}`);
    if (event.dueDate) {
      console.log(`    Due: ${event.dueDate.toISOString()}`);
    }
  });

  return { deadlines, eventRepository };
}
```

### Example 6: Format Conversion and Distribution

```typescript
import {
  convertToXML,
  convertToJSON,
  convertToCSV,
} from './regulatory-filing-submission-kit';

function distributeFilingInMultipleFormats() {
  const filing = {
    filingId: 'FIL_SEC_10K_ABC123',
    jurisdiction: 'SEC',
    filingType: 'SEC_10K' as const,
    submissionDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    data: {
      entityName: 'Acme Corporation',
      entityId: 'CIK0000789019',
      reportingPeriod: '2023-12-31',
      totalAssets: 1000000000,
      totalRevenue: 500000000,
      netIncome: 50000000,
    },
  };

  // Convert to XML for archival
  const xmlOutput = convertToXML(filing);
  console.log('=== XML Format ===');
  console.log(xmlOutput.substring(0, 200) + '...');

  // Convert to JSON for API transmission
  const jsonOutput = convertToJSON(filing);
  console.log('\n=== JSON Format ===');
  console.log(jsonOutput.substring(0, 200) + '...');

  // Convert multiple filings to CSV for reporting
  const filings = [
    filing,
    { ...filing, filingId: 'FIL_SEC_10K_DEF456', data: { ...filing.data, entityName: 'TechCorp' } },
    { ...filing, filingId: 'FIL_SEC_10K_GHI789', data: { ...filing.data, entityName: 'FinanceInc' } },
  ];

  const csvOutput = convertToCSV(filings, [
    'entityName',
    'entityId',
    'totalAssets',
    'totalRevenue',
    'netIncome',
  ]);

  console.log('\n=== CSV Format (Spreadsheet) ===');
  console.log(csvOutput.split('\n').slice(0, 4).join('\n'));
}
```

### Example 7: Digital Signatures and Authentication

```typescript
import {
  signFiling,
  verifySignature,
  generateSignatureToken,
} from './regulatory-filing-submission-kit';
import { generateKeyPairSync } from 'crypto';

function manageFilingSignatures() {
  // Generate RSA key pair for demonstration
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  const filing = {
    filingId: 'FIL_SEC_10K_SIG001',
    jurisdiction: 'SEC',
    filingType: 'SEC_10K' as const,
    submissionDate: new Date(),
    dueDate: new Date(),
    data: {
      entityName: 'SignedCorp',
      entityId: 'CIK0000999999',
      reportingPeriod: '2023-12-31',
      preparerName: 'Alice Johnson',
      preparerEmail: 'alice@company.com',
    },
  };

  // Step 1: Sign the filing
  const signature = signFiling(filing, privateKey as any, 'alice@company.com');

  console.log('Filing Signed:');
  console.log(`  Signature ID: ${signature.signatureId}`);
  console.log(`  Signed By: ${signature.signedBy}`);
  console.log(`  Algorithm: ${signature.algorithm}`);
  console.log(`  Timestamp: ${signature.signedAt}`);

  // Step 2: Verify the signature
  const verification = verifySignature(signature, filing, publicKey as any);

  if (verification.isValid) {
    console.log('\n✓ Signature verification successful');
  } else {
    console.log('\n✗ Signature verification failed:', verification.error);
  }

  // Step 3: Generate authentication token
  const token = generateSignatureToken(filing, 'shared_secret_key_123');

  console.log('\nAuthentication Token Generated:');
  console.log(`  Token: ${token.token.substring(0, 20)}...`);
  console.log(`  Expires: ${token.expiresAt}`);
  console.log(`  Algorithm: ${token.algorithm}`);
}
```

### Example 8: Filing Analytics and Compliance Reporting

```typescript
import {
  generateFilingAnalytics,
  getComplianceMetrics,
} from './regulatory-filing-submission-kit';

function analyzeFilingPerformance() {
  // Simulate filing repository with historical data
  const filingRepository = new Map();
  const statusRepository = new Map();

  // Add sample data
  for (let i = 0; i < 20; i++) {
    const filingId = `FIL_SEC_10Q_${i}`;

    filingRepository.set(filingId, {
      filingId,
      jurisdiction: 'SEC',
      filingType: 'SEC_10Q',
      submissionDate: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - (i * 7 - 30) * 24 * 60 * 60 * 1000),
      data: { /* ... */ },
    });

    statusRepository.set(filingId, {
      filingId,
      status: i < 5 ? 'draft' : i < 15 ? 'accepted' : 'rejected',
      amendments: [],
      lastUpdated: new Date(),
    });
  }

  // Generate analytics for current period
  const analytics = generateFilingAnalytics('2024-11', filingRepository);

  console.log('Filing Analytics - November 2024:');
  console.log(`  Total Filings: ${analytics.totalFilings}`);
  console.log(`  Successful: ${analytics.successfulFilings}`);
  console.log(`  Rejected: ${analytics.rejectedFilings}`);
  console.log(`  Amended: ${analytics.amendedFilings}`);
  console.log(`  Compliance Rate: ${analytics.complianceRate.toFixed(2)}%`);

  // Get compliance metrics
  const metrics = getComplianceMetrics(filingRepository, statusRepository);

  console.log('\nCompliance Metrics:');
  console.log(`  On-Time Filing Rate: ${metrics.onTimeFilingRate.toFixed(2)}%`);
  console.log(`  Acceptance Rate: ${metrics.acceptanceRate.toFixed(2)}%`);
  console.log(`  Amendment Rate: ${metrics.amendmentRate.toFixed(2)}%`);
  console.log(`  Rejection Rate: ${metrics.rejectionRate.toFixed(2)}%`);
  console.log(`  Avg Correction Time: ${metrics.averageCorrectionTime} days`);

  return { analytics, metrics };
}
```

## Common Patterns

### Pattern 1: Complete Filing Lifecycle

```typescript
// 1. Create
const filing = createFilingFromTemplate(template, data);

// 2. Validate
const validation = validateFilingData(filing, template);

// 3. Preview (optional)
const preview = generateFilingPreview(filing, 'text');

// 4. Sign
const signature = signFiling(filing, privateKey, signerName);

// 5. Submit
const result = await submitFilingElectronically(filing, endpoint, credentials);

// 6. Track
const status = await trackSubmissionProgress(result.submissionId, endpoint);

// 7. Manage (track status, handle acknowledgments)
const filingStatus = updateFilingStatus(filing.filingId, 'submitted', statusRepo);
```

### Pattern 2: Error Recovery with Retry

```typescript
try {
  const result = await submitFilingElectronically(filing, endpoint, credentials);
} catch (error) {
  // Automatic retry with exponential backoff
  const retryResult = await retryFailedSubmission(
    filing,
    endpoint,
    credentials,
    3 // Max 3 attempts
  );

  if (!retryResult.success) {
    console.error(`Failed after ${retryResult.attempts} attempts: ${retryResult.error}`);
  }
}
```

### Pattern 3: Data Repository Management

```typescript
const statusRepository = new Map<string, FilingStatus>();
const historyRepository = new Map<string, SubmissionHistoryEntry[]>();
const amendmentRepository = new Map<string, AmendmentRecord>();

// Add status
updateFilingStatus(filingId, 'submitted', statusRepository);

// Track history
getSubmissionHistory(filingId, historyRepository);

// Track amendments
trackAmendmentStatus(amendmentId, amendmentRepository);
```

## Error Handling Strategy

All functions include comprehensive error handling:

```typescript
try {
  // Call any function
  const result = validateFilingData(filing, template);

  if (!result.isValid) {
    result.errors.forEach(error => {
      console.error(`${error.severity}: ${error.field} - ${error.message}`);
    });
  }
} catch (error) {
  // Handle unexpected errors
  console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
}
```

## Testing Considerations

```typescript
// Use dependency injection for testing
const mockStatusRepository = new Map();
const mockEventRepository = new Map();

// Test with mock repositories
const status = getFilingStatus(testFilingId, mockStatusRepository);
const deadlines = getUpcomingDeadlines('SEC', 30, mockEventRepository);

// Assertions
expect(status).toBeDefined();
expect(deadlines.length).toBeGreaterThanOrEqual(0);
```

## Production Deployment

1. **Secure Credentials:** Store endpoint URLs and credentials in environment variables
2. **Repository Management:** Use database-backed repositories instead of Maps
3. **Logging:** Add comprehensive logging around all submissions and status changes
4. **Monitoring:** Track metrics for performance and compliance
5. **Audit Trail:** Maintain complete submission history for regulatory compliance
6. **Error Alerting:** Set up alerts for rejected filings and failed submissions

## Integration with Backend Services

```typescript
// In your NestJS controller
@Post('/filings/submit')
async submitFiling(@Body() filingData: FilingDataDTO) {
  const template = this.filingService.getTemplate(filingData.jurisdiction);
  const filing = createFilingFromTemplate(template, filingData);

  const validation = validateFilingData(filing, template);
  if (!validation.isValid) {
    throw new BadRequestException(validation.errors);
  }

  const result = await submitFilingElectronically(
    filing,
    this.config.regulatoryEndpoint,
    this.config.credentials
  );

  await this.filingRepository.save({
    ...filing,
    submissionId: result.submissionId,
    status: 'submitted',
  });

  return result;
}
```

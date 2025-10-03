describe('Health Records Portal - Screenings and Data Import/Export (Tests 101-150)', () => {
  beforeEach(() => {
    cy.login('nurse@school.edu', 'password123');
    cy.visit('/health-records');
    cy.wait('@getStudents');
    cy.get('[data-testid="student-card"]').first().click();
    cy.wait('@getHealthRecord');
  });

  describe('Vision Screening Tests (Tests 101-110)', () => {
    beforeEach(() => {
      cy.get('[data-testid="screenings-tab"]').click();
      cy.wait('@getScreenings');
      cy.get('[data-testid="vision-screening-section"]').should('be.visible');
    });

    it('Test 101: Should display vision screening section with proper layout', () => {
      cy.get('[data-testid="vision-screening-title"]').should('contain', 'Vision Screening');
      cy.get('[data-testid="add-vision-screening-btn"]').should('be.visible');
      cy.get('[data-testid="vision-screening-history"]').should('be.visible');
      cy.get('[data-testid="vision-screening-chart"]').should('be.visible');
      cy.get('[data-testid="last-screening-date"]').should('be.visible');
      cy.get('[data-testid="next-screening-due"]').should('be.visible');
    });

    it('Test 102: Should open add vision screening modal', () => {
      cy.get('[data-testid="add-vision-screening-btn"]').click();
      cy.get('[data-testid="vision-screening-modal"]').should('be.visible');
      cy.get('[data-testid="modal-title"]').should('contain', 'Add Vision Screening');
      cy.get('[data-testid="screening-date-input"]').should('be.visible');
      cy.get('[data-testid="right-eye-acuity-input"]').should('be.visible');
      cy.get('[data-testid="left-eye-acuity-input"]').should('be.visible');
      cy.get('[data-testid="binocular-acuity-input"]').should('be.visible');
      cy.get('[data-testid="color-vision-test"]').should('be.visible');
      cy.get('[data-testid="screening-notes-input"]').should('be.visible');
    });

    it('Test 103: Should successfully add new vision screening', () => {
      cy.intercept('POST', '/api/students/*/screenings/vision', {
        statusCode: 201,
        body: {
          id: 'vision-screening-1',
          date: '2024-09-15',
          rightEyeAcuity: '20/20',
          leftEyeAcuity: '20/25',
          binocularAcuity: '20/20',
          colorVision: 'Normal',
          result: 'Pass',
          notes: 'Normal vision screening'
        }
      }).as('createVisionScreening');

      cy.get('[data-testid="add-vision-screening-btn"]').click();
      cy.get('[data-testid="screening-date-input"]').type('2024-09-15');
      cy.get('[data-testid="right-eye-acuity-input"]').type('20/20');
      cy.get('[data-testid="left-eye-acuity-input"]').type('20/25');
      cy.get('[data-testid="binocular-acuity-input"]').type('20/20');
      cy.get('[data-testid="color-vision-select"]').select('Normal');
      cy.get('[data-testid="screening-notes-input"]').type('Normal vision screening');
      cy.get('[data-testid="save-screening-btn"]').click();

      cy.wait('@createVisionScreening');
      cy.get('[data-testid="success-toast"]').should('contain', 'Vision screening added successfully');
    });

    it('Test 104: Should validate vision screening form inputs', () => {
      cy.get('[data-testid="add-vision-screening-btn"]').click();
      cy.get('[data-testid="right-eye-acuity-input"]').type('20/invalid');
      cy.get('[data-testid="left-eye-acuity-input"]').type('invalid/20');
      cy.get('[data-testid="save-screening-btn"]').click();

      cy.get('[data-testid="right-eye-error"]').should('contain', 'Invalid acuity format');
      cy.get('[data-testid="left-eye-error"]').should('contain', 'Invalid acuity format');
      cy.get('[data-testid="screening-date-error"]').should('contain', 'Screening date is required');
    });

    it('Test 105: Should display vision screening history', () => {
      cy.fixture('visionScreenings').then((screenings) => {
        cy.intercept('GET', '/api/students/*/screenings/vision', { body: screenings }).as('getVisionScreenings');
        cy.reload();
        cy.get('[data-testid="screenings-tab"]').click();
        cy.wait('@getVisionScreenings');

        cy.get('[data-testid="vision-screening-record"]').should('have.length', screenings.length);
        
        screenings.forEach((screening, index) => {
          cy.get('[data-testid="vision-screening-record"]').eq(index).within(() => {
            cy.get('[data-testid="screening-date"]').should('contain', screening.date);
            cy.get('[data-testid="right-eye-result"]').should('contain', screening.rightEyeAcuity);
            cy.get('[data-testid="left-eye-result"]').should('contain', screening.leftEyeAcuity);
            cy.get('[data-testid="screening-result"]').should('contain', screening.result);
          });
        });
      });
    });

    it('Test 106: Should edit existing vision screening', () => {
      cy.fixture('visionScreenings').then((screenings) => {
        const screening = screenings[0];
        cy.intercept('PUT', `/api/students/*/screenings/vision/${screening.id}`, {
          statusCode: 200,
          body: { ...screening, notes: 'Updated screening notes' }
        }).as('updateVisionScreening');

        cy.get('[data-testid="vision-screening-record"]').first().within(() => {
          cy.get('[data-testid="edit-screening-btn"]').click();
        });

        cy.get('[data-testid="vision-screening-modal"]').should('be.visible');
        cy.get('[data-testid="screening-notes-input"]').clear().type('Updated screening notes');
        cy.get('[data-testid="save-screening-btn"]').click();

        cy.wait('@updateVisionScreening');
        cy.get('[data-testid="success-toast"]').should('contain', 'Vision screening updated successfully');
      });
    });

    it('Test 107: Should display vision screening chart', () => {
      cy.get('[data-testid="vision-screening-chart"]').should('be.visible');
      cy.get('.recharts-line-chart').should('be.visible');
      cy.get('[data-testid="right-eye-line"]').should('be.visible');
      cy.get('[data-testid="left-eye-line"]').should('be.visible');
      cy.get('[data-testid="chart-legend"]').should('contain', 'Visual Acuity');
    });

    it('Test 108: Should flag abnormal vision screening results', () => {
      cy.fixture('visionScreenings').then((screenings) => {
        const abnormalScreening = {
          ...screenings[0],
          rightEyeAcuity: '20/200',
          leftEyeAcuity: '20/400',
          result: 'Refer'
        };

        cy.get('[data-testid="vision-screening-record"]').first().within(() => {
          cy.get('[data-testid="screening-result"]').should('have.class', 'result-refer');
          cy.get('[data-testid="alert-icon"]').should('be.visible');
          cy.get('[data-testid="referral-required"]').should('be.visible');
        });
      });
    });

    it('Test 109: Should generate vision screening report', () => {
      cy.intercept('GET', '/api/students/*/screenings/vision/report', {
        statusCode: 200,
        body: { reportUrl: '/reports/vision-screening-report.pdf' }
      }).as('generateVisionReport');

      cy.get('[data-testid="generate-vision-report-btn"]').click();
      cy.get('[data-testid="report-options-modal"]').should('be.visible');
      cy.get('[data-testid="include-history-checkbox"]').check();
      cy.get('[data-testid="include-chart-checkbox"]').check();
      cy.get('[data-testid="generate-report-btn"]').click();

      cy.wait('@generateVisionReport');
      cy.get('[data-testid="download-report-btn"]').should('be.visible');
    });

    it('Test 110: Should schedule follow-up vision screening', () => {
      cy.intercept('POST', '/api/students/*/screenings/vision/schedule', {
        statusCode: 201,
        body: { id: 'scheduled-vision', scheduledDate: '2024-12-15' }
      }).as('scheduleVisionScreening');

      cy.get('[data-testid="schedule-followup-btn"]').click();
      cy.get('[data-testid="schedule-modal"]').should('be.visible');
      cy.get('[data-testid="follow-up-date-input"]').type('2024-12-15');
      cy.get('[data-testid="follow-up-reason-select"]').select('Annual Screening');
      cy.get('[data-testid="confirm-schedule-btn"]').click();

      cy.wait('@scheduleVisionScreening');
      cy.get('[data-testid="success-toast"]').should('contain', 'Follow-up vision screening scheduled');
    });
  });

  describe('Hearing Screening Tests (Tests 111-120)', () => {
    beforeEach(() => {
      cy.get('[data-testid="screenings-tab"]').click();
      cy.wait('@getScreenings');
      cy.get('[data-testid="hearing-screening-section"]').should('be.visible');
    });

    it('Test 111: Should display hearing screening section with proper layout', () => {
      cy.get('[data-testid="hearing-screening-title"]').should('contain', 'Hearing Screening');
      cy.get('[data-testid="add-hearing-screening-btn"]').should('be.visible');
      cy.get('[data-testid="hearing-screening-history"]').should('be.visible');
      cy.get('[data-testid="audiogram-chart"]').should('be.visible');
      cy.get('[data-testid="last-hearing-test"]').should('be.visible');
    });

    it('Test 112: Should open add hearing screening modal', () => {
      cy.get('[data-testid="add-hearing-screening-btn"]').click();
      cy.get('[data-testid="hearing-screening-modal"]').should('be.visible');
      cy.get('[data-testid="modal-title"]').should('contain', 'Add Hearing Screening');
      cy.get('[data-testid="screening-date-input"]').should('be.visible');
      cy.get('[data-testid="test-type-select"]').should('be.visible');
      cy.get('[data-testid="right-ear-results"]').should('be.visible');
      cy.get('[data-testid="left-ear-results"]').should('be.visible');
      cy.get('[data-testid="background-noise-level"]').should('be.visible');
    });

    it('Test 113: Should successfully add audiometry screening', () => {
      cy.intercept('POST', '/api/students/*/screenings/hearing', {
        statusCode: 201,
        body: {
          id: 'hearing-screening-1',
          date: '2024-09-15',
          testType: 'Pure Tone Audiometry',
          rightEarResults: { '500Hz': 15, '1000Hz': 20, '2000Hz': 25, '4000Hz': 30 },
          leftEarResults: { '500Hz': 20, '1000Hz': 25, '2000Hz': 20, '4000Hz': 35 },
          result: 'Pass'
        }
      }).as('createHearingScreening');

      cy.get('[data-testid="add-hearing-screening-btn"]').click();
      cy.get('[data-testid="screening-date-input"]').type('2024-09-15');
      cy.get('[data-testid="test-type-select"]').select('Pure Tone Audiometry');
      
      // Right ear frequencies
      cy.get('[data-testid="right-500hz-input"]').type('15');
      cy.get('[data-testid="right-1000hz-input"]').type('20');
      cy.get('[data-testid="right-2000hz-input"]').type('25');
      cy.get('[data-testid="right-4000hz-input"]').type('30');
      
      // Left ear frequencies
      cy.get('[data-testid="left-500hz-input"]').type('20');
      cy.get('[data-testid="left-1000hz-input"]').type('25');
      cy.get('[data-testid="left-2000hz-input"]').type('20');
      cy.get('[data-testid="left-4000hz-input"]').type('35');
      
      cy.get('[data-testid="save-screening-btn"]').click();

      cy.wait('@createHearingScreening');
      cy.get('[data-testid="success-toast"]').should('contain', 'Hearing screening added successfully');
    });

    it('Test 114: Should validate hearing test threshold values', () => {
      cy.get('[data-testid="add-hearing-screening-btn"]').click();
      cy.get('[data-testid="right-500hz-input"]').type('200'); // Invalid threshold
      cy.get('[data-testid="left-1000hz-input"]').type('-10'); // Invalid threshold
      cy.get('[data-testid="save-screening-btn"]').click();

      cy.get('[data-testid="right-500hz-error"]').should('contain', 'Threshold must be between 0 and 120 dB');
      cy.get('[data-testid="left-1000hz-error"]').should('contain', 'Threshold must be between 0 and 120 dB');
    });

    it('Test 115: Should display audiogram visualization', () => {
      cy.get('[data-testid="audiogram-chart"]').should('be.visible');
      cy.get('.recharts-line-chart').should('be.visible');
      cy.get('[data-testid="right-ear-line"]').should('be.visible');
      cy.get('[data-testid="left-ear-line"]').should('be.visible');
      cy.get('[data-testid="frequency-axis"]').should('contain', 'Hz');
      cy.get('[data-testid="threshold-axis"]').should('contain', 'dB HL');
    });

    it('Test 116: Should perform tympanometry test', () => {
      cy.intercept('POST', '/api/students/*/screenings/tympanometry', {
        statusCode: 201,
        body: {
          id: 'tympanometry-1',
          date: '2024-09-15',
          rightEarCompliance: 0.8,
          leftEarCompliance: 0.9,
          rightEarPressure: -25,
          leftEarPressure: -15,
          result: 'Normal'
        }
      }).as('createTympanometry');

      cy.get('[data-testid="tympanometry-tab"]').click();
      cy.get('[data-testid="add-tympanometry-btn"]').click();
      cy.get('[data-testid="tympanometry-modal"]').should('be.visible');
      
      cy.get('[data-testid="right-compliance-input"]').type('0.8');
      cy.get('[data-testid="left-compliance-input"]').type('0.9');
      cy.get('[data-testid="right-pressure-input"]').type('-25');
      cy.get('[data-testid="left-pressure-input"]').type('-15');
      cy.get('[data-testid="save-tympanometry-btn"]').click();

      cy.wait('@createTympanometry');
      cy.get('[data-testid="success-toast"]').should('contain', 'Tympanometry test added successfully');
    });

    it('Test 117: Should flag hearing screening referrals', () => {
      cy.fixture('hearingScreenings').then((screenings) => {
        const referralScreening = {
          ...screenings[0],
          rightEarResults: { '500Hz': 45, '1000Hz': 50, '2000Hz': 55, '4000Hz': 60 },
          result: 'Refer'
        };

        cy.get('[data-testid="hearing-screening-record"]').first().within(() => {
          cy.get('[data-testid="screening-result"]').should('have.class', 'result-refer');
          cy.get('[data-testid="referral-icon"]').should('be.visible');
          cy.get('[data-testid="audiologist-referral"]').should('be.visible');
        });
      });
    });

    it('Test 118: Should display hearing screening history with trends', () => {
      cy.get('[data-testid="hearing-history-chart"]').should('be.visible');
      cy.get('[data-testid="hearing-trend-analysis"]').should('be.visible');
      cy.get('[data-testid="threshold-changes"]').should('be.visible');
      cy.get('[data-testid="hearing-stability-indicator"]').should('be.visible');
    });

    it('Test 119: Should export audiogram data', () => {
      cy.intercept('GET', '/api/students/*/screenings/hearing/export', {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: { audiogramData: 'exported-data' }
      }).as('exportAudiogram');

      cy.get('[data-testid="export-audiogram-btn"]').click();
      cy.get('[data-testid="export-format-select"]').select('JSON');
      cy.get('[data-testid="confirm-export-btn"]').click();

      cy.wait('@exportAudiogram');
      cy.get('[data-testid="download-audiogram-btn"]').should('be.visible');
    });

    it('Test 120: Should schedule hearing re-screening', () => {
      cy.intercept('POST', '/api/students/*/screenings/hearing/reschedule', {
        statusCode: 201,
        body: { id: 'scheduled-hearing', scheduledDate: '2024-11-15' }
      }).as('scheduleHearingRescreen');

      cy.get('[data-testid="schedule-rescreen-btn"]').click();
      cy.get('[data-testid="rescreen-modal"]').should('be.visible');
      cy.get('[data-testid="rescreen-date-input"]').type('2024-11-15');
      cy.get('[data-testid="rescreen-reason-select"]').select('Follow-up');
      cy.get('[data-testid="confirm-rescreen-btn"]').click();

      cy.wait('@scheduleHearingRescreen');
      cy.get('[data-testid="success-toast"]').should('contain', 'Hearing re-screening scheduled');
    });
  });

  describe('Data Import Functionality (Tests 121-130)', () => {
    beforeEach(() => {
      cy.get('[data-testid="import-export-tab"]').click();
      cy.get('[data-testid="import-section"]').should('be.visible');
    });

    it('Test 121: Should display data import section with options', () => {
      cy.get('[data-testid="import-title"]').should('contain', 'Import Health Records');
      cy.get('[data-testid="import-file-input"]').should('be.visible');
      cy.get('[data-testid="import-format-select"]').should('be.visible');
      cy.get('[data-testid="import-template-download"]').should('be.visible');
      cy.get('[data-testid="import-validation-rules"]').should('be.visible');
    });

    it('Test 122: Should download import template', () => {
      cy.intercept('GET', '/api/health-records/import/template', {
        statusCode: 200,
        headers: { 'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      }).as('downloadTemplate');

      cy.get('[data-testid="import-format-select"]').select('Excel');
      cy.get('[data-testid="download-template-btn"]').click();

      cy.wait('@downloadTemplate');
      cy.get('[data-testid="success-toast"]').should('contain', 'Template downloaded successfully');
    });

    it('Test 123: Should validate CSV file format before upload', () => {
      cy.fixture('invalid-health-records.csv', 'base64').then((fileContent) => {
        cy.get('[data-testid="import-file-input"]').selectFile({
          contents: Cypress.Buffer.from(fileContent, 'base64'),
          fileName: 'invalid-health-records.csv',
          mimeType: 'text/csv'
        });
      });

      cy.get('[data-testid="validate-file-btn"]').click();
      cy.get('[data-testid="validation-errors"]').should('be.visible');
      cy.get('[data-testid="error-count"]').should('contain', 'errors found');
      cy.get('[data-testid="validation-details"]').should('be.visible');
    });

    it('Test 124: Should successfully import valid health records CSV', () => {
      cy.intercept('POST', '/api/health-records/import', {
        statusCode: 200,
        body: {
          imported: 25,
          errors: 0,
          warnings: 2,
          details: { successfulRecords: 25, duplicates: 0 }
        }
      }).as('importHealthRecords');

      cy.fixture('valid-health-records.csv', 'base64').then((fileContent) => {
        cy.get('[data-testid="import-file-input"]').selectFile({
          contents: Cypress.Buffer.from(fileContent, 'base64'),
          fileName: 'valid-health-records.csv',
          mimeType: 'text/csv'
        });
      });

      cy.get('[data-testid="import-options-modal"]').should('be.visible');
      cy.get('[data-testid="duplicate-handling-select"]').select('Skip Duplicates');
      cy.get('[data-testid="validation-mode-select"]').select('Strict');
      cy.get('[data-testid="start-import-btn"]').click();

      cy.wait('@importHealthRecords');
      cy.get('[data-testid="import-success-modal"]').should('be.visible');
      cy.get('[data-testid="imported-count"]').should('contain', '25 records imported');
    });

    it('Test 125: Should import vaccination records from Excel', () => {
      cy.intercept('POST', '/api/vaccinations/import', {
        statusCode: 200,
        body: {
          imported: 15,
          errors: 1,
          warnings: 0,
          details: { invalidDates: 1 }
        }
      }).as('importVaccinations');

      cy.get('[data-testid="import-type-select"]').select('Vaccinations');
      cy.fixture('vaccination-records.xlsx', 'base64').then((fileContent) => {
        cy.get('[data-testid="import-file-input"]').selectFile({
          contents: Cypress.Buffer.from(fileContent, 'base64'),
          fileName: 'vaccination-records.xlsx',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
      });

      cy.get('[data-testid="start-import-btn"]').click();
      cy.wait('@importVaccinations');
      cy.get('[data-testid="import-results"]').should('contain', '15 vaccination records imported');
    });

    it('Test 126: Should handle import errors gracefully', () => {
      cy.intercept('POST', '/api/health-records/import', {
        statusCode: 400,
        body: {
          error: 'Invalid file format',
          details: 'File contains malformed data in rows 5, 12, 18'
        }
      }).as('importError');

      cy.fixture('malformed-data.csv', 'base64').then((fileContent) => {
        cy.get('[data-testid="import-file-input"]').selectFile({
          contents: Cypress.Buffer.from(fileContent, 'base64'),
          fileName: 'malformed-data.csv',
          mimeType: 'text/csv'
        });
      });

      cy.get('[data-testid="start-import-btn"]').click();
      cy.wait('@importError');
      cy.get('[data-testid="import-error-modal"]').should('be.visible');
      cy.get('[data-testid="error-details"]').should('contain', 'malformed data in rows');
    });

    it('Test 127: Should preview import data before processing', () => {
      cy.fixture('health-records-preview.csv', 'base64').then((fileContent) => {
        cy.get('[data-testid="import-file-input"]').selectFile({
          contents: Cypress.Buffer.from(fileContent, 'base64'),
          fileName: 'health-records-preview.csv',
          mimeType: 'text/csv'
        });
      });

      cy.get('[data-testid="preview-data-btn"]').click();
      cy.get('[data-testid="import-preview-modal"]').should('be.visible');
      cy.get('[data-testid="preview-table"]').should('be.visible');
      cy.get('[data-testid="preview-row"]').should('have.length.at.least', 1);
      cy.get('[data-testid="column-mapping"]').should('be.visible');
      cy.get('[data-testid="confirm-import-btn"]').should('be.visible');
    });

    it('Test 128: Should map columns during import process', () => {
      cy.get('[data-testid="column-mapping-section"]').should('be.visible');
      cy.get('[data-testid="source-column-select"]').first().select('Student ID');
      cy.get('[data-testid="target-field-select"]').first().select('studentId');
      cy.get('[data-testid="add-mapping-btn"]').click();
      
      cy.get('[data-testid="mapping-rule"]').should('be.visible');
      cy.get('[data-testid="remove-mapping-btn"]').should('be.visible');
      cy.get('[data-testid="mapping-preview"]').should('be.visible');
    });

    it('Test 129: Should import growth measurement data', () => {
      cy.intercept('POST', '/api/growth-measurements/import', {
        statusCode: 200,
        body: {
          imported: 30,
          errors: 0,
          warnings: 1,
          details: { outOfRangeMeasurements: 1 }
        }
      }).as('importGrowthData');

      cy.get('[data-testid="import-type-select"]').select('Growth Measurements');
      cy.fixture('growth-measurements.csv', 'base64').then((fileContent) => {
        cy.get('[data-testid="import-file-input"]').selectFile({
          contents: Cypress.Buffer.from(fileContent, 'base64'),
          fileName: 'growth-measurements.csv',
          mimeType: 'text/csv'
        });
      });

      cy.get('[data-testid="start-import-btn"]').click();
      cy.wait('@importGrowthData');
      cy.get('[data-testid="success-toast"]').should('contain', '30 growth measurements imported');
    });

    it('Test 130: Should track import history and status', () => {
      cy.get('[data-testid="import-history"]').should('be.visible');
      cy.get('[data-testid="import-job"]').should('exist');
      
      cy.get('[data-testid="import-job"]').first().within(() => {
        cy.get('[data-testid="job-filename"]').should('be.visible');
        cy.get('[data-testid="job-status"]').should('be.visible');
        cy.get('[data-testid="job-timestamp"]').should('be.visible');
        cy.get('[data-testid="job-records-count"]').should('be.visible');
        cy.get('[data-testid="view-job-details-btn"]').should('be.visible');
      });
    });
  });

  describe('Data Export Functionality (Tests 131-140)', () => {
    beforeEach(() => {
      cy.get('[data-testid="import-export-tab"]').click();
      cy.get('[data-testid="export-section"]').should('be.visible');
    });

    it('Test 131: Should display data export section with options', () => {
      cy.get('[data-testid="export-title"]').should('contain', 'Export Health Records');
      cy.get('[data-testid="export-type-select"]').should('be.visible');
      cy.get('[data-testid="export-format-select"]').should('be.visible');
      cy.get('[data-testid="date-range-selector"]').should('be.visible');
      cy.get('[data-testid="export-filters"]').should('be.visible');
      cy.get('[data-testid="export-preview-btn"]').should('be.visible');
    });

    it('Test 132: Should export all health records as CSV', () => {
      cy.intercept('POST', '/api/health-records/export', {
        statusCode: 200,
        body: {
          exportId: 'export-123',
          status: 'Processing',
          estimatedTime: '2 minutes'
        }
      }).as('startExport');

      cy.intercept('GET', '/api/exports/export-123/status', {
        statusCode: 200,
        body: {
          status: 'Completed',
          downloadUrl: '/api/exports/export-123/download'
        }
      }).as('checkExportStatus');

      cy.get('[data-testid="export-type-select"]').select('All Health Records');
      cy.get('[data-testid="export-format-select"]').select('CSV');
      cy.get('[data-testid="start-export-btn"]').click();

      cy.wait('@startExport');
      cy.get('[data-testid="export-progress-modal"]').should('be.visible');
      cy.wait('@checkExportStatus');
      cy.get('[data-testid="download-export-btn"]').should('be.visible');
    });

    it('Test 133: Should export filtered vaccination records', () => {
      cy.intercept('POST', '/api/vaccinations/export', {
        statusCode: 200,
        body: {
          exportId: 'vaccination-export-456',
          recordCount: 150,
          status: 'Completed'
        }
      }).as('exportVaccinations');

      cy.get('[data-testid="export-type-select"]').select('Vaccinations');
      cy.get('[data-testid="date-range-start"]').type('2024-01-01');
      cy.get('[data-testid="date-range-end"]').type('2024-12-31');
      cy.get('[data-testid="vaccination-status-filter"]').select('Completed');
      cy.get('[data-testid="start-export-btn"]').click();

      cy.wait('@exportVaccinations');
      cy.get('[data-testid="export-complete-modal"]').should('be.visible');
      cy.get('[data-testid="exported-count"]').should('contain', '150 vaccination records');
    });

    it('Test 134: Should export growth charts as Excel with charts', () => {
      cy.intercept('POST', '/api/growth-measurements/export', {
        statusCode: 200,
        body: {
          exportId: 'growth-export-789',
          includeCharts: true,
          format: 'Excel'
        }
      }).as('exportGrowthCharts');

      cy.get('[data-testid="export-type-select"]').select('Growth Measurements');
      cy.get('[data-testid="export-format-select"]').select('Excel');
      cy.get('[data-testid="include-charts-checkbox"]').check();
      cy.get('[data-testid="chart-types"]').within(() => {
        cy.get('[data-testid="height-chart-checkbox"]').check();
        cy.get('[data-testid="weight-chart-checkbox"]').check();
        cy.get('[data-testid="bmi-chart-checkbox"]').check();
      });
      cy.get('[data-testid="start-export-btn"]').click();

      cy.wait('@exportGrowthCharts');
      cy.get('[data-testid="success-toast"]').should('contain', 'Growth charts exported with visualizations');
    });

    it('Test 135: Should export screening results with compliance data', () => {
      cy.intercept('POST', '/api/screenings/export', {
        statusCode: 200,
        body: {
          exportId: 'screening-export-101',
          visionScreenings: 45,
          hearingScreenings: 38,
          complianceRate: '92%'
        }
      }).as('exportScreenings');

      cy.get('[data-testid="export-type-select"]').select('Screenings');
      cy.get('[data-testid="screening-types"]').within(() => {
        cy.get('[data-testid="vision-checkbox"]').check();
        cy.get('[data-testid="hearing-checkbox"]').check();
      });
      cy.get('[data-testid="include-compliance-checkbox"]').check();
      cy.get('[data-testid="start-export-btn"]').click();

      cy.wait('@exportScreenings');
      cy.get('[data-testid="export-summary"]').should('contain', 'Vision: 45, Hearing: 38');
    });

    it('Test 136: Should schedule automated exports', () => {
      cy.intercept('POST', '/api/exports/schedule', {
        statusCode: 201,
        body: {
          scheduleId: 'schedule-202',
          frequency: 'Monthly',
          nextRun: '2024-11-01'
        }
      }).as('scheduleExport');

      cy.get('[data-testid="schedule-export-btn"]').click();
      cy.get('[data-testid="schedule-modal"]').should('be.visible');
      cy.get('[data-testid="export-frequency-select"]').select('Monthly');
      cy.get('[data-testid="export-day-select"]').select('1st');
      cy.get('[data-testid="notification-email-input"]').type('nurse@school.edu');
      cy.get('[data-testid="save-schedule-btn"]').click();

      cy.wait('@scheduleExport');
      cy.get('[data-testid="success-toast"]').should('contain', 'Export scheduled successfully');
    });

    it('Test 137: Should export custom field selections', () => {
      cy.get('[data-testid="custom-fields-btn"]').click();
      cy.get('[data-testid="field-selector-modal"]').should('be.visible');
      
      cy.get('[data-testid="available-fields"]').within(() => {
        cy.get('[data-testid="field-student-id"]').check();
        cy.get('[data-testid="field-allergies"]').check();
        cy.get('[data-testid="field-medications"]').check();
        cy.get('[data-testid="field-emergency-contacts"]').check();
      });
      
      cy.get('[data-testid="add-fields-btn"]').click();
      cy.get('[data-testid="selected-fields"]').should('contain', '4 fields selected');
      cy.get('[data-testid="confirm-selection-btn"]').click();
    });

    it('Test 138: Should validate export permissions and HIPAA compliance', () => {
      cy.intercept('POST', '/api/health-records/export', {
        statusCode: 403,
        body: {
          error: 'Insufficient permissions',
          message: 'HIPAA authorization required for bulk export'
        }
      }).as('exportPermissionError');

      cy.get('[data-testid="export-type-select"]').select('All Health Records');
      cy.get('[data-testid="start-export-btn"]').click();

      cy.wait('@exportPermissionError');
      cy.get('[data-testid="permission-error-modal"]').should('be.visible');
      cy.get('[data-testid="hipaa-compliance-notice"]').should('be.visible');
      cy.get('[data-testid="request-authorization-btn"]').should('be.visible');
    });

    it('Test 139: Should export data in multiple formats', () => {
      const formats = ['CSV', 'Excel', 'JSON', 'PDF'];
      
      formats.forEach((format) => {
        cy.intercept('POST', '/api/health-records/export', {
          statusCode: 200,
          body: { exportId: `export-${format.toLowerCase()}-123`, format }
        }).as(`export${format}`);

        cy.get('[data-testid="export-format-select"]').select(format);
        cy.get('[data-testid="start-export-btn"]').click();
        cy.wait(`@export${format}`);
        cy.get('[data-testid="format-confirmation"]').should('contain', format);
        cy.get('[data-testid="close-modal-btn"]').click();
      });
    });

    it('Test 140: Should display export history and manage downloads', () => {
      cy.get('[data-testid="export-history"]').should('be.visible');
      cy.get('[data-testid="export-job"]').should('exist');
      
      cy.get('[data-testid="export-job"]').first().within(() => {
        cy.get('[data-testid="export-type"]').should('be.visible');
        cy.get('[data-testid="export-date"]').should('be.visible');
        cy.get('[data-testid="export-status"]').should('be.visible');
        cy.get('[data-testid="export-size"]').should('be.visible');
        cy.get('[data-testid="download-export-btn"]').should('be.visible');
        cy.get('[data-testid="delete-export-btn"]').should('be.visible');
      });

      cy.get('[data-testid="download-export-btn"]').first().click();
      cy.get('[data-testid="download-confirmation"]').should('be.visible');
    });
  });

  describe('Bulk Operations and Data Management (Tests 141-150)', () => {
    beforeEach(() => {
      cy.get('[data-testid="bulk-operations-tab"]').click();
      cy.get('[data-testid="bulk-operations-section"]').should('be.visible');
    });

    it('Test 141: Should display bulk operations interface', () => {
      cy.get('[data-testid="bulk-operations-title"]').should('contain', 'Bulk Operations');
      cy.get('[data-testid="student-selector"]').should('be.visible');
      cy.get('[data-testid="operation-type-select"]').should('be.visible');
      cy.get('[data-testid="selected-count"]').should('be.visible');
      cy.get('[data-testid="execute-bulk-btn"]').should('be.visible');
    });

    it('Test 142: Should select multiple students for bulk operations', () => {
      cy.get('[data-testid="select-all-checkbox"]').check();
      cy.get('[data-testid="selected-count"]').should('contain', 'All students selected');
      
      cy.get('[data-testid="select-all-checkbox"]').uncheck();
      cy.get('[data-testid="student-checkbox"]').first().check();
      cy.get('[data-testid="student-checkbox"]').eq(1).check();
      cy.get('[data-testid="student-checkbox"]').eq(2).check();
      
      cy.get('[data-testid="selected-count"]').should('contain', '3 students selected');
    });

    it('Test 143: Should perform bulk vaccination status update', () => {
      cy.intercept('POST', '/api/students/bulk/vaccinations/update', {
        statusCode: 200,
        body: {
          updated: 15,
          errors: 0,
          details: { vaccinationType: 'Flu Shot', status: 'Completed' }
        }
      }).as('bulkUpdateVaccinations');

      cy.get('[data-testid="student-checkbox"]').first().check();
      cy.get('[data-testid="student-checkbox"]').eq(1).check();
      cy.get('[data-testid="operation-type-select"]').select('Update Vaccination Status');
      cy.get('[data-testid="vaccination-type-select"]').select('Flu Shot');
      cy.get('[data-testid="new-status-select"]').select('Completed');
      cy.get('[data-testid="execute-bulk-btn"]').click();

      cy.wait('@bulkUpdateVaccinations');
      cy.get('[data-testid="bulk-success-modal"]').should('be.visible');
      cy.get('[data-testid="updated-count"]').should('contain', '15 records updated');
    });

    it('Test 144: Should perform bulk allergy information update', () => {
      cy.intercept('POST', '/api/students/bulk/allergies/add', {
        statusCode: 200,
        body: {
          updated: 8,
          errors: 2,
          warnings: 1,
          details: { allergen: 'Peanuts', severity: 'Severe' }
        }
      }).as('bulkAddAllergies');

      cy.get('[data-testid="grade-filter-select"]').select('Grade 3');
      cy.get('[data-testid="filter-students-btn"]').click();
      cy.get('[data-testid="select-filtered-btn"]').click();
      
      cy.get('[data-testid="operation-type-select"]').select('Add Allergy Information');
      cy.get('[data-testid="allergen-input"]').type('Peanuts');
      cy.get('[data-testid="severity-select"]').select('Severe');
      cy.get('[data-testid="reaction-type-select"]').select('Anaphylaxis');
      cy.get('[data-testid="execute-bulk-btn"]').click();

      cy.wait('@bulkAddAllergies');
      cy.get('[data-testid="bulk-results-modal"]').should('be.visible');
      cy.get('[data-testid="success-count"]').should('contain', '8 students updated');
      cy.get('[data-testid="error-count"]').should('contain', '2 errors');
    });

    it('Test 145: Should bulk schedule screenings', () => {
      cy.intercept('POST', '/api/students/bulk/screenings/schedule', {
        statusCode: 200,
        body: {
          scheduled: 25,
          conflicts: 3,
          details: { screeningType: 'Vision', date: '2024-11-15' }
        }
      }).as('bulkScheduleScreenings');

      cy.get('[data-testid="homeroom-filter-select"]').select('Room 101');
      cy.get('[data-testid="filter-students-btn"]').click();
      cy.get('[data-testid="select-all-filtered-btn"]').click();
      
      cy.get('[data-testid="operation-type-select"]').select('Schedule Screenings');
      cy.get('[data-testid="screening-type-select"]').select('Vision');
      cy.get('[data-testid="screening-date-input"]').type('2024-11-15');
      cy.get('[data-testid="screening-time-input"]').type('09:00');
      cy.get('[data-testid="execute-bulk-btn"]').click();

      cy.wait('@bulkScheduleScreenings');
      cy.get('[data-testid="scheduling-results"]').should('contain', '25 screenings scheduled');
      cy.get('[data-testid="conflict-warning"]').should('contain', '3 scheduling conflicts');
    });

    it('Test 146: Should bulk update emergency contact information', () => {
      cy.intercept('POST', '/api/students/bulk/emergency-contacts/update', {
        statusCode: 200,
        body: {
          updated: 12,
          errors: 1,
          details: { contactType: 'Secondary', updateType: 'Phone Number' }
        }
      }).as('bulkUpdateContacts');

      cy.get('[data-testid="student-checkbox"]').first().check();
      cy.get('[data-testid="student-checkbox"]').eq(1).check();
      cy.get('[data-testid="operation-type-select"]').select('Update Emergency Contacts');
      cy.get('[data-testid="contact-type-select"]').select('Secondary Contact');
      cy.get('[data-testid="update-field-select"]').select('Phone Number');
      cy.get('[data-testid="new-phone-input"]').type('(555) 123-4567');
      cy.get('[data-testid="execute-bulk-btn"]').click();

      cy.wait('@bulkUpdateContacts');
      cy.get('[data-testid="contact-update-results"]').should('contain', '12 contacts updated');
    });

    it('Test 147: Should validate bulk operation permissions', () => {
      cy.intercept('POST', '/api/students/bulk/validate-permissions', {
        statusCode: 403,
        body: {
          error: 'Insufficient permissions',
          requiredRole: 'Administrator',
          currentRole: 'Nurse'
        }
      }).as('validateBulkPermissions');

      cy.get('[data-testid="select-all-checkbox"]').check();
      cy.get('[data-testid="operation-type-select"]').select('Delete Health Records');
      cy.get('[data-testid="execute-bulk-btn"]').click();

      cy.wait('@validateBulkPermissions');
      cy.get('[data-testid="permission-error-modal"]').should('be.visible');
      cy.get('[data-testid="required-role"]').should('contain', 'Administrator');
      cy.get('[data-testid="request-permission-btn"]').should('be.visible');
    });

    it('Test 148: Should preview bulk operation changes', () => {
      cy.get('[data-testid="student-checkbox"]').first().check();
      cy.get('[data-testid="student-checkbox"]').eq(1).check();
      cy.get('[data-testid="operation-type-select"]').select('Update Medication Dosage');
      cy.get('[data-testid="medication-select"]').select('Albuterol');
      cy.get('[data-testid="new-dosage-input"]').type('2 puffs');
      cy.get('[data-testid="preview-changes-btn"]').click();

      cy.get('[data-testid="preview-modal"]').should('be.visible');
      cy.get('[data-testid="preview-table"]').should('be.visible');
      cy.get('[data-testid="change-summary"]').should('be.visible');
      cy.get('[data-testid="affected-students"]').should('contain', '2 students');
      cy.get('[data-testid="confirm-bulk-operation-btn"]').should('be.visible');
    });

    it('Test 149: Should handle bulk operation errors and rollback', () => {
      cy.intercept('POST', '/api/students/bulk/medications/update', {
        statusCode: 500,
        body: {
          error: 'Bulk operation failed',
          successfulUpdates: 5,
          failedUpdates: 3,
          rollbackAvailable: true
        }
      }).as('bulkOperationError');

      cy.get('[data-testid="student-checkbox"]').first().check();
      cy.get('[data-testid="operation-type-select"]').select('Update Medication Information');
      cy.get('[data-testid="execute-bulk-btn"]').click();

      cy.wait('@bulkOperationError');
      cy.get('[data-testid="error-modal"]').should('be.visible');
      cy.get('[data-testid="partial-success-info"]').should('contain', '5 successful, 3 failed');
      cy.get('[data-testid="rollback-btn"]').should('be.visible');
      cy.get('[data-testid="retry-failed-btn"]').should('be.visible');
    });

    it('Test 150: Should generate bulk operation audit report', () => {
      cy.intercept('GET', '/api/bulk-operations/audit', {
        statusCode: 200,
        body: {
          operations: [
            {
              id: 'bulk-op-1',
              type: 'Vaccination Update',
              date: '2024-09-15',
              user: 'Nurse Smith',
              studentsAffected: 25,
              status: 'Completed'
            },
            {
              id: 'bulk-op-2',
              type: 'Allergy Addition',
              date: '2024-09-14',
              user: 'Nurse Johnson',
              studentsAffected: 12,
              status: 'Completed'
            }
          ]
        }
      }).as('getBulkOperationAudit');

      cy.get('[data-testid="audit-history-btn"]').click();
      cy.wait('@getBulkOperationAudit');
      
      cy.get('[data-testid="audit-modal"]').should('be.visible');
      cy.get('[data-testid="audit-table"]').should('be.visible');
      cy.get('[data-testid="audit-row"]').should('have.length', 2);
      
      cy.get('[data-testid="audit-row"]').first().within(() => {
        cy.get('[data-testid="operation-type"]').should('contain', 'Vaccination Update');
        cy.get('[data-testid="operation-date"]').should('contain', '2024-09-15');
        cy.get('[data-testid="operation-user"]').should('contain', 'Nurse Smith');
        cy.get('[data-testid="students-affected"]').should('contain', '25');
      });

      cy.get('[data-testid="export-audit-btn"]').should('be.visible');
      cy.get('[data-testid="filter-audit-btn"]').should('be.visible');
    });
  });
});
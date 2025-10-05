/// <reference types="cypress" />

/**
 * Data Export and Import E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates data export and import functionality including
 * bulk operations, file handling, data migration, and format conversions
 * for healthcare data management.
 */

describe('Data Export and Import', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.navigateTo('data-management')
  })

  context('Data Export Overview', () => {
    it('should display data export dashboard', () => {
      cy.get('[data-cy=data-management-title]').should('be.visible')
      cy.get('[data-cy=export-options]').should('be.visible')
      cy.get('[data-cy=import-options]').should('be.visible')
      cy.get('[data-cy=recent-operations]').should('be.visible')
      cy.get('[data-cy=bulk-operations]').should('be.visible')
    })

    it('should show available export formats', () => {
      cy.get('[data-cy=export-formats]').should('be.visible')
      cy.get('[data-cy=excel-export]').should('be.visible')
      cy.get('[data-cy=csv-export]').should('be.visible')
      cy.get('[data-cy=pdf-export]').should('be.visible')
      cy.get('[data-cy=json-export]').should('be.visible')
      cy.get('[data-cy=xml-export]').should('be.visible')
    })

    it('should display recent export operations', () => {
      cy.get('[data-cy=recent-exports-section]').should('be.visible')
      cy.get('[data-cy=export-history-list]').should('be.visible')
      cy.get('[data-cy=export-status]').should('be.visible')
      cy.get('[data-cy=export-download-links]').should('be.visible')
    })
  })

  context('Health Records Export', () => {
    it('should export student health records', () => {
      cy.get('[data-cy=export-health-records]').click()
      cy.get('[data-cy=export-modal]').should('be.visible')

      cy.get('[data-cy=export-data-type]').select('HEALTH_RECORDS')
      cy.get('[data-cy=select-students-export]').should('be.visible')
      cy.get('[data-cy=export-date-range]').should('be.visible')
      cy.get('[data-cy=include-sections-export]').should('be.visible')

      cy.get('[data-cy=include-vitals-export]').check()
      cy.get('[data-cy=include-allergies-export]').check()
      cy.get('[data-cy=include-medications-export]').check()
      cy.get('[data-cy=include-immunizations-export]').check()

      cy.get('[data-cy=export-format-select]').select('EXCEL')
      cy.get('[data-cy=include-headers]').check()
      cy.get('[data-cy=include-metadata]').check()

      cy.get('[data-cy=start-export-button]').click()
      cy.get('[data-cy=export-progress]').should('be.visible')
      cy.get('[data-cy=export-complete]').should('be.visible')
      cy.get('[data-cy=download-export-link]').should('be.visible')
    })

    it('should export immunization records for compliance', () => {
      cy.get('[data-cy=export-immunizations]').click()

      cy.get('[data-cy=export-modal]').should('be.visible')
      cy.get('[data-cy=school-year-select]').select('2024-2025')
      cy.get('[data-cy=grade-filter-export]').should('be.visible')
      cy.get('[data-cy=vaccine-status-filter]').should('be.visible')

      cy.get('[data-cy=export-format-select]').select('PDF')
      cy.get('[data-cy=include-compliance-status]').check()
      cy.get('[data-cy=include-parental-consents]').check()

      cy.get('[data-cy=start-export-button]').click()
      cy.get('[data-cy=immunization-report-download]').should('be.visible')
    })

    it('should export growth charts and vitals data', () => {
      cy.get('[data-cy=export-growth-data]').click()

      cy.get('[data-cy=export-modal]').should('be.visible')
      cy.get('[data-cy=measurement-period-export]').should('be.visible')
      cy.get('[data-cy=age-group-filter-export]').should('be.visible')
      cy.get('[data-cy=include-percentiles]').check()
      cy.get('[data-cy=include-bmi-calculations]').check()

      cy.get('[data-cy=export-format-select]').select('CSV')
      cy.get('[data-cy=start-export-button]').click()
      cy.get('[data-cy=growth-data-download]').should('be.visible')
    })
  })

  context('Medication Data Export', () => {
    it('should export medication administration logs', () => {
      cy.get('[data-cy=export-medication-logs]').click()

      cy.get('[data-cy=export-modal]').should('be.visible')
      cy.get('[data-cy=medication-date-range]').should('be.visible')
      cy.get('[data-cy=medication-type-filter]').should('be.visible')
      cy.get('[data-cy=nurse-filter-export]').should('be.visible')

      cy.get('[data-cy=include-controlled-substances]').check()
      cy.get('[data-cy=include-dosage-details]').check()
      cy.get('[data-cy=include-administration-times]').check()

      cy.get('[data-cy=export-format-select]').select('EXCEL')
      cy.get('[data-cy=start-export-button]').click()
      cy.get('[data-cy=medication-logs-download]').should('be.visible')
    })

    it('should export medication inventory reports', () => {
      cy.get('[data-cy=export-inventory]').click()

      cy.get('[data-cy=export-modal]').should('be.visible')
      cy.get('[data-cy=inventory-status-filter]').select('ALL')
      cy.get('[data-cy=expiration-filter]').should('be.visible')
      cy.get('[data-cy=medication-category-filter]').should('be.visible')

      cy.get('[data-cy=include-batch-numbers]').check()
      cy.get('[data-cy=include-supplier-info]').check()
      cy.get('[data-cy=include-cost-data]').check()

      cy.get('[data-cy=export-format-select]').select('CSV')
      cy.get('[data-cy=start-export-button]').click()
      cy.get('[data-cy=inventory-report-download]').should('be.visible')
    })

    it('should export controlled substance logs', () => {
      cy.get('[data-cy=export-controlled-substances]').click()

      cy.get('[data-cy=export-modal]').should('be.visible')
      cy.get('[data-cy=controlled-substance-period]').should('be.visible')
      cy.get('[data-cy=include-receipts-export]').check()
      cy.get('[data-cy=include-disposals-export]').check()
      cy.get('[data-cy=include-waste-logs-export]').check()

      cy.get('[data-cy=export-format-select]').select('PDF')
      cy.get('[data-cy=start-export-button]').click()
      cy.get('[data-cy=controlled-substance-download]').should('be.visible')
    })
  })

  context('Incident Reports Export', () => {
    it('should export incident summary reports', () => {
      cy.get('[data-cy=export-incident-reports]').click()

      cy.get('[data-cy=export-modal]').should('be.visible')
      cy.get('[data-cy=incident-date-range]').should('be.visible')
      cy.get('[data-cy=incident-type-filter]').should('be.visible')
      cy.get('[data-cy=severity-filter-export]').should('be.visible')

      cy.get('[data-cy=include-witness-statements]').check()
      cy.get('[data-cy=include-followup-actions]').check()
      cy.get('[data-cy=include-attachments]').check()

      cy.get('[data-cy=export-format-select]').select('PDF')
      cy.get('[data-cy=start-export-button]').click()
      cy.get('[data-cy=incident-reports-download]').should('be.visible')
    })

    it('should export OSHA compliance reports', () => {
      cy.get('[data-cy=export-osha-reports]').click()

      cy.get('[data-cy=export-modal]').should('be.visible')
      cy.get('[data-cy=osha-year-select]').select('2024')
      cy.get('[data-cy=osha-form-type]').should('be.visible')

      cy.get('[data-cy=include-form-300]').check()
      cy.get('[data-cy=include-form-301]').check()
      cy.get('[data-cy=include-form-300a]').check()

      cy.get('[data-cy=export-format-select]').select('PDF')
      cy.get('[data-cy=start-export-button]').click()
      cy.get('[data-cy=osha-reports-download]').should('be.visible')
    })
  })

  context('Bulk Data Export', () => {
    it('should perform bulk export of all student data', () => {
      cy.get('[data-cy=bulk-export-button]').click()
      cy.get('[data-cy=bulk-export-modal]').should('be.visible')

      cy.get('[data-cy=select-all-data-types]').check()
      cy.get('[data-cy=export-date-range-bulk]').should('be.visible')
      cy.get('[data-cy=include-related-records]').check()

      cy.get('[data-cy=bulk-export-format]').select('ZIP')
      cy.get('[data-cy=include-attachments-bulk]').check()
      cy.get('[data-cy=encrypt-export]').check()

      cy.get('[data-cy=start-bulk-export]').click()
      cy.get('[data-cy=bulk-export-progress]').should('be.visible')
      cy.get('[data-cy=bulk-export-complete]').should('be.visible')
    })

    it('should allow selective bulk export by criteria', () => {
      cy.get('[data-cy=selective-export-button]').click()
      cy.get('[data-cy=selective-export-modal]').should('be.visible')

      cy.get('[data-cy=export-criteria-section]').should('be.visible')
      cy.get('[data-cy=grade-filter-bulk]').should('be.visible')
      cy.get('[data-cy=school-filter-bulk]').should('be.visible')
      cy.get('[data-cy=date-range-bulk]').should('be.visible')

      cy.get('[data-cy=select-data-types-bulk]').should('be.visible')
      cy.get('[data-cy=health-records-bulk]').check()
      cy.get('[data-cy=medication-records-bulk]').check()
      cy.get('[data-cy=incident-reports-bulk]').check()

      cy.get('[data-cy=start-selective-export]').click()
      cy.get('[data-cy=selective-export-progress]').should('be.visible')
    })
  })

  context('Data Import Functionality', () => {
    it('should import student health records', () => {
      cy.get('[data-cy=import-health-records]').click()
      cy.get('[data-cy=import-modal]').should('be.visible')

      cy.get('[data-cy=import-file-upload]').should('be.visible')
      cy.get('[data-cy=import-template-download]').should('be.visible')
      cy.get('[data-cy=import-preview]').should('be.visible')

      // Upload import file
      const fileName = 'health-records-import.csv'
      cy.fixture(fileName).then(fileContent => {
        cy.get('[data-cy=import-file-input]').upload({ fileContent, fileName, mimeType: 'text/csv' })
      })

      cy.get('[data-cy=import-preview-data]').should('be.visible')
      cy.get('[data-cy=validate-import-data]').click()
      cy.get('[data-cy=import-validation-results]').should('be.visible')

      cy.get('[data-cy=start-import-process]').click()
      cy.get('[data-cy=import-progress]').should('be.visible')
      cy.get('[data-cy=import-complete]').should('be.visible')
    })

    it('should import medication data', () => {
      cy.get('[data-cy=import-medications]').click()

      cy.get('[data-cy=import-modal]').should('be.visible')
      cy.get('[data-cy=import-file-upload]').should('be.visible')

      const fileName = 'medications-import.xlsx'
      cy.fixture(fileName).then(fileContent => {
        cy.get('[data-cy=import-file-input]').upload({ fileContent, fileName, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      })

      cy.get('[data-cy=import-preview-data]').should('be.visible')
      cy.get('[data-cy=validate-medication-data]').click()
      cy.get('[data-cy=medication-validation-results]').should('be.visible')

      cy.get('[data-cy=start-medication-import]').click()
      cy.get('[data-cy=medication-import-progress]').should('be.visible')
    })

    it('should handle import errors and conflicts', () => {
      cy.get('[data-cy=import-incident-reports]').click()

      const fileName = 'incident-reports-import.json'
      cy.fixture(fileName).then(fileContent => {
        cy.get('[data-cy=import-file-input]').upload({ fileContent, fileName, mimeType: 'application/json' })
      })

      cy.get('[data-cy=import-preview-data]').should('be.visible')
      cy.get('[data-cy=import-conflicts-detected]').should('be.visible')
      cy.get('[data-cy=conflict-resolution-options]').should('be.visible')

      cy.get('[data-cy=resolve-conflicts-skip]').click()
      cy.get('[data-cy=start-import-with-resolution]').click()
      cy.get('[data-cy=import-with-conflicts-progress]').should('be.visible')
    })
  })

  context('Data Migration Tools', () => {
    it('should migrate data from legacy systems', () => {
      cy.get('[data-cy=data-migration-tab]').click()

      cy.get('[data-cy=start-migration-button]').click()
      cy.get('[data-cy=migration-modal]').should('be.visible')

      cy.get('[data-cy=source-system-select]').select('LEGACY_HEALTH_SYSTEM')
      cy.get('[data-cy=migration-scope]').should('be.visible')
      cy.get('[data-cy=migration-mapping]').should('be.visible')

      cy.get('[data-cy=test-migration-first]').check()
      cy.get('[data-cy=start-test-migration]').click()
      cy.get('[data-cy=test-migration-results]').should('be.visible')

      cy.get('[data-cy=start-full-migration]').click()
      cy.get('[data-cy=migration-progress]').should('be.visible')
      cy.get('[data-cy=migration-complete]').should('be.visible')
    })

    it('should validate data integrity during migration', () => {
      cy.get('[data-cy=data-migration-tab]').click()

      cy.get('[data-cy=validate-migration-button]').click()
      cy.get('[data-cy=validation-modal]').should('be.visible')

      cy.get('[data-cy=run-data-integrity-checks]').click()
      cy.get('[data-cy=integrity-check-progress]').should('be.visible')
      cy.get('[data-cy=integrity-check-results]').should('be.visible')

      cy.get('[data-cy=validate-record-counts]').check()
      cy.get('[data-cy=validate-relationships]').check()
      cy.get('[data-cy=validate-data-types]').check()
    })
  })

  context('Scheduled Export Operations', () => {
    it('should configure automated data exports', () => {
      cy.get('[data-cy=scheduled-exports-tab]').click()

      cy.get('[data-cy=add-scheduled-export]').click()
      cy.get('[data-cy=schedule-export-modal]').should('be.visible')

      cy.get('[data-cy=export-name]').type('Weekly Health Summary')
      cy.get('[data-cy=export-frequency]').select('WEEKLY')
      cy.get('[data-cy=export-day]').select('MONDAY')
      cy.get('[data-cy=export-time]').type('06:00')

      cy.get('[data-cy=export-recipients]').type('admin@school.edu,nurse@school.edu')
      cy.get('[data-cy=export-format-scheduled]').select('PDF')

      cy.get('[data-cy=save-scheduled-export]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Scheduled export created')
    })

    it('should manage existing scheduled exports', () => {
      cy.get('[data-cy=scheduled-exports-tab]').click()

      cy.get('[data-cy=scheduled-export-item]').first().within(() => {
        cy.get('[data-cy=edit-schedule-button]').click()
      })

      cy.get('[data-cy=schedule-export-modal]').should('be.visible')
      cy.get('[data-cy=export-frequency]').select('MONTHLY')
      cy.get('[data-cy=export-recipients]').clear().type('updated-admin@school.edu')

      cy.get('[data-cy=save-scheduled-export]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Scheduled export updated')
    })

    it('should display scheduled export history', () => {
      cy.get('[data-cy=scheduled-exports-tab]').click()

      cy.get('[data-cy=export-history-section]').should('be.visible')
      cy.get('[data-cy=scheduled-export-entries]').should('be.visible')
      cy.get('[data-cy=export-execution-date]').should('be.visible')
      cy.get('[data-cy=export-status-scheduled]').should('be.visible')
      cy.get('[data-cy=export-file-links]').should('be.visible')
    })
  })

  context('Data Format Conversion', () => {
    it('should convert between different data formats', () => {
      cy.get('[data-cy=format-conversion-tab]').click()

      cy.get('[data-cy=convert-format-button]').click()
      cy.get('[data-cy=conversion-modal]').should('be.visible')

      cy.get('[data-cy=source-format]').select('CSV')
      cy.get('[data-cy=target-format]').select('JSON')
      cy.get('[data-cy=conversion-options]').should('be.visible')

      cy.get('[data-cy=upload-source-file]').should('be.visible')
      cy.get('[data-cy=preview-conversion]').should('be.visible')

      cy.get('[data-cy=start-conversion]').click()
      cy.get('[data-cy=conversion-progress]').should('be.visible')
      cy.get('[data-cy=download-converted-file]').should('be.visible')
    })

    it('should validate format conversion results', () => {
      cy.get('[data-cy=format-conversion-tab]').click()

      cy.get('[data-cy=validate-conversion-button]').click()
      cy.get('[data-cy=validation-modal]').should('be.visible')

      cy.get('[data-cy=run-format-validation]').click()
      cy.get('[data-cy=validation-progress]').should('be.visible')
      cy.get('[data-cy=validation-results]').should('be.visible')

      cy.get('[data-cy=check-data-integrity]').check()
      cy.get('[data-cy=check-field-mapping]').check()
      cy.get('[data-cy=check-encoding]').check()
    })
  })

  context('Data Archiving and Retention', () => {
    it('should archive old data based on retention policies', () => {
      cy.get('[data-cy=data-archiving-tab]').click()

      cy.get('[data-cy=run-archiving-button]').click()
      cy.get('[data-cy=archiving-modal]').should('be.visible')

      cy.get('[data-cy=archive-criteria]').should('be.visible')
      cy.get('[data-cy=retention-policy-select]').should('be.visible')
      cy.get('[data-cy=archive-date-range]').should('be.visible')

      cy.get('[data-cy=preview-archive-candidates]').click()
      cy.get('[data-cy=archive-preview]').should('be.visible')

      cy.get('[data-cy=start-archiving-process]').click()
      cy.get('[data-cy=archiving-progress]').should('be.visible')
      cy.get('[data-cy=archiving-complete]').should('be.visible')
    })

    it('should manage archived data', () => {
      cy.get('[data-cy=data-archiving-tab]').click()

      cy.get('[data-cy=manage-archives-button]').click()
      cy.get('[data-cy=archives-modal]').should('be.visible')

      cy.get('[data-cy=archive-list]').should('be.visible')
      cy.get('[data-cy=archive-details]').should('be.visible')
      cy.get('[data-cy=restore-from-archive]').should('be.visible')
      cy.get('[data-cy=delete-archive]').should('be.visible')
    })
  })

  context('Export Security and Compliance', () => {
    it('should apply data masking for sensitive exports', () => {
      cy.get('[data-cy=export-health-records]').click()

      cy.get('[data-cy=export-modal]').should('be.visible')
      cy.get('[data-cy=enable-data-masking]').check()
      cy.get('[data-cy=masking-options]').should('be.visible')

      cy.get('[data-cy=mask-student-names]').check()
      cy.get('[data-cy=mask-medical-details]').check()
      cy.get('[data-cy=mask-contact-info]').check()

      cy.get('[data-cy=start-masked-export]').click()
      cy.get('[data-cy=masked-export-download]').should('be.visible')
    })

    it('should maintain audit trail for all exports', () => {
      cy.get('[data-cy=export-health-records]').click()

      cy.get('[data-cy=export-modal]').should('be.visible')
      cy.get('[data-cy=export-audit-trail]').should('be.visible')
      cy.get('[data-cy=export-purpose]').type('Compliance reporting')
      cy.get('[data-cy=export-authorized-by]').type('School Administrator')

      cy.get('[data-cy=start-export-button]').click()
      cy.get('[data-cy=export-audit-recorded]').should('be.visible')
    })

    it('should enforce export permissions and restrictions', () => {
      cy.get('[data-cy=export-controlled-substances]').click()

      cy.get('[data-cy=export-modal]').should('be.visible')
      cy.get('[data-cy=export-permission-check]').should('be.visible')
      cy.get('[data-cy=additional-authorization-required]').should('be.visible')

      cy.get('[data-cy=request-export-authorization]').click()
      cy.get('[data-cy=authorization-pending]').should('be.visible')
    })
  })

  context('Import Validation and Error Handling', () => {
    it('should validate import data before processing', () => {
      cy.get('[data-cy=import-health-records]').click()

      cy.get('[data-cy=import-modal]').should('be.visible')
      cy.get('[data-cy=run-import-validation]').click()
      cy.get('[data-cy=validation-progress]').should('be.visible')

      cy.get('[data-cy=validation-results]').should('be.visible')
      cy.get('[data-cy=data-quality-score]').should('be.visible')
      cy.get('[data-cy=validation-errors]').should('be.visible')
      cy.get('[data-cy=validation-warnings]').should('be.visible')
    })

    it('should handle import errors gracefully', () => {
      cy.get('[data-cy=import-medications]').click()

      const fileName = 'invalid-medications.csv'
      cy.fixture(fileName).then(fileContent => {
        cy.get('[data-cy=import-file-input]').upload({ fileContent, fileName, mimeType: 'text/csv' })
      })

      cy.get('[data-cy=import-errors-detected]').should('be.visible')
      cy.get('[data-cy=error-correction-options]').should('be.visible')
      cy.get('[data-cy=skip-invalid-records]').check()
      cy.get('[data-cy=fix-and-retry]').should('be.visible')
    })

    it('should provide detailed import error reports', () => {
      cy.get('[data-cy=import-error-details-button]').click()
      cy.get('[data-cy=error-report-modal]').should('be.visible')

      cy.get('[data-cy=error-summary]').should('be.visible')
      cy.get('[data-cy=error-breakdown-by-type]').should('be.visible')
      cy.get('[data-cy=error-locations]').should('be.visible')
      cy.get('[data-cy=error-correction-suggestions]').should('be.visible')
    })
  })

  context('Data Synchronization', () => {
    it('should sync data with external systems', () => {
      cy.get('[data-cy=data-sync-tab]').click()

      cy.get('[data-cy=start-sync-button]').click()
      cy.get('[data-cy=sync-modal]').should('be.visible')

      cy.get('[data-cy=sync-direction]').select('BIDIRECTIONAL')
      cy.get('[data-cy=sync-scope]').should('be.visible')
      cy.get('[data-cy=conflict-resolution-strategy]').should('be.visible')

      cy.get('[data-cy=start-data-sync]').click()
      cy.get('[data-cy=sync-progress]').should('be.visible')
      cy.get('[data-cy=sync-complete]').should('be.visible')
    })

    it('should handle sync conflicts', () => {
      cy.get('[data-cy=data-sync-tab]').click()

      cy.get('[data-cy=sync-conflicts-detected]').should('be.visible')
      cy.get('[data-cy=conflict-resolution-panel]').should('be.visible')

      cy.get('[data-cy=resolve-conflict-manually]').click()
      cy.get('[data-cy=conflict-details]').should('be.visible')
      cy.get('[data-cy=choose-winning-record]').should('be.visible')
    })
  })
})

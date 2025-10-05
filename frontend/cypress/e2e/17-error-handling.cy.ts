/// <reference types="cypress" />

/**
 * Error Handling E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates error handling, recovery mechanisms,
 * user feedback, and graceful degradation for healthcare
 * management workflows.
 */

describe('Error Handling', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  context('Network Error Handling', () => {
    it('should handle network connectivity loss gracefully', () => {
      cy.visit('/dashboard')

      // Simulate network disconnection
      cy.window().then((win) => {
        win.dispatchEvent(new Event('offline'))
      })

      cy.get('[data-cy=offline-indicator]').should('be.visible')
      cy.get('[data-cy=offline-message]').should('contain', 'No internet connection')
      cy.get('[data-cy=offline-actions]').should('be.visible')
    })

    it('should recover from network reconnection', () => {
      cy.visit('/dashboard')

      // Simulate offline then online
      cy.window().then((win) => {
        win.dispatchEvent(new Event('offline'))
        win.dispatchEvent(new Event('online'))
      })

      cy.get('[data-cy=online-indicator]').should('be.visible')
      cy.get('[data-cy=sync-pending-changes]').should('be.visible')
      cy.get('[data-cy=connection-restored-message]').should('be.visible')
    })

    it('should handle API timeout errors', () => {
      cy.visit('/health-records')

      // Intercept API calls to simulate timeout
      cy.intercept('/api/health-records', (req) => {
        req.reply({
          delay: 10000, // 10 second delay
          statusCode: 408,
          body: { error: 'Request timeout' }
        })
      })

      cy.get('[data-cy=load-health-records]').click()
      cy.get('[data-cy=timeout-error-message]', { timeout: 15000 }).should('be.visible')
      cy.get('[data-cy=retry-button]').should('be.visible')
    })

    it('should handle server error responses', () => {
      cy.visit('/medications')

      // Intercept API calls to simulate server error
      cy.intercept('/api/medications', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      })

      cy.get('[data-cy=load-medications]').click()
      cy.get('[data-cy=server-error-message]').should('be.visible')
      cy.get('[data-cy=error-code-500]').should('be.visible')
      cy.get('[data-cy=contact-support-link]').should('be.visible')
    })
  })

  context('Form Validation Errors', () => {
    it('should display validation errors for required fields', () => {
      cy.visit('/medications')
      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=validation-errors]').should('be.visible')
      cy.get('[data-cy=required-field-error]').should('contain', 'This field is required')
      cy.get('[data-cy=error-field-highlight]').should('have.class', 'error-state')
    })

    it('should handle invalid data format errors', () => {
      cy.visit('/medications')
      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name]').type('Invalid/Medication@Name!')
      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=format-error-message]').should('be.visible')
      cy.get('[data-cy=invalid-characters-error]').should('contain', 'Special characters not allowed')
    })

    it('should handle duplicate data errors', () => {
      cy.visit('/medications')
      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name]').type('Existing Medication')
      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=duplicate-error-message]').should('be.visible')
      cy.get('[data-cy=duplicate-suggestion]').should('contain', 'Medication already exists')
    })

    it('should provide helpful error recovery suggestions', () => {
      cy.visit('/medications')
      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name]').type('A')
      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=validation-errors]').should('be.visible')
      cy.get('[data-cy=error-recovery-help]').should('be.visible')
      cy.get('[data-cy=suggested-corrections]').should('be.visible')
    })
  })

  context('Data Integrity Errors', () => {
    it('should handle data constraint violations', () => {
      cy.visit('/students')

      cy.get('[data-cy=add-student-button]').click()

      // Try to create student with invalid data
      cy.get('[data-cy=student-dob]').type('2025-01-01') // Future date
      cy.get('[data-cy=save-student]').click()

      cy.get('[data-cy=constraint-error-message]').should('be.visible')
      cy.get('[data-cy=date-constraint-violation]').should('contain', 'Date of birth cannot be in the future')
    })

    it('should handle referential integrity errors', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      // Try to assign medication to non-existent student
      cy.get('[data-cy=student-select]').select('Non-existent Student')
      cy.get('[data-cy=save-medication]').click()

      cy.get('[data-cy=referential-error-message]').should('be.visible')
      cy.get('[data-cy=invalid-reference-error]').should('contain', 'Selected student does not exist')
    })

    it('should handle data type mismatch errors', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()

      // Enter invalid data types
      cy.get('[data-cy=height-input]').type('invalid-height')
      cy.get('[data-cy=weight-input]').type('invalid-weight')
      cy.get('[data-cy=save-record]').click()

      cy.get('[data-cy=type-mismatch-error]').should('be.visible')
      cy.get('[data-cy=numeric-field-error]').should('contain', 'Must be a valid number')
    })
  })

  context('User Input Error Recovery', () => {
    it('should provide undo functionality for destructive actions', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=delete-record-button]').click()
      cy.get('[data-cy=confirm-delete-modal]').should('be.visible')

      cy.get('[data-cy=confirm-delete-button]').click()
      cy.get('[data-cy=record-deleted-message]').should('be.visible')

      cy.get('[data-cy=undo-delete-button]').should('be.visible')
      cy.get('[data-cy=undo-delete-button]').click()
      cy.get('[data-cy=record-restored-message]').should('be.visible')
    })

    it('should handle form data loss prevention', () => {
      cy.visit('/medications')
      cy.get('[data-cy=add-medication-button]').click()

      // Fill form with data
      cy.get('[data-cy=medication-name]').type('Test Medication')
      cy.get('[data-cy=medication-dosage]').type('10mg')

      // Try to navigate away without saving
      cy.get('[data-cy=close-modal-button]').click()
      cy.get('[data-cy=unsaved-changes-modal]').should('be.visible')
      cy.get('[data-cy=save-changes-option]').should('be.visible')
      cy.get('[data-cy=discard-changes-option]').should('be.visible')
    })

    it('should provide auto-save functionality', () => {
      cy.visit('/medications')
      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name]').type('Test Medication')
      cy.get('[data-cy=auto-save-indicator]').should('be.visible')
      cy.get('[data-cy=last-saved-timestamp]').should('be.visible')

      // Refresh page and check if data is restored
      cy.reload()
      cy.get('[data-cy=draft-restored-message]').should('be.visible')
    })
  })

  context('System Error Recovery', () => {
    it('should handle application crashes gracefully', () => {
      cy.visit('/dashboard')

      // Simulate JavaScript error
      cy.window().then((win) => {
        win.dispatchEvent(new ErrorEvent('error', {
          message: 'Simulated JavaScript error',
          filename: 'test.js',
          lineno: 1,
          colno: 1
        }))
      })

      cy.get('[data-cy=error-boundary-activated]').should('be.visible')
      cy.get('[data-cy=error-recovery-options]').should('be.visible')
      cy.get('[data-cy=reload-application]').should('be.visible')
    })

    it('should provide error reporting functionality', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=report-error-button]').click()
      cy.get('[data-cy=error-report-modal]').should('be.visible')

      cy.get('[data-cy=error-description]').should('be.visible')
      cy.get('[data-cy=error-steps-to-reproduce]').should('be.visible')
      cy.get('[data-cy=error-screenshot-attachment]').should('be.visible')
      cy.get('[data-cy=submit-error-report]').should('be.visible')
    })

    it('should handle database connection errors', () => {
      cy.visit('/students')

      // Simulate database connection error
      cy.intercept('/api/students', {
        statusCode: 503,
        body: { error: 'Database connection failed' }
      })

      cy.get('[data-cy=load-students]').click()
      cy.get('[data-cy=database-error-message]').should('be.visible')
      cy.get('[data-cy=database-retry-button]').should('be.visible')
      cy.get('[data-cy=offline-mode-suggestion]').should('be.visible')
    })
  })

  context('File Upload Error Handling', () => {
    it('should handle file upload failures', () => {
      cy.visit('/data-management')

      cy.get('[data-cy=import-health-records]').click()

      // Simulate file upload error
      cy.intercept('/api/upload', {
        statusCode: 413,
        body: { error: 'File too large' }
      })

      const fileName = 'large-file.csv'
      cy.fixture(fileName).then(fileContent => {
        cy.get('[data-cy=file-upload-input]').upload({ fileContent, fileName, mimeType: 'text/csv' })
      })

      cy.get('[data-cy=upload-error-message]').should('be.visible')
      cy.get('[data-cy=file-size-error]').should('contain', 'File exceeds maximum size')
      cy.get('[data-cy=compression-suggestion]').should('be.visible')
    })

    it('should handle corrupted file uploads', () => {
      cy.visit('/data-management')

      cy.get('[data-cy=import-medications]').click()

      // Upload corrupted file
      cy.get('[data-cy=file-upload-input]').selectFile({
        contents: Cypress.Buffer.from('corrupted file content'),
        fileName: 'corrupted-medication-data.csv',
        mimeType: 'text/csv'
      }, { force: true })

      cy.get('[data-cy=file-corruption-error]').should('be.visible')
      cy.get('[data-cy=file-validation-failed]').should('be.visible')
      cy.get('[data-cy=try-different-file]').should('be.visible')
    })

    it('should handle unsupported file formats', () => {
      cy.visit('/data-management')

      cy.get('[data-cy=import-health-records]').click()

      cy.get('[data-cy=file-upload-input]').selectFile({
        contents: Cypress.Buffer.from('test content'),
        fileName: 'test.txt',
        mimeType: 'text/plain'
      }, { force: true })

      cy.get('[data-cy=unsupported-format-error]').should('be.visible')
      cy.get('[data-cy=supported-formats-list]').should('be.visible')
      cy.get('[data-cy=format-conversion-option]').should('be.visible')
    })
  })

  context('Authentication Error Handling', () => {
    it('should handle session expiration gracefully', () => {
      cy.visit('/dashboard')

      // Simulate session expiration
      cy.window().then((win) => {
        win.localStorage.removeItem('authToken')
        win.sessionStorage.clear()
      })

      cy.get('[data-cy=session-expired-modal]').should('be.visible')
      cy.get('[data-cy=login-again-button]').should('be.visible')
      cy.get('[data-cy=save-current-work]').should('be.visible')
    })

    it('should handle invalid login credentials', () => {
      cy.visit('/login')

      cy.get('[data-cy=email-input]').type('invalid@email.com')
      cy.get('[data-cy=password-input]').type('wrongpassword')
      cy.get('[data-cy=login-button]').click()

      cy.get('[data-cy=invalid-credentials-error]').should('be.visible')
      cy.get('[data-cy=password-reset-link]').should('be.visible')
      cy.get('[data-cy=account-lockout-warning]').should('be.visible')
    })

    it('should handle account lockout scenarios', () => {
      cy.visit('/login')

      // Simulate multiple failed login attempts
      for (let i = 0; i < 5; i++) {
        cy.get('[data-cy=email-input]').type('test@email.com')
        cy.get('[data-cy=password-input]').type('wrongpassword')
        cy.get('[data-cy=login-button]').click()
      }

      cy.get('[data-cy=account-locked-error]').should('be.visible')
      cy.get('[data-cy=lockout-duration]').should('contain', '15 minutes')
      cy.get('[data-cy=contact-administrator]').should('be.visible')
    })
  })

  context('Permission and Authorization Errors', () => {
    it('should handle insufficient permissions gracefully', () => {
      cy.visit('/system-config')

      // Try to access admin-only feature as regular user
      cy.get('[data-cy=admin-only-button]').click()

      cy.get('[data-cy=insufficient-permissions-error]').should('be.visible')
      cy.get('[data-cy=permission-required-message]').should('contain', 'Administrator access required')
      cy.get('[data-cy=request-permission-link]').should('be.visible')
    })

    it('should handle role-based access control errors', () => {
      cy.visit('/admin/users')

      cy.get('[data-cy=access-denied-error]').should('be.visible')
      cy.get('[data-cy=role-requirement-message]').should('contain', 'Admin role required')
      cy.get('[data-cy=contact-admin-message]').should('be.visible')
    })
  })

  context('Data Processing Error Recovery', () => {
    it('should handle bulk operation failures', () => {
      cy.visit('/data-management')

      cy.get('[data-cy=bulk-export-button]').click()
      cy.get('[data-cy=start-bulk-export]').click()

      // Simulate partial failure
      cy.get('[data-cy=bulk-operation-partial-failure]').should('be.visible')
      cy.get('[data-cy=failed-records-count]').should('be.visible')
      cy.get('[data-cy=retry-failed-records]').should('be.visible')
      cy.get('[data-cy=download-error-report]').should('be.visible')
    })

    it('should handle data transformation errors', () => {
      cy.visit('/data-management')

      cy.get('[data-cy=import-health-records]').click()

      // Upload data that requires transformation
      const fileName = 'legacy-format-data.csv'
      cy.fixture(fileName).then(fileContent => {
        cy.get('[data-cy=file-upload-input]').upload({ fileContent, fileName, mimeType: 'text/csv' })
      })

      cy.get('[data-cy=transformation-error]').should('be.visible')
      cy.get('[data-cy=field-mapping-issues]').should('be.visible')
      cy.get('[data-cy=fix-mapping-button]').should('be.visible')
    })

    it('should handle memory exhaustion errors', () => {
      cy.visit('/reports')

      cy.get('[data-cy=generate-large-report]').click()

      cy.get('[data-cy=memory-warning-message]').should('be.visible')
      cy.get('[data-cy=optimize-memory-usage]').should('be.visible')
      cy.get('[data-cy=process-in-batches]').should('be.visible')
    })
  })

  context('Integration Error Handling', () => {
    it('should handle external system connection failures', () => {
      cy.visit('/integrations')

      cy.get('[data-cy=sis-integration-card]').within(() => {
        cy.get('[data-cy=test-connection-button]').click()
      })

      cy.get('[data-cy=connection-failed-error]').should('be.visible')
      cy.get('[data-cy=connection-timeout-message]').should('contain', 'Connection timeout')
      cy.get('[data-cy=retry-connection-button]').should('be.visible')
      cy.get('[data-cy=check-network-settings]').should('be.visible')
    })

    it('should handle API rate limiting errors', () => {
      cy.visit('/integrations')

      cy.get('[data-cy=ehr-integration-card]').within(() => {
        cy.get('[data-cy=sync-now-button]').click()
      })

      cy.get('[data-cy=rate-limit-error]').should('be.visible')
      cy.get('[data-cy=rate-limit-exceeded-message]').should('contain', 'API rate limit exceeded')
      cy.get('[data-cy=retry-after-time]').should('be.visible')
      cy.get('[data-cy=schedule-later-button]').should('be.visible')
    })

    it('should handle data format mismatch errors', () => {
      cy.visit('/integrations')

      cy.get('[data-cy=pharmacy-integration-card]').within(() => {
        cy.get('[data-cy=sync-prescriptions]').click()
      })

      cy.get('[data-cy=format-mismatch-error]').should('be.visible')
      cy.get('[data-cy=field-mapping-issues]').should('be.visible')
      cy.get('[data-cy=update-field-mapping]').should('be.visible')
    })
  })

  context('User-Friendly Error Messages', () => {
    it('should provide clear and actionable error messages', () => {
      cy.visit('/medications')

      cy.get('[data-cy=create-record-button]').click()
      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=error-message]').should('be.visible')
      cy.get('[data-cy=error-explanation]').should('be.visible')
      cy.get('[data-cy=error-resolution-steps]').should('be.visible')
      cy.get('[data-cy=contact-support-option]').should('be.visible')
    })

    it('should provide contextual help for errors', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()

      cy.get('[data-cy=record-type]').select('PHYSICAL_EXAM')
      cy.get('[data-cy=height-input]').type('invalid')
      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=field-specific-help]').should('be.visible')
      cy.get('[data-cy=example-format]').should('be.visible')
      cy.get('[data-cy=common-mistakes-list]').should('be.visible')
    })

    it('should provide multiple language error messages', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=language-selector]').select('Spanish')

      cy.visit('/medications')
      cy.get('[data-cy=add-medication-button]').click()
      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=error-message-spanish]').should('be.visible')
      cy.get('[data-cy=spanish-help-text]').should('be.visible')
    })
  })

  context('Error Logging and Monitoring', () => {
    it('should log errors for debugging and monitoring', () => {
      cy.visit('/dashboard')

      // Trigger an error
      cy.get('[data-cy=trigger-test-error]').click()

      cy.get('[data-cy=error-logged-indicator]').should('be.visible')
      cy.get('[data-cy=error-id-generated]').should('be.visible')
      cy.get('[data-cy=error-details-captured]').should('be.visible')
    })

    it('should provide error analytics and trends', () => {
      cy.visit('/system-config')

      cy.get('[data-cy=error-analytics-tab]').click()
      cy.get('[data-cy=error-trends-dashboard]').should('be.visible')

      cy.get('[data-cy=error-frequency-charts]').should('be.visible')
      cy.get('[data-cy=error-type-breakdown]').should('be.visible')
      cy.get('[data-cy=error-resolution-times]').should('be.visible')
    })

    it('should allow error log export for analysis', () => {
      cy.visit('/system-config')

      cy.get('[data-cy=error-logs-tab]').click()
      cy.get('[data-cy=export-error-logs]').click()

      cy.get('[data-cy=export-modal]').should('be.visible')
      cy.get('[data-cy=error-log-date-range]').should('be.visible')
      cy.get('[data-cy=error-type-filter]').should('be.visible')
      cy.get('[data-cy=export-error-log-button]').should('be.visible')
    })
  })

  context('Graceful Degradation', () => {
    it('should provide basic functionality when advanced features fail', () => {
      cy.visit('/dashboard')

      // Simulate advanced feature failure
      cy.get('[data-cy=advanced-widget-error]').should('be.visible')

      cy.get('[data-cy=basic-functionality-available]').should('be.visible')
      cy.get('[data-cy=core-features-working]').should('be.visible')
      cy.get('[data-cy=advanced-features-disabled]').should('be.visible')
    })

    it('should handle third-party service failures', () => {
      cy.visit('/integrations')

      cy.get('[data-cy=external-service-error]').should('be.visible')
      cy.get('[data-cy=service-unavailable-message]').should('be.visible')
      cy.get('[data-cy=fallback-mode-active]').should('be.visible')
      cy.get('[data-cy=manual-workaround-available]').should('be.visible')
    })

    it('should provide offline functionality when possible', () => {
      cy.visit('/dashboard')

      cy.window().then((win) => {
        win.dispatchEvent(new Event('offline'))
      })

      cy.get('[data-cy=offline-mode-active]').should('be.visible')
      cy.get('[data-cy=offline-capable-features]').should('be.visible')
      cy.get('[data-cy=view-cached-data]').should('be.visible')
      cy.get('[data-cy=queue-actions-for-sync]').should('be.visible')
    })
  })

  context('Error Prevention', () => {
    it('should validate data before submission', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name]').type('Test')
      cy.get('[data-cy=real-time-validation]').should('be.visible')
      cy.get('[data-cy=validation-feedback]').should('be.visible')
      cy.get('[data-cy=prevent-invalid-submission]').should('be.visible')
    })

    it('should provide input guidance and constraints', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()

      cy.get('[data-cy=form-field-constraints]').should('be.visible')
      cy.get('[data-cy=input-format-hints]').should('be.visible')
      cy.get('[data-cy=character-limits]').should('be.visible')
      cy.get('[data-cy=required-field-indicators]').should('be.visible')
    })

    it('should implement client-side data validation', () => {
      cy.visit('/students')

      cy.get('[data-cy=add-student-button]').click()

      cy.get('[data-cy=student-email]').type('invalid-email')
      cy.get('[data-cy=immediate-validation-feedback]').should('be.visible')
      cy.get('[data-cy=email-format-correction]').should('be.visible')
    })
  })
})

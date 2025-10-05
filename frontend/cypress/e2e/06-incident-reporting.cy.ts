/// <reference types="cypress" />

/**
 * Incident Reporting E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates the complete incident reporting workflow including
 * creating incident reports, managing witness statements, follow-up actions,
 * parent notifications, and compliance documentation.
 */

describe('Incident Reporting', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.navigateTo('incidents')
  })

  context('Incident Reports Overview', () => {
    it('should display incident reports dashboard', () => {
      cy.get('[data-cy=incidents-title]').should('be.visible')
      cy.get('[data-cy=incidents-list]').should('be.visible')
      cy.get('[data-cy=incident-stats]').should('be.visible')
      cy.get('[data-cy=recent-incidents]').should('be.visible')
      cy.get('[data-cy=report-incident-button]').should('be.visible')
    })

    it('should display incident statistics correctly', () => {
      cy.get('[data-cy=total-incidents-stat]').should('contain', 'Total Incidents')
      cy.get('[data-cy=pending-reports-stat]').should('contain', 'Pending Reports')
      cy.get('[data-cy=requires-followup-stat]').should('contain', 'Requires Follow-up')
      cy.get('[data-cy=parent-notifications-stat]').should('contain', 'Parent Notifications')
    })

    it('should allow filtering incidents by status and type', () => {
      cy.get('[data-cy=status-filter]').select('PENDING')
      cy.get('[data-cy=incidents-list]').should('contain', 'Pending')

      cy.get('[data-cy=type-filter]').select('MEDICAL')
      cy.get('[data-cy=incidents-list]').should('contain', 'Medical')

      cy.get('[data-cy=date-range-filter]').should('be.visible')
    })
  })

  context('Creating Incident Reports', () => {
    it('should create a medical incident report', () => {
      cy.get('[data-cy=report-incident-button]').click()
      cy.get('[data-cy=incident-modal]').should('be.visible')

      // Basic incident information
      cy.get('[data-cy=incident-type]').select('MEDICAL')
      cy.get('[data-cy=incident-date]').type('2024-10-01')
      cy.get('[data-cy=incident-time]').type('14:30')
      cy.get('[data-cy=incident-location]').type('School Gymnasium')
      cy.get('[data-cy=incident-description]').type('Student experienced an asthma attack during PE class')

      // Student involved
      cy.get('[data-cy=student-search]').type('John Doe')
      cy.get('[data-cy=student-select]').click()

      // Severity and immediate actions
      cy.get('[data-cy=severity-select]').select('MODERATE')
      cy.get('[data-cy=immediate-actions]').type('Administered inhaler, monitored breathing, called parent')

      cy.get('[data-cy=save-incident-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Incident report created successfully')
    })

    it('should create an injury incident report', () => {
      cy.get('[data-cy=report-incident-button]').click()

      cy.get('[data-cy=incident-type]').select('INJURY')
      cy.get('[data-cy=incident-date]').type('2024-10-02')
      cy.get('[data-cy=incident-time]').type('10:15')
      cy.get('[data-cy=incident-location]').type('Playground')
      cy.get('[data-cy=incident-description]').type('Student fell from monkey bars, possible wrist injury')

      cy.get('[data-cy=student-search]').type('Jane Smith')
      cy.get('[data-cy=student-select]').click()

      cy.get('[data-cy=severity-select]').select('MINOR')
      cy.get('[data-cy=immediate-actions]').type('Applied ice pack, immobilized wrist, sent to nurse office')

      // Add injury details
      cy.get('[data-cy=injury-details-section]').should('be.visible')
      cy.get('[data-cy=injury-type]').select('SPRAIN')
      cy.get('[data-cy=body-part]').select('WRIST')
      cy.get('[data-cy=pain-level]').select('4')

      cy.get('[data-cy=save-incident-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Injury report created successfully')
    })

    it('should create an allergic reaction incident report', () => {
      cy.get('[data-cy=report-incident-button]').click()

      cy.get('[data-cy=incident-type]').select('ALLERGIC_REACTION')
      cy.get('[data-cy=incident-date]').type('2024-10-03')
      cy.get('[data-cy=incident-time]').type('12:45')
      cy.get('[data-cy=incident-location]').type('Cafeteria')
      cy.get('[data-cy=incident-description]').type('Student exposed to peanuts, severe allergic reaction')

      cy.get('[data-cy=student-search]').type('Mike Johnson')
      cy.get('[data-cy=student-select]').click()

      cy.get('[data-cy=severity-select]').select('SEVERE')
      cy.get('[data-cy=immediate-actions]').type('Administered EpiPen, called 911, monitored vital signs')

      // Add allergic reaction details
      cy.get('[data-cy=allergen-input]').type('Peanuts')
      cy.get('[data-cy=reaction-symptoms]').type('Hives, swelling, difficulty breathing')
      cy.get('[data-cy=treatment-given]').type('EpiPen injection, antihistamine')

      cy.get('[data-cy=save-incident-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Allergic reaction report created')
    })

    it('should validate required fields when creating incidents', () => {
      cy.get('[data-cy=report-incident-button]').click()

      cy.get('[data-cy=save-incident-button]').click()

      cy.get('[data-cy=error-message]').should('contain', 'Incident type is required')
      cy.get('[data-cy=error-message]').should('contain', 'Date and time are required')
      cy.get('[data-cy=error-message]').should('contain', 'Student selection is required')
      cy.get('[data-cy=error-message]').should('contain', 'Description is required')
    })
  })

  context('Managing Incident Reports', () => {
    it('should display incident details with complete information', () => {
      cy.get('[data-cy=incident-item]').first().click()
      cy.get('[data-cy=incident-details]').should('be.visible')

      cy.get('[data-cy=incident-header]').should('be.visible')
      cy.get('[data-cy=incident-timeline]').should('be.visible')
      cy.get('[data-cy=witness-statements-section]').should('be.visible')
      cy.get('[data-cy=followup-actions-section]').should('be.visible')
      cy.get('[data-cy=attachments-section]').should('be.visible')
    })

    it('should allow updating incident status and adding notes', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=edit-incident-button]').click()
      cy.get('[data-cy=incident-status]').select('UNDER_REVIEW')
      cy.get('[data-cy=additional-notes]').type('Follow-up appointment scheduled with pediatrician')

      cy.get('[data-cy=save-incident-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Incident updated successfully')
    })

    it('should allow adding witness statements', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=add-witness-button]').click()
      cy.get('[data-cy=witness-modal]').should('be.visible')

      cy.get('[data-cy=witness-name]').type('Teacher Smith')
      cy.get('[data-cy=witness-role]').select('TEACHER')
      cy.get('[data-cy=witness-statement]').type('I saw the student fall and immediately went to help')
      cy.get('[data-cy=witness-contact]').type('teacher.smith@school.edu')

      cy.get('[data-cy=save-witness-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Witness statement added')
    })
  })

  context('Follow-up Actions and Resolution', () => {
    it('should allow adding follow-up actions', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=add-followup-button]').click()
      cy.get('[data-cy=followup-modal]').should('be.visible')

      cy.get('[data-cy=followup-action]').type('Schedule follow-up appointment')
      cy.get('[data-cy=followup-assigned-to]').select('School Nurse')
      cy.get('[data-cy=followup-due-date]').type('2024-10-15')
      cy.get('[data-cy=followup-priority]').select('HIGH')
      cy.get('[data-cy=followup-notes]').type('Parent requested follow-up on injury')

      cy.get('[data-cy=save-followup-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Follow-up action added')
    })

    it('should track follow-up action completion', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=followup-item]').first().within(() => {
        cy.get('[data-cy=mark-complete-button]').click()
        cy.get('[data-cy=completion-notes]').type('Appointment completed, student cleared to return')
      })

      cy.get('[data-cy=confirm-complete-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Follow-up action completed')
    })

    it('should allow updating follow-up action status', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=followup-item]').first().within(() => {
        cy.get('[data-cy=edit-followup-button]').click()
      })

      cy.get('[data-cy=followup-status]').select('IN_PROGRESS')
      cy.get('[data-cy=followup-progress-notes]').type('Called parent to schedule appointment')

      cy.get('[data-cy=save-followup-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Follow-up action updated')
    })
  })

  context('Parent Notifications and Communication', () => {
    it('should record parent notifications', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=parent-notification-section]').should('be.visible')
      cy.get('[data-cy=notify-parent-button]').click()

      cy.get('[data-cy=notification-modal]').should('be.visible')
      cy.get('[data-cy=notification-method]').select('PHONE')
      cy.get('[data-cy=notification-time]').type('15:30')
      cy.get('[data-cy=parent-contacted]').type('Jane Doe')
      cy.get('[data-cy=notification-summary]').type('Discussed incident details and follow-up care')

      cy.get('[data-cy=save-notification-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Parent notification recorded')
    })

    it('should generate parent notification letters', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=generate-letter-button]').click()
      cy.get('[data-cy=letter-modal]').should('be.visible')

      cy.get('[data-cy=letter-template]').select('INCIDENT_NOTIFICATION')
      cy.get('[data-cy=include-details]').check()
      cy.get('[data-cy=include-followup]').check()

      cy.get('[data-cy=generate-letter-button]').click()
      cy.get('[data-cy=letter-preview]').should('be.visible')
      cy.get('[data-cy=download-letter-button]').should('be.visible')
    })
  })

  context('Attachments and Evidence Management', () => {
    it('should allow uploading incident photos', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=attachments-section]').should('be.visible')
      cy.get('[data-cy=add-attachment-button]').click()

      // Upload photo
      const fileName = 'incident-photo.jpg'
      cy.fixture(fileName).then(fileContent => {
        cy.get('[data-cy=file-upload]').upload({ fileContent, fileName, mimeType: 'image/jpeg' })
      })

      cy.get('[data-cy=attachment-description]').type('Photo of injury location')
      cy.get('[data-cy=attachment-type]').select('PHOTO')

      cy.get('[data-cy=save-attachment-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Attachment uploaded successfully')
    })

    it('should allow adding medical reports as attachments', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=add-attachment-button]').click()

      // Upload medical report
      const fileName = 'medical-report.pdf'
      cy.fixture(fileName).then(fileContent => {
        cy.get('[data-cy=file-upload]').upload({ fileContent, fileName, mimeType: 'application/pdf' })
      })

      cy.get('[data-cy=attachment-description]').type('ER discharge summary')
      cy.get('[data-cy=attachment-type]').select('MEDICAL_REPORT')

      cy.get('[data-cy=save-attachment-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Medical report attached')
    })

    it('should display attachment thumbnails and metadata', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=attachment-item]').should('be.visible')
      cy.get('[data-cy=attachment-thumbnail]').should('be.visible')
      cy.get('[data-cy=attachment-name]').should('be.visible')
      cy.get('[data-cy=attachment-size]').should('be.visible')
      cy.get('[data-cy=attachment-upload-date]').should('be.visible')
    })
  })

  context('Incident Search and Filtering', () => {
    it('should allow searching incidents by student name', () => {
      cy.get('[data-cy=incident-search]').type('John Doe')
      cy.get('[data-cy=incidents-list]').should('contain', 'John Doe')
    })

    it('should filter incidents by date range', () => {
      cy.get('[data-cy=date-from-filter]').type('2024-09-01')
      cy.get('[data-cy=date-to-filter]').type('2024-09-30')
      cy.get('[data-cy=apply-filters-button]').click()

      cy.get('[data-cy=incidents-list]').should('be.visible')
    })

    it('should filter incidents by severity level', () => {
      cy.get('[data-cy=severity-filter]').select('SEVERE')
      cy.get('[data-cy=incidents-list]').should('contain', 'Severe')
    })

    it('should show incidents requiring follow-up', () => {
      cy.get('[data-cy=show-followup-only]').check()
      cy.get('[data-cy=incidents-list]').should('contain', 'Follow-up Required')
    })
  })

  context('Compliance and Reporting', () => {
    it('should generate incident summary reports', () => {
      cy.get('[data-cy=reports-menu]').click()
      cy.get('[data-cy=incident-summary-report]').click()

      cy.get('[data-cy=report-filters]').should('be.visible')
      cy.get('[data-cy=report-date-range]').should('be.visible')
      cy.get('[data-cy=report-incident-types]').should('be.visible')

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=report-results]').should('be.visible')
      cy.get('[data-cy=export-report-button]').should('be.visible')
    })

    it('should track OSHA reportable incidents', () => {
      cy.get('[data-cy=reports-menu]').click()
      cy.get('[data-cy=osha-report]').click()

      cy.get('[data-cy=osha-filters]').should('be.visible')
      cy.get('[data-cy=osha-incident-types]').should('be.visible')

      cy.get('[data-cy=generate-osha-report]').click()
      cy.get('[data-cy=osha-form-300]').should('be.visible')
    })

    it('should maintain incident audit trail', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=audit-trail-tab]').click()
      cy.get('[data-cy=audit-entries]').should('be.visible')

      cy.get('[data-cy=audit-entries]').should('contain', 'Created by')
      cy.get('[data-cy=audit-entries]').should('contain', 'Updated by')
      cy.get('[data-cy=audit-entries]').should('contain', 'Status changed')
    })
  })

  context('Emergency Response Integration', () => {
    it('should integrate with emergency services', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=emergency-integration-section]').should('be.visible')
      cy.get('[data-cy=ems-notification-status]').should('be.visible')
      cy.get('[data-cy=emergency-contacts-notified]').should('be.visible')
    })

    it('should track emergency response times', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=response-times-section]').should('be.visible')
      cy.get('[data-cy=ems-response-time]').should('be.visible')
      cy.get('[data-cy=hospital-arrival-time]').should('be.visible')
      cy.get('[data-cy=treatment-start-time]').should('be.visible')
    })
  })

  context('Insurance and Claims Management', () => {
    it('should track insurance claim information', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=insurance-section]').should('be.visible')
      cy.get('[data-cy=claim-status]').should('be.visible')
      cy.get('[data-cy=claim-number]').should('be.visible')
      cy.get('[data-cy=insurance-provider]').should('be.visible')
    })

    it('should allow updating claim status', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=edit-claim-button]').click()
      cy.get('[data-cy=claim-status]').select('SUBMITTED')
      cy.get('[data-cy=claim-number]').type('CL-2024-001')
      cy.get('[data-cy=claim-amount]').type('1500.00')

      cy.get('[data-cy=save-claim-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Insurance claim updated')
    })
  })

  context('Data Privacy and Security', () => {
    it('should protect sensitive incident information', () => {
      cy.get('[data-cy=incident-item]').first().click()

      // Verify FERPA compliance indicators
      cy.get('[data-cy=ferpa-compliance-badge]').should('be.visible')
      cy.get('[data-cy=access-restrictions]').should('be.visible')
      cy.get('[data-cy=confidentiality-level]').should('be.visible')
    })

    it('should log all incident report access', () => {
      cy.get('[data-cy=incident-item]').first().click()

      cy.get('[data-cy=access-log-link]').click()
      cy.get('[data-cy=access-log-modal]').should('be.visible')

      cy.get('[data-cy=access-log-entries]').should('be.visible')
      cy.get('[data-cy=access-log-entries]').should('contain', 'Nurse accessed incident report')
    })
  })
})

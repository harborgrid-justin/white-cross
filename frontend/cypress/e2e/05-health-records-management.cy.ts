/// <reference types="cypress" />

/**
 * Health Records Management E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates the complete health records management workflow including
 * creating, viewing, updating, and managing student health records, vitals,
 * allergies, chronic conditions, and vaccination records.
 */

describe('Health Records Management', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.navigateTo('health-records')
  })

  context('Health Records Overview', () => {
    it('should display health records dashboard with student list', () => {
      cy.get('[data-cy=health-records-title]').should('be.visible')
      cy.get('[data-cy=students-list]').should('be.visible')
      cy.get('[data-cy=health-stats]').should('be.visible')
      cy.get('[data-cy=recent-records]').should('be.visible')
    })

    it('should allow searching and filtering students', () => {
      cy.get('[data-cy=student-search]').type('John')
      cy.get('[data-cy=student-results]').should('contain', 'John')

      cy.get('[data-cy=grade-filter]').select('10')
      cy.get('[data-cy=student-results]').should('contain', 'Grade 10')
    })

    it('should display health statistics correctly', () => {
      cy.get('[data-cy=total-students-stat]').should('contain', 'Total Students')
      cy.get('[data-cy=active-allergies-stat]').should('contain', 'Active Allergies')
      cy.get('[data-cy=chronic-conditions-stat]').should('contain', 'Chronic Conditions')
      cy.get('[data-cy=recent-checkups-stat]').should('contain', 'Recent Checkups')
    })
  })

  context('Creating Health Records', () => {
    it('should create a new physical examination record', () => {
      cy.get('[data-cy=create-record-button]').click()
      cy.get('[data-cy=record-modal]').should('be.visible')

      cy.get('[data-cy=record-type]').select('PHYSICAL_EXAM')
      cy.get('[data-cy=record-date]').type('2024-10-01')
      cy.get('[data-cy=record-description]').type('Annual physical examination')
      cy.get('[data-cy=record-provider]').type('Dr. Smith')

      // Add vital signs
      cy.get('[data-cy=vitals-section]').should('be.visible')
      cy.get('[data-cy=height-input]').type('175')
      cy.get('[data-cy=weight-input]').type('70')
      cy.get('[data-cy=temperature-input]').type('98.6')
      cy.get('[data-cy=blood-pressure-systolic]').type('120')
      cy.get('[data-cy=blood-pressure-diastolic]').type('80')
      cy.get('[data-cy=heart-rate-input]').type('72')

      cy.get('[data-cy=save-record-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Health record created successfully')
    })

    it('should create a vaccination record', () => {
      cy.get('[data-cy=create-record-button]').click()

      cy.get('[data-cy=record-type]').select('VACCINATION')
      cy.get('[data-cy=record-date]').type('2024-09-15')
      cy.get('[data-cy=record-description]').type('Annual flu vaccination')
      cy.get('[data-cy=record-provider]').type('School Nurse')

      cy.get('[data-cy=save-record-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Vaccination record created')
    })

    it('should validate required fields when creating records', () => {
      cy.get('[data-cy=create-record-button]').click()

      cy.get('[data-cy=save-record-button]').click()

      cy.get('[data-cy=error-message]').should('contain', 'Student selection is required')
      cy.get('[data-cy=error-message]').should('contain', 'Record type is required')
      cy.get('[data-cy=error-message]').should('contain', 'Date is required')
    })
  })

  context('Viewing and Managing Health Records', () => {
    it('should display student health records with complete information', () => {
      cy.get('[data-cy=student-card]').first().click()
      cy.get('[data-cy=student-health-profile]').should('be.visible')

      cy.get('[data-cy=health-records-list]').should('be.visible')
      cy.get('[data-cy=allergies-section]').should('be.visible')
      cy.get('[data-cy=chronic-conditions-section]').should('be.visible')
      cy.get('[data-cy=vaccinations-section]').should('be.visible')
      cy.get('[data-cy=vitals-history]').should('be.visible')
    })

    it('should allow filtering records by type and date range', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=record-type-filter]').select('PHYSICAL_EXAM')
      cy.get('[data-cy=health-records-list]').should('contain', 'Physical Exam')

      cy.get('[data-cy=date-from-filter]').type('2024-01-01')
      cy.get('[data-cy=date-to-filter]').type('2024-12-31')
      cy.get('[data-cy=apply-filters-button]').click()
    })

    it('should display vital signs with BMI calculation', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=vitals-section]').within(() => {
        cy.get('[data-cy=height-value]').should('be.visible')
        cy.get('[data-cy=weight-value]').should('be.visible')
        cy.get('[data-cy=bmi-value]').should('be.visible')
        cy.get('[data-cy=blood-pressure-value]').should('be.visible')
        cy.get('[data-cy=heart-rate-value]').should('be.visible')
      })
    })
  })

  context('Allergies Management', () => {
    it('should add a new allergy record', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=add-allergy-button]').click()
      cy.get('[data-cy=allergy-modal]').should('be.visible')

      cy.get('[data-cy=allergen-input]').type('Peanuts')
      cy.get('[data-cy=severity-select]').select('LIFE_THREATENING')
      cy.get('[data-cy=reaction-input]').type('Anaphylaxis, hives, swelling')
      cy.get('[data-cy=treatment-input]').type('EpiPen, antihistamines')
      cy.get('[data-cy=verified-checkbox]').check()

      cy.get('[data-cy=save-allergy-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Allergy added successfully')
    })

    it('should edit existing allergy information', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=allergy-item]').first().within(() => {
        cy.get('[data-cy=edit-allergy-button]').click()
      })

      cy.get('[data-cy=allergy-modal]').should('be.visible')
      cy.get('[data-cy=severity-select]').select('SEVERE')
      cy.get('[data-cy=notes-input]').type('Updated allergy information')

      cy.get('[data-cy=save-allergy-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Allergy updated successfully')
    })

    it('should delete allergy records with confirmation', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=allergy-item]').first().within(() => {
        cy.get('[data-cy=delete-allergy-button]').click()
      })

      cy.get('[data-cy=confirm-delete-modal]').should('be.visible')
      cy.get('[data-cy=confirm-delete-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Allergy deleted successfully')
    })
  })

  context('Chronic Conditions Management', () => {
    it('should add a new chronic condition', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=add-condition-button]').click()
      cy.get('[data-cy=condition-modal]').should('be.visible')

      cy.get('[data-cy=condition-input]').type('Asthma')
      cy.get('[data-cy=diagnosed-date]').type('2023-06-15')
      cy.get('[data-cy=condition-status]').select('ACTIVE')
      cy.get('[data-cy=severity-select]').select('MODERATE')
      cy.get('[data-cy=care-plan-input]').type('Daily inhaler use, avoid triggers')
      cy.get('[data-cy=triggers-input]').type('Exercise, pollen, dust')

      cy.get('[data-cy=save-condition-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Chronic condition added successfully')
    })

    it('should update chronic condition status and review dates', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=condition-item]').first().within(() => {
        cy.get('[data-cy=edit-condition-button]').click()
      })

      cy.get('[data-cy=condition-modal]').should('be.visible')
      cy.get('[data-cy=condition-status]').select('MANAGED')
      cy.get('[data-cy=last-review-date]').type('2024-09-15')
      cy.get('[data-cy=next-review-date]').type('2025-03-15')

      cy.get('[data-cy=save-condition-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Chronic condition updated')
    })
  })

  context('Vaccination Records', () => {
    it('should display vaccination history with due dates', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=vaccinations-section]').within(() => {
        cy.get('[data-cy=vaccination-item]').should('be.visible')
        cy.get('[data-cy=vaccination-name]').should('be.visible')
        cy.get('[data-cy=vaccination-date]').should('be.visible')
        cy.get('[data-cy=next-due-date]').should('be.visible')
      })
    })

    it('should add new vaccination records', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=add-vaccination-button]').click()
      cy.get('[data-cy=vaccination-modal]').should('be.visible')

      cy.get('[data-cy=vaccination-name]').type('COVID-19 Booster')
      cy.get('[data-cy=vaccination-date]').type('2024-10-01')
      cy.get('[data-cy=vaccination-provider]').type('School Health Clinic')
      cy.get('[data-cy=batch-number]').type('CVB2024001')
      cy.get('[data-cy=next-due-date]').type('2025-04-01')

      cy.get('[data-cy=save-vaccination-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Vaccination record added')
    })
  })

  context('Growth Chart and Vitals Tracking', () => {
    it('should display growth chart with height and weight trends', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=growth-chart-tab]').click()
      cy.get('[data-cy=growth-chart]').should('be.visible')
      cy.get('[data-cy=height-trend]').should('be.visible')
      cy.get('[data-cy=weight-trend]').should('be.visible')
      cy.get('[data-cy=bmi-trend]').should('be.visible')
    })

    it('should allow manual vital signs entry', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=add-vitals-button]').click()
      cy.get('[data-cy=vitals-modal]').should('be.visible')

      cy.get('[data-cy=vitals-date]').type('2024-10-01')
      cy.get('[data-cy=height-input]').type('175')
      cy.get('[data-cy=weight-input]').type('70')
      cy.get('[data-cy=temperature-input]').type('98.6')
      cy.get('[data-cy=blood-pressure-systolic]').type('118')
      cy.get('[data-cy=blood-pressure-diastolic]').type('78')

      cy.get('[data-cy=save-vitals-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Vital signs recorded')
    })
  })

  context('Health Records Export and Reporting', () => {
    it('should export student health summary', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=export-menu]').click()
      cy.get('[data-cy=export-health-summary]').click()

      cy.get('[data-cy=export-modal]').should('be.visible')
      cy.get('[data-cy=export-format]').select('PDF')
      cy.get('[data-cy=include-allergies]').check()
      cy.get('[data-cy=include-vaccinations]').check()
      cy.get('[data-cy=include-vitals]').check()

      cy.get('[data-cy=generate-export-button]').click()
      cy.get('[data-cy=download-link]').should('be.visible')
    })

    it('should generate health reports for compliance', () => {
      cy.get('[data-cy=reports-menu]').click()
      cy.get('[data-cy=immunization-report]').click()

      cy.get('[data-cy=report-filters]').should('be.visible')
      cy.get('[data-cy=grade-filter]').select('All Grades')
      cy.get('[data-cy=school-year-filter]').type('2024-2025')

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=report-results]').should('be.visible')
      cy.get('[data-cy=export-report-button]').should('be.visible')
    })
  })

  context('Emergency Information and Alerts', () => {
    it('should display emergency information prominently', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=emergency-info-card]').should('be.visible')
      cy.get('[data-cy=emergency-contacts]').should('be.visible')
      cy.get('[data-cy=severe-allergies-alert]').should('be.visible')
      cy.get('[data-cy=current-medications]').should('be.visible')
    })

    it('should allow updating emergency contacts', () => {
      cy.get('[data-cy=student-card]').first().click()

      cy.get('[data-cy=edit-emergency-contacts]').click()
      cy.get('[data-cy=emergency-contact-modal]').should('be.visible')

      cy.get('[data-cy=primary-contact-name]').type('Jane Doe')
      cy.get('[data-cy=primary-contact-phone]').type('(555) 123-4567')
      cy.get('[data-cy=primary-contact-relationship]').type('Mother')

      cy.get('[data-cy=save-emergency-contacts]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Emergency contacts updated')
    })
  })

  context('Data Privacy and Compliance', () => {
    it('should restrict access based on user roles', () => {
      // Test that sensitive health information is only visible to authorized users
      cy.get('[data-cy=student-card]').first().click()

      // Verify HIPAA compliance indicators
      cy.get('[data-cy=hipaa-compliance-badge]').should('be.visible')
      cy.get('[data-cy=last-accessed-timestamp]').should('be.visible')
      cy.get('[data-cy=access-log-link]').should('be.visible')
    })

    it('should log all health record access', () => {
      cy.get('[data-cy=student-card]').first().click()

      // Access audit log
      cy.get('[data-cy=access-log-link]').click()
      cy.get('[data-cy=access-log-modal]').should('be.visible')

      cy.get('[data-cy=access-log-entries]').should('be.visible')
      cy.get('[data-cy=access-log-entries]').should('contain', 'Nurse viewed record')
    })
  })
})

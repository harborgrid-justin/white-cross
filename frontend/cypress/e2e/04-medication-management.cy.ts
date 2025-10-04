/// <reference types="cypress" />

describe('Medication Management', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.navigateTo('medications')
  })

  it('should display the medications page with proper elements', () => {
    cy.get('[data-cy=medications-title]').should('contain', 'Medications')
    cy.get('[data-cy=add-medication-button]').should('be.visible')
    cy.get('[data-cy=medications-search]').should('be.visible')
    cy.get('[data-cy=medications-table]').should('be.visible')
    cy.get('[data-cy=medication-alerts]').should('be.visible')
  })

  it('should allow adding a new medication', () => {
    cy.fixture('medications').then((medications) => {
      const newMedication = medications.inhaler
      
      cy.get('[data-cy=add-medication-button]').click()
      cy.get('[data-cy=medication-modal]').should('be.visible')
      
      cy.get('[data-cy=medication-name]').type(newMedication.name)
      cy.get('[data-cy=medication-dosage]').type(newMedication.dosage)
      cy.get('[data-cy=medication-frequency]').type(newMedication.frequency)
      cy.get('[data-cy=medication-student-select]').select(newMedication.studentName)
      cy.get('[data-cy=medication-prescribed-by]').type(newMedication.prescribedBy)
      cy.get('[data-cy=medication-start-date]').type(newMedication.startDate)
      cy.get('[data-cy=medication-instructions]').type(newMedication.instructions)
      
      cy.get('[data-cy=save-medication-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Medication added successfully')
      
      // Verify medication appears in the table
      cy.get('[data-cy=medications-table]').should('contain', newMedication.name)
      cy.get('[data-cy=medications-table]').should('contain', newMedication.studentName)
    })
  })

  it('should allow searching for medications', () => {
    cy.fixture('medications').then((medications) => {
      const medication = medications.insulin
      
      // Add a medication first
      cy.addMedication(medication)
      
      // Test search functionality
      cy.get('[data-cy=medications-search]').type(medication.name)
      cy.get('[data-cy=medications-table]').should('contain', medication.name)
      cy.get('[data-cy=medications-table]').should('contain', medication.studentName)
      
      // Clear search
      cy.get('[data-cy=medications-search]').clear()
      cy.get('[data-cy=medications-table]').should('be.visible')
    })
  })

  it('should show medication administration history', () => {
    cy.fixture('medications').then((medications) => {
      const medication = medications.epipen
      
      // Add medication first
      cy.addMedication(medication)
      
      // Click on medication to view details
      cy.get('[data-cy=medications-table]')
        .contains(medication.name)
        .parent('tr')
        .find('[data-cy=view-medication-button]')
        .click()
      
      cy.get('[data-cy=medication-details-modal]').should('be.visible')
      cy.get('[data-cy=administration-history-tab]').click()
      
      // Verify administration history section
      cy.get('[data-cy=administration-history]').should('be.visible')
      cy.get('[data-cy=record-administration-button]').should('be.visible')
    })
  })

  it('should allow recording medication administration', () => {
    cy.fixture('medications').then((medications) => {
      const medication = medications.inhaler
      
      // Add medication first
      cy.addMedication(medication)
      
      // Record administration
      cy.get('[data-cy=medications-table]')
        .contains(medication.name)
        .parent('tr')
        .find('[data-cy=record-administration-button]')
        .click()
      
      cy.get('[data-cy=administration-modal]').should('be.visible')
      cy.get('[data-cy=administration-date]').type('2024-01-15')
      cy.get('[data-cy=administration-time]').type('10:30')
      cy.get('[data-cy=administered-by]').type('School Nurse')
      cy.get('[data-cy=administration-notes]').type('Student had mild breathing difficulty after PE class')
      
      cy.get('[data-cy=save-administration-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Administration recorded successfully')
      
      // Verify administration appears in history
      cy.get('[data-cy=medications-table]')
        .contains(medication.name)
        .parent('tr')
        .find('[data-cy=last-administered]')
        .should('contain', '2024-01-15')
    })
  })

  it('should display medication alerts and warnings', () => {
    cy.fixture('medications').then((medications) => {
      // Add multiple medications to trigger potential interactions
      cy.addMedication(medications.inhaler)
      cy.addMedication(medications.insulin)
      
      // Check for alerts
      cy.get('[data-cy=medication-alerts]').should('be.visible')
      
      // Check for expiration warnings
      cy.get('[data-cy=expiration-alerts]').should('be.visible')
      
      // Check for drug interaction warnings if applicable
      cy.get('[data-cy=interaction-warnings]').should('be.visible')
      
      // Test alert acknowledgment
      cy.get('[data-cy=alert-item]').first().within(() => {
        cy.get('[data-cy=acknowledge-alert-button]').click()
      })
      
      cy.get('[data-cy=success-message]').should('contain', 'Alert acknowledged')
    })
  })

  it('should allow updating medication information', () => {
    cy.fixture('medications').then((medications) => {
      const medication = medications.insulin
      const updatedDosage = '12 units'
      
      // Add medication first
      cy.addMedication(medication)
      
      // Edit medication
      cy.get('[data-cy=medications-table]')
        .contains(medication.name)
        .parent('tr')
        .find('[data-cy=edit-medication-button]')
        .click()
      
      cy.get('[data-cy=medication-modal]').should('be.visible')
      cy.get('[data-cy=medication-dosage]').clear().type(updatedDosage)
      cy.get('[data-cy=save-medication-button]').click()
      
      cy.get('[data-cy=success-message]').should('contain', 'Medication updated successfully')
      
      // Verify updated information
      cy.get('[data-cy=medications-table]').should('contain', updatedDosage)
    })
  })

  it('should handle medication discontinuation', () => {
    cy.fixture('medications').then((medications) => {
      const medication = medications.epipen
      
      // Add medication first
      cy.addMedication(medication)
      
      // Discontinue medication
      cy.get('[data-cy=medications-table]')
        .contains(medication.name)
        .parent('tr')
        .find('[data-cy=discontinue-medication-button]')
        .click()
      
      cy.get('[data-cy=discontinue-modal]').should('be.visible')
      cy.get('[data-cy=discontinue-reason]').select('Completed treatment course')
      cy.get('[data-cy=discontinue-notes]').type('Student no longer requires this medication')
      cy.get('[data-cy=discontinue-date]').type('2024-01-20')
      
      cy.get('[data-cy=confirm-discontinue-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Medication discontinued successfully')
      
      // Verify medication status updated
      cy.get('[data-cy=medications-table]')
        .contains(medication.name)
        .parent('tr')
        .should('contain', 'Discontinued')
    })
  })

  it('should generate medication reports', () => {
    cy.fixture('medications').then((medications) => {
      // Add multiple medications
      cy.addMedication(medications.inhaler)
      cy.addMedication(medications.insulin)
      
      // Generate report
      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=report-modal]').should('be.visible')
      
      // Select report type
      cy.get('[data-cy=report-type]').select('Administration Summary')
      cy.get('[data-cy=report-date-from]').type('2024-01-01')
      cy.get('[data-cy=report-date-to]').type('2024-01-31')
      cy.get('[data-cy=include-discontinued]').check()
      
      cy.get('[data-cy=generate-report-confirm]').click()
      
      // Verify report generation
      cy.get('[data-cy=success-message]').should('contain', 'Report generated successfully')
      cy.get('[data-cy=download-report-button]').should('be.visible')
    })
  })

  it('should handle emergency medication protocols', () => {
    cy.fixture('medications').then((medications) => {
      const emergencyMed = medications.epipen
      
      // Add emergency medication
      cy.addMedication(emergencyMed)
      
      // Mark as emergency medication
      cy.get('[data-cy=medications-table]')
        .contains(emergencyMed.name)
        .parent('tr')
        .find('[data-cy=emergency-protocol-button]')
        .click()
      
      cy.get('[data-cy=emergency-protocol-modal]').should('be.visible')
      cy.get('[data-cy=emergency-indication]').type('Severe allergic reaction')
      cy.get('[data-cy=emergency-steps]').type('1. Call 911\n2. Administer EpiPen\n3. Monitor vital signs')
      cy.get('[data-cy=emergency-contacts]').type('Parent: 555-0128, Doctor: 555-0200')
      
      cy.get('[data-cy=save-emergency-protocol]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Emergency protocol saved')
      
      // Verify emergency indicator
      cy.get('[data-cy=medications-table]')
        .contains(emergencyMed.name)
        .parent('tr')
        .should('contain', 'Emergency')
    })
  })
})

/// <reference types="cypress" />

/**
 * Medication Management: Medication Creation (CRUD - Create) (15 tests)
 *
 * Tests medication creation functionality
 */

describe('Medication Management - Medication Creation (CRUD - Create)', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
    cy.get('[data-testid=medications-tab]').click()
  })

  it('should open medication creation modal', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=add-medication-modal]').should('be.visible')
  })

  it('should display all required fields in creation form', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=medication-name-input]').should('be.visible')
    cy.get('[data-testid=generic-name-input]').should('be.visible')
    cy.get('[data-testid=dosage-form-select]').should('be.visible')
    cy.get('[data-testid=strength-input]').should('be.visible')
    cy.get('[data-testid=manufacturer-input]').should('be.visible')
  })

  it('should successfully create a new medication', () => {
    cy.fixture('medications').then((medications) => {
      const newMedication = medications.testMedications.tylenol

      cy.get('[data-testid=add-medication-button]').click()
      cy.get('[data-testid=medication-name-input]').type(newMedication.name)
      cy.get('[data-testid=generic-name-input]').type(newMedication.genericName)
      cy.get('[data-testid=dosage-form-select]').select(newMedication.dosageForm)
      cy.get('[data-testid=strength-input]').type(newMedication.strength)
      cy.get('[data-testid=manufacturer-input]').type(newMedication.manufacturer)
      cy.get('[data-testid=save-medication-button]').click()

      cy.get('[data-testid=success-toast]').should('be.visible')
    })
  })

  it('should display success message after creation', () => {
    cy.fixture('medications').then((medications) => {
      const newMedication = medications.testMedications.tylenol

      cy.get('[data-testid=add-medication-button]').click()
      cy.get('[data-testid=medication-name-input]').type(newMedication.name)
      cy.get('[data-testid=generic-name-input]').type(newMedication.genericName)
      cy.get('[data-testid=dosage-form-select]').select(newMedication.dosageForm)
      cy.get('[data-testid=strength-input]').type(newMedication.strength)
      cy.get('[data-testid=save-medication-button]').click()

      cy.get('[data-testid=success-toast]').should('contain', 'Medication created successfully')
    })
  })

  it('should close modal after successful creation', () => {
    cy.fixture('medications').then((medications) => {
      const newMedication = medications.testMedications.tylenol

      cy.get('[data-testid=add-medication-button]').click()
      cy.get('[data-testid=medication-name-input]').type(newMedication.name)
      cy.get('[data-testid=generic-name-input]').type(newMedication.genericName)
      cy.get('[data-testid=dosage-form-select]').select(newMedication.dosageForm)
      cy.get('[data-testid=strength-input]').type(newMedication.strength)
      cy.get('[data-testid=save-medication-button]').click()

      cy.get('[data-testid=add-medication-modal]').should('not.exist')
    })
  })

  it('should allow adding NDC number', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=ndc-input]').should('be.visible')
    cy.get('[data-testid=ndc-input]').type('12345-678-90')
    cy.get('[data-testid=ndc-input]').should('have.value', '12345-678-90')
  })

  it('should allow marking medication as controlled substance', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=controlled-substance-checkbox]').check()
    cy.get('[data-testid=controlled-substance-checkbox]').should('be.checked')
  })

  it('should display dosage form options', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=dosage-form-select] option').should('contain', 'Tablet')
    cy.get('[data-testid=dosage-form-select] option').should('contain', 'Capsule')
    cy.get('[data-testid=dosage-form-select] option').should('contain', 'Liquid')
  })

  it('should validate required fields on submission', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=save-medication-button]').click()

    cy.get('[data-testid=name-error]').should('contain', 'Medication name is required')
    cy.get('[data-testid=strength-error]').should('contain', 'Strength is required')
  })

  it('should prevent duplicate NDC numbers', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=medication-name-input]').type('Test Med')
    cy.get('[data-testid=strength-input]').type('500mg')
    cy.get('[data-testid=ndc-input]').type('00002-0064-61')
    cy.get('[data-testid=save-medication-button]').click()

    cy.get('[data-testid=ndc-error]').should('contain', 'NDC number already exists')
  })

  it('should close modal when cancel button is clicked', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=add-medication-modal]').should('be.visible')
    cy.get('[data-testid=cancel-button]').click()
    cy.get('[data-testid=add-medication-modal]').should('not.exist')
  })

  it('should clear form when modal is closed and reopened', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=medication-name-input]').type('Test')
    cy.get('[data-testid=cancel-button]').click()

    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=medication-name-input]').should('have.value', '')
  })

  it('should allow adding medication notes', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=medication-notes]').should('be.visible')
    cy.get('[data-testid=medication-notes]').type('Special handling required')
  })

  it('should display manufacturer field', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=manufacturer-input]').should('be.visible')
  })

  it('should create audit log when medication is created', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.fixture('medications').then((medications) => {
      const newMedication = medications.testMedications.tylenol

      cy.get('[data-testid=add-medication-button]').click()
      cy.get('[data-testid=medication-name-input]').type(newMedication.name)
      cy.get('[data-testid=strength-input]').type(newMedication.strength)
      cy.get('[data-testid=save-medication-button]').click()

      cy.wait('@auditLog', { timeout: 1500 }).its('request.body').should('deep.include', {
        action: 'CREATE_MEDICATION',
        resourceType: 'MEDICATION'
      })
    })
  })
})

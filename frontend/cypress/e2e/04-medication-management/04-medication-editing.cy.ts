/// <reference types="cypress" />

/**
 * Medication Management: Medication Editing (CRUD - Update) (12 tests)
 *
 * Tests medication editing and update functionality
 */

describe('Medication Management - Medication Editing (CRUD - Update)', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
    cy.get('[data-testid=medications-tab]').click()
  })

  it('should open edit modal from medication details', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=edit-medication-button]').click()
    cy.get('[data-testid=medication-form-modal]').should('be.visible')
  })

  it('should populate form with existing medication data', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=edit-medication-button]').click()
    cy.get('[data-testid=medication-name-input]').should('not.have.value', '')
    cy.get('[data-testid=strength-input]').should('not.have.value', '')
  })

  it('should successfully update medication name', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=edit-medication-button]').click()
    cy.get('[data-testid=medication-name-input]').clear().type('Updated Medication Name')
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=success-toast]').should('contain', 'Medication updated')
  })

  it('should successfully update medication strength', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=edit-medication-button]').click()
    cy.get('[data-testid=strength-input]').clear().type('1000mg')
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=success-toast]').should('be.visible')
  })

  it('should successfully update dosage form', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=edit-medication-button]').click()
    cy.get('[data-testid=dosage-form-select]').select('Capsule')
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=success-toast]').should('be.visible')
  })

  it('should successfully update manufacturer', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=edit-medication-button]').click()
    cy.get('[data-testid=manufacturer-input]').clear().type('Updated Manufacturer')
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=success-toast]').should('be.visible')
  })

  it('should preserve data when canceling edit', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=medication-details-title]').invoke('text').as('originalName')
    cy.get('[data-testid=edit-medication-button]').click()
    cy.get('[data-testid=medication-name-input]').clear().type('Should Not Save')
    cy.get('[data-testid=cancel-button]').click()

    cy.get('[data-testid=medication-row]').first().click()
    cy.get('@originalName').then((originalName) => {
      cy.get('[data-testid=medication-details-title]').should('contain', originalName)
    })
  })

  it('should validate NDC uniqueness when editing', () => {
    cy.get('[data-testid=medication-row]').eq(1).click()
    cy.get('[data-testid=edit-medication-button]').click()
    cy.get('[data-testid=ndc-input]').clear().type('00002-0064-61')
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=ndc-error]').should('contain', 'NDC number already exists')
  })

  it('should allow toggling controlled substance status', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=edit-medication-button]').click()
    cy.get('[data-testid=controlled-substance-checkbox]').check()
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=success-toast]').should('be.visible')
  })

  it('should close modal after successful update', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=edit-medication-button]').click()
    cy.get('[data-testid=medication-name-input]').clear().type('Updated')
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=medication-form-modal]').should('not.exist')
  })

  it('should validate required fields when updating', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=edit-medication-button]').click()
    cy.get('[data-testid=medication-name-input]').clear()
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=name-error]').should('contain', 'Medication name is required')
  })

  it('should create audit log when medication is updated', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=edit-medication-button]').click()
    cy.get('[data-testid=medication-name-input]').clear().type('Updated')
    cy.get('[data-testid=save-medication-button]').click()

    cy.wait('@auditLog', { timeout: 1500 }).its('request.body').should('deep.include', {
      action: 'UPDATE_MEDICATION',
      resourceType: 'MEDICATION'
    })
  })
})

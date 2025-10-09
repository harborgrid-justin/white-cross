/// <reference types="cypress" />

/**
 * Medication Management: Prescription Management (15 tests)
 *
 * Tests prescription creation, viewing, and management
 */

describe('Medication Management - Prescription Management', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
    cy.get('[data-testid=medications-tab]').click()
  })

  it('should display prescribe medication button', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=prescribe-button]').should('be.visible')
  })

  it('should open prescription modal', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=prescribe-button]').click()
    cy.get('[data-testid=prescription-modal]').should('be.visible')
  })

  it('should display student selection in prescription form', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=prescribe-button]').click()
    cy.get('[data-testid=student-select]').should('be.visible')
  })

  it('should successfully create prescription', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=prescribe-button]').click()
    cy.get('[data-testid=student-select]').select(1)
    cy.get('[data-testid=dosage-input]').type('1 tablet')
    cy.get('[data-testid=frequency-input]').type('Twice daily')
    cy.get('[data-testid=start-date]').type('2024-11-15')
    cy.get('[data-testid=save-prescription-button]').click()

    cy.get('[data-testid=success-toast]').should('contain', 'Prescription created successfully')
  })

  it('should validate required prescription fields', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=prescribe-button]').click()
    cy.get('[data-testid=save-prescription-button]').click()

    cy.get('[data-testid=student-error]').should('contain', 'Student is required')
    cy.get('[data-testid=dosage-error]').should('contain', 'Dosage is required')
  })

  it('should allow setting prescription duration', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=prescribe-button]').click()
    cy.get('[data-testid=duration-input]').type('30')
    cy.get('[data-testid=duration-unit]').select('days')
  })

  it('should allow adding prescription instructions', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=prescribe-button]').click()
    cy.get('[data-testid=instructions-input]').type('Take with food')
    cy.get('[data-testid=instructions-input]').should('have.value', 'Take with food')
  })

  it('should display active prescriptions list', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=active-prescriptions-tab]').click()
    cy.get('[data-testid=prescriptions-list]').should('be.visible')
  })

  it('should allow viewing prescription details', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=active-prescriptions-tab]').click()
    cy.get('[data-testid=prescription-item]').first().click()
    cy.get('[data-testid=prescription-details]').should('be.visible')
  })

  it('should allow discontinuing prescription', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=active-prescriptions-tab]').click()
    cy.get('[data-testid=prescription-item]').first().within(() => {
      cy.get('[data-testid=discontinue-button]').click()
    })

    cy.get('[data-testid=discontinue-reason]').type('Treatment completed')
    cy.get('[data-testid=confirm-discontinue-button]').click()
    cy.get('[data-testid=success-toast]').should('contain', 'Prescription discontinued')
  })

  it('should display prescription history', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=prescription-history-tab]').click()
    cy.get('[data-testid=prescription-history-list]').should('be.visible')
  })

  it('should allow renewing expired prescription', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=prescription-history-tab]').click()
    cy.get('[data-testid=expired-prescription]').first().within(() => {
      cy.get('[data-testid=renew-button]').click()
    })

    cy.get('[data-testid=prescription-modal]').should('be.visible')
  })

  it('should validate prescription date range', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=prescribe-button]').click()
    cy.get('[data-testid=student-select]').select(1)
    cy.get('[data-testid=start-date]').type('2024-12-01')
    cy.get('[data-testid=end-date]').type('2024-11-01')
    cy.get('[data-testid=save-prescription-button]').click()

    cy.get('[data-testid=date-error]').should('contain', 'End date must be after start date')
  })

  it('should display prescriber information', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=active-prescriptions-tab]').click()
    cy.get('[data-testid=prescription-item]').first().within(() => {
      cy.get('[data-testid=prescriber-name]').should('be.visible')
    })
  })

  it('should check for drug interactions', () => {
    cy.intercept('POST', '/api/check-interactions').as('checkInteractions')

    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=prescribe-button]').click()
    cy.get('[data-testid=student-select]').select(1)

    cy.wait('@checkInteractions')
    cy.get('[data-testid=interaction-warning]').should('exist')
  })
})

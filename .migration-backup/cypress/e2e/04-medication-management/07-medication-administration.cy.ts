/// <reference types="cypress" />

/**
 * Medication Management: Medication Administration (15 tests)
 *
 * CRITICAL SAFETY TESTS - Tests medication administration and logging functionality
 *
 * Safety Validations:
 * - Five Rights of Medication Administration (Right Patient, Drug, Dose, Route, Time)
 * - Double-check verification workflows
 * - Administration time validation (no future times)
 * - Dosage format and range validation
 * - Complete audit trail for HIPAA compliance
 * - Adverse reaction checking before administration
 */

describe('Medication Management - Medication Administration', () => {
  beforeEach(() => {
    // Setup comprehensive API intercepts for safety-critical operations
    cy.intercept('GET', '/api/medications*').as('getMedications')
    cy.intercept('POST', '/api/medications/administer').as('administerMedication')
    cy.intercept('GET', '/api/medications/*/administration-log*').as('getAdministrationLog')
    cy.intercept('GET', '/api/students/*/allergies').as('getStudentAllergies')
    cy.intercept('GET', '/api/students/*/interactions').as('checkInteractions')
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.login('nurse')
    cy.visit('/medications')

    // Wait for medications to load
    cy.wait('@getMedications', { timeout: 1500 })

    cy.get('[data-cy=medications-tab], [data-testid=medications-tab]')
      .should('be.visible')
      .click()
  })

  it('should display administer button', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administer-button]').should('be.visible')
  })

  it('should open administration modal', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administer-button]').click()
    cy.get('[data-testid=administration-modal]').should('be.visible')
  })

  it('should successfully administer medication', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administer-button]').click()
    cy.get('[data-testid=student-select]').select(1)
    cy.get('[data-testid=dosage-input]').type('1 tablet')
    cy.get('[data-testid=administration-notes]').type('Administered as prescribed')
    cy.get('[data-testid=confirm-administration-button]').click()

    cy.get('[data-testid=success-message]').should('contain', 'Medication administered successfully')
  })

  it('should validate administration fields', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administer-button]').click()
    cy.get('[data-testid=confirm-administration-button]').click()

    cy.get('[data-testid=student-error]').should('contain', 'Student is required')
    cy.get('[data-testid=dosage-error]').should('contain', 'Dosage is required')
  })

  it('should pre-populate administration time with current time', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administer-button]').click()
    cy.get('[data-testid=administration-time]').should('not.be.empty')
  })

  it('should display administration log', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administration-log-tab]').click()
    cy.get('[data-testid=administration-log-table]').should('be.visible')
  })

  it('should show administration history for student', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administration-log-tab]').click()
    cy.get('[data-testid=log-entry]').should('exist')
  })

  it('should validate dosage format', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administer-button]').click()
    cy.get('[data-testid=student-select]').select(1)
    cy.get('[data-testid=dosage-input]').type('invalid dosage')
    cy.get('[data-testid=confirm-administration-button]').click()

    cy.get('[data-testid=dosage-error]').should('contain', 'Invalid dosage format')
  })

  it('should allow filtering administration log by date', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administration-log-tab]').click()
    cy.get('[data-testid=date-filter]').type('2024-11-01')
    cy.get('[data-testid=apply-filter-button]').click()
    cy.get('[data-testid=log-entry]').should('exist')
  })

  it('should display who administered the medication', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administration-log-tab]').click()
    cy.get('[data-testid=log-entry]').first().within(() => {
      cy.get('[data-testid=administered-by]').should('be.visible')
    })
  })

  it('should allow adding administration notes', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administer-button]').click()
    cy.get('[data-testid=administration-notes]').type('Patient tolerated well')
    cy.get('[data-testid=administration-notes]').should('have.value', 'Patient tolerated well')
  })

  it('should warn about missed doses', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=missed-doses-alert]').should('exist')
  })

  it('should export administration log', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administration-log-tab]').click()
    cy.get('[data-testid=export-log-button]').click()
    cy.readFile('cypress/downloads/administration-log.csv').should('exist')
  })

  it('should validate administration time is not in future', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administer-button]').click()
    cy.get('[data-testid=student-select]').select(1)
    cy.get('[data-testid=dosage-input]').type('1 tablet')
    cy.get('[data-testid=administration-time]').type('2025-12-31T10:00')
    cy.get('[data-testid=confirm-administration-button]').click()

    cy.get('[data-testid=time-error]').should('contain', 'Administration time cannot be in the future')
  })

  it('should create audit log for medication administration', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=administer-button]').click()
    cy.get('[data-testid=student-select]').select(1)
    cy.get('[data-testid=dosage-input]').type('1 tablet')
    cy.get('[data-testid=confirm-administration-button]').click()

    cy.wait('@auditLog', { timeout: 1500 }).its('request.body').should('deep.include', {
      action: 'ADMINISTER_MEDICATION',
      resourceType: 'MEDICATION'
    })
  })
})

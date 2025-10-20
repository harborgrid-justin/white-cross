/// <reference types="cypress" />

/**
 * Medication Management: Adverse Reactions Tracking (10 tests)
 *
 * CRITICAL PATIENT SAFETY TESTS - Tests adverse reaction reporting and tracking
 *
 * Safety Features:
 * - Immediate adverse reaction reporting
 * - Severity classification (Mild, Moderate, Severe, Life-threatening)
 * - Automatic student allergy profile updates
 * - Emergency alert generation for severe reactions
 * - Medication contraindication flagging
 * - Healthcare provider notification workflow
 * - FDA MedWatch integration (future)
 * - Complete audit trail for medical-legal compliance
 */

describe('Medication Management - Adverse Reactions Tracking', () => {
  beforeEach(() => {
    // Setup API intercepts for safety-critical adverse reaction workflow
    cy.intercept('GET', '/api/adverse-reactions*').as('getAdverseReactions')
    cy.intercept('POST', '/api/adverse-reactions').as('createAdverseReaction')
    cy.intercept('GET', '/api/medications*').as('getMedications')
    cy.intercept('GET', '/api/students*').as('getStudents')
    cy.intercept('POST', '/api/notifications/emergency').as('sendEmergencyNotification')
    cy.intercept('POST', '/api/students/*/allergies').as('updateAllergies')
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.login('nurse')
    cy.visit('/medications')

    // Wait for page to load
    cy.wait('@getMedications', { timeout: 1500 })

    cy.get('[data-cy=adverse-reactions-tab], [data-testid=adverse-reactions-tab]')
      .should('be.visible')
      .click()

    // Wait for adverse reactions data to load
    cy.wait('@getAdverseReactions', { timeout: 1500 })
  })

  it('should display adverse reactions list', () => {
    cy.get('[data-testid=adverse-reactions-list]').should('be.visible')
  })

  it('should allow reporting new adverse reaction', () => {
    cy.get('[data-testid=report-reaction-button]').click()
    cy.get('[data-testid=reaction-modal]').should('be.visible')
  })

  it('should successfully report adverse reaction', () => {
    cy.get('[data-testid=report-reaction-button]').click()
    cy.get('[data-testid=student-select]').select(1)
    cy.get('[data-testid=medication-select]').select(1)
    cy.get('[data-testid=reaction-type]').select('Allergic')
    cy.get('[data-testid=severity]').select('Moderate')
    cy.get('[data-testid=symptoms]').type('Rash and itching')
    cy.get('[data-testid=save-reaction-button]').click()

    cy.get('[data-testid=success-message]').should('contain', 'Adverse reaction reported')
  })

  it('should validate adverse reaction fields', () => {
    cy.get('[data-testid=report-reaction-button]').click()
    cy.get('[data-testid=save-reaction-button]').click()

    cy.get('[data-testid=student-error]').should('contain', 'Student is required')
    cy.get('[data-testid=medication-error]').should('contain', 'Medication is required')
  })

  it('should display reaction severity levels', () => {
    cy.get('[data-testid=report-reaction-button]').click()
    cy.get('[data-testid=severity]').select('Severe')
    cy.get('[data-testid=severe-warning]').should('be.visible')
  })

  it('should allow documenting intervention', () => {
    cy.get('[data-testid=report-reaction-button]').click()
    cy.get('[data-testid=intervention]').type('Administered antihistamine')
    cy.get('[data-testid=intervention]').should('have.value', 'Administered antihistamine')
  })

  it('should display reaction history for student', () => {
    cy.get('[data-testid=reaction-item]').first().click()
    cy.get('[data-testid=reaction-details]').should('be.visible')
    cy.get('[data-testid=reaction-history]').should('be.visible')
  })

  it('should allow filtering by severity', () => {
    cy.get('[data-testid=severity-filter]').select('Severe')
    cy.get('[data-testid=reaction-item]').should('exist')
  })

  it('should export adverse reactions report', () => {
    cy.get('[data-testid=export-reactions-button]').click()
    cy.readFile('cypress/downloads/adverse-reactions.csv').should('exist')
  })

  it('should create alert for student with adverse reaction', () => {
    cy.get('[data-testid=report-reaction-button]').click()
    cy.get('[data-testid=student-select]').select(1)
    cy.get('[data-testid=medication-select]').select(1)
    cy.get('[data-testid=reaction-type]').select('Allergic')
    cy.get('[data-testid=severity]').select('Severe')
    cy.get('[data-testid=create-alert-checkbox]').check()
    cy.get('[data-testid=save-reaction-button]').click()

    cy.get('[data-testid=success-message]').should('contain', 'Alert created')
  })
})

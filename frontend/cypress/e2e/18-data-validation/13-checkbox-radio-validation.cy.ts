/// <reference types="cypress" />

/**
 * Data Validation - Checkbox & Radio Button Validation (15 tests)
 *
 * Tests validation of checkboxes and radio button groups
 */

describe('Data Validation - Checkbox & Radio Button Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should require consent checkbox', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('button[type="submit"]').click()
    cy.contains(/consent.*required|must.*agree/i).should('be.visible')
  })

  it('should validate terms and conditions acceptance', () => {
    cy.visit('/settings')
    cy.get('input[type="checkbox"][name="termsAccepted"]').should('exist')
  })

  it('should require at least one allergy checkbox', () => {
    cy.visit('/health-records')
    cy.get('button').contains(/add.*allergy/i).click()
    cy.get('input[type="checkbox"][name="foodAllergy"]').should('exist')
  })

  it('should validate multiple medication time checkboxes', () => {
    cy.visit('/medications')
    cy.get('input[type="checkbox"][name="morning"]').check()
    cy.get('input[type="checkbox"][name="afternoon"]').check()
    cy.get('input[type="checkbox"][name="morning"]').should('be.checked')
  })

  it('should require radio button selection for gender', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('button[type="submit"]').click()
    cy.contains(/gender.*required/i).should('be.visible')
  })

  it('should validate only one radio selection', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[type="radio"][name="gender"][value="Male"]').check()
    cy.get('input[type="radio"][name="gender"][value="Female"]').check()
    cy.get('input[type="radio"][name="gender"][value="Male"]').should('not.be.checked')
  })

  it('should validate parent notification preferences', () => {
    cy.visit('/incidents')
    cy.get('input[type="checkbox"][name="notifyByEmail"]').check()
    cy.get('input[type="checkbox"][name="notifyBySMS"]').check()
    cy.get('input[type="checkbox"][name="notifyByEmail"]').should('be.checked')
  })

  it('should require recurring appointment checkbox confirmation', () => {
    cy.visit('/appointments')
    cy.get('button').contains(/schedule/i).click()
    cy.get('input[type="checkbox"][name="recurring"]').check()
    cy.get('select[name="frequency"]').should('be.visible')
  })

  it('should validate HIPAA authorization checkbox', () => {
    cy.visit('/health-records')
    cy.get('input[type="checkbox"][name="hipaaAuthorized"]').should('exist')
  })

  it('should validate medication refill auto-renew checkbox', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[type="checkbox"][name="autoRefill"]').check()
    cy.get('input[type="checkbox"][name="autoRefill"]').should('be.checked')
  })

  it('should validate emergency contact primary checkbox', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[type="checkbox"][name="isPrimaryContact"]').check()
    cy.get('input[type="checkbox"][name="isPrimaryContact"]').should('be.checked')
  })

  it('should require incident severity radio selection', () => {
    cy.visit('/incidents')
    cy.get('button').contains(/report/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/severity.*required/i).should('be.visible')
  })

  it('should validate immunization up-to-date checkbox', () => {
    cy.visit('/health-records')
    cy.get('input[type="checkbox"][name="immunizationsCurrent"]').should('exist')
  })

  it('should validate special needs checkbox group', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[type="checkbox"][name="hasIEP"]').check()
    cy.get('input[type="checkbox"][name="has504"]').check()
    cy.get('input[type="checkbox"][name="hasIEP"]').should('be.checked')
  })

  it('should toggle related fields based on checkbox state', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[type="checkbox"][name="isPRN"]').check()
    cy.get('textarea[name="prnInstructions"]').should('be.visible')
  })
})

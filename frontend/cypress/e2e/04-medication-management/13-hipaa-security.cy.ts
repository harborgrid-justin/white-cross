/// <reference types="cypress" />

/**
 * Medication Management: HIPAA Compliance & Security (10 tests)
 *
 * Tests HIPAA compliance and security features
 */

describe('Medication Management - HIPAA Compliance & Security', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
  })

  it('should require authentication to access medications', () => {
    cy.clearCookies()
    cy.visit('/medications')
    cy.url().should('include', '/login')
  })

  it('should create audit log when viewing medications', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.visit('/medications')

    cy.wait('@auditLog').its('request.body').should('deep.include', {
      action: 'VIEW_MEDICATIONS',
      resourceType: 'MEDICATION'
    })
  })

  it('should mask sensitive information in list view', () => {
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=medication-row]').first().should('not.contain', 'SSN')
  })

  it('should use HTTPS for all API requests', () => {
    cy.intercept('GET', '/api/medications*').as('getMedications')

    cy.get('[data-testid=medications-tab]').click()

    cy.wait('@getMedications').its('request.url').should('include', 'https')
  })

  it('should include authentication token in requests', () => {
    cy.intercept('GET', '/api/medications*').as('getMedications')

    cy.get('[data-testid=medications-tab]').click()

    cy.wait('@getMedications').its('request.headers').should('have.property', 'authorization')
  })

  it('should restrict controlled substance access', () => {
    cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
    cy.visit('/medications')
    cy.get('[data-testid=medications-tab]').click()

    cy.get('[data-testid=controlled-substance-row]').first().click()
    cy.get('[data-testid=controlled-substance-warning]').should('be.visible')
  })

  it('should enforce session timeout', () => {
    cy.wait(30000)
    cy.get('[data-testid=add-medication-button]').click()
    cy.url().should('include', '/login')
  })

  it('should require additional authorization for controlled substances', () => {
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=controlled-substance-row]').first().click()
    cy.get('[data-testid=authorization-required]').should('be.visible')
  })

  it('should log all high-risk actions', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.login('admin')
    cy.visit('/medications')
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=delete-medication-button]').click()

    cy.wait('@auditLog')
  })

  it('should display PHI warning when accessing medication details', () => {
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=phi-warning]').should('be.visible')
  })
})

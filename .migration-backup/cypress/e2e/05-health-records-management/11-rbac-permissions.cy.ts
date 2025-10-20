/// <reference types="cypress" />

/**
 * Health Records Management: RBAC & Permissions (20 tests)
 *
 * Tests role-based access control and permissions
 */

describe('Health Records Management - Permissions and Role-Based Access', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/students/assigned', {
      statusCode: 200,
      body: [
        { id: '1', firstName: 'John', lastName: 'Doe', studentNumber: 'STU001' }
      ]
    }).as('getAssignedStudents')

    cy.intercept('GET', '**/api/health-records/student/*/allergies', {
      statusCode: 200,
      body: []
    }).as('getAllergies')

    cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
      statusCode: 200,
      body: []
    }).as('getChronicConditions')

    cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
      statusCode: 200,
      body: []
    }).as('getVaccinations')

    cy.intercept('GET', '**/api/health-records/student/*/growth-chart', {
      statusCode: 200,
      body: []
    }).as('getGrowthChart')

    cy.intercept('GET', '**/api/health-records/student/*/vitals', {
      statusCode: 200,
      body: []
    }).as('getVitals')
  })

  it('should allow nurse to add allergies', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="add-allergy-button"]').should('not.be.disabled')
  })

  it('should restrict read-only user from adding allergies', () => {
    cy.login('readonly')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="add-allergy-button"]').should('be.disabled')
  })

  it('should hide edit buttons for read-only users', () => {
    cy.login('readonly')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="edit-allergy-button"]').should('not.exist')
  })

  it('should show edit buttons for nurses', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="edit-allergy-button"]').should('exist')
  })

  it('should restrict counselor from seeing medical details', () => {
    cy.login('counselor')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="treatment-details"]').should('contain', 'RESTRICTED')
  })

  it('should hide provider names for counselors', () => {
    cy.login('counselor')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="provider-name"]').should('not.exist')
  })

  it('should allow admin full access', () => {
    cy.login('admin')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="add-allergy-button"]').should('not.be.disabled')
    cy.get('[data-testid="edit-allergy-button"]').should('exist')
  })

  it('should show New Record button for nurses', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.get('[data-testid="new-record-button"]').should('be.visible')
  })

  it('should hide New Record button for read-only', () => {
    cy.login('readonly')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.get('[data-testid="new-record-button"]').should('not.exist')
  })

  it('should show Import button for nurses', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.get('[data-testid="import-button"]').should('be.visible')
  })

  it('should hide Import button for read-only', () => {
    cy.login('readonly')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.get('[data-testid="import-button"]').should('not.exist')
  })

  it('should allow Export for all users', () => {
    cy.login('readonly')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.get('[data-testid="export-button"]').should('be.visible')
  })

  it('should restrict vaccination recording for read-only', () => {
    cy.login('readonly')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Vaccinations').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="record-vaccination-button"]').should('be.disabled')
  })

  it('should allow vaccination recording for nurses', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Vaccinations').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="record-vaccination-button"]').should('not.be.disabled')
  })

  it('should restrict growth measurement for read-only', () => {
    cy.login('readonly')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Growth Charts').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="add-measurement-button"]').should('be.disabled')
  })

  it('should allow growth measurement for nurses', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Growth Charts').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="add-measurement-button"]').should('not.be.disabled')
  })

  it('should restrict screening recording for read-only', () => {
    cy.login('readonly')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Screenings').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="record-screening-button"]').should('be.disabled')
  })

  it('should allow screening recording for nurses', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Screenings').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="record-screening-button"]').should('not.be.disabled')
  })

  it('should restrict condition management for read-only', () => {
    cy.login('readonly')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Chronic Conditions').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="add-condition-button"]').should('be.disabled')
  })

  it('should allow condition management for nurses', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    cy.contains('button', 'Chronic Conditions').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="add-condition-button"]').should('not.be.disabled')
  })
})

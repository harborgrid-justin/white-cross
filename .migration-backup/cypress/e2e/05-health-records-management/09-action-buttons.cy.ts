/// <reference types="cypress" />

/**
 * Health Records Management: Action Buttons (15 tests)
 *
 * Tests action buttons and quick actions
 */

describe('Health Records Management - Action Buttons', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/students/assigned', {
      statusCode: 200,
      body: [
        { id: '1', firstName: 'John', lastName: 'Doe', studentNumber: 'STU001' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', studentNumber: 'STU002' }
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

    cy.login('nurse')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
  })

  it('should display New Record button', () => {
    cy.get('[data-testid="new-record-button"]').should('be.visible')
  })

  it('should display Import button', () => {
    cy.get('[data-testid="import-button"]').should('be.visible')
  })

  it('should display Export button', () => {
    cy.get('[data-testid="export-button"]').should('be.visible')
  })

  it('should click New Record button', () => {
    cy.get('[data-testid="new-record-button"]').click()
    cy.wait(300)
  })

  it('should click Import button', () => {
    cy.get('[data-testid="import-button"]').click()
  })

  it('should click Export button', () => {
    cy.get('[data-testid="export-button"]').click()
  })

  it('should show New Record button with icon', () => {
    cy.get('[data-testid="new-record-button"]').find('svg').should('exist')
  })

  it('should have proper button styling', () => {
    cy.get('[data-testid="new-record-button"]').should('have.class', 'btn-primary')
  })

  it('should have Import button as secondary style', () => {
    cy.get('[data-testid="import-button"]').should('have.class', 'btn-secondary')
  })

  it('should have Export button as secondary style', () => {
    cy.get('[data-testid="export-button"]').should('have.class', 'btn-secondary')
  })

  it('should display Quick Actions section', () => {
    cy.contains('Quick Actions').should('be.visible')
  })

  it('should have Add New Record quick action', () => {
    cy.contains('Quick Actions').parent().contains('Add New Record').should('be.visible')
  })

  it('should have View Records quick action', () => {
    cy.contains('Quick Actions').parent().contains('View Records').should('be.visible')
  })

  it('should have Vaccination Schedule quick action', () => {
    cy.contains('Quick Actions').parent().contains('Vaccination Schedule').should('be.visible')
  })

  it('should click quick action buttons', () => {
    cy.contains('Quick Actions').parent().contains('View Records').click()
    cy.wait(500)
  })
})

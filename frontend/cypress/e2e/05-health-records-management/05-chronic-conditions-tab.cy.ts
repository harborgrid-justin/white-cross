/// <reference types="cypress" />

/**
 * Health Records Management: Chronic Conditions Tab (15 tests)
 *
 * Tests chronic condition management functionality
 */

describe('Health Records Management - Chronic Conditions Tab', () => {
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
    cy.contains('button', 'Chronic Conditions').scrollIntoView().click()
    cy.wait(500)
  })

  it('should display chronic conditions content', () => {
    cy.get('[data-testid="chronic-conditions-content"]').should('be.visible')
  })

  it('should show add condition button', () => {
    cy.get('[data-testid="add-condition-button"]').should('be.visible')
  })

  it('should display conditions list', () => {
    cy.get('[data-testid="conditions-list"]').should('exist')
  })

  it('should show condition items', () => {
    cy.get('[data-testid="condition-item"]').should('have.length.at.least', 1)
  })

  it('should display condition names', () => {
    cy.get('[data-testid="condition-name"]').should('be.visible')
  })

  it('should show status badges', () => {
    cy.get('[data-testid="status-badge"]').should('exist')
  })

  it('should display severity indicators', () => {
    cy.get('[data-testid="severity-indicator"]').should('exist')
  })

  it('should show view care plan buttons', () => {
    cy.get('[data-testid="view-care-plan"]').should('have.length.at.least', 1)
  })

  it('should click add condition button', () => {
    cy.get('[data-testid="add-condition-button"]').click()
  })

  it('should click view care plan button', () => {
    cy.get('[data-testid="view-care-plan"]').first().click()
  })

  it('should display active conditions', () => {
    cy.contains('[data-testid="status-badge"]', 'Active').should('exist')
  })

  it('should display managed conditions', () => {
    cy.contains('[data-testid="status-badge"]', 'Managed').should('exist')
  })

  it('should show next review date', () => {
    cy.get('[data-testid="next-review"]').should('exist')
  })

  it('should display diagnosed date', () => {
    cy.get('[data-testid="diagnosed-date"]').should('exist')
  })

  it('should organize conditions properly', () => {
    cy.get('[data-testid="conditions-list"]').children().should('have.length.at.least', 1)
  })
})

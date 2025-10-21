/// <reference types="cypress" />

/**
 * Health Records Management: Growth Charts Tab (15 tests)
 *
 * Tests growth measurement and chart functionality
 */

describe('Health Records Management - Growth Charts Tab', () => {
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
    cy.contains('button', 'Growth Charts').scrollIntoView().click()
    cy.wait(500)
  })

  it('should display growth charts content', () => {
    cy.get('[data-testid="growth-charts-content"]').should('be.visible')
  })

  it('should show add measurement button', () => {
    cy.get('[data-testid="add-measurement-button"]').should('be.visible')
  })

  it('should display chart type selector', () => {
    cy.get('[data-testid="chart-type-selector"]').should('be.visible')
  })

  it('should select height chart', () => {
    cy.get('[data-testid="chart-type-selector"]').select('Height')
  })

  it('should select weight chart', () => {
    cy.get('[data-testid="chart-type-selector"]').select('Weight')
  })

  it('should select BMI chart', () => {
    cy.get('[data-testid="chart-type-selector"]').select('BMI')
  })

  it('should display measurements table', () => {
    cy.get('[data-testid="measurements-table"]').should('exist')
  })

  it('should show measurement rows', () => {
    cy.get('[data-testid="measurement-row"]').should('have.length.at.least', 1)
  })

  it('should display dates', () => {
    cy.get('[data-testid="measurement-date"]').should('exist')
  })

  it('should show height values', () => {
    cy.get('[data-testid="height-value"]').should('exist')
  })

  it('should show weight values', () => {
    cy.get('[data-testid="weight-value"]').should('exist')
  })

  it('should display BMI values', () => {
    cy.get('[data-testid="bmi-value"]').should('exist')
  })

  it('should click add measurement button', () => {
    cy.get('[data-testid="add-measurement-button"]').click()
  })

  it('should show percentile information', () => {
    cy.get('[data-testid="percentile-info"]').should('exist')
  })

  it('should display growth velocity', () => {
    cy.get('[data-testid="growth-velocity"]').should('exist')
  })
})

/// <reference types="cypress" />

/**
 * Health Records Management: Page Loading & Structure (15 tests)
 *
 * Tests basic page load and structural elements
 */

describe('Health Records Management - Page Loading & Structure', () => {
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

  it('should display the health records page with proper elements', () => {
    cy.get('[data-testid="health-records-page"]').should('be.visible')
    cy.url().should('include', '/health-records')
    cy.contains('Health Records Management').should('be.visible')
  })

  it('should load page without errors', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/health-records')
  })

  it('should display page header and navigation', () => {
    cy.get('.sticky.top-0').should('be.visible')
    cy.get('nav').should('be.visible')
    cy.get('nav').contains('Health Records').should('exist')
  })

  it('should have accessible page title', () => {
    cy.get('h1, h2, [role="heading"]').should('exist')
  })

  it('should maintain authentication on page load', () => {
    cy.url().should('not.include', '/login')
    cy.get('body').should('be.visible')
  })

  it('should display the main page heading', () => {
    cy.contains('Health Records Management').should('be.visible')
  })

  it('should display the page description', () => {
    cy.contains('Comprehensive electronic health records system').should('be.visible')
  })

  it('should render the student selector component', () => {
    cy.get('[data-testid="student-selector"]').should('exist')
  })

  it('should display the privacy notice section', () => {
    cy.get('[data-testid="privacy-notice"]').should('be.visible')
  })

  it('should show HIPAA compliance badge', () => {
    cy.get('[data-testid="hipaa-compliance-badge"]').should('be.visible')
    cy.contains('HIPAA Compliant').should('be.visible')
  })

  it('should display user session information', () => {
    cy.get('[data-testid="privacy-notice"]').should('contain', 'Session:')
  })

  it('should display user role information', () => {
    cy.get('[data-testid="privacy-notice"]').should('contain', 'Role:')
  })

  it('should show data use agreement checkbox', () => {
    cy.get('[data-testid="data-use-agreement"]').should('exist')
    cy.get('[data-testid="data-use-agreement"]').should('be.checked')
  })

  it('should render feature highlight cards', () => {
    cy.contains('Electronic Health Records').should('be.visible')
    cy.contains('Vaccination Tracking').should('be.visible')
    cy.contains('Allergy Management').should('be.visible')
    cy.contains('Chronic Condition Monitoring').should('be.visible')
  })

  it('should display summary statistics cards', () => {
    cy.contains('Total Records').should('be.visible')
    cy.contains('Active Allergies').should('be.visible')
    cy.contains('Chronic Conditions').should('be.visible')
    cy.contains('Vaccinations Due').should('be.visible')
  })
})

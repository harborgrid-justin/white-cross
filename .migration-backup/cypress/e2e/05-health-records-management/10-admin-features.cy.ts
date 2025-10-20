/// <reference types="cypress" />

/**
 * Health Records Management: Admin Features (15 tests)
 *
 * Tests admin-specific features and capabilities
 */

describe('Health Records Management - Admin Features', () => {
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

    cy.login('admin')
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
  })

  it('should display Admin Settings button for admin', () => {
    cy.get('[data-testid="admin-settings-button"]').should('be.visible')
  })

  it('should display Reports button for admin', () => {
    cy.get('[data-testid="reports-button"]').should('be.visible')
  })

  it('should show Analytics tab for admin', () => {
    cy.contains('button', 'Analytics').should('be.visible')
  })

  it('should click Admin Settings button', () => {
    cy.get('[data-testid="admin-settings-button"]').click()
  })

  it('should click Reports button', () => {
    cy.get('[data-testid="reports-button"]').click()
  })

  it('should navigate to Analytics tab', () => {
    cy.contains('button', 'Analytics').scrollIntoView().click()
    cy.wait(500)
  })

  it('should show view sensitive data button', () => {
    cy.get('[data-testid="view-sensitive-data"]').should('be.visible')
  })

  it('should click view sensitive data button', () => {
    cy.get('[data-testid="view-sensitive-data"]').click()
    cy.wait(300)
  })

  it('should have admin-specific permissions', () => {
    cy.get('[data-testid="privacy-notice"]').should('contain', 'ADMIN')
  })

  it('should access all tabs as admin', () => {
    const tabs = ['Overview', 'Health Records', 'Allergies', 'Chronic Conditions', 'Vaccinations', 'Growth Charts', 'Screenings', 'Analytics']
    tabs.forEach(tab => {
      cy.contains('button', tab).should('be.visible')
    })
  })

  it('should have full edit permissions', () => {
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="add-allergy-button"]').should('not.be.disabled')
  })

  it('should see all provider information', () => {
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="provider-name"]').should('be.visible')
  })

  it('should see all treatment details', () => {
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="treatment-details"]').should('be.visible')
    cy.get('[data-testid="treatment-details"]').should('not.contain', 'RESTRICTED')
  })

  it('should access advanced analytics', () => {
    cy.contains('button', 'Analytics').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="analytics-content"]').should('be.visible')
  })

  it('should generate reports', () => {
    cy.get('[data-testid="reports-button"]').should('be.visible')
  })
})

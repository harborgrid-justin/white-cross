/// <reference types="cypress" />

/**
 * Administration Features: Overview Tab (20 tests)
 *
 * Tests overview tab functionality and system metrics
 */

describe('Administration Features - Overview Tab', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Overview').click()
  })

  it('should display the Overview tab content', () => {
    cy.contains('button', 'Overview').should('have.class', 'border-blue-500')
  })

  it('should show system metrics', () => {
    cy.get('[class*="grid"]').should('exist')
  })

  it('should display statistical cards', () => {
    cy.get('[class*="bg-white"][class*="shadow"]').should('have.length.at.least', 1)
  })

  it('should show total users metric', () => {
    cy.contains(/users|total/i).should('be.visible')
  })

  it('should show active schools metric', () => {
    cy.contains(/schools|active/i).should('be.visible')
  })

  it('should show districts metric', () => {
    cy.contains(/districts/i).should('be.visible')
  })

  it('should display recent activity section', () => {
    cy.contains(/recent|activity/i).should('exist')
  })

  it('should show system health status', () => {
    cy.contains(/health|status/i).should('exist')
  })

  it('should display quick actions section', () => {
    cy.contains(/quick|actions/i).should('exist')
  })

  it('should have action buttons', () => {
    cy.get('button[class*="bg-"]').should('have.length.at.least', 1)
  })

  it('should show database status', () => {
    cy.contains(/database|db/i).should('exist')
  })

  it('should display API status', () => {
    cy.contains(/api|service/i).should('exist')
  })

  it('should show cache status', () => {
    cy.contains(/cache|redis/i).should('exist')
  })

  it('should display storage information', () => {
    cy.contains(/storage|disk/i).should('exist')
  })

  it('should show memory usage', () => {
    cy.contains(/memory|ram/i).should('exist')
  })

  it('should display CPU information', () => {
    cy.contains(/cpu|processor/i).should('exist')
  })

  it('should have refresh capability', () => {
    cy.get('button').contains(/refresh|reload/i).should('exist')
  })

  it('should show uptime information', () => {
    cy.contains(/uptime|running/i).should('exist')
  })

  it('should display version information', () => {
    cy.contains(/version|v\d/i).should('exist')
  })

  it('should have responsive grid layout', () => {
    cy.get('[class*="grid"]').should('have.class', 'grid')
  })
})

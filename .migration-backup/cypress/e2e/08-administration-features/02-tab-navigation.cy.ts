/// <reference types="cypress" />

/**
 * Administration Features: Tab Navigation (25 tests)
 *
 * Tests navigation between different administration tabs
 */

describe('Administration Features - Tab Navigation', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
  })

  it('should display all 11 administration tabs', () => {
    cy.get('nav button').should('have.length', 11)
  })

  it('should show Overview tab', () => {
    cy.contains('button', 'Overview').should('be.visible')
  })

  it('should show Districts tab', () => {
    cy.contains('button', 'Districts').should('be.visible')
  })

  it('should show Schools tab', () => {
    cy.contains('button', 'Schools').should('be.visible')
  })

  it('should show Users tab', () => {
    cy.contains('button', 'Users').should('be.visible')
  })

  it('should show Configuration tab', () => {
    cy.contains('button', 'Configuration').should('be.visible')
  })

  it('should show Integrations tab', () => {
    cy.contains('button', 'Integrations').should('be.visible')
  })

  it('should show Backups tab', () => {
    cy.contains('button', 'Backups').should('be.visible')
  })

  it('should show Monitoring tab', () => {
    cy.contains('button', 'Monitoring').should('be.visible')
  })

  it('should show Licenses tab', () => {
    cy.contains('button', 'Licenses').should('be.visible')
  })

  it('should show Training tab', () => {
    cy.contains('button', 'Training').should('be.visible')
  })

  it('should show Audit Logs tab', () => {
    cy.contains('button', 'Audit Logs').should('be.visible')
  })

  it('should have Overview tab active by default', () => {
    cy.contains('button', 'Overview')
      .should('have.class', 'border-blue-500')
      .and('have.class', 'text-blue-600')
  })

  it('should switch to Districts tab when clicked', () => {
    cy.contains('button', 'Districts').click()
    cy.contains('button', 'Districts')
      .should('have.class', 'border-blue-500')
  })

  it('should switch to Schools tab when clicked', () => {
    cy.contains('button', 'Schools').click()
    cy.contains('button', 'Schools')
      .should('have.class', 'border-blue-500')
  })

  it('should switch to Users tab when clicked', () => {
    cy.contains('button', 'Users').click()
    cy.contains('button', 'Users')
      .should('have.class', 'border-blue-500')
  })

  it('should switch to Configuration tab when clicked', () => {
    cy.contains('button', 'Configuration').click()
    cy.contains('button', 'Configuration')
      .should('have.class', 'border-blue-500')
  })

  it('should switch to Integrations tab when clicked', () => {
    cy.contains('button', 'Integrations').click()
    cy.contains('button', 'Integrations')
      .should('have.class', 'border-blue-500')
  })

  it('should switch to Backups tab when clicked', () => {
    cy.contains('button', 'Backups').click()
    cy.contains('button', 'Backups')
      .should('have.class', 'border-blue-500')
  })

  it('should switch to Monitoring tab when clicked', () => {
    cy.contains('button', 'Monitoring').click()
    cy.contains('button', 'Monitoring')
      .should('have.class', 'border-blue-500')
  })

  it('should switch to Licenses tab when clicked', () => {
    cy.contains('button', 'Licenses').click()
    cy.contains('button', 'Licenses')
      .should('have.class', 'border-blue-500')
  })

  it('should switch to Training tab when clicked', () => {
    cy.contains('button', 'Training').click()
    cy.contains('button', 'Training')
      .should('have.class', 'border-blue-500')
  })

  it('should switch to Audit Logs tab when clicked', () => {
    cy.contains('button', 'Audit Logs').click()
    cy.contains('button', 'Audit Logs')
      .should('have.class', 'border-blue-500')
  })

  it('should display icons for each tab', () => {
    cy.get('nav button svg').should('have.length.at.least', 11)
  })

  it('should deactivate previous tab when switching', () => {
    cy.contains('button', 'Overview').should('have.class', 'border-blue-500')
    cy.contains('button', 'Districts').click()
    cy.contains('button', 'Overview').should('not.have.class', 'border-blue-500')
  })
})

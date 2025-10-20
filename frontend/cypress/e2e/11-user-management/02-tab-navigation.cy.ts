/// <reference types="cypress" />

/**
 * User Management - Tab Navigation (20 tests)
 *
 * Tests navigation between administration panel tabs
 */

describe('User Management - Tab Navigation', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
  })

  it('should display all navigation tabs', () => {
    const tabs = ['Overview', 'Districts', 'Schools', 'Users', 'Configuration', 'Integrations', 'Backups', 'Monitoring', 'Licenses', 'Training', 'Audit Logs']
    tabs.forEach(tab => {
      cy.contains('button', tab).should('be.visible')
    })
  })

  it('should have Overview tab selected by default', () => {
    cy.contains('button', 'Overview').should('have.class', 'border-blue-500')
  })

  it('should change to Users tab when clicked', () => {
    cy.contains('button', 'Users').click()
    cy.contains('button', 'Users').should('have.class', 'border-blue-500')
  })

  it('should display icons for each tab', () => {
    cy.get('nav button svg').should('have.length.at.least', 11)
  })

  it('should have hover states on tabs', () => {
    cy.contains('button', 'Districts').should('have.class', 'hover:text-gray-700')
  })

  it('should maintain tab selection when switching', () => {
    cy.contains('button', 'Schools').click()
    cy.contains('button', 'Schools').should('have.class', 'border-blue-500')
    cy.contains('button', 'Overview').should('not.have.class', 'border-blue-500')
  })

  it('should navigate to Configuration tab', () => {
    cy.contains('button', 'Configuration').click()
    cy.contains('button', 'Configuration').should('have.class', 'text-blue-600')
  })

  it('should navigate to Integrations tab', () => {
    cy.contains('button', 'Integrations').click()
    cy.contains('button', 'Integrations').should('have.class', 'border-blue-500')
  })

  it('should navigate to Backups tab', () => {
    cy.contains('button', 'Backups').click()
    cy.contains('button', 'Backups').should('have.class', 'text-blue-600')
  })

  it('should navigate to Monitoring tab', () => {
    cy.contains('button', 'Monitoring').click()
    cy.contains('button', 'Monitoring').should('be.visible')
  })

  it('should navigate to Licenses tab', () => {
    cy.contains('button', 'Licenses').click()
    cy.contains('button', 'Licenses').should('have.class', 'border-blue-500')
  })

  it('should navigate to Training tab', () => {
    cy.contains('button', 'Training').click()
    cy.contains('button', 'Training').should('be.visible')
  })

  it('should navigate to Audit Logs tab', () => {
    cy.contains('button', 'Audit Logs').click()
    cy.contains('button', 'Audit Logs').should('have.class', 'text-blue-600')
  })

  it('should have proper spacing between tabs', () => {
    cy.get('nav').should('have.class', 'space-x-8')
  })

  it('should have proper padding on tab buttons', () => {
    cy.contains('button', 'Overview').should('have.class', 'py-4')
  })

  it('should have proper border bottom on active tab', () => {
    cy.contains('button', 'Overview').should('have.class', 'border-b-2')
  })

  it('should have medium font weight on tabs', () => {
    cy.contains('button', 'Users').should('have.class', 'font-medium')
  })

  it('should have small text size on tabs', () => {
    cy.contains('button', 'Districts').should('have.class', 'text-sm')
  })

  it('should display tabs in flex layout', () => {
    cy.get('nav').should('have.class', 'flex')
  })

  it('should have whitespace-nowrap on tab text', () => {
    cy.contains('button', 'Configuration').should('have.class', 'whitespace-nowrap')
  })
})

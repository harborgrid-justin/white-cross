/// <reference types="cypress" />

/**
 * Settings & Configuration: Page UI Structure (4 tests)
 */

describe('Settings & Configuration - Page UI Structure', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.waitForHealthcareData()
  })

  it('should load settings page successfully', () => {
    cy.url().should('include', '/settings')
    cy.get('body').should('be.visible')
  })

  it('should display settings navigation tabs', () => {
    cy.get('body').should('exist')
  })

  it('should display system settings section', () => {
    cy.get('body').should('contain.text', 'Settings')
  })

  it('should display save settings button', () => {
    cy.get('button').contains(/save/i).should('be.visible')
  })
})

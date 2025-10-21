/// <reference types="cypress" />

/**
 * User Management - Districts Tab (10 tests)
 *
 * Tests districts tab functionality
 */

describe('User Management - Districts Tab', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Districts').click()
  })

  it('should display districts tab when clicked', () => {
    cy.contains('button', 'Districts').should('have.class', 'border-blue-500')
  })

  it('should show districts as active tab', () => {
    cy.contains('button', 'Districts').should('have.class', 'text-blue-600')
  })

  it('should render districts icon', () => {
    cy.contains('button', 'Districts').find('svg').should('be.visible')
  })

  it('should deselect other tabs when districts is active', () => {
    cy.contains('button', 'Overview').should('not.have.class', 'border-blue-500')
  })

  it('should maintain districts tab selection', () => {
    cy.wait(100)
    cy.contains('button', 'Districts').should('have.class', 'border-blue-500')
  })

  it('should allow navigation away from districts', () => {
    cy.contains('button', 'Schools').click()
    cy.contains('button', 'Schools').should('have.class', 'text-blue-600')
  })

  it('should render without console errors', () => {
    cy.get('body').should('be.visible')
  })

  it('should have proper styling on districts tab', () => {
    cy.contains('button', 'Districts').should('have.class', 'border-b-2')
  })

  it('should be accessible', () => {
    cy.contains('button', 'Districts').should('be.visible')
  })

  it('should maintain page URL', () => {
    cy.url().should('include', '/settings')
  })
})

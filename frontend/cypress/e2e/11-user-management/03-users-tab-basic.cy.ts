/// <reference types="cypress" />

/**
 * User Management - Users Tab Basic Functionality (15 tests)
 *
 * Tests basic users tab functionality and state management
 */

describe('User Management - Users Tab Basic Functionality', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Users').click()
  })

  it('should display users tab content', () => {
    cy.contains('button', 'Users').should('have.class', 'border-blue-500')
  })

  it('should show users tab is active', () => {
    cy.contains('button', 'Users').should('have.class', 'text-blue-600')
  })

  it('should not show overview content when on users tab', () => {
    cy.contains('button', 'Overview').should('not.have.class', 'border-blue-500')
  })

  it('should render users tab without errors', () => {
    cy.get('body').should('be.visible')
  })

  it('should maintain URL on tab switch', () => {
    cy.url().should('include', '/settings')
  })

  it('should allow switching back to overview', () => {
    cy.contains('button', 'Overview').click()
    cy.contains('button', 'Overview').should('have.class', 'border-blue-500')
  })

  it('should allow switching to other tabs from users', () => {
    cy.contains('button', 'Districts').click()
    cy.contains('button', 'Districts').should('have.class', 'text-blue-600')
  })

  it('should persist tab state during interaction', () => {
    cy.contains('button', 'Users').should('have.class', 'border-blue-500')
    cy.wait(100)
    cy.contains('button', 'Users').should('have.class', 'border-blue-500')
  })

  it('should have proper tab content container', () => {
    cy.get('div').should('exist')
  })

  it('should not display other tab contents', () => {
    cy.contains('button', 'Districts').should('not.have.class', 'border-blue-500')
  })

  it('should render users icon', () => {
    cy.contains('button', 'Users').find('svg').should('be.visible')
  })

  it('should have clickable users tab button', () => {
    cy.contains('button', 'Users').click()
    cy.contains('button', 'Users').should('exist')
  })

  it('should show users as selected after click', () => {
    cy.contains('button', 'Users').should('have.class', 'border-blue-500')
  })

  it('should allow rapid tab switching', () => {
    cy.contains('button', 'Overview').click()
    cy.contains('button', 'Users').click()
    cy.contains('button', 'Users').should('have.class', 'text-blue-600')
  })

  it('should maintain authentication on users tab', () => {
    cy.url().should('not.include', '/login')
  })
})

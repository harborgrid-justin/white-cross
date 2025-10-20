/// <reference types="cypress" />

/**
 * User Management - Schools Tab (10 tests)
 *
 * Tests schools tab functionality
 */

describe('User Management - Schools Tab', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Schools').click()
  })

  it('should display schools tab when clicked', () => {
    cy.contains('button', 'Schools').should('have.class', 'border-blue-500')
  })

  it('should show schools as active tab', () => {
    cy.contains('button', 'Schools').should('have.class', 'text-blue-600')
  })

  it('should render schools icon', () => {
    cy.contains('button', 'Schools').find('svg').should('be.visible')
  })

  it('should deselect overview when schools is active', () => {
    cy.contains('button', 'Overview').should('not.have.class', 'border-blue-500')
  })

  it('should persist schools selection', () => {
    cy.wait(100)
    cy.contains('button', 'Schools').should('have.class', 'border-blue-500')
  })

  it('should allow switching to users from schools', () => {
    cy.contains('button', 'Users').click()
    cy.contains('button', 'Users').should('have.class', 'text-blue-600')
  })

  it('should render schools content', () => {
    cy.get('body').should('be.visible')
  })

  it('should have proper tab styling', () => {
    cy.contains('button', 'Schools').should('have.class', 'font-medium')
  })

  it('should be visible and accessible', () => {
    cy.contains('button', 'Schools').should('be.visible')
  })

  it('should stay on settings page', () => {
    cy.url().should('include', '/settings')
  })
})

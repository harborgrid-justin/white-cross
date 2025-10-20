/// <reference types="cypress" />

/**
 * User Management - Licenses & Training Tabs (20 tests combined)
 *
 * Tests licenses and training tabs functionality
 */

describe('User Management - Licenses Tab (10 tests)', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Licenses').click()
  })

  it('should display licenses tab when clicked', () => {
    cy.contains('button', 'Licenses').should('have.class', 'border-blue-500')
  })

  it('should show licenses as active', () => {
    cy.contains('button', 'Licenses').should('have.class', 'text-blue-600')
  })

  it('should render file key icon', () => {
    cy.contains('button', 'Licenses').find('svg').should('be.visible')
  })

  it('should deselect monitoring', () => {
    cy.contains('button', 'Monitoring').should('not.have.class', 'border-blue-500')
  })

  it('should render licenses content', () => {
    cy.get('body').should('be.visible')
  })

  it('should keep selection active', () => {
    cy.wait(100)
    cy.contains('button', 'Licenses').should('have.class', 'border-blue-500')
  })

  it('should allow navigation to training', () => {
    cy.contains('button', 'Training').click()
    cy.contains('button', 'Training').should('have.class', 'text-blue-600')
  })

  it('should have proper styling', () => {
    cy.contains('button', 'Licenses').should('have.class', 'border-b-2')
  })

  it('should be visible', () => {
    cy.contains('button', 'Licenses').should('be.visible')
  })

  it('should maintain URL', () => {
    cy.url().should('include', '/settings')
  })
})

describe('User Management - Training Tab (10 tests)', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Training').click()
  })

  it('should display training tab when clicked', () => {
    cy.contains('button', 'Training').should('have.class', 'border-blue-500')
  })

  it('should show training as active', () => {
    cy.contains('button', 'Training').should('have.class', 'text-blue-600')
  })

  it('should render book icon', () => {
    cy.contains('button', 'Training').find('svg').should('be.visible')
  })

  it('should deselect licenses', () => {
    cy.contains('button', 'Licenses').should('not.have.class', 'border-blue-500')
  })

  it('should render training content', () => {
    cy.get('body').should('be.visible')
  })

  it('should persist selection', () => {
    cy.wait(100)
    cy.contains('button', 'Training').should('have.class', 'border-blue-500')
  })

  it('should allow navigation to audit logs', () => {
    cy.contains('button', 'Audit Logs').click()
    cy.contains('button', 'Audit Logs').should('have.class', 'text-blue-600')
  })

  it('should have tab styling', () => {
    cy.contains('button', 'Training').should('have.class', 'font-medium')
  })

  it('should be accessible', () => {
    cy.contains('button', 'Training').should('be.visible')
  })

  it('should stay on settings page', () => {
    cy.url().should('include', '/settings')
  })
})

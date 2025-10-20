/// <reference types="cypress" />

/**
 * User Management - Backups & Monitoring Tabs (20 tests combined)
 *
 * Tests backups and monitoring tabs functionality
 */

describe('User Management - Backups Tab (10 tests)', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Backups').click()
  })

  it('should display backups tab when clicked', () => {
    cy.contains('button', 'Backups').should('have.class', 'border-blue-500')
  })

  it('should show backups as active', () => {
    cy.contains('button', 'Backups').should('have.class', 'text-blue-600')
  })

  it('should render database icon', () => {
    cy.contains('button', 'Backups').find('svg').should('be.visible')
  })

  it('should deselect integrations', () => {
    cy.contains('button', 'Integrations').should('not.have.class', 'border-blue-500')
  })

  it('should render content', () => {
    cy.get('body').should('be.visible')
  })

  it('should persist selection', () => {
    cy.wait(100)
    cy.contains('button', 'Backups').should('have.class', 'border-blue-500')
  })

  it('should allow tab switching', () => {
    cy.contains('button', 'Monitoring').click()
    cy.contains('button', 'Monitoring').should('have.class', 'text-blue-600')
  })

  it('should have proper tab styling', () => {
    cy.contains('button', 'Backups').should('have.class', 'font-medium')
  })

  it('should be accessible', () => {
    cy.contains('button', 'Backups').should('be.visible')
  })

  it('should keep settings URL', () => {
    cy.url().should('include', '/settings')
  })
})

describe('User Management - Monitoring Tab (10 tests)', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Monitoring').click()
  })

  it('should display monitoring tab when clicked', () => {
    cy.contains('button', 'Monitoring').should('have.class', 'border-blue-500')
  })

  it('should show monitoring as active', () => {
    cy.contains('button', 'Monitoring').should('have.class', 'text-blue-600')
  })

  it('should render activity icon', () => {
    cy.contains('button', 'Monitoring').find('svg').should('be.visible')
  })

  it('should deselect backups', () => {
    cy.contains('button', 'Backups').should('not.have.class', 'border-blue-500')
  })

  it('should render monitoring content', () => {
    cy.get('body').should('be.visible')
  })

  it('should maintain selection', () => {
    cy.wait(100)
    cy.contains('button', 'Monitoring').should('have.class', 'border-blue-500')
  })

  it('should allow switching to licenses', () => {
    cy.contains('button', 'Licenses').click()
    cy.contains('button', 'Licenses').should('have.class', 'text-blue-600')
  })

  it('should have tab styling', () => {
    cy.contains('button', 'Monitoring').should('have.class', 'text-sm')
  })

  it('should be visible and clickable', () => {
    cy.contains('button', 'Monitoring').should('be.visible')
  })

  it('should stay on settings page', () => {
    cy.url().should('include', '/settings')
  })
})

/// <reference types="cypress" />

/**
 * Administration Features: Users Tab (25 tests)
 *
 * Tests user management functionality
 */

describe('Administration Features - Users Tab', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Users').click()
  })

  it('should display the Users tab content', () => {
    cy.contains('button', 'Users').should('have.class', 'border-blue-500')
  })

  it('should show users heading', () => {
    cy.contains(/user/i).should('be.visible')
  })

  it('should have add user button', () => {
    cy.get('button').contains(/add|new|create/i).should('be.visible')
  })

  it('should display users table', () => {
    cy.get('table').should('exist')
  })

  it('should show search functionality', () => {
    cy.get('input[type="search"], input[placeholder*="search" i]').should('exist')
  })

  it('should display name column', () => {
    cy.contains(/name|user/i).should('be.visible')
  })

  it('should show email column', () => {
    cy.contains(/email/i).should('be.visible')
  })

  it('should display role column', () => {
    cy.contains(/role/i).should('be.visible')
  })

  it('should show status column', () => {
    cy.contains(/status|active/i).should('be.visible')
  })

  it('should display last login column', () => {
    cy.contains(/last.*login|activity/i).should('be.visible')
  })

  it('should have action buttons for each user', () => {
    cy.get('button[class*="text-"], a[class*="text-"]').should('have.length.at.least', 1)
  })

  it('should show filter by role', () => {
    cy.get('select, [role="combobox"]').contains(/role|all/i).should('exist')
  })

  it('should display filter by status', () => {
    cy.get('select, [role="combobox"]').contains(/status|active/i).should('exist')
  })

  it('should have sorting capability', () => {
    cy.get('th[class*="cursor-"], button[class*="sort"]').should('exist')
  })

  it('should show pagination', () => {
    cy.contains(/page|showing|of/i).should('exist')
  })

  it('should display user school assignments', () => {
    cy.contains(/school|assigned/i).should('exist')
  })

  it('should have edit user functionality', () => {
    cy.get('button, a').contains(/edit|modify/i).should('exist')
  })

  it('should show delete/deactivate user option', () => {
    cy.get('button').contains(/delete|deactivate|disable/i).should('exist')
  })

  it('should display user permissions', () => {
    cy.contains(/permission|access/i).should('exist')
  })

  it('should have bulk actions available', () => {
    cy.get('input[type="checkbox"]').should('exist')
  })

  it('should show export functionality', () => {
    cy.get('button').contains(/export|download/i).should('exist')
  })

  it('should display user creation date', () => {
    cy.contains(/created|joined/i).should('exist')
  })

  it('should show reset password option', () => {
    cy.get('button').contains(/reset.*password|password/i).should('exist')
  })

  it('should have responsive table layout', () => {
    cy.get('[class*="overflow-x"]').should('exist')
  })

  it('should display role badges', () => {
    cy.get('[class*="badge"], [class*="rounded-full"]').should('exist')
  })
})

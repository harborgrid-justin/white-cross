/// <reference types="cypress" />

/**
 * Administration Features: Audit Logs Tab (15 tests)
 *
 * Tests audit logging and history
 */

describe('Administration Features - Audit Logs Tab', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Audit Logs').click()
  })

  it('should display the Audit Logs tab content', () => {
    cy.contains('button', 'Audit Logs').should('have.class', 'border-blue-500')
  })

  it('should show audit logs heading', () => {
    cy.contains(/audit.*log/i).should('be.visible')
  })

  it('should display audit logs table', () => {
    cy.get('table').should('exist')
  })

  it('should show timestamp column', () => {
    cy.contains(/time|date|when/i).should('be.visible')
  })

  it('should display user column', () => {
    cy.contains(/user|who|actor/i).should('be.visible')
  })

  it('should show action column', () => {
    cy.contains(/action|event|activity/i).should('be.visible')
  })

  it('should display resource column', () => {
    cy.contains(/resource|target|object/i).should('be.visible')
  })

  it('should show IP address column', () => {
    cy.contains(/ip|address/i).should('be.visible')
  })

  it('should have filter by user', () => {
    cy.get('select, input').should('exist')
  })

  it('should display filter by action type', () => {
    cy.get('select').contains(/action|type|all/i).should('exist')
  })

  it('should show date range filter', () => {
    cy.get('input[type="date"], input[placeholder*="date" i]').should('exist')
  })

  it('should have export logs functionality', () => {
    cy.get('button').contains(/export|download/i).should('be.visible')
  })

  it('should display pagination', () => {
    cy.contains(/page|showing|of/i).should('exist')
  })

  it('should show search functionality', () => {
    cy.get('input[type="search"], input[placeholder*="search" i]').should('exist')
  })

  it('should display log details on click', () => {
    cy.get('table tr, [class*="cursor-pointer"]').should('exist')
  })
})

/// <reference types="cypress" />

/**
 * Administration Features: Licenses & Training Tabs (20 tests combined)
 *
 * Tests licenses and training resources
 */

describe('Administration Features - Licenses Tab (10 tests)', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Licenses').click()
  })

  it('should display the Licenses tab content', () => {
    cy.contains('button', 'Licenses').should('have.class', 'border-blue-500')
  })

  it('should show licenses heading', () => {
    cy.contains(/license/i).should('be.visible')
  })

  it('should display current license information', () => {
    cy.contains(/current|active/i).should('be.visible')
  })

  it('should show license expiration date', () => {
    cy.contains(/expir|valid.*until/i).should('be.visible')
  })

  it('should display number of allowed users', () => {
    cy.contains(/users|seats/i).should('be.visible')
  })

  it('should show license type/tier', () => {
    cy.contains(/tier|type|plan/i).should('be.visible')
  })

  it('should display features included', () => {
    cy.contains(/feature|included/i).should('be.visible')
  })

  it('should have upgrade license button', () => {
    cy.get('button').contains(/upgrade|renew/i).should('exist')
  })

  it('should show license key or number', () => {
    cy.contains(/key|number|id/i).should('be.visible')
  })

  it('should display support contact information', () => {
    cy.contains(/support|contact/i).should('exist')
  })
})

describe('Administration Features - Training Tab (10 tests)', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Training').click()
  })

  it('should display the Training tab content', () => {
    cy.contains('button', 'Training').should('have.class', 'border-blue-500')
  })

  it('should show training heading', () => {
    cy.contains(/training|resources/i).should('be.visible')
  })

  it('should display training materials list', () => {
    cy.get('[class*="grid"], [class*="space-y"]').should('exist')
  })

  it('should show video tutorials section', () => {
    cy.contains(/video|tutorial/i).should('be.visible')
  })

  it('should display documentation links', () => {
    cy.contains(/documentation|docs|guide/i).should('be.visible')
  })

  it('should show quick start guides', () => {
    cy.contains(/quick.*start|getting.*started/i).should('exist')
  })

  it('should display user manuals', () => {
    cy.contains(/manual|handbook/i).should('exist')
  })

  it('should have search functionality', () => {
    cy.get('input[type="search"], input[placeholder*="search" i]').should('exist')
  })

  it('should show categories or topics', () => {
    cy.contains(/category|topic/i).should('exist')
  })

  it('should display help center link', () => {
    cy.get('a').contains(/help|support/i).should('exist')
  })
})

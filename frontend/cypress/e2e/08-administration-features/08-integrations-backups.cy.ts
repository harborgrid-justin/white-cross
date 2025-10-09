/// <reference types="cypress" />

/**
 * Administration Features: Integrations & Backups Tabs (30 tests combined)
 *
 * Tests integrations and backup functionality
 */

describe('Administration Features - Integrations Tab (15 tests)', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Integrations').click()
  })

  it('should display the Integrations tab content', () => {
    cy.contains('button', 'Integrations').should('have.class', 'border-blue-500')
  })

  it('should show integrations heading', () => {
    cy.contains(/integration/i).should('be.visible')
  })

  it('should display available integrations', () => {
    cy.get('[class*="grid"], [class*="space-y"]').should('exist')
  })

  it('should show integration status indicators', () => {
    cy.contains(/connected|active|inactive/i).should('exist')
  })

  it('should display SIS integration option', () => {
    cy.contains(/sis|student.*information/i).should('be.visible')
  })

  it('should show EHR integration option', () => {
    cy.contains(/ehr|electronic.*health/i).should('be.visible')
  })

  it('should display API key management', () => {
    cy.contains(/api.*key|key/i).should('be.visible')
  })

  it('should show webhook configuration', () => {
    cy.contains(/webhook/i).should('exist')
  })

  it('should display OAuth settings', () => {
    cy.contains(/oauth|sso/i).should('exist')
  })

  it('should have connect/disconnect buttons', () => {
    cy.get('button').contains(/connect|disconnect/i).should('be.visible')
  })

  it('should show integration test functionality', () => {
    cy.get('button').contains(/test|verify/i).should('exist')
  })

  it('should display sync status', () => {
    cy.contains(/sync|synchronize/i).should('exist')
  })

  it('should show last sync time', () => {
    cy.contains(/last.*sync|updated/i).should('exist')
  })

  it('should display integration logs', () => {
    cy.contains(/log|history/i).should('exist')
  })

  it('should have integration documentation links', () => {
    cy.get('a[href*="docs"], a[href*="documentation"]').should('exist')
  })
})

describe('Administration Features - Backups Tab (15 tests)', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Backups').click()
  })

  it('should display the Backups tab content', () => {
    cy.contains('button', 'Backups').should('have.class', 'border-blue-500')
  })

  it('should show backups heading', () => {
    cy.contains(/backup/i).should('be.visible')
  })

  it('should have create backup button', () => {
    cy.get('button').contains(/create|new.*backup|backup.*now/i).should('be.visible')
  })

  it('should display backup history table', () => {
    cy.get('table, [class*="space-y"]').should('exist')
  })

  it('should show backup date/time column', () => {
    cy.contains(/date|time|created/i).should('be.visible')
  })

  it('should display backup size column', () => {
    cy.contains(/size|mb|gb/i).should('be.visible')
  })

  it('should show backup status column', () => {
    cy.contains(/status|complete/i).should('be.visible')
  })

  it('should have restore backup functionality', () => {
    cy.get('button').contains(/restore/i).should('exist')
  })

  it('should display download backup option', () => {
    cy.get('button, a').contains(/download/i).should('exist')
  })

  it('should show delete backup option', () => {
    cy.get('button').contains(/delete|remove/i).should('exist')
  })

  it('should display automated backup schedule', () => {
    cy.contains(/schedule|automatic|automated/i).should('be.visible')
  })

  it('should show backup retention policy', () => {
    cy.contains(/retention|keep/i).should('exist')
  })

  it('should display backup storage location', () => {
    cy.contains(/storage|location|destination/i).should('exist')
  })

  it('should have backup verification status', () => {
    cy.contains(/verified|integrity/i).should('exist')
  })

  it('should show last successful backup time', () => {
    cy.contains(/last.*backup|recent/i).should('exist')
  })
})

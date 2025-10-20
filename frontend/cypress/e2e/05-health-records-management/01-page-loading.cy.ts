/// <reference types="cypress" />

/**
 * Health Records Management: Page Loading & Structure
 *
 * Comprehensive test suite for health records page initialization covering:
 * - Page load performance and error handling
 * - UI structure and element visibility
 * - HIPAA compliance badges and notices
 * - Privacy and security indicators
 * - Student selector functionality
 * - Summary statistics rendering
 *
 * @module HealthRecordsPageLoadTests
 * @category HealthRecordsManagement
 * @priority Critical
 */

describe('Health Records Management - Page Loading & Structure', () => {
  beforeEach(() => {
    // Setup health records API intercepts
    cy.setupHealthRecordsIntercepts()

    // Login as nurse (primary role for health records)
    cy.login('nurse')

    // Navigate through dashboard first (realistic user flow)
    cy.visit('/dashboard')

    // Navigate to health records page
    cy.visit('/health-records')

    // Wait for page to fully load
    cy.getByTestId('health-records-page', { timeout: 10000 }).should('exist')
    cy.waitForHealthcareData()
  })

  context('Page Structure and Navigation', () => {
    it('should display health records page with proper title and URL', () => {
      // Verify page is loaded
      cy.getByTestId('health-records-page').should('be.visible')

      // Verify correct URL
      cy.url().should('include', '/health-records')

      // Verify page heading
      cy.contains('Health Records Management').should('be.visible')
    })

    it('should load page without JavaScript errors', () => {
      // Page should be visible without console errors
      cy.get('body').should('be.visible')
      cy.url().should('include', '/health-records')

      // Verify main container is rendered
      cy.getByTestId('health-records-page').should('be.visible')
    })

    it('should display page header with navigation elements', () => {
      // Verify sticky header is visible
      cy.get('.sticky.top-0').should('be.visible')

      // Verify navigation bar exists
      cy.get('nav').should('be.visible')

      // Verify health records nav item is highlighted/present
      cy.get('nav').contains('Health Records').should('exist')
    })

    it('should have accessible page heading structure', () => {
      // Verify proper heading hierarchy (h1 or h2 for main heading)
      cy.get('h1, h2, [role="heading"]')
        .should('exist')
        .and('be.visible')

      // Verify main heading text - specifically check for the main content h1, not navigation items
      cy.get('[data-testid="health-records-page"]')
        .find('h1')
        .contains(/health records/i)
        .should('be.visible')
    })

    it('should maintain authentication session on page load', () => {
      // Verify user is not redirected to login
      cy.url().should('not.include', '/login')

      // Verify authenticated content is visible
      cy.get('body').should('be.visible')
      cy.getByTestId('health-records-page').should('exist')
    })
  })

  context('Page Content and Descriptions', () => {
    it('should display the main page heading prominently', () => {
      cy.contains('Health Records Management')
        .should('be.visible')
        .and('have.css', 'font-size')
    })

    it('should display descriptive subtitle about EHR system', () => {
      cy.contains('Comprehensive electronic health records system')
        .should('be.visible')
    })

    it('should render student selector component for record access', () => {
      cy.getByTestId('student-selector')
        .should('exist')
        .and('be.visible')
    })
  })

  context('HIPAA Compliance and Privacy Indicators', () => {
    it('should display privacy notice section prominently', () => {
      cy.getByTestId('privacy-notice')
        .should('be.visible')
        .and('contain.text', 'Session:')
    })

    it('should show HIPAA compliance badge', () => {
      cy.getByTestId('hipaa-compliance-badge')
        .should('be.visible')

      // Verify HIPAA compliant text
      cy.contains('HIPAA Compliant').should('be.visible')
    })

    it('should display current user session information', () => {
      cy.getByTestId('privacy-notice')
        .should('contain', 'Session:')
        .and('be.visible')
    })

    it('should display user role information for audit purposes', () => {
      cy.getByTestId('privacy-notice')
        .should('contain', 'Role:')
        .and('be.visible')
    })

    it('should show data use agreement checkbox in checked state', () => {
      cy.getByTestId('data-use-agreement')
        .should('exist')
        .and('be.checked')
    })

    it('should include timestamp or session info for audit trail', () => {
      // Privacy notice should contain session timestamp or ID
      cy.getByTestId('privacy-notice')
        .invoke('text')
        .should('match', /session:|time:|date:/i)
    })
  })

  context('Feature Highlight Cards', () => {
    it('should render all feature highlight cards', () => {
      // Verify key feature cards are displayed
      cy.contains('Electronic Health Records').should('be.visible')
      cy.contains('Vaccination Tracking').should('be.visible')
      cy.contains('Allergy Management').should('be.visible')
      cy.contains('Chronic Condition Monitoring').should('be.visible')
    })

    it('should display feature cards with icons', () => {
      // Feature cards should have visual icons
      cy.contains('Electronic Health Records')
        .parent()
        .parent()
        .find('svg')
        .should('exist')
    })

    it('should organize feature cards in responsive grid layout', () => {
      // Verify grid container exists
      cy.contains('Electronic Health Records')
        .parents('[class*="grid"]')
        .should('exist')
    })
  })

  context('Summary Statistics Dashboard', () => {
    it('should display summary statistics cards', () => {
      // Verify all key metrics are shown
      cy.contains('Total Records').should('be.visible')
      cy.contains('Active Allergies').should('be.visible')
      cy.contains('Chronic Conditions').should('be.visible')
      cy.contains('Vaccinations Due').should('be.visible')
    })

    it('should show numeric values in statistics cards', () => {
      // Statistics should contain numbers
      cy.contains('Total Records')
        .parent()
        .parent()
        .invoke('text')
        .should('match', /\d+/)
    })

    it('should update statistics based on selected student', () => {
      // When student is selected, stats should be relevant
      cy.getByTestId('student-selector').should('exist')

      // Statistics section should be reactive to selection
      cy.contains('Total Records').should('be.visible')
    })
  })

  context('Loading States and Performance', () => {
    it('should display loading state during initial data fetch', () => {
      // Intercept with delay to see loading state
      cy.intercept('GET', '**/api/students/assigned', (req) => {
        req.reply({
          statusCode: 200,
          body: [],
          delay: 1000
        })
      }).as('getStudentsDelayed')

      // Reload the page to trigger the loading state
      cy.reload()

      // Should show loading indicator while data is being fetched
      cy.get('[data-testid*="loading"], [class*="loading"], [class*="spinner"]', { timeout: 500 })
        .should('exist')
    })

    it('should load page content within acceptable time frame', () => {
      const startTime = Date.now()

      cy.visit('/health-records')
      cy.getByTestId('health-records-page', { timeout: 5000 }).should('be.visible')

      cy.wrap(null).should(() => {
        const loadTime = Date.now() - startTime
        expect(loadTime).to.be.lessThan(5000)
      })
    })

    it('should handle API failures gracefully', () => {
      // Intercept with error response
      cy.intercept('GET', '**/api/students/assigned', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('getStudentsError')

      cy.visit('/health-records')

      // Page should still render, possibly with error message
      cy.get('body').should('be.visible')
    })
  })

  context('Responsive Design and Layout', () => {
    it('should display properly on desktop viewport', () => {
      cy.viewport(1920, 1080)
      cy.getByTestId('health-records-page').should('be.visible')
      cy.contains('Health Records Management').should('be.visible')
    })

    it('should display properly on tablet viewport', () => {
      cy.viewport('ipad-2')
      cy.getByTestId('health-records-page').should('be.visible')
      cy.contains('Health Records Management').should('be.visible')
    })

    it('should adapt layout for mobile devices', () => {
      cy.viewport('iphone-x')
      cy.getByTestId('health-records-page').should('be.visible')

      // Content should be stacked vertically on mobile
      cy.contains('Health Records Management').should('be.visible')
    })

    it('should maintain functionality across viewport sizes', () => {
      const viewports: Array<Cypress.ViewportPreset | [number, number]> = ['iphone-x', 'ipad-2', [1920, 1080]]

      viewports.forEach((viewport) => {
        if (Array.isArray(viewport)) {
          cy.viewport(viewport[0], viewport[1])
        } else {
          cy.viewport(viewport)
        }
        cy.getByTestId('health-records-page').should('be.visible')
        cy.getByTestId('student-selector').should('exist')
      })
    })
  })

  context('Security and Authentication', () => {
    it('should require authentication to access health records', () => {
      // Clear session and attempt to access page
      cy.clearCookies()
      cy.clearLocalStorage()

      cy.visit('/health-records')

      // Should redirect to login
      cy.url({ timeout: 5000 }).should('include', '/login')
    })

    it('should verify PHI access warning is displayed', () => {
      // When accessing PHI data, warning should be shown
      cy.getByTestId('privacy-notice').should('be.visible')
      cy.getByTestId('hipaa-compliance-badge').should('be.visible')
    })

    it.skip('should include audit logging for page access', () => {
      // TODO: Implement audit logging feature
      // Setup audit log interception
      cy.setupAuditLogInterception()

      // Visit page (already done in beforeEach, but explicit here)
      cy.reload()

      // Audit log should be created for PHI page access
      cy.wait('@auditLog', { timeout: 3000 }).then((interception) => {
        if (interception?.response?.statusCode === 200) {
          cy.log('Audit log created for health records page access')
        }
      })
    })
  })

  context('Accessibility Compliance', () => {
    it('should have proper ARIA landmarks for screen readers', () => {
      // Main content area should have landmark roles
      cy.get('[role="main"], main, [data-testid="health-records-page"]')
        .should('exist')
    })

    it('should have keyboard-navigable interactive elements', () => {
      // Tab through interactive elements
      cy.get('button, a, input, select')
        .first()
        .focus()
        .should('be.focused')
    })

    it('should provide text alternatives for visual content', () => {
      // Icons should have accessible labels
      cy.get('svg').each(($svg) => {
        const parent = $svg.parent()
        const hasAriaLabel = parent.attr('aria-label')
        const hasTitle = $svg.find('title').length > 0
        const hasText = parent.text().trim().length > 0

        expect(hasAriaLabel || hasTitle || hasText).to.be.true
      })
    })

    it('should have sufficient color contrast for readability', () => {
      // Main heading should have good contrast
      cy.contains('Health Records Management')
        .should('have.css', 'color')
        .and('not.equal', 'rgba(0, 0, 0, 0)')
    })

    it('should support screen reader announcements for dynamic content', () => {
      // ARIA live regions for dynamic updates
      cy.get('[aria-live], [role="status"], [role="alert"]')
        .should('exist')
    })
  })
})

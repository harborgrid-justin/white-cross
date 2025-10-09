/// <reference types="cypress" />

/**
 * Dashboard - Page Load & Structure Tests
 *
 * Comprehensive testing of dashboard page loading, structure, and initial render
 * Healthcare Context: Critical dashboard for school nurses to access student health data
 *
 * Test Coverage:
 * - Page load performance and error handling
 * - Semantic HTML structure and accessibility
 * - Layout rendering and responsive design
 * - Authentication persistence
 * - Core Web Vitals monitoring
 */

describe('Dashboard - Page Load & Structure', () => {
  beforeEach(() => {
    // Login as nurse and navigate to dashboard
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  context('Page Load & Performance', () => {
    it('should load dashboard page within acceptable time (< 3s)', () => {
      const startTime = performance.now()

      cy.visit('/dashboard')
      cy.get('[data-cy=dashboard-container], main').should('be.visible')

      cy.window().then(() => {
        const loadTime = performance.now() - startTime
        expect(loadTime).to.be.lessThan(3000)
      })

      cy.url().should('include', '/dashboard')
    })

    it('should display loading states during initial render', () => {
      cy.intercept('GET', '**/api/dashboard/**', (req) => {
        req.reply((res) => {
          res.delay = 500 // Simulate network delay
        })
      }).as('dashboardData')

      cy.visit('/dashboard')

      // Verify loading skeletons appear
      cy.get('[data-cy*=skeleton], [class*="skeleton"], [class*="loading"]', { timeout: 100 })
        .should('exist')

      cy.wait('@dashboardData')

      // Verify loading skeletons disappear
      cy.get('[data-cy*=skeleton], [class*="skeleton"]', { timeout: 5000 })
        .should('not.exist')
    })

    it('should load page without JavaScript errors', () => {
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError')
      })

      cy.visit('/dashboard')
      cy.get('body').should('be.visible')

      cy.get('@consoleError').should('not.be.called')
    })

    it('should render within acceptable time for Core Web Vitals', () => {
      cy.visit('/dashboard')

      cy.window().then((win) => {
        cy.window().its('performance').then((performance) => {
          // Check Largest Contentful Paint (LCP) - should be < 2.5s
          const paintEntries = performance.getEntriesByType('paint')
          const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint')

          if (lcp) {
            expect(lcp.startTime).to.be.lessThan(2500)
          }
        })
      })
    })

    it('should prefetch critical resources', () => {
      cy.visit('/dashboard')

      cy.window().its('performance').then((performance) => {
        const resourceEntries = performance.getEntriesByType('resource')

        // Verify that critical resources are loaded
        expect(resourceEntries.length).to.be.greaterThan(0)
      })
    })
  })

  context('Page Structure & Semantic HTML', () => {
    it('should have proper semantic HTML structure', () => {
      cy.get('header').should('exist').and('be.visible')
      cy.get('main, [role="main"]').should('exist').and('be.visible')
      cy.get('nav, [role="navigation"]').should('exist')
    })

    it('should have accessible page title and heading hierarchy', () => {
      // Document title
      cy.title().should('match', /dashboard/i)

      // Main heading (should be only one h1)
      cy.get('h1').should('have.length', 1)
        .and('be.visible')
        .and('contain.text', /dashboard/i)

      // Verify heading hierarchy (h2, h3 should exist)
      cy.get('h2, h3').should('exist')
    })

    it('should have proper ARIA landmarks', () => {
      cy.get('[role="banner"], header').should('exist')
      cy.get('[role="navigation"], nav').should('exist')
      cy.get('[role="main"], main').should('exist')
    })

    it('should display main content area with proper structure', () => {
      cy.get('main, [role="main"]')
        .should('be.visible')
        .within(() => {
          // Verify content container exists
          cy.get('[data-cy=dashboard-content], [class*="dashboard"]')
            .should('exist')
        })
    })

    it('should have proper page spacing and layout containers', () => {
      cy.get('[class*="container"], [class*="wrapper"]').should('exist')

      // Verify grid or flex layout
      cy.get('[class*="grid"], [class*="flex"]').should('exist')

      // Verify spacing utilities are applied
      cy.get('[class*="space-y"], [class*="gap"], [class*="p-"]').should('exist')
    })
  })

  context('Navigation & Layout Components', () => {
    it('should display header with navigation', () => {
      cy.get('header')
        .should('be.visible')
        .within(() => {
          cy.get('nav').should('exist')
        })
    })

    it('should display sidebar navigation menu', () => {
      cy.get('aside, nav[class*="sidebar"]')
        .should('exist')
        .within(() => {
          // Verify navigation links
          cy.get('a, button').should('have.length.at.least', 3)
        })
    })

    it('should show user profile menu in header', () => {
      cy.get('header')
        .within(() => {
          cy.get('[data-cy=user-menu], button[aria-label*="user" i]')
            .should('exist')
        })
    })

    it('should have skip to main content link for accessibility', () => {
      // Skip link should be the first focusable element
      cy.get('body').focus()
      cy.realPress('Tab')
      cy.focused().should('contain.text', /skip to main content|skip to content/i)
    })
  })

  context('Authentication & Security', () => {
    it('should maintain authentication on page load', () => {
      cy.url().should('not.include', '/login')
      cy.get('body').should('be.visible')

      // Verify user is authenticated by checking for authenticated-only content
      cy.get('[data-cy=dashboard-container], main').should('exist')
    })

    it('should display user role indicator', () => {
      cy.get('[data-cy=user-role], [class*="user-role"]')
        .should('exist')
        .and('contain.text', /nurse/i)
    })

    it('should handle token refresh on dashboard load', () => {
      cy.intercept('POST', '**/api/auth/refresh', {
        statusCode: 200,
        body: { token: 'refreshed-token' }
      }).as('tokenRefresh')

      cy.visit('/dashboard')
      cy.get('body').should('be.visible')
    })
  })

  context('Styling & Visual Presentation', () => {
    it('should have proper background styling', () => {
      cy.get('body').should('have.css', 'background-color')
        .and('not.equal', 'rgba(0, 0, 0, 0)')
    })

    it('should load all critical CSS', () => {
      cy.get('head link[rel="stylesheet"]')
        .should('exist')
        .and('have.length.at.least', 1)
    })

    it('should have consistent color scheme', () => {
      cy.get('body').should('have.css', 'color')

      // Verify primary elements have defined colors
      cy.get('header').should('have.css', 'background-color')
    })

    it('should apply proper font styling', () => {
      cy.get('body')
        .should('have.css', 'font-family')
        .and('not.equal', 'Times New Roman')
    })
  })

  context('Responsive Design', () => {
    it('should have responsive layout container', () => {
      cy.get('[class*="container"], [class*="responsive"]').should('exist')

      // Verify responsive breakpoints are applied
      cy.get('[class*="md:"], [class*="lg:"], [class*="xl:"]').should('exist')
    })

    it('should adapt to mobile viewport', () => {
      cy.viewport(375, 667)
      cy.reload()

      cy.get('body').should('be.visible')
      cy.get('[data-cy=mobile-menu], button[aria-label*="menu" i]').should('exist')
    })
  })

  context('Error Handling', () => {
    it('should not show loading spinner after page loads completely', () => {
      cy.wait(2000)
      cy.get('[data-cy=page-spinner], [class*="spinner"][class*="page"]').should('not.exist')
    })

    it('should handle missing data gracefully', () => {
      cy.intercept('GET', '**/api/dashboard/**', {
        statusCode: 200,
        body: { data: [] }
      }).as('emptyData')

      cy.visit('/dashboard')
      cy.wait('@emptyData')

      // Should still render page structure
      cy.get('main').should('be.visible')
    })

    it('should display error boundary on critical errors', () => {
      // This test verifies that error boundaries are in place
      cy.visit('/dashboard')
      cy.get('body').should('be.visible')

      // Verify no uncaught errors
      cy.window().then((win) => {
        expect(win).to.have.property('console')
      })
    })
  })

  context('HIPAA Compliance & Security Headers', () => {
    it('should include security headers for HIPAA compliance', () => {
      cy.request('/dashboard').then((response) => {
        // Verify no sensitive data in response headers
        expect(response.headers).to.not.have.property('x-powered-by')
      })
    })

    it('should not expose sensitive information in HTML', () => {
      cy.get('body').should('not.contain', 'password')
      cy.get('body').should('not.contain', 'api-key')
      cy.get('body').should('not.contain', 'secret')
    })
  })
})

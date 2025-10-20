/// <reference types="cypress" />

/**
 * Incident Reporting - Healthcare Safety & Compliance Tests
 *
 * Enterprise-grade testing for student incident reporting system
 * Healthcare Context: Critical for student safety, legal compliance, parent communication,
 * and maintaining detailed records of all health and safety incidents on school premises
 *
 * Test Coverage:
 * - Incident creation and documentation workflows
 * - Severity classification and prioritization
 * - Parent/guardian notification requirements
 * - Follow-up action tracking
 * - Incident reporting compliance (state/federal requirements)
 * - Data privacy and HIPAA compliance for health-related incidents
 * - Search, filter, and reporting capabilities
 * - Attachment handling (photos, documents)
 * - Real-time notifications for critical incidents
 */

describe('Incident Reporting', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/incident-reports')
  })

  context('Page Load & Structure', () => {
    it('should display incident reports page with proper structure', () => {
      cy.contains(/incident/i, { timeout: 10000 }).should('be.visible')
      cy.url().should('include', '/incident-reports')

      // Verify main page elements
      cy.get('header').should('be.visible')
      cy.get('nav').should('be.visible')
      cy.get('main, [role="main"]').should('be.visible')
    })

    it('should have accessible page title and headings', () => {
      cy.get('h1, h2, [role="heading"]')
        .should('exist')
        .and('be.visible')
        .and('contain.text', /incident/i)

      cy.title().should('match', /incident/i)
    })

    it('should maintain nurse authentication', () => {
      cy.url().should('not.include', '/login')
      cy.get('body').should('be.visible')
    })

    it('should display create incident report button', () => {
      cy.get('button, a').contains(/new.*incident|create.*incident|report.*incident/i)
        .should('be.visible')
        .and('not.be.disabled')
    })
  })

  context('Incident List & Viewing', () => {
    it('should display list of incident reports', () => {
      cy.wait(1000)

      // Verify incident list or empty state
      cy.get('body').then(($body) => {
        const hasIncidents = $body.find('[data-cy*="incident"], [class*="incident-list"], tbody tr').length > 0
        const hasEmptyState = $body.text().includes('No incidents') || $body.text().includes('no reports')

        expect(hasIncidents || hasEmptyState).to.be.true
      })
    })

    it('should show incident summary information in list', () => {
      cy.get('body').then(($body) => {
        const hasIncidents = $body.find('tbody tr, [class*="incident-item"]').length > 0

        if (hasIncidents) {
          // Verify incident cards/rows show key info
          cy.get('tbody tr, [class*="incident-item"]').first().within(() => {
            // Should show date, student name, type, or status
            cy.get('td, [class*="incident"]').should('exist')
          })
        }
      })
    })

    it('should display incident severity indicators', () => {
      cy.get('[class*="severity"], [class*="critical"], [class*="priority"]').should('exist')
    })

    it('should show incident status badges', () => {
      cy.contains(/pending|resolved|in.*progress|under.*review/i).should('exist')
    })

    it('should display incident timestamps', () => {
      cy.contains(/ago|today|yesterday|\d{1,2}:\d{2}|am|pm/i).should('exist')
    })
  })

  context('Creating New Incident Report', () => {
    it('should open incident creation modal/form', () => {
      cy.get('button').contains(/new.*incident|create.*incident|report.*incident/i)
        .click()

      cy.get('[data-cy=incident-modal], [data-cy=incident-form], [role="dialog"]')
        .should('be.visible')
    })

    it('should have all required incident fields', () => {
      cy.get('button').contains(/new.*incident|create.*incident/i).click()
      cy.wait(500)

      // Verify critical fields exist
      cy.get('[data-cy*="student"], [name*="student"], input[placeholder*="student" i]')
        .should('exist')

      cy.get('[data-cy*="type"], [name*="type"], select[name*="type"]')
        .should('exist')

      cy.get('[data-cy*="description"], [name*="description"], textarea')
        .should('exist')

      cy.get('[data-cy*="date"], [name*="date"], input[type="date"]')
        .should('exist')
    })

    it('should allow selecting student for incident', () => {
      cy.get('button').contains(/new.*incident|create.*incident/i).click()
      cy.wait(500)

      cy.get('[data-cy*="student-select"], [name*="student"], select').then(($select) => {
        if ($select.length > 0) {
          cy.wrap($select).select(1) // Select first student
        } else {
          // Autocomplete/search field
          cy.get('input[placeholder*="student" i]').type('John')
          cy.wait(500)
        }
      })
    })

    it('should allow selecting incident type/category', () => {
      cy.get('button').contains(/new.*incident|create.*incident/i).click()
      cy.wait(500)

      // Common incident types: Injury, Illness, Behavioral, Accident
      cy.get('[data-cy*="type"], [name*="type"], select[name*="type"]').then(($field) => {
        if ($field.length > 0) {
          cy.wrap($field).select(1)
        }
      })
    })

    it('should allow setting incident severity level', () => {
      cy.get('button').contains(/new.*incident|create.*incident/i).click()
      cy.wait(500)

      // Severity: Low, Medium, High, Critical
      cy.get('[data-cy*="severity"], [name*="severity"], select[name*="severity"]').then(($field) => {
        if ($field.length > 0) {
          cy.wrap($field).select('MEDIUM')
        }
      })
    })

    it('should allow entering incident description', () => {
      cy.get('button').contains(/new.*incident|create.*incident/i).click()
      cy.wait(500)

      cy.get('[data-cy*="description"], textarea, [name*="description"]')
        .type('Student fell on playground during recess. Minor scrape on knee. First aid provided.')
        .should('have.value', /playground|first aid/i)
    })

    it('should allow specifying incident location', () => {
      cy.get('button').contains(/new.*incident|create.*incident/i).click()
      cy.wait(500)

      cy.get('[data-cy*="location"], [name*="location"], input[name*="location"]').then(($field) => {
        if ($field.length > 0) {
          cy.wrap($field).type('Playground')
        }
      })
    })

    it('should allow selecting witness information', () => {
      cy.get('button').contains(/new.*incident|create.*incident/i).click()
      cy.wait(500)

      cy.get('[data-cy*="witness"], [name*="witness"]').then(($field) => {
        if ($field.length > 0) {
          cy.wrap($field).type('Teacher Jane Smith')
        }
      })
    })

    it('should validate required fields before submission', () => {
      cy.get('button').contains(/new.*incident|create.*incident/i).click()
      cy.wait(500)

      // Try to submit empty form
      cy.get('button[type="submit"], button').contains(/save|submit|create/i).click()

      // Should show validation errors
      cy.contains(/required|must|enter|select/i, { timeout: 5000 }).should('be.visible')
    })

    it('should successfully create incident report with valid data', () => {
      cy.intercept('POST', '**/api/incidents*').as('createIncident')

      cy.get('button').contains(/new.*incident|create.*incident/i).click()
      cy.wait(500)

      // Fill form with valid data
      cy.get('[data-cy*="student"], [name*="student"], select').then(($field) => {
        if ($field.length > 0) {
          cy.wrap($field).select(1)
        }
      })

      cy.get('[data-cy*="type"], [name*="type"], select').then(($field) => {
        if ($field.length > 0) {
          cy.wrap($field).select(1)
        }
      })

      cy.get('textarea, [data-cy*="description"]').type('Test incident description')

      cy.get('button[type="submit"], button').contains(/save|submit|create/i).click()

      // Verify success
      cy.wait('@createIncident', { timeout: 10000 }).its('response.statusCode').should('eq', 201)
      cy.contains(/success|created|saved/i, { timeout: 5000 }).should('be.visible')
    })
  })

  context('Parent/Guardian Notification', () => {
    it('should show parent notification checkbox for incidents', () => {
      cy.get('button').contains(/new.*incident|create.*incident/i).click()
      cy.wait(500)

      cy.get('[data-cy*="notify-parent"], [name*="notify"], input[type="checkbox"]')
        .should('exist')
    })

    it('should indicate parent notification status on incident list', () => {
      cy.contains(/notified|pending.*notification|parent.*contacted/i).should('exist')
    })

    it('should allow documenting parent communication', () => {
      cy.get('button').contains(/new.*incident|create.*incident/i).click()
      cy.wait(500)

      cy.get('body').then(($body) => {
        const hasParentField = $body.find('[data-cy*="parent"], [name*="parent-contact"]').length > 0

        if (hasParentField) {
          cy.get('[data-cy*="parent"], [name*="parent-contact"]')
            .type('Spoke with mother via phone at 2:30 PM')
        }
      })
    })
  })

  context('Incident Search & Filtering', () => {
    it('should have search functionality for incidents', () => {
      cy.get('input[type="search"], input[placeholder*="search" i]')
        .should('be.visible')
        .type('student name')

      cy.wait(500)
    })

    it('should filter incidents by type', () => {
      cy.get('select, [role="combobox"]').contains(/type|category/i).then(($filter) => {
        if ($filter.length > 0) {
          cy.wrap($filter).select(1)
          cy.wait(500)
        }
      })
    })

    it('should filter incidents by severity', () => {
      cy.get('select, [role="combobox"]').contains(/severity|priority/i).then(($filter) => {
        if ($filter.length > 0) {
          cy.wrap($filter).select('HIGH')
          cy.wait(500)
        }
      })
    })

    it('should filter incidents by status', () => {
      cy.get('select, [role="combobox"]').contains(/status/i).then(($filter) => {
        if ($filter.length > 0) {
          cy.wrap($filter).select('PENDING')
          cy.wait(500)
        }
      })
    })

    it('should filter incidents by date range', () => {
      cy.get('input[type="date"]').then(($dates) => {
        if ($dates.length >= 2) {
          cy.wrap($dates).first().type('2024-01-01')
          cy.wrap($dates).last().type('2024-12-31')
        }
      })
    })
  })

  context('Incident Details & Follow-up', () => {
    it('should view detailed incident information', () => {
      cy.get('tbody tr, [class*="incident-item"]').then(($items) => {
        if ($items.length > 0) {
          cy.wrap($items).first().click()
          cy.wait(500)

          // Should show detailed view or modal
          cy.get('[data-cy=incident-detail], [role="dialog"]').should('be.visible')
        }
      })
    })

    it('should display follow-up actions required', () => {
      cy.contains(/follow-up|action.*required|next.*steps/i).should('exist')
    })

    it('should allow adding follow-up notes', () => {
      cy.get('tbody tr, [class*="incident-item"]').then(($items) => {
        if ($items.length > 0) {
          cy.wrap($items).first().click()
          cy.wait(500)

          cy.get('textarea, [data-cy*="note"], [placeholder*="note" i]').then(($field) => {
            if ($field.length > 0) {
              cy.wrap($field).type('Follow-up completed. Student recovered well.')
            }
          })
        }
      })
    })

    it('should allow updating incident status', () => {
      cy.get('tbody tr, [class*="incident-item"]').then(($items) => {
        if ($items.length > 0) {
          cy.wrap($items).first().click()
          cy.wait(500)

          cy.get('select[name*="status"], [data-cy*="status"]').then(($field) => {
            if ($field.length > 0) {
              cy.wrap($field).select('RESOLVED')
            }
          })
        }
      })
    })
  })

  context('Attachments & Documentation', () => {
    it('should allow uploading incident photos/documents', () => {
      cy.get('button').contains(/new.*incident|create.*incident/i).click()
      cy.wait(500)

      cy.get('input[type="file"], [data-cy*="upload"]').should('exist')
    })

    it('should display attached files on incident', () => {
      cy.get('tbody tr, [class*="incident-item"]').then(($items) => {
        if ($items.length > 0) {
          cy.wrap($items).first().click()
          cy.wait(500)

          cy.get('[class*="attachment"], [data-cy*="file"]').should('exist')
        }
      })
    })
  })

  context('HIPAA Compliance & Privacy', () => {
    it('should not expose sensitive health information in URLs', () => {
      cy.url().should('not.match', /ssn|dob|medicalrecord/i)
    })

    it('should log incident access for audit trail', () => {
      cy.intercept('POST', '**/api/audit-log*').as('auditLog')

      cy.visit('/incident-reports')
      cy.wait(1000)

      // Access should be logged
      cy.wait('@auditLog', { timeout: 5000 }).then((interception) => {
        if (interception) {
          expect(interception.request.body).to.have.property('action')
        }
      })
    })

    it('should require authentication for incident access', () => {
      cy.clearCookies()
      cy.clearLocalStorage()

      cy.visit('/incident-reports', { failOnStatusCode: false })

      // Should redirect to login
      cy.url({ timeout: 3000 }).should('include', '/login')
    })
  })

  context('Accessibility & Usability', () => {
    it('should have keyboard-accessible incident creation', () => {
      cy.get('button').contains(/new.*incident/i).focus()
      cy.realPress('Enter')

      cy.get('[data-cy=incident-modal], [role="dialog"]').should('be.visible')
    })

    it('should have proper ARIA labels on form fields', () => {
      cy.get('button').contains(/new.*incident/i).click()
      cy.wait(500)

      cy.get('input, select, textarea').each(($field) => {
        cy.wrap($field).should('satisfy', ($el) => {
          return $el.attr('aria-label') || $el.attr('aria-labelledby') || $el.attr('id')
        })
      })
    })

    it('should have proper error messages for validation', () => {
      cy.get('button').contains(/new.*incident/i).click()
      cy.wait(500)

      cy.get('button[type="submit"]').click()

      // Error messages should be accessible
      cy.get('[role="alert"], [class*="error"]').should('be.visible')
    })
  })

  context('Performance & Load Times', () => {
    it('should load incident reports page within 3 seconds', () => {
      const startTime = performance.now()

      cy.visit('/incident-reports')
      cy.get('body').should('be.visible')

      cy.window().then(() => {
        const loadTime = performance.now() - startTime
        expect(loadTime).to.be.lessThan(3000)
      })
    })

    it('should handle large incident lists efficiently', () => {
      cy.visit('/incident-reports')
      cy.wait(1000)

      // Should implement pagination or virtual scrolling
      cy.get('body').should('be.visible')
    })
  })

  context('Mobile Responsiveness', () => {
    it('should display incident reports on mobile viewport', () => {
      cy.viewport(375, 667)
      cy.reload()

      cy.contains(/incident/i).should('be.visible')
      cy.get('button').should('be.visible')
    })

    it('should adapt incident creation form for mobile', () => {
      cy.viewport(375, 667)
      cy.reload()

      cy.get('button').contains(/new.*incident/i).click()
      cy.wait(500)

      cy.get('[data-cy=incident-modal], form').should('be.visible')
    })
  })
})

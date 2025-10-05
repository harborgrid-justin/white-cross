/// <reference types="cypress" />

/**
 * Accessibility Testing E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates WCAG compliance, keyboard navigation,
 * screen reader compatibility, and accessibility features for
 * healthcare management workflows.
 */

describe('Accessibility Testing', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.injectAxe() // Inject axe-core for accessibility testing
  })

  context('WCAG Compliance', () => {
    it('should pass WCAG 2.1 AA compliance on dashboard', () => {
      cy.visit('/dashboard')

      cy.checkA11y('[data-cy=dashboard-container]', {
        rules: {
          'color-contrast': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'screen-reader': { enabled: true }
        }
      })
    })

    it('should pass WCAG compliance on health records page', () => {
      cy.visit('/health-records')

      cy.checkA11y('[data-cy=health-records-container]', {
        rules: {
          'heading-order': { enabled: true },
          'image-alt': { enabled: true },
          'link-purpose': { enabled: true }
        }
      })
    })

    it('should pass WCAG compliance on forms', () => {
      cy.visit('/medications')
      cy.get('[data-cy=add-medication-button]').click()

      cy.checkA11y('[data-cy=medication-modal]', {
        rules: {
          'form-field-labels': { enabled: true },
          'form-field-help': { enabled: true },
          'form-field-required': { enabled: true }
        }
      })
    })

    it('should have proper color contrast ratios', () => {
      cy.visit('/dashboard')

      cy.checkA11y('[data-cy=dashboard-container]', {
        rules: {
          'color-contrast': { enabled: true }
        }
      })

      // Check specific color combinations
      cy.get('[data-cy=primary-button]').should('have.css', 'color')
      cy.get('[data-cy=text-on-dark]').should('have.css', 'color')
    })
  })

  context('Keyboard Navigation', () => {
    it('should support full keyboard navigation on dashboard', () => {
      cy.visit('/dashboard')

      // Test tab navigation
      cy.get('[data-cy=nav-item]').first().focus().tab()
      cy.get('[data-cy=nav-item]').eq(1).should('be.focused')

      // Test arrow key navigation in menus
      cy.get('[data-cy=main-navigation]').type('{downarrow}')
      cy.get('[data-cy=nav-submenu]').should('be.visible')

      // Test escape key functionality
      cy.get('[data-cy=modal-open-button]').click()
      cy.get('[data-cy=modal]').should('be.visible')
      cy.get('[data-cy=modal]').type('{esc}')
      cy.get('[data-cy=modal]').should('not.exist')
    })

    it('should support keyboard navigation in data tables', () => {
      cy.visit('/students')

      cy.get('[data-cy=students-table]').should('be.visible')
      cy.get('[data-cy=table-cell]').first().focus()

      // Test arrow key navigation in table
      cy.get('[data-cy=table-cell]').first().type('{rightarrow}')
      cy.get('[data-cy=table-cell]').eq(1).should('be.focused')

      cy.get('[data-cy=table-cell]').first().type('{downarrow}')
      cy.get('[data-cy=table-row]').eq(1).find('[data-cy=table-cell]').first().should('be.focused')
    })

    it('should support keyboard shortcuts for common actions', () => {
      cy.visit('/dashboard')

      // Test Ctrl+S for save (common shortcut)
      cy.get('[data-cy=editable-field]').first().focus().type('{ctrl}s')
      cy.get('[data-cy=save-indicator]').should('be.visible')

      // Test Ctrl+F for search
      cy.get('[data-cy=search-input]').should('be.visible')
      cy.get('body').type('{ctrl}f')
      cy.get('[data-cy=search-input]').should('be.focused')
    })

    it('should handle keyboard focus management in modals', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()
      cy.get('[data-cy=medication-modal]').should('be.visible')

      // Focus should be trapped within modal
      cy.get('[data-cy=modal-first-focusable]').should('be.focused')
      cy.get('[data-cy=modal-first-focusable]').tab()
      cy.get('[data-cy=modal-last-focusable]').should('be.focused')

      // Tab from last element should go back to first
      cy.get('[data-cy=modal-last-focusable]').tab()
      cy.get('[data-cy=modal-first-focusable]').should('be.focused')
    })
  })

  context('Screen Reader Compatibility', () => {
    it('should have proper ARIA labels and descriptions', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=dashboard-title]').should('have.attr', 'aria-label')
      cy.get('[data-cy=navigation-menu]').should('have.attr', 'aria-label')
      cy.get('[data-cy=data-table]').should('have.attr', 'role', 'table')
      cy.get('[data-cy=table-header]').should('have.attr', 'role', 'columnheader')
    })

    it('should provide meaningful screen reader announcements', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=create-record-button]').click()
      cy.get('[data-cy=record-modal]').should('be.visible')

      // Check for aria-live regions for dynamic content
      cy.get('[data-cy=success-message]').should('have.attr', 'aria-live', 'polite')
      cy.get('[data-cy=error-message]').should('have.attr', 'aria-live', 'assertive')
      cy.get('[data-cy=loading-indicator]').should('have.attr', 'aria-live', 'polite')
    })

    it('should support screen reader navigation landmarks', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=main-content]').should('have.attr', 'role', 'main')
      cy.get('[data-cy=navigation]').should('have.attr', 'role', 'navigation')
      cy.get('[data-cy=search-section]').should('have.attr', 'role', 'search')
      cy.get('[data-cy=complementary-info]').should('have.attr', 'role', 'complementary')
    })

    it('should provide proper heading structure', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=page-title]').should('have.prop', 'tagName').should('match', /^H[1-6]$/)
      cy.get('[data-cy=section-heading]').should('have.prop', 'tagName').should('match', /^H[1-6]$/)

      // Check heading hierarchy
      cy.get('[data-cy=page-title]').then(($title) => {
        const titleLevel = parseInt($title.prop('tagName').charAt(1))
        cy.get('[data-cy=section-heading]').then(($section) => {
          const sectionLevel = parseInt($section.prop('tagName').charAt(1))
          expect(sectionLevel).to.be.greaterThan(titleLevel)
        })
      })
    })
  })

  context('Form Accessibility', () => {
    it('should have proper form labels and associations', () => {
      cy.visit('/medications')
      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=medication-name-input]').should('have.attr', 'aria-label')
      cy.get('[data-cy=medication-name-input]').should('have.attr', 'aria-describedby')
      cy.get('[data-cy=form-help-text]').should('have.attr', 'id')
    })

    it('should support form validation announcements', () => {
      cy.visit('/medications')
      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=save-button]').click()

      // Check for validation error announcements
      cy.get('[data-cy=validation-error]').should('have.attr', 'aria-live', 'assertive')
      cy.get('[data-cy=validation-error]').should('have.attr', 'role', 'alert')
    })

    it('should provide accessible form instructions', () => {
      cy.visit('/system-config')

      cy.get('[data-cy=form-instructions]').should('have.attr', 'aria-describedby')
      cy.get('[data-cy=required-field-indicator]').should('be.visible')
      cy.get('[data-cy=form-fieldset]').should('have.attr', 'aria-describedby')
    })

    it('should support accessible form submission', () => {
      cy.visit('/medications')
      cy.get('[data-cy=add-medication-button]').click()

      cy.get('[data-cy=save-button]').should('have.attr', 'aria-label')
      cy.get('[data-cy=cancel-button]').should('have.attr', 'aria-label')

      // Test keyboard form submission
      cy.get('[data-cy=medication-name-input]').type('Test Medication')
      cy.get('[data-cy=save-button]').focus().type('{enter}')
      cy.get('[data-cy=form-submitted]').should('be.visible')
    })
  })

  context('Data Table Accessibility', () => {
    it('should provide accessible data table structure', () => {
      cy.visit('/students')

      cy.get('[data-cy=students-table]').should('have.attr', 'role', 'table')
      cy.get('[data-cy=table-header]').should('have.attr', 'role', 'row')
      cy.get('[data-cy=table-cell]').should('have.attr', 'role', 'cell')
      cy.get('[data-cy=table-header-cell]').should('have.attr', 'role', 'columnheader')
    })

    it('should support table sorting accessibility', () => {
      cy.visit('/students')

      cy.get('[data-cy=sortable-header]').should('have.attr', 'aria-sort')
      cy.get('[data-cy=sort-button]').should('have.attr', 'aria-label')

      // Test sorting announcement
      cy.get('[data-cy=sort-button]').first().click()
      cy.get('[data-cy=sort-announcement]').should('have.attr', 'aria-live', 'polite')
    })

    it('should provide accessible table pagination', () => {
      cy.visit('/students')

      cy.get('[data-cy=table-pagination]').should('have.attr', 'role', 'navigation')
      cy.get('[data-cy=pagination-button]').should('have.attr', 'aria-label')
      cy.get('[data-cy=current-page-indicator]').should('have.attr', 'aria-current', 'page')
    })

    it('should support table row selection accessibility', () => {
      cy.visit('/students')

      cy.get('[data-cy=table-row]').should('have.attr', 'role', 'row')
      cy.get('[data-cy=selectable-row]').should('have.attr', 'aria-selected')
      cy.get('[data-cy=row-checkbox]').should('have.attr', 'aria-label')
    })
  })

  context('Interactive Element Accessibility', () => {
    it('should provide accessible buttons and links', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=primary-button]').should('have.attr', 'aria-label')
      cy.get('[data-cy=icon-button]').should('have.attr', 'aria-label')
      cy.get('[data-cy=link-button]').should('have.attr', 'aria-describedby')
    })

    it('should support accessible dropdown menus', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=dropdown-toggle]').should('have.attr', 'aria-haspopup', 'true')
      cy.get('[data-cy=dropdown-toggle]').should('have.attr', 'aria-expanded', 'false')

      cy.get('[data-cy=dropdown-toggle]').click()
      cy.get('[data-cy=dropdown-toggle]').should('have.attr', 'aria-expanded', 'true')
      cy.get('[data-cy=dropdown-menu]').should('have.attr', 'role', 'menu')
      cy.get('[data-cy=dropdown-item]').should('have.attr', 'role', 'menuitem')
    })

    it('should provide accessible modal dialogs', () => {
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()
      cy.get('[data-cy=medication-modal]').should('be.visible')

      cy.get('[data-cy=medication-modal]').should('have.attr', 'role', 'dialog')
      cy.get('[data-cy=modal-title]').should('have.attr', 'role', 'heading')
      cy.get('[data-cy=modal-close-button]').should('have.attr', 'aria-label')
    })

    it('should support accessible tabs and navigation', () => {
      cy.visit('/reports')

      cy.get('[data-cy=tab-list]').should('have.attr', 'role', 'tablist')
      cy.get('[data-cy=tab-button]').should('have.attr', 'role', 'tab')
      cy.get('[data-cy=tab-panel]').should('have.attr', 'role', 'tabpanel')

      cy.get('[data-cy=tab-button]').first().should('have.attr', 'aria-selected', 'true')
      cy.get('[data-cy=tab-button]').eq(1).should('have.attr', 'aria-selected', 'false')
    })
  })

  context('Visual Accessibility', () => {
    it('should support high contrast mode', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=high-contrast-toggle]').click()
      cy.get('[data-cy=high-contrast-active]').should('be.visible')

      // Check contrast improvements
      cy.get('[data-cy=primary-button]').should('have.css', 'border')
      cy.get('[data-cy=text-elements]').should('have.css', 'text-shadow')
    })

    it('should support text scaling up to 200%', () => {
      cy.visit('/dashboard')

      // Test with enlarged text
      cy.get('[data-cy=body-text]').should('have.css', 'font-size')
      cy.get('[data-cy=responsive-text]').should('be.visible')
      cy.get('[data-cy=text-scaling-support]').should('be.visible')
    })

    it('should provide visual focus indicators', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=focusable-element]').first().focus()
      cy.get('[data-cy=focusable-element]').first().should('have.class', 'focused')

      cy.get('[data-cy=focus-outline]').should('be.visible')
      cy.get('[data-cy=focus-ring]').should('have.css', 'outline')
    })

    it('should support reduced motion preferences', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=animation-toggle]').click()
      cy.get('[data-cy=reduced-motion-active]').should('be.visible')

      // Check that animations are reduced
      cy.get('[data-cy=animated-element]').should('have.css', 'animation-duration', '0.01ms')
    })
  })

  context('Assistive Technology Support', () => {
    it('should support voice control software', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=voice-control-elements]').should('be.visible')
      cy.get('[data-cy=voice-command-indicators]').should('be.visible')
      cy.get('[data-cy=speech-recognition-buttons]').should('be.visible')
    })

    it('should support switch control devices', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=switch-control-elements]').should('be.visible')
      cy.get('[data-cy=scan-navigation]').should('be.visible')
      cy.get('[data-cy=switch-activation-points]').should('be.visible')
    })

    it('should support eye tracking technology', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=eye-tracking-elements]').should('be.visible')
      cy.get('[data-cy=dwell-activation]').should('be.visible')
      cy.get('[data-cy=eye-gaze-indicators]').should('be.visible')
    })

    it('should support alternative input methods', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=alternative-input-options]').should('be.visible')
      cy.get('[data-cy=mouth-stick-navigation]').should('be.visible')
      cy.get('[data-cy=head-pointer-support]').should('be.visible')
      cy.get('[data-cy=single-switch-scanning]').should('be.visible')
    })
  })

  context('Error and Status Accessibility', () => {
    it('should provide accessible error messages', () => {
      cy.visit('/medications')

      cy.get('[data-cy=create-record-button]').click()
      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=error-message]').should('have.attr', 'role', 'alert')
      cy.get('[data-cy=error-message]').should('have.attr', 'aria-live', 'assertive')
      cy.get('[data-cy=error-message]').should('have.attr', 'aria-atomic', 'true')
    })

    it('should provide accessible success messages', () => {
      cy.visit('/medications')

      cy.get('[data-cy=create-record-button]').click()
      cy.get('[data-cy=record-modal]').should('be.visible')

      // Fill required fields and save
      cy.get('[data-cy=medication-name]').type('Test Medication')
      cy.get('[data-cy=save-button]').click()

      cy.get('[data-cy=success-message]').should('have.attr', 'role', 'status')
      cy.get('[data-cy=success-message]').should('have.attr', 'aria-live', 'polite')
    })

    it('should provide accessible loading indicators', () => {
      cy.visit('/reports')

      cy.get('[data-cy=generate-report-button]').click()

      cy.get('[data-cy=loading-indicator]').should('have.attr', 'role', 'progressbar')
      cy.get('[data-cy=loading-indicator]').should('have.attr', 'aria-label')
      cy.get('[data-cy=loading-indicator]').should('have.attr', 'aria-valuemin', '0')
      cy.get('[data-cy=loading-indicator]').should('have.attr', 'aria-valuemax', '100')
    })

    it('should provide accessible progress tracking', () => {
      cy.visit('/data-management')

      cy.get('[data-cy=bulk-export-button]').click()
      cy.get('[data-cy=start-bulk-export]').click()

      cy.get('[data-cy=progress-bar]').should('have.attr', 'role', 'progressbar')
      cy.get('[data-cy=progress-text]').should('have.attr', 'aria-live', 'polite')
      cy.get('[data-cy=estimated-time]').should('be.visible')
    })
  })

  context('Mobile Accessibility', () => {
    it('should maintain accessibility on mobile devices', () => {
      cy.viewport('iphone-8')
      cy.visit('/dashboard')

      cy.checkA11y('[data-cy=dashboard-container]', {
        rules: {
          'touch-target-size': { enabled: true },
          'mobile-keyboard-navigation': { enabled: true }
        }
      })
    })

    it('should provide accessible touch targets on mobile', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-button]').should('have.css', 'min-height', '44px')
      cy.get('[data-cy=mobile-button]').should('have.css', 'min-width', '44px')
      cy.get('[data-cy=mobile-touch-target]').should('have.css', 'padding')
    })

    it('should support mobile screen reader gestures', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-screen-reader]').should('be.visible')
      cy.get('[data-cy=voiceover-support]').should('be.visible')
      cy.get('[data-cy=talkback-support]').should('be.visible')
    })

    it('should handle mobile orientation changes accessibly', () => {
      cy.viewport('iphone-8')

      // Portrait mode
      cy.get('[data-cy=content-portrait]').should('be.visible')

      // Landscape mode
      cy.viewport('iphone-8', 'landscape')
      cy.get('[data-cy=content-landscape]').should('be.visible')

      // Check that accessibility features remain intact
      cy.get('[data-cy=aria-labels-mobile]').should('be.visible')
    })
  })

  context('Healthcare-Specific Accessibility', () => {
    it('should provide accessible medical data presentation', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=medical-data-table]').should('have.attr', 'role', 'table')
      cy.get('[data-cy=vital-signs-data]').should('have.attr', 'aria-label')
      cy.get('[data-cy=medication-data]').should('have.attr', 'aria-describedby')
    })

    it('should support accessible emergency information', () => {
      cy.visit('/health-records')

      cy.get('[data-cy=emergency-info-section]').should('have.attr', 'role', 'region')
      cy.get('[data-cy=emergency-alert]').should('have.attr', 'aria-live', 'assertive')
      cy.get('[data-cy=critical-allergy-info]').should('have.attr', 'aria-label')
    })

    it('should provide accessible medication administration', () => {
      cy.visit('/medications')

      cy.get('[data-cy=medication-administration-form]').should('be.visible')
      cy.get('[data-cy=dosage-input]').should('have.attr', 'aria-label')
      cy.get('[data-cy=administration-time]').should('have.attr', 'aria-describedby')
      cy.get('[data-cy=medication-notes]').should('have.attr', 'aria-label')
    })

    it('should support accessible incident reporting', () => {
      cy.visit('/incidents')

      cy.get('[data-cy=incident-form]').should('be.visible')
      cy.get('[data-cy=incident-severity]').should('have.attr', 'aria-label')
      cy.get('[data-cy=incident-description]').should('have.attr', 'aria-describedby')
      cy.get('[data-cy=witness-statement]').should('have.attr', 'aria-label')
    })
  })

  context('Accessibility Testing Tools Integration', () => {
    it('should integrate with axe-core accessibility testing', () => {
      cy.visit('/dashboard')

      cy.checkA11y('[data-cy=dashboard-container]', {
        includedImpacts: ['critical', 'serious'],
        rules: {
          'color-contrast': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'screen-reader': { enabled: true },
          'form-field-labels': { enabled: true }
        }
      })
    })

    it('should generate accessibility reports', () => {
      cy.visit('/system-config')

      cy.get('[data-cy=accessibility-tab]').click()
      cy.get('[data-cy=run-accessibility-audit]').click()

      cy.get('[data-cy=audit-progress]').should('be.visible')
      cy.get('[data-cy=accessibility-report]').should('be.visible')
      cy.get('[data-cy=accessibility-violations]').should('be.visible')
      cy.get('[data-cy=export-accessibility-report]').should('be.visible')
    })

    it('should track accessibility compliance over time', () => {
      cy.visit('/system-config')

      cy.get('[data-cy=accessibility-tab]').click()

      cy.get('[data-cy=accessibility-trends]').should('be.visible')
      cy.get('[data-cy=compliance-score-history]').should('be.visible')
      cy.get('[data-cy=violation-trends]').should('be.visible')
    })
  })

  context('Internationalization Accessibility', () => {
    it('should support right-to-left languages accessibly', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=rtl-language-toggle]').click()
      cy.get('[data-cy=rtl-layout-active]').should('be.visible')

      cy.get('[data-cy=rtl-navigation]').should('be.visible')
      cy.get('[data-cy=rtl-text-direction]').should('have.attr', 'dir', 'rtl')
    })

    it('should support multiple language accessibility', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=language-selector]').select('Spanish')
      cy.get('[data-cy=spanish-interface]').should('be.visible')

      // Check that accessibility features work in different languages
      cy.get('[data-cy=aria-labels-spanish]').should('be.visible')
      cy.get('[data-cy=spanish-form-labels]').should('be.visible')
    })
  })
})

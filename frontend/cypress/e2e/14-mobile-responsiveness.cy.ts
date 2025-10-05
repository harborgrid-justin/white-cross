/// <reference types="cypress" />

/**
 * Mobile Responsiveness E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates mobile responsiveness including
 * touch interactions, responsive design, mobile-specific features,
 * and cross-device compatibility for healthcare workflows.
 */

describe('Mobile Responsiveness', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  context('Mobile Viewport and Layout', () => {
    it('should adapt to mobile viewport dimensions', () => {
      cy.viewport('iphone-8')
      cy.visit('/dashboard')

      cy.get('[data-cy=dashboard-title]').should('be.visible')
      cy.get('[data-cy=mobile-navigation]').should('be.visible')
      cy.get('[data-cy=mobile-friendly-layout]').should('be.visible')
    })

    it('should display mobile-optimized navigation', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-nav-toggle]').should('be.visible')
      cy.get('[data-cy=mobile-nav-menu]').should('not.be.visible')

      cy.get('[data-cy=mobile-nav-toggle]').click()
      cy.get('[data-cy=mobile-nav-menu]').should('be.visible')
      cy.get('[data-cy=mobile-nav-items]').should('have.length.greaterThan', 5)
    })

    it('should stack content appropriately on mobile', () => {
      cy.viewport('iphone-8')
      cy.visit('/health-records')

      cy.get('[data-cy=mobile-stacked-layout]').should('be.visible')
      cy.get('[data-cy=mobile-cards]').should('have.class', 'mobile-optimized')
      cy.get('[data-cy=content-width]').should('equal', '100%')
    })
  })

  context('Touch Interactions', () => {
    it('should support touch gestures for navigation', () => {
      cy.viewport('iphone-8')

      // Test swipe gestures
      cy.get('[data-cy=dashboard-content]').should('be.visible')
      cy.swipeLeft('[data-cy=dashboard-content]')
      cy.swipeRight('[data-cy=dashboard-content]')

      // Test tap interactions
      cy.get('[data-cy=mobile-nav-toggle]').click()
      cy.get('[data-cy=mobile-nav-item]').first().click()
    })

    it('should handle touch scrolling properly', () => {
      cy.viewport('iphone-8')
      cy.visit('/students')

      cy.get('[data-cy=students-list]').should('be.visible')
      cy.get('[data-cy=student-cards]').should('have.length.greaterThan', 10)

      // Test vertical scrolling
      cy.scrollTo('bottom')
      cy.get('[data-cy=load-more-students]').should('be.visible')

      cy.scrollTo('top')
      cy.get('[data-cy=students-search]').should('be.visible')
    })

    it('should support pinch-to-zoom functionality', () => {
      cy.viewport('iphone-8')
      cy.visit('/reports')

      cy.get('[data-cy=report-charts]').should('be.visible')
      cy.get('[data-cy=zoom-controls]').should('be.visible')

      // Test zoom in/out
      cy.get('[data-cy=zoom-in-button]').click()
      cy.get('[data-cy=chart-zoomed-in]').should('be.visible')

      cy.get('[data-cy=zoom-out-button]').click()
      cy.get('[data-cy=chart-normal-zoom]').should('be.visible')
    })
  })

  context('Mobile Forms and Input', () => {
    it('should display mobile-optimized forms', () => {
      cy.viewport('iphone-8')
      cy.visit('/medications')

      cy.get('[data-cy=add-medication-button]').click()
      cy.get('[data-cy=medication-modal]').should('be.visible')

      cy.get('[data-cy=mobile-form-layout]').should('be.visible')
      cy.get('[data-cy=form-fields-stacked]').should('be.visible')
      cy.get('[data-cy=mobile-keyboard-friendly]').should('be.visible')
    })

    it('should handle mobile keyboard interactions', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=student-search]').type('John Doe')
      cy.get('[data-cy=mobile-keyboard-input]').should('be.visible')

      // Test mobile keyboard dismissal
      cy.get('[data-cy=close-mobile-keyboard]').click()
      cy.get('[data-cy=mobile-keyboard-input]').should('not.be.visible')
    })

    it('should support voice input on mobile', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=voice-input-button]').should('be.visible')
      cy.get('[data-cy=voice-input-button]').click()

      cy.get('[data-cy=voice-input-modal]').should('be.visible')
      cy.get('[data-cy=voice-record-button]').should('be.visible')
      cy.get('[data-cy=voice-input-text]').should('be.visible')
    })

    it('should handle mobile form validation', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=create-record-button]').click()
      cy.get('[data-cy=record-modal]').should('be.visible')

      cy.get('[data-cy=save-button]').click()
      cy.get('[data-cy=mobile-validation-errors]').should('be.visible')
      cy.get('[data-cy=error-messages-mobile-friendly]').should('be.visible')
    })
  })

  context('Mobile-Specific Features', () => {
    it('should support mobile camera integration', () => {
      cy.viewport('iphone-8')
      cy.visit('/incidents')

      cy.get('[data-cy=report-incident-button]').click()
      cy.get('[data-cy=incident-modal]').should('be.visible')

      cy.get('[data-cy=add-photo-button]').click()
      cy.get('[data-cy=mobile-camera-modal]').should('be.visible')
      cy.get('[data-cy=camera-capture-button]').should('be.visible')
      cy.get('[data-cy=photo-gallery-button]').should('be.visible')
    })

    it('should integrate with mobile notifications', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-notification-settings]').should('be.visible')
      cy.get('[data-cy=push-notifications-toggle]').should('be.visible')
      cy.get('[data-cy=notification-sound-settings]').should('be.visible')
      cy.get('[data-cy=vibration-settings]').should('be.visible')
    })

    it('should support offline mode functionality', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=offline-mode-indicator]').should('be.visible')
      cy.get('[data-cy=offline-queue-actions]').should('be.visible')
      cy.get('[data-cy=sync-when-online]').should('be.visible')

      // Test offline data entry
      cy.get('[data-cy=offline-data-entry]').should('be.visible')
      cy.get('[data-cy=queue-for-sync]').should('be.visible')
    })

    it('should provide mobile-optimized quick actions', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-quick-actions]').should('be.visible')
      cy.get('[data-cy=mobile-shortcuts]').should('have.length.greaterThan', 3)

      cy.get('[data-cy=log-medication-mobile]').should('be.visible')
      cy.get('[data-cy=scan-barcode-mobile]').should('be.visible')
      cy.get('[data-cy=emergency-call-mobile]').should('be.visible')
    })
  })

  context('Responsive Tables and Lists', () => {
    it('should display mobile-optimized tables', () => {
      cy.viewport('iphone-8')
      cy.visit('/students')

      cy.get('[data-cy=students-table]').should('be.visible')
      cy.get('[data-cy=mobile-table-layout]').should('be.visible')
      cy.get('[data-cy=table-horizontal-scroll]').should('be.visible')
      cy.get('[data-cy=collapsible-table-rows]').should('be.visible')
    })

    it('should handle table column visibility on mobile', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=table-column-toggle]').should('be.visible')
      cy.get('[data-cy=essential-columns-only]').should('be.visible')
      cy.get('[data-cy=show-hide-columns]').click()
      cy.get('[data-cy=column-visibility-options]').should('be.visible')
    })

    it('should support mobile-friendly list views', () => {
      cy.viewport('iphone-8')
      cy.visit('/appointments')

      cy.get('[data-cy=appointments-list]').should('be.visible')
      cy.get('[data-cy=mobile-list-cards]').should('be.visible')
      cy.get('[data-cy=list-item-swipe-actions]').should('be.visible')
      cy.get('[data-cy=mobile-sort-options]').should('be.visible')
    })
  })

  context('Mobile Dashboard and Widgets', () => {
    it('should display mobile-optimized dashboard', () => {
      cy.viewport('iphone-8')
      cy.visit('/dashboard')

      cy.get('[data-cy=mobile-dashboard-layout]').should('be.visible')
      cy.get('[data-cy=mobile-widgets]').should('be.visible')
      cy.get('[data-cy=touch-friendly-buttons]').should('be.visible')
      cy.get('[data-cy=mobile-widget-grid]').should('be.visible')
    })

    it('should support mobile widget customization', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-edit-dashboard]').click()
      cy.get('[data-cy=mobile-widget-customization]').should('be.visible')

      cy.get('[data-cy=mobile-widget-reorder]').should('be.visible')
      cy.get('[data-cy=mobile-widget-resize]').should('be.visible')
      cy.get('[data-cy=mobile-widget-visibility]').should('be.visible')
    })

    it('should display mobile-friendly charts and graphs', () => {
      cy.viewport('iphone-8')
      cy.visit('/reports')

      cy.get('[data-cy=mobile-charts]').should('be.visible')
      cy.get('[data-cy=touch-chart-interactions]').should('be.visible')
      cy.get('[data-cy=mobile-chart-legends]').should('be.visible')
      cy.get('[data-cy=chart-data-labels-mobile]').should('be.visible')
    })
  })

  context('Mobile Healthcare Workflows', () => {
    it('should support mobile medication administration', () => {
      cy.viewport('iphone-8')
      cy.visit('/medications')

      cy.get('[data-cy=mobile-medication-workflow]').should('be.visible')
      cy.get('[data-cy=scan-medication-barcode]').should('be.visible')
      cy.get('[data-cy=mobile-dose-confirmation]').should('be.visible')
      cy.get('[data-cy=touch-signature-capture]').should('be.visible')
    })

    it('should support mobile health assessments', () => {
      cy.viewport('iphone-8')
      cy.visit('/health-records')

      cy.get('[data-cy=mobile-assessment-tools]').should('be.visible')
      cy.get('[data-cy=vital-signs-mobile-input]').should('be.visible')
      cy.get('[data-cy=mobile-photo-documentation]').should('be.visible')
      cy.get('[data-cy=touch-based-forms]').should('be.visible')
    })

    it('should support mobile incident reporting', () => {
      cy.viewport('iphone-8')
      cy.visit('/incidents')

      cy.get('[data-cy=mobile-incident-reporting]').should('be.visible')
      cy.get('[data-cy=voice-to-text-incident]').should('be.visible')
      cy.get('[data-cy=mobile-photo-evidence]').should('be.visible')
      cy.get('[data-cy=location-services-integration]').should('be.visible')
    })

    it('should support mobile parent communication', () => {
      cy.viewport('iphone-8')
      cy.visit('/communication')

      cy.get('[data-cy=mobile-communication-tools]').should('be.visible')
      cy.get('[data-cy=mobile-messaging-interface]').should('be.visible')
      cy.get('[data-cy=voice-call-integration]').should('be.visible')
      cy.get('[data-cy=video-call-capabilities]').should('be.visible')
    })
  })

  context('Mobile Performance and Optimization', () => {
    it('should load quickly on mobile networks', () => {
      cy.viewport('iphone-8')

      // Simulate slow network
      cy.intercept('*', (req) => {
        req.on('response', (res) => {
          res.setThrottle(100) // 100kbps
        })
      })

      cy.visit('/dashboard', { timeout: 10000 })
      cy.get('[data-cy=dashboard-loaded]', { timeout: 15000 }).should('be.visible')
    })

    it('should optimize images for mobile', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-optimized-images]').should('be.visible')
      cy.get('[data-cy=image-compression-applied]').should('be.visible')
      cy.get('[data-cy=lazy-loading-images]').should('be.visible')
    })

    it('should minimize mobile data usage', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=data-usage-optimization]').should('be.visible')
      cy.get('[data-cy=reduced-api-calls-mobile]').should('be.visible')
      cy.get('[data-cy=offline-data-caching]').should('be.visible')
      cy.get('[data-cy=bandwidth-optimization]').should('be.visible')
    })
  })

  context('Mobile Accessibility', () => {
    it('should support mobile screen readers', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-accessibility-features]').should('be.visible')
      cy.get('[data-cy=aria-labels-mobile]').should('be.visible')
      cy.get('[data-cy=screen-reader-optimized]').should('be.visible')
      cy.get('[data-cy=voice-control-support]').should('be.visible')
    })

    it('should support mobile keyboard navigation', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-keyboard-navigation]').should('be.visible')
      cy.get('[data-cy=focus-indicators-mobile]').should('be.visible')
      cy.get('[data-cy=tab-order-mobile-optimized]').should('be.visible')
    })

    it('should support mobile assistive technologies', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-assistive-tech]').should('be.visible')
      cy.get('[data-cy=voice-control-integration]').should('be.visible')
      cy.get('[data-cy=switch-control-support]').should('be.visible')
      cy.get('[data-cy=mobile-magnification]').should('be.visible')
    })
  })

  context('Cross-Device Compatibility', () => {
    it('should work on different mobile devices', () => {
      // Test iPhone SE
      cy.viewport('iphone-5')
      cy.visit('/dashboard')
      cy.get('[data-cy=dashboard-content]').should('be.visible')

      // Test iPhone Pro Max
      cy.viewport('iphone-8', 'landscape')
      cy.visit('/dashboard')
      cy.get('[data-cy=dashboard-content]').should('be.visible')

      // Test Android devices
      cy.viewport('samsung-s10')
      cy.visit('/dashboard')
      cy.get('[data-cy=dashboard-content]').should('be.visible')
    })

    it('should handle device orientation changes', () => {
      cy.viewport('iphone-8')

      // Portrait mode
      cy.visit('/students')
      cy.get('[data-cy=portrait-layout]').should('be.visible')

      // Landscape mode
      cy.viewport('iphone-8', 'landscape')
      cy.visit('/students')
      cy.get('[data-cy=landscape-layout]').should('be.visible')
    })

    it('should adapt to different screen densities', () => {
      // Standard density
      cy.viewport(375, 667) // iPhone 8
      cy.visit('/medications')
      cy.get('[data-cy=standard-density-layout]').should('be.visible')

      // High density (retina)
      cy.viewport(750, 1334) // iPhone 8 @2x
      cy.visit('/medications')
      cy.get('[data-cy=high-density-layout]').should('be.visible')
    })
  })

  context('Mobile-Specific Healthcare Features', () => {
    it('should support mobile barcode scanning', () => {
      cy.viewport('iphone-8')
      cy.visit('/medications')

      cy.get('[data-cy=scan-barcode-button]').click()
      cy.get('[data-cy=barcode-scanner-modal]').should('be.visible')
      cy.get('[data-cy=camera-permissions]').should('be.visible')
      cy.get('[data-cy=scan-instructions]').should('be.visible')
    })

    it('should support mobile vital signs capture', () => {
      cy.viewport('iphone-8')
      cy.visit('/health-records')

      cy.get('[data-cy=mobile-vitals-capture]').should('be.visible')
      cy.get('[data-cy=bluetooth-device-integration]').should('be.visible')
      cy.get('[data-cy=mobile-camera-vitals]').should('be.visible')
      cy.get('[data-cy=voice-recorded-notes]').should('be.visible')
    })

    it('should support mobile emergency features', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-emergency-button]').should('be.visible')
      cy.get('[data-cy=emergency-location-services]').should('be.visible')
      cy.get('[data-cy=emergency-contacts-quick-access]').should('be.visible')
      cy.get('[data-cy=emergency-services-integration]').should('be.visible')
    })

    it('should support mobile telemedicine features', () => {
      cy.viewport('iphone-8')
      cy.visit('/appointments')

      cy.get('[data-cy=mobile-telemedicine]').should('be.visible')
      cy.get('[data-cy=video-call-mobile]').should('be.visible')
      cy.get('[data-cy=screen-sharing-mobile]').should('be.visible')
      cy.get('[data-cy=mobile-chat-during-call]').should('be.visible')
    })
  })

  context('Mobile Data Security', () => {
    it('should secure mobile data transmission', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-security-features]').should('be.visible')
      cy.get('[data-cy=encrypted-mobile-storage]').should('be.visible')
      cy.get('[data-cy=secure-authentication-mobile]').should('be.visible')
      cy.get('[data-cy=remote-wipe-capabilities]').should('be.visible')
    })

    it('should handle mobile session management', () => {
      cy.viewport('iphone-8')

      cy.get('[data-cy=mobile-session-timeout]').should('be.visible')
      cy.get('[data-cy=biometric-authentication]').should('be.visible')
      cy.get('[data-cy=mobile-login-persistence]').should('be.visible')
    })
  })
})

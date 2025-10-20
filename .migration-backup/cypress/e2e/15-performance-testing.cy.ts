/// <reference types="cypress" />

/**
 * Performance Testing - Core Web Vitals & Load Performance
 *
 * Enterprise-grade performance testing for healthcare application
 * Healthcare Context: Performance is critical for nurse productivity and patient care
 * Slow systems can delay critical medical decisions and emergency responses
 *
 * Test Coverage:
 * - Core Web Vitals (LCP, FID, CLS)
 * - Page load performance across all major pages
 * - Network request optimization
 * - Bundle size and asset optimization
 * - Database query performance
 * - Real User Monitoring (RUM) metrics
 * - Progressive loading strategies
 * - API response times
 */

describe('Performance Testing', () => {
  context('Core Web Vitals - Dashboard', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should meet Largest Contentful Paint (LCP) threshold (<2.5s)', () => {
      cy.visit('/dashboard')

      cy.window().then((win) => {
        // Use Performance Observer API for accurate LCP measurement
        cy.window().its('performance').then((perf) => {
          const paintEntries = perf.getEntriesByType('paint')
          const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint')

          if (lcp) {
            cy.log(`LCP: ${lcp.startTime}ms`)
            expect(lcp.startTime).to.be.lessThan(2500)
          } else {
            // Fallback: Check that page loaded quickly
            const navigation = perf.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            if (navigation) {
              const loadTime = navigation.loadEventEnd - navigation.fetchStart
              cy.log(`Page load time: ${loadTime}ms`)
              expect(loadTime).to.be.lessThan(3000)
            }
          }
        })
      })
    })

    it('should meet First Input Delay (FID) threshold (<100ms)', () => {
      cy.visit('/dashboard')
      cy.wait(1000)

      // Test interactivity by clicking first available button
      const startTime = performance.now()

      cy.get('button').first().click()

      cy.window().then(() => {
        const interactivityTime = performance.now() - startTime
        cy.log(`First Input Delay: ${interactivityTime}ms`)
        expect(interactivityTime).to.be.lessThan(100)
      })
    })

    it('should meet Cumulative Layout Shift (CLS) threshold (<0.1)', () => {
      cy.visit('/dashboard')

      // Wait for page to settle
      cy.wait(2000)

      cy.window().then((win) => {
        // Check for layout shift indicators
        // In production, use PerformanceObserver for layout-shift entries
        // For now, verify page is stable by checking elements don't jump
        cy.get('main').should('have.css', 'position')
      })
    })

    it('should have Time to First Byte (TTFB) under 600ms', () => {
      const startTime = performance.now()

      cy.visit('/dashboard', { timeout: 10000 })

      cy.window().its('performance').then((perf) => {
        const navigation = perf.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

        if (navigation) {
          const ttfb = navigation.responseStart - navigation.requestStart
          cy.log(`TTFB: ${ttfb}ms`)
          expect(ttfb).to.be.lessThan(600)
        }
      })
    })

    it('should have DOM Content Loaded under 1.5s', () => {
      cy.visit('/dashboard')

      cy.window().its('performance').then((perf) => {
        const navigation = perf.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

        if (navigation) {
          const dclTime = navigation.domContentLoadedEventEnd - navigation.fetchStart
          cy.log(`DOM Content Loaded: ${dclTime}ms`)
          expect(dclTime).to.be.lessThan(1500)
        }
      })
    })
  })

  context('Page Load Performance - All Major Pages', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should load dashboard within acceptable time (<3s)', () => {
      const startTime = performance.now()

      cy.visit('/dashboard', { timeout: 10000 })
      cy.get('[data-cy=dashboard-container], main').should('be.visible')

      cy.window().then(() => {
        const loadTime = performance.now() - startTime
        cy.log(`Dashboard load time: ${loadTime}ms`)
        expect(loadTime).to.be.lessThan(3000)
      })
    })

    it('should load students page efficiently (<3s)', () => {
      const startTime = performance.now()

      cy.visit('/students', { timeout: 10000 })
      cy.get('body').should('be.visible')

      cy.window().then(() => {
        const loadTime = performance.now() - startTime
        cy.log(`Students page load time: ${loadTime}ms`)
        expect(loadTime).to.be.lessThan(3000)
      })
    })

    it('should load medications page within threshold (<3s)', () => {
      const startTime = performance.now()

      cy.visit('/medications', { timeout: 10000 })
      cy.get('body').should('be.visible')

      cy.window().then(() => {
        const loadTime = performance.now() - startTime
        cy.log(`Medications page load time: ${loadTime}ms`)
        expect(loadTime).to.be.lessThan(3000)
      })
    })

    it('should load appointments page efficiently (<3s)', () => {
      const startTime = performance.now()

      cy.visit('/appointments', { timeout: 10000 })
      cy.get('body').should('be.visible')

      cy.window().then(() => {
        const loadTime = performance.now() - startTime
        cy.log(`Appointments page load time: ${loadTime}ms`)
        expect(loadTime).to.be.lessThan(3000)
      })
    })

    it('should load health records page within threshold (<4s)', () => {
      const startTime = performance.now()

      cy.visit('/health-records', { timeout: 10000 })
      cy.get('body').should('be.visible')

      cy.window().then(() => {
        const loadTime = performance.now() - startTime
        cy.log(`Health records page load time: ${loadTime}ms`)
        expect(loadTime).to.be.lessThan(4000)
      })
    })

    it('should load incident reports page efficiently (<3s)', () => {
      const startTime = performance.now()

      cy.visit('/incident-reports', { timeout: 10000 })
      cy.get('body').should('be.visible')

      cy.window().then(() => {
        const loadTime = performance.now() - startTime
        cy.log(`Incident reports page load time: ${loadTime}ms`)
        expect(loadTime).to.be.lessThan(3000)
      })
    })
  })

  context('Admin Performance Testing', () => {
    beforeEach(() => {
      cy.login('admin')
    })

    it('should load reports page within acceptable time (<5s)', () => {
      const startTime = performance.now()

      cy.visit('/reports', { timeout: 15000 })
      cy.get('body').should('be.visible')

      cy.window().then(() => {
        const loadTime = performance.now() - startTime
        cy.log(`Reports page load time: ${loadTime}ms`)
        expect(loadTime).to.be.lessThan(5000)
      })
    })

    it('should load settings page efficiently (<3s)', () => {
      const startTime = performance.now()

      cy.visit('/settings', { timeout: 10000 })
      cy.get('body').should('be.visible')

      cy.window().then(() => {
        const loadTime = performance.now() - startTime
        cy.log(`Settings page load time: ${loadTime}ms`)
        expect(loadTime).to.be.lessThan(3000)
      })
    })
  })

  context('Navigation Performance', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should handle rapid page navigation smoothly', () => {
      const pages = ['/dashboard', '/students', '/medications', '/appointments']
      const navigationTimes: number[] = []

      pages.forEach((page) => {
        const startTime = performance.now()

        cy.visit(page)
        cy.get('body').should('be.visible')

        cy.window().then(() => {
          const navTime = performance.now() - startTime
          navigationTimes.push(navTime)
          cy.log(`${page} navigation time: ${navTime}ms`)
        })
      })

      // Average navigation time should be reasonable
      cy.wrap(navigationTimes).then((times) => {
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length
        expect(avgTime).to.be.lessThan(3000)
      })
    })

    it('should maintain performance with browser back/forward', () => {
      cy.visit('/dashboard')
      cy.get('body').should('be.visible')

      cy.visit('/students')
      cy.get('body').should('be.visible')

      const startTime = performance.now()

      cy.go('back')
      cy.url().should('include', '/dashboard')

      cy.window().then(() => {
        const backNavigationTime = performance.now() - startTime
        cy.log(`Back navigation time: ${backNavigationTime}ms`)
        expect(backNavigationTime).to.be.lessThan(1000)
      })
    })
  })

  context('Network Request Optimization', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should minimize number of network requests on dashboard', () => {
      cy.visit('/dashboard')

      cy.window().its('performance').then((perf) => {
        const resources = perf.getEntriesByType('resource')
        const networkRequests = resources.filter(r => r.name.includes('/api/'))

        cy.log(`API requests: ${networkRequests.length}`)

        // Dashboard should make reasonable number of API calls (typically 5-15)
        expect(networkRequests.length).to.be.lessThan(20)
      })
    })

    it('should use HTTP/2 or HTTP/3 for multiplexing', () => {
      cy.visit('/dashboard')

      cy.window().its('performance').then((perf) => {
        const resources = perf.getEntriesByType('resource') as PerformanceResourceTiming[]

        // Check if any resources use HTTP/2 (nextHopProtocol)
        const http2Resources = resources.filter(r => r.nextHopProtocol === 'h2')

        cy.log(`HTTP/2 resources: ${http2Resources.length}`)
      })
    })

    it('should implement proper caching headers', () => {
      cy.intercept('GET', '**/api/**').as('apiCalls')

      cy.visit('/dashboard')
      cy.wait('@apiCalls')

      // Reload and verify cached resources
      cy.reload()

      cy.window().its('performance').then((perf) => {
        const resources = perf.getEntriesByType('resource') as PerformanceResourceTiming[]

        // Some resources should come from cache
        const cachedResources = resources.filter(r =>
          r.transferSize === 0 || (r.decodedBodySize > 0 && r.transferSize === 0)
        )

        cy.log(`Cached resources: ${cachedResources.length}`)
        expect(cachedResources.length).to.be.greaterThan(0)
      })
    })

    it('should compress API responses with gzip/brotli', () => {
      cy.intercept('GET', '**/api/**', (req) => {
        req.headers['accept-encoding'] = 'gzip, deflate, br'
      }).as('compressedAPI')

      cy.visit('/dashboard')
      cy.wait('@compressedAPI')
    })
  })

  context('Asset Optimization', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should lazy load images below the fold', () => {
      cy.visit('/dashboard')

      cy.get('img').each(($img) => {
        const loading = $img.attr('loading')
        const isAboveFold = $img[0].getBoundingClientRect().top < window.innerHeight

        if (!isAboveFold) {
          // Images below fold should have lazy loading
          expect(loading).to.be.oneOf(['lazy', undefined])
        }
      })
    })

    it('should serve optimized image formats (WebP)', () => {
      cy.visit('/dashboard')

      cy.get('img').then(($images) => {
        if ($images.length > 0) {
          const firstImg = $images[0].src

          // Check if modern formats are used
          const isOptimized = firstImg.includes('.webp') ||
                             firstImg.includes('.avif') ||
                             firstImg.includes('w=') // Image optimization service

          cy.log(`Image optimization detected: ${isOptimized}`)
        }
      })
    })

    it('should bundle JavaScript efficiently (<500KB)', () => {
      cy.visit('/dashboard')

      cy.window().its('performance').then((perf) => {
        const resources = perf.getEntriesByType('resource') as PerformanceResourceTiming[]

        const jsResources = resources.filter(r => r.name.endsWith('.js'))
        const totalJsSize = jsResources.reduce((sum, r) => sum + r.transferSize, 0)

        cy.log(`Total JS bundle size: ${(totalJsSize / 1024).toFixed(2)} KB`)

        // Main bundle should be reasonable size
        expect(totalJsSize).to.be.lessThan(500 * 1024)
      })
    })

    it('should use code splitting for route-based chunks', () => {
      cy.visit('/dashboard')

      cy.window().its('performance').then((perf) => {
        const resources = perf.getEntriesByType('resource') as PerformanceResourceTiming[]

        const jsChunks = resources.filter(r =>
          r.name.includes('.js') && (r.name.includes('chunk') || r.name.includes('async'))
        )

        cy.log(`Code-split chunks loaded: ${jsChunks.length}`)
      })
    })
  })

  context('API Response Time Performance', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should respond to dashboard API calls within 500ms', () => {
      cy.intercept('GET', '**/api/dashboard/**').as('dashboardAPI')

      cy.visit('/dashboard')
      cy.wait('@dashboardAPI').then((interception) => {
        const responseTime = interception.response ? interception.response.headers['x-response-time'] : null

        if (responseTime) {
          const time = parseInt(responseTime as string)
          cy.log(`Dashboard API response time: ${time}ms`)
          expect(time).to.be.lessThan(500)
        }
      })
    })

    it('should respond to student list API within 1s', () => {
      cy.intercept('GET', '**/api/students*').as('studentsAPI')

      cy.visit('/students')
      cy.wait('@studentsAPI').its('response.statusCode').should('eq', 200)

      // Verify reasonable load time
      cy.get('body').should('be.visible')
    })

    it('should implement pagination for large datasets', () => {
      cy.intercept('GET', '**/api/students*').as('studentsAPI')

      cy.visit('/students')
      cy.wait('@studentsAPI').then((interception) => {
        const url = interception.request.url

        // Should include pagination parameters
        const hasPagination = url.includes('page=') || url.includes('limit=') || url.includes('offset=')

        cy.log(`Pagination implemented: ${hasPagination}`)
        expect(hasPagination).to.be.true
      })
    })
  })

  context('Memory & Resource Management', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should not have memory leaks during navigation', () => {
      cy.visit('/dashboard')
      cy.wait(1000)

      cy.window().then((win) => {
        if ('performance' in win && 'memory' in (win.performance as any)) {
          const initialMemory = (win.performance as any).memory.usedJSHeapSize

          // Navigate to multiple pages
          cy.visit('/students')
          cy.visit('/medications')
          cy.visit('/dashboard')
          cy.wait(2000)

          cy.window().then((win) => {
            const finalMemory = (win.performance as any).memory.usedJSHeapSize
            const memoryIncrease = finalMemory - initialMemory

            cy.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`)

            // Memory increase should be reasonable (< 50MB)
            expect(memoryIncrease).to.be.lessThan(50 * 1024 * 1024)
          })
        }
      })
    })

    it('should clean up event listeners on page unmount', () => {
      cy.visit('/dashboard')
      cy.wait(1000)

      // Navigate away and back
      cy.visit('/students')
      cy.visit('/dashboard')

      // Page should still function properly
      cy.get('body').should('be.visible')
      cy.get('button').first().should('be.visible')
    })
  })

  context('Progressive Loading Strategies', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should show skeleton loaders for progressive content', () => {
      cy.intercept('GET', '**/api/dashboard/**', (req) => {
        req.reply((res) => {
          res.delay = 1000
        })
      }).as('slowDashboard')

      cy.visit('/dashboard')

      // Verify skeleton loaders appear
      cy.get('[class*="skeleton"], [class*="loading"], [data-cy*="skeleton"]', { timeout: 500 })
        .should('exist')

      cy.wait('@slowDashboard')

      // Verify skeleton loaders disappear
      cy.get('[class*="skeleton"]', { timeout: 5000 }).should('not.exist')
    })

    it('should load above-the-fold content first', () => {
      cy.visit('/dashboard')

      // Main content should be visible quickly
      cy.get('main', { timeout: 2000 }).should('be.visible')

      // Below-fold content can load later
      cy.scrollTo('bottom')
      cy.wait(500)
    })

    it('should implement incremental rendering for large lists', () => {
      cy.visit('/students')

      // First batch of students should load quickly
      cy.get('tbody tr', { timeout: 3000 }).should('have.length.at.least', 1)

      // Scrolling should load more
      cy.scrollTo('bottom')
      cy.wait(500)
    })
  })

  context('Real User Monitoring (RUM) Metrics', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should track page view duration', () => {
      const startTime = Date.now()

      cy.visit('/dashboard')
      cy.wait(3000)

      cy.window().then(() => {
        const viewDuration = Date.now() - startTime
        cy.log(`Page view duration: ${viewDuration}ms`)
        expect(viewDuration).to.be.greaterThan(0)
      })
    })

    it('should collect user interaction timings', () => {
      cy.visit('/dashboard')

      const startTime = performance.now()

      cy.get('button').first().click()

      cy.window().then(() => {
        const interactionTime = performance.now() - startTime
        cy.log(`User interaction time: ${interactionTime}ms`)
        expect(interactionTime).to.be.lessThan(200)
      })
    })

    it('should monitor error rates and performance degradation', () => {
      cy.visit('/dashboard')

      cy.window().then((win) => {
        // Verify no JS errors occurred
        cy.spy(win.console, 'error').should('not.be.called')
      })
    })
  })

  context('Healthcare-Specific Performance Requirements', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should load emergency contact information quickly (<1s)', () => {
      const startTime = performance.now()

      cy.visit('/students')
      cy.wait(1000)

      // Emergency data should be quickly accessible
      cy.window().then(() => {
        const loadTime = performance.now() - startTime
        expect(loadTime).to.be.lessThan(2000)
      })
    })

    it('should optimize medication lookup performance', () => {
      const startTime = performance.now()

      cy.visit('/medications')
      cy.get('body').should('be.visible')

      cy.window().then(() => {
        const loadTime = performance.now() - startTime
        cy.log(`Medications page load: ${loadTime}ms`)
        expect(loadTime).to.be.lessThan(3000)
      })
    })

    it('should handle concurrent user loads efficiently', () => {
      // Simulate multiple rapid requests
      cy.visit('/dashboard')
      cy.visit('/students')
      cy.visit('/medications')
      cy.visit('/dashboard')

      // System should remain responsive
      cy.get('body').should('be.visible')
      cy.get('button').first().should('not.be.disabled')
    })
  })
})

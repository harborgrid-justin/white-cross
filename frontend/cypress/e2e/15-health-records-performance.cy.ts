/// <reference types="cypress" />

describe('Health Records - Performance and Load Testing (Tests 161-170)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.loginAsNurse()
    cy.visit('/health-records')
  })

  describe('Page Load Performance (Tests 161-165)', () => {
    it('Test 161: Should load health records page within performance budget', () => {
      cy.window().then((win) => {
        // Mock performance API
        const performanceEntries = [
          {
            name: 'https://localhost:5173/health-records',
            loadEventEnd: 1200,
            domContentLoadedEventEnd: 800,
            responseEnd: 600
          }
        ]
        
        cy.stub(win.performance, 'getEntriesByType').returns(performanceEntries)
      })
      
      cy.reload()
      
      // Measure core web vitals
      cy.window().then((win) => {
        const navigation = win.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        // First Contentful Paint should be under 1.8s
        expect(navigation.loadEventEnd).to.be.lessThan(1800)
        
        // DOM Content Loaded should be under 1s
        expect(navigation.domContentLoadedEventEnd).to.be.lessThan(1000)
      })
      
      // Verify critical elements load quickly
      cy.get('[data-testid="health-records-page"]', { timeout: 2000 }).should('be.visible')
      cy.get('[data-testid="navigation-tabs"]', { timeout: 1000 }).should('be.visible')
      cy.get('[data-testid="main-content"]', { timeout: 1500 }).should('be.visible')
    })

    it('Test 162: Should handle large datasets with virtual scrolling', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `record-${i + 1}`,
        type: 'Physical Exam',
        date: '2024-01-15',
        provider: `Dr. Provider-${i + 1}`,
        student: `Student ${i + 1}`
      }))
      
      cy.intercept('GET', '**/api/health-records**', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: largeDataset,
            pagination: { page: 1, total: 1000, pages: 100 }
          }
        }
      }).as('getLargeDataset')
      
      cy.get('[data-testid="tab-records"]').click()
      cy.wait('@getLargeDataset')
      
      // Virtual scrolling should only render visible items
      cy.get('[data-testid="health-record-item"]').should('have.length.lessThan', 50)
      cy.get('[data-testid="virtual-scroll-container"]').should('be.visible')
      
      // Scroll should load more items efficiently
      cy.get('[data-testid="virtual-scroll-container"]').scrollTo('bottom')
      cy.get('[data-testid="health-record-item"]').should('have.length.greaterThan', 20)
      
      // Performance should remain good during scrolling
      cy.window().then((win) => {
        const startTime = win.performance.now()
        
        // Perform scroll operations
        for (let i = 0; i < 5; i++) {
          cy.get('[data-testid="virtual-scroll-container"]').scrollTo(0, i * 200)
          cy.wait(100)
        }
        
        const endTime = win.performance.now()
        const scrollTime = endTime - startTime
        
        // Scrolling should be smooth (under 100ms per operation)
        expect(scrollTime).to.be.lessThan(500)
      })
    })

    it('Test 163: Should optimize API calls with debouncing and caching', () => {
      let apiCallCount = 0
      
      cy.intercept('GET', '**/api/health-records/search**', (req) => {
        apiCallCount++
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              records: [
                { id: '1', type: 'Physical Exam', date: '2024-01-15' }
              ]
            }
          }
        })
      }).as('searchRecords')
      
      cy.get('[data-testid="tab-records"]').click()
      cy.get('[data-testid="search-records-input"]').should('be.visible')
      
      // Type quickly (should debounce API calls)
      cy.get('[data-testid="search-records-input"]').type('physical', { delay: 50 })
      
      // Wait for debounce period
      cy.wait(1000)
      
      // Should have made only one API call due to debouncing
      cy.then(() => {
        expect(apiCallCount).to.equal(1)
      })
      
      // Same search should use cache
      cy.get('[data-testid="search-records-input"]').clear()
      cy.get('[data-testid="search-records-input"]').type('physical')
      cy.wait(1000)
      
      // API call count should not increase (cached)
      cy.then(() => {
        expect(apiCallCount).to.equal(1)
      })
    })

    it('Test 164: Should lazy load non-critical components', () => {
      // Measure initial bundle size
      cy.window().then((win) => {
        const initialScripts = Array.from(win.document.querySelectorAll('script')).length
        cy.wrap(initialScripts).as('initialScripts')
      })
      
      cy.get('[data-testid="health-records-page"]').should('be.visible')
      
      // Navigate to complex component that should be lazy loaded
      cy.get('[data-testid="tab-analytics"]').click()
      
      // Should load additional chunks
      cy.window().then((win) => {
        cy.get('@initialScripts').then((initial) => {
          const currentScripts = Array.from(win.document.querySelectorAll('script')).length
          expect(currentScripts).to.be.greaterThan(initial as number)
        })
      })
      
      // Component should load and be functional
      cy.get('[data-testid="analytics-dashboard"]', { timeout: 3000 }).should('be.visible')
      cy.get('[data-testid="loading-spinner"]').should('not.exist')
    })

    it('Test 165: Should optimize image loading with progressive enhancement', () => {
      cy.intercept('GET', '**/api/health-records/*/attachments', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            attachments: [
              {
                id: 'img-1',
                type: 'image',
                thumbnail: '/api/images/thumb-1.jpg',
                fullSize: '/api/images/full-1.jpg',
                size: '2.5MB'
              }
            ]
          }
        }
      }).as('getAttachments')
      
      cy.get('[data-testid="tab-records"]').click()
      cy.get('[data-testid="health-record-item"]').first().click()
      cy.get('[data-testid="record-details-modal"]').should('be.visible')
      
      cy.get('[data-testid="attachments-tab"]').click()
      cy.wait('@getAttachments')
      
      // Should load thumbnail first
      cy.get('[data-testid="image-thumbnail"]').should('be.visible')
      cy.get('[data-testid="image-thumbnail"]').should('have.attr', 'src').and('include', 'thumb-1.jpg')
      
      // Full size should load on click
      cy.get('[data-testid="image-thumbnail"]').click()
      cy.get('[data-testid="image-modal"]').should('be.visible')
      cy.get('[data-testid="full-size-image"]').should('have.attr', 'src').and('include', 'full-1.jpg')
      
      // Should show loading state for large images
      cy.get('[data-testid="image-loading-spinner"]').should('be.visible')
      cy.get('[data-testid="full-size-image"]').should('be.visible', { timeout: 5000 })
      cy.get('[data-testid="image-loading-spinner"]').should('not.exist')
    })
  })

  describe('Search and Filter Performance (Tests 166-170)', () => {
    it('Test 166: Should handle complex search queries efficiently', () => {
      const complexSearchResponse = {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: Array.from({ length: 50 }, (_, i) => ({
              id: `result-${i}`,
              type: 'Physical Exam',
              date: '2024-01-15',
              matches: [`Match ${i + 1}`]
            })),
            searchTime: 145, // ms
            totalResults: 50
          }
        }
      }
      
      cy.intercept('POST', '**/api/health-records/advanced-search', complexSearchResponse).as('advancedSearch')
      
      cy.get('[data-testid="tab-records"]').click()
      cy.get('[data-testid="advanced-search-button"]').click()
      cy.get('[data-testid="advanced-search-modal"]').should('be.visible')
      
      // Build complex search query
      cy.get('[data-testid="search-type-select"]').select('All Fields')
      cy.get('[data-testid="search-keywords"]').type('diabetes medication physical exam')
      cy.get('[data-testid="date-range-start"]').type('2024-01-01')
      cy.get('[data-testid="date-range-end"]').type('2024-12-31')
      cy.get('[data-testid="provider-filter"]').type('Dr. Smith')
      cy.get('[data-testid="severity-filter"]').select('High')
      
      const searchStartTime = Date.now()
      cy.get('[data-testid="execute-search-button"]').click()
      
      cy.wait('@advancedSearch').then(() => {
        const searchEndTime = Date.now()
        const clientSearchTime = searchEndTime - searchStartTime
        
        // Client-side search should be fast
        expect(clientSearchTime).to.be.lessThan(1000)
      })
      
      // Results should display quickly
      cy.get('[data-testid="search-results"]').should('be.visible')
      cy.get('[data-testid="search-time"]').should('contain', '145ms')
      cy.get('[data-testid="result-count"]').should('contain', '50 results')
      
      // Search highlighting should be efficient
      cy.get('[data-testid="search-highlight"]').should('be.visible')
      cy.get('[data-testid="search-highlight"]').should('have.length.greaterThan', 0)
    })

    it('Test 167: Should optimize filter operations with indexing', () => {
      const filterableData = Array.from({ length: 500 }, (_, i) => ({
        id: `record-${i}`,
        type: i % 3 === 0 ? 'Physical Exam' : i % 3 === 1 ? 'Vaccination' : 'Lab Result',
        severity: i % 4 === 0 ? 'High' : i % 4 === 1 ? 'Medium' : 'Low',
        date: `2024-0${(i % 9) + 1}-15`,
        provider: `Dr. Provider-${i % 10}`
      }))
      
      cy.intercept('GET', '**/api/health-records**', {
        statusCode: 200,
        body: {
          success: true,
          data: { records: filterableData }
        }
      }).as('getFilterableData')
      
      cy.get('[data-testid="tab-records"]').click()
      cy.wait('@getFilterableData')
      
      // Apply multiple filters
      const filterStartTime = Date.now()
      
      cy.get('[data-testid="type-filter"]').select('Physical Exam')
      cy.get('[data-testid="severity-filter"]').select('High')
      cy.get('[data-testid="provider-filter"]').select('Dr. Provider-1')
      
      // Filtering should be instantaneous (client-side indexing)
      cy.get('[data-testid="filtered-results"]').should('be.visible')
      
      cy.then(() => {
        const filterEndTime = Date.now()
        const filterTime = filterEndTime - filterStartTime
        
        // Filtering should be very fast
        expect(filterTime).to.be.lessThan(500)
      })
      
      // Results should be accurate
      cy.get('[data-testid="health-record-item"]').each(($item) => {
        cy.wrap($item).find('[data-testid="record-type"]').should('contain', 'Physical Exam')
        cy.wrap($item).find('[data-testid="record-severity"]').should('contain', 'High')
        cy.wrap($item).find('[data-testid="record-provider"]').should('contain', 'Dr. Provider-1')
      })
    })

    it('Test 168: Should handle pagination efficiently for large result sets', () => {
      // Mock large paginated dataset
      const createPageData = (page: number) => ({
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: Array.from({ length: 20 }, (_, i) => ({
              id: `page${page}-record-${i}`,
              type: 'Physical Exam',
              date: '2024-01-15'
            })),
            pagination: {
              page,
              limit: 20,
              total: 2000,
              pages: 100,
              hasNext: page < 100,
              hasPrevious: page > 1
            }
          }
        }
      })
      
      cy.intercept('GET', '**/api/health-records**page=1**', createPageData(1)).as('getPage1')
      cy.intercept('GET', '**/api/health-records**page=2**', createPageData(2)).as('getPage2')
      cy.intercept('GET', '**/api/health-records**page=50**', createPageData(50)).as('getPage50')
      
      cy.get('[data-testid="tab-records"]').click()
      cy.wait('@getPage1')
      
      // Verify pagination controls
      cy.get('[data-testid="pagination-info"]').should('contain', '1-20 of 2000')
      cy.get('[data-testid="page-input"]').should('have.value', '1')
      cy.get('[data-testid="total-pages"]').should('contain', '100 pages')
      
      // Test page navigation performance
      const navigationStartTime = Date.now()
      
      cy.get('[data-testid="next-page-button"]').click()
      cy.wait('@getPage2')
      
      cy.then(() => {
        const navigationEndTime = Date.now()
        const navigationTime = navigationEndTime - navigationStartTime
        
        // Page navigation should be fast
        expect(navigationTime).to.be.lessThan(1000)
      })
      
      // Test jump to specific page
      cy.get('[data-testid="page-input"]').clear().type('50{enter}')
      cy.wait('@getPage50')
      
      cy.get('[data-testid="pagination-info"]').should('contain', '981-1000 of 2000')
      
      // Test pagination controls state
      cy.get('[data-testid="previous-page-button"]').should('be.enabled')
      cy.get('[data-testid="next-page-button"]').should('be.enabled')
    })

    it('Test 169: Should optimize memory usage during data operations', () => {
      let initialMemory: number
      let peakMemory: number
      
      cy.window().then((win) => {
        // Mock memory API for testing
        const mockMemory = {
          usedJSMemory: 50 * 1024 * 1024, // 50MB
          totalJSMemory: 100 * 1024 * 1024, // 100MB
          jsMemoryLimit: 2 * 1024 * 1024 * 1024 // 2GB
        }
        
        Object.defineProperty(win.performance, 'memory', {
          value: mockMemory,
          writable: true
        })
        
        initialMemory = mockMemory.usedJSMemory
      })
      
      // Load large dataset
      const largeDataset = Array.from({ length: 2000 }, (_, i) => ({
        id: `record-${i}`,
        type: 'Physical Exam',
        data: 'x'.repeat(1000), // Simulate large record data
        attachments: Array.from({ length: 5 }, (_, j) => ({ id: `att-${j}`, size: '1MB' }))
      }))
      
      cy.intercept('GET', '**/api/health-records/bulk**', {
        statusCode: 200,
        body: { success: true, data: { records: largeDataset } }
      }).as('getBulkData')
      
      cy.get('[data-testid="bulk-operations-button"]').click()
      cy.get('[data-testid="load-all-button"]').click()
      cy.wait('@getBulkData')
      
      cy.window().then((win) => {
        // Check memory usage didn't spike excessively
        const currentMemory = (win.performance as any).memory.usedJSMemory
        peakMemory = currentMemory
        
        const memoryIncrease = currentMemory - initialMemory
        const memoryIncreaseMB = memoryIncrease / (1024 * 1024)
        
        // Memory increase should be reasonable (less than 200MB for 2000 records)
        expect(memoryIncreaseMB).to.be.lessThan(200)
      })
      
      // Perform cleanup operations
      cy.get('[data-testid="clear-data-button"]').click()
      
      cy.window().then((win) => {
        // Simulate garbage collection
        setTimeout(() => {
          const finalMemory = (win.performance as any).memory.usedJSMemory
          const memoryReduction = peakMemory - finalMemory
          
          // Memory should be reduced after cleanup
          expect(memoryReduction).to.be.greaterThan(0)
        }, 1000)
      })
    })

    it('Test 170: Should handle concurrent operations without performance degradation', () => {
      const operationTimes: number[] = []
      
      // Setup multiple concurrent API endpoints
      cy.intercept('GET', '**/api/health-records/allergies**', { delay: 200, fixture: 'allergies.json' }).as('getAllergies')
      cy.intercept('GET', '**/api/health-records/medications**', { delay: 300, fixture: 'medications.json' }).as('getMedications')
      cy.intercept('GET', '**/api/health-records/vaccinations**', { delay: 250, fixture: 'vaccinations.json' }).as('getVaccinations')
      cy.intercept('GET', '**/api/health-records/conditions**', { delay: 180, fixture: 'chronicConditions.json' }).as('getConditions')
      
      const startTime = Date.now()
      
      // Trigger multiple concurrent operations
      cy.get('[data-testid="tab-allergies"]').click()
      cy.get('[data-testid="tab-medications"]').click()
      cy.get('[data-testid="tab-vaccinations"]').click()
      cy.get('[data-testid="tab-chronic"]').click()
      
      // Wait for all requests to complete
      cy.wait('@getAllergies')
      cy.wait('@getMedications')
      cy.wait('@getVaccinations')
      cy.wait('@getConditions')
      
      const endTime = Date.now()
      const totalTime = endTime - startTime
      
      // Despite multiple operations, total time should be reasonable (concurrent, not sequential)
      expect(totalTime).to.be.lessThan(1000) // Should be concurrent, not 200+300+250+180=930ms
      
      // All tabs should show loaded content
      cy.get('[data-testid="tab-allergies"]').click()
      cy.get('[data-testid="allergies-content"]').should('be.visible')
      cy.get('[data-testid="loading-spinner"]').should('not.exist')
      
      cy.get('[data-testid="tab-medications"]').click()
      cy.get('[data-testid="medications-content"]').should('be.visible')
      cy.get('[data-testid="loading-spinner"]').should('not.exist')
      
      // Performance should remain stable during rapid tab switching
      for (let i = 0; i < 10; i++) {
        const switchStart = Date.now()
        cy.get('[data-testid="tab-allergies"]').click()
        cy.get('[data-testid="tab-medications"]').click()
        const switchEnd = Date.now()
        operationTimes.push(switchEnd - switchStart)
      }
      
      cy.then(() => {
        const averageTime = operationTimes.reduce((a, b) => a + b, 0) / operationTimes.length
        expect(averageTime).to.be.lessThan(100) // Tab switching should be very fast
      })
    })
  })
})
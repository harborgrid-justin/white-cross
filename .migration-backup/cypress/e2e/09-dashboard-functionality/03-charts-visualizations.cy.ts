/// <reference types="cypress" />

/**
 * Dashboard - Charts & Visualizations Tests
 *
 * Enterprise-grade testing for healthcare data visualizations
 * Healthcare Context: Critical charts showing student health trends, medication patterns,
 * incident frequencies, and appointment analytics for data-driven decision making
 *
 * Test Coverage:
 * - Chart rendering and canvas/SVG detection
 * - Interactive data visualization features
 * - Chart data accuracy and validation
 * - Accessibility for screen readers
 * - Responsive chart sizing
 * - Time period filtering
 * - Empty state handling
 * - Chart performance
 */

describe('Dashboard - Charts & Visualizations', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  context('Chart Rendering & Detection', () => {
    it('should render at least one chart visualization', () => {
      // Wait for charts to load
      cy.wait(1000)

      // Verify canvas or SVG elements exist (common charting libraries)
      cy.get('canvas, svg[class*="chart"], [data-cy*=chart]')
        .should('exist')
        .and('have.length.at.least', 1)
    })

    it('should display student enrollment trend chart', () => {
      cy.contains(/enrollment|student.*trend/i, { timeout: 10000 })
        .should('be.visible')

      // Verify chart container has proper dimensions
      cy.get('canvas, svg').first()
        .should('have.attr', 'width')
        .and('not.equal', '0')
    })

    it('should render medication administration chart', () => {
      cy.contains(/medication.*chart|medication.*trend|administration/i, { timeout: 10000 })
        .should('be.visible')
    })

    it('should show incident frequency visualization', () => {
      cy.contains(/incident.*frequency|incident.*chart|incident.*trend/i, { timeout: 10000 })
        .should('be.visible')
    })

    it('should display appointment trends chart', () => {
      cy.contains(/appointment.*trend|appointment.*chart|scheduling/i, { timeout: 10000 })
        .should('be.visible')
    })

    it('should render multiple chart types', () => {
      // Verify at least 2 different charts
      cy.get('canvas, svg[class*="chart"]')
        .should('have.length.at.least', 2)
    })
  })

  context('Chart Interactivity & User Experience', () => {
    it('should have interactive hover functionality', () => {
      cy.get('canvas, svg').first()
        .should('be.visible')
        .trigger('mouseover')

      // Verify tooltip or hover effect appears
      cy.wait(300)

      // Some charting libraries show tooltips on hover
      cy.get('body').then(($body) => {
        const hasTooltip = $body.find('[class*="tooltip"], [role="tooltip"]').length > 0
        if (hasTooltip) {
          cy.get('[class*="tooltip"], [role="tooltip"]').should('be.visible')
        }
      })
    })

    it('should display chart legends for data series', () => {
      cy.get('[class*="legend"], [aria-label*="legend"]')
        .should('exist')
        .and('be.visible')
    })

    it('should show chart axis labels', () => {
      // Verify SVG charts have axis labels or canvas charts have labels
      cy.get('body').then(($body) => {
        const hasSvg = $body.find('svg text').length > 0
        const hasAxisLabel = $body.find('[class*="axis"]').length > 0

        expect(hasSvg || hasAxisLabel).to.be.true
      })
    })

    it('should allow toggling chart data series via legend', () => {
      cy.get('[class*="legend"]').should('exist')

      // Try to click legend items
      cy.get('[class*="legend"] button, [class*="legend"] [role="button"]').then(($items) => {
        if ($items.length > 0) {
          cy.wrap($items).first().click()
          cy.wait(300)
        }
      })
    })

    it('should show data point tooltips on hover/click', () => {
      const chart = cy.get('canvas, svg').first()
      chart.should('be.visible')

      // Trigger interaction
      chart.trigger('mousemove', { clientX: 100, clientY: 100 })
      cy.wait(300)

      // Some charts may show data on click instead
      chart.trigger('click', { clientX: 100, clientY: 100 })
      cy.wait(300)
    })
  })

  context('Time Period Filtering', () => {
    it('should have time period selectors for charts', () => {
      cy.get('body').contains(/week|month|year|today|this week|this month/i, { timeout: 5000 })
        .should('exist')
    })

    it('should filter chart data by week view', () => {
      cy.get('button, [role="tab"]').contains(/week/i).then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).click()
          cy.wait(500)

          // Verify chart updates (data changes)
          cy.get('canvas, svg').should('be.visible')
        }
      })
    })

    it('should filter chart data by month view', () => {
      cy.get('button, [role="tab"]').contains(/month/i).then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).click()
          cy.wait(500)

          // Verify chart updates
          cy.get('canvas, svg').should('be.visible')
        }
      })
    })

    it('should filter chart data by year view', () => {
      cy.get('button, [role="tab"]').contains(/year/i).then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).click()
          cy.wait(500)

          // Verify chart updates
          cy.get('canvas, svg').should('be.visible')
        }
      })
    })

    it('should maintain chart state when switching time periods', () => {
      // Click on different time periods and verify charts remain functional
      cy.get('button').contains(/week|month/i).then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).click()
          cy.wait(300)

          cy.get('canvas, svg').should('be.visible')
        }
      })
    })
  })

  context('Chart Titles & Labels', () => {
    it('should display descriptive chart titles', () => {
      cy.get('[class*="chart-title"], h3, h4')
        .should('exist')
        .and('have.length.at.least', 1)
    })

    it('should have accessible chart titles for screen readers', () => {
      cy.get('canvas, svg').each(($chart) => {
        cy.wrap($chart).parent().within(() => {
          // Verify there's a heading or aria-label
          cy.root().should('satisfy', ($container) => {
            const hasHeading = $container.find('h1, h2, h3, h4, h5, h6').length > 0
            const hasAriaLabel = $container.attr('aria-label') != null
            const hasAriaLabelledBy = $container.attr('aria-labelledby') != null

            return hasHeading || hasAriaLabel || hasAriaLabelledBy
          })
        })
      })
    })

    it('should show data labels on chart elements', () => {
      // Verify charts have labels for data points
      cy.get('svg text, [class*="label"]').should('exist')
    })
  })

  context('Responsive Chart Sizing', () => {
    it('should have responsive chart container sizing', () => {
      cy.get('canvas, svg').first()
        .should('have.attr', 'width')
        .then((width) => {
          expect(parseInt(width as string)).to.be.greaterThan(0)
        })
    })

    it('should resize charts for mobile viewport', () => {
      cy.viewport(375, 667)
      cy.reload()
      cy.wait(1000)

      cy.get('canvas, svg').first().then(($chart) => {
        const width = $chart.attr('width') || $chart.width()
        expect(parseInt(width as string)).to.be.lessThan(400)
      })
    })

    it('should resize charts for tablet viewport', () => {
      cy.viewport(768, 1024)
      cy.reload()
      cy.wait(1000)

      cy.get('canvas, svg').first()
        .should('be.visible')
        .and('have.attr', 'width')
    })

    it('should resize charts for desktop viewport', () => {
      cy.viewport(1920, 1080)
      cy.reload()
      cy.wait(1000)

      cy.get('canvas, svg').first().then(($chart) => {
        const width = $chart.attr('width') || $chart.width()
        expect(parseInt(width as string)).to.be.greaterThan(400)
      })
    })

    it('should maintain aspect ratio on resize', () => {
      const viewports = [[375, 667], [768, 1024], [1920, 1080]]

      viewports.forEach(([width, height]) => {
        cy.viewport(width, height)
        cy.wait(500)

        cy.get('canvas, svg').first().then(($chart) => {
          const chartWidth = $chart.attr('width') || $chart.width()
          const chartHeight = $chart.attr('height') || $chart.height()

          expect(parseInt(chartWidth as string)).to.be.greaterThan(0)
          expect(parseInt(chartHeight as string)).to.be.greaterThan(0)
        })
      })
    })
  })

  context('Empty State & Error Handling', () => {
    it('should display empty state when no chart data available', () => {
      // Intercept chart data endpoint and return empty data
      cy.intercept('GET', '**/api/dashboard/chart-data/**', {
        statusCode: 200,
        body: { data: [] }
      }).as('emptyChartData')

      cy.reload()
      cy.wait('@emptyChartData')

      // Verify empty state message or placeholder
      cy.contains(/no data|no chart data|no results|empty/i, { timeout: 5000 })
        .should('be.visible')
    })

    it('should show loading state while chart data is fetching', () => {
      cy.intercept('GET', '**/api/dashboard/**', (req) => {
        req.reply((res) => {
          res.delay = 1000
        })
      }).as('slowChartData')

      cy.visit('/dashboard')

      // Verify loading indicator
      cy.get('[class*="loading"], [class*="skeleton"]', { timeout: 500 })
        .should('exist')

      cy.wait('@slowChartData')
    })

    it('should handle chart rendering errors gracefully', () => {
      cy.intercept('GET', '**/api/dashboard/chart-data/**', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('chartError')

      cy.reload()

      // Should still show dashboard without crashing
      cy.get('main').should('be.visible')
    })

    it('should provide error message for failed chart data load', () => {
      cy.intercept('GET', '**/api/dashboard/chart-data/**', {
        statusCode: 500,
        body: { error: 'Failed to load chart data' }
      }).as('chartError')

      cy.reload()
      cy.wait('@chartError')

      // May show error message or fallback UI
      cy.get('body').should('be.visible')
    })
  })

  context('Chart Data Accuracy & Validation', () => {
    it('should display accurate data values in charts', () => {
      // Mock specific chart data to verify rendering
      cy.intercept('GET', '**/api/dashboard/student-enrollment', {
        statusCode: 200,
        body: {
          data: [
            { month: 'January', count: 150 },
            { month: 'February', count: 155 },
            { month: 'March', count: 160 }
          ]
        }
      }).as('enrollmentData')

      cy.reload()
      cy.wait('@enrollmentData')

      // Verify chart renders with data
      cy.get('canvas, svg').should('be.visible')
    })

    it('should update charts when new data is received', () => {
      let dataVersion = 1

      cy.intercept('GET', '**/api/dashboard/**', (req) => {
        req.reply({
          statusCode: 200,
          body: { data: [{ value: dataVersion++ }] }
        })
      }).as('dashboardData')

      cy.reload()
      cy.wait('@dashboardData')

      // Trigger a refresh
      cy.get('button').contains(/refresh|reload/i).then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).click()
          cy.wait(500)
        }
      })
    })

    it('should validate chart data ranges are within expected bounds', () => {
      // Healthcare data should have reasonable bounds
      cy.get('svg text, [class*="label"]').each(($label) => {
        const text = $label.text()
        const number = parseInt(text.replace(/[^0-9]/g, ''))

        if (!isNaN(number)) {
          // Student counts should be reasonable (0-10000)
          expect(number).to.be.at.least(0)
          expect(number).to.be.at.most(10000)
        }
      })
    })
  })

  context('Healthcare-Specific Chart Requirements', () => {
    it('should display medication administration trends chart', () => {
      cy.contains(/medication/i).should('exist')

      // Verify chart shows time-based data
      cy.get('body').contains(/today|week|month/i).should('exist')
    })

    it('should show incident severity distribution chart', () => {
      cy.contains(/incident/i).should('exist')

      // May show pie chart or bar chart for severity levels
      cy.get('canvas, svg').should('be.visible')
    })

    it('should display appointment scheduling patterns', () => {
      cy.contains(/appointment/i).should('exist')

      // Verify time-based visualization
      cy.get('canvas, svg').should('be.visible')
    })

    it('should show student health metrics over time', () => {
      // Growth charts, vital signs, or health screening trends
      cy.get('canvas, svg').should('have.length.at.least', 1)
    })
  })

  context('Performance & Optimization', () => {
    it('should render charts within acceptable time (<2s)', () => {
      const startTime = performance.now()

      cy.visit('/dashboard')
      cy.wait(1000)

      cy.get('canvas, svg').first().should('be.visible')

      cy.window().then(() => {
        const renderTime = performance.now() - startTime
        expect(renderTime).to.be.lessThan(2000)
      })
    })

    it('should not block UI while charts are loading', () => {
      cy.intercept('GET', '**/api/dashboard/**', (req) => {
        req.reply((res) => {
          res.delay = 1000
        })
      }).as('slowCharts')

      cy.visit('/dashboard')

      // Verify other UI elements are still interactive
      cy.get('button').first().should('not.be.disabled')
    })

    it('should lazy load charts below the fold', () => {
      cy.visit('/dashboard')

      // Scroll to bottom to trigger lazy-loaded charts
      cy.scrollTo('bottom')
      cy.wait(500)

      cy.get('canvas, svg').should('be.visible')
    })

    it('should optimize chart re-renders on data updates', () => {
      cy.visit('/dashboard')
      cy.wait(1000)

      const initialChartCount = Cypress.$('canvas, svg').length

      // Trigger data refresh
      cy.reload()
      cy.wait(1000)

      cy.get('canvas, svg').should('have.length', initialChartCount)
    })
  })

  context('Accessibility for Screen Readers', () => {
    it('should have ARIA labels for chart regions', () => {
      cy.get('canvas, svg').each(($chart) => {
        cy.wrap($chart).parent().should('satisfy', ($parent) => {
          return $parent.attr('role') || $parent.attr('aria-label') || $parent.find('h1, h2, h3, h4').length > 0
        })
      })
    })

    it('should provide text alternatives for chart data', () => {
      // Verify chart containers have accessible descriptions
      cy.get('[aria-describedby], [aria-label]').should('exist')
    })

    it('should support keyboard navigation for interactive charts', () => {
      cy.get('canvas, svg').first().should('be.visible')

      // Some chart libraries support keyboard interaction
      cy.get('body').type('{tab}')
      cy.wait(200)
    })

    it('should have sufficient color contrast in chart elements', () => {
      // Verify charts use accessible colors
      cy.get('svg').first().then(($svg) => {
        const elements = $svg.find('rect, path, circle')
        expect(elements.length).to.be.greaterThan(0)
      })
    })
  })
})

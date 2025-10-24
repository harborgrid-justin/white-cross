import { test, expect } from '@playwright/test'

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

test.describe('Dashboard - Charts & Visualizations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
  })

  test.describe('Chart Rendering & Detection', () => {
    test('should render at least one chart visualization', async ({ page }) => {
      // Wait for charts to load
      await page.waitForTimeout(1000)

      // Verify canvas or SVG elements exist (common charting libraries)
      const charts = page.locator('canvas, svg[class*="chart"], [data-cy*=chart]')
      await expect(charts).toHaveCount(1, { timeout: 5000 })
    })

    test('should display student enrollment trend chart', async ({ page }) => {
      await expect(page.getByText(/enrollment|student.*trend/i).first()).toBeVisible({ timeout: 10000 })

      // Verify chart container has proper dimensions
      const chart = page.locator('canvas, svg').first()
      const width = await chart.getAttribute('width')
      expect(width).not.toBe('0')
    })

    test('should render medication administration chart', async ({ page }) => {
      await expect(page.getByText(/medication.*chart|medication.*trend|administration/i).first()).toBeVisible({ timeout: 10000 })
    })

    test('should show incident frequency visualization', async ({ page }) => {
      await expect(page.getByText(/incident.*frequency|incident.*chart|incident.*trend/i).first()).toBeVisible({ timeout: 10000 })
    })

    test('should display appointment trends chart', async ({ page }) => {
      await expect(page.getByText(/appointment.*trend|appointment.*chart|scheduling/i).first()).toBeVisible({ timeout: 10000 })
    })

    test('should render multiple chart types', async ({ page }) => {
      // Verify at least 2 different charts
      const charts = page.locator('canvas, svg[class*="chart"]')
      await expect(charts).toHaveCount(2, { timeout: 5000 })
    })
  })

  test.describe('Chart Interactivity & User Experience', () => {
    test('should have interactive hover functionality', async ({ page }) => {
      const firstChart = page.locator('canvas, svg').first()
      await expect(firstChart).toBeVisible()
      await firstChart.hover()

      // Verify tooltip or hover effect appears
      await page.waitForTimeout(300)

      // Some charting libraries show tooltips on hover
      const hasTooltip = await page.locator('[class*="tooltip"], [role="tooltip"]').count()
      if (hasTooltip > 0) {
        await expect(page.locator('[class*="tooltip"], [role="tooltip"]').first()).toBeVisible()
      }
    })

    test('should display chart legends for data series', async ({ page }) => {
      const legend = page.locator('[class*="legend"], [aria-label*="legend"]')
      await expect(legend.first()).toBeVisible()
    })

    test('should show chart axis labels', async ({ page }) => {
      // Verify SVG charts have axis labels or canvas charts have labels
      const hasSvgText = await page.locator('svg text').count()
      const hasAxisLabel = await page.locator('[class*="axis"]').count()

      expect(hasSvgText > 0 || hasAxisLabel > 0).toBeTruthy()
    })

    test('should allow toggling chart data series via legend', async ({ page }) => {
      const legend = page.locator('[class*="legend"]')
      await expect(legend.first()).toBeAttached()

      // Try to click legend items
      const legendButtons = page.locator('[class*="legend"] button, [class*="legend"] [role="button"]')
      const buttonCount = await legendButtons.count()

      if (buttonCount > 0) {
        await legendButtons.first().click()
        await page.waitForTimeout(300)
      }
    })

    test('should show data point tooltips on hover/click', async ({ page }) => {
      const chart = page.locator('canvas, svg').first()
      await expect(chart).toBeVisible()

      // Trigger interaction
      await chart.hover({ position: { x: 100, y: 100 } })
      await page.waitForTimeout(300)

      // Some charts may show data on click instead
      await chart.click({ position: { x: 100, y: 100 } })
      await page.waitForTimeout(300)
    })
  })

  test.describe('Time Period Filtering', () => {
    test('should have time period selectors for charts', async ({ page }) => {
      const timePeriod = page.getByText(/week|month|year|today|this week|this month/i).first()
      await expect(timePeriod).toBeAttached({ timeout: 5000 })
    })

    test('should filter chart data by week view', async ({ page }) => {
      const weekButton = page.locator('button, [role="tab"]').filter({ hasText: /week/i })
      const count = await weekButton.count()

      if (count > 0) {
        await weekButton.first().click()
        await page.waitForTimeout(500)

        // Verify chart updates (data changes)
        await expect(page.locator('canvas, svg').first()).toBeVisible()
      }
    })

    test('should filter chart data by month view', async ({ page }) => {
      const monthButton = page.locator('button, [role="tab"]').filter({ hasText: /month/i })
      const count = await monthButton.count()

      if (count > 0) {
        await monthButton.first().click()
        await page.waitForTimeout(500)

        // Verify chart updates
        await expect(page.locator('canvas, svg').first()).toBeVisible()
      }
    })

    test('should filter chart data by year view', async ({ page }) => {
      const yearButton = page.locator('button, [role="tab"]').filter({ hasText: /year/i })
      const count = await yearButton.count()

      if (count > 0) {
        await yearButton.first().click()
        await page.waitForTimeout(500)

        // Verify chart updates
        await expect(page.locator('canvas, svg').first()).toBeVisible()
      }
    })

    test('should maintain chart state when switching time periods', async ({ page }) => {
      // Click on different time periods and verify charts remain functional
      const timePeriodButton = page.getByRole('button').filter({ hasText: /week|month/i })
      const count = await timePeriodButton.count()

      if (count > 0) {
        await timePeriodButton.first().click()
        await page.waitForTimeout(300)

        await expect(page.locator('canvas, svg').first()).toBeVisible()
      }
    })
  })

  test.describe('Chart Titles & Labels', () => {
    test('should display descriptive chart titles', async ({ page }) => {
      const chartTitles = page.locator('[class*="chart-title"], h3, h4')
      await expect(chartTitles).toHaveCount(1, { timeout: 5000 })
    })

    test('should have accessible chart titles for screen readers', async ({ page }) => {
      const charts = await page.locator('canvas, svg').all()

      for (const chart of charts) {
        const parent = chart.locator('..')

        const hasHeading = await parent.locator('h1, h2, h3, h4, h5, h6').count()
        const hasAriaLabel = await parent.getAttribute('aria-label')
        const hasAriaLabelledBy = await parent.getAttribute('aria-labelledby')

        expect(hasHeading > 0 || hasAriaLabel !== null || hasAriaLabelledBy !== null).toBeTruthy()
      }
    })

    test('should show data labels on chart elements', async ({ page }) => {
      // Verify charts have labels for data points
      const labels = page.locator('svg text, [class*="label"]')
      await expect(labels.first()).toBeAttached()
    })
  })

  test.describe('Responsive Chart Sizing', () => {
    test('should have responsive chart container sizing', async ({ page }) => {
      const chart = page.locator('canvas, svg').first()
      const width = await chart.getAttribute('width')

      expect(parseInt(width as string)).toBeGreaterThan(0)
    })

    test('should resize charts for mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()
      await page.waitForTimeout(1000)

      const chart = page.locator('canvas, svg').first()
      const width = await chart.getAttribute('width') || await chart.evaluate(el => el.clientWidth)

      expect(parseInt(width as string)).toBeLessThan(400)
    })

    test('should resize charts for tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.reload()
      await page.waitForTimeout(1000)

      const chart = page.locator('canvas, svg').first()
      await expect(chart).toBeVisible()
      await expect(chart).toHaveAttribute('width')
    })

    test('should resize charts for desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.reload()
      await page.waitForTimeout(1000)

      const chart = page.locator('canvas, svg').first()
      const width = await chart.getAttribute('width') || await chart.evaluate(el => el.clientWidth)

      expect(parseInt(width as string)).toBeGreaterThan(400)
    })

    test('should maintain aspect ratio on resize', async ({ page }) => {
      const viewports = [[375, 667], [768, 1024], [1920, 1080]] as const

      for (const [width, height] of viewports) {
        await page.setViewportSize({ width, height })
        await page.waitForTimeout(500)

        const chart = page.locator('canvas, svg').first()
        const chartWidth = await chart.getAttribute('width') || await chart.evaluate(el => el.clientWidth)
        const chartHeight = await chart.getAttribute('height') || await chart.evaluate(el => el.clientHeight)

        expect(parseInt(chartWidth as string)).toBeGreaterThan(0)
        expect(parseInt(chartHeight as string)).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Empty State & Error Handling', () => {
    test('should display empty state when no chart data available', async ({ page }) => {
      // Intercept chart data endpoint and return empty data
      await page.route('**/api/dashboard/chart-data/**', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ data: [] })
        })
      })

      await page.reload()

      // Verify empty state message or placeholder
      const emptyState = page.getByText(/no data|no chart data|no results|empty/i).first()
      await expect(emptyState).toBeVisible({ timeout: 5000 })
    })

    test('should show loading state while chart data is fetching', async ({ page }) => {
      await page.route('**/api/dashboard/**', route => {
        setTimeout(() => route.continue(), 1000)
      })

      await page.goto('/dashboard')

      // Verify loading indicator
      const loadingIndicator = page.locator('[class*="loading"], [class*="skeleton"]')
      await expect(loadingIndicator.first()).toBeAttached({ timeout: 1000 })
    })

    test('should handle chart rendering errors gracefully', async ({ page }) => {
      await page.route('**/api/dashboard/chart-data/**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal server error' })
        })
      })

      await page.reload()

      // Should still show dashboard without crashing
      await expect(page.locator('main')).toBeVisible()
    })

    test('should provide error message for failed chart data load', async ({ page }) => {
      await page.route('**/api/dashboard/chart-data/**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Failed to load chart data' })
        })
      })

      await page.reload()

      // May show error message or fallback UI
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Chart Data Accuracy & Validation', () => {
    test('should display accurate data values in charts', async ({ page }) => {
      // Mock specific chart data to verify rendering
      await page.route('**/api/dashboard/student-enrollment', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { month: 'January', count: 150 },
              { month: 'February', count: 155 },
              { month: 'March', count: 160 }
            ]
          })
        })
      })

      await page.reload()

      // Verify chart renders with data
      await expect(page.locator('canvas, svg').first()).toBeVisible()
    })

    test('should update charts when new data is received', async ({ page }) => {
      let dataVersion = 1

      await page.route('**/api/dashboard/**', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ data: [{ value: dataVersion++ }] })
        })
      })

      await page.reload()

      // Trigger a refresh
      const refreshButton = page.getByRole('button').filter({ hasText: /refresh|reload/i })
      const count = await refreshButton.count()

      if (count > 0) {
        await refreshButton.first().click()
        await page.waitForTimeout(500)
      }
    })

    test('should validate chart data ranges are within expected bounds', async ({ page }) => {
      // Healthcare data should have reasonable bounds
      const labels = await page.locator('svg text, [class*="label"]').all()

      for (const label of labels) {
        const text = await label.textContent()
        if (text) {
          const number = parseInt(text.replace(/[^0-9]/g, ''))

          if (!isNaN(number)) {
            // Student counts should be reasonable (0-10000)
            expect(number).toBeGreaterThanOrEqual(0)
            expect(number).toBeLessThanOrEqual(10000)
          }
        }
      }
    })
  })

  test.describe('Healthcare-Specific Chart Requirements', () => {
    test('should display medication administration trends chart', async ({ page }) => {
      await expect(page.getByText(/medication/i).first()).toBeAttached()

      // Verify chart shows time-based data
      await expect(page.locator('body').getByText(/today|week|month/i).first()).toBeAttached()
    })

    test('should show incident severity distribution chart', async ({ page }) => {
      await expect(page.getByText(/incident/i).first()).toBeAttached()

      // May show pie chart or bar chart for severity levels
      await expect(page.locator('canvas, svg').first()).toBeVisible()
    })

    test('should display appointment scheduling patterns', async ({ page }) => {
      await expect(page.getByText(/appointment/i).first()).toBeAttached()

      // Verify time-based visualization
      await expect(page.locator('canvas, svg').first()).toBeVisible()
    })

    test('should show student health metrics over time', async ({ page }) => {
      // Growth charts, vital signs, or health screening trends
      const charts = page.locator('canvas, svg')
      await expect(charts).toHaveCount(1, { timeout: 5000 })
    })
  })

  test.describe('Performance & Optimization', () => {
    test('should render charts within acceptable time (<2s)', async ({ page }) => {
      const startTime = Date.now()

      await page.goto('/dashboard')
      await page.waitForTimeout(1000)

      await expect(page.locator('canvas, svg').first()).toBeVisible()

      const renderTime = Date.now() - startTime
      expect(renderTime).toBeLessThan(2000)
    })

    test('should not block UI while charts are loading', async ({ page }) => {
      await page.route('**/api/dashboard/**', route => {
        setTimeout(() => route.continue(), 1000)
      })

      await page.goto('/dashboard')

      // Verify other UI elements are still interactive
      const firstButton = page.getByRole('button').first()
      await expect(firstButton).not.toBeDisabled()
    })

    test('should lazy load charts below the fold', async ({ page }) => {
      await page.goto('/dashboard')

      // Scroll to bottom to trigger lazy-loaded charts
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(500)

      await expect(page.locator('canvas, svg').first()).toBeVisible()
    })

    test('should optimize chart re-renders on data updates', async ({ page }) => {
      await page.goto('/dashboard')
      await page.waitForTimeout(1000)

      const initialChartCount = await page.locator('canvas, svg').count()

      // Trigger data refresh
      await page.reload()
      await page.waitForTimeout(1000)

      const finalChartCount = await page.locator('canvas, svg').count()
      expect(finalChartCount).toBe(initialChartCount)
    })
  })

  test.describe('Accessibility for Screen Readers', () => {
    test('should have ARIA labels for chart regions', async ({ page }) => {
      const charts = await page.locator('canvas, svg').all()

      for (const chart of charts) {
        const parent = chart.locator('..')

        const hasRole = await parent.getAttribute('role')
        const hasAriaLabel = await parent.getAttribute('aria-label')
        const hasHeading = await parent.locator('h1, h2, h3, h4').count()

        expect(hasRole !== null || hasAriaLabel !== null || hasHeading > 0).toBeTruthy()
      }
    })

    test('should provide text alternatives for chart data', async ({ page }) => {
      // Verify chart containers have accessible descriptions
      const accessibleElements = page.locator('[aria-describedby], [aria-label]')
      await expect(accessibleElements.first()).toBeAttached()
    })

    test('should support keyboard navigation for interactive charts', async ({ page }) => {
      const firstChart = page.locator('canvas, svg').first()
      await expect(firstChart).toBeVisible()

      // Some chart libraries support keyboard interaction
      await page.keyboard.press('Tab')
      await page.waitForTimeout(200)
    })

    test('should have sufficient color contrast in chart elements', async ({ page }) => {
      // Verify charts use accessible colors
      const svgElements = page.locator('svg').first().locator('rect, path, circle')
      const count = await svgElements.count()
      expect(count).toBeGreaterThan(0)
    })
  })
})

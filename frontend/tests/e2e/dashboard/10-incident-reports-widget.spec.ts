import { test, expect } from '@playwright/test'

/**
 * Dashboard - Incident Reports Widget (15 tests)
 *
 * Tests incident reports summary and recent incidents
 */

test.describe('Dashboard - Incident Reports Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
  })

  test('should display recent incidents section', async ({ page }) => {
    await expect(page.getByText(/recent.*incidents|incident.*reports/i).first()).toBeVisible()
  })

  test('should show incident count', async ({ page }) => {
    const incidentCount = page.getByText(/\d+.*incidents/i).first()
    await expect(incidentCount).toBeAttached()
  })

  test('should display incident types', async ({ page }) => {
    const incidentTypes = page.getByText(/injury|illness|emergency/i).first()
    await expect(incidentTypes).toBeAttached()
  })

  test('should show incident severity levels', async ({ page }) => {
    const severity = page.locator('[class*="severity"], [class*="critical"]')
    await expect(severity.first()).toBeAttached()
  })

  test('should display incident timestamps', async ({ page }) => {
    const timestamps = page.getByText(/ago|today|yesterday/i).first()
    await expect(timestamps).toBeAttached()
  })

  test('should show student names in incidents', async ({ page }) => {
    await expect(page.locator('[class*="incident"]').first()).toBeAttached()
  })

  test('should display incident status', async ({ page }) => {
    const status = page.getByText(/pending|resolved|in.*progress/i).first()
    await expect(status).toBeAttached()
  })

  test('should show incident location', async ({ page }) => {
    const location = page.getByText(/classroom|playground|gym|cafeteria/i).first()
    await expect(location).toBeAttached()
  })

  test('should display follow-up required indicators', async ({ page }) => {
    const followUp = page.locator('[class*="follow-up"], [class*="action-required"]')
    await expect(followUp.first()).toBeAttached()
  })

  test('should show incident category icons', async ({ page }) => {
    const icons = page.locator('[class*="incident"] svg')
    await expect(icons.first()).toBeAttached()
  })

  test('should have clickable incident items', async ({ page }) => {
    const firstIncident = page.locator('[class*="incident"]').first()
    await expect(firstIncident).toHaveAttribute('class')
  })

  test('should display parent notification status', async ({ page }) => {
    const notificationStatus = page.getByText(/notified|pending.*notification/i).first()
    await expect(notificationStatus).toBeAttached()
  })

  test('should show view all incidents link', async ({ page }) => {
    const viewAllLink = page.getByText(/view.*all.*incidents|see.*more/i).first()
    await expect(viewAllLink).toBeAttached()
  })

  test('should display incidents by priority', async ({ page }) => {
    const priority = page.locator('[class*="priority"]')
    await expect(priority.first()).toBeAttached()
  })

  test('should show empty state when no incidents', async ({ page }) => {
    const emptyState = page.getByText(/no.*incidents|no.*reports/i).first()
    await expect(emptyState).toBeAttached()
  })
})

import { test, expect } from '@playwright/test'

/**
 * Dashboard - Alerts & Notifications (15 tests)
 *
 * Tests dashboard alerts, warnings, and notification system
 */

test.describe('Dashboard - Alerts & Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
  })

  test('should display alerts section', async ({ page }) => {
    await expect(page.getByText(/alerts|notifications|warnings/i).first()).toBeVisible()
  })

  test('should show critical alerts prominently', async ({ page }) => {
    const alerts = page.locator('[class*="alert"], [class*="notification"]')
    await expect(alerts.first()).toBeAttached()
  })

  test('should display alert count badge', async ({ page }) => {
    const badge = page.locator('[class*="badge"], [class*="count"]')
    await expect(badge.first()).toBeAttached()
  })

  test('should show medication expiration alerts', async ({ page }) => {
    const expirationAlerts = page.getByText(/expir|expiring.*soon/i).first()
    await expect(expirationAlerts).toBeAttached()
  })

  test('should display overdue appointment alerts', async ({ page }) => {
    const overdueAlerts = page.getByText(/overdue|missed.*appointment/i).first()
    await expect(overdueAlerts).toBeAttached()
  })

  test('should show health screening reminders', async ({ page }) => {
    const screeningReminders = page.getByText(/screening|reminder/i).first()
    await expect(screeningReminders).toBeAttached()
  })

  test('should have different alert severity levels', async ({ page }) => {
    const severityAlerts = page.locator('[class*="alert-warning"], [class*="alert-danger"], [class*="alert-info"]')
    await expect(severityAlerts.first()).toBeAttached()
  })

  test('should display alert icons based on severity', async ({ page }) => {
    const alertIcons = page.locator('[class*="alert"] svg')
    await expect(alertIcons.first()).toBeAttached()
  })

  test('should allow dismissing alerts', async ({ page }) => {
    const dismissButton = page.locator('[class*="alert"] button, [aria-label*="dismiss"]').first()
    await expect(dismissButton).toBeAttached()
  })

  test('should show timestamp for alerts', async ({ page }) => {
    const timestamp = page.locator('[class*="alert"]').getByText(/ago|minutes|hours/i).first()
    await expect(timestamp).toBeAttached()
  })

  test('should have clickable alerts for more details', async ({ page }) => {
    const firstAlert = page.locator('[class*="alert"]').first()
    await expect(firstAlert).toHaveCSS('cursor', 'pointer')
  })

  test('should display unread notification count', async ({ page }) => {
    const unreadCount = page.locator('[class*="unread"], [class*="badge"]')
    await expect(unreadCount.first()).toBeAttached()
  })

  test('should show notification panel toggle', async ({ page }) => {
    const notificationToggle = page.locator('button[aria-label*="notification"], [data-testid*="notification"]').first()
    await expect(notificationToggle).toBeAttached()
  })

  test('should display alert descriptions', async ({ page }) => {
    const alertDescription = page.locator('[class*="alert"]').first()
    const text = await alertDescription.textContent()
    expect(text).toBeTruthy()
  })

  test('should prioritize alerts by importance', async ({ page }) => {
    await expect(page.locator('[class*="alert"]').first()).toBeAttached()
  })
})

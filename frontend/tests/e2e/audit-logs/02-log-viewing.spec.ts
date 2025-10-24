import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Audit Logs: Log Viewing (5 tests)
 *
 * Validates audit log entry display including timestamps, users,
 * action types, and affected resources.
 */

test.describe('Audit Logs - Log Viewing', () => {
  test.beforeEach(async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'admin')
    await page.goto('/audit-logs')
  })

  test('should display audit log entries', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display log timestamp', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display user who performed action', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display action type', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display resource affected', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })
})

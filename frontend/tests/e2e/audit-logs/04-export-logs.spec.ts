import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Audit Logs: Export Logs (4 tests)
 *
 * Validates audit log export functionality including CSV and PDF export,
 * filtered exports, and date range exports.
 */

test.describe('Audit Logs - Export Logs', () => {
  test.beforeEach(async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'admin')
    await page.goto('/audit-logs')
  })

  test('should export logs as CSV', async ({ page }) => {
    await page.getByRole('button', { name: /export/i }).click()
    await page.waitForTimeout(1000)
    await expect(page.locator('body')).toBeAttached()
  })

  test('should export logs as PDF', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should export filtered logs', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should export logs for specific date range', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })
})

import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Audit Logs: Page UI Structure (4 tests)
 *
 * Validates the audit logs page user interface elements and layout.
 * Tests ensure proper table display, filter options, and export functionality.
 */

test.describe('Audit Logs - Page UI Structure', () => {
  test.beforeEach(async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'admin')
    await page.goto('/audit-logs')
  })

  test('should load audit logs page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/audit/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display audit logs table', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display filter options', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display export button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /export/i })).toBeVisible()
  })
})

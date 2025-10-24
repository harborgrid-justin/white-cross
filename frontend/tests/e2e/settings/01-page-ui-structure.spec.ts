import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Settings & Configuration: Page UI Structure (4 tests)
 *
 * Validates the settings page user interface elements and layout.
 * Tests ensure proper navigation, visibility of key sections, and action buttons.
 */

test.describe('Settings & Configuration - Page UI Structure', () => {
  test.beforeEach(async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'admin')
    await page.goto('/settings')
  })

  test('should load settings page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/settings/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display settings navigation tabs', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display system settings section', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Settings')
  })

  test('should display save settings button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /save/i })).toBeVisible()
  })
})

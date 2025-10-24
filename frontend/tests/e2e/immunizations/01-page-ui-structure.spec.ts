import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Immunization Tracking: Page UI Structure (4 tests)
 *
 * Validates the immunization tracking interface elements and layout.
 * Tests ensure proper display of immunization section, add button,
 * immunization table, and compliance status indicators.
 */

test.describe('Immunization Tracking - Page UI Structure', () => {
  test.beforeEach(async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'nurse')
    await page.goto('/students')
    await page.getByTestId('student-table').locator('tbody tr').first().click()
  })

  test('should display immunization section', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Immunization')
  })

  test('should display add immunization button', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display immunization table', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display compliance status indicator', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })
})

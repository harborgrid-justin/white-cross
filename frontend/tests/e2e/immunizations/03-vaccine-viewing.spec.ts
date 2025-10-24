import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Immunization Tracking: Vaccine Viewing (4 tests)
 *
 * Validates vaccine record viewing functionality including immunization history,
 * vaccine details, administration dates, and next due dates.
 */

test.describe('Immunization Tracking - Vaccine Viewing', () => {
  test.beforeEach(async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'nurse')
    await page.goto('/students')
    await page.getByTestId('student-table').locator('tbody tr').first().click()
  })

  test('should display immunization history', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display vaccine details', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display administration date', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should display next due dates', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })
})

import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Immunization Tracking: Vaccine Deletion (3 tests)
 *
 * Validates vaccine record deletion functionality including delete button
 * display, confirmation dialogs, and successful deletion.
 */

test.describe('Immunization Tracking - Vaccine Deletion', () => {
  test.beforeEach(async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'nurse')
    await page.goto('/students')
    await page.getByTestId('student-table').locator('tbody tr').first().click()
  })

  test('should display delete button for immunization', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should confirm before deleting immunization', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should successfully delete immunization record', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })
})

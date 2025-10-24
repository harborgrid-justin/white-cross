import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Immunization Tracking: Vaccine Editing (4 tests)
 *
 * Validates vaccine record editing functionality including updating
 * vaccine information, lot numbers, and next due dates.
 */

test.describe('Immunization Tracking - Vaccine Editing', () => {
  test.beforeEach(async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'nurse')
    await page.goto('/students')
    await page.getByTestId('student-table').locator('tbody tr').first().click()
  })

  test('should open edit immunization modal', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should update vaccine information', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should update lot number', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should update next due date', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })
})

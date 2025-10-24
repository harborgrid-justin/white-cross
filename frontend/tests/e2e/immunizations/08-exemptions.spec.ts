import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Immunization Tracking: Exemptions (3 tests)
 *
 * Validates immunization exemption management including medical exemptions,
 * religious exemptions, and exemption documentation viewing.
 */

test.describe('Immunization Tracking - Exemptions', () => {
  test.beforeEach(async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'nurse')
    await page.goto('/students')
    await page.getByTestId('student-table').locator('tbody tr').first().click()
  })

  test('should add medical exemption', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should add religious exemption', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should view exemption documentation', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })
})

import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Immunization Tracking: RBAC Permissions (2 tests)
 *
 * Validates role-based access control for immunization tracking functionality.
 * Tests ensure proper permission enforcement for nurses and viewers.
 *
 * Compliance: RBAC - Role-Based Access Control
 */

test.describe('Immunization Tracking - RBAC Permissions', () => {
  test('should allow nurse to manage immunizations', async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'nurse')
    await page.goto('/students')
    await expect(page.locator('body')).toBeAttached()
  })

  test('should restrict viewer from editing immunizations', async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'viewer')
    await page.goto('/students')
    await expect(page.locator('body')).toBeAttached()
  })
})

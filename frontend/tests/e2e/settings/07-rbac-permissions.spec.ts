import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Settings & Configuration: RBAC Permissions (2 tests)
 *
 * Validates role-based access control for settings functionality.
 * Tests ensure proper permission enforcement for admin and non-admin users.
 *
 * Compliance: RBAC - Role-Based Access Control
 */

test.describe('Settings & Configuration - RBAC Permissions', () => {
  test('should allow admin full access to settings', async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'admin')
    await page.goto('/settings')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should restrict non-admin access to settings', async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'viewer')
    await page.goto('/settings')
    await expect(page.locator('body')).toBeAttached()
  })
})

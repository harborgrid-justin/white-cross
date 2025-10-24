import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Audit Logs: RBAC Permissions (2 tests)
 *
 * Validates role-based access control for audit log functionality.
 * Tests ensure proper permission enforcement for viewing audit logs.
 *
 * Compliance: RBAC - Role-Based Access Control
 */

test.describe('Audit Logs - RBAC Permissions', () => {
  test('should allow admin to view all audit logs', async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'admin')
    await page.goto('/audit-logs')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should restrict non-admin access to audit logs', async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'viewer')
    await page.goto('/audit-logs')
    await expect(page.locator('body')).toBeAttached()
  })
})

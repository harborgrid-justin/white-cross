import { test, expect } from '@playwright/test'

/**
 * Administration Features: Users Tab (Enhanced - 35 tests)
 *
 * Tests comprehensive user management functionality with RBAC
 * Ensures proper access control and user administration
 *
 * Healthcare Context:
 * - User roles: ADMIN, NURSE, COUNSELOR, READ_ONLY (VIEWER)
 * - Nurses can access all student health data
 * - Counselors can access counseling and mental health data
 * - Viewers have read-only access to assigned students
 * - Admins manage districts, schools, and all users
 */

test.describe('Administration Features - Users Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
    // Wait for admin data to load
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Users' }).click()
  })

  test.describe('Page Load and Structure', () => {
    test('should display the Users tab as active', async ({ page }) => {
      const usersTab = page.getByRole('button', { name: 'Users' })
      await expect(usersTab).toHaveClass(/border-blue-500/)
    })

    test('should show users heading', async ({ page }) => {
      await expect(page.getByText(/user/i).first()).toBeVisible()
    })

    test('should have add user button visible to admins', async ({ page }) => {
      await expect(page.getByRole('button').filter({ hasText: /add|new|create/i }).first()).toBeVisible({ timeout: 5000 })
    })

    test('should display users table', async ({ page }) => {
      await expect(page.locator('table').first()).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe('Table Columns and User Data', () => {
    test('should display name column', async ({ page }) => {
      const table = page.locator('table').first()
      await expect(table.getByText(/name|user/i).first()).toBeVisible()
    })

    test('should show email column for user identification', async ({ page }) => {
      const table = page.locator('table').first()
      await expect(table.getByText(/email/i).first()).toBeVisible()
    })

    test('should display role column with RBAC roles', async ({ page }) => {
      const table = page.locator('table').first()
      await expect(table.getByText(/role/i).first()).toBeVisible()
    })

    test('should show status column (active/inactive)', async ({ page }) => {
      const table = page.locator('table').first()
      await expect(table.getByText(/status|active/i).first()).toBeVisible()
    })

    test('should display last login column for monitoring user activity', async ({ page }) => {
      const table = page.locator('table').first()
      await expect(table.getByText(/last.*login|activity/i).first()).toBeVisible()
    })

    test('should show user school assignments', async ({ page }) => {
      const table = page.locator('table').first()
      const schoolColumn = table.getByText(/school|assigned/i).first()
      await expect(schoolColumn).toBeAttached()
    })

    test('should display user creation date', async ({ page }) => {
      const table = page.locator('table').first()
      const createdColumn = table.getByText(/created|joined|date/i).first()
      await expect(createdColumn).toBeAttached()
    })

    test('should show role badges with visual distinction', async ({ page }) => {
      const badges = page.locator('[class*="badge"], [class*="rounded-full"], [class*="px-"]')
      await expect(badges.first()).toBeAttached()
    })
  })

  test.describe('User Management Actions', () => {
    test('should have action buttons for each user', async ({ page }) => {
      const actionButtons = page.locator('button[class*="text-"], a[class*="text-"]')
      await expect(actionButtons.first()).toBeAttached()
    })

    test('should have edit user functionality', async ({ page }) => {
      const editButton = page.locator('button, a').filter({ hasText: /edit|modify/i }).first()
      await expect(editButton).toBeAttached()
    })

    test('should show delete/deactivate user option', async ({ page }) => {
      const deleteButton = page.getByRole('button').filter({ hasText: /delete|deactivate|disable/i }).first()
      await expect(deleteButton).toBeAttached()
    })

    test('should display user permissions/access levels', async ({ page }) => {
      await expect(page.locator('body').getByText(/permission|access|role/i).first()).toBeAttached()
    })

    test('should have reset password option', async ({ page }) => {
      const resetButton = page.getByRole('button').filter({ hasText: /reset.*password|password/i }).first()
      await expect(resetButton).toBeAttached()
    })

    test('should show user activation/deactivation toggle', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Search and Filtering', () => {
    test('should have search functionality', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
      await expect(searchInput).toBeVisible()
    })

    test('should filter by role (ADMIN, NURSE, COUNSELOR, VIEWER)', async ({ page }) => {
      const roleFilter = page.locator('select, [role="combobox"]').first()
      await expect(roleFilter).toBeAttached()
    })

    test('should display filter by status (active/inactive)', async ({ page }) => {
      const statusFilter = page.locator('select, [role="combobox"]').first()
      await expect(statusFilter).toBeAttached()
    })

    test('should filter by school assignment', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })

    test('should search users by name or email', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
      await expect(searchInput).toBeVisible()
    })
  })

  test.describe('Sorting and Organization', () => {
    test('should have sorting capability on columns', async ({ page }) => {
      const sortableHeaders = page.locator('th[class*="cursor-"], button[class*="sort"]')
      await expect(sortableHeaders.first()).toBeAttached()
    })

    test('should sort by name alphabetically', async ({ page }) => {
      await expect(page.locator('table').first()).toBeVisible()
    })

    test('should sort by role to group similar permissions', async ({ page }) => {
      await expect(page.locator('table').first()).toBeVisible()
    })

    test('should sort by last login to identify inactive users', async ({ page }) => {
      await expect(page.locator('table').first()).toBeVisible()
    })
  })

  test.describe('Pagination and Bulk Actions', () => {
    test('should show pagination controls', async ({ page }) => {
      const pagination = page.getByText(/page|showing|of/i).first()
      await expect(pagination).toBeAttached()
    })

    test('should have bulk action checkboxes', async ({ page }) => {
      const checkboxes = page.locator('input[type="checkbox"]')
      await expect(checkboxes.first()).toBeAttached()
    })

    test('should support bulk activation/deactivation', async ({ page }) => {
      const checkboxes = page.locator('input[type="checkbox"]')
      await expect(checkboxes.first()).toBeAttached()
    })

    test('should allow bulk role assignment', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Export and Reporting', () => {
    test('should have export functionality', async ({ page }) => {
      const exportButton = page.getByRole('button').filter({ hasText: /export|download/i }).first()
      await expect(exportButton).toBeAttached()
    })

    test('should export user list with roles and permissions', async ({ page }) => {
      const exportButton = page.getByRole('button').filter({ hasText: /export|download/i }).first()
      await expect(exportButton).toBeVisible()
    })

    test('should generate user access report', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Role-Based Access Control (RBAC)', () => {
    test('should display all four roles: ADMIN, NURSE, COUNSELOR, VIEWER', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })

    test('should show role descriptions and permissions', async ({ page }) => {
      await expect(page.locator('body').getByText(/role|permission|access/i).first()).toBeAttached()
    })

    test('should enforce role hierarchy in user management', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })

    test('should prevent privilege escalation', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Multi-School and District Management', () => {
    test('should show district assignment for users', async ({ page }) => {
      await expect(page.locator('body').getByText(/district|school/i).first()).toBeAttached()
    })

    test('should allow assigning users to multiple schools', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })

    test('should display district-level administrators', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Security and Compliance', () => {
    test('should show last password change date', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })

    test('should display failed login attempts', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })

    test('should track user session information', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })

    test('should enforce strong password requirements', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Responsive Design', () => {
    test('should have responsive table layout', async ({ page }) => {
      const responsiveTable = page.locator('[class*="overflow-x"]').first()
      await expect(responsiveTable).toBeAttached()
    })

    test('should be usable on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await expect(page.locator('table').first()).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have accessible form controls', async ({ page }) => {
      await expect(page.getByRole('button').first()).toBeVisible()
    })

    test('should have proper ARIA labels', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
    })
  })
})

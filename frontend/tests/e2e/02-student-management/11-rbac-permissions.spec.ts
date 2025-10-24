import { test, expect } from '@playwright/test'
import { login } from '../../support/auth-helpers'

/**
 * Student Management: Role-Based Permissions (10 tests)
 *
 * Tests RBAC controls for different user roles
 */

test.describe('Student Management - Role-Based Permissions', () => {
  test('should allow admin to view student management page', async ({ page }) => {
    await login(page, 'admin')
    await page.goto('/students')
    await expect(page.getByTestId('student-table')).toBeVisible()
  })

  test('should allow nurse to view student management page', async ({ page }) => {
    await login(page, 'nurse')
    await page.goto('/students')
    await expect(page.getByTestId('student-table')).toBeVisible()
  })

  test('should allow counselor to view student management page', async ({ page }) => {
    await login(page, 'counselor')
    await page.goto('/students')
    await expect(page.getByTestId('student-table')).toBeVisible()
  })

  test('should allow admin to create students', async ({ page }) => {
    await login(page, 'admin')
    await page.goto('/students')
    await expect(page.getByTestId('add-student-button')).toBeVisible()
  })

  test('should allow nurse to create students', async ({ page }) => {
    await login(page, 'nurse')
    await page.goto('/students')
    await expect(page.getByTestId('add-student-button')).toBeVisible()
  })

  test('should NOT allow viewer to create students', async ({ page }) => {
    await login(page, 'viewer')
    await page.goto('/students', { waitUntil: 'networkidle' })
    await expect(page.getByTestId('add-student-button')).not.toBeVisible()
  })

  test('should NOT allow nurse to delete students', async ({ page }) => {
    await login(page, 'nurse')
    await page.goto('/students')

    // Wait for student data to load
    await expect(page.getByTestId('student-table')).toBeVisible({ timeout: 10000 })
    await page.waitForLoadState('networkidle')
    await expect(page.getByTestId('student-row')).toHaveCount(await page.getByTestId('student-row').count())
    expect(await page.getByTestId('student-row').count()).toBeGreaterThanOrEqual(1)

    const firstRow = page.getByTestId('student-row').first()
    await expect(firstRow.getByTestId('delete-student-button')).not.toBeVisible()
  })

  test('should allow admin to delete students', async ({ page }) => {
    await login(page, 'admin')
    await page.goto('/students')

    // Wait for student data to load
    await expect(page.getByTestId('student-table')).toBeVisible({ timeout: 10000 })
    await page.waitForLoadState('networkidle')
    await expect(page.getByTestId('student-row')).toHaveCount(await page.getByTestId('student-row').count())
    expect(await page.getByTestId('student-row').count()).toBeGreaterThanOrEqual(1)

    const firstRow = page.getByTestId('student-row').first()
    const deleteButton = firstRow.getByTestId('delete-student-button')
    await deleteButton.scrollIntoViewIfNeeded()
    await expect(deleteButton).toBeVisible()
  })

  test('should NOT allow viewer to access student management page', async ({ page }) => {
    await login(page, 'viewer')
    await page.goto('/students', { waitUntil: 'domcontentloaded' })

    // Viewer should see access denied message
    await expect(
      page.locator('text=/access denied|insufficient permissions|not have permission/i')
    ).toBeVisible({ timeout: 10000 })

    // Should show HIPAA compliance notice
    await expect(page.locator('text=/HIPAA Compliance/i')).toBeVisible()

    // Student table should not be visible
    await expect(page.getByTestId('student-table')).not.toBeVisible()
  })

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/students')
    await page.waitForURL('**/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })
})

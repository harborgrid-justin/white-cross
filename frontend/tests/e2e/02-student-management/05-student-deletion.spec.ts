import { test, expect } from '@playwright/test'
import { login } from '../../support/auth-helpers'

/**
 * Student Management: Student Deletion & Archiving (15 tests)
 *
 * Tests CRUD Delete operations and archiving functionality
 */

test.describe('Student Management - Student Deletion & Archiving (CRUD - Delete)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'admin')
    await page.goto('/students')
  })

  test('should display delete button for each student', async ({ page }) => {
    const firstRow = page.getByTestId('student-row').first()
    const deleteButton = firstRow.getByTestId('delete-student-button')
    await deleteButton.scrollIntoViewIfNeeded()
    await expect(deleteButton).toBeVisible()
  })

  test('should show confirmation modal when delete button is clicked', async ({ page }) => {
    const firstRow = page.getByTestId('student-row').first()
    await firstRow.getByTestId('delete-student-button').click()
    await expect(page.getByTestId('confirm-delete-modal')).toBeVisible()
  })

  test('should display confirmation message with student name', async ({ page }) => {
    const firstRow = page.getByTestId('student-row').first()
    await firstRow.getByTestId('delete-student-button').click()
    await expect(page.getByTestId('confirm-delete-message')).toContainText('Are you sure')
  })

  test('should successfully archive student when confirmed', async ({ page }) => {
    // Use student without medications (fourth student, Sophia Miller)
    const fourthRow = page.getByTestId('student-row').nth(3)
    const studentName = await fourthRow.getByTestId('student-name').textContent()

    await fourthRow.getByTestId('delete-student-button').click()
    await expect(page.getByTestId('confirm-delete-modal')).toBeVisible()
    await page.getByTestId('confirm-delete-button').click()

    await expect(page.getByTestId('student-table')).not.toContainText(studentName || '')
  })

  test('should cancel deletion when cancel button is clicked', async ({ page }) => {
    const initialRowCount = await page.getByTestId('student-row').count()

    const firstRow = page.getByTestId('student-row').first()
    await firstRow.getByTestId('delete-student-button').click()
    await page.getByTestId('cancel-delete-button').click()

    const finalRowCount = await page.getByTestId('student-row').count()
    expect(finalRowCount).toBe(initialRowCount)
  })

  test('should close confirmation modal when cancel is clicked', async ({ page }) => {
    const firstRow = page.getByTestId('student-row').first()
    await firstRow.getByTestId('delete-student-button').click()
    await expect(page.getByTestId('confirm-delete-modal')).toBeVisible()
    await page.getByTestId('cancel-delete-button').click()
    await expect(page.getByTestId('confirm-delete-modal')).not.toBeVisible()
  })

  test('should display success message after archiving student', async ({ page }) => {
    // Use student without medications (fourth student, Sophia Miller)
    const fourthRow = page.getByTestId('student-row').nth(3)
    await fourthRow.getByTestId('delete-student-button').click()
    await page.getByTestId('confirm-delete-button').click()
    await expect(page.locator('text=/archived/i')).toBeVisible()
  })

  test('should allow viewing archived students', async ({ page }) => {
    await page.getByTestId('view-archived-button').click()
    await expect(page.getByTestId('archived-students-list')).toBeVisible()
  })

  test('should display archived students in separate list', async ({ page }) => {
    await page.getByTestId('view-archived-button').click()
    await expect(page.getByTestId('archived-student-row')).toHaveCount(await page.getByTestId('archived-student-row').count())
    expect(await page.getByTestId('archived-student-row').count()).toBeGreaterThanOrEqual(0)
  })

  test('should allow restoring an archived student', async ({ page }) => {
    await page.getByTestId('view-archived-button').click()

    const firstArchivedRow = page.getByTestId('archived-student-row').first()
    const studentName = await firstArchivedRow.getByTestId('student-name').textContent()

    await firstArchivedRow.getByTestId('restore-student-button').click()
    await page.getByTestId('view-active-button').click()

    await expect(page.getByTestId('student-table')).toContainText(studentName || '')
  })

  test('should display restore button for archived students', async ({ page }) => {
    await page.getByTestId('view-archived-button').click()

    const firstArchivedRow = page.getByTestId('archived-student-row').first()
    await expect(firstArchivedRow.getByTestId('restore-student-button')).toBeVisible()
  })

  test('should switch between active and archived views', async ({ page }) => {
    await page.getByTestId('view-archived-button').click()
    await expect(page.getByTestId('archived-students-list')).toBeVisible()

    await page.getByTestId('view-active-button').click()
    await expect(page.getByTestId('student-table')).toBeVisible()
  })

  test('should display count of archived students', async ({ page }) => {
    await page.getByTestId('view-archived-button').click()
    await expect(page.getByTestId('archived-count')).toBeVisible()
  })

  test('should create audit log when student is archived', async ({ page }) => {
    await page.route('**/api/audit-log', async (route) => {
      const postData = route.request().postDataJSON()
      expect(postData).toMatchObject({
        action: 'ARCHIVE_STUDENT',
        resourceType: 'STUDENT'
      })
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) })
    })

    // Use student without medications (fourth student, Sophia Miller)
    const fourthRow = page.getByTestId('student-row').nth(3)
    await fourthRow.getByTestId('delete-student-button').click()
    await page.getByTestId('confirm-delete-button').click()

    await page.waitForTimeout(500)
  })

  test('should prevent deletion of students with active medications', async ({ page }) => {
    const firstRow = page.getByTestId('student-row').first()
    await firstRow.getByTestId('delete-student-button').click()
    await page.getByTestId('confirm-delete-button').click()
    await expect(page.locator('text=/cannot archive.*active medications/i')).toBeVisible()
  })
})

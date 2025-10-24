import { test, expect } from '@playwright/test'

/**
 * Dashboard - Student Summary (15 tests)
 *
 * Tests student population statistics and summaries
 */

test.describe('Dashboard - Student Summary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
  })

  test('should display total student count', async ({ page }) => {
    await expect(page.getByText(/total.*students|\d+.*students/i).first()).toBeVisible()
  })

  test('should show students by grade level', async ({ page }) => {
    const gradeInfo = page.getByText(/grade|k-12|elementary/i).first()
    await expect(gradeInfo).toBeAttached()
  })

  test('should display active students count', async ({ page }) => {
    const activeStudents = page.getByText(/active.*students/i).first()
    await expect(activeStudents).toBeAttached()
  })

  test('should show students with active health conditions', async ({ page }) => {
    const healthConditions = page.getByText(/health.*conditions|chronic/i).first()
    await expect(healthConditions).toBeAttached()
  })

  test('should display students with allergies count', async ({ page }) => {
    const allergies = page.getByText(/allergies|allergic/i).first()
    await expect(allergies).toBeAttached()
  })

  test('should show students on medications', async ({ page }) => {
    const onMeds = page.getByText(/on.*medications|taking.*medications/i).first()
    await expect(onMeds).toBeAttached()
  })

  test('should display gender distribution', async ({ page }) => {
    const gender = page.getByText(/male|female|gender/i).first()
    await expect(gender).toBeAttached()
  })

  test('should show enrollment trends', async ({ page }) => {
    const enrollment = page.getByText(/enrollment|trend/i).first()
    await expect(enrollment).toBeAttached()
  })

  test('should display students requiring screenings', async ({ page }) => {
    const screenings = page.getByText(/screening.*due|pending.*screenings/i).first()
    await expect(screenings).toBeAttached()
  })

  test('should show students with special needs', async ({ page }) => {
    const specialNeeds = page.getByText(/special.*needs|iep|504/i).first()
    await expect(specialNeeds).toBeAttached()
  })

  test('should display student attendance summary', async ({ page }) => {
    const attendance = page.getByText(/attendance|absent/i).first()
    await expect(attendance).toBeAttached()
  })

  test('should show recent student additions', async ({ page }) => {
    const recentStudents = page.getByText(/new.*students|recently.*added/i).first()
    await expect(recentStudents).toBeAttached()
  })

  test('should display student health risk indicators', async ({ page }) => {
    const riskIndicators = page.locator('[class*="risk"], [class*="high-risk"]')
    await expect(riskIndicators.first()).toBeAttached()
  })

  test('should have link to full student list', async ({ page }) => {
    const studentsLink = page.locator('a, button').filter({ hasText: /view.*students|all.*students/i }).first()
    await expect(studentsLink).toBeAttached()
  })

  test('should show student demographics breakdown', async ({ page }) => {
    const demographics = page.getByText(/demographics|breakdown/i).first()
    await expect(demographics).toBeAttached()
  })
})

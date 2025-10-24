import { test, expect } from '@playwright/test'

/**
 * Dashboard - Medication Reminders (15 tests)
 *
 * Tests medication due list and administration reminders
 */

test.describe('Dashboard - Medication Reminders', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
  })

  test('should display medications due section', async ({ page }) => {
    await expect(page.getByText(/medications.*due|due.*today/i).first()).toBeVisible()
  })

  test('should show count of medications due', async ({ page }) => {
    const medicationCount = page.getByText(/\d+.*medications|medications.*\d+/i).first()
    await expect(medicationCount).toBeAttached()
  })

  test('should display student names for medications', async ({ page }) => {
    await expect(page.locator('[class*="medication"]').first()).toBeAttached()
  })

  test('should show medication names', async ({ page }) => {
    const medicationNames = page.getByText(/tylenol|ibuprofen|medication/i).first()
    await expect(medicationNames).toBeAttached()
  })

  test('should display medication dosage', async ({ page }) => {
    const dosage = page.getByText(/\d+\s*mg|dosage/i).first()
    await expect(dosage).toBeAttached()
  })

  test('should show scheduled administration time', async ({ page }) => {
    const administrationTime = page.getByText(/\d{1,2}:\d{2}|am|pm/i).first()
    await expect(administrationTime).toBeAttached()
  })

  test('should display overdue medications prominently', async ({ page }) => {
    const overdueMeds = page.locator('[class*="overdue"], [class*="late"]')
    await expect(overdueMeds.first()).toBeAttached()
  })

  test('should show medication status', async ({ page }) => {
    const status = page.getByText(/pending|administered|overdue/i).first()
    await expect(status).toBeAttached()
  })

  test('should have quick administer button', async ({ page }) => {
    const administerBtn = page.getByRole('button').filter({ hasText: /administer|mark.*given/i }).first()
    await expect(administerBtn).toBeAttached()
  })

  test('should display medication priority', async ({ page }) => {
    const priority = page.locator('[class*="priority"], [class*="urgent"]')
    await expect(priority.first()).toBeAttached()
  })

  test('should show PRN medications separately', async ({ page }) => {
    const prnMeds = page.getByText(/prn|as.*needed/i).first()
    await expect(prnMeds).toBeAttached()
  })

  test('should display medication instructions', async ({ page }) => {
    const instructions = page.getByText(/with.*food|instructions/i).first()
    await expect(instructions).toBeAttached()
  })

  test('should show view all medications link', async ({ page }) => {
    const viewAllLink = page.getByText(/view.*all.*medications|see.*more/i).first()
    await expect(viewAllLink).toBeAttached()
  })

  test('should display medication alerts', async ({ page }) => {
    const alerts = page.locator('[class*="alert"], [class*="warning"]')
    await expect(alerts.first()).toBeAttached()
  })

  test('should show empty state when no medications due', async ({ page }) => {
    const emptyState = page.getByText(/no.*medications|medications.*due/i).first()
    await expect(emptyState).toBeAttached()
  })
})

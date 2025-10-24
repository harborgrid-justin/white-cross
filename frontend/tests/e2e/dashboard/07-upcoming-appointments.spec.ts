import { test, expect } from '@playwright/test'

/**
 * Dashboard - Upcoming Appointments (15 tests)
 *
 * Tests upcoming appointments widget and scheduling preview
 */

test.describe('Dashboard - Upcoming Appointments', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
  })

  test('should display upcoming appointments section', async ({ page }) => {
    await expect(page.getByText(/upcoming.*appointments|today.*schedule/i).first()).toBeVisible()
  })

  test('should show appointments for today', async ({ page }) => {
    const todayAppointments = page.getByText(/today|scheduled/i).first()
    await expect(todayAppointments).toBeAttached()
  })

  test('should display appointment times', async ({ page }) => {
    const appointmentTime = page.getByText(/\d{1,2}:\d{2}|am|pm/i).first()
    await expect(appointmentTime).toBeAttached()
  })

  test('should show student names for appointments', async ({ page }) => {
    await expect(page.locator('[class*="appointment"]').first()).toBeAttached()
  })

  test('should display appointment types', async ({ page }) => {
    const appointmentTypes = page.getByText(/checkup|screening|follow-up/i).first()
    await expect(appointmentTypes).toBeAttached()
  })

  test('should show appointment status', async ({ page }) => {
    const status = page.locator('[class*="status"], [class*="badge"]')
    await expect(status.first()).toBeAttached()
  })

  test('should limit to next 5-10 appointments', async ({ page }) => {
    const appointments = page.locator('[class*="appointment"]')
    const count = await appointments.count()
    expect(count).toBeLessThanOrEqual(10)
  })

  test('should have clickable appointment items', async ({ page }) => {
    const firstAppointment = page.locator('[class*="appointment"]').first()
    await firstAppointment.click()
  })

  test('should display appointment duration', async ({ page }) => {
    const duration = page.getByText(/\d+\s*min|minutes|hour/i).first()
    await expect(duration).toBeAttached()
  })

  test('should show appointment location or room', async ({ page }) => {
    const location = page.getByText(/room|office|clinic/i).first()
    await expect(location).toBeAttached()
  })

  test('should display view all appointments link', async ({ page }) => {
    const viewAllLink = page.getByText(/view.*all|see.*more.*appointments/i).first()
    await expect(viewAllLink).toBeAttached()
  })

  test('should show empty state when no appointments', async ({ page }) => {
    const emptyState = page.getByText(/no.*appointments|appointments.*scheduled/i).first()
    await expect(emptyState).toBeAttached()
  })

  test('should display appointment priority indicators', async ({ page }) => {
    const priority = page.locator('[class*="priority"], [class*="urgent"]')
    await expect(priority.first()).toBeAttached()
  })

  test('should show appointment confirmation status', async ({ page }) => {
    const confirmationStatus = page.getByText(/confirmed|pending|unconfirmed/i).first()
    await expect(confirmationStatus).toBeAttached()
  })

  test('should allow quick actions on appointments', async ({ page }) => {
    const quickActions = page.locator('[class*="appointment"] button')
    await expect(quickActions.first()).toBeAttached()
  })
})

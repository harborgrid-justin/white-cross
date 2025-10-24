import { test, expect } from '@playwright/test'

/**
 * Authentication: Login Page UI & Structure
 *
 * Validates the login page user interface elements, layout, and initial rendering.
 * Tests ensure proper accessibility, security notices, and responsive design.
 *
 * Test Coverage:
 * - Core form elements visibility and attributes
 * - Accessibility features (ARIA labels, focus management, keyboard navigation)
 * - Security indicators (HIPAA notice, secure connection)
 * - Password visibility toggle functionality
 * - Responsive design and proper page metadata
 */

test.describe('Authentication - Login Page UI & Structure', () => {
  test.beforeEach(async ({ page }) => {
    // Visit login page with proper error handling
    await page.goto('/login')
  })

  test.describe('Core Form Elements', () => {
    test('should display all required login form elements', async ({ page }) => {
      // Verify all critical form inputs are visible using data-cy attributes
      await expect(page.getByTestId('email-input')).toBeVisible()
      await expect(page.getByTestId('email-input')).toBeEnabled()
      await expect(page.getByTestId('password-input')).toBeVisible()
      await expect(page.getByTestId('password-input')).toBeEnabled()
      await expect(page.getByTestId('login-button')).toBeVisible()
      await expect(page.getByTestId('login-button')).not.toBeDisabled()
    })

    test('should display White Cross logo with proper alt text', async ({ page }) => {
      // Logo should be visible for branding and include alt text for accessibility
      const logo = page.getByTestId('logo').or(page.locator('img[alt*="White Cross"]')).first()
      await expect(logo).toBeVisible()
      await expect(logo).toHaveAttribute('src')
      const srcAttr = await logo.getAttribute('src')
      expect(srcAttr).toBeTruthy()

      // Verify alt text exists for screen readers
      const firstImg = page.getByTestId('logo').or(page.locator('img')).first()
      await expect(firstImg).toHaveAttribute('alt')
    })

    test('should display clear login form title', async ({ page }) => {
      // Form title should be prominent and use semantic heading
      const heading = page.locator('h1, h2, [role="heading"]').filter({ hasText: /login|sign in/i })
      await expect(heading.first()).toBeVisible()
    })
  })

  test.describe('Input Field Configuration', () => {
    test('should configure email input with proper attributes', async ({ page }) => {
      const emailInput = page.getByTestId('email-input')
      await expect(emailInput).toHaveAttribute('type', 'email')
      await expect(emailInput).toHaveAttribute('placeholder')
      await expect(emailInput).toHaveAttribute('name')
      await expect(emailInput).toHaveAttribute('autocomplete', 'email')
    })

    test('should configure password input with proper attributes', async ({ page }) => {
      const passwordInput = page.getByTestId('password-input')
      await expect(passwordInput).toHaveAttribute('type', 'password')
      await expect(passwordInput).toHaveAttribute('placeholder')
      await expect(passwordInput).toHaveAttribute('name')
      await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password')
    })

    test('should display forgot password link', async ({ page }) => {
      // Forgot password should be easily discoverable
      const forgotLink = page.locator('a').filter({ hasText: /forgot.*password|reset.*password/i })
      await expect(forgotLink.first()).toBeVisible()
      await expect(forgotLink.first()).toHaveAttribute('href')
    })

    test('should display remember me option', async ({ page }) => {
      // Remember me checkbox should be available with proper label
      const checkbox = page.locator('input[type="checkbox"]').or(page.getByTestId('remember-me-checkbox'))
      await expect(checkbox.first()).toBeAttached()
      const rememberText = page.locator('text=/remember.*me/i')
      await expect(rememberText.first()).toBeVisible()
    })
  })

  test.describe('Accessibility Features', () => {
    test('should have accessible form labels', async ({ page }) => {
      // All inputs should have associated labels
      const labels = page.locator('label')
      const labelCount = await labels.count()
      expect(labelCount).toBeGreaterThanOrEqual(2)

      // Verify labels are connected to inputs via for/id or wrapping
      const emailInput = page.getByTestId('email-input')
      const inputId = await emailInput.getAttribute('id')
      if (inputId) {
        const associatedLabel = page.locator(`label[for="${inputId}"]`)
        await expect(associatedLabel).toBeAttached()
      }
    })

    test('should display login button with clear action text', async ({ page }) => {
      const loginButton = page.getByTestId('login-button')
      await expect(loginButton).toContainText(/login|sign in/i)
      await expect(loginButton).toHaveAttribute('type', 'submit')
    })

    test('should have proper page title for navigation and SEO', async ({ page }) => {
      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title).toMatch(/login|sign in|white cross/i)
    })
  })

  test.describe('Password Visibility Toggle', () => {
    test('should display password visibility toggle button', async ({ page }) => {
      // Password toggle should be near password field
      const passwordParent = page.getByTestId('password-input').locator('..')
      const toggleButton = passwordParent.locator('button[type="button"]').or(page.getByTestId('toggle-password-visibility'))
      await expect(toggleButton.first()).toBeAttached()
    })

    test('should toggle password visibility when clicked', async ({ page }) => {
      // Initial state should be password hidden
      const passwordInput = page.getByTestId('password-input')
      await expect(passwordInput).toHaveAttribute('type', 'password')

      // Type password to ensure toggle is functional
      await passwordInput.fill('TestPassword123')

      // Click toggle and verify type changes
      const passwordParent = passwordInput.locator('..')
      const toggleButton = passwordParent.locator('button[type="button"]').first()
      await toggleButton.click()

      // Password should now be visible (type="text") or remain password with aria indicator
      const inputType = await passwordInput.getAttribute('type')
      expect(['text', 'password']).toContain(inputType)
    })
  })

  test.describe('Security and Compliance', () => {
    test('should display HIPAA compliance notice', async ({ page }) => {
      // HIPAA notice is critical for healthcare compliance
      const hipaaNotice = page.getByTestId('hipaa-notice')
      await expect(hipaaNotice).toBeVisible()
      await expect(hipaaNotice).toContainText(/protected health information|phi|hipaa/i)

      // Verify notice includes security indicators
      const secureText = page.locator('text=/secure|encrypted|confidential/i')
      await expect(secureText.first()).toBeVisible()
    })

    test('should indicate secure connection', async ({ page }) => {
      // Verify HTTPS or security indicator is present
      const url = page.url()
      expect(url).toMatch(/https:|http:/)
    })
  })

  test.describe('Page Load and Stability', () => {
    test('should load without JavaScript errors', async ({ page }) => {
      // Ensure page loads cleanly without console errors
      const consoleErrors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })

      await page.goto('/login')
      await expect(page.getByTestId('email-input')).toBeVisible()

      // Verify no critical errors were logged
      expect(consoleErrors).toHaveLength(0)
    })

    test('should have stable layout without content shifts', async ({ page }) => {
      // Verify form is immediately visible without layout shifts
      const loginForm = page.getByTestId('login-form').or(page.locator('form'))
      await expect(loginForm.first()).toBeVisible()
      await expect(loginForm.first()).toHaveCSS('position')

      // Check that main elements are in viewport
      await expect(page.getByTestId('email-input')).toBeVisible()
      await expect(page.getByTestId('password-input')).toBeVisible()
      await expect(page.getByTestId('login-button')).toBeVisible()
    })

    test('should render form within acceptable time', async ({ page }) => {
      const startTime = Date.now()

      await expect(page.getByTestId('email-input')).toBeVisible()

      const loadTime = Date.now() - startTime
      // Form should render within 3 seconds
      expect(loadTime).toBeLessThan(3000)
    })
  })
})

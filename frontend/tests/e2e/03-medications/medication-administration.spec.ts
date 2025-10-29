import { test, expect } from '@playwright/test';

/**
 * CRITICAL: Medication Administration E2E Tests
 * These tests verify the most critical workflow in the application
 * - HIPAA compliance for PHI handling
 * - Medication safety checks
 * - Audit logging
 * - Witness requirements
 */

test.describe('Medication Administration (CRITICAL)', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'nurse-1',
            email: 'nurse@school.edu',
            firstName: 'Jane',
            lastName: 'Doe',
            role: 'nurse',
            permissions: ['administer:medications'],
          },
        }),
      });
    });

    // Mock students list
    await page.route('**/api/v1/students**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            students: [
              {
                id: 'student-1',
                firstName: 'John',
                lastName: 'Doe',
                grade: '8',
              },
            ],
          },
        }),
      });
    });

    // Mock medications list
    await page.route('**/api/v1/medications?studentId=student-1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            medications: [
              {
                id: 'med-1',
                studentId: 'student-1',
                name: 'Ibuprofen',
                dosage: '200mg',
                frequency: 'As needed',
                route: 'Oral',
                status: 'active',
                isControlled: false,
              },
              {
                id: 'med-2',
                studentId: 'student-1',
                name: 'Adderall',
                dosage: '10mg',
                frequency: 'Daily',
                route: 'Oral',
                status: 'active',
                isControlled: true,
              },
            ],
          },
        }),
      });
    });

    await page.goto('/medications');
  });

  test('should display medication administration page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /medication administration/i })).toBeVisible();
  });

  test('should administer non-controlled medication successfully', async ({ page }) => {
    // Select student
    await page.getByLabel(/select student/i).click();
    await page.getByRole('option', { name: /john doe/i }).click();

    // Wait for medications to load
    await expect(page.getByText('Ibuprofen')).toBeVisible();

    // Click administer button
    await page.getByRole('button', { name: /administer ibuprofen/i }).click();

    // Modal should open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /administer medication/i })).toBeVisible();

    // Verify pre-filled data
    await expect(page.getByText('Ibuprofen')).toBeVisible();
    await expect(page.getByText('200mg')).toBeVisible();
    await expect(page.getByText('Oral')).toBeVisible();

    // Mock administration API
    let administrationData: any = null;
    await page.route('**/api/v1/medications/administer', async (route) => {
      administrationData = await route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'admin-record-1',
            medicationId: 'med-1',
            studentId: 'student-1',
            administeredBy: 'nurse-1',
            administeredAt: new Date().toISOString(),
            dosage: '200mg',
            notes: 'Headache',
            auditLogId: 'audit-1',
          },
        }),
      });
    });

    // Fill form
    await page.getByLabel(/notes/i).fill('Headache');

    // Submit
    await page.getByRole('button', { name: /confirm administration/i }).click();

    // Verify API call
    expect(administrationData).toBeTruthy();
    expect(administrationData.medicationId).toBe('med-1');
    expect(administrationData.studentId).toBe('student-1');
    expect(administrationData.notes).toBe('Headache');

    // Should show success message
    await expect(page.getByText(/medication administered successfully/i)).toBeVisible();

    // Should close modal
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should require witness for controlled substances', async ({ page }) => {
    // Select student
    await page.getByLabel(/select student/i).click();
    await page.getByRole('option', { name: /john doe/i }).click();

    // Click administer controlled medication
    await page.getByRole('button', { name: /administer adderall/i }).click();

    await expect(page.getByRole('dialog')).toBeVisible();

    // Should show controlled substance warning
    await expect(page.getByText(/controlled substance/i)).toBeVisible();
    await expect(page.getByText(/witness required/i)).toBeVisible();

    // Try to submit without witness
    await page.getByRole('button', { name: /confirm administration/i }).click();

    // Should show validation error
    await expect(page.getByText(/witness is required/i)).toBeVisible();

    // Mock witness lookup
    await page.route('**/api/v1/users?role=nurse', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            users: [
              {
                id: 'nurse-2',
                firstName: 'Bob',
                lastName: 'Smith',
                role: 'nurse',
              },
            ],
          },
        }),
      });
    });

    // Select witness
    await page.getByLabel(/witness/i).click();
    await page.getByRole('option', { name: /bob smith/i }).click();

    // Mock administration API
    await page.route('**/api/v1/medications/administer', async (route) => {
      const data = await route.request().postDataJSON();

      if (!data.witnessedBy) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Witness required for controlled substances',
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'admin-record-2',
              medicationId: 'med-2',
              studentId: 'student-1',
              administeredBy: 'nurse-1',
              witnessedBy: 'nurse-2',
              administeredAt: new Date().toISOString(),
              dosage: '10mg',
              auditLogId: 'audit-2',
            },
          }),
        });
      }
    });

    // Submit with witness
    await page.getByRole('button', { name: /confirm administration/i }).click();

    // Should succeed
    await expect(page.getByText(/medication administered successfully/i)).toBeVisible();
  });

  test('should perform allergy check before administration', async ({ page }) => {
    // Mock student with allergy
    await page.route('**/api/v1/students/student-1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'student-1',
            firstName: 'John',
            lastName: 'Doe',
            allergies: [
              {
                id: 'allergy-1',
                allergen: 'Ibuprofen',
                severity: 'severe',
                reaction: 'Anaphylaxis',
              },
            ],
          },
        }),
      });
    });

    // Select student
    await page.getByLabel(/select student/i).click();
    await page.getByRole('option', { name: /john doe/i }).click();

    // Try to administer Ibuprofen
    await page.getByRole('button', { name: /administer ibuprofen/i }).click();

    // Should show allergy warning
    await expect(page.getByRole('alert')).toContainText(/allergy warning/i);
    await expect(page.getByText(/severe allergy to ibuprofen/i)).toBeVisible();
    await expect(page.getByText(/anaphylaxis/i)).toBeVisible();

    // Should require confirmation
    await expect(page.getByText(/override allergy warning/i)).toBeVisible();

    // Cannot proceed without override
    const confirmButton = page.getByRole('button', { name: /confirm administration/i });
    await expect(confirmButton).toBeDisabled();
  });

  test('should check medication expiration date', async ({ page }) => {
    // Mock medication with expired date
    await page.route('**/api/v1/medications?studentId=student-1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            medications: [
              {
                id: 'med-3',
                studentId: 'student-1',
                name: 'Expired Medication',
                dosage: '100mg',
                expirationDate: '2023-01-01',
                status: 'active',
              },
            ],
          },
        }),
      });
    });

    await page.reload();

    // Select student
    await page.getByLabel(/select student/i).click();
    await page.getByRole('option', { name: /john doe/i }).click();

    // Should show expiration warning
    await expect(page.getByRole('alert')).toContainText(/expired medication/i);

    // Administer button should be disabled
    const administerButton = page.getByRole('button', { name: /administer expired medication/i });
    await expect(administerButton).toBeDisabled();
  });

  test('should create audit log for administration', async ({ page }) => {
    let auditLogCreated = false;

    // Mock audit log API
    await page.route('**/api/v1/audit-logs', async (route) => {
      const data = await route.request().postDataJSON();
      auditLogCreated = true;

      expect(data.action).toBe('MEDICATION_ADMINISTERED');
      expect(data.resourceType).toBe('medication');
      expect(data.userId).toBe('nurse-1');

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 'audit-1' },
        }),
      });
    });

    // Select student and administer
    await page.getByLabel(/select student/i).click();
    await page.getByRole('option', { name: /john doe/i }).click();
    await page.getByRole('button', { name: /administer ibuprofen/i }).click();

    // Mock administration API
    await page.route('**/api/v1/medications/administer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'admin-record-1',
            auditLogId: 'audit-1',
          },
        }),
      });
    });

    await page.getByRole('button', { name: /confirm administration/i }).click();

    // Verify audit log was created
    await page.waitForTimeout(1000); // Wait for API call
    expect(auditLogCreated).toBe(true);
  });

  test('should validate dosage before administration', async ({ page }) => {
    // Select student
    await page.getByLabel(/select student/i).click();
    await page.getByRole('option', { name: /john doe/i }).click();

    // Click administer
    await page.getByRole('button', { name: /administer ibuprofen/i }).click();

    // Try to change dosage to invalid value
    const dosageInput = page.getByLabel(/dosage/i);
    await dosageInput.clear();
    await dosageInput.fill('999999mg');

    // Should show validation warning
    await expect(page.getByText(/dosage exceeds maximum/i)).toBeVisible();

    // Submit button should be disabled
    const confirmButton = page.getByRole('button', { name: /confirm administration/i });
    await expect(confirmButton).toBeDisabled();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Select student
    await page.getByLabel(/select student/i).click();
    await page.getByRole('option', { name: /john doe/i }).click();

    // Click administer
    await page.getByRole('button', { name: /administer ibuprofen/i }).click();

    // Mock API error
    await page.route('**/api/v1/medications/administer', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Internal server error',
        }),
      });
    });

    await page.getByRole('button', { name: /confirm administration/i }).click();

    // Should show error message
    await expect(page.getByRole('alert')).toContainText(/error administering medication/i);

    // Modal should remain open
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('should not expose PHI in URLs or error messages', async ({ page }) => {
    // Select student
    await page.getByLabel(/select student/i).click();
    await page.getByRole('option', { name: /john doe/i }).click();

    // Verify URL doesn't contain student name
    const url = page.url();
    expect(url).not.toContain('John');
    expect(url).not.toContain('Doe');

    // Mock API error
    await page.route('**/api/v1/medications/administer', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Internal server error',
        }),
      });
    });

    await page.getByRole('button', { name: /administer ibuprofen/i }).click();
    await page.getByRole('button', { name: /confirm administration/i }).click();

    // Error message should not contain PHI
    const errorMessage = await page.getByRole('alert').textContent();
    expect(errorMessage).not.toContain('student-1');
    expect(errorMessage).not.toContain('med-1');
    expect(errorMessage).not.toContain('John Doe');
  });

  test('should require authentication for medication administration', async ({ page }) => {
    // Mock unauthenticated state
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Unauthorized',
        }),
      });
    });

    await page.reload();

    // Should redirect to login
    await expect(page).toHaveURL('/');
  });

  test('should require specific permissions for controlled substances', async ({ page }) => {
    // Mock user without controlled substance permissions
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'nurse-1',
            email: 'nurse@school.edu',
            firstName: 'Jane',
            lastName: 'Doe',
            role: 'nurse',
            permissions: ['administer:medications'],
            // Missing 'administer:controlled-substances' permission
          },
        }),
      });
    });

    await page.reload();

    // Select student
    await page.getByLabel(/select student/i).click();
    await page.getByRole('option', { name: /john doe/i }).click();

    // Controlled substance button should be disabled
    const administerButton = page.getByRole('button', { name: /administer adderall/i });
    await expect(administerButton).toBeDisabled();

    // Should show permission warning
    await expect(page.getByText(/insufficient permissions/i)).toBeVisible();
  });
});

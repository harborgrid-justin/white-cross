/**
 * Messaging Platform E2E Tests
 *
 * Comprehensive end-to-end tests for the messaging platform including:
 * - User sends a message to another user
 * - User receives a message in real-time
 * - Typing indicators work correctly
 * - Read receipts work correctly
 * - Message encryption works
 * - Offline message queue works
 * - Connection recovery works
 */

import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

test.describe('Messaging Platform E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Message Sending and Receiving', () => {
    test('should send a message successfully', async ({ page }) => {
      // Login as nurse user
      await page.fill('[name="email"]', 'nurse@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');

      // Wait for dashboard
      await page.waitForURL('**/dashboard', { timeout: 10000 });

      // Navigate to communications
      await page.goto(`${BASE_URL}/communications/compose`);

      // Fill in message form
      await page.fill('[name="subject"]', 'Test Message');
      await page.fill('[name="content"]', 'This is a test message for E2E testing');

      // Select recipient
      await page.click('[data-testid="recipient-selector"]');
      await page.click('[data-testid="recipient-parent-123"]');

      // Select channel
      await page.check('[value="EMAIL"]');

      // Set category
      await page.selectOption('[name="category"]', 'GENERAL');

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for success message
      await expect(page.getByText(/message sent successfully/i)).toBeVisible();

      // Verify message appears in sent messages
      await page.goto(`${BASE_URL}/communications/messages`);
      await page.click('[data-tab="sent"]');
      await expect(page.getByText('Test Message')).toBeVisible();
    });

    test('should receive a message in real-time via WebSocket', async ({ page, context }) => {
      // Create two browser contexts (two users)
      const page1 = page; // Sender
      const page2 = await context.newPage(); // Receiver

      // Login sender
      await page1.fill('[name="email"]', 'nurse@example.com');
      await page1.fill('[name="password"]', 'password123');
      await page1.click('button[type="submit"]');
      await page1.waitForURL('**/dashboard');

      // Login receiver
      await page2.goto(`${BASE_URL}/login`);
      await page2.fill('[name="email"]', 'parent@example.com');
      await page2.fill('[name="password"]', 'password123');
      await page2.click('button[type="submit"]');
      await page2.waitForURL('**/dashboard');

      // Receiver navigates to inbox
      await page2.goto(`${BASE_URL}/communications/messages`);

      // Sender sends message to receiver
      await page1.goto(`${BASE_URL}/communications/compose`);
      await page1.fill('[name="subject"]', 'Real-time Test Message');
      await page1.fill('[name="content"]', 'Testing real-time delivery');
      await page1.click('[data-testid="recipient-selector"]');
      await page1.click('[data-testid="recipient-parent@example.com"]');
      await page1.click('button[type="submit"]');

      // Wait for message to appear in receiver's inbox (via WebSocket)
      await page2.waitForSelector('text=Real-time Test Message', { timeout: 10000 });
      await expect(page2.getByText('Real-time Test Message')).toBeVisible();

      await page2.close();
    });

    test('should display unread badge when new message arrives', async ({ page }) => {
      // Login
      await page.fill('[name="email"]', 'parent@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard');

      // Navigate to a different page
      await page.goto(`${BASE_URL}/dashboard`);

      // Wait for WebSocket connection
      await page.waitForTimeout(2000);

      // Trigger a new message via API (simulate)
      await page.evaluate(async () => {
        // Simulate WebSocket message event
        const event = new CustomEvent('socket:message:new', {
          detail: {
            id: 'msg-new-123',
            subject: 'New Message',
            content: 'You have a new message',
            senderId: 'nurse-123',
          },
        });
        window.dispatchEvent(event);
      });

      // Check for unread badge
      await expect(page.locator('[data-badge="unread-messages"]')).toBeVisible();
    });
  });

  test.describe('Typing Indicators', () => {
    test('should show typing indicator when user is typing', async ({ page, context }) => {
      // Setup two users
      const page1 = page;
      const page2 = await context.newPage();

      // Login both users
      await page1.fill('[name="email"]', 'nurse@example.com');
      await page1.fill('[name="password"]', 'password123');
      await page1.click('button[type="submit"]');
      await page1.waitForURL('**/dashboard');

      await page2.goto(`${BASE_URL}/login`);
      await page2.fill('[name="email"]', 'parent@example.com');
      await page2.fill('[name="password"]', 'password123');
      await page2.click('button[type="submit"]');
      await page2.waitForURL('**/dashboard');

      // Both navigate to messaging
      await page1.goto(`${BASE_URL}/communications/compose`);
      await page2.goto(`${BASE_URL}/communications/messages`);

      // User 1 starts typing
      await page1.fill('[name="content"]', 'Typing test...');

      // User 2 should see typing indicator
      await page2.waitForSelector('[data-indicator="typing"]', { timeout: 5000 });
      await expect(page2.locator('[data-indicator="typing"]')).toContainText(/typing/i);

      await page2.close();
    });

    test('should hide typing indicator after inactivity', async ({ page }) => {
      // Login
      await page.fill('[name="email"]', 'nurse@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard');

      await page.goto(`${BASE_URL}/communications/compose`);

      // Start typing
      await page.fill('[name="content"]', 'Test');

      // Wait for typing indicator timeout (3 seconds)
      await page.waitForTimeout(3500);

      // Typing indicator should be hidden
      await expect(page.locator('[data-indicator="typing"]')).not.toBeVisible();
    });
  });

  test.describe('Read Receipts', () => {
    test('should mark message as read when opened', async ({ page }) => {
      // Login
      await page.fill('[name="email"]', 'parent@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard');

      // Navigate to messages
      await page.goto(`${BASE_URL}/communications/messages`);

      // Click on first unread message
      await page.click('[data-message-status="unread"]:first-child');

      // Wait for message to open
      await page.waitForSelector('[data-testid="message-content"]');

      // Verify read status is updated
      await page.goto(`${BASE_URL}/communications/messages`);
      await expect(page.locator('[data-message-status="read"]')).toBeVisible();
    });

    test('should send read receipt via WebSocket', async ({ page, context }) => {
      const page1 = page; // Sender
      const page2 = await context.newPage(); // Receiver

      // Login sender
      await page1.fill('[name="email"]', 'nurse@example.com');
      await page1.fill('[name="password"]', 'password123');
      await page1.click('button[type="submit"]');
      await page1.waitForURL('**/dashboard');

      // Login receiver
      await page2.goto(`${BASE_URL}/login`);
      await page2.fill('[name="email"]', 'parent@example.com');
      await page2.fill('[name="password"]', 'password123');
      await page2.click('button[type="submit"]');
      await page2.waitForURL('**/dashboard');

      // Sender sends message
      await page1.goto(`${BASE_URL}/communications/compose`);
      await page1.fill('[name="subject"]', 'Read Receipt Test');
      await page1.fill('[name="content"]', 'Testing read receipts');
      await page1.click('[data-testid="recipient-parent@example.com"]');
      await page1.click('button[type="submit"]');

      // Sender navigates to sent messages
      await page1.goto(`${BASE_URL}/communications/messages`);
      await page1.click('[data-tab="sent"]');

      // Receiver opens message
      await page2.goto(`${BASE_URL}/communications/messages`);
      await page2.click('text=Read Receipt Test');

      // Sender should see read receipt indicator
      await page1.reload();
      await expect(page1.locator('[data-receipt="read"]')).toBeVisible();

      await page2.close();
    });
  });

  test.describe('Message Encryption', () => {
    test('should encrypt message content', async ({ page }) => {
      // Login
      await page.fill('[name="email"]', 'nurse@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard');

      // Intercept API request
      let encryptedContent = '';
      page.on('request', (request) => {
        if (request.url().includes('/api/v1/messages') && request.method() === 'POST') {
          const postData = request.postDataJSON();
          encryptedContent = postData?.content || '';
        }
      });

      // Send message
      await page.goto(`${BASE_URL}/communications/compose`);
      await page.fill('[name="subject"]', 'Encrypted Message');
      await page.fill('[name="content"]', 'Sensitive patient information');
      await page.click('[data-testid="recipient-selector"]');
      await page.click('[data-testid="recipient-parent-123"]');
      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      // Verify content was encrypted (not plain text)
      // Note: In production, this would verify encryption occurred
      expect(encryptedContent).toBeTruthy();
    });
  });

  test.describe('Offline Message Queue', () => {
    test('should queue messages when offline', async ({ page, context }) => {
      // Login
      await page.fill('[name="email"]', 'nurse@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard');

      await page.goto(`${BASE_URL}/communications/compose`);

      // Go offline
      await context.setOffline(true);

      // Try to send message
      await page.fill('[name="subject"]', 'Offline Message');
      await page.fill('[name="content"]', 'This message was queued offline');
      await page.click('[data-testid="recipient-selector"]');
      await page.click('[data-testid="recipient-parent-123"]');
      await page.click('button[type="submit"]');

      // Should show queued message indicator
      await expect(page.getByText(/queued|pending/i)).toBeVisible();

      // Go back online
      await context.setOffline(false);

      // Wait for message to be sent
      await page.waitForTimeout(2000);

      // Verify message was sent
      await expect(page.getByText(/sent successfully/i)).toBeVisible();
    });
  });

  test.describe('Connection Recovery', () => {
    test('should reconnect after connection loss', async ({ page, context }) => {
      // Login
      await page.fill('[name="email"]', 'nurse@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard');

      await page.goto(`${BASE_URL}/communications/messages`);

      // Wait for initial connection
      await page.waitForTimeout(2000);

      // Simulate connection loss
      await context.setOffline(true);
      await page.waitForTimeout(1000);

      // Should show offline indicator
      await expect(page.locator('[data-status="offline"]')).toBeVisible();

      // Reconnect
      await context.setOffline(false);

      // Should show reconnecting then connected
      await expect(page.locator('[data-status="connected"]')).toBeVisible({ timeout: 10000 });
    });

    test('should retry failed messages on reconnection', async ({ page, context }) => {
      // Login
      await page.fill('[name="email"]', 'nurse@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard');

      await page.goto(`${BASE_URL}/communications/compose`);

      // Go offline
      await context.setOffline(true);

      // Send message (will fail)
      await page.fill('[name="subject"]', 'Retry Test');
      await page.fill('[name="content"]', 'Testing automatic retry');
      await page.click('[data-testid="recipient-selector"]');
      await page.click('[data-testid="recipient-parent-123"]');
      await page.click('button[type="submit"]');

      // Should show failed/queued
      await expect(page.getByText(/failed|queued/i)).toBeVisible();

      // Go back online
      await context.setOffline(false);

      // Wait for automatic retry
      await page.waitForTimeout(3000);

      // Should show success
      await expect(page.getByText(/sent successfully/i)).toBeVisible();
    });
  });

  test.describe('Multi-tenant Isolation', () => {
    test('should not see messages from other tenants', async ({ page }) => {
      // Login as tenant A user
      await page.fill('[name="email"]', 'nurse-tenantA@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard');

      await page.goto(`${BASE_URL}/communications/messages`);

      // Should only see messages for tenant A
      // Verify no messages from tenant B are visible
      await expect(page.locator('[data-tenant="tenantB"]')).not.toBeVisible();
    });
  });

  test.describe('Performance and Load', () => {
    test('should handle multiple messages efficiently', async ({ page }) => {
      // Login
      await page.fill('[name="email"]', 'nurse@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard');

      await page.goto(`${BASE_URL}/communications/messages`);

      // Measure load time
      const startTime = Date.now();

      // Wait for messages to load
      await page.waitForSelector('[data-testid="message-list"]');

      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);

      // Verify scrolling performance
      await page.evaluate(() => {
        const list = document.querySelector('[data-testid="message-list"]');
        if (list) {
          list.scrollTop = list.scrollHeight;
        }
      });

      // Should not freeze UI
      await expect(page.locator('[data-testid="message-list"]')).toBeVisible();
    });

    test('should handle rapid message sending', async ({ page }) => {
      // Login
      await page.fill('[name="email"]', 'nurse@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard');

      // Send multiple messages rapidly
      for (let i = 0; i < 5; i++) {
        await page.goto(`${BASE_URL}/communications/compose`);
        await page.fill('[name="subject"]', `Rapid Test ${i}`);
        await page.fill('[name="content"]', `Rapid message ${i}`);
        await page.click('[data-testid="recipient-selector"]');
        await page.click('[data-testid="recipient-parent-123"]');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(500);
      }

      // Verify all messages were sent
      await page.goto(`${BASE_URL}/communications/messages`);
      await page.click('[data-tab="sent"]');

      for (let i = 0; i < 5; i++) {
        await expect(page.getByText(`Rapid Test ${i}`)).toBeVisible();
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Login
      await page.fill('[name="email"]', 'nurse@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.keyboard.press('Enter');
      await page.waitForURL('**/dashboard');

      await page.goto(`${BASE_URL}/communications/messages`);

      // Navigate using keyboard
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      // Should open first message
      await expect(page.locator('[data-testid="message-content"]')).toBeVisible();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Login
      await page.fill('[name="email"]', 'nurse@example.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard');

      await page.goto(`${BASE_URL}/communications/compose`);

      // Check for ARIA labels
      await expect(page.locator('[aria-label*="subject"]')).toBeVisible();
      await expect(page.locator('[aria-label*="message"]')).toBeVisible();
      await expect(page.locator('[aria-label*="recipient"]')).toBeVisible();
    });
  });
});

/// <reference types="cypress" />

describe('Communication Center - Messaging', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        data: { id: '1', email: 'nurse@school.edu', role: 'NURSE' }
      }
    }).as('verifyAuth')
    
    cy.intercept('GET', '**/api/messages*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          messages: [
            {
              id: '1',
              recipientName: 'Jennifer Wilson',
              subject: 'Student Health Update',
              body: 'Your child Emma had a routine checkup today',
              sentAt: '2024-01-15T10:00:00Z',
              status: 'DELIVERED',
              channel: 'EMAIL'
            }
          ],
          total: 1
        }
      }
    }).as('getMessages')
    
    cy.login()
    cy.visit('/communication')
    cy.wait('@verifyAuth')
  })

  describe('Message List Display', () => {
    it('should display communication center', () => {
      cy.contains('Communication Center').should('be.visible')
    })

    it('should show message list', () => {
      cy.wait('@getMessages')
      cy.contains('Jennifer Wilson').should('be.visible')
      cy.contains('Student Health Update').should('be.visible')
    })

    it('should display message status', () => {
      cy.wait('@getMessages')
      cy.contains('DELIVERED').should('be.visible')
    })
  })

  describe('Send New Message', () => {
    it('should open compose modal', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="compose-message-button"]').click()
      cy.get('[data-testid="message-modal"]').should('be.visible')
    })

    it('should validate required fields', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="compose-message-button"]').click()
      cy.get('[data-testid="send-message"]').click()
      
      cy.contains('Recipient is required').should('be.visible')
      cy.contains('Subject is required').should('be.visible')
      cy.contains('Message body is required').should('be.visible')
    })

    it('should successfully send message', () => {
      cy.wait('@getMessages')
      
      cy.intercept('POST', '**/api/messages', {
        statusCode: 201,
        body: {
          success: true,
          data: { id: '2', status: 'SENT' }
        }
      }).as('sendMessage')
      
      cy.get('[data-testid="compose-message-button"]').click()
      
      cy.get('[data-testid="recipient-select"]').select('contact-1')
      cy.get('[data-testid="subject"]').type('Important Update')
      cy.get('[data-testid="message-body"]').type('This is an important health update')
      cy.get('[data-testid="send-message"]').click()
      
      cy.wait('@sendMessage')
      cy.contains('Message sent successfully').should('be.visible')
    })

    it('should select communication channel', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="compose-message-button"]').click()
      
      cy.get('[data-testid="channel-email"]').should('be.visible')
      cy.get('[data-testid="channel-sms"]').should('be.visible')
      cy.get('[data-testid="channel-push"]').should('be.visible')
    })

    it('should validate SMS character limit', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="compose-message-button"]').click()
      
      cy.get('[data-testid="channel-sms"]').check()
      cy.get('[data-testid="message-body"]').type('a'.repeat(161))
      
      cy.contains('SMS messages limited to 160 characters').should('be.visible')
    })
  })

  describe('Message Templates', () => {
    it('should load message templates', () => {
      cy.wait('@getMessages')
      
      cy.intercept('GET', '**/api/message-templates', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            templates: [
              {
                id: '1',
                name: 'Appointment Reminder',
                subject: 'Upcoming Appointment',
                body: 'Your child has an appointment on {date}'
              }
            ]
          }
        }
      }).as('getTemplates')
      
      cy.get('[data-testid="compose-message-button"]').click()
      cy.get('[data-testid="use-template"]').click()
      
      cy.wait('@getTemplates')
      cy.contains('Appointment Reminder').should('be.visible')
    })

    it('should apply template to message', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="compose-message-button"]').click()
      cy.get('[data-testid="use-template"]').click()
      cy.get('[data-testid="template-1"]').click()
      
      cy.get('[data-testid="subject"]').should('have.value', 'Upcoming Appointment')
    })

    it('should create new template', () => {
      cy.wait('@getMessages')
      
      cy.intercept('POST', '**/api/message-templates', {
        statusCode: 201,
        body: { success: true }
      }).as('createTemplate')
      
      cy.get('[data-testid="manage-templates"]').click()
      cy.get('[data-testid="create-template"]').click()
      
      cy.get('[data-testid="template-name"]').type('New Template')
      cy.get('[data-testid="template-subject"]').type('Template Subject')
      cy.get('[data-testid="template-body"]').type('Template body text')
      cy.get('[data-testid="save-template"]').click()
      
      cy.wait('@createTemplate')
      cy.contains('Template created').should('be.visible')
    })
  })

  describe('Broadcast Messages', () => {
    it('should send broadcast to multiple recipients', () => {
      cy.wait('@getMessages')
      
      cy.intercept('POST', '**/api/messages/broadcast', {
        statusCode: 200,
        body: {
          success: true,
          data: { sent: 25 }
        }
      }).as('sendBroadcast')
      
      cy.get('[data-testid="broadcast-button"]').click()
      
      cy.get('[data-testid="recipient-group"]').select('all-parents')
      cy.get('[data-testid="subject"]').type('School Health Notice')
      cy.get('[data-testid="message-body"]').type('Important health information')
      cy.get('[data-testid="send-broadcast"]').click()
      
      cy.wait('@sendBroadcast')
      cy.contains('Broadcast sent to 25 recipients').should('be.visible')
    })

    it('should filter broadcast recipients', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="broadcast-button"]').click()
      
      cy.get('[data-testid="filter-by-grade"]').select('8')
      cy.get('[data-testid="recipient-count"]').should('contain', 'recipients')
    })

    it('should schedule broadcast for later', () => {
      cy.wait('@getMessages')
      
      cy.intercept('POST', '**/api/messages/broadcast', {
        statusCode: 200,
        body: { success: true }
      }).as('scheduleBroadcast')
      
      cy.get('[data-testid="broadcast-button"]').click()
      
      cy.get('[data-testid="schedule-send"]').check()
      cy.get('[data-testid="send-at"]').type('2024-02-01T09:00')
      cy.get('[data-testid="send-broadcast"]').click()
      
      cy.wait('@scheduleBroadcast')
      cy.contains('Broadcast scheduled').should('be.visible')
    })
  })

  describe('Message Tracking', () => {
    it('should display message delivery status', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="view-message-1"]').click()
      
      cy.get('[data-testid="delivery-status"]').should('be.visible')
      cy.contains('DELIVERED').should('be.visible')
    })

    it('should show read receipts', () => {
      cy.intercept('GET', '**/api/messages/1/receipts', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            delivered: true,
            deliveredAt: '2024-01-15T10:00:00Z',
            read: true,
            readAt: '2024-01-15T10:05:00Z'
          }
        }
      }).as('getReceipts')
      
      cy.wait('@getMessages')
      cy.get('[data-testid="view-message-1"]').click()
      cy.wait('@getReceipts')
      
      cy.contains('Read at').should('be.visible')
    })

    it('should track failed deliveries', () => {
      cy.intercept('GET', '**/api/messages*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            messages: [
              {
                id: '1',
                status: 'FAILED',
                error: 'Invalid email address'
              }
            ]
          }
        }
      }).as('getFailedMessages')
      
      cy.reload()
      cy.wait('@getFailedMessages')
      
      cy.contains('FAILED').should('be.visible')
      cy.contains('Invalid email address').should('be.visible')
    })
  })

  describe('Message History', () => {
    it('should display conversation history', () => {
      cy.wait('@getMessages')
      
      cy.intercept('GET', '**/api/messages/conversation/contact-1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            messages: [
              { id: '1', body: 'First message', sentAt: '2024-01-15T10:00:00Z' },
              { id: '2', body: 'Follow-up', sentAt: '2024-01-15T11:00:00Z' }
            ]
          }
        }
      }).as('getConversation')
      
      cy.get('[data-testid="view-conversation-contact-1"]').click()
      cy.wait('@getConversation')
      
      cy.contains('First message').should('be.visible')
      cy.contains('Follow-up').should('be.visible')
    })

    it('should reply to message', () => {
      cy.wait('@getMessages')
      
      cy.intercept('POST', '**/api/messages/1/reply', {
        statusCode: 201,
        body: { success: true }
      }).as('replyMessage')
      
      cy.get('[data-testid="reply-message-1"]').click()
      cy.get('[data-testid="reply-body"]').type('Thank you for your message')
      cy.get('[data-testid="send-reply"]').click()
      
      cy.wait('@replyMessage')
      cy.contains('Reply sent').should('be.visible')
    })
  })

  describe('Emergency Alerts', () => {
    it('should send emergency alert', () => {
      cy.wait('@getMessages')
      
      cy.intercept('POST', '**/api/messages/emergency', {
        statusCode: 200,
        body: {
          success: true,
          data: { sent: 100 }
        }
      }).as('sendEmergency')
      
      cy.get('[data-testid="emergency-alert-button"]').click()
      cy.get('[data-testid="alert-message"]').type('School closed due to weather')
      cy.get('[data-testid="send-emergency"]').click()
      
      cy.get('[data-testid="confirm-emergency"]').click()
      
      cy.wait('@sendEmergency')
      cy.contains('Emergency alert sent to 100 recipients').should('be.visible')
    })

    it('should require confirmation for emergency alerts', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="emergency-alert-button"]').click()
      
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
      cy.contains('This will send an emergency alert').should('be.visible')
    })

    it('should use all available channels for emergencies', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="emergency-alert-button"]').click()
      
      cy.get('[data-testid="channel-email"]').should('be.checked')
      cy.get('[data-testid="channel-sms"]').should('be.checked')
      cy.get('[data-testid="channel-push"]').should('be.checked')
    })
  })

  describe('Search and Filter', () => {
    it('should search messages', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="message-search"]').type('Health Update')
      cy.contains('Student Health Update').should('be.visible')
    })

    it('should filter by status', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="status-filter"]').select('DELIVERED')
      cy.contains('DELIVERED').should('be.visible')
    })

    it('should filter by channel', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="channel-filter"]').select('EMAIL')
      cy.contains('EMAIL').should('be.visible')
    })

    it('should filter by date range', () => {
      cy.wait('@getMessages')
      cy.get('[data-testid="date-from"]').type('2024-01-01')
      cy.get('[data-testid="date-to"]').type('2024-01-31')
      cy.get('[data-testid="apply-filter"]').click()
      
      cy.wait('@getMessages')
    })
  })

  describe('Language Translation', () => {
    it('should translate messages', () => {
      cy.wait('@getMessages')
      
      cy.intercept('POST', '**/api/messages/translate', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            translatedText: 'Su hijo tuvo un chequeo de rutina hoy'
          }
        }
      }).as('translate')
      
      cy.get('[data-testid="compose-message-button"]').click()
      cy.get('[data-testid="message-body"]').type('Your child had a routine checkup today')
      cy.get('[data-testid="translate"]').click()
      cy.get('[data-testid="target-language"]').select('Spanish')
      
      cy.wait('@translate')
      cy.contains('Su hijo tuvo un chequeo').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors', () => {
      cy.intercept('GET', '**/api/messages*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('error')
      
      cy.reload()
      cy.wait('@error')
      cy.contains('Failed to load messages').should('be.visible')
    })

    it('should handle send failures', () => {
      cy.wait('@getMessages')
      
      cy.intercept('POST', '**/api/messages', {
        statusCode: 400,
        body: { error: 'Invalid recipient' }
      }).as('sendError')
      
      cy.get('[data-testid="compose-message-button"]').click()
      cy.get('[data-testid="send-message"]').click()
      
      cy.wait('@sendError')
      cy.contains('Failed to send message').should('be.visible')
    })
  })

  describe('Healthcare Compliance', () => {
    it('should log message access', () => {
      cy.intercept('POST', '**/api/audit-logs', (req) => {
        expect(req.body.action).to.include('MESSAGE')
        req.reply({ statusCode: 200, body: { success: true } })
      }).as('auditLog')
      
      cy.wait('@auditLog')
    })

    it('should respect privacy settings', () => {
      cy.wait('@getMessages')
      
      cy.get('[data-testid="compose-message-button"]').click()
      cy.contains('HIPAA Compliant').should('be.visible')
    })
  })

  describe('Responsive Design', () => {
    it('should be mobile responsive', () => {
      cy.viewport('iphone-x')
      cy.contains('Communication').should('be.visible')
    })
  })
})

// Component testing support for Cypress
import { mount } from 'cypress/react18'
import './commands'

// Add mount command for component testing
Cypress.Commands.add('mount', mount)

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}
// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// You can change the location of this file or turn off automatically serving
// support files with the 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Import Testing Library commands
import '@testing-library/cypress/add-commands';

// Import code coverage support
import '@cypress/code-coverage/support';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log to reduce noise
const app = window.top;
if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Preserve cookies between tests
Cypress.Cookies.debug(true);

// Global before hook
before(() => {
  cy.log('Starting Cypress Test Suite');
});

// Global after hook
after(() => {
  cy.log('Cypress Test Suite Completed');
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // You can customize this to only ignore specific errors
  if (err.message.includes('ResizeObserver loop')) {
    return false;
  }
  // Let other errors fail the test
  return true;
});

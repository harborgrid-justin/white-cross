# Cypress Test Quick Reference

## Quick Start

### Run All Tests
```bash
cd frontend
npm run test:e2e
```

### Run Specific Module
```bash
# Health Records
npm run test:e2e -- --spec "cypress/e2e/05-health-records-management/**/*.cy.ts"

# Medications
npm run test:e2e -- --spec "cypress/e2e/04-medication-management/**/*.cy.ts"

# Authentication
npm run test:e2e -- --spec "cypress/e2e/01-authentication/**/*.cy.ts"
```

### Run Single Test File
```bash
npm run test:e2e -- --spec "cypress/e2e/05-health-records-management/04-allergies-tab.cy.ts"
```

---

## Common Test ID Patterns

### Containers
- `{module}-page` - Main page container
- `{section}-content` - Tab/section content
- `{item}-list` - List container
- `{item}-table` - Table container

### Buttons
- `add-{item}-button` - Add/create buttons
- `edit-{item}-button` - Edit buttons
- `delete-{item}-button` - Delete buttons
- `save-{item}-button` - Save buttons
- `cancel-button` - Cancel buttons

### Data Display
- `{field}-name` - Name fields
- `{field}-badge` - Status badges
- `{field}-indicator` - Visual indicators
- `{item}-row` - Table/list rows
- `{item}-card` - Card components

### Forms
- `{field}-input` - Text inputs
- `{field}-select` - Dropdowns
- `{field}-checkbox` - Checkboxes
- `{field}-error` - Error messages

### States
- `loading-spinner` - Loading indicators
- `loading-text` - Loading messages
- `no-{items}-message` - Empty states
- `{item}-modal` - Modal dialogs

---

## Component Test IDs by Module

### Health Records

#### Main Page
```typescript
'health-records-page'
'student-selector'
'privacy-notice'
'hipaa-compliance-badge'
'new-record-button'
'export-button'
```

#### Allergies Tab
```typescript
'allergies-content'
'add-allergy-button'
'allergies-list'
'allergy-item'
'allergen-name'
'severity-badge'
'verification-status'
'edit-allergy-button'
```

#### Chronic Conditions Tab
```typescript
'chronic-conditions-content'
'add-condition-button'
'conditions-list'
'condition-item'
'condition-name'
'status-badge'
'view-care-plan'
```

#### Vaccinations Tab
```typescript
'vaccinations-content'
'record-vaccination-button'
'vaccinations-table'
'vaccination-row'
'vaccine-name'
'compliance-badge'
'priority-badge'
```

### Medications

#### Main Page
```typescript
'medications-title'
'overview-tab'
'medications-tab'
'inventory-tab'
'reminders-tab'
'add-medication-button'
```

#### Medications List
```typescript
'medications-search'
'medications-table'
'medication-row'
'medication-name'
'dosage-form'
'stock-level'
'administer-button'
```

#### Inventory
```typescript
'inventory-table'
'inventory-row'
'stock-level'
'expiration-date'
'update-stock-button'
```

#### Reminders
```typescript
'todays-schedule'
'reminders-list'
'reminder-card'
'student-name'
'medication-info'
'scheduled-time'
'reminder-status'
```

---

## Custom Cypress Commands

### Authentication
```javascript
cy.login('nurse')        // Login as nurse
cy.login('admin')        // Login as admin
cy.login('counselor')    // Login as counselor
cy.login('viewer')       // Login as viewer
```

### Element Selection
```javascript
cy.getByTestId('element-id')  // Get element by data-testid
```

### API Interception
```javascript
cy.setupHealthRecordsIntercepts()  // Setup health records API mocks
cy.waitForHealthcareData()         // Wait for data to load
```

---

## Test Structure Template

```javascript
describe('Feature Name - Specific Test Suite', () => {
  beforeEach(() => {
    // Setup API intercepts
    cy.intercept('GET', '**/api/endpoint', {
      statusCode: 200,
      body: []
    }).as('getEndpoint')

    // Login
    cy.login('nurse')

    // Navigate
    cy.visit('/page-path')

    // Wait for page load
    cy.get('[data-testid="page-id"]', { timeout: 10000 }).should('exist')
  })

  it('should display the main element', () => {
    cy.get('[data-testid="element-id"]').should('be.visible')
  })

  it('should handle user interaction', () => {
    cy.get('[data-testid="button-id"]').click()
    cy.wait(500)
    cy.get('[data-testid="result-id"]').should('be.visible')
  })
})
```

---

## Debugging Failed Tests

### 1. Check Element Exists
```javascript
cy.get('[data-testid="element-id"]').should('exist')  // Element in DOM
cy.get('[data-testid="element-id"]').should('be.visible')  // Element visible
```

### 2. Wait for Elements
```javascript
cy.get('[data-testid="element-id"]', { timeout: 10000 })  // Wait up to 10s
cy.wait(500)  // Fixed wait (use sparingly)
```

### 3. Scroll Into View
```javascript
cy.get('[data-testid="element-id"]').scrollIntoView().click()
```

### 4. Force Actions
```javascript
cy.get('[data-testid="element-id"]').click({ force: true })
cy.get('[data-testid="input-id"]').type('text', { force: true })
```

### 5. Check API Responses
```javascript
cy.wait('@getEndpoint').then((interception) => {
  expect(interception.response.statusCode).to.equal(200)
})
```

---

## Common Issues & Solutions

### Issue: Element Not Found
**Solution:**
- Verify data-testid is correctly added to component
- Check if element is conditionally rendered
- Add appropriate wait or timeout

### Issue: Element Not Visible
**Solution:**
- Use `.scrollIntoView()` before interaction
- Check if element is hidden by CSS
- Verify viewport size matches test requirements

### Issue: Timing Issues
**Solution:**
- Use `cy.wait('@apiCall')` instead of fixed waits
- Increase timeout: `{ timeout: 10000 }`
- Add explicit wait for element state change

### Issue: API Mock Not Working
**Solution:**
- Verify API endpoint URL matches exactly
- Check intercept is set up before navigation
- Use `.as('aliasName')` and `cy.wait('@aliasName')`

---

## Best Practices

### 1. Use Data-TestId
✅ **Good:** `cy.get('[data-testid="add-button"]')`
❌ **Bad:** `cy.get('.btn-primary').eq(2)`

### 2. Avoid Brittle Selectors
✅ **Good:** `cy.getByTestId('student-name')`
❌ **Bad:** `cy.get('div > div > span.text-bold')`

### 3. Wait for API, Not Time
✅ **Good:** `cy.wait('@getStudents')`
❌ **Bad:** `cy.wait(3000)`

### 4. Test User Flows
✅ **Good:** Login → Navigate → Interact → Verify Result
❌ **Bad:** Direct URL → Check element exists

### 5. Clear Test Names
✅ **Good:** `'should display allergy when student is selected'`
❌ **Bad:** `'test 1'`

---

## Useful Assertions

```javascript
// Existence
.should('exist')
.should('not.exist')

// Visibility
.should('be.visible')
.should('not.be.visible')

// Content
.should('contain', 'text')
.should('have.text', 'exact text')

// Attributes
.should('have.class', 'active')
.should('have.attr', 'data-testid', 'value')

// Count
.should('have.length', 5)
.should('have.length.at.least', 1)

// State
.should('be.disabled')
.should('be.checked')
.should('have.value', 'input value')
```

---

## Role-Based Testing

```javascript
// Test as different roles
const roles = ['admin', 'nurse', 'counselor', 'viewer']

roles.forEach(role => {
  it(`should show appropriate features for ${role}`, () => {
    cy.login(role)
    cy.visit('/health-records')

    if (role === 'admin') {
      cy.getByTestId('admin-settings-button').should('be.visible')
    } else {
      cy.getByTestId('admin-settings-button').should('not.exist')
    }
  })
})
```

---

## Viewport Testing

```javascript
// Test responsive design
const viewports = [
  ['iphone-x', 375, 812],
  ['ipad-2', 768, 1024],
  [1920, 1080]
]

viewports.forEach(viewport => {
  it('should work on all screen sizes', () => {
    if (Array.isArray(viewport)) {
      cy.viewport(viewport[0], viewport[1])
    } else {
      cy.viewport(viewport)
    }

    cy.visit('/page')
    cy.getByTestId('element').should('be.visible')
  })
})
```

---

## Performance Tips

1. **Minimize Waits:** Use API interception instead of `cy.wait(ms)`
2. **Parallel Tests:** Run test files in parallel with `--parallel`
3. **Smart Selectors:** Use data-testid for fastest element selection
4. **Cleanup:** Clear cookies/localStorage between tests appropriately
5. **Focused Tests:** Use `.only` during development, remove before commit

---

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- Project Test Specs: `frontend/cypress/e2e/`
- Component Source: `frontend/src/components/` and `frontend/src/pages/`
- Full Fix Summary: `CYPRESS_TEST_FIXES_SUMMARY.md`

---

**Last Updated:** 2025-10-10
**Version:** 1.0.0

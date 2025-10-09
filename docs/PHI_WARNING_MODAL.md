# PHI Warning Modal Implementation

## File: `frontend/src/pages/Students.tsx`

Add a HIPAA-compliant PHI warning modal that displays before accessing Protected Health Information.

---

## Implementation

### Location: Before the closing `</div>` tag at the end of the return statement

The modal should be added just before line 1170 (before the final closing `</div>`), after the Export Format Modal.

---

## Complete Modal Code

```typescript
{/* PHI Warning Modal */}
{showPhiWarning && selectedStudent && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" data-testid="phi-warning">
      <div className="mt-3">
        {/* Warning Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-4 text-center mt-4">
          Protected Health Information
        </h3>

        {/* HIPAA Warning */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-sm text-yellow-700">
            You are about to access Protected Health Information (PHI). This action will be logged for compliance purposes.
          </p>
          <ul className="mt-2 text-xs text-yellow-600 list-disc list-inside space-y-1">
            <li>Access only information necessary for your duties</li>
            <li>Do not share PHI with unauthorized individuals</li>
            <li>Report any suspected privacy violations</li>
          </ul>
        </div>

        {/* Acknowledgment Text */}
        <p className="text-sm text-gray-600 mb-6">
          By clicking "I Understand", you acknowledge that you have a legitimate need to access this information and will handle it in compliance with HIPAA regulations.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            className="btn-secondary"
            onClick={() => {
              setShowPhiWarning(false)
              setSelectedStudent(null)
            }}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleAcceptPhiWarning}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

---

## User Flow

1. User clicks on a student row in the table
2. `handleViewDetails(student)` is called
3. PHI Warning modal appears (blocking overlay)
4. User reads the warning and compliance requirements
5. User has two options:
   - **Cancel**: Closes modal, does not access PHI
   - **I Understand**: Acknowledges warning and proceeds

6. If user clicks "I Understand":
   - PHI warning modal closes
   - Audit log entry is created (VIEW_STUDENT action)
   - Student details modal opens with full PHI

---

## Handler Functions (Already Implemented)

These functions are already in the code:

### handleViewDetails
```typescript
const handleViewDetails = async (student: Student) => {
  // Show PHI warning first
  setSelectedStudent(student)
  setShowPhiWarning(true)
}
```

### handleAcceptPhiWarning
```typescript
const handleAcceptPhiWarning = async () => {
  setShowPhiWarning(false)
  setShowDetailsModal(true)

  // Log audit trail for viewing student details
  if (selectedStudent) {
    try {
      await fetch('/api/audit-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'VIEW_STUDENT',
          resourceType: 'STUDENT',
          resourceId: selectedStudent.id,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      // Silently fail - don't interrupt user experience for audit logging
      console.error('Failed to log audit trail:', error)
    }
  }
}
```

---

## State Management (Already Implemented)

The required state is already defined:

```typescript
const [showPhiWarning, setShowPhiWarning] = useState(false)
const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
```

---

## Visual Design

### Modal Appearance:
- **Background**: Semi-transparent gray overlay (z-index: 50)
- **Container**: White rounded card, centered, with shadow
- **Width**: 384px (w-96)
- **Icon**: Yellow warning triangle in circular background
- **Warning Box**: Yellow background with left border
- **Buttons**: Secondary (gray) for Cancel, Primary (blue) for I Understand

### Accessibility:
- Clear warning icon for visual identification
- Structured list of compliance requirements
- High contrast text for readability
- Clear call-to-action buttons
- Keyboard accessible (tab navigation)

---

## HIPAA Compliance Features

1. **Warning Notification**: Users are explicitly warned they're accessing PHI
2. **Audit Trail**: Every PHI access is logged with user ID and timestamp
3. **Explicit Acknowledgment**: User must click "I Understand" to proceed
4. **Compliance Reminders**: Lists key HIPAA principles
5. **Cancellation Option**: Users can decline access if not needed

---

## Testing

### Manual Testing:
1. Navigate to Students page
2. Click on any student row
3. Verify PHI warning modal appears
4. Verify modal has data-testid="phi-warning"
5. Click "Cancel" - modal should close without accessing PHI
6. Click student row again
7. Click "I Understand" - should open student details modal
8. Check browser console for audit log request

### Cypress Testing:
```typescript
it('should display warning when accessing PHI data', () => {
  cy.get('[data-testid=student-row]').first().click()
  cy.get('[data-testid=phi-warning]').should('be.visible')
})

it('should create audit log when accepting PHI warning', () => {
  cy.intercept('POST', '/api/audit-log').as('auditLog')

  cy.get('[data-testid=student-row]').first().click()
  cy.get('[data-testid=phi-warning]').should('be.visible')
  cy.contains('I Understand').click()

  cy.wait('@auditLog').its('request.body').should('deep.include', {
    action: 'VIEW_STUDENT',
    resourceType: 'STUDENT'
  })

  cy.get('[data-testid=student-details-modal]').should('be.visible')
})

it('should allow canceling PHI access', () => {
  cy.get('[data-testid=student-row]').first().click()
  cy.get('[data-testid=phi-warning]').should('be.visible')
  cy.contains('Cancel').click()
  cy.get('[data-testid=phi-warning]').should('not.exist')
  cy.get('[data-testid=student-details-modal]').should('not.exist')
})
```

---

## Customization Options

### Warning Text
You can customize the warning text to match your organization's HIPAA policies. Update the content in the yellow warning box:

```typescript
<p className="text-sm text-yellow-700">
  Your organization's specific HIPAA warning text here
</p>
```

### Compliance Reminders
Add or modify the bullet points to match your organization's requirements:

```typescript
<ul className="mt-2 text-xs text-yellow-600 list-disc list-inside space-y-1">
  <li>Your organization's first requirement</li>
  <li>Your organization's second requirement</li>
  <li>Your organization's third requirement</li>
</ul>
```

---

## Future Enhancements

1. **Role-Based Warnings**: Different warning text for different user roles
2. **Frequency Control**: Show warning only once per session
3. **Acknowledgment Logging**: Log user acknowledgments separately
4. **Time-Based Restrictions**: Limit PHI access to business hours
5. **Multi-Level Access**: Different warnings for different PHI sensitivity levels

---

## Implementation Checklist

- [ ] Add PHI warning modal code before line 1170
- [ ] Verify showPhiWarning state exists (line 45)
- [ ] Verify handleViewDetails function updated (lines 205-209)
- [ ] Verify handleAcceptPhiWarning function exists (lines 211-235)
- [ ] Test manual navigation flow
- [ ] Test cancel button
- [ ] Test I Understand button
- [ ] Verify audit log is created
- [ ] Run Cypress test: `12-hipaa-accessibility.cy.ts`
- [ ] Verify "should display warning when accessing PHI data" passes
- [ ] Document any organization-specific customizations

---

## Related Documentation

- HIPAA Privacy Rule: [HHS.gov](https://www.hhs.gov/hipaa/for-professionals/privacy/index.html)
- Audit Logging Implementation: `AUDIT_LOGGING_IMPLEMENTATION.md`
- RBAC UI Updates: `RBAC_UI_UPDATES.md`
- Full Implementation Summary: `IMPLEMENTATION_SUMMARY.md`

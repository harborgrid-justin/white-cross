# RBAC UI Updates for Students Page

## File: `frontend/src/pages/Students.tsx`

These code snippets show the exact changes needed to implement RBAC-based UI visibility.

---

## 1. Conditional Add Student Button

**Location**: Lines 364-376 (Header section)

**Replace**:
```typescript
<button
  className="btn-primary flex items-center"
  data-testid="add-student-button"
  aria-label="Add new student"
  onClick={() => {
    setSelectedStudent(null)
    setShowModal(true)
  }}
>
  <UserPlus className="h-4 w-4 mr-2" />
  Add Student
</button>
```

**With**:
```typescript
{canCreate && (
  <button
    className="btn-primary flex items-center"
    data-testid="add-student-button"
    aria-label="Add new student"
    onClick={() => {
      setSelectedStudent(null)
      setShowModal(true)
    }}
  >
    <UserPlus className="h-4 w-4 mr-2" />
    Add Student
  </button>
)}
```

---

## 2. Conditional Edit/Delete Buttons in Table

**Location**: Lines 649-667 (Table action buttons)

**Replace**:
```typescript
<div className="flex items-center justify-end gap-2 min-w-[80px]">
  <button
    className="text-blue-600 hover:text-blue-900 p-1"
    data-testid="edit-student-button"
    onClick={(e) => handleEdit(student, e)}
    aria-label="Edit student"
  >
    <Edit className="h-4 w-4" />
  </button>
  <button
    className="text-red-600 hover:text-red-900 p-1"
    data-testid="delete-student-button"
    onClick={(e) => handleDeleteClick(student.id, e)}
    aria-label="Delete student"
  >
    <Trash2 className="h-4 w-4" />
  </button>
</div>
```

**With**:
```typescript
<div className="flex items-center justify-end gap-2 min-w-[80px]">
  {canEdit && (
    <button
      className="text-blue-600 hover:text-blue-900 p-1"
      data-testid="edit-student-button"
      onClick={(e) => handleEdit(student, e)}
      aria-label="Edit student"
    >
      <Edit className="h-4 w-4" />
    </button>
  )}
  {canDelete && (
    <button
      className="text-red-600 hover:text-red-900 p-1"
      data-testid="delete-student-button"
      onClick={(e) => handleDeleteClick(student.id, e)}
      aria-label="Delete student"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )}
</div>
```

---

## 3. Conditional Edit Button in Details Modal

**Location**: Lines 1031-1046 (Emergency contact edit button in details modal)

**Replace**:
```typescript
<button
  className="text-blue-600 hover:text-blue-800 text-sm"
  data-testid="edit-emergency-contact-button"
  onClick={() => {
    const primaryContact = selectedStudent.emergencyContacts.find(c => c.isPrimary)
    if (primaryContact) {
      setEmergencyContactData({
        firstName: primaryContact.firstName,
        phoneNumber: primaryContact.phoneNumber
      })
    }
    setShowEditEmergencyContact(true)
  }}
>
  Edit
</button>
```

**With**:
```typescript
{canEdit && !isReadOnly && (
  <button
    className="text-blue-600 hover:text-blue-800 text-sm"
    data-testid="edit-emergency-contact-button"
    onClick={() => {
      const primaryContact = selectedStudent.emergencyContacts.find(c => c.isPrimary)
      if (primaryContact) {
        setEmergencyContactData({
          firstName: primaryContact.firstName,
          phoneNumber: primaryContact.phoneNumber
        })
      }
      setShowEditEmergencyContact(true)
    }}
  >
    Edit
  </button>
)}
```

---

## Testing the Changes

After implementing these changes, the following test scenarios should pass:

### Admin User
- ✅ Sees "Add Student" button
- ✅ Sees edit button on student rows
- ✅ Sees delete button on student rows
- ✅ Sees edit button in details modal

### Nurse User
- ✅ Sees "Add Student" button
- ✅ Sees edit button on student rows
- ❌ Does NOT see delete button on student rows
- ✅ Sees edit button in details modal

### Counselor User
- ❌ Does NOT see "Add Student" button
- ✅ Sees edit button on student rows
- ❌ Does NOT see delete button on student rows
- ✅ Sees edit button in details modal

### Read-Only/Viewer User
- ❌ Does NOT see "Add Student" button
- ❌ Does NOT see edit button on student rows
- ❌ Does NOT see delete button on student rows
- ❌ Does NOT see edit button in details modal

---

## Implementation Checklist

- [ ] Update Add Student button with canCreate condition
- [ ] Update Edit button in table with canEdit condition
- [ ] Update Delete button in table with canDelete condition
- [ ] Update Edit button in details modal with canEdit && !isReadOnly condition
- [ ] Test with admin user
- [ ] Test with nurse user
- [ ] Test with counselor user
- [ ] Test with read-only user
- [ ] Run Cypress test suite: `11-rbac-permissions.cy.ts`
- [ ] Verify all RBAC tests pass

---

## Related Files

- `frontend/cypress/fixtures/users.json` - User credentials for testing
- `frontend/cypress/e2e/02-student-management/11-rbac-permissions.cy.ts` - Test suite
- `frontend/src/routes/index.tsx` - Route-level RBAC
- `frontend/src/contexts/AuthContext.tsx` - Authentication context

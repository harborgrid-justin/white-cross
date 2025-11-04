# Profile Component Architecture

## Visual Component Tree

```
ProfileContent (Main Container - 226 lines)
│
├── useProfileData() ────────────────────┐
│   ├── getCurrentUserProfile()          │
│   ├── getProfileSettings()             │  Custom Hooks Layer
│   ├── getSecurityLogs()                │  (302 lines total)
│   └── getActiveSessions()              │
│                                         │
├── useProfileUpdate() ──────────────────┤
│   └── updateProfileFromForm()          │
│                                         │
└── Internal state management ───────────┘
│
├─────────────────────────────────────────────────────────────
│                     Component Tree
├─────────────────────────────────────────────────────────────
│
├── ErrorState (conditional)
│   └── Operation error display
│
├── ProfileHeader (138 lines)
│   ├── Avatar Component
│   │   ├── Image or Initials
│   │   └── Upload Button (Camera Icon)
│   ├── User Information
│   │   ├── Name (h1)
│   │   ├── Title
│   │   ├── Department Badge
│   │   ├── Employee ID Badge
│   │   ├── Hire Date Badge
│   │   └── Last Login
│   └── Quick Actions
│       ├── Edit Profile Button
│       └── Export Data Button
│
├── Grid Container (2 columns on lg+)
│   │
│   ├── PersonalInfoForm (146 lines)
│   │   ├── useEditMode() ────────────┐
│   │   ├── Section Header            │
│   │   │   ├── User Icon             │
│   │   │   └── EditButton ───────────┤
│   │   ├── Form Fields               │  Shared UI Layer
│   │   │   ├── First Name            │  (207 lines total)
│   │   │   ├── Last Name             │
│   │   │   ├── Job Title             │
│   │   │   └── Department            │
│   │   └── FormActions (conditional)─┤
│   │       ├── Save Button           │
│   │       └── Cancel Button         │
│   │                                  │
│   ├── ContactInfoForm (196 lines)   │
│   │   ├── useEditMode() ────────────┤
│   │   ├── Section Header            │
│   │   │   ├── Mail Icon             │
│   │   │   └── EditButton ───────────┤
│   │   ├── Form Fields               │
│   │   │   ├── Email (with icon)     │
│   │   │   ├── Phone (with icon)     │
│   │   │   └── Address               │
│   │   │       ├── Street            │
│   │   │       ├── City              │
│   │   │       ├── State             │
│   │   │       └── ZIP Code          │
│   │   └── FormActions (conditional)─┤
│   │                                  │
│   ├── EmergencyContactForm (143 lines)
│   │   ├── useEditMode() ────────────┤
│   │   ├── Section Header            │
│   │   │   ├── AlertTriangle Icon    │
│   │   │   └── EditButton ───────────┤
│   │   ├── Form Fields               │
│   │   │   ├── Contact Name          │
│   │   │   ├── Relationship          │
│   │   │   └── Phone Number          │
│   │   └── FormActions (conditional)─┤
│   │                                  │
│   └── SecuritySettings (271 lines)  │
│       ├── usePasswordChange() ──────┤
│       ├── Section Header            │
│       │   └── Shield Icon           │
│       ├── Settings List             │
│       │   ├── 2FA Toggle            │
│       │   ├── Password Change       │
│       │   └── Session Timeout       │
│       └── Password Modal (conditional)
│           ├── Current Password      │
│           │   └── Eye/EyeOff ───────┤
│           ├── New Password          │
│           │   └── Eye/EyeOff ───────┤
│           ├── Confirm Password      │
│           │   └── Eye/EyeOff ───────┤
│           └── Action Buttons        │
│                                      │
├── CertificationsPanel (152 lines)   │
│   ├── Section Header                │
│   │   ├── Award Icon                │
│   │   └── Upload Button             │
│   ├── Certifications List           │
│   │   └── For each certification:   │
│   │       ├── Name & Issuer         │
│   │       ├── Status Badge          │
│   │       ├── Issue/Expiry Dates    │
│   │       └── Actions               │
│   │           ├── View (FileText)   │
│   │           ├── Download          │
│   │           └── Delete (Trash2)   │
│   └── Empty State (conditional)     │
│                                      │
├── ActivityLog (129 lines)           │
│   ├── Section Header                │
│   │   ├── Activity Icon             │
│   │   ├── Time Filter Dropdown      │
│   │   └── Export Button             │
│   ├── Activities List               │
│   │   └── For each activity:        │
│   │       ├── Activity Icon         │
│   │       ├── Action & Resource     │
│   │       ├── Device Info           │
│   │       ├── Timestamp             │
│   │       └── IP Address            │
│   ├── Empty State (conditional)     │
│   └── View All Button               │
│                                      │
└── PreferencesPanel (180 lines)      │
    ├── Section Header                │
    │   └── Settings Icon             │
    ├── Grid (2 columns)              │
    │   ├── Notifications             │
    │   │   ├── Bell Icon             │
    │   │   └── Toggles               │
    │   │       ├── Email ────────────┤
    │   │       ├── SMS ──────────────┤
    │   │       └── Desktop ──────────┘
    │   └── Display & Language
    │       ├── Language Select
    │       ├── Timezone Select
    │       └── Theme Select
    └── Save/Reset Buttons (conditional)
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Server Actions                           │
│  getCurrentUserProfile, updateProfileFromForm, etc.         │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                     Custom Hooks                             │
│  useProfileData, useProfileUpdate, usePasswordChange        │
│  - Manage async operations                                  │
│  - Handle loading/error states                              │
│  - Provide clean API to components                          │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│               ProfileContent (Main Component)                │
│  - Orchestrates all sub-components                          │
│  - Manages top-level state                                  │
│  - Handles callbacks from children                          │
│  - Passes data and handlers as props                        │
└─────────────────────────────────────────────────────────────┘
            ↓               ↓               ↓
    ┌───────────┐   ┌───────────┐   ┌───────────┐
    │  Header   │   │   Forms   │   │  Panels   │
    │ Component │   │Components │   │Components │
    └───────────┘   └───────────┘   └───────────┘
         ↓               ↓               ↓
    ┌───────────────────────────────────────────┐
    │         Shared UI Components              │
    │  EditButton, FormActions, ToggleSwitch    │
    │  LoadingState, ErrorState                 │
    └───────────────────────────────────────────┘
```

## Component Responsibilities Matrix

| Component | Data Fetching | State Management | User Input | Validation | API Calls |
|-----------|---------------|------------------|------------|------------|-----------|
| **Hooks** |
| useProfileData | ✅ Yes | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| useProfileUpdate | ❌ No | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| usePasswordChange | ❌ No | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| useEditMode | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Main** |
| ProfileContent | Via hooks | ✅ Yes | ❌ No | ❌ No | Via hooks |
| **Feature Components** |
| ProfileHeader | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| PersonalInfoForm | ❌ No | ✅ Local | ✅ Yes | ⚠️ Basic | Via parent |
| ContactInfoForm | ❌ No | ✅ Local | ✅ Yes | ⚠️ Basic | Via parent |
| EmergencyContactForm | ❌ No | ✅ Local | ✅ Yes | ⚠️ Basic | Via parent |
| SecuritySettings | ❌ No | ✅ Local | ✅ Yes | ✅ Yes | Via parent |
| CertificationsPanel | ❌ No | ❌ No | ❌ No | ❌ No | Via parent |
| ActivityLog | ❌ No | ✅ Local | ⚠️ Filter | ❌ No | Via parent |
| PreferencesPanel | ❌ No | ✅ Local | ✅ Yes | ❌ No | Via parent |
| **UI Components** |
| LoadingState | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| ErrorState | ❌ No | ❌ No | ⚠️ Button | ❌ No | ❌ No |
| ToggleSwitch | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No |
| EditButton | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No |
| FormActions | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No |

## State Management Strategy

### Global State (in ProfileContent)
```tsx
- profile: UserProfile | null
- loading: boolean (from useProfileData)
- error: string | null (from useProfileData)
- operationError: string | null (local)
```

### Local Component State
```tsx
PersonalInfoForm:
  - formData: { firstName, lastName, title, department }
  - isEditing: boolean (from useEditMode)

ContactInfoForm:
  - formData: { email, phone, address }
  - isEditing: boolean (from useEditMode)

EmergencyContactForm:
  - formData: { emergencyContact }
  - isEditing: boolean (from useEditMode)

SecuritySettings:
  - showPasswordModal: boolean
  - passwordForm: PasswordFormState (from usePasswordChange)

ActivityLog:
  - timeFilter: '7' | '30' | '90'

PreferencesPanel:
  - preferences: UserProfile['preferences']
  - hasChanges: boolean
```

## Props Interface Patterns

### Common Pattern 1: Form Components
```tsx
interface FormComponentProps {
  profile: UserProfile;           // Read-only data
  onSave: (data: Partial<UserProfile>) => Promise<void>;  // Update callback
  disabled?: boolean;             // Loading state from parent
}
```

### Common Pattern 2: Display Components
```tsx
interface DisplayComponentProps {
  profile: UserProfile;           // Read-only data
  onAction?: () => void;          // Optional action callbacks
  onViewItem?: (id: string) => void;
  onDownloadItem?: (id: string) => void;
}
```

### Common Pattern 3: UI Components
```tsx
interface UIComponentProps {
  // Minimal, focused props
  checked?: boolean;
  onChange?: (value: any) => void;
  disabled?: boolean;
  label?: string;
  // No UserProfile dependency
}
```

## Composition Patterns Used

### 1. Container/Presentational Pattern
```tsx
// Container (ProfileContent)
- Manages data and state
- Handles business logic
- Passes props to presentational components

// Presentational (PersonalInfoForm, etc.)
- Receives data via props
- Renders UI
- Emits events via callbacks
- No direct API calls
```

### 2. Custom Hooks Pattern
```tsx
// Extract complex logic into hooks
useProfileData() {
  - Data fetching
  - Loading/error states
  - Refetch logic
  return { profile, loading, error, refetch }
}

// Component uses hook
const { profile, loading } = useProfileData();
```

### 3. Compound Component Pattern (ToggleSwitch)
```tsx
<ToggleSwitch
  checked={value}
  onChange={handler}
  label="Feature"
  description="Enable feature"
/>
// Component composes label + switch internally
```

### 4. Render Props Pattern (FormActions)
```tsx
// Reusable action buttons
<FormActions
  onSave={handleSave}
  onCancel={handleCancel}
  saveLabel="Save Changes"
  cancelLabel="Cancel"
/>
```

## Component Communication

### Parent → Child (Props Down)
```
ProfileContent
  ↓ profile: UserProfile
  ↓ onSave: Function
PersonalInfoForm
```

### Child → Parent (Callbacks Up)
```
PersonalInfoForm
  ↑ onSave(data)
ProfileContent
  ↑ updateProfileAction()
Server
```

### Sibling Communication (Via Parent)
```
PersonalInfoForm
  ↑ onSave(data)
ProfileContent (updates profile state)
  ↓ profile: UserProfile (updated)
ContactInfoForm (receives updated profile)
```

## Performance Optimization Opportunities

### Current Optimizations
- ✅ Concurrent data fetching in `useProfileData`
- ✅ Isolated local state in form components
- ✅ Conditional rendering (edit modes, modals)
- ✅ Debounced time filter in ActivityLog

### Future Optimizations
- ⚠️ Wrap form components in `React.memo`
- ⚠️ Memoize callbacks with `useCallback`
- ⚠️ Memoize computed values with `useMemo`
- ⚠️ Virtualize long lists (certifications, activity)
- ⚠️ Lazy load heavy components (SecuritySettings modal)
- ⚠️ Code split by route/tab

### Memoization Candidates
```tsx
// In ProfileContent
const handleProfileSave = useCallback(async (data) => {
  // ... implementation
}, [profile, updateProfileAction]);

const handleTwoFactorToggle = useCallback(async () => {
  // ... implementation
}, [profile]);

// In PersonalInfoForm
const MemoizedPersonalInfoForm = React.memo(PersonalInfoForm);
```

## Error Handling Strategy

### Levels of Error Handling

#### 1. Hook Level (useProfileData, useProfileUpdate)
```tsx
try {
  const result = await serverAction();
  if (result.success) {
    return result.data;
  } else {
    setError(result.error);
  }
} catch (err) {
  setError('Generic error message');
}
```

#### 2. Component Level (SecuritySettings)
```tsx
// Display errors within component
{changeError && (
  <div className="error-message">{changeError}</div>
)}
```

#### 3. Parent Level (ProfileContent)
```tsx
// Display top-level operation errors
{operationError && (
  <ErrorState message={operationError} />
)}
```

## Accessibility Features

### Semantic HTML
- ✅ Proper heading hierarchy (h1, h2, h3)
- ✅ Label associations with form inputs
- ✅ Button elements for interactive items

### ARIA Attributes
- ✅ `aria-label` on icon buttons
- ✅ `aria-labelledby` on form sections
- ✅ Descriptive button text

### Keyboard Navigation
- ✅ Tab order follows visual order
- ✅ Focus visible on interactive elements
- ✅ Enter/Space activates buttons
- ✅ Escape closes modals

### Screen Reader Support
- ✅ Alt text on images
- ✅ Hidden text for icon-only buttons
- ✅ Status announcements for loading/errors

## Testing Strategy

### Unit Tests (Per Component)
```bash
PersonalInfoForm.test.tsx
ContactInfoForm.test.tsx
EmergencyContactForm.test.tsx
SecuritySettings.test.tsx
CertificationsPanel.test.tsx
ActivityLog.test.tsx
PreferencesPanel.test.tsx
ProfileHeader.test.tsx
```

### Hook Tests
```bash
useProfileData.test.ts
useProfileUpdate.test.ts
usePasswordChange.test.ts
useEditMode.test.ts
```

### Integration Tests
```bash
ProfileContent.integration.test.tsx
- Test data flow
- Test error scenarios
- Test user workflows
```

## File Size Distribution

```
Hooks:         302 lines (16%)
UI Components: 207 lines (11%)
Utils:          52 lines (3%)
Feature Comps: 1,255 lines (67%)
Exports:        64 lines (3%)
───────────────────────────
Total:        1,880 lines (100%)
```

## Conclusion

This architecture achieves:
- ✅ **Modularity**: 18 focused components vs 1 monolith
- ✅ **Maintainability**: Average 100-150 lines per component
- ✅ **Reusability**: Shared hooks, UI components, utilities
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Performance**: Optimized for selective re-renders
- ✅ **Accessibility**: WCAG 2.1 AA compliant patterns
- ✅ **Testability**: Components easily unit tested
- ✅ **Scalability**: Easy to add new sections/features

The component tree is shallow (max 3 levels), state management is clear (global vs local), and communication patterns are consistent (props down, callbacks up).

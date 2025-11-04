# Profile Components File Index

## Quick Reference - All File Paths

### Custom Hooks
```
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/hooks/useProfileData.ts
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/hooks/useProfileUpdate.ts
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/hooks/usePasswordChange.ts
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/hooks/useEditMode.ts
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/hooks/index.ts
```

### UI Components
```
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/ui/LoadingState.tsx
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/ui/ErrorState.tsx
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/ui/ToggleSwitch.tsx
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/ui/EditButton.tsx
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/ui/FormActions.tsx
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/ui/index.ts
```

### Utilities
```
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/utils/formatters.ts
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/utils/index.ts
```

### Feature Components
```
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/ProfileHeader.tsx
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/PersonalInfoForm.tsx
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/ContactInfoForm.tsx
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/EmergencyContactForm.tsx
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/SecuritySettings.tsx
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/CertificationsPanel.tsx
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/ActivityLog.tsx
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/PreferencesPanel.tsx
```

### Main Components
```
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/ProfileContent.refactored.tsx (NEW)
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/ProfileContent.tsx (ORIGINAL)
```

### Exports
```
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/index.ts
```

### Documentation
```
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/REFACTORING.md
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/REFACTORING_SUMMARY.md
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/COMPONENT_ARCHITECTURE.md
/workspaces/white-cross/frontend/src/app/(dashboard)/profile/_components/FILES_INDEX.md (this file)
```

## Component Line Counts Summary

| Component | Lines | Type |
|-----------|-------|------|
| **Hooks** | | |
| useProfileData.ts | 87 | Hook |
| useProfileUpdate.ts | 58 | Hook |
| usePasswordChange.ts | 114 | Hook |
| useEditMode.ts | 43 | Hook |
| **UI Components** | | |
| LoadingState.tsx | 24 | UI |
| ErrorState.tsx | 43 | UI |
| ToggleSwitch.tsx | 59 | UI |
| EditButton.tsx | 30 | UI |
| FormActions.tsx | 51 | UI |
| **Feature Components** | | |
| ProfileHeader.tsx | 138 | Feature |
| PersonalInfoForm.tsx | 146 | Feature |
| ContactInfoForm.tsx | 196 | Feature |
| EmergencyContactForm.tsx | 143 | Feature |
| SecuritySettings.tsx | 271 | Feature |
| CertificationsPanel.tsx | 152 | Feature |
| ActivityLog.tsx | 129 | Feature |
| PreferencesPanel.tsx | 180 | Feature |
| **Main** | | |
| ProfileContent.refactored.tsx | 226 | Main |
| ProfileContent.tsx (original) | 955 | Main |
| **Utilities** | | |
| formatters.ts | 52 | Util |
| **Total New Code** | ~1,880 | |

## Import Patterns

### Import Main Component
```tsx
import { ProfileContent } from '@/app/(dashboard)/profile/_components';
```

### Import Feature Components
```tsx
import {
  ProfileHeader,
  PersonalInfoForm,
  ContactInfoForm,
  EmergencyContactForm,
  SecuritySettings,
  CertificationsPanel,
  ActivityLog,
  PreferencesPanel
} from '@/app/(dashboard)/profile/_components';
```

### Import Hooks
```tsx
import {
  useProfileData,
  useProfileUpdate,
  usePasswordChange,
  useEditMode
} from '@/app/(dashboard)/profile/_components/hooks';
```

### Import UI Components
```tsx
import {
  LoadingState,
  ErrorState,
  ToggleSwitch,
  EditButton,
  FormActions
} from '@/app/(dashboard)/profile/_components/ui';
```

### Import Utilities
```tsx
import {
  formatDate,
  formatDateTime,
  getCertificationStatusColor,
  capitalize
} from '@/app/(dashboard)/profile/_components/utils';
```

## Component Dependencies

### ProfileContent.refactored.tsx
Depends on:
- hooks/useProfileData
- hooks/useProfileUpdate
- ui/LoadingState
- ui/ErrorState
- ProfileHeader
- PersonalInfoForm
- ContactInfoForm
- EmergencyContactForm
- SecuritySettings
- CertificationsPanel
- ActivityLog
- PreferencesPanel

### Form Components (Personal, Contact, Emergency)
Depends on:
- hooks/useEditMode
- ui/EditButton
- ui/FormActions

### SecuritySettings
Depends on:
- hooks/usePasswordChange

### PreferencesPanel
Depends on:
- ui/ToggleSwitch

### All Components
Depend on:
- @/lib/actions/profile.actions (server actions)
- lucide-react (icons)

## File Tree Visualization

```
_components/
├── hooks/
│   ├── useProfileData.ts ────────────┐
│   ├── useProfileUpdate.ts           │ 302 lines
│   ├── usePasswordChange.ts          │
│   ├── useEditMode.ts                │
│   └── index.ts ─────────────────────┘
│
├── ui/
│   ├── LoadingState.tsx ─────────────┐
│   ├── ErrorState.tsx                │
│   ├── ToggleSwitch.tsx              │ 207 lines
│   ├── EditButton.tsx                │
│   ├── FormActions.tsx               │
│   └── index.ts ─────────────────────┘
│
├── utils/
│   ├── formatters.ts ────────────────┐ 52 lines
│   └── index.ts ─────────────────────┘
│
├── ProfileHeader.tsx ────────────────┐
├── PersonalInfoForm.tsx              │
├── ContactInfoForm.tsx               │
├── EmergencyContactForm.tsx          │ 1,255 lines
├── SecuritySettings.tsx              │ (feature)
├── CertificationsPanel.tsx           │
├── ActivityLog.tsx                   │
├── PreferencesPanel.tsx ─────────────┘
│
├── ProfileContent.refactored.tsx ───── 226 lines (NEW MAIN)
├── ProfileContent.tsx ────────────────── 955 lines (ORIGINAL)
│
├── index.ts ──────────────────────────── 43 lines (barrel export)
│
└── Documentation
    ├── REFACTORING.md
    ├── REFACTORING_SUMMARY.md
    ├── COMPONENT_ARCHITECTURE.md
    └── FILES_INDEX.md (this file)
```

## Total Files Created

- **22 TypeScript/React files** (hooks, components, utilities, exports)
- **4 Documentation files** (comprehensive guides and references)
- **Total: 26 files**

## Migration Checklist

- [ ] Review all component files
- [ ] Verify TypeScript compilation (✅ 0 errors)
- [ ] Test ProfileHeader component
- [ ] Test PersonalInfoForm component
- [ ] Test ContactInfoForm component
- [ ] Test EmergencyContactForm component
- [ ] Test SecuritySettings component
- [ ] Test CertificationsPanel component
- [ ] Test ActivityLog component
- [ ] Test PreferencesPanel component
- [ ] Test full ProfileContent integration
- [ ] Backup original ProfileContent.tsx
- [ ] Replace with ProfileContent.refactored.tsx
- [ ] Test in development environment
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Deploy to staging
- [ ] Deploy to production

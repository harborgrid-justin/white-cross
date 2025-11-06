# AppointmentScheduler Refactoring Plan - AS7P9Q

## Overview
Refactor AppointmentScheduler.tsx (1,062 LOC) into modular, reusable components under 300 LOC each.

## References to Other Agent Work
- Architecture notes: `.temp/architecture-notes-BDM701.md`
- Recent completions: `.temp/completion-summary-CM734R.md`

## Current State Analysis
- **File**: `F:\temp\white-cross\frontend\src\components\pages\Appointments\AppointmentScheduler.tsx`
- **Lines**: 1,062 LOC
- **Complexity**: Full scheduling interface with multiple concerns
- **Key Features**:
  - Calendar week view with date selection
  - Time slot picker with availability checking
  - Patient search and selection
  - Provider search and selection
  - Room booking for in-person appointments
  - Virtual appointment support
  - Appointment form with type, priority, reason, notes
  - Preparation instructions management

## Target Structure
```
AppointmentScheduler/
├── index.ts                    # Re-exports main component
├── types.ts                    # Shared TypeScript interfaces (~80 LOC)
├── utils.ts                    # Date/time utilities (~60 LOC)
├── hooks.ts                    # Custom hooks (~120 LOC)
├── CalendarView.tsx            # Week calendar display (~180 LOC)
├── TimeSlotPicker.tsx          # Time slot selection (~150 LOC)
├── ProviderSelector.tsx        # Provider search/select (~180 LOC)
├── PatientSelector.tsx         # Patient search/select (~180 LOC)
├── RoomBooking.tsx             # Room selection UI (~100 LOC)
├── SchedulerForm.tsx           # Appointment details form (~220 LOC)
└── AppointmentScheduler.tsx    # Main orchestrator (~200 LOC)
```

## Component Breakdown Strategy

### 1. types.ts
**Purpose**: Central type definitions
**Exports**:
- `TimeSlot` interface
- `Provider` interface
- `Patient` interface
- `Room` interface
- `AppointmentSchedulerProps` interface
- Shared enums and utility types

### 2. utils.ts
**Purpose**: Date/time formatting utilities
**Functions**:
- `formatDate(date: Date): string`
- `formatTime(timeString: string): string`
- `getWeekDays(currentWeek: Date): Date[]`
- `isToday(date: Date): boolean`
- `isPast(date: Date): boolean`

### 3. hooks.ts
**Purpose**: Custom hooks for business logic
**Hooks**:
- `useTimeSlots(date, providerId, onLoadTimeSlots)` - Manages time slot loading
- `useSearch(onSearch)` - Generic search hook with debouncing
- `useSchedulerForm(initialValues)` - Form state management

### 4. CalendarView.tsx
**Purpose**: Week calendar date picker
**Props**:
- `selectedDate: Date`
- `currentWeek: Date`
- `onDateSelect: (date: Date) => void`
- `onWeekChange: (direction: 'prev' | 'next') => void`
**Features**:
- Week view with 7 days
- Navigation buttons
- Visual indicators for today/selected/past dates
- Accessibility with ARIA labels

### 5. TimeSlotPicker.tsx
**Purpose**: Available time slot selection
**Props**:
- `selectedProvider: string`
- `selectedDate: Date`
- `timeSlots: TimeSlot[]`
- `selectedSlot: TimeSlot | null`
- `loading: boolean`
- `onSlotSelect: (slot: TimeSlot) => void`
**Features**:
- Grid layout of time slots
- Loading/empty states
- Disabled unavailable slots
- Visual selection indicator

### 6. ProviderSelector.tsx
**Purpose**: Provider search and selection UI
**Props**:
- `providers: Provider[]`
- `selectedProviderId: string`
- `onProviderSelect: (id: string) => void`
- `onSearch?: (query: string) => Promise<Provider[]>`
**Features**:
- Search input with dropdown results
- Selected provider display card
- Avatar/icon display
- Specialty and department info

### 7. PatientSelector.tsx
**Purpose**: Patient search and selection UI (similar to ProviderSelector)
**Props**:
- `patients: Patient[]`
- `selectedPatientId: string`
- `onPatientSelect: (id: string) => void`
- `onSearch?: (query: string) => Promise<Patient[]>`
**Features**:
- Search input with dropdown results
- Selected patient display card
- DOB, phone, email display

### 8. RoomBooking.tsx
**Purpose**: Room selection for in-person appointments
**Props**:
- `rooms: Room[]`
- `selectedRoomId: string`
- `isVirtual: boolean`
- `allowVirtual: boolean`
- `onRoomSelect: (id: string) => void`
- `onModeChange: (isVirtual: boolean) => void`
**Features**:
- Virtual/In-person toggle
- Room dropdown (filtered for in-person)
- Room capacity and equipment display

### 9. SchedulerForm.tsx
**Purpose**: Appointment details form
**Props**:
- Form values (type, priority, duration, reason, notes, instructions)
- Configuration (minDuration, maxDuration)
- Change handlers for each field
**Features**:
- Type and priority selects
- Duration input
- Reason input (required)
- Notes textarea
- Dynamic preparation instructions list

### 10. AppointmentScheduler.tsx (Refactored)
**Purpose**: Main orchestrator component
**Responsibilities**:
- State management coordination
- Event handler orchestration
- Layout composition
- API call coordination
- Form submission logic
**Target**: ~200 LOC

## Implementation Phases

### Phase 1: Foundation (Setup & Extraction)
1. Create `AppointmentScheduler/` subdirectory
2. Extract `types.ts` with all interfaces
3. Extract `utils.ts` with utility functions
4. Create `hooks.ts` with custom hooks

### Phase 2: UI Component Creation
5. Build `CalendarView.tsx` with week picker
6. Build `TimeSlotPicker.tsx` with slot grid
7. Build `ProviderSelector.tsx` with search
8. Build `PatientSelector.tsx` with search
9. Build `RoomBooking.tsx` with mode toggle
10. Build `SchedulerForm.tsx` with all form fields

### Phase 3: Integration
11. Refactor main `AppointmentScheduler.tsx` to use subcomponents
12. Create `index.ts` for clean re-exports
13. Update parent imports if necessary

### Phase 4: Validation
14. Verify each component is under 300 LOC
15. Test component composition
16. Ensure TypeScript type safety
17. Verify accessibility features preserved

## Quality Standards Checklist
- [ ] Each component under 300 LOC
- [ ] Full TypeScript type safety
- [ ] Proper prop interfaces with JSDoc
- [ ] Accessibility attributes preserved (ARIA labels, roles, etc.)
- [ ] Loading and error states handled
- [ ] Consistent naming conventions
- [ ] No duplicate code across components
- [ ] Clear separation of concerns
- [ ] Custom hooks for reusable logic
- [ ] Proper event handler typing

## Timeline Estimate
- Phase 1: Foundation - 30 minutes
- Phase 2: UI Components - 90 minutes
- Phase 3: Integration - 30 minutes
- Phase 4: Validation - 15 minutes
- **Total**: ~2.5 hours

## Success Criteria
1. All components under 300 LOC
2. Main scheduler under 200 LOC
3. Full type safety maintained
4. All functionality preserved
5. Accessibility maintained
6. Clean, composable component API

# AppointmentScheduler Refactoring Checklist - AS7P9Q

## Phase 1: Foundation
- [ ] Create `AppointmentScheduler/` subdirectory
- [ ] Extract `types.ts` with all interfaces (TimeSlot, Provider, Patient, Room, Props)
- [ ] Extract `utils.ts` with date/time utilities (formatDate, formatTime, getWeekDays, etc.)
- [ ] Create `hooks.ts` with custom hooks (useTimeSlots, useSearch, useSchedulerForm)

## Phase 2: UI Components
- [ ] Create `CalendarView.tsx` - Week calendar with date selection (~180 LOC)
- [ ] Create `TimeSlotPicker.tsx` - Time slot grid with availability (~150 LOC)
- [ ] Create `ProviderSelector.tsx` - Provider search and selection (~180 LOC)
- [ ] Create `PatientSelector.tsx` - Patient search and selection (~180 LOC)
- [ ] Create `RoomBooking.tsx` - Room selection and virtual toggle (~100 LOC)
- [ ] Create `SchedulerForm.tsx` - Appointment details form (~220 LOC)

## Phase 3: Integration
- [ ] Refactor main `AppointmentScheduler.tsx` to orchestrate subcomponents (~200 LOC)
- [ ] Create `index.ts` with re-exports
- [ ] Move original file to subdirectory

## Phase 4: Validation
- [ ] Verify types.ts is under 100 LOC
- [ ] Verify utils.ts is under 80 LOC
- [ ] Verify hooks.ts is under 150 LOC
- [ ] Verify CalendarView.tsx is under 200 LOC
- [ ] Verify TimeSlotPicker.tsx is under 200 LOC
- [ ] Verify ProviderSelector.tsx is under 200 LOC
- [ ] Verify PatientSelector.tsx is under 200 LOC
- [ ] Verify RoomBooking.tsx is under 150 LOC
- [ ] Verify SchedulerForm.tsx is under 250 LOC
- [ ] Verify main AppointmentScheduler.tsx is under 250 LOC
- [ ] Test TypeScript compilation
- [ ] Verify all imports resolve correctly

## Documentation Updates
- [ ] Update task-status-AS7P9Q.json with completion
- [ ] Update progress-AS7P9Q.md with final status
- [ ] Create completion-summary-AS7P9Q.md
- [ ] Move all files to .temp/completed/

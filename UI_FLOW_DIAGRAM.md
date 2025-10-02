# Incident Reporting System - UI Flow Diagram

## Overview

This document provides a visual representation of the Incident Reporting System's user interface and workflow.

---

## Main Navigation Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     INCIDENT REPORTING SYSTEM                            │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
              [1] OVERVIEW              [2] LIST VIEW
                    │                           │
                    │                           │
         ┌──────────┴────────┐         ┌───────┴────────┐
         │                   │         │                │
    Feature Cards      Recent          All          Filters
    & Statistics       Incidents      Reports      & Search
         │                   │         │                │
         └───────────────────┴─────────┴────────────────┘
                             │
                             │ [Click Report]
                             │
                      [3] DETAILS VIEW
                             │
         ┌───────────────────┴─────────────────────┐
         │                                         │
    LEFT PANEL                              RIGHT PANEL
    • Incident Info                         • Parent Notification
    • Witness Statements                    • Compliance & Insurance
    • Evidence                              • Follow-up Actions
    • Actions Taken                         • Document Generation
```

---

## View 1: Overview Dashboard

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  Incident Reporting                            [+ Report Incident]        ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐  ║
║  │   📋 Documentation   │  │   📄 Reports        │  │   📸 Evidence   │  ║
║  │   System             │  │   Generation        │  │   Management    │  ║
║  │                      │  │                     │  │                 │  ║
║  │   Record incidents   │  │   Generate PDFs     │  │   Upload photos │  ║
║  │   with all details   │  │   & legal docs      │  │   and videos    │  ║
║  └─────────────────────┘  └─────────────────────┘  └─────────────────┘  ║
║                                                                           ║
║  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐  ║
║  │   👥 Witnesses       │  │   📋 Follow-ups     │  │   ⚖️ Compliance  │  ║
║  │   Collection         │  │   Tracking          │  │   Reporting     │  ║
║  │                      │  │                     │  │                 │  ║
║  │   Collect & verify   │  │   Track actions     │  │   Legal status  │  ║
║  │   statements         │  │   & priorities      │  │   monitoring    │  ║
║  └─────────────────────┘  └─────────────────────┘  └─────────────────┘  ║
║                                                                           ║
║  ┌─────────────────────┐  ┌─────────────────────┐                       ║
║  │   🔔 Notifications   │  │   🏥 Insurance      │                       ║
║  │   Automation         │  │   Integration       │                       ║
║  │                      │  │                     │                       ║
║  │   Email/SMS/Voice    │  │   Claim tracking    │                       ║
║  │   to parents         │  │   & processing      │                       ║
║  └─────────────────────┘  └─────────────────────┘                       ║
║                                                                           ║
║  Recent Incidents:                                                        ║
║  ┌────────────────────────────────────────────────────────────────────┐  ║
║  │ [CRITICAL] INJURY - Student fell on playground             [View] │  ║
║  │ [HIGH] ALLERGIC_REACTION - Bee sting incident              [View] │  ║
║  │ [MEDIUM] ILLNESS - Fever and headache                      [View] │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## View 2: List View

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  ← Back to Overview                            [+ Report Incident]        ║
║  All Incident Reports                                                     ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  ┌────────────────────────────────────────────────────────────────────┐  ║
║  │ [CRITICAL] INJURY          [NON_COMPLIANT]            [📄] [👁️]    │  ║
║  │ Student fell on playground during recess                           │  ║
║  │ Student: John Doe | Location: Playground | 1/15/2024              │  ║
║  │ ✓ Parent Notified | Insurance: CLM-2024-001234                    │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
║  ┌────────────────────────────────────────────────────────────────────┐  ║
║  │ [HIGH] ALLERGIC_REACTION   [UNDER_REVIEW]            [📄] [👁️]    │  ║
║  │ Bee sting on upper arm causing swelling                           │  ║
║  │ Student: Jane Smith | Location: Field | 1/14/2024                 │  ║
║  │ ✓ Parent Notified | Insurance: CLM-2024-001233                    │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
║  ┌────────────────────────────────────────────────────────────────────┐  ║
║  │ [MEDIUM] ILLNESS           [COMPLIANT]                [📄] [👁️]    │  ║
║  │ Student reporting fever and headache                               │  ║
║  │ Student: Bob Johnson | Location: Classroom | 1/13/2024            │  ║
║  │ ✓ Parent Notified                                                  │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
║  ┌────────────────────────────────────────────────────────────────────┐  ║
║  │ [LOW] BEHAVIORAL           [PENDING]                  [📄] [👁️]    │  ║
║  │ Student refused to take medication                                 │  ║
║  │ Student: Alice Williams | Location: Nurse Office | 1/12/2024      │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
║                             [Previous] [Next]                             ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## View 3: Details View

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  ← Back to List                           [📥 Generate Report]            ║
║  Incident Report Details                                                  ║
║  Report ID: INC-A1B2C3D4                                                  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  LEFT PANEL (2/3 width)          │    RIGHT PANEL (1/3 width)            ║
║  ════════════════════════════════│════════════════════════════════════   ║
║                                  │                                        ║
║  ┌──────────────────────────┐   │   ┌────────────────────────────────┐  ║
║  │ Incident Information     │   │   │ 🔔 Parent Notification         │  ║
║  ├──────────────────────────┤   │   ├────────────────────────────────┤  ║
║  │ Type: INJURY             │   │   │ ✓ Parent Notified              │  ║
║  │ Severity: [CRITICAL]     │   │   │ Via: email                     │  ║
║  │ Student: John Doe        │   │   │ At: 1/15/24, 2:15 PM          │  ║
║  │ Occurred: 1/15/24 2:00PM │   │   │                                │  ║
║  │ Location: Playground     │   │   │ [OR]                           │  ║
║  │ Description:             │   │   │                                │  ║
║  │ Student fell from...     │   │   │ Send notification:             │  ║
║  │ Actions Taken:           │   │   │ [📧 Send Email]                │  ║
║  │ Applied first aid...     │   │   │ [💬 Send SMS]                  │  ║
║  └──────────────────────────┘   │   └────────────────────────────────┘  ║
║                                  │                                        ║
║  ┌──────────────────────────┐   │   ┌────────────────────────────────┐  ║
║  │ 👥 Witness Statements    │   │   │ ⚖️ Compliance & Insurance      │  ║
║  │         [+ Add]          │   │   ├────────────────────────────────┤  ║
║  ├──────────────────────────┤   │   │ Compliance: [NON_COMPLIANT]    │  ║
║  │ • Ms. Johnson (STAFF) ✓  │   │   │                                │  ║
║  │   "I saw the student..." │   │   │ Insurance Claim:               │  ║
║  │                          │   │   │ CLM-2024-001234                │  ║
║  │ • Tommy Lee (STUDENT)    │   │   │ Status: FILED                  │  ║
║  │   "We were playing..."   │   │   │                                │  ║
║  │   [Verify]               │   │   │                                │  ║
║  └──────────────────────────┘   │   └────────────────────────────────┘  ║
║                                  │                                        ║
║  ┌──────────────────────────┐   │   ┌────────────────────────────────┐  ║
║  │ 📸 Evidence              │   │   │ ⏰ Follow-up Actions           │  ║
║  │      [📤 Upload]         │   │   ├────────────────────────────────┤  ║
║  ├──────────────────────────┤   │   │ • Schedule follow-up           │  ║
║  │ Photos: 3 uploaded       │   │   │   Due: 1/17/24 [HIGH]          │  ║
║  │ • incident_photo_1.jpg   │   │   │   Status: [PENDING]            │  ║
║  │ • incident_photo_2.jpg   │   │   │                                │  ║
║  │ • incident_photo_3.jpg   │   │   │ • Contact parent               │  ║
║  │                          │   │   │   Due: 1/16/24 [URGENT]        │  ║
║  │ Videos: 1 uploaded       │   │   │   Status: [COMPLETED] ✓        │  ║
║  │ • incident_video.mp4     │   │   │                                │  ║
║  └──────────────────────────┘   │   └────────────────────────────────┘  ║
║                                  │                                        ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## Key UI Features

### Color Coding

**Severity Badges:**
- 🔴 CRITICAL: Red background
- 🟠 HIGH: Orange background
- 🟡 MEDIUM: Yellow background
- 🟢 LOW: Green background

**Compliance Badges:**
- 🟢 COMPLIANT: Green background
- 🔴 NON_COMPLIANT: Red background
- 🟡 UNDER_REVIEW: Yellow background
- ⚪ PENDING: Gray background

### Interactive Elements

1. **Buttons**
   - Primary actions (Create, Generate, Send)
   - Secondary actions (View, Verify, Upload)
   - Navigation (Back, Next, Previous)

2. **Forms**
   - Create incident report form
   - Add witness statement form
   - Add follow-up action form
   - Upload evidence form

3. **Status Indicators**
   - Checkmarks (✓) for completed items
   - Color-coded badges for status
   - Icons for different sections

### Responsive Design

- Desktop: Full 3-column layout
- Tablet: 2-column layout with stacked panels
- Mobile: Single column with collapsible sections

---

## User Workflow Examples

### Example 1: Creating a New Incident Report

```
1. User clicks [+ Report Incident] button
2. Form appears with fields:
   - Student selection (dropdown)
   - Incident type (dropdown)
   - Severity (dropdown)
   - Location (text)
   - Date/Time (datetime picker)
   - Description (textarea)
   - Actions taken (textarea)
   - Witnesses (multi-select)
3. User fills out form
4. User clicks [Submit]
5. System creates incident report
6. If severity is HIGH/CRITICAL, auto-notifies parents
7. User redirected to Details view
```

### Example 2: Adding a Witness Statement

```
1. User navigates to incident Details view
2. Scrolls to Witness Statements section
3. Clicks [+ Add Statement] button
4. Form appears:
   - Witness name (text)
   - Witness type (dropdown: STUDENT/STAFF/PARENT/OTHER)
   - Contact info (text, optional)
   - Statement (textarea)
5. User fills out form
6. Clicks [Submit]
7. Statement added to list with [Verify] button
8. Supervisor can click [Verify] to mark as verified
```

### Example 3: Sending Parent Notification

```
1. User in Details view, Parent Notification section
2. If not yet notified, sees three buttons:
   - [📧 Send Email]
   - [💬 Send SMS]
   - [📞 Voice Call]
3. User clicks desired method (e.g., [📧 Send Email])
4. System sends notification via selected channel
5. Updates display to show:
   ✓ Parent Notified
   Via: email
   At: [timestamp]
   By: [nurse name]
```

### Example 4: Generating Report Document

```
1. User navigates to incident Details view
2. Clicks [📥 Generate Report] button at top
3. System compiles comprehensive report including:
   - Report number
   - Student information
   - Incident details
   - Actions taken
   - Witness statements
   - Evidence list
   - Follow-up actions
   - Insurance info
   - Compliance status
4. Document data returned (ready for PDF generation)
5. Success message displayed
```

---

## Accessibility Features

- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ High contrast mode support
- ✅ Focus indicators on all interactive elements
- ✅ Semantic HTML structure
- ✅ ARIA labels and descriptions

---

## Summary

The Incident Reporting System UI provides:

1. **Three main views** for different use cases
2. **Color-coded indicators** for quick status recognition
3. **Interactive forms** for data entry
4. **Real-time updates** for notifications and status
5. **Comprehensive details view** with all incident information
6. **Responsive design** for all devices
7. **Accessible interface** meeting WCAG standards

All UI components are implemented in `frontend/src/pages/IncidentReports.tsx` (528 lines).

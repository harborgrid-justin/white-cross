# Incident Reporting System - UI Overview

This document provides a visual overview of the Incident Reporting System user interface.

## Main Dashboard View

The dashboard provides quick access to all incident reporting features:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Incident Reporting                              │
│    Document incidents, manage follow-ups, and ensure compliance         │
│                                                   [+ Report Incident]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │ 📄 Documentation│  │ 📷 Evidence     │  │ 🔔 Notifications│         │
│  │                 │  │  Collection     │  │                 │         │
│  │ ✓ Incident docs │  │ ✓ Photo/video  │  │ ✓ Parent notify │         │
│  │ ✓ Injury reports│  │ ✓ Doc mgmt     │  │ ✓ Staff alerts  │         │
│  │ ✓ Witness stmts │  │ ✓ Timestamps   │  │ ✓ Reminders     │         │
│  │ ✓ Timeline track│  │ ✓ Secure store │  │ ✓ Multi-channel │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                          │
│  ┌─────────────────┐                                                    │
│  │ 🛡️ Compliance   │                                                    │
│  │                 │                                                    │
│  │ ✓ Legal track   │                                                    │
│  │ ✓ Insurance     │                                                    │
│  │ ✓ Regulatory    │                                                    │
│  │ ✓ Audit trail   │                                                    │
│  └─────────────────┘                                                    │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                          Recent Incidents                 [View All →]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [CRITICAL] INJURY                                             [👁]     │
│  Student fell on playground during recess                               │
│  Student: Sarah Johnson  |  Playground  |  Jan 10, 2024                │
│                                                                          │
│  [HIGH] ALLERGIC_REACTION                                      [👁]     │
│  Allergic reaction to peanuts in cafeteria                              │
│  Student: Mike Chen  |  Cafeteria  |  Jan 9, 2024                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Incident List View

Comprehensive list with filtering and status indicators:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to Overview                                                      │
│                      All Incident Reports                               │
│                                                   [+ Report Incident]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [CRITICAL] INJURY [COMPLIANT]                            [📥] [👁]     │
│  Student fell on playground during recess                               │
│  Student: Sarah Johnson  |  Playground  |  Jan 10, 2024                │
│  ✓ Parent Notified  |  Insurance: CLM-2024-001234                      │
│                                                                          │
│  [HIGH] ALLERGIC_REACTION [UNDER_REVIEW]                  [📥] [👁]     │
│  Allergic reaction to peanuts in cafeteria                              │
│  Student: Mike Chen  |  Cafeteria  |  Jan 9, 2024                      │
│  ✓ Parent Notified                                                      │
│                                                                          │
│  [MEDIUM] ILLNESS [PENDING]                               [📥] [👁]     │
│  Student reported nausea during PE class                                │
│  Student: Emma Davis  |  Gymnasium  |  Jan 8, 2024                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Incident Details View

Complete incident information with management controls:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to List                                                          │
│              Incident Report Details                 [📥 Generate]     │
│              Report ID: INC-A1B2C3D4                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────── INCIDENT INFORMATION ───────────────────────┐  │
│  │                                                                    │  │
│  │  Type: INJURY              Severity: [CRITICAL]                   │  │
│  │  Student: Sarah Johnson    Occurred: Jan 10, 2024 2:30 PM        │  │
│  │  Location: Playground                                             │  │
│  │                                                                    │  │
│  │  Description:                                                      │  │
│  │  Student fell from monkey bars during recess. Landed on left     │  │
│  │  arm. Complained of immediate pain and swelling.                 │  │
│  │                                                                    │  │
│  │  Actions Taken:                                                    │  │
│  │  - Applied ice pack immediately                                   │  │
│  │  - Contacted parents                                              │  │
│  │  - Called 911 for transport to hospital                          │  │
│  │  - Completed incident documentation                               │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─────────────────── 👥 WITNESS STATEMENTS ──────────────── [+ Add]─┐  │
│  │                                                                    │  │
│  │  ┌──────────────────────────────────────────────────┐ [✓ Verified]│  │
│  │  │ Mr. Thompson                              STAFF  │            │  │
│  │  │ I was supervising recess when I saw Sarah fall  │            │  │
│  │  │ from the monkey bars. She was hanging and lost  │            │  │
│  │  │ her grip. I immediately ran over and called     │            │  │
│  │  │ for assistance.                                  │            │  │
│  │  └──────────────────────────────────────────────────┘            │  │
│  │                                                                    │  │
│  │  ┌──────────────────────────────────────────────────┐ [Verify]   │  │
│  │  │ Tommy Lee                              STUDENT   │            │  │
│  │  │ I was playing nearby. Sarah was trying to do    │            │  │
│  │  │ monkey bars and fell down. She hurt her arm.    │            │  │
│  │  └──────────────────────────────────────────────────┘            │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────── 📷 EVIDENCE ───────────────── [⬆ Upload]───┐  │
│  │                                                                    │  │
│  │  Photos (3): Photos of injury site and location                   │  │
│  │  Videos (0): No videos uploaded                                   │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
├──────────────────────────── SIDEBAR ─────────────────────────────────────┤
│                                                                          │
│  ┌────────────────── 🔔 PARENT NOTIFICATION ──────────────────────┐    │
│  │                                                                  │    │
│  │  ✓ Parent Notified                                             │    │
│  │  Via: email                                                     │    │
│  │  At: Jan 10, 2024 2:45 PM                                      │    │
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌──────────────── 🛡️ COMPLIANCE & INSURANCE ─────────────────────┐    │
│  │                                                                  │    │
│  │  Compliance Status:                                             │    │
│  │  [COMPLIANT]                                                    │    │
│  │                                                                  │    │
│  │  Insurance Claim:                                               │    │
│  │  CLM-2024-001234                                               │    │
│  │  Status: FILED                                                  │    │
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌──────────────────── ⏰ FOLLOW-UP ACTIONS ─────── [+ Add]───────┐    │
│  │                                                                  │    │
│  │  ┌────────────────────────────────────┐                        │    │
│  │  │ Schedule follow-up assessment      │ [COMPLETED]            │    │
│  │  │ Due: Jan 11, 2024                 │                        │    │
│  │  └────────────────────────────────────┘                        │    │
│  │                                                                  │    │
│  │  ┌────────────────────────────────────┐                        │    │
│  │  │ Obtain medical records from ER     │ [IN_PROGRESS]          │    │
│  │  │ Due: Jan 15, 2024                 │                        │    │
│  │  └────────────────────────────────────┘                        │    │
│  │                                                                  │    │
│  │  ┌────────────────────────────────────┐                        │    │
│  │  │ Follow up with parents next week   │ [PENDING]              │    │
│  │  │ Due: Jan 17, 2024                 │                        │    │
│  │  └────────────────────────────────────┘                        │    │
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key UI Features

### Color-Coded Severity Indicators
- **CRITICAL**: Red background with red text
- **HIGH**: Orange background with orange text
- **MEDIUM**: Yellow background with yellow text
- **LOW**: Green background with green text

### Compliance Status Badges
- **COMPLIANT**: Green background
- **NON_COMPLIANT**: Red background
- **UNDER_REVIEW**: Yellow background
- **PENDING**: Gray background

### Action Status Indicators
- **COMPLETED**: Green badge with checkmark
- **IN_PROGRESS**: Blue badge
- **PENDING**: Gray badge
- **CANCELLED**: Red badge with strikethrough

### Interactive Elements

1. **Report Incident Button**: Primary action button (top right)
2. **View Details (👁)**: Opens detailed incident view
3. **Generate Report (📥)**: Downloads incident report document
4. **Add Witness Statement**: Opens form to add new statement
5. **Verify Statement**: Marks statement as verified
6. **Upload Evidence**: Opens file upload dialog
7. **Add Follow-up Action**: Creates new action item
8. **Send Notification**: Triggers parent notification

### Responsive Design

The interface adapts to different screen sizes:
- **Desktop**: Full layout with sidebar
- **Tablet**: Stacked layout with collapsible sections
- **Mobile**: Single column with expandable cards

### Accessibility Features

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Focus indicators on all interactive elements

## Document Generation Example

When generating an incident report, the system produces a structured document:

```
═══════════════════════════════════════════════════════════════
                    INCIDENT REPORT
                   INC-A1B2C3D4
═══════════════════════════════════════════════════════════════

Generated: January 10, 2024 at 3:00 PM

STUDENT INFORMATION
-------------------------------------------------------------------
Name:           Sarah Johnson
Student Number: 12345
Grade:          5th Grade
Date of Birth:  March 15, 2013

INCIDENT DETAILS
-------------------------------------------------------------------
Type:           INJURY
Severity:       CRITICAL
Occurred At:    January 10, 2024 at 2:30 PM
Location:       Playground
Description:    Student fell from monkey bars during recess...

Actions Taken:  
- Applied ice pack immediately
- Contacted parents
- Called 911 for transport to hospital
- Completed incident documentation

REPORTER INFORMATION
-------------------------------------------------------------------
Name:           Nurse Jane Smith
Role:           School Nurse
Reported At:    January 10, 2024 at 2:35 PM

WITNESS STATEMENTS
-------------------------------------------------------------------

Witness 1: Mr. Thompson (STAFF) - VERIFIED
"I was supervising recess when I saw Sarah fall from the 
monkey bars..."

Witness 2: Tommy Lee (STUDENT)
"I was playing nearby. Sarah was trying to do monkey bars 
and fell down..."

EVIDENCE
-------------------------------------------------------------------
Photos:         3 files attached
Videos:         0 files attached
Documents:      1 file attached

FOLLOW-UP ACTIONS
-------------------------------------------------------------------
1. Schedule follow-up assessment (Due: Jan 11, 2024) - COMPLETED
2. Obtain medical records from ER (Due: Jan 15, 2024) - IN PROGRESS
3. Follow up with parents next week (Due: Jan 17, 2024) - PENDING

PARENT NOTIFICATION
-------------------------------------------------------------------
Notified:       Yes
Method:         Email
Notified At:    January 10, 2024 at 2:45 PM
Notified By:    Nurse Jane Smith

INSURANCE INFORMATION
-------------------------------------------------------------------
Claim Number:   CLM-2024-001234
Status:         FILED

COMPLIANCE STATUS
-------------------------------------------------------------------
Legal Compliance: COMPLIANT

═══════════════════════════════════════════════════════════════
              End of Incident Report
═══════════════════════════════════════════════════════════════
```

## Navigation Flow

```
Dashboard (Overview)
    │
    ├─→ View All Reports
    │     │
    │     └─→ Incident Details
    │           │
    │           ├─→ Add Witness Statement
    │           ├─→ Upload Evidence
    │           ├─→ Add Follow-up Action
    │           ├─→ Send Parent Notification
    │           ├─→ Update Insurance Claim
    │           ├─→ Update Compliance Status
    │           └─→ Generate Report Document
    │
    └─→ Create New Incident Report
          │
          └─→ Incident Details (newly created)
```

## Summary

The Incident Reporting System UI provides:
- **Intuitive Navigation**: Clear paths between overview, list, and detail views
- **Visual Clarity**: Color-coded indicators for quick status recognition
- **Efficient Workflow**: Streamlined processes for common tasks
- **Comprehensive Information**: All relevant data accessible from detail view
- **Quick Actions**: One-click operations for frequent tasks
- **Responsive Design**: Works seamlessly across devices
- **Accessibility**: Meets WCAG standards for inclusive design

# White Cross Healthcare Platform - API Routes Inventory

**Generated:** 2025-10-23
**Framework:** Hapi.js
**API Version:** v1
**Base URL:** `/api/v1`

## Overview

This document provides a comprehensive inventory of all REST API endpoints in the White Cross Healthcare Platform backend. The API is organized into 10 major modules covering authentication, healthcare operations, compliance, and system administration.

### Route Statistics

| Module | Route Files | Total Endpoints | Notes |
|--------|-------------|-----------------|-------|
| **Core** | 4 | 51 | Auth, Users, Access Control, Contacts |
| **Healthcare** | 3 | 52 | Medications, Health Records, Health Assessments |
| **Operations** | 5 | 99 | Students, Appointments, Emergency Contacts, Inventory, Student Management |
| **Documents** | 1 | 18 | Document Management, Signatures, Templates |
| **Compliance** | 2 | 44 | Audit Logs, Compliance Reports, Policies, Consents |
| **Communications** | 3 | 21 | Messages, Broadcasts, Notifications |
| **Incidents** | 1 | 19 | Incident Reporting, Evidence, Witnesses, Follow-ups |
| **Analytics** | 1 | 15 | Health Metrics, Analytics, Dashboards, Custom Reports |
| **System** | 3 | 23 | Configuration, Integrations, Authentication |
| **TOTAL** | **23** | **342** | All production endpoints |

---

## Module Breakdown

### 1. Core Module (51 endpoints)

#### 1.1 Authentication (`/auth`) - 5 endpoints

| Method | Path | Auth | Description | Request Body | Response |
|--------|------|------|-------------|--------------|----------|
| POST | `/api/v1/auth/register` | None | Register new user | `{ email, password, firstName, lastName, role }` | `{ user, token }` |
| POST | `/api/v1/auth/login` | None | User login | `{ email, password }` | `{ user, token }` |
| POST | `/api/v1/auth/verify` | None | Verify JWT token | `{ token }` | `{ valid, user }` |
| POST | `/api/v1/auth/refresh` | None | Refresh JWT token | `{ token }` | `{ newToken, user }` |
| GET | `/api/v1/auth/me` | JWT | Get current user profile | N/A | `{ user }` |

**Service Layer:** `AuthService`
**Controllers:** `AuthController`
**Validators:** `auth.validators.ts` (registerSchema, loginSchema)

---

#### 1.2 User Management (`/users`) - 11 endpoints

| Method | Path | Auth | Description | Permissions | PHI |
|--------|------|------|-------------|-------------|-----|
| GET | `/api/v1/users` | JWT | List all users (paginated) | Any authenticated | No |
| GET | `/api/v1/users/{id}` | JWT | Get user by ID | Any authenticated | No |
| POST | `/api/v1/users` | JWT | Create new user | ADMIN only | No |
| PUT | `/api/v1/users/{id}` | JWT | Update user | ADMIN or self | No |
| POST | `/api/v1/users/{id}/change-password` | JWT | Change password | ADMIN or self | No |
| POST | `/api/v1/users/{id}/reset-password` | JWT | Reset password (admin) | ADMIN only | No |
| POST | `/api/v1/users/{id}/deactivate` | JWT | Deactivate user | ADMIN only | No |
| POST | `/api/v1/users/{id}/reactivate` | JWT | Reactivate user | ADMIN only | No |
| GET | `/api/v1/users/statistics` | JWT | Get user statistics | ADMIN/SCHOOL_ADMIN | No |
| GET | `/api/v1/users/role/{role}` | JWT | Get users by role | Any authenticated | No |
| GET | `/api/v1/users/nurses/available` | JWT | Get available nurses | Any authenticated | No |

**Query Parameters:**
- `GET /users`: `page`, `limit`, `role`, `active`, `search`

**Service Layer:** `UserService`
**Controllers:** `UsersController`
**Validators:** `users.validators.ts`

---

#### 1.3 Access Control (`/access-control`) - 27 endpoints

**Role Management (5 routes)**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/access-control/roles` | JWT | List all roles |
| GET | `/api/v1/access-control/roles/{id}` | JWT | Get role by ID |
| POST | `/api/v1/access-control/roles` | JWT | Create new role (ADMIN) |
| PUT | `/api/v1/access-control/roles/{id}` | JWT | Update role (ADMIN) |
| DELETE | `/api/v1/access-control/roles/{id}` | JWT | Delete role (ADMIN) |

**Permission Management (2 routes)**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/access-control/permissions` | JWT | List all permissions |
| POST | `/api/v1/access-control/permissions` | JWT | Create new permission (ADMIN) |

**Role-Permission Assignment (2 routes)**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/access-control/roles/{roleId}/permissions/{permissionId}` | JWT | Assign permission to role (ADMIN) |
| DELETE | `/api/v1/access-control/roles/{roleId}/permissions/{permissionId}` | JWT | Remove permission from role (ADMIN) |

**User-Role Assignment (2 routes)**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/access-control/users/{userId}/roles/{roleId}` | JWT | Assign role to user (ADMIN) |
| DELETE | `/api/v1/access-control/users/{userId}/roles/{roleId}` | JWT | Remove role from user (ADMIN) |

**User Permission Queries (2 routes)**

| Method | Path | Auth | Description | Query Params |
|--------|------|------|-------------|--------------|
| GET | `/api/v1/access-control/users/{userId}/permissions` | JWT | Get user permissions | N/A |
| GET | `/api/v1/access-control/users/{userId}/check` | JWT | Check specific permission | `resource`, `action` |

**Session Management (3 routes)**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/access-control/users/{userId}/sessions` | JWT | Get user sessions |
| DELETE | `/api/v1/access-control/sessions/{token}` | JWT | Delete specific session |
| DELETE | `/api/v1/access-control/users/{userId}/sessions` | JWT | Delete all user sessions |

**Security Incidents (3 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/access-control/security-incidents` | JWT | List security incidents (ADMIN) | No |
| POST | `/api/v1/access-control/security-incidents` | JWT | Create security incident (ADMIN) | No |
| PUT | `/api/v1/access-control/security-incidents/{id}` | JWT | Update security incident (ADMIN) | No |

**IP Restrictions (3 routes)**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/access-control/ip-restrictions` | JWT | List IP restrictions (ADMIN) |
| POST | `/api/v1/access-control/ip-restrictions` | JWT | Add IP restriction (ADMIN) |
| DELETE | `/api/v1/access-control/ip-restrictions/{id}` | JWT | Remove IP restriction (ADMIN) |

**Statistics & Utilities (2 routes)**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/access-control/statistics` | JWT | Get security statistics (ADMIN) |
| POST | `/api/v1/access-control/initialize-roles` | JWT | Initialize default roles (ADMIN) |

**Service Layer:** `AccessControlService`
**Controllers:** `AccessControlController`
**Validators:** `accessControl.validators.ts`

---

#### 1.4 Contact Management (`/contacts`) - 8 endpoints

| Method | Path | Auth | Description | Permissions | PHI |
|--------|------|------|-------------|-------------|-----|
| GET | `/api/v1/contacts` | JWT | List contacts (paginated) | Contact:List | Yes |
| GET | `/api/v1/contacts/{id}` | JWT | Get contact by ID | Contact:Read | Yes |
| POST | `/api/v1/contacts` | JWT | Create contact | Contact:Create | Yes |
| PUT | `/api/v1/contacts/{id}` | JWT | Update contact | Contact:Update | Yes |
| DELETE | `/api/v1/contacts/{id}` | JWT | Delete contact (soft delete) | Contact:Delete | Yes |
| GET | `/api/v1/contacts/search` | JWT | Search contacts | Contact:List | Yes |
| GET | `/api/v1/contacts/by-relation/{relationTo}` | JWT | Get contacts by relation | Contact:List | Yes |
| GET | `/api/v1/contacts/stats` | JWT | Get contact statistics | Contact:List | No |

**Query Parameters:**
- `GET /contacts`: `page`, `limit`, `orderBy`, `orderDirection`, `type`, `isActive`, `relationTo`, `search`
- `GET /contacts/search`: `query`, `limit`
- `GET /contacts/by-relation/{relationTo}`: `type`

**Service Layer:** `ContactService`
**Controllers:** `contacts.routes.ts` (inline handlers)
**Validators:** Joi schemas (inline)
**Types:** `ContactType` enum

---

### 2. Healthcare Module (52 endpoints)

#### 2.1 Medications (`/medications`) - 17 endpoints

**Medication CRUD (2 routes)**

| Method | Path | Auth | Description | Permissions | PHI |
|--------|------|------|-------------|-------------|-----|
| GET | `/api/v1/medications` | JWT | List all medications (paginated) | Any authenticated | No |
| POST | `/api/v1/medications` | JWT | Create new medication | NURSE/ADMIN | No |

**Prescription Management (2 routes)**

| Method | Path | Auth | Description | Permissions | PHI |
|--------|------|------|-------------|-------------|-----|
| POST | `/api/v1/medications/assign` | JWT | Assign medication to student | NURSE | Yes |
| PUT | `/api/v1/medications/student-medication/{id}/deactivate` | JWT | Deactivate student medication | NURSE | Yes |

**Administration Logging (2 routes)**

| Method | Path | Auth | Description | Permissions | PHI |
|--------|------|------|-------------|-------------|-----|
| POST | `/api/v1/medications/administration` | JWT | Log medication administration | NURSE | Yes |
| GET | `/api/v1/medications/logs/{studentId}` | JWT | Get student medication logs | NURSE (own patients) or ADMIN | Yes |

**Inventory Management (3 routes)**

| Method | Path | Auth | Description | Permissions | PHI |
|--------|------|------|-------------|-------------|-----|
| GET | `/api/v1/medications/inventory` | JWT | Get medication inventory | NURSE/ADMIN | No |
| POST | `/api/v1/medications/inventory` | JWT | Add to inventory | NURSE/ADMIN | No |
| PUT | `/api/v1/medications/inventory/{id}` | JWT | Update inventory quantity | NURSE/ADMIN | No |

**Scheduling & Reminders (2 routes)**

| Method | Path | Auth | Description | Permissions | PHI |
|--------|------|------|-------------|-------------|-----|
| GET | `/api/v1/medications/schedule` | JWT | Get medication schedule | NURSE | Yes |
| GET | `/api/v1/medications/reminders` | JWT | Get medication reminders | NURSE | Yes |

**Adverse Reactions (2 routes)**

| Method | Path | Auth | Description | Permissions | PHI |
|--------|------|------|-------------|-------------|-----|
| POST | `/api/v1/medications/adverse-reaction` | JWT | Report adverse reaction | NURSE | Yes |
| GET | `/api/v1/medications/adverse-reactions` | JWT | List adverse reactions | NURSE/ADMIN | Yes |

**Statistics & Utilities (4 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/medications/stats` | JWT | Get medication statistics | No |
| GET | `/api/v1/medications/alerts` | JWT | Get medication alerts | Yes |
| GET | `/api/v1/medications/form-options` | JWT | Get medication form options | No |

**Five Rights Validation:** Right Patient, Right Medication, Right Dose, Right Route, Right Time
**DEA Schedule Tracking:** Supports controlled substances (I-II) with witness requirements
**Service Layer:** `MedicationService`, `MedicationAdministrationService`, `MedicationInventoryService`
**Controllers:** `MedicationsController`
**Validators:** `medications.validators.ts`

---

#### 2.2 Health Records (`/health-records`) - 24 endpoints

**General Health Records (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/health-records/student/{studentId}` | JWT | Get all health records for student | Yes |
| GET | `/api/v1/health-records/{id}` | JWT | Get health record by ID | Yes |
| POST | `/api/v1/health-records` | JWT | Create health record | Yes |
| PUT | `/api/v1/health-records/{id}` | JWT | Update health record | Yes |
| DELETE | `/api/v1/health-records/{id}` | JWT | Delete health record | Yes |

**Allergies Management (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/health-records/student/{studentId}/allergies` | JWT | Get student allergies | Yes |
| GET | `/api/v1/health-records/allergies/{id}` | JWT | Get allergy by ID | Yes |
| POST | `/api/v1/health-records/allergies` | JWT | Create allergy record | Yes |
| PUT | `/api/v1/health-records/allergies/{id}` | JWT | Update allergy | Yes |
| DELETE | `/api/v1/health-records/allergies/{id}` | JWT | Delete allergy | Yes |

**Chronic Conditions Management (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/health-records/student/{studentId}/conditions` | JWT | Get student conditions | Yes |
| GET | `/api/v1/health-records/conditions/{id}` | JWT | Get condition by ID | Yes |
| POST | `/api/v1/health-records/conditions` | JWT | Create condition record | Yes |
| PUT | `/api/v1/health-records/conditions/{id}` | JWT | Update condition | Yes |
| DELETE | `/api/v1/health-records/conditions/{id}` | JWT | Delete condition | Yes |

**Vaccinations Management (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/health-records/student/{studentId}/vaccinations` | JWT | Get student vaccinations | Yes |
| GET | `/api/v1/health-records/vaccinations/{id}` | JWT | Get vaccination by ID | Yes |
| POST | `/api/v1/health-records/vaccinations` | JWT | Create vaccination record | Yes |
| PUT | `/api/v1/health-records/vaccinations/{id}` | JWT | Update vaccination | Yes |
| DELETE | `/api/v1/health-records/vaccinations/{id}` | JWT | Delete vaccination | Yes |

**Vital Signs Management (3 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/health-records/vitals` | JWT | Record vital signs | Yes |
| GET | `/api/v1/health-records/student/{studentId}/vitals/latest` | JWT | Get latest vital signs | Yes |
| GET | `/api/v1/health-records/student/{studentId}/vitals/history` | JWT | Get vital signs history | Yes |

**Health Summaries (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/health-records/student/{studentId}/summary` | JWT | Get complete health summary | Yes |
| GET | `/api/v1/health-records/student/{studentId}/immunization-status` | JWT | Get immunization compliance status | Yes |

**Service Layer:** `HealthRecordService`
**Controllers:** `HealthRecordsController`
**Validators:** `healthRecords.validators.ts`

---

#### 2.3 Health Assessments (`/health-assessments`) - 11 endpoints

**Risk Assessment (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/health-assessments/risk/{studentId}` | JWT | Get health risk assessment | Yes |
| GET | `/api/v1/health-assessments/high-risk-students` | JWT | List high-risk students | Yes |

**Health Screenings (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/health-assessments/screenings` | JWT | Record health screening | Yes |
| GET | `/api/v1/health-assessments/screenings/{studentId}` | JWT | Get student screenings | Yes |

**Growth Tracking (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/health-assessments/growth/{studentId}` | JWT | Record growth measurement | Yes |
| GET | `/api/v1/health-assessments/growth/{studentId}/analysis` | JWT | Get growth analysis (percentiles, trends) | Yes |

**Immunization Forecast (1 route)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/health-assessments/immunizations/{studentId}/forecast` | JWT | Get immunization forecast | Yes |

**Emergency Notifications (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/health-assessments/emergency/notify` | JWT | Send emergency notification | Yes |
| GET | `/api/v1/health-assessments/emergency/{studentId}` | JWT | Get emergency contact info | Yes |

**Medication Interactions (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/health-assessments/medication-interactions/{studentId}` | JWT | Get medication interactions | Yes |
| POST | `/api/v1/health-assessments/medication-interactions/{studentId}/check` | JWT | Check new medication interactions | Yes |

**Service Layer:** `HealthAssessmentService`
**Controllers:** `HealthAssessmentsController`
**Validators:** `healthAssessments.validators.ts`

---

### 3. Operations Module (99 endpoints)

#### 3.1 Students (`/students`) - 11 endpoints

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/students` | JWT | List all students (paginated) | Yes |
| GET | `/api/v1/students/{id}` | JWT | Get student by ID | Yes |
| POST | `/api/v1/students` | JWT | Create new student | Yes |
| PUT | `/api/v1/students/{id}` | JWT | Update student | Yes |
| DELETE | `/api/v1/students/{id}` | JWT | Delete student (soft delete) | Yes |
| GET | `/api/v1/students/{id}/health-summary` | JWT | Get student health summary | Yes |
| GET | `/api/v1/students/search` | JWT | Search students | Yes |
| GET | `/api/v1/students/school/{schoolId}` | JWT | Get students by school | Yes |
| GET | `/api/v1/students/grade/{grade}` | JWT | Get students by grade | Yes |
| POST | `/api/v1/students/{id}/assign-nurse` | JWT | Assign nurse to student | Yes |
| GET | `/api/v1/students/statistics` | JWT | Get student statistics | No |

**Query Parameters:**
- `GET /students`: `page`, `limit`, `schoolId`, `gradeLevel`, `nurseId`, `search`, `active`

**Service Layer:** `StudentService`
**Controllers:** `StudentsController`
**Validators:** `students.validators.ts`

---

#### 3.2 Emergency Contacts (`/emergency-contacts`) - 9 endpoints

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/emergency-contacts` | JWT | List all emergency contacts | Yes |
| GET | `/api/v1/emergency-contacts/{id}` | JWT | Get emergency contact by ID | Yes |
| POST | `/api/v1/emergency-contacts` | JWT | Create emergency contact | Yes |
| PUT | `/api/v1/emergency-contacts/{id}` | JWT | Update emergency contact | Yes |
| DELETE | `/api/v1/emergency-contacts/{id}` | JWT | Delete emergency contact | Yes |
| GET | `/api/v1/emergency-contacts/student/{studentId}` | JWT | Get contacts for student | Yes |
| POST | `/api/v1/emergency-contacts/{id}/set-primary` | JWT | Set as primary contact | Yes |
| POST | `/api/v1/emergency-contacts/{id}/verify` | JWT | Verify contact information | Yes |
| GET | `/api/v1/emergency-contacts/unverified` | JWT | List unverified contacts | Yes |

**Service Layer:** `EmergencyContactService`
**Controllers:** `EmergencyContactsController`
**Validators:** `emergencyContacts.validators.ts`

---

#### 3.3 Appointments (`/appointments`) - 18 endpoints

**Appointment CRUD (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/appointments` | JWT | List appointments (paginated) | Yes |
| GET | `/api/v1/appointments/{id}` | JWT | Get appointment by ID | Yes |
| POST | `/api/v1/appointments` | JWT | Create appointment | Yes |
| PUT | `/api/v1/appointments/{id}` | JWT | Update appointment | Yes |
| DELETE | `/api/v1/appointments/{id}` | JWT | Delete/cancel appointment | Yes |

**Appointment Status Management (4 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/appointments/{id}/confirm` | JWT | Confirm appointment | Yes |
| POST | `/api/v1/appointments/{id}/cancel` | JWT | Cancel appointment | Yes |
| POST | `/api/v1/appointments/{id}/complete` | JWT | Mark appointment as complete | Yes |
| POST | `/api/v1/appointments/{id}/no-show` | JWT | Mark as no-show | Yes |

**Appointment Queries (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/appointments/student/{studentId}` | JWT | Get student appointments | Yes |
| GET | `/api/v1/appointments/nurse/{nurseId}` | JWT | Get nurse appointments | Yes |
| GET | `/api/v1/appointments/upcoming` | JWT | Get upcoming appointments | Yes |
| GET | `/api/v1/appointments/today` | JWT | Get today's appointments | Yes |
| GET | `/api/v1/appointments/date/{date}` | JWT | Get appointments by date | Yes |

**Reminders & Notifications (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/appointments/{id}/send-reminder` | JWT | Send appointment reminder | Yes |
| GET | `/api/v1/appointments/pending-reminders` | JWT | Get appointments needing reminders | Yes |

**Statistics (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/appointments/statistics` | JWT | Get appointment statistics | No |
| GET | `/api/v1/appointments/no-show-rate` | JWT | Get no-show rate | No |

**Service Layer:** `AppointmentService`, `AppointmentSchedulingService`
**Controllers:** `AppointmentsController`
**Validators:** `appointments.validators.ts`

---

#### 3.4 Inventory (`/inventory`) - 19 endpoints

**Item Management (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/inventory/items` | JWT | List inventory items | No |
| GET | `/api/v1/inventory/items/{id}` | JWT | Get item by ID | No |
| POST | `/api/v1/inventory/items` | JWT | Create inventory item | No |
| PUT | `/api/v1/inventory/items/{id}` | JWT | Update inventory item | No |
| DELETE | `/api/v1/inventory/items/{id}` | JWT | Delete inventory item | No |

**Stock Management (4 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/inventory/stock/add` | JWT | Add stock | No |
| POST | `/api/v1/inventory/stock/remove` | JWT | Remove stock | No |
| POST | `/api/v1/inventory/stock/transfer` | JWT | Transfer stock | No |
| GET | `/api/v1/inventory/stock/low` | JWT | Get low stock items | No |

**Categories (3 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/inventory/categories` | JWT | List categories | No |
| POST | `/api/v1/inventory/categories` | JWT | Create category | No |
| PUT | `/api/v1/inventory/categories/{id}` | JWT | Update category | No |

**Purchase Orders (4 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/inventory/purchase-orders` | JWT | List purchase orders | No |
| POST | `/api/v1/inventory/purchase-orders` | JWT | Create purchase order | No |
| PUT | `/api/v1/inventory/purchase-orders/{id}` | JWT | Update purchase order | No |
| POST | `/api/v1/inventory/purchase-orders/{id}/receive` | JWT | Receive purchase order | No |

**Reports (3 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/inventory/reports/usage` | JWT | Get usage report | No |
| GET | `/api/v1/inventory/reports/valuation` | JWT | Get inventory valuation | No |
| GET | `/api/v1/inventory/reports/expiring` | JWT | Get expiring items | No |

**Service Layer:** `InventoryService`
**Controllers:** `InventoryController`
**Validators:** `inventory.validators.ts`

---

#### 3.5 Student Management (`/student-management`) - 11 endpoints

**Photo Management (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/student-management/photos/{studentId}` | JWT | Upload student photo | Yes |
| GET | `/api/v1/student-management/photos/{studentId}` | JWT | Get student photo | Yes |

**Academic Transcripts (3 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/student-management/transcripts/{studentId}` | JWT | Upload transcript | Yes |
| GET | `/api/v1/student-management/transcripts/{studentId}` | JWT | Get transcripts | Yes |
| DELETE | `/api/v1/student-management/transcripts/{transcriptId}` | JWT | Delete transcript | Yes |

**Grade Transitions (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/student-management/grade-transitions` | JWT | Record grade transition | Yes |
| GET | `/api/v1/student-management/grade-transitions/{studentId}` | JWT | Get grade transition history | Yes |

**Barcode Scanning (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/student-management/scan/{barcode}` | JWT | Scan student barcode | Yes |
| POST | `/api/v1/student-management/generate-barcode/{studentId}` | JWT | Generate student barcode | Yes |

**Waitlist Management (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/student-management/waitlist` | JWT | Add to waitlist | Yes |
| GET | `/api/v1/student-management/waitlist` | JWT | Get waitlist | Yes |

**Service Layer:** `StudentManagementService`
**Controllers:** `StudentManagementController`
**Validators:** `studentManagement.validators.ts`

---

### 4. Documents Module (18 endpoints)

**Document CRUD (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/documents` | JWT | List documents (paginated) | Conditional |
| GET | `/api/v1/documents/{id}` | JWT | Get document by ID | Conditional |
| POST | `/api/v1/documents` | JWT | Upload new document | Conditional |
| PUT | `/api/v1/documents/{id}` | JWT | Update document metadata | Conditional |
| DELETE | `/api/v1/documents/{id}` | JWT | Delete document (soft delete) | Conditional |

**Document Operations (3 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/documents/{id}/download` | JWT | Download document file | Conditional |
| POST | `/api/v1/documents/{id}/sign` | JWT | Sign document | Conditional |
| POST | `/api/v1/documents/{id}/share` | JWT | Share document | Conditional |

**Document Metadata (4 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/documents/{id}/signatures` | JWT | Get document signatures | No |
| GET | `/api/v1/documents/{id}/versions` | JWT | Get document versions | Conditional |
| GET | `/api/v1/documents/{id}/audit-trail` | JWT | Get document audit trail | No |
| GET | `/api/v1/documents/expiring` | JWT | Get expiring documents | Conditional |

**Templates (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/documents/templates` | JWT | List document templates | No |
| POST | `/api/v1/documents/templates/{templateId}/create` | JWT | Create from template | Conditional |

**Search & Analytics (4 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/documents/student/{studentId}` | JWT | Get student documents | Yes |
| GET | `/api/v1/documents/search` | JWT | Search documents | Conditional |
| GET | `/api/v1/documents/analytics` | JWT | Get document analytics | No |
| GET | `/api/v1/documents/categories` | JWT | List document categories | No |

**Service Layer:** `DocumentService`
**Controllers:** `DocumentsController`
**Validators:** `documents.validators.ts`

---

### 5. Compliance Module (44 endpoints)

#### 5.1 Audit Trail (`/audit`) - 15 endpoints

**Audit Log Management (3 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/audit/logs` | JWT | List audit logs (paginated, ADMIN) | Conditional |
| GET | `/api/v1/audit/logs/{id}` | JWT | Get audit log by ID (ADMIN) | Conditional |
| POST | `/api/v1/audit/logs` | JWT | Create audit log entry | No |

**PHI Access Tracking (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/audit/phi-access` | JWT | List PHI access logs (ADMIN) | Yes |
| POST | `/api/v1/audit/phi-access` | JWT | Log PHI access | Yes |

**Analytics & Reporting (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/audit/statistics` | JWT | Get audit statistics (ADMIN) | No |
| GET | `/api/v1/audit/user/{userId}/activity` | JWT | Get user activity (ADMIN) | Conditional |
| GET | `/api/v1/audit/security-analysis` | JWT | Get security analysis (ADMIN) | No |
| POST | `/api/v1/audit/security-analysis/run` | JWT | Run security analysis (ADMIN) | No |
| GET | `/api/v1/audit/anomalies` | JWT | Get anomaly detection results (ADMIN) | Conditional |

**Specialized Queries (3 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/audit/compliance-report` | JWT | Get HIPAA compliance report (ADMIN) | No |
| GET | `/api/v1/audit/session/{sessionId}` | JWT | Get session audit trail (ADMIN) | Conditional |
| GET | `/api/v1/audit/data-access/{resourceType}/{resourceId}` | JWT | Get resource access history (ADMIN) | Conditional |

**Data Management (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/audit/export` | JWT | Export audit logs (ADMIN) | Conditional |
| DELETE | `/api/v1/audit/logs/archive` | JWT | Archive old audit logs (ADMIN) | No |

**HIPAA Compliance:** 45 CFR § 164.308(a)(1)(ii)(D) - Audit logging
**Service Layer:** `AuditService`
**Controllers:** `AuditController`
**Validators:** `audit.validators.ts`

---

#### 5.2 Compliance Management (`/compliance`) - 29 endpoints

**Compliance Reports (6 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/compliance/reports` | JWT | List compliance reports (ADMIN) | No |
| GET | `/api/v1/compliance/reports/{id}` | JWT | Get compliance report by ID (ADMIN) | No |
| POST | `/api/v1/compliance/reports` | JWT | Create compliance report (ADMIN) | No |
| PUT | `/api/v1/compliance/reports/{id}` | JWT | Update compliance report (ADMIN) | No |
| DELETE | `/api/v1/compliance/reports/{id}` | JWT | Delete compliance report (ADMIN) | No |
| POST | `/api/v1/compliance/reports/generate` | JWT | Generate compliance report (ADMIN) | No |

**Compliance Checklists (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/compliance/checklists` | JWT | List checklists | No |
| GET | `/api/v1/compliance/checklists/{id}` | JWT | Get checklist by ID | No |
| POST | `/api/v1/compliance/checklists` | JWT | Create checklist (ADMIN) | No |
| PUT | `/api/v1/compliance/checklists/{id}` | JWT | Update checklist (ADMIN) | No |
| DELETE | `/api/v1/compliance/checklists/{id}` | JWT | Delete checklist (ADMIN) | No |

**Policy Management (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/compliance/policies` | JWT | List policies | No |
| GET | `/api/v1/compliance/policies/{policyId}` | JWT | Get policy by ID | No |
| POST | `/api/v1/compliance/policies` | JWT | Create policy (ADMIN) | No |
| PUT | `/api/v1/compliance/policies/{policyId}` | JWT | Update policy (ADMIN) | No |
| POST | `/api/v1/compliance/policies/{policyId}/acknowledge` | JWT | Acknowledge policy | No |

**Consent Management (6 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/compliance/consents/forms` | JWT | List consent forms | No |
| GET | `/api/v1/compliance/consents/forms/{id}` | JWT | Get consent form by ID | No |
| POST | `/api/v1/compliance/consents/forms` | JWT | Create consent form (ADMIN) | No |
| POST | `/api/v1/compliance/consents` | JWT | Sign consent form | Yes |
| GET | `/api/v1/compliance/consents/student/{studentId}` | JWT | Get student consents | Yes |
| PUT | `/api/v1/compliance/consents/{signatureId}/withdraw` | JWT | Withdraw consent | Yes |

**Statistics (1 route)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/compliance/statistics` | JWT | Get compliance statistics (ADMIN) | No |

**Service Layer:** `ComplianceService`
**Controllers:** `ComplianceController`, `AuditController`
**Validators:** `compliance.validators.ts`

---

### 6. Communications Module (21 endpoints)

#### 6.1 Messages (`/communications/messages`) - 12 endpoints

**Message CRUD (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/communications/messages` | JWT | List messages | Conditional |
| GET | `/api/v1/communications/messages/{id}` | JWT | Get message by ID | Conditional |
| POST | `/api/v1/communications/messages` | JWT | Send new message | Conditional |
| PUT | `/api/v1/communications/messages/{id}` | JWT | Update message | Conditional |
| DELETE | `/api/v1/communications/messages/{id}` | JWT | Delete message | Conditional |

**Message Operations (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/communications/messages/{id}/reply` | JWT | Reply to message | Conditional |
| GET | `/api/v1/communications/messages/inbox` | JWT | Get inbox messages | Conditional |
| GET | `/api/v1/communications/messages/sent` | JWT | Get sent messages | Conditional |

**Templates (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/communications/templates` | JWT | List message templates | No |
| POST | `/api/v1/communications/templates` | JWT | Create template | No |

**Delivery & Statistics (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/communications/delivery-status/{messageId}` | JWT | Get delivery status | No |
| GET | `/api/v1/communications/statistics` | JWT | Get messaging statistics | No |

---

#### 6.2 Broadcasts (`/communications/broadcasts`) - 8 endpoints

**Broadcast CRUD (3 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/communications/broadcasts` | JWT | Create broadcast | Conditional |
| GET | `/api/v1/communications/broadcasts` | JWT | List broadcasts | Conditional |
| GET | `/api/v1/communications/broadcasts/{id}` | JWT | Get broadcast by ID | Conditional |

**Broadcast Operations (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/communications/broadcasts/{id}/cancel` | JWT | Cancel broadcast | No |
| GET | `/api/v1/communications/broadcasts/{id}/recipients` | JWT | Get recipients | Conditional |
| GET | `/api/v1/communications/broadcasts/{id}/delivery-report` | JWT | Get delivery report | No |

**Scheduled Messages (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/communications/scheduled` | JWT | Schedule message | Conditional |
| GET | `/api/v1/communications/scheduled` | JWT | List scheduled messages | Conditional |

---

#### 6.3 Bulk Messaging (`/communication/bulk`) - 1 endpoint

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/communication/bulk-messages` | JWT | Send bulk messages | Conditional |

**HIPAA Compliance:** All communications are audited
**Service Layer:** `MessageService`, `BroadcastService`
**Controllers:** `MessagesController`, `BroadcastsController`, `MessagingController`
**Validators:** `messages.validators.ts`, `broadcasts.validators.ts`, `messaging.validators.ts`

---

### 7. Incidents Module (19 endpoints)

**Incident CRUD (6 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/incidents` | JWT | List incidents (paginated) | Yes |
| GET | `/api/v1/incidents/{id}` | JWT | Get incident by ID | Yes |
| POST | `/api/v1/incidents` | JWT | Create incident report | Yes |
| PUT | `/api/v1/incidents/{id}` | JWT | Update incident | Yes |
| DELETE | `/api/v1/incidents/{id}` | JWT | Delete incident (soft delete) | Yes |
| GET | `/api/v1/incidents/student/{studentId}` | JWT | Get student incidents | Yes |

**Evidence Management (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/incidents/{id}/evidence` | JWT | Add evidence to incident | Yes |
| GET | `/api/v1/incidents/{id}/evidence` | JWT | Get incident evidence | Yes |

**Witness Management (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/incidents/{id}/witnesses` | JWT | Add witness statement | Yes |
| GET | `/api/v1/incidents/{id}/witnesses` | JWT | Get witness statements | Yes |

**Follow-ups (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/incidents/{id}/follow-ups` | JWT | Add follow-up action | Yes |
| GET | `/api/v1/incidents/{id}/follow-ups` | JWT | Get follow-up actions | Yes |

**Notifications & Analytics (7 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/incidents/{id}/notify` | JWT | Send incident notification | Yes |
| GET | `/api/v1/incidents/types` | JWT | Get incident types | No |
| GET | `/api/v1/incidents/severity-levels` | JWT | Get severity levels | No |
| GET | `/api/v1/incidents/statistics` | JWT | Get incident statistics | No |
| GET | `/api/v1/incidents/trends` | JWT | Get incident trends | No |
| GET | `/api/v1/incidents/by-type/{type}` | JWT | Get incidents by type | Yes |
| GET | `/api/v1/incidents/by-severity/{severity}` | JWT | Get incidents by severity | Yes |

**Service Layer:** `IncidentService`
**Controllers:** `IncidentsController`
**Validators:** `incidents.validators.ts`

---

### 8. Analytics Module (15 endpoints)

**Health Metrics (4 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/analytics/health-metrics` | JWT | Get aggregated health metrics | No |
| GET | `/api/v1/analytics/health-trends` | JWT | Get health trends | No |
| GET | `/api/v1/analytics/health-metrics/student/{studentId}` | JWT | Get student health metrics | Yes |
| GET | `/api/v1/analytics/health-metrics/school/{schoolId}` | JWT | Get school health metrics | No |

**Incident Analytics (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/analytics/incidents/trends` | JWT | Get incident trends | No |
| GET | `/api/v1/analytics/incidents/by-location` | JWT | Get incidents by location | No |

**Medication Analytics (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/analytics/medications/usage` | JWT | Get medication usage stats | No |
| GET | `/api/v1/analytics/medications/adherence` | JWT | Get medication adherence | No |

**Appointment Analytics (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/analytics/appointments/trends` | JWT | Get appointment trends | No |
| GET | `/api/v1/analytics/appointments/no-show-rate` | JWT | Get no-show rate | No |

**Dashboards (3 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/analytics/dashboard/nurse` | JWT | Get nurse dashboard | Conditional |
| GET | `/api/v1/analytics/dashboard/admin` | JWT | Get admin dashboard | No |
| GET | `/api/v1/analytics/summary` | JWT | Get platform summary | No |

**Custom Reports (2 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/analytics/reports/custom` | JWT | Create custom report | Conditional |
| GET | `/api/v1/analytics/reports/{id}` | JWT | Get custom report | Conditional |

**Service Layer:** `AnalyticsService`, `DashboardService`, `HealthMetricsService`
**Controllers:** `AnalyticsController`
**Validators:** `analytics.validators.ts`

---

### 9. System Module (23 endpoints)

#### 9.1 Configuration (`/system/configuration`) - 7 endpoints

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/system/configuration` | JWT | Get system configuration (ADMIN) | No |
| PUT | `/api/v1/system/configuration` | JWT | Update system configuration (ADMIN) | No |
| GET | `/api/v1/system/schools` | JWT | List schools | No |
| POST | `/api/v1/system/schools` | JWT | Create school (ADMIN) | No |
| PUT | `/api/v1/system/schools/{id}` | JWT | Update school (ADMIN) | No |
| GET | `/api/v1/system/feature-flags` | JWT | Get feature flags | No |
| PUT | `/api/v1/system/feature-flags/{flag}` | JWT | Update feature flag (ADMIN) | No |

---

#### 9.2 Integrations (`/system/integrations`) - 11 endpoints

**Integration Configuration (5 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| GET | `/api/v1/system/integrations` | JWT | List integrations (ADMIN) | No |
| GET | `/api/v1/system/integrations/{id}` | JWT | Get integration by ID (ADMIN) | No |
| POST | `/api/v1/system/integrations` | JWT | Create integration (ADMIN) | No |
| PUT | `/api/v1/system/integrations/{id}` | JWT | Update integration (ADMIN) | No |
| DELETE | `/api/v1/system/integrations/{id}` | JWT | Delete integration (ADMIN) | No |

**Integration Operations (3 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/system/integrations/{id}/test` | JWT | Test integration (ADMIN) | No |
| POST | `/api/v1/system/integrations/{id}/enable` | JWT | Enable integration (ADMIN) | No |
| POST | `/api/v1/system/integrations/{id}/disable` | JWT | Disable integration (ADMIN) | No |

**Sync Operations (3 routes)**

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/system/sync/students` | JWT | Sync students (ADMIN) | Yes |
| POST | `/api/v1/system/sync/health-records` | JWT | Sync health records (ADMIN) | Yes |
| GET | `/api/v1/system/sync/status` | JWT | Get sync status (ADMIN) | No |

---

#### 9.3 Authentication & Monitoring (`/system/authentication`) - 5 endpoints

| Method | Path | Auth | Description | PHI |
|--------|------|------|-------------|-----|
| POST | `/api/v1/system/mfa/setup` | JWT | Setup MFA | No |
| POST | `/api/v1/system/mfa/verify` | JWT | Verify MFA | No |
| POST | `/api/v1/system/mfa/disable` | JWT | Disable MFA | No |
| GET | `/api/v1/system/health` | None | Get system health | No |
| GET | `/api/v1/system/features/{feature}/status` | JWT | Get feature status | No |

**Service Layer:** `IntegrationService`, `ConfigurationService`, `VendorService`
**Controllers:** `IntegrationsController`, `ConfigurationController`, `AuthenticationController`
**Validators:** `system.validators.ts`, `authentication.validators.ts`

---

## Authentication & Authorization

### Authentication Strategies

**JWT-based Authentication:**
- All endpoints except `/auth/register`, `/auth/login`, `/auth/verify`, `/auth/refresh`, and `/system/health` require JWT authentication
- JWT tokens are passed via `Authorization: Bearer <token>` header
- Token expiration: 24 hours (configurable)
- Refresh tokens available via `/auth/refresh`

### Authorization Models

**Role-Based Access Control (RBAC):**
- Roles: `ADMIN`, `DISTRICT_ADMIN`, `SCHOOL_ADMIN`, `NURSE`, `COUNSELOR`, `VIEWER`
- Permissions: Resource-Action pairs (e.g., `Student:Read`, `Medication:Administer`)
- Managed via `/access-control` endpoints

**Resource-Level Permissions:**
- Users can only access students assigned to them (unless ADMIN)
- Nurses can only administer medications to their assigned students
- Documents have access control lists (ACLs)

---

## PHI (Protected Health Information) Handling

### PHI Classification

**High PHI Endpoints:**
- All `/medications/*` endpoints (except list and form-options)
- All `/health-records/*` endpoints
- All `/health-assessments/*` endpoints
- `/students/*` endpoints containing health data
- `/incidents/*` endpoints

**Conditional PHI:**
- `/documents/*` - depends on document type
- `/communications/*` - depends on message content
- `/analytics/*` - depends on aggregation level

### HIPAA Compliance Requirements

**Audit Logging:**
- All PHI access is automatically logged via `/audit/phi-access`
- Audit logs include: user, resource, action, timestamp, IP address, result
- Audit logs retained for 6 years (HIPAA requirement)

**Access Controls:**
- Minimum necessary standard enforced
- Role-based and resource-level permissions
- Session tracking and forced logout capabilities

**Encryption:**
- PHI encrypted at rest (database-level encryption)
- PHI encrypted in transit (HTTPS/TLS)
- Document files encrypted with AES-256

---

## Request/Response Patterns

### Standard Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
X-Request-ID: <uuid> (optional, for tracing)
```

### Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "errors": [ ... ] // Validation errors if applicable
  }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource, business rule violation |
| 500 | Internal Server Error | Unexpected server error |

---

## Validation Schemas

All endpoints use Joi validation schemas defined in `validators/*.validators.ts` files:

- **Auth Validators:** `registerSchema`, `loginSchema`
- **Users Validators:** `createUserSchema`, `updateUserSchema`, `changePasswordSchema`, `resetPasswordSchema`
- **Students Validators:** `createStudentSchema`, `updateStudentSchema`, `assignNurseSchema`
- **Medications Validators:** `createMedicationSchema`, `assignMedicationToStudentSchema`, `logMedicationAdministrationSchema`
- **Health Records Validators:** `createHealthRecordSchema`, `createAllergySchema`, `createVaccinationSchema`
- **Documents Validators:** `uploadDocumentSchema`, `signDocumentSchema`, `shareDocumentSchema`
- **Compliance Validators:** `createAuditLogSchema`, `createComplianceReportSchema`, `createPolicySchema`

---

## Service Layer Architecture

### Service Organization

```
backend/src/services/
├── core/
│   ├── AuthService.ts
│   ├── UserService.ts
│   ├── AccessControlService.ts
│   └── ContactService.ts
├── healthcare/
│   ├── MedicationService.ts
│   ├── MedicationAdministrationService.ts
│   ├── HealthRecordService.ts
│   └── HealthAssessmentService.ts
├── operations/
│   ├── StudentService.ts
│   ├── AppointmentService.ts
│   ├── EmergencyContactService.ts
│   └── InventoryService.ts
├── compliance/
│   ├── AuditService.ts
│   └── ComplianceService.ts
├── communications/
│   ├── MessageService.ts
│   └── BroadcastService.ts
├── documents/
│   └── DocumentService.ts
├── incidents/
│   └── IncidentService.ts
├── analytics/
│   ├── AnalyticsService.ts
│   ├── DashboardService.ts
│   └── HealthMetricsService.ts
└── system/
    ├── IntegrationService.ts
    ├── ConfigurationService.ts
    └── VendorService.ts
```

### Service Patterns

**Base Service Pattern:**
- All services extend `BaseService` class
- Standard CRUD operations: `create`, `read`, `update`, `delete`, `list`
- Transaction support for multi-step operations
- Error handling with typed errors (`ServiceError`, `ValidationError`, `NotFoundError`)

**Business Logic Separation:**
- Controllers handle HTTP request/response
- Services handle business logic and data access
- Repositories handle database queries
- Validators handle input validation

---

## Query Parameters Reference

### Common Query Parameters

**Pagination:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `orderBy` (string) - Field to sort by
- `orderDirection` (string: 'ASC'|'DESC', default: 'ASC') - Sort direction

**Filtering:**
- `search` (string) - Full-text search across relevant fields
- `status` (string) - Filter by status
- `active` (boolean) - Filter by active/inactive
- `startDate` (ISO date) - Filter by start date
- `endDate` (ISO date) - Filter by end date

**Domain-Specific:**
- `studentId` (UUID) - Filter by student
- `nurseId` (UUID) - Filter by nurse
- `schoolId` (UUID) - Filter by school
- `gradeLevel` (string) - Filter by grade level
- `type` (string) - Filter by entity type

---

## Rate Limiting & Throttling

**Not Currently Implemented** - Recommended for production:
- 100 requests/minute per user for general endpoints
- 1000 requests/minute per user for high-traffic endpoints (search, list)
- 10 requests/minute for authentication endpoints
- 5 requests/minute for password reset

---

## Deprecation Policy

**No Deprecated Endpoints** - All routes are current as of 2025-10-23.

**Future Deprecation Process:**
1. Add `Deprecated` header to response
2. Update API documentation
3. Provide 6-month sunset period
4. Create migration guide
5. Remove deprecated endpoint

---

## External Integration Endpoints

The system supports integrations with:
- **Student Information Systems (SIS):** PowerSchool, Infinite Campus, Skyward
- **Electronic Health Records (EHR):** Epic, Cerner, Meditech
- **Immunization Registries:** State-specific registries
- **Vendor Systems:** Custom vendor integrations

All integration endpoints are under `/system/integrations/*` and `/system/sync/*`.

---

## File Upload Endpoints

**File Upload Support:**
- `POST /api/v1/documents` - General document upload
- `POST /api/v1/incidents/{id}/evidence` - Incident evidence upload
- `POST /api/v1/student-management/photos/{studentId}` - Student photo upload
- `POST /api/v1/student-management/transcripts/{studentId}` - Academic transcript upload

**Upload Requirements:**
- Content-Type: `multipart/form-data`
- Max file size: 10 MB (configurable)
- Allowed types: PDF, JPEG, PNG, DOCX (document-specific)
- Files encrypted at rest (AES-256)

---

## WebSocket/Real-Time Endpoints

**Not Currently Implemented** - Recommended for future:
- Real-time medication reminders
- Live appointment notifications
- Emergency alert broadcasts
- Dashboard live updates

---

## API Versioning Strategy

**Current Version:** v1 (all endpoints under `/api/v1/*`)

**Version Management:**
- URL-based versioning (e.g., `/api/v1`, `/api/v2`)
- Major version changes for breaking changes
- Minor version changes handled via backward compatibility
- Version sunset period: 12 months minimum

---

## Testing & Development

**Swagger/OpenAPI Documentation:**
- Available at `/documentation` endpoint
- Auto-generated from route definitions
- Includes request/response schemas, examples, and authentication requirements

**Development Utilities:**
- `POST /api/v1/access-control/initialize-roles` - Initialize default RBAC roles
- `GET /api/v1/system/health` - System health check
- `GET /api/v1/system/features/{feature}/status` - Feature flag status

---

## Future Endpoint Roadmap

**Planned Additions:**
- Parent Portal API (`/parent/*`)
- Mobile App Endpoints (`/mobile/*`)
- Telehealth Integration (`/telehealth/*`)
- Prescription E-Prescribing (`/e-prescribe/*`)
- Bulk Operations API (`/bulk/*`)

---

## Contact & Support

For API support, questions, or issues:
- **Technical Documentation:** See `backend/src/routes/` for implementation details
- **Issue Tracking:** GitHub Issues
- **API Updates:** Check `CHANGELOG.md` for version updates

---

**End of API Routes Inventory**

Total Endpoints Documented: **342**
Last Updated: 2025-10-23
Maintained By: TypeScript Architect Agent

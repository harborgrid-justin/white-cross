# Medication Services JSDoc Documentation Guide

## Overview
This document provides comprehensive JSDoc documentation templates for all medication-related service files in the backend. Each service follows healthcare compliance standards (HIPAA, DEA) and implements critical safety features including Five Rights validation and controlled substance tracking.

---

## 1. administrationService.ts

### File-Level Documentation
```typescript
/**
 * @fileoverview Medication Administration Tracking Service - Critical Healthcare Service
 * @module services/medication/administrationService
 * @description HIPAA-compliant medication administration logging with Five Rights validation
 *
 * Key Features:
 * - Five Rights of Medication Administration validation
 *   - Right Patient: Verified via StudentMedication lookup
 *   - Right Drug: Verified via Medication model
 *   - Right Dose: Logged in dosageGiven field
 *   - Right Route: Validated against prescription
 *   - Right Time: Recorded in timeGiven timestamp
 * - Complete audit trail for every administration event
 * - Nurse verification and authorization
 * - Prescription status validation (must be active)
 * - Side effect tracking and documentation
 * - Witness requirement support for controlled substances
 *
 * @compliance HIPAA Privacy Rule §164.308 - Access controls and audit logs
 * @compliance HIPAA Security Rule §164.312 - Audit controls
 * @safety Five Rights validation prevents medication errors
 * @safety Active prescription check prevents unauthorized administration
 * @audit Every administration logged with complete context
 *
 * @requires ../../database/models/MedicationLog
 * @requires ../../database/models/StudentMedication
 * @requires ../../database/models/Medication
 * @requires ../../database/models/Student
 * @requires ../../database/models/User
 *
 * @see {@link https://www.ismp.org/five-rights-medication-administration|Five Rights of Medication}
 *
 * LOC: 7359200817-ADM
 * Last Updated: 2025-10-22
 */
```

### Class Documentation
```typescript
/**
 * @class AdministrationService
 * @description Service for logging and tracking medication administration with Five Rights validation
 *
 * Safety Features:
 * - Five Rights validation (Patient, Drug, Dose, Route, Time)
 * - Active prescription verification
 * - Nurse authorization checks
 * - Complete audit trail logging
 * - Side effect documentation
 * - Witness support for controlled substances
 */
```

### Method: logMedicationAdministration
```typescript
/**
 * @method logMedicationAdministration
 * @description Log medication administration with Five Rights validation and complete audit trail
 * @async
 * @static
 *
 * @param {CreateMedicationLogData} data - Administration details
 * @param {string} data.studentMedicationId - Student prescription UUID (RIGHT PATIENT, RIGHT DRUG)
 * @param {string} data.nurseId - Administering nurse UUID (authorization)
 * @param {string} data.dosageGiven - Dosage administered with unit (RIGHT DOSE) - e.g., "10 mg", "5 mL"
 * @param {Date} data.timeGiven - Administration timestamp (RIGHT TIME)
 * @param {string} [data.notes] - Optional administration notes
 * @param {string} [data.sideEffects] - Optional side effects observed
 * @param {string} [data.witnessedBy] - Optional witness for controlled substances (Schedule II)
 *
 * @returns {Promise<MedicationLog>} Complete administration log with associations
 * @returns {Object} log.studentMedication - Linked prescription details
 * @returns {Object} log.studentMedication.medication - Medication information
 * @returns {Object} log.studentMedication.student - Student information
 * @returns {Object} log.nurse - Administering nurse information
 *
 * @throws {Error} When student medication prescription not found (RIGHT PATIENT/DRUG validation failure)
 * @throws {Error} When medication prescription is not active (safety check)
 * @throws {Error} When nurse not found (authorization failure)
 *
 * @safety Five Rights Validation
 * - RIGHT PATIENT: Verified via StudentMedication lookup and Student association
 * - RIGHT DRUG: Verified via Medication model association
 * - RIGHT DOSE: Recorded in dosageGiven field, should match prescription
 * - RIGHT ROUTE: Should be validated by caller against prescription route
 * - RIGHT TIME: Recorded with precise timestamp in timeGiven
 *
 * @safety Active Prescription Check
 * Prevents administration of discontinued or expired medications
 *
 * @audit Complete Audit Trail
 * - Medication name and details logged
 * - Student identification logged (name, number)
 * - Nurse identification logged (name, ID)
 * - Dosage and time recorded
 * - All data logged to application logger
 *
 * @compliance HIPAA Privacy Rule §164.308(a)(1)(ii)(D) - Audit controls required
 * @compliance HIPAA Security Rule §164.312(b) - Audit controls and monitoring
 *
 * @example
 * // Standard medication administration
 * const log = await AdministrationService.logMedicationAdministration({
 *   studentMedicationId: 'med-123',
 *   nurseId: 'nurse-456',
 *   dosageGiven: '10 mg',
 *   timeGiven: new Date(),
 *   notes: 'Given with water, patient in good spirits'
 * });
 *
 * @example
 * // Controlled substance (Schedule II) administration with witness
 * const log = await AdministrationService.logMedicationAdministration({
 *   studentMedicationId: 'controlled-med-789',
 *   nurseId: 'nurse-456',
 *   dosageGiven: '5 mg',
 *   timeGiven: new Date(),
 *   witnessedBy: 'witness-nurse-012', // Required for Schedule II
 *   notes: 'DEA Schedule II - Witnessed by RN Smith'
 * });
 */
```

### Method: getStudentMedicationLogs
```typescript
/**
 * @method getStudentMedicationLogs
 * @description Retrieve paginated medication administration logs for a specific student
 * @async
 * @static
 *
 * @param {string} studentId - Student UUID to retrieve logs for
 * @param {number} [page=1] - Page number for pagination (1-indexed)
 * @param {number} [limit=20] - Number of records per page
 *
 * @returns {Promise<Object>} Paginated medication logs
 * @returns {MedicationLog[]} result.logs - Array of medication logs with full associations
 * @returns {Object} result.logs[].studentMedication - Prescription details
 * @returns {Object} result.logs[].studentMedication.medication - Medication information
 * @returns {Object} result.logs[].nurse - Administering nurse details
 * @returns {Object} result.pagination - Pagination metadata
 * @returns {number} result.pagination.page - Current page number
 * @returns {number} result.pagination.limit - Records per page
 * @returns {number} result.pagination.total - Total number of logs
 * @returns {number} result.pagination.pages - Total number of pages
 *
 * @throws {Error} When database query fails
 *
 * @audit HIPAA Compliance
 * This method provides access to PHI (Protected Health Information) and must be
 * called only by authorized personnel with appropriate access controls
 *
 * @example
 * // Get first page of medication logs for a student
 * const result = await AdministrationService.getStudentMedicationLogs('student-uuid');
 * console.log(`Found ${result.pagination.total} total administrations`);
 * result.logs.forEach(log => {
 *   console.log(`${log.studentMedication.medication.name} at ${log.timeGiven}`);
 * });
 */
```

---

## 2. adverseReactionService.ts

### File-Level Documentation
```typescript
/**
 * @fileoverview Adverse Reaction Tracking Service - Critical Patient Safety Service
 * @module services/medication/adverseReactionService
 * @description HIPAA-compliant adverse medication reaction reporting with automatic escalation
 *
 * Key Features:
 * - Adverse reaction documentation and tracking
 * - Automatic incident report generation
 * - Severity-based escalation (MILD, MODERATE, SEVERE, LIFE_THREATENING)
 * - Parent notification automation for severe reactions
 * - Follow-up requirement tracking
 * - Integration with incident reporting system
 * - Medication-specific reaction history
 *
 * @compliance HIPAA Privacy Rule §164.308 - PHI security and access controls
 * @compliance FDA MedWatch - Adverse event reporting requirements
 * @safety Automatic escalation prevents delayed response
 * @safety Severity classification guides emergency response
 * @audit All adverse reactions logged to incident system
 *
 * @requires ../../database/models/IncidentReport
 * @requires ../../database/models/StudentMedication
 * @requires ../../database/models/Medication
 * @requires ../../database/models/Student
 * @requires ../../database/models/User
 *
 * @see {@link https://www.fda.gov/safety/medwatch-fda-safety-information-and-adverse-event-reporting-program|FDA MedWatch}
 *
 * LOC: 7359200817-ADV
 * Last Updated: 2025-10-22
 */
```

### Class Documentation
```typescript
/**
 * @class AdverseReactionService
 * @description Service for tracking and reporting adverse medication reactions with automatic escalation
 *
 * Safety Features:
 * - Severity classification (MILD, MODERATE, SEVERE, LIFE_THREATENING)
 * - Automatic incident report creation
 * - Parent notification for severe reactions
 * - Follow-up requirement tracking
 * - Action documentation
 * - Medication linkage for trend analysis
 *
 * Severity Levels:
 * - MILD: Minor discomfort, no intervention needed
 * - MODERATE: Requires monitoring or minor intervention
 * - SEVERE: Requires immediate medical attention
 * - LIFE_THREATENING: Emergency response required, 911 called
 */
```

### Method: reportAdverseReaction
```typescript
/**
 * @method reportAdverseReaction
 * @description Report adverse reaction to medication with automatic incident creation and escalation
 * @async
 * @static
 *
 * @param {CreateAdverseReactionData} data - Adverse reaction details
 * @param {string} data.studentMedicationId - Student prescription UUID causing reaction
 * @param {string} data.reportedBy - Reporter (nurse/staff) UUID
 * @param {'MILD'|'MODERATE'|'SEVERE'|'LIFE_THREATENING'} data.severity - Reaction severity level
 * @param {string} data.reaction - Detailed description of adverse reaction
 * @param {string} data.actionTaken - Immediate actions taken (e.g., "Administered antihistamine", "Called 911")
 * @param {string} [data.notes] - Additional notes or context
 * @param {Date} data.reportedAt - When reaction occurred/was observed
 *
 * @returns {Promise<IncidentReport>} Created incident report with associations
 * @returns {Object} report.student - Student information
 * @returns {Object} report.reportedBy - Reporter information
 * @returns {boolean} report.parentNotified - Auto-set to true for SEVERE/LIFE_THREATENING
 * @returns {boolean} report.followUpRequired - Auto-set based on severity
 *
 * @throws {Error} When student medication not found
 * @throws {Error} When reporter not found
 *
 * @safety Automatic Escalation
 * - SEVERE/LIFE_THREATENING: Parents automatically marked as notified
 * - Non-MILD reactions: Follow-up automatically required
 * - Incident report created for regulatory compliance
 *
 * @audit Complete Documentation
 * - Medication and student linked
 * - Severity and actions recorded
 * - Reporter identified
 * - Timestamp captured
 *
 * @compliance FDA MedWatch reporting requirements
 * @compliance HIPAA incident documentation
 *
 * @example
 * // Report mild reaction
 * const report = await AdverseReactionService.reportAdverseReaction({
 *   studentMedicationId: 'med-123',
 *   reportedBy: 'nurse-456',
 *   severity: 'MILD',
 *   reaction: 'Slight nausea, resolved within 10 minutes',
 *   actionTaken: 'Student given water, monitored for 15 minutes',
 *   reportedAt: new Date()
 * });
 *
 * @example
 * // Report severe allergic reaction
 * const report = await AdverseReactionService.reportAdverseReaction({
 *   studentMedicationId: 'med-789',
 *   reportedBy: 'nurse-456',
 *   severity: 'SEVERE',
 *   reaction: 'Hives, difficulty breathing, swelling of face',
 *   actionTaken: 'Administered epinephrine, called 911, parent called',
 *   notes: 'EMS arrived in 8 minutes, transported to General Hospital ER',
 *   reportedAt: new Date()
 * });
 */
```

### Method: getAdverseReactions
```typescript
/**
 * @method getAdverseReactions
 * @description Retrieve adverse reaction reports with optional filtering by medication or student
 * @async
 * @static
 *
 * @param {string} [medicationId] - Optional medication UUID to filter reactions
 * @param {string} [studentId] - Optional student UUID to filter reactions
 *
 * @returns {Promise<IncidentReport[]>} Array of adverse reaction incident reports
 * @returns {Object} report[].student - Student who experienced reaction
 * @returns {Object} report[].reportedBy - Staff member who reported
 * @returns {string} report[].severity - Reaction severity level
 * @returns {string} report[].description - Detailed reaction description
 * @returns {Date} report[].occurredAt - When reaction occurred
 *
 * @throws {Error} When database query fails
 *
 * @audit Filtered Access
 * Results include PHI and must be accessed only by authorized personnel
 *
 * @example
 * // Get all reactions for a medication
 * const reactions = await AdverseReactionService.getAdverseReactions('med-123');
 * console.log(`${reactions.length} adverse reactions reported for this medication`);
 *
 * @example
 * // Get all reactions for a student
 * const reactions = await AdverseReactionService.getAdverseReactions(undefined, 'student-456');
 */
```

---

## 3. controlledSubstanceLogger.ts

### File-Level Documentation
```typescript
/**
 * @fileoverview DEA-Compliant Controlled Substance Logging Service
 * @module services/medication/controlledSubstanceLogger
 * @description Federal DEA-compliant tracking of controlled substances with complete audit trail
 *
 * Key Features:
 * - DEA Schedule I-V classification tracking
 * - DEA Form 222 documentation
 * - Witness requirement enforcement for Schedule I/II
 * - Transaction types: Receipt, Administration, Waste, Transfer, Adjustment
 * - Inventory balance tracking with discrepancy detection
 * - Disposal documentation (method, witness, license)
 * - Physical inventory count reconciliation
 * - Automatic alert generation for discrepancies
 * - Bi-directional transfer tracking
 * - Lot number and expiration tracking
 *
 * DEA Schedule Classifications:
 * - Schedule I: No accepted medical use (rarely in schools)
 * - Schedule II: High abuse potential - Adderall, Ritalin, morphine
 * - Schedule III: Moderate abuse potential - codeine combinations
 * - Schedule IV: Lower abuse potential - Xanax, Valium
 * - Schedule V: Lowest abuse potential - cough preparations with codeine
 *
 * @compliance DEA Controlled Substances Act 21 USC §801
 * @compliance DEA Form 222 Requirements
 * @compliance 21 CFR Part 1304 - Records and Reports
 * @safety Witness requirement prevents diversion
 * @safety Discrepancy tracking detects theft or errors
 * @audit Every transaction creates permanent audit record
 *
 * @requires ../auditService
 * @requires ../../utils/logger
 *
 * @see {@link https://www.dea.gov/drug-information/drug-scheduling|DEA Drug Scheduling}
 * @see {@link https://www.deadiversion.usdoj.gov/21cfr_reports/index.html|DEA 21 CFR}
 *
 * LOC: CS001LOG
 * Last Updated: 2025-10-22
 */
```

### Class Documentation
```typescript
/**
 * @class ControlledSubstanceLogger
 * @description DEA-compliant service for logging all controlled substance transactions
 *
 * Safety & Compliance Features:
 * - DEA Schedule I-V tracking
 * - Witness requirement for Schedule I/II administration and waste
 * - Complete chain of custody documentation
 * - Inventory balance validation (prevents negative balances)
 * - Discrepancy detection and flagging
 * - Disposal witness with license tracking
 * - Periodic inventory count requirements
 * - Transaction history for audits
 *
 * Transaction Types:
 * - RECEIPT: Received from pharmacy/distributor (requires DEA Form 222 for Schedule II)
 * - ADMINISTRATION: Given to student (requires witness for Schedule II)
 * - WASTE: Disposal/destruction (requires witness and method documentation)
 * - RETURN: Returned to pharmacy
 * - TRANSFER_IN/OUT: Between locations
 * - INVENTORY_ADJUSTMENT: Physical count corrections
 * - EXPIRED: Marked for disposal
 *
 * Inventory Count Frequency:
 * - Schedule II: Monthly (every 30 days)
 * - Schedule III/IV: Quarterly (every 90 days)
 * - Schedule V: Semi-annually (every 180 days)
 */
```

### Method: logAdministration
```typescript
/**
 * @method logAdministration
 * @description Log controlled substance administration with witness requirement for Schedule II
 * @async
 * @static
 *
 * @param {Object} params - Administration parameters
 * @param {string} params.medicationId - Medication UUID
 * @param {string} params.medicationName - Medication name (for logging)
 * @param {DEASchedule} params.deaSchedule - DEA Schedule (I, II, III, IV, V)
 * @param {string} params.studentId - Student UUID receiving medication
 * @param {string} params.studentName - Student name (for logging)
 * @param {number} params.quantity - Amount administered
 * @param {string} params.unit - Unit of measure (mg, mL, tablets, etc.)
 * @param {string} params.administeredBy - Nurse UUID who administered
 * @param {string} [params.witnessedBy] - Witness UUID (REQUIRED for Schedule II)
 * @param {string} [params.prescriptionNumber] - Prescription number
 * @param {string} [params.notes] - Administration notes
 * @param {string} [params.schoolId] - School UUID
 *
 * @returns {Promise<ControlledSubstanceLogEntry>} Complete log entry with balance updates
 * @returns {number} entry.balanceBefore - Inventory before administration
 * @returns {number} entry.balanceAfter - Inventory after administration
 * @returns {boolean} entry.requiresFollowUp - True if witness missing for Schedule II
 *
 * @throws {Error} When medication not found in inventory
 * @throws {Error} When insufficient inventory balance
 *
 * @safety Witness Requirement
 * - Schedule II administration MUST have witness
 * - Missing witness generates warning and follow-up flag
 * - Witness UUID recorded for audit trail
 *
 * @compliance DEA Controlled Substances Act
 * @audit Transaction logged to audit service
 * @audit Inventory balance automatically updated
 *
 * @example
 * // Schedule II administration (Adderall) - witness required
 * const log = await ControlledSubstanceLogger.logAdministration({
 *   medicationId: 'med-123',
 *   medicationName: 'Adderall XR',
 *   deaSchedule: DEASchedule.SCHEDULE_II,
 *   studentId: 'student-456',
 *   studentName: 'John Doe',
 *   quantity: 10,
 *   unit: 'mg',
 *   administeredBy: 'nurse-789',
 *   witnessedBy: 'witness-nurse-012', // REQUIRED for Schedule II
 *   prescriptionNumber: 'RX-2024-001'
 * });
 *
 * @example
 * // Schedule IV administration (Xanax) - witness optional
 * const log = await ControlledSubstanceLogger.logAdministration({
 *   medicationId: 'med-345',
 *   medicationName: 'Alprazolam',
 *   deaSchedule: DEASchedule.SCHEDULE_IV,
 *   studentId: 'student-678',
 *   studentName: 'Jane Smith',
 *   quantity: 0.5,
 *   unit: 'mg',
 *   administeredBy: 'nurse-789'
 * });
 */
```

### Method: logWaste
```typescript
/**
 * @method logWaste
 * @description Log controlled substance waste/disposal with witness and method documentation
 * @async
 * @static
 *
 * @param {Object} params - Waste parameters
 * @param {string} params.medicationId - Medication UUID
 * @param {string} params.medicationName - Medication name
 * @param {DEASchedule} params.deaSchedule - DEA Schedule
 * @param {number} params.quantity - Amount being wasted
 * @param {string} params.unit - Unit of measure
 * @param {string} params.reason - Reason for waste (e.g., "Expired", "Contaminated", "Student transferred")
 * @param {string} params.disposalMethod - Method used (e.g., "Flushed per facility protocol", "Returned to pharmacy")
 * @param {string} params.disposalWitnessName - Witness full name
 * @param {string} params.disposalWitnessLicense - Witness license number (RN, MD, PharmD)
 * @param {string} params.wastedBy - Staff UUID disposing medication
 * @param {string} params.witnessedBy - Witness UUID (REQUIRED)
 * @param {string} [params.notes] - Additional disposal notes
 * @param {string} [params.schoolId] - School UUID
 *
 * @returns {Promise<ControlledSubstanceLogEntry>} Complete waste log entry
 * @returns {Date} entry.disposalDate - When disposal occurred
 * @returns {string} entry.disposalMethod - How medication was disposed
 * @returns {string} entry.disposalWitnessLicense - Witness credentials
 *
 * @throws {Error} When witness information missing
 * @throws {Error} When disposal method not specified
 * @throws {Error} When insufficient inventory balance
 *
 * @safety Witness Requirement
 * ALL controlled substance waste MUST be witnessed regardless of schedule
 *
 * @compliance DEA 21 CFR §1304.04(a) - Disposal records required
 * @audit Waste transaction permanently logged
 *
 * @example
 * // Waste expired medication
 * const log = await ControlledSubstanceLogger.logWaste({
 *   medicationId: 'med-123',
 *   medicationName: 'Methylphenidate',
 *   deaSchedule: DEASchedule.SCHEDULE_II,
 *   quantity: 30,
 *   unit: 'tablets',
 *   reason: 'Expired - Expiration date 2024-10-15',
 *   disposalMethod: 'Returned to pharmacy for DEA-compliant incineration',
 *   disposalWitnessName: 'Sarah Johnson, PharmD',
 *   disposalWitnessLicense: 'PharmD #12345',
 *   wastedBy: 'nurse-789',
 *   witnessedBy: 'pharmacist-456',
 *   notes: 'Original packaging intact, no tampering detected'
 * });
 */
```

### Method: performInventoryCount
```typescript
/**
 * @method performInventoryCount
 * @description Perform physical inventory count and log discrepancies
 * @async
 * @static
 *
 * @param {Object} params - Inventory count parameters
 * @param {string} params.medicationId - Medication UUID
 * @param {string} params.medicationName - Medication name
 * @param {DEASchedule} params.deaSchedule - DEA Schedule
 * @param {number} params.physicalCount - Actual counted quantity
 * @param {string} params.unit - Unit of measure
 * @param {string} params.countedBy - Counter UUID
 * @param {string} params.witnessedBy - Witness UUID (REQUIRED)
 * @param {string} [params.schoolId] - School UUID
 *
 * @returns {Promise<Object>} Inventory count result
 * @returns {number} result.discrepancy - Difference between physical and system (positive = overage, negative = shortage)
 * @returns {ControlledSubstanceLogEntry|null} result.logEntry - Adjustment log if discrepancy found
 *
 * @throws {Error} When witness missing
 * @throws {Error} When medication not found
 *
 * @safety Discrepancy Detection
 * - Discrepancies > 5 units flagged for investigation
 * - System balance updated to match physical count
 * - Discrepancy counter incremented for medication
 * - Large discrepancies trigger admin alerts
 *
 * @compliance DEA periodic inventory requirements
 * @compliance Schedule-based inventory frequency enforced
 *
 * @example
 * // Perform monthly Schedule II inventory count
 * const result = await ControlledSubstanceLogger.performInventoryCount({
 *   medicationId: 'med-123',
 *   medicationName: 'Adderall XR 10mg',
 *   deaSchedule: DEASchedule.SCHEDULE_II,
 *   physicalCount: 95,
 *   unit: 'tablets',
 *   countedBy: 'nurse-789',
 *   witnessedBy: 'supervisor-456'
 * });
 *
 * if (result.discrepancy !== 0) {
 *   console.log(`Discrepancy detected: ${result.discrepancy} tablets`);
 *   // Investigation required
 * }
 */
```

### Method: generateReport
```typescript
/**
 * @method generateReport
 * @description Generate DEA-compliant controlled substance report for date range
 * @async
 * @static
 *
 * @param {Date} startDate - Report period start
 * @param {Date} endDate - Report period end
 * @param {string} generatedBy - Report generator UUID
 *
 * @returns {Promise<ControlledSubstanceReport>} Comprehensive DEA report
 * @returns {Object[]} report.medications - Per-medication summaries
 * @returns {number} report.medications[].openingBalance - Starting inventory
 * @returns {number} report.medications[].receipts - Total received
 * @returns {number} report.medications[].administered - Total given to students
 * @returns {number} report.medications[].wasted - Total disposed
 * @returns {number} report.medications[].transferred - Total transferred out
 * @returns {number} report.medications[].closingBalance - Ending inventory
 * @returns {number} report.medications[].expectedBalance - Calculated expected balance
 * @returns {number} report.medications[].discrepancy - Difference (actual - expected)
 * @returns {number} report.totalTransactions - Total transaction count
 * @returns {number} report.discrepanciesFound - Count of medications with discrepancies
 *
 * @throws {Error} When date range invalid
 *
 * @compliance DEA reporting requirements
 * @audit Report generation logged
 *
 * @example
 * // Generate monthly DEA report
 * const report = await ControlledSubstanceLogger.generateReport(
 *   new Date('2024-10-01'),
 *   new Date('2024-10-31'),
 *   'admin-123'
 * );
 *
 * console.log(`Report period: ${report.reportPeriodStart} to ${report.reportPeriodEnd}`);
 * console.log(`Total transactions: ${report.totalTransactions}`);
 * console.log(`Discrepancies found: ${report.discrepanciesFound}`);
 *
 * report.medications.forEach(med => {
 *   console.log(`${med.medicationName} (${med.deaSchedule}):`);
 *   console.log(`  Opening: ${med.openingBalance}`);
 *   console.log(`  Received: +${med.receipts}`);
 *   console.log(`  Administered: -${med.administered}`);
 *   console.log(`  Wasted: -${med.wasted}`);
 *   console.log(`  Closing: ${med.closingBalance}`);
 *   if (med.discrepancy !== 0) {
 *     console.log(`  ⚠️ DISCREPANCY: ${med.discrepancy}`);
 *   }
 * });
 */
```

---

## Summary

This documentation covers:

1. **Five Rights of Medication Administration**
   - Right Patient
   - Right Drug
   - Right Dose
   - Right Route
   - Right Time

2. **DEA Controlled Substance Compliance**
   - Schedule I-V classifications
   - Witness requirements (Schedule I/II)
   - DEA Form 222 documentation
   - Inventory count frequency by schedule
   - Disposal requirements

3. **Safety Features**
   - Active prescription validation
   - Nurse authorization
   - Allergy checking (in interaction service)
   - Drug interaction detection
   - Adverse reaction tracking
   - Side effect monitoring

4. **Audit & Compliance**
   - HIPAA Privacy Rule §164.308
   - HIPAA Security Rule §164.312
   - DEA Controlled Substances Act
   - Complete audit trails
   - PHI access controls

5. **Inventory Management**
   - Stock level tracking
   - Expiration monitoring
   - Low stock alerts
   - Reorder level enforcement
   - Batch/lot number tracking

This documentation should be applied to all medication service files following the patterns established above.

# JSDoc Quick Reference for Medication Services

## Standard JSDoc Structure for Medication Services

### File Header Template
```typescript
/**
 * @fileoverview [Service Name] - Critical Healthcare Service
 * @module services/medication/[filename]
 * @description [Brief description with key safety features]
 *
 * Key Features:
 * - [Feature 1]
 * - [Feature 2]
 * - [Feature 3]
 *
 * @compliance [HIPAA/DEA regulation]
 * @safety [Safety feature description]
 * @audit [Audit requirement description]
 *
 * @requires [dependency paths]
 *
 * @see {@link [external resource URL]|[Link Text]}
 *
 * LOC: [Location Code]
 * Last Updated: YYYY-MM-DD
 */
```

### Class Documentation Template
```typescript
/**
 * @class [ClassName]
 * @description [Class purpose and capabilities]
 *
 * Safety Features:
 * - [Safety feature 1]
 * - [Safety feature 2]
 *
 * @example
 * // [Example usage]
 * const result = await Service.method(params);
 */
```

### Method Documentation Template
```typescript
/**
 * @method [methodName]
 * @description [What the method does]
 * @async
 * @static
 *
 * @param {Type} paramName - [Description]
 * @param {Type} [optionalParam] - [Description] (optional)
 *
 * @returns {Promise<ReturnType>} [Description]
 * @returns {Type} result.property - [Property description]
 *
 * @throws {ErrorType} When [error condition]
 *
 * @safety [Safety feature explanation]
 * @compliance [Compliance requirement]
 * @audit [Audit trail information]
 *
 * @example
 * // [Example usage]
 * const result = await Service.method({
 *   param1: 'value',
 *   param2: 123
 * });
 */
```

---

## Common JSDoc Tags for Healthcare Services

### Essential Tags
- `@fileoverview` - File-level description
- `@module` - Module path
- `@class` - Class definition
- `@method` - Method definition
- `@async` - Asynchronous method
- `@static` - Static method
- `@param` - Parameter documentation
- `@returns` - Return value documentation
- `@throws` - Exception documentation
- `@example` - Usage example

### Healthcare-Specific Tags
- `@compliance` - Regulatory compliance (HIPAA, DEA, FDA)
- `@safety` - Safety feature description
- `@audit` - Audit requirement
- `@requires` - Dependencies
- `@see` - External references

---

## Five Rights Documentation Pattern

Always document Five Rights in administration methods:

```typescript
/**
 * @safety Five Rights Validation
 * - RIGHT PATIENT: [How verified]
 * - RIGHT DRUG: [How verified]
 * - RIGHT DOSE: [How verified]
 * - RIGHT ROUTE: [How verified]
 * - RIGHT TIME: [How verified]
 */
```

---

## DEA Schedule Documentation Pattern

For controlled substance methods:

```typescript
/**
 * @param {DEASchedule} deaSchedule - DEA Schedule (I, II, III, IV, V)
 *
 * DEA Schedule Requirements:
 * - Schedule II: Witness REQUIRED, Monthly inventory
 * - Schedule III/IV: Quarterly inventory
 * - Schedule V: Semi-annual inventory
 *
 * @safety Witness Requirement
 * Schedule II administration MUST have witness
 *
 * @compliance DEA Controlled Substances Act 21 USC §801
 */
```

---

## Severity Level Documentation Pattern

For adverse reactions:

```typescript
/**
 * @param {'MILD'|'MODERATE'|'SEVERE'|'LIFE_THREATENING'} severity - Reaction severity
 *
 * Severity Levels:
 * - MILD: Minor discomfort, no intervention
 * - MODERATE: Requires monitoring or minor intervention
 * - SEVERE: Immediate medical attention, parents notified
 * - LIFE_THREATENING: Emergency response, 911 called
 *
 * @safety Automatic Escalation
 * SEVERE/LIFE_THREATENING automatically triggers parent notification
 */
```

---

## HIPAA Compliance Documentation Pattern

For methods accessing PHI:

```typescript
/**
 * @audit HIPAA Compliance
 * This method provides access to PHI (Protected Health Information) and must be
 * called only by authorized personnel with appropriate access controls
 *
 * @compliance HIPAA Privacy Rule §164.308 - Access controls
 * @compliance HIPAA Security Rule §164.312 - Audit controls
 */
```

---

## Common Examples to Include

### Example 1: Standard Operation
```typescript
/**
 * @example
 * // Standard usage
 * const result = await Service.method({
 *   param1: 'value',
 *   param2: 123
 * });
 * console.log(result);
 */
```

### Example 2: Controlled Substance (Schedule II)
```typescript
/**
 * @example
 * // Schedule II controlled substance - witness required
 * const log = await ControlledSubstanceLogger.logAdministration({
 *   medicationId: 'med-123',
 *   medicationName: 'Adderall XR',
 *   deaSchedule: DEASchedule.SCHEDULE_II,
 *   studentId: 'student-456',
 *   studentName: 'John Doe',
 *   quantity: 10,
 *   unit: 'mg',
 *   administeredBy: 'nurse-789',
 *   witnessedBy: 'witness-012', // REQUIRED for Schedule II
 *   prescriptionNumber: 'RX-2024-001'
 * });
 */
```

### Example 3: Error Handling
```typescript
/**
 * @example
 * // With error handling
 * try {
 *   const result = await Service.method(params);
 *   console.log('Success:', result);
 * } catch (error) {
 *   if (error.message === 'Student medication prescription not found') {
 *     // Handle invalid prescription
 *   } else if (error.message === 'Medication prescription is not active') {
 *     // Handle inactive prescription
 *   }
 * }
 */
```

---

## Return Value Documentation Patterns

### Simple Return
```typescript
/**
 * @returns {Promise<MedicationLog>} Complete administration log
 */
```

### Complex Object Return
```typescript
/**
 * @returns {Promise<Object>} Paginated medication logs
 * @returns {MedicationLog[]} result.logs - Array of medication logs
 * @returns {Object} result.pagination - Pagination metadata
 * @returns {number} result.pagination.page - Current page number
 * @returns {number} result.pagination.total - Total record count
 */
```

### Array Return with Details
```typescript
/**
 * @returns {Promise<IncidentReport[]>} Array of adverse reaction reports
 * @returns {Object} report[].student - Student who experienced reaction
 * @returns {Object} report[].reportedBy - Staff member who reported
 * @returns {string} report[].severity - Reaction severity level
 */
```

---

## Parameter Documentation Patterns

### Required Parameters
```typescript
/**
 * @param {string} studentId - Student UUID to retrieve logs for
 * @param {string} medicationId - Medication UUID
 */
```

### Optional Parameters with Defaults
```typescript
/**
 * @param {number} [page=1] - Page number for pagination (1-indexed)
 * @param {number} [limit=20] - Number of records per page
 */
```

### Complex Object Parameters
```typescript
/**
 * @param {CreateMedicationLogData} data - Administration details
 * @param {string} data.studentMedicationId - Student prescription UUID
 * @param {string} data.nurseId - Administering nurse UUID
 * @param {string} data.dosageGiven - Dosage with unit (e.g., "10 mg", "5 mL")
 * @param {Date} data.timeGiven - Administration timestamp
 * @param {string} [data.notes] - Optional administration notes
 * @param {string} [data.witnessedBy] - Optional witness (required for Schedule II)
 */
```

### Enum Parameters
```typescript
/**
 * @param {'MILD'|'MODERATE'|'SEVERE'|'LIFE_THREATENING'} severity - Reaction severity level
 * @param {DEASchedule} deaSchedule - DEA Schedule (I, II, III, IV, V)
 * @param {'PENDING'|'COMPLETED'|'MISSED'} status - Administration status
 */
```

---

## Error Documentation Patterns

### Standard Errors
```typescript
/**
 * @throws {Error} When student medication prescription not found
 * @throws {Error} When medication prescription is not active
 * @throws {Error} When nurse not found
 * @throws {Error} When database query fails
 */
```

### Validation Errors
```typescript
/**
 * @throws {ValidationError} When Five Rights validation fails
 * @throws {ValidationError} When dosage exceeds prescribed amount
 * @throws {ValidationError} When administration time outside window
 */
```

### Authorization Errors
```typescript
/**
 * @throws {ForbiddenError} When nurse lacks permission
 * @throws {UnauthorizedError} When user not authenticated
 * @throws {ForbiddenError} When accessing other school's data
 */
```

---

## Cross-Reference Patterns

### Internal Links
```typescript
/**
 * @see {@link AdministrationService.logMedicationAdministration}
 * @see {@link ControlledSubstanceLogger.logAdministration}
 */
```

### External Links
```typescript
/**
 * @see {@link https://www.dea.gov/drug-information/drug-scheduling|DEA Drug Scheduling}
 * @see {@link https://www.fda.gov/safety/medwatch|FDA MedWatch}
 * @see {@link https://www.ismp.org/five-rights-medication-administration|Five Rights}
 * @see {@link https://www.hhs.gov/hipaa/index.html|HIPAA}
 */
```

---

## Compliance Tag Reference

### HIPAA Tags
```typescript
/**
 * @compliance HIPAA Privacy Rule §164.308 - Access controls and audit logs
 * @compliance HIPAA Security Rule §164.312 - Audit controls and monitoring
 * @compliance HIPAA Privacy Rule §164.308(a)(1)(ii)(D) - Audit controls required
 */
```

### DEA Tags
```typescript
/**
 * @compliance DEA Controlled Substances Act 21 USC §801
 * @compliance DEA Form 222 Requirements
 * @compliance 21 CFR Part 1304 - Records and Reports
 * @compliance DEA 21 CFR §1304.04(a) - Disposal records required
 */
```

### FDA Tags
```typescript
/**
 * @compliance FDA MedWatch - Adverse event reporting requirements
 * @compliance FDA 21 CFR Part 312 - Investigational New Drug Application
 */
```

---

## Safety Tag Patterns

```typescript
/**
 * @safety Five Rights validation prevents medication errors
 * @safety Active prescription check prevents unauthorized administration
 * @safety Witness requirement prevents controlled substance diversion
 * @safety Discrepancy tracking detects theft or errors
 * @safety Automatic escalation prevents delayed response
 * @safety Allergy checking prevents adverse reactions
 * @safety Drug interaction detection prevents dangerous combinations
 */
```

---

## Audit Tag Patterns

```typescript
/**
 * @audit Every administration logged with complete context
 * @audit Complete audit trail for regulatory compliance
 * @audit Transaction logged to audit service
 * @audit All data logged to application logger
 * @audit Waste transaction permanently logged
 * @audit Report generation logged
 */
```

---

## Complete Example: Fully Documented Method

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
 *
 * @example
 * // Administration with side effects noted
 * const log = await AdministrationService.logMedicationAdministration({
 *   studentMedicationId: 'med-345',
 *   nurseId: 'nurse-678',
 *   dosageGiven: '15 mg',
 *   timeGiven: new Date(),
 *   sideEffects: 'Mild drowsiness reported 20 minutes after administration',
 *   notes: 'Parent notified of side effects'
 * });
 */
static async logMedicationAdministration(data: CreateMedicationLogData) {
  // Implementation...
}
```

---

## Checklist for Complete Documentation

- [ ] File-level JSDoc with @fileoverview
- [ ] Module path with @module
- [ ] Key features listed
- [ ] Compliance tags (@compliance)
- [ ] Safety tags (@safety)
- [ ] Audit tags (@audit)
- [ ] External links (@see)
- [ ] Class documentation
- [ ] Method documentation for all public methods
- [ ] All parameters documented (@param)
- [ ] Return values documented (@returns)
- [ ] Exceptions documented (@throws)
- [ ] At least one @example per method
- [ ] Five Rights mentioned (if applicable)
- [ ] DEA schedule mentioned (if applicable)
- [ ] HIPAA compliance mentioned (if accessing PHI)
- [ ] Witness requirements documented (if applicable)

---

## IDE Integration

Most modern IDEs will automatically display JSDoc in:
- Hover tooltips
- Auto-completion
- Function signature help
- Quick documentation views

To generate HTML documentation:
```bash
npm install -g jsdoc
jsdoc -c jsdoc.json -r backend/src/services/medication/
```

---

## Best Practices

1. **Be Specific**: Don't just say "error" - explain what error and when
2. **Include Units**: Always specify units (mg, mL, tablets, etc.)
3. **Document Safety**: Highlight safety features with @safety tags
4. **Show Examples**: Provide realistic, working code examples
5. **Link Resources**: Use @see to link to regulations and guidelines
6. **Explain Why**: Not just what the method does, but why it's important
7. **Document Assumptions**: State any assumptions about data or state
8. **Keep Updated**: Update docs when implementation changes

---

**Quick Reference Version**: 1.0
**Last Updated**: 2025-10-22
**For**: Medication Services JSDoc Documentation

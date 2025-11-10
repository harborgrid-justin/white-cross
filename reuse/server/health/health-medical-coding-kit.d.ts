/**
 * LOC: HLTCOD001
 * File: /reuse/server/health/health-medical-coding-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - date-fns
 *   - crypto (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - Coding services
 *   - Claims submission services
 *   - Audit and compliance modules
 *   - Revenue cycle management
 *   - Clinical documentation improvement
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     ICD10Code:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: ICD-10-CM code
 *           example: "E11.9"
 *           pattern: '^[A-Z][0-9]{2}(\\.?[A-Z0-9]{0,4})?$'
 *         description:
 *           type: string
 *           example: "Type 2 diabetes mellitus without complications"
 *         category:
 *           type: string
 *           example: "E11"
 *         categoryDescription:
 *           type: string
 *           example: "Type 2 diabetes mellitus"
 *         valid:
 *           type: boolean
 *         requiresSeventhCharacter:
 *           type: boolean
 *         laterality:
 *           type: string
 *           enum: [left, right, bilateral, unspecified]
 *         encounters:
 *           type: array
 *           items:
 *             type: string
 *             enum: [initial, subsequent, sequela]
 */
export interface ICD10Code {
    code: string;
    description: string;
    category?: string;
    categoryDescription?: string;
    valid: boolean;
    billable?: boolean;
    requiresSeventhCharacter?: boolean;
    laterality?: 'left' | 'right' | 'bilateral' | 'unspecified';
    encounters?: ('initial' | 'subsequent' | 'sequela')[];
    hccMapping?: string[];
    manifestationCode?: boolean;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     CPTCode:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           pattern: '^[0-9]{5}$'
 *           example: "99213"
 *         description:
 *           type: string
 *           example: "Office visit, established patient, level 3"
 *         category:
 *           type: string
 *           enum: [E&M, Surgery, Radiology, Pathology, Medicine]
 *         rvuWork:
 *           type: number
 *           format: float
 *           description: Work RVU value
 *         rvuPracticeExpense:
 *           type: number
 *           format: float
 *         rvuMalpractice:
 *           type: number
 *           format: float
 *         modifiersAllowed:
 *           type: array
 *           items:
 *             type: string
 *           example: ["25", "59"]
 */
export interface CPTCode {
    code: string;
    description: string;
    category: 'E&M' | 'Surgery' | 'Radiology' | 'Pathology' | 'Medicine' | 'Anesthesia';
    rvuWork?: number;
    rvuPracticeExpense?: number;
    rvuMalpractice?: number;
    totalRVU?: number;
    modifiersAllowed?: string[];
    requiresModifier?: boolean;
    globalPeriod?: number;
    bilateralSurgery?: boolean;
    assistantSurgeonAllowed?: boolean;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     HCPCSCode:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           pattern: '^[A-Z][0-9]{4}$'
 *           example: "J0171"
 *         description:
 *           type: string
 *           example: "Adrenalin epinephrine injection"
 *         level:
 *           type: string
 *           enum: [I, II]
 *         category:
 *           type: string
 *           example: "Drugs administered other than oral method"
 */
export interface HCPCSCode {
    code: string;
    description: string;
    level: 'I' | 'II';
    category?: string;
    dosage?: string;
    unitOfMeasure?: string;
    averagePrice?: number;
    coverageStatus?: 'covered' | 'not_covered' | 'varies';
}
/**
 * @swagger
 * components:
 *   schemas:
 *     DRGAssignment:
 *       type: object
 *       properties:
 *         drgCode:
 *           type: string
 *           example: "470"
 *         drgDescription:
 *           type: string
 *           example: "Major hip and knee joint replacement or reattachment of lower extremity w/o MCC"
 *         mdc:
 *           type: string
 *           description: Major Diagnostic Category
 *           example: "08"
 *         mdcDescription:
 *           type: string
 *           example: "Diseases and Disorders of the Musculoskeletal System and Connective Tissue"
 *         weight:
 *           type: number
 *           format: float
 *           description: DRG relative weight
 *         geometricMeanLOS:
 *           type: number
 *           format: float
 *           description: Geometric mean length of stay
 */
export interface DRGAssignment {
    drgCode: string;
    drgDescription: string;
    mdc: string;
    mdcDescription?: string;
    weight: number;
    geometricMeanLOS: number;
    arithmeticMeanLOS?: number;
    type?: 'medical' | 'surgical';
    withCC?: boolean;
    withMCC?: boolean;
    expectedReimbursement?: number;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     HCCMapping:
 *       type: object
 *       properties:
 *         hccCode:
 *           type: string
 *           example: "HCC19"
 *         hccDescription:
 *           type: string
 *           example: "Diabetes without complication"
 *         icd10Codes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["E11.9", "E11.65"]
 *         riskWeight:
 *           type: number
 *           format: float
 *           description: RAF (Risk Adjustment Factor) weight
 *         category:
 *           type: string
 *           enum: [CMS-HCC, RxHCC, HHS-HCC]
 */
export interface HCCMapping {
    hccCode: string;
    hccDescription: string;
    icd10Codes: string[];
    riskWeight: number;
    category: 'CMS-HCC' | 'RxHCC' | 'HHS-HCC';
    modelVersion?: string;
    hierarchyParent?: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     NCCIEdit:
 *       type: object
 *       description: National Correct Coding Initiative edit
 *       properties:
 *         column1Code:
 *           type: string
 *           description: Comprehensive code (primary)
 *         column2Code:
 *           type: string
 *           description: Component code (secondary)
 *         editType:
 *           type: string
 *           enum: [bundled, mutually_exclusive]
 *         modifierAllowed:
 *           type: boolean
 *           description: Whether modifier bypass is allowed
 *         effectiveDate:
 *           type: string
 *           format: date
 */
export interface NCCIEdit {
    column1Code: string;
    column2Code: string;
    editType: 'bundled' | 'mutually_exclusive';
    modifierAllowed: boolean;
    effectiveDate: string;
    deletionDate?: string;
    rationale?: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     MedicalNecessity:
 *       type: object
 *       properties:
 *         covered:
 *           type: boolean
 *         policyType:
 *           type: string
 *           enum: [LCD, NCD, Local, National]
 *         policyNumber:
 *           type: string
 *         policyTitle:
 *           type: string
 *         coveredDiagnoses:
 *           type: array
 *           items:
 *             type: string
 *         limitations:
 *           type: array
 *           items:
 *             type: string
 */
export interface MedicalNecessity {
    covered: boolean;
    policyType: 'LCD' | 'NCD' | 'Local' | 'National';
    policyNumber?: string;
    policyTitle?: string;
    coveredDiagnoses: string[];
    limitations?: string[];
    frequencyLimits?: string;
    priorAuthRequired?: boolean;
    contractor?: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     CodingAuditResult:
 *       type: object
 *       properties:
 *         auditId:
 *           type: string
 *         claimId:
 *           type: string
 *         auditDate:
 *           type: string
 *           format: date-time
 *         findings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AuditFinding'
 *         overallScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         riskLevel:
 *           type: string
 *           enum: [low, medium, high, critical]
 */
export interface CodingAuditResult {
    auditId: string;
    claimId?: string;
    encounterId?: string;
    auditDate: string;
    findings: AuditFinding[];
    overallScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    auditorId?: string;
    reviewRequired?: boolean;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     AuditFinding:
 *       type: object
 *       properties:
 *         findingType:
 *           type: string
 *           enum: [upcoding, downcoding, unbundling, modifier_error, medical_necessity, documentation]
 *         severity:
 *           type: string
 *           enum: [minor, moderate, major, critical]
 *         code:
 *           type: string
 *         description:
 *           type: string
 *         recommendation:
 *           type: string
 *         financialImpact:
 *           type: number
 *           format: float
 */
export interface AuditFinding {
    findingType: 'upcoding' | 'downcoding' | 'unbundling' | 'modifier_error' | 'medical_necessity' | 'documentation' | 'other';
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    code?: string;
    description: string;
    recommendation: string;
    financialImpact?: number;
    correctCode?: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     CDIQuery:
 *       type: object
 *       description: Clinical Documentation Improvement query
 *       properties:
 *         queryId:
 *           type: string
 *         encounterId:
 *           type: string
 *         queryType:
 *           type: string
 *           enum: [clarification, specificity, clinical_validity, conflict]
 *         queryText:
 *           type: string
 *         clinicalIndicators:
 *           type: array
 *           items:
 *             type: string
 *         suggestedCodes:
 *           type: array
 *           items:
 *             type: string
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 */
export interface CDIQuery {
    queryId: string;
    encounterId: string;
    queryType: 'clarification' | 'specificity' | 'clinical_validity' | 'conflict' | 'other';
    queryText: string;
    clinicalIndicators: string[];
    suggestedCodes?: string[];
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status?: 'pending' | 'answered' | 'withdrawn';
    createdDate?: string;
    responseDate?: string;
    response?: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     CodeModifier:
 *       type: object
 *       properties:
 *         modifier:
 *           type: string
 *           pattern: '^[0-9A-Z]{2}$'
 *           example: "25"
 *         description:
 *           type: string
 *           example: "Significant, separately identifiable E/M service"
 *         category:
 *           type: string
 *           enum: [informational, payment_affecting, statistical]
 *         reimbursementImpact:
 *           type: number
 *           format: float
 *           description: Percentage impact on reimbursement
 */
export interface CodeModifier {
    modifier: string;
    description: string;
    category: 'informational' | 'payment_affecting' | 'statistical';
    applicableTo?: ('CPT' | 'HCPCS')[];
    reimbursementImpact?: number;
    pairsWith?: string[];
    conflictsWith?: string[];
}
/**
 * @swagger
 * components:
 *   schemas:
 *     RevenueCode:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *           example: "0450"
 *         description:
 *           type: string
 *           example: "Emergency Room - General Classification"
 *         category:
 *           type: string
 *         standardCharge:
 *           type: number
 *           format: float
 */
export interface RevenueCode {
    code: string;
    description: string;
    category?: string;
    standardCharge?: number;
    cptCrosswalk?: string[];
    requiresHCPCS?: boolean;
}
/**
 * 1. Searches ICD-10-CM codes by keyword or code prefix.
 *
 * @openapi
 * /api/coding/icd10/search:
 *   get:
 *     summary: Search ICD-10-CM codes
 *     tags: [Medical Coding]
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "diabetes"
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: ICD-10 codes matching search
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ICD10Code'
 *
 * @param {string} query - Search query (keyword or code)
 * @param {number} limit - Maximum results to return
 * @returns {ICD10Code[]} Matching ICD-10 codes
 *
 * @example
 * ```typescript
 * const codes = searchICD10Codes('diabetes', 10);
 * codes.forEach(code => {
 *   console.log(`${code.code} - ${code.description}`);
 * });
 * // E11.9 - Type 2 diabetes mellitus without complications
 * // E11.65 - Type 2 diabetes mellitus with hyperglycemia
 * ```
 */
export declare function searchICD10Codes(query: string, limit?: number): ICD10Code[];
/**
 * 2. Validates ICD-10-CM code format and billability.
 *
 * @openapi
 * /api/coding/icd10/validate:
 *   post:
 *     summary: Validate ICD-10-CM code
 *     tags: [Medical Coding]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Validation result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ICD10Code'
 *
 * @param {string} code - ICD-10-CM code to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateICD10Code('E11.9');
 * if (validation.valid && validation.billable) {
 *   console.log('Valid billable code:', validation.description);
 * }
 * ```
 */
export declare function validateICD10Code(code: string): {
    valid: boolean;
    billable: boolean;
    issues: string[];
    codeDetails?: ICD10Code;
};
/**
 * 3. Looks up complete ICD-10-CM code details.
 *
 * @param {string} code - ICD-10-CM code
 * @returns {ICD10Code | null} Code details or null if not found
 *
 * @example
 * ```typescript
 * const details = lookupICD10Code('E11.9');
 * console.log('Description:', details?.description);
 * console.log('HCC mapping:', details?.hccMapping);
 * ```
 */
export declare function lookupICD10Code(code: string): ICD10Code | null;
/**
 * 4. Gets ICD-10-CM codes for a specific category.
 *
 * @param {string} category - ICD-10 category (e.g., 'E11')
 * @returns {ICD10Code[]} All codes in category
 *
 * @example
 * ```typescript
 * const diabetesCodes = getICD10CodesByCategory('E11');
 * diabetesCodes.forEach(code => {
 *   console.log(`${code.code} - ${code.description}`);
 * });
 * ```
 */
export declare function getICD10CodesByCategory(category: string): ICD10Code[];
/**
 * 5. Expands ICD-10-CM code with all valid 7th character extensions.
 *
 * @param {string} baseCode - Base ICD-10 code without 7th character
 * @returns {string[]} All valid code variations with 7th characters
 *
 * @example
 * ```typescript
 * const variations = expandICD10With7thCharacter('S06.0X0');
 * // Returns: ['S06.0X0A', 'S06.0X0D', 'S06.0X0S']
 * // A=initial encounter, D=subsequent encounter, S=sequela
 * ```
 */
export declare function expandICD10With7thCharacter(baseCode: string): string[];
/**
 * 6. Searches CPT codes by keyword or code.
 *
 * @openapi
 * /api/coding/cpt/search:
 *   get:
 *     summary: Search CPT codes
 *     tags: [Medical Coding]
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *           enum: [E&M, Surgery, Radiology, Pathology, Medicine]
 *     responses:
 *       200:
 *         description: CPT codes matching search
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CPTCode'
 *
 * @param {string} query - Search query
 * @param {string} category - Optional category filter
 * @returns {CPTCode[]} Matching CPT codes
 *
 * @example
 * ```typescript
 * const codes = searchCPTCodes('office visit', 'E&M');
 * codes.forEach(code => {
 *   console.log(`${code.code} - ${code.description} (RVU: ${code.totalRVU})`);
 * });
 * ```
 */
export declare function searchCPTCodes(query: string, category?: string): CPTCode[];
/**
 * 7. Validates CPT code format and existence.
 *
 * @param {string} code - CPT code to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateCPTCode('99213');
 * if (validation.valid) {
 *   console.log('Valid CPT code:', validation.codeDetails?.description);
 * }
 * ```
 */
export declare function validateCPTCode(code: string): {
    valid: boolean;
    issues: string[];
    codeDetails?: CPTCode;
};
/**
 * 8. Calculates RVU (Relative Value Unit) total for CPT code.
 *
 * @param {string} code - CPT code
 * @param {number} conversionFactor - Medicare conversion factor (default: 33.29 for 2025)
 * @returns {object} RVU breakdown and reimbursement
 *
 * @example
 * ```typescript
 * const rvu = calculateCPTRVU('99213', 33.29);
 * console.log('Total RVU:', rvu.totalRVU);
 * console.log('Medicare reimbursement:', rvu.reimbursement);
 * ```
 */
export declare function calculateCPTRVU(code: string, conversionFactor?: number): {
    code: string;
    rvuWork: number;
    rvuPE: number;
    rvuMP: number;
    totalRVU: number;
    reimbursement: number;
};
/**
 * 9. Determines appropriate E/M level based on documentation.
 *
 * @param {object} documentation - E/M documentation elements
 * @returns {string} Recommended E/M CPT code
 *
 * @example
 * ```typescript
 * const emCode = determineEMLevelCode({
 *   patientType: 'established',
 *   setting: 'office',
 *   medicalDecisionMaking: 'moderate',
 *   timeSpent: 30
 * });
 * console.log('Recommended code:', emCode); // "99214"
 * ```
 */
export declare function determineEMLevelCode(documentation: {
    patientType: 'new' | 'established';
    setting: 'office' | 'hospital' | 'emergency';
    medicalDecisionMaking: 'straightforward' | 'low' | 'moderate' | 'high';
    timeSpent?: number;
}): string;
/**
 * 10. Gets CPT codes by category.
 *
 * @param {string} category - CPT category
 * @returns {CPTCode[]} Codes in category
 *
 * @example
 * ```typescript
 * const emCodes = getCPTCodesByCategory('E&M');
 * console.log(`Found ${emCodes.length} E/M codes`);
 * ```
 */
export declare function getCPTCodesByCategory(category: 'E&M' | 'Surgery' | 'Radiology' | 'Pathology' | 'Medicine' | 'Anesthesia'): CPTCode[];
/**
 * 11. Searches HCPCS Level II codes.
 *
 * @openapi
 * /api/coding/hcpcs/search:
 *   get:
 *     summary: Search HCPCS codes
 *     tags: [Medical Coding]
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: HCPCS codes matching search
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HCPCSCode'
 *
 * @param {string} query - Search query
 * @returns {HCPCSCode[]} Matching HCPCS codes
 *
 * @example
 * ```typescript
 * const codes = searchHCPCSCodes('wheelchair');
 * codes.forEach(code => {
 *   console.log(`${code.code} - ${code.description}`);
 * });
 * ```
 */
export declare function searchHCPCSCodes(query: string): HCPCSCode[];
/**
 * 12. Validates HCPCS code format.
 *
 * @param {string} code - HCPCS code to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateHCPCSCode('J0171');
 * if (validation.valid) {
 *   console.log('Valid HCPCS code');
 * }
 * ```
 */
export declare function validateHCPCSCode(code: string): {
    valid: boolean;
    issues: string[];
    codeDetails?: HCPCSCode;
};
/**
 * 13. Determines HCPCS dosage and units for billing.
 *
 * @param {string} code - HCPCS code
 * @param {number} totalDosage - Total dosage administered
 * @returns {object} Billing units calculation
 *
 * @example
 * ```typescript
 * const units = calculateHCPCSUnits('J0171', 0.5); // 0.5 mg epinephrine
 * console.log('Bill', units.units, 'units at', units.pricePerUnit);
 * ```
 */
export declare function calculateHCPCSUnits(code: string, totalDosage: number): {
    code: string;
    units: number;
    unitSize: number;
    pricePerUnit: number;
    totalPrice: number;
};
/**
 * 14. Checks Medicare coverage status for HCPCS code.
 *
 * @param {string} code - HCPCS code
 * @param {string} locality - Medicare locality
 * @returns {object} Coverage determination
 *
 * @example
 * ```typescript
 * const coverage = checkHCPCSCoverage('E0130', '01');
 * if (coverage.covered) {
 *   console.log('Covered at:', coverage.allowedAmount);
 * }
 * ```
 */
export declare function checkHCPCSCoverage(code: string, locality?: string): {
    covered: boolean;
    allowedAmount?: number;
    lcdPolicy?: string;
    limitations?: string[];
};
/**
 * 15. Maps HCPCS to CPT crosswalk.
 *
 * @param {string} hcpcsCode - HCPCS code
 * @returns {string[]} Equivalent CPT codes if any
 *
 * @example
 * ```typescript
 * const cptCodes = mapHCPCSToCPT('G0008');
 * console.log('Equivalent CPT codes:', cptCodes);
 * ```
 */
export declare function mapHCPCSToCPT(hcpcsCode: string): string[];
/**
 * 16. Assigns MS-DRG based on diagnoses and procedures.
 *
 * @openapi
 * /api/coding/drg/assign:
 *   post:
 *     summary: Assign MS-DRG
 *     tags: [DRG Assignment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               principalDiagnosis:
 *                 type: string
 *               secondaryDiagnoses:
 *                 type: array
 *                 items:
 *                   type: string
 *               procedures:
 *                 type: array
 *                 items:
 *                   type: string
 *               dischargeStatus:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: DRG assignment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DRGAssignment'
 *
 * @param {object} encounter - Encounter data
 * @returns {DRGAssignment} Assigned DRG
 *
 * @example
 * ```typescript
 * const drg = assignDRG({
 *   principalDiagnosis: 'I21.09',
 *   secondaryDiagnoses: ['I50.9', 'E11.9'],
 *   procedures: ['02703Z4'],
 *   age: 65,
 *   dischargeStatus: 'home'
 * });
 * console.log('DRG:', drg.drgCode, '-', drg.drgDescription);
 * console.log('Weight:', drg.weight);
 * ```
 */
export declare function assignDRG(encounter: {
    principalDiagnosis: string;
    secondaryDiagnoses?: string[];
    procedures?: string[];
    dischargeStatus?: string;
    age?: number;
    sex?: string;
}): DRGAssignment;
/**
 * 17. Calculates expected DRG reimbursement.
 *
 * @param {DRGAssignment} drg - DRG assignment
 * @param {number} baseRate - Hospital base rate
 * @param {number} wageFactor - Geographic wage index
 * @returns {object} Reimbursement calculation
 *
 * @example
 * ```typescript
 * const payment = calculateDRGReimbursement(drg, 5500, 1.05);
 * console.log('Expected payment:', payment.totalPayment);
 * ```
 */
export declare function calculateDRGReimbursement(drg: DRGAssignment, baseRate: number, wageFactor?: number): {
    drgCode: string;
    weight: number;
    baseRate: number;
    wageAdjustedRate: number;
    totalPayment: number;
    breakdown: any;
};
/**
 * 18. Validates DRG assignment accuracy.
 *
 * @param {DRGAssignment} drg - DRG assignment
 * @param {object} encounter - Encounter data
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateDRGAssignment(drg, encounterData);
 * if (!validation.valid) {
 *   console.log('DRG issues:', validation.issues);
 * }
 * ```
 */
export declare function validateDRGAssignment(drg: DRGAssignment, encounter: any): {
    valid: boolean;
    issues: string[];
    recommendations?: string[];
};
/**
 * 19. Compares DRG weights and reimbursement.
 *
 * @param {string[]} drgCodes - DRG codes to compare
 * @returns {object[]} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = compareDRGs(['280', '281', '282']);
 * comparison.forEach(drg => {
 *   console.log(`${drg.drgCode}: Weight ${drg.weight}, GMLOS ${drg.geometricMeanLOS}`);
 * });
 * ```
 */
export declare function compareDRGs(drgCodes: string[]): DRGAssignment[];
/**
 * 20. Suggests DRG optimization opportunities.
 *
 * @param {DRGAssignment} currentDRG - Current DRG assignment
 * @param {object} encounter - Encounter data
 * @returns {object} Optimization suggestions
 *
 * @example
 * ```typescript
 * const optimization = suggestDRGOptimization(drg, encounter);
 * if (optimization.opportunities.length > 0) {
 *   console.log('Potential improvements:', optimization.opportunities);
 * }
 * ```
 */
export declare function suggestDRGOptimization(currentDRG: DRGAssignment, encounter: any): {
    currentWeight: number;
    potentialWeight: number;
    opportunities: string[];
    queries: string[];
};
/**
 * 21. Maps ICD-10 codes to HCC categories.
 *
 * @openapi
 * /api/coding/hcc/map:
 *   post:
 *     summary: Map ICD-10 codes to HCC categories
 *     tags: [Risk Adjustment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               icd10Codes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: HCC mappings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HCCMapping'
 *
 * @param {string[]} icd10Codes - ICD-10 diagnosis codes
 * @returns {HCCMapping[]} HCC mappings
 *
 * @example
 * ```typescript
 * const hccs = mapICD10ToHCC(['E11.9', 'I50.9', 'J44.1']);
 * hccs.forEach(hcc => {
 *   console.log(`${hcc.hccCode}: ${hcc.hccDescription} (Weight: ${hcc.riskWeight})`);
 * });
 * ```
 */
export declare function mapICD10ToHCC(icd10Codes: string[]): HCCMapping[];
/**
 * 22. Calculates RAF (Risk Adjustment Factor) score.
 *
 * @param {HCCMapping[]} hccs - HCC mappings for patient
 * @param {object} demographics - Patient demographics
 * @returns {object} RAF score calculation
 *
 * @example
 * ```typescript
 * const raf = calculateRAFScore(hccMappings, {
 *   age: 75,
 *   sex: 'M',
 *   medicaidStatus: false,
 *   disabled: false
 * });
 * console.log('RAF Score:', raf.totalScore);
 * console.log('Expected annual payment:', raf.estimatedPayment);
 * ```
 */
export declare function calculateRAFScore(hccs: HCCMapping[], demographics: {
    age: number;
    sex: 'M' | 'F';
    medicaidStatus?: boolean;
    disabled?: boolean;
    institutionalized?: boolean;
}): {
    demographicScore: number;
    diseaseScore: number;
    interactionScore: number;
    totalScore: number;
    estimatedPayment?: number;
};
/**
 * 23. Applies HCC hierarchies (higher HCC supersedes lower).
 *
 * @param {HCCMapping[]} hccs - HCC mappings
 * @returns {HCCMapping[]} HCCs after applying hierarchies
 *
 * @example
 * ```typescript
 * const finalHCCs = applyHCCHierarchies(allHCCs);
 * console.log('HCCs after hierarchy:', finalHCCs.map(h => h.hccCode));
 * ```
 */
export declare function applyHCCHierarchies(hccs: HCCMapping[]): HCCMapping[];
/**
 * 24. Calculates HCC disease interactions.
 *
 * @param {HCCMapping[]} hccs - HCC mappings
 * @returns {number} Interaction score
 *
 * @example
 * ```typescript
 * const interactionScore = calculateHCCInteractions(hccs);
 * console.log('Disease interaction bonus:', interactionScore);
 * ```
 */
export declare function calculateHCCInteractions(hccs: HCCMapping[]): number;
/**
 * 25. Suggests HCC capture opportunities.
 *
 * @param {string[]} currentICD10Codes - Currently documented codes
 * @param {string[]} historicalICD10Codes - Historical diagnosis codes
 * @returns {object} HCC capture recommendations
 *
 * @example
 * ```typescript
 * const opportunities = suggestHCCCaptureOpportunities(currentCodes, historicalCodes);
 * opportunities.missing.forEach(opp => {
 *   console.log('Consider documenting:', opp.description);
 * });
 * ```
 */
export declare function suggestHCCCaptureOpportunities(currentICD10Codes: string[], historicalICD10Codes: string[]): {
    missing: Array<{
        hcc: string;
        description: string;
        impact: number;
    }>;
    queries: string[];
};
/**
 * 26. Checks NCCI edits for code pair.
 *
 * @openapi
 * /api/coding/ncci/check:
 *   post:
 *     summary: Check NCCI edits
 *     tags: [Medical Coding]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code1:
 *                 type: string
 *               code2:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: NCCI edit result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NCCIEdit'
 *
 * @param {string} code1 - First CPT/HCPCS code
 * @param {string} code2 - Second CPT/HCPCS code
 * @param {string} serviceDate - Date of service
 * @returns {object} NCCI edit result
 *
 * @example
 * ```typescript
 * const edit = checkNCCIEdit('99213', '99214', '2025-11-08');
 * if (edit.hasEdit) {
 *   console.log('NCCI edit found:', edit.editType);
 *   console.log('Modifier bypass allowed:', edit.modifierAllowed);
 * }
 * ```
 */
export declare function checkNCCIEdit(code1: string, code2: string, serviceDate: string): {
    hasEdit: boolean;
    editDetails?: NCCIEdit;
    billable: boolean;
    modifierBypass?: string;
};
/**
 * 27. Validates code bundling for claim.
 *
 * @param {string[]} codes - CPT/HCPCS codes on claim
 * @param {string} serviceDate - Date of service
 * @returns {object} Bundling validation result
 *
 * @example
 * ```typescript
 * const validation = validateCodeBundling(['99213', '80053', '36415'], '2025-11-08');
 * if (validation.edits.length > 0) {
 *   console.log('Bundling issues found:', validation.edits);
 * }
 * ```
 */
export declare function validateCodeBundling(codes: string[], serviceDate: string): {
    valid: boolean;
    edits: Array<{
        code1: string;
        code2: string;
        issue: string;
        resolution?: string;
    }>;
};
/**
 * 28. Suggests appropriate modifiers for unbundling.
 *
 * @param {string} code1 - Primary procedure code
 * @param {string} code2 - Secondary procedure code
 * @returns {string[]} Suggested modifiers
 *
 * @example
 * ```typescript
 * const modifiers = suggestUnbundlingModifiers('99213', '99214');
 * console.log('Suggested modifiers:', modifiers);
 * ```
 */
export declare function suggestUnbundlingModifiers(code1: string, code2: string): string[];
/**
 * 29. Checks for inappropriate unbundling (upcoding).
 *
 * @param {string[]} codes - Codes billed
 * @returns {object} Unbundling audit result
 *
 * @example
 * ```typescript
 * const audit = detectInappropriateUnbundling(['99213', '99214', '99215']);
 * if (audit.suspicious) {
 *   console.log('Potential upcoding detected:', audit.issues);
 * }
 * ```
 */
export declare function detectInappropriateUnbundling(codes: string[]): {
    suspicious: boolean;
    issues: string[];
    riskScore: number;
};
/**
 * 30. Optimizes code bundling for maximum reimbursement.
 *
 * @param {string[]} codes - Codes to optimize
 * @returns {object} Optimized code set
 *
 * @example
 * ```typescript
 * const optimized = optimizeCodeBundling(['99213', '80053', '36415']);
 * console.log('Optimized codes:', optimized.codes);
 * console.log('Expected reimbursement:', optimized.estimatedReimbursement);
 * ```
 */
export declare function optimizeCodeBundling(codes: string[]): {
    originalCodes: string[];
    optimizedCodes: string[];
    estimatedReimbursement: number;
    changes: string[];
};
/**
 * 31. Checks medical necessity for procedure/diagnosis pair.
 *
 * @openapi
 * /api/coding/medical-necessity/check:
 *   post:
 *     summary: Check medical necessity
 *     tags: [Medical Coding]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cptCode:
 *                 type: string
 *               icd10Codes:
 *                 type: array
 *                 items:
 *                   type: string
 *               locality:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medical necessity determination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicalNecessity'
 *
 * @param {string} cptCode - CPT/HCPCS procedure code
 * @param {string[]} icd10Codes - Diagnosis codes
 * @param {string} locality - MAC locality
 * @returns {MedicalNecessity} Medical necessity result
 *
 * @example
 * ```typescript
 * const necessity = checkMedicalNecessity('80053', ['E11.9'], '01');
 * if (necessity.covered) {
 *   console.log('Procedure is covered for diagnosis');
 * } else {
 *   console.log('Not medically necessary:', necessity.limitations);
 * }
 * ```
 */
export declare function checkMedicalNecessity(cptCode: string, icd10Codes: string[], locality?: string): MedicalNecessity;
/**
 * 32. Validates frequency limits for procedure.
 *
 * @param {string} cptCode - CPT/HCPCS code
 * @param {Date[]} previousDates - Previous service dates
 * @param {Date} currentDate - Current service date
 * @returns {object} Frequency validation
 *
 * @example
 * ```typescript
 * const validation = validateFrequencyLimits('80053', [
 *   new Date('2024-11-08'),
 *   new Date('2025-05-08')
 * ], new Date('2025-11-08'));
 * if (!validation.allowed) {
 *   console.log('Frequency limit exceeded:', validation.reason);
 * }
 * ```
 */
export declare function validateFrequencyLimits(cptCode: string, previousDates: Date[], currentDate: Date): {
    allowed: boolean;
    reason?: string;
    nextAllowedDate?: Date;
};
/**
 * 33. Gets LCD/NCD policy details.
 *
 * @param {string} cptCode - CPT/HCPCS code
 * @param {string} locality - MAC locality
 * @returns {object} Policy details
 *
 * @example
 * ```typescript
 * const policy = getLCDPolicy('80053', '01');
 * console.log('Policy:', policy.title);
 * console.log('Covered diagnoses:', policy.coveredDiagnoses);
 * ```
 */
export declare function getLCDPolicy(cptCode: string, locality: string): {
    policyNumber: string;
    title: string;
    contractor: string;
    effectiveDate: string;
    coveredDiagnoses: string[];
    limitations: string[];
};
/**
 * 34. Suggests alternative covered codes.
 *
 * @param {string} deniedCode - Code denied for medical necessity
 * @param {string[]} diagnoses - Patient diagnoses
 * @returns {string[]} Alternative covered codes
 *
 * @example
 * ```typescript
 * const alternatives = suggestAlternativeCodes('80053', ['E11.9']);
 * console.log('Consider these alternatives:', alternatives);
 * ```
 */
export declare function suggestAlternativeCodes(deniedCode: string, diagnoses: string[]): string[];
/**
 * 35. Generates medical necessity documentation template.
 *
 * @param {string} cptCode - Procedure code
 * @param {string} icd10Code - Diagnosis code
 * @returns {string} Documentation template
 *
 * @example
 * ```typescript
 * const template = generateMedicalNecessityTemplate('80053', 'E11.9');
 * console.log(template);
 * ```
 */
export declare function generateMedicalNecessityTemplate(cptCode: string, icd10Code: string): string;
/**
 * 36. Performs automated coding audit.
 *
 * @openapi
 * /api/coding/audit:
 *   post:
 *     summary: Perform coding audit
 *     tags: [Coding Quality]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               claimId:
 *                 type: string
 *               cptCodes:
 *                 type: array
 *                 items:
 *                   type: string
 *               icd10Codes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Audit results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CodingAuditResult'
 *
 * @param {object} claim - Claim data to audit
 * @returns {CodingAuditResult} Audit results
 *
 * @example
 * ```typescript
 * const audit = performCodingAudit({
 *   claimId: 'CLM-123456',
 *   cptCodes: ['99213', '80053'],
 *   icd10Codes: ['E11.9'],
 *   modifiers: [],
 *   chargeAmount: 250
 * });
 * console.log('Audit score:', audit.overallScore);
 * console.log('Risk level:', audit.riskLevel);
 * ```
 */
export declare function performCodingAudit(claim: {
    claimId: string;
    cptCodes: string[];
    icd10Codes: string[];
    modifiers?: string[];
    chargeAmount?: number;
}): CodingAuditResult;
/**
 * 37. Checks coding compliance with guidelines.
 *
 * @param {string[]} icd10Codes - Diagnosis codes
 * @param {string[]} cptCodes - Procedure codes
 * @returns {object} Compliance check result
 *
 * @example
 * ```typescript
 * const compliance = checkCodingCompliance(['E11.9'], ['99213']);
 * if (!compliance.compliant) {
 *   console.log('Compliance issues:', compliance.violations);
 * }
 * ```
 */
export declare function checkCodingCompliance(icd10Codes: string[], cptCodes: string[]): {
    compliant: boolean;
    violations: Array<{
        rule: string;
        severity: string;
        description: string;
    }>;
    score: number;
};
/**
 * 38. Calculates coding accuracy score.
 *
 * @param {CodingAuditResult[]} audits - Historical audit results
 * @returns {object} Accuracy metrics
 *
 * @example
 * ```typescript
 * const accuracy = calculateCodingAccuracy(auditResults);
 * console.log('Overall accuracy:', accuracy.accuracyRate);
 * console.log('Trend:', accuracy.trend);
 * ```
 */
export declare function calculateCodingAccuracy(audits: CodingAuditResult[]): {
    accuracyRate: number;
    totalAudits: number;
    averageScore: number;
    trend: 'improving' | 'stable' | 'declining';
};
/**
 * 39. Generates coding quality report.
 *
 * @param {string} providerId - Provider ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {object} Quality report
 *
 * @example
 * ```typescript
 * const report = generateCodingQualityReport('PRV123',
 *   new Date('2025-01-01'),
 *   new Date('2025-11-08')
 * );
 * console.log(report);
 * ```
 */
export declare function generateCodingQualityReport(providerId: string, startDate: Date, endDate: Date): {
    providerId: string;
    period: {
        start: string;
        end: string;
    };
    metrics: any;
    recommendations: string[];
};
/**
 * 40. Validates modifier usage.
 *
 * @param {string} cptCode - CPT code
 * @param {string[]} modifiers - Applied modifiers
 * @returns {object} Modifier validation
 *
 * @example
 * ```typescript
 * const validation = validateModifierUsage('99213', ['25', '59']);
 * if (!validation.valid) {
 *   console.log('Modifier issues:', validation.issues);
 * }
 * ```
 */
export declare function validateModifierUsage(cptCode: string, modifiers: string[]): {
    valid: boolean;
    issues: string[];
    suggestions: string[];
};
/**
 * 41. Performs computer-assisted coding (CAC) analysis.
 *
 * @param {string} clinicalText - Clinical documentation text
 * @returns {object} CAC suggestions
 *
 * @example
 * ```typescript
 * const cac = performCACAnalysis("Patient presents with type 2 diabetes...");
 * console.log('Suggested codes:', cac.suggestedCodes);
 * console.log('Confidence:', cac.confidence);
 * ```
 */
export declare function performCACAnalysis(clinicalText: string): {
    suggestedCodes: Array<{
        code: string;
        description: string;
        confidence: number;
    }>;
    extractedConcepts: string[];
    requiresReview: boolean;
};
/**
 * 42. Generates CDI (Clinical Documentation Improvement) query.
 *
 * @param {string} encounterId - Encounter ID
 * @param {string} queryType - Type of query needed
 * @param {string[]} clinicalIndicators - Clinical indicators
 * @returns {CDIQuery} Generated CDI query
 *
 * @example
 * ```typescript
 * const query = generateCDIQuery('ENC-123', 'specificity', [
 *   'Elevated blood glucose',
 *   'HbA1c 8.5%'
 * ]);
 * console.log(query.queryText);
 * ```
 */
export declare function generateCDIQuery(encounterId: string, queryType: 'clarification' | 'specificity' | 'clinical_validity' | 'conflict', clinicalIndicators: string[]): CDIQuery;
/**
 * 43. Maps ICD-9 codes to ICD-10 (GEM crosswalk).
 *
 * @param {string} icd9Code - ICD-9-CM code
 * @returns {string[]} ICD-10-CM equivalents
 *
 * @example
 * ```typescript
 * const icd10Codes = mapICD9ToICD10('250.00');
 * console.log('ICD-10 equivalents:', icd10Codes);
 * // ['E11.9', 'E10.9']
 * ```
 */
export declare function mapICD9ToICD10(icd9Code: string): string[];
/**
 * 44. Performs reverse code mapping (ICD-10 to ICD-9).
 *
 * @param {string} icd10Code - ICD-10-CM code
 * @returns {string[]} ICD-9-CM equivalents
 *
 * @example
 * ```typescript
 * const icd9Codes = mapICD10ToICD9('E11.9');
 * console.log('ICD-9 equivalents:', icd9Codes);
 * ```
 */
export declare function mapICD10ToICD9(icd10Code: string): string[];
/**
 * 45. Assigns revenue codes based on CPT and place of service.
 *
 * @param {string} cptCode - CPT code
 * @param {string} placeOfService - Place of service code
 * @returns {RevenueCode} Revenue code assignment
 *
 * @example
 * ```typescript
 * const revCode = assignRevenueCode('99285', '23'); // ER visit
 * console.log('Revenue code:', revCode.code, '-', revCode.description);
 * // 0450 - Emergency Room - General Classification
 * ```
 */
export declare function assignRevenueCode(cptCode: string, placeOfService: string): RevenueCode;
declare const _default: {
    searchICD10Codes: typeof searchICD10Codes;
    validateICD10Code: typeof validateICD10Code;
    lookupICD10Code: typeof lookupICD10Code;
    getICD10CodesByCategory: typeof getICD10CodesByCategory;
    expandICD10With7thCharacter: typeof expandICD10With7thCharacter;
    searchCPTCodes: typeof searchCPTCodes;
    validateCPTCode: typeof validateCPTCode;
    calculateCPTRVU: typeof calculateCPTRVU;
    determineEMLevelCode: typeof determineEMLevelCode;
    getCPTCodesByCategory: typeof getCPTCodesByCategory;
    searchHCPCSCodes: typeof searchHCPCSCodes;
    validateHCPCSCode: typeof validateHCPCSCode;
    calculateHCPCSUnits: typeof calculateHCPCSUnits;
    checkHCPCSCoverage: typeof checkHCPCSCoverage;
    mapHCPCSToCPT: typeof mapHCPCSToCPT;
    assignDRG: typeof assignDRG;
    calculateDRGReimbursement: typeof calculateDRGReimbursement;
    validateDRGAssignment: typeof validateDRGAssignment;
    compareDRGs: typeof compareDRGs;
    suggestDRGOptimization: typeof suggestDRGOptimization;
    mapICD10ToHCC: typeof mapICD10ToHCC;
    calculateRAFScore: typeof calculateRAFScore;
    applyHCCHierarchies: typeof applyHCCHierarchies;
    calculateHCCInteractions: typeof calculateHCCInteractions;
    suggestHCCCaptureOpportunities: typeof suggestHCCCaptureOpportunities;
    checkNCCIEdit: typeof checkNCCIEdit;
    validateCodeBundling: typeof validateCodeBundling;
    suggestUnbundlingModifiers: typeof suggestUnbundlingModifiers;
    detectInappropriateUnbundling: typeof detectInappropriateUnbundling;
    optimizeCodeBundling: typeof optimizeCodeBundling;
    checkMedicalNecessity: typeof checkMedicalNecessity;
    validateFrequencyLimits: typeof validateFrequencyLimits;
    getLCDPolicy: typeof getLCDPolicy;
    suggestAlternativeCodes: typeof suggestAlternativeCodes;
    generateMedicalNecessityTemplate: typeof generateMedicalNecessityTemplate;
    performCodingAudit: typeof performCodingAudit;
    checkCodingCompliance: typeof checkCodingCompliance;
    calculateCodingAccuracy: typeof calculateCodingAccuracy;
    generateCodingQualityReport: typeof generateCodingQualityReport;
    validateModifierUsage: typeof validateModifierUsage;
    performCACAnalysis: typeof performCACAnalysis;
    generateCDIQuery: typeof generateCDIQuery;
    mapICD9ToICD10: typeof mapICD9ToICD10;
    mapICD10ToICD9: typeof mapICD10ToICD9;
    assignRevenueCode: typeof assignRevenueCode;
};
export default _default;
//# sourceMappingURL=health-medical-coding-kit.d.ts.map
/**
 * LOC: HLTINS001
 * File: /reuse/server/health/health-insurance-eligibility-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - axios (HTTP client for payer APIs)
 *   - crypto (Node.js)
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Patient registration services
 *   - Eligibility verification services
 *   - Prior authorization workflows
 *   - Claims submission services
 *   - Financial counseling modules
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     EDI270Request:
 *       type: object
 *       required:
 *         - memberId
 *         - payerId
 *         - serviceDate
 *       properties:
 *         memberId:
 *           type: string
 *           description: Insurance member/subscriber ID
 *           example: "W123456789"
 *         payerId:
 *           type: string
 *           description: Payer identification (clearinghouse ID)
 *           example: "AETNA"
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Smith"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1980-05-15"
 *         serviceDate:
 *           type: string
 *           format: date
 *           description: Date of service for eligibility check
 *           example: "2025-11-08"
 *         serviceTypeCodes:
 *           type: array
 *           items:
 *             type: string
 *           description: Service type codes (30=Health Benefit Plan, 1=Medical Care, etc.)
 *           example: ["30", "1"]
 *         providerId:
 *           type: string
 *           description: Rendering provider NPI
 *           example: "1234567890"
 */
export interface EDI270Request {
    memberId: string;
    payerId: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    serviceDate: string;
    serviceTypeCodes?: string[];
    providerId?: string;
    groupNumber?: string;
    dependentCode?: string;
    traceNumber?: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     EDI271Response:
 *       type: object
 *       properties:
 *         eligible:
 *           type: boolean
 *           description: Whether patient is eligible for coverage
 *         coverageStatus:
 *           type: string
 *           enum: [active, inactive, pending, terminated]
 *         planName:
 *           type: string
 *           example: "AETNA HMO GOLD PLUS"
 *         groupNumber:
 *           type: string
 *           example: "GRP12345"
 *         effectiveDate:
 *           type: string
 *           format: date
 *         terminationDate:
 *           type: string
 *           format: date
 *         benefits:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BenefitDetail'
 *         errors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EDIError'
 */
export interface EDI271Response {
    eligible: boolean;
    coverageStatus: 'active' | 'inactive' | 'pending' | 'terminated';
    planName?: string;
    planType?: string;
    groupNumber?: string;
    effectiveDate?: string;
    terminationDate?: string;
    benefits: BenefitDetail[];
    errors?: EDIError[];
    rawResponse?: any;
    traceNumber?: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     BenefitDetail:
 *       type: object
 *       properties:
 *         serviceTypeCode:
 *           type: string
 *           description: X12 service type code
 *           example: "30"
 *         serviceTypeName:
 *           type: string
 *           example: "Health Benefit Plan Coverage"
 *         coverageLevel:
 *           type: string
 *           enum: [individual, family, employee, spouse, child]
 *         inNetwork:
 *           type: boolean
 *         copay:
 *           $ref: '#/components/schemas/CostAmount'
 *         coinsurance:
 *           $ref: '#/components/schemas/CoinsuranceDetail'
 *         deductible:
 *           $ref: '#/components/schemas/DeductibleDetail'
 *         outOfPocketMax:
 *           $ref: '#/components/schemas/OutOfPocketDetail'
 */
export interface BenefitDetail {
    serviceTypeCode: string;
    serviceTypeName?: string;
    coverageLevel: 'individual' | 'family' | 'employee' | 'spouse' | 'child';
    inNetwork: boolean;
    copay?: CostAmount;
    coinsurance?: CoinsuranceDetail;
    deductible?: DeductibleDetail;
    outOfPocketMax?: OutOfPocketDetail;
    limitations?: string[];
    authorizationRequired?: boolean;
    preCertRequired?: boolean;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     CostAmount:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           format: float
 *           example: 25.00
 *         currency:
 *           type: string
 *           default: "USD"
 *         timePeriod:
 *           type: string
 *           enum: [visit, day, month, year]
 */
export interface CostAmount {
    amount: number;
    currency?: string;
    timePeriod?: 'visit' | 'day' | 'month' | 'year';
    qualifier?: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     CoinsuranceDetail:
 *       type: object
 *       properties:
 *         percentage:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           example: 20
 *         inNetwork:
 *           type: boolean
 */
export interface CoinsuranceDetail {
    percentage: number;
    inNetwork: boolean;
    description?: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     DeductibleDetail:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           format: float
 *           example: 1500.00
 *         remaining:
 *           type: number
 *           format: float
 *           example: 750.00
 *         met:
 *           type: number
 *           format: float
 *           example: 750.00
 *         timePeriod:
 *           type: string
 *           enum: [calendar_year, plan_year, lifetime]
 */
export interface DeductibleDetail {
    total: number;
    remaining: number;
    met: number;
    timePeriod: 'calendar_year' | 'plan_year' | 'lifetime';
    inNetwork: boolean;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     OutOfPocketDetail:
 *       type: object
 *       properties:
 *         max:
 *           type: number
 *           format: float
 *           example: 5000.00
 *         met:
 *           type: number
 *           format: float
 *           example: 1200.00
 *         remaining:
 *           type: number
 *           format: float
 *           example: 3800.00
 */
export interface OutOfPocketDetail {
    max: number;
    met: number;
    remaining: number;
    timePeriod: 'calendar_year' | 'plan_year' | 'lifetime';
    inNetwork: boolean;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     EDIError:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: "AAA-72"
 *         description:
 *           type: string
 *           example: "Invalid/Missing Subscriber/Insured ID"
 *         followUpAction:
 *           type: string
 */
export interface EDIError {
    code: string;
    description: string;
    followUpAction?: string;
    severity?: 'error' | 'warning' | 'info';
}
/**
 * @swagger
 * components:
 *   schemas:
 *     PriorAuthRequest:
 *       type: object
 *       required:
 *         - memberId
 *         - payerId
 *         - procedureCode
 *         - diagnosisCode
 *       properties:
 *         memberId:
 *           type: string
 *         payerId:
 *           type: string
 *         procedureCode:
 *           type: string
 *           description: CPT/HCPCS code
 *           example: "99213"
 *         diagnosisCode:
 *           type: string
 *           description: ICD-10 code
 *           example: "E11.9"
 *         serviceDate:
 *           type: string
 *           format: date
 *         providerId:
 *           type: string
 *           description: NPI
 */
export interface PriorAuthRequest {
    memberId: string;
    payerId: string;
    procedureCode: string;
    procedureCodes?: string[];
    diagnosisCode: string;
    diagnosisCodes?: string[];
    serviceDate: string;
    providerId: string;
    placeOfService?: string;
    admissionDate?: string;
    dischargeDate?: string;
    requestingProviderId?: string;
    requestingProviderName?: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     PriorAuthResponse:
 *       type: object
 *       properties:
 *         required:
 *           type: boolean
 *           description: Whether prior auth is required
 *         authNumber:
 *           type: string
 *           description: Authorization number if approved
 *         status:
 *           type: string
 *           enum: [approved, pending, denied, not_required]
 *         expirationDate:
 *           type: string
 *           format: date
 *         approvedUnits:
 *           type: integer
 */
export interface PriorAuthResponse {
    required: boolean;
    authNumber?: string;
    status: 'approved' | 'pending' | 'denied' | 'not_required';
    expirationDate?: string;
    approvedUnits?: number;
    denialReason?: string;
    appealInstructions?: string;
    reviewDate?: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     ReferralAuthorization:
 *       type: object
 *       properties:
 *         referralNumber:
 *           type: string
 *         referringProviderId:
 *           type: string
 *         specialistProviderId:
 *           type: string
 *         validFrom:
 *           type: string
 *           format: date
 *         validUntil:
 *           type: string
 *           format: date
 *         visitsAuthorized:
 *           type: integer
 *         visitsUsed:
 *           type: integer
 */
export interface ReferralAuthorization {
    referralNumber: string;
    referringProviderId: string;
    referringProviderName?: string;
    specialistProviderId: string;
    specialistProviderName?: string;
    specialtyType?: string;
    validFrom: string;
    validUntil: string;
    visitsAuthorized: number;
    visitsUsed: number;
    status: 'active' | 'expired' | 'exhausted';
}
/**
 * @swagger
 * components:
 *   schemas:
 *     COBResponse:
 *       type: object
 *       description: Coordination of Benefits response
 *       properties:
 *         primary:
 *           $ref: '#/components/schemas/InsuranceCoverage'
 *         secondary:
 *           $ref: '#/components/schemas/InsuranceCoverage'
 *         tertiary:
 *           $ref: '#/components/schemas/InsuranceCoverage'
 *         priority:
 *           type: array
 *           items:
 *             type: string
 *           example: ["primary", "secondary"]
 */
export interface COBResponse {
    primary: InsuranceCoverage;
    secondary?: InsuranceCoverage;
    tertiary?: InsuranceCoverage;
    priority: string[];
    birthdayRule?: boolean;
    coordinationType?: 'standard' | 'carve_out' | 'non_duplication';
}
/**
 * @swagger
 * components:
 *   schemas:
 *     InsuranceCoverage:
 *       type: object
 *       properties:
 *         payerId:
 *           type: string
 *         payerName:
 *           type: string
 *         memberId:
 *           type: string
 *         groupNumber:
 *           type: string
 *         planType:
 *           type: string
 *           enum: [HMO, PPO, EPO, POS, HDHP]
 *         relationship:
 *           type: string
 *           enum: [self, spouse, child, other]
 */
export interface InsuranceCoverage {
    payerId: string;
    payerName: string;
    memberId: string;
    groupNumber?: string;
    planName?: string;
    planType?: 'HMO' | 'PPO' | 'EPO' | 'POS' | 'HDHP';
    relationship: 'self' | 'spouse' | 'child' | 'other';
    subscriberName?: string;
    effectiveDate?: string;
    terminationDate?: string;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     InsuranceCard:
 *       type: object
 *       properties:
 *         cardImage:
 *           type: string
 *           format: base64
 *         extractedData:
 *           type: object
 *           properties:
 *             memberId:
 *               type: string
 *             payerName:
 *               type: string
 *             groupNumber:
 *               type: string
 *             rxBin:
 *               type: string
 *             rxPcn:
 *               type: string
 */
export interface InsuranceCard {
    cardImage?: string;
    extractedData: {
        memberId?: string;
        payerName?: string;
        groupNumber?: string;
        planName?: string;
        subscriberName?: string;
        rxBin?: string;
        rxPcn?: string;
        rxGroup?: string;
        payerPhone?: string;
        effectiveDate?: string;
    };
    confidence?: number;
    ocrEngine?: string;
}
/**
 * 1. Builds EDI 270 eligibility inquiry request.
 *
 * @openapi
 * /api/eligibility/build-270:
 *   post:
 *     summary: Build EDI 270 eligibility inquiry transaction
 *     tags: [Insurance Eligibility]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EDI270Request'
 *     responses:
 *       200:
 *         description: EDI 270 transaction built successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   type: string
 *                   description: X12 270 transaction string
 *                 traceNumber:
 *                   type: string
 *
 * @param {EDI270Request} request - Eligibility inquiry parameters
 * @returns {object} EDI 270 transaction data
 *
 * @example
 * ```typescript
 * const edi270 = buildEDI270Request({
 *   memberId: 'W123456789',
 *   payerId: 'AETNA',
 *   firstName: 'John',
 *   lastName: 'Smith',
 *   dateOfBirth: '1980-05-15',
 *   serviceDate: '2025-11-08',
 *   serviceTypeCodes: ['30', '1'],
 *   providerId: '1234567890'
 * });
 * // Returns X12 270 transaction string for transmission
 * ```
 */
export declare function buildEDI270Request(request: EDI270Request): {
    transaction: string;
    traceNumber: string;
};
/**
 * 2. Parses EDI 271 eligibility response.
 *
 * @openapi
 * /api/eligibility/parse-271:
 *   post:
 *     summary: Parse EDI 271 eligibility response transaction
 *     tags: [Insurance Eligibility]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transaction:
 *                 type: string
 *                 description: Raw X12 271 transaction
 *     responses:
 *       200:
 *         description: Parsed eligibility response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EDI271Response'
 *
 * @param {string} transaction - Raw X12 271 transaction
 * @returns {EDI271Response} Parsed eligibility response
 *
 * @example
 * ```typescript
 * const response = parseEDI271Response(raw271Transaction);
 * console.log(response.eligible); // true
 * console.log(response.coverageStatus); // 'active'
 * console.log(response.benefits[0].copay.amount); // 25.00
 * ```
 */
export declare function parseEDI271Response(transaction: string): EDI271Response;
/**
 * 3. Sends real-time EDI 270/271 eligibility verification.
 *
 * @openapi
 * /api/eligibility/verify:
 *   post:
 *     summary: Real-time insurance eligibility verification
 *     tags: [Insurance Eligibility]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EDI270Request'
 *     responses:
 *       200:
 *         description: Eligibility verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EDI271Response'
 *       400:
 *         description: Invalid request
 *       503:
 *         description: Payer system unavailable
 *
 * @param {EDI270Request} request - Eligibility verification request
 * @param {string} clearinghouseUrl - Clearinghouse endpoint
 * @param {string} apiKey - API key for clearinghouse
 * @returns {Promise<EDI271Response>} Eligibility response
 *
 * @example
 * ```typescript
 * const eligibility = await verifyEligibilityRealtime({
 *   memberId: 'W123456789',
 *   payerId: 'AETNA',
 *   firstName: 'John',
 *   lastName: 'Smith',
 *   dateOfBirth: '1980-05-15',
 *   serviceDate: '2025-11-08',
 *   providerId: '1234567890'
 * }, 'https://clearinghouse.com/api/270', 'api-key-123');
 *
 * if (eligibility.eligible) {
 *   console.log('Patient is eligible');
 *   console.log('Copay:', eligibility.benefits[0].copay?.amount);
 * }
 * ```
 */
export declare function verifyEligibilityRealtime(request: EDI270Request, clearinghouseUrl: string, apiKey: string): Promise<EDI271Response>;
/**
 * 4. Validates eligibility response for billing readiness.
 *
 * @param {EDI271Response} response - Parsed 271 response
 * @param {string} serviceDate - Planned service date
 * @returns {object} Validation result with billing recommendations
 *
 * @example
 * ```typescript
 * const validation = validateEligibilityForBilling(eligibilityResponse, '2025-11-08');
 *
 * if (!validation.billingReady) {
 *   console.log('Issues:', validation.issues);
 *   console.log('Recommendations:', validation.recommendations);
 * }
 * ```
 */
export declare function validateEligibilityForBilling(response: EDI271Response, serviceDate: string): {
    billingReady: boolean;
    issues: string[];
    recommendations: string[];
};
/**
 * 5. Extracts patient financial responsibility from eligibility response.
 *
 * @param {EDI271Response} response - Eligibility response
 * @param {string} serviceTypeCode - Service type code (default: '30')
 * @returns {object} Patient financial responsibility
 *
 * @example
 * ```typescript
 * const responsibility = extractPatientResponsibility(eligibilityResponse, '30');
 * console.log('Copay:', responsibility.copay);
 * console.log('Deductible remaining:', responsibility.deductibleRemaining);
 * console.log('Coinsurance:', responsibility.coinsurancePercentage);
 * ```
 */
export declare function extractPatientResponsibility(response: EDI271Response, serviceTypeCode?: string): {
    copay: number | null;
    deductibleRemaining: number | null;
    coinsurancePercentage: number | null;
    outOfPocketRemaining: number | null;
};
/**
 * 6. Generates eligibility verification summary report.
 *
 * @param {EDI271Response} response - Eligibility response
 * @returns {string} Human-readable eligibility summary
 *
 * @example
 * ```typescript
 * const summary = generateEligibilitySummary(eligibilityResponse);
 * console.log(summary);
 * // "ELIGIBLE - AETNA HMO GOLD PLUS
 * //  Coverage: Active
 * //  Copay: $25.00
 * //  Deductible: $750.00 remaining of $1,500.00"
 * ```
 */
export declare function generateEligibilitySummary(response: EDI271Response): string;
/**
 * 7. Verifies specific service benefits.
 *
 * @param {EDI271Response} eligibility - Eligibility response
 * @param {string[]} serviceCodes - CPT/HCPCS codes
 * @returns {object[]} Service-specific benefit details
 *
 * @example
 * ```typescript
 * const benefits = verifyServiceBenefits(eligibilityResponse, ['99213', '80053']);
 * benefits.forEach(b => {
 *   console.log(`${b.code}: Covered ${b.covered}, Copay $${b.copay}`);
 * });
 * ```
 */
export declare function verifyServiceBenefits(eligibility: EDI271Response, serviceCodes: string[]): Array<{
    code: string;
    covered: boolean;
    copay?: number;
    authRequired: boolean;
}>;
/**
 * 8. Checks if prior authorization is required for procedure.
 *
 * @param {EDI271Response} eligibility - Eligibility response
 * @param {string} procedureCode - CPT/HCPCS code
 * @returns {boolean} Whether prior auth is required
 *
 * @example
 * ```typescript
 * if (isPriorAuthRequired(eligibility, '99285')) {
 *   console.log('Prior authorization required for this procedure');
 *   // Initiate prior auth workflow
 * }
 * ```
 */
export declare function isPriorAuthRequired(eligibility: EDI271Response, procedureCode: string): boolean;
/**
 * 9. Calculates estimated patient cost for service.
 *
 * @param {EDI271Response} eligibility - Eligibility response
 * @param {number} chargeAmount - Service charge amount
 * @param {string} serviceTypeCode - Service type code
 * @returns {object} Estimated patient cost breakdown
 *
 * @example
 * ```typescript
 * const estimate = calculatePatientCost(eligibility, 250.00, '30');
 * console.log('Patient owes:', estimate.patientResponsibility);
 * console.log('Breakdown:', estimate.breakdown);
 * ```
 */
export declare function calculatePatientCost(eligibility: EDI271Response, chargeAmount: number, serviceTypeCode?: string): {
    patientResponsibility: number;
    insurancePays: number;
    breakdown: any;
};
/**
 * 10. Verifies network status for provider.
 *
 * @param {string} providerId - Provider NPI
 * @param {string} payerId - Payer ID
 * @param {string} planType - Plan type (HMO, PPO, etc.)
 * @returns {Promise<object>} Network status
 *
 * @example
 * ```typescript
 * const status = await verifyNetworkStatus('1234567890', 'AETNA', 'PPO');
 * console.log('In network:', status.inNetwork);
 * console.log('Tier:', status.tier);
 * ```
 */
export declare function verifyNetworkStatus(providerId: string, payerId: string, planType?: string): Promise<{
    inNetwork: boolean;
    tier?: string;
    effectiveDate?: string;
}>;
/**
 * 11. Gets remaining benefit amounts for calendar year.
 *
 * @param {EDI271Response} eligibility - Eligibility response
 * @returns {object} Remaining benefit amounts
 *
 * @example
 * ```typescript
 * const remaining = getRemainingBenefits(eligibility);
 * console.log('Deductible remaining:', remaining.deductible);
 * console.log('Out-of-pocket remaining:', remaining.outOfPocketMax);
 * ```
 */
export declare function getRemainingBenefits(eligibility: EDI271Response): {
    deductible: number | null;
    outOfPocketMax: number | null;
    benefits: any[];
};
/**
 * 12. Validates coverage for specific date range.
 *
 * @param {EDI271Response} eligibility - Eligibility response
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {object} Coverage validation result
 *
 * @example
 * ```typescript
 * const coverage = validateCoverageDates(eligibility, '2025-11-08', '2025-11-15');
 * if (!coverage.valid) {
 *   console.log('Coverage issues:', coverage.issues);
 * }
 * ```
 */
export declare function validateCoverageDates(eligibility: EDI271Response, startDate: string, endDate: string): {
    valid: boolean;
    issues: string[];
};
/**
 * 13. Submits prior authorization request.
 *
 * @openapi
 * /api/prior-auth/submit:
 *   post:
 *     summary: Submit prior authorization request
 *     tags: [Prior Authorization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PriorAuthRequest'
 *     responses:
 *       200:
 *         description: Prior auth request submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriorAuthResponse'
 *
 * @param {PriorAuthRequest} request - Prior auth request
 * @returns {Promise<PriorAuthResponse>} Prior auth response
 *
 * @example
 * ```typescript
 * const authResponse = await submitPriorAuthRequest({
 *   memberId: 'W123456789',
 *   payerId: 'AETNA',
 *   procedureCode: '99285',
 *   diagnosisCode: 'S06.0X0A',
 *   serviceDate: '2025-11-10',
 *   providerId: '1234567890'
 * });
 *
 * if (authResponse.status === 'approved') {
 *   console.log('Auth number:', authResponse.authNumber);
 * }
 * ```
 */
export declare function submitPriorAuthRequest(request: PriorAuthRequest): Promise<PriorAuthResponse>;
/**
 * 14. Checks prior authorization status.
 *
 * @param {string} authNumber - Authorization number
 * @param {string} payerId - Payer ID
 * @returns {Promise<PriorAuthResponse>} Current authorization status
 *
 * @example
 * ```typescript
 * const status = await checkPriorAuthStatus('AUTH-ABC123', 'AETNA');
 * console.log('Status:', status.status);
 * console.log('Expires:', status.expirationDate);
 * ```
 */
export declare function checkPriorAuthStatus(authNumber: string, payerId: string): Promise<PriorAuthResponse>;
/**
 * 15. Validates prior authorization before service.
 *
 * @param {string} authNumber - Authorization number
 * @param {string} serviceDate - Planned service date
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePriorAuth('AUTH-ABC123', '2025-11-08');
 * if (!validation.valid) {
 *   console.log('Auth issues:', validation.issues);
 * }
 * ```
 */
export declare function validatePriorAuth(authNumber: string, serviceDate: string): {
    valid: boolean;
    issues: string[];
};
/**
 * 16. Creates referral authorization.
 *
 * @param {Partial<ReferralAuthorization>} referral - Referral details
 * @returns {ReferralAuthorization} Created referral
 *
 * @example
 * ```typescript
 * const referral = createReferralAuthorization({
 *   referringProviderId: '1111111111',
 *   specialistProviderId: '2222222222',
 *   specialtyType: 'Cardiology',
 *   validFrom: '2025-11-08',
 *   validUntil: '2026-02-08',
 *   visitsAuthorized: 3
 * });
 * ```
 */
export declare function createReferralAuthorization(referral: Partial<ReferralAuthorization>): ReferralAuthorization;
/**
 * 17. Validates referral authorization.
 *
 * @param {ReferralAuthorization} referral - Referral to validate
 * @param {string} serviceDate - Service date
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReferral(referral, '2025-11-08');
 * if (validation.valid) {
 *   console.log('Referral is valid, visits remaining:', validation.visitsRemaining);
 * }
 * ```
 */
export declare function validateReferral(referral: ReferralAuthorization, serviceDate: string): {
    valid: boolean;
    issues: string[];
    visitsRemaining?: number;
};
/**
 * 18. Updates referral visit usage.
 *
 * @param {ReferralAuthorization} referral - Referral to update
 * @returns {ReferralAuthorization} Updated referral
 *
 * @example
 * ```typescript
 * const updated = incrementReferralVisit(referral);
 * console.log('Visits used:', updated.visitsUsed);
 * console.log('Visits remaining:', updated.visitsAuthorized - updated.visitsUsed);
 * ```
 */
export declare function incrementReferralVisit(referral: ReferralAuthorization): ReferralAuthorization;
/**
 * 19. Determines coordination of benefits (COB) order.
 *
 * @param {InsuranceCoverage[]} coverages - Patient's insurance coverages
 * @param {string} patientDOB - Patient date of birth
 * @returns {COBResponse} COB priority order
 *
 * @example
 * ```typescript
 * const cob = determineCoordinationOfBenefits([primary, secondary], '1980-05-15');
 * console.log('Primary:', cob.primary.payerName);
 * console.log('Secondary:', cob.secondary?.payerName);
 * ```
 */
export declare function determineCoordinationOfBenefits(coverages: InsuranceCoverage[], patientDOB: string): COBResponse;
/**
 * 20. Calculates COB payment distribution.
 *
 * @param {number} chargeAmount - Total charge
 * @param {EDI271Response} primaryEligibility - Primary insurance eligibility
 * @param {EDI271Response} secondaryEligibility - Secondary insurance eligibility
 * @returns {object} Payment distribution
 *
 * @example
 * ```typescript
 * const distribution = calculateCOBPayment(500, primaryElig, secondaryElig);
 * console.log('Primary pays:', distribution.primaryPays);
 * console.log('Secondary pays:', distribution.secondaryPays);
 * console.log('Patient owes:', distribution.patientOwes);
 * ```
 */
export declare function calculateCOBPayment(chargeAmount: number, primaryEligibility: EDI271Response, secondaryEligibility?: EDI271Response): {
    primaryPays: number;
    secondaryPays: number;
    patientOwes: number;
    breakdown: any;
};
/**
 * 21. Validates secondary insurance eligibility.
 *
 * @param {EDI271Response} secondaryEligibility - Secondary insurance response
 * @param {number} primaryPayment - Primary insurance payment
 * @returns {object} Secondary validation result
 *
 * @example
 * ```typescript
 * const validation = validateSecondaryInsurance(secondaryElig, 300);
 * if (validation.valid) {
 *   console.log('Secondary insurance will pay');
 * }
 * ```
 */
export declare function validateSecondaryInsurance(secondaryEligibility: EDI271Response, primaryPayment: number): {
    valid: boolean;
    willPay: boolean;
    issues: string[];
};
/**
 * 22. Determines Medicare/Medicaid coordination.
 *
 * @param {InsuranceCoverage[]} coverages - Patient coverages
 * @returns {object} Medicare/Medicaid coordination result
 *
 * @example
 * ```typescript
 * const coordination = determineMedicareMedicaidCOB(patientCoverages);
 * console.log('Has Medicare:', coordination.hasMedicare);
 * console.log('Has Medicaid:', coordination.hasMedicaid);
 * console.log('Dual eligible:', coordination.dualEligible);
 * ```
 */
export declare function determineMedicareMedicaidCOB(coverages: InsuranceCoverage[]): {
    hasMedicare: boolean;
    hasMedicaid: boolean;
    dualEligible: boolean;
    primaryPayer: string;
};
/**
 * 23. Checks workers compensation coordination.
 *
 * @param {InsuranceCoverage[]} coverages - Patient coverages
 * @param {string} diagnosisCode - ICD-10 diagnosis code
 * @returns {object} Workers comp coordination
 *
 * @example
 * ```typescript
 * const wcCoord = checkWorkersCompCOB(coverages, 'S06.0X0A');
 * if (wcCoord.isWorkersComp) {
 *   console.log('Workers comp is primary payer');
 * }
 * ```
 */
export declare function checkWorkersCompCOB(coverages: InsuranceCoverage[], diagnosisCode: string): {
    isWorkersComp: boolean;
    wcPayer?: InsuranceCoverage;
    isPrimary: boolean;
};
/**
 * 24. Generates COB claim submission order.
 *
 * @param {COBResponse} cob - COB determination
 * @returns {string[]} Claim submission order
 *
 * @example
 * ```typescript
 * const order = generateCOBClaimOrder(cobResponse);
 * console.log('Submit claims in order:', order);
 * // ['AETNA', 'MEDICARE', 'PATIENT']
 * ```
 */
export declare function generateCOBClaimOrder(cob: COBResponse): string[];
/**
 * 25. Verifies Medicare eligibility and coverage parts.
 *
 * @param {EDI270Request} request - Eligibility request
 * @returns {Promise<object>} Medicare eligibility details
 *
 * @example
 * ```typescript
 * const medicare = await verifyMedicareEligibility({
 *   memberId: '1AA2BB3CC44',
 *   payerId: 'MEDICARE',
 *   serviceDate: '2025-11-08',
 *   firstName: 'John',
 *   lastName: 'Smith'
 * });
 * console.log('Part A:', medicare.partA);
 * console.log('Part B:', medicare.partB);
 * ```
 */
export declare function verifyMedicareEligibility(request: EDI270Request): Promise<{
    partA: boolean;
    partB: boolean;
    partC: boolean;
    partD: boolean;
    mspType?: string;
    effectiveDate?: string;
}>;
/**
 * 26. Verifies Medicaid eligibility and managed care.
 *
 * @param {EDI270Request} request - Eligibility request
 * @returns {Promise<object>} Medicaid eligibility details
 *
 * @example
 * ```typescript
 * const medicaid = await verifyMedicaidEligibility(request);
 * console.log('Managed care plan:', medicaid.managedCarePlan);
 * console.log('Eligibility category:', medicaid.category);
 * ```
 */
export declare function verifyMedicaidEligibility(request: EDI270Request): Promise<{
    eligible: boolean;
    managedCarePlan?: string;
    category?: string;
    effectiveDate?: string;
    recertificationDate?: string;
}>;
/**
 * 27. Checks Medicare Secondary Payer (MSP) status.
 *
 * @param {string} memberId - Medicare member ID
 * @param {InsuranceCoverage[]} otherCoverages - Other insurance coverages
 * @returns {object} MSP determination
 *
 * @example
 * ```typescript
 * const msp = checkMedicareSecondaryPayer('1AA2BB3CC44', otherCoverages);
 * if (msp.isMedicarePrimary) {
 *   console.log('Bill Medicare first');
 * }
 * ```
 */
export declare function checkMedicareSecondaryPayer(memberId: string, otherCoverages: InsuranceCoverage[]): {
    isMedicarePrimary: boolean;
    mspType?: string;
    primaryPayer?: string;
};
/**
 * 28. Verifies workers compensation coverage.
 *
 * @param {EDI270Request} request - Eligibility request
 * @returns {Promise<object>} Workers comp coverage
 *
 * @example
 * ```typescript
 * const wc = await verifyWorkersCompCoverage(request);
 * console.log('Claim number:', wc.claimNumber);
 * console.log('Employer:', wc.employer);
 * ```
 */
export declare function verifyWorkersCompCoverage(request: EDI270Request): Promise<{
    covered: boolean;
    claimNumber?: string;
    employer?: string;
    injuryDate?: string;
    caseManager?: string;
}>;
/**
 * 29. Validates Medicaid spend-down requirements.
 *
 * @param {string} memberId - Medicaid member ID
 * @param {number} income - Monthly income
 * @returns {object} Spend-down calculation
 *
 * @example
 * ```typescript
 * const spendDown = calculateMedicaidSpendDown('MCD123456', 2500);
 * console.log('Spend-down amount:', spendDown.amount);
 * console.log('Met:', spendDown.met);
 * ```
 */
export declare function calculateMedicaidSpendDown(memberId: string, income: number): {
    required: boolean;
    amount: number;
    met: number;
    remaining: number;
};
/**
 * 30. Checks Medicare Advantage (Part C) plan details.
 *
 * @param {EDI271Response} eligibility - Eligibility response
 * @returns {object} Medicare Advantage details
 *
 * @example
 * ```typescript
 * const ma = getMedicareAdvantageDetails(eligibility);
 * console.log('MA Plan:', ma.planName);
 * console.log('Star rating:', ma.starRating);
 * ```
 */
export declare function getMedicareAdvantageDetails(eligibility: EDI271Response): {
    isMedicareAdvantage: boolean;
    planName?: string;
    contractNumber?: string;
    starRating?: number;
};
/**
 * 31. Extracts data from insurance card image using OCR.
 *
 * @param {string} imageBase64 - Base64 encoded card image
 * @returns {Promise<InsuranceCard>} Extracted card data
 *
 * @example
 * ```typescript
 * const cardData = await extractInsuranceCardData(base64Image);
 * console.log('Member ID:', cardData.extractedData.memberId);
 * console.log('Payer:', cardData.extractedData.payerName);
 * console.log('Confidence:', cardData.confidence);
 * ```
 */
export declare function extractInsuranceCardData(imageBase64: string): Promise<InsuranceCard>;
/**
 * 32. Validates extracted insurance card data.
 *
 * @param {InsuranceCard} cardData - Extracted card data
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateInsuranceCardData(extractedCard);
 * if (!validation.valid) {
 *   console.log('Manual review required:', validation.issues);
 * }
 * ```
 */
export declare function validateInsuranceCardData(cardData: InsuranceCard): {
    valid: boolean;
    confidence: number;
    issues: string[];
    requiresManualReview: boolean;
};
/**
 * 33. Matches payer from card to payer database.
 *
 * @param {string} payerName - Payer name from card
 * @returns {object} Matched payer information
 *
 * @example
 * ```typescript
 * const payer = matchPayerFromCardData('AETNA');
 * console.log('Payer ID:', payer.payerId);
 * console.log('Clearinghouse ID:', payer.clearinghouseId);
 * ```
 */
export declare function matchPayerFromCardData(payerName: string): {
    payerId: string;
    payerName: string;
    clearinghouseId?: string;
    confidence: number;
};
/**
 * 34. Saves insurance card image with patient record.
 *
 * @param {string} patientId - Patient ID
 * @param {InsuranceCard} cardData - Card data
 * @param {string} side - Card side (front/back)
 * @returns {Promise<object>} Save result
 *
 * @example
 * ```typescript
 * const result = await saveInsuranceCardImage('patient-123', cardData, 'front');
 * console.log('Saved to:', result.imageUrl);
 * ```
 */
export declare function saveInsuranceCardImage(patientId: string, cardData: InsuranceCard, side: 'front' | 'back'): Promise<{
    imageUrl: string;
    documentId: string;
}>;
/**
 * 35. Gets payer contact and submission information.
 *
 * @param {string} payerId - Payer ID
 * @returns {object} Payer contact information
 *
 * @example
 * ```typescript
 * const payer = getPayerInformation('AETNA');
 * console.log('Phone:', payer.phone);
 * console.log('Claims address:', payer.claimsAddress);
 * ```
 */
export declare function getPayerInformation(payerId: string): {
    payerId: string;
    payerName: string;
    phone: string;
    claimsAddress?: string;
    eligibilityPhone?: string;
    clearinghouseId?: string;
};
/**
 * 36. Searches insurance plan catalog.
 *
 * @param {object} criteria - Search criteria
 * @returns {object[]} Matching insurance plans
 *
 * @example
 * ```typescript
 * const plans = searchInsurancePlans({ payerId: 'AETNA', planType: 'HMO' });
 * plans.forEach(plan => {
 *   console.log(plan.planName, '-', plan.networkType);
 * });
 * ```
 */
export declare function searchInsurancePlans(criteria: {
    payerId?: string;
    planType?: string;
    state?: string;
}): Array<{
    planId: string;
    planName: string;
    payerId: string;
    planType: string;
    networkType: string;
}>;
/**
 * 37. Checks payer enrollment status for provider.
 *
 * @param {string} providerId - Provider NPI
 * @param {string} payerId - Payer ID
 * @returns {Promise<object>} Enrollment status
 *
 * @example
 * ```typescript
 * const enrollment = await checkPayerEnrollment('1234567890', 'AETNA');
 * if (enrollment.enrolled) {
 *   console.log('Provider ID:', enrollment.providerIdNumber);
 * }
 * ```
 */
export declare function checkPayerEnrollment(providerId: string, payerId: string): Promise<{
    enrolled: boolean;
    effectiveDate?: string;
    providerIdNumber?: string;
    networkTier?: string;
}>;
/**
 * 38. Calculates patient copay for service.
 *
 * @param {BenefitDetail} benefit - Benefit information
 * @param {string} placeOfService - Place of service code
 * @returns {number | null} Copay amount
 *
 * @example
 * ```typescript
 * const copay = calculateCopay(benefit, '11'); // Office visit
 * console.log('Patient copay: $' + copay);
 * ```
 */
export declare function calculateCopay(benefit: BenefitDetail, placeOfService: string): number | null;
/**
 * 39. Tracks deductible and out-of-pocket accumulation.
 *
 * @param {DeductibleDetail} current - Current deductible
 * @param {number} claimAmount - New claim amount
 * @returns {DeductibleDetail} Updated deductible
 *
 * @example
 * ```typescript
 * const updated = accumulateDeductible(currentDeductible, 500);
 * console.log('New deductible met:', updated.met);
 * console.log('Remaining:', updated.remaining);
 * ```
 */
export declare function accumulateDeductible(current: DeductibleDetail, claimAmount: number): DeductibleDetail;
/**
 * 40. Generates patient financial estimate.
 *
 * @param {EDI271Response} eligibility - Eligibility response
 * @param {number} estimatedCharges - Estimated service charges
 * @param {string[]} procedureCodes - CPT codes
 * @returns {object} Financial estimate
 *
 * @example
 * ```typescript
 * const estimate = generatePatientEstimate(eligibility, 1500, ['99213', '80053']);
 * console.log('Estimated patient responsibility:', estimate.patientOwes);
 * console.log('Insurance expected to pay:', estimate.insurancePays);
 * console.log('Breakdown:', estimate.breakdown);
 * ```
 */
export declare function generatePatientEstimate(eligibility: EDI271Response, estimatedCharges: number, procedureCodes: string[]): {
    patientOwes: number;
    insurancePays: number;
    breakdown: any;
    disclaimer: string;
};
declare const _default: {
    buildEDI270Request: typeof buildEDI270Request;
    parseEDI271Response: typeof parseEDI271Response;
    verifyEligibilityRealtime: typeof verifyEligibilityRealtime;
    validateEligibilityForBilling: typeof validateEligibilityForBilling;
    extractPatientResponsibility: typeof extractPatientResponsibility;
    generateEligibilitySummary: typeof generateEligibilitySummary;
    verifyServiceBenefits: typeof verifyServiceBenefits;
    isPriorAuthRequired: typeof isPriorAuthRequired;
    calculatePatientCost: typeof calculatePatientCost;
    verifyNetworkStatus: typeof verifyNetworkStatus;
    getRemainingBenefits: typeof getRemainingBenefits;
    validateCoverageDates: typeof validateCoverageDates;
    submitPriorAuthRequest: typeof submitPriorAuthRequest;
    checkPriorAuthStatus: typeof checkPriorAuthStatus;
    validatePriorAuth: typeof validatePriorAuth;
    createReferralAuthorization: typeof createReferralAuthorization;
    validateReferral: typeof validateReferral;
    incrementReferralVisit: typeof incrementReferralVisit;
    determineCoordinationOfBenefits: typeof determineCoordinationOfBenefits;
    calculateCOBPayment: typeof calculateCOBPayment;
    validateSecondaryInsurance: typeof validateSecondaryInsurance;
    determineMedicareMedicaidCOB: typeof determineMedicareMedicaidCOB;
    checkWorkersCompCOB: typeof checkWorkersCompCOB;
    generateCOBClaimOrder: typeof generateCOBClaimOrder;
    verifyMedicareEligibility: typeof verifyMedicareEligibility;
    verifyMedicaidEligibility: typeof verifyMedicaidEligibility;
    checkMedicareSecondaryPayer: typeof checkMedicareSecondaryPayer;
    verifyWorkersCompCoverage: typeof verifyWorkersCompCoverage;
    calculateMedicaidSpendDown: typeof calculateMedicaidSpendDown;
    getMedicareAdvantageDetails: typeof getMedicareAdvantageDetails;
    extractInsuranceCardData: typeof extractInsuranceCardData;
    validateInsuranceCardData: typeof validateInsuranceCardData;
    matchPayerFromCardData: typeof matchPayerFromCardData;
    saveInsuranceCardImage: typeof saveInsuranceCardImage;
    getPayerInformation: typeof getPayerInformation;
    searchInsurancePlans: typeof searchInsurancePlans;
    checkPayerEnrollment: typeof checkPayerEnrollment;
    calculateCopay: typeof calculateCopay;
    accumulateDeductible: typeof accumulateDeductible;
    generatePatientEstimate: typeof generatePatientEstimate;
};
export default _default;
//# sourceMappingURL=health-insurance-eligibility-kit.d.ts.map
/**
 * LOC: INS-QUOTE-001
 * File: /reuse/insurance/quote-generation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Insurance quoting services
 *   - Agent portal modules
 *   - Customer self-service applications
 *   - Policy binding workflows
 */
/**
 * File: /reuse/insurance/quote-generation-kit.ts
 * Locator: WC-UTL-INSQUOTE-001
 * Purpose: Insurance Quote Generation & Management Kit - Comprehensive quote lifecycle utilities
 *
 * Upstream: Independent utility module for insurance quote generation operations
 * Downstream: ../backend/*, Insurance services, Agent portals, Customer applications, Policy processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Rating engines
 * Exports: 42 utility functions for quote request intake, multi-product quoting, instant calculations, comparative rating, quote proposals, revisions, expiration management, conversion tracking, policy binding, declination handling
 *
 * LLM Context: Production-ready insurance quote generation utilities for White Cross healthcare platform.
 * Provides comprehensive quote management including request intake and validation, multi-product quoting,
 * instant quote calculations, comparative rating across carriers, quote proposal generation, quote revision
 * and alternatives, expiration management, quote conversion tracking, bind quote to policy workflows,
 * quote declination with reasons, pre-fill from prior carrier data, quote comparison tools, quote delivery
 * (email, portal, print), quote follow-up scheduling, and agent quote sharing capabilities. Essential for
 * providing fast, accurate insurance quotes while maintaining compliance and competitive pricing.
 */
import { Sequelize } from 'sequelize';
/**
 * Quote status
 */
export type QuoteStatus = 'draft' | 'pending' | 'quoted' | 'revised' | 'accepted' | 'declined' | 'expired' | 'bound' | 'withdrawn';
/**
 * Product type
 */
export type ProductType = 'health' | 'dental' | 'vision' | 'life' | 'disability' | 'accident' | 'critical_illness' | 'hospital_indemnity' | 'supplemental' | 'medicare_supplement' | 'medicare_advantage' | 'long_term_care';
/**
 * Coverage tier
 */
export type CoverageTier = 'employee' | 'employee_spouse' | 'employee_children' | 'family';
/**
 * Quote delivery method
 */
export type DeliveryMethod = 'email' | 'portal' | 'print' | 'api' | 'agent_presentation';
/**
 * Quote request
 */
export interface QuoteRequest {
    requestId: string;
    requestDate: Date;
    effectiveDate: Date;
    productTypes: ProductType[];
    applicantInfo: ApplicantInfo;
    coverageRequirements: CoverageRequirements;
    groupInfo?: GroupInfo;
    priorCarrierInfo?: PriorCarrierInfo;
    specialRequirements?: string[];
}
/**
 * Applicant information
 */
export interface ApplicantInfo {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'M' | 'F' | 'Other';
    address: Address;
    email: string;
    phone: string;
    ssn?: string;
    tobaccoUse: boolean;
    dependents?: DependentInfo[];
}
/**
 * Address information
 */
export interface Address {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    county?: string;
}
/**
 * Dependent information
 */
export interface DependentInfo {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'M' | 'F' | 'Other';
    relationship: 'spouse' | 'child' | 'domestic_partner';
    tobaccoUse: boolean;
}
/**
 * Coverage requirements
 */
export interface CoverageRequirements {
    coverageTier: CoverageTier;
    deductible?: number;
    coinsurance?: number;
    outOfPocketMax?: number;
    coverageAmount?: number;
    benefitPeriod?: string;
    eliminationPeriod?: number;
    riders?: string[];
}
/**
 * Group information
 */
export interface GroupInfo {
    groupId: string;
    groupName: string;
    groupSize: number;
    sicCode: string;
    industry: string;
    contributionPercentage: number;
    participationPercentage: number;
}
/**
 * Prior carrier information
 */
export interface PriorCarrierInfo {
    carrierName: string;
    policyNumber?: string;
    currentPremium?: number;
    coverageDetails?: any;
    claimsHistory?: ClaimHistory[];
    renewalDate?: Date;
}
/**
 * Claim history
 */
export interface ClaimHistory {
    claimDate: Date;
    claimAmount: number;
    claimType: string;
    status: string;
}
/**
 * Quote result
 */
export interface QuoteResult {
    quoteId: string;
    quoteNumber: string;
    status: QuoteStatus;
    productType: ProductType;
    carrier: string;
    plan: PlanDetails;
    premium: PremiumBreakdown;
    coverage: CoverageDetails;
    effectiveDate: Date;
    expirationDate: Date;
    validUntil: Date;
    createdAt: Date;
}
/**
 * Plan details
 */
export interface PlanDetails {
    planId: string;
    planName: string;
    planType: string;
    networkType: 'HMO' | 'PPO' | 'EPO' | 'POS' | 'HDHP' | 'Indemnity';
    metalLevel?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Catastrophic';
    hsaEligible: boolean;
    description: string;
}
/**
 * Premium breakdown
 */
export interface PremiumBreakdown {
    basePremium: number;
    riderPremiums: Record<string, number>;
    discounts: Record<string, number>;
    surcharges: Record<string, number>;
    taxes: number;
    fees: number;
    totalPremium: number;
    frequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
}
/**
 * Coverage details
 */
export interface CoverageDetails {
    deductible: number;
    deductibleType: 'individual' | 'family' | 'embedded';
    coinsurance: number;
    outOfPocketMax: number;
    outOfPocketMaxType: 'individual' | 'family';
    copays: Record<string, number>;
    coverageAmount?: number;
    benefitMaximum?: number;
    networkCoverage: NetworkCoverage;
    benefits: BenefitDetails[];
}
/**
 * Network coverage
 */
export interface NetworkCoverage {
    inNetwork: boolean;
    outOfNetwork: boolean;
    emergencyCoverage: boolean;
    networkSize?: number;
    providerCount?: number;
}
/**
 * Benefit details
 */
export interface BenefitDetails {
    category: string;
    service: string;
    inNetworkCoverage: string;
    outOfNetworkCoverage?: string;
    limitations?: string;
}
/**
 * Quote comparison
 */
export interface QuoteComparison {
    quotes: QuoteResult[];
    comparisonMetrics: {
        lowestPremium: number;
        highestPremium: number;
        averagePremium: number;
        premiumRange: number;
    };
    recommendations: QuoteRecommendation[];
}
/**
 * Quote recommendation
 */
export interface QuoteRecommendation {
    quoteId: string;
    reason: string;
    score: number;
    category: 'best_value' | 'lowest_cost' | 'best_coverage' | 'balanced';
}
/**
 * Quote proposal
 */
export interface QuoteProposal {
    proposalId: string;
    quoteIds: string[];
    coverLetter: string;
    highlights: string[];
    comparisonChart: any;
    termsAndConditions: string;
    validUntil: Date;
    createdAt: Date;
}
/**
 * Quote revision
 */
export interface QuoteRevision {
    revisionId: string;
    originalQuoteId: string;
    revisedQuoteId: string;
    revisionReason: string;
    changedFields: Record<string, {
        old: any;
        new: any;
    }>;
    requestedBy: string;
    createdAt: Date;
}
/**
 * Quote conversion tracking
 */
export interface QuoteConversion {
    quoteId: string;
    conversionDate: Date;
    policyNumber: string;
    conversionRate: number;
    timeToConversion: number;
    touchpoints: Array<{
        date: Date;
        type: string;
        notes: string;
    }>;
}
/**
 * Quote declination
 */
export interface QuoteDeclination {
    quoteId: string;
    declinedDate: Date;
    reason: DeclinationReason;
    competitorInfo?: {
        carrier: string;
        premium: number;
    };
    notes?: string;
}
/**
 * Declination reason
 */
export type DeclinationReason = 'price_too_high' | 'coverage_insufficient' | 'chose_competitor' | 'timing_not_right' | 'no_longer_needed' | 'underwriting_declined' | 'other';
/**
 * Quote follow-up
 */
export interface QuoteFollowUp {
    followUpId: string;
    quoteId: string;
    scheduledDate: Date;
    followUpType: 'email' | 'call' | 'meeting' | 'reminder';
    assignedTo: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
}
/**
 * Quote model attributes
 */
export interface QuoteAttributes {
    id: string;
    quoteNumber: string;
    requestId: string;
    status: QuoteStatus;
    productType: ProductType;
    carrier: string;
    planId: string;
    applicantData: any;
    coverageData: any;
    premiumData: any;
    effectiveDate: Date;
    expirationDate: Date;
    validUntil: Date;
    createdBy: string;
    lastModifiedBy?: string;
    boundPolicyId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates Quote model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<QuoteAttributes>>} Quote model
 *
 * @example
 * ```typescript
 * const QuoteModel = createQuoteModel(sequelize);
 * const quote = await QuoteModel.create({
 *   quoteNumber: 'Q-2024-001',
 *   requestId: 'REQ-123',
 *   status: 'quoted',
 *   productType: 'health'
 * });
 * ```
 */
export declare const createQuoteModel: (sequelize: Sequelize) => any;
/**
 * Quote request model attributes
 */
export interface QuoteRequestAttributes {
    id: string;
    requestNumber: string;
    requestDate: Date;
    effectiveDate: Date;
    productTypes: string[];
    applicantData: any;
    coverageRequirements: any;
    priorCarrierData?: any;
    status: string;
    quotesGenerated: number;
    requestedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates QuoteRequest model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<QuoteRequestAttributes>>} QuoteRequest model
 *
 * @example
 * ```typescript
 * const RequestModel = createQuoteRequestModel(sequelize);
 * const request = await RequestModel.create({
 *   requestNumber: 'REQ-2024-001',
 *   requestDate: new Date(),
 *   effectiveDate: new Date(),
 *   productTypes: ['health', 'dental']
 * });
 * ```
 */
export declare const createQuoteRequestModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates new quote request.
 *
 * @param {QuoteRequest} requestData - Quote request data
 * @returns {Promise<QuoteRequest>} Created quote request
 *
 * @example
 * ```typescript
 * const request = await createQuoteRequest({
 *   productTypes: ['health', 'dental'],
 *   applicantInfo: applicantData,
 *   effectiveDate: new Date('2024-01-01')
 * });
 * console.log('Request ID:', request.requestId);
 * ```
 */
export declare const createQuoteRequest: (requestData: any) => Promise<QuoteRequest>;
/**
 * 2. Validates quote request data.
 *
 * @param {QuoteRequest} request - Quote request to validate
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateQuoteRequest(request);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateQuoteRequest: (request: QuoteRequest) => {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 3. Validates applicant eligibility.
 *
 * @param {ApplicantInfo} applicant - Applicant information
 * @param {ProductType} productType - Product type
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Eligibility result
 *
 * @example
 * ```typescript
 * const eligibility = await validateApplicantEligibility(applicant, 'medicare_supplement');
 * if (!eligibility.eligible) {
 *   console.log('Ineligible:', eligibility.reasons);
 * }
 * ```
 */
export declare const validateApplicantEligibility: (applicant: ApplicantInfo, productType: ProductType) => Promise<{
    eligible: boolean;
    reasons: string[];
}>;
/**
 * 4. Enriches request with external data.
 *
 * @param {QuoteRequest} request - Quote request
 * @returns {Promise<QuoteRequest>} Enriched request
 *
 * @example
 * ```typescript
 * const enriched = await enrichQuoteRequest(request);
 * console.log('County:', enriched.applicantInfo.address.county);
 * ```
 */
export declare const enrichQuoteRequest: (request: QuoteRequest) => Promise<QuoteRequest>;
/**
 * 5. Pre-fills request from prior carrier data.
 *
 * @param {PriorCarrierInfo} priorCarrier - Prior carrier information
 * @returns {Partial<QuoteRequest>} Pre-filled request data
 *
 * @example
 * ```typescript
 * const prefilled = prefillFromPriorCarrier(priorCarrierData);
 * const request = { ...prefilled, ...newData };
 * ```
 */
export declare const prefillFromPriorCarrier: (priorCarrier: PriorCarrierInfo) => Partial<QuoteRequest>;
/**
 * 6. Generates quotes for multiple products.
 *
 * @param {QuoteRequest} request - Quote request
 * @returns {Promise<QuoteResult[]>} Generated quotes
 *
 * @example
 * ```typescript
 * const quotes = await generateMultiProductQuotes(request);
 * console.log(`Generated ${quotes.length} quotes`);
 * ```
 */
export declare const generateMultiProductQuotes: (request: QuoteRequest) => Promise<QuoteResult[]>;
/**
 * 7. Generates quotes for single product.
 *
 * @param {QuoteRequest} request - Quote request
 * @param {ProductType} productType - Product type
 * @returns {Promise<QuoteResult[]>} Product quotes
 *
 * @example
 * ```typescript
 * const healthQuotes = await generateQuotesForProduct(request, 'health');
 * ```
 */
export declare const generateQuotesForProduct: (request: QuoteRequest, productType: ProductType) => Promise<QuoteResult[]>;
/**
 * 8. Bundles multiple products into package quote.
 *
 * @param {QuoteResult[]} quotes - Individual product quotes
 * @returns {QuoteResult} Bundled quote with package discount
 *
 * @example
 * ```typescript
 * const bundle = createProductBundle([healthQuote, dentalQuote, visionQuote]);
 * console.log('Bundle savings:', bundle.premium.discounts.bundle);
 * ```
 */
export declare const createProductBundle: (quotes: QuoteResult[]) => QuoteResult;
/**
 * 9. Applies multi-product discounts.
 *
 * @param {QuoteResult[]} quotes - Product quotes
 * @returns {QuoteResult[]} Quotes with discounts applied
 *
 * @example
 * ```typescript
 * const discountedQuotes = applyMultiProductDiscount(quotes);
 * ```
 */
export declare const applyMultiProductDiscount: (quotes: QuoteResult[]) => QuoteResult[];
/**
 * 10. Validates product compatibility.
 *
 * @param {ProductType[]} productTypes - Product types to validate
 * @returns {Object} Compatibility result
 *
 * @example
 * ```typescript
 * const compatibility = validateProductCompatibility(['health', 'dental', 'vision']);
 * if (!compatibility.compatible) {
 *   console.warn('Incompatible products:', compatibility.issues);
 * }
 * ```
 */
export declare const validateProductCompatibility: (productTypes: ProductType[]) => {
    compatible: boolean;
    issues: string[];
    recommendations: string[];
};
/**
 * 11. Calculates instant quote premium.
 *
 * @param {QuoteRequest} request - Quote request
 * @param {string} planId - Plan identifier
 * @returns {Promise<PremiumBreakdown>} Premium calculation
 *
 * @example
 * ```typescript
 * const premium = await calculateInstantQuote(request, 'PLAN-PPO-500');
 * console.log('Monthly premium:', premium.totalPremium);
 * ```
 */
export declare const calculateInstantQuote: (request: QuoteRequest, planId: string) => Promise<PremiumBreakdown>;
/**
 * 12. Applies rating factors (age, tobacco, location).
 *
 * @param {number} basePremium - Base premium amount
 * @param {any} ratingFactors - Rating factor inputs
 * @returns {number} Adjusted premium
 *
 * @example
 * ```typescript
 * const adjusted = applyRatingFactors(500, {
 *   age: 45,
 *   tobaccoUse: false,
 *   zipCode: '90210'
 * });
 * ```
 */
export declare const applyRatingFactors: (basePremium: number, ratingFactors: any) => number;
/**
 * 13. Calculates rider premiums.
 *
 * @param {string[]} riders - Rider codes
 * @param {number} basePremium - Base premium
 * @returns {Record<string, number>} Rider premium breakdown
 *
 * @example
 * ```typescript
 * const riderPremiums = calculateRiderPremiums(['DENTAL', 'VISION', 'WELLNESS'], 500);
 * console.log('Dental rider:', riderPremiums.DENTAL);
 * ```
 */
export declare const calculateRiderPremiums: (riders: string[], basePremium: number) => Record<string, number>;
/**
 * 14. Applies discounts and surcharges.
 *
 * @param {PremiumBreakdown} premium - Premium breakdown
 * @param {any} applicantProfile - Applicant profile
 * @returns {PremiumBreakdown} Adjusted premium
 *
 * @example
 * ```typescript
 * const adjusted = applyDiscountsAndSurcharges(premium, profile);
 * ```
 */
export declare const applyDiscountsAndSurcharges: (premium: PremiumBreakdown, applicantProfile: any) => PremiumBreakdown;
/**
 * 15. Converts premium frequency.
 *
 * @param {PremiumBreakdown} premium - Monthly premium
 * @param {string} targetFrequency - Target frequency
 * @returns {PremiumBreakdown} Converted premium
 *
 * @example
 * ```typescript
 * const annual = convertPremiumFrequency(monthlyPremium, 'annual');
 * console.log('Annual premium:', annual.totalPremium);
 * ```
 */
export declare const convertPremiumFrequency: (premium: PremiumBreakdown, targetFrequency: string) => PremiumBreakdown;
/**
 * 16. Generates comparative quotes across carriers.
 *
 * @param {QuoteRequest} request - Quote request
 * @returns {Promise<QuoteComparison>} Comparative quotes
 *
 * @example
 * ```typescript
 * const comparison = await generateComparativeQuotes(request);
 * console.log('Best value:', comparison.recommendations[0]);
 * ```
 */
export declare const generateComparativeQuotes: (request: QuoteRequest) => Promise<QuoteComparison>;
/**
 * 17. Generates quote for specific carrier.
 *
 * @param {QuoteRequest} request - Quote request
 * @param {string} carrier - Carrier name
 * @returns {Promise<QuoteResult>} Carrier quote
 *
 * @example
 * ```typescript
 * const quote = await generateCarrierQuote(request, 'Blue Cross');
 * ```
 */
export declare const generateCarrierQuote: (request: QuoteRequest, carrier: string) => Promise<QuoteResult>;
/**
 * 18. Ranks quotes by value score.
 *
 * @param {QuoteResult[]} quotes - Quotes to rank
 * @returns {QuoteResult[]} Ranked quotes
 *
 * @example
 * ```typescript
 * const ranked = rankQuotesByValue(quotes);
 * console.log('Best value:', ranked[0].carrier);
 * ```
 */
export declare const rankQuotesByValue: (quotes: QuoteResult[]) => QuoteResult[];
/**
 * 19. Generates quote recommendations.
 *
 * @param {QuoteResult[]} quotes - Quotes to analyze
 * @returns {QuoteRecommendation[]} Recommendations
 *
 * @example
 * ```typescript
 * const recommendations = generateQuoteRecommendations(quotes);
 * recommendations.forEach(r => console.log(r.category, ':', r.reason));
 * ```
 */
export declare const generateQuoteRecommendations: (quotes: QuoteResult[]) => QuoteRecommendation[];
/**
 * 20. Compares plan benefits side-by-side.
 *
 * @param {QuoteResult[]} quotes - Quotes to compare
 * @returns {any} Benefit comparison matrix
 *
 * @example
 * ```typescript
 * const comparison = comparePlanBenefits(quotes);
 * console.table(comparison.matrix);
 * ```
 */
export declare const comparePlanBenefits: (quotes: QuoteResult[]) => any;
/**
 * 21. Creates quote proposal document.
 *
 * @param {string[]} quoteIds - Quote identifiers to include
 * @param {any} proposalOptions - Proposal customization options
 * @returns {Promise<QuoteProposal>} Generated proposal
 *
 * @example
 * ```typescript
 * const proposal = await createQuoteProposal(['Q-001', 'Q-002'], {
 *   includeCoverLetter: true,
 *   includeComparison: true
 * });
 * ```
 */
export declare const createQuoteProposal: (quoteIds: string[], proposalOptions: any) => Promise<QuoteProposal>;
/**
 * 22. Generates proposal cover letter.
 *
 * @param {QuoteRequest} request - Quote request
 * @param {QuoteResult[]} quotes - Quotes in proposal
 * @returns {string} Cover letter content
 *
 * @example
 * ```typescript
 * const coverLetter = generateProposalCoverLetter(request, quotes);
 * ```
 */
export declare const generateProposalCoverLetter: (request: QuoteRequest, quotes: QuoteResult[]) => string;
/**
 * 23. Adds proposal highlights and key benefits.
 *
 * @param {QuoteProposal} proposal - Proposal to enhance
 * @param {QuoteResult[]} quotes - Associated quotes
 * @returns {QuoteProposal} Enhanced proposal
 *
 * @example
 * ```typescript
 * const enhanced = addProposalHighlights(proposal, quotes);
 * ```
 */
export declare const addProposalHighlights: (proposal: QuoteProposal, quotes: QuoteResult[]) => QuoteProposal;
/**
 * 24. Generates proposal PDF.
 *
 * @param {QuoteProposal} proposal - Proposal data
 * @param {QuoteResult[]} quotes - Associated quotes
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await generateProposalPDF(proposal, quotes);
 * await fs.writeFile('proposal.pdf', pdf);
 * ```
 */
export declare const generateProposalPDF: (proposal: QuoteProposal, quotes: QuoteResult[]) => Promise<Buffer>;
/**
 * 25. Customizes proposal branding.
 *
 * @param {QuoteProposal} proposal - Base proposal
 * @param {any} brandingOptions - Branding customization
 * @returns {QuoteProposal} Branded proposal
 *
 * @example
 * ```typescript
 * const branded = customizeProposalBranding(proposal, {
 *   logo: 'agency-logo.png',
 *   colors: { primary: '#0066cc' }
 * });
 * ```
 */
export declare const customizeProposalBranding: (proposal: QuoteProposal, brandingOptions: any) => QuoteProposal;
/**
 * 26. Creates quote revision.
 *
 * @param {string} originalQuoteId - Original quote ID
 * @param {any} revisionData - Revision changes
 * @returns {Promise<QuoteRevision>} Created revision
 *
 * @example
 * ```typescript
 * const revision = await createQuoteRevision('Q-001', {
 *   coverageRequirements: { deductible: 2000 },
 *   reason: 'Customer requested higher deductible'
 * });
 * ```
 */
export declare const createQuoteRevision: (originalQuoteId: string, revisionData: any) => Promise<QuoteRevision>;
/**
 * 27. Generates alternative quote options.
 *
 * @param {QuoteResult} baseQuote - Base quote
 * @param {string[]} alternativeTypes - Types of alternatives
 * @returns {Promise<QuoteResult[]>} Alternative quotes
 *
 * @example
 * ```typescript
 * const alternatives = await generateAlternativeQuotes(quote, [
 *   'higher_deductible',
 *   'lower_coverage',
 *   'different_network'
 * ]);
 * ```
 */
export declare const generateAlternativeQuotes: (baseQuote: QuoteResult, alternativeTypes: string[]) => Promise<QuoteResult[]>;
/**
 * 28. Adjusts quote based on feedback.
 *
 * @param {string} quoteId - Quote identifier
 * @param {any} feedback - Customer feedback
 * @returns {Promise<QuoteResult>} Adjusted quote
 *
 * @example
 * ```typescript
 * const adjusted = await adjustQuoteBasedOnFeedback('Q-001', {
 *   priceTooHigh: true,
 *   targetBudget: 400
 * });
 * ```
 */
export declare const adjustQuoteBasedOnFeedback: (quoteId: string, feedback: any) => Promise<QuoteResult>;
/**
 * 29. Compares original vs revised quote.
 *
 * @param {string} originalQuoteId - Original quote ID
 * @param {string} revisedQuoteId - Revised quote ID
 * @returns {Promise<any>} Comparison details
 *
 * @example
 * ```typescript
 * const comparison = await compareQuoteRevisions('Q-001', 'Q-REV-001');
 * console.log('Premium change:', comparison.premiumDifference);
 * ```
 */
export declare const compareQuoteRevisions: (originalQuoteId: string, revisedQuoteId: string) => Promise<any>;
/**
 * 30. Tracks quote revision history.
 *
 * @param {string} quoteId - Quote identifier
 * @returns {Promise<QuoteRevision[]>} Revision history
 *
 * @example
 * ```typescript
 * const history = await getQuoteRevisionHistory('Q-001');
 * console.log(`Quote has ${history.length} revisions`);
 * ```
 */
export declare const getQuoteRevisionHistory: (quoteId: string) => Promise<QuoteRevision[]>;
/**
 * 31. Checks quote expiration status.
 *
 * @param {string} quoteId - Quote identifier
 * @returns {Promise<{ expired: boolean; daysRemaining: number; validUntil: Date }>} Expiration status
 *
 * @example
 * ```typescript
 * const status = await checkQuoteExpiration('Q-001');
 * if (status.daysRemaining < 7) {
 *   await sendExpirationReminder(quoteId);
 * }
 * ```
 */
export declare const checkQuoteExpiration: (quoteId: string) => Promise<{
    expired: boolean;
    daysRemaining: number;
    validUntil: Date;
}>;
/**
 * 32. Extends quote validity period.
 *
 * @param {string} quoteId - Quote identifier
 * @param {number} extensionDays - Days to extend
 * @returns {Promise<QuoteResult>} Updated quote
 *
 * @example
 * ```typescript
 * const extended = await extendQuoteValidity('Q-001', 30);
 * console.log('New expiration:', extended.validUntil);
 * ```
 */
export declare const extendQuoteValidity: (quoteId: string, extensionDays: number) => Promise<QuoteResult>;
/**
 * 33. Tracks quote to policy conversion.
 *
 * @param {string} quoteId - Quote identifier
 * @param {string} policyId - Policy identifier
 * @returns {Promise<QuoteConversion>} Conversion tracking
 *
 * @example
 * ```typescript
 * const conversion = await trackQuoteConversion('Q-001', 'POL-001');
 * console.log('Time to conversion:', conversion.timeToConversion, 'days');
 * ```
 */
export declare const trackQuoteConversion: (quoteId: string, policyId: string) => Promise<QuoteConversion>;
/**
 * 34. Calculates quote conversion metrics.
 *
 * @param {Date} startDate - Metric start date
 * @param {Date} endDate - Metric end date
 * @returns {Promise<any>} Conversion metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateConversionMetrics(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * console.log('Conversion rate:', metrics.conversionRate);
 * ```
 */
export declare const calculateConversionMetrics: (startDate: Date, endDate: Date) => Promise<any>;
/**
 * 35. Binds quote to policy.
 *
 * @param {string} quoteId - Quote identifier
 * @param {any} bindingData - Policy binding data
 * @returns {Promise<{ policyId: string; effectiveDate: Date; confirmationNumber: string }>} Binding result
 *
 * @example
 * ```typescript
 * const policy = await bindQuoteToPolicy('Q-001', {
 *   effectiveDate: new Date('2024-01-01'),
 *   paymentMethod: 'credit_card'
 * });
 * console.log('Policy created:', policy.policyId);
 * ```
 */
export declare const bindQuoteToPolicy: (quoteId: string, bindingData: any) => Promise<{
    policyId: string;
    effectiveDate: Date;
    confirmationNumber: string;
}>;
/**
 * 36. Delivers quote via specified method.
 *
 * @param {string} quoteId - Quote identifier
 * @param {DeliveryMethod} method - Delivery method
 * @param {any} deliveryOptions - Delivery options
 * @returns {Promise<{ delivered: boolean; deliveryId: string; timestamp: Date }>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await deliverQuote('Q-001', 'email', {
 *   recipient: 'customer@example.com',
 *   subject: 'Your Insurance Quote'
 * });
 * ```
 */
export declare const deliverQuote: (quoteId: string, method: DeliveryMethod, deliveryOptions: any) => Promise<{
    delivered: boolean;
    deliveryId: string;
    timestamp: Date;
}>;
/**
 * 37. Sends quote via email.
 *
 * @param {string} quoteId - Quote identifier
 * @param {string} recipientEmail - Recipient email address
 * @param {any} emailOptions - Email customization options
 * @returns {Promise<{ sent: boolean; messageId: string }>} Email result
 *
 * @example
 * ```typescript
 * await sendQuoteEmail('Q-001', 'customer@example.com', {
 *   includeAttachment: true,
 *   includeComparison: true
 * });
 * ```
 */
export declare const sendQuoteEmail: (quoteId: string, recipientEmail: string, emailOptions: any) => Promise<{
    sent: boolean;
    messageId: string;
}>;
/**
 * 38. Publishes quote to customer portal.
 *
 * @param {string} quoteId - Quote identifier
 * @param {string} customerId - Customer identifier
 * @returns {Promise<{ published: boolean; portalUrl: string }>} Portal publication result
 *
 * @example
 * ```typescript
 * const result = await publishQuoteToPortal('Q-001', 'CUST-123');
 * console.log('View quote at:', result.portalUrl);
 * ```
 */
export declare const publishQuoteToPortal: (quoteId: string, customerId: string) => Promise<{
    published: boolean;
    portalUrl: string;
}>;
/**
 * 39. Schedules quote follow-up.
 *
 * @param {string} quoteId - Quote identifier
 * @param {Date} followUpDate - Follow-up date
 * @param {string} followUpType - Follow-up type
 * @returns {Promise<QuoteFollowUp>} Scheduled follow-up
 *
 * @example
 * ```typescript
 * const followUp = await scheduleQuoteFollowUp('Q-001', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'email');
 * ```
 */
export declare const scheduleQuoteFollowUp: (quoteId: string, followUpDate: Date, followUpType: string) => Promise<QuoteFollowUp>;
/**
 * 40. Shares quote with agent team.
 *
 * @param {string} quoteId - Quote identifier
 * @param {string[]} agentIds - Agent user IDs
 * @param {any} shareOptions - Sharing options
 * @returns {Promise<{ shared: boolean; sharedWith: string[] }>} Sharing result
 *
 * @example
 * ```typescript
 * await shareQuoteWithAgents('Q-001', ['AGENT-1', 'AGENT-2'], {
 *   permissions: 'view_only',
 *   notifyAgents: true
 * });
 * ```
 */
export declare const shareQuoteWithAgents: (quoteId: string, agentIds: string[], shareOptions: any) => Promise<{
    shared: boolean;
    sharedWith: string[];
}>;
/**
 * 41. Records quote declination.
 *
 * @param {string} quoteId - Quote identifier
 * @param {DeclinationReason} reason - Declination reason
 * @param {any} declinationData - Additional declination data
 * @returns {Promise<QuoteDeclination>} Declination record
 *
 * @example
 * ```typescript
 * const declination = await recordQuoteDeclination('Q-001', 'chose_competitor', {
 *   competitorInfo: {
 *     carrier: 'Competitor Inc',
 *     premium: 450
 *   }
 * });
 * ```
 */
export declare const recordQuoteDeclination: (quoteId: string, reason: DeclinationReason, declinationData: any) => Promise<QuoteDeclination>;
/**
 * 42. Analyzes quote declination patterns.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<any>} Declination analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeQuoteDeclinations(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * console.log('Top declination reason:', analysis.topReason);
 * ```
 */
export declare const analyzeQuoteDeclinations: (startDate: Date, endDate: Date) => Promise<any>;
declare const _default: {
    createQuoteRequest: (requestData: any) => Promise<QuoteRequest>;
    validateQuoteRequest: (request: QuoteRequest) => {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    validateApplicantEligibility: (applicant: ApplicantInfo, productType: ProductType) => Promise<{
        eligible: boolean;
        reasons: string[];
    }>;
    enrichQuoteRequest: (request: QuoteRequest) => Promise<QuoteRequest>;
    prefillFromPriorCarrier: (priorCarrier: PriorCarrierInfo) => Partial<QuoteRequest>;
    generateMultiProductQuotes: (request: QuoteRequest) => Promise<QuoteResult[]>;
    generateQuotesForProduct: (request: QuoteRequest, productType: ProductType) => Promise<QuoteResult[]>;
    createProductBundle: (quotes: QuoteResult[]) => QuoteResult;
    applyMultiProductDiscount: (quotes: QuoteResult[]) => QuoteResult[];
    validateProductCompatibility: (productTypes: ProductType[]) => {
        compatible: boolean;
        issues: string[];
        recommendations: string[];
    };
    calculateInstantQuote: (request: QuoteRequest, planId: string) => Promise<PremiumBreakdown>;
    applyRatingFactors: (basePremium: number, ratingFactors: any) => number;
    calculateRiderPremiums: (riders: string[], basePremium: number) => Record<string, number>;
    applyDiscountsAndSurcharges: (premium: PremiumBreakdown, applicantProfile: any) => PremiumBreakdown;
    convertPremiumFrequency: (premium: PremiumBreakdown, targetFrequency: string) => PremiumBreakdown;
    generateComparativeQuotes: (request: QuoteRequest) => Promise<QuoteComparison>;
    generateCarrierQuote: (request: QuoteRequest, carrier: string) => Promise<QuoteResult>;
    rankQuotesByValue: (quotes: QuoteResult[]) => QuoteResult[];
    generateQuoteRecommendations: (quotes: QuoteResult[]) => QuoteRecommendation[];
    comparePlanBenefits: (quotes: QuoteResult[]) => any;
    createQuoteProposal: (quoteIds: string[], proposalOptions: any) => Promise<QuoteProposal>;
    generateProposalCoverLetter: (request: QuoteRequest, quotes: QuoteResult[]) => string;
    addProposalHighlights: (proposal: QuoteProposal, quotes: QuoteResult[]) => QuoteProposal;
    generateProposalPDF: (proposal: QuoteProposal, quotes: QuoteResult[]) => Promise<Buffer>;
    customizeProposalBranding: (proposal: QuoteProposal, brandingOptions: any) => QuoteProposal;
    createQuoteRevision: (originalQuoteId: string, revisionData: any) => Promise<QuoteRevision>;
    generateAlternativeQuotes: (baseQuote: QuoteResult, alternativeTypes: string[]) => Promise<QuoteResult[]>;
    adjustQuoteBasedOnFeedback: (quoteId: string, feedback: any) => Promise<QuoteResult>;
    compareQuoteRevisions: (originalQuoteId: string, revisedQuoteId: string) => Promise<any>;
    getQuoteRevisionHistory: (quoteId: string) => Promise<QuoteRevision[]>;
    checkQuoteExpiration: (quoteId: string) => Promise<{
        expired: boolean;
        daysRemaining: number;
        validUntil: Date;
    }>;
    extendQuoteValidity: (quoteId: string, extensionDays: number) => Promise<QuoteResult>;
    trackQuoteConversion: (quoteId: string, policyId: string) => Promise<QuoteConversion>;
    calculateConversionMetrics: (startDate: Date, endDate: Date) => Promise<any>;
    bindQuoteToPolicy: (quoteId: string, bindingData: any) => Promise<{
        policyId: string;
        effectiveDate: Date;
        confirmationNumber: string;
    }>;
    deliverQuote: (quoteId: string, method: DeliveryMethod, deliveryOptions: any) => Promise<{
        delivered: boolean;
        deliveryId: string;
        timestamp: Date;
    }>;
    sendQuoteEmail: (quoteId: string, recipientEmail: string, emailOptions: any) => Promise<{
        sent: boolean;
        messageId: string;
    }>;
    publishQuoteToPortal: (quoteId: string, customerId: string) => Promise<{
        published: boolean;
        portalUrl: string;
    }>;
    scheduleQuoteFollowUp: (quoteId: string, followUpDate: Date, followUpType: string) => Promise<QuoteFollowUp>;
    shareQuoteWithAgents: (quoteId: string, agentIds: string[], shareOptions: any) => Promise<{
        shared: boolean;
        sharedWith: string[];
    }>;
    recordQuoteDeclination: (quoteId: string, reason: DeclinationReason, declinationData: any) => Promise<QuoteDeclination>;
    analyzeQuoteDeclinations: (startDate: Date, endDate: Date) => Promise<any>;
    createQuoteModel: (sequelize: Sequelize) => any;
    createQuoteRequestModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=quote-generation-kit.d.ts.map
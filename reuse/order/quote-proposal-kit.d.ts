/**
 * LOC: QOTPRO001
 * File: /reuse/order/quote-proposal-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - Product configurator services
 *   - Pricing engine services
 *
 * DOWNSTREAM (imported by):
 *   - Backend order management modules
 *   - Sales quote services
 *   - Proposal generation services
 *   - Order conversion workflows
 */
/**
 * File: /reuse/order/quote-proposal-kit.ts
 * Locator: WC-ORD-QOTPRO-001
 * Purpose: Quote & Proposal Management - Quote generation, versioning, approval, conversion
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: ../backend/order/*, Sales Quote Services, Proposal Management, Order Conversion
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 38 functions for quote creation, templates, versioning, approval workflows, quote-to-order conversion,
 *          product configurator integration, pricing calculations, discount approvals, quote comparison, analytics
 *
 * LLM Context: Enterprise-grade quote and proposal management for sales operations.
 * Provides comprehensive quote lifecycle management including quote creation with configurable products,
 * template-based quote generation, version control and revision tracking, expiration handling and renewal,
 * multi-level approval workflows, automated quote-to-order conversion, real-time pricing calculations,
 * discount approval routing, competitive quote comparison, analytics and reporting, customer portal integration,
 * e-signature support, and audit trail for compliance. Supports complex B2B sales scenarios with
 * configurable products, tiered pricing, volume discounts, and multi-currency quotes.
 */
import { Sequelize, Transaction } from 'sequelize';
interface QuoteHeader {
    quoteId: number;
    quoteNumber: string;
    version: number;
    quoteDate: Date;
    expirationDate: Date;
    customerId: number;
    customerName: string;
    contactId?: number;
    salesRepId: string;
    status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
    totalAmount: number;
    discountAmount: number;
    taxAmount: number;
    shippingAmount: number;
    grandTotal: number;
    currency: string;
    paymentTerms: string;
    deliveryTerms: string;
    validityPeriod: number;
    notes?: string;
    internalNotes?: string;
    templateId?: number;
    parentQuoteId?: number;
    convertedOrderId?: number;
}
interface QuoteTemplate {
    templateId: number;
    templateName: string;
    templateType: 'standard' | 'custom' | 'industry_specific';
    category: string;
    description: string;
    isActive: boolean;
    headerTemplate: Record<string, any>;
    lineItemsTemplate: Record<string, any>[];
    termsAndConditions: string;
    defaultValidityDays: number;
    requiredApprovals: string[];
    metadata: Record<string, any>;
}
interface QuoteVersion {
    versionId: number;
    quoteId: number;
    version: number;
    versionDate: Date;
    createdBy: string;
    changeReason: string;
    changesSummary: string;
    snapshot: Record<string, any>;
    previousVersion?: number;
    isActive: boolean;
}
interface QuoteApproval {
    approvalId: number;
    quoteId: number;
    approvalLevel: number;
    approverRole: string;
    approverId?: string;
    approverName?: string;
    status: 'pending' | 'approved' | 'rejected' | 'skipped';
    requestedAt: Date;
    respondedAt?: Date;
    comments?: string;
    notificationSent: boolean;
}
interface QuoteDiscount {
    discountId: number;
    quoteId: number;
    lineId?: number;
    discountType: 'percentage' | 'fixed_amount' | 'volume' | 'promotional';
    discountPercent: number;
    discountAmount: number;
    discountReason: string;
    requiresApproval: boolean;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: Date;
    validFrom?: Date;
    validTo?: Date;
}
interface ProductConfiguration {
    configId: number;
    quoteLineId: number;
    productId: number;
    configurationType: 'simple' | 'complex' | 'bundle';
    baseProductId: number;
    configuredOptions: ConfigOption[];
    totalConfigPrice: number;
    isValid: boolean;
    validationErrors?: string[];
}
interface ConfigOption {
    optionId: string;
    optionName: string;
    optionValue: string;
    priceImpact: number;
    isRequired: boolean;
    dependencies?: string[];
}
interface PricingRule {
    ruleId: number;
    ruleName: string;
    ruleType: 'base_price' | 'volume_discount' | 'customer_specific' | 'promotional';
    priority: number;
    conditions: Record<string, any>;
    priceAdjustment: {
        type: 'percentage' | 'fixed' | 'formula';
        value: number;
        formula?: string;
    };
    validFrom: Date;
    validTo?: Date;
    isActive: boolean;
}
interface QuoteComparison {
    comparisonId: string;
    quoteIds: number[];
    comparisonDate: Date;
    comparedBy: string;
    metrics: {
        totalPrice: number[];
        discounts: number[];
        deliveryTime: number[];
        paymentTerms: string[];
        competitiveScore: number[];
    };
    recommendation?: string;
    notes?: string;
}
interface QuoteAnalytics {
    period: string;
    totalQuotes: number;
    quotesCreated: number;
    quotesSent: number;
    quotesAccepted: number;
    quotesRejected: number;
    quotesExpired: number;
    quotesConverted: number;
    conversionRate: number;
    averageQuoteValue: number;
    totalQuoteValue: number;
    averageResponseTime: number;
    averageApprovalTime: number;
    topSalesReps: Array<{
        salesRepId: string;
        quoteCount: number;
        conversionRate: number;
    }>;
    topProducts: Array<{
        productId: number;
        quotedQuantity: number;
        revenue: number;
    }>;
}
interface QuoteExpirationCheck {
    quoteId: number;
    quoteNumber: string;
    expirationDate: Date;
    daysUntilExpiration: number;
    status: string;
    customerId: number;
    customerName: string;
    totalAmount: number;
    action: 'none' | 'notify' | 'expire' | 'auto_renew';
}
interface QuoteConversionResult {
    orderId: number;
    orderNumber: string;
    quoteId: number;
    quoteNumber: string;
    conversionDate: Date;
    convertedBy: string;
    orderStatus: string;
    modifications: Array<{
        field: string;
        quoteValue: any;
        orderValue: any;
        reason: string;
    }>;
    validationWarnings?: string[];
}
export declare class CreateQuoteDto {
    customerId: number;
    contactId?: number;
    salesRepId: string;
    quoteDate: Date;
    expirationDate: Date;
    currency?: string;
    paymentTerms: string;
    deliveryTerms: string;
    lineItems: CreateQuoteLineDto[];
    notes?: string;
    internalNotes?: string;
    templateId?: number;
}
export declare class CreateQuoteLineDto {
    productId: number;
    quantity: number;
    unitPrice?: number;
    discountPercent?: number;
    configuration?: Record<string, any>;
    deliveryDate?: Date;
    notes?: string;
}
export declare class UpdateQuoteDto {
    customerId?: number;
    expirationDate?: Date;
    paymentTerms?: string;
    lineItems?: CreateQuoteLineDto[];
    notes?: string;
    changeReason?: string;
}
export declare class ApproveQuoteDto {
    approverId: string;
    decision: 'approved' | 'rejected';
    comments?: string;
}
export declare class ConvertQuoteToOrderDto {
    quoteId: number;
    requestedDeliveryDate?: Date;
    customerPONumber?: string;
    specialInstructions?: string;
    modifications?: Array<{
        lineNumber: number;
        quantity?: number;
        unitPrice?: number;
        deliveryDate?: Date;
    }>;
}
export declare class CreateQuoteTemplateDto {
    templateName: string;
    templateType: string;
    category: string;
    description: string;
    headerTemplate: Record<string, any>;
    lineItemsTemplate: Record<string, any>[];
    termsAndConditions: string;
    defaultValidityDays?: number;
    requiredApprovals: string[];
}
export declare class QuoteSearchDto {
    customerId?: number;
    salesRepId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    searchText?: string;
    page?: number;
    pageSize?: number;
}
export declare class QuoteAnalyticsRequestDto {
    startDate: Date;
    endDate: Date;
    groupBy?: string;
    salesRepId?: string;
    customerId?: number;
}
/**
 * Sequelize model for Quote Headers with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} QuoteHeader model
 *
 * @example
 * ```typescript
 * const Quote = createQuoteHeaderModel(sequelize);
 * const quote = await Quote.create({
 *   quoteNumber: 'Q-2024-001',
 *   customerId: 123,
 *   quoteDate: new Date(),
 *   status: 'draft'
 * });
 * ```
 */
export declare const createQuoteHeaderModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        quoteNumber: string;
        version: number;
        quoteDate: Date;
        expirationDate: Date;
        customerId: number;
        customerName: string;
        contactId: number | null;
        salesRepId: string;
        status: string;
        totalAmount: number;
        discountAmount: number;
        taxAmount: number;
        shippingAmount: number;
        grandTotal: number;
        currency: string;
        paymentTerms: string;
        deliveryTerms: string;
        validityPeriod: number;
        notes: string | null;
        internalNotes: string | null;
        templateId: number | null;
        parentQuoteId: number | null;
        convertedOrderId: number | null;
        convertedAt: Date | null;
        sentAt: Date | null;
        viewedAt: Date | null;
        acceptedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Quote Line Items.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} QuoteLine model
 */
export declare const createQuoteLineModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        quoteId: number;
        lineNumber: number;
        productId: number;
        productCode: string;
        productName: string;
        description: string;
        quantity: number;
        unitOfMeasure: string;
        unitPrice: number;
        listPrice: number;
        discountPercent: number;
        discountAmount: number;
        extendedPrice: number;
        taxRate: number;
        taxAmount: number;
        lineTotal: number;
        configuration: Record<string, any> | null;
        deliveryDate: Date | null;
        leadTimeDays: number | null;
        notes: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Quote Templates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} QuoteTemplate model
 */
export declare const createQuoteTemplateModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        templateName: string;
        templateType: string;
        category: string;
        description: string;
        isActive: boolean;
        headerTemplate: Record<string, any>;
        lineItemsTemplate: Record<string, any>[];
        termsAndConditions: string;
        defaultValidityDays: number;
        requiredApprovals: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new sales quote with comprehensive validation and pricing calculation.
 *
 * @param {CreateQuoteDto} quoteDto - Quote creation data
 * @param {string} userId - User creating the quote
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<QuoteHeader>} Created quote header
 *
 * @example
 * ```typescript
 * const quote = await createQuote({
 *   customerId: 123,
 *   salesRepId: 'SREP001',
 *   quoteDate: new Date(),
 *   expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   paymentTerms: 'Net 30',
 *   deliveryTerms: 'FOB Origin',
 *   lineItems: [
 *     { productId: 1, quantity: 10, unitPrice: 100 }
 *   ]
 * }, 'user123', transaction);
 * ```
 */
export declare function createQuote(quoteDto: CreateQuoteDto, userId: string, transaction?: Transaction): Promise<QuoteHeader>;
/**
 * Generates a quote from a predefined template.
 *
 * @param {number} templateId - Template ID to use
 * @param {Partial<CreateQuoteDto>} overrides - Values to override template defaults
 * @param {string} userId - User generating the quote
 * @returns {Promise<QuoteHeader>} Generated quote
 */
export declare function generateQuoteFromTemplate(templateId: number, overrides: Partial<CreateQuoteDto>, userId: string): Promise<QuoteHeader>;
/**
 * Generates a unique quote number using a configurable pattern.
 *
 * @param {string} prefix - Quote number prefix
 * @returns {Promise<string>} Generated quote number
 */
export declare function generateQuoteNumber(prefix?: string): Promise<string>;
/**
 * Duplicates an existing quote with optional modifications.
 *
 * @param {number} quoteId - Quote ID to duplicate
 * @param {Partial<CreateQuoteDto>} modifications - Modifications to apply
 * @param {string} userId - User duplicating the quote
 * @returns {Promise<QuoteHeader>} Duplicated quote
 */
export declare function duplicateQuote(quoteId: number, modifications: Partial<CreateQuoteDto>, userId: string): Promise<QuoteHeader>;
/**
 * Creates a new quote template for reuse.
 *
 * @param {CreateQuoteTemplateDto} templateDto - Template data
 * @param {string} userId - User creating the template
 * @returns {Promise<QuoteTemplate>} Created template
 */
export declare function createQuoteTemplate(templateDto: CreateQuoteTemplateDto, userId: string): Promise<QuoteTemplate>;
/**
 * Retrieves a quote template by ID.
 *
 * @param {number} templateId - Template ID
 * @returns {Promise<QuoteTemplate>} Quote template
 */
export declare function getQuoteTemplate(templateId: number): Promise<QuoteTemplate>;
/**
 * Lists available quote templates with filtering.
 *
 * @param {Object} filters - Filter criteria
 * @returns {Promise<QuoteTemplate[]>} List of templates
 */
export declare function listQuoteTemplates(filters: {
    templateType?: string;
    category?: string;
    isActive?: boolean;
}): Promise<QuoteTemplate[]>;
/**
 * Updates an existing quote template.
 *
 * @param {number} templateId - Template ID to update
 * @param {Partial<CreateQuoteTemplateDto>} updates - Updates to apply
 * @returns {Promise<QuoteTemplate>} Updated template
 */
export declare function updateQuoteTemplate(templateId: number, updates: Partial<CreateQuoteTemplateDto>): Promise<QuoteTemplate>;
/**
 * Creates a new version of an existing quote.
 *
 * @param {number} quoteId - Quote ID to version
 * @param {UpdateQuoteDto} updates - Updates for new version
 * @param {string} userId - User creating version
 * @param {string} changeReason - Reason for version change
 * @returns {Promise<QuoteHeader>} New quote version
 */
export declare function createQuoteVersion(quoteId: number, updates: UpdateQuoteDto, userId: string, changeReason: string): Promise<QuoteHeader>;
/**
 * Archives a quote version for historical tracking.
 *
 * @param {number} quoteId - Quote ID
 * @param {number} version - Version number to archive
 * @returns {Promise<QuoteVersion>} Archived version
 */
export declare function archiveQuoteVersion(quoteId: number, version: number): Promise<QuoteVersion>;
/**
 * Retrieves all versions of a quote.
 *
 * @param {number} quoteId - Quote ID
 * @returns {Promise<QuoteVersion[]>} List of quote versions
 */
export declare function getQuoteVersionHistory(quoteId: number): Promise<QuoteVersion[]>;
/**
 * Compares two quote versions to identify changes.
 *
 * @param {number} quoteId - Quote ID
 * @param {number} version1 - First version number
 * @param {number} version2 - Second version number
 * @returns {Promise<Object>} Comparison results
 */
export declare function compareQuoteVersions(quoteId: number, version1: number, version2: number): Promise<{
    differences: Array<{
        field: string;
        version1Value: any;
        version2Value: any;
    }>;
    summary: string;
}>;
/**
 * Checks for expiring quotes and triggers appropriate actions.
 *
 * @param {number} daysBeforeExpiration - Days threshold for notification
 * @returns {Promise<QuoteExpirationCheck[]>} List of expiring quotes
 */
export declare function checkExpiringQuotes(daysBeforeExpiration?: number): Promise<QuoteExpirationCheck[]>;
/**
 * Marks expired quotes and updates their status.
 *
 * @returns {Promise<number>} Number of quotes marked as expired
 */
export declare function processExpiredQuotes(): Promise<number>;
/**
 * Extends the expiration date of a quote.
 *
 * @param {number} quoteId - Quote ID
 * @param {Date} newExpirationDate - New expiration date
 * @param {string} userId - User extending the quote
 * @param {string} reason - Reason for extension
 * @returns {Promise<QuoteHeader>} Updated quote
 */
export declare function extendQuoteExpiration(quoteId: number, newExpirationDate: Date, userId: string, reason: string): Promise<QuoteHeader>;
/**
 * Sends expiration notifications to customers and sales reps.
 *
 * @param {QuoteExpirationCheck[]} expiringQuotes - List of expiring quotes
 * @returns {Promise<void>}
 */
export declare function sendExpirationNotifications(expiringQuotes: QuoteExpirationCheck[]): Promise<void>;
/**
 * Submits a quote for approval based on configured workflow.
 *
 * @param {number} quoteId - Quote ID to submit
 * @param {string} userId - User submitting the quote
 * @returns {Promise<QuoteApproval[]>} Created approval requests
 */
export declare function submitQuoteForApproval(quoteId: number, userId: string): Promise<QuoteApproval[]>;
/**
 * Processes an approval decision for a quote.
 *
 * @param {number} quoteId - Quote ID
 * @param {number} approvalId - Approval request ID
 * @param {ApproveQuoteDto} approvalDto - Approval decision
 * @returns {Promise<QuoteApproval>} Updated approval
 */
export declare function processQuoteApproval(quoteId: number, approvalId: number, approvalDto: ApproveQuoteDto): Promise<QuoteApproval>;
/**
 * Retrieves approval workflow configuration for a quote.
 *
 * @param {QuoteHeader} quote - Quote header
 * @returns {Promise<Array>} Approval workflow levels
 */
export declare function getApprovalWorkflow(quote: QuoteHeader): Promise<Array<{
    level: number;
    role: string;
    threshold?: number;
}>>;
/**
 * Retrieves all approval requests for a quote.
 *
 * @param {number} quoteId - Quote ID
 * @returns {Promise<QuoteApproval[]>} List of approvals
 */
export declare function getQuoteApprovals(quoteId: number): Promise<QuoteApproval[]>;
/**
 * Converts an approved quote to a sales order.
 *
 * @param {ConvertQuoteToOrderDto} conversionDto - Conversion data
 * @param {string} userId - User converting the quote
 * @returns {Promise<QuoteConversionResult>} Conversion result
 */
export declare function convertQuoteToOrder(conversionDto: ConvertQuoteToOrderDto, userId: string): Promise<QuoteConversionResult>;
/**
 * Validates a quote is ready for conversion to order.
 *
 * @param {number} quoteId - Quote ID
 * @returns {Promise<Object>} Validation result
 */
export declare function validateQuoteForConversion(quoteId: number): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Previews the order that would be created from a quote.
 *
 * @param {number} quoteId - Quote ID
 * @param {Partial<ConvertQuoteToOrderDto>} modifications - Modifications to preview
 * @returns {Promise<Object>} Order preview
 */
export declare function previewQuoteToOrder(quoteId: number, modifications?: Partial<ConvertQuoteToOrderDto>): Promise<{
    orderPreview: any;
    changes: Array<{
        field: string;
        quoteValue: any;
        orderValue: any;
    }>;
}>;
/**
 * Configures a product for a quote line item.
 *
 * @param {number} productId - Product ID to configure
 * @param {Record<string, any>} options - Configuration options
 * @returns {Promise<ProductConfiguration>} Product configuration
 */
export declare function configureProduct(productId: number, options: Record<string, any>): Promise<ProductConfiguration>;
/**
 * Validates a product configuration against rules.
 *
 * @param {number} productId - Product ID
 * @param {Record<string, any>} options - Configuration options
 * @returns {Promise<Object>} Validation result
 */
export declare function validateProductConfiguration(productId: number, options: Record<string, any>): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Calculates the price impact of a product configuration.
 *
 * @param {number} productId - Product ID
 * @param {Record<string, any>} options - Configuration options
 * @returns {Promise<number>} Total price impact
 */
export declare function calculateConfigurationPrice(productId: number, options: Record<string, any>): Promise<number>;
/**
 * Retrieves available configuration options for a product.
 *
 * @param {number} productId - Product ID
 * @returns {Promise<ConfigOption[]>} Available options
 */
export declare function getProductConfigurationOptions(productId: number): Promise<ConfigOption[]>;
/**
 * Calculates the total price for quote line items with all discounts.
 *
 * @param {CreateQuoteLineDto[]} lineItems - Quote line items
 * @returns {Object} Calculated totals
 */
export declare function calculateQuoteTotals(lineItems: CreateQuoteLineDto[]): {
    totalAmount: number;
    discountAmount: number;
    taxAmount: number;
    grandTotal: number;
};
/**
 * Applies pricing rules to calculate quote line pricing.
 *
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity
 * @param {number} customerId - Customer ID
 * @returns {Promise<Object>} Pricing details
 */
export declare function calculateLinePricing(productId: number, quantity: number, customerId: number): Promise<{
    listPrice: number;
    unitPrice: number;
    discountPercent: number;
    appliedRules: string[];
}>;
/**
 * Retrieves applicable pricing rules for a product and customer.
 *
 * @param {number} productId - Product ID
 * @param {number} customerId - Customer ID
 * @returns {Promise<PricingRule[]>} Applicable pricing rules
 */
export declare function getPricingRules(productId: number, customerId: number): Promise<PricingRule[]>;
/**
 * Recalculates all pricing for a quote.
 *
 * @param {number} quoteId - Quote ID
 * @returns {Promise<QuoteHeader>} Updated quote with recalculated pricing
 */
export declare function recalculateQuotePricing(quoteId: number): Promise<QuoteHeader>;
/**
 * Applies a discount to a quote line item with approval workflow.
 *
 * @param {number} quoteId - Quote ID
 * @param {number} lineId - Line item ID (0 for header-level discount)
 * @param {Object} discountData - Discount details
 * @returns {Promise<QuoteDiscount>} Created discount
 */
export declare function applyQuoteDiscount(quoteId: number, lineId: number | undefined, discountData: {
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    reason: string;
}): Promise<QuoteDiscount>;
/**
 * Submits a discount for approval.
 *
 * @param {number} discountId - Discount ID
 * @param {string} approverId - Approver ID
 * @returns {Promise<void>}
 */
export declare function submitDiscountForApproval(discountId: number, approverId: string): Promise<void>;
/**
 * Approves or rejects a discount request.
 *
 * @param {number} discountId - Discount ID
 * @param {Object} decision - Approval decision
 * @returns {Promise<QuoteDiscount>} Updated discount
 */
export declare function approveDiscount(discountId: number, decision: {
    approverId: string;
    approved: boolean;
    comments?: string;
}): Promise<QuoteDiscount>;
/**
 * Compares multiple quotes side-by-side.
 *
 * @param {number[]} quoteIds - Quote IDs to compare
 * @param {string} userId - User performing comparison
 * @returns {Promise<QuoteComparison>} Comparison results
 */
export declare function compareQuotes(quoteIds: number[], userId: string): Promise<QuoteComparison>;
/**
 * Generates a competitive analysis report for quotes.
 *
 * @param {number[]} quoteIds - Quote IDs to analyze
 * @returns {Promise<Object>} Analysis report
 */
export declare function generateCompetitiveAnalysis(quoteIds: number[]): Promise<{
    bestValue: number;
    lowestPrice: number;
    fastestDelivery: number;
    bestTerms: number;
    recommendations: string[];
}>;
/**
 * Generates quote analytics for a date range.
 *
 * @param {QuoteAnalyticsRequestDto} requestDto - Analytics request
 * @returns {Promise<QuoteAnalytics>} Analytics data
 */
export declare function getQuoteAnalytics(requestDto: QuoteAnalyticsRequestDto): Promise<QuoteAnalytics>;
/**
 * Calculates quote conversion metrics.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Object>} Conversion metrics
 */
export declare function calculateConversionMetrics(startDate: Date, endDate: Date): Promise<{
    totalQuotes: number;
    convertedQuotes: number;
    conversionRate: number;
    averageTimeToConversion: number;
    conversionByValue: Array<{
        range: string;
        count: number;
        rate: number;
    }>;
}>;
/**
 * Generates sales pipeline analytics from quotes.
 *
 * @param {string} salesRepId - Sales rep ID filter (optional)
 * @returns {Promise<Object>} Pipeline analytics
 */
export declare function getQuotePipelineAnalytics(salesRepId?: string): Promise<{
    pipelineValue: number;
    stages: Array<{
        status: string;
        count: number;
        value: number;
    }>;
    forecastedRevenue: number;
    weightedPipeline: number;
}>;
export {};
//# sourceMappingURL=quote-proposal-kit.d.ts.map
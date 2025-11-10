/**
 * LOC: FIN-INV-001
 * File: /reuse/financial/invoice-generation-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - pdfkit (PDF generation)
 *   - nodemailer (Email delivery)
 *   - handlebars (Template rendering)
 *   - qrcode (QR code generation)
 *   - moment (Date manipulation)
 *   - numeral (Number formatting)
 *   - uuid (Invoice ID generation)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS invoice controllers
 *   - Accounting services
 *   - Billing automation services
 *   - Payment processing services
 *   - Revenue recognition services
 *   - Financial reporting services
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Invoice status enumeration.
 */
export type InvoiceStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'void' | 'disputed';
/**
 * Invoice type enumeration.
 */
export type InvoiceType = 'standard' | 'proforma' | 'recurring' | 'credit_note' | 'debit_note' | 'interim' | 'final';
/**
 * Payment terms type.
 */
export type PaymentTermsType = 'immediate' | 'net_7' | 'net_10' | 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'net_90' | 'eom' | 'custom';
/**
 * Tax calculation method.
 */
export type TaxCalculationMethod = 'inclusive' | 'exclusive' | 'compound';
/**
 * Discount type enumeration.
 */
export type DiscountType = 'percentage' | 'fixed' | 'early_payment';
/**
 * Recurring frequency.
 */
export type RecurringFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual';
/**
 * Delivery channel enumeration.
 */
export type DeliveryChannel = 'email' | 'portal' | 'api' | 'print' | 'fax';
/**
 * Dunning level enumeration.
 */
export type DunningLevel = 'reminder' | 'first_notice' | 'second_notice' | 'final_notice' | 'collection';
/**
 * Approval status enumeration.
 */
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'conditional' | 'escalated';
/**
 * Invoice line item details.
 * Represents a single product or service on an invoice.
 */
export declare class InvoiceLineItemDto {
    id?: string;
    itemCode: string;
    description: string;
    notes?: string;
    quantity: number;
    unitOfMeasure: string;
    unitPrice: number;
    discountPercent?: number;
    discountAmount?: number;
    taxPercent: number;
    taxAmount: number;
    subtotal: number;
    total: number;
    accountCode?: string;
    projectCode?: string;
    sequenceNumber: number;
}
/**
 * Payment terms configuration.
 * Defines when and how payment is expected.
 */
export declare class PaymentTermsDto {
    type: PaymentTermsType;
    customNetDays?: number;
    earlyPaymentDiscountPercent?: number;
    earlyPaymentDays?: number;
    lateFeePercent?: number;
    gracePeriodDays?: number;
    instructions?: string;
}
/**
 * Invoice address details.
 * Billing and shipping address information.
 */
export declare class InvoiceAddressDto {
    name: string;
    attention?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    taxId?: string;
}
/**
 * Tax configuration details.
 * Defines tax rules and calculation methods.
 */
export declare class TaxConfigDto {
    name: string;
    percentage: number;
    jurisdiction: string;
    calculationMethod: TaxCalculationMethod;
    registrationNumber?: string;
    isExempt: boolean;
    exemptionReason?: string;
}
/**
 * Complete invoice details.
 * Main invoice document with all line items and metadata.
 */
export declare class InvoiceDto {
    id?: string;
    invoiceNumber: string;
    type: InvoiceType;
    status: InvoiceStatus;
    customerId: string;
    customerName: string;
    customerEmail: string;
    billingAddress: InvoiceAddressDto;
    shippingAddress?: InvoiceAddressDto;
    invoiceDate: Date;
    dueDate: Date;
    poReference?: string;
    currency: string;
    exchangeRate: number;
    lineItems: InvoiceLineItemDto[];
    subtotal: number;
    discountAmount?: number;
    taxAmount: number;
    shippingAmount?: number;
    total: number;
    amountPaid: number;
    amountDue: number;
    paymentTerms: PaymentTermsDto;
    taxConfig: TaxConfigDto[];
    notes?: string;
    footer?: string;
    templateId?: string;
    parentInvoiceId?: string;
    recurringScheduleId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy: string;
    approvedBy?: string;
    approvedAt?: Date;
}
/**
 * Invoice template configuration.
 * Customizable invoice design and branding.
 */
export declare class InvoiceTemplateDto {
    id?: string;
    name: string;
    description?: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    headerTemplate: string;
    footerTemplate: string;
    isDefault: boolean;
    isActive: boolean;
    customCss?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Recurring invoice schedule.
 * Automation rules for recurring invoice generation.
 */
export declare class RecurringScheduleDto {
    id?: string;
    name: string;
    customerId: string;
    frequency: RecurringFrequency;
    startDate: Date;
    endDate?: Date;
    nextInvoiceDate: Date;
    invoiceTemplate: Partial<InvoiceDto>;
    autoSend: boolean;
    isActive: boolean;
    invoicesGenerated?: number;
    lastGeneratedInvoiceId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Invoice approval workflow step.
 * Defines approval requirements and history.
 */
export declare class InvoiceApprovalDto {
    id?: string;
    invoiceId: string;
    stepNumber: number;
    approverId: string;
    approverName: string;
    approverEmail: string;
    status: ApprovalStatus;
    comments?: string;
    approvedAt?: Date;
    requiredBy?: Date;
    isFinalStep: boolean;
    createdAt?: Date;
}
/**
 * Invoice aging bucket.
 * Accounts receivable aging analysis.
 */
export declare class InvoiceAgingDto {
    period: string;
    count: number;
    amount: number;
    percentage: number;
    invoices?: InvoiceDto[];
}
/**
 * Dunning notice configuration.
 * Automated overdue invoice reminder rules.
 */
export declare class DunningRuleDto {
    id?: string;
    name: string;
    level: DunningLevel;
    daysAfterDue: number;
    emailTemplateId: string;
    emailSubject: string;
    includLateFee: boolean;
    suspendServices: boolean;
    escalateToCollections: boolean;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Dunning history record.
 * Log of dunning notices sent for an invoice.
 */
export declare class DunningHistoryDto {
    id?: string;
    invoiceId: string;
    dunningRuleId: string;
    level: DunningLevel;
    sentAt: Date;
    recipientEmail: string;
    deliveryStatus: string;
    notes?: string;
    createdAt?: Date;
}
/**
 * Payment allocation record.
 * Tracks how payments are applied to invoices.
 */
export declare class PaymentAllocationDto {
    id?: string;
    paymentId: string;
    invoiceId: string;
    amount: number;
    allocationDate: Date;
    notes?: string;
    createdBy: string;
    createdAt?: Date;
}
/**
 * Invoice search filters.
 * Comprehensive search and filter criteria.
 */
export declare class InvoiceSearchDto {
    query?: string;
    status?: InvoiceStatus;
    type?: InvoiceType;
    customerId?: string;
    invoiceDateFrom?: Date;
    invoiceDateTo?: Date;
    dueDateFrom?: Date;
    dueDateTo?: Date;
    minAmount?: number;
    maxAmount?: number;
    currency?: string;
    createdBy?: string;
    templateId?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * Invoice numbering sequence configuration.
 * Defines how invoice numbers are generated.
 */
export declare class InvoiceNumberingDto {
    id?: string;
    prefix: string;
    suffix?: string;
    nextNumber: number;
    paddingLength: number;
    includeYear: boolean;
    includeMonth: boolean;
    separator?: string;
    resetFrequency?: 'never' | 'yearly' | 'monthly';
    lastResetDate?: Date;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Sequelize model definition for Invoice.
 */
export interface InvoiceModel extends Model {
    id: string;
    invoiceNumber: string;
    type: InvoiceType;
    status: InvoiceStatus;
    customerId: string;
    customerName: string;
    customerEmail: string;
    billingAddress: object;
    shippingAddress?: object;
    invoiceDate: Date;
    dueDate: Date;
    poReference?: string;
    currency: string;
    exchangeRate: number;
    subtotal: number;
    discountAmount?: number;
    taxAmount: number;
    shippingAmount?: number;
    total: number;
    amountPaid: number;
    amountDue: number;
    paymentTerms: object;
    taxConfig: object[];
    notes?: string;
    footer?: string;
    templateId?: string;
    parentInvoiceId?: string;
    recurringScheduleId?: string;
    createdBy: string;
    approvedBy?: string;
    approvedAt?: Date;
    sentAt?: Date;
    viewedAt?: Date;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Sequelize model definition for InvoiceLineItem.
 */
export interface InvoiceLineItemModel extends Model {
    id: string;
    invoiceId: string;
    itemCode: string;
    description: string;
    notes?: string;
    quantity: number;
    unitOfMeasure: string;
    unitPrice: number;
    discountPercent?: number;
    discountAmount?: number;
    taxPercent: number;
    taxAmount: number;
    subtotal: number;
    total: number;
    accountCode?: string;
    projectCode?: string;
    sequenceNumber: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates a new invoice with line items and validation.
 *
 * @param invoiceData - Invoice details including customer, line items, and terms
 * @param sequelize - Sequelize instance for database operations
 * @param transaction - Optional transaction for atomic operations
 * @returns Created invoice with generated ID and number
 *
 * @throws {BadRequestException} If invoice data validation fails
 * @throws {NotFoundException} If customer not found
 * @throws {InternalServerErrorException} If database operation fails
 *
 * Features:
 * - Automatic invoice numbering
 * - Line item validation and calculation
 * - Tax calculation based on jurisdiction
 * - Payment terms application
 * - Discount calculations
 * - Multi-currency support
 * - Audit trail creation
 *
 * @example
 * ```typescript
 * const invoice = await createInvoice(
 *   {
 *     customerId: 'cust-123',
 *     customerName: 'Acme Corp',
 *     customerEmail: 'billing@acme.com',
 *     lineItems: [
 *       {
 *         itemCode: 'SVC-001',
 *         description: 'Consulting Services',
 *         quantity: 40,
 *         unitPrice: 150,
 *         taxPercent: 8.5,
 *       },
 *     ],
 *     paymentTerms: { type: 'net_30' },
 *   },
 *   sequelize
 * );
 * ```
 */
export declare function createInvoice(invoiceData: Partial<InvoiceDto>, sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceDto>;
/**
 * Generates next invoice number based on configured sequence.
 *
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Generated invoice number
 *
 * Features:
 * - Configurable prefix and suffix
 * - Auto-incrementing sequence
 * - Year/month inclusion
 * - Automatic reset based on frequency
 * - Thread-safe number generation
 *
 * @example
 * ```typescript
 * const invoiceNumber = await generateInvoiceNumber(sequelize);
 * // Returns: "INV-2024-00001"
 * ```
 */
export declare function generateInvoiceNumber(sequelize: Sequelize, transaction?: Transaction): Promise<string>;
/**
 * Calculates invoice totals including taxes, discounts, and shipping.
 *
 * @param lineItems - Invoice line items
 * @param invoiceData - Additional invoice data (shipping, discounts)
 * @returns Calculated subtotal, tax, discount, and total amounts
 *
 * Features:
 * - Line-level tax calculation
 * - Percentage and fixed discounts
 * - Early payment discount handling
 * - Compound tax support
 * - Shipping cost inclusion
 *
 * @example
 * ```typescript
 * const totals = calculateInvoiceTotals(lineItems, invoiceData);
 * console.log(totals.total); // 1469.00
 * ```
 */
export declare function calculateInvoiceTotals(lineItems: InvoiceLineItemDto[], invoiceData: Partial<InvoiceDto>): {
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    total: number;
};
/**
 * Calculates due date based on payment terms.
 *
 * @param invoiceDate - Invoice date
 * @param paymentTerms - Payment terms configuration
 * @returns Calculated due date
 *
 * @example
 * ```typescript
 * const dueDate = calculateDueDate(new Date(), { type: 'net_30' });
 * ```
 */
export declare function calculateDueDate(invoiceDate: Date, paymentTerms: PaymentTermsDto): Date;
/**
 * Updates existing invoice details.
 *
 * @param invoiceId - Invoice ID to update
 * @param updates - Partial invoice data to update
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Updated invoice
 *
 * @throws {NotFoundException} If invoice not found
 * @throws {BadRequestException} If invoice cannot be updated (e.g., already paid)
 *
 * @example
 * ```typescript
 * const updated = await updateInvoice('inv-123', { notes: 'Updated notes' }, sequelize);
 * ```
 */
export declare function updateInvoice(invoiceId: string, updates: Partial<InvoiceDto>, sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceDto>;
/**
 * Deletes or voids an invoice.
 *
 * @param invoiceId - Invoice ID to delete
 * @param sequelize - Sequelize instance
 * @param void - If true, void instead of delete (maintains audit trail)
 * @param transaction - Optional transaction
 *
 * @throws {NotFoundException} If invoice not found
 * @throws {BadRequestException} If invoice cannot be deleted (e.g., has payments)
 *
 * @example
 * ```typescript
 * await deleteInvoice('inv-123', sequelize, true); // Void invoice
 * ```
 */
export declare function deleteInvoice(invoiceId: string, sequelize: Sequelize, voidInvoice?: boolean, transaction?: Transaction): Promise<void>;
/**
 * Retrieves invoice by ID with all related data.
 *
 * @param invoiceId - Invoice ID
 * @param sequelize - Sequelize instance
 * @param includeLineItems - Include line items in response
 * @returns Invoice with optional line items
 *
 * @throws {NotFoundException} If invoice not found
 *
 * @example
 * ```typescript
 * const invoice = await getInvoiceById('inv-123', sequelize, true);
 * ```
 */
export declare function getInvoiceById(invoiceId: string, sequelize: Sequelize, includeLineItems?: boolean): Promise<InvoiceDto>;
/**
 * Searches invoices with advanced filtering and pagination.
 *
 * @param filters - Search filters and pagination options
 * @param sequelize - Sequelize instance
 * @returns Paginated invoice list with metadata
 *
 * Features:
 * - Full-text search on invoice number and customer
 * - Status and type filtering
 * - Date range filtering
 * - Amount range filtering
 * - Pagination and sorting
 * - Total count and page metadata
 *
 * @example
 * ```typescript
 * const results = await searchInvoices(
 *   {
 *     status: 'overdue',
 *     dueDateFrom: new Date('2024-01-01'),
 *     page: 1,
 *     pageSize: 20,
 *   },
 *   sequelize
 * );
 * ```
 */
export declare function searchInvoices(filters: InvoiceSearchDto, sequelize: Sequelize): Promise<{
    invoices: InvoiceDto[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}>;
/**
 * Adds line item to existing invoice.
 *
 * @param invoiceId - Invoice ID
 * @param lineItem - Line item details
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Updated invoice with new line item
 *
 * @throws {NotFoundException} If invoice not found
 * @throws {BadRequestException} If invoice cannot be modified
 *
 * @example
 * ```typescript
 * const updated = await addLineItem('inv-123', {
 *   itemCode: 'SVC-002',
 *   description: 'Additional Services',
 *   quantity: 10,
 *   unitPrice: 100,
 *   taxPercent: 8.5,
 * }, sequelize);
 * ```
 */
export declare function addLineItem(invoiceId: string, lineItem: Partial<InvoiceLineItemDto>, sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceDto>;
/**
 * Updates existing line item on invoice.
 *
 * @param invoiceId - Invoice ID
 * @param lineItemId - Line item ID to update
 * @param updates - Line item updates
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Updated invoice
 *
 * @example
 * ```typescript
 * const updated = await updateLineItem('inv-123', 'line-456', {
 *   quantity: 15,
 *   unitPrice: 120,
 * }, sequelize);
 * ```
 */
export declare function updateLineItem(invoiceId: string, lineItemId: string, updates: Partial<InvoiceLineItemDto>, sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceDto>;
/**
 * Removes line item from invoice.
 *
 * @param invoiceId - Invoice ID
 * @param lineItemId - Line item ID to remove
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Updated invoice
 *
 * @throws {NotFoundException} If line item not found
 * @throws {BadRequestException} If last line item (invoices must have at least one)
 *
 * @example
 * ```typescript
 * const updated = await removeLineItem('inv-123', 'line-456', sequelize);
 * ```
 */
export declare function removeLineItem(invoiceId: string, lineItemId: string, sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceDto>;
/**
 * Reorders line items on invoice.
 *
 * @param invoiceId - Invoice ID
 * @param lineItemIds - Array of line item IDs in new order
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Updated invoice
 *
 * @example
 * ```typescript
 * await reorderLineItems('inv-123', ['line-3', 'line-1', 'line-2'], sequelize);
 * ```
 */
export declare function reorderLineItems(invoiceId: string, lineItemIds: string[], sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceDto>;
/**
 * Generates PDF for invoice using template.
 *
 * @param invoiceId - Invoice ID
 * @param templateId - Template ID to use (optional, uses default if not specified)
 * @param sequelize - Sequelize instance
 * @returns PDF buffer
 *
 * Features:
 * - Custom template support with branding
 * - QR code for payment link
 * - Multi-page support
 * - Line item tables with totals
 * - Tax breakdown
 * - Payment terms display
 * - Company logo and colors
 *
 * @example
 * ```typescript
 * const pdfBuffer = await generateInvoicePDF('inv-123', 'template-1', sequelize);
 * fs.writeFileSync('invoice.pdf', pdfBuffer);
 * ```
 */
export declare function generateInvoicePDF(invoiceId: string, templateId: string, sequelize: Sequelize): Promise<Buffer>;
/**
 * Generates invoice PDF with embedded payment QR code.
 *
 * @param invoiceId - Invoice ID
 * @param paymentUrl - Payment link URL to encode in QR code
 * @param templateId - Template ID
 * @param sequelize - Sequelize instance
 * @returns PDF buffer with QR code
 *
 * @example
 * ```typescript
 * const pdf = await generateInvoicePDFWithQR(
 *   'inv-123',
 *   'https://pay.example.com/inv-123',
 *   'template-1',
 *   sequelize
 * );
 * ```
 */
export declare function generateInvoicePDFWithQR(invoiceId: string, paymentUrl: string, templateId: string, sequelize: Sequelize): Promise<Buffer>;
/**
 * Sends invoice via email to customer.
 *
 * @param invoiceId - Invoice ID
 * @param recipientEmail - Override recipient email (optional)
 * @param emailTemplateId - Email template to use
 * @param attachPDF - Attach PDF to email
 * @param sequelize - Sequelize instance
 *
 * Features:
 * - Custom email templates
 * - PDF attachment
 * - Delivery tracking
 * - Read receipt tracking
 * - Retry logic for failures
 *
 * @example
 * ```typescript
 * await sendInvoiceByEmail('inv-123', null, 'email-template-1', true, sequelize);
 * ```
 */
export declare function sendInvoiceByEmail(invoiceId: string, recipientEmail: string, emailTemplateId: string, attachPDF: boolean, sequelize: Sequelize): Promise<void>;
/**
 * Publishes invoice to customer portal.
 *
 * @param invoiceId - Invoice ID
 * @param sequelize - Sequelize instance
 * @returns Portal access link
 *
 * Features:
 * - Secure access link generation
 * - Portal notifications
 * - View tracking
 * - Download tracking
 *
 * @example
 * ```typescript
 * const portalLink = await publishInvoiceToPortal('inv-123', sequelize);
 * ```
 */
export declare function publishInvoiceToPortal(invoiceId: string, sequelize: Sequelize): Promise<string>;
/**
 * Marks invoice as viewed by customer.
 *
 * @param invoiceId - Invoice ID
 * @param viewedBy - Viewer identifier (email or user ID)
 * @param sequelize - Sequelize instance
 *
 * @example
 * ```typescript
 * await markInvoiceAsViewed('inv-123', 'customer@example.com', sequelize);
 * ```
 */
export declare function markInvoiceAsViewed(invoiceId: string, viewedBy: string, sequelize: Sequelize): Promise<void>;
/**
 * Creates credit note for full or partial invoice refund.
 *
 * @param originalInvoiceId - Original invoice ID to credit
 * @param creditAmount - Amount to credit (null for full credit)
 * @param reason - Reason for credit note
 * @param lineItems - Specific line items to credit (optional)
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created credit note invoice
 *
 * Features:
 * - Full or partial credits
 * - Line item specific credits
 * - Reason tracking
 * - Automatic numbering
 * - Parent invoice linking
 *
 * @example
 * ```typescript
 * const creditNote = await createCreditNote(
 *   'inv-123',
 *   500,
 *   'Product return - damaged goods',
 *   null,
 *   sequelize
 * );
 * ```
 */
export declare function createCreditNote(originalInvoiceId: string, creditAmount: number, reason: string, lineItems: InvoiceLineItemDto[], sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceDto>;
/**
 * Creates debit note for additional charges.
 *
 * @param originalInvoiceId - Original invoice ID
 * @param debitAmount - Additional amount to charge
 * @param reason - Reason for debit note
 * @param lineItems - Additional line items
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created debit note invoice
 *
 * @example
 * ```typescript
 * const debitNote = await createDebitNote(
 *   'inv-123',
 *   250,
 *   'Additional services rendered',
 *   [{ itemCode: 'SVC-999', description: 'Rush fee', quantity: 1, unitPrice: 250 }],
 *   sequelize
 * );
 * ```
 */
export declare function createDebitNote(originalInvoiceId: string, debitAmount: number, reason: string, lineItems: InvoiceLineItemDto[], sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceDto>;
/**
 * Creates pro forma invoice (quote/estimate).
 *
 * @param invoiceData - Invoice details
 * @param validUntil - Quote expiration date
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created pro forma invoice
 *
 * Features:
 * - Quote generation
 * - Expiration date tracking
 * - Conversion to standard invoice
 * - Custom numbering sequence
 *
 * @example
 * ```typescript
 * const proforma = await createProFormaInvoice(
 *   invoiceData,
 *   new Date('2024-12-31'),
 *   sequelize
 * );
 * ```
 */
export declare function createProFormaInvoice(invoiceData: Partial<InvoiceDto>, validUntil: Date, sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceDto>;
/**
 * Converts pro forma invoice to standard invoice.
 *
 * @param proformaInvoiceId - Pro forma invoice ID
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns New standard invoice
 *
 * @example
 * ```typescript
 * const invoice = await convertProFormaToInvoice('proforma-123', sequelize);
 * ```
 */
export declare function convertProFormaToInvoice(proformaInvoiceId: string, sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceDto>;
/**
 * Creates recurring invoice schedule.
 *
 * @param scheduleData - Schedule configuration
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created schedule
 *
 * Features:
 * - Multiple frequencies (daily to annual)
 * - Custom start and end dates
 * - Auto-send option
 * - Invoice template
 *
 * @example
 * ```typescript
 * const schedule = await createRecurringSchedule({
 *   name: 'Monthly Hosting',
 *   customerId: 'cust-123',
 *   frequency: 'monthly',
 *   startDate: new Date('2024-01-01'),
 *   invoiceTemplate: baseInvoice,
 *   autoSend: true,
 * }, sequelize);
 * ```
 */
export declare function createRecurringSchedule(scheduleData: Partial<RecurringScheduleDto>, sequelize: Sequelize, transaction?: Transaction): Promise<RecurringScheduleDto>;
/**
 * Generates invoice from recurring schedule.
 *
 * @param scheduleId - Schedule ID
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Generated invoice
 *
 * @example
 * ```typescript
 * const invoice = await generateRecurringInvoice('schedule-123', sequelize);
 * ```
 */
export declare function generateRecurringInvoice(scheduleId: string, sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceDto>;
/**
 * Calculates next recurring invoice date.
 *
 * @param currentDate - Current invoice date
 * @param frequency - Recurrence frequency
 * @returns Next invoice date
 */
export declare function calculateNextRecurringDate(currentDate: Date, frequency: RecurringFrequency): Date;
/**
 * Cancels recurring invoice schedule.
 *
 * @param scheduleId - Schedule ID
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await cancelRecurringSchedule('schedule-123', sequelize);
 * ```
 */
export declare function cancelRecurringSchedule(scheduleId: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Submits invoice for approval.
 *
 * @param invoiceId - Invoice ID
 * @param approvers - List of approvers
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Approval records created
 *
 * @example
 * ```typescript
 * await submitInvoiceForApproval('inv-123', [
 *   { approverId: 'user-1', approverEmail: 'manager@example.com', stepNumber: 1 },
 * ], sequelize);
 * ```
 */
export declare function submitInvoiceForApproval(invoiceId: string, approvers: Partial<InvoiceApprovalDto>[], sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceApprovalDto[]>;
/**
 * Approves invoice.
 *
 * @param invoiceId - Invoice ID
 * @param approvalId - Approval record ID
 * @param approverId - Approver user ID
 * @param comments - Approval comments
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await approveInvoice('inv-123', 'approval-456', 'user-1', 'Approved', sequelize);
 * ```
 */
export declare function approveInvoice(invoiceId: string, approvalId: string, approverId: string, comments: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Rejects invoice approval.
 *
 * @param invoiceId - Invoice ID
 * @param approvalId - Approval record ID
 * @param approverId - Approver user ID
 * @param reason - Rejection reason
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await rejectInvoice('inv-123', 'approval-456', 'user-1', 'Incorrect pricing', sequelize);
 * ```
 */
export declare function rejectInvoice(invoiceId: string, approvalId: string, approverId: string, reason: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Generates accounts receivable aging report.
 *
 * @param asOfDate - Report date (default: today)
 * @param customerId - Filter by customer (optional)
 * @param sequelize - Sequelize instance
 * @returns Aging buckets with invoices
 *
 * Features:
 * - Standard aging buckets (0-30, 31-60, 61-90, 90+)
 * - Customer filtering
 * - Amount totals and percentages
 * - Drill-down to invoice details
 *
 * @example
 * ```typescript
 * const aging = await generateAgingReport(new Date(), null, sequelize);
 * ```
 */
export declare function generateAgingReport(asOfDate: Date, customerId: string, sequelize: Sequelize): Promise<InvoiceAgingDto[]>;
/**
 * Calculates days sales outstanding (DSO).
 *
 * @param startDate - Calculation start date
 * @param endDate - Calculation end date
 * @param sequelize - Sequelize instance
 * @returns DSO in days
 *
 * @example
 * ```typescript
 * const dso = await calculateDSO(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   sequelize
 * );
 * ```
 */
export declare function calculateDSO(startDate: Date, endDate: Date, sequelize: Sequelize): Promise<number>;
/**
 * Processes dunning rules for overdue invoices.
 *
 * @param sequelize - Sequelize instance
 * @returns Number of dunning notices sent
 *
 * Features:
 * - Automatic overdue detection
 * - Multi-level dunning (reminder, notices, collection)
 * - Email notifications
 * - Late fee application
 * - Service suspension flags
 *
 * @example
 * ```typescript
 * const noticesSent = await processDunningRules(sequelize);
 * ```
 */
export declare function processDunningRules(sequelize: Sequelize): Promise<number>;
/**
 * Sends dunning notice for specific invoice.
 *
 * @param invoiceId - Invoice ID
 * @param dunningRuleId - Dunning rule to apply
 * @param sequelize - Sequelize instance
 * @returns Dunning history record
 *
 * @example
 * ```typescript
 * const history = await sendDunningNotice('inv-123', 'rule-456', sequelize);
 * ```
 */
export declare function sendDunningNotice(invoiceId: string, dunningRuleId: string, sequelize: Sequelize): Promise<DunningHistoryDto>;
/**
 * Gets dunning history for invoice.
 *
 * @param invoiceId - Invoice ID
 * @param sequelize - Sequelize instance
 * @returns Dunning history records
 *
 * @example
 * ```typescript
 * const history = await getDunningHistory('inv-123', sequelize);
 * ```
 */
export declare function getDunningHistory(invoiceId: string, sequelize: Sequelize): Promise<DunningHistoryDto[]>;
/**
 * Allocates payment to invoice(s).
 *
 * @param paymentId - Payment ID
 * @param allocations - Array of invoice allocations
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created allocation records
 *
 * Features:
 * - Single or split payment allocation
 * - Automatic invoice status updates
 * - Overpayment handling
 * - Partial payment tracking
 *
 * @example
 * ```typescript
 * await allocatePayment('pay-123', [
 *   { invoiceId: 'inv-1', amount: 500 },
 *   { invoiceId: 'inv-2', amount: 300 },
 * ], sequelize);
 * ```
 */
export declare function allocatePayment(paymentId: string, allocations: Partial<PaymentAllocationDto>[], sequelize: Sequelize, transaction?: Transaction): Promise<PaymentAllocationDto[]>;
/**
 * Reverses payment allocation.
 *
 * @param allocationId - Allocation ID to reverse
 * @param reason - Reversal reason
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await reversePaymentAllocation('alloc-123', 'Payment bounced', sequelize);
 * ```
 */
export declare function reversePaymentAllocation(allocationId: string, reason: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Creates invoice template.
 *
 * @param templateData - Template configuration
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created template
 *
 * @example
 * ```typescript
 * const template = await createInvoiceTemplate({
 *   name: 'Modern Blue',
 *   logoUrl: 'https://example.com/logo.png',
 *   primaryColor: '#1E3A8A',
 *   secondaryColor: '#3B82F6',
 *   fontFamily: 'Helvetica',
 * }, sequelize);
 * ```
 */
export declare function createInvoiceTemplate(templateData: Partial<InvoiceTemplateDto>, sequelize: Sequelize, transaction?: Transaction): Promise<InvoiceTemplateDto>;
/**
 * Gets all invoice templates.
 *
 * @param includeInactive - Include inactive templates
 * @param sequelize - Sequelize instance
 * @returns List of templates
 *
 * @example
 * ```typescript
 * const templates = await getInvoiceTemplates(false, sequelize);
 * ```
 */
export declare function getInvoiceTemplates(includeInactive: boolean, sequelize: Sequelize): Promise<InvoiceTemplateDto[]>;
/**
 * Sets default invoice template.
 *
 * @param templateId - Template ID to set as default
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await setDefaultTemplate('template-123', sequelize);
 * ```
 */
export declare function setDefaultTemplate(templateId: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
declare const _default: {
    createInvoice: typeof createInvoice;
    updateInvoice: typeof updateInvoice;
    deleteInvoice: typeof deleteInvoice;
    getInvoiceById: typeof getInvoiceById;
    searchInvoices: typeof searchInvoices;
    generateInvoiceNumber: typeof generateInvoiceNumber;
    calculateInvoiceTotals: typeof calculateInvoiceTotals;
    calculateDueDate: typeof calculateDueDate;
    addLineItem: typeof addLineItem;
    updateLineItem: typeof updateLineItem;
    removeLineItem: typeof removeLineItem;
    reorderLineItems: typeof reorderLineItems;
    generateInvoicePDF: typeof generateInvoicePDF;
    generateInvoicePDFWithQR: typeof generateInvoicePDFWithQR;
    sendInvoiceByEmail: typeof sendInvoiceByEmail;
    publishInvoiceToPortal: typeof publishInvoiceToPortal;
    markInvoiceAsViewed: typeof markInvoiceAsViewed;
    createCreditNote: typeof createCreditNote;
    createDebitNote: typeof createDebitNote;
    createProFormaInvoice: typeof createProFormaInvoice;
    convertProFormaToInvoice: typeof convertProFormaToInvoice;
    createRecurringSchedule: typeof createRecurringSchedule;
    generateRecurringInvoice: typeof generateRecurringInvoice;
    calculateNextRecurringDate: typeof calculateNextRecurringDate;
    cancelRecurringSchedule: typeof cancelRecurringSchedule;
    submitInvoiceForApproval: typeof submitInvoiceForApproval;
    approveInvoice: typeof approveInvoice;
    rejectInvoice: typeof rejectInvoice;
    generateAgingReport: typeof generateAgingReport;
    calculateDSO: typeof calculateDSO;
    processDunningRules: typeof processDunningRules;
    sendDunningNotice: typeof sendDunningNotice;
    getDunningHistory: typeof getDunningHistory;
    allocatePayment: typeof allocatePayment;
    reversePaymentAllocation: typeof reversePaymentAllocation;
    createInvoiceTemplate: typeof createInvoiceTemplate;
    getInvoiceTemplates: typeof getInvoiceTemplates;
    setDefaultTemplate: typeof setDefaultTemplate;
};
export default _default;
//# sourceMappingURL=invoice-generation-management-kit.d.ts.map
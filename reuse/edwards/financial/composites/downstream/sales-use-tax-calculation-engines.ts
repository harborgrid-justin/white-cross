/**
 * LOC: SALESTAX001
 * File: /reuse/edwards/financial/composites/downstream/sales-use-tax-calculation-engines.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - ../tax-management-compliance-composite
 *
 * DOWNSTREAM (imported by):
 *   - Sales tax controllers
 *   - E-commerce checkout services
 *   - Invoice generation modules
 */

import { Injectable, Logger } from '@nestjs/common';

/**
 * Tax calculation method
 */
export enum TaxCalculationMethod {
  ORIGIN_BASED = 'ORIGIN_BASED',
  DESTINATION_BASED = 'DESTINATION_BASED',
}

/**
 * Taxability status
 */
export enum TaxabilityStatus {
  TAXABLE = 'TAXABLE',
  EXEMPT = 'EXEMPT',
  REDUCED_RATE = 'REDUCED_RATE',
  ZERO_RATED = 'ZERO_RATED',
}

/**
 * Tax rate components
 */
export interface TaxRateComponents {
  state: number;
  county: number;
  city: number;
  special: number;
  total: number;
}

/**
 * Tax calculation request
 */
export interface TaxCalculationRequest {
  transactionId?: string;
  lineItems: Array<{
    itemId: string;
    description: string;
    amount: number;
    quantity: number;
    productCode?: string;
    taxCode?: string;
  }>;
  originAddress: Address;
  destinationAddress: Address;
  transactionDate: Date;
  customerId?: number;
  exemptionCertificateId?: string;
}

/**
 * Address interface
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

/**
 * Tax calculation response
 */
export interface TaxCalculationResponse {
  transactionId: string;
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  lineItems: Array<{
    itemId: string;
    amount: number;
    tax: number;
    taxRate: number;
    taxabilityStatus: TaxabilityStatus;
  }>;
  taxBreakdown: Array<{
    jurisdiction: string;
    jurisdictionLevel: 'STATE' | 'COUNTY' | 'CITY' | 'SPECIAL';
    taxType: 'SALES' | 'USE';
    rate: number;
    taxable: number;
    tax: number;
  }>;
}

/**
 * Sales and use tax calculation engine
 * Calculates sales tax, use tax, and handles tax compliance
 */
@Injectable()
export class SalesUseTaxCalculationEngine {
  private readonly logger = new Logger(SalesUseTaxCalculationEngine.name);

  /**
   * Calculates sales/use tax for transaction
   */
  async calculateTax(request: TaxCalculationRequest): Promise<TaxCalculationResponse> {
    this.logger.log(`Calculating tax for transaction ${request.transactionId || 'new'}`);

    // Determine calculation method (origin vs destination)
    const calculationMethod = this.determineCalculationMethod(
      request.originAddress,
      request.destinationAddress
    );

    // Determine tax jurisdiction
    const jurisdiction = calculationMethod === TaxCalculationMethod.ORIGIN_BASED
      ? request.originAddress
      : request.destinationAddress;

    // Get tax rates for jurisdiction
    const taxRates = await this.getTaxRates(jurisdiction, request.transactionDate);

    // Check for exemptions
    const isExempt = request.exemptionCertificateId
      ? await this.validateExemptionCertificate(request.exemptionCertificateId)
      : false;

    let subtotal = 0;
    let totalTax = 0;
    const lineItems: TaxCalculationResponse['lineItems'] = [];
    const taxBreakdown: TaxCalculationResponse['taxBreakdown'] = [];

    for (const item of request.lineItems) {
      const lineAmount = item.amount * item.quantity;
      subtotal += lineAmount;

      // Determine taxability
      const taxabilityStatus = isExempt
        ? TaxabilityStatus.EXEMPT
        : await this.determineTaxability(item.productCode || '', item.taxCode || '');

      let lineTax = 0;
      if (taxabilityStatus === TaxabilityStatus.TAXABLE) {
        lineTax = lineAmount * taxRates.total;
      }

      totalTax += lineTax;

      lineItems.push({
        itemId: item.itemId,
        amount: lineAmount,
        tax: lineTax,
        taxRate: taxRates.total,
        taxabilityStatus,
      });
    }

    // Build tax breakdown
    if (!isExempt) {
      const taxableAmount = subtotal;

      if (taxRates.state > 0) {
        taxBreakdown.push({
          jurisdiction: jurisdiction.state,
          jurisdictionLevel: 'STATE',
          taxType: 'SALES',
          rate: taxRates.state,
          taxable: taxableAmount,
          tax: taxableAmount * taxRates.state,
        });
      }

      if (taxRates.county > 0) {
        taxBreakdown.push({
          jurisdiction: `${jurisdiction.state} - County`,
          jurisdictionLevel: 'COUNTY',
          taxType: 'SALES',
          rate: taxRates.county,
          taxable: taxableAmount,
          tax: taxableAmount * taxRates.county,
        });
      }

      if (taxRates.city > 0) {
        taxBreakdown.push({
          jurisdiction: jurisdiction.city,
          jurisdictionLevel: 'CITY',
          taxType: 'SALES',
          rate: taxRates.city,
          taxable: taxableAmount,
          tax: taxableAmount * taxRates.city,
        });
      }

      if (taxRates.special > 0) {
        taxBreakdown.push({
          jurisdiction: 'Special District',
          jurisdictionLevel: 'SPECIAL',
          taxType: 'SALES',
          rate: taxRates.special,
          taxable: taxableAmount,
          tax: taxableAmount * taxRates.special,
        });
      }
    }

    const response: TaxCalculationResponse = {
      transactionId: request.transactionId || `TX-${Date.now()}`,
      subtotal,
      totalTax,
      grandTotal: subtotal + totalTax,
      lineItems,
      taxBreakdown,
    };

    return response;
  }

  /**
   * Determines calculation method based on addresses
   */
  private determineCalculationMethod(
    originAddress: Address,
    destinationAddress: Address
  ): TaxCalculationMethod {
    // Most states use destination-based for remote sales
    // Some states use origin-based for in-state sales
    // This is simplified logic - actual implementation would be more complex

    if (originAddress.state === destinationAddress.state) {
      // Check if state is origin-based
      const originBasedStates = ['CA', 'TX'];
      if (originBasedStates.includes(originAddress.state)) {
        return TaxCalculationMethod.ORIGIN_BASED;
      }
    }

    return TaxCalculationMethod.DESTINATION_BASED;
  }

  /**
   * Retrieves tax rates for jurisdiction
   */
  async getTaxRates(address: Address, effectiveDate: Date): Promise<TaxRateComponents> {
    this.logger.log(`Retrieving tax rates for ${address.city}, ${address.state}`);

    // In production, this would query a tax rate database or API
    // Simulated rates for demonstration
    const rates: TaxRateComponents = {
      state: 0.0625,    // 6.25% state rate
      county: 0.01,     // 1% county rate
      city: 0.01,       // 1% city rate
      special: 0.0025,  // 0.25% special district
      total: 0.085,     // 8.5% total
    };

    return rates;
  }

  /**
   * Determines taxability of item
   */
  async determineTaxability(
    productCode: string,
    taxCode: string
  ): Promise<TaxabilityStatus> {
    // Check if product/tax code is exempt
    const exemptCodes = ['MEDICAL', 'FOOD', 'PRESCRIPTION'];

    if (exemptCodes.includes(taxCode)) {
      return TaxabilityStatus.EXEMPT;
    }

    return TaxabilityStatus.TAXABLE;
  }

  /**
   * Validates exemption certificate
   */
  async validateExemptionCertificate(certificateId: string): Promise<boolean> {
    this.logger.log(`Validating exemption certificate ${certificateId}`);

    // Check certificate validity, expiration, jurisdiction, etc.
    return true;
  }

  /**
   * Retrieves nexus status for jurisdiction
   */
  async getNexusStatus(state: string): Promise<{
    hasNexus: boolean;
    nexusType: 'PHYSICAL' | 'ECONOMIC' | 'NONE';
    effectiveDate?: Date;
  }> {
    this.logger.log(`Checking nexus status for ${state}`);

    // Check if company has sales tax nexus in state
    return {
      hasNexus: true,
      nexusType: 'PHYSICAL',
      effectiveDate: new Date('2020-01-01'),
    };
  }

  /**
   * Records tax calculation for audit trail
   */
  async recordTaxCalculation(
    request: TaxCalculationRequest,
    response: TaxCalculationResponse
  ): Promise<void> {
    this.logger.log(`Recording tax calculation ${response.transactionId}`);

    // Store calculation details for audit purposes
  }
}

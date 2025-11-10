/**
 * Trade-Based Money Laundering (TBML) Detection Kit
 * Comprehensive detection engine for trade-based illicit financial flows
 * Covers 15+ risk categories with 40 detection functions
 * TypeScript + Sequelize + NestJS
 *
 * Risk Categories:
 * 1. Over/Under Invoicing (4 functions)
 * 2. Multiple Invoicing IDs (3 functions)
 * 3. Phantom Shipments (3 functions)
 * 4. Over/Under Shipping (3 functions)
 * 5. Commodity Price Variance (3 functions)
 * 6. Trade Route Anomalies (3 functions)
 * 7. Free Trade Zone Monitoring (3 functions)
 * 8. Dual-Use Goods Tracking (3 functions)
 * 9. HTSUS Code Analysis (3 functions)
 * 10. Counterparty Verification (3 functions)
 * 11. Trade Finance Red Flags (3 functions)
 * 12. Letter of Credit Scrutiny (3 functions)
 * 13. Bill of Lading Validation (3 functions)
 * 14. Value Transfer Schemes (3 functions)
 * 15. Cross-Border Trade Patterns (3 functions)
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Model, Sequelize } from 'sequelize';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface TradeTransaction {
  id: string;
  exporterId: string;
  importerId: string;
  invoiceAmount: number;
  invoiceDate: Date;
  invoiceId: string;
  shipmentDate: Date;
  estimatedPrice: number;
  marketPrice: number;
  quantity: number;
  unit: string;
  commodity: string;
  htsCode: string;
  originCountry: string;
  destinationCountry: string;
  ftzCode?: string;
  lcNumber?: string;
  bolNumber?: string;
  route: string;
  paymentTerms: string;
  currency: string;
}

interface RiskFlag {
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  riskIndicators: string[];
  recommendation: string;
  timestamp: Date;
}

interface DetectionResult {
  transactionId: string;
  flagged: boolean;
  riskFlags: RiskFlag[];
  overallRiskScore: number;
  requiresInvestigation: boolean;
  reviewLevel: 'AUTOMATED' | 'MANUAL' | 'INVESTIGATION';
}

interface MarketComparison {
  commodity: string;
  expectedPrice: number;
  reportedPrice: number;
  variance: number;
  variancePercent: number;
  historicalAvg: number;
  marketData: Map<string, number>;
}

interface CounterpartyProfile {
  entityId: string;
  entityName: string;
  sanctionsStatus: boolean;
  pepsStatus: boolean;
  historicalCompliance: number;
  riskRating: string;
  previousViolations: number;
}

interface TradePatternMetrics {
  entityId: string;
  averageInvoiceAmount: number;
  standardDeviation: number;
  anomalousTransactions: number;
  frequencyPattern: string;
  geographicDiversity: number;
}

// ============================================================================
// 1. OVER/UNDER INVOICING DETECTION (4 functions)
// ============================================================================

@Injectable()
export class TradeBasedMoneyLaunderingDetectionKit {
  /**
   * Detects significant price deviations between invoice and market prices
   * Threshold: >15% variance considered suspicious
   */
  public detectInvoicePriceAnomaly(
    invoiceAmount: number,
    marketPrice: number,
    quantity: number,
  ): RiskFlag | null {
    const invoicePrice = invoiceAmount / quantity;
    const variance = Math.abs(invoicePrice - marketPrice) / marketPrice;

    if (variance > 0.15) {
      return {
        category: 'INVOICE_PRICE_ANOMALY',
        severity: variance > 0.30 ? 'CRITICAL' : variance > 0.20 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min(variance * 100, 100),
        riskIndicators: [
          `Invoice price variance: ${(variance * 100).toFixed(2)}%`,
          `Invoice price: $${invoicePrice.toFixed(2)} vs Market: $${marketPrice.toFixed(2)}`,
        ],
        recommendation: 'Request price justification and supporting documentation',
        timestamp: new Date(),
      };
    }
    return null;
  }

  /**
   * Identifies systematic under-invoicing patterns (profit extraction indicator)
   * Flags transactions consistently below market rates
   */
  public detectSystematicUnderInvoicing(
    transactions: TradeTransaction[],
    historyWindowDays: number = 90,
  ): DetectionResult {
    const underInvoiced = transactions.filter((t) => {
      const priceVariance = (t.estimatedPrice - t.invoiceAmount / t.quantity) / t.estimatedPrice;
      return priceVariance > 0.1; // 10% under market
    });

    const underInvoicingPercentage = underInvoiced.length / transactions.length;
    const flags: RiskFlag[] = [];

    if (underInvoicingPercentage > 0.3) {
      flags.push({
        category: 'SYSTEMATIC_UNDER_INVOICING',
        severity: underInvoicingPercentage > 0.6 ? 'CRITICAL' : 'HIGH',
        riskScore: Math.min(underInvoicingPercentage * 100, 100),
        riskIndicators: [
          `${(underInvoicingPercentage * 100).toFixed(1)}% of transactions under-invoiced`,
          `Pattern indicates value extraction through pricing`,
          `Consistent deviation from market rates`,
        ],
        recommendation: 'File SAR - Systematic under-invoicing pattern detected',
        timestamp: new Date(),
      });
    }

    return {
      transactionId: transactions[0]?.id || '',
      flagged: flags.length > 0,
      riskFlags: flags,
      overallRiskScore: flags.reduce((sum, f) => sum + f.riskScore, 0) / Math.max(transactions.length, 1),
      requiresInvestigation: flags.length > 0,
      reviewLevel: flags.length > 0 ? 'INVESTIGATION' : 'AUTOMATED',
    };
  }

  /**
   * Detects over-invoicing patterns (money injection indicators)
   * Flags transactions significantly above market value
   */
  public detectOverInvoicing(
    invoiceAmount: number,
    quantity: number,
    historicalAvgPrice: number,
    commodityType: string,
  ): RiskFlag | null {
    const invoicePrice = invoiceAmount / quantity;
    const priceDeviation = (invoicePrice - historicalAvgPrice) / historicalAvgPrice;

    if (priceDeviation > 0.25) {
      return {
        category: 'OVER_INVOICING',
        severity: priceDeviation > 0.50 ? 'CRITICAL' : 'HIGH',
        riskScore: Math.min(priceDeviation * 100, 100),
        riskIndicators: [
          `Invoice ${(priceDeviation * 100).toFixed(1)}% above historical average`,
          `Commodity: ${commodityType}`,
          `Possible value injection scheme`,
        ],
        recommendation: 'Verify invoice authenticity and payment terms',
        timestamp: new Date(),
      };
    }
    return null;
  }

  /**
   * Cross-references invoice amounts across multiple documents (invoice, BOL, LC)
   * Detects discrepancies indicating potential fraud
   */
  public validateInvoiceAmountConsistency(
    invoiceAmount: number,
    bolAmount: number,
    lcAmount: number,
    tolerance: number = 0.02,
  ): RiskFlag | null {
    const invoiceBolVariance = Math.abs(invoiceAmount - bolAmount) / invoiceAmount;
    const invoiceLcVariance = Math.abs(invoiceAmount - lcAmount) / invoiceAmount;

    if (invoiceBolVariance > tolerance || invoiceLcVariance > tolerance) {
      return {
        category: 'INVOICE_AMOUNT_INCONSISTENCY',
        severity: invoiceBolVariance > 0.05 || invoiceLcVariance > 0.05 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.max(invoiceBolVariance, invoiceLcVariance) * 100,
        riskIndicators: [
          `Invoice-BOL variance: ${(invoiceBolVariance * 100).toFixed(2)}%`,
          `Invoice-LC variance: ${(invoiceLcVariance * 100).toFixed(2)}%`,
          `Possible document manipulation`,
        ],
        recommendation: 'Request original documents and verify amounts',
        timestamp: new Date(),
      };
    }
    return null;
  }

  // ============================================================================
  // 2. MULTIPLE INVOICING IDS (3 functions)
  // ============================================================================

  /**
   * Detects multiple invoices for same shipment (splitting/layering indicator)
   */
  public detectMultipleInvoicesPerShipment(
    transactions: TradeTransaction[],
    shipmentId: string,
  ): RiskFlag | null {
    const invoicesForShipment = new Set(
      transactions
        .filter((t) => t.bolNumber === shipmentId)
        .map((t) => t.invoiceId),
    );

    if (invoicesForShipment.size > 1) {
      return {
        category: 'MULTIPLE_INVOICES_PER_SHIPMENT',
        severity: invoicesForShipment.size > 3 ? 'CRITICAL' : 'HIGH',
        riskScore: Math.min(invoicesForShipment.size * 20, 100),
        riskIndicators: [
          `${invoicesForShipment.size} invoices for single shipment`,
          `Invoice IDs: ${Array.from(invoicesForShipment).join(', ')}`,
          `Pattern suggests splitting for concealment`,
        ],
        recommendation: 'Consolidate and reconcile invoice amounts',
        timestamp: new Date(),
      };
    }
    return null;
  }

  /**
   * Identifies sequential/suspicious invoice ID patterns
   */
  public detectSuspiciousInvoiceIdPatterns(invoiceIds: string[]): RiskFlag | null {
    const numericIds = invoiceIds
      .map((id) => parseInt(id.replace(/\D/g, ''), 10))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);

    if (numericIds.length < 2) return null;

    // Check for unusual gaps or sequences
    const gaps: number[] = [];
    for (let i = 1; i < numericIds.length; i++) {
      gaps.push(numericIds[i] - numericIds[i - 1]);
    }

    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const anomalousGaps = gaps.filter((g) => g === 0 || g > avgGap * 3).length;

    if (anomalousGaps > gaps.length * 0.2) {
      return {
        category: 'SUSPICIOUS_INVOICE_ID_PATTERNS',
        severity: 'MEDIUM',
        riskScore: (anomalousGaps / gaps.length) * 100,
        riskIndicators: [
          `${anomalousGaps} anomalous gaps in sequential IDs`,
          'Possible invoice number manipulation or spoofing',
        ],
        recommendation: 'Verify invoice authenticity with issuer',
        timestamp: new Date(),
      };
    }
    return null;
  }

  /**
   * Detects duplicate invoice IDs across multiple transactions
   */
  public detectDuplicateInvoiceIds(transactions: TradeTransaction[]): RiskFlag | null {
    const invoiceIdFrequency = new Map<string, number>();
    transactions.forEach((t) => {
      invoiceIdFrequency.set(t.invoiceId, (invoiceIdFrequency.get(t.invoiceId) || 0) + 1);
    });

    const duplicates = Array.from(invoiceIdFrequency.entries()).filter(([_, count]) => count > 1);

    if (duplicates.length > 0) {
      return {
        category: 'DUPLICATE_INVOICE_IDS',
        severity: 'CRITICAL',
        riskScore: Math.min(duplicates.length * 25, 100),
        riskIndicators: [
          `${duplicates.length} duplicate invoice IDs found`,
          `Possible fraud or system manipulation`,
        ],
        recommendation: 'File SAR - Duplicate invoice IDs indicate potential fraud',
        timestamp: new Date(),
      };
    }
    return null;
  }

  // ============================================================================
  // 3. PHANTOM SHIPMENT DETECTION (3 functions)
  // ============================================================================

  /**
   * Identifies shipments with no matching bill of lading
   */
  public detectPhantomShipments(
    invoices: TradeTransaction[],
    bolNumbers: Set<string>,
  ): RiskFlag | null {
    const invoicesWithoutBol = invoices.filter(
      (inv) => !inv.bolNumber || !bolNumbers.has(inv.bolNumber),
    );

    if (invoicesWithoutBol.length > 0) {
      return {
        category: 'PHANTOM_SHIPMENTS',
        severity: invoicesWithoutBol.length > 5 ? 'CRITICAL' : 'HIGH',
        riskScore: Math.min((invoicesWithoutBol.length / invoices.length) * 100, 100),
        riskIndicators: [
          `${invoicesWithoutBol.length} invoices without BOL`,
          'Possible non-physical trade transactions',
          'High money laundering indicator',
        ],
        recommendation: 'Block payments and file SAR',
        timestamp: new Date(),
      };
    }
    return null;
  }

  /**
   * Verifies shipment dates align with invoice and payment dates
   */
  public validateShipmentDateChronology(
    invoiceDate: Date,
    shipmentDate: Date,
    paymentDate: Date,
  ): RiskFlag | null {
    if (shipmentDate < invoiceDate) {
      return {
        category: 'PHANTOM_SHIPMENT_DATING',
        severity: 'HIGH',
        riskScore: 90,
        riskIndicators: [
          'Shipment date before invoice date (chronological impossibility)',
          `Invoice: ${invoiceDate.toISOString()}, Shipment: ${shipmentDate.toISOString()}`,
        ],
        recommendation: 'Request documentation clarification',
        timestamp: new Date(),
      };
    }

    if (paymentDate < shipmentDate) {
      return {
        category: 'PREMATURE_PAYMENT',
        severity: 'MEDIUM',
        riskScore: 70,
        riskIndicators: [
          'Payment made before shipment (unusual payment term)',
          `Shipment: ${shipmentDate.toISOString()}, Payment: ${paymentDate.toISOString()}`,
        ],
        recommendation: 'Verify payment terms and shipping evidence',
        timestamp: new Date(),
      };
    }

    if (paymentDate.getTime() - shipmentDate.getTime() > 90 * 24 * 60 * 60 * 1000) {
      return {
        category: 'EXCESSIVE_PAYMENT_DELAY',
        severity: 'MEDIUM',
        riskScore: 60,
        riskIndicators: [
          'Payment delayed >90 days after shipment',
          'Indicates possible dispute or financial instability',
        ],
        recommendation: 'Verify payment terms and follow-up on status',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Cross-validates shipment quantity with invoice quantity
   */
  public validateShipmentQuantityMatch(
    invoiceQuantity: number,
    shipmentQuantity: number,
    tolerance: number = 0.02,
  ): RiskFlag | null {
    const variance = Math.abs(invoiceQuantity - shipmentQuantity) / invoiceQuantity;

    if (variance > tolerance) {
      return {
        category: 'PHANTOM_QUANTITY_MISMATCH',
        severity: variance > 0.1 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min(variance * 100, 100),
        riskIndicators: [
          `Invoice qty: ${invoiceQuantity}, Shipment qty: ${shipmentQuantity}`,
          `Variance: ${(variance * 100).toFixed(2)}%`,
          'Possible partial fulfillment or phantom component',
        ],
        recommendation: 'Verify actual shipment receipt',
        timestamp: new Date(),
      };
    }

    return null;
  }

  // ============================================================================
  // 4. OVER/UNDER SHIPPING ANALYSIS (3 functions)
  // ============================================================================

  /**
   * Identifies shipments significantly over/under contract quantities
   */
  public detectShippingQuantityAnomalies(
    contractQuantity: number,
    shippedQuantity: number,
    commodityType: string,
  ): RiskFlag | null {
    const variance = (shippedQuantity - contractQuantity) / contractQuantity;

    if (Math.abs(variance) > 0.15) {
      return {
        category: 'SHIPPING_QUANTITY_ANOMALY',
        severity: Math.abs(variance) > 0.30 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min(Math.abs(variance) * 100, 100),
        riskIndicators: [
          `Contract: ${contractQuantity}, Shipped: ${shippedQuantity}`,
          `Variance: ${(variance * 100).toFixed(1)}%`,
          `Commodity: ${commodityType}`,
          variance > 0 ? 'Over-shipping detected' : 'Under-shipping detected',
        ],
        recommendation: variance > 0 ? 'Verify surplus shipment authorization' : 'Verify shortage documentation',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Analyzes shipping weight vs expected weight for commodity
   */
  public validateShippingWeight(
    commodityType: string,
    declaredWeight: number,
    expectedWeightPerUnit: number,
    unitCount: number,
  ): RiskFlag | null {
    const expectedWeight = expectedWeightPerUnit * unitCount;
    const weightVariance = Math.abs(declaredWeight - expectedWeight) / expectedWeight;

    if (weightVariance > 0.20) {
      return {
        category: 'SHIPPING_WEIGHT_ANOMALY',
        severity: 'MEDIUM',
        riskScore: Math.min(weightVariance * 100, 100),
        riskIndicators: [
          `Commodity: ${commodityType}`,
          `Expected: ${expectedWeight}kg, Declared: ${declaredWeight}kg`,
          `Variance: ${(weightVariance * 100).toFixed(2)}%`,
          'Possible concealment of contraband or precious metals',
        ],
        recommendation: 'Request weight verification and shipping documentation',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Detects suspicious shipping routes and transshipment patterns
   */
  public detectAnomalousShippingRoutes(
    origin: string,
    destination: string,
    actualRoute: string[],
    directRoute: string[],
  ): RiskFlag | null {
    const extraStops = actualRoute.filter((stop) => !directRoute.includes(stop));

    if (extraStops.length > 2) {
      return {
        category: 'ANOMALOUS_SHIPPING_ROUTE',
        severity: extraStops.length > 5 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min(extraStops.length * 15, 100),
        riskIndicators: [
          `${extraStops.length} unnecessary transshipment points`,
          `Extra stops: ${extraStops.join(', ')}`,
          'Possible concealment of origin/destination',
        ],
        recommendation: 'Verify commercial justification for routing',
        timestamp: new Date(),
      };
    }

    return null;
  }

  // ============================================================================
  // 5. COMMODITY PRICE VARIANCE (3 functions)
  // ============================================================================

  /**
   * Compares invoice price against market price databases
   */
  public analyzeCommodityPriceVariance(
    commodity: string,
    reportedPrice: number,
    marketPrice: number,
    date: Date,
  ): MarketComparison {
    const variance = reportedPrice - marketPrice;
    const variancePercent = (variance / marketPrice) * 100;

    return {
      commodity,
      expectedPrice: marketPrice,
      reportedPrice,
      variance,
      variancePercent,
      historicalAvg: marketPrice, // Would be enriched with real market data
      marketData: new Map([['spot', marketPrice]]),
    };
  }

  /**
   * Flags unusual price volatility for commodity
   */
  public detectCommodityPriceVolatility(
    transactions: TradeTransaction[],
    commodityType: string,
  ): RiskFlag | null {
    const prices = transactions
      .filter((t) => t.commodity === commodityType)
      .map((t) => t.invoiceAmount / t.quantity);

    if (prices.length < 3) return null;

    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / mean;

    if (coefficientOfVariation > 0.3) {
      return {
        category: 'COMMODITY_PRICE_VOLATILITY',
        severity: coefficientOfVariation > 0.5 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min(coefficientOfVariation * 100, 100),
        riskIndicators: [
          `Commodity: ${commodityType}`,
          `Coefficient of Variation: ${(coefficientOfVariation * 100).toFixed(1)}%`,
          'Unusual price instability',
        ],
        recommendation: 'Review pricing justification and market conditions',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Identifies price manipulation using high-value, low-demand commodities
   */
  public detectPriceManipulationUsingNicheCommodities(
    commodityType: string,
    marketLiquidity: number,
    transactionVolume: number,
    priceDeviation: number,
  ): RiskFlag | null {
    if (marketLiquidity < 0.3 && priceDeviation > 0.25 && transactionVolume > 100000) {
      return {
        category: 'NICHE_COMMODITY_PRICE_MANIPULATION',
        severity: 'HIGH',
        riskScore: 85,
        riskIndicators: [
          `Commodity: ${commodityType}`,
          `Low liquidity market (${(marketLiquidity * 100).toFixed(1)}%)`,
          `High volume (${transactionVolume}) with significant price deviation`,
          'Indicates possible price inflation for value extraction',
        ],
        recommendation: 'Investigate pricing against independent market sources',
        timestamp: new Date(),
      };
    }

    return null;
  }

  // ============================================================================
  // 6. TRADE ROUTE ANOMALIES (3 functions)
  // ============================================================================

  /**
   * Identifies unusual trade routes (high-risk corridors)
   */
  public detectHighRiskTradeRoutes(
    originCountry: string,
    destinationCountry: string,
    highRiskCountries: Set<string>,
  ): RiskFlag | null {
    const riskFactors: string[] = [];
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

    if (highRiskCountries.has(originCountry)) {
      riskFactors.push(`High-risk origin: ${originCountry}`);
      severity = 'HIGH';
    }
    if (highRiskCountries.has(destinationCountry)) {
      riskFactors.push(`High-risk destination: ${destinationCountry}`);
      severity = 'HIGH';
    }

    if (riskFactors.length === 2) severity = 'CRITICAL';

    if (riskFactors.length > 0) {
      return {
        category: 'HIGH_RISK_TRADE_ROUTE',
        severity,
        riskScore: severity === 'CRITICAL' ? 95 : 75,
        riskIndicators: riskFactors,
        recommendation: 'Enhanced due diligence required',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Detects unusual route re-invoicing (goods sent back and forth)
   */
  public detectCircularTradeRoutes(transactions: TradeTransaction[]): RiskFlag | null {
    const routes = new Map<string, number>();

    transactions.forEach((t) => {
      const route = `${t.originCountry}->${t.destinationCountry}`;
      const reverseRoute = `${t.destinationCountry}->${t.originCountry}`;
      routes.set(route, (routes.get(route) || 0) + 1);
      routes.set(reverseRoute, (routes.get(reverseRoute) || 0) + 1);
    });

    const circularPairs = new Set<string>();
    routes.forEach((_, route) => {
      const [origin, dest] = route.split('->');
      const reverseRoute = `${dest}->${origin}`;
      if (routes.has(reverseRoute) && routes.get(route)! > 2 && routes.get(reverseRoute)! > 2) {
        circularPairs.add(route < reverseRoute ? route : reverseRoute);
      }
    });

    if (circularPairs.size > 0) {
      return {
        category: 'CIRCULAR_TRADE_ROUTES',
        severity: 'HIGH',
        riskScore: 80,
        riskIndicators: [
          `${circularPairs.size} circular trade route pairs detected`,
          'Indicates possible value extraction through repeated transactions',
        ],
        recommendation: 'Investigate commercial justification for repeated routes',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Identifies transshipment point anomalies (unusual routing patterns)
   */
  public detectAnomalousTransshipmentPatterns(
    standardRoutes: Map<string, string[]>,
    actualRoute: string,
    transshipmentPoints: string[],
  ): RiskFlag | null {
    const routeKey = actualRoute;
    const expected = standardRoutes.get(routeKey) || [];
    const unexpected = transshipmentPoints.filter((p) => !expected.includes(p));

    if (unexpected.length > 1) {
      return {
        category: 'ANOMALOUS_TRANSSHIPMENT_PATTERNS',
        severity: unexpected.length > 3 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min(unexpected.length * 20, 100),
        riskIndicators: [
          `${unexpected.length} unexpected transshipment points: ${unexpected.join(', ')}`,
          'Route deviates from standard commercial patterns',
        ],
        recommendation: 'Request commercial justification for routing',
        timestamp: new Date(),
      };
    }

    return null;
  }

  // ============================================================================
  // 7. FREE TRADE ZONE MONITORING (3 functions)
  // ============================================================================

  /**
   * Detects suspicious free trade zone activity
   */
  public detectSuspiciousFtzActivity(
    transactionCount: number,
    ftzDwellTime: number, // days
    totalValue: number,
  ): RiskFlag | null {
    const avgValue = totalValue / transactionCount;
    const flag: RiskFlag | null = null;

    // High-frequency, low-dwell transactions suggest pass-through
    if (transactionCount > 20 && ftzDwellTime < 14 && avgValue > 50000) {
      return {
        category: 'SUSPICIOUS_FTZ_ACTIVITY',
        severity: 'HIGH',
        riskScore: 85,
        riskIndicators: [
          `${transactionCount} transactions with average dwell time: ${ftzDwellTime} days`,
          `High-frequency pass-through pattern detected`,
          'Possible value layering or pricing manipulation',
        ],
        recommendation: 'Audit FTZ records and verify commercial purpose',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Monitors goods held in FTZ beyond normal commercial periods
   */
  public detectAbnormalFtzDwellTime(
    commodity: string,
    daysInFtz: number,
    normalDwellRange: { min: number; max: number },
  ): RiskFlag | null {
    if (daysInFtz > normalDwellRange.max * 2) {
      return {
        category: 'ABNORMAL_FTZ_DWELL_TIME',
        severity: daysInFtz > normalDwellRange.max * 5 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min((daysInFtz / (normalDwellRange.max * 5)) * 100, 100),
        riskIndicators: [
          `Commodity: ${commodity}`,
          `Dwell time: ${daysInFtz} days (normal: ${normalDwellRange.min}-${normalDwellRange.max})`,
          'Extended holding period suggests non-commercial storage',
        ],
        recommendation: 'Verify commercial purpose and current ownership',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Identifies value modifications within FTZ (repackaging, assembly)
   */
  public detectValueModificationInFtz(
    entryValue: number,
    exitValue: number,
    commodityType: string,
  ): RiskFlag | null {
    const valueChange = (exitValue - entryValue) / entryValue;

    if (Math.abs(valueChange) > 0.30 && commodityType !== 'MANUFACTURING_INPUTS') {
      return {
        category: 'VALUE_MODIFICATION_IN_FTZ',
        severity: Math.abs(valueChange) > 0.75 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min(Math.abs(valueChange) * 100, 100),
        riskIndicators: [
          `Commodity: ${commodityType}`,
          `Entry value: $${entryValue}, Exit value: $${exitValue}`,
          `Value change: ${(valueChange * 100).toFixed(1)}%`,
          'Possible value manipulation or concealment',
        ],
        recommendation: 'Request documentation of value-added activities',
        timestamp: new Date(),
      };
    }

    return null;
  }

  // ============================================================================
  // 8. DUAL-USE GOODS TRACKING (3 functions)
  // ============================================================================

  /**
   * Identifies dual-use goods (items with civilian and military applications)
   */
  public detectDualUseGoodsExport(
    commodity: string,
    destination: string,
    dualUseRegistry: Map<string, string[]>,
    sanctionedDestinations: Set<string>,
  ): RiskFlag | null {
    const applicableDestinations = dualUseRegistry.get(commodity) || [];

    if (applicableDestinations.includes(destination) || sanctionedDestinations.has(destination)) {
      return {
        category: 'DUAL_USE_GOODS_EXPORT',
        severity: sanctionedDestinations.has(destination) ? 'CRITICAL' : 'HIGH',
        riskScore: sanctionedDestinations.has(destination) ? 100 : 85,
        riskIndicators: [
          `Dual-use commodity: ${commodity}`,
          `Destination: ${destination}`,
          'Potential export control violation',
        ],
        recommendation: 'File OFAC report and block transaction',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Analyzes end-use statements for credibility
   */
  public validateEndUseStatement(
    commodity: string,
    declaredEndUse: string,
    importerProfile: string,
  ): RiskFlag | null {
    // Check for mismatches between importer profile and declared use
    const suspiciousCombinations = new Map<string, Set<string>>([
      ['ELECTRONICS', new Set(['AGRICULTURE', 'TEXTILES'])],
      ['CHEMICAL_PRECURSORS', new Set(['FOOD_PRODUCTION'])],
      ['PRECISION_MACHINERY', new Set(['TEXTILE_MANUFACTURING'])],
    ]);

    const suspiciousUses = suspiciousCombinations.get(commodity) || new Set();

    if (suspiciousUses.has(declaredEndUse)) {
      return {
        category: 'SUSPICIOUS_END_USE_STATEMENT',
        severity: 'HIGH',
        riskScore: 80,
        riskIndicators: [
          `Commodity: ${commodity}`,
          `Declared use: ${declaredEndUse}`,
          `Importer profile: ${importerProfile}`,
          'Mismatch between commodity and declared end-use',
        ],
        recommendation: 'Request detailed end-use certification',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Tracks re-export patterns of dual-use items
   */
  public detectDualUseReExportPatterns(
    transactions: TradeTransaction[],
    dualUseCommodities: Set<string>,
  ): RiskFlag | null {
    const reexports = transactions.filter((t) => dualUseCommodities.has(t.commodity));

    if (reexports.length > transactions.length * 0.3) {
      return {
        category: 'DUAL_USE_REEXPORT_PATTERN',
        severity: 'HIGH',
        riskScore: Math.min((reexports.length / transactions.length) * 100, 100),
        riskIndicators: [
          `${reexports.length} dual-use commodity re-export transactions`,
          'Pattern suggests potential transshipment of controlled goods',
        ],
        recommendation: 'Conduct enhanced due diligence on ultimate consignee',
        timestamp: new Date(),
      };
    }

    return null;
  }

  // ============================================================================
  // 9. HTSUS CODE ANALYSIS (3 functions)
  // ============================================================================

  /**
   * Detects misclassification of commodities using HTSUS codes
   */
  public detectHtsusCodeMisclassification(
    declaredHtsCode: string,
    declaredCommodity: string,
    validCodesForCommodity: Set<string>,
  ): RiskFlag | null {
    if (!validCodesForCommodity.has(declaredHtsCode)) {
      return {
        category: 'HTSUS_CODE_MISCLASSIFICATION',
        severity: 'HIGH',
        riskScore: 85,
        riskIndicators: [
          `Commodity: ${declaredCommodity}`,
          `HTSUS Code: ${declaredHtsCode}`,
          'Code does not match commodity classification',
          'Possible tariff evasion or value concealment',
        ],
        recommendation: 'Request tariff classification justification',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Identifies tariff arbitrage through code switching
   */
  public detectTariffArbitrageCodeSwitching(
    transactions: TradeTransaction[],
    commodity: string,
  ): RiskFlag | null {
    const codes = new Set(
      transactions
        .filter((t) => t.commodity === commodity)
        .map((t) => t.htsCode),
    );

    if (codes.size > 2) {
      return {
        category: 'TARIFF_ARBITRAGE_CODE_SWITCHING',
        severity: 'MEDIUM',
        riskScore: 70,
        riskIndicators: [
          `Commodity: ${commodity}`,
          `${codes.size} different HTSUS codes used`,
          'Multiple codes for single commodity suggests tariff optimization',
        ],
        recommendation: 'Verify tariff classification consistency',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Flags suspicious origin declarations for tariff preference claims
   */
  public validateOriginDeclarationForTariffPreference(
    declaredOrigin: string,
    productionCountries: string[],
    freeTradeAgreements: Set<string>,
  ): RiskFlag | null {
    if (!productionCountries.includes(declaredOrigin)) {
      return {
        category: 'SUSPICIOUS_ORIGIN_DECLARATION',
        severity: 'HIGH',
        riskScore: 85,
        riskIndicators: [
          `Declared origin: ${declaredOrigin}`,
          `Actual production: ${productionCountries.join(', ')}`,
          'Possible tariff preference fraud',
        ],
        recommendation: 'Request origin certification and audit trail',
        timestamp: new Date(),
      };
    }

    return null;
  }

  // ============================================================================
  // 10. COUNTERPARTY VERIFICATION (3 functions)
  // ============================================================================

  /**
   * Performs enhanced due diligence on counterparties
   */
  public conductCounterpartyDueDiligence(
    counterpartyId: string,
    sanctionsDatabase: Map<string, boolean>,
    pepsDatabase: Map<string, boolean>,
    previousViolations: number,
  ): CounterpartyProfile {
    return {
      entityId: counterpartyId,
      entityName: counterpartyId,
      sanctionsStatus: sanctionsDatabase.get(counterpartyId) || false,
      pepsStatus: pepsDatabase.get(counterpartyId) || false,
      historicalCompliance: Math.max(0, 100 - previousViolations * 10),
      riskRating: previousViolations > 2 ? 'HIGH' : previousViolations > 0 ? 'MEDIUM' : 'LOW',
      previousViolations,
    };
  }

  /**
   * Detects sudden new counterparties replacing established ones
   */
  public detectCounterpartySubstitution(
    previousCounterparties: Set<string>,
    currentCounterparties: Set<string>,
    replacementThreshold: number = 0.5,
  ): RiskFlag | null {
    const newParties = Array.from(currentCounterparties).filter(
      (cp) => !previousCounterparties.has(cp),
    );
    const replacementRatio = newParties.length / currentCounterparties.size;

    if (replacementRatio > replacementThreshold) {
      return {
        category: 'COUNTERPARTY_SUBSTITUTION',
        severity: replacementRatio > 0.8 ? 'CRITICAL' : 'HIGH',
        riskScore: Math.min(replacementRatio * 100, 100),
        riskIndicators: [
          `${newParties.length} new counterparties replace established ones`,
          `Replacement ratio: ${(replacementRatio * 100).toFixed(1)}%`,
          'Indicates possible counterparty shopping or relationship laundering',
        ],
        recommendation: 'Conduct enhanced due diligence on all new counterparties',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Identifies counterparties with weak compliance controls
   */
  public detectWeakComplianceCounterparties(
    counterpartyProfiles: CounterpartyProfile[],
    complianceScoreThreshold: number = 40,
  ): RiskFlag | null {
    const weakEntities = counterpartyProfiles.filter(
      (p) => p.historicalCompliance < complianceScoreThreshold,
    );

    if (weakEntities.length > 0) {
      return {
        category: 'WEAK_COMPLIANCE_COUNTERPARTIES',
        severity: weakEntities.length > 2 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min((weakEntities.length / counterpartyProfiles.length) * 100, 100),
        riskIndicators: [
          `${weakEntities.length} counterparties with weak compliance (score <${complianceScoreThreshold})`,
          'Entities: ' + weakEntities.map((e) => e.entityName).join(', '),
        ],
        recommendation: 'Terminate relationships with weak compliance entities',
        timestamp: new Date(),
      };
    }

    return null;
  }

  // ============================================================================
  // 11. TRADE FINANCE RED FLAGS (3 functions)
  // ============================================================================

  /**
   * Detects unusual payment methods and terms
   */
  public detectUnusualPaymentTerms(
    paymentMethod: string,
    paymentTerms: string,
    commodityValue: number,
  ): RiskFlag | null {
    const suspiciousPaymentMethods = new Set([
      'HAWALA',
      'CASH',
      'CRYPTOCURRENCY',
      'PREPAID_CARDS',
    ]);

    if (suspiciousPaymentMethods.has(paymentMethod.toUpperCase())) {
      return {
        category: 'UNUSUAL_PAYMENT_TERMS',
        severity: paymentMethod === 'HAWALA' ? 'CRITICAL' : 'HIGH',
        riskScore: 90,
        riskIndicators: [
          `Payment method: ${paymentMethod}`,
          `Transaction value: $${commodityValue}`,
          'High-risk payment method used',
        ],
        recommendation: 'Block transaction and file SAR',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Identifies advance payment requests (funding layering indicator)
   */
  public detectAdvancePaymentRequests(
    paymentTerms: string,
    paymentPercentage: number,
    transactionValue: number,
  ): RiskFlag | null {
    if (paymentPercentage > 50 && paymentTerms.includes('ADVANCE')) {
      return {
        category: 'ADVANCE_PAYMENT_REQUEST',
        severity: paymentPercentage > 75 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min(paymentPercentage, 100),
        riskIndicators: [
          `${paymentPercentage}% advance payment requested`,
          `Transaction value: $${transactionValue}`,
          'Unusual financing arrangement',
        ],
        recommendation: 'Verify legitimate financing arrangement',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Monitors for patterns indicating over-reliance on trade finance
   */
  public detectExcessiveTradeFinanceDependence(
    transactions: TradeTransaction[],
    lcBackedThreshold: number = 0.7,
  ): RiskFlag | null {
    const lcBackedTransactions = transactions.filter((t) => t.lcNumber).length;
    const dependenceRatio = lcBackedTransactions / transactions.length;

    if (dependenceRatio > lcBackedThreshold) {
      return {
        category: 'EXCESSIVE_TRADE_FINANCE_DEPENDENCE',
        severity: dependenceRatio > 0.9 ? 'MEDIUM' : 'LOW',
        riskScore: Math.min(dependenceRatio * 100, 100),
        riskIndicators: [
          `${(dependenceRatio * 100).toFixed(1)}% of transactions LC-backed`,
          'High reliance on trade finance mechanisms',
        ],
        recommendation: 'Monitor for cyclical patterns in trade finance usage',
        timestamp: new Date(),
      };
    }

    return null;
  }

  // ============================================================================
  // 12. LETTER OF CREDIT SCRUTINY (3 functions)
  // ============================================================================

  /**
   * Validates letter of credit consistency with trade documents
   */
  public validateLetterOfCreditConsistency(
    lcAmount: number,
    invoiceAmount: number,
    lcTerms: string,
  ): RiskFlag | null {
    const variance = Math.abs(lcAmount - invoiceAmount) / invoiceAmount;

    if (variance > 0.05) {
      return {
        category: 'LC_AMOUNT_DISCREPANCY',
        severity: variance > 0.15 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min(variance * 100, 100),
        riskIndicators: [
          `LC amount: $${lcAmount}, Invoice: $${invoiceAmount}`,
          `Variance: ${(variance * 100).toFixed(2)}%`,
          'L/C does not match invoice amount',
        ],
        recommendation: 'Request L/C amendment or invoice clarification',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Detects LC discrepancies and amendments (fraud indicator)
   */
  public detectLcDiscrepanciesAndAmendments(
    lcAmendmentCount: number,
    discrepancyCount: number,
  ): RiskFlag | null {
    if (lcAmendmentCount > 3 || discrepancyCount > 2) {
      return {
        category: 'LC_DISCREPANCIES_AND_AMENDMENTS',
        severity: lcAmendmentCount > 5 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min((lcAmendmentCount + discrepancyCount) * 15, 100),
        riskIndicators: [
          `${lcAmendmentCount} amendments to L/C`,
          `${discrepancyCount} discrepancies reported`,
          'Multiple corrections suggest weak documentation controls',
        ],
        recommendation: 'Enhanced review of all transaction documents',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Validates LC issuing bank and conditions
   */
  public validateLetterOfCreditIssuer(
    issuingBankCountry: string,
    applicantCountry: string,
    lcConditions: string[],
    highRiskCountries: Set<string>,
  ): RiskFlag | null {
    if (highRiskCountries.has(issuingBankCountry)) {
      return {
        category: 'HIGH_RISK_LC_ISSUER',
        severity: highRiskCountries.has(applicantCountry) ? 'CRITICAL' : 'HIGH',
        riskScore: 85,
        riskIndicators: [
          `L/C issued by: ${issuingBankCountry}`,
          'Issued from high-risk jurisdiction',
        ],
        recommendation: 'Enhanced due diligence on L/C authenticity',
        timestamp: new Date(),
      };
    }

    return null;
  }

  // ============================================================================
  // 13. BILL OF LADING VALIDATION (3 functions)
  // ============================================================================

  /**
   * Validates bill of lading against shipment records
   */
  public validateBillOfLadingAuthenticity(
    bolNumber: string,
    issuer: string,
    shipmentDate: Date,
    carrierDatabase: Map<string, string>,
  ): RiskFlag | null {
    const validIssuer = carrierDatabase.get(bolNumber);

    if (validIssuer && validIssuer !== issuer) {
      return {
        category: 'BOL_AUTHENTICITY_ISSUE',
        severity: 'HIGH',
        riskScore: 90,
        riskIndicators: [
          `BOL #: ${bolNumber}`,
          `Claimed issuer: ${issuer}, Registered: ${validIssuer}`,
          'B/L appears fraudulent or forged',
        ],
        recommendation: 'Block transaction and contact carrier for verification',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Detects duplicate or reused bill of lading numbers
   */
  public detectDuplicateBillOfLading(transactions: TradeTransaction[]): RiskFlag | null {
    const bolFrequency = new Map<string, number>();
    transactions.forEach((t) => {
      if (t.bolNumber) {
        bolFrequency.set(t.bolNumber, (bolFrequency.get(t.bolNumber) || 0) + 1);
      }
    });

    const duplicates = Array.from(bolFrequency.entries()).filter(([_, count]) => count > 1);

    if (duplicates.length > 0) {
      return {
        category: 'DUPLICATE_BILL_OF_LADING',
        severity: 'CRITICAL',
        riskScore: Math.min(duplicates.length * 30, 100),
        riskIndicators: [
          `${duplicates.length} BOL numbers used multiple times`,
          'Indicates BOL fraud or system manipulation',
        ],
        recommendation: 'File SAR - BOL fraud suspected',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Validates BOL terms and conditions match trade agreement
   */
  public validateBolTermsConsistency(
    bolTerms: string,
    contractTerms: string,
    shipmentTerms: string,
  ): RiskFlag | null {
    // Simple term matching (in practice would be more sophisticated)
    const termsMatch =
      bolTerms.toLowerCase().includes(contractTerms.toLowerCase().substring(0, 5)) &&
      bolTerms.toLowerCase().includes(shipmentTerms.toLowerCase().substring(0, 5));

    if (!termsMatch) {
      return {
        category: 'BOL_TERMS_INCONSISTENCY',
        severity: 'MEDIUM',
        riskScore: 70,
        riskIndicators: [
          'B/L terms deviate from contract and shipment terms',
          'Document inconsistency detected',
        ],
        recommendation: 'Request clarification on B/L conditions',
        timestamp: new Date(),
      };
    }

    return null;
  }

  // ============================================================================
  // 14. VALUE TRANSFER SCHEMES (3 functions)
  // ============================================================================

  /**
   * Identifies possible trade-based value transfer mechanisms
   */
  public detectValueTransferSchemes(
    invoiceAmount: number,
    marketPrice: number,
    quantity: number,
    paymentTerms: string,
  ): RiskFlag | null {
    const invoicePrice = invoiceAmount / quantity;
    const deviation = Math.abs(invoicePrice - marketPrice) / marketPrice;

    // Combination of price deviation + unusual payment terms = high risk
    if (deviation > 0.20) {
      const suspiciousTerms = ['PREPAYMENT', 'ADVANCE', 'ESCROW'].some((term) =>
        paymentTerms.includes(term),
      );

      if (suspiciousTerms) {
        return {
          category: 'VALUE_TRANSFER_SCHEME',
          severity: 'HIGH',
          riskScore: 85,
          riskIndicators: [
            `Price deviation: ${(deviation * 100).toFixed(1)}%`,
            `Payment terms: ${paymentTerms}`,
            'Combination indicates possible value layering',
          ],
          recommendation: 'Investigate beneficial ownership and value justification',
          timestamp: new Date(),
        };
      }
    }

    return null;
  }

  /**
   * Detects over-insurance patterns (value overstatement)
   */
  public detectOverInsurancePatterns(
    commodityValue: number,
    insuranceAmount: number,
    commodityType: string,
  ): RiskFlag | null {
    const overInsuranceRatio = insuranceAmount / commodityValue;

    if (overInsuranceRatio > 1.3) {
      return {
        category: 'OVER_INSURANCE_PATTERN',
        severity: overInsuranceRatio > 2.0 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min(overInsuranceRatio * 50, 100),
        riskIndicators: [
          `Commodity value: $${commodityValue}, Insured for: $${insuranceAmount}`,
          `Over-insurance ratio: ${overInsuranceRatio.toFixed(2)}x`,
          'Indicates possible value inflation',
        ],
        recommendation: 'Request insurance policy and loss history',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Identifies manipulation through refund/credit mechanisms
   */
  public detectRefundManipulation(
    originalValue: number,
    refundedValue: number,
    refundReason: string,
  ): RiskFlag | null {
    const refundRatio = refundedValue / originalValue;

    if (refundRatio > 0.15 && ['PARTIAL_DELIVERY', 'QUALITY_ISSUES'].includes(refundReason)) {
      return {
        category: 'REFUND_MANIPULATION',
        severity: refundRatio > 0.5 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min(refundRatio * 100, 100),
        riskIndicators: [
          `Original: $${originalValue}, Refund: $${refundedValue}`,
          `Reason: ${refundReason}`,
          'Possible post-transaction value adjustment scheme',
        ],
        recommendation: 'Request supporting documentation for refund',
        timestamp: new Date(),
      };
    }

    return null;
  }

  // ============================================================================
  // 15. CROSS-BORDER TRADE PATTERNS (3 functions)
  // ============================================================================

  /**
   * Analyzes entity trade pattern for anomalies
   */
  public analyzeEntityTradePatterns(
    transactions: TradeTransaction[],
    entityId: string,
  ): TradePatternMetrics {
    const values = transactions.map((t) => t.invoiceAmount);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    const countries = new Set(transactions.map((t) => `${t.originCountry}-${t.destinationCountry}`));

    return {
      entityId,
      averageInvoiceAmount: mean,
      standardDeviation: stdDev,
      anomalousTransactions: transactions.filter(
        (t) => Math.abs(t.invoiceAmount - mean) > stdDev * 2,
      ).length,
      frequencyPattern: `${transactions.length} transactions`,
      geographicDiversity: countries.size / transactions.length,
    };
  }

  /**
   * Detects sudden spikes in trade activity
   */
  public detectTradeActivitySpikes(
    transactions: TradeTransaction[],
    windowDays: number = 30,
  ): RiskFlag | null {
    if (transactions.length < 2) return null;

    const avgValue = transactions.reduce((sum, t) => sum + t.invoiceAmount, 0) / transactions.length;
    const recentAvg =
      transactions
        .slice(-Math.ceil(transactions.length * 0.2))
        .reduce((sum, t) => sum + t.invoiceAmount, 0) / Math.ceil(transactions.length * 0.2);
    const spikeRatio = recentAvg / avgValue;

    if (spikeRatio > 2.0) {
      return {
        category: 'TRADE_ACTIVITY_SPIKE',
        severity: spikeRatio > 4.0 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min((spikeRatio - 1) * 30, 100),
        riskIndicators: [
          `Recent activity ${spikeRatio.toFixed(1)}x higher than historical average`,
          `Historical avg: $${avgValue.toFixed(0)}, Recent avg: $${recentAvg.toFixed(0)}`,
          'Sudden volume increase may indicate rapid value movement',
        ],
        recommendation: 'Investigate source of funds and justification for activity spike',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Identifies suspicious geographic patterns in trade (beneficial ownership masking)
   */
  public detectGeographicTradeAnomaly(
    transactions: TradeTransaction[],
    entityHQCountry: string,
  ): RiskFlag | null {
    const tradeCountries = new Set<string>();
    transactions.forEach((t) => {
      tradeCountries.add(t.originCountry);
      tradeCountries.add(t.destinationCountry);
    });

    // Remove HQ country from analysis
    tradeCountries.delete(entityHQCountry);

    // Check for patterns suggesting beneficial ownership masking
    const geographicDistance = tradeCountries.size;
    const avgTransactionValue = transactions.reduce((sum, t) => sum + t.invoiceAmount, 0) / transactions.length;

    if (geographicDistance > 10 && avgTransactionValue < 100000) {
      return {
        category: 'GEOGRAPHIC_TRADE_ANOMALY',
        severity: geographicDistance > 15 ? 'HIGH' : 'MEDIUM',
        riskScore: Math.min((geographicDistance / 20) * 100, 100),
        riskIndicators: [
          `Trading with ${geographicDistance} different countries`,
          `Average transaction: $${avgTransactionValue.toFixed(0)}`,
          'Wide geographic footprint with small transaction sizes suggests beneficial ownership obfuscation',
        ],
        recommendation: 'Investigate ultimate beneficial owners and justification for wide geographic network',
        timestamp: new Date(),
      };
    }

    return null;
  }
}

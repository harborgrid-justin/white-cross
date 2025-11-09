/**
 * LOC: WC-ORD-TRDEXP-001
 * File: /reuse/order/trade-compliance-export-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Order processing services
 *   - International shipping modules
 *   - Customs documentation services
 */
/**
 * File: /reuse/order/trade-compliance-export-kit.ts
 * Locator: WC-ORD-TRDEXP-001
 * Purpose: Trade Compliance & Export Controls - Export regulations, sanctions, documentation
 *
 * Upstream: Independent utility module for international trade compliance
 * Downstream: ../backend/*, order services, shipping modules, customs integration
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: 35 utility functions for export control classification, sanctions screening, customs documentation
 *
 * LLM Context: Comprehensive trade compliance utilities for implementing production-ready international
 * trade operations in White Cross system. Provides export control classification (ECCN, Schedule B),
 * denied party screening, sanctions compliance (OFAC, EU, UN), export license management, customs documentation,
 * harmonized tariff codes (HTS), country of origin tracking, certificate of origin, commercial invoice generation,
 * AES/EEI export declarations, Incoterms handling, and compliance reporting. Essential for secure, compliant
 * international order fulfillment.
 */
interface ExportControlClassification {
    eccn: string | null;
    scheduleB: string | null;
    usml: boolean;
    ear99: boolean;
    dualUse: boolean;
    licenseRequired: boolean;
    licensingAuthority: 'BIS' | 'DDTC' | 'OFAC' | 'DOE' | 'NRC' | 'None';
    classification: 'EAR' | 'ITAR' | 'EAR99' | 'OTHER';
    controlReasons: string[];
    determinationDate: Date;
}
interface DeniedParty {
    name: string;
    aliases: string[];
    addresses: string[];
    list: 'SDN' | 'DPL' | 'UVL' | 'EL' | 'FSE' | 'ISN' | 'PLC' | 'CAP' | 'DTC' | 'SSI';
    country: string;
    programs: string[];
    remarks: string;
    effectiveDate: Date;
    expirationDate?: Date;
}
interface ScreeningResult {
    isMatch: boolean;
    matchScore: number;
    matchedParties: DeniedParty[];
    listsCovered: string[];
    screeningDate: Date;
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'CLEAR';
    requiresManualReview: boolean;
    complianceNotes: string[];
}
interface SanctionsCheck {
    country: string;
    sanctionedCountry: boolean;
    comprehensiveSanctions: boolean;
    sectorialSanctions: string[];
    embargoTypes: string[];
    restrictedIndustries: string[];
    allowedWithLicense: boolean;
    sanctioningAuthorities: string[];
    effectiveDate: Date;
}
interface HarmonizedTariffCode {
    htsCode: string;
    hts6: string;
    hts8: string;
    hts10: string;
    description: string;
    dutyRate: string;
    preferentialRate?: string;
    specialPrograms: string[];
    quotaCategory?: string;
    statisticalSuffix: string;
    unit: string;
}
interface CountryOfOrigin {
    country: string;
    countryCode: string;
    determineMethod: 'MANUFACTURED' | 'SUBSTANTIAL_TRANSFORMATION' | 'ASSEMBLY' | 'PREFERENTIAL_RULES';
    freeTradeAgreement?: string;
    manufacturingLocations: string[];
    componentOrigins: ComponentOrigin[];
    tariffPreference: boolean;
    certificateRequired: boolean;
    determinationDate: Date;
}
interface ComponentOrigin {
    component: string;
    originCountry: string;
    valuePercentage: number;
    isOriginating: boolean;
}
interface CertificateOfOrigin {
    certificateNumber: string;
    certificateType: 'GENERIC' | 'GSP' | 'NAFTA' | 'USMCA' | 'FTA' | 'EUR1' | 'ATR';
    issuer: string;
    issueDate: Date;
    expirationDate: Date;
    exporterName: string;
    exporterAddress: string;
    consigneeName: string;
    consigneeAddress: string;
    originCountry: string;
    destinationCountry: string;
    items: OriginItem[];
    criteriaCode?: string;
    preferentialTreatment: boolean;
    signature: string;
    certificationStatement: string;
}
interface OriginItem {
    itemNumber: number;
    description: string;
    htsCode: string;
    quantity: number;
    unit: string;
    originCriteria: string;
}
interface CommercialInvoice {
    invoiceNumber: string;
    invoiceDate: Date;
    sellerName: string;
    sellerAddress: string;
    sellerTaxId: string;
    buyerName: string;
    buyerAddress: string;
    buyerTaxId: string;
    currency: string;
    incoterms: string;
    paymentTerms: string;
    items: InvoiceItem[];
    subtotal: number;
    shipping: number;
    insurance: number;
    otherCharges: number;
    totalValue: number;
    declarationStatement: string;
    signatory: string;
    signatureDate: Date;
}
interface InvoiceItem {
    itemNumber: number;
    description: string;
    htsCode: string;
    countryOfOrigin: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    weight: number;
    weightUnit: string;
}
interface AESDeclaration {
    itnNumber: string;
    filingOption: 'PREDEPARTURE' | 'POSTDEPARTURE';
    transportMode: 'AIR' | 'OCEAN' | 'TRUCK' | 'RAIL' | 'MAIL';
    usppi: string;
    usppiEin: string;
    ultimateConsignee: string;
    intermediateConsignee?: string;
    countryOfDestination: string;
    portOfExport: string;
    portOfUnlading: string;
    dateOfExportation: Date;
    conveyanceName: string;
    shipmentValue: number;
    items: AESItem[];
    eccnLicenseInfo: string[];
    routedTransaction: boolean;
    hazmat: boolean;
    status: 'DRAFT' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'AMENDED';
}
interface AESItem {
    lineNumber: number;
    scheduleB: string;
    description: string;
    quantity: number;
    unit: string;
    value: number;
    eccn?: string;
    licenseNumber?: string;
    licenseExceptionCode?: string;
    exportInformationCode?: string;
}
interface IncotermsRule {
    rule: 'EXW' | 'FCA' | 'CPT' | 'CIP' | 'DAP' | 'DPU' | 'DDP' | 'FAS' | 'FOB' | 'CFR' | 'CIF';
    version: '2020' | '2010';
    mode: 'ANY' | 'SEA_INLAND_WATERWAY';
    transferOfRisk: string;
    transferOfCosts: string;
    sellerResponsibilities: string[];
    buyerResponsibilities: string[];
    insuranceRequired: boolean;
    exportClearance: 'SELLER' | 'BUYER';
    importClearance: 'SELLER' | 'BUYER';
    namedPlace: string;
}
interface ComplianceReport {
    reportId: string;
    reportType: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'AD_HOC';
    reportPeriod: {
        start: Date;
        end: Date;
    };
    totalExports: number;
    totalValue: number;
    currency: string;
    exportsByDestination: Record<string, number>;
    exportsByECCN: Record<string, number>;
    licensedExports: number;
    licensedValue: number;
    screeningResults: {
        total: number;
        matches: number;
        cleared: number;
    };
    violations: ComplianceViolation[];
    generatedDate: Date;
    generatedBy: string;
}
interface ComplianceViolation {
    violationId: string;
    violationType: 'SCREENING' | 'CLASSIFICATION' | 'LICENSING' | 'DOCUMENTATION' | 'SANCTIONS';
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    affectedShipments: string[];
    discoveryDate: Date;
    remediation: string;
    status: 'OPEN' | 'INVESTIGATING' | 'REMEDIATED' | 'CLOSED';
}
/**
 * Classifies a product for export control purposes (ECCN determination).
 *
 * @swagger
 * @operation classifyProductForExport
 * @tags Export Controls
 *
 * @param {string} productId - Product identifier
 * @param {string} description - Product description
 * @param {string[]} technicalSpecs - Technical specifications
 * @returns {ExportControlClassification} Export control classification
 *
 * @example
 * ```typescript
 * const classification = classifyProductForExport(
 *   'PROD-12345',
 *   'High-performance computer processor',
 *   ['Clock speed: 4.5 GHz', 'Cores: 16', 'Architecture: x86-64']
 * );
 * // Result: { eccn: '4A003', ear99: false, licenseRequired: true, ... }
 * ```
 */
export declare const classifyProductForExport: (productId: string, description: string, technicalSpecs: string[]) => ExportControlClassification;
/**
 * Determines Schedule B number for export statistics reporting.
 *
 * @swagger
 * @operation determineScheduleBNumber
 * @tags Export Controls
 *
 * @param {string} htsCode - Harmonized Tariff Schedule code
 * @param {string} productCategory - Product category
 * @returns {{ scheduleB: string; description: string; unit: string }} Schedule B classification
 *
 * @example
 * ```typescript
 * const scheduleB = determineScheduleBNumber('8471.50.0150', 'Computer processors');
 * // Result: { scheduleB: '8471.50.0150', description: 'Processing units', unit: 'No.' }
 * ```
 */
export declare const determineScheduleBNumber: (htsCode: string, productCategory: string) => {
    scheduleB: string;
    description: string;
    unit: string;
};
/**
 * Validates ECCN format and determines licensing requirements.
 *
 * @swagger
 * @operation validateECCN
 * @tags Export Controls
 *
 * @param {string} eccn - Export Control Classification Number
 * @param {string} destinationCountry - Destination country code
 * @returns {{ valid: boolean; licenseRequired: boolean; reasons: string[] }} ECCN validation result
 *
 * @example
 * ```typescript
 * const validation = validateECCN('5A002', 'RU');
 * // Result: { valid: true, licenseRequired: true, reasons: ['Country Group D:1'] }
 * ```
 */
export declare const validateECCN: (eccn: string, destinationCountry: string) => {
    valid: boolean;
    licenseRequired: boolean;
    reasons: string[];
};
/**
 * Determines if product falls under ITAR (International Traffic in Arms Regulations).
 *
 * @swagger
 * @operation checkITARStatus
 * @tags Export Controls
 *
 * @param {string} productId - Product identifier
 * @param {string} category - Product category
 * @returns {{ isITAR: boolean; usmlCategory: string | null; ddtcRequired: boolean }} ITAR status
 *
 * @example
 * ```typescript
 * const itarStatus = checkITARStatus('PROD-MIL-001', 'Defense Articles');
 * // Result: { isITAR: true, usmlCategory: 'VIII', ddtcRequired: true }
 * ```
 */
export declare const checkITARStatus: (productId: string, category: string) => {
    isITAR: boolean;
    usmlCategory: string | null;
    ddtcRequired: boolean;
};
/**
 * Generates export control documentation package.
 *
 * @swagger
 * @operation generateExportControlDoc
 * @tags Export Controls
 *
 * @param {ExportControlClassification} classification - Export classification
 * @param {string} destinationCountry - Destination country
 * @returns {{ documents: string[]; declarationText: string }} Control documentation
 *
 * @example
 * ```typescript
 * const docs = generateExportControlDoc(classification, 'GB');
 * // Result: { documents: ['ECCN_CERT', 'EAR_STATEMENT'], declarationText: '...' }
 * ```
 */
export declare const generateExportControlDoc: (classification: ExportControlClassification, destinationCountry: string) => {
    documents: string[];
    declarationText: string;
};
/**
 * Screens entity against denied parties lists (OFAC SDN, BIS DPL, etc.).
 *
 * @swagger
 * @operation screenDeniedParties
 * @tags Sanctions Screening
 *
 * @param {string} entityName - Entity name to screen
 * @param {string} country - Entity country
 * @param {string[]} [aliases] - Known aliases
 * @returns {Promise<ScreeningResult>} Screening result
 *
 * @example
 * ```typescript
 * const result = await screenDeniedParties('Acme Corp', 'US', ['Acme Inc']);
 * // Result: { isMatch: false, matchScore: 0, riskLevel: 'CLEAR', ... }
 * ```
 */
export declare const screenDeniedParties: (entityName: string, country: string, aliases?: string[]) => Promise<ScreeningResult>;
/**
 * Performs fuzzy matching for denied party screening.
 *
 * @swagger
 * @operation fuzzyMatchEntity
 * @tags Sanctions Screening
 *
 * @param {string} searchName - Name to search
 * @param {string} listName - Name from denied party list
 * @returns {number} Match score (0-1)
 *
 * @example
 * ```typescript
 * const score = fuzzyMatchEntity('Acme Corporation', 'ACME Corp.');
 * // Result: 0.87
 * ```
 */
export declare const fuzzyMatchEntity: (searchName: string, listName: string) => number;
/**
 * Checks specific OFAC SDN (Specially Designated Nationals) list.
 *
 * @swagger
 * @operation checkOFACSDN
 * @tags Sanctions Screening
 *
 * @param {string} entityName - Entity name
 * @param {string} [address] - Entity address
 * @returns {Promise<{ isSDN: boolean; programs: string[]; remarks: string }>} SDN check result
 *
 * @example
 * ```typescript
 * const result = await checkOFACSDN('Test Entity', '123 Main St, City');
 * // Result: { isSDN: false, programs: [], remarks: '' }
 * ```
 */
export declare const checkOFACSDN: (entityName: string, address?: string) => Promise<{
    isSDN: boolean;
    programs: string[];
    remarks: string;
}>;
/**
 * Screens against BIS Entity List (export restrictions).
 *
 * @swagger
 * @operation screenBISEntityList
 * @tags Sanctions Screening
 *
 * @param {string} entityName - Entity name
 * @param {string} country - Entity country
 * @returns {{ onList: boolean; restrictions: string[]; federalRegisterCitation: string }} Entity List result
 *
 * @example
 * ```typescript
 * const result = screenBISEntityList('Technology Corp', 'CN');
 * // Result: { onList: false, restrictions: [], federalRegisterCitation: '' }
 * ```
 */
export declare const screenBISEntityList: (entityName: string, country: string) => {
    onList: boolean;
    restrictions: string[];
    federalRegisterCitation: string;
};
/**
 * Generates comprehensive screening audit trail.
 *
 * @swagger
 * @operation generateScreeningAudit
 * @tags Sanctions Screening
 *
 * @param {ScreeningResult} result - Screening result
 * @param {string} transactionId - Transaction identifier
 * @returns {{ auditId: string; timestamp: Date; decision: string; reviewer: string }} Audit record
 *
 * @example
 * ```typescript
 * const audit = generateScreeningAudit(screeningResult, 'TXN-12345');
 * // Result: { auditId: 'AUD-...', timestamp: Date, decision: 'CLEARED', ... }
 * ```
 */
export declare const generateScreeningAudit: (result: ScreeningResult, transactionId: string) => {
    auditId: string;
    timestamp: Date;
    decision: string;
    reviewer: string;
};
/**
 * Checks if destination country is subject to sanctions.
 *
 * @swagger
 * @operation checkCountrySanctions
 * @tags Sanctions Compliance
 *
 * @param {string} countryCode - ISO country code
 * @returns {SanctionsCheck} Sanctions status
 *
 * @example
 * ```typescript
 * const sanctions = checkCountrySanctions('IR');
 * // Result: { country: 'IR', sanctionedCountry: true, comprehensiveSanctions: true, ... }
 * ```
 */
export declare const checkCountrySanctions: (countryCode: string) => SanctionsCheck;
/**
 * Validates transaction against OFAC regulations.
 *
 * @swagger
 * @operation validateOFACCompliance
 * @tags Sanctions Compliance
 *
 * @param {string} destination - Destination country
 * @param {string} entityName - Counterparty name
 * @param {number} value - Transaction value
 * @returns {Promise<{ compliant: boolean; violations: string[]; requiresLicense: boolean }>} OFAC validation
 *
 * @example
 * ```typescript
 * const validation = await validateOFACCompliance('GB', 'UK Corp', 50000);
 * // Result: { compliant: true, violations: [], requiresLicense: false }
 * ```
 */
export declare const validateOFACCompliance: (destination: string, entityName: string, value: number) => Promise<{
    compliant: boolean;
    violations: string[];
    requiresLicense: boolean;
}>;
/**
 * Checks EU sanctions compliance.
 *
 * @swagger
 * @operation checkEUSanctions
 * @tags Sanctions Compliance
 *
 * @param {string} country - Destination country
 * @param {string} industry - Industry sector
 * @returns {{ sanctioned: boolean; regulations: string[]; exemptions: string[] }} EU sanctions status
 *
 * @example
 * ```typescript
 * const euCheck = checkEUSanctions('RU', 'Energy');
 * // Result: { sanctioned: true, regulations: ['EU 833/2014'], exemptions: [] }
 * ```
 */
export declare const checkEUSanctions: (country: string, industry: string) => {
    sanctioned: boolean;
    regulations: string[];
    exemptions: string[];
};
/**
 * Validates UN Security Council sanctions.
 *
 * @swagger
 * @operation validateUNSanctions
 * @tags Sanctions Compliance
 *
 * @param {string} country - Destination country
 * @returns {{ hasUNSanctions: boolean; resolutions: string[]; prohibitedGoods: string[] }} UN sanctions
 *
 * @example
 * ```typescript
 * const unCheck = validateUNSanctions('KP');
 * // Result: { hasUNSanctions: true, resolutions: ['UNSCR 2397'], prohibitedGoods: [...] }
 * ```
 */
export declare const validateUNSanctions: (country: string) => {
    hasUNSanctions: boolean;
    resolutions: string[];
    prohibitedGoods: string[];
};
/**
 * Generates comprehensive sanctions compliance report.
 *
 * @swagger
 * @operation generateSanctionsReport
 * @tags Sanctions Compliance
 *
 * @param {string} country - Destination country
 * @param {string} entity - Entity name
 * @returns {Promise<{ summary: string; details: any; recommendation: string }>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateSanctionsReport('CN', 'Tech Company');
 * // Result: { summary: '...', details: {...}, recommendation: 'PROCEED_WITH_CAUTION' }
 * ```
 */
export declare const generateSanctionsReport: (country: string, entity: string) => Promise<{
    summary: string;
    details: any;
    recommendation: string;
}>;
/**
 * Validates export license and checks remaining authorization.
 *
 * @swagger
 * @operation validateExportLicense
 * @tags Export Licensing
 *
 * @param {string} licenseNumber - License number
 * @param {number} shipmentValue - Shipment value
 * @param {string} destination - Destination country
 * @returns {{ valid: boolean; remainingValue: number; authorized: boolean; errors: string[] }} License validation
 *
 * @example
 * ```typescript
 * const validation = validateExportLicense('D123456', 25000, 'AE');
 * // Result: { valid: true, remainingValue: 75000, authorized: true, errors: [] }
 * ```
 */
export declare const validateExportLicense: (licenseNumber: string, shipmentValue: number, destination: string) => {
    valid: boolean;
    remainingValue: number;
    authorized: boolean;
    errors: string[];
};
/**
 * Determines if export license is required for transaction.
 *
 * @swagger
 * @operation requiresExportLicense
 * @tags Export Licensing
 *
 * @param {string} eccn - ECCN code
 * @param {string} destination - Destination country
 * @param {number} value - Transaction value
 * @returns {{ required: boolean; licenseType: string | null; authority: string | null; reason: string }} License requirement
 *
 * @example
 * ```typescript
 * const requirement = requiresExportLicense('5A002', 'CN', 10000);
 * // Result: { required: true, licenseType: 'BIS', authority: 'BIS', reason: '...' }
 * ```
 */
export declare const requiresExportLicense: (eccn: string, destination: string, value: number) => {
    required: boolean;
    licenseType: string | null;
    authority: string | null;
    reason: string;
};
/**
 * Generates license exception analysis (STA, CIV, TSU, etc.).
 *
 * @swagger
 * @operation analyzeLicenseExceptions
 * @tags Export Licensing
 *
 * @param {string} eccn - ECCN code
 * @param {string} destination - Destination country
 * @param {string} endUse - End use description
 * @returns {{ availableExceptions: string[]; recommended: string | null; restrictions: string[] }} Exception analysis
 *
 * @example
 * ```typescript
 * const exceptions = analyzeLicenseExceptions('5A002', 'GB', 'Commercial use');
 * // Result: { availableExceptions: ['STA', 'CIV'], recommended: 'STA', restrictions: [] }
 * ```
 */
export declare const analyzeLicenseExceptions: (eccn: string, destination: string, endUse: string) => {
    availableExceptions: string[];
    recommended: string | null;
    restrictions: string[];
};
/**
 * Generates commercial invoice for customs clearance.
 *
 * @swagger
 * @operation generateCommercialInvoice
 * @tags Customs Documentation
 *
 * @param {any} orderData - Order data
 * @param {string} incoterms - Incoterms rule
 * @returns {CommercialInvoice} Commercial invoice
 *
 * @example
 * ```typescript
 * const invoice = generateCommercialInvoice(orderData, 'DDP');
 * // Result: { invoiceNumber: 'INV-...', items: [...], totalValue: 5000, ... }
 * ```
 */
export declare const generateCommercialInvoice: (orderData: any, incoterms: string) => CommercialInvoice;
/**
 * Generates packing list for customs.
 *
 * @swagger
 * @operation generatePackingList
 * @tags Customs Documentation
 *
 * @param {any} shipmentData - Shipment data
 * @returns {{ packages: any[]; totalWeight: number; totalVolume: number }} Packing list
 *
 * @example
 * ```typescript
 * const packingList = generatePackingList(shipmentData);
 * // Result: { packages: [...], totalWeight: 150, totalVolume: 2.5 }
 * ```
 */
export declare const generatePackingList: (shipmentData: any) => {
    packages: any[];
    totalWeight: number;
    totalVolume: number;
};
/**
 * Generates certificate of origin.
 *
 * @swagger
 * @operation generateCertificateOfOrigin
 * @tags Customs Documentation
 *
 * @param {any} shipmentData - Shipment data
 * @param {string} certificateType - Certificate type
 * @returns {CertificateOfOrigin} Certificate of origin
 *
 * @example
 * ```typescript
 * const certificate = generateCertificateOfOrigin(shipmentData, 'USMCA');
 * // Result: { certificateNumber: 'COO-...', originCountry: 'US', ... }
 * ```
 */
export declare const generateCertificateOfOrigin: (shipmentData: any, certificateType: "GENERIC" | "GSP" | "NAFTA" | "USMCA" | "FTA" | "EUR1" | "ATR") => CertificateOfOrigin;
/**
 * Validates customs documentation completeness.
 *
 * @swagger
 * @operation validateCustomsDocs
 * @tags Customs Documentation
 *
 * @param {string[]} providedDocs - List of provided documents
 * @param {string} destinationCountry - Destination country
 * @returns {{ complete: boolean; missingDocs: string[]; warnings: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateCustomsDocs(['COMMERCIAL_INVOICE', 'PACKING_LIST'], 'CA');
 * // Result: { complete: false, missingDocs: ['CERTIFICATE_OF_ORIGIN'], warnings: [] }
 * ```
 */
export declare const validateCustomsDocs: (providedDocs: string[], destinationCountry: string) => {
    complete: boolean;
    missingDocs: string[];
    warnings: string[];
};
/**
 * Calculates customs duties and taxes.
 *
 * @swagger
 * @operation calculateCustomsDuties
 * @tags Customs Documentation
 *
 * @param {string} htsCode - HTS code
 * @param {number} value - Declared value
 * @param {string} destinationCountry - Destination country
 * @returns {{ dutyRate: number; dutyAmount: number; vat: number; totalTaxes: number }} Duty calculation
 *
 * @example
 * ```typescript
 * const duties = calculateCustomsDuties('8471.50.0150', 10000, 'GB');
 * // Result: { dutyRate: 0.025, dutyAmount: 250, vat: 2050, totalTaxes: 2300 }
 * ```
 */
export declare const calculateCustomsDuties: (htsCode: string, value: number, destinationCountry: string) => {
    dutyRate: number;
    dutyAmount: number;
    vat: number;
    totalTaxes: number;
};
/**
 * Looks up HTS code by product description.
 *
 * @swagger
 * @operation lookupHTSCode
 * @tags Tariff Classification
 *
 * @param {string} productDescription - Product description
 * @param {string} [countryOfImport] - Import country (affects HTS classification)
 * @returns {HarmonizedTariffCode[]} Potential HTS codes
 *
 * @example
 * ```typescript
 * const codes = lookupHTSCode('Computer processor', 'US');
 * // Result: [{ htsCode: '8471.50.0150', description: '...', dutyRate: '0%', ... }]
 * ```
 */
export declare const lookupHTSCode: (productDescription: string, countryOfImport?: string) => HarmonizedTariffCode[];
/**
 * Validates HTS code format and structure.
 *
 * @swagger
 * @operation validateHTSCode
 * @tags Tariff Classification
 *
 * @param {string} htsCode - HTS code to validate
 * @returns {{ valid: boolean; chapter: string; heading: string; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateHTSCode('8471.50.0150');
 * // Result: { valid: true, chapter: '84', heading: '8471', errors: [] }
 * ```
 */
export declare const validateHTSCode: (htsCode: string) => {
    valid: boolean;
    chapter: string;
    heading: string;
    errors: string[];
};
/**
 * Determines preferential tariff treatment eligibility.
 *
 * @swagger
 * @operation checkPreferentialTariff
 * @tags Tariff Classification
 *
 * @param {string} htsCode - HTS code
 * @param {string} originCountry - Country of origin
 * @param {string} destinationCountry - Destination country
 * @returns {{ eligible: boolean; program: string | null; reducedRate: string; savings: number }} Preferential treatment
 *
 * @example
 * ```typescript
 * const preferential = checkPreferentialTariff('8471.50.0150', 'MX', 'US');
 * // Result: { eligible: true, program: 'USMCA', reducedRate: '0%', savings: 250 }
 * ```
 */
export declare const checkPreferentialTariff: (htsCode: string, originCountry: string, destinationCountry: string) => {
    eligible: boolean;
    program: string | null;
    reducedRate: string;
    savings: number;
};
/**
 * Determines country of origin based on substantial transformation.
 *
 * @swagger
 * @operation determineCountryOfOrigin
 * @tags Country of Origin
 *
 * @param {ComponentOrigin[]} components - Product components
 * @param {string} finalAssemblyCountry - Final assembly location
 * @returns {CountryOfOrigin} Country of origin determination
 *
 * @example
 * ```typescript
 * const origin = determineCountryOfOrigin(components, 'US');
 * // Result: { country: 'US', determineMethod: 'SUBSTANTIAL_TRANSFORMATION', ... }
 * ```
 */
export declare const determineCountryOfOrigin: (components: ComponentOrigin[], finalAssemblyCountry: string) => CountryOfOrigin;
/**
 * Validates country of origin marking compliance.
 *
 * @swagger
 * @operation validateOriginMarking
 * @tags Country of Origin
 *
 * @param {string} productType - Product type
 * @param {string} marking - Current marking
 * @param {string} originCountry - Country of origin
 * @returns {{ compliant: boolean; requiredMarking: string; issues: string[] }} Marking validation
 *
 * @example
 * ```typescript
 * const validation = validateOriginMarking('Electronics', 'Made in China', 'CN');
 * // Result: { compliant: true, requiredMarking: 'Made in China', issues: [] }
 * ```
 */
export declare const validateOriginMarking: (productType: string, marking: string, originCountry: string) => {
    compliant: boolean;
    requiredMarking: string;
    issues: string[];
};
/**
 * Parses and validates Incoterms rules.
 *
 * @swagger
 * @operation parseIncoterms
 * @tags Incoterms
 *
 * @param {string} incoterm - Incoterm code (e.g., 'DDP')
 * @param {string} namedPlace - Named place
 * @returns {IncotermsRule} Incoterms rule details
 *
 * @example
 * ```typescript
 * const rule = parseIncoterms('DDP', 'London, UK');
 * // Result: { rule: 'DDP', version: '2020', sellerResponsibilities: [...], ... }
 * ```
 */
export declare const parseIncoterms: (incoterm: "EXW" | "FCA" | "CPT" | "CIP" | "DAP" | "DPU" | "DDP" | "FAS" | "FOB" | "CFR" | "CIF", namedPlace: string) => IncotermsRule;
/**
 * Calculates cost allocation based on Incoterms.
 *
 * @swagger
 * @operation calculateIncotermsCosts
 * @tags Incoterms
 *
 * @param {string} incoterm - Incoterm code
 * @param {number} goodsValue - Value of goods
 * @param {number} freightCost - Freight cost
 * @param {number} insuranceCost - Insurance cost
 * @param {number} dutiesTaxes - Duties and taxes
 * @returns {{ sellerCost: number; buyerCost: number; breakdown: any }} Cost allocation
 *
 * @example
 * ```typescript
 * const costs = calculateIncotermsCosts('CIF', 10000, 500, 100, 1500);
 * // Result: { sellerCost: 10600, buyerCost: 1500, breakdown: {...} }
 * ```
 */
export declare const calculateIncotermsCosts: (incoterm: string, goodsValue: number, freightCost: number, insuranceCost: number, dutiesTaxes: number) => {
    sellerCost: number;
    buyerCost: number;
    breakdown: any;
};
/**
 * Generates Incoterms compliance documentation.
 *
 * @swagger
 * @operation generateIncotermsDoc
 * @tags Incoterms
 *
 * @param {IncotermsRule} rule - Incoterms rule
 * @returns {{ documentType: string; content: string; parties: any }} Incoterms documentation
 *
 * @example
 * ```typescript
 * const doc = generateIncotermsDoc(incotermsRule);
 * // Result: { documentType: 'INCOTERMS_NOTICE', content: '...', parties: {...} }
 * ```
 */
export declare const generateIncotermsDoc: (rule: IncotermsRule) => {
    documentType: string;
    content: string;
    parties: any;
};
/**
 * Generates AES (Automated Export System) electronic export information.
 *
 * @swagger
 * @operation generateAESDeclaration
 * @tags Export Documentation
 *
 * @param {any} shipmentData - Shipment data
 * @returns {AESDeclaration} AES/EEI declaration
 *
 * @example
 * ```typescript
 * const aes = generateAESDeclaration(shipmentData);
 * // Result: { itnNumber: 'ITN...', status: 'DRAFT', items: [...], ... }
 * ```
 */
export declare const generateAESDeclaration: (shipmentData: any) => AESDeclaration;
/**
 * Validates AES filing requirements and thresholds.
 *
 * @swagger
 * @operation validateAESRequirement
 * @tags Export Documentation
 *
 * @param {number} shipmentValue - Shipment value
 * @param {string} destination - Destination country
 * @param {string[]} scheduleBCodes - Schedule B codes
 * @returns {{ required: boolean; reason: string; exemptionCode: string | null }} AES requirement
 *
 * @example
 * ```typescript
 * const requirement = validateAESRequirement(2500, 'CA', ['8471.50.0150']);
 * // Result: { required: true, reason: 'Value exceeds $2,500', exemptionCode: null }
 * ```
 */
export declare const validateAESRequirement: (shipmentValue: number, destination: string, scheduleBCodes: string[]) => {
    required: boolean;
    reason: string;
    exemptionCode: string | null;
};
/**
 * Generates comprehensive trade compliance report.
 *
 * @swagger
 * @operation generateComplianceReport
 * @tags Compliance Reporting
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {any[]} exportTransactions - Export transactions
 * @returns {ComplianceReport} Compliance report
 *
 * @example
 * ```typescript
 * const report = generateComplianceReport(startDate, endDate, transactions);
 * // Result: { reportId: 'RPT-...', totalExports: 150, violations: [], ... }
 * ```
 */
export declare const generateComplianceReport: (startDate: Date, endDate: Date, exportTransactions: any[]) => ComplianceReport;
/**
 * Audits compliance with recordkeeping requirements.
 *
 * @swagger
 * @operation auditRecordkeeping
 * @tags Compliance Reporting
 *
 * @param {string} transactionId - Transaction ID
 * @param {string[]} requiredRecords - Required record types
 * @param {string[]} availableRecords - Available record types
 * @returns {{ compliant: boolean; missingRecords: string[]; retentionPeriod: number }} Audit result
 *
 * @example
 * ```typescript
 * const audit = auditRecordkeeping('TXN-123', ['INVOICE', 'LICENSE'], ['INVOICE']);
 * // Result: { compliant: false, missingRecords: ['LICENSE'], retentionPeriod: 5 }
 * ```
 */
export declare const auditRecordkeeping: (transactionId: string, requiredRecords: string[], availableRecords: string[]) => {
    compliant: boolean;
    missingRecords: string[];
    retentionPeriod: number;
};
declare const _default: {
    classifyProductForExport: (productId: string, description: string, technicalSpecs: string[]) => ExportControlClassification;
    determineScheduleBNumber: (htsCode: string, productCategory: string) => {
        scheduleB: string;
        description: string;
        unit: string;
    };
    validateECCN: (eccn: string, destinationCountry: string) => {
        valid: boolean;
        licenseRequired: boolean;
        reasons: string[];
    };
    checkITARStatus: (productId: string, category: string) => {
        isITAR: boolean;
        usmlCategory: string | null;
        ddtcRequired: boolean;
    };
    generateExportControlDoc: (classification: ExportControlClassification, destinationCountry: string) => {
        documents: string[];
        declarationText: string;
    };
    screenDeniedParties: (entityName: string, country: string, aliases?: string[]) => Promise<ScreeningResult>;
    fuzzyMatchEntity: (searchName: string, listName: string) => number;
    checkOFACSDN: (entityName: string, address?: string) => Promise<{
        isSDN: boolean;
        programs: string[];
        remarks: string;
    }>;
    screenBISEntityList: (entityName: string, country: string) => {
        onList: boolean;
        restrictions: string[];
        federalRegisterCitation: string;
    };
    generateScreeningAudit: (result: ScreeningResult, transactionId: string) => {
        auditId: string;
        timestamp: Date;
        decision: string;
        reviewer: string;
    };
    checkCountrySanctions: (countryCode: string) => SanctionsCheck;
    validateOFACCompliance: (destination: string, entityName: string, value: number) => Promise<{
        compliant: boolean;
        violations: string[];
        requiresLicense: boolean;
    }>;
    checkEUSanctions: (country: string, industry: string) => {
        sanctioned: boolean;
        regulations: string[];
        exemptions: string[];
    };
    validateUNSanctions: (country: string) => {
        hasUNSanctions: boolean;
        resolutions: string[];
        prohibitedGoods: string[];
    };
    generateSanctionsReport: (country: string, entity: string) => Promise<{
        summary: string;
        details: any;
        recommendation: string;
    }>;
    validateExportLicense: (licenseNumber: string, shipmentValue: number, destination: string) => {
        valid: boolean;
        remainingValue: number;
        authorized: boolean;
        errors: string[];
    };
    requiresExportLicense: (eccn: string, destination: string, value: number) => {
        required: boolean;
        licenseType: string | null;
        authority: string | null;
        reason: string;
    };
    analyzeLicenseExceptions: (eccn: string, destination: string, endUse: string) => {
        availableExceptions: string[];
        recommended: string | null;
        restrictions: string[];
    };
    generateCommercialInvoice: (orderData: any, incoterms: string) => CommercialInvoice;
    generatePackingList: (shipmentData: any) => {
        packages: any[];
        totalWeight: number;
        totalVolume: number;
    };
    generateCertificateOfOrigin: (shipmentData: any, certificateType: "GENERIC" | "GSP" | "NAFTA" | "USMCA" | "FTA" | "EUR1" | "ATR") => CertificateOfOrigin;
    validateCustomsDocs: (providedDocs: string[], destinationCountry: string) => {
        complete: boolean;
        missingDocs: string[];
        warnings: string[];
    };
    calculateCustomsDuties: (htsCode: string, value: number, destinationCountry: string) => {
        dutyRate: number;
        dutyAmount: number;
        vat: number;
        totalTaxes: number;
    };
    lookupHTSCode: (productDescription: string, countryOfImport?: string) => HarmonizedTariffCode[];
    validateHTSCode: (htsCode: string) => {
        valid: boolean;
        chapter: string;
        heading: string;
        errors: string[];
    };
    checkPreferentialTariff: (htsCode: string, originCountry: string, destinationCountry: string) => {
        eligible: boolean;
        program: string | null;
        reducedRate: string;
        savings: number;
    };
    determineCountryOfOrigin: (components: ComponentOrigin[], finalAssemblyCountry: string) => CountryOfOrigin;
    validateOriginMarking: (productType: string, marking: string, originCountry: string) => {
        compliant: boolean;
        requiredMarking: string;
        issues: string[];
    };
    parseIncoterms: (incoterm: "EXW" | "FCA" | "CPT" | "CIP" | "DAP" | "DPU" | "DDP" | "FAS" | "FOB" | "CFR" | "CIF", namedPlace: string) => IncotermsRule;
    calculateIncotermsCosts: (incoterm: string, goodsValue: number, freightCost: number, insuranceCost: number, dutiesTaxes: number) => {
        sellerCost: number;
        buyerCost: number;
        breakdown: any;
    };
    generateIncotermsDoc: (rule: IncotermsRule) => {
        documentType: string;
        content: string;
        parties: any;
    };
    generateAESDeclaration: (shipmentData: any) => AESDeclaration;
    validateAESRequirement: (shipmentValue: number, destination: string, scheduleBCodes: string[]) => {
        required: boolean;
        reason: string;
        exemptionCode: string | null;
    };
    generateComplianceReport: (startDate: Date, endDate: Date, exportTransactions: any[]) => ComplianceReport;
    auditRecordkeeping: (transactionId: string, requiredRecords: string[], availableRecords: string[]) => {
        compliant: boolean;
        missingRecords: string[];
        retentionPeriod: number;
    };
};
export default _default;
//# sourceMappingURL=trade-compliance-export-kit.d.ts.map
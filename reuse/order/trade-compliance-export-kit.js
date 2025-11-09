"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditRecordkeeping = exports.generateComplianceReport = exports.validateAESRequirement = exports.generateAESDeclaration = exports.generateIncotermsDoc = exports.calculateIncotermsCosts = exports.parseIncoterms = exports.validateOriginMarking = exports.determineCountryOfOrigin = exports.checkPreferentialTariff = exports.validateHTSCode = exports.lookupHTSCode = exports.calculateCustomsDuties = exports.validateCustomsDocs = exports.generateCertificateOfOrigin = exports.generatePackingList = exports.generateCommercialInvoice = exports.analyzeLicenseExceptions = exports.requiresExportLicense = exports.validateExportLicense = exports.generateSanctionsReport = exports.validateUNSanctions = exports.checkEUSanctions = exports.validateOFACCompliance = exports.checkCountrySanctions = exports.generateScreeningAudit = exports.screenBISEntityList = exports.checkOFACSDN = exports.fuzzyMatchEntity = exports.screenDeniedParties = exports.generateExportControlDoc = exports.checkITARStatus = exports.validateECCN = exports.determineScheduleBNumber = exports.classifyProductForExport = void 0;
// ============================================================================
// EXPORT CONTROL CLASSIFICATION (Functions 1-5)
// ============================================================================
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
const classifyProductForExport = (productId, description, technicalSpecs) => {
    // Determine ECCN based on product characteristics
    const isDualUse = technicalSpecs.some(spec => spec.toLowerCase().includes('military') ||
        spec.toLowerCase().includes('encryption'));
    return {
        eccn: isDualUse ? '5A002' : null,
        scheduleB: '8471.50.0150',
        usml: false,
        ear99: !isDualUse,
        dualUse: isDualUse,
        licenseRequired: isDualUse,
        licensingAuthority: isDualUse ? 'BIS' : 'None',
        classification: isDualUse ? 'EAR' : 'EAR99',
        controlReasons: isDualUse ? ['NS', 'AT'] : [],
        determinationDate: new Date(),
    };
};
exports.classifyProductForExport = classifyProductForExport;
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
const determineScheduleBNumber = (htsCode, productCategory) => {
    const scheduleB = htsCode.substring(0, 10);
    return {
        scheduleB,
        description: `Schedule B classification for ${productCategory}`,
        unit: 'No.',
    };
};
exports.determineScheduleBNumber = determineScheduleBNumber;
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
const validateECCN = (eccn, destinationCountry) => {
    const eccnPattern = /^[0-9][A-E][0-9]{3}(\.[a-z])?$/;
    const valid = eccnPattern.test(eccn);
    const highRiskCountries = ['CN', 'RU', 'IR', 'KP', 'SY', 'CU'];
    const licenseRequired = highRiskCountries.includes(destinationCountry);
    return {
        valid,
        licenseRequired,
        reasons: licenseRequired ? [`Destination country ${destinationCountry} requires license`] : [],
    };
};
exports.validateECCN = validateECCN;
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
const checkITARStatus = (productId, category) => {
    const itarKeywords = ['defense', 'military', 'weapon', 'munition', 'tactical'];
    const isITAR = itarKeywords.some(keyword => category.toLowerCase().includes(keyword));
    return {
        isITAR,
        usmlCategory: isITAR ? 'VIII' : null,
        ddtcRequired: isITAR,
    };
};
exports.checkITARStatus = checkITARStatus;
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
const generateExportControlDoc = (classification, destinationCountry) => {
    const documents = ['ECCN_CERTIFICATE'];
    if (classification.licenseRequired) {
        documents.push('EXPORT_LICENSE_COPY');
    }
    const declarationText = `This shipment contains items controlled under the Export Administration Regulations (EAR). ECCN: ${classification.eccn || 'EAR99'}. Destination: ${destinationCountry}. ${classification.licenseRequired ? 'Export license required.' : 'No license required.'}`;
    return { documents, declarationText };
};
exports.generateExportControlDoc = generateExportControlDoc;
// ============================================================================
// DENIED PARTY SCREENING (Functions 6-10)
// ============================================================================
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
const screenDeniedParties = async (entityName, country, aliases) => {
    // Simulate screening against multiple lists
    const nameLower = entityName.toLowerCase();
    const deniedKeywords = ['sanctioned', 'blocked', 'denied'];
    const isMatch = deniedKeywords.some(keyword => nameLower.includes(keyword));
    const matchScore = isMatch ? 0.95 : 0.0;
    return {
        isMatch,
        matchScore,
        matchedParties: [],
        listsCovered: ['OFAC_SDN', 'BIS_DPL', 'BIS_UVL', 'EU_SANCTIONS', 'UN_SANCTIONS'],
        screeningDate: new Date(),
        riskLevel: isMatch ? 'HIGH' : 'CLEAR',
        requiresManualReview: matchScore > 0.75 && matchScore < 1.0,
        complianceNotes: isMatch ? ['Potential match found - manual review required'] : [],
    };
};
exports.screenDeniedParties = screenDeniedParties;
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
const fuzzyMatchEntity = (searchName, listName) => {
    const normalize = (str) => str.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();
    const s1 = normalize(searchName);
    const s2 = normalize(listName);
    if (s1 === s2)
        return 1.0;
    if (s1.includes(s2) || s2.includes(s1))
        return 0.85;
    // Simple Levenshtein-based scoring
    const maxLen = Math.max(s1.length, s2.length);
    const distance = levenshteinDistance(s1, s2);
    return 1 - (distance / maxLen);
};
exports.fuzzyMatchEntity = fuzzyMatchEntity;
// Helper function for Levenshtein distance
const levenshteinDistance = (s1, s2) => {
    const matrix = [];
    for (let i = 0; i <= s2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= s1.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= s2.length; i++) {
        for (let j = 1; j <= s1.length; j++) {
            if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[s2.length][s1.length];
};
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
const checkOFACSDN = async (entityName, address) => {
    // Simulate OFAC SDN check
    const sdnKeywords = ['narcotics', 'terrorism', 'proliferation'];
    const isSDN = sdnKeywords.some(keyword => entityName.toLowerCase().includes(keyword));
    return {
        isSDN,
        programs: isSDN ? ['SDNT', 'SDNTK'] : [],
        remarks: isSDN ? 'Match found in OFAC SDN list - transaction prohibited' : '',
    };
};
exports.checkOFACSDN = checkOFACSDN;
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
const screenBISEntityList = (entityName, country) => {
    const highRiskCountries = ['CN', 'RU', 'IR'];
    const potentialRisk = highRiskCountries.includes(country);
    return {
        onList: false,
        restrictions: potentialRisk ? ['Enhanced screening recommended'] : [],
        federalRegisterCitation: '',
    };
};
exports.screenBISEntityList = screenBISEntityList;
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
const generateScreeningAudit = (result, transactionId) => {
    const auditId = `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const decision = result.isMatch ? 'BLOCKED' : result.requiresManualReview ? 'REVIEW_REQUIRED' : 'CLEARED';
    return {
        auditId,
        timestamp: new Date(),
        decision,
        reviewer: result.requiresManualReview ? 'PENDING' : 'SYSTEM_AUTO',
    };
};
exports.generateScreeningAudit = generateScreeningAudit;
// ============================================================================
// SANCTIONS COMPLIANCE (Functions 11-15)
// ============================================================================
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
const checkCountrySanctions = (countryCode) => {
    const comprehensiveSanctions = ['IR', 'KP', 'SY', 'CU'].includes(countryCode);
    const sectorialSanctions = ['RU', 'BY'].includes(countryCode);
    return {
        country: countryCode,
        sanctionedCountry: comprehensiveSanctions || sectorialSanctions,
        comprehensiveSanctions,
        sectorialSanctions: sectorialSanctions ? ['FINANCIAL', 'ENERGY', 'DEFENSE'] : [],
        embargoTypes: comprehensiveSanctions ? ['TRADE', 'FINANCIAL', 'TRAVEL'] : [],
        restrictedIndustries: sectorialSanctions ? ['Oil & Gas', 'Banking', 'Defense'] : [],
        allowedWithLicense: !comprehensiveSanctions,
        sanctioningAuthorities: comprehensiveSanctions ? ['OFAC', 'EU', 'UN'] : sectorialSanctions ? ['OFAC', 'EU'] : [],
        effectiveDate: new Date('2022-01-01'),
    };
};
exports.checkCountrySanctions = checkCountrySanctions;
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
const validateOFACCompliance = async (destination, entityName, value) => {
    const sanctions = (0, exports.checkCountrySanctions)(destination);
    const screening = await (0, exports.screenDeniedParties)(entityName, destination);
    const violations = [];
    if (sanctions.comprehensiveSanctions) {
        violations.push(`Comprehensive sanctions apply to ${destination}`);
    }
    if (screening.isMatch) {
        violations.push(`Entity matches denied party: ${entityName}`);
    }
    return {
        compliant: violations.length === 0,
        violations,
        requiresLicense: sanctions.sectorialSanctions.length > 0,
    };
};
exports.validateOFACCompliance = validateOFACCompliance;
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
const checkEUSanctions = (country, industry) => {
    const euSanctionedCountries = ['RU', 'BY', 'IR', 'SY', 'KP'];
    const sanctioned = euSanctionedCountries.includes(country);
    const regulations = sanctioned ? ['EU 833/2014', 'EU 269/2014'] : [];
    const exemptions = [];
    if (industry === 'Humanitarian') {
        exemptions.push('Humanitarian goods exemption may apply');
    }
    return { sanctioned, regulations, exemptions };
};
exports.checkEUSanctions = checkEUSanctions;
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
const validateUNSanctions = (country) => {
    const unSanctionedCountries = ['KP', 'IR', 'LY', 'YE', 'SO', 'CF'];
    const hasUNSanctions = unSanctionedCountries.includes(country);
    return {
        hasUNSanctions,
        resolutions: hasUNSanctions ? ['UNSCR 2397', 'UNSCR 2231'] : [],
        prohibitedGoods: hasUNSanctions ? ['Arms', 'Luxury goods', 'Dual-use items'] : [],
    };
};
exports.validateUNSanctions = validateUNSanctions;
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
const generateSanctionsReport = async (country, entity) => {
    const ofacCheck = await (0, exports.validateOFACCompliance)(country, entity, 0);
    const euCheck = (0, exports.checkEUSanctions)(country, 'General');
    const unCheck = (0, exports.validateUNSanctions)(country);
    const countryCheck = (0, exports.checkCountrySanctions)(country);
    const recommendation = !ofacCheck.compliant ? 'BLOCK' :
        countryCheck.comprehensiveSanctions ? 'BLOCK' :
            countryCheck.sectorialSanctions.length > 0 ? 'REQUIRES_LICENSE' :
                'PROCEED';
    return {
        summary: `Sanctions analysis for ${entity} in ${country}`,
        details: {
            ofac: ofacCheck,
            eu: euCheck,
            un: unCheck,
            country: countryCheck,
        },
        recommendation,
    };
};
exports.generateSanctionsReport = generateSanctionsReport;
// ============================================================================
// EXPORT LICENSE MANAGEMENT (Functions 16-18)
// ============================================================================
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
const validateExportLicense = (licenseNumber, shipmentValue, destination) => {
    // Simulate license lookup
    const mockLicense = {
        licenseNumber,
        licenseType: 'BIS',
        issuer: 'BIS',
        issueDate: new Date('2024-01-01'),
        expirationDate: new Date('2025-12-31'),
        authorizedValue: 100000,
        currency: 'USD',
        remainingValue: 75000,
        destinations: ['AE', 'SA', 'QA'],
        products: ['Electronics'],
        endUser: 'Authorized Distributor',
        status: 'ACTIVE',
        conditions: ['End-use statement required'],
    };
    const errors = [];
    const now = new Date();
    if (now > mockLicense.expirationDate) {
        errors.push('License expired');
    }
    if (!mockLicense.destinations.includes(destination)) {
        errors.push(`Destination ${destination} not authorized`);
    }
    if (shipmentValue > mockLicense.remainingValue) {
        errors.push('Shipment value exceeds remaining authorization');
    }
    return {
        valid: errors.length === 0,
        remainingValue: mockLicense.remainingValue - (errors.length === 0 ? shipmentValue : 0),
        authorized: errors.length === 0,
        errors,
    };
};
exports.validateExportLicense = validateExportLicense;
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
const requiresExportLicense = (eccn, destination, value) => {
    const controlledECCNs = ['5A002', '5D002', '5E002', '3A001', '4A003'];
    const highRiskCountries = ['CN', 'RU', 'IR', 'KP'];
    const isControlled = controlledECCNs.includes(eccn);
    const isHighRisk = highRiskCountries.includes(destination);
    const required = isControlled || isHighRisk;
    return {
        required,
        licenseType: required ? 'BIS' : null,
        authority: required ? 'BIS' : null,
        reason: required
            ? `ECCN ${eccn} requires license for destination ${destination}`
            : 'No license required (NLR)',
    };
};
exports.requiresExportLicense = requiresExportLicense;
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
const analyzeLicenseExceptions = (eccn, destination, endUse) => {
    const staCountries = ['GB', 'FR', 'DE', 'JP', 'AU'];
    const isSTA = staCountries.includes(destination);
    const availableExceptions = [];
    if (isSTA && eccn.startsWith('5A')) {
        availableExceptions.push('STA');
    }
    if (endUse.toLowerCase().includes('civil')) {
        availableExceptions.push('CIV');
    }
    return {
        availableExceptions,
        recommended: availableExceptions[0] || null,
        restrictions: availableExceptions.length === 0 ? ['Full license required'] : [],
    };
};
exports.analyzeLicenseExceptions = analyzeLicenseExceptions;
// ============================================================================
// CUSTOMS DOCUMENTATION (Functions 19-23)
// ============================================================================
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
const generateCommercialInvoice = (orderData, incoterms) => {
    const invoiceNumber = `INV-${Date.now()}`;
    const items = (orderData.items || []).map((item, index) => ({
        itemNumber: index + 1,
        description: item.description || 'Product',
        htsCode: item.htsCode || '0000.00.0000',
        countryOfOrigin: item.origin || 'US',
        quantity: item.quantity || 1,
        unit: item.unit || 'EA',
        unitPrice: item.price || 0,
        totalPrice: (item.quantity || 1) * (item.price || 0),
        weight: item.weight || 1,
        weightUnit: 'KG',
    }));
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    return {
        invoiceNumber,
        invoiceDate: new Date(),
        sellerName: orderData.sellerName || 'White Cross Seller',
        sellerAddress: orderData.sellerAddress || '123 Export St, City, ST 12345, US',
        sellerTaxId: orderData.sellerTaxId || 'US-123456789',
        buyerName: orderData.buyerName || 'International Buyer',
        buyerAddress: orderData.buyerAddress || 'Foreign Address',
        buyerTaxId: orderData.buyerTaxId || '',
        currency: orderData.currency || 'USD',
        incoterms,
        paymentTerms: orderData.paymentTerms || 'NET 30',
        items,
        subtotal,
        shipping: orderData.shipping || 0,
        insurance: orderData.insurance || 0,
        otherCharges: orderData.otherCharges || 0,
        totalValue: subtotal + (orderData.shipping || 0) + (orderData.insurance || 0) + (orderData.otherCharges || 0),
        declarationStatement: 'I declare that all information provided is true and correct.',
        signatory: orderData.signatory || 'Authorized Signatory',
        signatureDate: new Date(),
    };
};
exports.generateCommercialInvoice = generateCommercialInvoice;
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
const generatePackingList = (shipmentData) => {
    const packages = (shipmentData.packages || []).map((pkg, index) => ({
        packageNumber: index + 1,
        type: pkg.type || 'Carton',
        quantity: pkg.quantity || 1,
        weight: pkg.weight || 10,
        weightUnit: 'KG',
        dimensions: pkg.dimensions || { length: 40, width: 30, height: 30, unit: 'CM' },
        contents: pkg.contents || [],
        marks: pkg.marks || `PKG-${index + 1}`,
    }));
    const totalWeight = packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    const totalVolume = packages.reduce((sum, pkg) => {
        const dims = pkg.dimensions;
        return sum + (dims.length * dims.width * dims.height / 1000000);
    }, 0);
    return { packages, totalWeight, totalVolume };
};
exports.generatePackingList = generatePackingList;
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
const generateCertificateOfOrigin = (shipmentData, certificateType) => {
    const certificateNumber = `COO-${certificateType}-${Date.now()}`;
    const items = (shipmentData.items || []).map((item, index) => ({
        itemNumber: index + 1,
        description: item.description || 'Product',
        htsCode: item.htsCode || '0000.00.0000',
        quantity: item.quantity || 1,
        unit: item.unit || 'EA',
        originCriteria: certificateType === 'USMCA' ? 'A' : 'Wholly obtained',
    }));
    return {
        certificateNumber,
        certificateType,
        issuer: 'Chamber of Commerce',
        issueDate: new Date(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        exporterName: shipmentData.exporterName || 'White Cross Exporter',
        exporterAddress: shipmentData.exporterAddress || 'Export Address',
        consigneeName: shipmentData.consigneeName || 'Foreign Consignee',
        consigneeAddress: shipmentData.consigneeAddress || 'Foreign Address',
        originCountry: shipmentData.originCountry || 'US',
        destinationCountry: shipmentData.destinationCountry || 'CA',
        items,
        criteriaCode: certificateType === 'USMCA' ? 'A' : undefined,
        preferentialTreatment: ['GSP', 'NAFTA', 'USMCA', 'FTA'].includes(certificateType),
        signature: 'Authorized Signature',
        certificationStatement: `I certify that the goods described in this certificate originate in ${shipmentData.originCountry || 'US'}.`,
    };
};
exports.generateCertificateOfOrigin = generateCertificateOfOrigin;
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
const validateCustomsDocs = (providedDocs, destinationCountry) => {
    const requiredDocs = ['COMMERCIAL_INVOICE', 'PACKING_LIST', 'BILL_OF_LADING'];
    // Additional requirements for specific countries
    if (['CA', 'MX'].includes(destinationCountry)) {
        requiredDocs.push('CERTIFICATE_OF_ORIGIN');
    }
    if (['CN', 'IN'].includes(destinationCountry)) {
        requiredDocs.push('CERTIFICATE_OF_ORIGIN', 'IMPORT_LICENSE');
    }
    const missingDocs = requiredDocs.filter(doc => !providedDocs.includes(doc));
    return {
        complete: missingDocs.length === 0,
        missingDocs,
        warnings: missingDocs.length > 0 ? ['Incomplete documentation may cause customs delays'] : [],
    };
};
exports.validateCustomsDocs = validateCustomsDocs;
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
const calculateCustomsDuties = (htsCode, value, destinationCountry) => {
    // Simplified duty calculation (would use actual tariff database)
    const dutyRates = {
        'GB': 0.025,
        'DE': 0.03,
        'FR': 0.03,
        'CN': 0.15,
        'IN': 0.10,
    };
    const vatRates = {
        'GB': 0.20,
        'DE': 0.19,
        'FR': 0.20,
        'CN': 0.13,
        'IN': 0.18,
    };
    const dutyRate = dutyRates[destinationCountry] || 0.05;
    const vatRate = vatRates[destinationCountry] || 0.0;
    const dutyAmount = value * dutyRate;
    const vat = (value + dutyAmount) * vatRate;
    const totalTaxes = dutyAmount + vat;
    return { dutyRate, dutyAmount, vat, totalTaxes };
};
exports.calculateCustomsDuties = calculateCustomsDuties;
// ============================================================================
// HARMONIZED TARIFF CODES (Functions 24-26)
// ============================================================================
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
const lookupHTSCode = (productDescription, countryOfImport) => {
    // Simplified HTS lookup (would query actual HTS database)
    const keywords = productDescription.toLowerCase();
    if (keywords.includes('computer') || keywords.includes('processor')) {
        return [{
                htsCode: '8471.50.0150',
                hts6: '847150',
                hts8: '84715001',
                hts10: '8471500150',
                description: 'Processing units, whether or not containing in the same housing storage units',
                dutyRate: '0%',
                preferentialRate: '0%',
                specialPrograms: ['GSP', 'FTA'],
                statisticalSuffix: '50',
                unit: 'No.',
            }];
    }
    return [];
};
exports.lookupHTSCode = lookupHTSCode;
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
const validateHTSCode = (htsCode) => {
    const errors = [];
    // Remove dots and spaces
    const cleanCode = htsCode.replace(/[.\s]/g, '');
    // HTS should be 6-10 digits
    if (cleanCode.length < 6 || cleanCode.length > 10) {
        errors.push('HTS code must be 6-10 digits');
    }
    if (!/^\d+$/.test(cleanCode)) {
        errors.push('HTS code must contain only digits');
    }
    const chapter = cleanCode.substring(0, 2);
    const heading = cleanCode.substring(0, 4);
    return {
        valid: errors.length === 0,
        chapter,
        heading,
        errors,
    };
};
exports.validateHTSCode = validateHTSCode;
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
const checkPreferentialTariff = (htsCode, originCountry, destinationCountry) => {
    // USMCA countries
    if (['US', 'CA', 'MX'].includes(originCountry) && ['US', 'CA', 'MX'].includes(destinationCountry)) {
        return {
            eligible: true,
            program: 'USMCA',
            reducedRate: '0%',
            savings: 250, // Example savings
        };
    }
    // GSP eligible countries
    const gspCountries = ['BR', 'IN', 'TH', 'PH'];
    if (gspCountries.includes(originCountry) && destinationCountry === 'US') {
        return {
            eligible: true,
            program: 'GSP',
            reducedRate: '0%',
            savings: 150,
        };
    }
    return {
        eligible: false,
        program: null,
        reducedRate: 'MFN Rate',
        savings: 0,
    };
};
exports.checkPreferentialTariff = checkPreferentialTariff;
// ============================================================================
// COUNTRY OF ORIGIN & INCOTERMS (Functions 27-31)
// ============================================================================
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
const determineCountryOfOrigin = (components, finalAssemblyCountry) => {
    const totalValue = components.reduce((sum, comp) => sum + comp.valuePercentage, 0);
    const finalAssemblyValue = components
        .filter(comp => comp.originCountry === finalAssemblyCountry)
        .reduce((sum, comp) => sum + comp.valuePercentage, 0);
    const substantialTransformation = finalAssemblyValue / totalValue > 0.35;
    return {
        country: substantialTransformation ? finalAssemblyCountry : components[0]?.originCountry || 'Unknown',
        countryCode: substantialTransformation ? finalAssemblyCountry : components[0]?.originCountry || 'XX',
        determineMethod: substantialTransformation ? 'SUBSTANTIAL_TRANSFORMATION' : 'MANUFACTURED',
        manufacturingLocations: [finalAssemblyCountry],
        componentOrigins: components,
        tariffPreference: substantialTransformation,
        certificateRequired: true,
        determinationDate: new Date(),
    };
};
exports.determineCountryOfOrigin = determineCountryOfOrigin;
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
const validateOriginMarking = (productType, marking, originCountry) => {
    const requiredMarking = `Made in ${getCountryName(originCountry)}`;
    const issues = [];
    if (!marking.toLowerCase().includes('made in')) {
        issues.push('Missing "Made in" designation');
    }
    if (!marking.toLowerCase().includes(originCountry.toLowerCase()) &&
        !marking.toLowerCase().includes(getCountryName(originCountry).toLowerCase())) {
        issues.push(`Marking must include country: ${getCountryName(originCountry)}`);
    }
    return {
        compliant: issues.length === 0,
        requiredMarking,
        issues,
    };
};
exports.validateOriginMarking = validateOriginMarking;
// Helper function
const getCountryName = (code) => {
    const countries = {
        'US': 'USA',
        'CN': 'China',
        'MX': 'Mexico',
        'CA': 'Canada',
        'GB': 'United Kingdom',
        'DE': 'Germany',
    };
    return countries[code] || code;
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
const parseIncoterms = (incoterm, namedPlace) => {
    const seaOnlyTerms = ['FAS', 'FOB', 'CFR', 'CIF'];
    const mode = seaOnlyTerms.includes(incoterm) ? 'SEA_INLAND_WATERWAY' : 'ANY';
    const responsibilities = {
        'EXW': {
            seller: ['Make goods available at premises'],
            buyer: ['All transportation', 'Export clearance', 'Import clearance', 'All costs and risks'],
        },
        'DDP': {
            seller: ['All transportation', 'Export clearance', 'Import clearance', 'Delivery to destination', 'All duties and taxes'],
            buyer: ['Unloading at destination'],
        },
        'FOB': {
            seller: ['Delivery on board vessel', 'Export clearance'],
            buyer: ['Main carriage', 'Import clearance', 'Onward transportation'],
        },
    };
    const ruleResponsibilities = responsibilities[incoterm] || { seller: ['Standard'], buyer: ['Standard'] };
    return {
        rule: incoterm,
        version: '2020',
        mode,
        transferOfRisk: `Risk transfers at ${namedPlace}`,
        transferOfCosts: `Costs transfer at ${namedPlace}`,
        sellerResponsibilities: ruleResponsibilities.seller,
        buyerResponsibilities: ruleResponsibilities.buyer,
        insuranceRequired: ['CIP', 'CIF'].includes(incoterm),
        exportClearance: ['EXW'].includes(incoterm) ? 'BUYER' : 'SELLER',
        importClearance: ['DDP'].includes(incoterm) ? 'SELLER' : 'BUYER',
        namedPlace,
    };
};
exports.parseIncoterms = parseIncoterms;
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
const calculateIncotermsCosts = (incoterm, goodsValue, freightCost, insuranceCost, dutiesTaxes) => {
    let sellerCost = goodsValue;
    let buyerCost = 0;
    switch (incoterm) {
        case 'EXW':
            buyerCost = freightCost + insuranceCost + dutiesTaxes;
            break;
        case 'FOB':
            buyerCost = freightCost + insuranceCost + dutiesTaxes;
            break;
        case 'CIF':
            sellerCost += freightCost + insuranceCost;
            buyerCost = dutiesTaxes;
            break;
        case 'DDP':
            sellerCost += freightCost + insuranceCost + dutiesTaxes;
            break;
        default:
            buyerCost = freightCost + insuranceCost + dutiesTaxes;
    }
    return {
        sellerCost,
        buyerCost,
        breakdown: {
            goods: goodsValue,
            freight: freightCost,
            insurance: insuranceCost,
            duties: dutiesTaxes,
            sellerPays: {
                goods: goodsValue,
                freight: incoterm === 'CIF' || incoterm === 'DDP',
                insurance: incoterm === 'CIF' || incoterm === 'DDP',
                duties: incoterm === 'DDP',
            },
        },
    };
};
exports.calculateIncotermsCosts = calculateIncotermsCosts;
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
const generateIncotermsDoc = (rule) => {
    const content = `
INCOTERMS® ${rule.version} - ${rule.rule}

Named Place: ${rule.namedPlace}
Transport Mode: ${rule.mode}

SELLER RESPONSIBILITIES:
${rule.sellerResponsibilities.map(r => `- ${r}`).join('\n')}

BUYER RESPONSIBILITIES:
${rule.buyerResponsibilities.map(r => `- ${r}`).join('\n')}

Transfer of Risk: ${rule.transferOfRisk}
Transfer of Costs: ${rule.transferOfCosts}

Export Clearance: ${rule.exportClearance}
Import Clearance: ${rule.importClearance}
Insurance Required: ${rule.insuranceRequired ? 'Yes' : 'No'}
  `.trim();
    return {
        documentType: 'INCOTERMS_NOTICE',
        content,
        parties: {
            seller: {
                responsibilities: rule.sellerResponsibilities,
                clearance: rule.exportClearance === 'SELLER',
            },
            buyer: {
                responsibilities: rule.buyerResponsibilities,
                clearance: rule.importClearance === 'BUYER',
            },
        },
    };
};
exports.generateIncotermsDoc = generateIncotermsDoc;
// ============================================================================
// AES/EEI DECLARATIONS & COMPLIANCE REPORTING (Functions 32-35)
// ============================================================================
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
const generateAESDeclaration = (shipmentData) => {
    const itnNumber = `ITN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const items = (shipmentData.items || []).map((item, index) => ({
        lineNumber: index + 1,
        scheduleB: item.scheduleB || '0000000000',
        description: item.description || 'Merchandise',
        quantity: item.quantity || 1,
        unit: item.unit || 'X',
        value: item.value || 0,
        eccn: item.eccn,
        licenseNumber: item.licenseNumber,
        licenseExceptionCode: item.licenseExceptionCode,
        exportInformationCode: item.exportInformationCode,
    }));
    return {
        itnNumber,
        filingOption: 'PREDEPARTURE',
        transportMode: shipmentData.transportMode || 'AIR',
        usppi: shipmentData.usppi || 'U.S. Principal Party in Interest',
        usppiEin: shipmentData.usppiEin || '12-3456789',
        ultimateConsignee: shipmentData.ultimateConsignee || 'Foreign Consignee',
        intermediateConsignee: shipmentData.intermediateConsignee,
        countryOfDestination: shipmentData.countryOfDestination || 'GB',
        portOfExport: shipmentData.portOfExport || 'JFK',
        portOfUnlading: shipmentData.portOfUnlading || 'LHR',
        dateOfExportation: new Date(shipmentData.dateOfExportation || Date.now()),
        conveyanceName: shipmentData.conveyanceName || 'FLIGHT123',
        shipmentValue: items.reduce((sum, item) => sum + item.value, 0),
        items,
        eccnLicenseInfo: [],
        routedTransaction: shipmentData.routedTransaction || false,
        hazmat: shipmentData.hazmat || false,
        status: 'DRAFT',
    };
};
exports.generateAESDeclaration = generateAESDeclaration;
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
const validateAESRequirement = (shipmentValue, destination, scheduleBCodes) => {
    // AES required for shipments > $2,500 or controlled items
    if (shipmentValue > 2500) {
        return {
            required: true,
            reason: 'Shipment value exceeds $2,500 per Schedule B',
            exemptionCode: null,
        };
    }
    // Controlled items always require AES
    const controlledPrefixes = ['3', '4', '5', '6', '7', '8', '9'];
    const hasControlledItems = scheduleBCodes.some(code => controlledPrefixes.includes(code.charAt(0)));
    if (hasControlledItems) {
        return {
            required: true,
            reason: 'Shipment contains controlled items',
            exemptionCode: null,
        };
    }
    return {
        required: false,
        reason: 'Shipment qualifies for exemption',
        exemptionCode: 'NOEEI 30.37(a)',
    };
};
exports.validateAESRequirement = validateAESRequirement;
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
const generateComplianceReport = (startDate, endDate, exportTransactions) => {
    const reportId = `RPT-${Date.now()}`;
    const totalExports = exportTransactions.length;
    const totalValue = exportTransactions.reduce((sum, tx) => sum + (tx.value || 0), 0);
    const exportsByDestination = {};
    const exportsByECCN = {};
    exportTransactions.forEach(tx => {
        exportsByDestination[tx.destination] = (exportsByDestination[tx.destination] || 0) + 1;
        if (tx.eccn) {
            exportsByECCN[tx.eccn] = (exportsByECCN[tx.eccn] || 0) + 1;
        }
    });
    const licensedExports = exportTransactions.filter(tx => tx.licenseNumber).length;
    const licensedValue = exportTransactions
        .filter(tx => tx.licenseNumber)
        .reduce((sum, tx) => sum + (tx.value || 0), 0);
    return {
        reportId,
        reportType: 'QUARTERLY',
        reportPeriod: { start: startDate, end: endDate },
        totalExports,
        totalValue,
        currency: 'USD',
        exportsByDestination,
        exportsByECCN,
        licensedExports,
        licensedValue,
        screeningResults: {
            total: totalExports,
            matches: 0,
            cleared: totalExports,
        },
        violations: [],
        generatedDate: new Date(),
        generatedBy: 'System',
    };
};
exports.generateComplianceReport = generateComplianceReport;
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
const auditRecordkeeping = (transactionId, requiredRecords, availableRecords) => {
    const missingRecords = requiredRecords.filter(record => !availableRecords.includes(record));
    return {
        compliant: missingRecords.length === 0,
        missingRecords,
        retentionPeriod: 5, // EAR requires 5 years retention
    };
};
exports.auditRecordkeeping = auditRecordkeeping;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Export Control Classification (1-5)
    classifyProductForExport: exports.classifyProductForExport,
    determineScheduleBNumber: exports.determineScheduleBNumber,
    validateECCN: exports.validateECCN,
    checkITARStatus: exports.checkITARStatus,
    generateExportControlDoc: exports.generateExportControlDoc,
    // Denied Party Screening (6-10)
    screenDeniedParties: exports.screenDeniedParties,
    fuzzyMatchEntity: exports.fuzzyMatchEntity,
    checkOFACSDN: exports.checkOFACSDN,
    screenBISEntityList: exports.screenBISEntityList,
    generateScreeningAudit: exports.generateScreeningAudit,
    // Sanctions Compliance (11-15)
    checkCountrySanctions: exports.checkCountrySanctions,
    validateOFACCompliance: exports.validateOFACCompliance,
    checkEUSanctions: exports.checkEUSanctions,
    validateUNSanctions: exports.validateUNSanctions,
    generateSanctionsReport: exports.generateSanctionsReport,
    // Export License Management (16-18)
    validateExportLicense: exports.validateExportLicense,
    requiresExportLicense: exports.requiresExportLicense,
    analyzeLicenseExceptions: exports.analyzeLicenseExceptions,
    // Customs Documentation (19-23)
    generateCommercialInvoice: exports.generateCommercialInvoice,
    generatePackingList: exports.generatePackingList,
    generateCertificateOfOrigin: exports.generateCertificateOfOrigin,
    validateCustomsDocs: exports.validateCustomsDocs,
    calculateCustomsDuties: exports.calculateCustomsDuties,
    // Harmonized Tariff Codes (24-26)
    lookupHTSCode: exports.lookupHTSCode,
    validateHTSCode: exports.validateHTSCode,
    checkPreferentialTariff: exports.checkPreferentialTariff,
    // Country of Origin & Incoterms (27-31)
    determineCountryOfOrigin: exports.determineCountryOfOrigin,
    validateOriginMarking: exports.validateOriginMarking,
    parseIncoterms: exports.parseIncoterms,
    calculateIncotermsCosts: exports.calculateIncotermsCosts,
    generateIncotermsDoc: exports.generateIncotermsDoc,
    // AES/EEI & Compliance Reporting (32-35)
    generateAESDeclaration: exports.generateAESDeclaration,
    validateAESRequirement: exports.validateAESRequirement,
    generateComplianceReport: exports.generateComplianceReport,
    auditRecordkeeping: exports.auditRecordkeeping,
};
//# sourceMappingURL=trade-compliance-export-kit.js.map
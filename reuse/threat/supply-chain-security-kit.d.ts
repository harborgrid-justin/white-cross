/**
 * LOC: SCSEC0001234
 * File: /reuse/threat/supply-chain-security-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable, Logger)
 *   - @nestjs/swagger (ApiProperty, ApiTags)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../validation-kit.ts (validation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - backend/threat/*
 *   - backend/supply-chain/*
 *   - backend/controllers/supply-chain-security.controller.ts
 *   - backend/services/supply-chain-security.service.ts
 */
/**
 * File: /reuse/threat/supply-chain-security-kit.ts
 * Locator: WC-THREAT-SCSEC-001
 * Purpose: Enterprise Supply Chain Security to compete with Infor SCM - vendor assessment, third-party risk, SBOM management, supply chain attack detection
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, error-handling-kit, validation-kit
 * Downstream: Supply chain controllers, threat management services, security assessment systems, SBOM processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 42 production-ready functions for supply chain security, vendor assessment, SBOM management, third-party scanning
 *
 * LLM Context: Enterprise-grade supply chain security utilities competing with Infor SCM.
 * Provides comprehensive supply chain risk monitoring, vendor security assessment, third-party vulnerability scanning,
 * Software Bill of Materials (SBOM) management, dependency vulnerability tracking, supply chain attack detection,
 * counterfeit detection, supplier security ratings, compliance verification, and continuous monitoring.
 */
import { Sequelize } from 'sequelize';
/**
 * Vendor security assessment data structure
 */
export interface VendorSecurityAssessment {
    vendorId: string;
    vendorName: string;
    assessmentDate: Date;
    assessmentType: 'initial' | 'periodic' | 'triggered' | 'continuous';
    overallRiskScore: number;
    securityRating: 'A' | 'B' | 'C' | 'D' | 'F';
    certifications: string[];
    complianceStandards: string[];
    findings: SecurityFinding[];
    recommendations: string[];
    nextReviewDate: Date;
    assessedBy: string;
}
/**
 * Security finding in vendor assessment
 */
export interface SecurityFinding {
    findingId: string;
    category: 'critical' | 'high' | 'medium' | 'low' | 'informational';
    title: string;
    description: string;
    impact: string;
    remediation: string;
    status: 'open' | 'in-progress' | 'resolved' | 'accepted' | 'false-positive';
    dueDate?: Date;
    assignedTo?: string;
}
/**
 * Software Bill of Materials (SBOM) structure
 */
export interface SBOM {
    sbomId: string;
    format: 'CycloneDX' | 'SPDX' | 'SWID';
    version: string;
    createdAt: Date;
    components: SBOMComponent[];
    dependencies: SBOMDependency[];
    vulnerabilities: SBOMVulnerability[];
    metadata: Record<string, any>;
}
/**
 * SBOM component details
 */
export interface SBOMComponent {
    componentId: string;
    name: string;
    version: string;
    type: 'library' | 'framework' | 'application' | 'operating-system' | 'device' | 'firmware' | 'file';
    supplier: string;
    licenses: string[];
    purl: string;
    cpe: string;
    hashes: Record<string, string>;
    externalReferences: ExternalReference[];
}
/**
 * SBOM dependency relationship
 */
export interface SBOMDependency {
    dependsOn: string;
    ref: string;
    relationshipType: 'direct' | 'transitive' | 'optional' | 'dev';
}
/**
 * SBOM vulnerability reference
 */
export interface SBOMVulnerability {
    vulnerabilityId: string;
    cveId?: string;
    source: string;
    severity: string;
    cvssScore: number;
    affectedComponents: string[];
    published: Date;
    modified?: Date;
}
/**
 * External reference for components
 */
export interface ExternalReference {
    type: 'website' | 'issue-tracker' | 'vcs' | 'documentation' | 'security-advisory';
    url: string;
    comment?: string;
}
/**
 * Third-party risk assessment
 */
export interface ThirdPartyRiskAssessment {
    vendorId: string;
    assessmentId: string;
    riskCategory: 'operational' | 'financial' | 'reputational' | 'compliance' | 'security' | 'strategic';
    inherentRisk: number;
    residualRisk: number;
    controls: RiskControl[];
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    mitigation: string[];
    monitoring: MonitoringRequirement[];
}
/**
 * Risk control measure
 */
export interface RiskControl {
    controlId: string;
    controlName: string;
    controlType: 'preventive' | 'detective' | 'corrective';
    effectiveness: 'effective' | 'partially-effective' | 'ineffective';
    testDate: Date;
    testedBy: string;
}
/**
 * Monitoring requirement for third-party risks
 */
export interface MonitoringRequirement {
    requirementId: string;
    description: string;
    frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
    responsible: string;
    alertThreshold: number;
}
/**
 * Supply chain attack indicator
 */
export interface SupplyChainAttackIndicator {
    indicatorId: string;
    detectedAt: Date;
    attackType: 'backdoor' | 'malicious-update' | 'dependency-confusion' | 'typosquatting' | 'compromised-build' | 'counterfeit';
    severity: 'critical' | 'high' | 'medium' | 'low';
    affectedComponents: string[];
    indicators: string[];
    confidence: number;
    mitigationSteps: string[];
    status: 'investigating' | 'confirmed' | 'mitigated' | 'false-positive';
}
/**
 * Supplier security rating
 */
export interface SupplierSecurityRating {
    supplierId: string;
    supplierName: string;
    rating: number;
    grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
    factors: SecurityRatingFactor[];
    trend: 'improving' | 'stable' | 'declining';
    lastUpdated: Date;
    industry: string;
    peerComparison: number;
}
/**
 * Security rating factor
 */
export interface SecurityRatingFactor {
    factor: 'network-security' | 'endpoint-security' | 'patching-cadence' | 'application-security' | 'breach-history' | 'dns-health' | 'ssl-certificates' | 'email-security';
    score: number;
    weight: number;
    findings: string[];
}
/**
 * Counterfeit component detection result
 */
export interface CounterfeitDetectionResult {
    componentId: string;
    detectionMethod: 'signature-verification' | 'behavioral-analysis' | 'supply-chain-verification' | 'physical-inspection';
    isCounterfeit: boolean;
    confidence: number;
    indicators: string[];
    authenticityScore: number;
    verificationChain: string[];
    recommendedAction: 'block' | 'quarantine' | 'monitor' | 'approve';
}
/**
 * Dependency vulnerability tracking
 */
export interface DependencyVulnerability {
    dependencyId: string;
    packageName: string;
    version: string;
    vulnerabilities: Array<{
        cveId: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        cvssScore: number;
        exploitable: boolean;
        patchAvailable: boolean;
        patchVersion?: string;
        publishedDate: Date;
    }>;
    riskScore: number;
    remediationPriority: number;
}
/**
 * Vendor Security Profile model for tracking vendor security posture.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorSecurityProfile model
 *
 * @example
 * ```typescript
 * const VendorSecurityProfile = createVendorSecurityProfileModel(sequelize);
 * const vendor = await VendorSecurityProfile.create({
 *   vendorId: 'VEND-001',
 *   vendorName: 'Acme Corp',
 *   securityRating: 'B',
 *   overallRiskScore: 65,
 *   lastAssessmentDate: new Date(),
 *   certifications: ['ISO27001', 'SOC2']
 * });
 * ```
 */
export declare const createVendorSecurityProfileModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        vendorId: string;
        vendorName: string;
        securityRating: string;
        overallRiskScore: number;
        lastAssessmentDate: Date | null;
        nextReviewDate: Date | null;
        certifications: string[];
        complianceStandards: string[];
        riskLevel: string;
        continuousMonitoring: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * SBOM Registry model for tracking Software Bills of Materials.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SBOMRegistry model
 *
 * @example
 * ```typescript
 * const SBOMRegistry = createSBOMRegistryModel(sequelize);
 * const sbom = await SBOMRegistry.create({
 *   sbomId: 'SBOM-2024-001',
 *   applicationName: 'Healthcare Portal',
 *   version: '2.1.0',
 *   format: 'CycloneDX',
 *   componentCount: 245
 * });
 * ```
 */
export declare const createSBOMRegistryModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        sbomId: string;
        applicationName: string;
        version: string;
        format: string;
        formatVersion: string;
        componentCount: number;
        vulnerabilityCount: number;
        generatedAt: Date;
        sbomData: Record<string, any>;
        sbomHash: string | null;
        validationStatus: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Supply Chain Attack Incident model for tracking supply chain security incidents.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SupplyChainIncident model
 *
 * @example
 * ```typescript
 * const SupplyChainIncident = createSupplyChainIncidentModel(sequelize);
 * const incident = await SupplyChainIncident.create({
 *   incidentId: 'INC-2024-001',
 *   attackType: 'dependency-confusion',
 *   severity: 'high',
 *   status: 'investigating'
 * });
 * ```
 */
export declare const createSupplyChainIncidentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        incidentId: string;
        attackType: string;
        severity: string;
        detectedAt: Date;
        affectedComponents: string[];
        indicators: string[];
        confidence: number;
        status: string;
        mitigationSteps: string[];
        resolvedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Performs comprehensive security assessment of a vendor.
 *
 * @param {string} vendorId - Vendor unique identifier
 * @param {string} assessmentType - Type of assessment
 * @param {string} assessedBy - User performing assessment
 * @returns {Promise<VendorSecurityAssessment>} Complete security assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessVendorSecurity('VEND-001', 'periodic', 'security-team');
 * console.log(`Risk Score: ${assessment.overallRiskScore}`);
 * console.log(`Rating: ${assessment.securityRating}`);
 * ```
 */
export declare function assessVendorSecurity(vendorId: string, assessmentType: 'initial' | 'periodic' | 'triggered' | 'continuous', assessedBy: string): Promise<VendorSecurityAssessment>;
/**
 * Calculates vendor security rating based on risk score.
 *
 * @param {number} riskScore - Risk score (0-100)
 * @returns {string} Security rating grade
 *
 * @example
 * ```typescript
 * const rating = calculateSecurityRating(85);
 * console.log(rating); // 'A'
 * ```
 */
export declare function calculateSecurityRating(riskScore: number): 'A' | 'B' | 'C' | 'D' | 'F';
/**
 * Assesses network security controls of vendor.
 *
 * @param {string} vendorId - Vendor identifier
 * @returns {Promise<number>} Network security score (0-100)
 *
 * @example
 * ```typescript
 * const score = await assessNetworkSecurity('VEND-001');
 * console.log(`Network Security: ${score}/100`);
 * ```
 */
export declare function assessNetworkSecurity(vendorId: string): Promise<number>;
/**
 * Assesses data protection and encryption capabilities.
 *
 * @param {string} vendorId - Vendor identifier
 * @returns {Promise<number>} Data protection score (0-100)
 *
 * @example
 * ```typescript
 * const score = await assessDataProtection('VEND-001');
 * console.log(`Data Protection: ${score}/100`);
 * ```
 */
export declare function assessDataProtection(vendorId: string): Promise<number>;
/**
 * Assesses incident response capabilities.
 *
 * @param {string} vendorId - Vendor identifier
 * @returns {Promise<number>} Incident response score (0-100)
 *
 * @example
 * ```typescript
 * const score = await assessIncidentResponse('VEND-001');
 * console.log(`Incident Response: ${score}/100`);
 * ```
 */
export declare function assessIncidentResponse(vendorId: string): Promise<number>;
/**
 * Assesses access control mechanisms.
 *
 * @param {string} vendorId - Vendor identifier
 * @returns {Promise<number>} Access control score (0-100)
 *
 * @example
 * ```typescript
 * const score = await assessAccessControl('VEND-001');
 * console.log(`Access Control: ${score}/100`);
 * ```
 */
export declare function assessAccessControl(vendorId: string): Promise<number>;
/**
 * Assesses compliance with security standards.
 *
 * @param {string} vendorId - Vendor identifier
 * @returns {Promise<number>} Compliance score (0-100)
 *
 * @example
 * ```typescript
 * const score = await assessCompliance('VEND-001');
 * console.log(`Compliance: ${score}/100`);
 * ```
 */
export declare function assessCompliance(vendorId: string): Promise<number>;
/**
 * Generates security recommendations based on findings.
 *
 * @param {SecurityFinding[]} findings - Security findings
 * @returns {string[]} List of recommendations
 *
 * @example
 * ```typescript
 * const recommendations = generateSecurityRecommendations(findings);
 * recommendations.forEach(rec => console.log(rec));
 * ```
 */
export declare function generateSecurityRecommendations(findings: SecurityFinding[]): string[];
/**
 * Calculates next review date based on assessment type and rating.
 *
 * @param {string} assessmentType - Type of assessment
 * @param {string} securityRating - Security rating
 * @returns {Date} Next review date
 *
 * @example
 * ```typescript
 * const nextDate = calculateNextReviewDate('periodic', 'B');
 * console.log(`Next review: ${nextDate.toISOString()}`);
 * ```
 */
export declare function calculateNextReviewDate(assessmentType: string, securityRating: string): Date;
/**
 * Generates Software Bill of Materials for an application.
 *
 * @param {string} applicationName - Application name
 * @param {string} version - Application version
 * @param {string} format - SBOM format
 * @returns {Promise<SBOM>} Generated SBOM
 *
 * @example
 * ```typescript
 * const sbom = await generateSBOM('HealthcarePortal', '2.1.0', 'CycloneDX');
 * console.log(`Components: ${sbom.components.length}`);
 * console.log(`Vulnerabilities: ${sbom.vulnerabilities.length}`);
 * ```
 */
export declare function generateSBOM(applicationName: string, version: string, format: 'CycloneDX' | 'SPDX' | 'SWID'): Promise<SBOM>;
/**
 * Scans application to identify all components.
 *
 * @param {string} applicationName - Application name
 * @param {string} version - Application version
 * @returns {Promise<SBOMComponent[]>} List of components
 *
 * @example
 * ```typescript
 * const components = await scanApplicationComponents('App', '1.0.0');
 * console.log(`Found ${components.length} components`);
 * ```
 */
export declare function scanApplicationComponents(applicationName: string, version: string): Promise<SBOMComponent[]>;
/**
 * Maps dependencies between components.
 *
 * @param {SBOMComponent[]} components - List of components
 * @returns {Promise<SBOMDependency[]>} Dependency relationships
 *
 * @example
 * ```typescript
 * const dependencies = await mapDependencies(components);
 * console.log(`Mapped ${dependencies.length} dependencies`);
 * ```
 */
export declare function mapDependencies(components: SBOMComponent[]): Promise<SBOMDependency[]>;
/**
 * Scans components for known vulnerabilities.
 *
 * @param {SBOMComponent[]} components - Components to scan
 * @returns {Promise<SBOMVulnerability[]>} Found vulnerabilities
 *
 * @example
 * ```typescript
 * const vulns = await scanVulnerabilities(components);
 * console.log(`Found ${vulns.length} vulnerabilities`);
 * ```
 */
export declare function scanVulnerabilities(components: SBOMComponent[]): Promise<SBOMVulnerability[]>;
/**
 * Validates SBOM against format specification.
 *
 * @param {SBOM} sbom - SBOM to validate
 * @returns {Promise<boolean>} Validation result
 *
 * @example
 * ```typescript
 * const isValid = await validateSBOM(sbom);
 * console.log(`SBOM valid: ${isValid}`);
 * ```
 */
export declare function validateSBOM(sbom: SBOM): Promise<boolean>;
/**
 * Compares two SBOMs to identify changes.
 *
 * @param {SBOM} sbom1 - First SBOM
 * @param {SBOM} sbom2 - Second SBOM
 * @returns {object} Comparison result
 *
 * @example
 * ```typescript
 * const diff = compareSBOMs(oldSbom, newSbom);
 * console.log(`Added: ${diff.added.length}, Removed: ${diff.removed.length}`);
 * ```
 */
export declare function compareSBOMs(sbom1: SBOM, sbom2: SBOM): {
    added: SBOMComponent[];
    removed: SBOMComponent[];
    updated: SBOMComponent[];
    unchanged: SBOMComponent[];
};
/**
 * Exports SBOM to specified format.
 *
 * @param {SBOM} sbom - SBOM to export
 * @param {string} exportFormat - Export format
 * @returns {string} Exported SBOM data
 *
 * @example
 * ```typescript
 * const json = exportSBOM(sbom, 'json');
 * const xml = exportSBOM(sbom, 'xml');
 * ```
 */
export declare function exportSBOM(sbom: SBOM, exportFormat: 'json' | 'xml' | 'csv'): string;
/**
 * Imports SBOM from external source.
 *
 * @param {string} data - SBOM data
 * @param {string} format - Data format
 * @returns {Promise<SBOM>} Parsed SBOM
 *
 * @example
 * ```typescript
 * const sbom = await importSBOM(jsonData, 'json');
 * console.log(`Imported SBOM: ${sbom.sbomId}`);
 * ```
 */
export declare function importSBOM(data: string, format: 'json' | 'xml'): Promise<SBOM>;
/**
 * Enriches SBOM with additional vulnerability data.
 *
 * @param {SBOM} sbom - SBOM to enrich
 * @returns {Promise<SBOM>} Enriched SBOM
 *
 * @example
 * ```typescript
 * const enriched = await enrichSBOMWithVulnerabilities(sbom);
 * console.log(`Total vulnerabilities: ${enriched.vulnerabilities.length}`);
 * ```
 */
export declare function enrichSBOMWithVulnerabilities(sbom: SBOM): Promise<SBOM>;
/**
 * Archives SBOM for historical tracking.
 *
 * @param {SBOM} sbom - SBOM to archive
 * @param {string} archiveLocation - Archive location
 * @returns {Promise<string>} Archive ID
 *
 * @example
 * ```typescript
 * const archiveId = await archiveSBOM(sbom, 's3://sbom-archive/');
 * console.log(`Archived as: ${archiveId}`);
 * ```
 */
export declare function archiveSBOM(sbom: SBOM, archiveLocation: string): Promise<string>;
/**
 * Tracks dependencies and their vulnerabilities.
 *
 * @param {string} packageName - Package name
 * @param {string} version - Package version
 * @returns {Promise<DependencyVulnerability>} Vulnerability tracking data
 *
 * @example
 * ```typescript
 * const depVuln = await trackDependencyVulnerabilities('express', '4.17.1');
 * console.log(`Risk Score: ${depVuln.riskScore}`);
 * ```
 */
export declare function trackDependencyVulnerabilities(packageName: string, version: string): Promise<DependencyVulnerability>;
/**
 * Checks CVE database for known vulnerabilities.
 *
 * @param {string} componentName - Component name
 * @param {string} version - Component version
 * @returns {Promise<SBOMVulnerability[]>} List of vulnerabilities
 *
 * @example
 * ```typescript
 * const vulns = await checkCVEDatabase('lodash', '4.17.15');
 * console.log(`Found ${vulns.length} CVEs`);
 * ```
 */
export declare function checkCVEDatabase(componentName: string, version: string): Promise<SBOMVulnerability[]>;
/**
 * Calculates CVSS score for a vulnerability.
 *
 * @param {object} vulnerability - Vulnerability details
 * @returns {number} CVSS score (0-10)
 *
 * @example
 * ```typescript
 * const score = calculateCVSSScore({
 *   attackVector: 'network',
 *   attackComplexity: 'low',
 *   privilegesRequired: 'none',
 *   userInteraction: 'none',
 *   scope: 'unchanged',
 *   confidentialityImpact: 'high',
 *   integrityImpact: 'high',
 *   availabilityImpact: 'high'
 * });
 * console.log(`CVSS: ${score}`);
 * ```
 */
export declare function calculateCVSSScore(vulnerability: {
    attackVector: 'network' | 'adjacent' | 'local' | 'physical';
    attackComplexity: 'low' | 'high';
    privilegesRequired: 'none' | 'low' | 'high';
    userInteraction: 'none' | 'required';
    scope: 'unchanged' | 'changed';
    confidentialityImpact: 'none' | 'low' | 'high';
    integrityImpact: 'none' | 'low' | 'high';
    availabilityImpact: 'none' | 'low' | 'high';
}): number;
/**
 * Prioritizes vulnerabilities for remediation.
 *
 * @param {SBOMVulnerability[]} vulnerabilities - List of vulnerabilities
 * @returns {SBOMVulnerability[]} Sorted by priority
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeVulnerabilities(vulnerabilities);
 * console.log(`Top priority: ${prioritized[0].cveId}`);
 * ```
 */
export declare function prioritizeVulnerabilities(vulnerabilities: SBOMVulnerability[]): SBOMVulnerability[];
/**
 * Detects zero-day threats in dependencies.
 *
 * @param {string} packageName - Package name
 * @param {string} version - Package version
 * @returns {Promise<boolean>} True if zero-day detected
 *
 * @example
 * ```typescript
 * const hasZeroDay = await detectZeroDayThreats('package', '1.0.0');
 * if (hasZeroDay) console.log('Zero-day threat detected!');
 * ```
 */
export declare function detectZeroDayThreats(packageName: string, version: string): Promise<boolean>;
/**
 * Predicts exploit likelihood for a vulnerability.
 *
 * @param {string} cveId - CVE identifier
 * @returns {Promise<number>} Exploit probability (0-100)
 *
 * @example
 * ```typescript
 * const probability = await predictExploitLikelihood('CVE-2024-1234');
 * console.log(`Exploit probability: ${probability}%`);
 * ```
 */
export declare function predictExploitLikelihood(cveId: string): Promise<number>;
/**
 * Generates vulnerability report.
 *
 * @param {SBOMVulnerability[]} vulnerabilities - Vulnerabilities to report
 * @param {string} format - Report format
 * @returns {string} Generated report
 *
 * @example
 * ```typescript
 * const report = generateVulnerabilityReport(vulns, 'json');
 * console.log(report);
 * ```
 */
export declare function generateVulnerabilityReport(vulnerabilities: SBOMVulnerability[], format: 'json' | 'html' | 'pdf' | 'csv'): string;
/**
 * Monitors vulnerability lifecycle from discovery to remediation.
 *
 * @param {string} vulnerabilityId - Vulnerability ID
 * @returns {Promise<object>} Lifecycle status
 *
 * @example
 * ```typescript
 * const lifecycle = await monitorVulnerabilityLifecycle('VULN-001');
 * console.log(`Status: ${lifecycle.currentStage}`);
 * ```
 */
export declare function monitorVulnerabilityLifecycle(vulnerabilityId: string): Promise<{
    vulnerabilityId: string;
    currentStage: 'discovered' | 'analyzed' | 'patched' | 'verified' | 'closed';
    timeline: Array<{
        stage: string;
        timestamp: Date;
        performedBy: string;
    }>;
    daysOpen: number;
    slaStatus: 'within-sla' | 'approaching-breach' | 'breached';
}>;
/**
 * Calculates dependency risk score.
 *
 * @param {SBOMVulnerability[]} vulnerabilities - Dependencies vulnerabilities
 * @returns {number} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const risk = calculateDependencyRiskScore(vulnerabilities);
 * console.log(`Risk: ${risk}/100`);
 * ```
 */
export declare function calculateDependencyRiskScore(vulnerabilities: SBOMVulnerability[]): number;
/**
 * Calculates remediation priority.
 *
 * @param {SBOMVulnerability[]} vulnerabilities - Vulnerabilities
 * @param {number} riskScore - Risk score
 * @returns {number} Priority (1-10, 10 highest)
 *
 * @example
 * ```typescript
 * const priority = calculateRemediationPriority(vulns, 85);
 * console.log(`Priority: ${priority}/10`);
 * ```
 */
export declare function calculateRemediationPriority(vulnerabilities: SBOMVulnerability[], riskScore: number): number;
/**
 * Detects supply chain attack indicators.
 *
 * @param {string} componentId - Component identifier
 * @param {string} version - Component version
 * @returns {Promise<SupplyChainAttackIndicator | null>} Attack indicator if detected
 *
 * @example
 * ```typescript
 * const indicator = await detectSupplyChainAttack('comp-001', '1.0.0');
 * if (indicator) console.log(`Attack detected: ${indicator.attackType}`);
 * ```
 */
export declare function detectSupplyChainAttack(componentId: string, version: string): Promise<SupplyChainAttackIndicator | null>;
/**
 * Detects backdoors in components.
 *
 * @param {string} componentId - Component ID
 * @param {string} version - Component version
 * @returns {Promise<boolean>} True if backdoor detected
 *
 * @example
 * ```typescript
 * const hasBackdoor = await detectBackdoor('comp-001', '1.0.0');
 * ```
 */
export declare function detectBackdoor(componentId: string, version: string): Promise<boolean>;
/**
 * Detects malicious package updates.
 *
 * @param {string} componentId - Component ID
 * @param {string} version - Component version
 * @returns {Promise<boolean>} True if malicious update detected
 *
 * @example
 * ```typescript
 * const isMalicious = await detectMaliciousUpdate('comp-001', '2.0.0');
 * ```
 */
export declare function detectMaliciousUpdate(componentId: string, version: string): Promise<boolean>;
/**
 * Detects dependency confusion attacks.
 *
 * @param {string} packageName - Package name
 * @returns {Promise<boolean>} True if dependency confusion detected
 *
 * @example
 * ```typescript
 * const isConfused = await detectDependencyConfusion('internal-package');
 * ```
 */
export declare function detectDependencyConfusion(packageName: string): Promise<boolean>;
/**
 * Detects typosquatting attempts.
 *
 * @param {string} packageName - Package name
 * @returns {Promise<boolean>} True if typosquatting detected
 *
 * @example
 * ```typescript
 * const isTyposquat = await detectTyposquatting('expresss'); // Note extra 's'
 * ```
 */
export declare function detectTyposquatting(packageName: string): Promise<boolean>;
/**
 * Detects counterfeit components.
 *
 * @param {string} componentId - Component ID
 * @param {object} metadata - Component metadata
 * @returns {Promise<CounterfeitDetectionResult>} Detection result
 *
 * @example
 * ```typescript
 * const result = await detectCounterfeitComponent('comp-001', metadata);
 * console.log(`Counterfeit: ${result.isCounterfeit}`);
 * ```
 */
export declare function detectCounterfeitComponent(componentId: string, metadata: Record<string, any>): Promise<CounterfeitDetectionResult>;
/**
 * Monitors third-party risk continuously.
 *
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<ThirdPartyRiskAssessment>} Risk assessment
 *
 * @example
 * ```typescript
 * const risk = await monitorThirdPartyRisk('VEND-001');
 * console.log(`Risk level: ${risk.riskLevel}`);
 * ```
 */
export declare function monitorThirdPartyRisk(vendorId: string): Promise<ThirdPartyRiskAssessment>;
/**
 * Calculates supplier security rating.
 *
 * @param {string} supplierId - Supplier ID
 * @returns {Promise<SupplierSecurityRating>} Security rating
 *
 * @example
 * ```typescript
 * const rating = await calculateSupplierSecurityRating('SUP-001');
 * console.log(`Grade: ${rating.grade}, Score: ${rating.rating}`);
 * ```
 */
export declare function calculateSupplierSecurityRating(supplierId: string): Promise<SupplierSecurityRating>;
declare const _default: {
    createVendorSecurityProfileModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            vendorId: string;
            vendorName: string;
            securityRating: string;
            overallRiskScore: number;
            lastAssessmentDate: Date | null;
            nextReviewDate: Date | null;
            certifications: string[];
            complianceStandards: string[];
            riskLevel: string;
            continuousMonitoring: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createSBOMRegistryModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            sbomId: string;
            applicationName: string;
            version: string;
            format: string;
            formatVersion: string;
            componentCount: number;
            vulnerabilityCount: number;
            generatedAt: Date;
            sbomData: Record<string, any>;
            sbomHash: string | null;
            validationStatus: string;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createSupplyChainIncidentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            incidentId: string;
            attackType: string;
            severity: string;
            detectedAt: Date;
            affectedComponents: string[];
            indicators: string[];
            confidence: number;
            status: string;
            mitigationSteps: string[];
            resolvedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    assessVendorSecurity: typeof assessVendorSecurity;
    calculateSecurityRating: typeof calculateSecurityRating;
    assessNetworkSecurity: typeof assessNetworkSecurity;
    assessDataProtection: typeof assessDataProtection;
    assessIncidentResponse: typeof assessIncidentResponse;
    assessAccessControl: typeof assessAccessControl;
    assessCompliance: typeof assessCompliance;
    generateSecurityRecommendations: typeof generateSecurityRecommendations;
    calculateNextReviewDate: typeof calculateNextReviewDate;
    generateSBOM: typeof generateSBOM;
    scanApplicationComponents: typeof scanApplicationComponents;
    mapDependencies: typeof mapDependencies;
    scanVulnerabilities: typeof scanVulnerabilities;
    validateSBOM: typeof validateSBOM;
    compareSBOMs: typeof compareSBOMs;
    exportSBOM: typeof exportSBOM;
    importSBOM: typeof importSBOM;
    enrichSBOMWithVulnerabilities: typeof enrichSBOMWithVulnerabilities;
    archiveSBOM: typeof archiveSBOM;
    trackDependencyVulnerabilities: typeof trackDependencyVulnerabilities;
    checkCVEDatabase: typeof checkCVEDatabase;
    calculateCVSSScore: typeof calculateCVSSScore;
    prioritizeVulnerabilities: typeof prioritizeVulnerabilities;
    detectZeroDayThreats: typeof detectZeroDayThreats;
    predictExploitLikelihood: typeof predictExploitLikelihood;
    generateVulnerabilityReport: typeof generateVulnerabilityReport;
    monitorVulnerabilityLifecycle: typeof monitorVulnerabilityLifecycle;
    calculateDependencyRiskScore: typeof calculateDependencyRiskScore;
    calculateRemediationPriority: typeof calculateRemediationPriority;
    detectSupplyChainAttack: typeof detectSupplyChainAttack;
    detectBackdoor: typeof detectBackdoor;
    detectMaliciousUpdate: typeof detectMaliciousUpdate;
    detectDependencyConfusion: typeof detectDependencyConfusion;
    detectTyposquatting: typeof detectTyposquatting;
    detectCounterfeitComponent: typeof detectCounterfeitComponent;
    monitorThirdPartyRisk: typeof monitorThirdPartyRisk;
    calculateSupplierSecurityRating: typeof calculateSupplierSecurityRating;
};
export default _default;
//# sourceMappingURL=supply-chain-security-kit.d.ts.map
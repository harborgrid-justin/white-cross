/**
 * LOC: THMI1234567
 * File: /reuse/threat/threat-ioc-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/threat/threat-indicators-kit.ts (IOC types and validation)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - IOC management controllers
 *   - Security analytics modules
 */
/**
 * File: /reuse/threat/threat-ioc-management-kit.ts
 * Locator: WC-UTL-THMI-001
 * Purpose: Comprehensive IOC Management Utilities - collection, search, tagging, relationships, analytics
 *
 * Upstream: /reuse/threat/threat-indicators-kit.ts for IOC types
 * Downstream: ../backend/*, threat services, security controllers, analytics engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Swagger/OpenAPI, Sequelize
 * Exports: 40 utility functions for IOC management, search, bulk operations, analytics
 *
 * LLM Context: Comprehensive IOC management utilities for collecting, organizing, and analyzing threat indicators in White Cross system.
 * Provides IOC collection, aggregation, advanced search, filtering, tagging, categorization, expiration management, relationship mapping,
 * import/export capabilities, bulk operations, and analytics. Essential for operational threat intelligence management with
 * HIPAA compliance for healthcare security operations.
 */
/**
 * Re-export core types from threat-indicators-kit
 */
type IocType = 'ip' | 'domain' | 'hash' | 'url' | 'email' | 'file' | 'registry' | 'mutex' | 'user-agent' | 'certificate';
type ConfidenceLevel = 'low' | 'medium' | 'high' | 'critical';
type IocStatus = 'active' | 'inactive' | 'expired' | 'pending' | 'false-positive';
type ThreatSeverity = 'informational' | 'low' | 'medium' | 'high' | 'critical';
interface IocIndicator {
    id?: string;
    type: IocType;
    value: string;
    confidence: ConfidenceLevel;
    severity: ThreatSeverity;
    status: IocStatus;
    firstSeen?: Date;
    lastSeen?: Date;
    expiresAt?: Date;
    source?: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
}
/**
 * IOC collection configuration
 */
interface IocCollectionConfig {
    sources: string[];
    autoEnrich?: boolean;
    autoValidate?: boolean;
    deduplication?: boolean;
    defaultTtlDays?: number;
    confidenceThreshold?: ConfidenceLevel;
}
/**
 * Collects IOCs from multiple sources with configuration.
 *
 * @param {IocIndicator[]} iocs - Array of IOC indicators to collect
 * @param {IocCollectionConfig} config - Collection configuration
 * @returns {Promise<IocIndicator[]>} Collected and processed IOCs
 *
 * @example
 * ```typescript
 * const iocs = [{ type: 'ip', value: '1.2.3.4', ... }, ...];
 * const config = {
 *   sources: ['osint', 'internal'],
 *   autoEnrich: true,
 *   deduplication: true,
 *   defaultTtlDays: 30
 * };
 * const collected = await collectIocs(iocs, config);
 * ```
 */
export declare const collectIocs: (iocs: IocIndicator[], config: IocCollectionConfig) => Promise<IocIndicator[]>;
export {};
//# sourceMappingURL=threat-ioc-management-kit.d.ts.map
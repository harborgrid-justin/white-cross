/**
 * LOC: FINCONS1234567
 * File: /reuse/financial/financial-consolidation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Financial consolidation services
 *   - Multi-entity reporting
 *   - Elimination processing
 *   - Currency conversion modules
 */
/**
 * File: /reuse/financial/financial-consolidation-kit.ts
 * Locator: WC-FIN-FINCONS-001
 * Purpose: USACE CEFMS-level Financial Consolidation - multi-entity consolidation, eliminations, currency conversion, intercompany reconciliation
 *
 * Upstream: Independent utility module for financial consolidation
 * Downstream: ../backend/financial/*, consolidation controllers, reporting services, elimination engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ utility functions for consolidation, eliminations, currency conversion, intercompany reconciliation
 *
 * LLM Context: Enterprise-grade financial consolidation utilities for multi-entity organizations.
 * Implements USACE CEFMS-level consolidation processing, automatic intercompany eliminations, multi-currency
 * translation, consolidation hierarchies, ownership percentage calculations, minority interest, equity method
 * accounting, push-down accounting, consolidation journals, elimination entries, and consolidated reporting.
 */
import { Sequelize, Transaction } from 'sequelize';
export declare const createConsolidationEntityModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        readonly children?: any[];
        readonly eliminations?: any[];
    };
};
export declare const createConsolidation: (data: any, transaction?: Transaction) => Promise<any>;
declare const _default: {
    createConsolidationEntityModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            readonly children?: any[];
            readonly eliminations?: any[];
        };
    };
    createConsolidation: (data: any, transaction?: Transaction) => Promise<any>;
};
export default _default;
//# sourceMappingURL=financial-consolidation-kit.d.ts.map
/**
 * LOC: FNDACCT1234567
 * File: /reuse/financial/fund-accounting-controls-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Financial management services
 *   - Fund accounting controllers
 *   - Budget execution modules
 *   - Grant management systems
 */
/**
 * File: /reuse/financial/fund-accounting-controls-kit.ts
 * Locator: WC-FIN-FNDACCT-001
 * Purpose: USACE CEFMS-level Fund Accounting Controls - fund types, balances, transfers, grants, appropriations, restrictions
 *
 * Upstream: Independent utility module for federal fund accounting and control
 * Downstream: ../backend/financial/*, budget services, appropriations, grant tracking, fund management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ utility functions for fund accounting, appropriations, allotments, obligations, expenditures, grant tracking
 *
 * LLM Context: Enterprise-grade fund accounting controls for federal financial management systems.
 * Implements USACE CEFMS-level fund control, appropriations management, allotment tracking, obligation processing,
 * expenditure control, grant lifecycle management, restricted/unrestricted fund segregation, inter-fund transfers,
 * fund balance validation, appropriation authority, anti-deficiency checks, budget execution, and USSGL compliance.
 */
import { Sequelize, Transaction } from 'sequelize';
export declare const createFundModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        fundCode: string;
        fundName: string;
        fundType: string;
        readonly grants?: any[];
        readonly transfersOut?: any[];
        readonly transfersIn?: any[];
    };
};
export declare const createFund: (Fund: any, fundData: any, transaction?: Transaction) => Promise<any>;
declare const _default: {
    createFundModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            fundCode: string;
            fundName: string;
            fundType: string;
            readonly grants?: any[];
            readonly transfersOut?: any[];
            readonly transfersIn?: any[];
        };
    };
    createFund: (Fund: any, fundData: any, transaction?: Transaction) => Promise<any>;
};
export default _default;
//# sourceMappingURL=fund-accounting-controls-kit.d.ts.map
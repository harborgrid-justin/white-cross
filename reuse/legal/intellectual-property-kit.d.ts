/**
 * LOC: IP_MGMT_KIT_001
 * File: /reuse/legal/intellectual-property-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - axios
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Legal management modules
 *   - IP portfolio controllers
 *   - Patent search services
 *   - Trademark monitoring services
 *   - Copyright management services
 */
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'sequelize-typescript';
import { z } from 'zod';
/**
 * IP asset types
 */
export declare enum IPAssetType {
    PATENT = "patent",
    TRADEMARK = "trademark",
    COPYRIGHT = "copyright",
    TRADE_SECRET = "trade_secret",
    DESIGN = "design",
    DOMAIN_NAME = "domain_name",
    INDUSTRIAL_DESIGN = "industrial_design",
    PLANT_VARIETY = "plant_variety",
    GEOGRAPHICAL_INDICATION = "geographical_indication"
}
/**
 * Patent types
 */
export declare enum PatentType {
    UTILITY = "utility",
    DESIGN = "design",
    PLANT = "plant",
    PROVISIONAL = "provisional",
    CONTINUATION = "continuation",
    DIVISIONAL = "divisional",
    REISSUE = "reissue",
    PCT = "pct"
}
/**
 * Patent status lifecycle
 */
export declare enum PatentStatus {
    IDEA = "idea",
    PRIOR_ART_SEARCH = "prior_art_search",
    DRAFTING = "drafting",
    FILED = "filed",
    PENDING = "pending",
    PUBLISHED = "published",
    EXAMINATION = "examination",
    OFFICE_ACTION = "office_action",
    ALLOWED = "allowed",
    GRANTED = "granted",
    ACTIVE = "active",
    EXPIRED = "expired",
    ABANDONED = "abandoned",
    REJECTED = "rejected",
    REVOKED = "revoked"
}
/**
 * Trademark types
 */
export declare enum TrademarkType {
    WORD_MARK = "word_mark",
    LOGO = "logo",
    COMPOSITE = "composite",
    SOUND_MARK = "sound_mark",
    COLOR_MARK = "color_mark",
    THREE_D_MARK = "three_d_mark",
    MOTION_MARK = "motion_mark",
    HOLOGRAM = "hologram",
    SERVICE_MARK = "service_mark"
}
/**
 * Trademark status
 */
export declare enum TrademarkStatus {
    SEARCH = "search",
    APPLICATION_PREP = "application_prep",
    FILED = "filed",
    PENDING = "pending",
    PUBLISHED = "published",
    OPPOSED = "opposed",
    REGISTERED = "registered",
    ACTIVE = "active",
    RENEWED = "renewed",
    EXPIRED = "expired",
    CANCELLED = "cancelled",
    ABANDONED = "abandoned"
}
/**
 * Copyright types
 */
export declare enum CopyrightType {
    LITERARY = "literary",
    MUSICAL = "musical",
    DRAMATIC = "dramatic",
    CHOREOGRAPHIC = "choreographic",
    PICTORIAL = "pictorial",
    GRAPHIC = "graphic",
    SCULPTURAL = "sculptural",
    AUDIOVISUAL = "audiovisual",
    SOUND_RECORDING = "sound_recording",
    ARCHITECTURAL = "architectural",
    SOFTWARE = "software",
    DATABASE = "database"
}
/**
 * Copyright status
 */
export declare enum CopyrightStatus {
    CREATED = "created",
    REGISTRATION_PENDING = "registration_pending",
    REGISTERED = "registered",
    ACTIVE = "active",
    PUBLIC_DOMAIN = "public_domain",
    EXPIRED = "expired",
    TRANSFERRED = "transferred"
}
/**
 * IP jurisdiction
 */
export declare enum IPJurisdiction {
    US = "us",
    EP = "ep",
    JP = "jp",
    CN = "cn",
    GB = "gb",
    CA = "ca",
    AU = "au",
    IN = "in",
    BR = "br",
    KR = "kr",
    PCT = "pct",
    MADRID = "madrid",
    INTERNATIONAL = "international"
}
/**
 * IP action types for tracking
 */
export declare enum IPActionType {
    FILING = "filing",
    EXAMINATION = "examination",
    OFFICE_ACTION = "office_action",
    RESPONSE = "response",
    AMENDMENT = "amendment",
    PAYMENT = "payment",
    RENEWAL = "renewal",
    ASSIGNMENT = "assignment",
    LICENSE = "license",
    LITIGATION = "litigation",
    OPPOSITION = "opposition",
    MAINTENANCE = "maintenance"
}
/**
 * Patent TypeScript interface
 */
export interface IPatent {
    id: string;
    patentNumber?: string;
    applicationNumber?: string;
    title: string;
    patentType: PatentType;
    status: PatentStatus;
    jurisdiction: IPJurisdiction;
    filingDate?: Date;
    publicationDate?: Date;
    grantDate?: Date;
    expirationDate?: Date;
    abstract?: string;
    claims?: string;
    description?: string;
    inventors: string[];
    assignee?: string;
    ipcClassifications?: string[];
    priorityDate?: Date;
    familyId?: string;
    estimatedValue?: number;
    maintenanceFees?: any;
    metadata?: Record<string, any>;
}
/**
 * Trademark TypeScript interface
 */
export interface ITrademark {
    id: string;
    registrationNumber?: string;
    applicationNumber?: string;
    markText?: string;
    trademarkType: TrademarkType;
    status: TrademarkStatus;
    jurisdiction: IPJurisdiction;
    filingDate?: Date;
    registrationDate?: Date;
    renewalDate?: Date;
    expirationDate?: Date;
    niceClasses?: number[];
    goodsServices?: string;
    owner?: string;
    imageUrl?: string;
    disclaimer?: string;
    metadata?: Record<string, any>;
}
/**
 * Copyright TypeScript interface
 */
export interface ICopyright {
    id: string;
    registrationNumber?: string;
    title: string;
    copyrightType: CopyrightType;
    status: CopyrightStatus;
    jurisdiction: IPJurisdiction;
    creationDate?: Date;
    publicationDate?: Date;
    registrationDate?: Date;
    authors: string[];
    owner?: string;
    workDescription?: string;
    isWorkForHire: boolean;
    derivative?: string;
    metadata?: Record<string, any>;
}
/**
 * Prior art search interface
 */
export interface IPriorArtSearch {
    id: string;
    patentId?: string;
    searchQuery: string;
    searchDate: Date;
    databases: string[];
    keywords?: string[];
    classifications?: string[];
    results?: any[];
    relevanceScores?: Record<string, number>;
    metadata?: Record<string, any>;
}
/**
 * IP portfolio interface
 */
export interface IPPortfolio {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    patents?: string[];
    trademarks?: string[];
    copyrights?: string[];
    totalValue?: number;
    lastValuationDate?: Date;
    metadata?: Record<string, any>;
}
export declare const PatentSchema: any;
export declare const TrademarkSchema: any;
export declare const CopyrightSchema: any;
export declare const PriorArtSearchSchema: any;
export declare const IPPortfolioSchema: any;
/**
 * Patent database model
 */
export declare class Patent extends Model<IPatent> implements IPatent {
    id: string;
    patentNumber?: string;
    applicationNumber?: string;
    title: string;
    patentType: PatentType;
    status: PatentStatus;
    jurisdiction: IPJurisdiction;
    filingDate?: Date;
    publicationDate?: Date;
    grantDate?: Date;
    expirationDate?: Date;
    abstract?: string;
    claims?: string;
    description?: string;
    inventors: string[];
    assignee?: string;
    ipcClassifications?: string[];
    priorityDate?: Date;
    familyId?: string;
    estimatedValue?: number;
    maintenanceFees?: any;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    priorArtSearches?: PriorArtSearch[];
    actions?: IPAction[];
}
/**
 * Trademark database model
 */
export declare class Trademark extends Model<ITrademark> implements ITrademark {
    id: string;
    registrationNumber?: string;
    applicationNumber?: string;
    markText?: string;
    trademarkType: TrademarkType;
    status: TrademarkStatus;
    jurisdiction: IPJurisdiction;
    filingDate?: Date;
    registrationDate?: Date;
    renewalDate?: Date;
    expirationDate?: Date;
    niceClasses?: number[];
    goodsServices?: string;
    owner?: string;
    imageUrl?: string;
    disclaimer?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    actions?: IPAction[];
}
/**
 * Copyright database model
 */
export declare class Copyright extends Model<ICopyright> implements ICopyright {
    id: string;
    registrationNumber?: string;
    title: string;
    copyrightType: CopyrightType;
    status: CopyrightStatus;
    jurisdiction: IPJurisdiction;
    creationDate?: Date;
    publicationDate?: Date;
    registrationDate?: Date;
    authors: string[];
    owner?: string;
    workDescription?: string;
    isWorkForHire: boolean;
    derivative?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    actions?: IPAction[];
}
/**
 * Prior art search database model
 */
export declare class PriorArtSearch extends Model<IPriorArtSearch> implements IPriorArtSearch {
    id: string;
    patentId?: string;
    searchQuery: string;
    searchDate: Date;
    databases: string[];
    keywords?: string[];
    classifications?: string[];
    results?: any[];
    relevanceScores?: Record<string, number>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    patent?: Patent;
}
/**
 * IP portfolio database model
 */
export declare class IPPortfolio extends Model<IPPortfolio> implements IPPortfolio {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    patents?: string[];
    trademarks?: string[];
    copyrights?: string[];
    totalValue?: number;
    lastValuationDate?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * IP action/event tracking model
 */
export declare class IPAction extends Model {
    id: string;
    patentId?: string;
    trademarkId?: string;
    copyrightId?: string;
    actionType: IPActionType;
    actionDate: Date;
    dueDate?: Date;
    description?: string;
    status?: string;
    responsibleParty?: string;
    cost?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    patent?: Patent;
    trademark?: Trademark;
    copyright?: Copyright;
}
export declare const ipManagementConfig: any;
/**
 * Patent search and management service
 */
export declare class PatentService {
    private sequelize;
    private configService;
    private readonly logger;
    constructor(sequelize: any, configService: ConfigService);
    /**
     * 1. Create a new patent record
     */
    createPatent(data: z.infer<typeof PatentSchema>): Promise<Patent>;
    /**
     * 2. Search patents by criteria
     */
    searchPatents(criteria: {
        query?: string;
        status?: PatentStatus;
        jurisdiction?: IPJurisdiction;
        patentType?: PatentType;
        inventors?: string[];
        assignee?: string;
        ipcClassification?: string;
        filingDateFrom?: Date;
        filingDateTo?: Date;
        limit?: number;
        offset?: number;
    }): Promise<{
        patents: Patent[];
        total: number;
    }>;
    /**
     * 3. Update patent status
     */
    updatePatentStatus(patentId: string, status: PatentStatus, metadata?: any): Promise<Patent>;
    /**
     * 4. Get patent by ID with related data
     */
    getPatentById(patentId: string): Promise<Patent>;
    /**
     * 5. Get patents expiring soon
     */
    getPatentsExpiringSoon(daysAhead?: number): Promise<Patent[]>;
    /**
     * 6. Calculate patent maintenance fees
     */
    calculateMaintenanceFees(patentId: string): Promise<{
        fees: any[];
        totalCost: number;
    }>;
    /**
     * 7. Get patent family tree
     */
    getPatentFamily(patentId: string): Promise<Patent[]>;
    /**
     * 8. Analyze patent citations
     */
    analyzePatentCitations(patentId: string): Promise<{
        forwardCitations: number;
        backwardCitations: number;
        citationScore: number;
    }>;
}
/**
 * Prior art search service
 */
export declare class PriorArtSearchService {
    private sequelize;
    private configService;
    private readonly logger;
    constructor(sequelize: any, configService: ConfigService);
    /**
     * 9. Conduct prior art search
     */
    conductPriorArtSearch(data: z.infer<typeof PriorArtSearchSchema>): Promise<PriorArtSearch>;
    /**
     * 10. Get prior art search results
     */
    getPriorArtSearchResults(searchId: string): Promise<PriorArtSearch>;
    /**
     * 11. Search similar patents (AI-powered similarity)
     */
    searchSimilarPatents(patentId: string, limit?: number): Promise<any[]>;
    private searchExternalDatabases;
    private calculateRelevanceScores;
    private calculateSimilarityScore;
}
/**
 * Trademark monitoring and management service
 */
export declare class TrademarkService {
    private sequelize;
    private configService;
    private readonly logger;
    constructor(sequelize: any, configService: ConfigService);
    /**
     * 12. Create a new trademark record
     */
    createTrademark(data: z.infer<typeof TrademarkSchema>): Promise<Trademark>;
    /**
     * 13. Search trademarks by criteria
     */
    searchTrademarks(criteria: {
        query?: string;
        status?: TrademarkStatus;
        jurisdiction?: IPJurisdiction;
        trademarkType?: TrademarkType;
        niceClass?: number;
        owner?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        trademarks: Trademark[];
        total: number;
    }>;
    /**
     * 14. Monitor for conflicting trademarks
     */
    monitorTrademarkConflicts(trademarkId: string): Promise<Trademark[]>;
    /**
     * 15. Get trademarks requiring renewal
     */
    getTrademarksRequiringRenewal(daysAhead?: number): Promise<Trademark[]>;
    /**
     * 16. Update trademark status
     */
    updateTrademarkStatus(trademarkId: string, status: TrademarkStatus): Promise<Trademark>;
    /**
     * 17. Search trademark by image similarity
     */
    searchTrademarkByImage(imageUrl: string, jurisdiction?: IPJurisdiction): Promise<Trademark[]>;
    private calculateTrademarkSimilarity;
}
/**
 * Copyright management service
 */
export declare class CopyrightService {
    private sequelize;
    private readonly logger;
    constructor(sequelize: any);
    /**
     * 18. Create a new copyright record
     */
    createCopyright(data: z.infer<typeof CopyrightSchema>): Promise<Copyright>;
    /**
     * 19. Search copyrights by criteria
     */
    searchCopyrights(criteria: {
        query?: string;
        status?: CopyrightStatus;
        jurisdiction?: IPJurisdiction;
        copyrightType?: CopyrightType;
        author?: string;
        owner?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        copyrights: Copyright[];
        total: number;
    }>;
    /**
     * 20. Update copyright status
     */
    updateCopyrightStatus(copyrightId: string, status: CopyrightStatus): Promise<Copyright>;
    /**
     * 21. Calculate copyright term
     */
    calculateCopyrightTerm(copyrightId: string): Promise<{
        creationDate: Date;
        expirationDate: Date;
        yearsRemaining: number;
        termType: string;
    }>;
    /**
     * 22. Assess fair use for copyright
     */
    assessFairUse(copyrightId: string, useCase: {
        purpose: string;
        nature: string;
        amount: string;
        effect: string;
    }): Promise<{
        fairUseScore: number;
        factors: any;
        recommendation: string;
    }>;
    private scorePurpose;
    private scoreNature;
    private scoreAmount;
    private scoreEffect;
}
/**
 * IP portfolio tracking and analytics service
 */
export declare class IPPortfolioService {
    private sequelize;
    private configService;
    private readonly logger;
    constructor(sequelize: any, configService: ConfigService);
    /**
     * 23. Create IP portfolio
     */
    createPortfolio(data: z.infer<typeof IPPortfolioSchema>): Promise<IPPortfolio>;
    /**
     * 24. Add IP asset to portfolio
     */
    addAssetToPortfolio(portfolioId: string, assetType: IPAssetType, assetId: string): Promise<IPPortfolio>;
    /**
     * 25. Get portfolio summary with all assets
     */
    getPortfolioSummary(portfolioId: string): Promise<{
        portfolio: IPPortfolio;
        patents: Patent[];
        trademarks: Trademark[];
        copyrights: Copyright[];
        totalValue: number;
        assetCounts: Record<string, number>;
    }>;
    /**
     * 26. Valuate IP portfolio
     */
    valuatePortfolio(portfolioId: string, method?: 'cost' | 'market' | 'income'): Promise<{
        totalValue: number;
        breakdown: Record<string, number>;
        method: string;
        valuationDate: Date;
    }>;
    /**
     * 27. Analyze portfolio risk
     */
    analyzePortfolioRisk(portfolioId: string): Promise<{
        overallRisk: string;
        riskScore: number;
        factors: any;
        recommendations: string[];
    }>;
    /**
     * 28. Generate portfolio analytics report
     */
    generatePortfolioReport(portfolioId: string): Promise<any>;
    private groupBy;
}
/**
 * IP action and event tracking service
 */
export declare class IPActionService {
    private sequelize;
    private readonly logger;
    constructor(sequelize: any);
    /**
     * 29. Create IP action/event
     */
    createIPAction(data: {
        patentId?: string;
        trademarkId?: string;
        copyrightId?: string;
        actionType: IPActionType;
        actionDate: Date;
        dueDate?: Date;
        description?: string;
        status?: string;
        responsibleParty?: string;
        cost?: number;
        metadata?: Record<string, any>;
    }): Promise<IPAction>;
    /**
     * 30. Get upcoming IP actions (deadlines)
     */
    getUpcomingActions(daysAhead?: number): Promise<IPAction[]>;
    /**
     * 31. Get action history for IP asset
     */
    getActionHistory(assetType: IPAssetType, assetId: string): Promise<IPAction[]>;
    /**
     * 32. Calculate total IP maintenance costs
     */
    calculateMaintenanceCosts(portfolioId: string, yearAhead?: number): Promise<{
        totalCost: number;
        breakdown: any[];
        byType: Record<string, number>;
    }>;
}
/**
 * IP licensing and assignment service
 */
export declare class IPLicensingService {
    private sequelize;
    private readonly logger;
    constructor(sequelize: any);
    /**
     * 33. Create IP license agreement
     */
    createLicenseAgreement(data: {
        assetType: IPAssetType;
        assetId: string;
        licensor: string;
        licensee: string;
        licenseType: 'exclusive' | 'non-exclusive' | 'sole';
        territory?: string[];
        field?: string;
        term?: number;
        royaltyRate?: number;
        upfrontFee?: number;
        minimumRoyalty?: number;
        sublicenseAllowed: boolean;
        metadata?: Record<string, any>;
    }): Promise<any>;
    /**
     * 34. Track IP assignment/transfer
     */
    trackIPAssignment(data: {
        assetType: IPAssetType;
        assetId: string;
        fromOwner: string;
        toOwner: string;
        transferDate: Date;
        consideration?: number;
        metadata?: Record<string, any>;
    }): Promise<any>;
    /**
     * 35. Calculate royalty payments
     */
    calculateRoyaltyPayments(licenseId: string, salesData: {
        period: string;
        grossSales: number;
        deductions?: number;
    }): Promise<{
        netSales: number;
        royaltyAmount: number;
        minimumRoyalty: number;
        paymentDue: number;
        dueDate: Date;
    }>;
}
/**
 * IP infringement detection service
 */
export declare class IPInfringementService {
    private sequelize;
    private readonly logger;
    constructor(sequelize: any);
    /**
     * 36. Monitor for potential infringement
     */
    monitorInfringement(assetType: IPAssetType, assetId: string): Promise<any[]>;
    /**
     * 37. Analyze freedom to operate
     */
    analyzeFreedomToOperate(technology: {
        description: string;
        jurisdiction: IPJurisdiction;
        ipcClassifications?: string[];
    }): Promise<{
        riskLevel: string;
        blockingPatents: Patent[];
        recommendations: string[];
    }>;
}
/**
 * IP strategic planning service
 */
export declare class IPStrategyService {
    private sequelize;
    private portfolioService;
    private readonly logger;
    constructor(sequelize: any, portfolioService: IPPortfolioService);
    /**
     * 38. Generate patent landscape analysis
     */
    generatePatentLandscape(criteria: {
        technology: string;
        jurisdiction?: IPJurisdiction;
        ipcClassifications?: string[];
        yearFrom?: number;
        yearTo?: number;
    }): Promise<{
        totalPatents: number;
        topAssignees: any[];
        filingTrends: any[];
        technologyClusters: any[];
        whiteSpaces: string[];
    }>;
    /**
     * 39. Generate IP competitive intelligence report
     */
    generateCompetitiveIntelligence(competitorIds: string[]): Promise<{
        competitors: any[];
        comparativeAnalysis: any;
        strategicInsights: string[];
    }>;
    /**
     * 40. Recommend IP portfolio optimization
     */
    recommendPortfolioOptimization(portfolioId: string): Promise<{
        currentState: any;
        recommendations: any[];
        priorityActions: string[];
        estimatedSavings: number;
    }>;
}
export declare class IPManagementModule {
    static forRoot(): DynamicModule;
}
export declare const IPManagementModels: (typeof Patent | typeof Trademark | typeof Copyright | typeof PriorArtSearch | typeof IPPortfolio | typeof IPAction)[];
export declare const IPManagementServices: (typeof PatentService | typeof PriorArtSearchService | typeof TrademarkService | typeof CopyrightService | typeof IPPortfolioService | typeof IPActionService | typeof IPLicensingService | typeof IPInfringementService | typeof IPStrategyService)[];
//# sourceMappingURL=intellectual-property-kit.d.ts.map
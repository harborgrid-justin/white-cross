"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseOptimizationService = void 0;
const common_1 = require("@nestjs/common");
const IndexManagement = __importStar(require("./index-management.service"));
const QueryOptimization = __importStar(require("./query-optimization.service"));
const StatisticsAnalysis = __importStar(require("./statistics-analysis.service"));
const VacuumMaintenance = __importStar(require("./vacuum-maintenance.service"));
const BloatDetection = __importStar(require("./bloat-detection.service"));
const CacheOptimization = __importStar(require("./cache-optimization.service"));
const base_1 = require("../../../common/base");
let DatabaseOptimizationService = class DatabaseOptimizationService extends base_1.BaseService {
    constructor() {
        super("DatabaseOptimizationService");
    }
    listAllIndexes = IndexManagement.listAllIndexes;
    analyzeIndexUsage = IndexManagement.analyzeIndexUsage;
    createOptimizedIndex = IndexManagement.createOptimizedIndex;
    rebuildIndex = IndexManagement.rebuildIndex;
    analyzeTable = IndexManagement.analyzeTable;
    findDuplicateIndexes = IndexManagement.findDuplicateIndexes;
    calculateIndexColumnOrder = IndexManagement.calculateIndexColumnOrder;
    estimateIndexSize = IndexManagement.estimateIndexSize;
    validateIndexIntegrity = IndexManagement.validateIndexIntegrity;
    generateIndexRecommendations = IndexManagement.generateIndexRecommendations;
    analyzeQueryPlan = QueryOptimization.analyzeQueryPlan;
    rewriteQueryForPerformance = QueryOptimization.rewriteQueryForPerformance;
    detectSlowQueries = QueryOptimization.detectSlowQueries;
    optimizeJoinOrder = QueryOptimization.optimizeJoinOrder;
    identifyNPlusOneQueries = QueryOptimization.identifyNPlusOneQueries;
    suggestCompositeIndexes = QueryOptimization.suggestCompositeIndexes;
    analyzeQueryCache = QueryOptimization.analyzeQueryCache;
    optimizePagination = QueryOptimization.optimizePagination;
    detectCartesianProduct = QueryOptimization.detectCartesianProduct;
    suggestCoveringIndex = QueryOptimization.suggestCoveringIndex;
    getTableStatistics = StatisticsAnalysis.getTableStatistics;
    collectDatabaseStatistics = StatisticsAnalysis.collectDatabaseStatistics;
    updateTableStatistics = StatisticsAnalysis.updateTableStatistics;
    monitorStatisticsStaleness = StatisticsAnalysis.monitorStatisticsStaleness;
    estimateQuerySelectivity = StatisticsAnalysis.estimateQuerySelectivity;
    analyzeColumnCardinality = StatisticsAnalysis.analyzeColumnCardinality;
    getDatabaseSizeStatistics = StatisticsAnalysis.getDatabaseSizeStatistics;
    analyzeDataDistribution = StatisticsAnalysis.analyzeDataDistribution;
    performVacuum = VacuumMaintenance.performVacuum;
    scheduleAutovacuum = VacuumMaintenance.scheduleAutovacuum;
    detectVacuumNeeded = VacuumMaintenance.detectVacuumNeeded;
    vacuumFreeze = VacuumMaintenance.vacuumFreeze;
    monitorVacuumProgress = VacuumMaintenance.monitorVacuumProgress;
    reclaimWastedSpace = VacuumMaintenance.reclaimWastedSpace;
    optimizeTableStructure = VacuumMaintenance.optimizeTableStructure;
    detectTableBloat = BloatDetection.detectTableBloat;
    detectIndexBloat = BloatDetection.detectIndexBloat;
    findBloatedTables = BloatDetection.findBloatedTables;
    estimateBloatReduction = BloatDetection.estimateBloatReduction;
    createBloatReport = BloatDetection.createBloatReport;
    analyzeBufferCacheHitRatio = CacheOptimization.analyzeBufferCacheHitRatio;
    optimizeCacheSettings = CacheOptimization.optimizeCacheSettings;
    warmDatabaseCache = CacheOptimization.warmDatabaseCache;
    analyzeCachedObjects = CacheOptimization.analyzeCachedObjects;
    recommendCacheConfiguration = CacheOptimization.recommendCacheConfiguration;
};
exports.DatabaseOptimizationService = DatabaseOptimizationService;
exports.DatabaseOptimizationService = DatabaseOptimizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DatabaseOptimizationService);
//# sourceMappingURL=database-optimization.service.js.map
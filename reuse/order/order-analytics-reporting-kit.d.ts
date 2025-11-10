/**
 * LOC: ORD-ANL-001
 * File: /reuse/order/order-analytics-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Analytics controllers
 *   - Reporting services
 *   - Dashboard services
 */
import { Sequelize } from 'sequelize';
/**
 * Analytics period types for time-based analysis
 */
export declare enum AnalyticsPeriod {
    HOURLY = "HOURLY",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    YEARLY = "YEARLY",
    CUSTOM = "CUSTOM"
}
/**
 * Report formats for data export
 */
export declare enum ReportFormat {
    JSON = "JSON",
    CSV = "CSV",
    EXCEL = "EXCEL",
    PDF = "PDF",
    HTML = "HTML",
    XML = "XML"
}
/**
 * Metric aggregation types
 */
export declare enum AggregationType {
    SUM = "SUM",
    AVG = "AVG",
    MIN = "MIN",
    MAX = "MAX",
    COUNT = "COUNT",
    MEDIAN = "MEDIAN",
    PERCENTILE = "PERCENTILE",
    STDDEV = "STDDEV"
}
/**
 * KPI threshold types
 */
export declare enum KpiThresholdType {
    GREATER_THAN = "GREATER_THAN",
    LESS_THAN = "LESS_THAN",
    EQUALS = "EQUALS",
    BETWEEN = "BETWEEN",
    OUTSIDE_RANGE = "OUTSIDE_RANGE"
}
/**
 * Dashboard widget types
 */
export declare enum DashboardWidgetType {
    LINE_CHART = "LINE_CHART",
    BAR_CHART = "BAR_CHART",
    PIE_CHART = "PIE_CHART",
    AREA_CHART = "AREA_CHART",
    SCATTER_CHART = "SCATTER_CHART",
    TABLE = "TABLE",
    KPI_CARD = "KPI_CARD",
    GAUGE = "GAUGE",
    HEATMAP = "HEATMAP",
    FUNNEL = "FUNNEL"
}
/**
 * Forecast models
 */
export declare enum ForecastModel {
    LINEAR_REGRESSION = "LINEAR_REGRESSION",
    MOVING_AVERAGE = "MOVING_AVERAGE",
    EXPONENTIAL_SMOOTHING = "EXPONENTIAL_SMOOTHING",
    SEASONAL_DECOMPOSITION = "SEASONAL_DECOMPOSITION",
    ARIMA = "ARIMA"
}
interface MetricValue {
    value: number;
    percentage?: number;
    changeFromPrevious?: number;
    trend?: 'up' | 'down' | 'stable';
}
interface TimeSeriesDataPoint {
    timestamp: Date;
    value: number;
    label?: string;
    metadata?: Record<string, any>;
}
interface KpiThreshold {
    type: KpiThresholdType;
    value: number;
    secondValue?: number;
    color?: string;
    alert?: boolean;
}
interface DashboardWidget {
    id: string;
    type: DashboardWidgetType;
    title: string;
    data: any;
    config?: Record<string, any>;
    position?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export declare class AnalyticsQueryDto {
    startDate: Date;
    endDate: Date;
    period?: AnalyticsPeriod;
    comparisonStartDate?: Date;
    comparisonEndDate?: Date;
    customerIds?: string[];
    productIds?: string[];
    orderStatus?: string[];
    orderSource?: string[];
    regions?: string[];
    groupBy?: string[];
}
export declare class KpiConfigDto {
    kpiId: string;
    name: string;
    description?: string;
    target?: number;
    warningThreshold?: KpiThreshold;
    criticalThreshold?: KpiThreshold;
    enableAlerts?: boolean;
}
export declare class CustomReportDto {
    reportName: string;
    description?: string;
    metrics: string[];
    dimensions?: string[];
    filters?: AnalyticsQueryDto;
    format: ReportFormat;
    includeVisualizations?: boolean;
    schedule?: string;
}
export declare class DashboardConfigDto {
    dashboardId: string;
    name: string;
    description?: string;
    widgets: DashboardWidget[];
    refreshInterval?: number;
    layout?: Record<string, any>;
}
export declare class ForecastConfigDto {
    metric: string;
    model: ForecastModel;
    historicalPeriodDays: number;
    forecastPeriodDays: number;
    confidenceInterval?: number;
    modelParams?: Record<string, any>;
}
/**
 * Calculate comprehensive order volume metrics
 * Provides total orders, average orders per day, growth rates, and period comparisons
 */
export declare function calculateOrderVolumeMetrics(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<{
    totalOrders: number;
    averageOrdersPerDay: number;
    growthRate: number;
    periodComparison: MetricValue;
    breakdown: TimeSeriesDataPoint[];
}>;
/**
 * Calculate average order value (AOV) and related metrics
 */
export declare function calculateAverageOrderValue(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<{
    averageOrderValue: number;
    medianOrderValue: number;
    minOrderValue: number;
    maxOrderValue: number;
    breakdown: TimeSeriesDataPoint[];
    distribution: {
        range: string;
        count: number;
        percentage: number;
    }[];
}>;
/**
 * Calculate order fulfillment rate and time metrics
 */
export declare function calculateFulfillmentMetrics(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<{
    fulfillmentRate: number;
    averageFulfillmentTime: number;
    onTimeDeliveryRate: number;
    breakdown: TimeSeriesDataPoint[];
    statusDistribution: {
        status: string;
        count: number;
        percentage: number;
    }[];
}>;
/**
 * Calculate comprehensive revenue metrics
 */
export declare function calculateRevenueMetrics(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<{
    totalRevenue: number;
    netRevenue: number;
    grossProfit: number;
    grossMargin: number;
    revenueGrowth: number;
    breakdown: TimeSeriesDataPoint[];
    byChannel: {
        channel: string;
        revenue: number;
        percentage: number;
    }[];
}>;
/**
 * Analyze sales conversion funnel
 */
export declare function analyzeSalesConversionFunnel(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<{
    stages: {
        stage: string;
        count: number;
        conversionRate: number;
        dropOffRate: number;
    }[];
    overallConversionRate: number;
    averageTimeToConvert: number;
}>;
/**
 * Calculate sales by product category
 */
export declare function calculateSalesByCategory(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<{
    categories: {
        categoryId: string;
        categoryName: string;
        revenue: number;
        orders: number;
        units: number;
        percentage: number;
    }[];
    topPerforming: any[];
    underPerforming: any[];
}>;
/**
 * Calculate customer lifetime value (CLV) metrics
 */
export declare function calculateCustomerLifetimeValue(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<{
    averageCLV: number;
    medianCLV: number;
    topCustomers: {
        customerId: string;
        customerName: string;
        clv: number;
        orderCount: number;
    }[];
    clvDistribution: {
        range: string;
        count: number;
        percentage: number;
    }[];
}>;
/**
 * Analyze customer retention and churn
 */
export declare function analyzeCustomerRetention(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<{
    retentionRate: number;
    churnRate: number;
    repeatCustomerRate: number;
    cohortAnalysis: {
        cohort: string;
        customers: number;
        retained: number;
        retentionRate: number;
    }[];
}>;
/**
 * Segment customers by RFM (Recency, Frequency, Monetary) analysis
 */
export declare function segmentCustomersByRFM(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<{
    segments: {
        segment: string;
        customers: number;
        percentage: number;
        avgRevenue: number;
    }[];
    customerSegments: {
        customerId: string;
        recencyScore: number;
        frequencyScore: number;
        monetaryScore: number;
        segment: string;
    }[];
}>;
/**
 * Analyze top-performing products
 */
export declare function analyzeTopPerformingProducts(sequelize: Sequelize, query: AnalyticsQueryDto, limit?: number): Promise<{
    topByRevenue: {
        productId: string;
        productName: string;
        revenue: number;
        units: number;
        orders: number;
    }[];
    topByUnits: {
        productId: string;
        productName: string;
        units: number;
        revenue: number;
        orders: number;
    }[];
    topByOrders: {
        productId: string;
        productName: string;
        orders: number;
        revenue: number;
        units: number;
    }[];
}>;
/**
 * Analyze product performance trends
 */
export declare function analyzeProductPerformanceTrends(sequelize: Sequelize, productId: string, query: AnalyticsQueryDto): Promise<{
    productInfo: {
        productId: string;
        productName: string;
        category: string;
    };
    salesTrend: TimeSeriesDataPoint[];
    seasonalityIndex: {
        month: number;
        indexValue: number;
    }[];
    growthRate: number;
    performance: 'growing' | 'declining' | 'stable';
}>;
/**
 * Analyze product cross-sell and upsell opportunities
 */
export declare function analyzeProductAffinity(sequelize: Sequelize, productId: string, minSupport?: number, minConfidence?: number): Promise<{
    frequentlyBoughtTogether: {
        productId: string;
        productName: string;
        frequency: number;
        confidence: number;
    }[];
    recommendedUpsells: {
        productId: string;
        productName: string;
        priceDifference: number;
        conversionRate: number;
    }[];
}>;
/**
 * Generate sales forecast using linear regression
 */
export declare function generateSalesForecast(sequelize: Sequelize, config: ForecastConfigDto): Promise<{
    historicalData: TimeSeriesDataPoint[];
    forecastData: TimeSeriesDataPoint[];
    confidence: {
        upper: TimeSeriesDataPoint[];
        lower: TimeSeriesDataPoint[];
    };
    accuracy: {
        mae: number;
        rmse: number;
        mape: number;
    };
}>;
/**
 * Detect trends and anomalies in order data
 */
export declare function detectOrderTrendsAndAnomalies(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<{
    trend: 'upward' | 'downward' | 'stable';
    trendStrength: number;
    anomalies: {
        timestamp: Date;
        value: number;
        expectedValue: number;
        deviation: number;
        severity: 'low' | 'medium' | 'high';
    }[];
    seasonalPattern: boolean;
}>;
/**
 * Generate executive dashboard with key metrics
 */
export declare function generateExecutiveDashboard(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<{
    kpis: {
        totalRevenue: MetricValue;
        totalOrders: MetricValue;
        averageOrderValue: MetricValue;
        customerCount: MetricValue;
        fulfillmentRate: MetricValue;
    };
    charts: DashboardWidget[];
    alerts: {
        severity: 'info' | 'warning' | 'critical';
        message: string;
        metric: string;
    }[];
}>;
/**
 * Generate custom report based on configuration
 */
export declare function generateCustomReport(sequelize: Sequelize, config: CustomReportDto): Promise<{
    reportMetadata: {
        name: string;
        generatedAt: Date;
        filters: any;
    };
    data: any[];
    summary: Record<string, any>;
    visualizations?: any[];
}>;
/**
 * Export report data to specified format
 */
export declare function exportReportData(data: any[], format: ReportFormat, reportName: string): Promise<{
    fileName: string;
    content: Buffer | string;
    mimeType: string;
}>;
/**
 * Calculate real-time analytics metrics (last 24 hours)
 */
export declare function calculateRealTimeMetrics(sequelize: Sequelize): Promise<{
    ordersLastHour: number;
    ordersLast24Hours: number;
    revenueLastHour: number;
    revenueLast24Hours: number;
    averageOrderValueLast24Hours: number;
    topProductsLast24Hours: {
        productId: string;
        productName: string;
        units: number;
    }[];
    recentOrders: {
        orderId: string;
        customerId: string;
        amount: number;
        status: string;
        createdAt: Date;
    }[];
}>;
export {};
//# sourceMappingURL=order-analytics-reporting-kit.d.ts.map
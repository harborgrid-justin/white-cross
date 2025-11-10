"use strict";
/**
 * LOC: RPTANL123
 * File: /reuse/engineer/reporting-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Reporting services and controllers
 *   - Analytics engines and dashboards
 *   - BI integration modules
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScheduleRunInfo = exports.distributeReport = exports.validateReportSchedule = exports.calculateNextRun = exports.createReportSchedule = exports.exportToXML = exports.exportToCSV = exports.exportToExcel = exports.exportToPDF = exports.exportReport = exports.generateAnalyticsInsights = exports.comparePeriods = exports.performComparativeAnalysis = exports.calculateVolatility = exports.generateForecast = exports.calculateMovingAverage = exports.calculateTrendLine = exports.analyzeTrend = exports.prepareTableWidgetData = exports.prepareChartWidgetData = exports.prepareKPIWidgetData = exports.prepareDashboardData = exports.createDashboardConfig = exports.compareKPIToTarget = exports.trackKPITrend = exports.formatKPIValue = exports.calculateKPI = exports.createKPIDefinition = exports.calculatePercentageOfTotal = exports.calculateRunningTotal = exports.pivotData = exports.summarizeData = exports.calculateAggregations = exports.cloneReportConfig = exports.validateReportConfig = exports.buildReportTemplate = exports.createReportFilter = exports.createReportColumn = exports.applyReportGrouping = exports.applyReportSorting = exports.applyReportFilters = exports.executeReport = exports.createReportConfig = void 0;
// ============================================================================
// 1. DYNAMIC REPORT GENERATION
// ============================================================================
/**
 * 1. Creates a dynamic report configuration with custom columns and filters.
 *
 * @swagger
 * components:
 *   schemas:
 *     ReportConfig:
 *       type: object
 *       required:
 *         - name
 *         - title
 *         - dataSource
 *         - columns
 *       properties:
 *         name:
 *           type: string
 *           description: Unique report identifier
 *         title:
 *           type: string
 *           description: Display title for the report
 *         description:
 *           type: string
 *           description: Report description
 *         dataSource:
 *           type: string
 *           description: Data source identifier
 *         columns:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReportColumn'
 *         filters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReportFilter'
 *
 * @param {Partial<ReportConfig>} config - Report configuration options
 * @returns {ReportConfig} Complete report configuration
 *
 * @example
 * ```typescript
 * const report = createReportConfig({
 *   name: 'sales-monthly',
 *   title: 'Monthly Sales Report',
 *   dataSource: 'sales_transactions',
 *   columns: [
 *     { field: 'date', label: 'Date', type: 'date' },
 *     { field: 'amount', label: 'Amount', type: 'currency' }
 *   ]
 * });
 * ```
 */
const createReportConfig = (config) => {
    return {
        name: config.name || 'unnamed-report',
        title: config.title || 'Report',
        description: config.description,
        dataSource: config.dataSource || '',
        columns: config.columns || [],
        filters: config.filters || [],
        sorting: config.sorting || [],
        groupBy: config.groupBy || [],
        aggregations: config.aggregations || [],
        formatting: config.formatting,
    };
};
exports.createReportConfig = createReportConfig;
/**
 * 2. Executes a report configuration and generates report data.
 *
 * @param {ReportConfig} config - Report configuration
 * @param {Record<string, any>[]} data - Source data
 * @returns {Record<string, any>} Generated report with data and metadata
 *
 * @example
 * ```typescript
 * const reportData = executeReport(reportConfig, sourceData);
 * // Returns: { data: [...], totals: {...}, metadata: {...} }
 * ```
 */
const executeReport = (config, data) => {
    let processedData = [...data];
    // Apply filters
    if (config.filters && config.filters.length > 0) {
        processedData = (0, exports.applyReportFilters)(processedData, config.filters);
    }
    // Apply sorting
    if (config.sorting && config.sorting.length > 0) {
        processedData = (0, exports.applyReportSorting)(processedData, config.sorting);
    }
    // Apply grouping
    if (config.groupBy && config.groupBy.length > 0) {
        processedData = (0, exports.applyReportGrouping)(processedData, config.groupBy);
    }
    // Calculate aggregations
    const aggregations = config.aggregations
        ? (0, exports.calculateAggregations)(processedData, config.aggregations)
        : [];
    return {
        data: processedData,
        totals: aggregations,
        metadata: {
            reportName: config.name,
            generatedAt: new Date(),
            recordCount: processedData.length,
            columns: config.columns,
        },
    };
};
exports.executeReport = executeReport;
/**
 * 3. Applies filters to report data based on filter configuration.
 *
 * @param {Record<string, any>[]} data - Data to filter
 * @param {ReportFilter[]} filters - Filter configurations
 * @returns {Record<string, any>[]} Filtered data
 *
 * @example
 * ```typescript
 * const filtered = applyReportFilters(data, [
 *   { field: 'status', operator: 'eq', value: 'active' }
 * ]);
 * ```
 */
const applyReportFilters = (data, filters) => {
    return data.filter((row) => {
        return filters.every((filter) => {
            const value = row[filter.field];
            const filterValue = filter.value;
            switch (filter.operator) {
                case 'eq':
                    return value === filterValue;
                case 'ne':
                    return value !== filterValue;
                case 'gt':
                    return value > filterValue;
                case 'gte':
                    return value >= filterValue;
                case 'lt':
                    return value < filterValue;
                case 'lte':
                    return value <= filterValue;
                case 'in':
                    return Array.isArray(filterValue) && filterValue.includes(value);
                case 'nin':
                    return Array.isArray(filterValue) && !filterValue.includes(value);
                case 'contains':
                    return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
                case 'startsWith':
                    return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
                case 'endsWith':
                    return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
                default:
                    return true;
            }
        });
    });
};
exports.applyReportFilters = applyReportFilters;
/**
 * 4. Applies sorting to report data.
 *
 * @param {Record<string, any>[]} data - Data to sort
 * @param {SortConfig[]} sorting - Sort configurations
 * @returns {Record<string, any>[]} Sorted data
 *
 * @example
 * ```typescript
 * const sorted = applyReportSorting(data, [
 *   { field: 'date', direction: 'desc' }
 * ]);
 * ```
 */
const applyReportSorting = (data, sorting) => {
    return [...data].sort((a, b) => {
        for (const sort of sorting) {
            const aVal = a[sort.field];
            const bVal = b[sort.field];
            if (aVal < bVal)
                return sort.direction === 'asc' ? -1 : 1;
            if (aVal > bVal)
                return sort.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
};
exports.applyReportSorting = applyReportSorting;
/**
 * 5. Groups report data by specified fields.
 *
 * @param {Record<string, any>[]} data - Data to group
 * @param {string[]} groupBy - Fields to group by
 * @returns {Record<string, any>[]} Grouped data
 *
 * @example
 * ```typescript
 * const grouped = applyReportGrouping(data, ['category', 'status']);
 * ```
 */
const applyReportGrouping = (data, groupBy) => {
    const groups = new Map();
    data.forEach((row) => {
        const key = groupBy.map((field) => row[field]).join('|');
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(row);
    });
    return Array.from(groups.entries()).map(([key, items]) => {
        const groupValues = key.split('|');
        const groupObj = {};
        groupBy.forEach((field, index) => {
            groupObj[field] = groupValues[index];
        });
        return {
            ...groupObj,
            items,
            count: items.length,
        };
    });
};
exports.applyReportGrouping = applyReportGrouping;
// ============================================================================
// 2. CUSTOM REPORT BUILDER UTILITIES
// ============================================================================
/**
 * 6. Creates a report column configuration.
 *
 * @param {Partial<ReportColumn>} column - Column options
 * @returns {ReportColumn} Complete column configuration
 *
 * @example
 * ```typescript
 * const column = createReportColumn({
 *   field: 'revenue',
 *   label: 'Total Revenue',
 *   type: 'currency',
 *   format: '$0,0.00'
 * });
 * ```
 */
const createReportColumn = (column) => {
    return {
        field: column.field || '',
        label: column.label || column.field || '',
        type: column.type || 'string',
        width: column.width,
        align: column.align || 'left',
        format: column.format,
        hidden: column.hidden || false,
        sortable: column.sortable !== false,
    };
};
exports.createReportColumn = createReportColumn;
/**
 * 7. Creates a report filter configuration.
 *
 * @param {Partial<ReportFilter>} filter - Filter options
 * @returns {ReportFilter} Complete filter configuration
 *
 * @example
 * ```typescript
 * const filter = createReportFilter({
 *   field: 'date',
 *   operator: 'gte',
 *   value: '2024-01-01'
 * });
 * ```
 */
const createReportFilter = (filter) => {
    return {
        field: filter.field || '',
        operator: filter.operator || 'eq',
        value: filter.value,
        condition: filter.condition || 'and',
    };
};
exports.createReportFilter = createReportFilter;
/**
 * 8. Builds a custom report template with predefined structure.
 *
 * @param {string} templateType - Template type identifier
 * @param {Record<string, any>} params - Template parameters
 * @returns {ReportConfig} Report configuration from template
 *
 * @example
 * ```typescript
 * const report = buildReportTemplate('financial-summary', {
 *   period: 'monthly',
 *   year: 2024
 * });
 * ```
 */
const buildReportTemplate = (templateType, params) => {
    const templates = {
        'financial-summary': {
            name: 'financial-summary',
            title: 'Financial Summary Report',
            columns: [
                { field: 'category', label: 'Category', type: 'string' },
                { field: 'revenue', label: 'Revenue', type: 'currency' },
                { field: 'expenses', label: 'Expenses', type: 'currency' },
                { field: 'profit', label: 'Profit', type: 'currency' },
            ],
        },
        'sales-performance': {
            name: 'sales-performance',
            title: 'Sales Performance Report',
            columns: [
                { field: 'salesperson', label: 'Salesperson', type: 'string' },
                { field: 'sales', label: 'Sales', type: 'number' },
                { field: 'revenue', label: 'Revenue', type: 'currency' },
                { field: 'target', label: 'Target', type: 'currency' },
                { field: 'achievement', label: 'Achievement', type: 'percentage' },
            ],
        },
    };
    const template = templates[templateType] || { name: templateType, title: templateType };
    return (0, exports.createReportConfig)({ ...template, ...params });
};
exports.buildReportTemplate = buildReportTemplate;
/**
 * 9. Validates report configuration for completeness and correctness.
 *
 * @param {ReportConfig} config - Report configuration to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReportConfig(reportConfig);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
const validateReportConfig = (config) => {
    const errors = [];
    if (!config.name)
        errors.push('Report name is required');
    if (!config.title)
        errors.push('Report title is required');
    if (!config.dataSource)
        errors.push('Data source is required');
    if (!config.columns || config.columns.length === 0) {
        errors.push('At least one column is required');
    }
    config.columns?.forEach((col, index) => {
        if (!col.field)
            errors.push(`Column ${index}: field is required`);
        if (!col.label)
            errors.push(`Column ${index}: label is required`);
    });
    return { valid: errors.length === 0, errors };
};
exports.validateReportConfig = validateReportConfig;
/**
 * 10. Clones a report configuration with optional modifications.
 *
 * @param {ReportConfig} config - Original report configuration
 * @param {Partial<ReportConfig>} modifications - Modifications to apply
 * @returns {ReportConfig} Cloned and modified configuration
 *
 * @example
 * ```typescript
 * const newReport = cloneReportConfig(existingReport, {
 *   name: 'modified-report',
 *   filters: [...additionalFilters]
 * });
 * ```
 */
const cloneReportConfig = (config, modifications) => {
    return {
        ...config,
        columns: [...config.columns],
        filters: config.filters ? [...config.filters] : [],
        sorting: config.sorting ? [...config.sorting] : [],
        groupBy: config.groupBy ? [...config.groupBy] : [],
        aggregations: config.aggregations ? [...config.aggregations] : [],
        ...modifications,
    };
};
exports.cloneReportConfig = cloneReportConfig;
// ============================================================================
// 3. DATA AGGREGATION AND SUMMARIZATION
// ============================================================================
/**
 * 11. Calculates aggregations on dataset.
 *
 * @swagger
 * components:
 *   schemas:
 *     AggregationResult:
 *       type: object
 *       properties:
 *         field:
 *           type: string
 *         operation:
 *           type: string
 *           enum: [sum, avg, min, max, count, distinct]
 *         value:
 *           type: number
 *         count:
 *           type: number
 *
 * @param {Record<string, any>[]} data - Data to aggregate
 * @param {AggregationConfig[]} aggregations - Aggregation configurations
 * @returns {AggregationResult[]} Aggregation results
 *
 * @example
 * ```typescript
 * const results = calculateAggregations(data, [
 *   { field: 'revenue', operation: 'sum', label: 'Total Revenue' },
 *   { field: 'revenue', operation: 'avg', label: 'Average Revenue' }
 * ]);
 * ```
 */
const calculateAggregations = (data, aggregations) => {
    return aggregations.map((agg) => {
        const values = data.map((row) => row[agg.field]).filter((v) => v != null);
        let value;
        switch (agg.operation) {
            case 'sum':
                value = values.reduce((sum, v) => sum + Number(v), 0);
                break;
            case 'avg':
                value = values.length > 0 ? values.reduce((sum, v) => sum + Number(v), 0) / values.length : 0;
                break;
            case 'min':
                value = values.length > 0 ? Math.min(...values.map(Number)) : 0;
                break;
            case 'max':
                value = values.length > 0 ? Math.max(...values.map(Number)) : 0;
                break;
            case 'count':
                value = values.length;
                break;
            case 'distinct':
                value = new Set(values).size;
                break;
            default:
                value = 0;
        }
        return {
            field: agg.field,
            operation: agg.operation,
            value,
            count: values.length,
        };
    });
};
exports.calculateAggregations = calculateAggregations;
/**
 * 12. Summarizes data by grouping and aggregating.
 *
 * @param {Record<string, any>[]} data - Data to summarize
 * @param {string[]} groupBy - Fields to group by
 * @param {AggregationConfig[]} aggregations - Aggregations to perform
 * @returns {Record<string, any>[]} Summarized data
 *
 * @example
 * ```typescript
 * const summary = summarizeData(sales, ['region'], [
 *   { field: 'amount', operation: 'sum' }
 * ]);
 * ```
 */
const summarizeData = (data, groupBy, aggregations) => {
    const grouped = (0, exports.applyReportGrouping)(data, groupBy);
    return grouped.map((group) => {
        const groupData = group.items || [];
        const aggs = (0, exports.calculateAggregations)(groupData, aggregations);
        const summary = {};
        groupBy.forEach((field) => {
            summary[field] = group[field];
        });
        aggs.forEach((agg) => {
            const key = agg.operation === 'count' ? `${agg.field}_count` : `${agg.field}_${agg.operation}`;
            summary[key] = agg.value;
        });
        return summary;
    });
};
exports.summarizeData = summarizeData;
/**
 * 13. Performs pivot table transformation on data.
 *
 * @param {Record<string, any>[]} data - Source data
 * @param {string} rowField - Row dimension field
 * @param {string} columnField - Column dimension field
 * @param {string} valueField - Value field to aggregate
 * @param {string} aggregation - Aggregation operation
 * @returns {Record<string, any>[]} Pivoted data
 *
 * @example
 * ```typescript
 * const pivoted = pivotData(sales, 'region', 'month', 'revenue', 'sum');
 * ```
 */
const pivotData = (data, rowField, columnField, valueField, aggregation) => {
    const pivot = new Map();
    data.forEach((row) => {
        const rowKey = row[rowField];
        const colKey = row[columnField];
        const value = Number(row[valueField]);
        if (!pivot.has(rowKey)) {
            pivot.set(rowKey, new Map());
        }
        if (!pivot.get(rowKey).has(colKey)) {
            pivot.get(rowKey).set(colKey, []);
        }
        pivot.get(rowKey).get(colKey).push(value);
    });
    const result = [];
    pivot.forEach((columns, rowKey) => {
        const row = { [rowField]: rowKey };
        columns.forEach((values, colKey) => {
            let aggValue;
            switch (aggregation) {
                case 'sum':
                    aggValue = values.reduce((sum, v) => sum + v, 0);
                    break;
                case 'avg':
                    aggValue = values.reduce((sum, v) => sum + v, 0) / values.length;
                    break;
                case 'count':
                    aggValue = values.length;
                    break;
                case 'min':
                    aggValue = Math.min(...values);
                    break;
                case 'max':
                    aggValue = Math.max(...values);
                    break;
                default:
                    aggValue = 0;
            }
            row[colKey] = aggValue;
        });
        result.push(row);
    });
    return result;
};
exports.pivotData = pivotData;
/**
 * 14. Calculates running totals for a dataset.
 *
 * @param {Record<string, any>[]} data - Data array
 * @param {string} valueField - Field to calculate running total
 * @param {string} outputField - Output field name for running total
 * @returns {Record<string, any>[]} Data with running totals
 *
 * @example
 * ```typescript
 * const withRunningTotal = calculateRunningTotal(data, 'sales', 'cumulative_sales');
 * ```
 */
const calculateRunningTotal = (data, valueField, outputField) => {
    let runningTotal = 0;
    return data.map((row) => {
        runningTotal += Number(row[valueField] || 0);
        return {
            ...row,
            [outputField]: runningTotal,
        };
    });
};
exports.calculateRunningTotal = calculateRunningTotal;
/**
 * 15. Calculates percentage of total for each row.
 *
 * @param {Record<string, any>[]} data - Data array
 * @param {string} valueField - Field to calculate percentage
 * @param {string} outputField - Output field name
 * @returns {Record<string, any>[]} Data with percentages
 *
 * @example
 * ```typescript
 * const withPercentages = calculatePercentageOfTotal(data, 'revenue', 'revenue_percentage');
 * ```
 */
const calculatePercentageOfTotal = (data, valueField, outputField) => {
    const total = data.reduce((sum, row) => sum + Number(row[valueField] || 0), 0);
    return data.map((row) => ({
        ...row,
        [outputField]: total > 0 ? (Number(row[valueField] || 0) / total) * 100 : 0,
    }));
};
exports.calculatePercentageOfTotal = calculatePercentageOfTotal;
// ============================================================================
// 4. KPI CALCULATION AND TRACKING
// ============================================================================
/**
 * 16. Creates a KPI definition.
 *
 * @swagger
 * components:
 *   schemas:
 *     KPIDefinition:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - metric
 *         - calculation
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         metric:
 *           type: string
 *         targetValue:
 *           type: number
 *         calculation:
 *           $ref: '#/components/schemas/KPICalculation'
 *
 * @param {Partial<KPIDefinition>} kpi - KPI definition options
 * @returns {KPIDefinition} Complete KPI definition
 *
 * @example
 * ```typescript
 * const kpi = createKPIDefinition({
 *   id: 'revenue-growth',
 *   name: 'Revenue Growth Rate',
 *   metric: 'revenue',
 *   targetValue: 15,
 *   calculation: { type: 'percentage', numerator: 'current', denominator: 'previous' }
 * });
 * ```
 */
const createKPIDefinition = (kpi) => {
    return {
        id: kpi.id || '',
        name: kpi.name || '',
        description: kpi.description,
        metric: kpi.metric || '',
        targetValue: kpi.targetValue,
        warningThreshold: kpi.warningThreshold,
        criticalThreshold: kpi.criticalThreshold,
        unit: kpi.unit,
        format: kpi.format,
        calculation: kpi.calculation || { type: 'simple' },
    };
};
exports.createKPIDefinition = createKPIDefinition;
/**
 * 17. Calculates KPI value from data.
 *
 * @param {KPIDefinition} kpi - KPI definition
 * @param {Record<string, any>} data - Data for calculation
 * @returns {KPIResult} KPI calculation result
 *
 * @example
 * ```typescript
 * const result = calculateKPI(kpiDefinition, {
 *   current: 120000,
 *   previous: 100000
 * });
 * ```
 */
const calculateKPI = (kpi, data) => {
    let value;
    switch (kpi.calculation.type) {
        case 'simple':
            value = Number(data[kpi.metric] || 0);
            break;
        case 'ratio':
            const numerator = Number(data[kpi.calculation.numerator] || 0);
            const denominator = Number(data[kpi.calculation.denominator] || 0);
            value = denominator !== 0 ? numerator / denominator : 0;
            break;
        case 'percentage':
            const num = Number(data[kpi.calculation.numerator] || 0);
            const den = Number(data[kpi.calculation.denominator] || 0);
            value = den !== 0 ? ((num - den) / den) * 100 : 0;
            break;
        default:
            value = 0;
    }
    const variance = kpi.targetValue ? value - kpi.targetValue : undefined;
    const variancePercentage = kpi.targetValue && kpi.targetValue !== 0 ? (variance / kpi.targetValue) * 100 : undefined;
    let status = 'normal';
    if (kpi.criticalThreshold && Math.abs(variance || 0) >= kpi.criticalThreshold) {
        status = 'critical';
    }
    else if (kpi.warningThreshold && Math.abs(variance || 0) >= kpi.warningThreshold) {
        status = 'warning';
    }
    return {
        id: kpi.id,
        name: kpi.name,
        value,
        formattedValue: (0, exports.formatKPIValue)(value, kpi.format, kpi.unit),
        targetValue: kpi.targetValue,
        variance,
        variancePercentage,
        status,
        calculatedAt: new Date(),
    };
};
exports.calculateKPI = calculateKPI;
/**
 * 18. Formats KPI value for display.
 *
 * @param {number} value - Value to format
 * @param {string} [format] - Format string
 * @param {string} [unit] - Unit suffix
 * @returns {string} Formatted value
 *
 * @example
 * ```typescript
 * const formatted = formatKPIValue(1234.56, '0,0.00', '$');
 * // Returns: "$1,234.56"
 * ```
 */
const formatKPIValue = (value, format, unit) => {
    let formatted = value.toFixed(2);
    if (format?.includes(',')) {
        formatted = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (unit) {
        formatted = unit.includes('$') ? `${unit}${formatted}` : `${formatted}${unit}`;
    }
    return formatted;
};
exports.formatKPIValue = formatKPIValue;
/**
 * 19. Tracks KPI trend over time.
 *
 * @param {KPIResult[]} historicalKPIs - Historical KPI values
 * @returns {{ trend: string; sparkline: number[] }} Trend analysis
 *
 * @example
 * ```typescript
 * const trend = trackKPITrend(pastKPIResults);
 * // Returns: { trend: 'up', sparkline: [100, 105, 110, 115, 120] }
 * ```
 */
const trackKPITrend = (historicalKPIs) => {
    const values = historicalKPIs.map((kpi) => kpi.value);
    const sparkline = values.slice(-10); // Last 10 values
    if (values.length < 2) {
        return { trend: 'stable', sparkline };
    }
    const first = values[0];
    const last = values[values.length - 1];
    const change = ((last - first) / first) * 100;
    let trend;
    if (Math.abs(change) < 2) {
        trend = 'stable';
    }
    else if (change > 0) {
        trend = 'up';
    }
    else {
        trend = 'down';
    }
    return { trend, sparkline };
};
exports.trackKPITrend = trackKPITrend;
/**
 * 20. Compares KPI against target and thresholds.
 *
 * @param {KPIResult} kpi - KPI result
 * @param {KPIDefinition} definition - KPI definition
 * @returns {{ status: string; message: string; recommendation: string }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareKPIToTarget(kpiResult, kpiDefinition);
 * ```
 */
const compareKPIToTarget = (kpi, definition) => {
    if (!kpi.targetValue) {
        return {
            status: 'no-target',
            message: 'No target value defined',
            recommendation: 'Define a target value for meaningful comparison',
        };
    }
    const variance = kpi.variance || 0;
    const varPercent = kpi.variancePercentage || 0;
    if (kpi.status === 'critical') {
        return {
            status: 'critical',
            message: `KPI is ${Math.abs(varPercent).toFixed(2)}% ${variance > 0 ? 'above' : 'below'} target`,
            recommendation: 'Immediate action required to address deviation',
        };
    }
    else if (kpi.status === 'warning') {
        return {
            status: 'warning',
            message: `KPI is ${Math.abs(varPercent).toFixed(2)}% ${variance > 0 ? 'above' : 'below'} target`,
            recommendation: 'Monitor closely and consider corrective actions',
        };
    }
    else {
        return {
            status: 'normal',
            message: `KPI is within acceptable range`,
            recommendation: 'Continue current strategy',
        };
    }
};
exports.compareKPIToTarget = compareKPIToTarget;
// ============================================================================
// 5. DASHBOARD DATA PREPARATION
// ============================================================================
/**
 * 21. Creates a dashboard configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     DashboardConfig:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - widgets
 *         - layout
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         widgets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DashboardWidget'
 *
 * @param {Partial<DashboardConfig>} config - Dashboard configuration
 * @returns {DashboardConfig} Complete dashboard configuration
 *
 * @example
 * ```typescript
 * const dashboard = createDashboardConfig({
 *   id: 'sales-dashboard',
 *   name: 'Sales Dashboard',
 *   widgets: [...]
 * });
 * ```
 */
const createDashboardConfig = (config) => {
    return {
        id: config.id || '',
        name: config.name || '',
        widgets: config.widgets || [],
        layout: config.layout || { columns: 12, rowHeight: 100 },
        refreshInterval: config.refreshInterval,
        filters: config.filters,
    };
};
exports.createDashboardConfig = createDashboardConfig;
/**
 * 22. Prepares data for dashboard widgets.
 *
 * @param {DashboardWidget[]} widgets - Dashboard widgets
 * @param {Record<string, any>} dataContext - Available data sources
 * @returns {Record<string, any>} Widget data map
 *
 * @example
 * ```typescript
 * const widgetData = prepareDashboardData(widgets, {
 *   sales: salesData,
 *   kpis: kpiData
 * });
 * ```
 */
const prepareDashboardData = (widgets, dataContext) => {
    const widgetData = {};
    widgets.forEach((widget) => {
        const sourceData = dataContext[widget.dataSource];
        if (!sourceData) {
            widgetData[widget.id] = { error: 'Data source not found' };
            return;
        }
        switch (widget.type) {
            case 'kpi':
                widgetData[widget.id] = (0, exports.prepareKPIWidgetData)(sourceData, widget.config);
                break;
            case 'chart':
                widgetData[widget.id] = (0, exports.prepareChartWidgetData)(sourceData, widget.config);
                break;
            case 'table':
                widgetData[widget.id] = (0, exports.prepareTableWidgetData)(sourceData, widget.config);
                break;
            default:
                widgetData[widget.id] = sourceData;
        }
    });
    return widgetData;
};
exports.prepareDashboardData = prepareDashboardData;
/**
 * 23. Prepares data for KPI widget.
 *
 * @param {any} data - Source data
 * @param {any} config - Widget configuration
 * @returns {any} Prepared KPI data
 *
 * @example
 * ```typescript
 * const kpiData = prepareKPIWidgetData(sourceData, { metric: 'revenue' });
 * ```
 */
const prepareKPIWidgetData = (data, config) => {
    return {
        value: data.value || 0,
        label: config.label || 'KPI',
        change: data.change,
        trend: data.trend,
        target: data.target,
    };
};
exports.prepareKPIWidgetData = prepareKPIWidgetData;
/**
 * 24. Prepares data for chart widget.
 *
 * @param {any} data - Source data
 * @param {any} config - Widget configuration
 * @returns {any} Prepared chart data
 *
 * @example
 * ```typescript
 * const chartData = prepareChartWidgetData(sourceData, {
 *   chartType: 'line',
 *   xField: 'date',
 *   yField: 'value'
 * });
 * ```
 */
const prepareChartWidgetData = (data, config) => {
    return {
        type: config.chartType || 'line',
        data: Array.isArray(data) ? data : [data],
        labels: config.labels,
        datasets: config.datasets,
    };
};
exports.prepareChartWidgetData = prepareChartWidgetData;
/**
 * 25. Prepares data for table widget.
 *
 * @param {any} data - Source data
 * @param {any} config - Widget configuration
 * @returns {any} Prepared table data
 *
 * @example
 * ```typescript
 * const tableData = prepareTableWidgetData(sourceData, {
 *   columns: ['name', 'value', 'status']
 * });
 * ```
 */
const prepareTableWidgetData = (data, config) => {
    return {
        columns: config.columns || [],
        rows: Array.isArray(data) ? data : [data],
        pagination: config.pagination,
    };
};
exports.prepareTableWidgetData = prepareTableWidgetData;
// ============================================================================
// 6. TREND ANALYSIS AND FORECASTING
// ============================================================================
/**
 * 26. Analyzes trends in time-series data.
 *
 * @swagger
 * components:
 *   schemas:
 *     TrendAnalysisResult:
 *       type: object
 *       properties:
 *         trend:
 *           type: string
 *           enum: [upward, downward, stable, volatile]
 *         trendLine:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DataPoint'
 *         forecast:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DataPoint'
 *
 * @param {TrendAnalysisConfig} config - Trend analysis configuration
 * @returns {TrendAnalysisResult} Trend analysis results
 *
 * @example
 * ```typescript
 * const trend = analyzeTrend({
 *   dataPoints: historicalData,
 *   period: 'monthly',
 *   algorithm: 'linear',
 *   forecastPeriods: 3
 * });
 * ```
 */
const analyzeTrend = (config) => {
    const { dataPoints, algorithm } = config;
    // Calculate trend line
    const trendLine = (0, exports.calculateTrendLine)(dataPoints, algorithm);
    // Determine trend direction
    const firstValue = dataPoints[0]?.value || 0;
    const lastValue = dataPoints[dataPoints.length - 1]?.value || 0;
    const change = ((lastValue - firstValue) / firstValue) * 100;
    let trend;
    const volatility = (0, exports.calculateVolatility)(dataPoints);
    if (volatility > 0.3) {
        trend = 'volatile';
    }
    else if (Math.abs(change) < 5) {
        trend = 'stable';
    }
    else if (change > 0) {
        trend = 'upward';
    }
    else {
        trend = 'downward';
    }
    // Generate forecast if requested
    const forecast = config.forecastPeriods
        ? (0, exports.generateForecast)(trendLine, config.forecastPeriods)
        : undefined;
    return {
        trend,
        trendLine,
        forecast,
        volatility,
    };
};
exports.analyzeTrend = analyzeTrend;
/**
 * 27. Calculates trend line using specified algorithm.
 *
 * @param {DataPoint[]} dataPoints - Data points
 * @param {string} algorithm - Algorithm type
 * @returns {DataPoint[]} Trend line data points
 *
 * @example
 * ```typescript
 * const trendLine = calculateTrendLine(data, 'linear');
 * ```
 */
const calculateTrendLine = (dataPoints, algorithm) => {
    if (algorithm === 'moving-average') {
        return (0, exports.calculateMovingAverage)(dataPoints, 3);
    }
    // Simple linear regression for other algorithms
    const n = dataPoints.length;
    const xValues = dataPoints.map((_, i) => i);
    const yValues = dataPoints.map((p) => p.value);
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return dataPoints.map((point, i) => ({
        timestamp: point.timestamp,
        value: slope * i + intercept,
        label: point.label,
    }));
};
exports.calculateTrendLine = calculateTrendLine;
/**
 * 28. Calculates moving average for smoothing.
 *
 * @param {DataPoint[]} dataPoints - Data points
 * @param {number} window - Window size
 * @returns {DataPoint[]} Smoothed data points
 *
 * @example
 * ```typescript
 * const smoothed = calculateMovingAverage(data, 7); // 7-day moving average
 * ```
 */
const calculateMovingAverage = (dataPoints, window) => {
    return dataPoints.map((point, i) => {
        const start = Math.max(0, i - Math.floor(window / 2));
        const end = Math.min(dataPoints.length, i + Math.ceil(window / 2));
        const windowData = dataPoints.slice(start, end);
        const avg = windowData.reduce((sum, p) => sum + p.value, 0) / windowData.length;
        return {
            timestamp: point.timestamp,
            value: avg,
            label: point.label,
        };
    });
};
exports.calculateMovingAverage = calculateMovingAverage;
/**
 * 29. Generates forecast based on trend line.
 *
 * @param {DataPoint[]} trendLine - Trend line data
 * @param {number} periods - Number of periods to forecast
 * @returns {DataPoint[]} Forecasted data points
 *
 * @example
 * ```typescript
 * const forecast = generateForecast(trendLine, 6); // 6 periods ahead
 * ```
 */
const generateForecast = (trendLine, periods) => {
    if (trendLine.length < 2)
        return [];
    const lastPoint = trendLine[trendLine.length - 1];
    const secondLastPoint = trendLine[trendLine.length - 2];
    const slope = lastPoint.value - secondLastPoint.value;
    const forecast = [];
    for (let i = 1; i <= periods; i++) {
        const lastTimestamp = new Date(lastPoint.timestamp);
        const nextTimestamp = new Date(lastTimestamp.getTime() + i * 24 * 60 * 60 * 1000); // Add days
        forecast.push({
            timestamp: nextTimestamp,
            value: lastPoint.value + slope * i,
            label: `Forecast ${i}`,
        });
    }
    return forecast;
};
exports.generateForecast = generateForecast;
/**
 * 30. Calculates volatility of data points.
 *
 * @param {DataPoint[]} dataPoints - Data points
 * @returns {number} Volatility measure (0-1)
 *
 * @example
 * ```typescript
 * const vol = calculateVolatility(data);
 * ```
 */
const calculateVolatility = (dataPoints) => {
    if (dataPoints.length < 2)
        return 0;
    const values = dataPoints.map((p) => p.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return mean !== 0 ? stdDev / mean : 0;
};
exports.calculateVolatility = calculateVolatility;
// ============================================================================
// 7. COMPARATIVE ANALYSIS UTILITIES
// ============================================================================
/**
 * 31. Performs comparative analysis across datasets.
 *
 * @swagger
 * components:
 *   schemas:
 *     ComparativeAnalysisResult:
 *       type: object
 *       properties:
 *         comparisons:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ComparisonResult'
 *         summary:
 *           $ref: '#/components/schemas/ComparisonSummary'
 *
 * @param {ComparativeAnalysisConfig} config - Comparison configuration
 * @returns {ComparativeAnalysisResult} Comparison results
 *
 * @example
 * ```typescript
 * const analysis = performComparativeAnalysis({
 *   datasets: [q1Data, q2Data],
 *   dimensions: ['region', 'product'],
 *   metrics: ['revenue', 'units'],
 *   comparisonType: 'period-over-period'
 * });
 * ```
 */
const performComparativeAnalysis = (config) => {
    const comparisons = [];
    let totalChanges = 0;
    let significantChanges = 0;
    config.dimensions.forEach((dimension) => {
        config.metrics.forEach((metric) => {
            const values = {};
            const differences = {};
            const percentageChanges = {};
            config.datasets.forEach((dataset, index) => {
                const key = dataset.label;
                values[key] = calculateMetricValue(dataset.data, metric);
                if (index > 0) {
                    const prevKey = config.datasets[index - 1].label;
                    const prevValue = values[prevKey];
                    const currentValue = values[key];
                    differences[`${prevKey}->${key}`] = currentValue - prevValue;
                    percentageChanges[`${prevKey}->${key}`] =
                        prevValue !== 0 ? ((currentValue - prevValue) / prevValue) * 100 : 0;
                    totalChanges++;
                    if (Math.abs(percentageChanges[`${prevKey}->${key}`]) > 10) {
                        significantChanges++;
                    }
                }
            });
            comparisons.push({
                dimension,
                metric,
                values,
                differences,
                percentageChanges,
            });
        });
    });
    const allChanges = comparisons.flatMap((c) => Object.values(c.percentageChanges));
    const averageChange = allChanges.reduce((sum, v) => sum + v, 0) / allChanges.length;
    const maxIncrease = findMaxChange(comparisons, 'increase');
    const maxDecrease = findMaxChange(comparisons, 'decrease');
    return {
        comparisons,
        summary: {
            totalComparisons: comparisons.length,
            significantChanges,
            averageChange,
            maxIncrease,
            maxDecrease,
        },
        insights: (0, exports.generateAnalyticsInsights)(comparisons),
    };
};
exports.performComparativeAnalysis = performComparativeAnalysis;
/**
 * 32. Calculates metric value from dataset.
 *
 * @param {Record<string, any>[]} data - Dataset
 * @param {string} metric - Metric field
 * @returns {number} Calculated metric value
 */
const calculateMetricValue = (data, metric) => {
    return data.reduce((sum, row) => sum + Number(row[metric] || 0), 0);
};
/**
 * 33. Finds maximum change in comparisons.
 *
 * @param {ComparisonResult[]} comparisons - Comparison results
 * @param {string} type - Type of change (increase/decrease)
 * @returns {any} Maximum change details
 */
const findMaxChange = (comparisons, type) => {
    let max = { dimension: '', metric: '', value: type === 'increase' ? -Infinity : Infinity };
    comparisons.forEach((comp) => {
        Object.values(comp.percentageChanges).forEach((change) => {
            if (type === 'increase' && change > max.value) {
                max = { dimension: comp.dimension, metric: comp.metric, value: change };
            }
            else if (type === 'decrease' && change < max.value) {
                max = { dimension: comp.dimension, metric: comp.metric, value: change };
            }
        });
    });
    return max;
};
/**
 * 34. Compares two time periods.
 *
 * @param {Record<string, any>[]} currentPeriod - Current period data
 * @param {Record<string, any>[]} previousPeriod - Previous period data
 * @param {string[]} metrics - Metrics to compare
 * @returns {Record<string, any>} Period comparison
 *
 * @example
 * ```typescript
 * const comparison = comparePeriods(thisMonth, lastMonth, ['revenue', 'units']);
 * ```
 */
const comparePeriods = (currentPeriod, previousPeriod, metrics) => {
    const result = {};
    metrics.forEach((metric) => {
        const currentValue = calculateMetricValue(currentPeriod, metric);
        const previousValue = calculateMetricValue(previousPeriod, metric);
        const difference = currentValue - previousValue;
        const percentageChange = previousValue !== 0 ? (difference / previousValue) * 100 : 0;
        result[metric] = {
            current: currentValue,
            previous: previousValue,
            difference,
            percentageChange,
            trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
        };
    });
    return result;
};
exports.comparePeriods = comparePeriods;
/**
 * 35. Generates analytics insights from comparisons.
 *
 * @param {ComparisonResult[]} comparisons - Comparison results
 * @returns {AnalyticsInsight[]} Generated insights
 *
 * @example
 * ```typescript
 * const insights = generateAnalyticsInsights(comparisonResults);
 * ```
 */
const generateAnalyticsInsights = (comparisons) => {
    const insights = [];
    comparisons.forEach((comp) => {
        Object.entries(comp.percentageChanges).forEach(([key, change]) => {
            if (Math.abs(change) > 20) {
                insights.push({
                    type: 'trend',
                    severity: Math.abs(change) > 50 ? 'critical' : 'warning',
                    title: `Significant ${change > 0 ? 'increase' : 'decrease'} in ${comp.metric}`,
                    description: `${comp.metric} changed by ${change.toFixed(2)}% for ${comp.dimension}`,
                    confidence: 0.85,
                    affectedMetrics: [comp.metric],
                });
            }
        });
    });
    return insights;
};
exports.generateAnalyticsInsights = generateAnalyticsInsights;
// ============================================================================
// 8. EXPORT TO MULTIPLE FORMATS
// ============================================================================
/**
 * 36. Exports report data to specified format.
 *
 * @swagger
 * /api/reports/export:
 *   post:
 *     summary: Export report to various formats
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *               format:
 *                 type: string
 *                 enum: [pdf, excel, csv, json, xml]
 *     responses:
 *       200:
 *         description: Export successful
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *
 * @param {Record<string, any>} data - Report data
 * @param {ExportConfig} config - Export configuration
 * @returns {Promise<Buffer>} Exported file buffer
 *
 * @example
 * ```typescript
 * const buffer = await exportReport(reportData, {
 *   format: 'excel',
 *   fileName: 'monthly-report.xlsx'
 * });
 * ```
 */
const exportReport = async (data, config) => {
    switch (config.format) {
        case 'pdf':
            return (0, exports.exportToPDF)(data, config.options);
        case 'excel':
            return (0, exports.exportToExcel)(data, config.options);
        case 'csv':
            return (0, exports.exportToCSV)(data, config.options);
        case 'json':
            return Buffer.from(JSON.stringify(data, null, 2));
        case 'xml':
            return (0, exports.exportToXML)(data, config.options);
        default:
            throw new Error(`Unsupported export format: ${config.format}`);
    }
};
exports.exportReport = exportReport;
/**
 * 37. Exports data to PDF format.
 *
 * @param {Record<string, any>} data - Data to export
 * @param {ExportOptions} [options] - PDF options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await exportToPDF(reportData, {
 *   orientation: 'landscape',
 *   pageSize: 'A4'
 * });
 * ```
 */
const exportToPDF = async (data, options) => {
    // Placeholder implementation - would use PDFKit or similar
    const pdfContent = `PDF Report\n\nData: ${JSON.stringify(data, null, 2)}`;
    return Buffer.from(pdfContent);
};
exports.exportToPDF = exportToPDF;
/**
 * 38. Exports data to Excel format.
 *
 * @param {Record<string, any>} data - Data to export
 * @param {ExportOptions} [options] - Excel options
 * @returns {Promise<Buffer>} Excel buffer
 *
 * @example
 * ```typescript
 * const excel = await exportToExcel(reportData, { compression: true });
 * ```
 */
const exportToExcel = async (data, options) => {
    // Placeholder implementation - would use ExcelJS or similar
    const excelContent = `Excel Report\n\nData: ${JSON.stringify(data, null, 2)}`;
    return Buffer.from(excelContent);
};
exports.exportToExcel = exportToExcel;
/**
 * 39. Exports data to CSV format.
 *
 * @param {Record<string, any>} data - Data to export
 * @param {ExportOptions} [options] - CSV options
 * @returns {Promise<Buffer>} CSV buffer
 *
 * @example
 * ```typescript
 * const csv = await exportToCSV(reportData);
 * ```
 */
const exportToCSV = async (data, options) => {
    const rows = Array.isArray(data.data) ? data.data : [data];
    if (rows.length === 0) {
        return Buffer.from('');
    }
    const headers = Object.keys(rows[0]);
    const csvLines = [headers.join(',')];
    rows.forEach((row) => {
        const values = headers.map((header) => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        });
        csvLines.push(values.join(','));
    });
    return Buffer.from(csvLines.join('\n'));
};
exports.exportToCSV = exportToCSV;
/**
 * 40. Exports data to XML format.
 *
 * @param {Record<string, any>} data - Data to export
 * @param {ExportOptions} [options] - XML options
 * @returns {Promise<Buffer>} XML buffer
 *
 * @example
 * ```typescript
 * const xml = await exportToXML(reportData);
 * ```
 */
const exportToXML = async (data, options) => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<report>\n${objectToXML(data, '  ')}\n</report>`;
    return Buffer.from(xml);
};
exports.exportToXML = exportToXML;
/**
 * Helper function to convert object to XML.
 */
const objectToXML = (obj, indent = '') => {
    let xml = '';
    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            value.forEach((item) => {
                xml += `${indent}<${key}>\n${objectToXML(item, indent + '  ')}\n${indent}</${key}>\n`;
            });
        }
        else if (typeof value === 'object' && value !== null) {
            xml += `${indent}<${key}>\n${objectToXML(value, indent + '  ')}\n${indent}</${key}>\n`;
        }
        else {
            xml += `${indent}<${key}>${value}</${key}>\n`;
        }
    }
    return xml;
};
// ============================================================================
// 9. REPORT SCHEDULING AND DISTRIBUTION
// ============================================================================
/**
 * 41. Creates a report schedule configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     ReportSchedule:
 *       type: object
 *       required:
 *         - id
 *         - reportId
 *         - schedule
 *         - recipients
 *       properties:
 *         id:
 *           type: string
 *         reportId:
 *           type: string
 *         schedule:
 *           $ref: '#/components/schemas/ScheduleConfig'
 *         recipients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecipientConfig'
 *
 * @param {Partial<ReportSchedule>} schedule - Schedule configuration
 * @returns {ReportSchedule} Complete schedule configuration
 *
 * @example
 * ```typescript
 * const schedule = createReportSchedule({
 *   reportId: 'monthly-sales',
 *   schedule: { frequency: 'monthly', dayOfMonth: 1 },
 *   recipients: [{ email: 'user@example.com', type: 'to' }]
 * });
 * ```
 */
const createReportSchedule = (schedule) => {
    return {
        id: schedule.id || `schedule-${Date.now()}`,
        reportId: schedule.reportId || '',
        name: schedule.name || '',
        schedule: schedule.schedule || { frequency: 'daily', startDate: new Date() },
        recipients: schedule.recipients || [],
        format: schedule.format || 'pdf',
        enabled: schedule.enabled !== false,
        lastRun: schedule.lastRun,
        nextRun: schedule.nextRun || (0, exports.calculateNextRun)(schedule.schedule),
    };
};
exports.createReportSchedule = createReportSchedule;
/**
 * 42. Calculates next run time for scheduled report.
 *
 * @param {ScheduleConfig} schedule - Schedule configuration
 * @returns {Date} Next run date
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextRun(scheduleConfig);
 * ```
 */
const calculateNextRun = (schedule) => {
    const now = new Date();
    let nextRun = new Date(schedule.startDate);
    switch (schedule.frequency) {
        case 'daily':
            while (nextRun <= now) {
                nextRun.setDate(nextRun.getDate() + 1);
            }
            break;
        case 'weekly':
            while (nextRun <= now) {
                nextRun.setDate(nextRun.getDate() + 7);
            }
            break;
        case 'monthly':
            while (nextRun <= now) {
                nextRun.setMonth(nextRun.getMonth() + 1);
            }
            break;
        case 'quarterly':
            while (nextRun <= now) {
                nextRun.setMonth(nextRun.getMonth() + 3);
            }
            break;
        case 'yearly':
            while (nextRun <= now) {
                nextRun.setFullYear(nextRun.getFullYear() + 1);
            }
            break;
    }
    return nextRun;
};
exports.calculateNextRun = calculateNextRun;
/**
 * 43. Validates report schedule configuration.
 *
 * @param {ReportSchedule} schedule - Schedule to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReportSchedule(schedule);
 * ```
 */
const validateReportSchedule = (schedule) => {
    const errors = [];
    if (!schedule.reportId)
        errors.push('Report ID is required');
    if (!schedule.recipients || schedule.recipients.length === 0) {
        errors.push('At least one recipient is required');
    }
    if (!schedule.schedule)
        errors.push('Schedule configuration is required');
    schedule.recipients?.forEach((recipient, index) => {
        if (!recipient.email || !recipient.email.includes('@')) {
            errors.push(`Recipient ${index}: Invalid email address`);
        }
    });
    return { valid: errors.length === 0, errors };
};
exports.validateReportSchedule = validateReportSchedule;
/**
 * 44. Distributes report to recipients.
 *
 * @param {ReportSchedule} schedule - Report schedule
 * @param {Buffer} reportFile - Report file buffer
 * @returns {Promise<{ sent: number; failed: number }>} Distribution result
 *
 * @example
 * ```typescript
 * const result = await distributeReport(schedule, reportBuffer);
 * ```
 */
const distributeReport = async (schedule, reportFile) => {
    let sent = 0;
    let failed = 0;
    for (const recipient of schedule.recipients) {
        try {
            // Placeholder for email sending logic
            console.log(`Sending report to ${recipient.email}`);
            sent++;
        }
        catch (error) {
            console.error(`Failed to send to ${recipient.email}:`, error);
            failed++;
        }
    }
    return { sent, failed };
};
exports.distributeReport = distributeReport;
/**
 * 45. Updates schedule with last run information.
 *
 * @param {ReportSchedule} schedule - Schedule to update
 * @returns {ReportSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = updateScheduleRunInfo(schedule);
 * ```
 */
const updateScheduleRunInfo = (schedule) => {
    return {
        ...schedule,
        lastRun: new Date(),
        nextRun: (0, exports.calculateNextRun)(schedule.schedule),
    };
};
exports.updateScheduleRunInfo = updateScheduleRunInfo;
//# sourceMappingURL=reporting-analytics-kit.js.map
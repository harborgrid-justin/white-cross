/**
 * LOC: SEQQ1234567
 * File: /reuse/sequelize-query-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - Database models and schemas
 *
 * DOWNSTREAM (imported by):
 *   - NestJS service layer
 *   - Repository implementations
 *   - Query builders
 *   - Data access objects
 */
/**
 * File: /reuse/sequelize-query-kit.ts
 * Locator: WC-UTL-SEQQ-005
 * Purpose: Sequelize Query Kit - Comprehensive query building and execution utilities
 *
 * Upstream: Sequelize ORM, database connection pools
 * Downstream: ../backend/*, ../services/*, repository layers, API endpoints
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x
 * Exports: 45 utility functions for query building, filtering, pagination, aggregation, joins, subqueries
 *
 * LLM Context: Comprehensive Sequelize query utilities for White Cross healthcare system.
 * Provides query builders, advanced WHERE clause construction, operator helpers, pagination,
 * sorting, filtering, search, aggregation, grouping, joins, subqueries, and raw query execution.
 * Essential for efficient, secure, and maintainable database queries in healthcare applications.
 */
import { Op, Sequelize, Model, ModelStatic, FindOptions, WhereOptions, Order, GroupOption, Includeable, QueryTypes } from 'sequelize';
interface PaginationParams {
    page: number;
    limit: number;
    offset?: number;
}
interface PaginatedResults<T> {
    rows: T[];
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
interface FilterCondition {
    field: string;
    operator: keyof typeof Op;
    value: any;
    options?: {
        caseSensitive?: boolean;
        negated?: boolean;
    };
}
interface SortCondition {
    field: string;
    direction: 'ASC' | 'DESC';
    nulls?: 'FIRST' | 'LAST';
}
interface SearchOptions {
    fields: string[];
    query: string;
    exactMatch?: boolean;
    caseSensitive?: boolean;
}
interface AggregationOptions {
    field: string;
    function: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
    alias?: string;
    distinct?: boolean;
}
interface JoinOptions {
    model: ModelStatic<any>;
    as?: string;
    required?: boolean;
    where?: WhereOptions<any>;
    attributes?: string[];
    include?: JoinOptions[];
}
interface SubQueryOptions {
    select: string | string[];
    from: string;
    where?: WhereOptions<any>;
    alias: string;
}
interface RawQueryOptions {
    query: string;
    replacements?: Record<string, any>;
    type?: QueryTypes;
    mapToModel?: boolean;
    model?: ModelStatic<any>;
}
interface CursorPaginationParams {
    cursor?: string;
    limit: number;
    cursorField?: string;
    direction?: 'forward' | 'backward';
}
interface CursorPaginatedResults<T> {
    data: T[];
    nextCursor: string | null;
    previousCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
/**
 * Creates a fluent query builder for constructing complex Sequelize queries.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @returns {object} Fluent query builder interface
 *
 * @example
 * ```typescript
 * const query = createQueryBuilder(Patient)
 *   .where({ status: 'active' })
 *   .include([{ model: MedicalRecord }])
 *   .orderBy('createdAt', 'DESC')
 *   .limit(20)
 *   .build();
 * const results = await Patient.findAll(query);
 * ```
 */
export declare const createQueryBuilder: <T extends Model>(model: ModelStatic<T>) => {
    where(conditions: WhereOptions<T>): /*elided*/ any;
    include(includes: Includeable[]): /*elided*/ any;
    attributes(attrs: string[] | {
        include?: string[];
        exclude?: string[];
    }): /*elided*/ any;
    orderBy(field: string, direction?: "ASC" | "DESC"): /*elided*/ any;
    limit(count: number): /*elided*/ any;
    offset(count: number): /*elided*/ any;
    groupBy(fields: GroupOption): /*elided*/ any;
    having(conditions: WhereOptions<T>): /*elided*/ any;
    distinct(value?: boolean): /*elided*/ any;
    subQuery(value?: boolean): /*elided*/ any;
    build(): FindOptions<T>;
};
/**
 * Builds a complete FindOptions object from individual components.
 *
 * @template T
 * @param {Partial<FindOptions<T>>} options - Query options components
 * @returns {FindOptions<T>} Complete FindOptions object
 *
 * @example
 * ```typescript
 * const options = buildFindOptions({
 *   where: { status: 'active' },
 *   include: [{ model: MedicalRecord }],
 *   order: [['createdAt', 'DESC']],
 *   limit: 20
 * });
 * ```
 */
export declare const buildFindOptions: <T extends Model>(options: Partial<FindOptions<T>>) => FindOptions<T>;
/**
 * Builds a WHERE clause from filter conditions array.
 *
 * @param {FilterCondition[]} conditions - Array of filter conditions
 * @returns {WhereOptions<any>} Sequelize WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildWhereClause([
 *   { field: 'age', operator: 'gte', value: 18 },
 *   { field: 'status', operator: 'eq', value: 'active' },
 *   { field: 'email', operator: 'like', value: '@example.com' }
 * ]);
 * ```
 */
export declare const buildWhereClause: (conditions: FilterCondition[]) => WhereOptions<any>;
/**
 * Builds a complex WHERE clause with AND/OR logic.
 *
 * @param {object} conditions - Object with and/or arrays
 * @returns {WhereOptions<any>} Sequelize WHERE clause with logic operators
 *
 * @example
 * ```typescript
 * const where = buildComplexWhere({
 *   and: [
 *     { status: 'active' },
 *     { or: [{ age: { [Op.gte]: 18 } }, { hasGuardianConsent: true }] }
 *   ]
 * });
 * ```
 */
export declare const buildComplexWhere: (conditions: {
    and?: WhereOptions<any>[];
    or?: WhereOptions<any>[];
}) => WhereOptions<any>;
/**
 * Creates a WHERE clause for date range filtering.
 *
 * @param {string} field - Date field name
 * @param {Date} startDate - Start date (inclusive)
 * @param {Date} endDate - End date (inclusive)
 * @returns {WhereOptions<any>} Date range WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildDateRangeWhere('appointmentDate',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * // Result: { appointmentDate: { [Op.between]: [start, end] } }
 * ```
 */
export declare const buildDateRangeWhere: (field: string, startDate: Date, endDate: Date) => WhereOptions<any>;
/**
 * Creates a WHERE clause for array/JSON field containment.
 *
 * @param {string} field - Field name (array or JSON field)
 * @param {any} values - Values to check for containment
 * @returns {WhereOptions<any>} Containment WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildContainsWhere('permissions', ['read', 'write']);
 * const jsonWhere = buildContainsWhere('metadata', { active: true });
 * ```
 */
export declare const buildContainsWhere: (field: string, values: any) => WhereOptions<any>;
/**
 * Creates a WHERE clause for full-text search.
 *
 * @param {string[]} fields - Fields to search in
 * @param {string} searchTerm - Search term
 * @param {boolean} [caseSensitive] - Case-sensitive search (default: false)
 * @returns {WhereOptions<any>} Full-text search WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildFullTextSearchWhere(
 *   ['firstName', 'lastName', 'email'],
 *   'john doe'
 * );
 * ```
 */
export declare const buildFullTextSearchWhere: (fields: string[], searchTerm: string, caseSensitive?: boolean) => WhereOptions<any>;
/**
 * Creates a WHERE clause for NULL/NOT NULL checks.
 *
 * @param {string} field - Field name
 * @param {boolean} isNull - True for IS NULL, false for IS NOT NULL
 * @returns {WhereOptions<any>} NULL check WHERE clause
 *
 * @example
 * ```typescript
 * const whereNull = buildNullCheckWhere('deletedAt', true);
 * const whereNotNull = buildNullCheckWhere('assignedDoctorId', false);
 * ```
 */
export declare const buildNullCheckWhere: (field: string, isNull: boolean) => WhereOptions<any>;
/**
 * Creates a WHERE clause for IN operator with array of values.
 *
 * @param {string} field - Field name
 * @param {any[]} values - Array of values
 * @param {boolean} [negate] - Use NOT IN (default: false)
 * @returns {WhereOptions<any>} IN/NOT IN WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildInWhere('status', ['active', 'pending', 'approved']);
 * const whereNotIn = buildInWhere('department', ['finance', 'legal'], true);
 * ```
 */
export declare const buildInWhere: (field: string, values: any[], negate?: boolean) => WhereOptions<any>;
/**
 * Creates comparison operators for numeric fields.
 *
 * @param {string} field - Field name
 * @param {object} comparisons - Comparison operators and values
 * @returns {WhereOptions<any>} Numeric comparison WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildNumericComparison('age', {
 *   gte: 18,
 *   lt: 65
 * });
 * // Result: { age: { [Op.gte]: 18, [Op.lt]: 65 } }
 * ```
 */
export declare const buildNumericComparison: (field: string, comparisons: {
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;
    eq?: number;
    ne?: number;
}) => WhereOptions<any>;
/**
 * Creates string pattern matching operators.
 *
 * @param {string} field - Field name
 * @param {object} patterns - Pattern matching options
 * @returns {WhereOptions<any>} String pattern WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildStringPattern('email', {
 *   startsWith: 'admin',
 *   endsWith: '@example.com',
 *   caseSensitive: false
 * });
 * ```
 */
export declare const buildStringPattern: (field: string, patterns: {
    startsWith?: string;
    endsWith?: string;
    contains?: string;
    exact?: string;
    caseSensitive?: boolean;
}) => WhereOptions<any>;
/**
 * Creates array overlap operator for PostgreSQL arrays.
 *
 * @param {string} field - Array field name
 * @param {any[]} values - Values to check for overlap
 * @returns {WhereOptions<any>} Array overlap WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildArrayOverlap('tags', ['urgent', 'critical', 'emergency']);
 * ```
 */
export declare const buildArrayOverlap: (field: string, values: any[]) => WhereOptions<any>;
/**
 * Calculates offset and limit for pagination.
 *
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {PaginationParams} Pagination parameters with offset
 *
 * @example
 * ```typescript
 * const params = calculatePagination(2, 20);
 * // Result: { page: 2, limit: 20, offset: 20 }
 * ```
 */
export declare const calculatePagination: (page: number, limit: number) => PaginationParams;
/**
 * Executes a paginated query with count.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {PaginationParams} pagination - Pagination parameters
 * @param {FindOptions<T>} [options] - Additional query options
 * @returns {Promise<PaginatedResults<T>>} Paginated results with metadata
 *
 * @example
 * ```typescript
 * const results = await executePaginatedQuery(
 *   Patient,
 *   { page: 1, limit: 20 },
 *   { where: { status: 'active' }, order: [['createdAt', 'DESC']] }
 * );
 * ```
 */
export declare const executePaginatedQuery: <T extends Model>(model: ModelStatic<T>, pagination: PaginationParams, options?: FindOptions<T>) => Promise<PaginatedResults<T>>;
/**
 * Implements cursor-based pagination for efficient large dataset navigation.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {CursorPaginationParams} params - Cursor pagination parameters
 * @param {FindOptions<T>} [options] - Additional query options
 * @returns {Promise<CursorPaginatedResults<T>>} Cursor-paginated results
 *
 * @example
 * ```typescript
 * const results = await executeCursorPagination(
 *   Patient,
 *   { limit: 20, cursor: 'patient-123', cursorField: 'id' },
 *   { where: { status: 'active' } }
 * );
 * ```
 */
export declare const executeCursorPagination: <T extends Model>(model: ModelStatic<T>, params: CursorPaginationParams, options?: FindOptions<T>) => Promise<CursorPaginatedResults<T>>;
/**
 * Builds ORDER BY clause from sort conditions.
 *
 * @param {SortCondition[]} conditions - Array of sort conditions
 * @returns {Order} Sequelize ORDER clause
 *
 * @example
 * ```typescript
 * const order = buildOrderClause([
 *   { field: 'priority', direction: 'DESC', nulls: 'LAST' },
 *   { field: 'createdAt', direction: 'ASC' }
 * ]);
 * ```
 */
export declare const buildOrderClause: (conditions: SortCondition[]) => Order;
/**
 * Builds multi-level sorting with nested associations.
 *
 * @param {Array<{ model?: ModelStatic<any>; field: string; direction: 'ASC' | 'DESC' }>} sorts - Multi-level sorts
 * @returns {Order} Sequelize ORDER clause with associations
 *
 * @example
 * ```typescript
 * const order = buildNestedOrderClause([
 *   { model: Patient, field: 'lastName', direction: 'ASC' },
 *   { field: 'appointmentDate', direction: 'DESC' }
 * ]);
 * ```
 */
export declare const buildNestedOrderClause: (sorts: Array<{
    model?: ModelStatic<any>;
    field: string;
    direction: "ASC" | "DESC";
}>) => Order;
/**
 * Executes a search query across multiple fields.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {SearchOptions} searchOptions - Search configuration
 * @param {FindOptions<T>} [queryOptions] - Additional query options
 * @returns {Promise<T[]>} Search results
 *
 * @example
 * ```typescript
 * const patients = await executeSearch(
 *   Patient,
 *   {
 *     fields: ['firstName', 'lastName', 'email', 'studentId'],
 *     query: 'john',
 *     caseSensitive: false
 *   }
 * );
 * ```
 */
export declare const executeSearch: <T extends Model>(model: ModelStatic<T>, searchOptions: SearchOptions, queryOptions?: FindOptions<T>) => Promise<T[]>;
/**
 * Builds a dynamic filter from query parameters.
 *
 * @param {Record<string, any>} queryParams - Query parameters from request
 * @param {string[]} allowedFields - Fields allowed for filtering
 * @returns {WhereOptions<any>} WHERE clause from query params
 *
 * @example
 * ```typescript
 * const where = buildDynamicFilter(
 *   { status: 'active', 'age[gte]': '18', department: 'cardiology' },
 *   ['status', 'age', 'department']
 * );
 * ```
 */
export declare const buildDynamicFilter: (queryParams: Record<string, any>, allowedFields: string[]) => WhereOptions<any>;
/**
 * Executes aggregation queries with grouping.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {AggregationOptions[]} aggregations - Aggregation configurations
 * @param {string[]} [groupBy] - Fields to group by
 * @param {WhereOptions<T>} [where] - WHERE clause
 * @returns {Promise<any[]>} Aggregation results
 *
 * @example
 * ```typescript
 * const stats = await executeAggregation(
 *   Appointment,
 *   [
 *     { field: 'id', function: 'COUNT', alias: 'totalAppointments' },
 *     { field: 'duration', function: 'AVG', alias: 'avgDuration' }
 *   ],
 *   ['status', 'departmentId']
 * );
 * ```
 */
export declare const executeAggregation: <T extends Model>(model: ModelStatic<T>, aggregations: AggregationOptions[], groupBy?: string[], where?: WhereOptions<T>) => Promise<any[]>;
/**
 * Calculates count with grouping.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {string} groupField - Field to group by
 * @param {WhereOptions<T>} [where] - WHERE clause
 * @returns {Promise<Array<{ group: any; count: number }>>} Count by group
 *
 * @example
 * ```typescript
 * const counts = await countByGroup(Patient, 'status');
 * // Result: [{ group: 'active', count: 150 }, { group: 'inactive', count: 25 }]
 * ```
 */
export declare const countByGroup: <T extends Model>(model: ModelStatic<T>, groupField: string, where?: WhereOptions<T>) => Promise<Array<{
    group: any;
    count: number;
}>>;
/**
 * Calculates sum with grouping.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {string} sumField - Field to sum
 * @param {string} groupField - Field to group by
 * @param {WhereOptions<T>} [where] - WHERE clause
 * @returns {Promise<Array<{ group: any; sum: number }>>} Sum by group
 *
 * @example
 * ```typescript
 * const sums = await sumByGroup(Invoice, 'amount', 'departmentId');
 * // Result: [{ group: 'dept1', sum: 15000 }, { group: 'dept2', sum: 23000 }]
 * ```
 */
export declare const sumByGroup: <T extends Model>(model: ModelStatic<T>, sumField: string, groupField: string, where?: WhereOptions<T>) => Promise<Array<{
    group: any;
    sum: number;
}>>;
/**
 * Calculates average with grouping.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {string} avgField - Field to average
 * @param {string} groupField - Field to group by
 * @param {WhereOptions<T>} [where] - WHERE clause
 * @returns {Promise<Array<{ group: any; average: number }>>} Average by group
 *
 * @example
 * ```typescript
 * const averages = await averageByGroup(Grade, 'score', 'courseId');
 * ```
 */
export declare const averageByGroup: <T extends Model>(model: ModelStatic<T>, avgField: string, groupField: string, where?: WhereOptions<T>) => Promise<Array<{
    group: any;
    average: number;
}>>;
/**
 * Builds include options for eager loading associations.
 *
 * @param {JoinOptions[]} joins - Array of join configurations
 * @returns {Includeable[]} Sequelize include array
 *
 * @example
 * ```typescript
 * const includes = buildJoinIncludes([
 *   {
 *     model: MedicalRecord,
 *     as: 'medicalRecords',
 *     required: false,
 *     where: { type: 'diagnosis' }
 *   },
 *   {
 *     model: Doctor,
 *     as: 'assignedDoctor',
 *     required: true,
 *     attributes: ['id', 'firstName', 'lastName']
 *   }
 * ]);
 * ```
 */
export declare const buildJoinIncludes: (joins: JoinOptions[]) => Includeable[];
/**
 * Executes query with left join.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {JoinOptions} join - Join configuration
 * @param {WhereOptions<T>} [where] - WHERE clause for main model
 * @returns {Promise<T[]>} Results with joined data
 *
 * @example
 * ```typescript
 * const patients = await executeLeftJoin(
 *   Patient,
 *   { model: MedicalRecord, as: 'medicalRecords', required: false }
 * );
 * ```
 */
export declare const executeLeftJoin: <T extends Model>(model: ModelStatic<T>, join: JoinOptions, where?: WhereOptions<T>) => Promise<T[]>;
/**
 * Executes query with inner join.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {JoinOptions} join - Join configuration
 * @param {WhereOptions<T>} [where] - WHERE clause for main model
 * @returns {Promise<T[]>} Results with joined data (only matching records)
 *
 * @example
 * ```typescript
 * const patientsWithRecords = await executeInnerJoin(
 *   Patient,
 *   { model: MedicalRecord, as: 'medicalRecords', required: true }
 * );
 * ```
 */
export declare const executeInnerJoin: <T extends Model>(model: ModelStatic<T>, join: JoinOptions, where?: WhereOptions<T>) => Promise<T[]>;
/**
 * Builds a subquery for use in WHERE IN clauses.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SubQueryOptions} options - Subquery options
 * @returns {any} Sequelize literal for subquery
 *
 * @example
 * ```typescript
 * const subquery = buildSubquery(sequelize, {
 *   select: 'patientId',
 *   from: 'appointments',
 *   where: { status: 'confirmed', date: { [Op.gte]: new Date() } },
 *   alias: 'confirmedPatients'
 * });
 * const where = { id: { [Op.in]: subquery } };
 * ```
 */
export declare const buildSubquery: (sequelize: Sequelize, options: SubQueryOptions) => any;
/**
 * Executes EXISTS subquery check.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} existsQuery - EXISTS subquery SQL
 * @param {WhereOptions<T>} [where] - Additional WHERE conditions
 * @returns {Promise<T[]>} Records where subquery exists
 *
 * @example
 * ```typescript
 * const patientsWithAppointments = await executeExistsSubquery(
 *   Patient,
 *   sequelize,
 *   'SELECT 1 FROM appointments WHERE appointments.patientId = Patient.id AND status = \'confirmed\''
 * );
 * ```
 */
export declare const executeExistsSubquery: <T extends Model>(model: ModelStatic<T>, sequelize: Sequelize, existsQuery: string, where?: WhereOptions<T>) => Promise<T[]>;
/**
 * Executes NOT EXISTS subquery check.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} notExistsQuery - NOT EXISTS subquery SQL
 * @param {WhereOptions<T>} [where] - Additional WHERE conditions
 * @returns {Promise<T[]>} Records where subquery does not exist
 *
 * @example
 * ```typescript
 * const patientsWithoutAppointments = await executeNotExistsSubquery(
 *   Patient,
 *   sequelize,
 *   'SELECT 1 FROM appointments WHERE appointments.patientId = Patient.id'
 * );
 * ```
 */
export declare const executeNotExistsSubquery: <T extends Model>(model: ModelStatic<T>, sequelize: Sequelize, notExistsQuery: string, where?: WhereOptions<T>) => Promise<T[]>;
/**
 * Executes a raw SQL query with parameter binding.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RawQueryOptions} options - Raw query options
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await executeRawQuery(sequelize, {
 *   query: 'SELECT * FROM patients WHERE age > :minAge AND status = :status',
 *   replacements: { minAge: 18, status: 'active' },
 *   type: QueryTypes.SELECT
 * });
 * ```
 */
export declare const executeRawQuery: (sequelize: Sequelize, options: RawQueryOptions) => Promise<any[]>;
/**
 * Executes a stored procedure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} procedureName - Stored procedure name
 * @param {Record<string, any>} [params] - Procedure parameters
 * @returns {Promise<any>} Procedure results
 *
 * @example
 * ```typescript
 * const result = await executeStoredProcedure(
 *   sequelize,
 *   'calculate_patient_metrics',
 *   { patientId: 'patient-123', startDate: '2024-01-01' }
 * );
 * ```
 */
export declare const executeStoredProcedure: (sequelize: Sequelize, procedureName: string, params?: Record<string, any>) => Promise<any>;
/**
 * Executes a query with Common Table Expression (CTE).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cteName - CTE name
 * @param {string} cteQuery - CTE query
 * @param {string} mainQuery - Main query using CTE
 * @param {Record<string, any>} [replacements] - Query parameters
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await executeWithCTE(
 *   sequelize,
 *   'recent_patients',
 *   'SELECT * FROM patients WHERE createdAt > :startDate',
 *   'SELECT * FROM recent_patients WHERE status = :status',
 *   { startDate: '2024-01-01', status: 'active' }
 * );
 * ```
 */
export declare const executeWithCTE: (sequelize: Sequelize, cteName: string, cteQuery: string, mainQuery: string, replacements?: Record<string, any>) => Promise<any[]>;
/**
 * Executes a recursive CTE query (e.g., for hierarchical data).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cteName - Recursive CTE name
 * @param {string} anchorQuery - Anchor member query
 * @param {string} recursiveQuery - Recursive member query
 * @param {string} mainQuery - Main query using recursive CTE
 * @param {Record<string, any>} [replacements] - Query parameters
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const hierarchy = await executeRecursiveCTE(
 *   sequelize,
 *   'org_hierarchy',
 *   'SELECT id, name, parent_id, 0 as level FROM departments WHERE parent_id IS NULL',
 *   'SELECT d.id, d.name, d.parent_id, oh.level + 1 FROM departments d INNER JOIN org_hierarchy oh ON d.parent_id = oh.id',
 *   'SELECT * FROM org_hierarchy ORDER BY level, name'
 * );
 * ```
 */
export declare const executeRecursiveCTE: (sequelize: Sequelize, cteName: string, anchorQuery: string, recursiveQuery: string, mainQuery: string, replacements?: Record<string, any>) => Promise<any[]>;
/**
 * Executes EXPLAIN to analyze query performance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - Query to analyze
 * @param {Record<string, any>} [replacements] - Query parameters
 * @returns {Promise<any[]>} Explain results
 *
 * @example
 * ```typescript
 * const plan = await explainQuery(
 *   sequelize,
 *   'SELECT * FROM patients WHERE status = :status',
 *   { status: 'active' }
 * );
 * ```
 */
export declare const explainQuery: (sequelize: Sequelize, query: string, replacements?: Record<string, any>) => Promise<any[]>;
/**
 * Executes EXPLAIN ANALYZE for query performance with actual execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - Query to analyze
 * @param {Record<string, any>} [replacements] - Query parameters
 * @returns {Promise<any[]>} Explain analyze results
 *
 * @example
 * ```typescript
 * const analysis = await explainAnalyzeQuery(
 *   sequelize,
 *   'SELECT * FROM patients WHERE age > :minAge',
 *   { minAge: 18 }
 * );
 * ```
 */
export declare const explainAnalyzeQuery: (sequelize: Sequelize, query: string, replacements?: Record<string, any>) => Promise<any[]>;
/**
 * Disables subqueries for optimization in queries with includes.
 *
 * @template T
 * @param {FindOptions<T>} options - Find options
 * @returns {FindOptions<T>} Options with subQuery disabled
 *
 * @example
 * ```typescript
 * const options = disableSubquery({
 *   include: [{ model: MedicalRecord }],
 *   limit: 20
 * });
 * ```
 */
export declare const disableSubquery: <T extends Model>(options: FindOptions<T>) => FindOptions<T>;
declare const _default: {
    createQueryBuilder: <T extends Model>(model: ModelStatic<T>) => {
        where(conditions: WhereOptions<T>): /*elided*/ any;
        include(includes: Includeable[]): /*elided*/ any;
        attributes(attrs: string[] | {
            include?: string[];
            exclude?: string[];
        }): /*elided*/ any;
        orderBy(field: string, direction?: "ASC" | "DESC"): /*elided*/ any;
        limit(count: number): /*elided*/ any;
        offset(count: number): /*elided*/ any;
        groupBy(fields: GroupOption): /*elided*/ any;
        having(conditions: WhereOptions<T>): /*elided*/ any;
        distinct(value?: boolean): /*elided*/ any;
        subQuery(value?: boolean): /*elided*/ any;
        build(): FindOptions<T>;
    };
    buildFindOptions: <T extends Model>(options: Partial<FindOptions<T>>) => FindOptions<T>;
    buildWhereClause: (conditions: FilterCondition[]) => WhereOptions<any>;
    buildComplexWhere: (conditions: {
        and?: WhereOptions<any>[];
        or?: WhereOptions<any>[];
    }) => WhereOptions<any>;
    buildDateRangeWhere: (field: string, startDate: Date, endDate: Date) => WhereOptions<any>;
    buildContainsWhere: (field: string, values: any) => WhereOptions<any>;
    buildFullTextSearchWhere: (fields: string[], searchTerm: string, caseSensitive?: boolean) => WhereOptions<any>;
    buildNullCheckWhere: (field: string, isNull: boolean) => WhereOptions<any>;
    buildInWhere: (field: string, values: any[], negate?: boolean) => WhereOptions<any>;
    buildNumericComparison: (field: string, comparisons: {
        gt?: number;
        gte?: number;
        lt?: number;
        lte?: number;
        eq?: number;
        ne?: number;
    }) => WhereOptions<any>;
    buildStringPattern: (field: string, patterns: {
        startsWith?: string;
        endsWith?: string;
        contains?: string;
        exact?: string;
        caseSensitive?: boolean;
    }) => WhereOptions<any>;
    buildArrayOverlap: (field: string, values: any[]) => WhereOptions<any>;
    calculatePagination: (page: number, limit: number) => PaginationParams;
    executePaginatedQuery: <T extends Model>(model: ModelStatic<T>, pagination: PaginationParams, options?: FindOptions<T>) => Promise<PaginatedResults<T>>;
    executeCursorPagination: <T extends Model>(model: ModelStatic<T>, params: CursorPaginationParams, options?: FindOptions<T>) => Promise<CursorPaginatedResults<T>>;
    buildOrderClause: (conditions: SortCondition[]) => Order;
    buildNestedOrderClause: (sorts: Array<{
        model?: ModelStatic<any>;
        field: string;
        direction: "ASC" | "DESC";
    }>) => Order;
    executeSearch: <T extends Model>(model: ModelStatic<T>, searchOptions: SearchOptions, queryOptions?: FindOptions<T>) => Promise<T[]>;
    buildDynamicFilter: (queryParams: Record<string, any>, allowedFields: string[]) => WhereOptions<any>;
    executeAggregation: <T extends Model>(model: ModelStatic<T>, aggregations: AggregationOptions[], groupBy?: string[], where?: WhereOptions<T>) => Promise<any[]>;
    countByGroup: <T extends Model>(model: ModelStatic<T>, groupField: string, where?: WhereOptions<T>) => Promise<Array<{
        group: any;
        count: number;
    }>>;
    sumByGroup: <T extends Model>(model: ModelStatic<T>, sumField: string, groupField: string, where?: WhereOptions<T>) => Promise<Array<{
        group: any;
        sum: number;
    }>>;
    averageByGroup: <T extends Model>(model: ModelStatic<T>, avgField: string, groupField: string, where?: WhereOptions<T>) => Promise<Array<{
        group: any;
        average: number;
    }>>;
    buildJoinIncludes: (joins: JoinOptions[]) => Includeable[];
    executeLeftJoin: <T extends Model>(model: ModelStatic<T>, join: JoinOptions, where?: WhereOptions<T>) => Promise<T[]>;
    executeInnerJoin: <T extends Model>(model: ModelStatic<T>, join: JoinOptions, where?: WhereOptions<T>) => Promise<T[]>;
    buildSubquery: (sequelize: Sequelize, options: SubQueryOptions) => any;
    executeExistsSubquery: <T extends Model>(model: ModelStatic<T>, sequelize: Sequelize, existsQuery: string, where?: WhereOptions<T>) => Promise<T[]>;
    executeNotExistsSubquery: <T extends Model>(model: ModelStatic<T>, sequelize: Sequelize, notExistsQuery: string, where?: WhereOptions<T>) => Promise<T[]>;
    executeRawQuery: (sequelize: Sequelize, options: RawQueryOptions) => Promise<any[]>;
    executeStoredProcedure: (sequelize: Sequelize, procedureName: string, params?: Record<string, any>) => Promise<any>;
    executeWithCTE: (sequelize: Sequelize, cteName: string, cteQuery: string, mainQuery: string, replacements?: Record<string, any>) => Promise<any[]>;
    executeRecursiveCTE: (sequelize: Sequelize, cteName: string, anchorQuery: string, recursiveQuery: string, mainQuery: string, replacements?: Record<string, any>) => Promise<any[]>;
    explainQuery: (sequelize: Sequelize, query: string, replacements?: Record<string, any>) => Promise<any[]>;
    explainAnalyzeQuery: (sequelize: Sequelize, query: string, replacements?: Record<string, any>) => Promise<any[]>;
    disableSubquery: <T extends Model>(options: FindOptions<T>) => FindOptions<T>;
};
export default _default;
//# sourceMappingURL=sequelize-query-kit.d.ts.map
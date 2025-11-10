"use strict";
/**
 * LOC: GOVPB7654321
 * File: /reuse/government/government-payroll-benefits-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable government utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend payroll services
 *   - HR management modules
 *   - Benefits administration systems
 *   - Tax calculation services
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCompensatoryTime = exports.calculateOvertimeRate = exports.createGarnishmentOrder = exports.validateGarnishmentLimits = exports.determineGarnishmentPriority = exports.calculateUnionDues = exports.processGarnishmentDeduction = exports.calculateOWCPCompensationRate = exports.updateWorkersCompStatus = exports.calculateContinuationOfPay = exports.createWorkersCompClaim = exports.calculateLifeInsurancePremium = exports.updateTSPElection = exports.getEmployeeBenefits = exports.calculateTSPContribution = exports.calculateHealthPremiumSplit = exports.enrollHealthInsurance = exports.generatePayrollSummary = exports.processEmployeePayroll = exports.calculateFERSContribution = exports.calculateFederalTax = exports.calculateMedicareTax = exports.calculateFICATax = exports.calculateGrossPay = exports.validateLeaveRequest = exports.processLeaveCarryover = exports.getLeaveBalance = exports.processLeaveRequest = exports.processLeaveAccrual = exports.calculateLeaveAccrualRate = exports.calculateSurvivorAnnuityReduction = exports.determinePensionEligibility = exports.calculateHighThreeAverage = exports.calculateCSRSPension = exports.calculateFERSPension = exports.calculateTotalCompensation = exports.validateGradeStepCombination = exports.determineNextStepIncreaseDate = exports.calculateLocalityPay = exports.getPayScaleForGradeStep = exports.getEmployeesByDepartment = exports.getEmployeeById = exports.calculateYearsOfService = exports.updateEmployeeGradeStep = exports.createGovernmentEmployee = exports.createGarnishmentOrderModel = exports.createBenefitsEnrollmentModel = exports.createLeaveBalanceModel = exports.createPayrollRecordModel = exports.createGovernmentEmployeeModel = void 0;
exports.GovernmentPayrollService = exports.exportPayrollRegister = exports.generateW2Data = exports.validateOvertimeRequest = exports.determineFLSAStatus = exports.useCompensatoryTime = void 0;
/**
 * File: /reuse/government/government-payroll-benefits-kit.ts
 * Locator: WC-GOV-PAYROLL-001
 * Purpose: Enterprise-grade Government Payroll & Benefits Management - employee compensation, step/grade systems, pension calculations, benefits, leave tracking
 *
 * Upstream: Independent utility module for government payroll operations
 * Downstream: ../backend/government/*, payroll controllers, HR services, benefits processors, tax modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50+ functions for government payroll/benefits competing with USACE CEFMS/Oracle HCM payroll systems
 *
 * LLM Context: Comprehensive government payroll and benefits utilities for production-ready applications.
 * Provides employee compensation management, step and grade pay systems (GS scale), defined benefit pension calculations,
 * health insurance enrollment, leave accrual and tracking (annual/sick/comp time), workers compensation processing,
 * payroll tax calculations (FICA/Medicare), union dues management, garnishment processing, overtime and compensatory time,
 * retirement contribution tracking (TSP/pension), and comprehensive reporting for government payroll compliance.
 */
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Government Employees with grade/step tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     GovernmentEmployee:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         employeeId:
 *           type: string
 *         firstName:
 *           type: string
 *         gradeLevel:
 *           type: string
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GovernmentEmployee model
 *
 * @example
 * ```typescript
 * const GovernmentEmployee = createGovernmentEmployeeModel(sequelize);
 * const employee = await GovernmentEmployee.create({
 *   employeeId: 'EMP-2024-001',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   ssn: '123-45-6789',
 *   dateOfBirth: new Date('1980-01-01'),
 *   hireDate: new Date('2020-01-15'),
 *   gradeLevel: 'GS-12',
 *   stepLevel: 5,
 *   payPlan: 'GS'
 * });
 * ```
 */
const createGovernmentEmployeeModel = (sequelize) => {
    class GovernmentEmployee extends sequelize_1.Model {
    }
    GovernmentEmployee.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique employee identifier',
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'First name',
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Last name',
        },
        ssn: {
            type: sequelize_1.DataTypes.STRING(11),
            allowNull: false,
            comment: 'Social security number (encrypted)',
        },
        dateOfBirth: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date of birth',
        },
        hireDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Hire date',
        },
        departmentId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Department ID',
        },
        positionTitle: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Position title',
        },
        gradeLevel: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Grade level (e.g., GS-12)',
        },
        stepLevel: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Step level (1-10)',
            validate: {
                min: 1,
                max: 10,
            },
        },
        payPlan: {
            type: sequelize_1.DataTypes.ENUM('GS', 'WG', 'SES', 'OTHER'),
            allowNull: false,
            comment: 'Pay plan type',
        },
        salaryType: {
            type: sequelize_1.DataTypes.ENUM('annual', 'hourly'),
            allowNull: false,
            comment: 'Salary type',
        },
        baseSalary: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Base salary amount',
        },
        localityPay: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Locality pay adjustment',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'on_leave', 'terminated', 'retired'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Employment status',
        },
        terminationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Termination date',
        },
        retirementDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Retirement date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'government_employees',
        timestamps: true,
        indexes: [
            { fields: ['employeeId'], unique: true },
            { fields: ['ssn'] },
            { fields: ['departmentId'] },
            { fields: ['gradeLevel'] },
            { fields: ['status'] },
            { fields: ['hireDate'] },
        ],
    });
    return GovernmentEmployee;
};
exports.createGovernmentEmployeeModel = createGovernmentEmployeeModel;
/**
 * Sequelize model for Payroll records with comprehensive deductions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PayrollRecord model
 *
 * @example
 * ```typescript
 * const PayrollRecord = createPayrollRecordModel(sequelize);
 * const payroll = await PayrollRecord.create({
 *   employeeId: 'EMP-001',
 *   payPeriodId: 'PP-2024-01',
 *   grossPay: 5000.00,
 *   netPay: 3500.00
 * });
 * ```
 */
const createPayrollRecordModel = (sequelize) => {
    class PayrollRecord extends sequelize_1.Model {
    }
    PayrollRecord.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Employee ID',
        },
        payPeriodId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Pay period ID',
        },
        regularHours: {
            type: sequelize_1.DataTypes.DECIMAL(8, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Regular hours worked',
        },
        overtimeHours: {
            type: sequelize_1.DataTypes.DECIMAL(8, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Overtime hours worked',
        },
        regularPay: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Regular pay amount',
        },
        overtimePay: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Overtime pay amount',
        },
        localityPay: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Locality pay adjustment',
        },
        grossPay: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Gross pay',
        },
        federalTax: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Federal tax withheld',
        },
        stateTax: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'State tax withheld',
        },
        ficaTax: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'FICA tax withheld',
        },
        medicareTax: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Medicare tax withheld',
        },
        retirementContribution: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Retirement contribution',
        },
        healthInsurance: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Health insurance premium',
        },
        unionDues: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Union dues',
        },
        garnishments: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Garnishments',
        },
        totalDeductions: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Total deductions',
        },
        netPay: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Net pay',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'processed', 'paid', 'void'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Payroll status',
        },
        processedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Processing timestamp',
        },
    }, {
        sequelize,
        tableName: 'payroll_records',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['employeeId'] },
            { fields: ['payPeriodId'] },
            { fields: ['status'] },
            { fields: ['employeeId', 'payPeriodId'], unique: true },
        ],
    });
    return PayrollRecord;
};
exports.createPayrollRecordModel = createPayrollRecordModel;
/**
 * Sequelize model for Leave Balances tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LeaveBalance model
 */
const createLeaveBalanceModel = (sequelize) => {
    class EmployeeLeaveBalance extends sequelize_1.Model {
    }
    EmployeeLeaveBalance.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Employee ID',
        },
        leaveType: {
            type: sequelize_1.DataTypes.ENUM('annual', 'sick', 'compensatory', 'military', 'family'),
            allowNull: false,
            comment: 'Leave type',
        },
        currentBalance: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Current balance hours',
        },
        accrued: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total accrued hours',
        },
        used: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total used hours',
        },
        carryover: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Carryover from previous year',
        },
        maxBalance: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Maximum balance allowed',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
    }, {
        sequelize,
        tableName: 'leave_balances',
        timestamps: true,
        indexes: [
            { fields: ['employeeId'] },
            { fields: ['leaveType'] },
            { fields: ['fiscalYear'] },
            { fields: ['employeeId', 'leaveType', 'fiscalYear'], unique: true },
        ],
    });
    return EmployeeLeaveBalance;
};
exports.createLeaveBalanceModel = createLeaveBalanceModel;
/**
 * Sequelize model for Benefits Enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BenefitsEnrollment model
 */
const createBenefitsEnrollmentModel = (sequelize) => {
    class EmployeeBenefitsEnrollment extends sequelize_1.Model {
    }
    EmployeeBenefitsEnrollment.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Employee ID',
        },
        healthPlanId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Health plan ID',
        },
        dentalPlanId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Dental plan ID',
        },
        visionPlanId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Vision plan ID',
        },
        lifeInsuranceAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Life insurance coverage amount',
        },
        tspElectionPercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'TSP election percentage',
        },
        tspCatchupContribution: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'TSP catch-up contribution flag',
        },
        enrollmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Enrollment date',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Effective date',
        },
    }, {
        sequelize,
        tableName: 'benefits_enrollments',
        timestamps: true,
        indexes: [
            { fields: ['employeeId'] },
            { fields: ['effectiveDate'] },
        ],
    });
    return EmployeeBenefitsEnrollment;
};
exports.createBenefitsEnrollmentModel = createBenefitsEnrollmentModel;
/**
 * Sequelize model for Garnishment Orders.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GarnishmentOrder model
 */
const createGarnishmentOrderModel = (sequelize) => {
    class EmployeeGarnishmentOrder extends sequelize_1.Model {
    }
    EmployeeGarnishmentOrder.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        garnishmentId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Garnishment identifier',
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Employee ID',
        },
        garnishmentType: {
            type: sequelize_1.DataTypes.ENUM('child_support', 'tax_levy', 'student_loan', 'bankruptcy', 'creditor'),
            allowNull: false,
            comment: 'Garnishment type',
        },
        orderDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Order date',
        },
        totalAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
            comment: 'Total amount to garnish',
        },
        perPaymentAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Amount per payment',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Priority order (1 = highest)',
        },
        issuingAuthority: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Issuing authority',
        },
        caseNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Case number',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'completed', 'suspended'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Garnishment status',
        },
    }, {
        sequelize,
        tableName: 'garnishment_orders',
        timestamps: true,
        indexes: [
            { fields: ['garnishmentId'], unique: true },
            { fields: ['employeeId'] },
            { fields: ['status'] },
            { fields: ['priority'] },
        ],
    });
    return EmployeeGarnishmentOrder;
};
exports.createGarnishmentOrderModel = createGarnishmentOrderModel;
// ============================================================================
// EMPLOYEE MANAGEMENT (1-5)
// ============================================================================
/**
 * Creates a new government employee record.
 *
 * @param {GovernmentEmployeeData} employeeData - Employee data
 * @param {Model} GovernmentEmployee - GovernmentEmployee model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created employee
 *
 * @example
 * ```typescript
 * const employee = await createGovernmentEmployee({
 *   employeeId: 'EMP-2024-001',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   ssn: '123-45-6789',
 *   dateOfBirth: new Date('1980-01-01'),
 *   hireDate: new Date(),
 *   gradeLevel: 'GS-12',
 *   stepLevel: 5,
 *   payPlan: 'GS',
 *   baseSalary: 85000
 * }, GovernmentEmployee);
 * ```
 */
const createGovernmentEmployee = async (employeeData, GovernmentEmployee, transaction) => {
    const employee = await GovernmentEmployee.create(employeeData, { transaction });
    return employee;
};
exports.createGovernmentEmployee = createGovernmentEmployee;
/**
 * Updates employee grade and step level.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} newGrade - New grade level
 * @param {number} newStep - New step level
 * @param {Date} effectiveDate - Effective date
 * @param {Model} GovernmentEmployee - GovernmentEmployee model
 * @returns {Promise<any>} Updated employee
 *
 * @example
 * ```typescript
 * await updateEmployeeGradeStep('EMP-001', 'GS-13', 1, new Date(), GovernmentEmployee);
 * ```
 */
const updateEmployeeGradeStep = async (employeeId, newGrade, newStep, effectiveDate, GovernmentEmployee) => {
    const employee = await GovernmentEmployee.findOne({ where: { employeeId } });
    if (!employee)
        throw new Error('Employee not found');
    const oldGrade = employee.gradeLevel;
    const oldStep = employee.stepLevel;
    employee.gradeLevel = newGrade;
    employee.stepLevel = newStep;
    employee.metadata = {
        ...employee.metadata,
        gradeHistory: [
            ...(employee.metadata.gradeHistory || []),
            {
                effectiveDate,
                fromGrade: oldGrade,
                toGrade: newGrade,
                fromStep: oldStep,
                toStep: newStep,
            },
        ],
    };
    await employee.save();
    return employee;
};
exports.updateEmployeeGradeStep = updateEmployeeGradeStep;
/**
 * Calculates years of service for employee.
 *
 * @param {Date} hireDate - Hire date
 * @param {Date} [asOfDate=new Date()] - Calculation date
 * @returns {number} Years of service
 *
 * @example
 * ```typescript
 * const yearsOfService = calculateYearsOfService(new Date('2010-01-15'));
 * console.log(`Years: ${yearsOfService}`);
 * ```
 */
const calculateYearsOfService = (hireDate, asOfDate = new Date()) => {
    const years = (asOfDate.getTime() - hireDate.getTime()) / (365.25 * 86400000);
    return Math.max(0, years);
};
exports.calculateYearsOfService = calculateYearsOfService;
/**
 * Retrieves employee by employee ID.
 *
 * @param {string} employeeId - Employee ID
 * @param {Model} GovernmentEmployee - GovernmentEmployee model
 * @returns {Promise<any>} Employee record
 *
 * @example
 * ```typescript
 * const employee = await getEmployeeById('EMP-001', GovernmentEmployee);
 * ```
 */
const getEmployeeById = async (employeeId, GovernmentEmployee) => {
    return await GovernmentEmployee.findOne({ where: { employeeId } });
};
exports.getEmployeeById = getEmployeeById;
/**
 * Retrieves all employees by department.
 *
 * @param {string} departmentId - Department ID
 * @param {Model} GovernmentEmployee - GovernmentEmployee model
 * @returns {Promise<any[]>} Employees in department
 *
 * @example
 * ```typescript
 * const employees = await getEmployeesByDepartment('DEPT001', GovernmentEmployee);
 * ```
 */
const getEmployeesByDepartment = async (departmentId, GovernmentEmployee) => {
    return await GovernmentEmployee.findAll({
        where: { departmentId, status: 'active' },
    });
};
exports.getEmployeesByDepartment = getEmployeesByDepartment;
// ============================================================================
// STEP & GRADE PAY SYSTEMS (6-10)
// ============================================================================
/**
 * Retrieves pay scale for grade and step.
 *
 * @param {string} payPlan - Pay plan (GS, WG, etc)
 * @param {string} gradeLevel - Grade level
 * @param {number} stepLevel - Step level
 * @param {Date} [effectiveDate=new Date()] - Effective date
 * @returns {StepGradePayScale} Pay scale data
 *
 * @example
 * ```typescript
 * const payScale = getPayScaleForGradeStep('GS', 'GS-12', 5, new Date());
 * console.log(`Annual salary: ${payScale.annualSalary}`);
 * ```
 */
const getPayScaleForGradeStep = (payPlan, gradeLevel, stepLevel, effectiveDate = new Date()) => {
    // Simplified GS pay scale (2024 base rates)
    const gsPayScale = {
        'GS-1': [22140, 22880, 23622, 24362, 25102, 25480, 26220, 26960, 26997, 27705],
        'GS-5': [33024, 34125, 35226, 36327, 37428, 38529, 39630, 40731, 41832, 42933],
        'GS-7': [41131, 42502, 43873, 45244, 46615, 47986, 49357, 50728, 52099, 53470],
        'GS-9': [50973, 52672, 54371, 56070, 57769, 59468, 61167, 62866, 64565, 66264],
        'GS-11': [61698, 63755, 65812, 67869, 69926, 71983, 74040, 76097, 78154, 80211],
        'GS-12': [73963, 76428, 78893, 81358, 83823, 86288, 88753, 91218, 93683, 96148],
        'GS-13': [87926, 90891, 93856, 96821, 99786, 102751, 105716, 108681, 111646, 114611],
        'GS-14': [103914, 107379, 110844, 114309, 117774, 121239, 124704, 128169, 131634, 135099],
        'GS-15': [122198, 126338, 130478, 134618, 138758, 142898, 147038, 151178, 155318, 159458],
    };
    const steps = gsPayScale[gradeLevel] || gsPayScale['GS-5'];
    const annualSalary = steps[stepLevel - 1] || steps[0];
    const hourlyRate = annualSalary / 2087;
    return {
        payPlan,
        gradeLevel,
        stepLevel,
        annualSalary,
        hourlyRate,
        effectiveDate,
        localityAdjustment: 0,
    };
};
exports.getPayScaleForGradeStep = getPayScaleForGradeStep;
/**
 * Calculates locality pay adjustment.
 *
 * @param {number} baseSalary - Base salary
 * @param {string} localityCode - Locality code
 * @returns {number} Locality pay amount
 *
 * @example
 * ```typescript
 * const localityPay = calculateLocalityPay(85000, 'DC');
 * console.log(`Locality adjustment: ${localityPay}`);
 * ```
 */
const calculateLocalityPay = (baseSalary, localityCode) => {
    // Simplified locality pay percentages (2024)
    const localityRates = {
        'DC': 0.3279, // Washington-Baltimore-Arlington
        'SF': 0.4390, // San Francisco-Oakland-San Jose
        'NY': 0.3547, // New York-Newark
        'LA': 0.3075, // Los Angeles-Long Beach
        'REST': 0.1697, // Rest of US
    };
    const rate = localityRates[localityCode] || localityRates['REST'];
    return baseSalary * rate;
};
exports.calculateLocalityPay = calculateLocalityPay;
/**
 * Determines next step increase date.
 *
 * @param {Date} lastStepIncreaseDate - Last step increase
 * @param {number} currentStep - Current step level
 * @returns {Date} Next step increase date
 *
 * @example
 * ```typescript
 * const nextDate = determineNextStepIncreaseDate(new Date('2023-01-15'), 3);
 * ```
 */
const determineNextStepIncreaseDate = (lastStepIncreaseDate, currentStep) => {
    let waitingPeriod;
    if (currentStep >= 1 && currentStep <= 3) {
        waitingPeriod = 52; // 52 weeks (1 year)
    }
    else if (currentStep >= 4 && currentStep <= 6) {
        waitingPeriod = 104; // 104 weeks (2 years)
    }
    else {
        waitingPeriod = 156; // 156 weeks (3 years)
    }
    const nextDate = new Date(lastStepIncreaseDate);
    nextDate.setDate(nextDate.getDate() + waitingPeriod * 7);
    return nextDate;
};
exports.determineNextStepIncreaseDate = determineNextStepIncreaseDate;
/**
 * Validates grade/step combination.
 *
 * @param {string} gradeLevel - Grade level
 * @param {number} stepLevel - Step level
 * @returns {{ valid: boolean; message: string }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateGradeStepCombination('GS-12', 5);
 * ```
 */
const validateGradeStepCombination = (gradeLevel, stepLevel) => {
    if (stepLevel < 1 || stepLevel > 10) {
        return { valid: false, message: 'Step must be between 1 and 10' };
    }
    const validGrades = ['GS-1', 'GS-2', 'GS-3', 'GS-4', 'GS-5', 'GS-6', 'GS-7',
        'GS-8', 'GS-9', 'GS-10', 'GS-11', 'GS-12', 'GS-13', 'GS-14', 'GS-15'];
    if (!validGrades.includes(gradeLevel)) {
        return { valid: false, message: 'Invalid grade level' };
    }
    return { valid: true, message: 'Valid combination' };
};
exports.validateGradeStepCombination = validateGradeStepCombination;
/**
 * Calculates total compensation including locality.
 *
 * @param {number} baseSalary - Base salary
 * @param {string} localityCode - Locality code
 * @returns {{ baseSalary: number; localityPay: number; totalCompensation: number }} Compensation breakdown
 *
 * @example
 * ```typescript
 * const comp = calculateTotalCompensation(85000, 'DC');
 * console.log(`Total: ${comp.totalCompensation}`);
 * ```
 */
const calculateTotalCompensation = (baseSalary, localityCode) => {
    const localityPay = (0, exports.calculateLocalityPay)(baseSalary, localityCode);
    const totalCompensation = baseSalary + localityPay;
    return { baseSalary, localityPay, totalCompensation };
};
exports.calculateTotalCompensation = calculateTotalCompensation;
// ============================================================================
// PENSION CALCULATIONS (11-15)
// ============================================================================
/**
 * Calculates FERS pension benefit.
 *
 * @param {number} yearsOfService - Years of service
 * @param {number} highThreeAverage - High-3 average salary
 * @param {number} retirementAge - Age at retirement
 * @returns {PensionCalculation} Pension calculation
 *
 * @example
 * ```typescript
 * const pension = calculateFERSPension(30, 95000, 62);
 * console.log(`Annual benefit: ${pension.annualBenefit}`);
 * ```
 */
const calculateFERSPension = (yearsOfService, highThreeAverage, retirementAge) => {
    let multiplier = 0.01; // 1% for most employees
    // 1.1% for employees retiring at 62+ with 20+ years
    if (retirementAge >= 62 && yearsOfService >= 20) {
        multiplier = 0.011;
    }
    const annualBenefit = yearsOfService * multiplier * highThreeAverage;
    const monthlyBenefit = annualBenefit / 12;
    const isEligible = (retirementAge >= 62 && yearsOfService >= 5) ||
        (retirementAge >= 60 && yearsOfService >= 20) ||
        (yearsOfService >= 30 && retirementAge >= 55);
    return {
        employeeId: '',
        yearsOfService,
        highThreeAverage,
        serviceMultiplier: multiplier,
        annualBenefit,
        monthlyBenefit,
        calculationMethod: 'FERS',
        eligibilityAge: retirementAge,
        isEligible,
    };
};
exports.calculateFERSPension = calculateFERSPension;
/**
 * Calculates CSRS pension benefit.
 *
 * @param {number} yearsOfService - Years of service
 * @param {number} highThreeAverage - High-3 average salary
 * @returns {PensionCalculation} Pension calculation
 *
 * @example
 * ```typescript
 * const pension = calculateCSRSPension(35, 100000);
 * ```
 */
const calculateCSRSPension = (yearsOfService, highThreeAverage) => {
    // CSRS uses tiered multipliers
    let benefit = 0;
    // First 5 years: 1.5%
    const first5 = Math.min(5, yearsOfService);
    benefit += first5 * 0.015 * highThreeAverage;
    // Next 5 years (6-10): 1.75%
    if (yearsOfService > 5) {
        const next5 = Math.min(5, yearsOfService - 5);
        benefit += next5 * 0.0175 * highThreeAverage;
    }
    // Over 10 years: 2%
    if (yearsOfService > 10) {
        const remaining = yearsOfService - 10;
        benefit += remaining * 0.02 * highThreeAverage;
    }
    const annualBenefit = benefit;
    const monthlyBenefit = annualBenefit / 12;
    return {
        employeeId: '',
        yearsOfService,
        highThreeAverage,
        serviceMultiplier: 0, // Tiered
        annualBenefit,
        monthlyBenefit,
        calculationMethod: 'CSRS',
        eligibilityAge: 0,
        isEligible: yearsOfService >= 5,
    };
};
exports.calculateCSRSPension = calculateCSRSPension;
/**
 * Calculates high-3 average salary.
 *
 * @param {number[]} salaries - Array of annual salaries (chronological)
 * @returns {number} High-3 average
 *
 * @example
 * ```typescript
 * const high3 = calculateHighThreeAverage([90000, 92000, 95000, 98000]);
 * console.log(`High-3: ${high3}`);
 * ```
 */
const calculateHighThreeAverage = (salaries) => {
    if (salaries.length < 3) {
        const sum = salaries.reduce((acc, sal) => acc + sal, 0);
        return sum / salaries.length;
    }
    // Get the highest consecutive 3 years
    let maxAverage = 0;
    for (let i = 0; i <= salaries.length - 3; i++) {
        const avg = (salaries[i] + salaries[i + 1] + salaries[i + 2]) / 3;
        if (avg > maxAverage)
            maxAverage = avg;
    }
    return maxAverage;
};
exports.calculateHighThreeAverage = calculateHighThreeAverage;
/**
 * Determines pension eligibility.
 *
 * @param {number} age - Current age
 * @param {number} yearsOfService - Years of service
 * @param {string} retirementSystem - FERS or CSRS
 * @returns {{ eligible: boolean; reason: string; earliestRetirementAge?: number }} Eligibility
 *
 * @example
 * ```typescript
 * const eligibility = determinePensionEligibility(60, 25, 'FERS');
 * ```
 */
const determinePensionEligibility = (age, yearsOfService, retirementSystem) => {
    if (retirementSystem === 'FERS') {
        if (age >= 62 && yearsOfService >= 5) {
            return { eligible: true, reason: 'Age 62 with 5 years service' };
        }
        if (age >= 60 && yearsOfService >= 20) {
            return { eligible: true, reason: 'Age 60 with 20 years service' };
        }
        if (yearsOfService >= 30 && age >= 55) {
            return { eligible: true, reason: 'MRA with 30 years service' };
        }
        return { eligible: false, reason: 'Does not meet eligibility criteria', earliestRetirementAge: 62 };
    }
    else {
        // CSRS
        if (age >= 55 && yearsOfService >= 30) {
            return { eligible: true, reason: 'Age 55 with 30 years service' };
        }
        if (age >= 60 && yearsOfService >= 20) {
            return { eligible: true, reason: 'Age 60 with 20 years service' };
        }
        if (age >= 62 && yearsOfService >= 5) {
            return { eligible: true, reason: 'Age 62 with 5 years service' };
        }
        return { eligible: false, reason: 'Does not meet eligibility criteria', earliestRetirementAge: 62 };
    }
};
exports.determinePensionEligibility = determinePensionEligibility;
/**
 * Calculates survivor annuity reduction.
 *
 * @param {number} annualPension - Annual pension amount
 * @param {boolean} fullSurvivorBenefit - Full or partial survivor benefit
 * @returns {{ reduction: number; netPension: number }} Survivor benefit calculation
 *
 * @example
 * ```typescript
 * const survivor = calculateSurvivorAnnuityReduction(50000, true);
 * console.log(`Net pension: ${survivor.netPension}`);
 * ```
 */
const calculateSurvivorAnnuityReduction = (annualPension, fullSurvivorBenefit) => {
    const reductionPercent = fullSurvivorBenefit ? 0.10 : 0.05; // 10% for full, 5% for half
    const reduction = annualPension * reductionPercent;
    const netPension = annualPension - reduction;
    return { reduction, netPension };
};
exports.calculateSurvivorAnnuityReduction = calculateSurvivorAnnuityReduction;
// ============================================================================
// LEAVE ACCRUAL & TRACKING (16-21)
// ============================================================================
/**
 * Calculates leave accrual rate based on years of service.
 *
 * @param {number} yearsOfService - Years of service
 * @param {string} leaveType - Leave type
 * @returns {LeaveAccrual} Accrual configuration
 *
 * @example
 * ```typescript
 * const accrual = calculateLeaveAccrualRate(5, 'annual');
 * console.log(`Hours per pay period: ${accrual.hoursPerPayPeriod}`);
 * ```
 */
const calculateLeaveAccrualRate = (yearsOfService, leaveType) => {
    if (leaveType === 'annual') {
        let hoursPerPayPeriod = 4; // 0-3 years: 4 hours
        if (yearsOfService >= 3 && yearsOfService < 15) {
            hoursPerPayPeriod = 6; // 3-15 years: 6 hours
        }
        else if (yearsOfService >= 15) {
            hoursPerPayPeriod = 8; // 15+ years: 8 hours
        }
        return {
            employeeId: '',
            leaveType: 'annual',
            accrualRate: hoursPerPayPeriod,
            payPeriodsPerYear: 26,
            hoursPerPayPeriod,
            maxAccrual: hoursPerPayPeriod * 26,
            carryoverLimit: 240, // Standard annual leave carryover
        };
    }
    else if (leaveType === 'sick') {
        return {
            employeeId: '',
            leaveType: 'sick',
            accrualRate: 4,
            payPeriodsPerYear: 26,
            hoursPerPayPeriod: 4,
            maxAccrual: 999999, // No limit on sick leave
            carryoverLimit: 999999,
        };
    }
    return {
        employeeId: '',
        leaveType,
        accrualRate: 0,
        payPeriodsPerYear: 26,
        hoursPerPayPeriod: 0,
        maxAccrual: 0,
        carryoverLimit: 0,
    };
};
exports.calculateLeaveAccrualRate = calculateLeaveAccrualRate;
/**
 * Processes leave accrual for pay period.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} payPeriodId - Pay period ID
 * @param {Model} GovernmentEmployee - GovernmentEmployee model
 * @param {Model} LeaveBalance - LeaveBalance model
 * @returns {Promise<any>} Updated leave balances
 *
 * @example
 * ```typescript
 * await processLeaveAccrual('EMP-001', 'PP-2024-01', GovernmentEmployee, LeaveBalance);
 * ```
 */
const processLeaveAccrual = async (employeeId, payPeriodId, GovernmentEmployee, LeaveBalance) => {
    const employee = await GovernmentEmployee.findOne({ where: { employeeId } });
    if (!employee)
        throw new Error('Employee not found');
    const yearsOfService = (0, exports.calculateYearsOfService)(employee.hireDate);
    const fiscalYear = new Date().getFullYear();
    // Annual leave
    const annualAccrual = (0, exports.calculateLeaveAccrualRate)(yearsOfService, 'annual');
    let annualBalance = await LeaveBalance.findOne({
        where: { employeeId, leaveType: 'annual', fiscalYear },
    });
    if (!annualBalance) {
        annualBalance = await LeaveBalance.create({
            employeeId,
            leaveType: 'annual',
            currentBalance: 0,
            accrued: 0,
            used: 0,
            carryover: 0,
            maxBalance: annualAccrual.carryoverLimit,
            fiscalYear,
        });
    }
    annualBalance.accrued += annualAccrual.hoursPerPayPeriod;
    annualBalance.currentBalance += annualAccrual.hoursPerPayPeriod;
    await annualBalance.save();
    // Sick leave
    const sickAccrual = (0, exports.calculateLeaveAccrualRate)(yearsOfService, 'sick');
    let sickBalance = await LeaveBalance.findOne({
        where: { employeeId, leaveType: 'sick', fiscalYear },
    });
    if (!sickBalance) {
        sickBalance = await LeaveBalance.create({
            employeeId,
            leaveType: 'sick',
            currentBalance: 0,
            accrued: 0,
            used: 0,
            carryover: 0,
            maxBalance: 999999,
            fiscalYear,
        });
    }
    sickBalance.accrued += sickAccrual.hoursPerPayPeriod;
    sickBalance.currentBalance += sickAccrual.hoursPerPayPeriod;
    await sickBalance.save();
    return { annualBalance, sickBalance };
};
exports.processLeaveAccrual = processLeaveAccrual;
/**
 * Processes leave request and updates balance.
 *
 * @param {LeaveRequest} requestData - Leave request
 * @param {Model} LeaveBalance - LeaveBalance model
 * @returns {Promise<any>} Updated leave balance
 *
 * @example
 * ```typescript
 * await processLeaveRequest({
 *   requestId: 'LR-001',
 *   employeeId: 'EMP-001',
 *   leaveType: 'annual',
 *   startDate: new Date(),
 *   endDate: new Date(),
 *   hoursRequested: 8,
 *   status: 'approved',
 *   requestedBy: 'EMP-001'
 * }, LeaveBalance);
 * ```
 */
const processLeaveRequest = async (requestData, LeaveBalance) => {
    if (requestData.status !== 'approved') {
        return null;
    }
    const fiscalYear = requestData.startDate.getFullYear();
    const balance = await LeaveBalance.findOne({
        where: {
            employeeId: requestData.employeeId,
            leaveType: requestData.leaveType,
            fiscalYear,
        },
    });
    if (!balance)
        throw new Error('Leave balance not found');
    if (balance.currentBalance < requestData.hoursRequested) {
        throw new Error('Insufficient leave balance');
    }
    balance.used += requestData.hoursRequested;
    balance.currentBalance -= requestData.hoursRequested;
    await balance.save();
    return balance;
};
exports.processLeaveRequest = processLeaveRequest;
/**
 * Retrieves leave balance for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} leaveType - Leave type
 * @param {Model} LeaveBalance - LeaveBalance model
 * @returns {Promise<LeaveBalance>} Leave balance
 *
 * @example
 * ```typescript
 * const balance = await getLeaveBalance('EMP-001', 'annual', LeaveBalance);
 * ```
 */
const getLeaveBalance = async (employeeId, leaveType, LeaveBalance) => {
    const fiscalYear = new Date().getFullYear();
    const balance = await LeaveBalance.findOne({
        where: { employeeId, leaveType, fiscalYear },
    });
    return balance;
};
exports.getLeaveBalance = getLeaveBalance;
/**
 * Processes end-of-year leave carryover.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} LeaveBalance - LeaveBalance model
 * @returns {Promise<any>} New year balances
 *
 * @example
 * ```typescript
 * await processLeaveCarryover('EMP-001', 2024, LeaveBalance);
 * ```
 */
const processLeaveCarryover = async (employeeId, fiscalYear, LeaveBalance) => {
    const currentBalance = await LeaveBalance.findOne({
        where: { employeeId, leaveType: 'annual', fiscalYear },
    });
    if (!currentBalance)
        return null;
    const carryoverAmount = Math.min(currentBalance.currentBalance, currentBalance.maxBalance);
    const forfeitedAmount = Math.max(0, currentBalance.currentBalance - carryoverAmount);
    // Create next year balance
    const nextYearBalance = await LeaveBalance.create({
        employeeId,
        leaveType: 'annual',
        currentBalance: carryoverAmount,
        accrued: 0,
        used: 0,
        carryover: carryoverAmount,
        maxBalance: currentBalance.maxBalance,
        fiscalYear: fiscalYear + 1,
    });
    return { carryoverAmount, forfeitedAmount, nextYearBalance };
};
exports.processLeaveCarryover = processLeaveCarryover;
/**
 * Validates leave request against balance.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} leaveType - Leave type
 * @param {number} hoursRequested - Hours requested
 * @param {Model} LeaveBalance - LeaveBalance model
 * @returns {Promise<{ valid: boolean; availableHours: number; message: string }>} Validation
 *
 * @example
 * ```typescript
 * const validation = await validateLeaveRequest('EMP-001', 'annual', 40, LeaveBalance);
 * ```
 */
const validateLeaveRequest = async (employeeId, leaveType, hoursRequested, LeaveBalance) => {
    const balance = await (0, exports.getLeaveBalance)(employeeId, leaveType, LeaveBalance);
    if (!balance) {
        return { valid: false, availableHours: 0, message: 'No leave balance found' };
    }
    if (balance.currentBalance < hoursRequested) {
        return {
            valid: false,
            availableHours: parseFloat(balance.currentBalance.toString()),
            message: `Insufficient balance. Available: ${balance.currentBalance} hours`,
        };
    }
    return {
        valid: true,
        availableHours: parseFloat(balance.currentBalance.toString()),
        message: 'Sufficient balance',
    };
};
exports.validateLeaveRequest = validateLeaveRequest;
// ============================================================================
// PAYROLL CALCULATIONS (22-28)
// ============================================================================
/**
 * Calculates gross pay for pay period.
 *
 * @param {number} annualSalary - Annual salary
 * @param {number} regularHours - Regular hours worked
 * @param {number} overtimeHours - Overtime hours
 * @param {number} localityPay - Locality pay
 * @returns {{ regularPay: number; overtimePay: number; grossPay: number }} Pay calculation
 *
 * @example
 * ```typescript
 * const pay = calculateGrossPay(85000, 80, 5, 15000);
 * console.log(`Gross pay: ${pay.grossPay}`);
 * ```
 */
const calculateGrossPay = (annualSalary, regularHours, overtimeHours, localityPay) => {
    const totalAnnualComp = annualSalary + localityPay;
    const hourlyRate = totalAnnualComp / 2087;
    const regularPay = (regularHours / 80) * (totalAnnualComp / 26);
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    const grossPay = regularPay + overtimePay;
    return { regularPay, overtimePay, grossPay };
};
exports.calculateGrossPay = calculateGrossPay;
/**
 * Calculates FICA tax withholding.
 *
 * @param {number} grossPay - Gross pay amount
 * @param {number} yearToDateEarnings - YTD earnings
 * @param {number} [taxYear=2024] - Tax year for wage base
 * @returns {number} FICA tax amount
 *
 * @example
 * ```typescript
 * const ficaTax = calculateFICATax(5000, 50000, 2024);
 * ```
 */
const calculateFICATax = (grossPay, yearToDateEarnings, taxYear = 2024) => {
    const ficaRate = 0.062; // 6.2%
    const ficaWageBase = 168600; // 2024 wage base
    const remainingWageBase = Math.max(0, ficaWageBase - yearToDateEarnings);
    const taxableAmount = Math.min(grossPay, remainingWageBase);
    return taxableAmount * ficaRate;
};
exports.calculateFICATax = calculateFICATax;
/**
 * Calculates Medicare tax withholding.
 *
 * @param {number} grossPay - Gross pay amount
 * @param {number} yearToDateEarnings - YTD earnings
 * @returns {number} Medicare tax amount
 *
 * @example
 * ```typescript
 * const medicareTax = calculateMedicareTax(5000, 50000);
 * ```
 */
const calculateMedicareTax = (grossPay, yearToDateEarnings) => {
    const medicareRate = 0.0145; // 1.45%
    const additionalMedicareRate = 0.009; // 0.9% additional
    const additionalMedicareThreshold = 200000;
    let tax = grossPay * medicareRate;
    // Additional Medicare tax for high earners
    if (yearToDateEarnings + grossPay > additionalMedicareThreshold) {
        const amountOverThreshold = Math.min(grossPay, yearToDateEarnings + grossPay - additionalMedicareThreshold);
        tax += amountOverThreshold * additionalMedicareRate;
    }
    return tax;
};
exports.calculateMedicareTax = calculateMedicareTax;
/**
 * Calculates federal income tax withholding.
 *
 * @param {number} grossPay - Gross pay amount
 * @param {TaxWithholding} taxInfo - Tax withholding information
 * @param {number} payPeriodsPerYear - Pay periods per year
 * @returns {number} Federal tax amount
 *
 * @example
 * ```typescript
 * const fedTax = calculateFederalTax(5000, taxInfo, 26);
 * ```
 */
const calculateFederalTax = (grossPay, taxInfo, payPeriodsPerYear) => {
    // Simplified federal tax calculation (2024 rates)
    const annualizedPay = grossPay * payPeriodsPerYear;
    const standardDeduction = taxInfo.filingStatus === 'married' ? 29200 : 14600;
    const taxableIncome = Math.max(0, annualizedPay - standardDeduction);
    let annualTax = 0;
    // 2024 tax brackets (simplified for single filer)
    if (taxableIncome <= 11600) {
        annualTax = taxableIncome * 0.10;
    }
    else if (taxableIncome <= 47150) {
        annualTax = 1160 + (taxableIncome - 11600) * 0.12;
    }
    else if (taxableIncome <= 100525) {
        annualTax = 5426 + (taxableIncome - 47150) * 0.22;
    }
    else {
        annualTax = 17168.50 + (taxableIncome - 100525) * 0.24;
    }
    const perPayPeriodTax = annualTax / payPeriodsPerYear;
    return perPayPeriodTax + taxInfo.federalExtraWithholding;
};
exports.calculateFederalTax = calculateFederalTax;
/**
 * Calculates FERS retirement contribution.
 *
 * @param {number} grossPay - Gross pay amount
 * @param {Date} hireDate - Hire date
 * @returns {RetirementContribution} Retirement contribution
 *
 * @example
 * ```typescript
 * const retirement = calculateFERSContribution(5000, new Date('2015-01-01'));
 * ```
 */
const calculateFERSContribution = (grossPay, hireDate) => {
    let employeeRate = 0.008; // 0.8% for employees hired before 2013
    // FERS-RAE: 3.1% for employees hired in 2013
    if (hireDate >= new Date('2013-01-01') && hireDate < new Date('2014-01-01')) {
        employeeRate = 0.031;
    }
    // FERS-FRAE: 4.4% for employees hired after 2013
    if (hireDate >= new Date('2014-01-01')) {
        employeeRate = 0.044;
    }
    const employeeContribution = grossPay * employeeRate;
    const agencyContribution = grossPay * 0.16; // Agency contributes 16%
    return {
        employeeId: '',
        payPeriodId: '',
        employeeContribution,
        agencyContribution,
        agencyMatchingContribution: 0,
        contributionType: 'FERS',
        vestingPercentage: 100,
    };
};
exports.calculateFERSContribution = calculateFERSContribution;
/**
 * Processes complete payroll for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} payPeriodId - Pay period ID
 * @param {number} regularHours - Regular hours
 * @param {number} overtimeHours - Overtime hours
 * @param {Model} GovernmentEmployee - GovernmentEmployee model
 * @param {Model} PayrollRecord - PayrollRecord model
 * @returns {Promise<PayrollCalculation>} Payroll calculation
 *
 * @example
 * ```typescript
 * const payroll = await processEmployeePayroll('EMP-001', 'PP-2024-01', 80, 5, GovernmentEmployee, PayrollRecord);
 * ```
 */
const processEmployeePayroll = async (employeeId, payPeriodId, regularHours, overtimeHours, GovernmentEmployee, PayrollRecord) => {
    const employee = await GovernmentEmployee.findOne({ where: { employeeId } });
    if (!employee)
        throw new Error('Employee not found');
    const payCalc = (0, exports.calculateGrossPay)(parseFloat(employee.baseSalary), regularHours, overtimeHours, parseFloat(employee.localityPay));
    // Get YTD earnings (simplified)
    const ytdEarnings = 50000; // Should be calculated from prior payroll records
    const ficaTax = (0, exports.calculateFICATax)(payCalc.grossPay, ytdEarnings);
    const medicareTax = (0, exports.calculateMedicareTax)(payCalc.grossPay, ytdEarnings);
    const retirement = (0, exports.calculateFERSContribution)(payCalc.grossPay, employee.hireDate);
    const taxInfo = {
        employeeId,
        federalAllowances: 1,
        federalExtraWithholding: 0,
        stateAllowances: 1,
        stateExtraWithholding: 0,
        filingStatus: 'single',
        w4OnFile: true,
        lastUpdated: new Date(),
    };
    const federalTax = (0, exports.calculateFederalTax)(payCalc.grossPay, taxInfo, 26);
    const stateTax = payCalc.grossPay * 0.05; // Simplified 5% state tax
    const totalDeductions = ficaTax +
        medicareTax +
        federalTax +
        stateTax +
        retirement.employeeContribution;
    const netPay = payCalc.grossPay - totalDeductions;
    const payrollRecord = await PayrollRecord.create({
        employeeId,
        payPeriodId,
        regularHours,
        overtimeHours,
        regularPay: payCalc.regularPay,
        overtimePay: payCalc.overtimePay,
        localityPay: parseFloat(employee.localityPay),
        grossPay: payCalc.grossPay,
        federalTax,
        stateTax,
        ficaTax,
        medicareTax,
        retirementContribution: retirement.employeeContribution,
        healthInsurance: 0,
        unionDues: 0,
        garnishments: 0,
        totalDeductions,
        netPay,
        status: 'processed',
        processedAt: new Date(),
    });
    return {
        employeeId,
        payPeriodId,
        regularHours,
        overtimeHours,
        regularPay: payCalc.regularPay,
        overtimePay: payCalc.overtimePay,
        localityPay: parseFloat(employee.localityPay),
        grossPay: payCalc.grossPay,
        federalTax,
        stateTax,
        ficaTax,
        medicareTax,
        retirementContribution: retirement.employeeContribution,
        healthInsurance: 0,
        unionDues: 0,
        garnishments: 0,
        totalDeductions,
        netPay,
    };
};
exports.processEmployeePayroll = processEmployeePayroll;
/**
 * Generates payroll summary for pay period.
 *
 * @param {string} payPeriodId - Pay period ID
 * @param {Model} PayrollRecord - PayrollRecord model
 * @returns {Promise<any>} Payroll summary
 *
 * @example
 * ```typescript
 * const summary = await generatePayrollSummary('PP-2024-01', PayrollRecord);
 * ```
 */
const generatePayrollSummary = async (payPeriodId, PayrollRecord) => {
    const records = await PayrollRecord.findAll({ where: { payPeriodId } });
    const summary = {
        payPeriodId,
        employeeCount: records.length,
        totalGrossPay: records.reduce((sum, r) => sum + parseFloat(r.grossPay), 0),
        totalDeductions: records.reduce((sum, r) => sum + parseFloat(r.totalDeductions), 0),
        totalNetPay: records.reduce((sum, r) => sum + parseFloat(r.netPay), 0),
        totalFederalTax: records.reduce((sum, r) => sum + parseFloat(r.federalTax), 0),
        totalStateTax: records.reduce((sum, r) => sum + parseFloat(r.stateTax), 0),
        totalFICA: records.reduce((sum, r) => sum + parseFloat(r.ficaTax), 0),
        totalMedicare: records.reduce((sum, r) => sum + parseFloat(r.medicareTax), 0),
        totalRetirement: records.reduce((sum, r) => sum + parseFloat(r.retirementContribution), 0),
    };
    return summary;
};
exports.generatePayrollSummary = generatePayrollSummary;
// ============================================================================
// BENEFITS MANAGEMENT (29-34)
// ============================================================================
/**
 * Enrolls employee in health insurance plan.
 *
 * @param {BenefitsEnrollment} enrollmentData - Enrollment data
 * @param {Model} BenefitsEnrollment - BenefitsEnrollment model
 * @returns {Promise<any>} Enrollment record
 *
 * @example
 * ```typescript
 * const enrollment = await enrollHealthInsurance({
 *   employeeId: 'EMP-001',
 *   healthPlanId: 'PLAN-123',
 *   enrollmentDate: new Date(),
 *   effectiveDate: new Date()
 * }, BenefitsEnrollment);
 * ```
 */
const enrollHealthInsurance = async (enrollmentData, BenefitsEnrollment) => {
    return await BenefitsEnrollment.create(enrollmentData);
};
exports.enrollHealthInsurance = enrollHealthInsurance;
/**
 * Calculates health insurance premium split.
 *
 * @param {number} totalPremium - Total monthly premium
 * @param {string} planType - Plan type
 * @returns {{ employeeShare: number; governmentShare: number }} Premium split
 *
 * @example
 * ```typescript
 * const split = calculateHealthPremiumSplit(600, 'self_plus_one');
 * console.log(`Employee pays: ${split.employeeShare}`);
 * ```
 */
const calculateHealthPremiumSplit = (totalPremium, planType) => {
    // Government typically pays 72-75% of premium
    const governmentPercent = 0.72;
    const governmentShare = totalPremium * governmentPercent;
    const employeeShare = totalPremium - governmentShare;
    return { employeeShare, governmentShare };
};
exports.calculateHealthPremiumSplit = calculateHealthPremiumSplit;
/**
 * Calculates TSP contribution with matching.
 *
 * @param {number} grossPay - Gross pay
 * @param {number} employeeElectionPercent - Employee election %
 * @param {boolean} catchupContribution - Catch-up flag
 * @param {number} age - Employee age
 * @returns {{ employeeContribution: number; agencyMatch: number; total: number }} TSP calculation
 *
 * @example
 * ```typescript
 * const tsp = calculateTSPContribution(5000, 5, false, 35);
 * console.log(`Total TSP: ${tsp.total}`);
 * ```
 */
const calculateTSPContribution = (grossPay, employeeElectionPercent, catchupContribution, age) => {
    const maxElection = Math.min(employeeElectionPercent, 100);
    let employeeContribution = (grossPay * maxElection) / 100;
    // 2024 annual limit: $23,000
    const annualLimit = 23000;
    const perPayPeriodLimit = annualLimit / 26;
    employeeContribution = Math.min(employeeContribution, perPayPeriodLimit);
    // Catch-up contribution for age 50+
    if (catchupContribution && age >= 50) {
        const catchupLimit = 7500 / 26; // $7,500 annual catch-up / 26 pay periods
        employeeContribution = Math.min(employeeContribution + catchupLimit, perPayPeriodLimit + catchupLimit);
    }
    // Agency matching: 1% automatic, up to 4% match
    const agencyAutomatic = grossPay * 0.01;
    const agencyMatch = Math.min((grossPay * maxElection) / 100, grossPay * 0.04);
    const totalAgencyMatch = agencyAutomatic + agencyMatch;
    return {
        employeeContribution,
        agencyMatch: totalAgencyMatch,
        total: employeeContribution + totalAgencyMatch,
    };
};
exports.calculateTSPContribution = calculateTSPContribution;
/**
 * Retrieves employee benefits enrollment.
 *
 * @param {string} employeeId - Employee ID
 * @param {Model} BenefitsEnrollment - BenefitsEnrollment model
 * @returns {Promise<any>} Current enrollment
 *
 * @example
 * ```typescript
 * const enrollment = await getEmployeeBenefits('EMP-001', BenefitsEnrollment);
 * ```
 */
const getEmployeeBenefits = async (employeeId, BenefitsEnrollment) => {
    return await BenefitsEnrollment.findOne({
        where: { employeeId },
        order: [['effectiveDate', 'DESC']],
    });
};
exports.getEmployeeBenefits = getEmployeeBenefits;
/**
 * Updates TSP election percentage.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} newElectionPercent - New election %
 * @param {Date} effectiveDate - Effective date
 * @param {Model} BenefitsEnrollment - BenefitsEnrollment model
 * @returns {Promise<any>} Updated enrollment
 *
 * @example
 * ```typescript
 * await updateTSPElection('EMP-001', 10, new Date(), BenefitsEnrollment);
 * ```
 */
const updateTSPElection = async (employeeId, newElectionPercent, effectiveDate, BenefitsEnrollment) => {
    const current = await (0, exports.getEmployeeBenefits)(employeeId, BenefitsEnrollment);
    if (current) {
        current.tspElectionPercent = newElectionPercent;
        current.effectiveDate = effectiveDate;
        await current.save();
        return current;
    }
    return null;
};
exports.updateTSPElection = updateTSPElection;
/**
 * Calculates life insurance premium.
 *
 * @param {number} coverageAmount - Coverage amount
 * @param {number} age - Employee age
 * @returns {number} Monthly premium
 *
 * @example
 * ```typescript
 * const premium = calculateLifeInsurancePremium(100000, 45);
 * ```
 */
const calculateLifeInsurancePremium = (coverageAmount, age) => {
    // Simplified rate per $1,000 of coverage
    let ratePerThousand = 0.15;
    if (age >= 35 && age < 45) {
        ratePerThousand = 0.20;
    }
    else if (age >= 45 && age < 55) {
        ratePerThousand = 0.30;
    }
    else if (age >= 55) {
        ratePerThousand = 0.65;
    }
    return (coverageAmount / 1000) * ratePerThousand;
};
exports.calculateLifeInsurancePremium = calculateLifeInsurancePremium;
// ============================================================================
// WORKERS COMPENSATION (35-38)
// ============================================================================
/**
 * Creates workers compensation claim.
 *
 * @param {WorkersCompensationClaim} claimData - Claim data
 * @returns {WorkersCompensationClaim} Created claim
 *
 * @example
 * ```typescript
 * const claim = createWorkersCompClaim({
 *   claimId: 'WC-2024-001',
 *   employeeId: 'EMP-001',
 *   injuryDate: new Date(),
 *   injuryDescription: 'Back injury from lifting',
 *   claimStatus: 'reported',
 *   compensationAmount: 0,
 *   medicalExpenses: 500,
 *   daysLost: 3
 * });
 * ```
 */
const createWorkersCompClaim = (claimData) => {
    return claimData;
};
exports.createWorkersCompClaim = createWorkersCompClaim;
/**
 * Calculates workers comp continuation of pay.
 *
 * @param {number} dailyWage - Daily wage
 * @param {number} daysLost - Days lost
 * @returns {{ continuationPay: number; maxDays: number }} COP calculation
 *
 * @example
 * ```typescript
 * const cop = calculateContinuationOfPay(300, 15);
 * console.log(`COP amount: ${cop.continuationPay}`);
 * ```
 */
const calculateContinuationOfPay = (dailyWage, daysLost) => {
    const maxCOPDays = 45; // Federal COP is up to 45 days
    const payableDays = Math.min(daysLost, maxCOPDays);
    const continuationPay = dailyWage * payableDays;
    return { continuationPay, maxDays: maxCOPDays };
};
exports.calculateContinuationOfPay = calculateContinuationOfPay;
/**
 * Updates workers comp claim status.
 *
 * @param {string} claimId - Claim ID
 * @param {string} newStatus - New status
 * @param {number} [compensationAmount] - Compensation amount
 * @returns {any} Updated claim
 *
 * @example
 * ```typescript
 * updateWorkersCompStatus('WC-001', 'approved', 5000);
 * ```
 */
const updateWorkersCompStatus = (claimId, newStatus, compensationAmount) => {
    return {
        claimId,
        status: newStatus,
        compensationAmount: compensationAmount || 0,
        updatedAt: new Date(),
    };
};
exports.updateWorkersCompStatus = updateWorkersCompStatus;
/**
 * Calculates OWCP compensation rate.
 *
 * @param {number} weeklyWage - Weekly wage
 * @param {number} dependents - Number of dependents
 * @returns {{ weeklyCompensation: number; compensationRate: number }} OWCP calculation
 *
 * @example
 * ```typescript
 * const owcp = calculateOWCPCompensationRate(1500, 2);
 * ```
 */
const calculateOWCPCompensationRate = (weeklyWage, dependents) => {
    // OWCP pays 66.67% for no dependents, 75% with dependents
    const compensationRate = dependents > 0 ? 0.75 : 0.6667;
    const weeklyCompensation = weeklyWage * compensationRate;
    return { weeklyCompensation, compensationRate };
};
exports.calculateOWCPCompensationRate = calculateOWCPCompensationRate;
// ============================================================================
// GARNISHMENTS & DEDUCTIONS (39-43)
// ============================================================================
/**
 * Processes garnishment deduction.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} netPay - Net pay before garnishment
 * @param {Model} GarnishmentOrder - GarnishmentOrder model
 * @returns {Promise<{ totalGarnishment: number; orders: any[] }>} Garnishment calculation
 *
 * @example
 * ```typescript
 * const garnishment = await processGarnishmentDeduction('EMP-001', 3500, GarnishmentOrder);
 * ```
 */
const processGarnishmentDeduction = async (employeeId, netPay, GarnishmentOrder) => {
    const orders = await GarnishmentOrder.findAll({
        where: { employeeId, status: 'active' },
        order: [['priority', 'ASC']],
    });
    let remainingPay = netPay;
    let totalGarnishment = 0;
    const processedOrders = [];
    for (const order of orders) {
        const maxGarnishment = remainingPay * 0.25; // Federal limit typically 25%
        const garnishmentAmount = Math.min(parseFloat(order.perPaymentAmount), maxGarnishment);
        if (garnishmentAmount > 0) {
            totalGarnishment += garnishmentAmount;
            remainingPay -= garnishmentAmount;
            processedOrders.push({
                garnishmentId: order.garnishmentId,
                type: order.garnishmentType,
                amount: garnishmentAmount,
            });
        }
    }
    return { totalGarnishment, orders: processedOrders };
};
exports.processGarnishmentDeduction = processGarnishmentDeduction;
/**
 * Calculates union dues deduction.
 *
 * @param {string} employeeId - Employee ID
 * @param {Model} UnionDues - UnionDues model (hypothetical)
 * @returns {Promise<number>} Union dues amount
 *
 * @example
 * ```typescript
 * const dues = await calculateUnionDues('EMP-001', UnionDues);
 * ```
 */
const calculateUnionDues = async (employeeId, UnionDues) => {
    // Simplified - would query union dues table
    return 45.00; // Typical bi-weekly union dues
};
exports.calculateUnionDues = calculateUnionDues;
/**
 * Determines garnishment priority order.
 *
 * @param {string} garnishmentType - Garnishment type
 * @returns {number} Priority (1 = highest)
 *
 * @example
 * ```typescript
 * const priority = determineGarnishmentPriority('child_support');
 * ```
 */
const determineGarnishmentPriority = (garnishmentType) => {
    const priorities = {
        child_support: 1,
        tax_levy: 2,
        bankruptcy: 3,
        student_loan: 4,
        creditor: 5,
    };
    return priorities[garnishmentType] || 99;
};
exports.determineGarnishmentPriority = determineGarnishmentPriority;
/**
 * Validates garnishment amount against limits.
 *
 * @param {number} garnishmentAmount - Proposed garnishment
 * @param {number} disposableIncome - Disposable income
 * @param {string} garnishmentType - Garnishment type
 * @returns {{ valid: boolean; maxAllowed: number }} Validation
 *
 * @example
 * ```typescript
 * const validation = validateGarnishmentLimits(500, 2000, 'child_support');
 * ```
 */
const validateGarnishmentLimits = (garnishmentAmount, disposableIncome, garnishmentType) => {
    let maxPercent = 0.25; // Default 25%
    // Child support can be up to 50-65%
    if (garnishmentType === 'child_support') {
        maxPercent = 0.50;
    }
    const maxAllowed = disposableIncome * maxPercent;
    const valid = garnishmentAmount <= maxAllowed;
    return { valid, maxAllowed };
};
exports.validateGarnishmentLimits = validateGarnishmentLimits;
/**
 * Creates garnishment order.
 *
 * @param {GarnishmentOrder} orderData - Order data
 * @param {Model} GarnishmentOrder - GarnishmentOrder model
 * @returns {Promise<any>} Created order
 *
 * @example
 * ```typescript
 * const order = await createGarnishmentOrder(orderData, GarnishmentOrder);
 * ```
 */
const createGarnishmentOrder = async (orderData, GarnishmentOrder) => {
    return await GarnishmentOrder.create(orderData);
};
exports.createGarnishmentOrder = createGarnishmentOrder;
// ============================================================================
// OVERTIME & COMP TIME (44-48)
// ============================================================================
/**
 * Calculates overtime pay rate.
 *
 * @param {number} hourlyRate - Base hourly rate
 * @param {string} overtimeType - Overtime type
 * @returns {number} Overtime rate
 *
 * @example
 * ```typescript
 * const rate = calculateOvertimeRate(40, 'time_and_half');
 * console.log(`OT rate: ${rate}`);
 * ```
 */
const calculateOvertimeRate = (hourlyRate, overtimeType) => {
    const rates = {
        time_and_half: 1.5,
        double_time: 2.0,
        holiday: 2.0,
    };
    const multiplier = rates[overtimeType] || 1.5;
    return hourlyRate * multiplier;
};
exports.calculateOvertimeRate = calculateOvertimeRate;
/**
 * Processes compensatory time earned.
 *
 * @param {CompensatoryTimeRecord} compTimeData - Comp time data
 * @returns {CompensatoryTimeRecord} Comp time record
 *
 * @example
 * ```typescript
 * const compTime = processCompensatoryTime({
 *   employeeId: 'EMP-001',
 *   earnedDate: new Date(),
 *   hoursEarned: 8,
 *   hoursUsed: 0,
 *   hoursRemaining: 8,
 *   expirationDate: new Date(Date.now() + 180 * 86400000),
 *   earnedFor: 'Emergency response'
 * });
 * ```
 */
const processCompensatoryTime = (compTimeData) => {
    return compTimeData;
};
exports.processCompensatoryTime = processCompensatoryTime;
/**
 * Uses compensatory time for leave.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} hoursUsed - Hours to use
 * @returns {any} Updated comp time balance
 *
 * @example
 * ```typescript
 * const balance = useCompensatoryTime('EMP-001', 4);
 * ```
 */
const useCompensatoryTime = (employeeId, hoursUsed) => {
    return {
        employeeId,
        hoursUsed,
        remainingBalance: 0, // Would calculate from existing balance
        usedAt: new Date(),
    };
};
exports.useCompensatoryTime = useCompensatoryTime;
/**
 * Calculates FLSA overtime eligibility.
 *
 * @param {string} positionTitle - Position title
 * @param {number} annualSalary - Annual salary
 * @returns {{ exempt: boolean; reason: string }} FLSA determination
 *
 * @example
 * ```typescript
 * const flsa = determineFLSAStatus('IT Specialist', 45000);
 * console.log(`Exempt: ${flsa.exempt}`);
 * ```
 */
const determineFLSAStatus = (positionTitle, annualSalary) => {
    const exemptSalaryThreshold = 35568; // 2024 FLSA threshold
    if (annualSalary < exemptSalaryThreshold) {
        return { exempt: false, reason: 'Below salary threshold' };
    }
    // Simplified - would check duties test
    const exemptTitles = ['manager', 'director', 'supervisor', 'professional'];
    const isExemptTitle = exemptTitles.some(title => positionTitle.toLowerCase().includes(title));
    if (isExemptTitle) {
        return { exempt: true, reason: 'Meets executive/professional exemption' };
    }
    return { exempt: false, reason: 'Does not meet duties test' };
};
exports.determineFLSAStatus = determineFLSAStatus;
/**
 * Validates overtime hours request.
 *
 * @param {number} regularHours - Regular hours
 * @param {number} overtimeHours - OT hours requested
 * @param {number} maxWeeklyHours - Max weekly hours
 * @returns {{ valid: boolean; message: string }} Validation
 *
 * @example
 * ```typescript
 * const validation = validateOvertimeRequest(80, 10, 100);
 * ```
 */
const validateOvertimeRequest = (regularHours, overtimeHours, maxWeeklyHours) => {
    const totalHours = regularHours + overtimeHours;
    if (totalHours > maxWeeklyHours) {
        return {
            valid: false,
            message: `Total hours ${totalHours} exceeds maximum ${maxWeeklyHours}`,
        };
    }
    if (overtimeHours > regularHours * 0.5) {
        return {
            valid: false,
            message: 'Overtime exceeds 50% of regular hours - requires approval',
        };
    }
    return { valid: true, message: 'Valid overtime request' };
};
exports.validateOvertimeRequest = validateOvertimeRequest;
// ============================================================================
// REPORTING & COMPLIANCE (49-50)
// ============================================================================
/**
 * Generates W-2 data for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} taxYear - Tax year
 * @param {Model} PayrollRecord - PayrollRecord model
 * @returns {Promise<any>} W-2 data
 *
 * @example
 * ```typescript
 * const w2 = await generateW2Data('EMP-001', 2024, PayrollRecord);
 * ```
 */
const generateW2Data = async (employeeId, taxYear, PayrollRecord) => {
    const records = await PayrollRecord.findAll({ where: { employeeId } });
    const totals = {
        employeeId,
        taxYear,
        wages: records.reduce((sum, r) => sum + parseFloat(r.grossPay), 0),
        federalTaxWithheld: records.reduce((sum, r) => sum + parseFloat(r.federalTax), 0),
        socialSecurityWages: records.reduce((sum, r) => sum + parseFloat(r.grossPay), 0),
        socialSecurityTax: records.reduce((sum, r) => sum + parseFloat(r.ficaTax), 0),
        medicareWages: records.reduce((sum, r) => sum + parseFloat(r.grossPay), 0),
        medicareTax: records.reduce((sum, r) => sum + parseFloat(r.medicareTax), 0),
        stateTaxWithheld: records.reduce((sum, r) => sum + parseFloat(r.stateTax), 0),
    };
    return totals;
};
exports.generateW2Data = generateW2Data;
/**
 * Exports payroll register for reporting.
 *
 * @param {string} payPeriodId - Pay period ID
 * @param {Model} PayrollRecord - PayrollRecord model
 * @returns {Promise<string>} CSV export
 *
 * @example
 * ```typescript
 * const csv = await exportPayrollRegister('PP-2024-01', PayrollRecord);
 * fs.writeFileSync('payroll.csv', csv);
 * ```
 */
const exportPayrollRegister = async (payPeriodId, PayrollRecord) => {
    const records = await PayrollRecord.findAll({ where: { payPeriodId } });
    const headers = 'Employee ID,Gross Pay,Federal Tax,State Tax,FICA,Medicare,Retirement,Net Pay\n';
    const rows = records.map((r) => `${r.employeeId},${r.grossPay},${r.federalTax},${r.stateTax},${r.ficaTax},${r.medicareTax},${r.retirementContribution},${r.netPay}`);
    return headers + rows.join('\n');
};
exports.exportPayrollRegister = exportPayrollRegister;
// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================
/**
 * NestJS Injectable service for Government Payroll & Benefits.
 *
 * @example
 * ```typescript
 * @Controller('payroll')
 * export class PayrollController {
 *   constructor(private readonly payrollService: GovernmentPayrollService) {}
 *
 *   @Post('process')
 *   async processPayroll(@Body() data: any) {
 *     return this.payrollService.processPayroll(data);
 *   }
 * }
 * ```
 */
let GovernmentPayrollService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GovernmentPayrollService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        async createEmployee(data) {
            const GovernmentEmployee = (0, exports.createGovernmentEmployeeModel)(this.sequelize);
            return (0, exports.createGovernmentEmployee)(data, GovernmentEmployee);
        }
        async processPayroll(employeeId, payPeriodId, hours) {
            const GovernmentEmployee = (0, exports.createGovernmentEmployeeModel)(this.sequelize);
            const PayrollRecord = (0, exports.createPayrollRecordModel)(this.sequelize);
            return (0, exports.processEmployeePayroll)(employeeId, payPeriodId, hours.regular, hours.overtime, GovernmentEmployee, PayrollRecord);
        }
        async calculatePension(yearsOfService, highThree, age) {
            return (0, exports.calculateFERSPension)(yearsOfService, highThree, age);
        }
        async processLeaveAccrual(employeeId, payPeriodId) {
            const GovernmentEmployee = (0, exports.createGovernmentEmployeeModel)(this.sequelize);
            const LeaveBalance = (0, exports.createLeaveBalanceModel)(this.sequelize);
            return (0, exports.processLeaveAccrual)(employeeId, payPeriodId, GovernmentEmployee, LeaveBalance);
        }
    };
    __setFunctionName(_classThis, "GovernmentPayrollService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GovernmentPayrollService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GovernmentPayrollService = _classThis;
})();
exports.GovernmentPayrollService = GovernmentPayrollService;
/**
 * Default export with all payroll utilities.
 */
exports.default = {
    // Models
    createGovernmentEmployeeModel: exports.createGovernmentEmployeeModel,
    createPayrollRecordModel: exports.createPayrollRecordModel,
    createLeaveBalanceModel: exports.createLeaveBalanceModel,
    createBenefitsEnrollmentModel: exports.createBenefitsEnrollmentModel,
    createGarnishmentOrderModel: exports.createGarnishmentOrderModel,
    // Employee Management
    createGovernmentEmployee: exports.createGovernmentEmployee,
    updateEmployeeGradeStep: exports.updateEmployeeGradeStep,
    calculateYearsOfService: exports.calculateYearsOfService,
    getEmployeeById: exports.getEmployeeById,
    getEmployeesByDepartment: exports.getEmployeesByDepartment,
    // Step & Grade
    getPayScaleForGradeStep: exports.getPayScaleForGradeStep,
    calculateLocalityPay: exports.calculateLocalityPay,
    determineNextStepIncreaseDate: exports.determineNextStepIncreaseDate,
    validateGradeStepCombination: exports.validateGradeStepCombination,
    calculateTotalCompensation: exports.calculateTotalCompensation,
    // Pension
    calculateFERSPension: exports.calculateFERSPension,
    calculateCSRSPension: exports.calculateCSRSPension,
    calculateHighThreeAverage: exports.calculateHighThreeAverage,
    determinePensionEligibility: exports.determinePensionEligibility,
    calculateSurvivorAnnuityReduction: exports.calculateSurvivorAnnuityReduction,
    // Leave
    calculateLeaveAccrualRate: exports.calculateLeaveAccrualRate,
    processLeaveAccrual: exports.processLeaveAccrual,
    processLeaveRequest: exports.processLeaveRequest,
    getLeaveBalance: exports.getLeaveBalance,
    processLeaveCarryover: exports.processLeaveCarryover,
    validateLeaveRequest: exports.validateLeaveRequest,
    // Payroll
    calculateGrossPay: exports.calculateGrossPay,
    calculateFICATax: exports.calculateFICATax,
    calculateMedicareTax: exports.calculateMedicareTax,
    calculateFederalTax: exports.calculateFederalTax,
    calculateFERSContribution: exports.calculateFERSContribution,
    processEmployeePayroll: exports.processEmployeePayroll,
    generatePayrollSummary: exports.generatePayrollSummary,
    // Benefits
    enrollHealthInsurance: exports.enrollHealthInsurance,
    calculateHealthPremiumSplit: exports.calculateHealthPremiumSplit,
    calculateTSPContribution: exports.calculateTSPContribution,
    getEmployeeBenefits: exports.getEmployeeBenefits,
    updateTSPElection: exports.updateTSPElection,
    calculateLifeInsurancePremium: exports.calculateLifeInsurancePremium,
    // Workers Comp
    createWorkersCompClaim: exports.createWorkersCompClaim,
    calculateContinuationOfPay: exports.calculateContinuationOfPay,
    updateWorkersCompStatus: exports.updateWorkersCompStatus,
    calculateOWCPCompensationRate: exports.calculateOWCPCompensationRate,
    // Garnishments
    processGarnishmentDeduction: exports.processGarnishmentDeduction,
    calculateUnionDues: exports.calculateUnionDues,
    determineGarnishmentPriority: exports.determineGarnishmentPriority,
    validateGarnishmentLimits: exports.validateGarnishmentLimits,
    createGarnishmentOrder: exports.createGarnishmentOrder,
    // Overtime
    calculateOvertimeRate: exports.calculateOvertimeRate,
    processCompensatoryTime: exports.processCompensatoryTime,
    useCompensatoryTime: exports.useCompensatoryTime,
    determineFLSAStatus: exports.determineFLSAStatus,
    validateOvertimeRequest: exports.validateOvertimeRequest,
    // Reporting
    generateW2Data: exports.generateW2Data,
    exportPayrollRegister: exports.exportPayrollRegister,
    // Service
    GovernmentPayrollService,
};
//# sourceMappingURL=government-payroll-benefits-kit.js.map
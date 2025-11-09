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
import { Sequelize, Transaction } from 'sequelize';
interface GovernmentEmployeeData {
    employeeId: string;
    firstName: string;
    lastName: string;
    ssn: string;
    dateOfBirth: Date;
    hireDate: Date;
    departmentId: string;
    positionTitle: string;
    gradeLevel: string;
    stepLevel: number;
    payPlan: 'GS' | 'WG' | 'SES' | 'OTHER';
    salaryType: 'annual' | 'hourly';
    baseSalary: number;
    localityPay: number;
    status: 'active' | 'on_leave' | 'terminated' | 'retired';
    metadata?: Record<string, any>;
}
interface PayrollCalculation {
    employeeId: string;
    payPeriodId: string;
    regularHours: number;
    overtimeHours: number;
    regularPay: number;
    overtimePay: number;
    localityPay: number;
    grossPay: number;
    federalTax: number;
    stateTax: number;
    ficaTax: number;
    medicareTax: number;
    retirementContribution: number;
    healthInsurance: number;
    unionDues: number;
    garnishments: number;
    totalDeductions: number;
    netPay: number;
}
interface StepGradePayScale {
    payPlan: string;
    gradeLevel: string;
    stepLevel: number;
    annualSalary: number;
    hourlyRate: number;
    effectiveDate: Date;
    localityAdjustment: number;
}
interface PensionCalculation {
    employeeId: string;
    yearsOfService: number;
    highThreeAverage: number;
    serviceMultiplier: number;
    annualBenefit: number;
    monthlyBenefit: number;
    calculationMethod: 'FERS' | 'CSRS' | 'FERS_RAE' | 'FERS_FRAE';
    eligibilityAge: number;
    isEligible: boolean;
}
interface LeaveAccrual {
    employeeId: string;
    leaveType: 'annual' | 'sick' | 'compensatory' | 'military' | 'family';
    accrualRate: number;
    payPeriodsPerYear: number;
    hoursPerPayPeriod: number;
    maxAccrual: number;
    carryoverLimit: number;
}
interface LeaveBalance {
    employeeId: string;
    leaveType: string;
    currentBalance: number;
    accrued: number;
    used: number;
    carryover: number;
    maxBalance: number;
    asOfDate: Date;
}
interface LeaveRequest {
    requestId: string;
    employeeId: string;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    hoursRequested: number;
    status: 'pending' | 'approved' | 'denied' | 'cancelled';
    requestedBy: string;
    approvedBy?: string;
    reason?: string;
}
interface BenefitsEnrollment {
    employeeId: string;
    healthPlanId?: string;
    dentalPlanId?: string;
    visionPlanId?: string;
    lifeInsuranceAmount: number;
    tspElectionPercent: number;
    tspCatchupContribution: boolean;
    enrollmentDate: Date;
    effectiveDate: Date;
}
interface WorkersCompensationClaim {
    claimId: string;
    employeeId: string;
    injuryDate: Date;
    injuryDescription: string;
    claimStatus: 'reported' | 'under_review' | 'approved' | 'denied' | 'closed';
    compensationAmount: number;
    medicalExpenses: number;
    daysLost: number;
    returnToWorkDate?: Date;
}
interface GarnishmentOrder {
    garnishmentId: string;
    employeeId: string;
    garnishmentType: 'child_support' | 'tax_levy' | 'student_loan' | 'bankruptcy' | 'creditor';
    orderDate: Date;
    totalAmount?: number;
    perPaymentAmount: number;
    priority: number;
    issuingAuthority: string;
    caseNumber: string;
    status: 'active' | 'completed' | 'suspended';
}
interface CompensatoryTimeRecord {
    employeeId: string;
    earnedDate: Date;
    hoursEarned: number;
    hoursUsed: number;
    hoursRemaining: number;
    expirationDate: Date;
    earnedFor: string;
}
interface RetirementContribution {
    employeeId: string;
    payPeriodId: string;
    employeeContribution: number;
    agencyContribution: number;
    agencyMatchingContribution: number;
    contributionType: 'FERS' | 'CSRS' | 'TSP' | 'TSP_CATCHUP';
    vestingPercentage: number;
}
interface TaxWithholding {
    employeeId: string;
    federalAllowances: number;
    federalExtraWithholding: number;
    stateAllowances: number;
    stateExtraWithholding: number;
    filingStatus: 'single' | 'married' | 'head_of_household';
    w4OnFile: boolean;
    lastUpdated: Date;
}
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
export declare const createGovernmentEmployeeModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        employeeId: string;
        firstName: string;
        lastName: string;
        ssn: string;
        dateOfBirth: Date;
        hireDate: Date;
        departmentId: string;
        positionTitle: string;
        gradeLevel: string;
        stepLevel: number;
        payPlan: string;
        salaryType: string;
        baseSalary: number;
        localityPay: number;
        status: string;
        terminationDate: Date | null;
        retirementDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const createPayrollRecordModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        employeeId: string;
        payPeriodId: string;
        regularHours: number;
        overtimeHours: number;
        regularPay: number;
        overtimePay: number;
        localityPay: number;
        grossPay: number;
        federalTax: number;
        stateTax: number;
        ficaTax: number;
        medicareTax: number;
        retirementContribution: number;
        healthInsurance: number;
        unionDues: number;
        garnishments: number;
        totalDeductions: number;
        netPay: number;
        status: string;
        processedAt: Date | null;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Leave Balances tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LeaveBalance model
 */
export declare const createLeaveBalanceModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        employeeId: string;
        leaveType: string;
        currentBalance: number;
        accrued: number;
        used: number;
        carryover: number;
        maxBalance: number;
        fiscalYear: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Benefits Enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BenefitsEnrollment model
 */
export declare const createBenefitsEnrollmentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        employeeId: string;
        healthPlanId: string | null;
        dentalPlanId: string | null;
        visionPlanId: string | null;
        lifeInsuranceAmount: number;
        tspElectionPercent: number;
        tspCatchupContribution: boolean;
        enrollmentDate: Date;
        effectiveDate: Date;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Garnishment Orders.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GarnishmentOrder model
 */
export declare const createGarnishmentOrderModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        garnishmentId: string;
        employeeId: string;
        garnishmentType: string;
        orderDate: Date;
        totalAmount: number | null;
        perPaymentAmount: number;
        priority: number;
        issuingAuthority: string;
        caseNumber: string;
        status: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const createGovernmentEmployee: (employeeData: GovernmentEmployeeData, GovernmentEmployee: any, transaction?: Transaction) => Promise<any>;
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
export declare const updateEmployeeGradeStep: (employeeId: string, newGrade: string, newStep: number, effectiveDate: Date, GovernmentEmployee: any) => Promise<any>;
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
export declare const calculateYearsOfService: (hireDate: Date, asOfDate?: Date) => number;
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
export declare const getEmployeeById: (employeeId: string, GovernmentEmployee: any) => Promise<any>;
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
export declare const getEmployeesByDepartment: (departmentId: string, GovernmentEmployee: any) => Promise<any[]>;
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
export declare const getPayScaleForGradeStep: (payPlan: string, gradeLevel: string, stepLevel: number, effectiveDate?: Date) => StepGradePayScale;
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
export declare const calculateLocalityPay: (baseSalary: number, localityCode: string) => number;
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
export declare const determineNextStepIncreaseDate: (lastStepIncreaseDate: Date, currentStep: number) => Date;
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
export declare const validateGradeStepCombination: (gradeLevel: string, stepLevel: number) => {
    valid: boolean;
    message: string;
};
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
export declare const calculateTotalCompensation: (baseSalary: number, localityCode: string) => {
    baseSalary: number;
    localityPay: number;
    totalCompensation: number;
};
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
export declare const calculateFERSPension: (yearsOfService: number, highThreeAverage: number, retirementAge: number) => PensionCalculation;
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
export declare const calculateCSRSPension: (yearsOfService: number, highThreeAverage: number) => PensionCalculation;
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
export declare const calculateHighThreeAverage: (salaries: number[]) => number;
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
export declare const determinePensionEligibility: (age: number, yearsOfService: number, retirementSystem: "FERS" | "CSRS") => {
    eligible: boolean;
    reason: string;
    earliestRetirementAge?: number;
};
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
export declare const calculateSurvivorAnnuityReduction: (annualPension: number, fullSurvivorBenefit: boolean) => {
    reduction: number;
    netPension: number;
};
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
export declare const calculateLeaveAccrualRate: (yearsOfService: number, leaveType: string) => LeaveAccrual;
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
export declare const processLeaveAccrual: (employeeId: string, payPeriodId: string, GovernmentEmployee: any, LeaveBalance: any) => Promise<any>;
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
export declare const processLeaveRequest: (requestData: LeaveRequest, LeaveBalance: any) => Promise<any>;
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
export declare const getLeaveBalance: (employeeId: string, leaveType: string, LeaveBalance: any) => Promise<LeaveBalance>;
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
export declare const processLeaveCarryover: (employeeId: string, fiscalYear: number, LeaveBalance: any) => Promise<any>;
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
export declare const validateLeaveRequest: (employeeId: string, leaveType: string, hoursRequested: number, LeaveBalance: any) => Promise<{
    valid: boolean;
    availableHours: number;
    message: string;
}>;
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
export declare const calculateGrossPay: (annualSalary: number, regularHours: number, overtimeHours: number, localityPay: number) => {
    regularPay: number;
    overtimePay: number;
    grossPay: number;
};
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
export declare const calculateFICATax: (grossPay: number, yearToDateEarnings: number, taxYear?: number) => number;
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
export declare const calculateMedicareTax: (grossPay: number, yearToDateEarnings: number) => number;
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
export declare const calculateFederalTax: (grossPay: number, taxInfo: TaxWithholding, payPeriodsPerYear: number) => number;
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
export declare const calculateFERSContribution: (grossPay: number, hireDate: Date) => RetirementContribution;
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
export declare const processEmployeePayroll: (employeeId: string, payPeriodId: string, regularHours: number, overtimeHours: number, GovernmentEmployee: any, PayrollRecord: any) => Promise<PayrollCalculation>;
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
export declare const generatePayrollSummary: (payPeriodId: string, PayrollRecord: any) => Promise<any>;
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
export declare const enrollHealthInsurance: (enrollmentData: BenefitsEnrollment, BenefitsEnrollment: any) => Promise<any>;
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
export declare const calculateHealthPremiumSplit: (totalPremium: number, planType: string) => {
    employeeShare: number;
    governmentShare: number;
};
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
export declare const calculateTSPContribution: (grossPay: number, employeeElectionPercent: number, catchupContribution: boolean, age: number) => {
    employeeContribution: number;
    agencyMatch: number;
    total: number;
};
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
export declare const getEmployeeBenefits: (employeeId: string, BenefitsEnrollment: any) => Promise<any>;
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
export declare const updateTSPElection: (employeeId: string, newElectionPercent: number, effectiveDate: Date, BenefitsEnrollment: any) => Promise<any>;
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
export declare const calculateLifeInsurancePremium: (coverageAmount: number, age: number) => number;
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
export declare const createWorkersCompClaim: (claimData: WorkersCompensationClaim) => WorkersCompensationClaim;
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
export declare const calculateContinuationOfPay: (dailyWage: number, daysLost: number) => {
    continuationPay: number;
    maxDays: number;
};
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
export declare const updateWorkersCompStatus: (claimId: string, newStatus: string, compensationAmount?: number) => any;
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
export declare const calculateOWCPCompensationRate: (weeklyWage: number, dependents: number) => {
    weeklyCompensation: number;
    compensationRate: number;
};
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
export declare const processGarnishmentDeduction: (employeeId: string, netPay: number, GarnishmentOrder: any) => Promise<{
    totalGarnishment: number;
    orders: any[];
}>;
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
export declare const calculateUnionDues: (employeeId: string, UnionDues: any) => Promise<number>;
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
export declare const determineGarnishmentPriority: (garnishmentType: string) => number;
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
export declare const validateGarnishmentLimits: (garnishmentAmount: number, disposableIncome: number, garnishmentType: string) => {
    valid: boolean;
    maxAllowed: number;
};
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
export declare const createGarnishmentOrder: (orderData: GarnishmentOrder, GarnishmentOrder: any) => Promise<any>;
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
export declare const calculateOvertimeRate: (hourlyRate: number, overtimeType: string) => number;
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
export declare const processCompensatoryTime: (compTimeData: CompensatoryTimeRecord) => CompensatoryTimeRecord;
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
export declare const useCompensatoryTime: (employeeId: string, hoursUsed: number) => any;
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
export declare const determineFLSAStatus: (positionTitle: string, annualSalary: number) => {
    exempt: boolean;
    reason: string;
};
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
export declare const validateOvertimeRequest: (regularHours: number, overtimeHours: number, maxWeeklyHours: number) => {
    valid: boolean;
    message: string;
};
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
export declare const generateW2Data: (employeeId: string, taxYear: number, PayrollRecord: any) => Promise<any>;
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
export declare const exportPayrollRegister: (payPeriodId: string, PayrollRecord: any) => Promise<string>;
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
export declare class GovernmentPayrollService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createEmployee(data: GovernmentEmployeeData): Promise<any>;
    processPayroll(employeeId: string, payPeriodId: string, hours: {
        regular: number;
        overtime: number;
    }): Promise<PayrollCalculation>;
    calculatePension(yearsOfService: number, highThree: number, age: number): Promise<PensionCalculation>;
    processLeaveAccrual(employeeId: string, payPeriodId: string): Promise<any>;
}
/**
 * Default export with all payroll utilities.
 */
declare const _default: {
    createGovernmentEmployeeModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            employeeId: string;
            firstName: string;
            lastName: string;
            ssn: string;
            dateOfBirth: Date;
            hireDate: Date;
            departmentId: string;
            positionTitle: string;
            gradeLevel: string;
            stepLevel: number;
            payPlan: string;
            salaryType: string;
            baseSalary: number;
            localityPay: number;
            status: string;
            terminationDate: Date | null;
            retirementDate: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createPayrollRecordModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            employeeId: string;
            payPeriodId: string;
            regularHours: number;
            overtimeHours: number;
            regularPay: number;
            overtimePay: number;
            localityPay: number;
            grossPay: number;
            federalTax: number;
            stateTax: number;
            ficaTax: number;
            medicareTax: number;
            retirementContribution: number;
            healthInsurance: number;
            unionDues: number;
            garnishments: number;
            totalDeductions: number;
            netPay: number;
            status: string;
            processedAt: Date | null;
            readonly createdAt: Date;
        };
    };
    createLeaveBalanceModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            employeeId: string;
            leaveType: string;
            currentBalance: number;
            accrued: number;
            used: number;
            carryover: number;
            maxBalance: number;
            fiscalYear: number;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createBenefitsEnrollmentModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            employeeId: string;
            healthPlanId: string | null;
            dentalPlanId: string | null;
            visionPlanId: string | null;
            lifeInsuranceAmount: number;
            tspElectionPercent: number;
            tspCatchupContribution: boolean;
            enrollmentDate: Date;
            effectiveDate: Date;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createGarnishmentOrderModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            garnishmentId: string;
            employeeId: string;
            garnishmentType: string;
            orderDate: Date;
            totalAmount: number | null;
            perPaymentAmount: number;
            priority: number;
            issuingAuthority: string;
            caseNumber: string;
            status: string;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createGovernmentEmployee: (employeeData: GovernmentEmployeeData, GovernmentEmployee: any, transaction?: Transaction) => Promise<any>;
    updateEmployeeGradeStep: (employeeId: string, newGrade: string, newStep: number, effectiveDate: Date, GovernmentEmployee: any) => Promise<any>;
    calculateYearsOfService: (hireDate: Date, asOfDate?: Date) => number;
    getEmployeeById: (employeeId: string, GovernmentEmployee: any) => Promise<any>;
    getEmployeesByDepartment: (departmentId: string, GovernmentEmployee: any) => Promise<any[]>;
    getPayScaleForGradeStep: (payPlan: string, gradeLevel: string, stepLevel: number, effectiveDate?: Date) => StepGradePayScale;
    calculateLocalityPay: (baseSalary: number, localityCode: string) => number;
    determineNextStepIncreaseDate: (lastStepIncreaseDate: Date, currentStep: number) => Date;
    validateGradeStepCombination: (gradeLevel: string, stepLevel: number) => {
        valid: boolean;
        message: string;
    };
    calculateTotalCompensation: (baseSalary: number, localityCode: string) => {
        baseSalary: number;
        localityPay: number;
        totalCompensation: number;
    };
    calculateFERSPension: (yearsOfService: number, highThreeAverage: number, retirementAge: number) => PensionCalculation;
    calculateCSRSPension: (yearsOfService: number, highThreeAverage: number) => PensionCalculation;
    calculateHighThreeAverage: (salaries: number[]) => number;
    determinePensionEligibility: (age: number, yearsOfService: number, retirementSystem: "FERS" | "CSRS") => {
        eligible: boolean;
        reason: string;
        earliestRetirementAge?: number;
    };
    calculateSurvivorAnnuityReduction: (annualPension: number, fullSurvivorBenefit: boolean) => {
        reduction: number;
        netPension: number;
    };
    calculateLeaveAccrualRate: (yearsOfService: number, leaveType: string) => LeaveAccrual;
    processLeaveAccrual: (employeeId: string, payPeriodId: string, GovernmentEmployee: any, LeaveBalance: any) => Promise<any>;
    processLeaveRequest: (requestData: LeaveRequest, LeaveBalance: any) => Promise<any>;
    getLeaveBalance: (employeeId: string, leaveType: string, LeaveBalance: any) => Promise<LeaveBalance>;
    processLeaveCarryover: (employeeId: string, fiscalYear: number, LeaveBalance: any) => Promise<any>;
    validateLeaveRequest: (employeeId: string, leaveType: string, hoursRequested: number, LeaveBalance: any) => Promise<{
        valid: boolean;
        availableHours: number;
        message: string;
    }>;
    calculateGrossPay: (annualSalary: number, regularHours: number, overtimeHours: number, localityPay: number) => {
        regularPay: number;
        overtimePay: number;
        grossPay: number;
    };
    calculateFICATax: (grossPay: number, yearToDateEarnings: number, taxYear?: number) => number;
    calculateMedicareTax: (grossPay: number, yearToDateEarnings: number) => number;
    calculateFederalTax: (grossPay: number, taxInfo: TaxWithholding, payPeriodsPerYear: number) => number;
    calculateFERSContribution: (grossPay: number, hireDate: Date) => RetirementContribution;
    processEmployeePayroll: (employeeId: string, payPeriodId: string, regularHours: number, overtimeHours: number, GovernmentEmployee: any, PayrollRecord: any) => Promise<PayrollCalculation>;
    generatePayrollSummary: (payPeriodId: string, PayrollRecord: any) => Promise<any>;
    enrollHealthInsurance: (enrollmentData: BenefitsEnrollment, BenefitsEnrollment: any) => Promise<any>;
    calculateHealthPremiumSplit: (totalPremium: number, planType: string) => {
        employeeShare: number;
        governmentShare: number;
    };
    calculateTSPContribution: (grossPay: number, employeeElectionPercent: number, catchupContribution: boolean, age: number) => {
        employeeContribution: number;
        agencyMatch: number;
        total: number;
    };
    getEmployeeBenefits: (employeeId: string, BenefitsEnrollment: any) => Promise<any>;
    updateTSPElection: (employeeId: string, newElectionPercent: number, effectiveDate: Date, BenefitsEnrollment: any) => Promise<any>;
    calculateLifeInsurancePremium: (coverageAmount: number, age: number) => number;
    createWorkersCompClaim: (claimData: WorkersCompensationClaim) => WorkersCompensationClaim;
    calculateContinuationOfPay: (dailyWage: number, daysLost: number) => {
        continuationPay: number;
        maxDays: number;
    };
    updateWorkersCompStatus: (claimId: string, newStatus: string, compensationAmount?: number) => any;
    calculateOWCPCompensationRate: (weeklyWage: number, dependents: number) => {
        weeklyCompensation: number;
        compensationRate: number;
    };
    processGarnishmentDeduction: (employeeId: string, netPay: number, GarnishmentOrder: any) => Promise<{
        totalGarnishment: number;
        orders: any[];
    }>;
    calculateUnionDues: (employeeId: string, UnionDues: any) => Promise<number>;
    determineGarnishmentPriority: (garnishmentType: string) => number;
    validateGarnishmentLimits: (garnishmentAmount: number, disposableIncome: number, garnishmentType: string) => {
        valid: boolean;
        maxAllowed: number;
    };
    createGarnishmentOrder: (orderData: GarnishmentOrder, GarnishmentOrder: any) => Promise<any>;
    calculateOvertimeRate: (hourlyRate: number, overtimeType: string) => number;
    processCompensatoryTime: (compTimeData: CompensatoryTimeRecord) => CompensatoryTimeRecord;
    useCompensatoryTime: (employeeId: string, hoursUsed: number) => any;
    determineFLSAStatus: (positionTitle: string, annualSalary: number) => {
        exempt: boolean;
        reason: string;
    };
    validateOvertimeRequest: (regularHours: number, overtimeHours: number, maxWeeklyHours: number) => {
        valid: boolean;
        message: string;
    };
    generateW2Data: (employeeId: string, taxYear: number, PayrollRecord: any) => Promise<any>;
    exportPayrollRegister: (payPeriodId: string, PayrollRecord: any) => Promise<string>;
    GovernmentPayrollService: typeof GovernmentPayrollService;
};
export default _default;
//# sourceMappingURL=government-payroll-benefits-kit.d.ts.map
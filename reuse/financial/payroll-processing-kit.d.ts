/**
 * Payroll Processing Kit - FIN-PAYR-001
 * Comprehensive reusable financial functions for enterprise payroll processing.
 * Compatible with ADP, Paychex, Gusto standards.
 *
 * @module payroll-processing-kit
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 * @author Financial Engineering Team
 * @version 1.0.0
 */
/**
 * Employee record in payroll system
 */
interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    ssn: string;
    status: 'active' | 'inactive' | 'terminated';
    hireDate: Date;
    terminationDate?: Date;
    department: string;
    position: string;
}
/**
 * Compensation configuration
 */
interface Compensation {
    employeeId: string;
    salaryType: 'salary' | 'hourly';
    amount: number;
    currency: string;
    effectiveDate: Date;
    payFrequency: 'weekly' | 'biweekly' | 'monthly';
}
/**
 * Time entry record
 */
interface TimeEntry {
    id: string;
    employeeId: string;
    date: Date;
    regularHours: number;
    overtimeHours: number;
    status: 'pending' | 'approved' | 'rejected';
}
/**
 * Paycheck data
 */
interface Paycheck {
    id: string;
    employeeId: string;
    periodStart: Date;
    periodEnd: Date;
    grossPay: number;
    deductions: number;
    netPay: number;
    taxes: number;
}
/**
 * Tax withholding configuration
 */
interface TaxWithholding {
    employeeId: string;
    federalRate: number;
    stateRate: number;
    localRate: number;
    ficaRate: number;
    taxFilingStatus: 'single' | 'married' | 'other';
}
/**
 * Benefit deduction record
 */
interface BenefitDeduction {
    id: string;
    employeeId: string;
    benefitType: 'health' | 'retirement' | 'fsa' | 'other';
    amount: number;
    frequency: 'per-paycheck' | 'annual';
}
/**
 * Garnishment record
 */
interface Garnishment {
    id: string;
    employeeId: string;
    type: 'wage' | 'child-support' | 'tax-levy' | 'other';
    amount: number;
    remainingBalance: number;
    priority: number;
}
/**
 * Payroll batch processing
 */
interface PayrollBatch {
    id: string;
    batchDate: Date;
    payPeriodStart: Date;
    payPeriodEnd: Date;
    status: 'draft' | 'validated' | 'approved' | 'processed' | 'rejected';
    totalEmployees: number;
    totalGrossPay: number;
    totalDeductions: number;
    totalNetPay: number;
}
/**
 * Tax form configuration
 */
interface TaxForm {
    type: 'W2' | '941' | '940' | '1099' | 'other';
    taxYear: number;
    generatedDate: Date;
    employeeId?: string;
}
/**
 * Create new employee record
 * @param employee - Employee data
 * @returns Created employee
 */
export declare function createEmployee(employee: Employee): Employee;
/**
 * Update employee information
 * @param employeeId - Employee ID
 * @param updates - Fields to update
 * @returns Updated employee
 */
export declare function updateEmployee(employeeId: string, updates: Partial<Employee>): Employee;
/**
 * Set employee compensation
 * @param employeeId - Employee ID
 * @param compensation - Compensation details
 * @returns Compensation record
 */
export declare function setEmployeeCompensation(employeeId: string, compensation: Omit<Compensation, 'employeeId'>): Compensation;
/**
 * Deactivate employee
 * @param employeeId - Employee ID
 * @param terminationDate - Last day of work
 * @returns Deactivated employee
 */
export declare function deactivateEmployee(employeeId: string, terminationDate: Date): Employee;
/**
 * Record time entry
 * @param employeeId - Employee ID
 * @param date - Work date
 * @param regularHours - Regular hours worked
 * @param overtimeHours - Overtime hours worked
 * @returns Time entry record
 */
export declare function recordTimeEntry(employeeId: string, date: Date, regularHours: number, overtimeHours: number): TimeEntry;
/**
 * Approve timesheet
 * @param timeEntryId - Time entry ID
 * @returns Approved time entry
 */
export declare function approveTimesheet(timeEntryId: string): TimeEntry;
/**
 * Calculate overtime hours
 * @param regularHours - Regular hours worked
 * @param hoursThreshold - Threshold for overtime (default 40)
 * @returns Overtime hours
 */
export declare function calculateOvertimeHours(regularHours: number, hoursThreshold?: number): number;
/**
 * Import time entries from external source
 * @param entries - Array of time entries
 * @returns Imported entries with IDs
 */
export declare function importTimeEntries(entries: Omit<TimeEntry, 'id' | 'status'>[]): TimeEntry[];
/**
 * Calculate regular pay
 * @param hourlyRate - Hourly rate
 * @param regularHours - Regular hours
 * @returns Regular pay amount
 */
export declare function calculateRegularPay(hourlyRate: number, regularHours: number): number;
/**
 * Calculate overtime pay (1.5x multiplier)
 * @param hourlyRate - Hourly rate
 * @param overtimeHours - Overtime hours
 * @param multiplier - Overtime multiplier (default 1.5)
 * @returns Overtime pay amount
 */
export declare function calculateOvertimePay(hourlyRate: number, overtimeHours: number, multiplier?: number): number;
/**
 * Calculate bonus pay
 * @param basePay - Base pay amount
 * @param bonusPercentage - Bonus percentage
 * @returns Bonus amount
 */
export declare function calculateBonusPay(basePay: number, bonusPercentage: number): number;
/**
 * Calculate commission pay
 * @param salesAmount - Total sales amount
 * @param commissionRate - Commission rate percentage
 * @returns Commission amount
 */
export declare function calculateCommissionPay(salesAmount: number, commissionRate: number): number;
/**
 * Calculate federal tax withholding
 * @param grossPay - Gross pay amount
 * @param taxRate - Federal tax rate
 * @returns Federal withholding amount
 */
export declare function calculateFederalTaxWithholding(grossPay: number, taxRate: number): number;
/**
 * Calculate benefits deduction
 * @param grossPay - Gross pay amount
 * @param benefitTypes - Array of benefit deductions
 * @returns Total benefits deduction
 */
export declare function calculateBenefitsDeduction(grossPay: number, benefitTypes: BenefitDeduction[]): number;
/**
 * Calculate garnishment deduction
 * @param grossPay - Gross pay amount
 * @param garnishments - Array of garnishments
 * @returns Total garnishment amount
 */
export declare function calculateGarnishmentDeduction(grossPay: number, garnishments: Garnishment[]): number;
/**
 * Calculate voluntary deduction
 * @param grossPay - Gross pay amount
 * @param deductionAmount - Deduction amount
 * @returns Adjusted deduction (capped at 50% of gross pay)
 */
export declare function calculateVoluntaryDeduction(grossPay: number, deductionAmount: number): number;
/**
 * Calculate net pay
 * @param grossPay - Gross pay amount
 * @param totalDeductions - Total deductions
 * @returns Net pay amount
 */
export declare function calculateNetPay(grossPay: number, totalDeductions: number): number;
/**
 * Configure direct deposit
 * @param employeeId - Employee ID
 * @param bankName - Bank name
 * @param accountNumber - Account number (last 4 digits only)
 * @param routingNumber - Routing number
 * @returns Direct deposit configuration
 */
export declare function configureDirectDeposit(employeeId: string, bankName: string, accountNumber: string, routingNumber: string): {
    employeeId: string;
    method: 'direct-deposit';
    bank: string;
};
/**
 * Configure check payment
 * @param employeeId - Employee ID
 * @returns Check payment configuration
 */
export declare function configureCheckPayment(employeeId: string): {
    employeeId: string;
    method: 'check';
};
/**
 * Configure pay card payment
 * @param employeeId - Employee ID
 * @param cardLastFour - Last 4 digits of pay card
 * @returns Pay card configuration
 */
export declare function configurePayCardPayment(employeeId: string, cardLastFour: string): {
    employeeId: string;
    method: 'pay-card';
    card: string;
};
/**
 * Calculate federal income tax
 * @param grossPay - Gross pay amount
 * @param filingStatus - Tax filing status
 * @returns Federal income tax amount
 */
export declare function calculateFederalIncomeTax(grossPay: number, filingStatus: string): number;
/**
 * Calculate state income tax
 * @param grossPay - Gross pay amount
 * @param stateCode - State code (e.g., "CA", "NY")
 * @returns State income tax amount
 */
export declare function calculateStateIncomeTax(grossPay: number, stateCode: string): number;
/**
 * Calculate local income tax
 * @param grossPay - Gross pay amount
 * @param localCode - Local jurisdiction code
 * @returns Local income tax amount
 */
export declare function calculateLocalIncomeTax(grossPay: number, localCode: string): number;
/**
 * Calculate FICA taxes (Social Security + Medicare)
 * @param grossPay - Gross pay amount
 * @returns FICA tax amount (15.3% total: 12.4% SS + 2.9% Medicare)
 */
export declare function calculateFicaTaxes(grossPay: number): number;
/**
 * Calculate health insurance deduction
 * @param employeeId - Employee ID
 * @param planCode - Health insurance plan code
 * @param employerContribution - Employer contribution amount
 * @returns Health insurance deduction
 */
export declare function calculateHealthInsuranceDeduction(employeeId: string, planCode: string, employerContribution: number): number;
/**
 * Calculate retirement contribution (401k)
 * @param grossPay - Gross pay amount
 * @param contributionPercentage - Employee contribution percentage
 * @returns Retirement contribution amount
 */
export declare function calculateRetirementContribution(grossPay: number, contributionPercentage: number): number;
/**
 * Calculate FSA deduction
 * @param employeeId - Employee ID
 * @param annualAmount - Annual FSA election amount
 * @param payPeriodsPerYear - Number of pay periods per year
 * @returns FSA deduction per paycheck
 */
export declare function calculateFsaDeduction(employeeId: string, annualAmount: number, payPeriodsPerYear?: number): number;
/**
 * Calculate other benefits deduction
 * @param benefitType - Type of benefit
 * @param amount - Benefit amount
 * @returns Benefits deduction
 */
export declare function calculateOtherBenefitsDeduction(benefitType: string, amount: number): number;
/**
 * Calculate wage garnishment
 * @param grossPay - Gross pay amount
 * @param garnishmentAmount - Garnishment order amount
 * @returns Garnishment deduction (25% cap)
 */
export declare function calculateWageGarnishment(grossPay: number, garnishmentAmount: number): number;
/**
 * Calculate child support garnishment
 * @param grossPay - Gross pay amount
 * @param childSupportAmount - Court-ordered support amount
 * @returns Child support deduction
 */
export declare function calculateChildSupportGarnishment(grossPay: number, childSupportAmount: number): number;
/**
 * Calculate tax levy garnishment
 * @param grossPay - Gross pay amount
 * @param taxLevyAmount - IRS tax levy amount
 * @returns Tax levy deduction (can exceed 25% cap)
 */
export declare function calculateTaxLevyGarnishment(grossPay: number, taxLevyAmount: number): number;
/**
 * Process garnishment application
 * @param employeeId - Employee ID
 * @param garnishment - Garnishment details
 * @returns Processed garnishment
 */
export declare function processGarnishmentApplication(employeeId: string, garnishment: Omit<Garnishment, 'id' | 'employeeId'>): Garnishment;
/**
 * Validate payroll batch
 * @param batch - Payroll batch to validate
 * @returns Validation result
 */
export declare function validatePayrollBatch(batch: PayrollBatch): {
    valid: boolean;
    errors: string[];
};
/**
 * Process payroll batch
 * @param batchId - Batch ID
 * @param paychecks - Paychecks to process
 * @returns Processed batch
 */
export declare function processPayrollBatch(batchId: string, paychecks: Paycheck[]): PayrollBatch;
/**
 * Approve payroll batch
 * @param batchId - Batch ID
 * @param approverName - Name of approver
 * @returns Approved batch status
 */
export declare function approvePayrollBatch(batchId: string, approverName: string): {
    batchId: string;
    status: 'approved';
    approvedBy: string;
};
/**
 * Disburse payroll
 * @param batchId - Batch ID
 * @param paymentMethod - Payment method (dd, check, card)
 * @returns Disbursement status
 */
export declare function disbursePayroll(batchId: string, paymentMethod: string): {
    batchId: string;
    status: 'disbursed';
    method: string;
    timestamp: Date;
};
/**
 * Generate pay stub
 * @param employeeId - Employee ID
 * @param paycheck - Paycheck data
 * @returns Pay stub document
 */
export declare function generatePayStub(employeeId: string, paycheck: Paycheck): {
    employeeId: string;
    document: string;
    generatedDate: Date;
};
/**
 * Generate W2 form
 * @param employeeId - Employee ID
 * @param taxYear - Tax year
 * @param totalWages - Total wages for year
 * @param totalTaxesWithheld - Total taxes withheld
 * @returns W2 form
 */
export declare function generateW2Form(employeeId: string, taxYear: number, totalWages: number, totalTaxesWithheld: number): TaxForm & {
    wages: number;
    taxes: number;
};
/**
 * Generate 941 form (quarterly payroll tax report)
 * @param quarter - Quarter (1-4)
 * @param taxYear - Tax year
 * @param totalWages - Total wages for quarter
 * @param totalTaxesWithheld - Total taxes withheld
 * @returns 941 form
 */
export declare function generate941Form(quarter: number, taxYear: number, totalWages: number, totalTaxesWithheld: number): TaxForm & {
    quarter: number;
    wages: number;
    taxes: number;
};
/**
 * Generate year-end payroll report
 * @param taxYear - Tax year
 * @param employeeCount - Total employees processed
 * @param totalPayroll - Total payroll amount
 * @returns Year-end report
 */
export declare function generateYearEndReport(taxYear: number, employeeCount: number, totalPayroll: number): {
    reportType: string;
    taxYear: number;
    employeeCount: number;
    totalPayroll: number;
    generatedDate: Date;
};
export type { Employee, Compensation, TimeEntry, Paycheck, TaxWithholding, BenefitDeduction, Garnishment, PayrollBatch, TaxForm, };
//# sourceMappingURL=payroll-processing-kit.d.ts.map
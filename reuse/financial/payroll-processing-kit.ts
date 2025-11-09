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

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

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

// ============================================================================
// 1-4: EMPLOYEE SETUP FUNCTIONS
// ============================================================================

/**
 * Create new employee record
 * @param employee - Employee data
 * @returns Created employee
 */
export function createEmployee(employee: Employee): Employee {
  return {
    ...employee,
    id: `EMP-${Date.now()}`,
    status: 'active',
  };
}

/**
 * Update employee information
 * @param employeeId - Employee ID
 * @param updates - Fields to update
 * @returns Updated employee
 */
export function updateEmployee(
  employeeId: string,
  updates: Partial<Employee>,
): Employee {
  return {
    id: employeeId,
    ...updates,
  } as Employee;
}

/**
 * Set employee compensation
 * @param employeeId - Employee ID
 * @param compensation - Compensation details
 * @returns Compensation record
 */
export function setEmployeeCompensation(
  employeeId: string,
  compensation: Omit<Compensation, 'employeeId'>,
): Compensation {
  return {
    employeeId,
    ...compensation,
  };
}

/**
 * Deactivate employee
 * @param employeeId - Employee ID
 * @param terminationDate - Last day of work
 * @returns Deactivated employee
 */
export function deactivateEmployee(
  employeeId: string,
  terminationDate: Date,
): Employee {
  return {
    id: employeeId,
    firstName: '',
    lastName: '',
    email: '',
    ssn: '',
    status: 'terminated',
    hireDate: new Date(),
    terminationDate,
    department: '',
    position: '',
  };
}

// ============================================================================
// 5-8: TIME TRACKING FUNCTIONS
// ============================================================================

/**
 * Record time entry
 * @param employeeId - Employee ID
 * @param date - Work date
 * @param regularHours - Regular hours worked
 * @param overtimeHours - Overtime hours worked
 * @returns Time entry record
 */
export function recordTimeEntry(
  employeeId: string,
  date: Date,
  regularHours: number,
  overtimeHours: number,
): TimeEntry {
  return {
    id: `TIM-${Date.now()}`,
    employeeId,
    date,
    regularHours,
    overtimeHours,
    status: 'pending',
  };
}

/**
 * Approve timesheet
 * @param timeEntryId - Time entry ID
 * @returns Approved time entry
 */
export function approveTimesheet(timeEntryId: string): TimeEntry {
  return {
    id: timeEntryId,
    employeeId: '',
    date: new Date(),
    regularHours: 0,
    overtimeHours: 0,
    status: 'approved',
  };
}

/**
 * Calculate overtime hours
 * @param regularHours - Regular hours worked
 * @param hoursThreshold - Threshold for overtime (default 40)
 * @returns Overtime hours
 */
export function calculateOvertimeHours(
  regularHours: number,
  hoursThreshold: number = 40,
): number {
  return Math.max(0, regularHours - hoursThreshold);
}

/**
 * Import time entries from external source
 * @param entries - Array of time entries
 * @returns Imported entries with IDs
 */
export function importTimeEntries(
  entries: Omit<TimeEntry, 'id' | 'status'>[],
): TimeEntry[] {
  return entries.map((e) => ({
    ...e,
    id: `TIM-${Date.now()}-${Math.random()}`,
    status: 'pending',
  }));
}

// ============================================================================
// 9-12: GROSS PAY FUNCTIONS
// ============================================================================

/**
 * Calculate regular pay
 * @param hourlyRate - Hourly rate
 * @param regularHours - Regular hours
 * @returns Regular pay amount
 */
export function calculateRegularPay(
  hourlyRate: number,
  regularHours: number,
): number {
  return hourlyRate * regularHours;
}

/**
 * Calculate overtime pay (1.5x multiplier)
 * @param hourlyRate - Hourly rate
 * @param overtimeHours - Overtime hours
 * @param multiplier - Overtime multiplier (default 1.5)
 * @returns Overtime pay amount
 */
export function calculateOvertimePay(
  hourlyRate: number,
  overtimeHours: number,
  multiplier: number = 1.5,
): number {
  return hourlyRate * overtimeHours * multiplier;
}

/**
 * Calculate bonus pay
 * @param basePay - Base pay amount
 * @param bonusPercentage - Bonus percentage
 * @returns Bonus amount
 */
export function calculateBonusPay(
  basePay: number,
  bonusPercentage: number,
): number {
  return basePay * (bonusPercentage / 100);
}

/**
 * Calculate commission pay
 * @param salesAmount - Total sales amount
 * @param commissionRate - Commission rate percentage
 * @returns Commission amount
 */
export function calculateCommissionPay(
  salesAmount: number,
  commissionRate: number,
): number {
  return salesAmount * (commissionRate / 100);
}

// ============================================================================
// 13-16: DEDUCTION FUNCTIONS
// ============================================================================

/**
 * Calculate federal tax withholding
 * @param grossPay - Gross pay amount
 * @param taxRate - Federal tax rate
 * @returns Federal withholding amount
 */
export function calculateFederalTaxWithholding(
  grossPay: number,
  taxRate: number,
): number {
  return grossPay * taxRate;
}

/**
 * Calculate benefits deduction
 * @param grossPay - Gross pay amount
 * @param benefitTypes - Array of benefit deductions
 * @returns Total benefits deduction
 */
export function calculateBenefitsDeduction(
  grossPay: number,
  benefitTypes: BenefitDeduction[],
): number {
  return benefitTypes.reduce((sum, b) => sum + b.amount, 0);
}

/**
 * Calculate garnishment deduction
 * @param grossPay - Gross pay amount
 * @param garnishments - Array of garnishments
 * @returns Total garnishment amount
 */
export function calculateGarnishmentDeduction(
  grossPay: number,
  garnishments: Garnishment[],
): number {
  const totalRequired = garnishments.reduce((sum, g) => sum + g.amount, 0);
  return Math.min(totalRequired, grossPay * 0.25); // 25% cap per law
}

/**
 * Calculate voluntary deduction
 * @param grossPay - Gross pay amount
 * @param deductionAmount - Deduction amount
 * @returns Adjusted deduction (capped at 50% of gross pay)
 */
export function calculateVoluntaryDeduction(
  grossPay: number,
  deductionAmount: number,
): number {
  return Math.min(deductionAmount, grossPay * 0.5);
}

// ============================================================================
// 17-20: NET PAY FUNCTIONS
// ============================================================================

/**
 * Calculate net pay
 * @param grossPay - Gross pay amount
 * @param totalDeductions - Total deductions
 * @returns Net pay amount
 */
export function calculateNetPay(
  grossPay: number,
  totalDeductions: number,
): number {
  return Math.max(0, grossPay - totalDeductions);
}

/**
 * Configure direct deposit
 * @param employeeId - Employee ID
 * @param bankName - Bank name
 * @param accountNumber - Account number (last 4 digits only)
 * @param routingNumber - Routing number
 * @returns Direct deposit configuration
 */
export function configureDirectDeposit(
  employeeId: string,
  bankName: string,
  accountNumber: string,
  routingNumber: string,
): { employeeId: string; method: 'direct-deposit'; bank: string } {
  return {
    employeeId,
    method: 'direct-deposit',
    bank: bankName,
  };
}

/**
 * Configure check payment
 * @param employeeId - Employee ID
 * @returns Check payment configuration
 */
export function configureCheckPayment(employeeId: string): {
  employeeId: string;
  method: 'check';
} {
  return { employeeId, method: 'check' };
}

/**
 * Configure pay card payment
 * @param employeeId - Employee ID
 * @param cardLastFour - Last 4 digits of pay card
 * @returns Pay card configuration
 */
export function configurePayCardPayment(
  employeeId: string,
  cardLastFour: string,
): { employeeId: string; method: 'pay-card'; card: string } {
  return { employeeId, method: 'pay-card', card: cardLastFour };
}

// ============================================================================
// 21-24: TAX CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate federal income tax
 * @param grossPay - Gross pay amount
 * @param filingStatus - Tax filing status
 * @returns Federal income tax amount
 */
export function calculateFederalIncomeTax(
  grossPay: number,
  filingStatus: string,
): number {
  const rates: Record<string, number> = {
    single: 0.12,
    married: 0.1,
    other: 0.115,
  };
  return grossPay * (rates[filingStatus] || rates.other);
}

/**
 * Calculate state income tax
 * @param grossPay - Gross pay amount
 * @param stateCode - State code (e.g., "CA", "NY")
 * @returns State income tax amount
 */
export function calculateStateIncomeTax(
  grossPay: number,
  stateCode: string,
): number {
  const stateRates: Record<string, number> = {
    CA: 0.093,
    NY: 0.0685,
    TX: 0, // No state income tax
    FL: 0, // No state income tax
  };
  return grossPay * (stateRates[stateCode] || 0.05);
}

/**
 * Calculate local income tax
 * @param grossPay - Gross pay amount
 * @param localCode - Local jurisdiction code
 * @returns Local income tax amount
 */
export function calculateLocalIncomeTax(
  grossPay: number,
  localCode: string,
): number {
  // Simplified local tax calculation
  return grossPay * 0.01; // 1% average local tax
}

/**
 * Calculate FICA taxes (Social Security + Medicare)
 * @param grossPay - Gross pay amount
 * @returns FICA tax amount (15.3% total: 12.4% SS + 2.9% Medicare)
 */
export function calculateFicaTaxes(grossPay: number): number {
  return grossPay * 0.153;
}

// ============================================================================
// 25-28: BENEFITS FUNCTIONS
// ============================================================================

/**
 * Calculate health insurance deduction
 * @param employeeId - Employee ID
 * @param planCode - Health insurance plan code
 * @param employerContribution - Employer contribution amount
 * @returns Health insurance deduction
 */
export function calculateHealthInsuranceDeduction(
  employeeId: string,
  planCode: string,
  employerContribution: number,
): number {
  const planCosts: Record<string, number> = {
    basic: 350,
    standard: 550,
    premium: 850,
  };
  const monthlyCost = planCosts[planCode] || 500;
  return Math.max(0, monthlyCost - employerContribution);
}

/**
 * Calculate retirement contribution (401k)
 * @param grossPay - Gross pay amount
 * @param contributionPercentage - Employee contribution percentage
 * @returns Retirement contribution amount
 */
export function calculateRetirementContribution(
  grossPay: number,
  contributionPercentage: number,
): number {
  const contribution = grossPay * (contributionPercentage / 100);
  return Math.min(contribution, 23500 / 26); // Annual max / pay periods
}

/**
 * Calculate FSA deduction
 * @param employeeId - Employee ID
 * @param annualAmount - Annual FSA election amount
 * @param payPeriodsPerYear - Number of pay periods per year
 * @returns FSA deduction per paycheck
 */
export function calculateFsaDeduction(
  employeeId: string,
  annualAmount: number,
  payPeriodsPerYear: number = 26,
): number {
  return annualAmount / payPeriodsPerYear;
}

/**
 * Calculate other benefits deduction
 * @param benefitType - Type of benefit
 * @param amount - Benefit amount
 * @returns Benefits deduction
 */
export function calculateOtherBenefitsDeduction(
  benefitType: string,
  amount: number,
): number {
  return amount;
}

// ============================================================================
// 29-32: GARNISHMENT FUNCTIONS
// ============================================================================

/**
 * Calculate wage garnishment
 * @param grossPay - Gross pay amount
 * @param garnishmentAmount - Garnishment order amount
 * @returns Garnishment deduction (25% cap)
 */
export function calculateWageGarnishment(
  grossPay: number,
  garnishmentAmount: number,
): number {
  return Math.min(garnishmentAmount, grossPay * 0.25);
}

/**
 * Calculate child support garnishment
 * @param grossPay - Gross pay amount
 * @param childSupportAmount - Court-ordered support amount
 * @returns Child support deduction
 */
export function calculateChildSupportGarnishment(
  grossPay: number,
  childSupportAmount: number,
): number {
  return Math.min(childSupportAmount, grossPay * 0.5); // Higher limit for child support
}

/**
 * Calculate tax levy garnishment
 * @param grossPay - Gross pay amount
 * @param taxLevyAmount - IRS tax levy amount
 * @returns Tax levy deduction (can exceed 25% cap)
 */
export function calculateTaxLevyGarnishment(
  grossPay: number,
  taxLevyAmount: number,
): number {
  return Math.min(taxLevyAmount, grossPay * 0.8); // 80% max for tax levy
}

/**
 * Process garnishment application
 * @param employeeId - Employee ID
 * @param garnishment - Garnishment details
 * @returns Processed garnishment
 */
export function processGarnishmentApplication(
  employeeId: string,
  garnishment: Omit<Garnishment, 'id' | 'employeeId'>,
): Garnishment {
  return {
    ...garnishment,
    id: `GAR-${Date.now()}`,
    employeeId,
  };
}

// ============================================================================
// 33-36: PAYROLL PROCESSING FUNCTIONS
// ============================================================================

/**
 * Validate payroll batch
 * @param batch - Payroll batch to validate
 * @returns Validation result
 */
export function validatePayrollBatch(
  batch: PayrollBatch,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (batch.totalEmployees === 0) errors.push('No employees in batch');
  if (batch.totalGrossPay <= 0) errors.push('Invalid gross pay total');
  if (batch.payPeriodEnd <= batch.payPeriodStart) {
    errors.push('Invalid pay period dates');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Process payroll batch
 * @param batchId - Batch ID
 * @param paychecks - Paychecks to process
 * @returns Processed batch
 */
export function processPayrollBatch(
  batchId: string,
  paychecks: Paycheck[],
): PayrollBatch {
  const totalGrossPay = paychecks.reduce((sum, p) => sum + p.grossPay, 0);
  const totalDeductions = paychecks.reduce((sum, p) => sum + p.deductions, 0);
  const totalNetPay = paychecks.reduce((sum, p) => sum + p.netPay, 0);

  return {
    id: batchId,
    batchDate: new Date(),
    payPeriodStart: paychecks[0]?.periodStart || new Date(),
    payPeriodEnd: paychecks[0]?.periodEnd || new Date(),
    status: 'processed',
    totalEmployees: paychecks.length,
    totalGrossPay,
    totalDeductions,
    totalNetPay,
  };
}

/**
 * Approve payroll batch
 * @param batchId - Batch ID
 * @param approverName - Name of approver
 * @returns Approved batch status
 */
export function approvePayrollBatch(
  batchId: string,
  approverName: string,
): { batchId: string; status: 'approved'; approvedBy: string } {
  return { batchId, status: 'approved', approvedBy: approverName };
}

/**
 * Disburse payroll
 * @param batchId - Batch ID
 * @param paymentMethod - Payment method (dd, check, card)
 * @returns Disbursement status
 */
export function disbursePayroll(
  batchId: string,
  paymentMethod: string,
): { batchId: string; status: 'disbursed'; method: string; timestamp: Date } {
  return {
    batchId,
    status: 'disbursed',
    method: paymentMethod,
    timestamp: new Date(),
  };
}

// ============================================================================
// 37-40: REPORTING FUNCTIONS
// ============================================================================

/**
 * Generate pay stub
 * @param employeeId - Employee ID
 * @param paycheck - Paycheck data
 * @returns Pay stub document
 */
export function generatePayStub(
  employeeId: string,
  paycheck: Paycheck,
): { employeeId: string; document: string; generatedDate: Date } {
  const stub = `
    PAY STUB - ${paycheck.id}
    Period: ${paycheck.periodStart.toLocaleDateString()} - ${paycheck.periodEnd.toLocaleDateString()}
    Gross Pay: $${paycheck.grossPay.toFixed(2)}
    Deductions: $${paycheck.deductions.toFixed(2)}
    Net Pay: $${paycheck.netPay.toFixed(2)}
  `;
  return {
    employeeId,
    document: stub,
    generatedDate: new Date(),
  };
}

/**
 * Generate W2 form
 * @param employeeId - Employee ID
 * @param taxYear - Tax year
 * @param totalWages - Total wages for year
 * @param totalTaxesWithheld - Total taxes withheld
 * @returns W2 form
 */
export function generateW2Form(
  employeeId: string,
  taxYear: number,
  totalWages: number,
  totalTaxesWithheld: number,
): TaxForm & { wages: number; taxes: number } {
  return {
    type: 'W2',
    taxYear,
    generatedDate: new Date(),
    employeeId,
    wages: totalWages,
    taxes: totalTaxesWithheld,
  };
}

/**
 * Generate 941 form (quarterly payroll tax report)
 * @param quarter - Quarter (1-4)
 * @param taxYear - Tax year
 * @param totalWages - Total wages for quarter
 * @param totalTaxesWithheld - Total taxes withheld
 * @returns 941 form
 */
export function generate941Form(
  quarter: number,
  taxYear: number,
  totalWages: number,
  totalTaxesWithheld: number,
): TaxForm & { quarter: number; wages: number; taxes: number } {
  return {
    type: '941',
    taxYear,
    generatedDate: new Date(),
    quarter,
    wages: totalWages,
    taxes: totalTaxesWithheld,
  };
}

/**
 * Generate year-end payroll report
 * @param taxYear - Tax year
 * @param employeeCount - Total employees processed
 * @param totalPayroll - Total payroll amount
 * @returns Year-end report
 */
export function generateYearEndReport(
  taxYear: number,
  employeeCount: number,
  totalPayroll: number,
): {
  reportType: string;
  taxYear: number;
  employeeCount: number;
  totalPayroll: number;
  generatedDate: Date;
} {
  return {
    reportType: 'year-end-payroll',
    taxYear,
    employeeCount,
    totalPayroll,
    generatedDate: new Date(),
  };
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type {
  Employee,
  Compensation,
  TimeEntry,
  Paycheck,
  TaxWithholding,
  BenefitDeduction,
  Garnishment,
  PayrollBatch,
  TaxForm,
};

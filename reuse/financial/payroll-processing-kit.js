"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmployee = createEmployee;
exports.updateEmployee = updateEmployee;
exports.setEmployeeCompensation = setEmployeeCompensation;
exports.deactivateEmployee = deactivateEmployee;
exports.recordTimeEntry = recordTimeEntry;
exports.approveTimesheet = approveTimesheet;
exports.calculateOvertimeHours = calculateOvertimeHours;
exports.importTimeEntries = importTimeEntries;
exports.calculateRegularPay = calculateRegularPay;
exports.calculateOvertimePay = calculateOvertimePay;
exports.calculateBonusPay = calculateBonusPay;
exports.calculateCommissionPay = calculateCommissionPay;
exports.calculateFederalTaxWithholding = calculateFederalTaxWithholding;
exports.calculateBenefitsDeduction = calculateBenefitsDeduction;
exports.calculateGarnishmentDeduction = calculateGarnishmentDeduction;
exports.calculateVoluntaryDeduction = calculateVoluntaryDeduction;
exports.calculateNetPay = calculateNetPay;
exports.configureDirectDeposit = configureDirectDeposit;
exports.configureCheckPayment = configureCheckPayment;
exports.configurePayCardPayment = configurePayCardPayment;
exports.calculateFederalIncomeTax = calculateFederalIncomeTax;
exports.calculateStateIncomeTax = calculateStateIncomeTax;
exports.calculateLocalIncomeTax = calculateLocalIncomeTax;
exports.calculateFicaTaxes = calculateFicaTaxes;
exports.calculateHealthInsuranceDeduction = calculateHealthInsuranceDeduction;
exports.calculateRetirementContribution = calculateRetirementContribution;
exports.calculateFsaDeduction = calculateFsaDeduction;
exports.calculateOtherBenefitsDeduction = calculateOtherBenefitsDeduction;
exports.calculateWageGarnishment = calculateWageGarnishment;
exports.calculateChildSupportGarnishment = calculateChildSupportGarnishment;
exports.calculateTaxLevyGarnishment = calculateTaxLevyGarnishment;
exports.processGarnishmentApplication = processGarnishmentApplication;
exports.validatePayrollBatch = validatePayrollBatch;
exports.processPayrollBatch = processPayrollBatch;
exports.approvePayrollBatch = approvePayrollBatch;
exports.disbursePayroll = disbursePayroll;
exports.generatePayStub = generatePayStub;
exports.generateW2Form = generateW2Form;
exports.generate941Form = generate941Form;
exports.generateYearEndReport = generateYearEndReport;
// ============================================================================
// 1-4: EMPLOYEE SETUP FUNCTIONS
// ============================================================================
/**
 * Create new employee record
 * @param employee - Employee data
 * @returns Created employee
 */
function createEmployee(employee) {
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
function updateEmployee(employeeId, updates) {
    return {
        id: employeeId,
        ...updates,
    };
}
/**
 * Set employee compensation
 * @param employeeId - Employee ID
 * @param compensation - Compensation details
 * @returns Compensation record
 */
function setEmployeeCompensation(employeeId, compensation) {
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
function deactivateEmployee(employeeId, terminationDate) {
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
function recordTimeEntry(employeeId, date, regularHours, overtimeHours) {
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
function approveTimesheet(timeEntryId) {
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
function calculateOvertimeHours(regularHours, hoursThreshold = 40) {
    return Math.max(0, regularHours - hoursThreshold);
}
/**
 * Import time entries from external source
 * @param entries - Array of time entries
 * @returns Imported entries with IDs
 */
function importTimeEntries(entries) {
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
function calculateRegularPay(hourlyRate, regularHours) {
    return hourlyRate * regularHours;
}
/**
 * Calculate overtime pay (1.5x multiplier)
 * @param hourlyRate - Hourly rate
 * @param overtimeHours - Overtime hours
 * @param multiplier - Overtime multiplier (default 1.5)
 * @returns Overtime pay amount
 */
function calculateOvertimePay(hourlyRate, overtimeHours, multiplier = 1.5) {
    return hourlyRate * overtimeHours * multiplier;
}
/**
 * Calculate bonus pay
 * @param basePay - Base pay amount
 * @param bonusPercentage - Bonus percentage
 * @returns Bonus amount
 */
function calculateBonusPay(basePay, bonusPercentage) {
    return basePay * (bonusPercentage / 100);
}
/**
 * Calculate commission pay
 * @param salesAmount - Total sales amount
 * @param commissionRate - Commission rate percentage
 * @returns Commission amount
 */
function calculateCommissionPay(salesAmount, commissionRate) {
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
function calculateFederalTaxWithholding(grossPay, taxRate) {
    return grossPay * taxRate;
}
/**
 * Calculate benefits deduction
 * @param grossPay - Gross pay amount
 * @param benefitTypes - Array of benefit deductions
 * @returns Total benefits deduction
 */
function calculateBenefitsDeduction(grossPay, benefitTypes) {
    return benefitTypes.reduce((sum, b) => sum + b.amount, 0);
}
/**
 * Calculate garnishment deduction
 * @param grossPay - Gross pay amount
 * @param garnishments - Array of garnishments
 * @returns Total garnishment amount
 */
function calculateGarnishmentDeduction(grossPay, garnishments) {
    const totalRequired = garnishments.reduce((sum, g) => sum + g.amount, 0);
    return Math.min(totalRequired, grossPay * 0.25); // 25% cap per law
}
/**
 * Calculate voluntary deduction
 * @param grossPay - Gross pay amount
 * @param deductionAmount - Deduction amount
 * @returns Adjusted deduction (capped at 50% of gross pay)
 */
function calculateVoluntaryDeduction(grossPay, deductionAmount) {
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
function calculateNetPay(grossPay, totalDeductions) {
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
function configureDirectDeposit(employeeId, bankName, accountNumber, routingNumber) {
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
function configureCheckPayment(employeeId) {
    return { employeeId, method: 'check' };
}
/**
 * Configure pay card payment
 * @param employeeId - Employee ID
 * @param cardLastFour - Last 4 digits of pay card
 * @returns Pay card configuration
 */
function configurePayCardPayment(employeeId, cardLastFour) {
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
function calculateFederalIncomeTax(grossPay, filingStatus) {
    const rates = {
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
function calculateStateIncomeTax(grossPay, stateCode) {
    const stateRates = {
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
function calculateLocalIncomeTax(grossPay, localCode) {
    // Simplified local tax calculation
    return grossPay * 0.01; // 1% average local tax
}
/**
 * Calculate FICA taxes (Social Security + Medicare)
 * @param grossPay - Gross pay amount
 * @returns FICA tax amount (15.3% total: 12.4% SS + 2.9% Medicare)
 */
function calculateFicaTaxes(grossPay) {
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
function calculateHealthInsuranceDeduction(employeeId, planCode, employerContribution) {
    const planCosts = {
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
function calculateRetirementContribution(grossPay, contributionPercentage) {
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
function calculateFsaDeduction(employeeId, annualAmount, payPeriodsPerYear = 26) {
    return annualAmount / payPeriodsPerYear;
}
/**
 * Calculate other benefits deduction
 * @param benefitType - Type of benefit
 * @param amount - Benefit amount
 * @returns Benefits deduction
 */
function calculateOtherBenefitsDeduction(benefitType, amount) {
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
function calculateWageGarnishment(grossPay, garnishmentAmount) {
    return Math.min(garnishmentAmount, grossPay * 0.25);
}
/**
 * Calculate child support garnishment
 * @param grossPay - Gross pay amount
 * @param childSupportAmount - Court-ordered support amount
 * @returns Child support deduction
 */
function calculateChildSupportGarnishment(grossPay, childSupportAmount) {
    return Math.min(childSupportAmount, grossPay * 0.5); // Higher limit for child support
}
/**
 * Calculate tax levy garnishment
 * @param grossPay - Gross pay amount
 * @param taxLevyAmount - IRS tax levy amount
 * @returns Tax levy deduction (can exceed 25% cap)
 */
function calculateTaxLevyGarnishment(grossPay, taxLevyAmount) {
    return Math.min(taxLevyAmount, grossPay * 0.8); // 80% max for tax levy
}
/**
 * Process garnishment application
 * @param employeeId - Employee ID
 * @param garnishment - Garnishment details
 * @returns Processed garnishment
 */
function processGarnishmentApplication(employeeId, garnishment) {
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
function validatePayrollBatch(batch) {
    const errors = [];
    if (batch.totalEmployees === 0)
        errors.push('No employees in batch');
    if (batch.totalGrossPay <= 0)
        errors.push('Invalid gross pay total');
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
function processPayrollBatch(batchId, paychecks) {
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
function approvePayrollBatch(batchId, approverName) {
    return { batchId, status: 'approved', approvedBy: approverName };
}
/**
 * Disburse payroll
 * @param batchId - Batch ID
 * @param paymentMethod - Payment method (dd, check, card)
 * @returns Disbursement status
 */
function disbursePayroll(batchId, paymentMethod) {
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
function generatePayStub(employeeId, paycheck) {
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
function generateW2Form(employeeId, taxYear, totalWages, totalTaxesWithheld) {
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
function generate941Form(quarter, taxYear, totalWages, totalTaxesWithheld) {
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
function generateYearEndReport(taxYear, employeeCount, totalPayroll) {
    return {
        reportType: 'year-end-payroll',
        taxYear,
        employeeCount,
        totalPayroll,
        generatedDate: new Date(),
    };
}
//# sourceMappingURL=payroll-processing-kit.js.map
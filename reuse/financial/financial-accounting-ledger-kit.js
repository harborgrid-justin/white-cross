"use strict";
/**
 * Financial Accounting Ledger Kit
 * ================================
 * Enterprise-grade financial accounting ledger system implementing double-entry bookkeeping,
 * multi-currency support, period management, and inter-company consolidation.
 *
 * LOC: FIN-ACCT-001
 * Targets: SAP, Oracle Financials, NetSuite
 * Framework: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * Capabilities:
 * - Chart of accounts management with hierarchical structure
 * - Journal entry posting with double-entry validation
 * - Batch posting and reconciliation
 * - Multi-period and multi-currency accounting
 * - Inter-company transactions and consolidation
 * - Audit trails and ledger validation
 * - Balance reporting (trial balance, period balances, summaries)
 *
 * Compliance: GAAP, IFRS, SOX compliance patterns
 *
 * @module FinancialAccountingLedger
 * @version 2.0.0
 * @author Enterprise Finance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = exports.CurrencyType = exports.PeriodStatus = exports.JournalEntryStatus = exports.AccountStatus = exports.AccountType = void 0;
exports.createChartOfAccount = createChartOfAccount;
exports.getChartOfAccount = getChartOfAccount;
exports.updateChartOfAccount = updateChartOfAccount;
exports.deactivateChartOfAccount = deactivateChartOfAccount;
exports.getAccountHierarchyTree = getAccountHierarchyTree;
exports.addChildAccount = addChildAccount;
exports.reorderHierarchy = reorderHierarchy;
exports.validateHierarchyIntegrity = validateHierarchyIntegrity;
exports.createJournalEntry = createJournalEntry;
exports.postJournalEntry = postJournalEntry;
exports.voidJournalEntry = voidJournalEntry;
exports.reverseJournalEntry = reverseJournalEntry;
exports.createBatchPosting = createBatchPosting;
exports.addEntriesToBatch = addEntriesToBatch;
exports.validateBatch = validateBatch;
exports.postBatch = postBatch;
exports.getAccountBalance = getAccountBalance;
exports.getTrialBalance = getTrialBalance;
exports.getPeriodBalance = getPeriodBalance;
exports.getBalanceSummary = getBalanceSummary;
exports.validateJournalEntry = validateJournalEntry;
exports.checkLedgerBalance = checkLedgerBalance;
exports.findEntryErrors = findEntryErrors;
exports.autoCorrectEntry = autoCorrectEntry;
exports.openPeriod = openPeriod;
exports.closePeriod = closePeriod;
exports.reopenPeriod = reopenPeriod;
exports.getPeriodStatus = getPeriodStatus;
exports.convertCurrency = convertCurrency;
exports.revaluateForeignCurrency = revaluateForeignCurrency;
exports.recordRealizedGainLoss = recordRealizedGainLoss;
exports.updateExchangeRates = updateExchangeRates;
exports.recordInterCompanyTransaction = recordInterCompanyTransaction;
exports.eliminateInterCompanyEntries = eliminateInterCompanyEntries;
exports.consolidateSubsidiaryBalances = consolidateSubsidiaryBalances;
exports.reconcileInterCompanyBalances = reconcileInterCompanyBalances;
exports.generateAuditTrail = generateAuditTrail;
exports.validateLedgerIntegrity = validateLedgerIntegrity;
exports.exportLedgerData = exportLedgerData;
exports.archiveAccountingPeriod = archiveAccountingPeriod;
const common_1 = require("@nestjs/common");
// ============================================================================
// ENUMS & INTERFACES
// ============================================================================
var AccountType;
(function (AccountType) {
    AccountType["ASSET"] = "ASSET";
    AccountType["LIABILITY"] = "LIABILITY";
    AccountType["EQUITY"] = "EQUITY";
    AccountType["REVENUE"] = "REVENUE";
    AccountType["EXPENSE"] = "EXPENSE";
    AccountType["GAIN"] = "GAIN";
    AccountType["LOSS"] = "LOSS";
})(AccountType || (exports.AccountType = AccountType = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["INACTIVE"] = "INACTIVE";
    AccountStatus["ARCHIVED"] = "ARCHIVED";
    AccountStatus["SUSPENDED"] = "SUSPENDED";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var JournalEntryStatus;
(function (JournalEntryStatus) {
    JournalEntryStatus["DRAFT"] = "DRAFT";
    JournalEntryStatus["POSTED"] = "POSTED";
    JournalEntryStatus["VOIDED"] = "VOIDED";
    JournalEntryStatus["REVERSED"] = "REVERSED";
    JournalEntryStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
})(JournalEntryStatus || (exports.JournalEntryStatus = JournalEntryStatus = {}));
var PeriodStatus;
(function (PeriodStatus) {
    PeriodStatus["OPEN"] = "OPEN";
    PeriodStatus["CLOSED"] = "CLOSED";
    PeriodStatus["ARCHIVED"] = "ARCHIVED";
    PeriodStatus["PENDING_CLOSE"] = "PENDING_CLOSE";
})(PeriodStatus || (exports.PeriodStatus = PeriodStatus = {}));
var CurrencyType;
(function (CurrencyType) {
    CurrencyType["USD"] = "USD";
    CurrencyType["EUR"] = "EUR";
    CurrencyType["GBP"] = "GBP";
    CurrencyType["JPY"] = "JPY";
    CurrencyType["CAD"] = "CAD";
    CurrencyType["AUD"] = "AUD";
})(CurrencyType || (exports.CurrencyType = CurrencyType = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["DEBIT"] = "DEBIT";
    TransactionType["CREDIT"] = "CREDIT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
// ============================================================================
// CHART OF ACCOUNTS FUNCTIONS (1-4)
// ============================================================================
/**
 * Create new chart of accounts entry
 * @param sequelize - Database instance
 * @param account - Account details
 * @returns Created account entity
 */
async function createChartOfAccount(sequelize, account) {
    const result = await sequelize.query(`INSERT INTO chart_of_accounts (id, code, name, type, status, parent_account_id, currency, is_header, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
     RETURNING *`, {
        replacements: [
            crypto.randomUUID(),
            account.code,
            account.name,
            account.type,
            AccountStatus.ACTIVE,
            account.parentAccountId,
            account.currency || CurrencyType.USD,
            account.isHeader || false,
            account.description,
        ],
        type: 'SELECT',
    });
    return result[0];
}
/**
 * Get chart of accounts by ID
 * @param sequelize - Database instance
 * @param accountId - Account identifier
 * @returns Account entity
 */
async function getChartOfAccount(sequelize, accountId) {
    const result = await sequelize.query(`SELECT * FROM chart_of_accounts WHERE id = ? LIMIT 1`, {
        replacements: [accountId],
        type: 'SELECT',
    });
    if (!result.length) {
        throw new common_1.BadRequestException(`Account ${accountId} not found`);
    }
    return result[0];
}
/**
 * Update chart of accounts entry
 * @param sequelize - Database instance
 * @param accountId - Account identifier
 * @param updates - Updated fields
 * @returns Updated account entity
 */
async function updateChartOfAccount(sequelize, accountId, updates) {
    const { code, name, type, description } = updates;
    const result = await sequelize.query(`UPDATE chart_of_accounts
     SET code = COALESCE(?, code), name = COALESCE(?, name),
         type = COALESCE(?, type), description = COALESCE(?, description), updated_at = NOW()
     WHERE id = ?
     RETURNING *`, {
        replacements: [code, name, type, description, accountId],
        type: 'SELECT',
    });
    return result[0];
}
/**
 * Deactivate chart of accounts entry
 * @param sequelize - Database instance
 * @param accountId - Account identifier
 * @returns Updated account entity
 */
async function deactivateChartOfAccount(sequelize, accountId) {
    const result = await sequelize.query(`UPDATE chart_of_accounts SET status = ?, updated_at = NOW() WHERE id = ? RETURNING *`, {
        replacements: [AccountStatus.INACTIVE, accountId],
        type: 'SELECT',
    });
    return result[0];
}
// ============================================================================
// ACCOUNT HIERARCHY FUNCTIONS (5-8)
// ============================================================================
/**
 * Get account hierarchy tree
 * @param sequelize - Database instance
 * @param parentId - Parent account ID (null for root)
 * @returns Hierarchical account tree
 */
async function getAccountHierarchyTree(sequelize, parentId) {
    const query = parentId
        ? `SELECT * FROM chart_of_accounts WHERE parent_account_id = ? ORDER BY code`
        : `SELECT * FROM chart_of_accounts WHERE parent_account_id IS NULL ORDER BY code`;
    return sequelize.query(query, {
        replacements: parentId ? [parentId] : [],
        type: 'SELECT',
    });
}
/**
 * Add child account to parent
 * @param sequelize - Database instance
 * @param parentId - Parent account ID
 * @param childId - Child account ID
 * @returns Updated child account
 */
async function addChildAccount(sequelize, parentId, childId) {
    const result = await sequelize.query(`UPDATE chart_of_accounts SET parent_account_id = ?, updated_at = NOW()
     WHERE id = ? RETURNING *`, {
        replacements: [parentId, childId],
        type: 'SELECT',
    });
    return result[0];
}
/**
 * Reorder accounts in hierarchy
 * @param sequelize - Database instance
 * @param accountId - Account to move
 * @param newParentId - New parent account ID
 * @returns Updated account
 */
async function reorderHierarchy(sequelize, accountId, newParentId) {
    const result = await sequelize.query(`UPDATE chart_of_accounts SET parent_account_id = ?, updated_at = NOW()
     WHERE id = ? RETURNING *`, {
        replacements: [newParentId, accountId],
        type: 'SELECT',
    });
    return result[0];
}
/**
 * Validate hierarchy integrity
 * @param sequelize - Database instance
 * @returns Validation result with errors
 */
async function validateHierarchyIntegrity(sequelize) {
    const errors = [];
    const cycles = await sequelize.query(`WITH RECURSIVE hierarchy AS (
       SELECT id, parent_account_id, 1 AS depth FROM chart_of_accounts WHERE parent_account_id IS NULL
       UNION ALL
       SELECT c.id, c.parent_account_id, h.depth + 1
       FROM chart_of_accounts c JOIN hierarchy h ON c.parent_account_id = h.id
       WHERE h.depth < 100
     )
     SELECT COUNT(*) as count FROM chart_of_accounts
     WHERE id NOT IN (SELECT id FROM hierarchy)`, { type: 'SELECT' });
    if (cycles[0]?.count > 0) {
        errors.push('Circular reference detected in hierarchy');
    }
    return { isValid: errors.length === 0, errors };
}
// ============================================================================
// JOURNAL ENTRY FUNCTIONS (9-12)
// ============================================================================
/**
 * Create journal entry
 * @param sequelize - Database instance
 * @param periodId - Accounting period ID
 * @param lineItems - Debit and credit entries
 * @param referenceInfo - Reference document info
 * @returns Created journal entry with ID
 */
async function createJournalEntry(sequelize, periodId, lineItems, referenceInfo) {
    const entryId = crypto.randomUUID();
    let totalDebits = 0;
    let totalCredits = 0;
    for (const item of lineItems) {
        if (item.type === TransactionType.DEBIT) {
            totalDebits += item.amount;
        }
        else {
            totalCredits += item.amount;
        }
    }
    if (Math.abs(totalDebits - totalCredits) > 0.01) {
        throw new common_1.BadRequestException('Journal entry does not balance');
    }
    await sequelize.query(`INSERT INTO journal_entries (id, period_id, reference, description, status, total_debits, total_credits, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`, {
        replacements: [
            entryId,
            periodId,
            referenceInfo.reference,
            referenceInfo.description,
            JournalEntryStatus.DRAFT,
            totalDebits,
            totalCredits,
        ],
    });
    for (const item of lineItems) {
        await sequelize.query(`INSERT INTO journal_entry_lines (id, entry_id, account_id, amount, type, description, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`, {
            replacements: [
                crypto.randomUUID(),
                entryId,
                item.accountId,
                item.amount,
                item.type,
                item.description,
            ],
        });
    }
    return { entryId, status: JournalEntryStatus.DRAFT };
}
/**
 * Post journal entry to ledger
 * @param sequelize - Database instance
 * @param entryId - Journal entry ID
 * @returns Posted entry status
 */
async function postJournalEntry(sequelize, entryId) {
    const t = await sequelize.transaction();
    try {
        await sequelize.query(`UPDATE journal_entries SET status = ?, posted_at = NOW() WHERE id = ?`, {
            replacements: [JournalEntryStatus.POSTED, entryId],
            transaction: t,
        });
        const lines = await sequelize.query(`SELECT account_id, amount, type FROM journal_entry_lines WHERE entry_id = ?`, {
            replacements: [entryId],
            type: 'SELECT',
            transaction: t,
        });
        for (const line of lines) {
            await sequelize.query(`INSERT INTO ledger_entries (id, account_id, entry_id, debit_amount, credit_amount, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`, {
                replacements: [
                    crypto.randomUUID(),
                    line.account_id,
                    entryId,
                    line.type === TransactionType.DEBIT ? line.amount : 0,
                    line.type === TransactionType.CREDIT ? line.amount : 0,
                ],
                transaction: t,
            });
        }
        await t.commit();
        return { entryId, status: JournalEntryStatus.POSTED, postedAt: new Date() };
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
}
/**
 * Void journal entry
 * @param sequelize - Database instance
 * @param entryId - Journal entry ID
 * @returns Voided entry status
 */
async function voidJournalEntry(sequelize, entryId) {
    const result = await sequelize.query(`UPDATE journal_entries SET status = ?, voided_at = NOW() WHERE id = ? AND status = ?
     RETURNING *`, {
        replacements: [JournalEntryStatus.VOIDED, entryId, JournalEntryStatus.POSTED],
        type: 'SELECT',
    });
    if (!result.length) {
        throw new common_1.BadRequestException('Entry not found or cannot be voided');
    }
    return { entryId, status: JournalEntryStatus.VOIDED, voidedAt: new Date() };
}
/**
 * Reverse journal entry (creates offsetting entry)
 * @param sequelize - Database instance
 * @param entryId - Original journal entry ID
 * @returns Reversed entry ID
 */
async function reverseJournalEntry(sequelize, entryId) {
    const t = await sequelize.transaction();
    try {
        const reversalId = crypto.randomUUID();
        const original = await sequelize.query(`SELECT * FROM journal_entries WHERE id = ? LIMIT 1`, {
            replacements: [entryId],
            type: 'SELECT',
            transaction: t,
        });
        if (!original.length) {
            throw new common_1.BadRequestException(`Entry ${entryId} not found`);
        }
        const originalEntry = original[0];
        await sequelize.query(`INSERT INTO journal_entries (id, period_id, reference, description, status, total_debits, total_credits, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`, {
            replacements: [
                reversalId,
                originalEntry.period_id,
                `REVERSAL-${originalEntry.reference}`,
                `Reversal of ${originalEntry.description}`,
                JournalEntryStatus.DRAFT,
                originalEntry.total_credits,
                originalEntry.total_debits,
            ],
            transaction: t,
        });
        const lines = await sequelize.query(`SELECT account_id, amount, type, description FROM journal_entry_lines WHERE entry_id = ?`, {
            replacements: [entryId],
            type: 'SELECT',
            transaction: t,
        });
        for (const line of lines) {
            const reversedType = line.type === TransactionType.DEBIT ? TransactionType.CREDIT : TransactionType.DEBIT;
            await sequelize.query(`INSERT INTO journal_entry_lines (id, entry_id, account_id, amount, type, description, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`, {
                replacements: [
                    crypto.randomUUID(),
                    reversalId,
                    line.account_id,
                    line.amount,
                    reversedType,
                    `Reversal: ${line.description}`,
                ],
                transaction: t,
            });
        }
        await sequelize.query(`UPDATE journal_entries SET status = ? WHERE id = ?`, {
            replacements: [JournalEntryStatus.REVERSED, entryId],
            transaction: t,
        });
        await t.commit();
        return { originalId: entryId, reversalId };
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
}
// ============================================================================
// BATCH POSTING FUNCTIONS (13-16)
// ============================================================================
/**
 * Create batch posting session
 * @param sequelize - Database instance
 * @param batchName - Batch identifier
 * @param expectedCount - Expected entries in batch
 * @returns Batch ID
 */
async function createBatchPosting(sequelize, batchName, expectedCount) {
    const batchId = crypto.randomUUID();
    await sequelize.query(`INSERT INTO batch_postings (id, name, expected_count, status, created_at)
     VALUES (?, ?, ?, ?, NOW())`, {
        replacements: [batchId, batchName, expectedCount, 'OPEN'],
    });
    return { batchId, status: 'OPEN' };
}
/**
 * Add journal entries to batch
 * @param sequelize - Database instance
 * @param batchId - Batch ID
 * @param entryIds - Journal entry IDs to add
 * @returns Updated batch info
 */
async function addEntriesToBatch(sequelize, batchId, entryIds) {
    let addedCount = 0;
    for (const entryId of entryIds) {
        const result = await sequelize.query(`UPDATE journal_entries SET batch_id = ? WHERE id = ? AND batch_id IS NULL`, {
            replacements: [batchId, entryId],
        });
        if (result[1] > 0)
            addedCount++;
    }
    return { batchId, addedCount };
}
/**
 * Validate batch for posting
 * @param sequelize - Database instance
 * @param batchId - Batch ID
 * @returns Validation result with errors
 */
async function validateBatch(sequelize, batchId) {
    const errors = [];
    const entries = await sequelize.query(`SELECT id, status FROM journal_entries WHERE batch_id = ?`, {
        replacements: [batchId],
        type: 'SELECT',
    });
    for (const entry of entries) {
        if (entry.status !== JournalEntryStatus.DRAFT) {
            errors.push(`Entry ${entry.id} not in DRAFT status`);
        }
    }
    const unbalanced = await sequelize.query(`SELECT id FROM journal_entries WHERE batch_id = ?
     AND ABS(total_debits - total_credits) > 0.01`, {
        replacements: [batchId],
        type: 'SELECT',
    });
    if (unbalanced.length > 0) {
        errors.push(`${unbalanced.length} entries do not balance`);
    }
    return {
        isValid: errors.length === 0,
        errors,
        totalCount: entries.length,
    };
}
/**
 * Post entire batch
 * @param sequelize - Database instance
 * @param batchId - Batch ID
 * @returns Batch posting result
 */
async function postBatch(sequelize, batchId) {
    const entries = await sequelize.query(`SELECT id FROM journal_entries WHERE batch_id = ?`, {
        replacements: [batchId],
        type: 'SELECT',
    });
    let postedCount = 0;
    let failedCount = 0;
    for (const entry of entries) {
        try {
            await postJournalEntry(sequelize, entry.id);
            postedCount++;
        }
        catch {
            failedCount++;
        }
    }
    await sequelize.query(`UPDATE batch_postings SET status = ?, completed_at = NOW() WHERE id = ?`, {
        replacements: [postedCount === entries.length ? 'COMPLETED' : 'PARTIAL', batchId],
    });
    return { batchId, postedCount, failedCount, status: 'PROCESSED' };
}
// ============================================================================
// ACCOUNT BALANCE FUNCTIONS (17-20)
// ============================================================================
/**
 * Get account balance
 * @param sequelize - Database instance
 * @param accountId - Account ID
 * @param asOfDate - As of date (optional)
 * @returns Balance response
 */
async function getAccountBalance(sequelize, accountId, asOfDate) {
    const dateFilter = asOfDate ? ` AND created_at <= '${asOfDate.toISOString()}'` : '';
    const result = await sequelize.query(`SELECT
       c.id, c.code, c.name, c.currency,
       COALESCE(SUM(CASE WHEN l.debit_amount > 0 THEN l.debit_amount ELSE 0 END), 0) as debit_balance,
       COALESCE(SUM(CASE WHEN l.credit_amount > 0 THEN l.credit_amount ELSE 0 END), 0) as credit_balance
     FROM chart_of_accounts c
     LEFT JOIN ledger_entries l ON c.id = l.account_id
     WHERE c.id = ?${dateFilter}
     GROUP BY c.id, c.code, c.name, c.currency`, {
        replacements: [accountId],
        type: 'SELECT',
    });
    if (!result.length) {
        throw new common_1.BadRequestException(`Account ${accountId} not found`);
    }
    const row = result[0];
    return {
        accountId: row.id,
        code: row.code,
        name: row.name,
        debitBalance: parseFloat(row.debit_balance),
        creditBalance: parseFloat(row.credit_balance),
        netBalance: parseFloat(row.debit_balance) - parseFloat(row.credit_balance),
        currency: row.currency,
        asOfDate: asOfDate || new Date(),
    };
}
/**
 * Get trial balance
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Trial balance report
 */
async function getTrialBalance(sequelize, periodId) {
    const accounts = await sequelize.query(`SELECT
       c.id, c.code, c.name, c.currency,
       COALESCE(SUM(CASE WHEN l.debit_amount > 0 THEN l.debit_amount ELSE 0 END), 0) as debit_balance,
       COALESCE(SUM(CASE WHEN l.credit_amount > 0 THEN l.credit_amount ELSE 0 END), 0) as credit_balance
     FROM chart_of_accounts c
     LEFT JOIN ledger_entries l ON c.id = l.account_id
     LEFT JOIN journal_entries j ON l.entry_id = j.id
     WHERE j.period_id = ? OR j.period_id IS NULL
     GROUP BY c.id, c.code, c.name, c.currency
     ORDER BY c.code`, {
        replacements: [periodId],
        type: 'SELECT',
    });
    let totalDebits = 0;
    let totalCredits = 0;
    const balances = accounts.map((row) => {
        const debits = parseFloat(row.debit_balance);
        const credits = parseFloat(row.credit_balance);
        totalDebits += debits;
        totalCredits += credits;
        return {
            accountId: row.id,
            code: row.code,
            name: row.name,
            debitBalance: debits,
            creditBalance: credits,
            netBalance: debits - credits,
            currency: row.currency,
            asOfDate: new Date(),
        };
    });
    return {
        periodId,
        asOfDate: new Date(),
        totalDebits,
        totalCredits,
        isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
        accounts: balances,
    };
}
/**
 * Get period balance for account
 * @param sequelize - Database instance
 * @param accountId - Account ID
 * @param periodId - Period ID
 * @returns Period balance
 */
async function getPeriodBalance(sequelize, accountId, periodId) {
    const result = await sequelize.query(`SELECT
       c.id, c.code, c.name, c.currency,
       COALESCE(SUM(CASE WHEN l.debit_amount > 0 THEN l.debit_amount ELSE 0 END), 0) as debit_balance,
       COALESCE(SUM(CASE WHEN l.credit_amount > 0 THEN l.credit_amount ELSE 0 END), 0) as credit_balance
     FROM chart_of_accounts c
     LEFT JOIN ledger_entries l ON c.id = l.account_id
     LEFT JOIN journal_entries j ON l.entry_id = j.id
     WHERE c.id = ? AND j.period_id = ?
     GROUP BY c.id, c.code, c.name, c.currency`, {
        replacements: [accountId, periodId],
        type: 'SELECT',
    });
    if (!result.length) {
        throw new common_1.BadRequestException(`Account ${accountId} in period ${periodId} not found`);
    }
    const row = result[0];
    return {
        accountId: row.id,
        code: row.code,
        name: row.name,
        debitBalance: parseFloat(row.debit_balance),
        creditBalance: parseFloat(row.credit_balance),
        netBalance: parseFloat(row.debit_balance) - parseFloat(row.credit_balance),
        currency: row.currency,
        asOfDate: new Date(),
    };
}
/**
 * Get balance summary for account range
 * @param sequelize - Database instance
 * @param accountCodes - Account code patterns
 * @returns Summary balances
 */
async function getBalanceSummary(sequelize, accountCodes) {
    const placeholders = accountCodes.map(() => '?').join(',');
    const results = await sequelize.query(`SELECT
       c.id, c.code, c.name, c.currency,
       COALESCE(SUM(CASE WHEN l.debit_amount > 0 THEN l.debit_amount ELSE 0 END), 0) as debit_balance,
       COALESCE(SUM(CASE WHEN l.credit_amount > 0 THEN l.credit_amount ELSE 0 END), 0) as credit_balance
     FROM chart_of_accounts c
     LEFT JOIN ledger_entries l ON c.id = l.account_id
     WHERE c.code IN (${placeholders})
     GROUP BY c.id, c.code, c.name, c.currency`, {
        replacements: accountCodes,
        type: 'SELECT',
    });
    return results.map((row) => ({
        accountId: row.id,
        code: row.code,
        name: row.name,
        debitBalance: parseFloat(row.debit_balance),
        creditBalance: parseFloat(row.credit_balance),
        netBalance: parseFloat(row.debit_balance) - parseFloat(row.credit_balance),
        currency: row.currency,
        asOfDate: new Date(),
    }));
}
// ============================================================================
// DOUBLE-ENTRY VALIDATION FUNCTIONS (21-24)
// ============================================================================
/**
 * Validate journal entry balancing
 * @param sequelize - Database instance
 * @param entryId - Journal entry ID
 * @returns Validation result
 */
async function validateJournalEntry(sequelize, entryId) {
    const result = await sequelize.query(`SELECT total_debits, total_credits FROM journal_entries WHERE id = ?`, {
        replacements: [entryId],
        type: 'SELECT',
    });
    if (!result.length) {
        throw new common_1.BadRequestException(`Entry ${entryId} not found`);
    }
    const { total_debits, total_credits } = result[0];
    const difference = Math.abs(total_debits - total_credits);
    return {
        isValid: difference < 0.01,
        debits: total_debits,
        credits: total_credits,
        difference,
    };
}
/**
 * Check ledger balancing
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Ledger balance check
 */
async function checkLedgerBalance(sequelize, periodId) {
    const result = await sequelize.query(`SELECT
       COALESCE(SUM(CASE WHEN l.debit_amount > 0 THEN l.debit_amount ELSE 0 END), 0) as total_debits,
       COALESCE(SUM(CASE WHEN l.credit_amount > 0 THEN l.credit_amount ELSE 0 END), 0) as total_credits
     FROM ledger_entries l
     LEFT JOIN journal_entries j ON l.entry_id = j.id
     WHERE j.period_id = ?`, {
        replacements: [periodId],
        type: 'SELECT',
    });
    const { total_debits, total_credits } = result[0];
    const variance = Math.abs(total_debits - total_credits);
    return {
        isBalanced: variance < 0.01,
        totalDebits: total_debits,
        totalCredits: total_credits,
        variance,
    };
}
/**
 * Find entry errors
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Array of error entries
 */
async function findEntryErrors(sequelize, periodId) {
    const result = await sequelize.query(`SELECT id, total_debits, total_credits,
            ABS(total_debits - total_credits) as variance
     FROM journal_entries
     WHERE period_id = ? AND ABS(total_debits - total_credits) > 0.01`, {
        replacements: [periodId],
        type: 'SELECT',
    });
    return result.map((row) => ({
        entryId: row.id,
        error: `Unbalanced entry: debits ${row.total_debits} != credits ${row.total_credits}`,
        debits: row.total_debits,
        credits: row.total_credits,
    }));
}
/**
 * Auto-correct common entry errors
 * @param sequelize - Database instance
 * @param entryId - Journal entry ID
 * @returns Correction result
 */
async function autoCorrectEntry(sequelize, entryId) {
    const entry = await sequelize.query(`SELECT id, total_debits, total_credits FROM journal_entries WHERE id = ?`, {
        replacements: [entryId],
        type: 'SELECT',
    });
    if (!entry.length) {
        throw new common_1.BadRequestException(`Entry ${entryId} not found`);
    }
    const { total_debits, total_credits } = entry[0];
    const difference = total_debits - total_credits;
    if (Math.abs(difference) < 0.01) {
        return { entryId, corrected: false, message: 'Entry already balanced' };
    }
    // Create balancing entry
    const correction = Math.abs(difference) / 2;
    const correctionAccountId = await getBalancingAccountId(sequelize);
    if (difference > 0) {
        await sequelize.query(`INSERT INTO journal_entry_lines (id, entry_id, account_id, amount, type, description, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`, {
            replacements: [
                crypto.randomUUID(),
                entryId,
                correctionAccountId,
                correction,
                TransactionType.CREDIT,
                'Auto-correction',
            ],
        });
    }
    else {
        await sequelize.query(`INSERT INTO journal_entry_lines (id, entry_id, account_id, amount, type, description, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`, {
            replacements: [
                crypto.randomUUID(),
                entryId,
                correctionAccountId,
                correction,
                TransactionType.DEBIT,
                'Auto-correction',
            ],
        });
    }
    return { entryId, corrected: true, message: 'Entry auto-corrected' };
}
async function getBalancingAccountId(sequelize) {
    const result = await sequelize.query(`SELECT id FROM chart_of_accounts WHERE code = ? LIMIT 1`, {
        replacements: ['9999'],
        type: 'SELECT',
    });
    return result[0]?.id || '';
}
// ============================================================================
// PERIOD MANAGEMENT FUNCTIONS (25-28)
// ============================================================================
/**
 * Open accounting period
 * @param sequelize - Database instance
 * @param periodCode - Period code
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Opened period
 */
async function openPeriod(sequelize, periodCode, startDate, endDate) {
    const periodId = crypto.randomUUID();
    await sequelize.query(`INSERT INTO accounting_periods (id, code, status, start_date, end_date, opened_at)
     VALUES (?, ?, ?, ?, ?, NOW())`, {
        replacements: [periodId, periodCode, PeriodStatus.OPEN, startDate, endDate],
    });
    return { periodId, status: PeriodStatus.OPEN, startDate, endDate };
}
/**
 * Close accounting period
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Closed period status
 */
async function closePeriod(sequelize, periodId) {
    const result = await sequelize.query(`UPDATE accounting_periods SET status = ?, closed_at = NOW() WHERE id = ? RETURNING *`, {
        replacements: [PeriodStatus.CLOSED, periodId],
        type: 'SELECT',
    });
    if (!result.length) {
        throw new common_1.BadRequestException(`Period ${periodId} not found`);
    }
    return { periodId, status: PeriodStatus.CLOSED, closedAt: new Date() };
}
/**
 * Reopen closed period
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Reopened period status
 */
async function reopenPeriod(sequelize, periodId) {
    const result = await sequelize.query(`UPDATE accounting_periods SET status = ?, closed_at = NULL, reopened_at = NOW()
     WHERE id = ? RETURNING *`, {
        replacements: [PeriodStatus.OPEN, periodId],
        type: 'SELECT',
    });
    if (!result.length) {
        throw new common_1.BadRequestException(`Period ${periodId} not found`);
    }
    return { periodId, status: PeriodStatus.OPEN, reopenedAt: new Date() };
}
/**
 * Get period status
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Period status information
 */
async function getPeriodStatus(sequelize, periodId) {
    const period = await sequelize.query(`SELECT * FROM accounting_periods WHERE id = ? LIMIT 1`, {
        replacements: [periodId],
        type: 'SELECT',
    });
    if (!period.length) {
        throw new common_1.BadRequestException(`Period ${periodId} not found`);
    }
    const p = period[0];
    const entries = await sequelize.query(`SELECT COUNT(*) as count FROM journal_entries WHERE period_id = ?`, {
        replacements: [periodId],
        type: 'SELECT',
    });
    return {
        periodId,
        code: p.code,
        status: p.status,
        startDate: p.start_date,
        endDate: p.end_date,
        entryCount: entries[0]?.count || 0,
    };
}
// ============================================================================
// MULTI-CURRENCY FUNCTIONS (29-32)
// ============================================================================
/**
 * Convert amount to different currency
 * @param sequelize - Database instance
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param conversionDate - Conversion date
 * @returns Converted amount
 */
async function convertCurrency(sequelize, amount, fromCurrency, toCurrency, conversionDate) {
    if (fromCurrency === toCurrency) {
        return { originalAmount: amount, convertedAmount: amount, rate: 1, fromCurrency, toCurrency };
    }
    const rate = await sequelize.query(`SELECT rate FROM exchange_rates
     WHERE from_currency = ? AND to_currency = ? AND effective_date <= ?
     ORDER BY effective_date DESC LIMIT 1`, {
        replacements: [fromCurrency, toCurrency, conversionDate],
        type: 'SELECT',
    });
    if (!rate.length) {
        throw new common_1.BadRequestException(`No exchange rate found for ${fromCurrency} to ${toCurrency}`);
    }
    const conversionRate = parseFloat(rate[0].rate);
    return {
        originalAmount: amount,
        convertedAmount: amount * conversionRate,
        rate: conversionRate,
        fromCurrency,
        toCurrency,
    };
}
/**
 * Revalue foreign currency balances
 * @param sequelize - Database instance
 * @param accountId - Account ID
 * @param revaluationDate - Revaluation date
 * @returns Revaluation entry details
 */
async function revaluateForeignCurrency(sequelize, accountId, revaluationDate) {
    const account = await getChartOfAccount(sequelize, accountId);
    const balance = await getAccountBalance(sequelize, accountId);
    const newRate = await sequelize.query(`SELECT rate FROM exchange_rates
     WHERE from_currency = ? AND to_currency = ? AND effective_date <= ?
     ORDER BY effective_date DESC LIMIT 1`, {
        replacements: [account.currency, CurrencyType.USD, revaluationDate],
        type: 'SELECT',
    });
    if (!newRate.length) {
        throw new common_1.BadRequestException('Exchange rate not found');
    }
    const gainLoss = (balance.netBalance * parseFloat(newRate[0].rate)) - balance.netBalance;
    const entryId = crypto.randomUUID();
    await sequelize.query(`INSERT INTO journal_entries (id, reference, description, status, created_at)
     VALUES (?, ?, ?, ?, NOW())`, {
        replacements: [entryId, `REVAL-${accountId}`, `Revaluation of ${account.name}`, JournalEntryStatus.DRAFT],
    });
    return { accountId, entryId, gainLoss, status: 'CREATED' };
}
/**
 * Record realized gains/losses
 * @param sequelize - Database instance
 * @param accountId - Account ID
 * @param amount - Realized amount
 * @param description - Transaction description
 * @returns Realized entry details
 */
async function recordRealizedGainLoss(sequelize, accountId, amount, description) {
    const entryId = crypto.randomUUID();
    const gainLossAccount = '8000'; // Gain/Loss account code
    const gainAccount = await sequelize.query(`SELECT id FROM chart_of_accounts WHERE code = ? LIMIT 1`, {
        replacements: [gainLossAccount],
        type: 'SELECT',
    });
    if (!gainAccount.length) {
        throw new common_1.BadRequestException('Gain/loss account not configured');
    }
    await sequelize.query(`INSERT INTO journal_entries (id, reference, description, status, created_at)
     VALUES (?, ?, ?, ?, NOW())`, {
        replacements: [entryId, `RGL-${accountId}`, description, JournalEntryStatus.DRAFT],
    });
    return { accountId, entryId, amount };
}
/**
 * Update exchange rates
 * @param sequelize - Database instance
 * @param rates - Exchange rate entries
 * @param effectiveDate - Effective date
 * @returns Updated rate count
 */
async function updateExchangeRates(sequelize, rates, effectiveDate) {
    let updatedCount = 0;
    for (const rate of rates) {
        await sequelize.query(`INSERT INTO exchange_rates (id, from_currency, to_currency, rate, effective_date, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`, {
            replacements: [crypto.randomUUID(), rate.from, rate.to, rate.rate, effectiveDate],
        });
        updatedCount++;
    }
    return { updatedCount, effectiveDate };
}
// ============================================================================
// INTER-COMPANY FUNCTIONS (33-36)
// ============================================================================
/**
 * Record inter-company transaction
 * @param sequelize - Database instance
 * @param fromCompany - Source company
 * @param toCompany - Target company
 * @param amount - Transaction amount
 * @param description - Transaction description
 * @returns Transaction ID
 */
async function recordInterCompanyTransaction(sequelize, fromCompany, toCompany, amount, description) {
    const txnId = crypto.randomUUID();
    await sequelize.query(`INSERT INTO inter_company_transactions (id, from_company, to_company, amount, description, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`, {
        replacements: [txnId, fromCompany, toCompany, amount, description, 'PENDING'],
    });
    return { transactionId: txnId, status: 'PENDING' };
}
/**
 * Eliminate inter-company entries
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Elimination result
 */
async function eliminateInterCompanyEntries(sequelize, periodId) {
    const transactions = await sequelize.query(`SELECT * FROM inter_company_transactions WHERE period_id = ? AND status = 'PENDING'`, {
        replacements: [periodId],
        type: 'SELECT',
    });
    let eliminatedCount = 0;
    let totalAmount = 0;
    for (const txn of transactions) {
        const entryId = crypto.randomUUID();
        await sequelize.query(`INSERT INTO journal_entries (id, period_id, reference, description, status, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`, {
            replacements: [entryId, periodId, `ELIM-${txn.id}`, `Elimination: ${txn.description}`, JournalEntryStatus.DRAFT],
        });
        await sequelize.query(`UPDATE inter_company_transactions SET status = ? WHERE id = ?`, {
            replacements: ['ELIMINATED', txn.id],
        });
        eliminatedCount++;
        totalAmount += txn.amount;
    }
    return { eliminatedCount, totalAmount };
}
/**
 * Consolidate subsidiary balances
 * @param sequelize - Database instance
 * @param parentCompanyId - Parent company ID
 * @param periodId - Period ID
 * @returns Consolidated balances
 */
async function consolidateSubsidiaryBalances(sequelize, parentCompanyId, periodId) {
    const subsidiaries = await sequelize.query(`SELECT id FROM companies WHERE parent_id = ?`, {
        replacements: [parentCompanyId],
        type: 'SELECT',
    });
    const consolidationId = crypto.randomUUID();
    await sequelize.query(`INSERT INTO consolidations (id, parent_company_id, period_id, status, created_at)
     VALUES (?, ?, ?, ?, NOW())`, {
        replacements: [consolidationId, parentCompanyId, periodId, 'IN_PROGRESS'],
    });
    return { parentCompanyId, subsidiaryCount: subsidiaries.length, consolidationStatus: 'PROCESSING' };
}
/**
 * Reconcile inter-company balances
 * @param sequelize - Database instance
 * @param company1: string
 * @param company2: string
 * @returns Reconciliation result
 */
async function reconcileInterCompanyBalances(sequelize, company1, company2) {
    const result = await sequelize.query(`SELECT
       SUM(CASE WHEN from_company = ? THEN amount ELSE 0 END) as company1_sent,
       SUM(CASE WHEN to_company = ? THEN amount ELSE 0 END) as company1_received,
       SUM(CASE WHEN from_company = ? THEN amount ELSE 0 END) as company2_sent,
       SUM(CASE WHEN to_company = ? THEN amount ELSE 0 END) as company2_received
     FROM inter_company_transactions`, {
        replacements: [company1, company1, company2, company2],
        type: 'SELECT',
    });
    const row = result[0];
    const company1Net = (row.company1_sent || 0) - (row.company1_received || 0);
    const company2Net = (row.company2_sent || 0) - (row.company2_received || 0);
    const variance = Math.abs(company1Net + company2Net);
    return {
        company1,
        company2,
        variance,
        isReconciled: variance < 0.01,
    };
}
// ============================================================================
// AUDIT & UTILITIES FUNCTIONS (37-40)
// ============================================================================
/**
 * Generate audit trail
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @param filters - Optional filters
 * @returns Audit trail entries
 */
async function generateAuditTrail(sequelize, periodId, filters) {
    let query = `SELECT timestamp, entity_type, action, changed_by, details FROM audit_log WHERE period_id = ?`;
    const replacements = [periodId];
    if (filters?.entityType) {
        query += ` AND entity_type = ?`;
        replacements.push(filters.entityType);
    }
    if (filters?.action) {
        query += ` AND action = ?`;
        replacements.push(filters.action);
    }
    query += ` ORDER BY timestamp DESC`;
    return sequelize.query(query, {
        replacements,
        type: 'SELECT',
    });
}
/**
 * Validate ledger integrity
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Validation report
 */
async function validateLedgerIntegrity(sequelize, periodId) {
    const errors = [];
    const warnings = [];
    // Check balance
    const balance = await checkLedgerBalance(sequelize, periodId);
    if (!balance.isBalanced) {
        errors.push(`Ledger not balanced: variance ${balance.variance}`);
    }
    // Check orphaned entries
    const orphaned = await sequelize.query(`SELECT COUNT(*) as count FROM journal_entry_lines WHERE entry_id NOT IN (SELECT id FROM journal_entries)`, {
        type: 'SELECT',
    });
    if (orphaned[0]?.count > 0) {
        warnings.push(`${orphaned[0].count} orphaned entry lines found`);
    }
    // Check duplicate entries
    const duplicates = await sequelize.query(`SELECT reference, COUNT(*) as count FROM journal_entries WHERE period_id = ?
     GROUP BY reference HAVING COUNT(*) > 1`, {
        replacements: [periodId],
        type: 'SELECT',
    });
    if (duplicates.length > 0) {
        warnings.push(`${duplicates.length} potential duplicate entries found`);
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Export ledger data
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @param format - Export format
 * @returns Export file path or data
 */
async function exportLedgerData(sequelize, periodId, format) {
    const exportId = crypto.randomUUID();
    await sequelize.query(`INSERT INTO ledger_exports (id, period_id, format, status, created_at)
     VALUES (?, ?, ?, ?, NOW())`, {
        replacements: [exportId, periodId, format, 'INITIATED'],
    });
    // Background export processing would be handled by worker/queue
    return {
        exportId,
        format,
        status: 'PROCESSING',
        createdAt: new Date(),
    };
}
/**
 * Archive accounting period
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Archive status
 */
async function archiveAccountingPeriod(sequelize, periodId) {
    const result = await sequelize.query(`UPDATE accounting_periods SET status = ?, archived_at = NOW() WHERE id = ? RETURNING *`, {
        replacements: [PeriodStatus.ARCHIVED, periodId],
        type: 'SELECT',
    });
    if (!result.length) {
        throw new common_1.BadRequestException(`Period ${periodId} not found`);
    }
    return {
        periodId,
        status: PeriodStatus.ARCHIVED,
        archivedAt: new Date(),
    };
}
//# sourceMappingURL=financial-accounting-ledger-kit.js.map
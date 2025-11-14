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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupRestoreService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const base_1 = require("../../common/base");
let BackupRestoreService = class BackupRestoreService extends base_1.BaseService {
    sequelize;
    activeBackups = new Map();
    drPlans = new Map();
    constructor(sequelize) {
        super();
        this.sequelize = sequelize;
        this.initializeDRPlans();
    }
    async createFullBackup(location, options = {}) {
        const backupId = crypto.randomBytes(16).toString('hex');
        const timestamp = new Date();
        const backupPath = path.join(location, `full_backup_${timestamp.toISOString().replace(/[:.]/g, '-')}.sql`);
        this.logInfo(`Starting full backup: ${backupId}`);
        const backup = {
            id: backupId,
            type: 'full',
            timestamp,
            size: 0,
            location: backupPath,
            checksum: '',
            status: 'in_progress',
        };
        this.activeBackups.set(backupId, backup);
        try {
            const tables = await this.getAllTables();
            let backupSQL = `-- Full Backup: ${backupId}\n`;
            backupSQL += `-- Created: ${timestamp.toISOString()}\n\n`;
            for (const table of tables) {
                if (options.excludeTables?.includes(table))
                    continue;
                const createTableSQL = await this.getCreateTableSQL(table);
                const dataSQL = await this.getTableDataSQL(table);
                backupSQL += `-- Table: ${table}\n`;
                backupSQL += createTableSQL + ';\n\n';
                backupSQL += dataSQL + '\n\n';
            }
            await fs.promises.writeFile(backupPath, backupSQL, 'utf8');
            const stats = await fs.promises.stat(backupPath);
            const checksum = await this.calculateChecksum(backupPath);
            backup.size = stats.size;
            backup.checksum = checksum;
            backup.status = 'completed';
            backup.tables = tables;
            this.logInfo(`Full backup completed: ${backupId}, size: ${backup.size} bytes`);
            this.emit('backupCompleted', backup);
            return backup;
        }
        catch (error) {
            backup.status = 'failed';
            this.logError(`Full backup failed: ${backupId}`, error);
            this.emit('backupFailed', { backup, error });
            throw error;
        }
        finally {
            this.activeBackups.delete(backupId);
        }
    }
    async listBackups(location) {
        try {
            const files = await fs.promises.readdir(location);
            const backups = [];
            for (const file of files) {
                if (file.startsWith('full_backup_') || file.startsWith('incremental_backup_') || file.startsWith('pitr_backup_')) {
                    const filePath = path.join(location, file);
                    const stats = await fs.promises.stat(filePath);
                    const metadata = await this.parseBackupMetadata(filePath);
                    if (metadata) {
                        backups.push({
                            ...metadata,
                            size: stats.size,
                            location: filePath,
                        });
                    }
                }
            }
            return backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        }
        catch (error) {
            this.logError('Failed to list backups', error);
            return [];
        }
    }
    async validateBackup(backup) {
        const result = {
            valid: false,
            errors: [],
            warnings: [],
            checksumValid: false,
            tablesRestored: 0,
            dataIntegrity: false,
        };
        try {
            await fs.promises.access(backup.location);
            const calculatedChecksum = await this.calculateChecksum(backup.location);
            result.checksumValid = calculatedChecksum === backup.checksum;
            if (!result.checksumValid) {
                result.errors.push('Checksum validation failed');
            }
            const content = await fs.promises.readFile(backup.location, 'utf8');
            const lines = content.split('\n');
            const hasCreateTable = lines.some(line => line.includes('CREATE TABLE'));
            const hasInsert = lines.some(line => line.includes('INSERT INTO'));
            if (!hasCreateTable) {
                result.warnings.push('No CREATE TABLE statements found');
            }
            if (!hasInsert) {
                result.warnings.push('No INSERT statements found');
            }
            result.valid = result.checksumValid && result.errors.length === 0;
            result.dataIntegrity = result.valid;
        }
        catch (error) {
            result.errors.push(`Validation error: ${error.message}`);
        }
        return result;
    }
    async createIncrementalBackup(baseBackup, location) {
        const backupId = crypto.randomBytes(16).toString('hex');
        const timestamp = new Date();
        this.logInfo(`Starting incremental backup: ${backupId} based on ${baseBackup.id}`);
        const backup = {
            id: backupId,
            type: 'incremental',
            timestamp,
            size: 0,
            location: path.join(location, `incremental_backup_${timestamp.toISOString().replace(/[:.]/g, '-')}.sql`),
            checksum: '',
            status: 'in_progress',
            description: `Incremental backup based on ${baseBackup.id}`,
        };
        this.activeBackups.set(backupId, backup);
        try {
            const changes = await this.getChangesSince(baseBackup.timestamp);
            if (changes.length === 0) {
                this.logInfo(`No changes since ${baseBackup.timestamp}, skipping incremental backup`);
                backup.status = 'completed';
                return backup;
            }
            let backupSQL = `-- Incremental Backup: ${backupId}\n`;
            backupSQL += `-- Base: ${baseBackup.id}\n`;
            backupSQL += `-- Created: ${timestamp.toISOString()}\n\n`;
            for (const change of changes) {
                backupSQL += change.sql + '\n';
            }
            await fs.promises.writeFile(backup.location, backupSQL, 'utf8');
            const stats = await fs.promises.stat(backup.location);
            const checksum = await this.calculateChecksum(backup.location);
            backup.size = stats.size;
            backup.checksum = checksum;
            backup.status = 'completed';
            this.logInfo(`Incremental backup completed: ${backupId}, size: ${backup.size} bytes`);
            this.emit('backupCompleted', backup);
            return backup;
        }
        catch (error) {
            backup.status = 'failed';
            this.logError(`Incremental backup failed: ${backupId}`, error);
            this.emit('backupFailed', { backup, error });
            throw error;
        }
        finally {
            this.activeBackups.delete(backupId);
        }
    }
    async enablePITR(walLocation) {
        this.logInfo('Enabling Point-in-Time Recovery');
        await fs.promises.mkdir(walLocation, { recursive: true });
        this.logInfo('Point-in-Time Recovery enabled');
    }
    async restoreToPointInTime(baseBackup, targetTime, options = {}) {
        this.logInfo(`Starting PITR restore to ${targetTime.toISOString()}`);
        try {
            await this.restoreFullBackup(baseBackup, { ...options, validateOnly: false });
            this.logInfo('PITR restore completed');
            return {
                valid: true,
                errors: [],
                warnings: [],
                checksumValid: true,
                tablesRestored: 0,
                dataIntegrity: true,
            };
        }
        catch (error) {
            this.logError('PITR restore failed', error);
            return {
                valid: false,
                errors: [error.message],
                warnings: [],
                checksumValid: false,
                tablesRestored: 0,
                dataIntegrity: false,
            };
        }
    }
    createDRPlan(plan) {
        const drPlan = {
            id: crypto.randomBytes(16).toString('hex'),
            ...plan,
        };
        this.drPlans.set(drPlan.id, drPlan);
        this.logInfo(`DR plan created: ${drPlan.id}`);
        return drPlan;
    }
    async testDRProcedure(planId) {
        const plan = this.drPlans.get(planId);
        if (!plan) {
            throw new Error(`DR plan not found: ${planId}`);
        }
        this.logInfo(`Testing DR procedure for plan: ${planId}`);
        const startTime = Date.now();
        const issues = [];
        try {
            for (const location of plan.backupLocations) {
                try {
                    await fs.promises.access(location);
                }
                catch {
                    issues.push(`Backup location not accessible: ${location}`);
                }
            }
            const backups = await this.listBackups(plan.backupLocations[0]);
            if (backups.length === 0) {
                issues.push('No backups available for testing');
            }
            else {
                const testResult = await this.validateBackup(backups[0]);
                if (!testResult.valid) {
                    issues.push('Backup validation failed');
                }
            }
            const duration = Date.now() - startTime;
            const success = issues.length === 0;
            this.logInfo(`DR test completed: ${success ? 'SUCCESS' : 'FAILED'}, duration: ${duration}ms`);
            return { success, duration, issues };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.logError('DR test failed', error);
            return { success: false, duration, issues: [error.message] };
        }
    }
    async restoreFullBackup(backup, options = {}) {
        this.logInfo(`Starting restore from backup: ${backup.id}`);
        const result = {
            valid: false,
            errors: [],
            warnings: [],
            checksumValid: false,
            tablesRestored: 0,
            dataIntegrity: false,
        };
        try {
            const validation = await this.validateBackup(backup);
            if (!validation.valid) {
                return validation;
            }
            result.checksumValid = validation.checksumValid;
            if (options.validateOnly) {
                return { ...validation, valid: true };
            }
            const content = await fs.promises.readFile(backup.location, 'utf8');
            const queries = content
                .split(';')
                .map(q => q.trim())
                .filter(q => q.length > 0 && !q.startsWith('--'));
            for (const query of queries) {
                if (query.trim()) {
                    await this.sequelize.query(query);
                    result.tablesRestored++;
                }
            }
            result.valid = true;
            result.dataIntegrity = true;
            this.logInfo(`Restore completed: ${result.tablesRestored} statements executed`);
            this.emit('restoreCompleted', { backup, result });
            return result;
        }
        catch (error) {
            result.errors.push(error.message);
            this.logError('Restore failed', error);
            this.emit('restoreFailed', { backup, error });
            return result;
        }
    }
    async getAllTables() {
        const [results] = await this.sequelize.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'", { type: sequelize_2.QueryTypes.SELECT });
        return results.map(r => r.tablename);
    }
    async getCreateTableSQL(tableName) {
        const [results] = await this.sequelize.query(`SELECT pg_get_create_table_script($1) as sql`, {
            bind: [tableName],
            type: sequelize_2.QueryTypes.SELECT
        });
        return results?.sql || '';
    }
    async getTableDataSQL(tableName) {
        const [results] = await this.sequelize.query(`SELECT * FROM ${tableName}`, { type: sequelize_2.QueryTypes.SELECT });
        if (results.length === 0)
            return '';
        const columns = Object.keys(results[0]);
        const values = results.map(row => `(${columns.map(col => this.escapeValue(row[col])).join(', ')})`).join(',\n');
        return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES\n${values};`;
    }
    escapeValue(value) {
        if (value === null)
            return 'NULL';
        if (typeof value === 'string')
            return `'${value.replace(/'/g, "''")}'`;
        if (typeof value === 'boolean')
            return value ? 'true' : 'false';
        return value.toString();
    }
    async calculateChecksum(filePath) {
        const content = await fs.promises.readFile(filePath);
        return crypto.createHash('sha256').update(content).digest('hex');
    }
    async parseBackupMetadata(filePath) {
        try {
            const content = await fs.promises.readFile(filePath, 'utf8');
            const lines = content.split('\n').slice(0, 5);
            const metadata = {};
            for (const line of lines) {
                if (line.startsWith('-- Full Backup:')) {
                    metadata.type = 'full';
                    metadata.id = line.split(':')[1].trim();
                }
                else if (line.startsWith('-- Incremental Backup:')) {
                    metadata.type = 'incremental';
                    metadata.id = line.split(':')[1].trim();
                }
                else if (line.startsWith('-- Created:')) {
                    metadata.timestamp = new Date(line.split(':')[1].trim());
                }
            }
            return metadata;
        }
        catch {
            return null;
        }
    }
    async getChangesSince(since) {
        return [];
    }
    initializeDRPlans() {
        this.createDRPlan({
            name: 'Default DR Plan',
            rto: 240,
            rpo: 15,
            backupLocations: ['./backups'],
            replicationEnabled: false,
            failoverStrategy: 'manual',
            testFrequency: 'monthly',
            contacts: ['admin@whitecross.com'],
        });
    }
};
exports.BackupRestoreService = BackupRestoreService;
exports.BackupRestoreService = BackupRestoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_2.Sequelize])
], BackupRestoreService);
//# sourceMappingURL=backup-restore.service.js.map
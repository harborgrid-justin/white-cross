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
exports.MigrationVersionControlService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const crypto = __importStar(require("crypto"));
const events_1 = require("events");
let MigrationVersionControlService = class MigrationVersionControlService extends events_1.EventEmitter {
    sequelize;
    migrations = new Map();
    branches = new Map();
    checkpoints = new Map();
    conflicts = [];
    constructor(sequelize) {
        super();
        this.sequelize = sequelize;
        this.initializeMigrationTable();
    }
    registerMigration(migration) {
        const id = crypto.randomBytes(16).toString('hex');
        const checksum = this.calculateMigrationChecksum(migration);
        const fullMigration = {
            ...migration,
            id,
            checksum,
            status: 'pending',
        };
        this.migrations.set(id, fullMigration);
        this.logInfo(`Migration registered: ${id} - ${migration.name}`);
        return id;
    }
    resolveDependencies(migrations = Array.from(this.migrations.values())) {
        const graph = {
            nodes: new Map(),
            edges: new Map(),
            executionOrder: [],
        };
        for (const migration of migrations) {
            graph.nodes.set(migration.id, migration);
            graph.edges.set(migration.id, migration.dependencies);
        }
        const visited = new Set();
        const visiting = new Set();
        const order = [];
        const visit = (id) => {
            if (visited.has(id))
                return;
            if (visiting.has(id)) {
                throw new Error(`Circular dependency detected involving migration: ${id}`);
            }
            visiting.add(id);
            const dependencies = graph.edges.get(id) || [];
            for (const dep of dependencies) {
                if (!graph.nodes.has(dep)) {
                    throw new Error(`Missing dependency: ${dep} for migration: ${id}`);
                }
                visit(dep);
            }
            visiting.delete(id);
            visited.add(id);
            order.push(id);
        };
        for (const id of graph.nodes.keys()) {
            if (!visited.has(id)) {
                visit(id);
            }
        }
        graph.executionOrder = order;
        return order;
    }
    async executeMigrations(migrationIds, options = {}) {
        const result = { success: true, executed: [], failed: [] };
        const transaction = options.transaction || await this.sequelize.transaction();
        try {
            for (const id of migrationIds) {
                const migration = this.migrations.get(id);
                if (!migration) {
                    throw new Error(`Migration not found: ${id}`);
                }
                if (migration.status === 'completed') {
                    continue;
                }
                migration.status = 'running';
                const startTime = Date.now();
                try {
                    if (!options.dryRun) {
                        await migration.upFunction(this.sequelize.getQueryInterface(), transaction);
                        await this.recordMigrationExecution(migration, startTime);
                    }
                    migration.status = 'completed';
                    migration.executedAt = new Date();
                    migration.executionTime = Date.now() - startTime;
                    result.executed.push(id);
                    this.emit('migrationExecuted', migration);
                }
                catch (error) {
                    migration.status = 'failed';
                    result.failed.push(id);
                    result.success = false;
                    this.logError(`Migration failed: ${id}`, error);
                    this.emit('migrationFailed', { migration, error });
                    if (!options.continueOnError) {
                        if (!options.transaction) {
                            await transaction.rollback();
                        }
                        throw error;
                    }
                }
            }
            if (!options.transaction && result.success) {
                await transaction.commit();
            }
        }
        catch (error) {
            if (!options.transaction) {
                await transaction.rollback();
            }
            throw error;
        }
        return result;
    }
    createBranch(name, baseMigration) {
        if (this.branches.has(name)) {
            throw new Error(`Branch already exists: ${name}`);
        }
        const branch = {
            name,
            baseMigration,
            migrations: [],
            createdAt: new Date(),
        };
        this.branches.set(name, branch);
        this.logInfo(`Migration branch created: ${name}`);
        return branch;
    }
    addMigrationToBranch(branchName, migrationId) {
        const branch = this.branches.get(branchName);
        if (!branch) {
            throw new Error(`Branch not found: ${branchName}`);
        }
        if (!branch.migrations.includes(migrationId)) {
            branch.migrations.push(migrationId);
            this.logInfo(`Migration ${migrationId} added to branch ${branchName}`);
        }
    }
    async mergeBranch(branchName, targetBranch = 'main') {
        const branch = this.branches.get(branchName);
        if (!branch) {
            throw new Error(`Branch not found: ${branchName}`);
        }
        const conflicts = await this.detectConflicts(branch.migrations);
        if (conflicts.length > 0) {
            return { success: false, conflicts };
        }
        const target = this.branches.get(targetBranch) || this.createBranch(targetBranch, '');
        target.migrations.push(...branch.migrations);
        branch.mergedAt = new Date();
        branch.mergedInto = targetBranch;
        this.logInfo(`Branch ${branchName} merged into ${targetBranch}`);
        this.emit('branchMerged', { branch, target });
        return { success: true, conflicts: [] };
    }
    async detectConflicts(migrationIds) {
        const conflicts = [];
        for (let i = 0; i < migrationIds.length; i++) {
            for (let j = i + 1; j < migrationIds.length; j++) {
                const migration1 = this.migrations.get(migrationIds[i]);
                const migration2 = this.migrations.get(migrationIds[j]);
                if (!migration1 || !migration2)
                    continue;
                const explicitConflict = migration1.conflicts.includes(migration2.id) ||
                    migration2.conflicts.includes(migration1.id);
                if (explicitConflict) {
                    conflicts.push({
                        migration1: migration1.id,
                        migration2: migration2.id,
                        conflictType: 'table',
                        resource: 'explicit',
                        description: 'Explicit conflict declared in migration definitions',
                    });
                }
                const schemaConflict = await this.detectSchemaConflict(migration1, migration2);
                if (schemaConflict) {
                    conflicts.push(schemaConflict);
                }
            }
        }
        this.conflicts.push(...conflicts);
        return conflicts;
    }
    async resolveConflict(conflict, resolution) {
        conflict.resolution = resolution;
        if (resolution === 'auto') {
            await this.autoResolveConflict(conflict);
        }
        this.logInfo(`Conflict resolved: ${conflict.migration1} vs ${conflict.migration2} - ${resolution}`);
        this.emit('conflictResolved', conflict);
    }
    async rollbackTo(migrationId) {
        const migration = this.migrations.get(migrationId);
        if (!migration) {
            throw new Error(`Migration not found: ${migrationId}`);
        }
        const toRollback = Array.from(this.migrations.values())
            .filter(m => m.executedAt && m.executedAt > migration.executedAt)
            .sort((a, b) => (b.executedAt.getTime() - a.executedAt.getTime()));
        const transaction = await this.sequelize.transaction();
        try {
            for (const mig of toRollback) {
                await mig.downFunction(this.sequelize.getQueryInterface(), transaction);
                mig.status = 'rolled_back';
                this.emit('migrationRolledBack', mig);
            }
            await transaction.commit();
            this.logInfo(`Rolled back ${toRollback.length} migrations to ${migrationId}`);
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    createCheckpoint(name, migrations) {
        const checkpoint = {
            id: crypto.randomBytes(16).toString('hex'),
            name,
            migrations: [...migrations],
            schemaSnapshot: {},
            createdAt: new Date(),
            canRollbackTo: true,
        };
        this.checkpoints.set(checkpoint.id, checkpoint);
        this.logInfo(`Migration checkpoint created: ${checkpoint.id} - ${name}`);
        return checkpoint;
    }
    async rollbackToCheckpoint(checkpointId) {
        const checkpoint = this.checkpoints.get(checkpointId);
        if (!checkpoint || !checkpoint.canRollbackTo) {
            throw new Error(`Invalid checkpoint: ${checkpointId}`);
        }
        const lastMigrationId = checkpoint.migrations[checkpoint.migrations.length - 1];
        await this.rollbackTo(lastMigrationId);
        this.logInfo(`Rolled back to checkpoint: ${checkpointId}`);
    }
    async initializeMigrationTable() {
        const queryInterface = this.sequelize.getQueryInterface();
        try {
            await queryInterface.createTable('migration_version_control', {
                id: {
                    type: 'VARCHAR(36)',
                    primaryKey: true,
                },
                name: {
                    type: 'VARCHAR(255)',
                    allowNull: false,
                },
                version: {
                    type: 'VARCHAR(50)',
                    allowNull: false,
                },
                checksum: {
                    type: 'VARCHAR(64)',
                    allowNull: false,
                },
                executed_at: {
                    type: 'TIMESTAMP',
                    allowNull: true,
                },
                execution_time: {
                    type: 'INTEGER',
                    allowNull: true,
                },
                status: {
                    type: 'VARCHAR(20)',
                    allowNull: false,
                    defaultValue: 'pending',
                },
                created_at: {
                    type: 'TIMESTAMP',
                    allowNull: false,
                    defaultValue: this.sequelize.literal('CURRENT_TIMESTAMP'),
                },
            });
        }
        catch (error) {
            this.logWarning('Migration table initialization skipped (may already exist)');
        }
    }
    calculateMigrationChecksum(migration) {
        const content = JSON.stringify({
            name: migration.name,
            version: migration.version,
            dependencies: migration.dependencies,
            conflicts: migration.conflicts,
        });
        return crypto.createHash('sha256').update(content).digest('hex');
    }
    async recordMigrationExecution(migration, startTime) {
        const executionTime = Date.now() - startTime;
        await this.sequelize.query(`INSERT INTO migration_version_control
       (id, name, version, checksum, executed_at, execution_time, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET
         executed_at = EXCLUDED.executed_at,
         execution_time = EXCLUDED.execution_time,
         status = EXCLUDED.status`, {
            replacements: [
                migration.id,
                migration.name,
                migration.version,
                migration.checksum,
                new Date(),
                executionTime,
                'completed',
            ],
        });
    }
    async detectSchemaConflict(migration1, migration2) {
        return null;
    }
    async autoResolveConflict(conflict) {
    }
    getMigrationStatus(id) {
        return this.migrations.get(id);
    }
    getAllMigrations() {
        return Array.from(this.migrations.values());
    }
    getBranches() {
        return Array.from(this.branches.values());
    }
    getConflicts() {
        return this.conflicts.filter(c => !c.resolution);
    }
    getCheckpoints() {
        return Array.from(this.checkpoints.values());
    }
};
exports.MigrationVersionControlService = MigrationVersionControlService;
exports.MigrationVersionControlService = MigrationVersionControlService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_2.Sequelize])
], MigrationVersionControlService);
//# sourceMappingURL=migration-version-control.service.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationVersionControlService = void 0;
exports.resolveMigrationDependencies = resolveMigrationDependencies;
exports.detectCircularDependencies = detectCircularDependencies;
exports.validateMigrationDependencies = validateMigrationDependencies;
exports.getMigrationExecutionBatches = getMigrationExecutionBatches;
exports.calculateMigrationDepth = calculateMigrationDepth;
exports.findMigrationChains = findMigrationChains;
exports.optimizeMigrationOrder = optimizeMigrationOrder;
exports.generateDependencyGraph = generateDependencyGraph;
exports.createMigrationBranch = createMigrationBranch;
exports.addMigrationToBranch = addMigrationToBranch;
exports.mergeMigrationBranches = mergeMigrationBranches;
exports.detectBranchConflicts = detectBranchConflicts;
exports.rebaseMigrationBranch = rebaseMigrationBranch;
exports.listMigrationBranches = listMigrationBranches;
exports.canMergeBranch = canMergeBranch;
exports.detectSchemaConflicts = detectSchemaConflicts;
exports.autoResolveConflicts = autoResolveConflicts;
exports.validateConflictResolution = validateConflictResolution;
exports.generateConflictReport = generateConflictReport;
exports.canRunInParallel = canRunInParallel;
exports.findParallelExecutionGroups = findParallelExecutionGroups;
exports.suggestConflictResolution = suggestConflictResolution;
exports.createMigrationCheckpoint = createMigrationCheckpoint;
exports.listCheckpoints = listCheckpoints;
exports.rollbackToCheckpoint = rollbackToCheckpoint;
exports.validateCheckpoint = validateCheckpoint;
exports.cleanupOldCheckpoints = cleanupOldCheckpoints;
exports.compareCheckpoints = compareCheckpoints;
exports.tagSchemaVersion = tagSchemaVersion;
exports.getCurrentSchemaVersion = getCurrentSchemaVersion;
exports.listSchemaVersions = listSchemaVersions;
exports.compareVersions = compareVersions;
exports.incrementVersion = incrementVersion;
exports.validateVersionFormat = validateVersionFormat;
exports.getMigrationsForVersionRange = getMigrationsForVersionRange;
exports.executeParallelMigrations = executeParallelMigrations;
exports.monitorParallelExecution = monitorParallelExecution;
exports.cancelParallelMigrations = cancelParallelMigrations;
exports.calculateMigrationChecksum = calculateMigrationChecksum;
exports.validateMigrationChecksums = validateMigrationChecksums;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const base_1 = require("../../common/base");
function resolveMigrationDependencies(migrations) {
    const graph = new Map();
    const inDegree = new Map();
    for (const mig of migrations) {
        graph.set(mig.id, mig.dependencies);
        inDegree.set(mig.id, 0);
    }
    for (const deps of graph.values()) {
        for (const dep of deps) {
            inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
        }
    }
    const queue = [];
    const result = [];
    for (const [id, degree] of inDegree) {
        if (degree === 0)
            queue.push(id);
    }
    while (queue.length > 0) {
        const current = queue.shift();
        result.push(current);
        const deps = graph.get(current) || [];
        for (const dep of deps) {
            const newDegree = (inDegree.get(dep) || 0) - 1;
            inDegree.set(dep, newDegree);
            if (newDegree === 0)
                queue.push(dep);
        }
    }
    if (result.length !== migrations.length) {
        throw new Error('Circular dependency detected in migrations');
    }
    return result;
}
function detectCircularDependencies(migrations) {
    const visited = new Set();
    const recStack = new Set();
    const cycles = [];
    function dfs(migId, path) {
        visited.add(migId);
        recStack.add(migId);
        path.push(migId);
        const mig = migrations.find(m => m.id === migId);
        if (!mig)
            return false;
        for (const dep of mig.dependencies) {
            if (!visited.has(dep)) {
                if (dfs(dep, path))
                    return true;
            }
            else if (recStack.has(dep)) {
                cycles.push(`${path.join(' -> ')} -> ${dep}`);
                return true;
            }
        }
        recStack.delete(migId);
        return false;
    }
    for (const mig of migrations) {
        if (!visited.has(mig.id)) {
            dfs(mig.id, []);
        }
    }
    return cycles;
}
function validateMigrationDependencies(migrations) {
    const migrationIds = new Set(migrations.map(m => m.id));
    const missingDeps = [];
    for (const mig of migrations) {
        const missing = mig.dependencies.filter(dep => !migrationIds.has(dep));
        if (missing.length > 0) {
            missingDeps.push({ migration: mig.id, missing });
        }
    }
    return {
        valid: missingDeps.length === 0,
        missingDeps
    };
}
function getMigrationExecutionBatches(migrations) {
    const order = resolveMigrationDependencies(migrations);
    const depMap = new Map(migrations.map(m => [m.id, m.dependencies]));
    const batches = [];
    const executed = new Set();
    while (executed.size < order.length) {
        const batch = [];
        for (const migId of order) {
            if (executed.has(migId))
                continue;
            const deps = depMap.get(migId) || [];
            const depsExecuted = deps.every(dep => executed.has(dep));
            if (depsExecuted) {
                batch.push(migId);
            }
        }
        batch.forEach(id => executed.add(id));
        batches.push(batch);
    }
    return batches;
}
function calculateMigrationDepth(migration, allMigrations) {
    const migMap = new Map(allMigrations.map(m => [m.id, m]));
    function getDepth(migId, visited) {
        if (visited.has(migId))
            return 0;
        visited.add(migId);
        const mig = migMap.get(migId);
        if (!mig || mig.dependencies.length === 0)
            return 0;
        const depths = mig.dependencies.map(dep => getDepth(dep, new Set(visited)));
        return 1 + Math.max(...depths);
    }
    return getDepth(migration.id, new Set());
}
function findMigrationChains(startMigration, migrations) {
    const chains = [];
    const migMap = new Map(migrations.map(m => [m.id, m]));
    function buildChains(migId, currentChain) {
        currentChain.push(migId);
        const mig = migMap.get(migId);
        if (!mig || mig.dependencies.length === 0) {
            chains.push([...currentChain]);
            return;
        }
        for (const dep of mig.dependencies) {
            buildChains(dep, [...currentChain]);
        }
    }
    buildChains(startMigration, []);
    return chains;
}
function optimizeMigrationOrder(migrations, executionTimes) {
    const batches = getMigrationExecutionBatches(migrations);
    const optimized = [];
    for (const batch of batches) {
        const sorted = batch.sort((a, b) => {
            const timeA = executionTimes.get(a) || 0;
            const timeB = executionTimes.get(b) || 0;
            return timeB - timeA;
        });
        optimized.push(...sorted);
    }
    return optimized;
}
function generateDependencyGraph(migrations) {
    const nodes = new Map(migrations.map(m => [m.id, m]));
    const edges = new Map(migrations.map(m => [m.id, m.dependencies]));
    const executionOrder = resolveMigrationDependencies(migrations);
    return { nodes, edges, executionOrder };
}
function createMigrationBranch(branchName, baseMigration, migrations) {
    return {
        name: branchName,
        baseMigration,
        migrations: [],
        createdAt: new Date()
    };
}
function addMigrationToBranch(branch, migration) {
    return {
        ...branch,
        migrations: [...branch.migrations, migration.id]
    };
}
async function mergeMigrationBranches(sourceBranch, targetBranch, migrations) {
    const conflicts = detectBranchConflicts(sourceBranch, targetBranch, migrations);
    const mergedBranch = {
        name: targetBranch.name,
        baseMigration: targetBranch.baseMigration,
        migrations: [...targetBranch.migrations, ...sourceBranch.migrations],
        createdAt: targetBranch.createdAt,
        mergedAt: new Date(),
        mergedInto: targetBranch.name
    };
    return { mergedBranch, conflicts };
}
function detectBranchConflicts(branch1, branch2, migrations) {
    const conflicts = [];
    const migMap = new Map(migrations.map(m => [m.id, m]));
    for (const mig1Id of branch1.migrations) {
        for (const mig2Id of branch2.migrations) {
            const mig1 = migMap.get(mig1Id);
            const mig2 = migMap.get(mig2Id);
            if (!mig1 || !mig2)
                continue;
            if (mig1.conflicts.includes(mig2Id) || mig2.conflicts.includes(mig1Id)) {
                conflicts.push({
                    migration1: mig1Id,
                    migration2: mig2Id,
                    conflictType: 'table',
                    resource: 'unknown',
                    description: `Migrations ${mig1Id} and ${mig2Id} conflict`
                });
            }
        }
    }
    return conflicts;
}
async function rebaseMigrationBranch(branch, newBase, migrations) {
    const rebasedBranch = {
        ...branch,
        baseMigration: newBase
    };
    return rebasedBranch;
}
function listMigrationBranches(branches) {
    return branches.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
function canMergeBranch(sourceBranch, targetBranch, migrations) {
    const conflicts = detectBranchConflicts(sourceBranch, targetBranch, migrations);
    return {
        canMerge: conflicts.length === 0,
        conflicts
    };
}
function detectSchemaConflicts(migration1, migration2) {
    const conflicts = [];
    if (migration1.conflicts.includes(migration2.id)) {
        conflicts.push({
            migration1: migration1.id,
            migration2: migration2.id,
            conflictType: 'table',
            resource: 'shared_table',
            description: 'Both migrations modify the same table'
        });
    }
    return conflicts;
}
function autoResolveConflicts(conflicts) {
    const resolved = [];
    const unresolved = [];
    for (const conflict of conflicts) {
        if (conflict.conflictType === 'index' || conflict.conflictType === 'constraint') {
            resolved.push({ ...conflict, resolution: 'auto' });
        }
        else {
            unresolved.push(conflict);
        }
    }
    return { resolved, unresolved };
}
function validateConflictResolution(conflict, resolution) {
    const errors = [];
    if (!resolution || resolution.trim() === '') {
        errors.push('Resolution cannot be empty');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
function generateConflictReport(conflicts) {
    let report = '=== Migration Conflict Report ===\n\n';
    if (conflicts.length === 0) {
        report += 'No conflicts detected.\n';
        return report;
    }
    report += `Found ${conflicts.length} conflicts:\n\n`;
    for (const conflict of conflicts) {
        report += `Conflict: ${conflict.migration1} <-> ${conflict.migration2}\n`;
        report += `  Type: ${conflict.conflictType}\n`;
        report += `  Resource: ${conflict.resource}\n`;
        report += `  Description: ${conflict.description}\n`;
        if (conflict.resolution) {
            report += `  Resolution: ${conflict.resolution}\n`;
        }
        report += '\n';
    }
    return report;
}
function canRunInParallel(migration1, migration2) {
    if (migration1.conflicts.includes(migration2.id))
        return false;
    if (migration2.conflicts.includes(migration1.id))
        return false;
    if (migration1.dependencies.includes(migration2.id))
        return false;
    if (migration2.dependencies.includes(migration1.id))
        return false;
    return true;
}
function findParallelExecutionGroups(migrations) {
    const groups = [];
    const remaining = [...migrations];
    while (remaining.length > 0) {
        const group = [];
        const toRemove = [];
        for (let i = 0; i < remaining.length; i++) {
            const mig = remaining[i];
            const canAdd = group.every(g => canRunInParallel(g, mig));
            if (canAdd) {
                group.push(mig);
                toRemove.push(i);
            }
        }
        toRemove.reverse().forEach(i => remaining.splice(i, 1));
        if (group.length > 0)
            groups.push(group);
    }
    return groups;
}
function suggestConflictResolution(conflict) {
    const suggestions = [];
    switch (conflict.conflictType) {
        case 'table':
            suggestions.push('Merge migrations into single migration');
            suggestions.push('Reorder migrations to eliminate conflict');
            suggestions.push('Split table modifications across branches');
            break;
        case 'column':
            suggestions.push('Use different column names');
            suggestions.push('Create column in one migration, modify in another');
            break;
        case 'index':
            suggestions.push('Drop and recreate index in separate migrations');
            suggestions.push('Use different index names');
            break;
    }
    return suggestions;
}
async function createMigrationCheckpoint(sequelize, name, migrations) {
    const checkpoint = {
        id: crypto.randomBytes(16).toString('hex'),
        name,
        migrations: migrations.filter(m => m.status === 'completed').map(m => m.id),
        schemaSnapshot: await captureSchemaSnapshot(sequelize),
        createdAt: new Date(),
        canRollbackTo: true
    };
    await saveCheckpoint(sequelize, checkpoint);
    return checkpoint;
}
async function captureSchemaSnapshot(sequelize) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [tables] = await sequelize.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `, { type: sequelize_1.QueryTypes.SELECT });
        return { tables, timestamp: new Date() };
    }
    return {};
}
async function saveCheckpoint(sequelize, checkpoint) {
    await sequelize.query(`
    INSERT INTO "MigrationCheckpoints" (id, name, migrations, "schemaSnapshot", "createdAt")
    VALUES (:id, :name, :migrations, :schemaSnapshot, :createdAt)
  `, {
        replacements: {
            id: checkpoint.id,
            name: checkpoint.name,
            migrations: JSON.stringify(checkpoint.migrations),
            schemaSnapshot: JSON.stringify(checkpoint.schemaSnapshot),
            createdAt: checkpoint.createdAt
        }
    });
}
async function listCheckpoints(sequelize) {
    const [results] = await sequelize.query(`
    SELECT * FROM "MigrationCheckpoints"
    ORDER BY "createdAt" DESC
  `, { type: sequelize_1.QueryTypes.SELECT });
    return results.map((r) => ({
        id: r.id,
        name: r.name,
        migrations: JSON.parse(r.migrations),
        schemaSnapshot: JSON.parse(r.schemaSnapshot),
        createdAt: new Date(r.createdAt),
        canRollbackTo: true
    }));
}
async function rollbackToCheckpoint(sequelize, checkpointId, migrations) {
    const checkpoints = await listCheckpoints(sequelize);
    const checkpoint = checkpoints.find(c => c.id === checkpointId);
    if (!checkpoint) {
        throw new Error(`Checkpoint ${checkpointId} not found`);
    }
    const migrationsToRollback = migrations
        .filter(m => !checkpoint.migrations.includes(m.id))
        .reverse();
    for (const mig of migrationsToRollback) {
        const transaction = await sequelize.transaction();
        try {
            await mig.downFunction(sequelize.getQueryInterface(), transaction);
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
async function validateCheckpoint(sequelize, checkpoint) {
    const errors = [];
    const currentSchema = await captureSchemaSnapshot(sequelize);
    if (JSON.stringify(currentSchema) !== JSON.stringify(checkpoint.schemaSnapshot)) {
        errors.push('Schema has diverged from checkpoint');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
async function cleanupOldCheckpoints(sequelize, retentionDays = 30) {
    const [result] = await sequelize.query(`
    DELETE FROM "MigrationCheckpoints"
    WHERE "createdAt" < NOW() - INTERVAL ':days days'
    RETURNING id
  `, {
        replacements: { days: retentionDays },
        type: sequelize_1.QueryTypes.DELETE
    });
    return Array.isArray(result) ? result.length : 0;
}
function compareCheckpoints(checkpoint1, checkpoint2) {
    const set1 = new Set(checkpoint1.migrations);
    const set2 = new Set(checkpoint2.migrations);
    const addedMigrations = checkpoint2.migrations.filter(m => !set1.has(m));
    const removedMigrations = checkpoint1.migrations.filter(m => !set2.has(m));
    return { addedMigrations, removedMigrations };
}
async function tagSchemaVersion(sequelize, version, description) {
    await sequelize.query(`
    INSERT INTO "SchemaVersions" (version, description, "createdAt")
    VALUES (:version, :description, NOW())
  `, {
        replacements: { version, description }
    });
}
async function getCurrentSchemaVersion(sequelize) {
    const [results] = await sequelize.query(`
    SELECT version FROM "SchemaVersions"
    ORDER BY "createdAt" DESC
    LIMIT 1
  `, { type: sequelize_1.QueryTypes.SELECT });
    return results.length > 0 ? results[0].version : '0.0.0';
}
async function listSchemaVersions(sequelize) {
    const [results] = await sequelize.query(`
    SELECT version, description, "createdAt"
    FROM "SchemaVersions"
    ORDER BY "createdAt" DESC
  `, { type: sequelize_1.QueryTypes.SELECT });
    return results;
}
function compareVersions(version1, version2) {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1 = v1Parts[i] || 0;
        const v2 = v2Parts[i] || 0;
        if (v1 !== v2)
            return v1 - v2;
    }
    return 0;
}
function incrementVersion(currentVersion, incrementType) {
    const parts = currentVersion.split('.').map(Number);
    switch (incrementType) {
        case 'major':
            return `${parts[0] + 1}.0.0`;
        case 'minor':
            return `${parts[0]}.${parts[1] + 1}.0`;
        case 'patch':
            return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
    }
}
function validateVersionFormat(version) {
    return /^\d+\.\d+\.\d+$/.test(version);
}
function getMigrationsForVersionRange(migrations, fromVersion, toVersion) {
    return migrations.filter(m => {
        const migVersion = m.version;
        return compareVersions(migVersion, fromVersion) >= 0 &&
            compareVersions(migVersion, toVersion) <= 0;
    });
}
async function executeParallelMigrations(sequelize, migrations) {
    const batches = getMigrationExecutionBatches(migrations);
    for (const batch of batches) {
        await Promise.all(batch.map(async (migId) => {
            const mig = migrations.find(m => m.id === migId);
            if (!mig)
                return;
            const transaction = await sequelize.transaction();
            try {
                await mig.upFunction(sequelize.getQueryInterface(), transaction);
                mig.status = 'completed';
                await transaction.commit();
            }
            catch (error) {
                mig.status = 'failed';
                await transaction.rollback();
                throw error;
            }
        }));
    }
}
function monitorParallelExecution(migrations) {
    const completed = migrations.filter(m => m.status === 'completed').length;
    const running = migrations.filter(m => m.status === 'running').length;
    const failed = migrations.filter(m => m.status === 'failed').length;
    return {
        completed,
        running,
        failed,
        total: migrations.length
    };
}
async function cancelParallelMigrations(migrations) {
    for (const mig of migrations) {
        if (mig.status === 'running') {
            mig.status = 'failed';
        }
    }
}
function calculateMigrationChecksum(migration) {
    const content = migration.upFunction.toString() + migration.downFunction.toString();
    return crypto.createHash('sha256').update(content).digest('hex');
}
function validateMigrationChecksums(migrations, storedChecksums) {
    const changed = [];
    for (const mig of migrations) {
        const currentChecksum = calculateMigrationChecksum(mig);
        const storedChecksum = storedChecksums.get(mig.id);
        if (storedChecksum && storedChecksum !== currentChecksum) {
            changed.push(mig.id);
        }
    }
    return {
        valid: changed.length === 0,
        changed
    };
}
let MigrationVersionControlService = class MigrationVersionControlService extends base_1.BaseService {
    constructor() {
        super("MigrationVersionControlService");
    }
    resolveMigrationDependencies = resolveMigrationDependencies;
    detectCircularDependencies = detectCircularDependencies;
    validateMigrationDependencies = validateMigrationDependencies;
    createMigrationBranch = createMigrationBranch;
    mergeMigrationBranches = mergeMigrationBranches;
    detectSchemaConflicts = detectSchemaConflicts;
    createMigrationCheckpoint = createMigrationCheckpoint;
    rollbackToCheckpoint = rollbackToCheckpoint;
    tagSchemaVersion = tagSchemaVersion;
    executeParallelMigrations = executeParallelMigrations;
};
exports.MigrationVersionControlService = MigrationVersionControlService;
exports.MigrationVersionControlService = MigrationVersionControlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MigrationVersionControlService);
exports.default = {
    resolveMigrationDependencies,
    detectCircularDependencies,
    validateMigrationDependencies,
    getMigrationExecutionBatches,
    calculateMigrationDepth,
    findMigrationChains,
    optimizeMigrationOrder,
    generateDependencyGraph,
    createMigrationBranch,
    addMigrationToBranch,
    mergeMigrationBranches,
    detectBranchConflicts,
    rebaseMigrationBranch,
    listMigrationBranches,
    canMergeBranch,
    detectSchemaConflicts,
    autoResolveConflicts,
    validateConflictResolution,
    generateConflictReport,
    canRunInParallel,
    findParallelExecutionGroups,
    suggestConflictResolution,
    createMigrationCheckpoint,
    listCheckpoints,
    rollbackToCheckpoint,
    validateCheckpoint,
    cleanupOldCheckpoints,
    compareCheckpoints,
    tagSchemaVersion,
    getCurrentSchemaVersion,
    listSchemaVersions,
    compareVersions,
    incrementVersion,
    validateVersionFormat,
    getMigrationsForVersionRange,
    executeParallelMigrations,
    monitorParallelExecution,
    cancelParallelMigrations,
    calculateMigrationChecksum,
    validateMigrationChecksums,
    MigrationVersionControlService
};
//# sourceMappingURL=migration-version-control.service.js.map
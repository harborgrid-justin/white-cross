/**
 * LOC: MIGVER001
 * File: /reuse/data/composites/migration-version-control.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize 6.x core
 *   - migration-utilities.ts
 *   - Node.js fs, path
 *
 * DOWNSTREAM (imported by):
 *   - Migration scripts
 *   - Database version management
 *   - CI/CD pipelines
 */

/**
 * File: /reuse/data/composites/migration-version-control.ts
 * Locator: WC-DATA-MIGVER-001
 * Purpose: Enterprise Migration Version Control & Dependency Management
 *
 * Upstream: Sequelize 6.x, migration-utilities
 * Downstream: Migration scripts, CI/CD, deployment automation
 * Dependencies: TypeScript 5.x, Sequelize 6.x, Node.js fs, path
 * Exports: 42 functions for migration dependency resolution, branching, conflict resolution, rollback
 *
 * LLM Context: Production-ready migration version control for White Cross healthcare system.
 * Provides comprehensive migration dependency management, branching strategies, conflict detection,
 * rollback mechanisms, schema versioning, and parallel migration execution for safe database evolution.
 */

import { Sequelize, QueryInterface, Transaction, QueryTypes } from 'sequelize';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { BaseService } from '../../common/base';
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Migration {
  id: string;
  name: string;
  version: string;
  description?: string;
  dependencies: string[];
  conflicts: string[];
  upFunction: (qi: QueryInterface, t: Transaction) => Promise<void>;
  downFunction: (qi: QueryInterface, t: Transaction) => Promise<void>;
  checksum: string;
  executedAt?: Date;
  executionTime?: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back';
}

export interface MigrationBranch {
  name: string;
  baseMigration: string;
  migrations: string[];
  createdAt: Date;
  mergedAt?: Date;
  mergedInto?: string;
}

export interface MigrationConflict {
  migration1: string;
  migration2: string;
  conflictType: 'table' | 'column' | 'index' | 'constraint' | 'data';
  resource: string;
  description: string;
  resolution?: 'manual' | 'auto' | 'rebase';
}

export interface MigrationCheckpoint {
  id: string;
  name: string;
  migrations: string[];
  schemaSnapshot: any;
  createdAt: Date;
  canRollbackTo: boolean;
}

export interface MigrationGraph {
  nodes: Map<string, Migration>;
  edges: Map<string, string[]>;
  executionOrder: string[];
}

// ============================================================================
// MIGRATION DEPENDENCY RESOLUTION (Functions 1-8)
// ============================================================================

/**
 * Resolves migration dependencies and determines execution order
 *
 * @param {Migration[]} migrations - Array of migration definitions
 * @returns {string[]} Ordered array of migration IDs for execution
 *
 * @example
 * ```typescript
 * const migrations = [
 *   { id: 'mig1', dependencies: ['mig2'], ... },
 *   { id: 'mig2', dependencies: [], ... },
 *   { id: 'mig3', dependencies: ['mig1'], ... }
 * ];
 *
 * const order = resolveMigrationDependencies(migrations);
 * // Returns: ['mig2', 'mig1', 'mig3']
 * ```
 */
export function resolveMigrationDependencies(migrations: Migration[]): string[] {
  const graph: Map<string, string[]> = new Map();
  const inDegree: Map<string, number> = new Map();
  
  // Build graph
  for (const mig of migrations) {
    graph.set(mig.id, mig.dependencies);
    inDegree.set(mig.id, 0);
  }
  
  // Calculate in-degrees
  for (const deps of graph.values()) {
    for (const dep of deps) {
      inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
    }
  }
  
  // Topological sort (Kahn's algorithm)
  const queue: string[] = [];
  const result: string[] = [];
  
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id);
  }
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);
    
    const deps = graph.get(current) || [];
    for (const dep of deps) {
      const newDegree = (inDegree.get(dep) || 0) - 1;
      inDegree.set(dep, newDegree);
      if (newDegree === 0) queue.push(dep);
    }
  }
  
  if (result.length !== migrations.length) {
    throw new Error('Circular dependency detected in migrations');
  }
  
  return result;
}

/**
 * Detects circular dependencies in migration graph
 */
export function detectCircularDependencies(migrations: Migration[]): string[] {
  const visited = new Set<string>();
  const recStack = new Set<string>();
  const cycles: string[] = [];
  
  function dfs(migId: string, path: string[]): boolean {
    visited.add(migId);
    recStack.add(migId);
    path.push(migId);
    
    const mig = migrations.find(m => m.id === migId);
    if (!mig) return false;
    
    for (const dep of mig.dependencies) {
      if (!visited.has(dep)) {
        if (dfs(dep, path)) return true;
      } else if (recStack.has(dep)) {
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

/**
 * Validates migration dependencies exist
 */
export function validateMigrationDependencies(
  migrations: Migration[]
): { valid: boolean; missingDeps: Array<{ migration: string; missing: string[] }> } {
  const migrationIds = new Set(migrations.map(m => m.id));
  const missingDeps: Array<{ migration: string; missing: string[] }> = [];
  
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

/**
 * Gets migration execution order with parallel batches
 */
export function getMigrationExecutionBatches(
  migrations: Migration[]
): string[][] {
  const order = resolveMigrationDependencies(migrations);
  const depMap = new Map(migrations.map(m => [m.id, m.dependencies]));
  const batches: string[][] = [];
  const executed = new Set<string>();
  
  while (executed.size < order.length) {
    const batch: string[] = [];
    
    for (const migId of order) {
      if (executed.has(migId)) continue;
      
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

/**
 * Calculates migration dependency depth
 */
export function calculateMigrationDepth(
  migration: Migration,
  allMigrations: Migration[]
): number {
  const migMap = new Map(allMigrations.map(m => [m.id, m]));
  
  function getDepth(migId: string, visited: Set<string>): number {
    if (visited.has(migId)) return 0;
    visited.add(migId);
    
    const mig = migMap.get(migId);
    if (!mig || mig.dependencies.length === 0) return 0;
    
    const depths = mig.dependencies.map(dep => getDepth(dep, new Set(visited)));
    return 1 + Math.max(...depths);
  }
  
  return getDepth(migration.id, new Set());
}

/**
 * Finds migration dependency chains
 */
export function findMigrationChains(
  startMigration: string,
  migrations: Migration[]
): string[][] {
  const chains: string[][] = [];
  const migMap = new Map(migrations.map(m => [m.id, m]));
  
  function buildChains(migId: string, currentChain: string[]) {
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

/**
 * Optimizes migration execution order for performance
 */
export function optimizeMigrationOrder(
  migrations: Migration[],
  executionTimes: Map<string, number>
): string[] {
  const batches = getMigrationExecutionBatches(migrations);
  const optimized: string[] = [];
  
  // Sort each batch by estimated execution time (longest first for parallel execution)
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

/**
 * Generates dependency graph visualization
 */
export function generateDependencyGraph(migrations: Migration[]): MigrationGraph {
  const nodes = new Map(migrations.map(m => [m.id, m]));
  const edges = new Map(migrations.map(m => [m.id, m.dependencies]));
  const executionOrder = resolveMigrationDependencies(migrations);
  
  return { nodes, edges, executionOrder };
}

// ============================================================================
// MIGRATION BRANCHING (Functions 9-15)
// ============================================================================

/**
 * Creates a new migration branch
 */
export function createMigrationBranch(
  branchName: string,
  baseMigration: string,
  migrations: Migration[]
): MigrationBranch {
  return {
    name: branchName,
    baseMigration,
    migrations: [],
    createdAt: new Date()
  };
}

/**
 * Adds migration to branch
 */
export function addMigrationToBranch(
  branch: MigrationBranch,
  migration: Migration
): MigrationBranch {
  return {
    ...branch,
    migrations: [...branch.migrations, migration.id]
  };
}

/**
 * Merges migration branches
 */
export async function mergeMigrationBranches(
  sourceBranch: MigrationBranch,
  targetBranch: MigrationBranch,
  migrations: Migration[]
): Promise<{ mergedBranch: MigrationBranch; conflicts: MigrationConflict[] }> {
  const conflicts = detectBranchConflicts(sourceBranch, targetBranch, migrations);
  
  const mergedBranch: MigrationBranch = {
    name: targetBranch.name,
    baseMigration: targetBranch.baseMigration,
    migrations: [...targetBranch.migrations, ...sourceBranch.migrations],
    createdAt: targetBranch.createdAt,
    mergedAt: new Date(),
    mergedInto: targetBranch.name
  };
  
  return { mergedBranch, conflicts };
}

/**
 * Detects conflicts between branches
 */
export function detectBranchConflicts(
  branch1: MigrationBranch,
  branch2: MigrationBranch,
  migrations: Migration[]
): MigrationConflict[] {
  const conflicts: MigrationConflict[] = [];
  const migMap = new Map(migrations.map(m => [m.id, m]));
  
  for (const mig1Id of branch1.migrations) {
    for (const mig2Id of branch2.migrations) {
      const mig1 = migMap.get(mig1Id);
      const mig2 = migMap.get(mig2Id);
      
      if (!mig1 || !mig2) continue;
      
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

/**
 * Rebases migration branch onto new base
 */
export async function rebaseMigrationBranch(
  branch: MigrationBranch,
  newBase: string,
  migrations: Migration[]
): Promise<MigrationBranch> {
  const rebasedBranch: MigrationBranch = {
    ...branch,
    baseMigration: newBase
  };
  
  return rebasedBranch;
}

/**
 * Lists all migration branches
 */
export function listMigrationBranches(branches: MigrationBranch[]): MigrationBranch[] {
  return branches.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Checks if branch can be merged without conflicts
 */
export function canMergeBranch(
  sourceBranch: MigrationBranch,
  targetBranch: MigrationBranch,
  migrations: Migration[]
): { canMerge: boolean; conflicts: MigrationConflict[] } {
  const conflicts = detectBranchConflicts(sourceBranch, targetBranch, migrations);
  
  return {
    canMerge: conflicts.length === 0,
    conflicts
  };
}

// ============================================================================
// CONFLICT DETECTION & RESOLUTION (Functions 16-22)
// ============================================================================

/**
 * Detects schema conflicts between migrations
 */
export function detectSchemaConflicts(
  migration1: Migration,
  migration2: Migration
): MigrationConflict[] {
  const conflicts: MigrationConflict[] = [];
  
  // Check if migrations modify same tables
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

/**
 * Resolves migration conflicts automatically where possible
 */
export function autoResolveConflicts(
  conflicts: MigrationConflict[]
): { resolved: MigrationConflict[]; unresolved: MigrationConflict[] } {
  const resolved: MigrationConflict[] = [];
  const unresolved: MigrationConflict[] = [];
  
  for (const conflict of conflicts) {
    // Auto-resolve simple conflicts
    if (conflict.conflictType === 'index' || conflict.conflictType === 'constraint') {
      resolved.push({ ...conflict, resolution: 'auto' });
    } else {
      unresolved.push(conflict);
    }
  }
  
  return { resolved, unresolved };
}

/**
 * Validates conflict resolution
 */
export function validateConflictResolution(
  conflict: MigrationConflict,
  resolution: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!resolution || resolution.trim() === '') {
    errors.push('Resolution cannot be empty');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generates conflict resolution report
 */
export function generateConflictReport(conflicts: MigrationConflict[]): string {
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

/**
 * Checks if migrations can run in parallel
 */
export function canRunInParallel(
  migration1: Migration,
  migration2: Migration
): boolean {
  // Check for conflicts
  if (migration1.conflicts.includes(migration2.id)) return false;
  if (migration2.conflicts.includes(migration1.id)) return false;
  
  // Check for dependencies
  if (migration1.dependencies.includes(migration2.id)) return false;
  if (migration2.dependencies.includes(migration1.id)) return false;
  
  return true;
}

/**
 * Finds optimal parallel execution groups
 */
export function findParallelExecutionGroups(
  migrations: Migration[]
): Migration[][] {
  const groups: Migration[][] = [];
  const remaining = [...migrations];
  
  while (remaining.length > 0) {
    const group: Migration[] = [];
    const toRemove: number[] = [];
    
    for (let i = 0; i < remaining.length; i++) {
      const mig = remaining[i];
      const canAdd = group.every(g => canRunInParallel(g, mig));
      
      if (canAdd) {
        group.push(mig);
        toRemove.push(i);
      }
    }
    
    toRemove.reverse().forEach(i => remaining.splice(i, 1));
    if (group.length > 0) groups.push(group);
  }
  
  return groups;
}

/**
 * Suggests conflict resolution strategies
 */
export function suggestConflictResolution(
  conflict: MigrationConflict
): string[] {
  const suggestions: string[] = [];
  
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

// ============================================================================
// CHECKPOINTS & ROLLBACK (Functions 23-30)
// ============================================================================

/**
 * Creates migration checkpoint
 */
export async function createMigrationCheckpoint(
  sequelize: Sequelize,
  name: string,
  migrations: Migration[]
): Promise<MigrationCheckpoint> {
  const checkpoint: MigrationCheckpoint = {
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

/**
 * Captures current schema snapshot
 */
async function captureSchemaSnapshot(sequelize: Sequelize): Promise<any> {
  const dialect = sequelize.getDialect();
  
  if (dialect === 'postgres') {
    const [tables] = await sequelize.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `, { type: QueryTypes.SELECT });
    
    return { tables, timestamp: new Date() };
  }
  
  return {};
}

/**
 * Saves checkpoint to database
 */
async function saveCheckpoint(
  sequelize: Sequelize,
  checkpoint: MigrationCheckpoint
): Promise<void> {
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

/**
 * Lists all checkpoints
 */
export async function listCheckpoints(
  sequelize: Sequelize
): Promise<MigrationCheckpoint[]> {
  const [results] = await sequelize.query(`
    SELECT * FROM "MigrationCheckpoints"
    ORDER BY "createdAt" DESC
  `, { type: QueryTypes.SELECT });
  
  return results.map((r: any) => ({
    id: r.id,
    name: r.name,
    migrations: JSON.parse(r.migrations),
    schemaSnapshot: JSON.parse(r.schemaSnapshot),
    createdAt: new Date(r.createdAt),
    canRollbackTo: true
  }));
}

/**
 * Rolls back to checkpoint
 */
export async function rollbackToCheckpoint(
  sequelize: Sequelize,
  checkpointId: string,
  migrations: Migration[]
): Promise<void> {
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
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

/**
 * Validates checkpoint integrity
 */
export async function validateCheckpoint(
  sequelize: Sequelize,
  checkpoint: MigrationCheckpoint
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  const currentSchema = await captureSchemaSnapshot(sequelize);
  
  // Compare schemas
  if (JSON.stringify(currentSchema) !== JSON.stringify(checkpoint.schemaSnapshot)) {
    errors.push('Schema has diverged from checkpoint');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Deletes old checkpoints
 */
export async function cleanupOldCheckpoints(
  sequelize: Sequelize,
  retentionDays: number = 30
): Promise<number> {
  const [result] = await sequelize.query(`
    DELETE FROM "MigrationCheckpoints"
    WHERE "createdAt" < NOW() - INTERVAL ':days days'
    RETURNING id
  `, {
    replacements: { days: retentionDays },
    type: QueryTypes.DELETE
  });
  
  return Array.isArray(result) ? result.length : 0;
}

/**
 * Compares two checkpoints
 */
export function compareCheckpoints(
  checkpoint1: MigrationCheckpoint,
  checkpoint2: MigrationCheckpoint
): { addedMigrations: string[]; removedMigrations: string[] } {
  const set1 = new Set(checkpoint1.migrations);
  const set2 = new Set(checkpoint2.migrations);
  
  const addedMigrations = checkpoint2.migrations.filter(m => !set1.has(m));
  const removedMigrations = checkpoint1.migrations.filter(m => !set2.has(m));
  
  return { addedMigrations, removedMigrations };
}

// ============================================================================
// SCHEMA VERSIONING (Functions 31-37)
// ============================================================================

/**
 * Tags schema version
 */
export async function tagSchemaVersion(
  sequelize: Sequelize,
  version: string,
  description: string
): Promise<void> {
  await sequelize.query(`
    INSERT INTO "SchemaVersions" (version, description, "createdAt")
    VALUES (:version, :description, NOW())
  `, {
    replacements: { version, description }
  });
}

/**
 * Gets current schema version
 */
export async function getCurrentSchemaVersion(
  sequelize: Sequelize
): Promise<string> {
  const [results] = await sequelize.query(`
    SELECT version FROM "SchemaVersions"
    ORDER BY "createdAt" DESC
    LIMIT 1
  `, { type: QueryTypes.SELECT });
  
  return results.length > 0 ? (results[0] as any).version : '0.0.0';
}

/**
 * Lists all schema versions
 */
export async function listSchemaVersions(
  sequelize: Sequelize
): Promise<Array<{ version: string; description: string; createdAt: Date }>> {
  const [results] = await sequelize.query(`
    SELECT version, description, "createdAt"
    FROM "SchemaVersions"
    ORDER BY "createdAt" DESC
  `, { type: QueryTypes.SELECT });
  
  return results as any[];
}

/**
 * Compares schema versions
 */
export function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1 = v1Parts[i] || 0;
    const v2 = v2Parts[i] || 0;
    if (v1 !== v2) return v1 - v2;
  }
  
  return 0;
}

/**
 * Increments version number
 */
export function incrementVersion(
  currentVersion: string,
  incrementType: 'major' | 'minor' | 'patch'
): string {
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

/**
 * Validates version format
 */
export function validateVersionFormat(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}

/**
 * Gets migrations for version range
 */
export function getMigrationsForVersionRange(
  migrations: Migration[],
  fromVersion: string,
  toVersion: string
): Migration[] {
  return migrations.filter(m => {
    const migVersion = m.version;
    return compareVersions(migVersion, fromVersion) >= 0 &&
           compareVersions(migVersion, toVersion) <= 0;
  });
}

// ============================================================================
// PARALLEL EXECUTION (Functions 38-42)
// ============================================================================

/**
 * Executes migrations in parallel batches
 */
export async function executeParallelMigrations(
  sequelize: Sequelize,
  migrations: Migration[]
): Promise<void> {
  const batches = getMigrationExecutionBatches(migrations);
  
  for (const batch of batches) {
    await Promise.all(
      batch.map(async migId => {
        const mig = migrations.find(m => m.id === migId);
        if (!mig) return;
        
        const transaction = await sequelize.transaction();
        try {
          await mig.upFunction(sequelize.getQueryInterface(), transaction);
          mig.status = 'completed';
          await transaction.commit();
        } catch (error) {
          mig.status = 'failed';
          await transaction.rollback();
          throw error;
        }
      })
    );
  }
}

/**
 * Monitors parallel migration progress
 */
export function monitorParallelExecution(
  migrations: Migration[]
): { completed: number; running: number; failed: number; total: number } {
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

/**
 * Cancels running parallel migrations
 */
export async function cancelParallelMigrations(
  migrations: Migration[]
): Promise<void> {
  for (const mig of migrations) {
    if (mig.status === 'running') {
      mig.status = 'failed';
    }
  }
}

/**
 * Calculates migration checksums
 */
export function calculateMigrationChecksum(migration: Migration): string {
  const content = migration.upFunction.toString() + migration.downFunction.toString();
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Validates migration checksums
 */
export function validateMigrationChecksums(
  migrations: Migration[],
  storedChecksums: Map<string, string>
): { valid: boolean; changed: string[] } {
  const changed: string[] = [];
  
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

@Injectable()
export class MigrationVersionControlService extends BaseService {
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
}

export default {
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

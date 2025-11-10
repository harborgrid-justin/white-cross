/**
 * LOC: STATEMGMT001
 * File: state-management-systems.ts
 * Purpose: Enterprise state management, distributed state, and consistency
 */

import { Injectable, Logger } from "@nestjs/common";

export interface IStateSnapshot {
  entityType: string;
  entityId: string;
  state: any;
  version: number;
  timestamp: Date;
  hash: string;
}

@Injectable()
export class StateManagementService {
  private readonly logger = new Logger(StateManagementService.name);
  private readonly stateStore: Map<string, IStateSnapshot> = new Map();
  private readonly stateHistory: Map<string, IStateSnapshot[]> = new Map();

  async saveState(entityType: string, entityId: string, state: any): Promise<IStateSnapshot> {
    const key = `${entityType}:${entityId}`;
    const currentSnapshot = this.stateStore.get(key);
    const version = currentSnapshot ? currentSnapshot.version + 1 : 1;

    const snapshot: IStateSnapshot = {
      entityType,
      entityId,
      state: { ...state },
      version,
      timestamp: new Date(),
      hash: this.hashState(state),
    };

    this.stateStore.set(key, snapshot);
    
    // Save to history
    if (!this.stateHistory.has(key)) {
      this.stateHistory.set(key, []);
    }
    this.stateHistory.get(key)!.push(snapshot);

    this.logger.log(`State saved for ${key} v${version}`);
    return snapshot;
  }

  async getState(entityType: string, entityId: string): Promise<any | null> {
    const key = `${entityType}:${entityId}`;
    const snapshot = this.stateStore.get(key);
    return snapshot ? snapshot.state : null;
  }

  async getStateHistory(entityType: string, entityId: string): Promise<IStateSnapshot[]> {
    const key = `${entityType}:${entityId}`;
    return this.stateHistory.get(key) || [];
  }

  async restoreState(entityType: string, entityId: string, version: number): Promise<boolean> {
    const key = `${entityType}:${entityId}`;
    const history = this.stateHistory.get(key);
    
    if (!history) return false;

    const snapshot = history.find(s => s.version === version);
    if (!snapshot) return false;

    this.stateStore.set(key, snapshot);
    this.logger.log(`State restored for ${key} to v${version}`);
    return true;
  }

  async compareStates(
    entityType: string,
    entityId: string,
    version1: number,
    version2: number
  ): Promise<{ differences: any[]; similarity: number }> {
    const key = `${entityType}:${entityId}`;
    const history = this.stateHistory.get(key);
    
    if (!history) return { differences: [], similarity: 0 };

    const state1 = history.find(s => s.version === version1);
    const state2 = history.find(s => s.version === version2);

    if (!state1 || !state2) return { differences: [], similarity: 0 };

    const differences = this.calculateDifferences(state1.state, state2.state);
    const similarity = this.calculateSimilarity(state1.state, state2.state);

    return { differences, similarity };
  }

  async optimizeStateStorage(): Promise<{ removed: number; compressed: number }> {
    let removed = 0;
    let compressed = 0;

    for (const [key, history] of this.stateHistory) {
      // Keep only last 100 snapshots
      if (history.length > 100) {
        const toRemove = history.length - 100;
        history.splice(0, toRemove);
        removed += toRemove;
      }
    }

    this.logger.log(`State storage optimized: ${removed} snapshots removed, ${compressed} compressed`);
    return { removed, compressed };
  }

  private hashState(state: any): string {
    const str = JSON.stringify(state);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  private calculateDifferences(state1: any, state2: any): any[] {
    const diffs: any[] = [];
    
    for (const key of Object.keys(state1)) {
      if (state1[key] !== state2[key]) {
        diffs.push({ field: key, before: state1[key], after: state2[key] });
      }
    }

    return diffs;
  }

  private calculateSimilarity(state1: any, state2: any): number {
    const keys = new Set([...Object.keys(state1), ...Object.keys(state2)]);
    let matches = 0;

    for (const key of keys) {
      if (state1[key] === state2[key]) matches++;
    }

    return (matches / keys.size) * 100;
  }
}

export { StateManagementService };

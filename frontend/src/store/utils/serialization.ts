/**
 * Serialization utilities for state persistence and clipboard
 */

import type { ComponentNode, StateSnapshot } from '../types';

/**
 * Serialize components for clipboard or storage
 */
export function serializeComponents(components: ComponentNode[]): string {
  try {
    return JSON.stringify(components);
  } catch (error) {
    console.error('Failed to serialize components:', error);
    return '[]';
  }
}

/**
 * Deserialize components from clipboard or storage
 */
export function deserializeComponents(serialized: string): ComponentNode[] {
  try {
    const parsed = JSON.parse(serialized);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to deserialize components:', error);
    return [];
  }
}

/**
 * Serialize state snapshot with compression
 */
export function serializeSnapshot(snapshot: StateSnapshot): string {
  try {
    // In a production app, you might want to use a compression library here
    return JSON.stringify(snapshot);
  } catch (error) {
    console.error('Failed to serialize snapshot:', error);
    throw error;
  }
}

/**
 * Deserialize state snapshot
 */
export function deserializeSnapshot(serialized: string): StateSnapshot | null {
  try {
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to deserialize snapshot:', error);
    return null;
  }
}

/**
 * Estimate the size of a serialized object in bytes
 */
export function estimateSize(obj: any): number {
  try {
    const serialized = JSON.stringify(obj);
    return new Blob([serialized]).size;
  } catch {
    return 0;
  }
}

/**
 * Check if state size is within limits
 */
export function isWithinSizeLimit(
  obj: any,
  limitInMB: number = 10
): boolean {
  const sizeInBytes = estimateSize(obj);
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return sizeInMB <= limitInMB;
}

/**
 * @fileoverview Service Dependency Management
 * @module services/core/ServiceDependencyManager
 * @category Services
 *
 * Manages service dependencies and relationships in the registry.
 * Tracks which services depend on others, validates dependency satisfaction,
 * detects circular dependencies, and manages critical service flags.
 *
 * Key Features:
 * - Dependency graph tracking (forward and reverse)
 * - Dependency validation and satisfaction checks
 * - Circular dependency detection
 * - Critical service identification
 * - Dependency impact analysis
 *
 * @exports ServiceDependencyManager
 */

import type {
  ServiceDependency,
  DependencyCheckResult,
  ServiceCategory,
  ServiceHealth
} from './ServiceRegistry.types';

// ==========================================
// SERVICE DEPENDENCY MANAGER CLASS
// ==========================================

/**
 * Manages dependencies between registered services
 */
export class ServiceDependencyManager {
  private dependencies: Map<string, ServiceDependency> = new Map();

  /**
   * Register dependencies for a service
   */
  public registerDependencies(
    serviceId: string,
    dependsOn: string[],
    category: ServiceCategory
  ): void {
    if (!dependsOn || dependsOn.length === 0) return;

    // Determine if this is a critical service based on category
    const criticalDependency = category === 'HEALTH' || category === 'STUDENT';

    // Create or update dependency entry
    this.dependencies.set(serviceId, {
      serviceId,
      dependsOn,
      requiredFor: [],
      criticalDependency
    });

    // Update reverse dependencies
    dependsOn.forEach(dep => {
      const depInfo = this.dependencies.get(dep);
      if (depInfo) {
        if (!depInfo.requiredFor.includes(serviceId)) {
          depInfo.requiredFor.push(serviceId);
        }
      } else {
        // Create stub for dependency that may not be registered yet
        this.dependencies.set(dep, {
          serviceId: dep,
          dependsOn: [],
          requiredFor: [serviceId],
          criticalDependency: false
        });
      }
    });
  }

  /**
   * Check if service dependencies are satisfied
   */
  public checkDependencies(
    serviceId: string,
    registeredServices: Set<string>,
    healthMap: Map<string, ServiceHealth>
  ): DependencyCheckResult {
    const deps = this.dependencies.get(serviceId);
    if (!deps || deps.dependsOn.length === 0) {
      return { satisfied: true, missing: [] };
    }

    const missing: string[] = [];

    deps.dependsOn.forEach(dep => {
      // Check if dependency is registered
      if (!registeredServices.has(dep)) {
        missing.push(dep);
      } else {
        // Check if dependency is healthy
        const health = healthMap.get(dep);
        if (health && health.status === 'UNHEALTHY') {
          missing.push(`${dep} (unhealthy)`);
        }
      }
    });

    return {
      satisfied: missing.length === 0,
      missing
    };
  }

  /**
   * Get dependency information for a service
   */
  public getDependencies(serviceId: string): ServiceDependency | undefined {
    return this.dependencies.get(serviceId);
  }

  /**
   * Get full dependency graph
   */
  public getDependencyGraph(): Map<string, ServiceDependency> {
    return new Map(this.dependencies);
  }

  /**
   * Get all critical services
   */
  public getCriticalServices(): string[] {
    const critical: string[] = [];

    this.dependencies.forEach((dep, id) => {
      if (dep.criticalDependency) {
        critical.push(id);
      }
    });

    return critical;
  }

  /**
   * Check if a service can be safely unregistered
   */
  public canUnregister(serviceId: string): { canUnregister: boolean; blockers: string[] } {
    const deps = this.dependencies.get(serviceId);

    if (!deps || deps.requiredFor.length === 0) {
      return { canUnregister: true, blockers: [] };
    }

    return {
      canUnregister: false,
      blockers: deps.requiredFor
    };
  }

  /**
   * Detect circular dependencies in the dependency graph
   */
  public detectCircularDependencies(): Array<{ cycle: string[]; critical: boolean }> {
    const cycles: Array<{ cycle: string[]; critical: boolean }> = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const detectCycle = (serviceId: string, path: string[]): void => {
      if (recursionStack.has(serviceId)) {
        // Found a cycle
        const cycleStart = path.indexOf(serviceId);
        const cycle = path.slice(cycleStart);
        const critical = cycle.some(id => {
          const dep = this.dependencies.get(id);
          return dep?.criticalDependency || false;
        });
        cycles.push({ cycle, critical });
        return;
      }

      if (visited.has(serviceId)) return;

      visited.add(serviceId);
      recursionStack.add(serviceId);
      path.push(serviceId);

      const deps = this.dependencies.get(serviceId);
      if (deps) {
        deps.dependsOn.forEach(dep => detectCycle(dep, [...path]));
      }

      recursionStack.delete(serviceId);
    };

    // Check all services
    this.dependencies.forEach((_, serviceId) => {
      if (!visited.has(serviceId)) {
        detectCycle(serviceId, []);
      }
    });

    return cycles;
  }

  /**
   * Get services that depend on a given service
   */
  public getDependents(serviceId: string): string[] {
    const deps = this.dependencies.get(serviceId);
    return deps ? [...deps.requiredFor] : [];
  }

  /**
   * Get services that a given service depends on
   */
  public getDependenciesOf(serviceId: string): string[] {
    const deps = this.dependencies.get(serviceId);
    return deps ? [...deps.dependsOn] : [];
  }

  /**
   * Calculate dependency depth (longest chain to root)
   */
  public getDependencyDepth(serviceId: string): number {
    const visited = new Set<string>();

    const calculateDepth = (id: string): number => {
      if (visited.has(id)) return 0; // Prevent infinite loops
      visited.add(id);

      const deps = this.dependencies.get(id);
      if (!deps || deps.dependsOn.length === 0) return 0;

      const depths = deps.dependsOn.map(dep => calculateDepth(dep));
      return 1 + Math.max(...depths);
    };

    return calculateDepth(serviceId);
  }

  /**
   * Get dependency impact analysis
   */
  public getImpactAnalysis(serviceId: string): {
    directDependents: number;
    totalDependents: number;
    affectedServices: string[];
  } {
    const affectedServices = new Set<string>();

    const collectDependents = (id: string): void => {
      const deps = this.dependencies.get(id);
      if (!deps) return;

      deps.requiredFor.forEach(dependent => {
        if (!affectedServices.has(dependent)) {
          affectedServices.add(dependent);
          collectDependents(dependent);
        }
      });
    };

    collectDependents(serviceId);

    const deps = this.dependencies.get(serviceId);
    const directDependents = deps?.requiredFor.length || 0;

    return {
      directDependents,
      totalDependents: affectedServices.size,
      affectedServices: Array.from(affectedServices)
    };
  }

  /**
   * Unregister a service's dependencies
   */
  public unregisterService(serviceId: string): void {
    // Remove from other services' requiredFor lists
    const deps = this.dependencies.get(serviceId);
    if (deps) {
      deps.dependsOn.forEach(dep => {
        const depInfo = this.dependencies.get(dep);
        if (depInfo) {
          depInfo.requiredFor = depInfo.requiredFor.filter(r => r !== serviceId);
        }
      });
    }

    // Remove the service's dependency entry
    this.dependencies.delete(serviceId);

    // Clean up any remaining references
    this.dependencies.forEach(dep => {
      dep.dependsOn = dep.dependsOn.filter(d => d !== serviceId);
      dep.requiredFor = dep.requiredFor.filter(r => r !== serviceId);
    });
  }

  /**
   * Clear all dependency data
   */
  public clear(): void {
    this.dependencies.clear();
  }
}

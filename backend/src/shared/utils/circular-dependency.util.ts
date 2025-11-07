/**
 * @fileoverview Circular Dependency Detection and Prevention Utility
 * @module shared/utils/circular-dependency
 * @description Provides tools to detect and prevent circular dependencies in imports
 */

import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for dependency analysis results
 */
export interface DependencyAnalysis {
  file: string;
  imports: string[];
  exports: string[];
  circularDependencies: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

/**
 * Circular dependency detector and prevention utility
 */
export class CircularDependencyDetector {
  private logger = new Logger(CircularDependencyDetector.name);
  private dependencyGraph = new Map<string, Set<string>>();
  private analysisCache = new Map<string, DependencyAnalysis>();

  /**
   * Analyze a directory for circular dependencies
   */
  async analyzeDirectory(directoryPath: string): Promise<DependencyAnalysis[]> {
    const results: DependencyAnalysis[] = [];
    const files = this.getAllTypeScriptFiles(directoryPath);

    // Build dependency graph
    for (const file of files) {
      const dependencies = this.extractDependencies(file);
      this.dependencyGraph.set(file, new Set(dependencies));
    }

    // Detect circular dependencies
    for (const file of files) {
      const analysis = this.analyzeFile(file);
      results.push(analysis);
    }

    return results;
  }

  /**
   * Check if a specific import would create a circular dependency
   */
  wouldCreateCircularDependency(fromFile: string, toFile: string): boolean {
    // Normalize paths
    const normalizedFrom = path.resolve(fromFile);
    const normalizedTo = path.resolve(toFile);

    // Check if toFile already depends on fromFile (direct or indirect)
    return this.hasTransitiveDependency(
      normalizedTo,
      normalizedFrom,
      new Set(),
    );
  }

  /**
   * Get safe import recommendations to prevent circular dependencies
   */
  getSafeImportRecommendations(file: string): string[] {
    const recommendations: string[] = [];

    // Common patterns that help prevent circular dependencies
    recommendations.push(
      '1. Use dependency injection instead of direct imports where possible',
      '2. Consider using interfaces/types in separate files',
      '3. Move shared types to a common types file',
      '4. Use barrel exports (index.ts) with careful ordering',
      '5. Consider using the factory pattern for complex dependencies',
    );

    const analysis = this.analysisCache.get(file);
    if (analysis?.riskLevel === 'HIGH') {
      recommendations.push(
        '6. HIGH RISK: Consider refactoring this file to reduce dependencies',
        '7. Move business logic to service layer with proper dependency injection',
      );
    }

    return recommendations;
  }

  /**
   * Extract import dependencies from a TypeScript file
   */
  private extractDependencies(filePath: string): string[] {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const dependencies: string[] = [];

      // Match import statements (ES6 and CommonJS)
      const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
      const requireRegex = /require\(['"`]([^'"`]+)['"`]\)/g;

      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
          // Resolve relative path
          const resolvedPath = path.resolve(path.dirname(filePath), importPath);
          dependencies.push(resolvedPath);
        }
      }

      while ((match = requireRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
          const resolvedPath = path.resolve(path.dirname(filePath), importPath);
          dependencies.push(resolvedPath);
        }
      }

      return dependencies;
    } catch (error) {
      this.logger.warn(`Failed to analyze file ${filePath}: ${error}`);
      return [];
    }
  }

  /**
   * Check for transitive dependencies (A -> B -> ... -> A)
   */
  private hasTransitiveDependency(
    fromFile: string,
    targetFile: string,
    visited: Set<string>,
  ): boolean {
    if (visited.has(fromFile)) {
      return false; // Avoid infinite recursion
    }

    visited.add(fromFile);
    const dependencies = this.dependencyGraph.get(fromFile);

    if (!dependencies) {
      return false;
    }

    // Direct dependency
    if (dependencies.has(targetFile)) {
      return true;
    }

    // Transitive dependency
    for (const dep of dependencies) {
      if (this.hasTransitiveDependency(dep, targetFile, new Set(visited))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Analyze a single file for circular dependency risks
   */
  private analyzeFile(filePath: string): DependencyAnalysis {
    if (this.analysisCache.has(filePath)) {
      return this.analysisCache.get(filePath)!;
    }

    const dependencies = Array.from(this.dependencyGraph.get(filePath) || []);
    const circularDeps = this.findCircularDependencies(filePath);

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (circularDeps.length > 0) {
      riskLevel = 'HIGH';
    } else if (dependencies.length > 10) {
      riskLevel = 'MEDIUM';
    }

    const analysis: DependencyAnalysis = {
      file: filePath,
      imports: dependencies,
      exports: this.extractExports(filePath),
      circularDependencies: circularDeps,
      riskLevel,
    };

    this.analysisCache.set(filePath, analysis);
    return analysis;
  }

  /**
   * Find circular dependencies for a specific file
   */
  private findCircularDependencies(filePath: string): string[] {
    const circularDeps: string[] = [];
    const dependencies = this.dependencyGraph.get(filePath);

    if (!dependencies) {
      return circularDeps;
    }

    for (const dep of dependencies) {
      if (this.hasTransitiveDependency(dep, filePath, new Set())) {
        circularDeps.push(dep);
      }
    }

    return circularDeps;
  }

  /**
   * Extract exports from a TypeScript file
   */
  private extractExports(filePath: string): string[] {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const exports: string[] = [];

      // Match export statements
      const exportRegex =
        /export\s+(?:(?:default|const|let|var|function|class|interface|type|enum)\s+)?(\w+)/g;

      let match;
      while ((match = exportRegex.exec(content)) !== null) {
        exports.push(match[1]);
      }

      return exports;
    } catch (error) {
      this.logger.warn(`Failed to extract exports from ${filePath}: ${error}`);
      return [];
    }
  }

  /**
   * Get all TypeScript files in a directory recursively
   */
  private getAllTypeScriptFiles(dir: string): string[] {
    const files: string[] = [];

    function traverse(currentDir: string) {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          traverse(fullPath);
        } else if (
          entry.name.endsWith('.ts') &&
          !entry.name.endsWith('.d.ts')
        ) {
          files.push(fullPath);
        }
      }
    }

    traverse(dir);
    return files;
  }
}

/**
 * Sequelize Model Association Helper
 * Provides safe association setup to prevent circular dependencies
 */
export class SequelizeAssociationHelper {
  private static logger = new Logger(SequelizeAssociationHelper.name);

  /**
   * Create a safe BelongsTo association
   */
  static createBelongsToAssociation(
    sourceModel: any,
    targetModelFn: () => any,
    options: {
      foreignKey: string;
      as: string;
      onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
      onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
    },
  ) {
    // Delay association creation to prevent circular dependency issues
    setTimeout(() => {
      try {
        const targetModel = targetModelFn();
        sourceModel.belongsTo(targetModel, options);
        this.logger.debug(
          `Created BelongsTo association: ${sourceModel.name} -> ${targetModel.name}`,
        );
      } catch (error) {
        this.logger.error(`Failed to create BelongsTo association: ${error}`);
      }
    }, 0);
  }

  /**
   * Create a safe HasMany association
   */
  static createHasManyAssociation(
    sourceModel: any,
    targetModelFn: () => any,
    options: {
      foreignKey: string;
      as: string;
      onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
      onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
    },
  ) {
    setTimeout(() => {
      try {
        const targetModel = targetModelFn();
        sourceModel.hasMany(targetModel, options);
        this.logger.debug(
          `Created HasMany association: ${sourceModel.name} -> ${targetModel.name}[]`,
        );
      } catch (error) {
        this.logger.error(`Failed to create HasMany association: ${error}`);
      }
    }, 0);
  }
}

/**
 * Import Guard - Prevents runtime circular dependency issues
 */
export class ImportGuard {
  private static importStack = new Set<string>();

  /**
   * Guard against circular imports at runtime
   */
  static guard<T>(moduleName: string, importFn: () => T): T {
    if (this.importStack.has(moduleName)) {
      throw new Error(
        `Circular dependency detected: ${moduleName} is already being imported`,
      );
    }

    this.importStack.add(moduleName);

    try {
      const result = importFn();
      this.importStack.delete(moduleName);
      return result;
    } catch (error) {
      this.importStack.delete(moduleName);
      throw error;
    }
  }
}

/**
 * WF-COMP-325 | incidents.ts - Incident types main export
 * Purpose: Main export file for incident types (re-exports from subdirectory)
 * Upstream: incidents/ subdirectory | Dependencies: Modular type definitions
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: incidents/ subdirectory modules
 * Exports: All incident types | Key Features: Backwards-compatible exports
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: Main incident types export (refactored into subdirectory modules)
 *
 * REFACTORING NOTE:
 * This file has been refactored into smaller, maintainable modules in the incidents/ subdirectory.
 * The original 834-line file is now split into:
 * - enums.ts: All enum definitions (133 lines)
 * - entities.ts: Core entity interfaces (212 lines)
 * - requests.ts: API request types (232 lines)
 * - responses.ts: API response types (174 lines)
 * - statistics.ts: Analytics and search types (~50 lines)
 * - documents.ts: Document generation types (~60 lines)
 * - forms.ts: Form data types (~80 lines)
 * - utils.ts: Type guards and helpers (~110 lines)
 *
 * This file now serves as a backwards-compatible re-export point.
 * New code should import directly from the subdirectory modules for better tree-shaking.
 */

// Re-export all types from the incidents subdirectory for backwards compatibility
export * from './incidents/index';

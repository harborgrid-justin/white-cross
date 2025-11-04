/**
 * Student Search and Filter Hooks
 *
 * This file provides backward compatibility by re-exporting from the modular structure.
 * The original 777-line file has been broken down into smaller, maintainable modules:
 *
 * - searchFilterTypes.ts: Type definitions and constants
 * - useStudentSearch.ts: Search functionality with debouncing and suggestions
 * - useStudentFilter.ts: Advanced filtering functionality
 * - useStudentSort.ts: Sorting functionality
 * - useSavedSearches.ts: Saved search management
 * - useStudentSearchAndFilter.ts: Composite hook combining all features
 *
 * All exports from this file maintain the exact same API as the original implementation.
 *
 * @module hooks/students/queries/searchAndFilter
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

export * from './searchAndFilter';

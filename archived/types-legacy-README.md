# Legacy Types Directory

This directory contains the original type files before the reorganization.

## ⚠️ DO NOT USE THESE FILES

These files are kept for reference only. All active type definitions have been moved to:
- `/src/types/core/` - Core/foundational types
- `/src/types/domain/` - Business domain types

## Purpose

These files are retained temporarily to:
1. Ensure no critical type definitions were lost during migration
2. Provide reference if any issues arise
3. Allow for easy rollback if needed

## Cleanup

These files can be safely deleted after verifying that:
1. All imports across the codebase have been updated
2. TypeScript compilation succeeds
3. All tests pass
4. The application runs without type errors

## Migration Date

Reorganized: 2025-11-02

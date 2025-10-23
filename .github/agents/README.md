# JSDoc Generation Expert Agents

This directory contains specialized agent configurations for generating comprehensive JSDoc documentation across the frontend codebase.

## Overview

The frontend codebase contains **1,570+ TypeScript/TSX files** that require JSDoc documentation. To handle this efficiently, we've organized the work into **6 specialized expert agents**, each focused on a specific domain of the codebase.

## Agent Descriptions

### 1. Components JSDoc Agent
**File**: `components-jsdoc-agent.md`  
**Scope**: React components, pages, layouts, and feature modules  
**Directories**:
- `frontend/src/components/`
- `frontend/src/pages/`

**Specialization**: React patterns, hooks, props, UI/UX, accessibility, component lifecycle

**File Count**: ~600 files

---

### 2. Services JSDoc Agent
**File**: `services-jsdoc-agent.md`  
**Scope**: API services, monitoring, security, middleware  
**Directories**:
- `frontend/src/services/`
- `frontend/src/middleware/`

**Specialization**: API design, authentication, error handling, monitoring, security, resilience patterns, HIPAA compliance

**File Count**: ~200 files

---

### 3. State Management JSDoc Agent
**File**: `stores-jsdoc-agent.md`  
**Scope**: Redux slices, stores, selectors, state utilities  
**Directories**:
- `frontend/src/stores/`

**Specialization**: Redux Toolkit, selectors, async thunks, state normalization, domain-driven design

**File Count**: ~150 files

---

### 4. Types JSDoc Agent
**File**: `types-jsdoc-agent.md`  
**Scope**: TypeScript types, interfaces, schemas, validation  
**Directories**:
- `frontend/src/types/`
- `frontend/src/schemas/`
- `frontend/src/validation/`

**Specialization**: TypeScript type system, Zod schemas, domain modeling, API contracts, validation rules

**File Count**: ~100 files

---

### 5. Hooks and Utils JSDoc Agent
**File**: `hooks-utils-jsdoc-agent.md`  
**Scope**: Custom hooks, utility functions, guards, contexts  
**Directories**:
- `frontend/src/hooks/`
- `frontend/src/utils/`
- `frontend/src/guards/`
- `frontend/src/contexts/`

**Specialization**: Custom hooks, functional utilities, validation, sanitization, performance optimization, route guards

**File Count**: ~400 files

---

### 6. Configuration and Routes JSDoc Agent
**File**: `config-routes-jsdoc-agent.md`  
**Scope**: Configuration files, routing, constants, bootstrap  
**Directories**:
- `frontend/src/config/`
- `frontend/src/routes/`
- `frontend/src/constants/`
- Root-level config files

**Specialization**: App configuration, routing, feature flags, initialization, constants, environment management

**File Count**: ~120 files

---

## How to Use These Agents

### For Automated Systems

If you're using an AI agent orchestration system, you can delegate work to these agents by:

1. **Identify the file type** - Determine which agent specializes in that file
2. **Read the agent's instructions** - The agent file contains detailed guidelines
3. **Apply the agent's expertise** - Use their JSDoc format and guidelines
4. **Validate output** - Ensure documentation meets quality standards

### For Manual Documentation

1. Choose the agent that matches your file category
2. Read the agent's JSDoc format requirements
3. Follow the guidelines and focus areas
4. Use the examples as templates
5. Ensure preservation rules are followed

### Agent Selection Guide

| File Location | Agent to Use |
|--------------|--------------|
| `components/**/*.tsx` | Components JSDoc Agent |
| `pages/**/*.tsx` | Components JSDoc Agent |
| `services/**/*.ts` | Services JSDoc Agent |
| `middleware/**/*.ts` | Services JSDoc Agent |
| `stores/**/*.ts` | State Management JSDoc Agent |
| `types/**/*.ts` | Types JSDoc Agent |
| `schemas/**/*.ts` | Types JSDoc Agent |
| `validation/**/*.ts` | Types JSDoc Agent |
| `hooks/**/*.ts(x)` | Hooks and Utils JSDoc Agent |
| `utils/**/*.ts` | Hooks and Utils JSDoc Agent |
| `guards/**/*.tsx` | Hooks and Utils JSDoc Agent |
| `contexts/**/*.tsx` | Hooks and Utils JSDoc Agent |
| `config/**/*.ts(x)` | Configuration and Routes JSDoc Agent |
| `routes/**/*.tsx` | Configuration and Routes JSDoc Agent |
| `constants/**/*.ts` | Configuration and Routes JSDoc Agent |
| `bootstrap.ts` | Configuration and Routes JSDoc Agent |

## Common Guidelines Across All Agents

### Universal Rules

1. **Preservation**: NEVER modify existing working code - only add JSDoc comments
2. **Format**: Follow JSDoc standard format with proper tags
3. **Examples**: Include code examples for complex functionality
4. **HIPAA**: Mark PHI handling clearly
5. **Errors**: Document error conditions and throws
6. **Dependencies**: Note key dependencies and integrations

### JSDoc Tags Reference

Common tags used across agents:

- `@fileoverview` - File-level description
- `@module` - Module name
- `@category` - File category
- `@param` - Function parameter
- `@returns` - Return value
- `@throws` - Error conditions
- `@example` - Code example
- `@deprecated` - Deprecated items
- `@see` - Related documentation
- `@async` - Async function
- `@typedef` - Type definition
- `@property` - Object property

### Healthcare-Specific Tags

- Mark PHI fields: `@phi` or `@protected-health-information`
- Audit requirements: `@audit-required`
- HIPAA compliance: `@hipaa-compliant`
- Data retention: `@retention-policy`

## Quality Checklist

Before considering JSDoc complete for a file:

- [ ] File-level JSDoc with module and category
- [ ] All exported functions/components documented
- [ ] All parameters documented with types
- [ ] Return values clearly explained
- [ ] Error conditions documented
- [ ] At least one example provided for complex code
- [ ] PHI handling marked if applicable
- [ ] No modification to working code
- [ ] Existing comments preserved
- [ ] Code formatting maintained

## Workflow for Large-Scale Documentation

### Phase 1: Critical Path (High Priority)
1. Main entry points (`main.tsx`, `App.tsx`, `bootstrap.ts`)
2. Core services (`services/api/`, `services/auth/`)
3. Key components (`components/layout/`, main pages)

### Phase 2: Business Logic (Medium Priority)
1. Redux stores and slices
2. Feature components
3. Domain types
4. Business utility functions

### Phase 3: Supporting Code (Lower Priority)
1. UI components
2. Helper utilities
3. Configuration files
4. Constants

### Phase 4: Validation and Polish
1. Review consistency across all files
2. Ensure examples are accurate
3. Verify PHI markings
4. Check cross-references

## Testing Documentation Quality

After adding JSDoc:

1. **TypeScript Validation**: Run `npm run type-check` to ensure types are correct
2. **Linting**: Run `npm run lint` to catch JSDoc format issues
3. **Build**: Run `npm run build` to ensure no breaking changes
4. **IDE Test**: Check that IDE tooltips show helpful documentation
5. **Example Validation**: Verify code examples actually work

## Maintenance

As the codebase evolves:

- Update JSDoc when functions change
- Mark deprecated items with `@deprecated`
- Keep examples current
- Update agent guidelines as patterns emerge
- Maintain consistency across similar files

## Questions or Issues?

If you encounter:
- Conflicting guidelines between agents
- Unclear documentation requirements
- Edge cases not covered

Refer to the most specific agent guidance, and when in doubt, prioritize:
1. Code preservation (never break working code)
2. Type safety (accurate types and parameters)
3. User understanding (clear, helpful documentation)

---

**Last Updated**: 2025-10-23  
**Version**: 1.0.0  
**Total Files to Document**: 1,570+  
**Total Agents**: 6

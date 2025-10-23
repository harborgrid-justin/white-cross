# JSDoc Generation Orchestrator

## Purpose

This document provides guidance for orchestrating JSDoc generation across the entire frontend codebase using the six specialized expert agents.

## Agent Summary

| Agent | Files | Priority | Estimated Effort |
|-------|-------|----------|------------------|
| Components | ~600 | High | 3-4 days |
| Services | ~200 | Critical | 2 days |
| Stores | ~150 | High | 1-2 days |
| Types | ~100 | Medium | 1 day |
| Hooks/Utils | ~400 | High | 2-3 days |
| Config/Routes | ~120 | Medium | 1 day |

**Total**: ~1,570 files, ~10-13 days of focused work

## Orchestration Strategy

### Phase 1: Critical Infrastructure (Days 1-2)
**Priority**: CRITICAL - These files are foundational

**Agent**: Services JSDoc Agent + Config/Routes JSDoc Agent

**Files to Document**:
```
frontend/src/bootstrap.ts
frontend/src/config/queryClient.ts
frontend/src/services/api/client.ts
frontend/src/services/auth/
frontend/src/services/security/
frontend/src/services/monitoring/
frontend/src/middleware/
```

**Rationale**: These files underpin the entire application. Well-documented services enable understanding of all higher-level features.

---

### Phase 2: State Management (Days 3-4)
**Priority**: HIGH - State is the application's brain

**Agent**: Stores JSDoc Agent

**Files to Document**:
```
frontend/src/stores/reduxStore.ts
frontend/src/stores/slices/*.ts
frontend/src/stores/domains/*/index.ts
frontend/src/stores/domains/*/selectors.ts
frontend/src/stores/domains/*/hooks.ts
```

**Rationale**: Understanding state management clarifies data flow throughout the app.

---

### Phase 3: Type System (Day 5)
**Priority**: MEDIUM - Types define contracts

**Agent**: Types JSDoc Agent

**Files to Document**:
```
frontend/src/types/index.ts
frontend/src/types/*.ts
frontend/src/schemas/*.ts
frontend/src/validation/*.ts
```

**Rationale**: Well-documented types serve as API contracts and reduce ambiguity.

---

### Phase 4: Hooks and Utilities (Days 6-8)
**Priority**: HIGH - Reusable logic

**Agent**: Hooks and Utils JSDoc Agent

**Files to Document**:
```
frontend/src/hooks/
frontend/src/utils/
frontend/src/guards/
frontend/src/contexts/
```

**Rationale**: These are heavily reused across the application. Good documentation here reduces duplicated questions.

---

### Phase 5: Core Components (Days 9-10)
**Priority**: HIGH - User-facing code

**Agent**: Components JSDoc Agent

**Files to Document First**:
```
frontend/src/components/layout/
frontend/src/components/ui/
frontend/src/components/shared/
```

**Rationale**: These components are reused extensively and form the visual foundation.

---

### Phase 6: Feature Components (Days 11-12)
**Priority**: MEDIUM - Business logic

**Agent**: Components JSDoc Agent

**Files to Document**:
```
frontend/src/components/features/
frontend/src/pages/
```

**Rationale**: Feature-specific components contain business domain knowledge.

---

### Phase 7: Configuration and Routes (Day 13)
**Priority**: MEDIUM - Application setup

**Agent**: Config/Routes JSDoc Agent

**Files to Document**:
```
frontend/src/routes/
frontend/src/constants/
frontend/src/config/
```

**Rationale**: Configuration is typically stable and changes infrequently.

---

## Parallel Execution Strategy

If multiple AI agents or developers are available, work can be parallelized:

### Team A: Core Infrastructure (Days 1-3)
- Services JSDoc Agent → Document all services
- Config/Routes JSDoc Agent → Document bootstrap & config

### Team B: Data Layer (Days 1-3)
- Stores JSDoc Agent → Document Redux store
- Types JSDoc Agent → Document type system

### Team C: Reusable Logic (Days 4-6)
- Hooks/Utils JSDoc Agent → Document hooks and utilities

### Team D: UI Layer (Days 7-10)
- Components JSDoc Agent → Document all components
  - Day 7-8: UI components
  - Day 9-10: Feature components

---

## Quality Gates

After each phase, verify:

1. **Completeness**: All files in scope have JSDoc
2. **Consistency**: Similar files use similar documentation style
3. **Accuracy**: Examples are correct and type-safe
4. **Build**: `npm run build` succeeds
5. **Lint**: `npm run lint` passes
6. **Types**: `npm run type-check` passes

---

## Progress Tracking

Use this checklist to track overall progress:

### Phase 1: Critical Infrastructure
- [ ] bootstrap.ts
- [ ] services/api/
- [ ] services/auth/
- [ ] services/security/
- [ ] services/monitoring/
- [ ] services/resilience/
- [ ] middleware/

### Phase 2: State Management
- [ ] stores/reduxStore.ts
- [ ] stores/slices/ (all slices)
- [ ] stores/domains/core/
- [ ] stores/domains/healthcare/
- [ ] stores/domains/communication/
- [ ] stores/domains/administration/

### Phase 3: Type System
- [ ] types/index.ts
- [ ] types/ (all domain types)
- [ ] schemas/
- [ ] validation/

### Phase 4: Hooks and Utilities
- [ ] hooks/shared/
- [ ] hooks/domains/
- [ ] hooks/utilities/
- [ ] utils/
- [ ] guards/
- [ ] contexts/

### Phase 5: Core Components
- [ ] components/layout/
- [ ] components/ui/
- [ ] components/shared/
- [ ] components/providers/

### Phase 6: Feature Components
- [ ] components/features/health-records/
- [ ] components/features/medications/
- [ ] components/features/students/
- [ ] components/features/communication/
- [ ] components/features/inventory/
- [ ] components/features/settings/
- [ ] pages/

### Phase 7: Configuration
- [ ] routes/
- [ ] config/
- [ ] constants/

---

## Automation Approach

For AI-driven automation, use this workflow:

```bash
# 1. Get list of files for an agent's domain
find frontend/src/services -name "*.ts" -o -name "*.tsx" > /tmp/services-files.txt

# 2. For each file, apply the agent's JSDoc guidelines
while read file; do
  # Read agent instructions
  # Apply to file
  # Verify no code changes
  # Commit if valid
done < /tmp/services-files.txt

# 3. Run quality checks
npm run lint
npm run type-check
npm run build

# 4. Move to next agent
```

---

## Agent Handoff Protocol

When transitioning between agents:

1. **Complete current agent's scope** - Don't leave partial work
2. **Run quality checks** - Ensure build/lint/types pass
3. **Commit progress** - Create clear commit messages
4. **Document blockers** - Note any issues for next agent
5. **Update tracking** - Mark completed files in checklist

---

## Special Cases

### Files with Multiple Concerns

Some files span multiple domains (e.g., a component that heavily uses hooks):

**Solution**: Use primary agent based on file location, reference secondary agent for specific patterns

### Auto-Generated Files

Files like `vite-env.d.ts`:

**Solution**: Skip or add minimal JSDoc at file level only

### Test Files

Files ending in `.test.ts` or `.spec.ts`:

**Solution**: Out of scope - focus on source files only

### Example Files

Files ending in `.example.ts`:

**Solution**: Document as they demonstrate patterns for other developers

---

## Verification Commands

After documentation is complete:

```bash
# Check all files have JSDoc
npm run lint

# Verify types are correct
npm run type-check

# Build succeeds
npm run build

# Tests still pass
npm run test

# Generate documentation (optional)
npm run docs:generate
```

---

## Success Metrics

Documentation is complete when:

- ✅ All 1,570+ files have file-level JSDoc
- ✅ All exported functions/components have JSDoc
- ✅ All complex logic has examples
- ✅ All PHI handling is marked
- ✅ Build, lint, and type-check all pass
- ✅ No existing functionality is broken
- ✅ IDE tooltips show helpful documentation

---

## Maintenance Going Forward

After initial documentation:

1. **PR Reviews**: Require JSDoc for new files
2. **Linting**: Enable JSDoc linting rules
3. **Templates**: Provide JSDoc templates for new files
4. **Updates**: Keep JSDoc current with code changes
5. **Deprecation**: Mark old code with `@deprecated`

---

**Last Updated**: 2025-10-23  
**Version**: 1.0.0  
**Status**: Ready for execution

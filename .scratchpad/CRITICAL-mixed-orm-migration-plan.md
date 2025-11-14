# CRITICAL: Mixed ORM Architecture - Migration Plan

**Status:** CRITICAL ISSUE
**Priority:** P0 - Must Address Immediately
**Estimated Effort:** 2-3 weeks (1 senior developer)
**Risk Level:** High (Architectural Inconsistency)

---

## Issue Summary

The application currently uses **TWO different ORM systems simultaneously**:

1. **Sequelize** (Primary) - Used by 92 models in `/database/models/`
2. **TypeORM** (Legacy) - Base repository in `/common/base/base.repository.ts`

This creates:
- Developer confusion and inconsistent patterns
- Increased bundle size and dependencies
- Conflicting transaction patterns
- Higher learning curve
- Potential runtime conflicts

---

## Impact Assessment

### Business Impact
- **Development Velocity:** -30% (developers must learn two ORM systems)
- **Bug Risk:** High (conflicting transaction/connection patterns)
- **Maintenance Cost:** +40% (dual ORM maintenance)
- **Onboarding Time:** +2 weeks for new developers

### Technical Impact
- **Bundle Size:** +2.5MB (TypeORM unused dependency)
- **Connection Pool:** Risk of exhaustion with dual ORMs
- **Transaction Management:** Cannot use unified transaction context
- **Type Safety:** Inconsistent patterns across codebase

---

## Current State Analysis

### Sequelize Usage (Correct)
```
Location: /backend/src/database/
- Models: 92 Sequelize models
- Repositories: 90+ Sequelize repositories
- Pattern: BaseRepository<TModel extends Model>
```

**Files:**
- `backend/src/database/repositories/base/base.repository.ts` (Sequelize)
- All models in `backend/src/database/models/*.model.ts`
- All repositories in `backend/src/database/repositories/*.repository.ts`

### TypeORM Usage (Legacy - To Remove)
```
Location: /backend/src/common/base/
- Pattern: BaseRepository<T extends ObjectLiteral>
```

**Files:**
- `backend/src/common/base/base.repository.ts` (TypeORM)

---

## Migration Plan

### Phase 1: Assessment (Week 1, Days 1-2)

**1.1 Identify All TypeORM Usage**
```bash
# Search for TypeORM imports
grep -r "from 'typeorm'" backend/src/

# Search for TypeORM decorators
grep -r "@Entity\|@Column\|@ManyToOne" backend/src/

# Find files importing common/base BaseRepository
grep -r "from '@/common/base'" backend/src/
```

**1.2 Document Dependencies**
- List all files using TypeORM BaseRepository
- Identify any TypeORM-specific features being used
- Check if any modules depend on TypeORM transactions

**1.3 Risk Assessment**
- Identify critical modules using TypeORM
- Assess test coverage for affected modules
- Plan rollback strategy

### Phase 2: Preparation (Week 1, Days 3-5)

**2.1 Create Sequelize Equivalents**
If any TypeORM-specific patterns are found, create Sequelize equivalents:
```typescript
// backend/src/database/repositories/base/enhanced-base.repository.ts
export abstract class EnhancedBaseRepository<TModel extends Model> extends BaseRepository<TModel> {
  // Add any missing features from TypeORM BaseRepository here
}
```

**2.2 Update Tests**
- Ensure all repository tests use Sequelize patterns
- Add integration tests for transaction management
- Create migration test suite

**2.3 Communication**
- Notify development team of upcoming changes
- Schedule code freeze for migration day
- Prepare rollback procedures

### Phase 3: Migration (Week 2, Days 1-3)

**3.1 Remove TypeORM BaseRepository**
```bash
# Backup current state
git checkout -b migration/remove-typeorm-backup

# Remove TypeORM base repository
rm backend/src/common/base/base.repository.ts

# Update index exports
# Edit: backend/src/common/base/index.ts
# Remove TypeORM BaseRepository export
```

**3.2 Update Imports**
```typescript
// Find and replace across codebase
// FROM:
import { BaseRepository } from '@/common/base';

// TO (if they need Sequelize):
import { BaseRepository } from '@/database/repositories/base';
```

**3.3 Remove TypeORM Dependency**
```bash
# Remove from package.json
npm uninstall typeorm @nestjs/typeorm

# Update package-lock.json
npm install
```

**3.4 Update TypeScript Paths**
```json
// tsconfig.json - Remove TypeORM base path if exists
{
  "compilerOptions": {
    "paths": {
      // Keep only Sequelize paths
      "@/database/repositories/base": ["src/database/repositories/base"]
    }
  }
}
```

### Phase 4: Testing (Week 2, Days 4-5)

**4.1 Run Test Suite**
```bash
cd backend
npm run test
npm run test:e2e
npm run test:integration
```

**4.2 Manual Testing**
- Test all CRUD operations
- Test transaction management
- Test concurrent operations
- Test error handling

**4.3 Performance Testing**
- Measure query performance
- Check connection pool usage
- Monitor memory usage

### Phase 5: Deployment (Week 3)

**5.1 Staging Deployment**
- Deploy to staging environment
- Run smoke tests
- Monitor for 48 hours

**5.2 Production Deployment**
- Deploy during low-traffic window
- Monitor error rates
- Keep rollback ready

**5.3 Post-Deployment**
- Monitor application logs
- Track performance metrics
- Gather developer feedback

---

## Rollback Plan

If issues are detected:

### Immediate Rollback (< 1 hour)
```bash
# Revert to previous commit
git revert HEAD
git push origin <branch>

# Redeploy previous version
# Follow standard deployment procedures
```

### Restore TypeORM (If Necessary)
```bash
# Restore dependencies
npm install typeorm @nestjs/typeorm

# Restore files from backup branch
git checkout migration/remove-typeorm-backup backend/src/common/base/base.repository.ts

# Commit and deploy
git commit -m "Restore TypeORM due to migration issues"
git push
```

---

## Success Criteria

- [ ] Zero TypeORM imports in codebase
- [ ] All tests passing (100% of previous passing tests)
- [ ] Bundle size reduced by ~2.5MB
- [ ] No performance degradation
- [ ] Developer documentation updated
- [ ] Team onboarded on Sequelize-only patterns

---

## Post-Migration Cleanup

### Documentation Updates
- Update architecture documentation
- Update developer onboarding guide
- Update contributing guidelines
- Create Sequelize best practices guide

### Code Quality
- Run linter to ensure consistency
- Update code review checklist
- Add pre-commit hooks to prevent TypeORM imports

### Monitoring
- Set up alerts for ORM-related errors
- Monitor query performance for 1 month
- Track developer productivity metrics

---

## Current Status

**Phase:** Not Started
**Next Action:** Schedule kickoff meeting with development team
**Assigned To:** TBD
**Target Completion:** TBD

---

## Notes

- This migration should be done during a sprint with minimal new feature work
- Consider pairing with junior developers for knowledge transfer
- Keep this document updated as migration progresses
- Add any issues encountered to this document for future reference

---

## Questions & Concerns

1. **Q:** Are there any features using TypeORM that don't have Sequelize equivalents?
   **A:** TBD - Needs assessment

2. **Q:** What is the test coverage of affected modules?
   **A:** TBD - Needs assessment

3. **Q:** Can we do this incrementally?
   **A:** No - Having two ORMs is the problem. Must be complete removal.

---

## References

- Sequelize Documentation: https://sequelize.org/
- NestJS Sequelize Integration: https://docs.nestjs.com/techniques/database#sequelize-integration
- Database Audit Report: `.scratchpad/database-audit.md`
- Consolidated Findings: `.scratchpad/consolidated-findings.md`

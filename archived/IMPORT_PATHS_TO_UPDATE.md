# Import Paths That Need Updating

This file lists all import statements that reference old type paths and need to be updated to use the new type organization structure.

## Quick Fix Pattern

```typescript
// OLD PATTERN (needs fixing)
import { ... } from '@/types/[specific-file]';

// NEW PATTERN (correct)
import { ... } from '@/types';
// or
import { ... } from '@/types/domain';
import { ... } from '@/types/core';
```

---

## Files Requiring Updates

Based on TypeScript compilation errors and grep search, the following files need import path updates:

### 1. Actions
```
src/actions/appointments.actions.ts
  Line 14: import { ... } from '@/types/appointments'
  Fix: import { ... } from '@/types'
```

### 2. Admin Pages
```
src/app/(dashboard)/admin/_actions/monitoring.ts
  Line 40: import { ... } from '@/types/admin'
  Fix: import { ... } from '@/types'

src/app/(dashboard)/admin/settings/users/page.tsx
  Line 27: import { ... } from '@/types/common'
  Fix: import { ... } from '@/types'
```

### 3. Potential Other Files

Run this command to find all remaining imports:

```bash
cd /home/user/white-cross/frontend
grep -rn "from '@/types/[a-z]" src/ --include="*.ts" --include="*.tsx" | \
  grep -v "from '@/types/core'" | \
  grep -v "from '@/types/domain'" | \
  grep -v "from '@/types/augmentations'" | \
  grep -v "from '@/types'" | \
  grep -v "node_modules" > old-imports.txt
```

---

## Automated Fix (Use with Caution)

You can use sed to automatically update many of these imports:

```bash
cd /home/user/white-cross/frontend

# Find and replace common patterns
find src/ -name "*.ts" -o -name "*.tsx" | while read file; do
  # Update specific file imports to main index
  sed -i "s|from '@/types/appointments'|from '@/types'|g" "$file"
  sed -i "s|from '@/types/common'|from '@/types'|g" "$file"
  sed -i "s|from '@/types/admin'|from '@/types'|g" "$file"
  sed -i "s|from '@/types/medications'|from '@/types'|g" "$file"
  sed -i "s|from '@/types/incidents'|from '@/types'|g" "$file"
  sed -i "s|from '@/types/students'|from '@/types'|g" "$file"
  sed -i "s|from '@/types/healthRecords'|from '@/types'|g" "$file"
  sed -i "s|from '@/types/documents'|from '@/types'|g" "$file"
  # Add more patterns as needed
done

# Verify changes
git diff src/
```

**⚠️ WARNING**: Always review changes before committing. Test thoroughly.

---

## Manual Fix Steps

For each file:

1. **Identify** the import statement
   ```typescript
   import { Appointment } from '@/types/appointments';
   ```

2. **Replace** with main index import
   ```typescript
   import { Appointment } from '@/types';
   ```

3. **Verify** TypeScript compilation
   ```bash
   npx tsc --noEmit
   ```

4. **Test** the affected component/feature

---

## Verification

After updating imports:

```bash
# Check for remaining old imports
grep -r "from '@/types/[a-z]" src/ --include="*.ts" --include="*.tsx" | \
  grep -v "from '@/types/core'" | \
  grep -v "from '@/types/domain'" | \
  grep -v "from '@/types'"

# Should return no results (or only legitimate domain/core imports)

# Run type check
npx tsc --noEmit

# Should compile without import errors

# Run tests
npm test

# Should pass
```

---

## Common Import Mappings

| Old Import | New Import |
|------------|------------|
| `@/types/appointments` | `@/types` |
| `@/types/common` | `@/types` |
| `@/types/admin` | `@/types` |
| `@/types/medications` | `@/types` |
| `@/types/incidents` | `@/types` |
| `@/types/student.types` | `@/types` |
| `@/types/healthRecords` | `@/types` |
| `@/types/documents` | `@/types` |
| `@/types/api` | `@/types` |
| `@/types/api/responses` | `@/types` |

For domain-specific clarity, you can also use:
- `@/types/domain` for domain types
- `@/types/core` for core types

---

## Timeline

- **Estimated time**: 1-2 hours for ~15 files
- **Priority**: Medium (not blocking, backward compatible exports exist)
- **Risk**: Low (old paths still work via re-exports)

---

## Support

If you encounter issues:
1. Check `TYPE_IMPORT_GUIDE.md` for import patterns
2. Check `TYPE_ORGANIZATION_REPORT.md` for full context
3. Review `/src/types/README.md` for structure
4. Ask team for help

---

**Last Updated**: 2025-11-02

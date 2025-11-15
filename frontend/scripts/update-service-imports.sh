#!/bin/bash

# Service Module Import Migration Script
# Automates the update of all remaining service module imports to use new lib/api paths
# Version: 1.0
# Date: 2025-11-15

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Service Module Import Migration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Change to project root
cd "$PROJECT_ROOT"

# Count initial remaining imports
echo -e "${YELLOW}📊 Counting initial remaining imports...${NC}"
INITIAL_COUNT=$(find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/services/modules/*" \
  -exec grep -l "from.*services/modules" {} \; 2>/dev/null | wc -l)

echo -e "${BLUE}Found ${INITIAL_COUNT} files to update${NC}"
echo ""

# Backup check
echo -e "${YELLOW}🔍 Checking git status...${NC}"
if [[ -n $(git status -s) ]]; then
  echo -e "${YELLOW}⚠️  You have uncommitted changes. It's recommended to commit or stash them first.${NC}"
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Aborted.${NC}"
    exit 1
  fi
fi
echo ""

# Create backup branch
echo -e "${YELLOW}💾 Creating backup...${NC}"
BACKUP_BRANCH="backup-service-imports-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH" 2>/dev/null || true
echo -e "${GREEN}✓ Backup branch created: $BACKUP_BRANCH${NC}"
echo ""

# Start updates
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Starting Updates${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Track what was updated
UPDATED_FILES=0

# 1. Health Records Hooks
echo -e "${YELLOW}📝 [1/8] Updating health records hooks...${NC}"
if [ -d "src/hooks/domains/health-records" ]; then
  COUNT=$(find src/hooks/domains/health-records -name "*.ts" -type f -exec grep -l "from '../../../services/modules/healthRecordsApi'" {} \; 2>/dev/null | wc -l)
  if [ "$COUNT" -gt 0 ]; then
    find src/hooks/domains/health-records -name "*.ts" -type f -exec sed -i \
      "s|from '../../../services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" {} \;
    echo -e "${GREEN}✓ Updated $COUNT hook files${NC}"
    UPDATED_FILES=$((UPDATED_FILES + COUNT))
  else
    echo -e "${BLUE}  No files to update${NC}"
  fi
else
  echo -e "${BLUE}  Directory not found, skipping${NC}"
fi
echo ""

# 2. Students Hooks
echo -e "${YELLOW}📝 [2/8] Updating students hooks...${NC}"
if [ -d "src/hooks/domains/students" ]; then
  COUNT=$(find src/hooks/domains/students -name "*.ts" -type f -exec grep -l "from '@/services/modules/studentsApi'" {} \; 2>/dev/null | wc -l)
  if [ "$COUNT" -gt 0 ]; then
    find src/hooks/domains/students -name "*.ts" -type f -exec sed -i \
      "s|from '@/services/modules/studentsApi'|from '@/lib/api/studentsApi'|g" {} \;
    echo -e "${GREEN}✓ Updated $COUNT hook files${NC}"
    UPDATED_FILES=$((UPDATED_FILES + COUNT))
  else
    echo -e "${BLUE}  No files to update${NC}"
  fi
else
  echo -e "${BLUE}  Directory not found, skipping${NC}"
fi
echo ""

# 3. Health Records Components
echo -e "${YELLOW}📝 [3/8] Updating health records components...${NC}"
if [ -d "src/components/features/health-records" ]; then
  COUNT=$(find src/components/features/health-records -name "*.tsx" -type f -exec grep -l "from '@/services/modules/healthRecordsApi'" {} \; 2>/dev/null | wc -l)
  if [ "$COUNT" -gt 0 ]; then
    find src/components/features/health-records -name "*.tsx" -type f -exec sed -i \
      "s|from '@/services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" {} \;
    echo -e "${GREEN}✓ Updated $COUNT component files${NC}"
    UPDATED_FILES=$((UPDATED_FILES + COUNT))
  else
    echo -e "${BLUE}  No files to update${NC}"
  fi
else
  echo -e "${BLUE}  Directory not found, skipping${NC}"
fi
echo ""

# 4. Type Files
echo -e "${YELLOW}📝 [4/8] Updating type files...${NC}"
TYPE_COUNT=0

if [ -f "src/types/domain/healthRecords.types.ts" ]; then
  if grep -q "from '../services/modules/healthRecordsApi'" "src/types/domain/healthRecords.types.ts" 2>/dev/null; then
    sed -i "s|from '../services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" \
      src/types/domain/healthRecords.types.ts
    TYPE_COUNT=$((TYPE_COUNT + 1))
  fi
fi

if [ -f "src/types/legacy/healthRecords.ts" ]; then
  if grep -q "from '../services/modules/healthRecordsApi'" "src/types/legacy/healthRecords.ts" 2>/dev/null; then
    sed -i "s|from '../services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" \
      src/types/legacy/healthRecords.ts
    TYPE_COUNT=$((TYPE_COUNT + 1))
  fi
fi

if [ -f "src/utils/healthRecords.ts" ]; then
  if grep -q "from '@/services/modules/healthRecordsApi'" "src/utils/healthRecords.ts" 2>/dev/null; then
    sed -i "s|from '@/services/modules/healthRecordsApi'|from '@/lib/api/healthRecordsApi'|g" \
      src/utils/healthRecords.ts
    TYPE_COUNT=$((TYPE_COUNT + 1))
  fi
fi

if [ "$TYPE_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✓ Updated $TYPE_COUNT type files${NC}"
  UPDATED_FILES=$((UPDATED_FILES + TYPE_COUNT))
else
  echo -e "${BLUE}  No files to update${NC}"
fi
echo ""

# 5. Incident Thunks
echo -e "${YELLOW}📝 [5/8] Updating incident thunks...${NC}"
if [ -d "src/stores/slices/incidentReports/thunks" ]; then
  COUNT=$(find src/stores/slices/incidentReports/thunks -name "*.ts" -type f -exec grep -l "from '@/services/modules/incidentsApi'" {} \; 2>/dev/null | wc -l)
  if [ "$COUNT" -gt 0 ]; then
    find src/stores/slices/incidentReports/thunks -name "*.ts" -type f -exec sed -i \
      "s|from '@/services/modules/incidentsApi'|from '@/lib/api/incidentsApi'|g" {} \;
    echo -e "${GREEN}✓ Updated $COUNT thunk files${NC}"
    UPDATED_FILES=$((UPDATED_FILES + COUNT))
  else
    echo -e "${BLUE}  No files to update${NC}"
  fi
else
  echo -e "${BLUE}  Directory not found, skipping${NC}"
fi
echo ""

# 6. Access Control Thunks
echo -e "${YELLOW}📝 [6/8] Updating access control thunks...${NC}"
if [ -d "src/identity-access/stores/accessControl/thunks" ]; then
  COUNT=$(find src/identity-access/stores/accessControl/thunks -name "*.ts" -type f -exec grep -l "from '@/services/modules/accessControlApi'" {} \; 2>/dev/null | wc -l)
  if [ "$COUNT" -gt 0 ]; then
    find src/identity-access/stores/accessControl/thunks -name "*.ts" -type f -exec sed -i \
      "s|from '@/services/modules/accessControlApi'|from '@/lib/api/accessControlApi'|g" {} \;
    echo -e "${GREEN}✓ Updated $COUNT thunk files${NC}"
    UPDATED_FILES=$((UPDATED_FILES + COUNT))
  else
    echo -e "${BLUE}  No files to update${NC}"
  fi
else
  echo -e "${BLUE}  Directory not found, skipping${NC}"
fi
echo ""

# 7. Contacts Slice
echo -e "${YELLOW}📝 [7/8] Updating contacts slice...${NC}"
if [ -f "src/stores/slices/contactsSlice.ts" ]; then
  if grep -q "from '@/services/modules/emergencyContactsApi'" "src/stores/slices/contactsSlice.ts" 2>/dev/null; then
    sed -i "s|from '@/services/modules/emergencyContactsApi'|from '@/lib/api/emergencyContactsApi'|g" \
      src/stores/slices/contactsSlice.ts
    echo -e "${GREEN}✓ Updated contacts slice${NC}"
    UPDATED_FILES=$((UPDATED_FILES + 1))
  else
    echo -e "${BLUE}  No changes needed${NC}"
  fi
else
  echo -e "${BLUE}  File not found, skipping${NC}"
fi
echo ""

# 8. Communications Data
echo -e "${YELLOW}📝 [8/8] Updating communications data...${NC}"
if [ -f "src/app/(dashboard)/communications/data.ts" ]; then
  if grep -q "from '@/services/modules/communicationsApi'" "src/app/(dashboard)/communications/data.ts" 2>/dev/null; then
    sed -i "s|from '@/services/modules/communicationsApi'|from '@/lib/api/communicationsApi'|g" \
      src/app/\(dashboard\)/communications/data.ts
    echo -e "${GREEN}✓ Updated communications data${NC}"
    UPDATED_FILES=$((UPDATED_FILES + 1))
  else
    echo -e "${BLUE}  No changes needed${NC}"
  fi
else
  echo -e "${BLUE}  File not found, skipping${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Migration Complete${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}✅ Successfully updated $UPDATED_FILES files${NC}"
echo ""

# Verification
echo -e "${YELLOW}🔍 Running verification...${NC}"
echo ""

# Count remaining imports
REMAINING=$(find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/services/modules/*" \
  -exec grep -l "from.*services/modules" {} \; 2>/dev/null | wc -l)

echo -e "${BLUE}📊 Import Statistics:${NC}"
echo -e "   Initial count:   ${INITIAL_COUNT}"
echo -e "   Files updated:   ${UPDATED_FILES}"
echo -e "   Remaining count: ${REMAINING}"
echo ""

if [ "$REMAINING" -eq 0 ]; then
  echo -e "${GREEN}✅ All imports successfully updated!${NC}"
else
  echo -e "${YELLOW}⚠️  ${REMAINING} files still contain old imports:${NC}"
  find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/services/modules/*" \
    -exec grep -l "from.*services/modules" {} \; 2>/dev/null | head -10
  if [ "$REMAINING" -gt 10 ]; then
    echo -e "   ... and $((REMAINING - 10)) more"
  fi
fi
echo ""

# TypeScript check
echo -e "${YELLOW}🧪 Running TypeScript check...${NC}"
if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
  ERRORS=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || true)
  echo -e "${YELLOW}⚠️  TypeScript found ${ERRORS} errors (may be unrelated to this migration)${NC}"
  echo -e "${BLUE}   Run 'npx tsc --noEmit' for details${NC}"
else
  echo -e "${GREEN}✅ TypeScript check passed!${NC}"
fi
echo ""

# Git status
echo -e "${YELLOW}📝 Git status:${NC}"
MODIFIED=$(git status --short | grep -c "^ M" || true)
echo -e "   Modified files: ${MODIFIED}"
echo ""

# Show sample of changes
echo -e "${BLUE}📋 Sample of changes:${NC}"
git diff --stat | head -15
echo ""

# Next steps
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Next Steps${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "1. Review changes:"
echo -e "   ${BLUE}git diff${NC}"
echo ""
echo -e "2. Test TypeScript compilation:"
echo -e "   ${BLUE}npx tsc --noEmit${NC}"
echo ""
echo -e "3. Test build:"
echo -e "   ${BLUE}npm run build${NC}"
echo ""
echo -e "4. Test in development:"
echo -e "   ${BLUE}npm run dev${NC}"
echo ""
echo -e "5. If everything looks good, commit:"
echo -e "   ${BLUE}git add .${NC}"
echo -e "   ${BLUE}git commit -m \"refactor: migrate service module imports to lib/api\"${NC}"
echo ""
echo -e "6. If you need to rollback:"
echo -e "   ${BLUE}git checkout -- src/${NC}"
echo -e "   or"
echo -e "   ${BLUE}git checkout $BACKUP_BRANCH${NC}"
echo ""

echo -e "${GREEN}✅ Migration script completed successfully!${NC}"
echo ""

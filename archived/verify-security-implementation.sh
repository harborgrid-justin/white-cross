#!/bin/bash

echo "=============================================="
echo "Security Implementation Verification"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ FOUND:${NC} $1"
        return 0
    else
        echo -e "${RED}❌ MISSING:${NC} $1"
        return 1
    fi
}

count_tests() {
    if [ -f "$1" ]; then
        count=$(grep -c "it('\\|test('" "$1" 2>/dev/null || echo "0")
        echo -e "${YELLOW}   └─ Test cases: $count${NC}"
    fi
}

echo "Checking Implementation Files..."
echo "================================"
check_file "/home/user/white-cross/backend/src/common/exceptions/filters/hipaa-exception.filter.ts"
echo "   └─ HIPAA Exception Filter (PHI Sanitization)"

echo ""
echo "Checking Test Files..."
echo "====================="
check_file "/home/user/white-cross/backend/src/common/exceptions/filters/hipaa-exception.filter.spec.ts"
count_tests "/home/user/white-cross/backend/src/common/exceptions/filters/hipaa-exception.filter.spec.ts"

check_file "/home/user/white-cross/backend/src/middleware/security/rate-limit.guard.spec.ts"
count_tests "/home/user/white-cross/backend/src/middleware/security/rate-limit.guard.spec.ts"

check_file "/home/user/white-cross/backend/src/middleware/security/csrf.guard.spec.ts"
count_tests "/home/user/white-cross/backend/src/middleware/security/csrf.guard.spec.ts"

check_file "/home/user/white-cross/backend/src/middleware/core/guards/permissions.guard.spec.ts"
count_tests "/home/user/white-cross/backend/src/middleware/core/guards/permissions.guard.spec.ts"

echo ""
echo "Checking Documentation Files..."
echo "==============================="
check_file "/home/user/white-cross/SECURITY_IMPLEMENTATION_SUMMARY.md"
check_file "/home/user/white-cross/SECURITY_TESTS_QUICK_REFERENCE.md"
check_file "/home/user/white-cross/SECURITY_IMPLEMENTATION_DELIVERABLES.md"

echo ""
echo "Checking main.ts Registration..."
echo "================================="
if grep -q "HipaaExceptionFilter" /home/user/white-cross/backend/src/main.ts; then
    echo -e "${GREEN}✅ REGISTERED:${NC} HIPAA Exception Filter in main.ts"
else
    echo -e "${RED}❌ NOT REGISTERED:${NC} HIPAA Exception Filter in main.ts"
fi

echo ""
echo "=============================================="
echo "Summary"
echo "=============================================="
echo ""

total_files=8
found_files=0

for file in \
    "/home/user/white-cross/backend/src/common/exceptions/filters/hipaa-exception.filter.ts" \
    "/home/user/white-cross/backend/src/common/exceptions/filters/hipaa-exception.filter.spec.ts" \
    "/home/user/white-cross/backend/src/middleware/security/rate-limit.guard.spec.ts" \
    "/home/user/white-cross/backend/src/middleware/security/csrf.guard.spec.ts" \
    "/home/user/white-cross/backend/src/middleware/core/guards/permissions.guard.spec.ts" \
    "/home/user/white-cross/SECURITY_IMPLEMENTATION_SUMMARY.md" \
    "/home/user/white-cross/SECURITY_TESTS_QUICK_REFERENCE.md" \
    "/home/user/white-cross/SECURITY_IMPLEMENTATION_DELIVERABLES.md"
do
    if [ -f "$file" ]; then
        ((found_files++))
    fi
done

echo "Files Created: $found_files / $total_files"
echo ""

if [ $found_files -eq $total_files ]; then
    echo -e "${GREEN}✅ All security implementation files are in place!${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Run tests: cd /home/user/white-cross/backend && npx jest --testPathPattern='(hipaa-exception|rate-limit|csrf|permissions).*.spec'"
    echo "2. Review summary: cat /home/user/white-cross/SECURITY_IMPLEMENTATION_SUMMARY.md"
    echo "3. Check deliverables: cat /home/user/white-cross/SECURITY_IMPLEMENTATION_DELIVERABLES.md"
else
    echo -e "${RED}❌ Some files are missing. Please review the output above.${NC}"
fi

echo ""
echo "=============================================="

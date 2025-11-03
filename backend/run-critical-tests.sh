#!/bin/bash

# White Cross - Critical Tests Runner
# This script runs all critical security and healthcare tests

echo "========================================"
echo "White Cross - Critical Tests Runner"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to backend directory
cd "$(dirname "$0")"

echo "Running critical security and healthcare tests..."
echo ""

# Test suites to run
TESTS=(
    "src/auth/__tests__/auth.service.spec.ts"
    "src/auth/guards/__tests__/jwt-auth.guard.spec.ts"
    "src/auth/guards/__tests__/roles.guard.spec.ts"
    "src/emergency-contact/__tests__/emergency-contact.service.spec.ts"
)

PASSED=0
FAILED=0

# Run each test suite
for test in "${TESTS[@]}"; do
    echo -e "${YELLOW}Running: $test${NC}"
    if npm test "$test" -- --silent 2>&1 | grep -q "PASS"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
    fi
    echo ""
done

# Summary
echo "========================================"
echo "Test Summary"
echo "========================================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All critical tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please review the output above.${NC}"
    exit 1
fi

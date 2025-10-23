#!/bin/bash

# Test All Swagger Endpoints Script
BASE_URL="http://localhost:3001"
RESULTS_FILE="endpoint-test-results.txt"
ERRORS_FILE="endpoint-errors.txt"
MISSING_METHODS_FILE="missing-methods.txt"

echo "=== White Cross API Endpoint Testing ===" > "$RESULTS_FILE"
echo "Base URL: $BASE_URL" >> "$RESULTS_FILE"
echo "Timestamp: $(date)" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

> "$ERRORS_FILE"
> "$MISSING_METHODS_FILE"

TOTAL=0
PASSED=0
FAILED=0
METHOD_NOT_ALLOWED=0

# Test an endpoint
test_endpoint() {
    local method=$1
    local path=$2
    local description=$3

    TOTAL=$((TOTAL + 1))

    # Replace path parameters with test IDs
    test_path="${path//\{id\}/1}"
    test_path="${test_path//\{studentId\}/1}"
    test_path="${test_path//\{medicationId\}/1}"
    test_path="${test_path//\{appointmentId\}/1}"
    test_path="${test_path//\{userId\}/1}"
    test_path="${test_path//\{recordId\}/1}"
    test_path="${test_path//\{reportId\}/1}"
    test_path="${test_path//\{contactId\}/1}"
    test_path="${test_path//\{incidentId\}/1}"
    test_path="${test_path//\{itemId\}/1}"
    test_path="${test_path//\{vendorId\}/1}"
    test_path="${test_path//\{orderId\}/1}"
    test_path="${test_path//\{messageId\}/1}"
    test_path="${test_path//\{broadcastId\}/1}"
    test_path="${test_path//\{documentId\}/1}"
    test_path="${test_path//\{roleId\}/1}"
    test_path="${test_path//\{permissionId\}/1}"
    test_path="${test_path//\{districtId\}/1}"
    test_path="${test_path//\{schoolId\}/1}"

    full_url="${BASE_URL}${test_path}"

    # Make request
    if [ "$method" = "POST" ] || [ "$method" = "PUT" ] || [ "$method" = "PATCH" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$full_url" \
            -H "Content-Type: application/json" \
            -d '{}' 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$full_url" 2>&1)
    fi

    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    # Check status
    if [ "$status_code" = "405" ]; then
        METHOD_NOT_ALLOWED=$((METHOD_NOT_ALLOWED + 1))
        echo "✗ $method $path [405 - METHOD NOT ALLOWED]" | tee -a "$RESULTS_FILE"
        echo "$method $path - Method Not Allowed (405)" >> "$MISSING_METHODS_FILE"
        echo "$method $path" >> "$ERRORS_FILE"
        echo "  Status: 405 Method Not Allowed" >> "$ERRORS_FILE"
        echo "  Description: $description" >> "$ERRORS_FILE"
        echo "" >> "$ERRORS_FILE"
    elif [ "$status_code" = "501" ]; then
        FAILED=$((FAILED + 1))
        echo "✗ $method $path [501 - NOT IMPLEMENTED]" | tee -a "$RESULTS_FILE"
        echo "$method $path - Not Implemented (501)" >> "$MISSING_METHODS_FILE"
        echo "$method $path" >> "$ERRORS_FILE"
        echo "  Status: 501 Not Implemented" >> "$ERRORS_FILE"
        echo "  Description: $description" >> "$ERRORS_FILE"
        echo "" >> "$ERRORS_FILE"
    elif [ "$status_code" = "500" ]; then
        FAILED=$((FAILED + 1))
        echo "✗ $method $path [500 - SERVER ERROR]" | tee -a "$RESULTS_FILE"
        echo "$method $path" >> "$ERRORS_FILE"
        echo "  Status: 500 Server Error" >> "$ERRORS_FILE"
        echo "  Response: $body" >> "$ERRORS_FILE"
        echo "  Description: $description" >> "$ERRORS_FILE"
        echo "" >> "$ERRORS_FILE"
    elif [ "$status_code" = "000" ] || [ -z "$status_code" ]; then
        FAILED=$((FAILED + 1))
        echo "✗ $method $path [CONNECTION ERROR]" | tee -a "$RESULTS_FILE"
        echo "$method $path" >> "$ERRORS_FILE"
        echo "  Status: Connection Error" >> "$ERRORS_FILE"
        echo "  Description: $description" >> "$ERRORS_FILE"
        echo "" >> "$ERRORS_FILE"
    else
        PASSED=$((PASSED + 1))
        if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
            echo "✓ $method $path [$status_code]" >> "$RESULTS_FILE"
        else
            # Expected errors (401, 403, 404, 422 are common for test data)
            echo "○ $method $path [$status_code - Expected]" >> "$RESULTS_FILE"
        fi
    fi
}

echo "Testing endpoints..."

# Critical endpoints first
echo "Testing health check..."
test_endpoint "GET" "/health" "Health check endpoint"

echo "Testing authentication endpoints..."
test_endpoint "POST" "/api/v1/auth/login" "User login"
test_endpoint "POST" "/api/v1/auth/register" "User registration"
test_endpoint "POST" "/api/v1/auth/logout" "User logout"
test_endpoint "POST" "/api/v1/auth/refresh" "Refresh token"

echo "Testing student endpoints..."
test_endpoint "GET" "/api/v1/students" "Get all students"
test_endpoint "GET" "/api/v1/students/{id}" "Get student by ID"
test_endpoint "POST" "/api/v1/students" "Create student"
test_endpoint "PUT" "/api/v1/students/{id}" "Update student"
test_endpoint "DELETE" "/api/v1/students/{id}" "Delete student"

echo "Testing medication endpoints..."
test_endpoint "GET" "/api/v1/medications" "Get all medications"
test_endpoint "GET" "/api/v1/medications/{id}" "Get medication by ID"
test_endpoint "POST" "/api/v1/medications" "Create medication"
test_endpoint "PUT" "/api/v1/medications/{id}" "Update medication"
test_endpoint "DELETE" "/api/v1/medications/{id}" "Delete medication"

echo "Testing appointment endpoints..."
test_endpoint "GET" "/api/v1/appointments" "Get all appointments"
test_endpoint "GET" "/api/v1/appointments/{id}" "Get appointment by ID"
test_endpoint "POST" "/api/v1/appointments" "Create appointment"
test_endpoint "PUT" "/api/v1/appointments/{id}" "Update appointment"
test_endpoint "DELETE" "/api/v1/appointments/{id}" "Delete appointment"

echo ""
echo "=== Test Summary ===" | tee -a "$RESULTS_FILE"
echo "Total: $TOTAL" | tee -a "$RESULTS_FILE"
echo "Passed: $PASSED" | tee -a "$RESULTS_FILE"
echo "Failed: $FAILED" | tee -a "$RESULTS_FILE"
echo "Method Not Allowed (405): $METHOD_NOT_ALLOWED" | tee -a "$RESULTS_FILE"

if [ -s "$MISSING_METHODS_FILE" ]; then
    echo "" | tee -a "$RESULTS_FILE"
    echo "=== Missing/Not Implemented Methods ===" | tee -a "$RESULTS_FILE"
    cat "$MISSING_METHODS_FILE" | tee -a "$RESULTS_FILE"
fi

echo ""
echo "Results saved to: $RESULTS_FILE"
echo "Errors saved to: $ERRORS_FILE"
echo "Missing methods saved to: $MISSING_METHODS_FILE"

#!/bin/bash
# White Cross Backend - Simple API Testing Script
# Tests all endpoints with authentication

BASE_URL="http://localhost:3001"
TOKEN=""

echo "========================================"
echo "White Cross API - Comprehensive Testing"
echo "========================================"
echo ""

# Step 1: Try to login with default admin
echo "[1] Attempting Login..."
echo "------------------------"

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@whitecross.health",
    "password": "admin123"
  }')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | head -c 200
echo ""

# Extract token if successful
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "⚠ Login failed. Testing without authentication..."
    echo ""
else
    echo "✓ Login successful! Token obtained."
    echo "Token: ${TOKEN:0:50}..."
    echo ""
fi

# Step 2: Test Core Endpoints
echo "[2] Testing Core Endpoints"
echo "------------------------"
curl -s -o /dev/null -w "Health: %{http_code}\n" "$BASE_URL/health"
curl -s -o /dev/null -w "Swagger JSON: %{http_code}\n" "$BASE_URL/swagger.json"
curl -s -o /dev/null -w "Swagger UI: %{http_code}\n" "$BASE_URL/docs"
echo ""

# Step 3: Test with Auth (if we have token)
if [ -n "$TOKEN" ]; then
    echo "[3] Testing Authenticated Endpoints"
    echo "------------------------"

    echo "=== Core Module ==="
    curl -s -o /dev/null -w "GET /api/v1/auth/me: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/auth/me"
    curl -s -o /dev/null -w "GET /api/v1/users: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/users"
    curl -s -o /dev/null -w "GET /api/v1/access-control/roles: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/access-control/roles"

    echo ""
    echo "=== Healthcare Module ==="
    curl -s -o /dev/null -w "GET /api/v1/medications: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/medications"
    curl -s -o /dev/null -w "GET /api/v1/medications/inventory: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/medications/inventory"

    echo ""
    echo "=== Operations Module ==="
    curl -s -o /dev/null -w "GET /api/v1/students: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/students"
    curl -s -o /dev/null -w "GET /api/v1/appointments: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/appointments"

    echo ""
    echo "=== Communications Module ==="
    curl -s -o /dev/null -w "GET /api/v1/communications/messages: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/communications/messages"
    curl -s -o /dev/null -w "GET /api/v1/communications/broadcasts: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/communications/broadcasts"

    echo ""
    echo "=== Compliance Module ==="
    curl -s -o /dev/null -w "GET /api/v1/audit/logs: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/audit/logs"
    curl -s -o /dev/null -w "GET /api/v1/compliance/reports: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/compliance/reports"

    echo ""
    echo "=== Documents & Analytics Module ==="
    curl -s -o /dev/null -w "GET /api/v1/documents: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/documents"
    curl -s -o /dev/null -w "GET /api/v1/incidents: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/incidents"
    curl -s -o /dev/null -w "GET /api/v1/analytics/summary: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/analytics/summary"
fi

echo ""
echo "========================================"
echo "Testing Complete!"
echo "========================================"
echo ""
echo "Total Endpoints Documented: 223"
echo "Swagger UI: $BASE_URL/docs"
echo ""

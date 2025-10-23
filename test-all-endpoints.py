#!/usr/bin/env python3
"""
Comprehensive Swagger Endpoint Tester
Tests all endpoints defined in the Swagger specification
"""

import json
import requests
import sys
from datetime import datetime
from collections import defaultdict

BASE_URL = "http://localhost:3001"
SWAGGER_URL = f"{BASE_URL}/swagger.json"

# Colors for terminal output
class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_color(text, color=Colors.RESET):
    try:
        print(f"{color}{text}{Colors.RESET}")
    except UnicodeEncodeError:
        # Fallback for Windows console
        print(f"{color}{text.encode('ascii', 'ignore').decode()}{Colors.RESET}")

def fetch_swagger_spec():
    """Fetch the Swagger specification"""
    try:
        response = requests.get(SWAGGER_URL, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print_color(f"✗ Failed to fetch Swagger spec: {e}", Colors.RED)
        sys.exit(1)

def replace_path_params(path):
    """Replace path parameters with test values"""
    replacements = {
        '{id}': '1',
        '{studentId}': '1',
        '{medicationId}': '1',
        '{appointmentId}': '1',
        '{userId}': '1',
        '{recordId}': '1',
        '{reportId}': '1',
        '{contactId}': '1',
        '{incidentId}': '1',
        '{itemId}': '1',
        '{vendorId}': '1',
        '{orderId}': '1',
        '{messageId}': '1',
        '{broadcastId}': '1',
        '{documentId}': '1',
        '{roleId}': '1',
        '{permissionId}': '1',
        '{districtId}': '1',
        '{schoolId}': '1',
        '{administrationId}': '1',
        '{logId}': '1',
        '{assessmentId}': '1',
    }

    test_path = path
    for param, value in replacements.items():
        test_path = test_path.replace(param, value)
    return test_path

def test_endpoint(method, path, operation, session):
    """Test a single endpoint"""
    test_path = replace_path_params(path)
    url = f"{BASE_URL}{test_path}"

    headers = {'Content-Type': 'application/json'}

    # Prepare request body for POST/PUT/PATCH
    data = None
    if method.upper() in ['POST', 'PUT', 'PATCH']:
        data = json.dumps({})

    result = {
        'method': method.upper(),
        'path': path,
        'test_path': test_path,
        'tags': operation.get('tags', []),
        'summary': operation.get('summary', ''),
    }

    try:
        response = session.request(
            method=method.upper(),
            url=url,
            headers=headers,
            data=data,
            timeout=10
        )

        result['status'] = response.status_code

        # Categorize response
        if response.status_code == 405:
            result['result'] = 'METHOD_NOT_ALLOWED'
            result['error'] = 'Method not implemented in backend'
            return result, 'METHOD_NOT_ALLOWED'
        elif response.status_code == 501:
            result['result'] = 'NOT_IMPLEMENTED'
            result['error'] = 'Endpoint not implemented'
            return result, 'NOT_IMPLEMENTED'
        elif response.status_code >= 500:
            result['result'] = 'SERVER_ERROR'
            try:
                error_body = response.json()
                result['error'] = error_body.get('error', {}).get('message', response.text[:200])
            except:
                result['error'] = response.text[:200]
            return result, 'SERVER_ERROR'
        elif response.status_code in [200, 201, 202, 204]:
            result['result'] = 'SUCCESS'
            return result, 'SUCCESS'
        elif response.status_code in [401, 403]:
            result['result'] = 'AUTH_REQUIRED'
            result['error'] = 'Authentication/Authorization required (expected)'
            return result, 'AUTH_REQUIRED'
        elif response.status_code == 404:
            result['result'] = 'NOT_FOUND'
            result['error'] = 'Resource not found (expected for test ID)'
            return result, 'NOT_FOUND'
        elif response.status_code == 422:
            result['result'] = 'VALIDATION_ERROR'
            result['error'] = 'Validation error (expected for empty body)'
            return result, 'VALIDATION_ERROR'
        else:
            result['result'] = 'OTHER'
            try:
                error_body = response.json()
                result['error'] = error_body.get('error', {}).get('message', response.text[:200])
            except:
                result['error'] = response.text[:200]
            return result, 'OTHER'

    except requests.exceptions.Timeout:
        result['status'] = 'TIMEOUT'
        result['result'] = 'TIMEOUT'
        result['error'] = 'Request timed out'
        return result, 'TIMEOUT'
    except requests.exceptions.ConnectionError:
        result['status'] = 'CONNECTION_ERROR'
        result['result'] = 'CONNECTION_ERROR'
        result['error'] = 'Could not connect to server'
        return result, 'CONNECTION_ERROR'
    except Exception as e:
        result['status'] = 'ERROR'
        result['result'] = 'ERROR'
        result['error'] = str(e)
        return result, 'ERROR'

def get_auth_token():
    """Get authentication token"""
    try:
        # Try to read existing token
        with open('.auth-token.txt', 'r') as f:
            return f.read().strip()
    except:
        # Login to get new token
        try:
            response = requests.post(
                f"{BASE_URL}/api/v1/auth/login",
                json={"email": "nurse@example.com", "password": "NursePassword123"},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                token = data.get('data', {}).get('token')
                # Save for future use
                with open('.auth-token.txt', 'w') as f:
                    f.write(token)
                return token
        except:
            pass
    return None

def main():
    print_color("\n=== White Cross API Endpoint Testing ===", Colors.CYAN + Colors.BOLD)
    print_color(f"Base URL: {BASE_URL}\n", Colors.CYAN)

    # Fetch Swagger spec
    print_color("Fetching Swagger specification...", Colors.CYAN)
    swagger = fetch_swagger_spec()
    print_color("Swagger spec fetched successfully\n", Colors.GREEN)

    # Get auth token
    print_color("Getting authentication token...", Colors.CYAN)
    auth_token = get_auth_token()
    if auth_token:
        print_color("Auth token obtained\n", Colors.GREEN)
    else:
        print_color("No auth token (testing without authentication)\n", Colors.YELLOW)

    # Initialize session
    session = requests.Session()
    if auth_token:
        session.headers.update({'Authorization': f'Bearer {auth_token}'})

    # Statistics
    stats = defaultdict(int)
    results = []
    issues = {
        'METHOD_NOT_ALLOWED': [],
        'NOT_IMPLEMENTED': [],
        'SERVER_ERROR': [],
        'TIMEOUT': [],
        'CONNECTION_ERROR': [],
        'ERROR': []
    }

    # Test all endpoints
    print_color("Testing endpoints...\n", Colors.CYAN)

    paths = sorted(swagger.get('paths', {}).items())

    for path, methods in paths:
        for method, operation in methods.items():
            if method in ['parameters', 'summary', 'description']:
                continue

            stats['total'] += 1

            result, category = test_endpoint(method, path, operation, session)
            results.append(result)
            stats[category] += 1

            # Print result
            if category == 'SUCCESS':
                print_color(f"  ✓ {method.upper():6} {path} [{result['status']}]", Colors.GREEN)
            elif category in ['AUTH_REQUIRED', 'NOT_FOUND', 'VALIDATION_ERROR']:
                print_color(f"  ○ {method.upper():6} {path} [{result['status']} - Expected]", Colors.YELLOW)
            elif category == 'METHOD_NOT_ALLOWED':
                print_color(f"  ✗ {method.upper():6} {path} [405 - METHOD NOT IMPLEMENTED]", Colors.RED)
                issues['METHOD_NOT_ALLOWED'].append(result)
            elif category == 'NOT_IMPLEMENTED':
                print_color(f"  ✗ {method.upper():6} {path} [501 - NOT IMPLEMENTED]", Colors.RED)
                issues['NOT_IMPLEMENTED'].append(result)
            elif category == 'SERVER_ERROR':
                print_color(f"  ✗ {method.upper():6} {path} [{result['status']} - SERVER ERROR]", Colors.RED)
                issues['SERVER_ERROR'].append(result)
            else:
                print_color(f"  ! {method.upper():6} {path} [{result.get('status', 'N/A')}]", Colors.YELLOW)
                if category in issues:
                    issues[category].append(result)

    # Summary
    print_color("\n=== Test Summary ===", Colors.CYAN + Colors.BOLD)
    print_color(f"Total Endpoints: {stats['total']}", Colors.CYAN)
    print_color(f"Successful: {stats['SUCCESS']}", Colors.GREEN)
    print_color(f"Auth Required: {stats['AUTH_REQUIRED']}", Colors.YELLOW)
    print_color(f"Not Found (expected): {stats['NOT_FOUND']}", Colors.YELLOW)
    print_color(f"Validation Errors (expected): {stats['VALIDATION_ERROR']}", Colors.YELLOW)
    print_color(f"Method Not Allowed: {stats['METHOD_NOT_ALLOWED']}", Colors.RED)
    print_color(f"Not Implemented: {stats['NOT_IMPLEMENTED']}", Colors.RED)
    print_color(f"Server Errors: {stats['SERVER_ERROR']}", Colors.RED)

    if stats['TIMEOUT'] > 0:
        print_color(f"Timeouts: {stats['TIMEOUT']}", Colors.RED)
    if stats['CONNECTION_ERROR'] > 0:
        print_color(f"Connection Errors: {stats['CONNECTION_ERROR']}", Colors.RED)
    if stats['ERROR'] > 0:
        print_color(f"Other Errors: {stats['ERROR']}", Colors.RED)

    # Calculate health
    total_issues = stats['METHOD_NOT_ALLOWED'] + stats['NOT_IMPLEMENTED'] + stats['SERVER_ERROR']
    health_rate = ((stats['total'] - total_issues) / stats['total'] * 100) if stats['total'] > 0 else 0

    print_color(f"\nEndpoint Health: {health_rate:.1f}%",
                Colors.GREEN if health_rate > 90 else Colors.YELLOW if health_rate > 70 else Colors.RED)

    # Save results
    output = {
        'timestamp': datetime.now().isoformat(),
        'base_url': BASE_URL,
        'statistics': dict(stats),
        'health_rate': health_rate,
        'results': results,
        'issues': issues
    }

    with open('endpoint-test-results.json', 'w') as f:
        json.dump(output, f, indent=2)

    print_color("\n✓ Results saved to: endpoint-test-results.json", Colors.GREEN)

    # Show critical issues
    if issues['METHOD_NOT_ALLOWED']:
        print_color("\n=== Methods Not Implemented (405) ===", Colors.RED + Colors.BOLD)
        for issue in issues['METHOD_NOT_ALLOWED']:
            print_color(f"  {issue['method']:6} {issue['path']}", Colors.RED)

        with open('missing-methods.txt', 'w') as f:
            f.write("Missing/Not Implemented HTTP Methods\n")
            f.write("=" * 50 + "\n\n")
            for issue in issues['METHOD_NOT_ALLOWED']:
                f.write(f"{issue['method']:6} {issue['path']}\n")
                f.write(f"  Tags: {', '.join(issue['tags'])}\n")
                f.write(f"  Summary: {issue['summary']}\n\n")

        print_color("✓ Missing methods saved to: missing-methods.txt", Colors.GREEN)

    if issues['SERVER_ERROR']:
        print_color("\n=== Server Errors (5xx) ===", Colors.RED + Colors.BOLD)
        for issue in issues['SERVER_ERROR'][:10]:  # Show first 10
            print_color(f"  {issue['method']:6} {issue['path']} [{issue['status']}]", Colors.RED)
            if 'error' in issue:
                print_color(f"    Error: {issue['error'][:100]}", Colors.RED)

        if len(issues['SERVER_ERROR']) > 10:
            print_color(f"  ... and {len(issues['SERVER_ERROR']) - 10} more", Colors.RED)

    print()

    # Exit code
    if total_issues > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == '__main__':
    main()

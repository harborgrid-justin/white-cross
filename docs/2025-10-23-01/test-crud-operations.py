#!/usr/bin/env python3
"""
Comprehensive CRUD Operations Tester
Tests Create, Read, Update, Delete operations for all major endpoints
"""

import json
import requests
import sys
from datetime import datetime, timedelta

BASE_URL = "http://localhost:3001"

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
        print(f"{color}{text.encode('ascii', 'ignore').decode()}{Colors.RESET}")

def login():
    """Login and get authentication token"""
    print_color("\n=== Authentication ===", Colors.CYAN + Colors.BOLD)

    response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": "nurse@example.com", "password": "NursePassword123"},
        timeout=10
    )

    if response.status_code == 200:
        data = response.json()
        token = data.get('data', {}).get('token')
        print_color("Login successful", Colors.GREEN)
        return token
    else:
        print_color(f"Login failed: {response.status_code}", Colors.RED)
        return None

def test_student_crud(token):
    """Test Student CRUD operations"""
    print_color("\n=== Testing Student CRUD Operations ===", Colors.CYAN + Colors.BOLD)

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    results = {'create': False, 'read': False, 'update': False, 'delete': False}
    student_id = None

    # CREATE
    print_color("\n[CREATE] Creating new student...", Colors.BLUE)
    student_data = {
        "firstName": "Test",
        "lastName": "Student",
        "dateOfBirth": "2010-01-15",
        "gender": "Male",
        "grade": "5",
        "studentNumber": f"STU{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "schoolId": "00000000-0000-0000-0000-000000000001"
    }

    response = requests.post(f"{BASE_URL}/api/v1/students", json=student_data, headers=headers, timeout=10)
    if response.status_code in [200, 201]:
        data = response.json()
        student_id = data.get('data', {}).get('id') or data.get('data', {}).get('student', {}).get('id')
        print_color(f"  SUCCESS: Student created with ID: {student_id}", Colors.GREEN)
        results['create'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)
        return results

    # READ
    print_color(f"\n[READ] Reading student {student_id}...", Colors.BLUE)
    response = requests.get(f"{BASE_URL}/api/v1/students/{student_id}", headers=headers, timeout=10)
    if response.status_code == 200:
        data = response.json()
        student = data.get('data', {}).get('student') or data.get('data', {})
        print_color(f"  SUCCESS: Retrieved student: {student.get('firstName')} {student.get('lastName')}", Colors.GREEN)
        results['read'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    # UPDATE
    print_color(f"\n[UPDATE] Updating student {student_id}...", Colors.BLUE)
    update_data = {
        "firstName": "Updated",
        "lastName": "Student",
        "grade": "6"
    }
    response = requests.put(f"{BASE_URL}/api/v1/students/{student_id}", json=update_data, headers=headers, timeout=10)
    if response.status_code in [200, 204]:
        print_color(f"  SUCCESS: Student updated", Colors.GREEN)
        results['update'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    # DELETE
    print_color(f"\n[DELETE] Deleting student {student_id}...", Colors.BLUE)
    response = requests.delete(f"{BASE_URL}/api/v1/students/{student_id}", headers=headers, timeout=10)
    if response.status_code in [200, 204]:
        print_color(f"  SUCCESS: Student deleted", Colors.GREEN)
        results['delete'] = True
    else:
        # Try deactivate instead
        response = requests.post(f"{BASE_URL}/api/v1/students/{student_id}/deactivate", headers=headers, timeout=10)
        if response.status_code in [200, 204]:
            print_color(f"  SUCCESS: Student deactivated (soft delete)", Colors.GREEN)
            results['delete'] = True
        else:
            print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    return results

def test_medication_crud(token):
    """Test Medication CRUD operations"""
    print_color("\n=== Testing Medication CRUD Operations ===", Colors.CYAN + Colors.BOLD)

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    results = {'create': False, 'read': False, 'update': False, 'delete': False}
    medication_id = None

    # CREATE
    print_color("\n[CREATE] Creating new medication...", Colors.BLUE)
    medication_data = {
        "medicationName": "Test Medication",
        "dosage": "100mg",
        "frequency": "Once daily",
        "route": "Oral",
        "instructions": "Take with food",
        "prescribedBy": "Dr. Test",
        "studentId": "00000000-0000-0000-0000-000000000001",
        "startDate": datetime.now().isoformat(),
        "endDate": (datetime.now() + timedelta(days=30)).isoformat()
    }

    response = requests.post(f"{BASE_URL}/api/v1/medications", json=medication_data, headers=headers, timeout=10)
    if response.status_code in [200, 201]:
        data = response.json()
        medication_id = data.get('data', {}).get('id') or data.get('data', {}).get('medication', {}).get('id')
        print_color(f"  SUCCESS: Medication created with ID: {medication_id}", Colors.GREEN)
        results['create'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)
        return results

    # READ
    print_color(f"\n[READ] Reading medication {medication_id}...", Colors.BLUE)
    response = requests.get(f"{BASE_URL}/api/v1/medications/{medication_id}", headers=headers, timeout=10)
    if response.status_code == 200:
        data = response.json()
        med = data.get('data', {}).get('medication') or data.get('data', {})
        print_color(f"  SUCCESS: Retrieved medication: {med.get('name')}", Colors.GREEN)
        results['read'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    # UPDATE
    print_color(f"\n[UPDATE] Updating medication {medication_id}...", Colors.BLUE)
    update_data = {
        "dosage": "150mg",
        "instructions": "Take with food and water"
    }
    response = requests.put(f"{BASE_URL}/api/v1/medications/{medication_id}", json=update_data, headers=headers, timeout=10)
    if response.status_code in [200, 204]:
        print_color(f"  SUCCESS: Medication updated", Colors.GREEN)
        results['update'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    # DELETE
    print_color(f"\n[DELETE] Deleting medication {medication_id}...", Colors.BLUE)
    response = requests.delete(f"{BASE_URL}/api/v1/medications/{medication_id}", headers=headers, timeout=10)
    if response.status_code in [200, 204]:
        print_color(f"  SUCCESS: Medication deleted", Colors.GREEN)
        results['delete'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    return results

def test_appointment_crud(token):
    """Test Appointment CRUD operations"""
    print_color("\n=== Testing Appointment CRUD Operations ===", Colors.CYAN + Colors.BOLD)

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    results = {'create': False, 'read': False, 'update': False, 'delete': False}
    appointment_id = None

    # CREATE
    print_color("\n[CREATE] Creating new appointment...", Colors.BLUE)
    appointment_data = {
        "studentId": "00000000-0000-0000-0000-000000000001",  # Test ID
        "nurseId": "c5ec6948-bcb8-42c8-8bfb-13bf25e91c87",  # Use the logged-in nurse ID
        "appointmentType": "ROUTINE_CHECKUP",
        "scheduledDate": (datetime.now() + timedelta(days=1)).isoformat(),
        "duration": 30,
        "notes": "Regular checkup"
    }

    response = requests.post(f"{BASE_URL}/api/v1/appointments", json=appointment_data, headers=headers, timeout=10)
    if response.status_code in [200, 201]:
        data = response.json()
        appointment_id = data.get('data', {}).get('id') or data.get('data', {}).get('appointment', {}).get('id')
        print_color(f"  SUCCESS: Appointment created with ID: {appointment_id}", Colors.GREEN)
        results['create'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)
        return results

    # READ
    print_color(f"\n[READ] Reading appointment {appointment_id}...", Colors.BLUE)
    response = requests.get(f"{BASE_URL}/api/v1/appointments/{appointment_id}", headers=headers, timeout=10)
    if response.status_code == 200:
        data = response.json()
        appt = data.get('data', {}).get('appointment') or data.get('data', {})
        print_color(f"  SUCCESS: Retrieved appointment: {appt.get('appointmentType')}", Colors.GREEN)
        results['read'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    # UPDATE
    print_color(f"\n[UPDATE] Updating appointment {appointment_id}...", Colors.BLUE)
    update_data = {
        "status": "CONFIRMED",
        "notes": "Regular checkup - confirmed"
    }
    response = requests.put(f"{BASE_URL}/api/v1/appointments/{appointment_id}", json=update_data, headers=headers, timeout=10)
    if response.status_code in [200, 204]:
        print_color(f"  SUCCESS: Appointment updated", Colors.GREEN)
        results['update'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    # DELETE
    print_color(f"\n[DELETE] Deleting appointment {appointment_id}...", Colors.BLUE)
    response = requests.delete(f"{BASE_URL}/api/v1/appointments/{appointment_id}", headers=headers, timeout=10)
    if response.status_code in [200, 204]:
        print_color(f"  SUCCESS: Appointment deleted", Colors.GREEN)
        results['delete'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    return results

def test_health_record_crud(token):
    """Test Health Record CRUD operations"""
    print_color("\n=== Testing Health Record CRUD Operations ===", Colors.CYAN + Colors.BOLD)

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    results = {'create': False, 'read': False, 'update': False, 'delete': False}
    record_id = None

    # CREATE
    print_color("\n[CREATE] Creating new health record...", Colors.BLUE)
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
    record_data = {
        "studentId": "00000000-0000-0000-0000-000000000001",  # Test ID
        "recordType": "CHECKUP",
        "recordDate": yesterday,
        "diagnosis": "Test health record entry",
        "notes": "Created during CRUD testing"
    }

    response = requests.post(f"{BASE_URL}/api/v1/health-records", json=record_data, headers=headers, timeout=10)
    if response.status_code in [200, 201]:
        data = response.json()
        record_id = data.get('data', {}).get('id') or data.get('data', {}).get('record', {}).get('id')
        print_color(f"  SUCCESS: Health record created with ID: {record_id}", Colors.GREEN)
        results['create'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)
        return results

    # READ
    print_color(f"\n[READ] Reading health record {record_id}...", Colors.BLUE)
    response = requests.get(f"{BASE_URL}/api/v1/health-records/{record_id}", headers=headers, timeout=10)
    if response.status_code == 200:
        data = response.json()
        record = data.get('data', {}).get('record') or data.get('data', {})
        print_color(f"  SUCCESS: Retrieved health record: {record.get('recordType')}", Colors.GREEN)
        results['read'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    # UPDATE
    print_color(f"\n[UPDATE] Updating health record {record_id}...", Colors.BLUE)
    update_data = {
        "description": "Updated test health record entry",
        "notes": "Updated during CRUD testing"
    }
    response = requests.put(f"{BASE_URL}/api/v1/health-records/{record_id}", json=update_data, headers=headers, timeout=10)
    if response.status_code in [200, 204]:
        print_color(f"  SUCCESS: Health record updated", Colors.GREEN)
        results['update'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    # DELETE
    print_color(f"\n[DELETE] Deleting health record {record_id}...", Colors.BLUE)
    response = requests.delete(f"{BASE_URL}/api/v1/health-records/{record_id}", headers=headers, timeout=10)
    if response.status_code in [200, 204]:
        print_color(f"  SUCCESS: Health record deleted", Colors.GREEN)
        results['delete'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    return results

def test_user_crud(token):
    """Test User CRUD operations"""
    print_color("\n=== Testing User CRUD Operations ===", Colors.CYAN + Colors.BOLD)

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    results = {'create': 'skipped', 'read': False, 'update': False, 'delete': 'skipped'}

    # Use the existing logged-in user ID
    user_id = "c5ec6948-bcb8-42c8-8bfb-13bf25e91c87"

    # CREATE - Skip (requires ADMIN role)
    print_color("\n[CREATE] Skipping user creation (requires ADMIN role)", Colors.YELLOW)
    results['create'] = 'skipped'

    # READ
    print_color(f"\n[READ] Reading user {user_id}...", Colors.BLUE)
    response = requests.get(f"{BASE_URL}/api/v1/users/{user_id}", headers=headers, timeout=10)
    if response.status_code == 200:
        data = response.json()
        user = data.get('data', {}).get('user') or data.get('data', {})
        print_color(f"  SUCCESS: Retrieved user: {user.get('firstName')} {user.get('lastName')}", Colors.GREEN)
        results['read'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    # UPDATE
    print_color(f"\n[UPDATE] Updating user {user_id}...", Colors.BLUE)
    update_data = {
        "firstName": "Updated",
        "lastName": "TestUser"
    }
    response = requests.put(f"{BASE_URL}/api/v1/users/{user_id}", json=update_data, headers=headers, timeout=10)
    if response.status_code in [200, 204]:
        print_color(f"  SUCCESS: User updated", Colors.GREEN)
        results['update'] = True
    else:
        print_color(f"  FAILED: {response.status_code} - {response.text[:200]}", Colors.RED)

    # DELETE - Skip (don't delete logged-in user)
    print_color(f"\n[DELETE] Skipping user deletion (logged-in user)", Colors.YELLOW)
    results['delete'] = 'skipped'

    return results

def print_summary(all_results):
    """Print test summary"""
    print_color("\n" + "="*60, Colors.CYAN)
    print_color("=== CRUD Operations Test Summary ===", Colors.CYAN + Colors.BOLD)
    print_color("="*60, Colors.CYAN)

    total_tests = 0
    passed_tests = 0

    for module, results in all_results.items():
        print_color(f"\n{module}:", Colors.BLUE + Colors.BOLD)
        for operation, success in results.items():
            if success == 'skipped':
                print_color(f"  {operation.upper():8} - SKIP", Colors.YELLOW)
                continue
            total_tests += 1
            if success:
                passed_tests += 1
                print_color(f"  {operation.upper():8} - PASS", Colors.GREEN)
            else:
                print_color(f"  {operation.upper():8} - FAIL", Colors.RED)

    print_color(f"\n{'='*60}", Colors.CYAN)
    success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
    print_color(f"Total: {passed_tests}/{total_tests} operations passed ({success_rate:.1f}%)",
                Colors.GREEN if success_rate > 80 else Colors.YELLOW if success_rate > 50 else Colors.RED)
    print_color(f"{'='*60}\n", Colors.CYAN)

def main():
    print_color("\n" + "="*60, Colors.CYAN + Colors.BOLD)
    print_color("White Cross API - CRUD Operations Test", Colors.CYAN + Colors.BOLD)
    print_color("="*60 + "\n", Colors.CYAN + Colors.BOLD)

    # Login
    token = login()
    if not token:
        print_color("\nFailed to obtain authentication token. Exiting.", Colors.RED)
        sys.exit(1)

    # Run CRUD tests for each module
    all_results = {}

    try:
        all_results['Students'] = test_student_crud(token)
    except Exception as e:
        print_color(f"\nError testing Students: {e}", Colors.RED)
        all_results['Students'] = {'create': False, 'read': False, 'update': False, 'delete': False}

    try:
        all_results['Medications'] = test_medication_crud(token)
    except Exception as e:
        print_color(f"\nError testing Medications: {e}", Colors.RED)
        all_results['Medications'] = {'create': False, 'read': False, 'update': False, 'delete': False}

    try:
        all_results['Appointments'] = test_appointment_crud(token)
    except Exception as e:
        print_color(f"\nError testing Appointments: {e}", Colors.RED)
        all_results['Appointments'] = {'create': False, 'read': False, 'update': False, 'delete': False}

    try:
        all_results['Health Records'] = test_health_record_crud(token)
    except Exception as e:
        print_color(f"\nError testing Health Records: {e}", Colors.RED)
        all_results['Health Records'] = {'create': False, 'read': False, 'update': False, 'delete': False}

    try:
        all_results['Users'] = test_user_crud(token)
    except Exception as e:
        print_color(f"\nError testing Users: {e}", Colors.RED)
        all_results['Users'] = {'create': False, 'read': False, 'update': False, 'delete': False}

    # Print summary
    print_summary(all_results)

    # Save results
    output = {
        'timestamp': datetime.now().isoformat(),
        'base_url': BASE_URL,
        'results': all_results
    }

    with open('crud-test-results.json', 'w') as f:
        json.dump(output, f, indent=2)

    print_color("Results saved to: crud-test-results.json", Colors.GREEN)

if __name__ == '__main__':
    main()

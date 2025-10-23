# White Cross Operations Module - Swagger Endpoint Quick Reference

**Total Endpoints:** 62 | **All Endpoints:** JWT Auth Required

---

## Students (11 endpoints)

| Method | Endpoint | Description | Compliance Level |
|--------|----------|-------------|------------------|
| GET | `/api/v1/students` | List students with filters | PHI Protected |
| GET | `/api/v1/students/{id}` | Get student by ID | HIGHLY SENSITIVE PHI |
| POST | `/api/v1/students` | Create new student | PHI Protected |
| PUT | `/api/v1/students/{id}` | Update student | PHI Protected |
| POST | `/api/v1/students/{id}/deactivate` | Deactivate student | PHI Protected |
| POST | `/api/v1/students/{id}/transfer` | Transfer to different nurse | PHI Protected |
| GET | `/api/v1/students/grade/{grade}` | Get students by grade | PHI Protected |
| GET | `/api/v1/students/search/{query}` | Search by name/ID | PHI Protected |
| GET | `/api/v1/students/assigned` | Get assigned students | PHI Protected |
| GET | `/api/v1/students/{id}/health-records` | Get health records | HIGHLY SENSITIVE PHI |
| GET | `/api/v1/students/{id}/mental-health-records` | Get mental health records | EXTREMELY SENSITIVE PHI |

---

## Student Management (11 endpoints)

| Method | Endpoint | Description | Compliance Level |
|--------|----------|-------------|------------------|
| POST | `/api/v1/student-management/photos/{studentId}` | Upload student photo | HIGHLY SENSITIVE PHI |
| POST | `/api/v1/student-management/photos/search` | Facial recognition search | HIGHLY SENSITIVE PHI |
| POST | `/api/v1/student-management/transcripts/{studentId}/import` | Import academic transcript | HIGHLY SENSITIVE PHI |
| GET | `/api/v1/student-management/transcripts/{studentId}/history` | Get academic history | HIGHLY SENSITIVE PHI |
| GET | `/api/v1/student-management/transcripts/{studentId}/trends` | Get performance trends | HIGHLY SENSITIVE PHI |
| POST | `/api/v1/student-management/grade-transitions/bulk` | Bulk grade transition | Standard |
| GET | `/api/v1/student-management/graduating-students` | Get graduating students | Standard |
| POST | `/api/v1/student-management/barcode/scan` | Scan barcode | Standard |
| POST | `/api/v1/student-management/barcode/verify-medication` | Verify medication admin | HIGHLY SENSITIVE PHI |
| POST | `/api/v1/student-management/waitlist` | Add to waitlist | Standard |
| GET | `/api/v1/student-management/waitlist/{studentId}` | Get waitlist status | Standard |

---

## Appointments (15 endpoints)

| Method | Endpoint | Description | Compliance Level |
|--------|----------|-------------|------------------|
| GET | `/api/v1/appointments` | List appointments | PHI Protected |
| GET | `/api/v1/appointments/{id}` | Get appointment by ID | PHI Protected |
| POST | `/api/v1/appointments` | Create appointment | PHI Protected |
| PUT | `/api/v1/appointments/{id}` | Update appointment | PHI Protected |
| POST | `/api/v1/appointments/{id}/cancel` | Cancel appointment | PHI Protected |
| POST | `/api/v1/appointments/{id}/no-show` | Mark as no-show | PHI Protected |
| POST | `/api/v1/appointments/{id}/start` | Start appointment | PHI Protected |
| POST | `/api/v1/appointments/{id}/complete` | Complete appointment | HIGHLY SENSITIVE PHI |
| GET | `/api/v1/appointments/nurse/{nurseId}/available-slots` | Get available slots | Standard |
| GET | `/api/v1/appointments/nurse/{nurseId}/upcoming` | Get upcoming appointments | PHI Protected |
| GET | `/api/v1/appointments/statistics` | Get statistics | Standard (aggregated) |
| POST | `/api/v1/appointments/recurring` | Create recurring appointments | PHI Protected |
| POST | `/api/v1/appointments/waitlist` | Add to waitlist | PHI Protected |
| GET | `/api/v1/appointments/waitlist` | Get waitlist entries | PHI Protected |
| DELETE | `/api/v1/appointments/waitlist/{id}` | Remove from waitlist | PHI Protected |

---

## Appointments - Calendar & Integration (2 endpoints)

| Method | Endpoint | Description | Compliance Level |
|--------|----------|-------------|------------------|
| GET | `/api/v1/appointments/nurse/{nurseId}/calendar` | Generate iCal export | Standard |
| POST | `/api/v1/appointments/reminders/send` | Send reminders (admin) | Standard |

---

## Emergency Contacts (9 endpoints)

| Method | Endpoint | Description | Compliance Level |
|--------|----------|-------------|------------------|
| GET | `/api/v1/emergency-contacts/student/{studentId}` | Get student contacts | PHI Protected |
| GET | `/api/v1/emergency-contacts/{id}` | Get contact by ID | PHI Protected |
| POST | `/api/v1/emergency-contacts` | Create contact | PHI Protected |
| PUT | `/api/v1/emergency-contacts/{id}` | Update contact | PHI Protected |
| DELETE | `/api/v1/emergency-contacts/{id}` | Delete contact (soft) | PHI Protected |
| POST | `/api/v1/emergency-contacts/student/{studentId}/notify` | Send emergency notification | CRITICAL PHI |
| POST | `/api/v1/emergency-contacts/{id}/notify` | Send contact notification | PHI Protected |
| POST | `/api/v1/emergency-contacts/{id}/verify` | Verify contact info | PHI Protected |
| GET | `/api/v1/emergency-contacts/statistics` | Get statistics | Standard (aggregated) |

---

## Inventory - Items (5 endpoints)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/inventory/items` | List items | Any |
| GET | `/api/v1/inventory/items/{id}` | Get item by ID | Any |
| POST | `/api/v1/inventory/items` | Create item | NURSE/ADMIN |
| PUT | `/api/v1/inventory/items/{id}` | Update item | Any |
| DELETE | `/api/v1/inventory/items/{id}` | Archive item | Any |

---

## Inventory - Stock Management (5 endpoints)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/inventory/stock` | Get stock levels | Any |
| POST | `/api/v1/inventory/stock/adjust` | Adjust stock | Any |
| GET | `/api/v1/inventory/stock/low` | Get low stock alerts | Any |
| POST | `/api/v1/inventory/stock/count` | Record physical count | Any |
| GET | `/api/v1/inventory/stock/history/{id}` | Get transaction history | Any |

---

## Inventory - Purchase Orders (3 endpoints)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/inventory/orders` | List purchase orders | Any |
| POST | `/api/v1/inventory/orders` | Create purchase order | Any |
| PUT | `/api/v1/inventory/orders/{id}/receive` | Receive/update order | Any |

---

## Inventory - Suppliers (3 endpoints)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/inventory/suppliers` | List suppliers | Any |
| POST | `/api/v1/inventory/suppliers` | Create supplier | ADMIN |
| PUT | `/api/v1/inventory/suppliers/{id}` | Update supplier | Any |

---

## Inventory - Analytics & Reports (3 endpoints)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/inventory/analytics` | Get analytics | Any |
| GET | `/api/v1/inventory/reports/usage` | Get usage report | Any |
| GET | `/api/v1/inventory/suppliers/performance` | Get supplier performance | Any |

---

## Common Query Parameters

**Pagination (most list endpoints):**
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page

**Date Filtering:**
- `dateFrom` (ISO 8601, optional): Start date
- `dateTo` (ISO 8601, optional): End date

---

## Common Response Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET/PUT/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation error, invalid data |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Business rule violation (duplicate, constraint) |
| 500 | Internal Server Error | Server-side error |

---

## PHI Compliance Levels

| Level | Meaning | Example Endpoints |
|-------|---------|-------------------|
| **Standard** | No PHI or aggregated data | Analytics, statistics, calendar export |
| **PHI Protected** | Protected health information | Student lists, appointments, emergency contacts |
| **HIGHLY SENSITIVE PHI** | Detailed health/academic records | Student details, health records, transcripts, medication verification |
| **EXTREMELY SENSITIVE PHI** | Mental health data | Mental health records |
| **CRITICAL PHI** | Emergency communications | Emergency notifications |

---

## Key Validation Patterns

**UUID Parameters:**
```javascript
id: uuid (required)
```

**Date Validation:**
```javascript
// Future dates only
startTime: date (ISO 8601, min: 'now', required)

// Past/present dates
dateOfBirth: date (ISO 8601, max: 'now', required)
```

**String Validation:**
```javascript
// With length constraints
firstName: string (1-100 chars, required)

// With pattern
phoneNumber: string (phone pattern, required)

// With enum
status: string (PENDING|APPROVED|ORDERED, required)
```

**Number Validation:**
```javascript
// Integer with range
quantity: number (1-1000000, required)

// Decimal with precision
unitCost: number (0-999999.99, precision: 2, optional)
```

---

## Testing Endpoints with curl

**List Students:**
```bash
curl -X GET "http://localhost:3000/api/v1/students?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Student:**
```bash
curl -X POST "http://localhost:3000/api/v1/students" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2010-05-15",
    "grade": "8"
  }'
```

**Get Available Appointment Slots:**
```bash
curl -X GET "http://localhost:3000/api/v1/appointments/nurse/{nurseId}/available-slots?date=2025-10-24" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Accessing Swagger UI

Once the server is running with hapi-swagger configured:

**Swagger JSON:**
```
http://localhost:3000/swagger.json
```

**Swagger UI:**
```
http://localhost:3000/documentation
```

**OpenAPI Spec Download:**
```
http://localhost:3000/swagger.json?format=json
```

---

## Additional Resources

- **Full Documentation:** `OPERATIONS_MODULE_SWAGGER_DOCUMENTATION_SUMMARY.md`
- **Route Files:** `backend/src/routes/v1/operations/routes/`
- **Validators:** `backend/src/routes/v1/operations/validators/`
- **Controllers:** `backend/src/routes/v1/operations/controllers/`

---

**Last Updated:** 2025-10-23
**API Version:** v1

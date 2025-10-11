# White Cross Healthcare Platform - API Documentation

## Overview

The White Cross Healthcare Platform provides a comprehensive REST API for managing student health records, medications, appointments, and emergency communications in school environments. This API is **HIPAA-compliant** and implements enterprise-grade security measures.

## 📚 Interactive API Documentation

### Swagger UI

The API includes interactive Swagger/OpenAPI documentation that allows you to:
- Browse all available endpoints
- View request/response schemas
- Test API endpoints directly in your browser
- Download OpenAPI specification

**Access the documentation:**

- **Swagger UI**: `http://localhost:3001/docs`
- **API Specification**: `http://localhost:3001/swagger.json`

### Quick Start

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Open your browser to:**
   ```
   http://localhost:3001/docs
   ```

3. **Authenticate:**
   - First, register a user via `POST /api/auth/register`
   - Then login via `POST /api/auth/login` to get a JWT token
   - Click the "Authorize" button in Swagger UI
   - Enter: `Bearer <your-token>` in the value field
   - Now you can test all authenticated endpoints

## 🔐 Authentication

### JWT Bearer Token

All protected endpoints require JWT authentication via the `Authorization` header:

```http
Authorization: Bearer <your-jwt-token>
```

### Obtaining a Token

1. **Register a new user** (if needed):
   ```bash
   POST /api/auth/register
   Content-Type: application/json

   {
     "email": "nurse@school.edu",
     "password": "SecurePass123!",
     "firstName": "Jane",
     "lastName": "Smith",
     "role": "NURSE"
   }
   ```

2. **Login to get a token**:
   ```bash
   POST /api/auth/login
   Content-Type: application/json

   {
     "email": "nurse@school.edu",
     "password": "SecurePass123!"
   }
   ```

3. **Response**:
   ```json
   {
     "success": true,
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user": {
         "id": "user-123",
         "email": "nurse@school.edu",
         "firstName": "Jane",
         "lastName": "Smith",
         "role": "NURSE"
       }
     }
   }
   ```

4. **Use the token in subsequent requests**:
   ```bash
   GET /api/students
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 📋 API Endpoint Categories

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/me` - Get current user

### Students (PHI Protected)
- `GET /api/students` - List all students (paginated)
- `GET /api/students/{id}` - Get student details
- `POST /api/students` - Create new student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Deactivate student
- `PUT /api/students/{id}/transfer` - Transfer student to another nurse
- `GET /api/students/grade/{grade}` - Get students by grade
- `GET /api/students/search/{query}` - Search students
- `GET /api/students/assigned` - Get assigned students
- `GET /api/students/{studentId}/health-records` - **HIGHLY SENSITIVE**
- `GET /api/students/{studentId}/mental-health-records` - **HIGHLY CONFIDENTIAL**

### Medications (PHI Protected)
- `GET /api/medications` - List medications
- `POST /api/medications` - Add new medication
- `GET /api/medications/inventory` - View inventory
- `POST /api/medications/administration` - **HIGHLY SENSITIVE** - Log administration
- `GET /api/medications/logs/{studentId}` - **HIGHLY SENSITIVE** - View medication logs
- `POST /api/medications/adverse-reaction` - **HIGHLY SENSITIVE** - Report adverse reaction

### Health Records (PHI Protected)
- `GET /api/health-records` - List health records
- `GET /api/health-records/{id}` - Get specific record
- `POST /api/health-records` - Create health record
- `PUT /api/health-records/{id}` - Update health record
- `DELETE /api/health-records/{id}` - Delete health record

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Cancel appointment
- `GET /api/appointments/upcoming` - Get upcoming appointments

### Emergency Contacts
- `GET /api/emergency-contacts/student/{studentId}` - Get student's contacts
- `POST /api/emergency-contacts` - Add emergency contact
- `PUT /api/emergency-contacts/{id}` - Update contact
- `DELETE /api/emergency-contacts/{id}` - Remove contact

### Incident Reports
- `GET /api/incident-reports` - List incident reports
- `POST /api/incident-reports` - Create incident report
- `GET /api/incident-reports/{id}` - Get report details
- `PUT /api/incident-reports/{id}` - Update report

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Deactivate user

### Inventory Management
- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/{id}` - Update inventory
- `GET /api/inventory/low-stock` - Get low stock alerts

### Additional Modules
- **Vendors** - `/api/vendors/*`
- **Purchase Orders** - `/api/purchase-orders/*`
- **Budget** - `/api/budget/*`
- **Communication** - `/api/communication/*`
- **Reports** - `/api/reports/*`
- **Compliance** - `/api/compliance/*`
- **Documents** - `/api/documents/*`
- **Access Control** - `/api/access-control/*`
- **Audit** - `/api/audit/*`
- **Integration** - `/api/integration/*`
- **Administration** - `/api/administration/*`

## 🔒 Security & Compliance

### HIPAA Compliance

This API handles **Protected Health Information (PHI)** and implements:

1. **Encryption**
   - TLS/HTTPS for data in transit
   - Database encryption at rest
   - Encrypted JWT tokens

2. **Access Control**
   - Role-based access control (RBAC)
   - Principle of least privilege
   - JWT token expiration (24 hours)

3. **Audit Logging**
   - All PHI access is logged
   - Immutable audit trails
   - User action tracking

4. **Data Protection**
   - Input validation on all endpoints
   - SQL injection prevention via Prisma ORM
   - XSS protection
   - CORS configuration

### PHI Protection Levels

The API marks endpoints with different protection levels:

- **PHI Protected** - Standard health information
- **HIGHLY SENSITIVE PHI** - Medical records, diagnoses, treatments
- **HIGHLY CONFIDENTIAL** - Mental health, counseling records

### User Roles

- **ADMIN** - Full system access
- **DISTRICT_ADMIN** - District-level administration
- **SCHOOL_ADMIN** - School-level administration
- **NURSE** - Student health management
- **COUNSELOR** - Mental health access
- **MENTAL_HEALTH_SPECIALIST** - Specialized mental health access

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

## 🚀 Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated users**: 100 requests per minute
- **Unauthenticated**: 20 requests per minute

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## 📄 Pagination

List endpoints support pagination via query parameters:

```http
GET /api/students?page=2&limit=20
```

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

## 🔍 Filtering & Searching

Many endpoints support filtering:

```http
GET /api/students?grade=5&hasAllergies=true&search=John
```

Common filters:
- `search` - Text search
- `isActive` - Active status filter
- `startDate` / `endDate` - Date range filters

## 🧪 Testing the API

### Using Swagger UI

1. Go to `http://localhost:3001/docs`
2. Click "Authorize" button
3. Enter your Bearer token
4. Navigate to any endpoint
5. Click "Try it out"
6. Fill in parameters
7. Click "Execute"

### Using cURL

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nurse@school.edu",
    "password": "SecurePass123!"
  }'

# Get students
curl -X GET http://localhost:3001/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create student
curl -X POST http://localhost:3001/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "studentNumber": "STU-001",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2010-05-15",
    "grade": "7",
    "gender": "MALE"
  }'
```

### Using Postman

1. Import the OpenAPI spec from `http://localhost:3001/swagger.json`
2. Set up environment variables:
   - `baseUrl`: `http://localhost:3001`
   - `token`: Your JWT token
3. Use `{{baseUrl}}` and `{{token}}` in your requests

## 🛠️ Development

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
HOST=localhost

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/whitecross"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Swagger
SWAGGER_HOST=localhost:3001

# Logging
LOG_LEVEL=info
```

### Running the Server

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test

# Database operations
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

## 📞 Support

For API support and questions:

- **Email**: support@whitecross.health
- **Documentation**: http://localhost:3001/docs
- **Health Check**: http://localhost:3001/health

## 📝 Version History

### v1.0.0 (Current)
- Complete OpenAPI/Swagger documentation
- JWT authentication
- 15 core healthcare management modules
- HIPAA-compliant security measures
- Role-based access control
- Comprehensive audit logging
- PHI protection mechanisms

## 🔄 API Versioning

The API uses URL versioning. Current version: `v1`

Future versions will be available at:
- `http://localhost:3001/api/v2/...`

## 📖 Additional Resources

- [Prisma Schema](./prisma/schema.prisma) - Database models
- [OpenAPI Spec](http://localhost:3001/swagger.json) - Download full spec
- [CLAUDE.md](../CLAUDE.md) - Project guidelines
- [Environment Setup](../README.md) - Project setup guide

---

**Remember**: This API handles sensitive healthcare data. Always follow HIPAA compliance guidelines and security best practices when integrating with this API.

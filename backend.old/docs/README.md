# White Cross Healthcare Platform - Backend Documentation

**Documentation Hub for Backend API and Database**

---

## Quick Links

| Document | Size | Description | Audience |
|----------|------|-------------|----------|
| **[API Routes Inventory](./API_ROUTES_INVENTORY.md)** | 54 KB | Comprehensive inventory of all 342 API endpoints | Backend developers, API consumers, QA testers |
| **[API Inventory Summary](./API_INVENTORY_SUMMARY.md)** | 13 KB | Executive summary of API architecture and patterns | Technical leads, architects, project managers |
| **[API Quick Reference](./API_QUICK_REFERENCE.md)** | 17 KB | Developer-friendly API reference with examples | Frontend developers, API consumers |
| **[Database Schema Mapping](./DATABASE_SCHEMA_MAPPING.md)** | 62 KB | Complete database schema documentation | Database administrators, backend developers |

---

## Documentation Overview

### API Routes Inventory
**Purpose:** Complete technical reference for all API endpoints

**Contents:**
- 342 endpoints organized by 10 modules
- HTTP methods, paths, authentication requirements
- Request/response types and validation schemas
- PHI (Protected Health Information) indicators
- Service layer mapping
- HIPAA compliance notes
- Query parameters reference

**Use Cases:**
- Implementing API clients (frontend, mobile apps)
- Writing integration tests
- Generating Swagger/OpenAPI documentation
- Understanding API capabilities and coverage

---

### API Inventory Summary
**Purpose:** High-level overview of API architecture

**Contents:**
- Module statistics and endpoint counts
- Architecture patterns and design decisions
- Authentication and authorization overview
- HIPAA compliance summary
- Service layer organization
- Security considerations
- External integrations overview

**Use Cases:**
- Onboarding new developers
- System architecture reviews
- Technical documentation for stakeholders
- API planning and roadmap development

---

### API Quick Reference
**Purpose:** Practical guide for API consumers

**Contents:**
- Quick endpoint reference by domain
- Authentication flow examples
- Common request/response examples
- Query parameter reference
- Error handling patterns
- Best practices and tips
- cURL and Postman examples

**Use Cases:**
- Day-to-day development reference
- Frontend integration
- API testing and debugging
- Developer onboarding

---

### Database Schema Mapping
**Purpose:** Comprehensive database documentation

**Contents:**
- 47 database tables with column definitions
- Relationships and foreign keys
- Indexes and constraints
- Data types and validation rules
- HIPAA compliance annotations
- Migration history
- Entity-Relationship Diagram

**Use Cases:**
- Database migrations and schema changes
- Data modeling and normalization
- Query optimization
- Understanding data relationships
- HIPAA compliance audits

---

## API Architecture

### Framework & Tools
- **Backend Framework:** Hapi.js v21 with TypeScript
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Authorization:** Role-Based Access Control (RBAC)
- **Validation:** Joi schemas
- **Documentation:** Swagger/OpenAPI auto-generated

### Module Organization
```
backend/src/routes/v1/
├── core/               # Authentication, users, access control, contacts (51 endpoints)
├── healthcare/         # Medications, health records, assessments (52 endpoints)
├── operations/         # Students, appointments, inventory (99 endpoints)
├── documents/          # Document management (18 endpoints)
├── compliance/         # Audit logs, compliance reports (44 endpoints)
├── communications/     # Messages, broadcasts (21 endpoints)
├── incidents/          # Incident reporting (19 endpoints)
├── analytics/          # Analytics, dashboards (15 endpoints)
└── system/            # Configuration, integrations (23 endpoints)

Total: 342 endpoints across 10 modules
```

---

## Key Statistics

### API Coverage
- **Total Endpoints:** 342
- **Route Files:** 23
- **PHI Endpoints:** ~206 (60%)
- **Admin-Only Endpoints:** 69 (20%)
- **Public Endpoints:** 5 (auth/login, auth/register, auth/verify, auth/refresh, system/health)

### HTTP Methods
- **GET:** ~180 (53%) - Retrieve data, list, search
- **POST:** ~110 (32%) - Create, actions, operations
- **PUT:** ~35 (10%) - Update, modify
- **DELETE:** ~17 (5%) - Soft delete, remove

### Database
- **Tables:** 47
- **Total Columns:** ~500
- **Relationships:** ~80 foreign key constraints
- **Indexes:** ~120 (performance optimized)
- **Audit Tables:** 3 (audit_logs, phi_access_logs, security_incidents)

---

## HIPAA Compliance

### PHI Protection
- **60% of endpoints** handle Protected Health Information (PHI)
- **Comprehensive audit logging** for all PHI access (15 endpoints)
- **Encryption at rest** (database-level) and **in transit** (HTTPS/TLS)
- **Role-based access control** with minimum necessary standard
- **6-year audit log retention** per HIPAA requirements

### Audit & Compliance
- **Audit Endpoints:** 15 dedicated audit logging endpoints
- **Compliance Endpoints:** 29 compliance management endpoints
- **Security Incidents:** 3 endpoints for security incident tracking
- **Session Management:** 3 endpoints for session tracking and forced logout

---

## Authentication & Authorization

### Authentication
- **JWT-based authentication** with 24-hour token expiration
- **Refresh tokens** available via `/auth/refresh`
- **Session tracking** with forced logout capabilities
- **MFA support** (Multi-Factor Authentication endpoints available)

### Authorization
- **Role-Based Access Control (RBAC):** 27 dedicated endpoints
- **6 User Roles:** ADMIN, DISTRICT_ADMIN, SCHOOL_ADMIN, NURSE, COUNSELOR, VIEWER
- **Resource-Action Permissions:** Fine-grained permissions (e.g., Student:Read, Medication:Administer)
- **Dynamic Role Assignment:** Runtime role and permission management

---

## Getting Started

### For Backend Developers

1. **Read API Inventory Summary** for architecture overview
2. **Review API Routes Inventory** for detailed endpoint documentation
3. **Study Database Schema Mapping** for data model understanding
4. **Use API Quick Reference** for daily development tasks

### For Frontend Developers

1. **Start with API Quick Reference** for practical examples
2. **Reference API Routes Inventory** for specific endpoint details
3. **Use Swagger UI** (`/documentation`) for interactive testing
4. **Follow authentication flow** in Quick Reference

### For QA/Testing

1. **Use API Routes Inventory** for comprehensive endpoint list
2. **Reference API Quick Reference** for test case examples
3. **Test via Swagger UI** for exploratory testing
4. **Verify PHI indicators** for HIPAA compliance testing

### For Database Administrators

1. **Review Database Schema Mapping** for complete schema documentation
2. **Check relationship diagrams** for data model understanding
3. **Reference audit table structures** for compliance requirements
4. **Review indexes** for query optimization

---

## Development Workflow

### Local Development
1. Start backend: `npm run dev` (runs on `http://localhost:3000`)
2. Access Swagger UI: `http://localhost:3000/documentation`
3. Test endpoints using Swagger or Postman
4. Review logs for debugging

### API Testing
1. **Use Swagger UI** for interactive testing
2. **Use Postman** for complex workflows
3. **Use cURL** for scripted testing
4. **Write integration tests** using endpoint documentation

### Documentation Updates
When adding new endpoints:
1. Define route in `backend/src/routes/v1/{module}/routes/*.routes.ts`
2. Create controller in `backend/src/routes/v1/{module}/controllers/*.controller.ts`
3. Add validator in `backend/src/routes/v1/{module}/validators/*.validators.ts`
4. Update API documentation (this directory)
5. Test via Swagger UI
6. Update integration tests

---

## External Resources

### Online Documentation
- **Swagger UI:** `/documentation` endpoint (when server running)
- **GitHub Repository:** [harborgrid-justin/white-cross](https://github.com/harborgrid-justin/white-cross)

### Related Documentation
- **Frontend API Integration:** See `frontend/src/services/` for API client implementation
- **Database Migrations:** See `backend/src/database/migrations/`
- **Service Layer:** See `backend/src/services/` for business logic

### Standards & Compliance
- **HIPAA Privacy Rule:** 45 CFR Part 160 and Part 164
- **HIPAA Security Rule:** 45 CFR § 164.308(a)(1)(ii)(D) - Audit Controls
- **OpenAPI Specification:** 3.0
- **REST API Best Practices:** Documented in API Inventory Summary

---

## Version Information

| Component | Version | Notes |
|-----------|---------|-------|
| **API Version** | v1 | All endpoints under `/api/v1` |
| **Backend Framework** | Hapi.js v21 | TypeScript-based |
| **Database** | PostgreSQL 14+ | With Sequelize ORM |
| **Node.js** | 18+ | LTS version recommended |
| **TypeScript** | 5.0+ | Strict mode enabled |
| **Documentation Generated** | 2025-10-23 | Up-to-date as of this date |

---

## Maintenance

### Documentation Updates
These documents should be updated when:
- New endpoints are added or removed
- Endpoint signatures change (request/response)
- Database schema changes occur
- New modules are introduced
- Authentication/authorization logic changes

### Automated Updates
- **Swagger documentation** auto-generates from route definitions
- **Database schema** can be exported via Sequelize CLI
- **API inventory** should be manually updated or scripted

---

## Support & Contact

### For Questions
- **API Questions:** Review API Routes Inventory and Quick Reference
- **Database Questions:** Review Database Schema Mapping
- **Architecture Questions:** Review API Inventory Summary
- **HIPAA Compliance:** Review compliance sections in all documents

### Contributing
When adding documentation:
1. Follow existing formatting patterns
2. Include code examples where appropriate
3. Add PHI indicators for health data endpoints
4. Document HIPAA compliance implications
5. Update this README with new document links

---

## Document Changelog

| Date | Document | Change |
|------|----------|--------|
| 2025-10-23 | API_ROUTES_INVENTORY.md | Initial comprehensive inventory of 342 endpoints |
| 2025-10-23 | API_INVENTORY_SUMMARY.md | Executive summary of API architecture |
| 2025-10-23 | API_QUICK_REFERENCE.md | Developer quick reference guide |
| 2025-10-23 | DATABASE_SCHEMA_MAPPING.md | Complete database schema documentation |
| 2025-10-23 | README.md | Documentation hub created |

---

**Maintained by:** Backend Development Team
**Last Updated:** 2025-10-23
**Documentation Status:** ✅ Complete and current

---

## Quick Navigation

**Need to...**

- 📋 **Find an endpoint?** → [API Routes Inventory](./API_ROUTES_INVENTORY.md)
- 🎯 **Understand architecture?** → [API Inventory Summary](./API_INVENTORY_SUMMARY.md)
- 🚀 **Get started quickly?** → [API Quick Reference](./API_QUICK_REFERENCE.md)
- 🗄️ **Understand database?** → [Database Schema Mapping](./DATABASE_SCHEMA_MAPPING.md)
- 🔒 **HIPAA compliance?** → Check all documents (marked with PHI indicators)
- 🧪 **Test APIs?** → Start server and use `/documentation` Swagger UI

---

**End of Documentation Hub**

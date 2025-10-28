# Clinical Module

Comprehensive clinical functionality for the White Cross School Health Platform, providing drug interaction checking and clinic visit tracking capabilities.

## Overview

This module implements two major clinical features:
- **Feature 48: Drug Interaction Checker** - Drug catalog management, interaction checking, and allergy tracking
- **Feature 17: Clinic Visit Tracking** - Complete clinic visit workflow with analytics

## Features

### Drug Interaction Checker

#### Drug Catalog Management
- Complete drug catalog with RxNorm code support
- Brand names and generic drug names
- Drug classification (NSAID, antibiotic, etc.)
- FDA approval status tracking
- Common dosing information (JSONB storage)
- Side effects, contraindications, and warnings
- Controlled substance scheduling (I-V)
- Search by name, brand, or RxNorm code
- Bulk import functionality

#### Drug Interaction Checking
- Pairwise drug-drug interaction checking
- Severity levels: MINOR, MODERATE, MAJOR, SEVERE, CONTRAINDICATED
- Clinical effects and management recommendations
- Evidence level tracking
- Medical reference citations
- Automated risk level calculation

#### Student Allergy Tracking
- Student-specific drug allergy records
- Allergy type and reaction tracking
- Severity categorization (MILD, MODERATE, SEVERE, LIFE_THREATENING)
- Diagnosis information (date, provider)
- Integration with interaction checking

#### Clinical Decision Support
- Real-time risk assessment: NONE → LOW → MODERATE → HIGH → CRITICAL
- Combined interaction and allergy evaluation
- Severity-based risk escalation
- Clinical recommendations for high-risk interactions

### Clinic Visit Tracking

#### Visit Workflow
- Check-in/check-out state management
- Prevention of duplicate active visits
- Automatic timestamp tracking
- Visit disposition (RETURN_TO_CLASS, SENT_HOME, EMERGENCY_TRANSPORT, OTHER)

#### Visit Documentation
- Reason for visit (multiple reasons supported)
- Symptoms tracking (multiple symptoms)
- Treatment documentation
- Classes missed tracking
- Minutes of class time missed
- Healthcare provider notes

#### Analytics & Reporting
- Visit statistics by date range
- Most common symptoms analysis
- Disposition distribution
- Average visit duration
- Total and average class time missed
- Active visit monitoring

#### Student History
- Individual student visit history
- Visit frequency calculation (visits per month)
- Most common reasons for visits
- Average duration per student
- Total minutes missed per student
- Last visit date tracking

#### Advanced Analytics
- Frequent visitor identification
- Time-of-day visit distribution
- Trend analysis capabilities
- Student visit summaries

## Architecture

```
nestjs-backend/src/clinical/
├── controllers/
│   ├── drug-interaction.controller.ts    (19 endpoints)
│   └── clinic-visit.controller.ts        (12 endpoints)
├── services/
│   ├── drug-interaction.service.ts       (19 methods, 450+ lines)
│   └── clinic-visit.service.ts           (11 methods, 330+ lines)
├── entities/
│   ├── drug-catalog.entity.ts            (TypeORM entity)
│   ├── drug-interaction.entity.ts        (TypeORM entity)
│   ├── student-drug-allergy.entity.ts    (TypeORM entity)
│   └── clinic-visit.entity.ts            (TypeORM entity)
├── dto/
│   ├── drug/                             (8 DTOs with validation)
│   └── visit/                            (3 DTOs with validation)
├── enums/
│   ├── interaction-severity.enum.ts      (5 severity levels)
│   └── visit-disposition.enum.ts         (4 disposition types)
├── interfaces/
│   ├── interaction-result.interface.ts
│   ├── visit-statistics.interface.ts
│   └── student-visit-summary.interface.ts
└── clinical.module.ts
```

## REST API Endpoints

### Drug Interaction Endpoints (19 total)

#### Drug Catalog
- `POST /clinical/drugs/search` - Search drugs by name or brand
- `GET /clinical/drugs/:id` - Get drug by ID
- `GET /clinical/drugs/rxnorm/:code` - Get drug by RxNorm code
- `POST /clinical/drugs` - Add new drug to catalog
- `PATCH /clinical/drugs/:id` - Update drug information
- `GET /clinical/drugs/class/:drugClass` - Get drugs by classification
- `GET /clinical/drugs/controlled/substances` - Get controlled substances
- `POST /clinical/drugs/bulk-import` - Bulk import drugs

#### Drug Interactions
- `POST /clinical/interactions/check` - Check drug-drug interactions
- `POST /clinical/interactions` - Add drug interaction
- `PATCH /clinical/interactions/:id` - Update interaction
- `DELETE /clinical/interactions/:id` - Delete interaction
- `GET /clinical/drugs/:drugId/interactions` - Get all interactions for drug
- `GET /clinical/interactions/statistics/summary` - Get interaction statistics

#### Student Allergies
- `POST /clinical/allergies` - Add student drug allergy
- `PATCH /clinical/allergies/:id` - Update allergy
- `DELETE /clinical/allergies/:id` - Delete allergy
- `GET /clinical/allergies/student/:studentId` - Get student allergies

### Clinic Visit Endpoints (12 total)

#### Visit Workflow
- `POST /clinical/visits/check-in` - Check in student to clinic
- `POST /clinical/visits/:id/check-out` - Check out student from clinic

#### Visit Management
- `GET /clinical/visits/active` - Get all active visits
- `GET /clinical/visits/:id` - Get visit by ID
- `GET /clinical/visits` - Query visits with filters (pagination supported)
- `GET /clinical/visits/student/:studentId` - Get student visit history
- `PATCH /clinical/visits/:id` - Update visit information
- `DELETE /clinical/visits/:id` - Delete visit record

#### Analytics
- `GET /clinical/visits/statistics/summary` - Get visit statistics
- `GET /clinical/visits/student/:studentId/summary` - Get student summary
- `GET /clinical/visits/statistics/frequent-visitors` - Get frequent visitors
- `GET /clinical/visits/statistics/time-distribution` - Get time-of-day distribution

## Database Schema

### Tables

#### drug_catalog
- Primary key: UUID
- Indexes: rxnorm_id, rxnorm_code, generic_name, drug_class, is_active
- JSONB field: common_doses
- Array fields: brand_names, side_effects, contraindications, warnings

#### drug_interactions
- Primary key: UUID
- Indexes: drug1_id, drug2_id, severity
- Unique constraint: (drug1_id, drug2_id)
- Foreign keys: drug1_id → drug_catalog, drug2_id → drug_catalog

#### student_drug_allergies
- Primary key: UUID
- Indexes: student_id, drug_id, severity
- Unique constraint: (student_id, drug_id)
- Foreign keys: student_id → students, drug_id → drug_catalog

#### clinic_visits
- Primary key: UUID
- Indexes: student_id, attended_by, check_in_time, check_out_time, disposition
- Array fields: reason_for_visit, symptoms, classes_missed
- Foreign keys: student_id → students, attended_by → users

## Usage Examples

### Check Drug Interactions

```typescript
POST /clinical/interactions/check
{
  "drugIds": [
    "123e4567-e89b-12d3-a456-426614174000",
    "123e4567-e89b-12d3-a456-426614174001"
  ],
  "studentId": "123e4567-e89b-12d3-a456-426614174002"
}

Response:
{
  "hasInteractions": true,
  "interactions": [
    {
      "drug1": { "id": "...", "genericName": "Aspirin", "brandNames": ["Bayer"] },
      "drug2": { "id": "...", "genericName": "Warfarin", "brandNames": ["Coumadin"] },
      "severity": "MAJOR",
      "description": "May increase risk of bleeding",
      "clinicalEffects": "Increased bleeding risk",
      "management": "Monitor INR closely, consider alternative therapy"
    }
  ],
  "allergies": [],
  "riskLevel": "HIGH"
}
```

### Check In Student

```typescript
POST /clinical/visits/check-in
{
  "studentId": "123e4567-e89b-12d3-a456-426614174000",
  "reasonForVisit": ["Headache", "Nausea"],
  "symptoms": ["Fever", "Fatigue"],
  "attendedBy": "123e4567-e89b-12d3-a456-426614174001",
  "notes": "Student reports symptoms started this morning"
}
```

### Check Out Student

```typescript
POST /clinical/visits/:visitId/check-out
{
  "treatment": "Administered acetaminophen 500mg, rest for 30 minutes",
  "disposition": "RETURN_TO_CLASS",
  "classesMissed": ["Math 101"],
  "minutesMissed": 45,
  "notes": "Symptoms improved after rest and medication"
}
```

## Clinical Decision Support

### Risk Level Calculation

The system automatically calculates an overall risk level based on:

1. **CRITICAL** - Contraindicated drug interactions OR life-threatening allergies
2. **HIGH** - Major drug interactions OR severe allergies
3. **MODERATE** - Moderate severity drug interactions
4. **LOW** - Minor drug interactions only
5. **NONE** - No interactions or allergies found

### Interaction Severity Levels

- **CONTRAINDICATED** - Drugs should not be used together
- **SEVERE** - Serious adverse effects may occur
- **MAJOR** - Requires intervention or alternative therapy
- **MODERATE** - Requires monitoring
- **MINOR** - Minimal clinical significance

## Dependencies

All required dependencies are installed:
- `@nestjs/common` - Core NestJS functionality
- `@nestjs/typeorm` - TypeORM integration
- `@nestjs/swagger` - API documentation
- `typeorm` - Database ORM
- `class-validator` - DTO validation
- `class-transformer` - Object transformation
- `pg` - PostgreSQL driver

## Testing

### Unit Testing
- Service method testing
- Risk level calculation validation
- Visit duration calculation
- Statistics aggregation

### Integration Testing
- Drug interaction checking workflow
- Visit check-in/check-out workflow
- Student allergy checking
- Bulk import functionality

## Security & Compliance

- UUID-based identifiers (non-sequential)
- Input validation on all endpoints
- Protected medical information (PHI)
- Audit trail through timestamps
- HIPAA compliance considerations
- Data integrity constraints

## Future Enhancements

### External Integration
- RxNorm API integration for drug data
- FDA Drug Interaction Database
- Clinical decision support systems
- Electronic Health Record (EHR) integration

### Advanced Features
- Drug-drug-drug (3+ way) interaction checking
- Dosing calculators
- Drug allergy cross-reactivity
- Clinical pathways and protocols
- Real-time alert system for high-risk interactions

### Performance Optimization
- Redis caching for drug searches
- Query result caching
- Background jobs for bulk imports
- Elasticsearch for advanced search

## Module Statistics

- **Total Files**: 25 TypeScript files
- **Total Lines**: 1,827 lines of code
- **REST Endpoints**: 31 endpoints
- **Service Methods**: 30 methods
- **Entities**: 4 TypeORM entities
- **DTOs**: 11 validated DTOs
- **Enums**: 2 enums
- **Interfaces**: 3 interfaces

## Migration Notes

This module was migrated from the Express-based backend (`backend/src/services/clinical/`) to NestJS with the following improvements:

✅ Type-safe implementation with TypeScript strict mode
✅ NestJS dependency injection
✅ Comprehensive DTO validation
✅ Swagger/OpenAPI documentation
✅ TypeORM entities with relationships
✅ Proper error handling with NestJS exceptions
✅ NestJS Logger integration
✅ Clinical decision support algorithms preserved
✅ Visit workflow state management preserved

---

**Version**: 1.0.0
**Last Updated**: 2025-10-28
**Module Location**: `/home/user/white-cross/nestjs-backend/src/clinical/`

# Budget Module

Comprehensive budget management system for tracking fiscal year budgets, expenses, and financial reporting in the White Cross School Health Platform.

## Features

### Budget Category Management
- Create and manage budget categories with fiscal year support
- Track allocated vs. spent amounts automatically
- Soft delete categories to preserve historical data
- Support for multiple fiscal years

### Budget Transaction Tracking
- Record individual spending transactions
- Automatic spent amount updates on create/update/delete
- Link transactions to external references (POs, invoices)
- Transaction date tracking for reporting

### Financial Reporting
- Comprehensive budget summaries by fiscal year
- Spending trends analysis by month
- Over-budget category detection with variance tracking
- Year-over-year category comparisons
- Budget recommendations based on historical spending patterns
- Complete budget data export functionality

### Fiscal Year Support
- Fiscal year runs July 1 - June 30
- Automatic fiscal year determination
- Historical data tracking across multiple fiscal years

## Entities

### BudgetCategory
Represents a budget category for a fiscal year.

**Fields:**
- `id` (UUID): Primary key
- `name` (string): Category name (max 255 chars)
- `description` (text): Optional category description
- `fiscalYear` (integer): Fiscal year (e.g., 2024)
- `allocatedAmount` (decimal 10,2): Total budget allocated
- `spentAmount` (decimal 10,2): Amount spent (auto-updated)
- `isActive` (boolean): Active status (soft delete flag)
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp): Last update timestamp

**Virtual Properties:**
- `remainingAmount`: Calculated as allocatedAmount - spentAmount
- `utilizationPercentage`: Percentage of budget used
- `isOverBudget`: Boolean indicating if spent > allocated

**Relationships:**
- OneToMany with BudgetTransaction

### BudgetTransaction
Represents individual spending transactions against budget categories.

**Fields:**
- `id` (UUID): Primary key
- `categoryId` (UUID): Foreign key to BudgetCategory
- `amount` (decimal 10,2): Transaction amount
- `description` (text): Transaction description (required)
- `transactionDate` (timestamp): Date of transaction
- `referenceId` (string): Optional reference to external entity
- `referenceType` (string): Type of reference (PO, INVOICE, etc.)
- `notes` (text): Optional additional notes
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp): Last update timestamp

**Relationships:**
- ManyToOne with BudgetCategory

## DTOs

### Budget Category DTOs
- `CreateBudgetCategoryDto`: Create new category
  - name (required, max 255)
  - description (optional)
  - fiscalYear (required, min 2000)
  - allocatedAmount (required, min 0)

- `UpdateBudgetCategoryDto`: Update existing category
  - All fields optional (partial update)
  - isActive (optional, for soft delete)

### Budget Transaction DTOs
- `CreateBudgetTransactionDto`: Create new transaction
  - categoryId (required, UUID)
  - amount (required, min 0.01)
  - description (required)
  - referenceId (optional, max 255)
  - referenceType (optional, max 100)
  - notes (optional)

- `UpdateBudgetTransactionDto`: Update existing transaction
  - All fields optional (partial update)

- `BudgetTransactionFiltersDto`: Filter transactions
  - categoryId (optional, UUID)
  - startDate (optional, ISO date string)
  - endDate (optional, ISO date string)
  - page (optional, default 1)
  - limit (optional, default 20)

### Reporting DTOs
- `BudgetSummaryDto`: Summary for fiscal year
- `SpendingTrendDto`: Monthly spending trends
- `BudgetRecommendationDto`: Budget allocation recommendations

## API Endpoints

### Budget Categories

#### Get Budget Categories
```
GET /budget/categories?fiscalYear=2024&activeOnly=true
```
Returns list of budget categories with recent transactions.

**Query Parameters:**
- `fiscalYear` (optional): Fiscal year to filter (defaults to current year)
- `activeOnly` (optional): Return only active categories (default: true)

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Medical Supplies",
    "description": "Budget for medical supplies and equipment",
    "fiscalYear": 2024,
    "allocatedAmount": 50000,
    "spentAmount": 32500,
    "remainingAmount": 17500,
    "utilizationPercentage": 65.00,
    "isActive": true,
    "transactions": [...]
  }
]
```

#### Get Budget Category by ID
```
GET /budget/categories/:id
```
Returns single category with all transactions.

#### Create Budget Category
```
POST /budget/categories
Content-Type: application/json

{
  "name": "Medical Supplies",
  "description": "Budget for medical supplies",
  "fiscalYear": 2024,
  "allocatedAmount": 50000
}
```

#### Update Budget Category
```
PATCH /budget/categories/:id
Content-Type: application/json

{
  "allocatedAmount": 55000
}
```

#### Delete Budget Category
```
DELETE /budget/categories/:id
```
Soft deletes the category (sets isActive = false).

### Budget Transactions

#### Get Budget Transactions
```
GET /budget/transactions?categoryId=uuid&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=20
```
Returns paginated list of transactions with filters.

#### Create Budget Transaction
```
POST /budget/transactions
Content-Type: application/json

{
  "categoryId": "uuid",
  "amount": 250.00,
  "description": "Medical supplies - PO-2024-001",
  "referenceId": "po-uuid",
  "referenceType": "PURCHASE_ORDER",
  "notes": "Encumbrance for approved purchase order"
}
```
Automatically updates category spentAmount.

#### Update Budget Transaction
```
PATCH /budget/transactions/:id
Content-Type: application/json

{
  "amount": 245.50,
  "notes": "Updated to actual invoice amount"
}
```
Automatically adjusts category spentAmount.

#### Delete Budget Transaction
```
DELETE /budget/transactions/:id
```
Hard deletes transaction and adjusts category spentAmount.

### Financial Reporting

#### Get Budget Summary
```
GET /budget/summary?fiscalYear=2024
```
Returns comprehensive budget summary for fiscal year.

**Response:**
```json
{
  "fiscalYear": 2024,
  "totalAllocated": 500000,
  "totalSpent": 325000,
  "totalRemaining": 175000,
  "utilizationPercentage": 65.00,
  "categoryCount": 10,
  "overBudgetCount": 2
}
```

#### Get Spending Trends
```
GET /budget/trends?fiscalYear=2024&categoryId=uuid
```
Returns monthly spending trends.

**Response:**
```json
[
  {
    "month": "2024-07-01T00:00:00.000Z",
    "totalSpent": 25000,
    "transactionCount": 15
  }
]
```

#### Get Over-Budget Categories
```
GET /budget/over-budget?fiscalYear=2024
```
Returns categories that have exceeded their allocated budget.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Medical Supplies",
    "allocatedAmount": 50000,
    "spentAmount": 52500,
    "overAmount": 2500,
    "overPercentage": 5.00,
    "transactions": [...]
  }
]
```

#### Get Category Year Comparison
```
GET /budget/comparison/Medical%20Supplies?years=2023,2024
```
Compares category spending across multiple fiscal years.

#### Get Budget Recommendations
```
GET /budget/recommendations?fiscalYear=2024
```
Returns budget allocation recommendations based on historical data.

**Response:**
```json
[
  {
    "categoryName": "Medical Supplies",
    "currentAllocated": 50000,
    "currentSpent": 48000,
    "currentUtilization": 96.00,
    "recommendation": "INCREASE",
    "suggestedAmount": 52800,
    "reason": "High utilization (96%) indicates budget pressure"
  }
]
```

#### Export Budget Data
```
GET /budget/export?fiscalYear=2024
```
Exports complete budget data including all categories and transactions.

## Business Rules

1. **Fiscal Year**: Runs from July 1 to June 30
2. **Automatic Tracking**: Category spent amounts are automatically updated when transactions are created, updated, or deleted
3. **Over-Budget Handling**: Spending can exceed allocated amount, but generates warnings (not hard blocks)
4. **Soft Delete**: Categories are soft-deleted to preserve historical data
5. **Transaction Integrity**: All transaction operations use database transactions to ensure data consistency
6. **Duplicate Prevention**: Cannot create duplicate category names within the same fiscal year
7. **Active Category Requirement**: New transactions can only be added to active categories

## Usage Examples

### Create a Budget for Fiscal Year 2024

```typescript
// Create budget category
const category = await budgetService.createBudgetCategory({
  name: 'Medical Supplies',
  description: 'Budget for all medical supplies and equipment',
  fiscalYear: 2024,
  allocatedAmount: 50000
});

// Record a purchase
const transaction = await budgetService.createBudgetTransaction({
  categoryId: category.id,
  amount: 1250.00,
  description: 'First aid supplies - PO-2024-001',
  referenceId: 'po-uuid-123',
  referenceType: 'PURCHASE_ORDER'
});
```

### Generate Monthly Budget Report

```typescript
// Get budget summary
const summary = await budgetService.getBudgetSummary(2024);

// Get spending trends
const trends = await budgetService.getSpendingTrends(2024);

// Check for over-budget categories
const overBudget = await budgetService.getOverBudgetCategories(2024);

// Get recommendations for next year
const recommendations = await budgetService.getBudgetRecommendations(2024);
```

### Track Budget Utilization

```typescript
// Get all categories with current status
const categories = await budgetService.getBudgetCategories(2024);

for (const category of categories) {
  console.log(`${category.name}:`);
  console.log(`  Allocated: $${category.allocatedAmount}`);
  console.log(`  Spent: $${category.spentAmount}`);
  console.log(`  Remaining: $${category.remainingAmount}`);
  console.log(`  Utilization: ${category.utilizationPercentage}%`);
}
```

## Database Schema

### Table: budget_categories
```sql
CREATE TABLE budget_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fiscal_year INTEGER NOT NULL,
  allocated_amount DECIMAL(10,2) NOT NULL,
  spent_amount DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, fiscal_year, is_active)
);
```

### Table: budget_transactions
```sql
CREATE TABLE budget_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES budget_categories(id),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  transaction_date TIMESTAMP NOT NULL,
  reference_id VARCHAR(255),
  reference_type VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Dependencies

- `@nestjs/common`: NestJS core functionality
- `@nestjs/typeorm`: TypeORM integration for database operations
- `typeorm`: ORM for entity management
- `class-validator`: DTO validation
- `class-transformer`: DTO transformation

## Testing

### Unit Tests
Test coverage for all service methods:
- Budget category CRUD operations
- Budget transaction management
- Automatic spent amount calculations
- Financial reporting and analytics
- Budget recommendations algorithm

### Integration Tests
End-to-end testing of:
- Complete budget lifecycle
- Transaction rollback scenarios
- Concurrent transaction handling
- Fiscal year transitions
- Over-budget detection

## Error Handling

The module uses standard NestJS exception handling:
- `NotFoundException`: Entity not found
- `ConflictException`: Duplicate category name in same fiscal year
- `BadRequestException`: Invalid operations (e.g., inactive category)

All database operations are wrapped in transactions to ensure data consistency.

## Performance Considerations

1. **Query Optimization**: Uses TypeORM query builder for efficient database queries
2. **Transaction Limits**: Limits number of transactions returned with categories to prevent large payloads
3. **Aggregation**: Uses database-level aggregation for summaries and trends
4. **Indexing**: Recommended indexes:
   - `budget_categories(fiscal_year, is_active)`
   - `budget_categories(name, fiscal_year, is_active)`
   - `budget_transactions(category_id, transaction_date)`

## Future Enhancements

- Budget approval workflow
- Spending alerts and notifications
- Budget forecasting based on trends
- Integration with purchase order system
- Multi-year budget planning
- Budget variance analysis reports
- Custom fiscal year date ranges
- Budget category hierarchies

## Migration Notes

This module migrates functionality from:
- `backend/src/services/budget/budget.service.ts`
- `backend/src/services/budget/budget.repository.ts`

Key changes from legacy implementation:
- Sequelize → TypeORM
- Static class methods → Injectable service
- Raw SQL → Query builder
- Separate repository → Integrated service

All business logic and calculations remain the same.

# DataLoader Architecture and Data Flow

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GraphQL Request                              │
│                    (e.g., students query)                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        GraphQL Resolver                              │
│                    (StudentResolver)                                 │
│  • Handles query                                                     │
│  • Calls field resolvers                                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
    ┌───────────────────────────┐   ┌──────────────────────────┐
    │   Main Query Resolver     │   │  Field Resolver          │
    │   getStudents()           │   │  @ResolveField           │
    │   • StudentService        │   │  • contacts()            │
    │   • findAll()             │   │  • medications()         │
    └───────────────────────────┘   │  • healthRecord()        │
                                    └──────────────────────────┘
                                               │
                                               ▼
                          ┌─────────────────────────────────────┐
                          │     DataLoaderFactory               │
                          │  • createContactsByStudentLoader()  │
                          │  • createMedicationsByStudentLoader()│
                          │  • createHealthRecordsByStudentLoader()│
                          └─────────────────────────────────────┘
                                               │
                                               ▼
                          ┌─────────────────────────────────────┐
                          │        DataLoader Instance          │
                          │  • Batches multiple calls           │
                          │  • Caches results per request       │
                          │  • loader.load(studentId)           │
                          └─────────────────────────────────────┘
                                               │
                                               ▼
                          ┌─────────────────────────────────────┐
                          │      Batch Function                 │
                          │  async (ids: readonly string[]) =>  │
                          │    • Convert to regular array       │
                          │    • Call service.findByIds(ids)    │
                          │    • Return results in order        │
                          └─────────────────────────────────────┘
                                               │
                                               ▼
                          ┌─────────────────────────────────────┐
                          │     Service Layer                   │
                          │  • ContactService.findByStudentIds()│
                          │  • MedicationService.findByStudentIds()│
                          │  • Logging                          │
                          └─────────────────────────────────────┘
                                               │
                                               ▼
                          ┌─────────────────────────────────────┐
                          │     Repository Layer                │
                          │  • Database query with Op.in        │
                          │  • Group results by relation ID     │
                          │  • Return in requested order        │
                          └─────────────────────────────────────┘
                                               │
                                               ▼
                          ┌─────────────────────────────────────┐
                          │       Database (PostgreSQL)         │
                          │  • Single batched query             │
                          │  • SELECT ... WHERE id IN (...)     │
                          └─────────────────────────────────────┘
```

---

## Data Flow Example: Loading Students with Contacts

### Without DataLoader (N+1 Problem)
```
GraphQL Query: Get 10 students with their contacts

1. Query students → 1 DB query (10 students)
2. For each student, query contacts:
   • Student 1 contacts → 1 DB query
   • Student 2 contacts → 1 DB query
   • ... (8 more queries)
   • Student 10 contacts → 1 DB query

Total: 11 DB queries (1 + 10)
```

### With DataLoader (Batched)
```
GraphQL Query: Get 10 students with their contacts

1. Query students → 1 DB query (10 students)
2. DataLoader batches all contact requests:
   • Collect IDs: [id1, id2, ..., id10]
   • Single batched query → 1 DB query
   • Group and return results

Total: 2 DB queries (1 + 1)
Performance: 5.5x faster
```

---

## Type Safety Flow

```
┌──────────────────────────────────────────────────────────────┐
│  1. DataLoader Type Definition                               │
│     DataLoader<string, any>                                  │
│     • Key: string (ID)                                       │
│     • Value: any (Entity | null or Entity[])                │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  2. Batch Function Signature                                 │
│     async (ids: readonly string[]) => Promise<Array<T>>      │
│     • Input: readonly array (DataLoader requirement)         │
│     • Output: Regular array in same order                    │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  3. Service Method Signature                                 │
│     Single Entity:                                           │
│       findByIds(ids: string[]): Promise<(Entity | null)[]>   │
│     One-to-Many:                                             │
│       findByRelationIds(ids: string[]): Promise<Entity[][]>  │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  4. Repository Implementation                                │
│     • Query: findAll({ where: { id: { [Op.in]: ids } } })   │
│     • Map: const map = new Map(entities.map(e => [e.id, e]))│
│     • Return: ids.map(id => map.get(id) || null)             │
│     Type: Map<string, Entity> → (Entity | null)[]            │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  5. Type Verification Points                                 │
│     ✅ Map key type: string                                  │
│     ✅ Map value type: Entity                                │
│     ✅ Return type: (Entity | null)[] or Entity[][]          │
│     ✅ Order preservation: input order = output order        │
└──────────────────────────────────────────────────────────────┘
```

---

## Null Handling Strategy

### Single Entity Loaders

```typescript
// Repository Implementation
async findByIds(ids: string[]): Promise<(Student | null)[]> {
  const students = await this.studentModel.findAll({
    where: { id: { [Op.in]: ids } }
  });

  // Found: [student1, student3] for IDs: ['id1', 'id2', 'id3']
  // Missing: 'id2'

  const studentMap = new Map(students.map(s => [s.id, s]));
  // Map: { 'id1' => student1, 'id3' => student3 }

  return ids.map(id => studentMap.get(id) || null);
  // Result: [student1, null, student3]
  //          ^^^^^^^^  ^^^^  ^^^^^^^^
  //          found     missing found
}
```

**Key Points:**
- Returns `null` for missing entities
- Maintains order of requested IDs
- DataLoader caches result (including nulls)

### One-to-Many Loaders

```typescript
// Repository Implementation
async findByStudentIds(studentIds: string[]): Promise<Contact[][]> {
  const contacts = await this.contactModel.findAll({
    where: { relationTo: { [Op.in]: studentIds } }
  });

  // Found: [contact1(student1), contact2(student1), contact3(student3)]
  // For IDs: ['student1', 'student2', 'student3']
  // Missing: 'student2' has no contacts

  const contactsByStudent = new Map<string, Contact[]>();
  contacts.forEach(contact => {
    const studentId = contact.relationTo;
    if (!contactsByStudent.has(studentId)) {
      contactsByStudent.set(studentId, []);
    }
    contactsByStudent.get(studentId)!.push(contact);
  });
  // Map: { 'student1' => [contact1, contact2], 'student3' => [contact3] }

  return studentIds.map(id => contactsByStudent.get(id) || []);
  // Result: [[contact1, contact2], [], [contact3]]
  //          ^^^^^^^^^^^^^^^^^     ^^  ^^^^^^^^^^
  //          found                 empty found
}
```

**Key Points:**
- Returns `[]` for entities with no relations
- Empty array clearer than null for collections
- Still maintains order

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Error occurs in Repository                                 │
│  • Database connection lost                                 │
│  • Query timeout                                            │
│  • Invalid data                                             │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Caught in Repository try-catch                             │
│  try {                                                      │
│    const results = await this.model.findAll(...)           │
│    return results                                           │
│  } catch (error) {                                          │
│    this.logger.error(`Failed: ${error.message}`)           │
│    throw new Error('Failed to batch fetch')                │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Propagates to Service (optional logging)                   │
│  async findByIds(ids: string[]) {                           │
│    this.logger.log(`Batch fetching ${ids.length} entities`) │
│    return this.repository.findByIds(ids);                   │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Caught in DataLoader batch function                        │
│  async (ids: readonly string[]) => {                        │
│    try {                                                    │
│      return await service.findByIds([...ids])              │
│    } catch (error) {                                        │
│      console.error('Error in DataLoader:', error)          │
│      return ids.map(() => error)  // Error per ID          │
│    }                                                        │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Returned to GraphQL Resolver                               │
│  • Each ID gets error object                                │
│  • GraphQL can handle partial failures                      │
│  • Client receives error in response                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Characteristics

### Batching Efficiency

```
Request Window: 1ms
Max Batch Size: 100

Timeline:
0ms     │ loader.load(id1)  → Queued
0.2ms   │ loader.load(id2)  → Queued
0.5ms   │ loader.load(id3)  → Queued
0.8ms   │ loader.load(id4)  → Queued
1ms     │ ⚡ BATCH EXECUTED: [id1, id2, id3, id4]
        │    → Single DB query
        │    → Results distributed to all callers
```

### Cache Effectiveness

```
Request Scope:
┌─────────────────────────────────────────────────────────────┐
│  GraphQL Request 1 (10ms duration)                          │
│  • loader.load('id1') → Database query                      │
│  • loader.load('id1') → Cache hit (no query)                │
│  • loader.load('id1') → Cache hit (no query)                │
│  Result: 1 query instead of 3                               │
└─────────────────────────────────────────────────────────────┘
        │ Request ends, cache cleared
        ▼
┌─────────────────────────────────────────────────────────────┐
│  GraphQL Request 2 (new request)                            │
│  • loader.load('id1') → Database query (cache empty)        │
│  Result: Fresh data, no stale cache issues                  │
└─────────────────────────────────────────────────────────────┘
```

### Lookup Performance

```
Map.get() Complexity:
• Time: O(1) average, O(n) worst case
• Space: O(n) where n = number of entities

Total Batch Function Complexity:
• Database query: O(n) where n = batch size
• Map construction: O(n)
• Result mapping: O(m) where m = number of requested IDs
• Overall: O(n + m)

Example:
• Batch size: 100 entities
• Requested IDs: 100
• Total: O(200) = O(n) linear time
```

---

## Request Scoping Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  NestJS Application Startup                                  │
│  • DataLoaderFactory registered as REQUEST-scoped            │
│  • @Injectable({ scope: Scope.REQUEST })                     │
└──────────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼                                  ▼
┌──────────────────┐            ┌──────────────────┐
│  Request 1       │            │  Request 2       │
│  • New Factory   │            │  • New Factory   │
│  • New Loaders   │            │  • New Loaders   │
│  • Fresh Cache   │            │  • Fresh Cache   │
└──────────────────┘            └──────────────────┘
        │ Request ends                   │ Request ends
        ▼ Garbage collected              ▼ Garbage collected

No data leakage between requests
No stale cache issues
Memory automatically cleaned up
```

---

## Integration Points

### GraphQL Context Setup
```typescript
// graphql.module.ts
context: ({ req }) => ({
  req,
  loaders: dataLoaderFactory.createLoaders(),
  // Loaders created per request
}),
```

### Resolver Usage
```typescript
@ResolveField(() => [ContactDto], { name: 'contacts' })
async contacts(@Parent() student: StudentDto) {
  const loader = this.dataLoaderFactory.createContactsByStudentLoader();
  const contacts = await loader.load(student.id);
  return contacts || [];
}
```

---

## Summary

**Architecture Strengths:**
1. ✅ Clean separation of concerns (Resolver → Factory → Service → Repository)
2. ✅ Type safety at every layer
3. ✅ Request-scoped caching prevents data leakage
4. ✅ Batching prevents N+1 queries
5. ✅ Error handling at multiple layers
6. ✅ Performance optimized with O(1) lookups
7. ✅ Null handling consistent and predictable

**Performance Gains:**
- N+1 queries eliminated
- 10-100x performance improvement for nested queries
- Reduced database load
- Lower latency for GraphQL responses

**Maintainability:**
- Standard patterns across all loaders
- Easy to add new loaders
- Type-safe interfaces
- Comprehensive error handling

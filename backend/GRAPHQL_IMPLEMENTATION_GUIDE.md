# GraphQL Implementation Guide
## White Cross School Health Platform

This guide provides step-by-step instructions for implementing the GraphQL enhancements identified in the gap analysis.

---

## Quick Start

### Files Created

The following implementation files have been created as examples and can be integrated into the application:

#### Custom Scalars
- `src/infrastructure/graphql/scalars/datetime.scalar.ts` - ISO 8601 DateTime scalar
- `src/infrastructure/graphql/scalars/phone-number.scalar.ts` - Validated phone numbers
- `src/infrastructure/graphql/scalars/email-address.scalar.ts` - Validated email addresses
- `src/infrastructure/graphql/scalars/uuid.scalar.ts` - UUID v4 validation
- `src/infrastructure/graphql/scalars/index.ts` - Barrel export

#### Subscriptions (Real-time)
- `src/infrastructure/graphql/pubsub/pubsub.module.ts` - Redis PubSub module
- `src/infrastructure/graphql/resolvers/subscription.resolver.ts` - Subscription resolver

#### Enhanced Authorization
- `src/infrastructure/graphql/guards/field-authorization.guard.ts` - Field-level auth
- `src/infrastructure/graphql/guards/resource-ownership.guard.ts` - Resource-based auth

#### Tests
- `test/unit/graphql/student.resolver.spec.ts` - Unit tests
- `test/integration/graphql/student.resolver.integration.spec.ts` - Integration tests

---

## Implementation Roadmap

### Phase 1: Custom Scalars (Priority: HIGH, Effort: 2 hours)

**Goal:** Add type-safe custom scalars for better validation

1. **Install Dependencies**
   ```bash
   npm install libphonenumber-js
   ```

2. **Register Scalars in GraphQL Module**
   ```typescript
   // src/infrastructure/graphql/graphql.module.ts
   import {
     DateTimeScalar,
     PhoneNumberScalar,
     EmailAddressScalar,
     UUIDScalar,
   } from './scalars';

   @Module({
     providers: [
       DateTimeScalar,
       PhoneNumberScalar,
       EmailAddressScalar,
       UUIDScalar,
       // ... other providers
     ],
   })
   export class GraphQLModule {}
   ```

3. **Update DTOs to Use Custom Scalars**
   ```typescript
   // src/infrastructure/graphql/dto/contact.dto.ts
   import { EmailAddress, PhoneNumber } from '../scalars';

   @ObjectType()
   export class ContactDto {
     @Field(() => EmailAddress, { nullable: true })
     email?: string;

     @Field(() => PhoneNumber, { nullable: true })
     phone?: string;
   }
   ```

4. **Update Schema**
   ```bash
   npm run build
   # Schema will be regenerated automatically
   ```

**Testing:**
```graphql
mutation CreateContact {
  createContact(input: {
    firstName: "John"
    lastName: "Doe"
    email: "INVALID_EMAIL"  # Should fail validation
    phone: "555-1234"       # Should format to +15551234
    type: Guardian
  }) {
    id
  }
}
```

---

### Phase 2: GraphQL Subscriptions (Priority: HIGH, Effort: 4 hours)

**Goal:** Enable real-time updates for health records, alerts, and vitals

1. **Install Dependencies**
   ```bash
   npm install graphql-redis-subscriptions ioredis
   npm install --save-dev @types/ioredis
   ```

2. **Add PubSub Module to App**
   ```typescript
   // src/app.module.ts
   import { PubSubModule } from './infrastructure/graphql/pubsub/pubsub.module';

   @Module({
     imports: [
       // ... existing imports
       PubSubModule,
     ],
   })
   export class AppModule {}
   ```

3. **Register Subscription Resolver**
   ```typescript
   // src/infrastructure/graphql/graphql.module.ts
   import { SubscriptionResolver } from './resolvers/subscription.resolver';

   @Module({
     providers: [
       // ... existing providers
       SubscriptionResolver,
     ],
   })
   export class GraphQLModule {}
   ```

4. **Update GraphQL Config for Subscriptions**
   ```typescript
   // src/infrastructure/graphql/graphql.module.ts
   GraphQLModule.forRootAsync<ApolloDriverConfig>({
     useFactory: async (configService: ConfigService) => ({
       // ... existing config
       subscriptions: {
         'graphql-ws': {
           path: '/graphql',
           onConnect: (context) => {
             const { connectionParams } = context;
             const token = connectionParams?.authorization?.replace('Bearer ', '');

             if (!token) {
               throw new Error('Missing auth token');
             }

             // Verify JWT and return user
             const user = verifyJWT(token); // Implement this
             return { user };
           },
         },
       },
     }),
   }),
   ```

5. **Publish Events from Services**
   ```typescript
   // src/health-record/health-record.service.ts
   import { Inject } from '@nestjs/common';
   import { RedisPubSub } from 'graphql-redis-subscriptions';
   import { PUB_SUB } from '../infrastructure/graphql/pubsub/pubsub.module';
   import { SubscriptionEvent } from '../infrastructure/graphql/resolvers/subscription.resolver';

   export class HealthRecordService {
     constructor(
       @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
     ) {}

     async create(data: CreateHealthRecordDto) {
       const record = await this.repository.create(data);

       // Publish subscription event
       await this.pubSub.publish(SubscriptionEvent.HEALTH_RECORD_CREATED, {
         healthRecordCreated: record,
       });

       return record;
     }
   }
   ```

6. **Configure Redis**
   ```bash
   # .env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   REDIS_DB=0
   ```

**Testing:**
```typescript
// Frontend subscription
const SUBSCRIPTION = gql`
  subscription OnHealthRecordCreated($studentId: ID!) {
    healthRecordCreated(studentId: $studentId) {
      id
      title
      recordDate
    }
  }
`;

const { data } = useSubscription(SUBSCRIPTION, {
  variables: { studentId: 'student-123' },
});
```

---

### Phase 3: Enhanced Authorization (Priority: MEDIUM, Effort: 3 hours)

**Goal:** Implement field-level and resource-based authorization

1. **Register Authorization Guards**
   ```typescript
   // src/infrastructure/graphql/guards/index.ts
   export * from './gql-auth.guard';
   export * from './gql-roles.guard';
   export * from './field-authorization.guard';
   export * from './resource-ownership.guard';
   ```

2. **Use Field-Level Authorization**
   ```typescript
   // src/infrastructure/graphql/resolvers/student.resolver.ts
   import { FieldAuthorization, PHIField } from '../guards/field-authorization.guard';

   @Resolver(() => StudentDto)
   export class StudentResolver {
     @ResolveField(() => String, { nullable: true })
     @PHIField()
     async ssn(@Parent() student: StudentDto): Promise<string | null> {
       return student.ssn;
     }

     @ResolveField(() => String, { nullable: true })
     @FieldAuthorization([UserRole.ADMIN, UserRole.NURSE])
     async medicalNotes(@Parent() student: StudentDto): Promise<string | null> {
       return student.medicalNotes;
     }
   }
   ```

3. **Use Resource Ownership Guard**
   ```typescript
   // src/infrastructure/graphql/resolvers/student.resolver.ts
   import { ResourceOwnershipGuard, ResourceType } from '../guards/resource-ownership.guard';

   @Query(() => StudentDto)
   @UseGuards(GqlAuthGuard, ResourceOwnershipGuard)
   @ResourceType('student')
   async student(@Args('id', { type: () => ID }) id: string) {
     return this.studentService.findOne(id);
   }
   ```

4. **Register Guard Dependencies**
   ```typescript
   // src/infrastructure/graphql/graphql.module.ts
   import { ResourceOwnershipGuard } from './guards/resource-ownership.guard';
   import { StudentModule } from '../../student/student.module';
   import { HealthRecordModule } from '../../health-record/health-record.module';

   @Module({
     imports: [
       StudentModule,
       HealthRecordModule,
     ],
     providers: [
       ResourceOwnershipGuard,
       // ... other providers
     ],
   })
   export class GraphQLModule {}
   ```

**Testing:**
```graphql
# As a nurse assigned to student-123
query GetStudent {
  student(id: "student-123") {  # Should succeed
    id
    fullName
    ssn  # Should return value
  }
}

# As a nurse NOT assigned to student-456
query GetOtherStudent {
  student(id: "student-456") {  # Should fail with ForbiddenException
    id
  }
}
```

---

### Phase 4: Testing (Priority: MEDIUM, Effort: 6 hours)

**Goal:** Add comprehensive test coverage for GraphQL resolvers

1. **Install Test Dependencies**
   ```bash
   npm install --save-dev @nestjs/testing supertest
   ```

2. **Run Unit Tests**
   ```bash
   npm run test -- student.resolver.spec.ts
   ```

3. **Run Integration Tests**
   ```bash
   npm run test:e2e -- student.resolver.integration.spec.ts
   ```

4. **Add Coverage Reporting**
   ```bash
   npm run test:cov
   ```

5. **Create Tests for Other Resolvers**
   - Copy `test/unit/graphql/student.resolver.spec.ts` template
   - Adapt for `contact.resolver.ts` and `health-record.resolver.ts`

---

## Configuration Changes

### Update Environment Variables

```bash
# .env
# GraphQL Configuration
GRAPHQL_PLAYGROUND_ENABLED=true
GRAPHQL_MAX_COMPLEXITY=1000
GRAPHQL_MAX_DEPTH=10

# Redis for PubSub (Subscriptions)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT for WebSocket Auth
JWT_SECRET=your-secret-key
```

### Update GraphQL Module Configuration

```typescript
// src/infrastructure/graphql/graphql.module.ts
import { DepthLimitPlugin } from './plugins/depth-limit.plugin';

@Module({
  providers: [
    ComplexityPlugin,
    DepthLimitPlugin, // Add depth limiting
    // ... other providers
  ],
})
export class GraphQLModule {}
```

---

## Deployment Checklist

### Pre-Production

- [ ] All tests passing (unit + integration)
- [ ] Schema regenerated (`npm run build`)
- [ ] Redis configured and accessible
- [ ] WebSocket endpoint tested
- [ ] Subscription authentication tested
- [ ] Field-level authorization tested
- [ ] Query complexity limits tested

### Production

- [ ] Disable GraphQL Playground (`GRAPHQL_PLAYGROUND_ENABLED=false`)
- [ ] Enable query allowlisting (if applicable)
- [ ] Configure Redis cluster for HA
- [ ] Set up monitoring for subscription connections
- [ ] Configure rate limiting per user
- [ ] Enable audit logging for all PHI access
- [ ] Test WebSocket connection scaling

---

## Monitoring & Observability

### GraphQL Metrics to Track

1. **Query Performance**
   - Average query execution time
   - Slowest queries (P95, P99)
   - Query complexity distribution

2. **DataLoader Efficiency**
   - Batch sizes
   - Cache hit rates
   - N+1 query detection

3. **Subscription Health**
   - Active subscription count
   - Connection churn rate
   - Event publish latency

4. **Authorization**
   - Failed authorization attempts
   - PHI field access frequency
   - Suspicious access patterns

### Logging Examples

```typescript
// Add structured logging for monitoring
import { Logger } from '@nestjs/common';

const logger = new Logger('GraphQL');

// Log slow queries
if (executionTime > 1000) {
  logger.warn('Slow GraphQL query', {
    operationName,
    duration: executionTime,
    complexity,
  });
}

// Log subscription events
logger.log('Subscription event published', {
  event: 'HEALTH_RECORD_CREATED',
  subscriberCount,
});

// Log authorization failures
logger.warn('Authorization denied', {
  userId,
  resource,
  requiredRoles,
});
```

---

## Troubleshooting

### Common Issues

1. **Subscriptions not working**
   - Check Redis connection
   - Verify JWT in WebSocket handshake
   - Check subscription filter logic
   - Ensure events are being published

2. **Query complexity errors**
   - Reduce pagination limits
   - Remove unnecessary nested fields
   - Add field-level complexity annotations

3. **DataLoader not batching**
   - Verify request scope injection
   - Check batch window timing
   - Ensure proper context passing

4. **Authorization failures**
   - Verify JWT validity
   - Check role assignments
   - Review guard execution order

---

## Performance Tips

1. **Optimize DataLoaders**
   - Keep batch sizes under 100
   - Use Redis for distributed caching
   - Profile batch loading queries

2. **Subscription Scaling**
   - Use Redis Cluster for horizontal scaling
   - Implement connection pooling
   - Add rate limiting per user

3. **Query Optimization**
   - Add database indexes for common queries
   - Use query complexity annotations
   - Implement response caching

4. **Schema Design**
   - Keep nesting depth under 5 levels
   - Use pagination for all lists
   - Avoid expensive computed fields

---

## Next Steps

1. **Immediate** (Week 1)
   - Implement custom scalars
   - Add field-level authorization
   - Write unit tests for resolvers

2. **Short-term** (Week 2-3)
   - Implement GraphQL subscriptions
   - Add integration tests
   - Set up monitoring

3. **Long-term** (Month 2+)
   - Add GraphQL federation (if needed)
   - Implement persisted queries
   - Optimize DataLoader patterns

---

## Resources

- [NestJS GraphQL Documentation](https://docs.nestjs.com/graphql/quick-start)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Query Complexity](https://github.com/slicknode/graphql-query-complexity)
- [DataLoader Pattern](https://github.com/graphql/dataloader)
- [GraphQL Subscriptions](https://www.apollographql.com/docs/apollo-server/data/subscriptions/)

---

**Last Updated:** 2025-11-03
**Version:** 1.0.0

# GraphQL API Layer

## Overview

This GraphQL API layer provides a flexible, type-safe interface for querying and mutating data in the White-Cross healthcare platform. It's implemented using Apollo Server 4 integrated with the existing Hapi.js server.

Inspired by: **TwentyHQ CRM** GraphQL implementation patterns

## Features

- ✅ **Type-Safe Schema** - Full TypeScript support with custom scalars (DateTime, JSON)
- ✅ **Permission-Based Authorization** - Integrated with existing RBAC system
- ✅ **Hybrid API** - GraphQL alongside existing REST endpoints
- ✅ **Pagination & Filtering** - Efficient data retrieval
- ✅ **Error Handling** - Structured error responses
- ✅ **HIPAA Compliant** - Audit logging and access control

## Endpoint

```
POST /graphql
GET  /graphql (for playground/introspection)
```

## Authentication

GraphQL requests use the same authentication as REST APIs:
- Include JWT token in `Authorization` header: `Bearer <token>`
- Unauthenticated queries are allowed but limited

## Queries

### Contacts

#### Get All Contacts
```graphql
query GetContacts {
  contacts(page: 1, limit: 20, filters: { type: guardian }) {
    contacts {
      id
      firstName
      lastName
      fullName
      email
      phone
      type
      organization
      isActive
    }
    pagination {
      page
      limit
      total
      totalPages
    }
  }
}
```

#### Get Single Contact
```graphql
query GetContact($id: ID!) {
  contact(id: $id) {
    id
    firstName
    lastName
    email
    phone
    type
    address
    city
    state
    zip
    relationTo
    relationshipType
    customFields
    notes
    createdAt
    updatedAt
  }
}
```

#### Search Contacts
```graphql
query SearchContacts($query: String!) {
  searchContacts(query: $query, limit: 10) {
    id
    fullName
    email
    phone
    type
  }
}
```

#### Get Contacts by Relation
```graphql
query GetContactsByRelation($relationTo: ID!, $type: ContactType) {
  contactsByRelation(relationTo: $relationTo, type: $type) {
    id
    firstName
    lastName
    email
    phone
    relationshipType
  }
}
```

#### Get Contact Statistics
```graphql
query GetContactStats {
  contactStats {
    total
    byType
  }
}
```

### Students

#### Get All Students
```graphql
query GetStudents {
  students(page: 1, limit: 20, filters: { isActive: true }) {
    students {
      id
      studentNumber
      firstName
      lastName
      fullName
      dateOfBirth
      grade
      gender
      isActive
    }
    pagination {
      page
      limit
      total
      totalPages
    }
  }
}
```

#### Get Single Student
```graphql
query GetStudent($id: ID!) {
  student(id: $id) {
    id
    studentNumber
    firstName
    lastName
    fullName
    dateOfBirth
    grade
    gender
    photo
    medicalRecordNum
    isActive
    enrollmentDate
    nurseId
  }
}
```

## Mutations

### Create Contact
```graphql
mutation CreateContact($input: ContactInput!) {
  createContact(input: $input) {
    id
    firstName
    lastName
    email
    phone
    type
  }
}

# Variables
{
  "input": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "type": "guardian",
    "relationTo": "student-uuid",
    "relationshipType": "parent"
  }
}
```

### Update Contact
```graphql
mutation UpdateContact($id: ID!, $input: ContactUpdateInput!) {
  updateContact(id: $id, input: $input) {
    id
    firstName
    lastName
    email
    phone
    updatedAt
  }
}

# Variables
{
  "id": "contact-uuid",
  "input": {
    "email": "newemail@example.com",
    "phone": "+1-555-9999"
  }
}
```

### Delete Contact
```graphql
mutation DeleteContact($id: ID!) {
  deleteContact(id: $id) {
    success
    message
  }
}
```

### Deactivate Contact
```graphql
mutation DeactivateContact($id: ID!) {
  deactivateContact(id: $id) {
    id
    isActive
  }
}
```

### Reactivate Contact
```graphql
mutation ReactivateContact($id: ID!) {
  reactivateContact(id: $id) {
    id
    isActive
  }
}
```

## Types

### ContactType Enum
- `guardian` - Guardian/parent
- `staff` - School staff
- `vendor` - Vendor/supplier
- `provider` - Healthcare provider
- `other` - Other contact type

### Gender Enum (Students)
- `MALE`
- `FEMALE`
- `OTHER`
- `PREFER_NOT_TO_SAY`

## Error Handling

GraphQL errors follow this structure:

```json
{
  "errors": [
    {
      "message": "Permission denied: Cannot perform action 'create' on resource 'contact'",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

### Error Codes

- `UNAUTHENTICATED` - Missing or invalid authentication
- `FORBIDDEN` - Permission denied
- `BAD_USER_INPUT` - Invalid input data
- `NOT_FOUND` - Resource not found
- `INTERNAL_SERVER_ERROR` - Server error

## Permission Requirements

All GraphQL operations check permissions using the existing RBAC system:

| Operation | Resource | Action Required |
|-----------|----------|----------------|
| contacts query | Contact | List |
| contact query | Contact | Read |
| createContact | Contact | Create |
| updateContact | Contact | Update |
| deleteContact | Contact | Delete |
| students query | Student | List |
| student query | Student | Read |

## Testing

### Using Apollo Sandbox

1. Navigate to: https://studio.apollographql.com/sandbox/explorer
2. Set endpoint to: `http://localhost:3001/graphql`
3. Add authentication header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### Using curl

```bash
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "query": "query { contacts { contacts { id firstName lastName } } }"
  }'
```

### Using Postman

1. Create new POST request to `http://localhost:3001/graphql`
2. Set Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer <token>`
3. Body (raw JSON):
   ```json
   {
     "query": "query GetContacts { contacts { contacts { id firstName lastName } } }"
   }
   ```

## Integration with Frontend

### Apollo Client Setup

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
```

### Example Query Hook

```typescript
import { gql, useQuery } from '@apollo/client';

const GET_CONTACTS = gql`
  query GetContacts($page: Int, $limit: Int) {
    contacts(page: $page, limit: $limit) {
      contacts {
        id
        firstName
        lastName
        email
        phone
        type
      }
      pagination {
        total
        totalPages
      }
    }
  }
`;

export function useContacts(page = 1, limit = 20) {
  const { data, loading, error } = useQuery(GET_CONTACTS, {
    variables: { page, limit },
  });

  return {
    contacts: data?.contacts?.contacts || [],
    pagination: data?.contacts?.pagination,
    loading,
    error,
  };
}
```

## Architecture

### File Structure

```
backend/src/api/graphql/
├── schema/
│   └── index.ts          # GraphQL type definitions
├── resolvers/
│   └── index.ts          # Resolver functions
├── server.ts             # Apollo Server setup
├── __tests__/
│   └── schema.test.ts    # Schema tests
└── README.md             # This file
```

### Flow

1. Request arrives at `/graphql`
2. Apollo Server parses query/mutation
3. Resolver extracts user from context
4. Permission check via RBAC system
5. Service layer executes business logic
6. Response formatted and returned

## Best Practices

1. **Always specify required fields** - Use `!` for non-nullable fields
2. **Use pagination** - Avoid fetching all records at once
3. **Request only needed fields** - GraphQL allows precise field selection
4. **Handle errors gracefully** - Check for `errors` array in response
5. **Use variables** - Don't interpolate values into query strings
6. **Cache responses** - Apollo Client provides automatic caching

## Future Enhancements

- [ ] Subscriptions for real-time updates
- [ ] DataLoader for batch loading
- [ ] Field-level permissions
- [ ] Query complexity analysis
- [ ] Rate limiting per query
- [ ] GraphQL Code Generator for frontend types
- [ ] Additional entity types (medications, appointments)

## Related Documentation

- [Permission System](../../shared/permissions/README.md)
- [Contact Service](../../services/contact/)
- [Implementation Plan](../../../../IMPLEMENTATION_PLAN.md)
- [TwentyHQ GraphQL Patterns](https://github.com/twentyhq/twenty)

## Support

For issues or questions:
1. Check Swagger docs at `/docs`
2. Review error codes in `shared/errors/`
3. Check permission matrix in `shared/permissions/`

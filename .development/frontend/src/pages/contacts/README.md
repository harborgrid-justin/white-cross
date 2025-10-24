# Contact Management UI Components

## Overview

This directory contains the contact management UI components that integrate with the GraphQL API via Apollo Client.

## Components

### ContactsDashboard
**File:** `components/ContactsDashboard.tsx`

Displays high-level statistics about contacts in the system:
- Total contacts count
- Breakdown by contact type (Guardian, Staff, Vendor, Provider, Other)
- Visual cards with gradient backgrounds
- Real-time data via GraphQL query

**GraphQL Query:** `GET_CONTACT_STATS`

**Features:**
- Automatic data fetching with `useQuery` hook
- Loading states with spinner
- Error handling with user-friendly messages
- Visual dashboard with color-coded cards

---

### ContactsList
**File:** `components/ContactsList.tsx`

Main interface for viewing and managing contacts:
- Paginated list of contacts
- Filtering by status (active/inactive/all)
- Filtering by contact type
- Contact information display
- Refresh functionality
- Create contact button

**GraphQL Query:** `GET_CONTACTS`

**Features:**
- Client-side filtering with automatic refetching
- Pagination controls (previous/next)
- Color-coded type badges
- Empty state handling
- Contact cards with:
  - Name and organization
  - Email and phone
  - Active/inactive status
  - Type badge

**Variables:**
- `page`: Current page number
- `limit`: Items per page (20)
- `orderBy`: Sort field ('lastName')
- `orderDirection`: Sort direction ('ASC')
- `filters`: ContactFilterInput object

---

### CreateContactDialog
**File:** `components/CreateContactDialog.tsx`

Modal dialog for creating new contacts:
- Comprehensive form with validation
- Integration with Apollo Client mutations
- Automatic cache updates

**GraphQL Mutation:** `CREATE_CONTACT`

**Form Fields:**
- **Basic Info:**
  - First Name (required)
  - Last Name (required)
  - Contact Type (required)
  
- **Contact Info:**
  - Email
  - Phone
  
- **Organization:**
  - Organization name
  - Title
  
- **Address:**
  - Street address
  - City
  - State (2-letter)
  - ZIP code
  
- **Notes:**
  - Free-form text

**Features:**
- Form validation
- Success/error toast notifications
- Automatic query refetching after creation
- Loading state during mutation
- Modal overlay with backdrop

---

## GraphQL Integration

### Queries
All queries are defined in `src/services/graphql/contacts.ts`:

1. **GET_CONTACTS** - Paginated list with filtering
2. **GET_CONTACT** - Single contact by ID
3. **GET_CONTACTS_BY_RELATION** - Contacts related to an entity
4. **SEARCH_CONTACTS** - Search by query
5. **GET_CONTACT_STATS** - Statistics dashboard data

### Mutations
1. **CREATE_CONTACT** - Create new contact
2. **UPDATE_CONTACT** - Update existing contact
3. **DELETE_CONTACT** - Delete contact
4. **DEACTIVATE_CONTACT** - Deactivate contact
5. **REACTIVATE_CONTACT** - Reactivate contact

### Type Safety
All operations have corresponding TypeScript interfaces:
- `Contact` - Contact entity
- `ContactInput` - Create input
- `ContactUpdateInput` - Update input
- `ContactFilterInput` - Filter options
- `ContactListResponse` - Paginated response
- `ContactStats` - Statistics

---

## Routes

Routes are defined in `routes.tsx`:

- `/contacts` - ContactsDashboard (overview/statistics)
- `/contacts/list` - ContactsList (main listing)
- `/contacts/details/:id` - Contact details (placeholder)
- `/contacts/statistics` - Statistics (same as dashboard)
- `/contacts/verification` - Verification (placeholder)
- `/contacts/notifications` - Notifications (placeholder)

All routes are protected and require ADMIN or STAFF role.

---

## Usage Example

### Viewing Contacts
```typescript
import ContactsList from './components/ContactsList';

// In your page component
<ContactsList />
```

### Viewing Statistics
```typescript
import ContactsDashboard from './components/ContactsDashboard';

// In your page component
<ContactsDashboard />
```

### Creating a Contact
The ContactsList component already includes the CreateContactDialog. Click the "Create Contact" button to open the dialog.

---

## Redux Store Integration

While the UI primarily uses Apollo Client for data fetching, there's still a Redux slice available at `store/contactsSlice.ts` that provides:
- REST API integration via `emergencyContactsApi`
- Additional actions and selectors for emergency contacts
- Compatibility with older parts of the application

---

## Styling

Components use Tailwind CSS for styling:
- Responsive design with grid layouts
- Color-coded badges for contact types
- Gradient backgrounds for statistics cards
- Consistent spacing and typography
- Loading spinners and empty states

---

## Future Enhancements

Potential improvements:
1. Contact details page with full information
2. Edit contact functionality
3. Delete/deactivate confirmations
4. Bulk operations
5. Advanced search with multiple criteria
6. Contact relationships visualization
7. Import/export functionality
8. Contact activity history
9. Document attachments
10. Communication history

---

## Testing

To test these components:

1. Start the backend server (GraphQL endpoint at `/graphql`)
2. Start the frontend dev server
3. Navigate to `/contacts` or `/contacts/list`
4. Test operations:
   - View statistics
   - List contacts
   - Filter by type/status
   - Create new contact
   - Paginate through results

---

## Dependencies

- `@apollo/client` - GraphQL client
- `react` - UI framework
- `react-hot-toast` - Toast notifications
- `lucide-react` - Icon library (optional)
- TypeScript for type safety

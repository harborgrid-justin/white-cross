# Redux Slices Directory

## Overview

This directory contains **global/shared** Redux slices that are used across multiple features or represent core application state. Feature-specific slices should be located in their respective page directories (`/pages/[feature]/store`).

## Slices in This Directory

### Core Application Slices

#### `authSlice.ts`
Authentication and user session state.

**State:**
- `user`: Current authenticated user
- `isAuthenticated`: Authentication status
- `isLoading`: Loading state
- `error`: Error messages

**Actions:**
- `loginUser(credentials)` - Authenticate user
- `registerUser(userData)` - Register new user
- `logoutUser()` - Log out user
- `refreshUser()` - Refresh user session
- `clearError()` - Clear error state
- `setUser(user)` - Set user directly

**Selectors:**
- Use via hooks: `useCurrentUser()`, `useIsAuthenticated()`

---

#### `usersSlice.ts`
User management for administrators.

**State:**
- `users`: List of all users
- `selectedUser`: Currently selected user
- `loading`: Loading states
- `error`: Error messages

**Actions:**
- `fetchUsers()` - Fetch all users
- `fetchUserById(id)` - Fetch single user
- `createUser(data)` - Create new user
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Delete user

**Selectors:**
- `selectUsersByRole(role)` - Filter by role
- `selectActiveUsers()` - Active users only
- `selectUsersBySchool(schoolId)` - Filter by school
- `selectUsersByDistrict(districtId)` - Filter by district

---

#### `districtsSlice.ts`
District management.

**State:**
- `districts`: List of districts
- `selectedDistrict`: Currently selected district
- `loading`: Loading state
- `error`: Error messages

**Actions:**
- `fetchDistricts()` - Fetch all districts
- `fetchDistrictById(id)` - Fetch single district
- `createDistrict(data)` - Create new district
- `updateDistrict(id, data)` - Update district
- `deleteDistrict(id)` - Delete district

**Selectors:**
- `selectActiveDistricts()` - Active districts only

---

#### `schoolsSlice.ts`
School management.

**State:**
- `schools`: List of schools
- `selectedSchool`: Currently selected school
- `loading`: Loading state
- `error`: Error messages

**Actions:**
- `fetchSchools()` - Fetch all schools
- `fetchSchoolById(id)` - Fetch single school
- `createSchool(data)` - Create new school
- `updateSchool(id, data)` - Update school
- `deleteSchool(id)` - Delete school

**Selectors:**
- `selectSchoolsByDistrict(districtId)` - Filter by district
- `selectActiveSchools()` - Active schools only

---

#### `settingsSlice.ts`
System settings and configuration.

**State:**
- `settings`: System settings object
- `loading`: Loading state
- `error`: Error messages

**Actions:**
- `fetchSettings()` - Fetch settings
- `updateSettings(settings)` - Update settings
- `resetSettings()` - Reset to defaults

---

#### `documentsSlice.ts`
Document management.

**State:**
- `documents`: List of documents
- `selectedDocument`: Currently selected document
- `loading`: Loading states
- `error`: Error messages

**Actions:**
- `fetchDocuments(filters)` - Fetch documents
- `fetchDocumentById(id)` - Fetch single document
- `uploadDocument(data)` - Upload new document
- `updateDocument(id, data)` - Update document
- `deleteDocument(id)` - Delete document
- `downloadDocument(id)` - Download document

**Selectors:**
- `selectDocumentsByStudent(studentId)` - Filter by student
- `selectDocumentsByType(type)` - Filter by type

---

#### `communicationSlice.ts`
Communication and messaging features.

**State:**
- `messages`: List of messages
- `templates`: Message templates
- `loading`: Loading states
- `error`: Error messages

**Actions:**
- `fetchMessages(filters)` - Fetch messages
- `sendMessage(data)` - Send new message
- `fetchTemplates()` - Fetch message templates
- `createTemplate(data)` - Create template

**Selectors:**
- `selectSentMessages()` - Sent messages
- `selectMessagesByType(type)` - Filter by type

---

#### `inventorySlice.ts`
Inventory and supply management.

**State:**
- `items`: List of inventory items
- `categories`: Item categories
- `transactions`: Transaction history
- `loading`: Loading states
- `error`: Error messages

**Actions:**
- `fetchItems(filters)` - Fetch inventory items
- `createItem(data)` - Add new item
- `updateItem(id, data)` - Update item
- `recordTransaction(data)` - Record transaction

**Selectors:**
- `selectLowStockItems()` - Items below threshold
- `selectExpiringItems(days)` - Items expiring soon

---

#### `reportsSlice.ts`
Reporting and analytics features.

**State:**
- `reports`: Available reports
- `generatedReports`: Generated report data
- `loading`: Loading states
- `error`: Error messages

**Actions:**
- `fetchReports()` - Fetch available reports
- `generateReport(params)` - Generate report
- `scheduleReport(params)` - Schedule report
- `downloadReport(id)` - Download report

**Selectors:**
- `selectReportsByType(type)` - Filter by type
- `selectRecentReports()` - Recent reports

---

## Feature-Specific Slices

Feature-specific slices are located in their respective page directories:

### `/pages/students/store/`
- `studentsSlice.ts` - Student management
- `healthRecordsSlice.ts` - Student health records
- `emergencyContactsSlice.ts` - Emergency contacts

### `/pages/appointments/store/`
- `appointmentsSlice.ts` - Appointment scheduling

### `/pages/medications/store/`
- `medicationsSlice.ts` - Medication management

### `/pages/incidents/store/`
- `incidentReportsSlice.ts` - Incident reporting

### `/pages/dashboard/store/`
- `dashboardSlice.ts` - Dashboard statistics and data

### `/pages/inventory/store/`
- `inventorySlice.ts` - Inventory management (domain-specific)

### `/pages/budget/store/`
- `budgetSlice.ts` - Budget management

### `/pages/vendors/store/`
- `vendorSlice.ts` - Vendor management

### `/pages/purchase-order/store/`
- `purchaseOrderSlice.ts` - Purchase order management

## Creating a New Slice

### 1. Determine Location

**Use `/stores/slices/` if:**
- State is used by multiple unrelated features
- It's core application state (auth, settings, etc.)
- It's a cross-cutting concern

**Use `/pages/[feature]/store/` if:**
- State is specific to one feature/domain
- It's tightly coupled to page components
- It represents a business domain

### 2. Slice Template

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/stores';
import { featureApi } from '@/services';

// ============================================================================
// TYPES
// ============================================================================

interface Item {
  id: string;
  name: string;
  // ... other fields
}

interface FeatureState {
  items: Item[];
  selectedItem: Item | null;
  loading: {
    list: boolean;
    detail: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
  };
  error: {
    list: string | null;
    detail: string | null;
    creating: string | null;
    updating: string | null;
    deleting: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: {
    search: string;
    // ... other filters
  };
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: FeatureState = {
  items: [],
  selectedItem: null,
  loading: {
    list: false,
    detail: false,
    creating: false,
    updating: false,
    deleting: false,
  },
  error: {
    list: null,
    detail: null,
    creating: null,
    updating: null,
    deleting: null,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  filters: {
    search: '',
  },
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

export const fetchItems = createAsyncThunk(
  'feature/fetchItems',
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await featureApi.getItems(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch items');
    }
  }
);

export const fetchItemById = createAsyncThunk(
  'feature/fetchItemById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await featureApi.getItemById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch item');
    }
  }
);

export const createItem = createAsyncThunk(
  'feature/createItem',
  async (data: Partial<Item>, { rejectWithValue }) => {
    try {
      const response = await featureApi.createItem(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create item');
    }
  }
);

export const updateItem = createAsyncThunk(
  'feature/updateItem',
  async ({ id, data }: { id: string; data: Partial<Item> }, { rejectWithValue }) => {
    try {
      const response = await featureApi.updateItem(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update item');
    }
  }
);

export const deleteItem = createAsyncThunk(
  'feature/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await featureApi.deleteItem(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete item');
    }
  }
);

// ============================================================================
// SLICE
// ============================================================================

const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FeatureState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedItem: (state, action: PayloadAction<Item | null>) => {
      state.selectedItem = action.payload;
    },
    clearErrors: (state) => {
      state.error = initialState.error;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch items
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading.list = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload as string;
      });

    // Fetch item by ID
    builder
      .addCase(fetchItemById.pending, (state) => {
        state.loading.detail = true;
        state.error.detail = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.loading.detail = false;
        state.error.detail = action.payload as string;
      });

    // Create item
    builder
      .addCase(createItem.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.items.unshift(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload as string;
      });

    // Update item
    builder
      .addCase(updateItem.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedItem?.id === action.payload.id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.payload as string;
      });

    // Delete item
    builder
      .addCase(deleteItem.pending, (state) => {
        state.loading.deleting = true;
        state.error.deleting = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.selectedItem?.id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error.deleting = action.payload as string;
      });
  },
});

// ============================================================================
// SELECTORS
// ============================================================================

export const selectItems = (state: RootState) => state.feature.items;
export const selectSelectedItem = (state: RootState) => state.feature.selectedItem;
export const selectLoading = (state: RootState) => state.feature.loading;
export const selectError = (state: RootState) => state.feature.error;
export const selectPagination = (state: RootState) => state.feature.pagination;
export const selectFilters = (state: RootState) => state.feature.filters;

// Memoized selectors
export const selectActiveItems = (state: RootState) =>
  state.feature.items.filter(item => item.isActive);

export const selectItemById = (state: RootState, id: string) =>
  state.feature.items.find(item => item.id === id);

// ============================================================================
// EXPORTS
// ============================================================================

export const { setFilters, setSelectedItem, clearErrors, resetState } = 
  featureSlice.actions;

export const featureReducer = featureSlice.reducer;
export default featureSlice.reducer;
```

### 3. Register in Store

Add to `stores/reduxStore.ts`:

```typescript
import featureReducer from './slices/featureSlice';

const rootReducer = combineReducers({
  // ... existing reducers
  feature: featureReducer,
});
```

### 4. Export from Index

Add to `stores/index.ts`:

```typescript
export {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  setFilters,
  clearErrors,
  selectItems,
  selectActiveItems,
} from './slices/featureSlice';
```

## Best Practices

1. **Loading States**: Always track loading for each operation separately
2. **Error Handling**: Provide specific error messages for each operation
3. **Selectors**: Create reusable selectors for common queries
4. **Async Thunks**: Use for all API calls
5. **Normalization**: Consider normalizing deeply nested data
6. **HIPAA Compliance**: Never persist PHI in state sync
7. **Type Safety**: Always type state, actions, and thunks
8. **Documentation**: Document complex logic and business rules

## Testing Slices

```typescript
import { configureStore } from '@reduxjs/toolkit';
import featureReducer, { fetchItems } from './featureSlice';

describe('Feature Slice', () => {
  let store: ReturnType<typeof createTestStore>;
  
  const createTestStore = () =>
    configureStore({ reducer: { feature: featureReducer } });
  
  beforeEach(() => {
    store = createTestStore();
  });
  
  it('should handle fetchItems.pending', () => {
    store.dispatch(fetchItems.pending('', {}));
    expect(store.getState().feature.loading.list).toBe(true);
  });
  
  it('should handle fetchItems.fulfilled', () => {
    const mockData = { items: [], pagination: { page: 1, limit: 20, total: 0 } };
    store.dispatch(fetchItems.fulfilled(mockData, '', {}));
    expect(store.getState().feature.loading.list).toBe(false);
    expect(store.getState().feature.items).toEqual([]);
  });
});
```

## Support

For questions about slices:
1. Review this documentation
2. Check existing slice implementations
3. Review Redux Toolkit documentation
4. Contact the frontend architecture team

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { vendorApi } from '../../../services';
import {
  Vendor,
  VendorFilters,
  CreateVendorData,
  UpdateVendorData,
  VendorsResponse,
  VendorDetailResponse,
  VendorPerformanceMetrics,
  VendorComparison,
  VendorStatistics,
  VendorMetrics,
  BulkVendorRatingUpdate,
  BulkVendorRatingResult,
} from '../../../types/vendors';

// =====================
// SERVICE ADAPTER CLASS
// =====================

export class VendorApiService {
  // Core vendor operations
  async getVendors(filters: VendorFilters = {}): Promise<VendorsResponse> {
    return vendorApi.getVendors(filters);
  }

  async getVendorById(id: string): Promise<VendorDetailResponse> {
    return vendorApi.getVendorById(id);
  }

  async createVendor(vendorData: CreateVendorData): Promise<Vendor> {
    return vendorApi.createVendor(vendorData);
  }

  async updateVendor(id: string, vendorData: UpdateVendorData): Promise<Vendor> {
    return vendorApi.updateVendor(id, vendorData);
  }

  async deleteVendor(id: string): Promise<Vendor> {
    return vendorApi.deleteVendor(id);
  }

  async reactivateVendor(id: string): Promise<Vendor> {
    return vendorApi.reactivateVendor(id);
  }

  // Search and comparison operations
  async searchVendors(query: string, limit: number = 20, activeOnly: boolean = true): Promise<Vendor[]> {
    return vendorApi.searchVendors(query, limit, activeOnly);
  }

  async compareVendors(itemName: string): Promise<VendorComparison[]> {
    return vendorApi.compareVendors(itemName);
  }

  async getVendorsByPaymentTerms(paymentTerms: string): Promise<Vendor[]> {
    return vendorApi.getVendorsByPaymentTerms(paymentTerms);
  }

  // Performance and analytics operations
  async getTopVendors(limit: number = 10): Promise<VendorMetrics[]> {
    return vendorApi.getTopVendors(limit);
  }

  async getVendorStatistics(): Promise<VendorStatistics> {
    return vendorApi.getVendorStatistics();
  }

  async getVendorMetrics(vendorId: string): Promise<VendorPerformanceMetrics> {
    return vendorApi.getVendorMetrics(vendorId);
  }

  // Rating operations
  async updateVendorRating(vendorId: string, rating: number): Promise<Vendor> {
    return vendorApi.updateVendorRating(vendorId, rating);
  }

  async bulkUpdateRatings(updates: BulkVendorRatingUpdate[]): Promise<BulkVendorRatingResult> {
    return vendorApi.bulkUpdateRatings(updates);
  }

  // Administrative operations
  async permanentlyDeleteVendor(id: string): Promise<{ success: boolean }> {
    return vendorApi.permanentlyDeleteVendor(id);
  }
}

// Create service instance
const vendorService = new VendorApiService();

// =====================
// ASYNC THUNKS
// =====================

export const fetchVendors = createAsyncThunk(
  'vendor/fetchVendors',
  async (filters: VendorFilters = {}) => {
    return await vendorService.getVendors(filters);
  }
);

export const fetchVendorById = createAsyncThunk(
  'vendor/fetchVendorById',
  async (id: string) => {
    return await vendorService.getVendorById(id);
  }
);

export const createVendor = createAsyncThunk(
  'vendor/createVendor',
  async (vendorData: CreateVendorData) => {
    return await vendorService.createVendor(vendorData);
  }
);

export const updateVendor = createAsyncThunk(
  'vendor/updateVendor',
  async ({ id, vendorData }: { id: string; vendorData: UpdateVendorData }) => {
    return await vendorService.updateVendor(id, vendorData);
  }
);

export const deleteVendor = createAsyncThunk(
  'vendor/deleteVendor',
  async (id: string) => {
    return await vendorService.deleteVendor(id);
  }
);

export const reactivateVendor = createAsyncThunk(
  'vendor/reactivateVendor',
  async (id: string) => {
    return await vendorService.reactivateVendor(id);
  }
);

export const searchVendors = createAsyncThunk(
  'vendor/searchVendors',
  async ({ query, limit, activeOnly }: { query: string; limit?: number; activeOnly?: boolean }) => {
    return await vendorService.searchVendors(query, limit, activeOnly);
  }
);

export const compareVendors = createAsyncThunk(
  'vendor/compareVendors',
  async (itemName: string) => {
    return await vendorService.compareVendors(itemName);
  }
);

export const fetchTopVendors = createAsyncThunk(
  'vendor/fetchTopVendors',
  async (limit: number = 10) => {
    return await vendorService.getTopVendors(limit);
  }
);

export const fetchVendorStatistics = createAsyncThunk(
  'vendor/fetchVendorStatistics',
  async () => {
    return await vendorService.getVendorStatistics();
  }
);

export const fetchVendorMetrics = createAsyncThunk(
  'vendor/fetchVendorMetrics',
  async (vendorId: string) => {
    return await vendorService.getVendorMetrics(vendorId);
  }
);

export const updateVendorRating = createAsyncThunk(
  'vendor/updateVendorRating',
  async ({ vendorId, rating }: { vendorId: string; rating: number }) => {
    return await vendorService.updateVendorRating(vendorId, rating);
  }
);

export const bulkUpdateRatings = createAsyncThunk(
  'vendor/bulkUpdateRatings',
  async (updates: BulkVendorRatingUpdate[]) => {
    return await vendorService.bulkUpdateRatings(updates);
  }
);

export const fetchVendorsByPaymentTerms = createAsyncThunk(
  'vendor/fetchVendorsByPaymentTerms',
  async (paymentTerms: string) => {
    return await vendorService.getVendorsByPaymentTerms(paymentTerms);
  }
);

export const permanentlyDeleteVendor = createAsyncThunk(
  'vendor/permanentlyDeleteVendor',
  async (id: string) => {
    return await vendorService.permanentlyDeleteVendor(id);
  }
);

// =====================
// INITIAL STATE
// =====================

interface VendorState {
  // Core data
  vendors: Vendor[];
  currentVendor: VendorDetailResponse | null;
  searchResults: Vendor[];
  topVendors: VendorMetrics[];
  vendorComparisons: VendorComparison[];
  vendorsByPaymentTerms: Vendor[];

  // Performance and analytics
  statistics: VendorStatistics | null;
  currentVendorMetrics: VendorPerformanceMetrics | null;

  // UI state
  selectedVendors: string[];
  filters: VendorFilters;
  
  // Pagination
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };

  // Loading states
  loading: {
    vendors: boolean;
    currentVendor: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    searching: boolean;
    comparing: boolean;
    statistics: boolean;
    metrics: boolean;
    rating: boolean;
    bulkRating: boolean;
  };

  // Error states
  error: {
    vendors: string | null;
    currentVendor: string | null;
    creating: string | null;
    updating: string | null;
    deleting: string | null;
    searching: string | null;
    comparing: string | null;
    statistics: string | null;
    metrics: string | null;
    rating: string | null;
    bulkRating: string | null;
  };
}

const initialState: VendorState = {
  vendors: [],
  currentVendor: null,
  searchResults: [],
  topVendors: [],
  vendorComparisons: [],
  vendorsByPaymentTerms: [],
  statistics: null,
  currentVendorMetrics: null,
  selectedVendors: [],
  filters: {},
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
  loading: {
    vendors: false,
    currentVendor: false,
    creating: false,
    updating: false,
    deleting: false,
    searching: false,
    comparing: false,
    statistics: false,
    metrics: false,
    rating: false,
    bulkRating: false,
  },
  error: {
    vendors: null,
    currentVendor: null,
    creating: null,
    updating: null,
    deleting: null,
    searching: null,
    comparing: null,
    statistics: null,
    metrics: null,
    rating: null,
    bulkRating: null,
  },
};

// =====================
// SLICE
// =====================

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<VendorFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedVendors: (state, action: PayloadAction<string[]>) => {
      state.selectedVendors = action.payload;
    },
    toggleVendorSelection: (state, action: PayloadAction<string>) => {
      const vendorId = action.payload;
      if (state.selectedVendors.includes(vendorId)) {
        state.selectedVendors = state.selectedVendors.filter(id => id !== vendorId);
      } else {
        state.selectedVendors.push(vendorId);
      }
    },
    clearSelectedVendors: (state) => {
      state.selectedVendors = [];
    },
    clearCurrentVendor: (state) => {
      state.currentVendor = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearVendorComparisons: (state) => {
      state.vendorComparisons = [];
    },
    clearErrors: (state) => {
      Object.keys(state.error).forEach(key => {
        state.error[key as keyof typeof state.error] = null;
      });
    },
  },
  extraReducers: (builder) => {
    // Fetch vendors
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.loading.vendors = true;
        state.error.vendors = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading.vendors = false;
        state.vendors = action.payload.vendors;
        state.pagination = {
          currentPage: action.payload.pagination.page,
          totalPages: action.payload.pagination.pages,
          totalItems: action.payload.pagination.total,
          itemsPerPage: action.payload.pagination.limit,
        };
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading.vendors = false;
        state.error.vendors = action.error.message || 'Failed to fetch vendors';
      });

    // Fetch vendor by ID
    builder
      .addCase(fetchVendorById.pending, (state) => {
        state.loading.currentVendor = true;
        state.error.currentVendor = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.loading.currentVendor = false;
        state.currentVendor = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading.currentVendor = false;
        state.error.currentVendor = action.error.message || 'Failed to fetch vendor';
      });

    // Create vendor
    builder
      .addCase(createVendor.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.vendors.unshift(action.payload);
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.error.message || 'Failed to create vendor';
      });

    // Update vendor
    builder
      .addCase(updateVendor.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.vendors.findIndex(vendor => vendor.id === action.payload.id);
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
        if (state.currentVendor && state.currentVendor.vendor.id === action.payload.id) {
          state.currentVendor.vendor = action.payload;
        }
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.error.message || 'Failed to update vendor';
      });

    // Delete vendor
    builder
      .addCase(deleteVendor.pending, (state) => {
        state.loading.deleting = true;
        state.error.deleting = null;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.loading.deleting = false;
        const index = state.vendors.findIndex(vendor => vendor.id === action.payload.id);
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error.deleting = action.error.message || 'Failed to delete vendor';
      });

    // Search vendors
    builder
      .addCase(searchVendors.pending, (state) => {
        state.loading.searching = true;
        state.error.searching = null;
      })
      .addCase(searchVendors.fulfilled, (state, action) => {
        state.loading.searching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchVendors.rejected, (state, action) => {
        state.loading.searching = false;
        state.error.searching = action.error.message || 'Failed to search vendors';
      });

    // Compare vendors
    builder
      .addCase(compareVendors.pending, (state) => {
        state.loading.comparing = true;
        state.error.comparing = null;
      })
      .addCase(compareVendors.fulfilled, (state, action) => {
        state.loading.comparing = false;
        state.vendorComparisons = action.payload;
      })
      .addCase(compareVendors.rejected, (state, action) => {
        state.loading.comparing = false;
        state.error.comparing = action.error.message || 'Failed to compare vendors';
      });

    // Fetch statistics
    builder
      .addCase(fetchVendorStatistics.pending, (state) => {
        state.loading.statistics = true;
        state.error.statistics = null;
      })
      .addCase(fetchVendorStatistics.fulfilled, (state, action) => {
        state.loading.statistics = false;
        state.statistics = action.payload;
      })
      .addCase(fetchVendorStatistics.rejected, (state, action) => {
        state.loading.statistics = false;
        state.error.statistics = action.error.message || 'Failed to fetch statistics';
      });

    // Fetch top vendors
    builder
      .addCase(fetchTopVendors.fulfilled, (state, action) => {
        state.topVendors = action.payload;
      });

    // Fetch vendor metrics
    builder
      .addCase(fetchVendorMetrics.pending, (state) => {
        state.loading.metrics = true;
        state.error.metrics = null;
      })
      .addCase(fetchVendorMetrics.fulfilled, (state, action) => {
        state.loading.metrics = false;
        state.currentVendorMetrics = action.payload;
      })
      .addCase(fetchVendorMetrics.rejected, (state, action) => {
        state.loading.metrics = false;
        state.error.metrics = action.error.message || 'Failed to fetch metrics';
      });

    // Update vendor rating
    builder
      .addCase(updateVendorRating.pending, (state) => {
        state.loading.rating = true;
        state.error.rating = null;
      })
      .addCase(updateVendorRating.fulfilled, (state, action) => {
        state.loading.rating = false;
        const index = state.vendors.findIndex(vendor => vendor.id === action.payload.id);
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
        if (state.currentVendor && state.currentVendor.vendor.id === action.payload.id) {
          state.currentVendor.vendor = action.payload;
        }
      })
      .addCase(updateVendorRating.rejected, (state, action) => {
        state.loading.rating = false;
        state.error.rating = action.error.message || 'Failed to update rating';
      });

    // Bulk update ratings
    builder
      .addCase(bulkUpdateRatings.pending, (state) => {
        state.loading.bulkRating = true;
        state.error.bulkRating = null;
      })
      .addCase(bulkUpdateRatings.fulfilled, (state, action) => {
        state.loading.bulkRating = false;
        // Note: BulkVendorRatingResult only returns counts and errors
        // Individual vendor updates would need to be refetched if needed
      })
      .addCase(bulkUpdateRatings.rejected, (state, action) => {
        state.loading.bulkRating = false;
        state.error.bulkRating = action.error.message || 'Failed to bulk update ratings';
      });

    // Fetch vendors by payment terms
    builder
      .addCase(fetchVendorsByPaymentTerms.fulfilled, (state, action) => {
        state.vendorsByPaymentTerms = action.payload;
      });
  },
});

// =====================
// ACTIONS & SELECTORS
// =====================

export const {
  setFilters,
  clearFilters,
  setSelectedVendors,
  toggleVendorSelection,
  clearSelectedVendors,
  clearCurrentVendor,
  clearSearchResults,
  clearVendorComparisons,
  clearErrors,
} = vendorSlice.actions;

// Selectors
export const selectVendors = (state: { vendor: VendorState }) => state.vendor.vendors;
export const selectCurrentVendor = (state: { vendor: VendorState }) => state.vendor.currentVendor;
export const selectSearchResults = (state: { vendor: VendorState }) => state.vendor.searchResults;
export const selectTopVendors = (state: { vendor: VendorState }) => state.vendor.topVendors;
export const selectVendorComparisons = (state: { vendor: VendorState }) => state.vendor.vendorComparisons;
export const selectVendorStatistics = (state: { vendor: VendorState }) => state.vendor.statistics;
export const selectVendorMetrics = (state: { vendor: VendorState }) => state.vendor.currentVendorMetrics;
export const selectSelectedVendors = (state: { vendor: VendorState }) => state.vendor.selectedVendors;
export const selectVendorFilters = (state: { vendor: VendorState }) => state.vendor.filters;
export const selectVendorPagination = (state: { vendor: VendorState }) => state.vendor.pagination;
export const selectVendorLoading = (state: { vendor: VendorState }) => state.vendor.loading;
export const selectVendorErrors = (state: { vendor: VendorState }) => state.vendor.error;

// Advanced selectors
export const selectActiveVendors = (state: { vendor: VendorState }) =>
  state.vendor.vendors.filter(vendor => vendor.isActive);

export const selectVendorsByRating = (state: { vendor: VendorState }, minRating: number) =>
  state.vendor.vendors.filter(vendor => vendor.rating >= minRating);

export const selectVendorsByPaymentTermsState = (state: { vendor: VendorState }) =>
  state.vendor.vendorsByPaymentTerms;

export default vendorSlice.reducer;

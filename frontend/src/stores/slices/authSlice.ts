import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi, LoginCredentials, RegisterData } from '../../services/modules/authApi';
import { User } from '../../types';
import toast from 'react-hot-toast';
import debug from 'debug';
import { clearPersistedState } from '../reduxStore';

const log = debug('whitecross:auth-slice');

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error: any) {
      // Even if server logout fails, we still want to clear local state
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.verifyToken();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token verification failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        toast.success(`Welcome back, ${action.payload.user.firstName}!`);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        toast.success(`Welcome, ${action.payload.user.firstName}! Your account has been created.`);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        // Clear all persisted state from storage
        clearPersistedState();
        toast.success('You have been logged out successfully');
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if server logout fails, clear local state
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        // Clear all persisted state from storage
        clearPersistedState();
        toast.success('You have been logged out successfully');
      })

      // Refresh user cases
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshUser.rejected, (state) => {
        // If token verification fails, logout user
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        // Don't show toast for silent refresh failures
        log('Token verification failed during refresh');
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;

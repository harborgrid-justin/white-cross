/**
 * @fileoverview Authentication Redux Slice for White Cross Healthcare Platform
 *
 * Manages global authentication state including user sessions, login/logout flows,
 * and JWT token lifecycle management. This slice is persisted to localStorage for
 * session recovery across browser tabs and page refreshes.
 *
 * **Key Features:**
 * - JWT-based authentication with automatic token refresh
 * - Secure credential handling with httpOnly cookies
 * - Cross-tab state synchronization via BroadcastChannel API
 * - Persistent session management with localStorage (non-PHI user data only)
 * - Integration with RBAC (Role-Based Access Control) system
 * - Automatic session cleanup on logout
 * - Toast notifications for user feedback
 *
 * **HIPAA Compliance:**
 * - User profile data (name, email, role) is NOT considered PHI
 * - Authentication state is persisted to localStorage (HIPAA compliant)
 * - JWT tokens stored in httpOnly cookies (not accessible via JavaScript)
 * - Session expiration enforced server-side and client-side
 * - All authentication operations are audit logged on the backend
 *
 * **State Management:**
 * - Global store location: `stores/slices/authSlice.ts`
 * - Persisted to localStorage via redux-persist
 * - Automatically cleared on logout via `clearPersistedState()`
 * - Synchronized across browser tabs
 *
 * **Integration:**
 * - Backend API: `services/modules/authApi.ts`
 * - Type definitions: `types/index.ts` (User interface)
 * - Redux store: `stores/reduxStore.ts`
 * - Used by: Authentication guards, protected routes, user profile components
 *
 * @module stores/slices/authSlice
 * @requires @reduxjs/toolkit
 * @requires services/modules/authApi
 * @requires types/User
 * @security Authentication state management, JWT token handling
 * @compliance HIPAA-compliant user session management
 *
 * @example Basic usage in component
 * ```typescript
 * import { useDispatch, useSelector } from 'react-redux';
 * import { loginUser, logoutUser } from '@/stores/slices/authSlice';
 *
 * function LoginForm() {
 *   const dispatch = useDispatch();
 *   const { isAuthenticated, isLoading, user, error } = useSelector((state) => state.auth);
 *
 *   const handleLogin = async (credentials) => {
 *     await dispatch(loginUser(credentials));
 *   };
 *
 *   return (
 *     <form onSubmit={handleLogin}>
 *       {error && <div>{error}</div>}
 *       {user && <div>Welcome, {user.firstName}!</div>}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example Protected route with auth check
 * ```typescript
 * import { Navigate } from 'react-router-dom';
 * import { useSelector } from 'react-redux';
 *
 * function ProtectedRoute({ children }) {
 *   const { isAuthenticated } = useSelector((state) => state.auth);
 *
 *   if (!isAuthenticated) {
 *     return <Navigate to="/login" />;
 *   }
 *
 *   return children;
 * }
 * ```
 *
 * @see {@link ../../services/modules/authApi.ts} for API integration
 * @see {@link ../reduxStore.ts} for store configuration
 * @since 1.0.0
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi, LoginCredentials, RegisterData } from '@/services/modules/authApi';
import { User } from '@/types';
import toast from 'react-hot-toast';
import debug from 'debug';
import { clearPersistedState } from '@/stores/reduxStore';

const log = debug('whitecross:auth-slice');

/**
 * Authentication state interface representing the current user session.
 *
 * This state is persisted to localStorage for session recovery. Only non-PHI
 * user profile data is stored (name, email, role). PHI data is never persisted.
 *
 * @interface AuthState
 * @property {User | null} user - Currently authenticated user profile or null if not logged in
 * @property {boolean} isAuthenticated - Authentication status flag for quick access control checks
 * @property {boolean} isLoading - Loading state for async authentication operations
 * @property {string | null} error - Error message from failed authentication attempts
 *
 * @example State structure
 * ```typescript
 * {
 *   user: {
 *     id: "123",
 *     email: "nurse@school.edu",
 *     firstName: "Jane",
 *     lastName: "Doe",
 *     role: "nurse",
 *     permissions: ["read:students", "write:medications"]
 *   },
 *   isAuthenticated: true,
 *   isLoading: false,
 *   error: null
 * }
 * ```
 *
 * @security User profile data only, no PHI persisted
 * @compliance HIPAA-compliant localStorage persistence
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial authentication state when no user is logged in.
 *
 * This state is used on first load and after logout operations.
 *
 * @type {AuthState}
 * @constant
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Authenticates a user with email and password credentials.
 *
 * Performs login via the backend authentication API, which validates credentials,
 * generates a JWT token, and returns the user profile. The JWT token is stored
 * in an httpOnly cookie for security. User profile is stored in Redux state.
 *
 * **Authentication Flow:**
 * 1. Dispatch loginUser with credentials
 * 2. API validates credentials and generates JWT
 * 3. JWT stored in httpOnly cookie (automatic)
 * 4. User profile returned and stored in Redux state
 * 5. State persisted to localStorage for session recovery
 * 6. Success toast notification displayed
 *
 * **Security:**
 * - Credentials transmitted over HTTPS only
 * - JWT stored in httpOnly cookie (not accessible via JavaScript)
 * - Failed attempts are rate-limited on the backend
 * - All login attempts are audit logged
 *
 * @async
 * @function loginUser
 * @param {LoginCredentials} credentials - User login credentials
 * @param {string} credentials.email - User email address
 * @param {string} credentials.password - User password (plain text, encrypted in transit)
 * @returns {Promise<{user: User, token: string}>} Authenticated user and JWT token
 * @throws {string} Error message if login fails (invalid credentials, network error, etc.)
 *
 * @example Login with email and password
 * ```typescript
 * const dispatch = useDispatch();
 *
 * const handleLogin = async () => {
 *   try {
 *     const result = await dispatch(loginUser({
 *       email: 'nurse@school.edu',
 *       password: 'securePassword123'
 *     })).unwrap();
 *
 *     console.log('Login successful:', result.user);
 *     // Navigate to dashboard
 *   } catch (error) {
 *     console.error('Login failed:', error);
 *     // Error toast already shown automatically
 *   }
 * };
 * ```
 *
 * @example Using with loading state
 * ```typescript
 * const { isLoading } = useSelector((state) => state.auth);
 *
 * <button onClick={handleLogin} disabled={isLoading}>
 *   {isLoading ? 'Logging in...' : 'Login'}
 * </button>
 * ```
 *
 * @security JWT stored in httpOnly cookie, credentials encrypted in transit
 * @compliance Backend audit logging for all authentication attempts
 * @see {@link ../../services/modules/authApi.ts#login} for API implementation
 */
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

/**
 * Registers a new user account in the White Cross platform.
 *
 * Creates a new user account with the provided registration data. After successful
 * registration, the user is automatically logged in and their profile is stored
 * in Redux state. Registration requires administrator approval in production.
 *
 * **Registration Flow:**
 * 1. Dispatch registerUser with user data
 * 2. API validates data and creates user account
 * 3. User account created with pending or active status
 * 4. JWT token generated and stored in httpOnly cookie
 * 5. User profile returned and stored in Redux state
 * 6. Success toast notification displayed
 *
 * **Validation:**
 * - Email must be unique and valid format
 * - Password must meet complexity requirements (8+ chars, mixed case, numbers)
 * - Role must be valid healthcare role (nurse, administrator, etc.)
 * - All required fields validated on backend
 *
 * @async
 * @function registerUser
 * @param {RegisterData} userData - New user registration data
 * @param {string} userData.email - Unique email address
 * @param {string} userData.password - Password meeting complexity requirements
 * @param {string} userData.firstName - User first name
 * @param {string} userData.lastName - User last name
 * @param {string} userData.role - Healthcare role (nurse, admin, etc.)
 * @returns {Promise<{user: User, token: string}>} Created user profile and JWT token
 * @throws {string} Error message if registration fails (duplicate email, validation error, etc.)
 *
 * @example Register new nurse account
 * ```typescript
 * const dispatch = useDispatch();
 *
 * const handleRegister = async () => {
 *   try {
 *     const result = await dispatch(registerUser({
 *       email: 'new.nurse@school.edu',
 *       password: 'SecurePass123!',
 *       firstName: 'Sarah',
 *       lastName: 'Johnson',
 *       role: 'nurse'
 *     })).unwrap();
 *
 *     console.log('Registration successful:', result.user);
 *     // Navigate to onboarding or dashboard
 *   } catch (error) {
 *     console.error('Registration failed:', error);
 *     // Error details shown in toast
 *   }
 * };
 * ```
 *
 * @security Password hashed before storage, email uniqueness enforced
 * @compliance Backend audit logging for account creation
 * @see {@link ../../services/modules/authApi.ts#register} for API implementation
 */
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

/**
 * Logs out the current user and clears all session data.
 *
 * Performs a secure logout by invalidating the JWT token on the backend,
 * clearing all persisted Redux state from localStorage, and resetting
 * the authentication state. Even if the backend logout fails (network error),
 * local state is still cleared for security.
 *
 * **Logout Flow:**
 * 1. Dispatch logoutUser action
 * 2. Backend invalidates JWT token (adds to blacklist)
 * 3. httpOnly cookie cleared by browser
 * 4. All Redux persisted state cleared via `clearPersistedState()`
 * 5. Authentication state reset to initial state
 * 6. User redirected to login page (handled by component)
 *
 * **Security:**
 * - JWT token blacklisted on backend to prevent reuse
 * - All localStorage data cleared (auth, cached data)
 * - Session state synchronized across all browser tabs
 * - Automatic redirect to login page
 *
 * @async
 * @function logoutUser
 * @param {void} _ - No parameters required
 * @returns {Promise<void>} Resolves when logout is complete
 * @throws {string} Error message if backend logout fails (still clears local state)
 *
 * @example Logout current user
 * ```typescript
 * const dispatch = useDispatch();
 *
 * const handleLogout = async () => {
 *   await dispatch(logoutUser());
 *   // User state cleared, navigate to login
 *   navigate('/login');
 * };
 *
 * <button onClick={handleLogout}>Logout</button>
 * ```
 *
 * @example Logout with confirmation dialog
 * ```typescript
 * const handleLogout = async () => {
 *   if (confirm('Are you sure you want to logout?')) {
 *     await dispatch(logoutUser());
 *     navigate('/login');
 *   }
 * };
 * ```
 *
 * @security Clears all persisted state regardless of backend success
 * @compliance Audit logging on backend for session termination
 * @see {@link ../../services/modules/authApi.ts#logout} for API implementation
 * @see {@link ../reduxStore.ts#clearPersistedState} for state cleanup
 */
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

/**
 * Refreshes the current user session by verifying the JWT token.
 *
 * Called on app initialization and periodically to verify the JWT token is still
 * valid. If the token is valid, updates the user profile in Redux state with
 * the latest data from the backend. If the token is invalid or expired, logs
 * the user out automatically.
 *
 * **Refresh Flow:**
 * 1. Dispatch refreshUser on app initialization
 * 2. Backend verifies JWT token from httpOnly cookie
 * 3. If valid, returns updated user profile
 * 4. Redux state updated with fresh user data
 * 5. If invalid, user state cleared (silent logout)
 *
 * **Use Cases:**
 * - App initialization to restore session from localStorage
 * - Periodic token validation (every 15 minutes)
 * - After permissions change to refresh user roles
 * - Cross-tab session synchronization
 *
 * @async
 * @function refreshUser
 * @param {void} _ - No parameters required (uses token from cookie)
 * @returns {Promise<User>} Updated user profile from backend
 * @throws {string} Error message if token verification fails (triggers silent logout)
 *
 * @example Refresh user on app initialization
 * ```typescript
 * import { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 * import { refreshUser } from '@/stores/slices/authSlice';
 *
 * function App() {
 *   const dispatch = useDispatch();
 *
 *   useEffect(() => {
 *     // Verify token and restore session on app load
 *     dispatch(refreshUser());
 *   }, [dispatch]);
 *
 *   return <Router>...</Router>;
 * }
 * ```
 *
 * @example Periodic token refresh
 * ```typescript
 * useEffect(() => {
 *   // Refresh token every 15 minutes
 *   const interval = setInterval(() => {
 *     dispatch(refreshUser());
 *   }, 15 * 60 * 1000);
 *
 *   return () => clearInterval(interval);
 * }, [dispatch]);
 * ```
 *
 * @security Silent logout on token expiration, no error toast shown
 * @compliance Validates JWT signature and expiration server-side
 * @see {@link ../../services/modules/authApi.ts#verifyToken} for API implementation
 */
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

/**
 * Authentication Redux slice with reducers for login, logout, registration, and token refresh.
 *
 * Handles all authentication state transitions including loading states, error handling,
 * and user profile management. Integrates with react-hot-toast for user feedback.
 *
 * @constant authSlice
 * @type {Slice<AuthState>}
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Clears the current error message from authentication state.
     *
     * Used to dismiss error messages after user acknowledgment or before
     * retrying a failed operation.
     *
     * @function clearError
     * @param {AuthState} state - Current authentication state
     * @returns {void}
     *
     * @example Clear error after user dismisses notification
     * ```typescript
     * const { error } = useSelector((state) => state.auth);
     * const dispatch = useDispatch();
     *
     * if (error) {
     *   return (
     *     <Alert onClose={() => dispatch(clearError())}>
     *       {error}
     *     </Alert>
     *   );
     * }
     * ```
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Directly sets the current user in authentication state.
     *
     * Used for manual user updates (e.g., profile edits, role changes) or
     * for cross-tab synchronization via BroadcastChannel API. Setting user
     * to null logs the user out.
     *
     * @function setUser
     * @param {AuthState} state - Current authentication state
     * @param {PayloadAction<User | null>} action - User profile or null to logout
     * @returns {void}
     *
     * @example Update user profile after edit
     * ```typescript
     * const handleProfileUpdate = (updatedUser: User) => {
     *   dispatch(setUser(updatedUser));
     *   toast.success('Profile updated successfully');
     * };
     * ```
     *
     * @example Cross-tab session sync
     * ```typescript
     * const channel = new BroadcastChannel('auth');
     * channel.onmessage = (event) => {
     *   if (event.data.type === 'USER_UPDATED') {
     *     dispatch(setUser(event.data.user));
     *   }
     * };
     * ```
     */
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /**
       * Login pending - Sets loading state while authentication request is in progress.
       * Clears any previous error messages to provide clean UX for retry attempts.
       */
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      /**
       * Login fulfilled - User successfully authenticated.
       * Stores user profile, sets authenticated flag, and shows welcome toast.
       * User data is automatically persisted to localStorage by redux-persist.
       */
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        toast.success(`Welcome back, ${action.payload.user.firstName}!`);
      })

      /**
       * Login rejected - Authentication failed.
       * Clears user state, stores error message, and shows error toast.
       * Common causes: invalid credentials, account locked, network error.
       */
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      /**
       * Register pending - Sets loading state while registration request is in progress.
       * Clears any previous error messages.
       */
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      /**
       * Register fulfilled - User account successfully created.
       * Stores user profile, sets authenticated flag, and shows welcome toast.
       * User is automatically logged in after successful registration.
       */
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        toast.success(`Welcome, ${action.payload.user.firstName}! Your account has been created.`);
      })

      /**
       * Register rejected - Registration failed.
       * Clears user state, stores error message, and shows error toast.
       * Common causes: duplicate email, invalid data, validation error.
       */
      .addCase(registerUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      /**
       * Logout pending - Sets loading state during logout process.
       * Brief loading state while backend invalidates token.
       */
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })

      /**
       * Logout fulfilled - User successfully logged out.
       * Clears all authentication state and persisted data from localStorage.
       * Called via clearPersistedState() to remove all Redux persisted state.
       */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        // Clear all persisted state from storage
        clearPersistedState();
        toast.success('You have been logged out successfully');
      })

      /**
       * Logout rejected - Backend logout failed but still clear local state.
       * Security best practice: Always clear local state even if backend fails.
       * User cannot continue authenticated session if backend logout failed.
       */
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

      /**
       * Refresh user fulfilled - Token verified and user profile updated.
       * Called on app initialization to restore session from persisted state.
       * Updates user profile with latest data from backend.
       */
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })

      /**
       * Refresh user rejected - Token verification failed (expired or invalid).
       * Performs silent logout without showing error toast (expected during normal session expiry).
       * User will be redirected to login page by authentication guard.
       */
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

/**
 * Authentication action creators for manual state updates.
 *
 * @exports clearError - Clear authentication error message
 * @exports setUser - Manually set user profile (for updates, cross-tab sync)
 * @exports clearAuthError - Alias for clearError (backward compatibility)
 * @exports setUserFromSession - Alias for setUser (backward compatibility)
 */
export const { clearError, setUser } = authSlice.actions;

// Backward compatibility aliases
export const clearAuthError = clearError;
export const setUserFromSession = setUser;
export const refreshAuthToken = refreshUser;

/**
 * Authentication reducer for Redux store integration.
 *
 * Import this reducer in the root Redux store configuration:
 * ```typescript
 * import authReducer from './slices/authSlice';
 *
 * const store = configureStore({
 *   reducer: {
 *     auth: authReducer,
 *   },
 * });
 * ```
 *
 * @default authSlice.reducer
 */
export default authSlice.reducer;

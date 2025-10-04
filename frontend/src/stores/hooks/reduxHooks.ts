import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../reduxStore';
import { loginUser, registerUser, logoutUser, refreshUser, clearError, setUser } from '../slices/authSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth-specific hooks
export const useCurrentUser = () => useAppSelector((state) => state.auth.user);
export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated);
export const useAuthLoading = () => useAppSelector((state) => state.auth.isLoading);
export const useAuthError = () => useAppSelector((state) => state.auth.error);

// Auth actions hook
export const useAuthActions = () => {
  const dispatch = useAppDispatch();

  return {
    login: (credentials: { email: string; password: string }) =>
      dispatch(loginUser(credentials)),
    register: (userData: any) =>
      dispatch(registerUser(userData)),
    logout: () => dispatch(logoutUser()),
    refreshUser: () => dispatch(refreshUser()),
    clearError: () => dispatch(clearError()),
    setUser: (user: any) => dispatch(setUser(user)),
  };
};

import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface RouteState {
  from?: string;
  returnTo?: string;
  data?: Record<string, any>;
}

export const useRouteState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [routeState, setRouteState] = useState<RouteState>(location.state || {});

  const updateRouteState = useCallback((newState: Partial<RouteState>) => {
    const updatedState = { ...routeState, ...newState };
    setRouteState(updatedState);
    
    // Update the current location's state without triggering navigation
    window.history.replaceState(updatedState, '', location.pathname + location.search);
  }, [routeState, location.pathname, location.search]);

  const navigateWithState = useCallback((to: string, state?: RouteState) => {
    const navigationState = {
      ...state,
      from: location.pathname
    };
    navigate(to, { state: navigationState });
  }, [navigate, location.pathname]);

  const goBack = useCallback(() => {
    if (routeState.returnTo) {
      navigate(routeState.returnTo);
    } else if (routeState.from) {
      navigate(routeState.from);
    } else {
      navigate(-1);
    }
  }, [navigate, routeState]);

  return {
    routeState,
    updateRouteState,
    navigateWithState,
    goBack,
    canGoBack: !!(routeState.returnTo || routeState.from)
  };
};

export default useRouteState;
/**
 * React Router DOM Module Declarations
 * Temporary type declarations for react-router-dom until @types/react-router-dom is properly installed
 */

declare module 'react-router-dom' {
  import { ReactNode, FunctionComponent } from 'react';

  // Router components
  export const BrowserRouter: FunctionComponent<{ children?: ReactNode }>;
  export const HashRouter: FunctionComponent<{ children?: ReactNode }>;
  export const MemoryRouter: FunctionComponent<{ children?: ReactNode; initialEntries?: string[] }>;

  // Route components
  export const Routes: FunctionComponent<{ children?: ReactNode }>;
  export const Route: FunctionComponent<{
    path?: string;
    element?: ReactNode;
    children?: ReactNode;
    index?: boolean;
  }>;

  // Navigation components
  export const Link: FunctionComponent<{
    to: string;
    replace?: boolean;
    state?: any;
    children?: ReactNode;
    className?: string;
    style?: any;
  }>;

  export const NavLink: FunctionComponent<{
    to: string;
    end?: boolean;
    caseSensitive?: boolean;
    children?: ReactNode | ((props: { isActive: boolean }) => ReactNode);
    className?: string | ((props: { isActive: boolean }) => string);
    style?: any | ((props: { isActive: boolean }) => any);
  }>;

  export const Navigate: FunctionComponent<{
    to: string;
    replace?: boolean;
    state?: any;
  }>;

  export const Outlet: FunctionComponent<{ context?: any }>;

  // Hooks
  export function useNavigate(): (to: string, options?: { replace?: boolean; state?: any }) => void;
  export function useLocation(): { pathname: string; search: string; hash: string; state: any; key: string };
  export function useParams<T extends Record<string, string> = Record<string, string>>(): T;
  export function useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void];
  export function useMatch(pattern: string): { params: Record<string, string>; pathname: string } | null;
  export function useRoutes(routes: any[]): ReactNode;
  export function useOutletContext<T = any>(): T;
}

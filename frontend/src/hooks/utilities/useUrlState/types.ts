/**
 * URL State Type Definitions
 * @module hooks/utilities/useUrlState/types
 */

/**
 * URL state parameter type definitions
 */
export type UrlStateValue = string | number | boolean | null | undefined;
export type UrlStateObject = Record<string, UrlStateValue | UrlStateValue[]>;

/**
 * Options for URL state updates
 */
export interface UrlStateOptions {
  /** Replace current history entry instead of pushing new one */
  replace?: boolean;
  /** Scroll to top after navigation */
  scroll?: boolean;
  /** Preserve existing params not specified in update */
  preserveOtherParams?: boolean;
}

/**
 * Hook return type
 */
export interface UseUrlStateResult<T extends UrlStateObject> {
  /** Current URL state object */
  state: T;
  /** Update URL state with new values */
  setState: (updates: Partial<T>, options?: UrlStateOptions) => void;
  /** Set a single URL parameter */
  setParam: (key: keyof T, value: UrlStateValue, options?: UrlStateOptions) => void;
  /** Remove URL parameters */
  removeParams: (keys: (keyof T)[], options?: UrlStateOptions) => void;
  /** Clear all URL parameters */
  clearAll: (options?: UrlStateOptions) => void;
  /** Get current URL with state */
  getUrl: (updates?: Partial<T>) => string;
  /** Raw URLSearchParams object */
  searchParams: URLSearchParams;
}

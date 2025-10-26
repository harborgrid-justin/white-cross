/**
 * React Module Declarations
 * Temporary type declarations for React until @types/react is properly installed
 * These provide basic type safety while dependencies are being set up
 */

declare module 'react' {
  export = React;
  export as namespace React;

  namespace React {
    // Basic types
    type ReactNode = ReactElement | string | number | boolean | null | undefined;
    type ReactElement<P = any> = { type: any; props: P; key: string | number | null };
    type JSXElementConstructor<P> = ((props: P) => ReactElement | null) | (new (props: P) => Component<P>);

    // Component types
    interface FunctionComponent<P = {}> {
      (props: P): ReactElement | null;
      displayName?: string;
    }
    type FC<P = {}> = FunctionComponent<P>;

    interface ComponentClass<P = {}> {
      new (props: P): Component<P>;
    }

    class Component<P = {}, S = {}> {
      constructor(props: P);
      props: Readonly<P>;
      state: Readonly<S>;
      setState<K extends keyof S>(state: Pick<S, K> | S | null): void;
      render(): ReactNode;
    }

    // Hooks
    function useState<S>(initialState: S | (() => S)): [S, (newState: S | ((prev: S) => S)) => void];
    function useEffect(effect: () => void | (() => void), deps?: any[]): void;
    function useContext<T>(context: Context<T>): T;
    function useReducer<R extends Reducer<any, any>>(reducer: R, initialState: ReducerState<R>): [ReducerState<R>, Dispatch<ReducerAction<R>>];
    function useCallback<T extends Function>(callback: T, deps: any[]): T;
    function useMemo<T>(factory: () => T, deps: any[]): T;
    function useRef<T>(initialValue: T): { current: T };
    function useImperativeHandle<T>(ref: Ref<T>, init: () => T, deps?: any[]): void;
    function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
    function useDebugValue<T>(value: T, format?: (value: T) => any): void;

    // Context
    interface Context<T> {
      Provider: Provider<T>;
      Consumer: Consumer<T>;
      displayName?: string;
    }
    interface Provider<T> {
      (props: { value: T; children?: ReactNode }): ReactElement | null;
    }
    interface Consumer<T> {
      (props: { children: (value: T) => ReactNode }): ReactElement | null;
    }
    function createContext<T>(defaultValue: T): Context<T>;

    // Refs
    type Ref<T> = { current: T | null } | ((instance: T | null) => void) | null;
    function forwardRef<T, P = {}>(render: (props: P, ref: Ref<T>) => ReactElement | null): FunctionComponent<P>;

    // Memo
    function memo<P>(component: FunctionComponent<P>): FunctionComponent<P>;

    // Fragment
    const Fragment: FunctionComponent<{ children?: ReactNode }>;

    // Reducer
    type Reducer<S, A> = (prevState: S, action: A) => S;
    type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
    type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
    type Dispatch<A> = (value: A) => void;

    // Events
    interface SyntheticEvent<T = Element> {
      currentTarget: EventTarget & T;
      target: EventTarget;
      preventDefault(): void;
      stopPropagation(): void;
    }

    interface MouseEvent<T = Element> extends SyntheticEvent<T> {
      button: number;
      clientX: number;
      clientY: number;
    }

    interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
      target: EventTarget & T;
    }

    interface FormEvent<T = Element> extends SyntheticEvent<T> {}
    interface KeyboardEvent<T = Element> extends SyntheticEvent<T> {
      key: string;
      keyCode: number;
    }

    // HTML Attributes
    interface HTMLAttributes<T> {
      className?: string;
      id?: string;
      style?: CSSProperties;
      onClick?: (event: MouseEvent<T>) => void;
      onChange?: (event: ChangeEvent<T>) => void;
      children?: ReactNode;
    }

    interface CSSProperties {
      [key: string]: string | number | undefined;
    }

    // Children
    namespace Children {
      function map<T>(children: ReactNode, fn: (child: ReactNode) => T): T[];
      function forEach(children: ReactNode, fn: (child: ReactNode) => void): void;
      function count(children: ReactNode): number;
      function only(children: ReactNode): ReactElement;
      function toArray(children: ReactNode): ReactNode[];
    }

    // Props with children
    type PropsWithChildren<P = {}> = P & { children?: ReactNode };
  }
}

declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react/jsx-dev-runtime' {
  export * from 'react/jsx-runtime';
}

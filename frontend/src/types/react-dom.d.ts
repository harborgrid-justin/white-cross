/**
 * React DOM Module Declarations
 * Temporary type declarations for react-dom until @types/react-dom is properly installed
 */

declare module 'react-dom' {
  import { ReactElement, ReactNode } from 'react';

  export function render(element: ReactElement, container: Element | null): void;
  export function hydrate(element: ReactElement, container: Element | null): void;
  export function unmountComponentAtNode(container: Element): boolean;
  export function findDOMNode(component: any): Element | null;
  export function createPortal(children: ReactNode, container: Element): ReactElement;

  export const version: string;
}

declare module 'react-dom/client' {
  import { ReactNode } from 'react';

  export interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }

  export interface RootOptions {
    identifierPrefix?: string;
    onRecoverableError?: (error: Error) => void;
  }

  export function createRoot(container: Element | DocumentFragment, options?: RootOptions): Root;
  export function hydrateRoot(container: Element | Document, initialChildren: ReactNode, options?: RootOptions): Root;
}

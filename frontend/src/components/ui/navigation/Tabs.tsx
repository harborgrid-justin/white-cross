/**
 * WF-TABS-001 | Tabs.tsx - Accessible Tabs Component
 * Purpose: Fully accessible tab navigation with keyboard support and ARIA
 * Upstream: Design system | Dependencies: React, Tailwind CSS, cn utility
 * Downstream: Feature pages, settings, multi-section views | Called by: Application components
 * Related: TabNavigation, navigation components
 * Exports: Tabs, TabsList, TabsTrigger, TabsContent, useTabs hook
 * Key Features: Keyboard navigation, ARIA, controlled/uncontrolled modes, horizontal/vertical
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: User clicks tab → Content switches → Keyboard navigation
 * LLM Context: Tabs component for White Cross healthcare platform
 */

import React from 'react';
import { cn } from '../../../utils/cn';

/**
 * Props for the Tabs component.
 *
 * @interface TabsProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 *
 * @property {string} [value] - Controlled active tab value
 * @property {string} [defaultValue] - Initial tab value for uncontrolled mode
 * @property {(value: string) => void} [onValueChange] - Callback when active tab changes
 * @property {('horizontal' | 'vertical')} [orientation='horizontal'] - Tab list layout direction
 */
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Props for the TabsList component.
 *
 * @interface TabsListProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Props for the TabsTrigger component.
 *
 * @interface TabsTriggerProps
 * @extends {React.ButtonHTMLAttributes<HTMLButtonElement>}
 *
 * @property {string} value - Unique value identifying this tab
 * @property {boolean} [disabled=false] - Whether tab is disabled
 */
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

/**
 * Props for the TabsContent component.
 *
 * @interface TabsContentProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 *
 * @property {string} value - Tab value this content belongs to
 */
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

/**
 * Context value for Tabs component state.
 *
 * @interface TabsContextValue
 *
 * @property {string} [value] - Currently active tab value
 * @property {(value: string) => void} [onValueChange] - Function to change active tab
 * @property {('horizontal' | 'vertical')} [orientation] - Tab list orientation
 *
 * @internal
 */
interface TabsContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * React Context for sharing tabs state between components.
 *
 * @constant
 * @internal
 */
const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

/**
 * Custom hook to access Tabs context.
 *
 * Provides access to current tab value, value change handler, and orientation.
 * Must be used within a Tabs component.
 *
 * @returns {TabsContextValue} Tabs context value
 * @throws {Error} If used outside of Tabs component
 *
 * @example
 * ```tsx
 * function CustomTabComponent() {
 *   const { value, onValueChange, orientation } = useTabs();
 *   return <div>Current tab: {value}</div>;
 * }
 * ```
 *
 * @internal
 */
const useTabs = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component');
  }
  return context;
};

/**
 * Tabs container component with controlled and uncontrolled modes.
 *
 * Main container for tab navigation system. Manages active tab state and provides
 * context to child components. Supports both controlled (external state) and
 * uncontrolled (internal state) modes. Enables horizontal or vertical tab layouts.
 *
 * **Features:**
 * - Controlled and uncontrolled modes
 * - Horizontal and vertical orientations
 * - Context-based state sharing
 * - Accessibility via TabsContext
 * - Forward ref support
 *
 * **Accessibility:**
 * - Provides orientation context for ARIA attributes
 * - Manages focus and selection state
 * - Works with TabsList, TabsTrigger, TabsContent for full a11y
 *
 * @component
 * @param {TabsProps} props - Tabs component props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to container
 * @returns {JSX.Element} Rendered tabs container with context provider
 *
 * @example
 * ```tsx
 * // Uncontrolled tabs with default value
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTrigger value="overview">Overview</TabsTrigger>
 *     <TabsTrigger value="details">Details</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">Overview content</TabsContent>
 *   <TabsContent value="details">Details content</TabsContent>
 * </Tabs>
 *
 * // Controlled tabs
 * const [activeTab, setActiveTab] = useState('patients');
 * <Tabs value={activeTab} onValueChange={setActiveTab}>
 *   <TabsList>
 *     <TabsTrigger value="patients">Patients</TabsTrigger>
 *     <TabsTrigger value="appointments">Appointments</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="patients"><PatientList /></TabsContent>
 *   <TabsContent value="appointments"><AppointmentList /></TabsContent>
 * </Tabs>
 *
 * // Vertical tabs
 * <Tabs orientation="vertical" defaultValue="profile">
 *   <TabsList>
 *     <TabsTrigger value="profile">Profile</TabsTrigger>
 *     <TabsTrigger value="security">Security</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="profile"><ProfileSettings /></TabsContent>
 *   <TabsContent value="security"><SecuritySettings /></TabsContent>
 * </Tabs>
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Patient record sections (Overview, History, Medications, Vitals)
 * - Settings organization (Account, Security, Notifications)
 * - Report views (Summary, Detailed, Charts)
 *
 * @see {@link TabsList} for tab button container
 * @see {@link TabsTrigger} for individual tab buttons
 * @see {@link TabsContent} for tab panel content
 */
const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, value, defaultValue, onValueChange, orientation = 'horizontal', children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleValueChange = (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, orientation }}>
        <div
          ref={ref}
          className={cn(
            'w-full',
            orientation === 'vertical' && 'flex gap-4',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

/**
 * TabsList component for tab button container.
 *
 * Container for TabsTrigger buttons with proper ARIA role and styling.
 * Automatically adjusts layout based on horizontal/vertical orientation.
 *
 * **Features:**
 * - Horizontal or vertical layout
 * - ARIA tablist role
 * - Proper orientation attribute
 * - Background styling
 * - Spacing between tabs
 *
 * **Accessibility:**
 * - role="tablist" for screen readers
 * - aria-orientation indicates layout direction
 *
 * @component
 * @param {TabsListProps} props - Tabs list props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref
 * @returns {JSX.Element} Rendered tab list container
 *
 * @example
 * ```tsx
 * <TabsList>
 *   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *   <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 * </TabsList>
 * ```
 */
const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = useTabs();

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation || 'horizontal'}
        className={cn(
          'inline-flex items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500',
          orientation === 'vertical'
            ? 'flex-col h-fit space-y-1 w-48'
            : 'h-10 space-x-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * TabsTrigger component for individual tab buttons.
 *
 * Interactive button for selecting tabs. Handles keyboard navigation
 * (Arrow keys, Home, End), focus management, and active state styling.
 * Fully accessible with ARIA attributes.
 *
 * **Features:**
 * - Active state styling
 * - Disabled state support
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Focus management
 * - Smooth transitions
 *
 * **Accessibility:**
 * - role="tab" for screen readers
 * - aria-selected indicates active tab
 * - aria-controls links to tab panel
 * - Proper tabindex for keyboard navigation (-1 for inactive, 0 for active)
 * - Arrow key navigation wraps around
 *
 * **Keyboard Navigation:**
 * - Horizontal: Left/Right arrows, Home, End
 * - Vertical: Up/Down arrows, Home, End
 * - Arrows wrap around (last → first, first → last)
 *
 * @component
 * @param {TabsTriggerProps} props - Tab trigger props
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref
 * @returns {JSX.Element} Rendered tab button
 *
 * @example
 * ```tsx
 * <TabsTrigger value="overview">Overview</TabsTrigger>
 * <TabsTrigger value="details" disabled>Details</TabsTrigger>
 * ```
 *
 * @see {@link Tabs} for main container
 * @see {@link TabsContent} for associated content panel
 */
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, disabled, ...props }, ref) => {
    const { value: selectedValue, onValueChange, orientation } = useTabs();
    const isSelected = selectedValue === value;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const tablist = e.currentTarget.parentElement;
      if (!tablist) return;

      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]:not([disabled])')) as HTMLButtonElement[];
      const currentIndex = tabs.indexOf(e.currentTarget);

      let nextIndex = currentIndex;

      if (orientation === 'horizontal') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIndex = tabs.length - 1;
        }
      } else {
        // vertical orientation
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIndex = tabs.length - 1;
        }
      }

      if (nextIndex !== currentIndex && tabs[nextIndex]) {
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      }
    };

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isSelected ? 'true' : 'false'}
        aria-controls={`content-${value}`}
        id={`trigger-${value}`}
        data-state={isSelected ? 'active' : 'inactive'}
        disabled={disabled}
        tabIndex={isSelected ? 0 : -1}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          orientation === 'vertical' ? 'w-full justify-start' : '',
          isSelected
            ? 'bg-white text-gray-950 shadow-sm'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900',
          className
        )}
        onClick={() => !disabled && onValueChange?.(value)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </button>
    );
  }
);

/**
 * TabsContent component for tab panel content.
 *
 * Content panel associated with a tab. Only rendered when its corresponding
 * tab is active. Includes proper ARIA attributes for accessibility.
 *
 * **Features:**
 * - Conditional rendering (only shows when active)
 * - Focusable panel
 * - ARIA tabpanel role
 * - Linked to trigger via aria-labelledby
 * - Focus ring styling
 *
 * **Accessibility:**
 * - role="tabpanel" for screen readers
 * - aria-labelledby links to TabsTrigger
 * - tabIndex={0} makes panel focusable
 * - Visible focus ring
 *
 * **Behavior:**
 * Returns null (not rendered) when tab is inactive, improving performance
 * and preventing hidden content from being in the DOM.
 *
 * @component
 * @param {TabsContentProps} props - Tab content props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref
 * @returns {JSX.Element | null} Rendered tab content or null when inactive
 *
 * @example
 * ```tsx
 * <TabsContent value="overview">
 *   <PatientOverview />
 * </TabsContent>
 *
 * <TabsContent value="medications">
 *   <MedicationList />
 * </TabsContent>
 * ```
 *
 * @see {@link Tabs} for main container
 * @see {@link TabsTrigger} for associated tab button
 */
const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue } = useTabs();
    const isSelected = selectedValue === value;

    if (!isSelected) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`content-${value}`}
        aria-labelledby={`trigger-${value}`}
        className={cn(
          'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
          className
        )}
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';
TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';

export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps
};

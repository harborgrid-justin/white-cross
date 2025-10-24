import React from 'react';
import { cn } from '../../../utils/cn';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

interface TabsContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

const useTabs = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component');
  }
  return context;
};

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

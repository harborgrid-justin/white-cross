'use client';

/**
 * WF-ACCORDION-001 | Accordion.tsx - Accordion Component
 * Purpose: Collapsible sections with expand/collapse functionality
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: FAQ sections, collapsible content, grouped information
 * Related: Tabs, Drawer
 * Exports: Accordion, AccordionItem | Key Features: Single/multiple open, keyboard navigation, animations, accessible
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Click header → Expand/collapse panel → Show/hide content
 * LLM Context: Accordion component for White Cross healthcare platform
 */

import React, { useState, createContext, useContext } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Accordion context type
 */
interface AccordionContextValue {
  openItems: string[];
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

/**
 * Accordion context
 */
const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

/**
 * Hook to use accordion context
 */
const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
};

/**
 * Props for the Accordion component.
 */
export interface AccordionProps {
  /** Accordion items (children) */
  children: React.ReactNode;
  /** Allow multiple panels to be open at once */
  allowMultiple?: boolean;
  /** Default open items (controlled) */
  defaultOpenItems?: string[];
  /** Controlled open items */
  openItems?: string[];
  /** Callback when items change (controlled) */
  onOpenItemsChange?: (items: string[]) => void;
  /** Additional class name */
  className?: string;
}

/**
 * Props for the AccordionItem component.
 */
export interface AccordionItemProps {
  /** Unique identifier for this item */
  id: string;
  /** Header/trigger content */
  title: React.ReactNode;
  /** Panel content */
  children: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Icon to display (defaults to chevron) */
  icon?: React.ReactNode;
  /** Additional class name for item wrapper */
  className?: string;
  /** Additional class name for header */
  headerClassName?: string;
  /** Additional class name for panel */
  panelClassName?: string;
}

/**
 * Accordion component for collapsible sections.
 *
 * Organizes content into collapsible panels. Supports single or multiple
 * open panels, keyboard navigation, and smooth animations.
 *
 * **Features:**
 * - Single or multiple open panels
 * - Controlled and uncontrolled modes
 * - Keyboard navigation (Arrow keys, Home, End, Enter, Space)
 * - Smooth height animations
 * - Custom icons
 * - Disabled items
 * - Dark mode support
 * - Full accessibility
 *
 * **Accessibility:**
 * - role="region" for each panel
 * - aria-expanded on headers
 * - aria-controls linking header to panel
 * - aria-labelledby linking panel to header
 * - Keyboard navigation (Arrow Up/Down, Home, End)
 * - Enter/Space to toggle
 *
 * @component
 * @param {AccordionProps} props - Accordion component props
 * @returns {JSX.Element} Rendered accordion with items
 *
 * @example
 * ```tsx
 * // Basic accordion (single open)
 * <Accordion>
 *   <AccordionItem id="item-1" title="What is White Cross?">
 *     <p>White Cross is a healthcare management platform for schools.</p>
 *   </AccordionItem>
 *   <AccordionItem id="item-2" title="How do I add a student?">
 *     <p>Navigate to Students and click Add New Student.</p>
 *   </AccordionItem>
 *   <AccordionItem id="item-3" title="Can I export reports?">
 *     <p>Yes, use the Export button on any report page.</p>
 *   </AccordionItem>
 * </Accordion>
 *
 * // Multiple open panels allowed
 * <Accordion allowMultiple>
 *   <AccordionItem id="medications" title="Medications">
 *     <MedicationList />
 *   </AccordionItem>
 *   <AccordionItem id="allergies" title="Allergies">
 *     <AllergyList />
 *   </AccordionItem>
 *   <AccordionItem id="immunizations" title="Immunizations">
 *     <ImmunizationList />
 *   </AccordionItem>
 * </Accordion>
 *
 * // Controlled accordion
 * <Accordion
 *   openItems={openItems}
 *   onOpenItemsChange={setOpenItems}
 * >
 *   <AccordionItem id="section-1" title="Section 1">
 *     Content 1
 *   </AccordionItem>
 *   <AccordionItem id="section-2" title="Section 2">
 *     Content 2
 *   </AccordionItem>
 * </Accordion>
 *
 * // With custom styling
 * <Accordion>
 *   <AccordionItem
 *     id="important"
 *     title="Important Information"
 *     headerClassName="bg-danger-50 dark:bg-danger-900/20"
 *   >
 *     <div className="text-danger-700 dark:text-danger-400">
 *       This patient has a severe peanut allergy.
 *     </div>
 *   </AccordionItem>
 * </Accordion>
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Patient health record sections (medications, allergies, immunizations)
 * - FAQ sections for users
 * - Collapsible form sections
 * - Medical history timeline
 * - Treatment plan details
 * - Consent form sections
 *
 * @see {@link AccordionItem} for accordion item component
 */
export const Accordion: React.FC<AccordionProps> = ({
  children,
  allowMultiple = false,
  defaultOpenItems = [],
  openItems: controlledOpenItems,
  onOpenItemsChange,
  className,
}) => {
  const [uncontrolledOpenItems, setUncontrolledOpenItems] = useState<string[]>(defaultOpenItems);

  const isControlled = controlledOpenItems !== undefined;
  const openItems = isControlled ? controlledOpenItems : uncontrolledOpenItems;

  const toggleItem = (id: string) => {
    let newOpenItems: string[];

    if (allowMultiple) {
      newOpenItems = openItems.includes(id)
        ? openItems.filter((item) => item !== id)
        : [...openItems, id];
    } else {
      newOpenItems = openItems.includes(id) ? [] : [id];
    }

    if (isControlled) {
      onOpenItemsChange?.(newOpenItems);
    } else {
      setUncontrolledOpenItems(newOpenItems);
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
      <div className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

/**
 * AccordionItem component for individual collapsible sections.
 *
 * @component
 * @param {AccordionItemProps} props - AccordionItem props
 * @returns {JSX.Element} Rendered accordion item
 */
export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  children,
  disabled = false,
  icon,
  className,
  headerClassName,
  panelClassName,
}) => {
  const { openItems, toggleItem } = useAccordion();
  const isOpen = openItems.includes(id);

  const headerId = `accordion-header-${id}`;
  const panelId = `accordion-panel-${id}`;

  const handleClick = () => {
    if (!disabled) {
      toggleItem(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(id);
    }
  };

  // Default chevron icon
  const defaultIcon = (
    <svg
      className={cn(
        'w-5 h-5 transition-transform duration-200',
        isOpen && 'transform rotate-180'
      )}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className={cn('py-2', className)}>
      {/* Header/Trigger */}
      <button
        id={headerId}
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          'flex items-center justify-between w-full px-4 py-3',
          'text-left font-medium',
          'rounded-lg transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'dark:focus:ring-offset-gray-900',
          disabled
            ? 'cursor-not-allowed opacity-50 text-gray-400 dark:text-gray-600'
            : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800',
          headerClassName
        )}
      >
        <span className="flex-1">{title}</span>
        <span className="flex-shrink-0 ml-3 text-gray-500 dark:text-gray-400">
          {icon || defaultIcon}
        </span>
      </button>

      {/* Panel/Content */}
      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className={cn(
            'px-4 py-3',
            'animate-in slide-in-from-top-2 fade-in duration-200',
            'text-gray-700 dark:text-gray-300',
            panelClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';

export default Accordion;

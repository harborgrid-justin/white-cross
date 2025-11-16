/**
 * useDropZone Hook
 *
 * Custom hook for managing drop zone state and behavior.
 * Provides validation, visual feedback, and collision detection.
 */

import { useCallback, useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type {
  DraggableData,
  DroppableConfig,
  DroppableState,
  DropValidation,
  DropZoneState,
} from '../../types/drag-drop.types';

/**
 * Default drop validation - always valid
 */
const defaultValidation = (): DropValidation => ({
  isValid: true,
});

/**
 * Drop zone hook configuration
 */
export interface UseDropZoneConfig<T = any> extends DroppableConfig<T> {
  /** Callback when item is dropped */
  onDrop?: (data: DraggableData) => void;
  /** Callback when drag enters zone */
  onDragEnter?: (data: DraggableData) => void;
  /** Callback when drag leaves zone */
  onDragLeave?: (data: DraggableData) => void;
}

/**
 * Drop zone hook return type
 */
export interface UseDropZoneReturn extends DroppableState {
  /** Ref to attach to drop zone element */
  setNodeRef: (element: HTMLElement | null) => void;
  /** Whether dragged item is over this zone */
  isOver: boolean;
  /** Current dragged data (if over) */
  activeData: DraggableData | null;
  /** Style classes for drop zone state */
  stateClasses: string;
  /** ARIA attributes for accessibility */
  ariaAttributes: {
    role: string;
    'aria-label': string;
    'aria-dropeffect': string;
    'aria-disabled'?: boolean;
  };
}

/**
 * useDropZone Hook
 *
 * Manages drop zone behavior with validation and visual feedback.
 *
 * @example
 * ```tsx
 * const { setNodeRef, isActive, canDrop, stateClasses } = useDropZone({
 *   id: 'container-1',
 *   accepts: ['component'],
 *   validate: (data) => ({
 *     isValid: data.type === 'button',
 *   }),
 *   onDrop: (data) => console.log('Dropped:', data),
 * });
 *
 * return (
 *   <div ref={setNodeRef} className={stateClasses}>
 *     Drop zone
 *   </div>
 * );
 * ```
 */
export const useDropZone = <T = any>(
  config: UseDropZoneConfig<T>
): UseDropZoneReturn => {
  const {
    id,
    accepts = [],
    disabled = false,
    validate = defaultValidation,
    showIndicator = true,
    onDrop,
    onDragEnter,
    onDragLeave,
  } = config;

  // Local state for tracking drop zone
  const [dropZoneState, setDropZoneState] = useState<DropZoneState>('idle');
  const [currentValidation, setCurrentValidation] = useState<DropValidation | undefined>();

  // dnd-kit droppable hook
  const { setNodeRef, isOver, active } = useDroppable({
    id,
    disabled,
  });

  // Extract active drag data
  const activeData = useMemo(
    () => (active?.data.current as DraggableData) || null,
    [active]
  );

  // Validate current drag
  const validation = useMemo(() => {
    if (!activeData) return undefined;

    // Check if type is accepted
    const isAccepted =
      accepts.length === 0 || accepts.includes(activeData.type);

    if (!isAccepted) {
      return {
        isValid: false,
        reason: `This drop zone only accepts: ${accepts.join(', ')}`,
      };
    }

    // Run custom validation
    return validate(activeData);
  }, [activeData, accepts, validate]);

  // Update validation state
  useMemo(() => {
    setCurrentValidation(validation);
  }, [validation]);

  // Calculate drop zone state
  const state = useMemo<DropZoneState>(() => {
    if (disabled) return 'idle';
    if (!activeData) return 'idle';
    if (!isOver) return 'potential';
    if (validation && !validation.isValid) return 'invalid';
    if (validation && validation.isValid) return 'valid';
    return 'active';
  }, [disabled, activeData, isOver, validation]);

  // Update state when it changes
  useMemo(() => {
    setDropZoneState(state);
  }, [state]);

  // Can drop check
  const canDrop = useMemo(
    () => !disabled && validation?.isValid === true,
    [disabled, validation]
  );

  // State classes for styling
  const stateClasses = useMemo(() => {
    const classes = ['drop-zone'];

    if (!showIndicator) return classes.join(' ');

    classes.push(`drop-zone--${state}`);

    if (disabled) classes.push('drop-zone--disabled');
    if (isOver) classes.push('drop-zone--over');
    if (canDrop) classes.push('drop-zone--can-drop');

    return classes.join(' ');
  }, [state, disabled, isOver, canDrop, showIndicator]);

  // Handle drag enter
  const handleDragEnter = useCallback(() => {
    if (activeData && onDragEnter) {
      onDragEnter(activeData);
    }
  }, [activeData, onDragEnter]);

  // Handle drag leave
  const handleDragLeave = useCallback(() => {
    if (activeData && onDragLeave) {
      onDragLeave(activeData);
    }
  }, [activeData, onDragLeave]);

  // Track drag enter/leave
  useMemo(() => {
    if (isOver) {
      handleDragEnter();
    } else {
      handleDragLeave();
    }
  }, [isOver, handleDragEnter, handleDragLeave]);

  // ARIA attributes
  const ariaAttributes = useMemo(
    () => ({
      role: 'region' as const,
      'aria-label': `Drop zone ${id}`,
      'aria-dropeffect': canDrop ? ('move' as const) : ('none' as const),
      ...(disabled && { 'aria-disabled': true }),
    }),
    [id, canDrop, disabled]
  );

  return {
    setNodeRef,
    isOver,
    isActive: isOver,
    canDrop,
    state,
    validation: currentValidation,
    activeData,
    stateClasses,
    ariaAttributes,
  };
};

/**
 * Get drop zone style based on state
 */
export const getDropZoneStyle = (
  state: DropZoneState,
  theme: 'light' | 'dark' = 'light'
): React.CSSProperties => {
  const isDark = theme === 'dark';

  const baseStyle: React.CSSProperties = {
    transition: 'all 0.2s ease-in-out',
    borderRadius: '8px',
  };

  switch (state) {
    case 'idle':
      return {
        ...baseStyle,
        border: `2px dashed ${isDark ? '#374151' : '#e5e7eb'}`,
      };

    case 'potential':
      return {
        ...baseStyle,
        border: `2px dashed ${isDark ? '#4b5563' : '#d1d5db'}`,
      };

    case 'active':
      return {
        ...baseStyle,
        border: `2px solid ${isDark ? '#60a5fa' : '#3b82f6'}`,
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
      };

    case 'valid':
      return {
        ...baseStyle,
        border: `2px solid ${isDark ? '#34d399' : '#10b981'}`,
        backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
        boxShadow: `0 0 0 4px ${isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'}`,
      };

    case 'invalid':
      return {
        ...baseStyle,
        border: `2px solid ${isDark ? '#f87171' : '#ef4444'}`,
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
        boxShadow: `0 0 0 4px ${isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'}`,
      };

    case 'dropping':
      return {
        ...baseStyle,
        border: `2px solid ${isDark ? '#34d399' : '#10b981'}`,
        backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
        transform: 'scale(0.98)',
      };

    default:
      return baseStyle;
  }
};

/**
 * DropZone Component
 *
 * Reusable drop zone component with visual feedback.
 * Provides clear indication of valid/invalid drop targets.
 */

'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Package } from 'lucide-react';
import { useDropZone, getDropZoneStyle } from '../../hooks/useDragAndDrop';
import type { UseDropZoneConfig } from '../../hooks/useDragAndDrop';
import type { DropZoneState } from '../../types/drag-drop.types';

/**
 * DropZone component props
 */
export interface DropZoneProps extends UseDropZoneConfig {
  /** Child components */
  children?: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Theme */
  theme?: 'light' | 'dark';
  /** Show state label */
  showLabel?: boolean;
  /** Custom label text */
  label?: string;
  /** Minimum height */
  minHeight?: number | string;
  /** Show icon indicator */
  showIcon?: boolean;
}

/**
 * Get state label text
 */
const getStateLabel = (state: DropZoneState, label?: string): string => {
  if (label) return label;

  switch (state) {
    case 'idle':
      return 'Drop zone';
    case 'potential':
      return 'Drag over to drop';
    case 'active':
      return 'Drop here';
    case 'valid':
      return 'Valid drop target';
    case 'invalid':
      return 'Invalid drop target';
    case 'dropping':
      return 'Dropping...';
    default:
      return 'Drop zone';
  }
};

/**
 * Get state icon
 */
const getStateIcon = (state: DropZoneState) => {
  switch (state) {
    case 'valid':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'invalid':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'active':
    case 'potential':
      return <Package className="w-5 h-5 text-blue-500" />;
    default:
      return null;
  }
};

/**
 * DropZone Component
 *
 * A visual drop zone with automatic state management and visual feedback.
 *
 * @example
 * ```tsx
 * <DropZone
 *   id="container-drop-zone"
 *   accepts={['component', 'widget']}
 *   onDrop={(data) => addComponent(data)}
 *   validate={(data) => ({
 *     isValid: data.type !== 'locked',
 *     reason: 'Cannot drop locked components here'
 *   })}
 * >
 *   <div>Drop components here</div>
 * </DropZone>
 * ```
 */
export const DropZone: React.FC<DropZoneProps> = ({
  children,
  className = '',
  theme = 'light',
  showLabel = true,
  label,
  minHeight = '100px',
  showIcon = true,
  ...dropZoneConfig
}) => {
  const {
    setNodeRef,
    state,
    isActive,
    canDrop,
    validation,
    activeData,
    ariaAttributes,
  } = useDropZone(dropZoneConfig);

  // State-based styling
  const stateStyle = useMemo(
    () => getDropZoneStyle(state, theme),
    [state, theme]
  );

  // Combined style
  const style = useMemo(
    () => ({
      ...stateStyle,
      minHeight,
    }),
    [stateStyle, minHeight]
  );

  // State label
  const stateLabel = useMemo(
    () => getStateLabel(state, label),
    [state, label]
  );

  // State icon
  const stateIcon = useMemo(() => getStateIcon(state), [state]);

  return (
    <div
      ref={setNodeRef}
      className={`drop-zone drop-zone--${state} ${className}`}
      style={style}
      {...ariaAttributes}
    >
      {/* Drop zone content */}
      <div className="relative w-full h-full">
        {children}

        {/* State indicator overlay */}
        <AnimatePresence>
          {isActive && (showLabel || showIcon) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              style={{
                backgroundColor:
                  state === 'valid'
                    ? 'rgba(16, 185, 129, 0.1)'
                    : state === 'invalid'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(59, 130, 246, 0.1)',
              }}
            >
              {showIcon && stateIcon && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  {stateIcon}
                </motion.div>
              )}

              {showLabel && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`
                    mt-2 px-3 py-1 rounded-full text-sm font-medium
                    ${
                      state === 'valid'
                        ? 'bg-green-100 text-green-700'
                        : state === 'invalid'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }
                  `}
                >
                  {stateLabel}
                </motion.div>
              )}

              {/* Validation message */}
              {validation && (validation.reason || validation.warning) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 px-3 py-1 bg-white dark:bg-gray-800 rounded shadow-lg text-xs text-gray-700 dark:text-gray-300 max-w-xs text-center"
                >
                  {validation.reason || validation.warning}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated border pulse for active state */}
        <AnimatePresence>
          {isActive && canDrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                boxShadow: `0 0 0 2px ${
                  state === 'valid'
                    ? 'rgba(16, 185, 129, 0.5)'
                    : 'rgba(59, 130, 246, 0.5)'
                }`,
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/**
 * Compact DropZone - Simplified version with minimal UI
 */
export const CompactDropZone: React.FC<DropZoneProps> = (props) => {
  return (
    <DropZone
      {...props}
      showLabel={false}
      showIcon={false}
      className={`compact-drop-zone ${props.className || ''}`}
    />
  );
};

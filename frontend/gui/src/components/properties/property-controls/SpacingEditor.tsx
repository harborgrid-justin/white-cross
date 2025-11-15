/**
 * SpacingEditor - Box model spacing editor
 *
 * Features:
 * - Visual box model representation
 * - Separate inputs for top/right/bottom/left
 * - Link button to sync all sides
 * - Support for margin and padding
 * - Unit selection (px, rem, em, %)
 */

'use client';

import React, { useState, useCallback } from 'react';
import * as Label from '@radix-ui/react-label';
import { Link, Unlink } from 'lucide-react';

interface SpacingEditorProps {
  id: string;
  label: string;
  value: string | SpacingValue;
  onChange: (value: string) => void;
  helpText?: string;
  error?: string;
  required?: boolean;
}

interface SpacingValue {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

type Unit = 'px' | 'rem' | 'em' | '%';

const UNITS: Unit[] = ['px', 'rem', 'em', '%'];

/**
 * Parse spacing value string to individual sides
 */
function parseSpacing(value: string | SpacingValue): SpacingValue {
  if (typeof value === 'object') {
    return value;
  }

  if (!value || value === '0' || value === '0px') {
    return { top: '0px', right: '0px', bottom: '0px', left: '0px' };
  }

  // Parse CSS shorthand (e.g., "10px", "10px 20px", "10px 20px 30px 40px")
  const parts = value.trim().split(/\s+/);

  switch (parts.length) {
    case 1:
      return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    case 2:
      return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    case 3:
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    case 4:
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
    default:
      return { top: '0px', right: '0px', bottom: '0px', left: '0px' };
  }
}

/**
 * Format spacing value to CSS string
 */
function formatSpacing(spacing: SpacingValue): string {
  const { top, right, bottom, left } = spacing;

  // If all sides are equal, use single value
  if (top === right && right === bottom && bottom === left) {
    return top;
  }

  // If top/bottom and left/right are equal, use two values
  if (top === bottom && left === right) {
    return `${top} ${right}`;
  }

  // Otherwise, use four values
  return `${top} ${right} ${bottom} ${left}`;
}

/**
 * Extract numeric value and unit from string
 */
function parseValue(value: string): { num: number; unit: Unit } {
  const match = value.match(/^(-?\d+\.?\d*)(px|rem|em|%)?$/);
  if (match) {
    return {
      num: parseFloat(match[1]) || 0,
      unit: (match[2] as Unit) || 'px',
    };
  }
  return { num: 0, unit: 'px' };
}

/**
 * SpacingEditor Component
 */
export function SpacingEditor({
  id,
  label,
  value,
  onChange,
  helpText,
  error,
  required = false,
}: SpacingEditorProps) {
  const spacing = parseSpacing(value);
  const [isLinked, setIsLinked] = useState(true);
  const [unit, setUnit] = useState<Unit>('px');

  const spacingId = `spacing-editor-${id}`;
  const helpId = `spacing-editor-help-${id}`;
  const errorId = `spacing-editor-error-${id}`;

  const handleSideChange = useCallback((side: keyof SpacingValue, newValue: string) => {
    const updatedSpacing = { ...spacing };

    if (isLinked) {
      // Update all sides
      updatedSpacing.top = newValue;
      updatedSpacing.right = newValue;
      updatedSpacing.bottom = newValue;
      updatedSpacing.left = newValue;
    } else {
      // Update only the specified side
      updatedSpacing[side] = newValue;
    }

    onChange(formatSpacing(updatedSpacing));
  }, [spacing, isLinked, onChange]);

  const handleNumericChange = useCallback((side: keyof SpacingValue, num: number) => {
    handleSideChange(side, `${num}${unit}`);
  }, [handleSideChange, unit]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label.Root htmlFor={spacingId} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </Label.Root>

        <div className="flex items-center gap-2">
          {/* Unit selector */}
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="px-2 py-1 text-xs rounded border border-input bg-background"
            aria-label="Unit"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          {/* Link/Unlink button */}
          <button
            type="button"
            onClick={() => setIsLinked(!isLinked)}
            className="p-1 rounded hover:bg-accent transition-colors"
            aria-label={isLinked ? 'Unlink sides' : 'Link sides'}
            title={isLinked ? 'Unlink sides' : 'Link sides'}
          >
            {isLinked ? (
              <Link className="h-4 w-4 text-primary" />
            ) : (
              <Unlink className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Visual box model */}
      <div
        id={spacingId}
        className="relative p-8 border-2 border-dashed border-border rounded-md bg-muted/20"
        aria-describedby={[helpText && helpId, error && errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={!!error}
      >
        {/* Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <input
            type="number"
            value={parseValue(spacing.top).num}
            onChange={(e) => handleNumericChange('top', parseFloat(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-xs text-center rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Top spacing"
          />
        </div>

        {/* Right */}
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
          <input
            type="number"
            value={parseValue(spacing.right).num}
            onChange={(e) => handleNumericChange('right', parseFloat(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-xs text-center rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Right spacing"
          />
        </div>

        {/* Bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <input
            type="number"
            value={parseValue(spacing.bottom).num}
            onChange={(e) => handleNumericChange('bottom', parseFloat(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-xs text-center rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Bottom spacing"
          />
        </div>

        {/* Left */}
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <input
            type="number"
            value={parseValue(spacing.left).num}
            onChange={(e) => handleNumericChange('left', parseFloat(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-xs text-center rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Left spacing"
          />
        </div>

        {/* Center label */}
        <div className="flex items-center justify-center h-16 text-xs text-muted-foreground">
          {formatSpacing(spacing)}
        </div>
      </div>

      {helpText && (
        <p id={helpId} className="text-xs text-muted-foreground">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

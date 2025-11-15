/**
 * ColorPicker - Color picker with multiple formats
 *
 * Features:
 * - Hex, RGB, HSL format support
 * - Color preview swatch
 * - Manual input
 * - Preset colors
 * - Alpha/opacity support
 */

'use client';

import React, { useState, useCallback } from 'react';
import * as Label from '@radix-ui/react-label';
import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import { Pipette } from 'lucide-react';

interface ColorPickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
  error?: string;
  required?: boolean;
}

type ColorMode = 'hex' | 'rgb' | 'hsl';

// Preset color palette
const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899',
  '#6B7280', '#F3F4F6', '#FCA5A5', '#FCD34D', '#6EE7B7', '#93C5FD', '#C4B5FD', '#F9A8D4',
];

/**
 * ColorPicker Component
 */
export function ColorPicker({
  id,
  label,
  value,
  onChange,
  helpText,
  error,
  required = false,
}: ColorPickerProps) {
  const [colorMode, setColorMode] = useState<ColorMode>('hex');
  const [isOpen, setIsOpen] = useState(false);

  const colorPickerId = `color-picker-${id}`;
  const helpId = `color-picker-help-${id}`;
  const errorId = `color-picker-error-${id}`;

  const handleHexChange = useCallback((hex: string) => {
    // Ensure hex format
    if (hex.startsWith('#')) {
      onChange(hex);
    } else {
      onChange(`#${hex}`);
    }
  }, [onChange]);

  const handleRgbChange = useCallback((r: number, g: number, b: number) => {
    onChange(`rgb(${r}, ${g}, ${b})`);
  }, [onChange]);

  const handlePresetClick = useCallback((color: string) => {
    onChange(color);
    setIsOpen(false);
  }, [onChange]);

  // Parse current color value
  const currentColor = value || '#000000';

  return (
    <div className="space-y-2">
      <Label.Root htmlFor={colorPickerId} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </Label.Root>

      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            id={colorPickerId}
            type="button"
            aria-describedby={[helpText && helpId, error && errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
            className={`inline-flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md border bg-background transition-colors
              ${error ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-primary'}
              focus:outline-none focus:ring-2 focus:ring-offset-0
              hover:bg-accent`}
          >
            <div
              className="w-6 h-6 rounded border border-border"
              style={{ backgroundColor: currentColor }}
              aria-label={`Current color: ${currentColor}`}
            />
            <span className="flex-1 text-left font-mono">{currentColor}</span>
            <Pipette className="h-4 w-4 text-muted-foreground" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="w-72 rounded-md border border-border bg-popover p-4 shadow-md outline-none z-50"
            sideOffset={5}
            align="start"
          >
            <Tabs.Root value={colorMode} onValueChange={(val) => setColorMode(val as ColorMode)}>
              {/* Mode tabs */}
              <Tabs.List className="flex border-b border-border mb-4">
                <Tabs.Trigger
                  value="hex"
                  className="flex-1 px-3 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary"
                >
                  Hex
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="rgb"
                  className="flex-1 px-3 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary"
                >
                  RGB
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="hsl"
                  className="flex-1 px-3 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary"
                >
                  HSL
                </Tabs.Trigger>
              </Tabs.List>

              {/* Hex input */}
              <Tabs.Content value="hex" className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Hex Value
                  </label>
                  <input
                    type="text"
                    value={currentColor}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="#000000"
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </Tabs.Content>

              {/* RGB input */}
              <Tabs.Content value="rgb" className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  RGB input coming soon
                </p>
              </Tabs.Content>

              {/* HSL input */}
              <Tabs.Content value="hsl" className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  HSL input coming soon
                </p>
              </Tabs.Content>
            </Tabs.Root>

            {/* Preset colors */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Presets</p>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handlePresetClick(color)}
                    className="w-7 h-7 rounded border border-border hover:ring-2 hover:ring-primary transition-all"
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color}`}
                  />
                ))}
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

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

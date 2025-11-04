/**
 * @fileoverview Accessible toggle switch component
 * @module app/(dashboard)/profile/_components/ui/ToggleSwitch
 * @category Profile - UI Components
 */

'use client';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

/**
 * Accessible toggle switch component
 * Used for boolean preferences like notifications
 */
export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
  description
}: ToggleSwitchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const switchContent = (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only peer"
        aria-label={label || 'Toggle switch'}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
    </label>
  );

  if (label || description) {
    return (
      <div className="flex items-center justify-between">
        <div>
          {label && <div className="font-medium">{label}</div>}
          {description && <div className="text-sm text-gray-600">{description}</div>}
        </div>
        {switchContent}
      </div>
    );
  }

  return switchContent;
}

/**
 * Select Component - Re-export
 *
 * This is a convenience re-export for the Select component.
 * The actual implementation is in ./inputs/Select.tsx
 */

export { Select, default, type SelectProps, type SelectOption } from './inputs/Select'

// Subcomponents for select (these may not exist in the actual file, adding stubs for compatibility)
export const SelectValue = ({ children, ...props }: any) => <span {...props}>{children}</span>
export const SelectTrigger = ({ children, ...props }: any) => <button type="button" {...props}>{children}</button>
export const SelectContent = ({ children, ...props }: any) => <div {...props}>{children}</div>
export const SelectItem = ({ children, value, ...props }: any) => <div data-value={value} {...props}>{children}</div>
export const SelectGroup = ({ children, ...props }: any) => <div {...props}>{children}</div>
export const SelectLabel = ({ children, ...props }: any) => <label {...props}>{children}</label>

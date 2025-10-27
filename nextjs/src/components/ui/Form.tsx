/**
 * Form Components - Re-export
 *
 * This is a convenience re-export for the Form components.
 * The actual implementation is in ./inputs/Form.tsx
 */

export {
  Form,
  FormField,
  FormError,
  type FormProps,
  type FormFieldProps,
  type FormErrorProps
} from './inputs/Form'

// Additional form subcomponents for compatibility
export const FormItem = ({ children, ...props }: any) => <div className="form-item mb-4" {...props}>{children}</div>
export const FormLabel = ({ children, ...props }: any) => <label className="block text-sm font-medium mb-1" {...props}>{children}</label>
export const FormControl = ({ children, ...props }: any) => <div className="form-control" {...props}>{children}</div>
export const FormDescription = ({ children, ...props }: any) => <p className="text-sm text-gray-600 mt-1" {...props}>{children}</p>
export const FormMessage = ({ children, ...props }: any) => children ? <p className="text-sm text-red-600 mt-1" {...props}>{children}</p> : null

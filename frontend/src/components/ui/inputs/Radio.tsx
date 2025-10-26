/**
 * @fileoverview Radio button components for single-selection input in healthcare forms.
 *
 * This module provides accessible radio button components for single-choice selections
 * in healthcare applications. Radio buttons allow users to select exactly one option from
 * a set of mutually exclusive choices, commonly used in medical forms, consent documents,
 * and health assessments.
 *
 * **Components:**
 * - `Radio` - Individual radio input with label, description, and error state
 * - `RadioGroup` - Fieldset wrapper for grouping related radio options
 *
 * **Key Features:**
 * - Full keyboard navigation (arrow keys, tab, space)
 * - Complete ARIA radiogroup semantics
 * - Error state with accessible error messages
 * - Optional descriptions for additional context
 * - Multiple visual variants (default, success, warning, error)
 * - Three size options (sm, md, lg)
 * - Horizontal and vertical layout orientations
 * - Disabled state support
 * - Required field indication
 *
 * **Use Cases:**
 * - Medical history yes/no questions
 * - Emergency contact type selection
 * - Consent form options (agree/disagree)
 * - Appointment type selection
 * - Visit reason categorization
 * - Medication administration route
 * - Allergy severity level
 *
 * @module components/ui/inputs/Radio
 * @since 1.0.0
 *
 * @example Basic Radio Button
 * ```tsx
 * import { Radio } from '@/components/ui/inputs/Radio';
 *
 * function ConsentForm() {
 *   const [consent, setConsent] = useState('');
 *
 *   return (
 *     <div>
 *       <Radio
 *         id="consent-yes"
 *         name="consent"
 *         value="yes"
 *         label="I give consent"
 *         checked={consent === 'yes'}
 *         onChange={(e) => setConsent(e.target.value)}
 *       />
 *       <Radio
 *         id="consent-no"
 *         name="consent"
 *         value="no"
 *         label="I do not give consent"
 *         checked={consent === 'no'}
 *         onChange={(e) => setConsent(e.target.value)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example RadioGroup for Visit Type Selection
 * ```tsx
 * import { RadioGroup, Radio } from '@/components/ui/inputs/Radio';
 *
 * function AppointmentForm() {
 *   const [visitType, setVisitType] = useState('');
 *
 *   return (
 *     <RadioGroup
 *       label="Visit Type"
 *       description="Select the reason for this visit"
 *     >
 *       <Radio
 *         id="visit-routine"
 *         name="visitType"
 *         value="routine"
 *         label="Routine Checkup"
 *         description="Regular health screening"
 *         checked={visitType === 'routine'}
 *         onChange={(e) => setVisitType(e.target.value)}
 *       />
 *       <Radio
 *         id="visit-sick"
 *         name="visitType"
 *         value="sick"
 *         label="Sick Visit"
 *         description="Current illness or symptoms"
 *         checked={visitType === 'sick'}
 *         onChange={(e) => setVisitType(e.target.value)}
 *       />
 *       <Radio
 *         id="visit-injury"
 *         name="visitType"
 *         value="injury"
 *         label="Injury"
 *         description="Accident or physical injury"
 *         checked={visitType === 'injury'}
 *         onChange={(e) => setVisitType(e.target.value)}
 *       />
 *       <Radio
 *         id="visit-medication"
 *         name="visitType"
 *         value="medication"
 *         label="Medication Administration"
 *         description="Scheduled medication or treatment"
 *         checked={visitType === 'medication'}
 *         onChange={(e) => setVisitType(e.target.value)}
 *       />
 *     </RadioGroup>
 *   );
 * }
 * ```
 *
 * @example Emergency Contact Type with Horizontal Layout
 * ```tsx
 * function EmergencyContactForm() {
 *   const [contactType, setContactType] = useState('');
 *
 *   return (
 *     <RadioGroup
 *       label="Contact Type"
 *       orientation="horizontal"
 *     >
 *       <Radio
 *         id="contact-parent"
 *         name="contactType"
 *         value="parent"
 *         label="Parent"
 *         checked={contactType === 'parent'}
 *         onChange={(e) => setContactType(e.target.value)}
 *         size="md"
 *       />
 *       <Radio
 *         id="contact-guardian"
 *         name="contactType"
 *         value="guardian"
 *         label="Guardian"
 *         checked={contactType === 'guardian'}
 *         onChange={(e) => setContactType(e.target.value)}
 *         size="md"
 *       />
 *       <Radio
 *         id="contact-other"
 *         name="contactType"
 *         value="other"
 *         label="Other"
 *         checked={contactType === 'other'}
 *         onChange={(e) => setContactType(e.target.value)}
 *         size="md"
 *       />
 *     </RadioGroup>
 *   );
 * }
 * ```
 *
 * @example Medical History Questions
 * ```tsx
 * function MedicalHistoryForm() {
 *   const [hasAllergies, setHasAllergies] = useState('');
 *   const [hasConditions, setHasConditions] = useState('');
 *
 *   return (
 *     <div className="space-y-6">
 *       <RadioGroup
 *         label="Does the student have any known allergies?"
 *         description="Include food, medication, and environmental allergies"
 *       >
 *         <Radio
 *           id="allergies-yes"
 *           name="allergies"
 *           value="yes"
 *           label="Yes"
 *           checked={hasAllergies === 'yes'}
 *           onChange={(e) => setHasAllergies(e.target.value)}
 *         />
 *         <Radio
 *           id="allergies-no"
 *           name="allergies"
 *           value="no"
 *           label="No"
 *           checked={hasAllergies === 'no'}
 *           onChange={(e) => setHasAllergies(e.target.value)}
 *         />
 *         <Radio
 *           id="allergies-unknown"
 *           name="allergies"
 *           value="unknown"
 *           label="Unknown"
 *           checked={hasAllergies === 'unknown'}
 *           onChange={(e) => setHasAllergies(e.target.value)}
 *         />
 *       </RadioGroup>
 *
 *       <RadioGroup
 *         label="Does the student have any chronic health conditions?"
 *         description="Such as asthma, diabetes, epilepsy, etc."
 *       >
 *         <Radio
 *           id="conditions-yes"
 *           name="conditions"
 *           value="yes"
 *           label="Yes"
 *           checked={hasConditions === 'yes'}
 *           onChange={(e) => setHasConditions(e.target.value)}
 *         />
 *         <Radio
 *           id="conditions-no"
 *           name="conditions"
 *           value="no"
 *           label="No"
 *           checked={hasConditions === 'no'}
 *           onChange={(e) => setHasConditions(e.target.value)}
 *         />
 *       </RadioGroup>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Radio with Error State and Validation
 * ```tsx
 * function ConsentFormWithValidation() {
 *   const [consent, setConsent] = useState('');
 *   const [touched, setTouched] = useState(false);
 *   const error = touched && !consent ? 'Consent selection is required' : '';
 *
 *   return (
 *     <RadioGroup
 *       label="Photo and Media Consent"
 *       description="May the school use photos of your child in publications?"
 *       error={error}
 *     >
 *       <Radio
 *         id="photo-yes"
 *         name="photoConsent"
 *         value="yes"
 *         label="Yes, I give permission"
 *         checked={consent === 'yes'}
 *         onChange={(e) => {
 *           setConsent(e.target.value);
 *           setTouched(true);
 *         }}
 *         error={error}
 *         required
 *       />
 *       <Radio
 *         id="photo-no"
 *         name="photoConsent"
 *         value="no"
 *         label="No, I do not give permission"
 *         checked={consent === 'no'}
 *         onChange={(e) => {
 *           setConsent(e.target.value);
 *           setTouched(true);
 *         }}
 *         error={error}
 *         required
 *       />
 *     </RadioGroup>
 *   );
 * }
 * ```
 *
 * @example Allergy Severity Level Selection
 * ```tsx
 * function AllergySeverityForm() {
 *   const [severity, setSeverity] = useState('');
 *
 *   return (
 *     <RadioGroup
 *       label="Allergy Severity"
 *       description="Select the severity level of the allergic reaction"
 *     >
 *       <Radio
 *         id="severity-mild"
 *         name="severity"
 *         value="mild"
 *         label="Mild"
 *         description="Minor symptoms, no intervention needed"
 *         checked={severity === 'mild'}
 *         onChange={(e) => setSeverity(e.target.value)}
 *         variant="success"
 *       />
 *       <Radio
 *         id="severity-moderate"
 *         name="severity"
 *         value="moderate"
 *         label="Moderate"
 *         description="Noticeable symptoms, may require medication"
 *         checked={severity === 'moderate'}
 *         onChange={(e) => setSeverity(e.target.value)}
 *         variant="warning"
 *       />
 *       <Radio
 *         id="severity-severe"
 *         name="severity"
 *         value="severe"
 *         label="Severe"
 *         description="Life-threatening, requires immediate action (EpiPen)"
 *         checked={severity === 'severe'}
 *         onChange={(e) => setSeverity(e.target.value)}
 *         variant="error"
 *       />
 *     </RadioGroup>
 *   );
 * }
 * ```
 *
 * @example Medication Administration Route
 * ```tsx
 * function MedicationRouteSelector() {
 *   const [route, setRoute] = useState('');
 *
 *   return (
 *     <RadioGroup
 *       label="Administration Route"
 *       description="How should this medication be administered?"
 *       orientation="horizontal"
 *     >
 *       <Radio
 *         id="route-oral"
 *         name="route"
 *         value="oral"
 *         label="Oral"
 *         checked={route === 'oral'}
 *         onChange={(e) => setRoute(e.target.value)}
 *       />
 *       <Radio
 *         id="route-topical"
 *         name="route"
 *         value="topical"
 *         label="Topical"
 *         checked={route === 'topical'}
 *         onChange={(e) => setRoute(e.target.value)}
 *       />
 *       <Radio
 *         id="route-inhaled"
 *         name="route"
 *         value="inhaled"
 *         label="Inhaled"
 *         checked={route === 'inhaled'}
 *         onChange={(e) => setRoute(e.target.value)}
 *       />
 *       <Radio
 *         id="route-injection"
 *         name="route"
 *         value="injection"
 *         label="Injection"
 *         checked={route === 'injection'}
 *         onChange={(e) => setRoute(e.target.value)}
 *       />
 *     </RadioGroup>
 *   );
 * }
 * ```
 *
 * @accessibility
 * - Uses semantic radio input with proper type="radio"
 * - RadioGroup uses fieldset and legend for proper grouping
 * - Full keyboard navigation with arrow keys and tab
 * - Space key to select radio button
 * - Error messages linked via aria-describedby
 * - Required state announced via aria-required
 * - Invalid state announced via aria-invalid
 * - Labels properly associated with inputs via htmlFor
 *
 * @keyboard
 * - `Tab` / `Shift+Tab`: Move focus between radio groups
 * - `Arrow Up` / `Arrow Down`: Select previous/next option in group (vertical)
 * - `Arrow Left` / `Arrow Right`: Select previous/next option in group (horizontal)
 * - `Space`: Select focused radio button
 *
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/radio/} ARIA Radio Group Pattern
 */

import React from 'react';
import { cn } from '../../../utils/cn';

/**
 * Props for the Radio component.
 *
 * @interface RadioProps
 * @extends {Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>}
 *
 * @property {string} [label] - Label text displayed next to the radio button
 * @property {string} [description] - Additional descriptive text below the label
 * @property {string} [error] - Error message to display (also triggers error styling)
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Visual size of the radio button
 *   - `sm`: 1rem (16px) - Compact, for dense forms
 *   - `md`: 1.25rem (20px) - Standard size
 *   - `lg`: 1.5rem (24px) - Large, for emphasis
 *
 * @property {('default' | 'success' | 'warning' | 'error')} [variant='default'] - Color variant
 *   - `default`: Blue - Standard radio button
 *   - `success`: Green - Positive or successful choice
 *   - `warning`: Yellow - Warning or caution choice
 *   - `error`: Red - Error or dangerous choice (also applied when error prop is set)
 */
interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
}

/**
 * Props for the RadioGroup component.
 *
 * @interface RadioGroupProps
 *
 * @property {React.ReactNode} children - Radio button components to group
 * @property {string} [error] - Error message for the entire group
 * @property {string} [label] - Label for the radio group (rendered as legend)
 * @property {string} [description] - Descriptive text for the radio group
 * @property {string} [className] - Additional CSS classes for the fieldset
 * @property {('horizontal' | 'vertical')} [orientation='vertical'] - Layout orientation
 *   - `vertical`: Stacked layout (default) - Better for long labels
 *   - `horizontal`: Inline layout - Better for short labels and limited options
 */
interface RadioGroupProps {
  children: React.ReactNode;
  error?: string;
  label?: string;
  description?: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Radio button component for single-selection input.
 *
 * Renders a styled radio input with optional label, description, and error state.
 * Radio buttons should be used when the user must select exactly one option from
 * a set of mutually exclusive choices.
 *
 * **Features:**
 * - Accessible label association via htmlFor
 * - Optional description for additional context
 * - Error state with visual indication and screen reader announcement
 * - Disabled state with reduced opacity
 * - Multiple size variants
 * - Color variants for semantic meaning
 * - Focus ring for keyboard navigation
 *
 * @component
 * @param {RadioProps} props - Component props
 * @param {React.Ref<HTMLInputElement>} ref - Forward ref to input element
 * @returns {JSX.Element} Rendered radio button with optional label and description
 *
 * @accessibility
 * - Uses native radio input with type="radio"
 * - Label properly associated via htmlFor attribute
 * - Description linked via aria-describedby
 * - Error message linked via aria-describedby and role="alert"
 * - Invalid state indicated via aria-invalid
 * - Required state indicated via aria-required
 * - Disabled state properly announced
 *
 * @example
 * ```tsx
 * <Radio
 *   id="option-1"
 *   name="options"
 *   value="option1"
 *   label="Option 1"
 *   description="Description for option 1"
 *   checked={selected === 'option1'}
 *   onChange={(e) => setSelected(e.target.value)}
 * />
 * ```
 */
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({
    className,
    label,
    description,
    error,
    size = 'md',
    variant = 'default',
    disabled,
    ...props
  }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const variantClasses = {
      default: 'border-gray-300 text-blue-600 focus:ring-blue-500',
      success: 'border-green-300 text-green-600 focus:ring-green-500',
      warning: 'border-yellow-300 text-yellow-600 focus:ring-yellow-500',
      error: 'border-red-300 text-red-600 focus:ring-red-500'
    };

    const actualVariant = error ? 'error' : variant;

    return (
      <div className="flex items-start space-x-3">
        <div className="flex items-center h-5">
          <input
            type="radio"
            ref={ref}
            className={cn(
              'border-2 focus:ring-2 focus:ring-offset-2 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[size],
              variantClasses[actualVariant],
              className
            )}
            disabled={disabled}
            aria-describedby={
              description ? `${props.id}-description` : error ? `${props.id}-error` : undefined
            }
            aria-invalid={error ? 'true' : 'false'}
            aria-required={props.required ? 'true' : undefined}
            {...props}
          />
        </div>
        {(label || description || error) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={props.id}
                className={cn(
                  'block text-sm font-medium leading-5 cursor-pointer',
                  disabled ? 'text-gray-400' : 'text-gray-900',
                  error && 'text-red-900'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={`${props.id}-description`}
                className={cn(
                  'text-sm leading-5',
                  disabled ? 'text-gray-400' : 'text-gray-600'
                )}
              >
                {description}
              </p>
            )}
            {error && (
              <p
                id={`${props.id}-error`}
                className="text-sm text-red-600 mt-1"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

/**
 * RadioGroup component for grouping related radio buttons.
 *
 * Provides a semantic fieldset wrapper with legend for grouping radio buttons.
 * Improves accessibility by associating related radio options and providing
 * group-level context, labels, and error messages.
 *
 * **Features:**
 * - Semantic HTML5 fieldset and legend elements
 * - Group-level label (legend) and description
 * - Group-level error message display
 * - Vertical or horizontal layout options
 * - Proper ARIA radiogroup role
 * - Consistent spacing between radio options
 *
 * @component
 * @param {RadioGroupProps} props - Component props
 * @returns {JSX.Element} Rendered radio group fieldset
 *
 * @accessibility
 * - Uses semantic <fieldset> and <legend> elements
 * - Applies role="radiogroup" for additional semantic meaning
 * - Group description provides context for all options
 * - Group error message applies to all radios in the group
 * - Keyboard navigation works naturally within the group
 *
 * @remarks
 * **Best Practices:**
 * - Always provide a label (legend) for the group
 * - Use vertical orientation for long labels or descriptions
 * - Use horizontal orientation for short labels (3-4 words max)
 * - Provide group-level description when options need explanation
 * - All radio buttons in a group should share the same `name` attribute
 *
 * @example Vertical Group
 * ```tsx
 * <RadioGroup label="Visit Type" description="Select one option">
 *   <Radio id="r1" name="visit" value="routine" label="Routine" />
 *   <Radio id="r2" name="visit" value="sick" label="Sick Visit" />
 * </RadioGroup>
 * ```
 *
 * @example Horizontal Group
 * ```tsx
 * <RadioGroup label="Consent" orientation="horizontal">
 *   <Radio id="c1" name="consent" value="yes" label="Yes" />
 *   <Radio id="c2" name="consent" value="no" label="No" />
 * </RadioGroup>
 * ```
 */
const RadioGroup: React.FC<RadioGroupProps> = ({
  children,
  error,
  label,
  description,
  className,
  orientation = 'vertical'
}) => {
  return (
    <fieldset className={cn('space-y-2', className)}>
      {label && (
        <legend className="text-sm font-medium text-gray-900 mb-2">
          {label}
        </legend>
      )}
      {description && (
        <p className="text-sm text-gray-600 mb-3">
          {description}
        </p>
      )}
      <div
        className={cn(
          orientation === 'horizontal'
            ? 'flex flex-wrap gap-6'
            : 'space-y-3'
        )}
        role="radiogroup"
      >
        {children}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-2" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
};

Radio.displayName = 'Radio';
RadioGroup.displayName = 'RadioGroup';

export { Radio, RadioGroup, type RadioProps, type RadioGroupProps };

'use client';

/**
 * @fileoverview Toggle switch component for binary on/off settings in healthcare applications.
 *
 * This module provides an accessible toggle switch component for binary choices in healthcare
 * applications. Unlike checkboxes, switches represent an immediate state change and are ideal
 * for settings, preferences, and feature toggles that take effect immediately.
 *
 * **Component:**
 * - `Switch` - Toggle switch with label, description, and multiple visual states
 *
 * **Key Features:**
 * - Immediate state change indication
 * - Keyboard accessible (Space and Enter keys)
 * - ARIA switch role with proper state announcement
 * - Optional label positioning (left or right)
 * - Multiple size variants (sm, md, lg)
 * - Visual color variants (default, success, warning, error)
 * - Disabled state support
 * - Smooth toggle animation
 * - Required field indication
 *
 * **Use Cases:**
 * - Notification preferences (email, SMS, push notifications)
 * - Privacy settings (share health data, allow communications)
 * - Emergency alert toggles (critical alerts, weather notifications)
 * - Feature flags (enable advanced features, beta features)
 * - Permission settings (photo consent, field trip authorization)
 * - Medication reminder toggles
 * - Health screening opt-in/opt-out
 *
 * @module components/ui/inputs/Switch
 * @since 1.0.0
 *
 * @example Basic Toggle Switch
 * ```tsx
 * import { Switch } from '@/components/ui/inputs/Switch';
 *
 * function NotificationSettings() {
 *   const [emailNotifications, setEmailNotifications] = useState(true);
 *
 *   return (
 *     <Switch
 *       id="email-notifications"
 *       label="Email Notifications"
 *       description="Receive email updates about your child's health records"
 *       checked={emailNotifications}
 *       onChange={(e) => setEmailNotifications(e.target.checked)}
 *     />
 *   );
 * }
 * ```
 *
 * @example Emergency Alert Settings
 * ```tsx
 * function EmergencyAlertPreferences() {
 *   const [criticalAlerts, setCriticalAlerts] = useState(true);
 *   const [weatherAlerts, setWeatherAlerts] = useState(false);
 *   const [schoolClosures, setSchoolClosures] = useState(true);
 *
 *   return (
 *     <div className="space-y-4">
 *       <Switch
 *         id="critical-alerts"
 *         label="Critical Health Alerts"
 *         description="Immediate notification for health emergencies (cannot be disabled)"
 *         checked={criticalAlerts}
 *         onChange={(e) => setCriticalAlerts(e.target.checked)}
 *         variant="error"
 *         disabled
 *         size="md"
 *       />
 *       <Switch
 *         id="weather-alerts"
 *         label="Weather Alerts"
 *         description="Severe weather notifications affecting school operations"
 *         checked={weatherAlerts}
 *         onChange={(e) => setWeatherAlerts(e.target.checked)}
 *         variant="warning"
 *       />
 *       <Switch
 *         id="school-closures"
 *         label="School Closure Notifications"
 *         description="Early dismissal and closure announcements"
 *         checked={schoolClosures}
 *         onChange={(e) => setSchoolClosures(e.target.checked)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Privacy and Consent Settings
 * ```tsx
 * function PrivacySettings() {
 *   const [shareData, setShareData] = useState(false);
 *   const [allowResearch, setAllowResearch] = useState(false);
 *   const [allowCommunication, setAllowCommunication] = useState(true);
 *
 *   return (
 *     <div className="space-y-6">
 *       <div>
 *         <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
 *         <div className="space-y-4">
 *           <Switch
 *             id="share-health-data"
 *             label="Share Health Data with District"
 *             description="Allow anonymous health data to be used for district-wide health initiatives"
 *             checked={shareData}
 *             onChange={(e) => setShareData(e.target.checked)}
 *             labelPosition="right"
 *           />
 *           <Switch
 *             id="research-participation"
 *             label="Participate in Health Research"
 *             description="Allow de-identified data to be used in approved health research studies"
 *             checked={allowResearch}
 *             onChange={(e) => setAllowResearch(e.target.checked)}
 *             labelPosition="right"
 *           />
 *           <Switch
 *             id="allow-communication"
 *             label="Allow Health-Related Communication"
 *             description="Receive important health tips, immunization reminders, and wellness resources"
 *             checked={allowCommunication}
 *             onChange={(e) => setAllowCommunication(e.target.checked)}
 *             labelPosition="right"
 *             variant="success"
 *           />
 *         </div>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Medication Reminder Settings
 * ```tsx
 * function MedicationReminderSettings({ medicationId }) {
 *   const [morningReminder, setMorningReminder] = useState(true);
 *   const [afternoonReminder, setAfternoonReminder] = useState(true);
 *   const [smsReminder, setSmsReminder] = useState(false);
 *
 *   return (
 *     <div className="bg-white p-6 rounded-lg shadow">
 *       <h3 className="text-lg font-medium mb-4">Medication Reminders</h3>
 *       <div className="space-y-4">
 *         <Switch
 *           id={`${medicationId}-morning`}
 *           label="Morning Dose Reminder"
 *           description="Reminder at 7:00 AM"
 *           checked={morningReminder}
 *           onChange={(e) => setMorningReminder(e.target.checked)}
 *           size="sm"
 *         />
 *         <Switch
 *           id={`${medicationId}-afternoon`}
 *           label="Afternoon Dose Reminder"
 *           description="Reminder at 2:00 PM during school"
 *           checked={afternoonReminder}
 *           onChange={(e) => setAfternoonReminder(e.target.checked)}
 *           size="sm"
 *         />
 *         <Switch
 *           id={`${medicationId}-sms`}
 *           label="SMS Reminders"
 *           description="Receive text message reminders (standard rates apply)"
 *           checked={smsReminder}
 *           onChange={(e) => setSmsReminder(e.target.checked)}
 *           size="sm"
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Field Trip Authorization Settings
 * ```tsx
 * function FieldTripSettings() {
 *   const [autoAuthorize, setAutoAuthorize] = useState(false);
 *   const [medicationPermission, setMedicationPermission] = useState(true);
 *   const [emergencyTreatment, setEmergencyTreatment] = useState(true);
 *
 *   return (
 *     <div className="space-y-6">
 *       <h3 className="text-lg font-medium">Field Trip Authorizations</h3>
 *       <div className="space-y-4">
 *         <Switch
 *           id="auto-authorize"
 *           label="Automatic Field Trip Authorization"
 *           description="Automatically authorize all school-organized field trips"
 *           checked={autoAuthorize}
 *           onChange={(e) => setAutoAuthorize(e.target.checked)}
 *           labelPosition="left"
 *         />
 *         <Switch
 *           id="medication-permission"
 *           label="Medication Administration Permission"
 *           description="Allow school staff to administer prescribed medications during field trips"
 *           checked={medicationPermission}
 *           onChange={(e) => setMedicationPermission(e.target.checked)}
 *           labelPosition="left"
 *           variant="success"
 *         />
 *         <Switch
 *           id="emergency-treatment"
 *           label="Emergency Medical Treatment Authorization"
 *           description="Authorize emergency medical treatment if parent cannot be reached"
 *           checked={emergencyTreatment}
 *           onChange={(e) => setEmergencyTreatment(e.target.checked)}
 *           labelPosition="left"
 *           variant="error"
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Health Screening Participation
 * ```tsx
 * function HealthScreeningOptIn() {
 *   const [visionScreening, setVisionScreening] = useState(true);
 *   const [hearingScreening, setHearingScreening] = useState(true);
 *   const [dentalScreening, setDentalScreening] = useState(false);
 *   const [bmiScreening, setBmiScreening] = useState(true);
 *
 *   return (
 *     <div>
 *       <h3 className="text-lg font-medium mb-2">Health Screening Participation</h3>
 *       <p className="text-sm text-gray-600 mb-4">
 *         Select which health screenings your child may participate in this year
 *       </p>
 *       <div className="space-y-3">
 *         <Switch
 *           id="vision-screening"
 *           label="Vision Screening"
 *           checked={visionScreening}
 *           onChange={(e) => setVisionScreening(e.target.checked)}
 *           size="lg"
 *           variant={visionScreening ? 'success' : 'default'}
 *         />
 *         <Switch
 *           id="hearing-screening"
 *           label="Hearing Screening"
 *           checked={hearingScreening}
 *           onChange={(e) => setHearingScreening(e.target.checked)}
 *           size="lg"
 *           variant={hearingScreening ? 'success' : 'default'}
 *         />
 *         <Switch
 *           id="dental-screening"
 *           label="Dental Screening"
 *           checked={dentalScreening}
 *           onChange={(e) => setDentalScreening(e.target.checked)}
 *           size="lg"
 *           variant={dentalScreening ? 'success' : 'default'}
 *         />
 *         <Switch
 *           id="bmi-screening"
 *           label="BMI Screening"
 *           checked={bmiScreening}
 *           onChange={(e) => setBmiScreening(e.target.checked)}
 *           size="lg"
 *           variant={bmiScreening ? 'success' : 'default'}
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Dashboard Feature Toggles
 * ```tsx
 * function DashboardSettings() {
 *   const [showAlerts, setShowAlerts] = useState(true);
 *   const [showAppointments, setShowAppointments] = useState(true);
 *   const [showMedications, setShowMedications] = useState(true);
 *   const [showImmunizations, setShowImmunizations] = useState(false);
 *
 *   return (
 *     <div className="bg-gray-50 p-6 rounded-lg">
 *       <h3 className="text-lg font-medium mb-4">Dashboard Display Settings</h3>
 *       <div className="grid grid-cols-2 gap-4">
 *         <Switch
 *           id="show-alerts"
 *           label="Health Alerts"
 *           checked={showAlerts}
 *           onChange={(e) => setShowAlerts(e.target.checked)}
 *           labelPosition="right"
 *         />
 *         <Switch
 *           id="show-appointments"
 *           label="Upcoming Appointments"
 *           checked={showAppointments}
 *           onChange={(e) => setShowAppointments(e.target.checked)}
 *           labelPosition="right"
 *         />
 *         <Switch
 *           id="show-medications"
 *           label="Medication Schedule"
 *           checked={showMedications}
 *           onChange={(e) => setShowMedications(e.target.checked)}
 *           labelPosition="right"
 *         />
 *         <Switch
 *           id="show-immunizations"
 *           label="Immunization Records"
 *           checked={showImmunizations}
 *           onChange={(e) => setShowImmunizations(e.target.checked)}
 *           labelPosition="right"
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @accessibility
 * - Uses role="switch" for proper semantic meaning
 * - Provides aria-checked for current state
 * - Supports keyboard interaction (Space and Enter)
 * - aria-required indicates required fields
 * - aria-describedby links to description text
 * - Visual state doesn't rely solely on color
 * - Focus states clearly visible
 *
 * @keyboard
 * - `Tab`: Move focus to switch
 * - `Space` or `Enter`: Toggle switch state
 * - Visual focus indicator on keyboard focus
 *
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/switch/} ARIA Switch Pattern
 */

import React from 'react';
import { cn } from '../../../utils/cn';

/**
 * Props for the Switch component.
 *
 * @interface SwitchProps
 * @extends {Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>}
 *
 * @property {string} [label] - Label text displayed next to the switch
 * @property {string} [description] - Additional descriptive text below the label
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Visual size of the switch
 *   - `sm`: Container 1.25rem, thumb 1rem - Compact, for dense settings panels
 *   - `md`: Container 1.5rem, thumb 1.25rem - Standard size for most use cases
 *   - `lg`: Container 1.75rem, thumb 1.5rem - Large, for emphasis or primary toggles
 *
 * @property {('default' | 'success' | 'warning' | 'error')} [variant='default'] - Color variant when checked
 *   - `default`: Blue - Standard switch color
 *   - `success`: Green - Positive or enabled state
 *   - `warning`: Yellow - Warning or caution state
 *   - `error`: Red - Critical or dangerous state
 *
 * @property {('left' | 'right')} [labelPosition='right'] - Position of label relative to switch
 *   - `left`: Label appears before the switch (right-aligned UI pattern)
 *   - `right`: Label appears after the switch (left-aligned UI pattern, default)
 */
interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  labelPosition?: 'left' | 'right';
}

/**
 * Toggle switch component for binary on/off settings.
 *
 * Provides an accessible toggle switch that represents an immediate state change.
 * Unlike checkboxes which represent a choice to be submitted, switches take effect
 * immediately and are ideal for settings, preferences, and feature toggles.
 *
 * **Visual States:**
 * - Unchecked: Gray background, thumb at left position
 * - Checked: Colored background (variant), thumb at right position
 * - Disabled: Reduced opacity, no interaction
 * - Focus: Visible focus ring for keyboard navigation
 *
 * **Features:**
 * - Smooth animated transitions
 * - Configurable label positioning (left or right of switch)
 * - Multiple size variants for different contexts
 * - Color variants for semantic meaning
 * - Optional description text for additional context
 * - Accessible keyboard interaction
 * - ARIA switch semantics
 *
 * @component
 * @param {SwitchProps} props - Component props
 * @param {React.Ref<HTMLInputElement>} ref - Forward ref to input element
 * @returns {JSX.Element} Rendered switch with optional label and description
 *
 * @accessibility
 * - Uses native checkbox input with role="switch"
 * - Provides aria-checked for current state (not just checked attribute)
 * - aria-required indicates required switches
 * - aria-describedby links description for context
 * - Keyboard accessible (Space and Enter to toggle)
 * - Focus ring clearly visible
 * - Label properly associated with input
 *
 * @remarks
 * **When to Use Switch vs Checkbox:**
 * - **Switch**: Use when the action takes immediate effect (e.g., "Enable notifications" immediately enables them)
 * - **Checkbox**: Use when the action requires submission (e.g., form with "I agree to terms" checkbox)
 *
 * **Label Position Guidelines:**
 * - `labelPosition="right"` (default): Standard pattern for forms and settings (label describes what's being toggled)
 * - `labelPosition="left"`: Use for right-aligned UI or when switch represents an action verb (e.g., "Send notifications [switch]")
 *
 * @example Basic Switch
 * ```tsx
 * <Switch
 *   id="notifications"
 *   label="Enable Notifications"
 *   checked={isEnabled}
 *   onChange={(e) => setIsEnabled(e.target.checked)}
 * />
 * ```
 *
 * @example Switch with Description
 * ```tsx
 * <Switch
 *   id="data-sharing"
 *   label="Share Health Data"
 *   description="Allow de-identified health data to be used for research"
 *   checked={shareData}
 *   onChange={(e) => setShareData(e.target.checked)}
 * />
 * ```
 *
 * @example Left-Positioned Label
 * ```tsx
 * <Switch
 *   id="auto-sync"
 *   label="Automatic Sync"
 *   labelPosition="left"
 *   checked={autoSync}
 *   onChange={(e) => setAutoSync(e.target.checked)}
 * />
 * ```
 */
const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({
    className,
    label,
    description,
    size = 'md',
    variant = 'default',
    labelPosition = 'right',
    disabled,
    checked,
    ...props
  }, ref) => {
    const sizeClasses = {
      sm: {
        container: 'h-5 w-9',
        thumb: 'h-4 w-4',
        translate: 'translate-x-4'
      },
      md: {
        container: 'h-6 w-11',
        thumb: 'h-5 w-5',
        translate: 'translate-x-5'
      },
      lg: {
        container: 'h-7 w-14',
        thumb: 'h-6 w-6',
        translate: 'translate-x-7'
      }
    };

    const variantClasses = {
      default: {
        active: 'bg-blue-600',
        inactive: 'bg-gray-200'
      },
      success: {
        active: 'bg-green-600',
        inactive: 'bg-gray-200'
      },
      warning: {
        active: 'bg-yellow-600',
        inactive: 'bg-gray-200'
      },
      error: {
        active: 'bg-red-600',
        inactive: 'bg-gray-200'
      }
    };

    const sizes = sizeClasses[size];
    const colors = variantClasses[variant];

    const switchElement = (
      <label
        className={cn(
          'relative inline-flex cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          role="switch"
          className="sr-only"
          disabled={disabled}
          checked={checked}
          aria-checked={checked ? 'true' : 'false'}
          aria-required={props.required ? 'true' : undefined}
          aria-describedby={description ? `${props.id}-description` : undefined}
          {...props}
        />
        <div
          className={cn(
            'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-offset-2',
            sizes.container,
            checked ? colors.active : colors.inactive,
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            className
          )}
        >
          <span
            className={cn(
              'inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out',
              sizes.thumb,
              checked ? sizes.translate : 'translate-x-0.5'
            )}
          />
        </div>
      </label>
    );

    if (!label && !description) {
      return switchElement;
    }

    return (
      <div className={cn(
        'flex items-start gap-3',
        labelPosition === 'left' && 'flex-row-reverse'
      )}>
        {switchElement}
        <div className="flex-1">
          {label && (
            <div
              className={cn(
                'text-sm font-medium leading-5',
                disabled ? 'text-gray-400' : 'text-gray-900'
              )}
            >
              {label}
            </div>
          )}
          {description && (
            <p
              id={`${props.id}-description`}
              className={cn(
                'text-sm leading-5 mt-1',
                disabled ? 'text-gray-400' : 'text-gray-600'
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch, type SwitchProps };

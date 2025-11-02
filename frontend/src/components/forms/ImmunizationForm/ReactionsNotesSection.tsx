/**
 * @fileoverview Reactions & Notes Section Component
 * 
 * Form section for capturing immediate reactions and additional notes
 * related to the immunization.
 * 
 * @module components/forms/ImmunizationForm/ReactionsNotesSection
 * @since 1.0.0
 */

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ReactionsNotesSectionProps {
  errors?: Record<string, string[]>;
}

/**
 * Reactions & Notes Section Component
 * 
 * Renders form fields for capturing reactions and additional notes.
 */
export function ReactionsNotesSection({ errors }: ReactionsNotesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Reactions & Notes</h3>

      <div className="space-y-2">
        <label htmlFor="reactions" className="text-sm font-medium">Immediate Reactions</label>
        <Textarea
          id="reactions"
          name="reactions"
          placeholder="Document any immediate reactions observed after vaccination..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">Additional Notes</label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Any additional information about this immunization..."
          rows={3}
        />
      </div>
    </div>
  );
}


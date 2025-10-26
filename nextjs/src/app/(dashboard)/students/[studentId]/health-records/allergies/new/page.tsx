/**
 * Add Allergy Page
 * Route: /students/[studentId]/health-records/allergies/new
 *
 * HIPAA CRITICAL: EMERGENCY-CRITICAL PHI
 * All allergy records are logged with high priority due to emergency response importance
 */

'use client';

import { useFormState } from 'react-dom';
import { useParams, useRouter } from 'next/navigation';
import { createAllergyAction } from '@/actions/health-records.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AddAllergyPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;

  const [state, formAction] = useFormState(createAllergyAction, { errors: {} });

  // Handle successful submission
  if (state.success) {
    router.push(`/students/${studentId}/health-records/allergies`);
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link
          href={`/students/${studentId}/health-records/allergies`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Allergies
        </Link>
      </div>

      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Emergency-Critical Information:</strong> Allergy records are vital for emergency response.
          Ensure all information is accurate and complete, especially for severe or life-threatening allergies.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Add Allergy Record
          </CardTitle>
          <CardDescription>
            Document student allergies for emergency preparedness and daily care management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.errors?._form && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
            </Alert>
          )}

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="studentId" value={studentId} />
            <input type="hidden" name="active" value="true" />

            {/* Allergen Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Allergen Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="allergen">
                    Allergen Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="allergen"
                    name="allergen"
                    placeholder="e.g., Peanuts, Penicillin, Bee Stings"
                    required
                  />
                  {state.errors?.allergen && (
                    <p className="text-sm text-destructive">{state.errors.allergen.join(', ')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergyType">
                    Allergy Type <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="allergyType"
                    name="allergyType"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select type...</option>
                    <option value="FOOD">Food Allergy</option>
                    <option value="MEDICATION">Medication Allergy</option>
                    <option value="ENVIRONMENTAL">Environmental Allergy</option>
                    <option value="INSECT">Insect Allergy</option>
                    <option value="LATEX">Latex Allergy</option>
                    <option value="ANIMAL">Animal Allergy</option>
                    <option value="CHEMICAL">Chemical Allergy</option>
                    <option value="SEASONAL">Seasonal Allergy</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {state.errors?.allergyType && (
                    <p className="text-sm text-destructive">{state.errors.allergyType.join(', ')}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">
                  Severity Level <span className="text-destructive">*</span>
                </Label>
                <select
                  id="severity"
                  name="severity"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select severity...</option>
                  <option value="MILD">Mild - Minor discomfort, no medical intervention needed</option>
                  <option value="MODERATE">Moderate - Requires monitoring and possible treatment</option>
                  <option value="SEVERE">Severe - Requires immediate medical attention</option>
                  <option value="LIFE_THREATENING">Life-Threatening - Risk of anaphylaxis</option>
                </select>
                {state.errors?.severity && (
                  <p className="text-sm text-destructive">{state.errors.severity.join(', ')}</p>
                )}
              </div>
            </div>

            {/* Symptoms & Reactions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Symptoms & Reactions</h3>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Known Symptoms</Label>
                <Textarea
                  id="symptoms"
                  name="symptoms"
                  placeholder="Describe symptoms: hives, swelling, difficulty breathing, etc..."
                  rows={3}
                />
                {state.errors?.symptoms && (
                  <p className="text-sm text-destructive">{state.errors.symptoms.join(', ')}</p>
                )}
              </div>
            </div>

            {/* Treatment Protocol */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Treatment Protocol</h3>

              <div className="space-y-2">
                <Label htmlFor="treatment">Standard Treatment</Label>
                <Textarea
                  id="treatment"
                  name="treatment"
                  placeholder="Standard treatment protocol (antihistamine, inhaler, etc.)..."
                  rows={3}
                />
                {state.errors?.treatment && (
                  <p className="text-sm text-destructive">{state.errors.treatment.join(', ')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyProtocol">
                  Emergency Protocol
                  <span className="text-muted-foreground text-xs ml-2">(Required for Severe/Life-Threatening)</span>
                </Label>
                <Textarea
                  id="emergencyProtocol"
                  name="emergencyProtocol"
                  placeholder="Emergency response procedures: when to use EpiPen, when to call 911, etc..."
                  rows={4}
                />
                {state.errors?.emergencyProtocol && (
                  <p className="text-sm text-destructive">{state.errors.emergencyProtocol.join(', ')}</p>
                )}
              </div>
            </div>

            {/* EpiPen Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">EpiPen Information</h3>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="epiPenRequired"
                  name="epiPenRequired"
                  value="true"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="epiPenRequired" className="font-normal">
                  EpiPen Required
                </Label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="epiPenLocation">
                    EpiPen Storage Location
                    <span className="text-muted-foreground text-xs ml-2">(Required if EpiPen needed)</span>
                  </Label>
                  <Input
                    id="epiPenLocation"
                    name="epiPenLocation"
                    placeholder="e.g., Nurse's Office, Classroom Emergency Kit"
                  />
                  {state.errors?.epiPenLocation && (
                    <p className="text-sm text-destructive">{state.errors.epiPenLocation.join(', ')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="epiPenExpiration">
                    EpiPen Expiration Date
                    <span className="text-muted-foreground text-xs ml-2">(Required if EpiPen needed)</span>
                  </Label>
                  <Input
                    id="epiPenExpiration"
                    name="epiPenExpiration"
                    type="date"
                  />
                  {state.errors?.epiPenExpiration && (
                    <p className="text-sm text-destructive">{state.errors.epiPenExpiration.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnosis Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Diagnosis Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="diagnosedBy">Diagnosed By</Label>
                  <Input
                    id="diagnosedBy"
                    name="diagnosedBy"
                    placeholder="Healthcare provider name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosedDate">Diagnosis Date</Label>
                  <Input
                    id="diagnosedDate"
                    name="diagnosedDate"
                    type="date"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="onsetDate">Onset Date</Label>
                  <Input
                    id="onsetDate"
                    name="onsetDate"
                    type="date"
                  />
                </div>

                <div className="space-y-2 flex items-center">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="verified"
                      name="verified"
                      value="true"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="verified" className="font-normal">
                      Medically Verified
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Notes</h3>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional information about this allergy..."
                  rows={3}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Save Allergy Record
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

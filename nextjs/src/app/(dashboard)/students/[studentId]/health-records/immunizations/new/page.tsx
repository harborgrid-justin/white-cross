/**
 * Add Immunization Page
 * Route: /students/[studentId]/health-records/immunizations/new
 *
 * HIPAA CRITICAL: Form submission triggers audit logging via server action
 */

'use client';

import { useFormState } from 'react-dom';
import { useParams, useRouter } from 'next/navigation';
import { createImmunizationAction } from '@/actions/health-records.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Syringe, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AddImmunizationPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;

  const [state, formAction] = useFormState(createImmunizationAction, { errors: {} });

  // Handle successful submission
  if (state.success) {
    router.push(`/students/${studentId}/health-records/immunizations`);
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link
          href={`/students/${studentId}/health-records/immunizations`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Immunizations
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Add Immunization Record
          </CardTitle>
          <CardDescription>
            Record a new immunization or vaccination for this student. All fields are validated and logged per HIPAA requirements.
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

            {/* Vaccine Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Vaccine Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vaccineName">
                    Vaccine Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="vaccineName"
                    name="vaccineName"
                    placeholder="e.g., MMR, COVID-19, Flu"
                    required
                  />
                  {state.errors?.vaccineName && (
                    <p className="text-sm text-destructive">{state.errors.vaccineName.join(', ')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaccineType">Vaccine Type</Label>
                  <Input
                    id="vaccineType"
                    name="vaccineType"
                    placeholder="e.g., Viral, Bacterial"
                  />
                  {state.errors?.vaccineType && (
                    <p className="text-sm text-destructive">{state.errors.vaccineType.join(', ')}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    placeholder="e.g., Pfizer, Moderna, Johnson & Johnson"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lotNumber">Lot Number</Label>
                  <Input
                    id="lotNumber"
                    name="lotNumber"
                    placeholder="Vaccine lot number"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cvxCode">CVX Code</Label>
                  <Input
                    id="cvxCode"
                    name="cvxCode"
                    placeholder="1-3 digits (CDC code)"
                  />
                  {state.errors?.cvxCode && (
                    <p className="text-sm text-destructive">{state.errors.cvxCode.join(', ')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ndcCode">NDC Code</Label>
                  <Input
                    id="ndcCode"
                    name="ndcCode"
                    placeholder="12345-1234-12"
                  />
                  {state.errors?.ndcCode && (
                    <p className="text-sm text-destructive">{state.errors.ndcCode.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Dosage Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dosage Information</h3>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="doseNumber">Dose Number</Label>
                  <Input
                    id="doseNumber"
                    name="doseNumber"
                    type="number"
                    min="1"
                    placeholder="e.g., 1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalDoses">Total Doses in Series</Label>
                  <Input
                    id="totalDoses"
                    name="totalDoses"
                    type="number"
                    min="1"
                    placeholder="e.g., 3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosageAmount">Dosage Amount</Label>
                  <Input
                    id="dosageAmount"
                    name="dosageAmount"
                    placeholder="e.g., 0.5mL"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="seriesComplete"
                  name="seriesComplete"
                  value="true"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="seriesComplete" className="font-normal">
                  Series Complete
                </Label>
              </div>
            </div>

            {/* Administration Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Administration Details</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="administrationDate">
                    Administration Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="administrationDate"
                    name="administrationDate"
                    type="date"
                    required
                  />
                  {state.errors?.administrationDate && (
                    <p className="text-sm text-destructive">{state.errors.administrationDate.join(', ')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="administeredBy">
                    Administered By <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="administeredBy"
                    name="administeredBy"
                    placeholder="Healthcare provider name"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="administeredByRole">Provider Role</Label>
                  <Input
                    id="administeredByRole"
                    name="administeredByRole"
                    placeholder="e.g., RN, MD, NP"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facility">Facility</Label>
                  <Input
                    id="facility"
                    name="facility"
                    placeholder="Healthcare facility name"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteOfAdministration">Site of Administration</Label>
                  <select
                    id="siteOfAdministration"
                    name="siteOfAdministration"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select site...</option>
                    <option value="LEFT_ARM">Left Arm</option>
                    <option value="RIGHT_ARM">Right Arm</option>
                    <option value="LEFT_DELTOID">Left Deltoid</option>
                    <option value="RIGHT_DELTOID">Right Deltoid</option>
                    <option value="LEFT_THIGH">Left Thigh</option>
                    <option value="RIGHT_THIGH">Right Thigh</option>
                    <option value="ORAL">Oral</option>
                    <option value="NASAL">Nasal</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routeOfAdministration">Route of Administration</Label>
                  <select
                    id="routeOfAdministration"
                    name="routeOfAdministration"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select route...</option>
                    <option value="INTRAMUSCULAR">Intramuscular (IM)</option>
                    <option value="SUBCUTANEOUS">Subcutaneous (SC)</option>
                    <option value="INTRADERMAL">Intradermal (ID)</option>
                    <option value="ORAL">Oral</option>
                    <option value="NASAL">Nasal</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Compliance & Consent */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Compliance & Consent</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="complianceStatus">Compliance Status</Label>
                  <select
                    id="complianceStatus"
                    name="complianceStatus"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="COMPLIANT">Compliant</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="PARTIALLY_COMPLIANT">Partially Compliant</option>
                    <option value="EXEMPT">Exempt</option>
                    <option value="NON_COMPLIANT">Non-Compliant</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextDueDate">Next Dose Due Date</Label>
                  <Input
                    id="nextDueDate"
                    name="nextDueDate"
                    type="date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="consentObtained"
                    name="consentObtained"
                    value="true"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="consentObtained" className="font-normal">
                    Consent Obtained
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consentBy">Consent Provided By</Label>
                <Input
                  id="consentBy"
                  name="consentBy"
                  placeholder="Parent/Guardian name (required if consent obtained)"
                />
                {state.errors?.consentBy && (
                  <p className="text-sm text-destructive">{state.errors.consentBy.join(', ')}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="visProvided"
                  name="visProvided"
                  value="true"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="visProvided" className="font-normal">
                  Vaccine Information Statement (VIS) Provided
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visDate">VIS Date</Label>
                <Input
                  id="visDate"
                  name="visDate"
                  type="date"
                />
                {state.errors?.visDate && (
                  <p className="text-sm text-destructive">{state.errors.visDate.join(', ')}</p>
                )}
              </div>
            </div>

            {/* Reactions & Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Reactions & Notes</h3>

              <div className="space-y-2">
                <Label htmlFor="reactions">Immediate Reactions</Label>
                <Textarea
                  id="reactions"
                  name="reactions"
                  placeholder="Document any immediate reactions observed after vaccination..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional information about this immunization..."
                  rows={3}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Save Immunization Record
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

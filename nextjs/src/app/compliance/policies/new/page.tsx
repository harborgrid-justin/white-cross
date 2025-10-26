import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'New Policy | Compliance | White Cross',
};

export default function NewPolicyPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/compliance/policies">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Create New Policy</h1>
        <p className="text-gray-600 mt-2">Define a new organizational compliance policy</p>
      </div>

      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Policy Title *</Label>
              <Input id="title" placeholder="e.g., Data Breach Response Policy" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Policy Type *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIPAA_PRIVACY">HIPAA Privacy</SelectItem>
                    <SelectItem value="HIPAA_SECURITY">HIPAA Security</SelectItem>
                    <SelectItem value="DATA_BREACH">Data Breach</SelectItem>
                    <SelectItem value="ACCESS_CONTROL">Access Control</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version *</Label>
                <Input id="version" placeholder="1.0.0" defaultValue="1.0.0" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" placeholder="Brief description of policy purpose" rows={3} required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Full policy content (supports markdown)" rows={12} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dates & Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date *</Label>
                <Input type="date" id="effectiveDate" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewDate">Next Review Date *</Label>
                <Input type="date" id="reviewDate" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acknowledgment Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="requiresAck" defaultChecked />
              <Label htmlFor="requiresAck">Requires acknowledgment from users</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="requiresSig" />
              <Label htmlFor="requiresSig">Requires digital signature</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="mandatory" defaultChecked />
              <Label htmlFor="mandatory">Mandatory for all applicable users</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">Save as Draft</Button>
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Publish Policy
          </Button>
        </div>
      </form>
    </div>
  );
}

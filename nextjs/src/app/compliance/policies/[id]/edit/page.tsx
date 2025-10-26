import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Edit Policy | Compliance | White Cross',
};

export default function EditPolicyPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Edit Policy</h1>
      <form className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" defaultValue="HIPAA Privacy Policy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} defaultValue="Comprehensive privacy policy..." />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Policy Content</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={12} defaultValue="Full policy content..." />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit"><Save className="h-4 w-4 mr-2" />Save Changes</Button>
        </div>
      </form>
    </div>
  );
}

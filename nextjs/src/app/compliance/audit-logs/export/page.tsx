import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, Lock, FileText, Table2, FileJson } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Export Audit Logs | Compliance | White Cross',
};

export default function ExportAuditLogsPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Export Audit Logs</h1>
        <p className="text-gray-600 mt-2">
          Export audit logs with encryption and compliance tracking
        </p>
      </div>

      {/* Export Format */}
      <Card>
        <CardHeader>
          <CardTitle>Export Format</CardTitle>
          <CardDescription>Choose the format for your audit log export</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="csv" className="space-y-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex items-center gap-3 flex-1 cursor-pointer">
                <Table2 className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">CSV (Comma-Separated Values)</div>
                  <div className="text-sm text-gray-600">Best for Excel and data analysis</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex items-center gap-3 flex-1 cursor-pointer">
                <FileText className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-medium">PDF (Portable Document Format)</div>
                  <div className="text-sm text-gray-600">Best for archival and reporting</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex items-center gap-3 flex-1 cursor-pointer">
                <FileJson className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">JSON (JavaScript Object Notation)</div>
                  <div className="text-sm text-gray-600">Best for programmatic access and APIs</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Date Range */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
          <CardDescription>Select the time period for audit logs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input type="date" id="startDate" defaultValue={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input type="date" id="endDate" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Configure what data to include in the export</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="includeDetails" defaultChecked />
            <Label htmlFor="includeDetails" className="cursor-pointer">
              Include detailed information (timestamps, IP addresses, user agents)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="includeChanges" defaultChecked />
            <Label htmlFor="includeChanges" className="cursor-pointer">
              Include before/after changes for update operations
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="phiOnly" />
            <Label htmlFor="phiOnly" className="cursor-pointer">
              Export only PHI access events
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="includeHashes" defaultChecked />
            <Label htmlFor="includeHashes" className="cursor-pointer">
              Include verification hashes for tamper detection
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Encryption */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-600" />
            Encryption Settings (Recommended)
          </CardTitle>
          <CardDescription>Protect exported audit logs with encryption</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="encryptExport" defaultChecked />
            <Label htmlFor="encryptExport" className="cursor-pointer font-medium">
              Encrypt export file (AES-256-GCM)
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Encryption Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter a strong password"
              className="bg-white"
            />
            <p className="text-xs text-gray-600">
              Store this password securely. You will need it to decrypt the file.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-gray-600">
          Estimated export size: <span className="font-medium">~2.5 MB</span>
        </p>
        <div className="flex gap-3">
          <Button variant="outline">Cancel</Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Audit Logs
          </Button>
        </div>
      </div>

      {/* Important Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-amber-900 mb-2">Important Notice</h4>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li>Audit log exports are tracked and logged for compliance purposes</li>
            <li>Exported files contain PHI and must be handled according to HIPAA guidelines</li>
            <li>Store exported files securely and delete them when no longer needed</li>
            <li>Do not share unencrypted audit logs via email or unsecured channels</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

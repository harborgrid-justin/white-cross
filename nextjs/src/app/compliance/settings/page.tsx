import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compliance Settings | White Cross',
};

export default function ComplianceSettingsPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3"><Settings className="h-8 w-8 text-gray-500" />Compliance Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log Configuration</CardTitle>
          <CardDescription>Configure audit logging behavior and retention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="retentionPeriod">Audit Log Retention Period</Label>
            <Select defaultValue="6">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Years</SelectItem>
                <SelectItem value="6">6 Years (HIPAA Minimum)</SelectItem>
                <SelectItem value="7">7 Years</SelectItem>
                <SelectItem value="10">10 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="autoArchive" defaultChecked />
            <Label htmlFor="autoArchive">Automatically archive old logs</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="encryptLogs" defaultChecked />
            <Label htmlFor="encryptLogs">Encrypt archived audit logs</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Configuration</CardTitle>
          <CardDescription>Configure compliance alert thresholds and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="failedLoginThreshold">Failed Login Threshold</Label>
            <Input type="number" id="failedLoginThreshold" defaultValue="5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bulkAccessThreshold">Bulk Access Alert Threshold (records)</Label>
            <Input type="number" id="bulkAccessThreshold" defaultValue="50" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="afterHoursAlert" defaultChecked />
            <Label htmlFor="afterHoursAlert">Alert on after-hours PHI access</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="emailNotifications" defaultChecked />
            <Label htmlFor="emailNotifications">Send email notifications for critical alerts</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Policy Management</CardTitle>
          <CardDescription>Configure policy acknowledgment and review cycles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ackDeadline">Acknowledgment Deadline (days)</Label>
            <Input type="number" id="ackDeadline" defaultValue="14" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reviewCycle">Policy Review Cycle (months)</Label>
            <Input type="number" id="reviewCycle" defaultValue="12" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="requireSignature" defaultChecked />
            <Label htmlFor="requireSignature">Require digital signatures for critical policies</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
          <CardDescription>Configure data retention and deletion policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientRecordRetention">Patient Record Retention (years)</Label>
            <Input type="number" id="patientRecordRetention" defaultValue="6" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="autoDelete" />
            <Label htmlFor="autoDelete">Automatically delete records after retention period</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="notifyBeforeDeletion" defaultChecked />
            <Label htmlFor="notifyBeforeDeletion">Notify before scheduled deletion</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="flex items-center gap-2"><Save className="h-4 w-4" />Save Settings</Button>
      </div>
    </div>
  );
}

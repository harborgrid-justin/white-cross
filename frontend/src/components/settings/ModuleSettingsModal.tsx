/**
 * @fileoverview Module Settings Modal Component
 * @module components/settings/ModuleSettingsModal
 * @category Settings
 *
 * Comprehensive modal for configuring module-specific settings across the healthcare platform.
 */

'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Settings, Shield, Bell, Database } from 'lucide-react';

interface ModuleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: 'medications' | 'incidents' | 'communications' | 'health-records' | null;
}

export const ModuleSettingsModal: React.FC<ModuleSettingsModalProps> = ({
  isOpen,
  onClose,
  module,
}) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setHasChanges(false);
    onClose();
  };

  const renderMedicationsSettings = () => (
    <Tabs defaultValue="notifications" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="general">General</TabsTrigger>
      </TabsList>

      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Medication Notifications
            </CardTitle>
            <CardDescription>
              Configure when and how medication reminders are sent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-notifications">Enable notifications</Label>
              <Switch id="enable-notifications" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lead-time">Notification lead time (minutes)</Label>
              <Input
                id="lead-time"
                type="number"
                defaultValue="15"
                min="0"
                max="120"
                className="w-32"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminder-frequency">Reminder frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once only</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="inventory" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Inventory Management
            </CardTitle>
            <CardDescription>
              Track medication stock levels and receive low inventory alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-inventory">Enable inventory tracking</Label>
              <Switch id="enable-inventory" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="low-stock">Low stock alert threshold</Label>
              <Input
                id="low-stock"
                type="number"
                defaultValue="10"
                min="0"
                className="w-32"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reorder-point">Automatic reorder point</Label>
              <Input
                id="reorder-point"
                type="number"
                defaultValue="5"
                min="0"
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="compliance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance & Safety
            </CardTitle>
            <CardDescription>
              Ensure medication administration meets regulatory requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Require witness for controlled substances</Label>
                <p className="text-sm text-muted-foreground">Mandated by federal regulations</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="adherence-tracking">Enable adherence tracking</Label>
              <Switch id="adherence-tracking" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="double-check">Require double-check for high-risk medications</Label>
              <Switch id="double-check" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Default timezone</Label>
              <Select defaultValue="america/new_york">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america/new_york">Eastern Time (ET)</SelectItem>
                  <SelectItem value="america/chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="america/denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="america/los_angeles">Pacific Time (PT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time-format">Time format</Label>
              <Select defaultValue="12">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  const renderIncidentsSettings = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Incident Reporting Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-notify">Auto-notify on critical incidents</Label>
            <Switch id="auto-notify" defaultChecked />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="follow-up-time">Required follow-up time</Label>
            <Select defaultValue="24">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="48">48 hours</SelectItem>
                <SelectItem value="72">72 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="severity-threshold">Parent notification threshold</Label>
            <Select defaultValue="level2">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="level1">Level 1+ (All incidents)</SelectItem>
                <SelectItem value="level2">Level 2+ (Moderate to severe)</SelectItem>
                <SelectItem value="level3">Level 3+ (Severe only)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCommunicationsSettings = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Communication Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="emergency-immediate">Send emergency alerts immediately</Label>
            <Switch id="emergency-immediate" defaultChecked />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="business-hours">Routine message delivery</Label>
            <Select defaultValue="business">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="business">Business hours only</SelectItem>
                <SelectItem value="scheduled">Scheduled times</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="delivery-method">Preferred delivery method</Label>
            <Select defaultValue="both">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email only</SelectItem>
                <SelectItem value="sms">SMS only</SelectItem>
                <SelectItem value="both">Email + SMS</SelectItem>
                <SelectItem value="app">In-app notifications</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHealthRecordsSettings = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Health Records Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">HIPAA Compliance</span>
            </div>
            <p className="text-sm text-amber-700">
              These settings affect HIPAA compliance. Changes require administrator approval.
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Full audit trail logging</Label>
              <p className="text-sm text-muted-foreground">Required by HIPAA</p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="access-level">Default access level</Label>
            <Select defaultValue="authorized">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="authorized">Authorized personnel only</SelectItem>
                <SelectItem value="team">Care team members</SelectItem>
                <SelectItem value="school">School staff (limited)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="retention-period">Data retention period</Label>
            <Select defaultValue="7years">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3years">3 years (minimum)</SelectItem>
                <SelectItem value="5years">5 years</SelectItem>
                <SelectItem value="7years">7 years (recommended)</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getModuleTitle = () => {
    switch (module) {
      case 'medications':
        return 'Medication Management Settings';
      case 'incidents':
        return 'Incident Reporting Settings';
      case 'communications':
        return 'Communication Settings';
      case 'health-records':
        return 'Health Records Settings';
      default:
        return 'Module Settings';
    }
  };

  const renderModuleContent = () => {
    switch (module) {
      case 'medications':
        return renderMedicationsSettings();
      case 'incidents':
        return renderIncidentsSettings();
      case 'communications':
        return renderCommunicationsSettings();
      case 'health-records':
        return renderHealthRecordsSettings();
      default:
        return <div>Module not found</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModuleTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderModuleContent()}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleSettingsModal;
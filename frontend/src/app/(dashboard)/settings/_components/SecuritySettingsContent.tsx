/**
 * @fileoverview Security Settings Content Component
 * @module app/(dashboard)/settings/_components/SecuritySettingsContent
 * @category Settings - Components
 *
 * Security management with password change, 2FA setup, active sessions,
 * and security audit log.
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  Monitor,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  Check,
  LogOut
} from 'lucide-react';

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

interface SecurityEvent {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  ipAddress: string;
}

export function SecuritySettingsContent() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [backupCodesCopied, setBackupCodesCopied] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [activeSessions] = useState<ActiveSession[]>([
    {
      id: '1',
      device: 'Chrome on Windows 11',
      location: 'Los Angeles, CA',
      ipAddress: '192.168.1.100',
      lastActive: '2 minutes ago',
      isCurrent: true
    },
    {
      id: '2',
      device: 'Safari on iPhone 15 Pro',
      location: 'Los Angeles, CA',
      ipAddress: '192.168.1.101',
      lastActive: '3 hours ago',
      isCurrent: false
    },
    {
      id: '3',
      device: 'Edge on Windows 11',
      location: 'San Francisco, CA',
      ipAddress: '10.0.0.50',
      lastActive: '2 days ago',
      isCurrent: false
    }
  ]);

  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'Login',
      description: 'Successful login from Chrome on Windows',
      timestamp: '2 hours ago',
      severity: 'low',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      type: 'Password Change',
      description: 'Password was changed successfully',
      timestamp: '5 days ago',
      severity: 'medium',
      ipAddress: '192.168.1.100'
    },
    {
      id: '3',
      type: 'Failed Login',
      description: 'Failed login attempt detected',
      timestamp: '1 week ago',
      severity: 'high',
      ipAddress: '45.123.45.67'
    }
  ]);

  const backupCodes = [
    'ABCD-1234-EFGH',
    'IJKL-5678-MNOP',
    'QRST-9012-UVWX',
    'YZAB-3456-CDEF',
    'GHIJ-7890-KLMN',
    'OPQR-2345-STUV',
    'WXYZ-6789-ABCD',
    'EFGH-0123-IJKL'
  ];

  const handlePasswordChange = async () => {
    setIsChangingPassword(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsChangingPassword(false);
  };

  const handleEnable2FA = () => {
    setShowQRCode(true);
  };

  const handleDisable2FA = () => {
    if (confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      setTwoFactorEnabled(false);
    }
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setBackupCodesCopied(true);
    setTimeout(() => setBackupCodesCopied(false), 3000);
  };

  const handleRevokeSession = (_sessionId: string) => {
    if (confirm('Are you sure you want to revoke this session? The device will be logged out.')) {
      // Handle session revocation
      // TODO: Implement session revocation API call
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage your password, two-factor authentication, and active sessions
        </p>
      </div>

      {/* Change Password */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        </div>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password *</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password *</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              Password must be at least 12 characters and include uppercase, lowercase, numbers, and special characters.
            </p>
          </div>
          <Button onClick={handlePasswordChange} disabled={isChangingPassword}>
            <Key className="h-4 w-4 mr-2" />
            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
          </Button>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
          </div>
          {twoFactorEnabled ? (
            <Badge variant="success" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              <XCircle className="h-3 w-3 mr-1" />
              Disabled
            </Badge>
          )}
        </div>

        {!twoFactorEnabled ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Add an extra layer of security to your account by requiring a verification code in addition to your password.
            </p>
            {!showQRCode ? (
              <Button onClick={handleEnable2FA}>
                <Smartphone className="h-4 w-4 mr-2" />
                Enable Two-Factor Authentication
              </Button>
            ) : (
              <div className="space-y-4 max-w-md">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
                  <div className="w-48 h-48 mx-auto bg-gray-100 flex items-center justify-center">
                    <p className="text-xs text-gray-500">QR Code Placeholder</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    Scan this QR code with your authenticator app
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Enter Verification Code</Label>
                  <Input
                    id="verificationCode"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                <Button onClick={() => setTwoFactorEnabled(true)} className="w-full">
                  Verify and Enable
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-green-900">2FA is Active</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your account is protected with two-factor authentication using an authenticator app.
                </p>
              </div>
            </div>

            {/* Backup Codes */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Backup Codes</h4>
              <p className="text-xs text-gray-600 mb-3">
                Save these codes in a secure place. Each code can be used once if you lose access to your authenticator.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {backupCodes.map((code, index) => (
                  <code key={index} className="text-xs bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    {code}
                  </code>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyBackupCodes}
                className="w-full"
              >
                {backupCodesCopied ? (
                  <>
                    <Check className="h-3 w-3 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-2" />
                    Copy All Codes
                  </>
                )}
              </Button>
            </div>

            <Button variant="outline" onClick={handleDisable2FA} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              Disable Two-Factor Authentication
            </Button>
          </div>
        )}
      </Card>

      {/* Active Sessions */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Monitor className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Manage devices that are currently logged into your account. Revoke access for any device you don&apos;t recognize.
        </p>
        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900">{session.device}</h4>
                  {session.isCurrent && (
                    <Badge variant="success" className="text-xs">Current</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {session.location} • {session.ipAddress}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Last active: {session.lastActive}
                </p>
              </div>
              {!session.isCurrent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Security Activity Log */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Security Activity Log</h3>
          </div>
          <Button variant="outline" size="sm">
            View All Activity
          </Button>
        </div>
        <div className="space-y-3">
          {securityEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg"
            >
              <div className={`p-2 rounded-lg ${getSeverityColor(event.severity)}`}>
                {event.severity === 'high' && <AlertTriangle className="h-4 w-4" />}
                {event.severity === 'medium' && <Shield className="h-4 w-4" />}
                {event.severity === 'low' && <CheckCircle className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">{event.type}</h4>
                  <span className="text-xs text-gray-500">{event.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                <p className="text-xs text-gray-500 mt-1">IP Address: {event.ipAddress}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Security Recommendations */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900">Security Recommendations</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>Enable two-factor authentication for maximum security</li>
              <li>Change your password every 90 days</li>
              <li>Review active sessions regularly and revoke unknown devices</li>
              <li>Never share your password or backup codes with anyone</li>
              <li>Use a unique password that you don&apos;t use on other sites</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

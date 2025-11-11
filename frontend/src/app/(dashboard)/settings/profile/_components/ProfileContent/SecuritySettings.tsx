/**
 * @fileoverview Security Settings Component - Security configuration and password management
 * @module app/(dashboard)/profile/_components/ProfileContent/SecuritySettings
 * @category Profile - Components
 */

'use client';

import { useState } from 'react';
import { Shield, Check, X, Eye, EyeOff } from 'lucide-react';

interface SecuritySettingsProps {
  profile: {
    security: {
      twoFactorEnabled: boolean;
      lastPasswordChange: string;
    };
  };
  onToggleTwoFactor?: () => Promise<void>;
  onChangePassword?: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>;
  isSubmitting?: boolean;
}

export function SecuritySettings({ profile, onToggleTwoFactor, onChangePassword, isSubmitting = false }: SecuritySettingsProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePasswordChange = async () => {
    if (onChangePassword) {
      try {
        await onChangePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        });
        setShowPasswordForm(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          showCurrent: false,
          showNew: false,
          showConfirm: false
        });
      } catch (error) {
        // Error handling is done in parent component
        console.error('Failed to change password:', error);
      }
    }
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordForm(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showCurrent: false,
      showNew: false,
      showConfirm: false
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Security Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-gray-600">Add an extra layer of security</div>
            </div>
            <div className="flex items-center gap-2">
              {profile.security.twoFactorEnabled ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Enabled</span>
                </>
              ) : (
                <button 
                  onClick={onToggleTwoFactor}
                  disabled={isSubmitting}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Enabling...' : 'Enable'}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Password</div>
              <div className="text-sm text-gray-600">
                Last changed: {formatDate(profile.security.lastPasswordChange)}
              </div>
            </div>
            <button 
              onClick={() => setShowPasswordForm(true)}
              disabled={isSubmitting}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Change Password
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Session Timeout</div>
              <div className="text-sm text-gray-600">Auto logout after inactivity</div>
            </div>
            <select 
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
              aria-label="Session timeout duration"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button 
                onClick={handleCancelPasswordChange}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={passwordForm.showCurrent ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full p-3 border rounded-lg pr-10"
                    placeholder="Enter current password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm(prev => ({ ...prev, showCurrent: !prev.showCurrent }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                    title={passwordForm.showCurrent ? "Hide password" : "Show password"}
                  >
                    {passwordForm.showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={passwordForm.showNew ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full p-3 border rounded-lg pr-10"
                    placeholder="Enter new password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm(prev => ({ ...prev, showNew: !prev.showNew }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                    title={passwordForm.showNew ? "Hide new password" : "Show new password"}
                  >
                    {passwordForm.showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={passwordForm.showConfirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full p-3 border rounded-lg pr-10"
                    placeholder="Confirm new password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm(prev => ({ ...prev, showConfirm: !prev.showConfirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                    title={passwordForm.showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                  >
                    {passwordForm.showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handlePasswordChange}
                  disabled={isSubmitting || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  onClick={handleCancelPasswordChange}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

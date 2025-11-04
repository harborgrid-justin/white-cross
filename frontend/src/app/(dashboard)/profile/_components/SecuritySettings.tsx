/**
 * @fileoverview Security settings component with 2FA and password management
 * @module app/(dashboard)/profile/_components/SecuritySettings
 * @category Profile - Components
 */

'use client';

import { Shield, Check, Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';
import type { UserProfile } from '@/lib/actions/profile.actions';
import { usePasswordChange } from './hooks/usePasswordChange';

interface SecuritySettingsProps {
  profile: UserProfile;
  onToggleTwoFactor: () => Promise<void>;
  onPasswordChange: (userId: string, currentPassword: string, newPassword: string) => Promise<boolean>;
  disabled?: boolean;
}

/**
 * Security settings component
 * Manages 2FA, password changes, and session timeout
 *
 * @component
 * @example
 * ```tsx
 * <SecuritySettings
 *   profile={userProfile}
 *   onToggleTwoFactor={handleToggle2FA}
 *   onPasswordChange={handlePasswordChange}
 * />
 * ```
 */
export function SecuritySettings({
  profile,
  onToggleTwoFactor,
  onPasswordChange,
  disabled = false
}: SecuritySettingsProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const {
    passwordForm,
    setPasswordForm,
    changePassword,
    resetPasswordForm,
    changing,
    changeError
  } = usePasswordChange();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePasswordSubmit = async () => {
    const success = await changePassword(profile.userId);
    if (success) {
      setShowPasswordModal(false);
      resetPasswordForm();
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    resetPasswordForm();
  };

  return (
    <>
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Security Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Two-Factor Authentication */}
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
                  <button
                    onClick={onToggleTwoFactor}
                    disabled={disabled}
                    className="ml-2 px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Disable
                  </button>
                </>
              ) : (
                <button
                  onClick={onToggleTwoFactor}
                  disabled={disabled}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Enable
                </button>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Password</div>
              <div className="text-sm text-gray-600">
                Last changed: {formatDate(profile.security.lastPasswordChange)}
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              disabled={disabled}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Change Password
            </button>
          </div>

          {/* Session Timeout */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Session Timeout</div>
              <div className="text-sm text-gray-600">Auto logout after inactivity</div>
            </div>
            <select
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white disabled:opacity-50"
              aria-label="Session timeout duration"
              disabled={disabled}
              defaultValue="30"
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
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {changeError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {changeError}
              </div>
            )}

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={passwordForm.showCurrent ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm(prev => ({ ...prev, showCurrent: !prev.showCurrent }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={passwordForm.showCurrent ? 'Hide password' : 'Show password'}
                  >
                    {passwordForm.showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={passwordForm.showNew ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm(prev => ({ ...prev, showNew: !prev.showNew }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={passwordForm.showNew ? 'Hide password' : 'Show password'}
                  >
                    {passwordForm.showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={passwordForm.showConfirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm(prev => ({ ...prev, showConfirm: !prev.showConfirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={passwordForm.showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {passwordForm.showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handlePasswordSubmit}
                  disabled={changing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {changing ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  onClick={handleCloseModal}
                  disabled={changing}
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

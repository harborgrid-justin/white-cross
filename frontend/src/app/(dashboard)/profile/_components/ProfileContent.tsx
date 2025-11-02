/**
 * @fileoverview Profile Content Component - User profile management interface
 * @module app/(dashboard)/profile/_components/ProfileContent
 * @category Profile - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Activity, 
  Lock, 
  Edit3,
  Save,
  X,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  Award,
  Clock,
  Check,
  Camera,
  AlertTriangle,
  Download,
  Upload,
  FileText,
  Trash2,
  Eye,
  EyeOff,
  MapPin
} from 'lucide-react';

// Import server actions
import { 
  getCurrentUserProfile, 
  getProfileSettings,
  getSecurityLogs,
  getActiveSessions,
  updateProfileFromForm,
  changePasswordFromForm,
  uploadAvatarAction,
  enableTwoFactorAction,
  disableTwoFactorAction,
  type UserProfile,
  type ProfileSettings,
  type SecurityLog,
  type ActiveSession
} from '@/lib/actions/profile.actions';

interface ProfileContentProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function ProfileContent({ }: ProfileContentProps) {
  // Profile data state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for editing modes
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [editingEmergency, setEditingEmergency] = useState(false);
  
  // Form states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false
  });

  // Submitting states
  const [submitting, setSubmitting] = useState(false);

  // Load profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all profile data concurrently
        const [profileData, settingsData, logsData, sessionsData] = await Promise.all([
          getCurrentUserProfile(),
          getProfileSettings('current'), // Use 'current' for current user
          getSecurityLogs('current', 10),
          getActiveSessions('current')
        ]);

        setProfile(profileData);
        setSettings(settingsData);
        setSecurityLogs(logsData);
        setSessions(sessionsData);
      } catch (err) {
        console.error('Failed to load profile data:', err);
        setError('Failed to load profile data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCertificationStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (formData: FormData) => {
    if (!profile) return;
    
    try {
      setSubmitting(true);
      const result = await updateProfileFromForm(profile.userId, formData);
      
      if (result.success && result.data) {
        setProfile(result.data);
        setEditingPersonal(false);
        setError(null);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!profile) return;
    
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('currentPassword', passwordForm.currentPassword);
      formData.append('newPassword', passwordForm.newPassword);
      formData.append('confirmPassword', passwordForm.confirmPassword);
      
      const result = await changePasswordFromForm(profile.userId, formData);
      
      if (result.success) {
        setShowPasswordForm(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          showCurrent: false,
          showNew: false,
          showConfirm: false
        });
        setError(null);
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (err) {
      setError('Failed to change password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle 2FA toggle
  const handleTwoFactorToggle = async () => {
    if (!profile) return;
    
    try {
      setSubmitting(true);
      const result = profile.twoFactorEnabled 
        ? await disableTwoFactorAction(profile.userId)
        : await enableTwoFactorAction(profile.userId);
      
      if (result.success) {
        // Reload profile to get updated 2FA status
        const updatedProfile = await getCurrentUserProfile();
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
        setError(null);
      } else {
        setError(result.error || 'Failed to update two-factor authentication');
      }
    } catch (err) {
      setError('Failed to update two-factor authentication. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </div>
              )}
              <button 
                title="Upload profile picture"
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border hover:bg-gray-50 transition-colors"
              >
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-lg text-gray-600 mt-1">{profile.title}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  {profile.department}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="h-4 w-4" />
                  ID: {profile.employeeId}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Hired: {formatDate(profile.hireDate)}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Last login: {formatDateTime(profile.lastLogin)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Edit3 className="h-4 w-4 mr-2 inline" />
              Edit Profile
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-2 inline" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>
            <button 
              onClick={() => setEditingPersonal(!editingPersonal)}
              className="text-blue-600 hover:text-blue-700"
            >
              {editingPersonal ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={profile.firstName}
                  disabled={!editingPersonal}
                  className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={profile.lastName}
                  disabled={!editingPersonal}
                  className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                id="jobTitle"
                type="text"
                value={profile.title}
                disabled={!editingPersonal}
                className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                id="department"
                type="text"
                value={profile.department}
                disabled={!editingPersonal}
                className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {editingPersonal && (
              <div className="flex gap-3">
                <button 
                  onClick={() => setEditingPersonal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Changes
                </button>
                <button 
                  onClick={() => setEditingPersonal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Contact Information</h2>
            </div>
            <button 
              onClick={() => setEditingContact(!editingContact)}
              className="text-blue-600 hover:text-blue-700"
            >
              {editingContact ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  disabled={!editingContact}
                  className="flex-1 p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={profile.phone}
                  disabled={!editingContact}
                  className="flex-1 p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={profile.address.street}
                    placeholder="Street Address"
                    disabled={!editingContact}
                    className="flex-1 p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-3 pl-6">
                  <input
                    type="text"
                    value={profile.address.city}
                    placeholder="City"
                    disabled={!editingContact}
                    className="p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                  />
                  <input
                    type="text"
                    value={profile.address.state}
                    placeholder="State"
                    disabled={!editingContact}
                    className="p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                  />
                  <input
                    type="text"
                    value={profile.address.zipCode}
                    placeholder="ZIP Code"
                    disabled={!editingContact}
                    className="p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>
            </div>

            {editingContact && (
              <div className="flex gap-3">
                <button 
                  onClick={() => setEditingContact(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Changes
                </button>
                <button 
                  onClick={() => setEditingContact(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Emergency Contact</h2>
            </div>
            <button 
              onClick={() => setEditingEmergency(!editingEmergency)}
              className="text-blue-600 hover:text-blue-700"
            >
              {editingEmergency ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              <input
                type="text"
                value={profile.emergencyContact.name}
                disabled={!editingEmergency}
                className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <input
                type="text"
                value={profile.emergencyContact.relationship}
                disabled={!editingEmergency}
                className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={profile.emergencyContact.phone}
                disabled={!editingEmergency}
                className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {editingEmergency && (
              <div className="flex gap-3">
                <button 
                  onClick={() => setEditingEmergency(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Changes
                </button>
                <button 
                  onClick={() => setEditingEmergency(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Settings */}
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
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                    Enable
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
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
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
                <option value="30" selected>30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            {/* Password Change Modal */}
            {showPasswordForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Change Password</h3>
                    <button 
                      onClick={() => setShowPasswordForm(false)}
                      className="text-gray-400 hover:text-gray-600"
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
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordForm(prev => ({ ...prev, showCurrent: !prev.showCurrent }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordForm(prev => ({ ...prev, showNew: !prev.showNew }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordForm(prev => ({ ...prev, showConfirm: !prev.showConfirm }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {passwordForm.showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handlePasswordChange}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Change Password
                      </button>
                      <button
                        onClick={() => setShowPasswordForm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Certifications & Licenses</h2>
          </div>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4 mr-2 inline" />
            Upload Certificate
          </button>
        </div>

        <div className="space-y-3">
          {profile.certifications.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium">{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCertificationStatusColor(cert.status)}`}>
                    {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>Issued: {formatDate(cert.issueDate)}</span>
                  <span>Expires: {formatDate(cert.expiryDate)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button title="View certificate details" className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <FileText className="h-4 w-4" />
                </button>
                <button title="Download certificate" className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <button title="Delete certificate" className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-1 border border-gray-300 rounded text-sm bg-white">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors">
              Export
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {profile.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.resource}</div>
                  <div className="text-xs text-gray-500">{activity.device}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">{formatDateTime(activity.timestamp)}</div>
                <div className="text-xs text-gray-500">IP: {activity.ipAddress}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Activity
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Preferences</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Notifications */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notification Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-gray-600">Receive updates via email</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.preferences.emailNotifications}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">SMS Notifications</div>
                  <div className="text-sm text-gray-600">Receive updates via text</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.preferences.smsNotifications}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Desktop Notifications</div>
                  <div className="text-sm text-gray-600">Show browser notifications</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.preferences.desktopNotifications}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <h3 className="font-medium mb-3">Display & Language</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={profile.preferences.language}
                  className="w-full p-3 border rounded-lg bg-white"
                >
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                  <option value="fr-FR">Français</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <select
                  value={profile.preferences.timezone}
                  className="w-full p-3 border rounded-lg bg-white"
                >
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select
                  value={profile.preferences.theme}
                  className="w-full p-3 border rounded-lg bg-white"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * @fileoverview Profile Settings Content Component
 * @module app/(dashboard)/settings/_components/ProfileSettingsContent
 * @category Settings - Components
 *
 * Comprehensive profile management with avatar upload, personal information,
 * professional details, certifications, and real-time data from profile actions.
 * 
 * Migrated and integrated from app/(dashboard)/profile/_components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Upload,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Edit2,
  Award,
  Loader2,
  FileText
} from 'lucide-react';

// Import profile server actions
import {
  getCurrentUserProfile,
  updateProfileFromForm,
  type UserProfile
} from '@/lib/actions/profile.actions';

export function ProfileSettingsContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    title: '',
    department: ''
  });

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentUserProfile();
        if (data) {
          setProfile(data);
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phone: data.phone || '',
            title: data.title || '',
            department: data.department || ''
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Create FormData for the server action
      const form = new FormData();
      form.append('firstName', formData.firstName);
      form.append('lastName', formData.lastName);
      form.append('phone', formData.phone);
      form.append('title', formData.title);
      form.append('department', formData.department);

      const result = await updateProfileFromForm(profile.userId, form);
      
      if (result.success && result.data) {
        setProfile(result.data);
        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        title: profile.title || '',
        department: profile.department || ''
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCertificationStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-3 text-red-600">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <h3 className="font-semibold">Error Loading Profile</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-600">
          <p>No profile data available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your personal information and professional details
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Changes saved</span>
            </div>
          )}
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3 text-red-800">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <h4 className="font-semibold">Error</h4>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Avatar Section */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={`${profile.firstName} ${profile.lastName}`}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-gray-200">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
            )}
            {isEditing && (
              <button 
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50"
                aria-label="Upload profile photo"
                title="Upload profile photo"
              >
                <Upload className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-sm text-gray-600">{profile.title || 'No title set'}</p>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {profile.department || 'No department'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined {formatDate(profile.hireDate)}
              </span>
            </div>
            <div className="mt-3">
              <Badge variant={profile.isActive ? 'success' : 'secondary'} className="text-xs">
                {profile.isActive ? 'Active' : 'Inactive'}
              </Badge>
              {profile.emailVerified && (
                <Badge variant="success" className="text-xs ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Email Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
              placeholder="Enter last name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={profile.email}
                className="pl-10"
                disabled
                placeholder="your.email@example.com"
              />
            </div>
            <p className="text-xs text-gray-500">Email cannot be changed. Contact an administrator.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10"
                disabled={!isEditing}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Professional Details */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Professional Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={!isEditing}
              placeholder="e.g., School Nurse"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              disabled={!isEditing}
              placeholder="e.g., Health Services"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Role cannot be changed. Contact an administrator.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              value={profile.employeeId}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      {profile.emergencyContact && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input
                value={profile.emergencyContact.name}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Input
                value={profile.emergencyContact.relationship}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={profile.emergencyContact.phone}
                  className="pl-10 bg-gray-50"
                  disabled
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            To update your emergency contact information, please contact HR or your administrator.
          </p>
        </Card>
      )}

      {/* Address */}
      {profile.address && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label>Street Address</Label>
              <Input
                value={profile.address.street}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={profile.address.city}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input
                value={profile.address.state}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>ZIP Code</Label>
              <Input
                value={profile.address.zipCode}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            To update your address, please contact HR or your administrator.
          </p>
        </Card>
      )}

      {/* Certifications & Licenses */}
      {profile.certifications && profile.certifications.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Certifications & Licenses</h3>
            </div>
            <Badge variant="secondary" className="text-xs">
              {profile.certifications.length} certification{profile.certifications.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="space-y-3">
            {profile.certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                    <Badge 
                      className={`text-xs ${getCertificationStatusColor(cert.status)}`}
                    >
                      {cert.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Issued by: {cert.issuer}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Issue Date: {formatDate(cert.issueDate)}</span>
                    <span>•</span>
                    <span>Expiry: {formatDate(cert.expiryDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              aria-label="Select timezone"
              value={profile.timezone}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:text-gray-500"
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
            </select>
            <p className="text-xs text-gray-500">To change preferences, visit the Appearance settings page.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              aria-label="Select language"
              value={profile.locale}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:text-gray-500"
            >
              <option value="en-US">English (US)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Input
              id="dateFormat"
              value={profile.dateFormat}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeFormat">Time Format</Label>
            <Input
              id="timeFormat"
              value={profile.timeFormat === '12h' ? '12-hour' : '24-hour'}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
      </Card>

      {/* Account Status */}
      <Card className="p-6 bg-gray-50 border-gray-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Account Information</h4>
            <p className="text-sm text-gray-600 mt-1">
              Your account is active and in good standing.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span>Account created: {formatDate(profile.createdAt)}</span>
              <span>•</span>
              <span>Last updated: {formatDate(profile.updatedAt)}</span>
              {profile.lastLoginAt && (
                <>
                  <span>•</span>
                  <span>Last login: {formatDate(profile.lastLoginAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * AvatarUpload Component
 * Handles user avatar image upload and display
 */

'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AvatarUploadProps, UploadProgress } from './types/profile.types';
import { 
  validateFile, 
  AVATAR_VALIDATION, 
  getAvatarInitials, 
  getAvatarColor,
  formatFileSize 
} from './utils/profileUtils';

/**
 * Avatar upload component with drag and drop support
 */
export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onUpload,
  loading = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user info for fallback avatar (this would come from context in real app)
  const userFirstName = "User"; // This should come from user context
  const userLastName = "Name"; // This should come from user context
  const userName = `${userFirstName} ${userLastName}`;

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file, AVATAR_VALIDATION);
    
    if (!validation.isValid) {
      alert(`Upload failed: ${validation.errors.join(', ')}`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });
      
      // Simulate upload progress (in real app, this would be tracked from the API)
      const simulateProgress = () => {
        let loaded = 0;
        const increment = file.size / 20;
        
        const progressInterval = setInterval(() => {
          loaded += increment;
          const percentage = Math.min((loaded / file.size) * 100, 100);
          
          setUploadProgress({
            loaded: Math.min(loaded, file.size),
            total: file.size,
            percentage
          });
          
          if (percentage >= 100) {
            clearInterval(progressInterval);
          }
        }, 100);
      };

      simulateProgress();
      
      await onUpload(file);
      
      setUploadProgress(null);
      setPreviewUrl(null);
      
      // Success feedback would be shown by parent component
      
    } catch (error) {
      setUploadProgress(null);
      setPreviewUrl(null);
      console.error('Upload failed:', error);
      // Error handling would be done by parent component
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelUpload = () => {
    setUploadProgress(null);
    setPreviewUrl(null);
  };

  const displayAvatar = previewUrl || currentAvatar;
  const initials = getAvatarInitials(userFirstName, userLastName);
  const avatarColor = getAvatarColor(userName);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <User className="h-5 w-5" />
        Profile Picture
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar Display */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt="Profile picture"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full ${avatarColor} flex items-center justify-center text-white text-lg font-semibold`}>
                {initials}
              </div>
            )}
          </div>
          
          {/* Upload Progress Overlay */}
          {uploadProgress && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-sm font-medium">
                  {Math.round(uploadProgress.percentage)}%
                </div>
                <div className="w-12 bg-gray-300 rounded-full h-1 mt-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 min-w-0">
          {uploadProgress ? (
            /* Upload in Progress */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Uploading... ({formatFileSize(uploadProgress.loaded)} / {formatFileSize(uploadProgress.total)})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelUpload}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
            </div>
          ) : (
            /* Upload Options */
            <div className="space-y-4">
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Drop an image here, or{' '}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        onClick={handleButtonClick}
                        disabled={loading}
                      >
                        click to browse
                      </button>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum file size: {formatFileSize(AVATAR_VALIDATION.maxSize)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <Button
                variant="outline"
                onClick={handleButtonClick}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <Camera className="h-4 w-4 mr-2" />
                Choose Photo
              </Button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={AVATAR_VALIDATION.allowedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Current Avatar Info */}
      {currentAvatar && !uploadProgress && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Current profile picture uploaded on{' '}
            <span className="font-medium">
              {new Date().toLocaleDateString()}
            </span>
          </p>
        </div>
      )}
    </Card>
  );
};
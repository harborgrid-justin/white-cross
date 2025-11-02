/**
 * File upload API endpoint
 * Handles file uploads with validation and security checks
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { withAuth } from '@/middleware/withAuth';
import { auditLog, AUDIT_ACTIONS, createAuditContext } from '@/lib/audit';

// Allowed file types (MIME types)
const ALLOWED_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'text/plain': '.txt',
  'text/csv': '.csv'
} as const;

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * POST /api/upload
 * Upload file to server
 */
export const POST = withAuth(async (request: NextRequest, context, auth) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES]) {
      return NextResponse.json(
        {
          error: 'Invalid file type',
          message: `Allowed types: ${Object.keys(ALLOWED_TYPES).join(', ')}`
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'File too large',
          message: `Maximum file size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES];
    const safeFilename = `${timestamp}-${randomString}${extension}`;

    // Determine upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', category);

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = join(uploadDir, safeFilename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate public URL
    const publicUrl = `/uploads/${category}/${safeFilename}`;

    // Audit log
    const auditContext = createAuditContext(request, auth.user.userId);
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.UPLOAD_DOCUMENT,
      resource: 'Document',
      details: `Uploaded file: ${file.name}, size: ${file.size}, type: ${file.type}`,
      changes: {
        originalName: file.name,
        storedName: safeFilename,
        size: file.size,
        type: file.type,
        category,
        url: publicUrl
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        filename: safeFilename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        category,
        url: publicUrl
      }
    }, { status: 201 });
  } catch (error) {
    console.error('File upload error:', error);

    return NextResponse.json(
      {
        error: 'File upload failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});

/**
 * GET /api/upload
 * Get upload configuration and limits
 */
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  return NextResponse.json({
    maxFileSize: MAX_FILE_SIZE,
    maxFileSizeMB: MAX_FILE_SIZE / 1024 / 1024,
    allowedTypes: Object.keys(ALLOWED_TYPES),
    allowedExtensions: Object.values(ALLOWED_TYPES)
  });
});

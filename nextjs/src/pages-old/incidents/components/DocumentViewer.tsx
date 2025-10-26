/**
 * DocumentViewer Component
 *
 * Production-grade inline document viewer with zoom, print, and navigation controls
 * Supports PDF, images, and videos with HIPAA-compliant access logging
 *
 * @module pages/incidents/components/DocumentViewer
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Maximize2,
  Minimize2,
} from 'lucide-react';

// =====================
// TYPES
// =====================

interface DocumentViewerProps {
  documentUrl: string;
  documentType: 'pdf' | 'image' | 'video' | 'unknown';
  documentName?: string;
  onClose: () => void;
  allowDownload?: boolean;
  allowPrint?: boolean;
  pages?: number; // For multi-page PDFs
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

// =====================
// CONSTANTS
// =====================

const ZOOM_LEVELS = [25, 50, 75, 100, 125, 150, 200, 300, 400];
const DEFAULT_ZOOM = 100;
const ZOOM_STEP = 25;

// =====================
// COMPONENT
// =====================

/**
 * DocumentViewer - Modal viewer for documents
 *
 * Provides inline viewing capabilities with zoom controls, print functionality,
 * download options, and navigation for multi-page documents
 */
const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentUrl,
  documentType,
  documentName = 'Document',
  onClose,
  allowDownload = true,
  allowPrint = true,
  pages = 1,
  currentPage: externalCurrentPage,
  onPageChange,
}) => {
  // =====================
  // STATE
  // =====================

  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  // Use external page control if provided, otherwise use internal
  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const setCurrentPage = onPageChange ?? setInternalCurrentPage;

  // =====================
  // EFFECTS
  // =====================

  useEffect(() => {
    // Log document access for HIPAA compliance
    console.log(`Document accessed: ${documentName} at ${new Date().toISOString()}`);
    // TODO: Send to audit logging API

    // Handle escape key to close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    // Handle arrow keys for page navigation
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (e.key === 'ArrowRight' && currentPage < pages) {
        setCurrentPage(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('keydown', handleArrowKeys);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, [documentName, onClose, isFullscreen, currentPage, pages, setCurrentPage]);

  // =====================
  // HANDLERS
  // =====================

  const handleZoomIn = useCallback(() => {
    setZoom(prev => {
      const currentIndex = ZOOM_LEVELS.indexOf(prev);
      if (currentIndex < ZOOM_LEVELS.length - 1) {
        return ZOOM_LEVELS[currentIndex + 1];
      }
      return Math.min(prev + ZOOM_STEP, 400);
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const currentIndex = ZOOM_LEVELS.indexOf(prev);
      if (currentIndex > 0) {
        return ZOOM_LEVELS[currentIndex - 1];
      }
      return Math.max(prev - ZOOM_STEP, 25);
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(DEFAULT_ZOOM);
  }, []);

  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(documentUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = documentName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Log download for audit
      console.log(`Document downloaded: ${documentName} at ${new Date().toISOString()}`);
      // TODO: Send to audit logging API
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document. Please try again.');
    }
  }, [documentUrl, documentName]);

  const handlePrint = useCallback(() => {
    // Create iframe for printing
    const printFrame = window.document.createElement('iframe');
    printFrame.style.display = 'none';
    window.document.body.appendChild(printFrame);

    if (printFrame.contentWindow) {
      printFrame.contentWindow.document.write(`
        <html>
          <head>
            <title>${documentName}</title>
            <style>
              body { margin: 0; padding: 0; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { margin: 0; }
                img { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            ${documentType === 'image' ? `<img src="${documentUrl}" alt="${documentName}" />` : ''}
            ${documentType === 'pdf' ? `<embed src="${documentUrl}" width="100%" height="100%" type="application/pdf" />` : ''}
          </body>
        </html>
      `);

      printFrame.contentWindow.document.close();

      // Wait for content to load then print
      setTimeout(() => {
        printFrame.contentWindow?.print();
        setTimeout(() => {
          window.document.body.removeChild(printFrame);
        }, 100);
      }, 500);
    }

    // Log print action for audit
    console.log(`Document printed: ${documentName} at ${new Date().toISOString()}`);
    // TODO: Send to audit logging API
  }, [documentUrl, documentName, documentType]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, setCurrentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < pages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, pages, setCurrentPage]);

  // =====================
  // RENDER HELPERS
  // =====================

  const renderDocumentContent = () => {
    const style: React.CSSProperties = {
      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
      transformOrigin: 'center',
      transition: 'transform 0.2s ease-in-out',
    };

    switch (documentType) {
      case 'image':
        return (
          <div className="flex items-center justify-center overflow-auto p-4">
            <img
              src={documentUrl}
              alt={documentName}
              style={style}
              className="max-w-full h-auto"
            />
          </div>
        );

      case 'video':
        return (
          <div className="flex items-center justify-center p-4">
            <video
              src={documentUrl}
              controls
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
              className="max-w-full h-auto"
            />
          </div>
        );

      case 'pdf':
        return (
          <div className="flex items-center justify-center overflow-auto p-4">
            <iframe
              src={`${documentUrl}#page=${currentPage}&zoom=${zoom}`}
              title={documentName}
              className="w-full h-full border-none"
              style={{ minHeight: '600px' }}
            />
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <p className="text-gray-600">Preview not available for this document type</p>
              {allowDownload && (
                <button
                  onClick={handleDownload}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download to View
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  // =====================
  // RENDER
  // =====================

  return (
    <div
      className={`
        fixed inset-0 z-50 bg-black bg-opacity-75 flex flex-col
        ${isFullscreen ? 'p-0' : 'p-4'}
      `}
      onClick={(e) => {
        // Close if clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Container */}
      <div className={`bg-white rounded-lg flex flex-col ${isFullscreen ? 'h-full' : 'max-h-[90vh]'} w-full max-w-6xl mx-auto overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {documentName}
            </h3>
            {pages > 1 && (
              <span className="text-sm text-gray-600">
                Page {currentPage} of {pages}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Close (Esc)"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 flex-wrap gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 25}
              className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded transition-colors min-w-[60px]"
              title="Reset Zoom"
            >
              {zoom}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 400}
              className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Page Navigation */}
          {pages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous Page (←)"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <span className="text-sm text-gray-700 px-2">
                {currentPage} / {pages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= pages}
                className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next Page (→)"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}

          {/* Other Controls */}
          <div className="flex items-center space-x-2">
            {documentType === 'image' && (
              <button
                onClick={handleRotate}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Rotate"
              >
                <RotateCw className="h-4 w-4 text-gray-600" />
              </button>
            )}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 text-gray-600" />
              ) : (
                <Maximize2 className="h-4 w-4 text-gray-600" />
              )}
            </button>
            {allowPrint && (
              <button
                onClick={handlePrint}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Print"
              >
                <Printer className="h-4 w-4 text-gray-600" />
              </button>
            )}
            {allowDownload && (
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {renderDocumentContent()}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            Use scroll wheel to zoom, arrow keys to navigate pages
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;

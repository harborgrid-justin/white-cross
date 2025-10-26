/**
 * SignatureCanvas component
 *
 * @module components/signatures/SignatureCanvas
 * @description Canvas for capturing digital signatures
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface SignatureCanvasProps {
  /** Canvas width */
  width?: number;

  /** Canvas height */
  height?: number;

  /** Pen color */
  penColor?: string;

  /** Pen width */
  penWidth?: number;

  /** On signature change */
  onChange?: (signatureData: string | null) => void;

  /** Disabled state */
  disabled?: boolean;

  /** Class name */
  className?: string;
}

export function SignatureCanvas({
  width = 600,
  height = 200,
  penColor = '#000000',
  penWidth = 2,
  onChange,
  disabled = false,
  className = ''
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set drawing styles
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [width, height, penColor, penWidth]);

  const getCoordinates = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ('touches' in event) {
        // Touch event
        const touch = event.touches[0] || event.changedTouches[0];
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY
        };
      } else {
        // Mouse event
        return {
          x: (event.clientX - rect.left) * scaleX,
          y: (event.clientY - rect.top) * scaleY
        };
      }
    },
    []
  );

  const startDrawing = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (disabled) return;

      event.preventDefault();
      const coords = getCoordinates(event);
      if (!coords) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    },
    [disabled, getCoordinates]
  );

  const draw = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing || disabled) return;

      event.preventDefault();
      const coords = getCoordinates(event);
      if (!coords) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();

      if (isEmpty) {
        setIsEmpty(false);
      }
    },
    [isDrawing, disabled, isEmpty, getCoordinates]
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;

    setIsDrawing(false);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.closePath();

    // Emit signature data
    if (!isEmpty && onChange) {
      const signatureData = canvas?.toDataURL('image/png') || null;
      onChange(signatureData);
    }
  }, [isDrawing, isEmpty, onChange]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onChange?.(null);
  }, [onChange]);

  return (
    <div className={className}>
      <div className="relative border-2 border-gray-300 rounded-lg bg-white">
        <canvas
          ref={canvasRef}
          className={`touch-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-crosshair'}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ width: '100%', height: 'auto' }}
        />

        {isEmpty && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-400 text-sm">Sign here</p>
          </div>
        )}
      </div>

      {!isEmpty && (
        <button
          type="button"
          onClick={clear}
          disabled={disabled}
          className="mt-2 text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Signature
        </button>
      )}
    </div>
  );
}

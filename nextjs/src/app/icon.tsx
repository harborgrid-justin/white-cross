/**
 * Dynamic App Icon Generation
 * Generates favicon and app icons dynamically
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
 */

import { ImageResponse } from 'next/og';

// Image metadata
export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

/**
 * Generate favicon with medical cross
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#2563eb',
          borderRadius: '6px',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'relative',
            width: '20px',
            height: '20px',
          }}
        >
          {/* Vertical bar */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '20px',
              background: 'white',
              borderRadius: '1px',
            }}
          />
          {/* Horizontal bar */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '0',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '6px',
              background: 'white',
              borderRadius: '1px',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

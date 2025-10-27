/**
 * Apple Touch Icon Generation
 * Generates Apple-specific app icon for iOS devices
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
 */

import { ImageResponse } from 'next/og';

// Image metadata
export const runtime = 'edge';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

/**
 * Generate Apple touch icon with medical cross
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          borderRadius: '36px',
        }}
      >
        {/* White circle background */}
        <div
          style={{
            width: '130px',
            height: '130px',
            background: 'white',
            borderRadius: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Medical cross */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: '80px',
              height: '80px',
            }}
          >
            {/* Vertical bar */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '24px',
                height: '80px',
                background: '#ef4444',
                borderRadius: '4px',
              }}
            />
            {/* Horizontal bar */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)',
                width: '80px',
                height: '24px',
                background: '#ef4444',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

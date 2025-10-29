/**
 * Root Open Graph Image Generation
 * Generates dynamic OG image for social media sharing
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */

import { ImageResponse } from 'next/og';

// Image metadata
export const runtime = 'edge';
export const alt = 'White Cross Healthcare Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

/**
 * Generate Open Graph image with brand colors and logo
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '60px',
                height: '60px',
                margin: '10px',
                borderRadius: '12px',
                background: 'white',
              }}
            />
          ))}
        </div>

        {/* Medical cross icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              background: 'white',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                position: 'relative',
                width: '80px',
                height: '80px',
              }}
            >
              {/* Vertical bar of cross */}
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
              {/* Horizontal bar of cross */}
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

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          White Cross
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '32px',
            fontWeight: '400',
            textAlign: 'center',
            opacity: 0.95,
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          Enterprise Healthcare Platform for School Nurses
        </div>

        {/* Badge */}
        <div
          style={{
            marginTop: '40px',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '12px 32px',
            borderRadius: '100px',
            fontSize: '24px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          HIPAA Compliant • Secure • Trusted
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

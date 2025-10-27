/**
 * Root Twitter Card Image Generation
 * Generates dynamic Twitter card image for social media sharing
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */

import { ImageResponse } from 'next/og';

// Image metadata
export const runtime = 'edge';
export const alt = 'White Cross Healthcare Platform';
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = 'image/png';

/**
 * Generate Twitter card image optimized for Twitter's display
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 56,
          background: 'linear-gradient(to right, #1e40af, #3b82f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px 80px',
        }}
      >
        {/* Left content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '700px',
          }}
        >
          {/* Logo and title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'white',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '24px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  position: 'relative',
                  width: '50px',
                  height: '50px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '16px',
                    height: '50px',
                    background: '#ef4444',
                    borderRadius: '3px',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '0',
                    transform: 'translateY(-50%)',
                    width: '50px',
                    height: '16px',
                    background: '#ef4444',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </div>
            <div
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
              }}
            >
              White Cross
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '28px',
              fontWeight: '400',
              opacity: 0.95,
              lineHeight: 1.5,
              marginBottom: '30px',
            }}
          >
            Enterprise healthcare platform for managing student health records,
            medications, and emergency communications
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '20px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              HIPAA Compliant
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '20px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              Secure
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '20px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              Trusted
            </div>
          </div>
        </div>

        {/* Right decorative elements */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            opacity: 0.3,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '60px',
                height: '60px',
                background: 'white',
                borderRadius: '12px',
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

/**
 * Robots.txt Configuration for White Cross Healthcare Platform
 *
 * This file is blocked from indexing due to HIPAA compliance requirements.
 * Healthcare platforms containing Protected Health Information (PHI) should
 * not be indexed by search engines.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://whitecross.healthcare'}/sitemap.xml`,
  };
}

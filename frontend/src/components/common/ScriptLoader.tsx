/**
 * Script Loader Component with Next.js Script Optimization
 *
 * Provides optimized script loading with proper strategies:
 * - beforeInteractive: Critical scripts that must load before page is interactive
 * - afterInteractive: Scripts that can load after page is interactive (default)
 * - lazyOnload: Scripts that can be deferred until browser is idle
 * - worker: Load script in a web worker (experimental)
 *
 * @see https://nextjs.org/docs/app/api-reference/components/script
 */

'use client';

import Script from 'next/script';
import { useState } from 'react';

export type ScriptStrategy = 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker';

export interface ScriptConfig {
  /**
   * Unique identifier for the script
   */
  id: string;

  /**
   * Script source URL
   */
  src: string;

  /**
   * Loading strategy
   * @default 'afterInteractive'
   */
  strategy?: ScriptStrategy;

  /**
   * Callback when script loads successfully
   */
  onLoad?: () => void;

  /**
   * Callback when script loading fails
   */
  onError?: (error: Error) => void;

  /**
   * Callback when script is ready
   */
  onReady?: () => void;

  /**
   * Inline script content (alternative to src)
   */
  dangerouslySetInnerHTML?: string;

  /**
   * Additional HTML attributes
   */
  [key: string]: any;
}

interface ScriptLoaderProps {
  /**
   * Array of scripts to load
   */
  scripts: ScriptConfig[];

  /**
   * Show loading indicator
   * @default false
   */
  showLoadingIndicator?: boolean;

  /**
   * Callback when all scripts are loaded
   */
  onAllLoaded?: () => void;
}

/**
 * Optimized script loader component
 *
 * @example
 * ```tsx
 * <ScriptLoader
 *   scripts={[
 *     {
 *       id: 'google-analytics',
 *       src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID',
 *       strategy: 'afterInteractive',
 *       onLoad: () => console.log('GA loaded')
 *     },
 *     {
 *       id: 'stripe',
 *       src: 'https://js.stripe.com/v3/',
 *       strategy: 'lazyOnload'
 *     }
 *   ]}
 *   onAllLoaded={() => console.log('All scripts loaded')}
 * />
 * ```
 */
export function ScriptLoader({
  scripts,
  showLoadingIndicator = false,
  onAllLoaded,
}: ScriptLoaderProps) {
  const [loadedScripts, setLoadedScripts] = useState<Set<string>>(new Set());
  const [failedScripts, setFailedScripts] = useState<Set<string>>(new Set());

  const handleLoad = (scriptId: string, onLoad?: () => void) => {
    setLoadedScripts((prev) => {
      const newSet = new Set(prev);
      newSet.add(scriptId);

      // Check if all scripts are loaded
      if (newSet.size + failedScripts.size === scripts.length) {
        onAllLoaded?.();
      }

      return newSet;
    });

    onLoad?.();
  };

  const handleError = (scriptId: string, onError?: (error: Error) => void) => {
    const error = new Error(`Failed to load script: ${scriptId}`);

    setFailedScripts((prev) => {
      const newSet = new Set(prev);
      newSet.add(scriptId);

      // Check if all scripts are loaded or failed
      if (newSet.size + loadedScripts.size === scripts.length) {
        onAllLoaded?.();
      }

      return newSet;
    });

    onError?.(error);

    // Log error for monitoring
    console.error(error);
  };

  const handleReady = (scriptId: string, onReady?: () => void) => {
    onReady?.();
  };

  const allScriptsProcessed = loadedScripts.size + failedScripts.size === scripts.length;

  return (
    <>
      {scripts.map((script) => {
        const {
          id,
          src,
          strategy = 'afterInteractive',
          onLoad,
          onError,
          onReady,
          dangerouslySetInnerHTML,
          ...rest
        } = script;

        // Inline script
        if (dangerouslySetInnerHTML) {
          return (
            <Script
              key={id}
              id={id}
              strategy={strategy}
              onLoad={() => handleLoad(id, onLoad)}
              onError={() => handleError(id, onError)}
              onReady={() => handleReady(id, onReady)}
              {...rest}
            >
              {dangerouslySetInnerHTML}
            </Script>
          );
        }

        // External script
        return (
          <Script
            key={id}
            id={id}
            src={src}
            strategy={strategy}
            onLoad={() => handleLoad(id, onLoad)}
            onError={() => handleError(id, onError)}
            onReady={() => handleReady(id, onReady)}
            {...rest}
          />
        );
      })}

      {/* Loading indicator */}
      {showLoadingIndicator && !allScriptsProcessed && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          Loading scripts... ({loadedScripts.size}/{scripts.length})
        </div>
      )}

      {/* Error indicator */}
      {failedScripts.size > 0 && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {failedScripts.size} script(s) failed to load
        </div>
      )}
    </>
  );
}

/**
 * Common third-party script configurations
 */
export const commonScripts = {
  /**
   * Google Analytics 4
   */
  googleAnalytics: (measurementId: string): ScriptConfig => ({
    id: 'google-analytics',
    src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
    strategy: 'afterInteractive',
  }),

  /**
   * Google Tag Manager
   */
  googleTagManager: (gtmId: string): ScriptConfig => ({
    id: 'google-tag-manager',
    dangerouslySetInnerHTML: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `,
    strategy: 'afterInteractive',
  }),

  /**
   * Stripe.js
   */
  stripe: (): ScriptConfig => ({
    id: 'stripe-js',
    src: 'https://js.stripe.com/v3/',
    strategy: 'lazyOnload',
  }),

  /**
   * Sentry Error Tracking
   */
  sentry: (dsn: string): ScriptConfig => ({
    id: 'sentry',
    src: `https://browser.sentry-cdn.com/7.x/bundle.min.js`,
    strategy: 'beforeInteractive',
    integrity: 'sha384-...', // Add actual integrity hash
    crossOrigin: 'anonymous',
  }),

  /**
   * Intercom Chat
   */
  intercom: (appId: string): ScriptConfig => ({
    id: 'intercom',
    dangerouslySetInnerHTML: `
      (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){
      ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;
      var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};
      w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';
      s.async=true;s.src='https://widget.intercom.io/widget/${appId}';
      var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};
      if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}
      else{w.addEventListener('load',l,false);}}})();
    `,
    strategy: 'lazyOnload',
  }),

  /**
   * Hotjar Analytics
   */
  hotjar: (hjid: string, hjsv: string): ScriptConfig => ({
    id: 'hotjar',
    dangerouslySetInnerHTML: `
      (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:${hjid},hjsv:${hjsv}};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `,
    strategy: 'lazyOnload',
  }),

  /**
   * Clarity (Microsoft)
   */
  clarity: (clarityId: string): ScriptConfig => ({
    id: 'ms-clarity',
    dangerouslySetInnerHTML: `
      (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityId}");
    `,
    strategy: 'lazyOnload',
  }),

  /**
   * reCAPTCHA v3
   */
  recaptcha: (siteKey: string): ScriptConfig => ({
    id: 'recaptcha',
    src: `https://www.google.com/recaptcha/api.js?render=${siteKey}`,
    strategy: 'lazyOnload',
  }),
};

/**
 * Hook for dynamically loading scripts
 */
export function useScript(config: ScriptConfig) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  const load = () => {
    setStatus('loading');
  };

  return {
    status,
    load,
    isLoading: status === 'loading',
    isReady: status === 'ready',
    isError: status === 'error',
  };
}

export default ScriptLoader;

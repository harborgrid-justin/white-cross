(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/identity-access/actions/auth.actions.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Authentication Server Actions - Barrel Export File
 * @module lib/actions/auth.actions
 *
 * Central export point for all authentication-related server actions.
 * This file re-exports functionality from specialized modules:
 * - auth.types: TypeScript types
 * - auth.constants: Constants and validation schemas
 * - auth.login: Login operations and session creation (marked with 'use server')
 * - auth.password: Password change and reset operations (marked with 'use server')
 * - auth.session: Session verification and logout (marked with 'use server')
 *
 * Features:
 * - HIPAA-compliant server actions
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - Comprehensive audit logging
 * - Type-safe operations
 * - Form data handling for UI integration
 *
 * NOTE: This file does NOT have 'use server' at the file level to allow imports
 * from both Client and Server Components. Individual modules have their own
 * 'use server' directives to mark functions as server actions.
 *
 * Usage:
 * ```typescript
 * // Import server actions and types
 * import { loginAction, logoutAction, type User } from '@/lib/actions/auth.actions';
 * 
 * // Import constants and schemas separately for client components
 * import { AUTH_CACHE_TAGS, loginSchema } from '@/lib/actions/auth.constants';
 * ```
 */ // ==========================================
// TYPE EXPORTS
// ==========================================
__turbopack_context__.s([]);
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/identity-access/actions/data:bd6a02 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60a76c9a9b4ad7c70ac5696a449c9886d3c1f7e0b7":"handleLoginSubmission"},"src/identity-access/actions/auth.login.ts",""] */ __turbopack_context__.s([
    "handleLoginSubmission",
    ()=>handleLoginSubmission
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var handleLoginSubmission = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60a76c9a9b4ad7c70ac5696a449c9886d3c1f7e0b7", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "handleLoginSubmission"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXV0aC5sb2dpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGZpbGVvdmVydmlldyBBdXRoZW50aWNhdGlvbiBMb2dpbiBPcGVyYXRpb25zXHJcbiAqIEBtb2R1bGUgbGliL2FjdGlvbnMvYXV0aC5sb2dpblxyXG4gKlxyXG4gKiBTZXJ2ZXIgYWN0aW9ucyBmb3IgbG9naW4gYW5kIGF1dGhlbnRpY2F0aW9uIG9wZXJhdGlvbnMuXHJcbiAqXHJcbiAqIEZlYXR1cmVzOlxyXG4gKiAtIExvZ2luIGZvcm0gdmFsaWRhdGlvbiBhbmQgcHJvY2Vzc2luZ1xyXG4gKiAtIFNlc3Npb24gY3JlYXRpb24gYW5kIGNvb2tpZSBtYW5hZ2VtZW50XHJcbiAqIC0gSElQQUEgYXVkaXQgbG9nZ2luZyBmb3IgbG9naW4gZXZlbnRzXHJcbiAqIC0gUmF0ZSBsaW1pdGluZyAoSVAgYW5kIGVtYWlsIGJhc2VkKVxyXG4gKiAtIElucHV0IHNhbml0aXphdGlvbiBhbmQgQ1NSRiBwcm90ZWN0aW9uXHJcbiAqIC0gU3RhbmRhcmRpemVkIGVycm9yIGhhbmRsaW5nXHJcbiAqL1xyXG5cclxuJ3VzZSBzZXJ2ZXInO1xyXG5cclxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcclxuaW1wb3J0IHsgY29va2llcywgaGVhZGVycyB9IGZyb20gJ25leHQvaGVhZGVycyc7XHJcbmltcG9ydCB7IHJlZGlyZWN0IH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJztcclxuXHJcbi8vIEFQSSBpbnRlZ3JhdGlvblxyXG5pbXBvcnQgeyBzZXJ2ZXJQb3N0LCBOZXh0QXBpQ2xpZW50RXJyb3IgfSBmcm9tICdAL2xpYi9hcGkvbmV4dGpzLWNsaWVudCc7XHJcbmltcG9ydCB7IEFQSV9FTkRQT0lOVFMgfSBmcm9tICdAL2NvbnN0YW50cy9hcGknO1xyXG5pbXBvcnQgeyBhdWRpdExvZywgQVVESVRfQUNUSU9OUywgZXh0cmFjdElQQWRkcmVzcywgZXh0cmFjdFVzZXJBZ2VudCB9IGZyb20gJ0AvbGliL2F1ZGl0JztcclxuXHJcbi8vIFNlY3VyaXR5IGhlbHBlcnNcclxuaW1wb3J0IHsgY2hlY2tSYXRlTGltaXQsIFJBVEVfTElNSVRTIH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvcmF0ZS1saW1pdCc7XHJcbmltcG9ydCB7IHNhZmVGb3JtRGF0YUVtYWlsLCBzYWZlRm9ybURhdGFQYXNzd29yZCB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2lucHV0LXNhbml0aXphdGlvbic7XHJcbmltcG9ydCB7XHJcbiAgYWN0aW9uRXJyb3IsXHJcbiAgYWN0aW9uUmF0ZUxpbWl0RXJyb3IsXHJcbiAgYWN0aW9uVmFsaWRhdGlvbkVycm9yLFxyXG4gIHRvTG9naW5Gb3JtU3RhdGVcclxufSBmcm9tICcuLi9saWIvaGVscGVycy9hY3Rpb24tcmVzdWx0JztcclxuaW1wb3J0IHsgZm9ybWF0Wm9kRXJyb3JzIH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvem9kLWVycm9ycyc7XHJcblxyXG4vLyBDb29raWUgY29uZmlndXJhdGlvblxyXG5pbXBvcnQge1xyXG4gIENPT0tJRV9OQU1FUyxcclxuICBnZXRBY2Nlc3NUb2tlbkNvb2tpZU9wdGlvbnMsXHJcbiAgZ2V0UmVmcmVzaFRva2VuQ29va2llT3B0aW9uc1xyXG59IGZyb20gJ0AvaWRlbnRpdHktYWNjZXNzL2xpYi9jb25maWcvY29va2llcyc7XHJcblxyXG4vLyBUeXBlcyBhbmQgc2NoZW1hc1xyXG5pbXBvcnQgdHlwZSB7IEF1dGhSZXNwb25zZSwgTG9naW5Gb3JtU3RhdGUgfSBmcm9tICcuL2F1dGgudHlwZXMnO1xyXG5pbXBvcnQgeyBBVVRIX0NBQ0hFX1RBR1MsIGxvZ2luU2NoZW1hIH0gZnJvbSAnLi9hdXRoLmNvbnN0YW50cyc7XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gTE9HSU4gQUNUSU9OU1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKiBMb2dpbiBhY3Rpb24gd2l0aCBjb21wcmVoZW5zaXZlIHNlY3VyaXR5IGZlYXR1cmVzXHJcbiAqXHJcbiAqIFNlY3VyaXR5IGZlYXR1cmVzOlxyXG4gKiAtIFJhdGUgbGltaXRpbmcgKElQLWJhc2VkOiA1LzE1bWluLCBFbWFpbC1iYXNlZDogMy8xNW1pbilcclxuICogLSBJbnB1dCBzYW5pdGl6YXRpb25cclxuICogLSBab2QgdmFsaWRhdGlvblxyXG4gKiAtIEhJUEFBIGF1ZGl0IGxvZ2dpbmdcclxuICogLSBTZWN1cmUgY29va2llIG1hbmFnZW1lbnRcclxuICpcclxuICogQHBhcmFtIF9wcmV2U3RhdGUgLSBQcmV2aW91cyBmb3JtIHN0YXRlICh1bnVzZWQsIGZvciB1c2VBY3Rpb25TdGF0ZSlcclxuICogQHBhcmFtIGZvcm1EYXRhIC0gRm9ybSBkYXRhIGNvbnRhaW5pbmcgZW1haWwgYW5kIHBhc3N3b3JkXHJcbiAqIEByZXR1cm5zIFN0YW5kYXJkaXplZCBsb2dpbiBmb3JtIHN0YXRlXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW5BY3Rpb24oXHJcbiAgX3ByZXZTdGF0ZTogTG9naW5Gb3JtU3RhdGUsXHJcbiAgZm9ybURhdGE6IEZvcm1EYXRhXHJcbik6IFByb21pc2U8TG9naW5Gb3JtU3RhdGU+IHtcclxuICAvLyBFeHRyYWN0IElQIGFkZHJlc3MgZm9yIHJhdGUgbGltaXRpbmdcclxuICBjb25zdCBoZWFkZXJzTGlzdCA9IGF3YWl0IGhlYWRlcnMoKTtcclxuICBjb25zdCBtb2NrUmVxdWVzdCA9IHtcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgZ2V0OiAobmFtZTogc3RyaW5nKSA9PiBoZWFkZXJzTGlzdC5nZXQobmFtZSlcclxuICAgIH1cclxuICB9IGFzIFJlcXVlc3Q7XHJcbiAgY29uc3QgaXBBZGRyZXNzID0gZXh0cmFjdElQQWRkcmVzcyhtb2NrUmVxdWVzdCk7XHJcblxyXG4gIC8vIFNhbml0aXplIGlucHV0cyBiZWZvcmUgdmFsaWRhdGlvblxyXG4gIGNvbnN0IGVtYWlsID0gc2FmZUZvcm1EYXRhRW1haWwoZm9ybURhdGEsICdlbWFpbCcpO1xyXG4gIGNvbnN0IHBhc3N3b3JkID0gc2FmZUZvcm1EYXRhUGFzc3dvcmQoZm9ybURhdGEsICdwYXNzd29yZCcpO1xyXG5cclxuICAvLyBSYXRlIGxpbWl0aW5nOiBJUC1iYXNlZCAocHJldmVudHMgYnJ1dGUgZm9yY2UgZnJvbSBzaW5nbGUgSVApXHJcbiAgY29uc3QgaXBSYXRlTGltaXQgPSBjaGVja1JhdGVMaW1pdCgnbG9naW4taXAnLCBpcEFkZHJlc3MsIFJBVEVfTElNSVRTLkxPR0lOX0lQKTtcclxuICBpZiAoaXBSYXRlTGltaXQubGltaXRlZCkge1xyXG4gICAgLy8gQXVkaXQgcmF0ZSBsaW1pdCB2aW9sYXRpb25cclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgdXNlcklkOiBlbWFpbCB8fCAndW5rbm93bicsXHJcbiAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5MT0dJTl9GQUlMRUQsXHJcbiAgICAgIHJlc291cmNlOiAnQXV0aGVudGljYXRpb24nLFxyXG4gICAgICBkZXRhaWxzOiBgUmF0ZSBsaW1pdCBleGNlZWRlZCBmcm9tIElQICR7aXBBZGRyZXNzfWAsXHJcbiAgICAgIGlwQWRkcmVzcyxcclxuICAgICAgdXNlckFnZW50OiBleHRyYWN0VXNlckFnZW50KG1vY2tSZXF1ZXN0KSxcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yTWVzc2FnZTogJ1JhdGUgbGltaXQgZXhjZWVkZWQnXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdG9Mb2dpbkZvcm1TdGF0ZShhY3Rpb25SYXRlTGltaXRFcnJvcihpcFJhdGVMaW1pdC5yZXNldEluISkpO1xyXG4gIH1cclxuXHJcbiAgLy8gUmF0ZSBsaW1pdGluZzogRW1haWwtYmFzZWQgKHByZXZlbnRzIHRhcmdldGVkIGF0dGFja3Mgb24gc3BlY2lmaWMgYWNjb3VudHMpXHJcbiAgaWYgKGVtYWlsKSB7XHJcbiAgICBjb25zdCBlbWFpbFJhdGVMaW1pdCA9IGNoZWNrUmF0ZUxpbWl0KCdsb2dpbi1lbWFpbCcsIGVtYWlsLCBSQVRFX0xJTUlUUy5MT0dJTl9FTUFJTCk7XHJcbiAgICBpZiAoZW1haWxSYXRlTGltaXQubGltaXRlZCkge1xyXG4gICAgICAvLyBBdWRpdCByYXRlIGxpbWl0IHZpb2xhdGlvblxyXG4gICAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgICAgdXNlcklkOiBlbWFpbCxcclxuICAgICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuTE9HSU5fRkFJTEVELFxyXG4gICAgICAgIHJlc291cmNlOiAnQXV0aGVudGljYXRpb24nLFxyXG4gICAgICAgIGRldGFpbHM6IGBSYXRlIGxpbWl0IGV4Y2VlZGVkIGZvciBlbWFpbCAke2VtYWlsfWAsXHJcbiAgICAgICAgaXBBZGRyZXNzLFxyXG4gICAgICAgIHVzZXJBZ2VudDogZXh0cmFjdFVzZXJBZ2VudChtb2NrUmVxdWVzdCksXHJcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiAnUmF0ZSBsaW1pdCBleGNlZWRlZCdcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gdG9Mb2dpbkZvcm1TdGF0ZShhY3Rpb25SYXRlTGltaXRFcnJvcihlbWFpbFJhdGVMaW1pdC5yZXNldEluISkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gVmFsaWRhdGUgZm9ybSBkYXRhIHdpdGggWm9kXHJcbiAgY29uc3QgdmFsaWRhdGVkRmllbGRzID0gbG9naW5TY2hlbWEuc2FmZVBhcnNlKHtcclxuICAgIGVtYWlsLFxyXG4gICAgcGFzc3dvcmQsXHJcbiAgfSk7XHJcblxyXG4gIGlmICghdmFsaWRhdGVkRmllbGRzLnN1Y2Nlc3MpIHtcclxuICAgIHJldHVybiB0b0xvZ2luRm9ybVN0YXRlKFxyXG4gICAgICBhY3Rpb25WYWxpZGF0aW9uRXJyb3IoZm9ybWF0Wm9kRXJyb3JzKHZhbGlkYXRlZEZpZWxkcy5lcnJvcikpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgZW1haWw6IHZhbGlkYXRlZEVtYWlsLCBwYXNzd29yZDogdmFsaWRhdGVkUGFzc3dvcmQgfSA9IHZhbGlkYXRlZEZpZWxkcy5kYXRhO1xyXG5cclxuICAgIC8vIENhbGwgYmFja2VuZCBhdXRoZW50aWNhdGlvbiBlbmRwb2ludFxyXG4gICAgY29uc3Qgd3JhcHBlZFJlc3BvbnNlID0gYXdhaXQgc2VydmVyUG9zdDxhbnk+KFxyXG4gICAgICBBUElfRU5EUE9JTlRTLkFVVEguTE9HSU4sXHJcbiAgICAgIHsgZW1haWw6IHZhbGlkYXRlZEVtYWlsLCBwYXNzd29yZDogdmFsaWRhdGVkUGFzc3dvcmQgfSxcclxuICAgICAge1xyXG4gICAgICAgIGNhY2hlOiAnbm8tc3RvcmUnLFxyXG4gICAgICAgIHJlcXVpcmVzQXV0aDogZmFsc2UsXHJcbiAgICAgICAgbmV4dDogeyB0YWdzOiBbQVVUSF9DQUNIRV9UQUdTLkFVVEhdIH1cclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnW0xvZ2luIEFjdGlvbl0gUmVzcG9uc2UgcmVjZWl2ZWQ6Jywge1xyXG4gICAgICBoYXNSZXNwb25zZTogISF3cmFwcGVkUmVzcG9uc2UsXHJcbiAgICAgIGhhc0RhdGE6ICEhd3JhcHBlZFJlc3BvbnNlPy5kYXRhLFxyXG4gICAgICByZXNwb25zZUtleXM6IHdyYXBwZWRSZXNwb25zZSA/IE9iamVjdC5rZXlzKHdyYXBwZWRSZXNwb25zZSkgOiBbXSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEJhY2tlbmQgd3JhcHMgcmVzcG9uc2UgaW4gQXBpUmVzcG9uc2UgZm9ybWF0IC0gZXh0cmFjdCBkYXRhXHJcbiAgICBjb25zdCByZXNwb25zZTogQXV0aFJlc3BvbnNlID0gd3JhcHBlZFJlc3BvbnNlPy5kYXRhIHx8IHdyYXBwZWRSZXNwb25zZTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnW0xvZ2luIEFjdGlvbl0gRXh0cmFjdGVkIGF1dGggZGF0YTonLCB7XHJcbiAgICAgIGhhc0FjY2Vzc1Rva2VuOiAhIXJlc3BvbnNlPy5hY2Nlc3NUb2tlbixcclxuICAgICAgaGFzUmVmcmVzaFRva2VuOiAhIXJlc3BvbnNlPy5yZWZyZXNoVG9rZW4sXHJcbiAgICAgIGhhc1VzZXI6ICEhcmVzcG9uc2U/LnVzZXIsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDaGVjayBpZiB3ZSBoYXZlIHZhbGlkIGF1dGhlbnRpY2F0aW9uIGRhdGFcclxuICAgIGlmICghcmVzcG9uc2UgfHwgIXJlc3BvbnNlLmFjY2Vzc1Rva2VuKSB7XHJcbiAgICAgIC8vIEF1ZGl0IGZhaWxlZCBsb2dpbiBhdHRlbXB0XHJcbiAgICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgICB1c2VySWQ6IHZhbGlkYXRlZEVtYWlsLFxyXG4gICAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5MT0dJTl9GQUlMRUQsXHJcbiAgICAgICAgcmVzb3VyY2U6ICdBdXRoZW50aWNhdGlvbicsXHJcbiAgICAgICAgZGV0YWlsczogYEZhaWxlZCBsb2dpbiBhdHRlbXB0IGZvciAke3ZhbGlkYXRlZEVtYWlsfWAsXHJcbiAgICAgICAgaXBBZGRyZXNzLFxyXG4gICAgICAgIHVzZXJBZ2VudDogZXh0cmFjdFVzZXJBZ2VudChtb2NrUmVxdWVzdCksXHJcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiAnSW52YWxpZCBjcmVkZW50aWFscydcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gdG9Mb2dpbkZvcm1TdGF0ZShcclxuICAgICAgICBhY3Rpb25FcnJvcihbJ0ludmFsaWQgY3JlZGVudGlhbHMnXSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBFeHRyYWN0IGRhdGEgZnJvbSBzdWNjZXNzZnVsIHJlc3BvbnNlXHJcbiAgICBjb25zdCB7IGFjY2Vzc1Rva2VuOiB0b2tlbiwgcmVmcmVzaFRva2VuLCB1c2VyIH0gPSByZXNwb25zZTtcclxuXHJcbiAgICAvLyBTZXQgSFRUUC1vbmx5IGNvb2tpZXMgdXNpbmcgY2VudHJhbGl6ZWQgY29uZmlndXJhdGlvblxyXG4gICAgY29uc3QgY29va2llU3RvcmUgPSBhd2FpdCBjb29raWVzKCk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ1tMb2dpbiBBY3Rpb25dIFNldHRpbmcgYXV0aCB0b2tlbjonLCB7XHJcbiAgICAgIHRva2VuTGVuZ3RoOiB0b2tlbj8ubGVuZ3RoLFxyXG4gICAgICB0b2tlblN0YXJ0OiB0b2tlbj8uc3Vic3RyaW5nKDAsIDIwKSxcclxuICAgICAgY29va2llTmFtZTogQ09PS0lFX05BTUVTLkFDQ0VTU19UT0tFTlxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVXNlIGNlbnRyYWxpemVkIGNvb2tpZSBjb25maWd1cmF0aW9uIGZvciBjb25zaXN0ZW50LCBzZWN1cmUgc2V0dGluZ3NcclxuICAgIGNvb2tpZVN0b3JlLnNldChcclxuICAgICAgQ09PS0lFX05BTUVTLkFDQ0VTU19UT0tFTixcclxuICAgICAgdG9rZW4sXHJcbiAgICAgIGdldEFjY2Vzc1Rva2VuQ29va2llT3B0aW9ucygpXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdbTG9naW4gQWN0aW9uXSBBdXRoIHRva2VuIGNvb2tpZSBzZXQsIHZlcmlmeWluZzonLCB7XHJcbiAgICAgIGNvb2tpZUV4aXN0czogISFjb29raWVTdG9yZS5nZXQoQ09PS0lFX05BTUVTLkFDQ0VTU19UT0tFTiksXHJcbiAgICAgIGNvb2tpZVZhbHVlOiBjb29raWVTdG9yZS5nZXQoQ09PS0lFX05BTUVTLkFDQ0VTU19UT0tFTik/LnZhbHVlPy5zdWJzdHJpbmcoMCwgMjApXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAocmVmcmVzaFRva2VuKSB7XHJcbiAgICAgIGNvb2tpZVN0b3JlLnNldChcclxuICAgICAgICBDT09LSUVfTkFNRVMuUkVGUkVTSF9UT0tFTixcclxuICAgICAgICByZWZyZXNoVG9rZW4sXHJcbiAgICAgICAgZ2V0UmVmcmVzaFRva2VuQ29va2llT3B0aW9ucygpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQXVkaXQgc3VjY2Vzc2Z1bCBsb2dpblxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICB1c2VySWQ6IHVzZXIuaWQsXHJcbiAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5MT0dJTixcclxuICAgICAgcmVzb3VyY2U6ICdBdXRoZW50aWNhdGlvbicsXHJcbiAgICAgIGRldGFpbHM6IGBVc2VyICR7dmFsaWRhdGVkRW1haWx9IGxvZ2dlZCBpbiBzdWNjZXNzZnVsbHlgLFxyXG4gICAgICBpcEFkZHJlc3MsXHJcbiAgICAgIHVzZXJBZ2VudDogZXh0cmFjdFVzZXJBZ2VudChtb2NrUmVxdWVzdCksXHJcbiAgICAgIHN1Y2Nlc3M6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignW0xvZ2luIEFjdGlvbl0gRXJyb3I6JywgZXJyb3IpO1xyXG5cclxuICAgIC8vIEhhbmRsZSBOZXh0QXBpQ2xpZW50RXJyb3Igd2l0aCBtb3JlIHNwZWNpZmljIG1lc3NhZ2luZ1xyXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgTmV4dEFwaUNsaWVudEVycm9yKSB7XHJcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGVycm9yLm1lc3NhZ2UgfHwgJ0F1dGhlbnRpY2F0aW9uIGZhaWxlZC4gUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMuJztcclxuXHJcbiAgICAgIC8vIEF1ZGl0IEFQSSBlcnJvclxyXG4gICAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgICAgdXNlcklkOiBlbWFpbCB8fCAndW5rbm93bicsXHJcbiAgICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLkxPR0lOX0ZBSUxFRCxcclxuICAgICAgICByZXNvdXJjZTogJ0F1dGhlbnRpY2F0aW9uJyxcclxuICAgICAgICBkZXRhaWxzOiBgTG9naW4gZXJyb3I6ICR7ZXJyb3JNZXNzYWdlfWAsXHJcbiAgICAgICAgaXBBZGRyZXNzLFxyXG4gICAgICAgIHVzZXJBZ2VudDogZXh0cmFjdFVzZXJBZ2VudChtb2NrUmVxdWVzdCksXHJcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIHRvTG9naW5Gb3JtU3RhdGUoYWN0aW9uRXJyb3IoW2Vycm9yTWVzc2FnZV0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBdWRpdCB1bmV4cGVjdGVkIGVycm9yXHJcbiAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgIHVzZXJJZDogZW1haWwgfHwgJ3Vua25vd24nLFxyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuTE9HSU5fRkFJTEVELFxyXG4gICAgICByZXNvdXJjZTogJ0F1dGhlbnRpY2F0aW9uJyxcclxuICAgICAgZGV0YWlsczogJ1VuZXhwZWN0ZWQgZXJyb3IgZHVyaW5nIGxvZ2luJyxcclxuICAgICAgaXBBZGRyZXNzLFxyXG4gICAgICB1c2VyQWdlbnQ6IGV4dHJhY3RVc2VyQWdlbnQobW9ja1JlcXVlc3QpLFxyXG4gICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRvTG9naW5Gb3JtU3RhdGUoXHJcbiAgICAgIGFjdGlvbkVycm9yKFsnQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2Fpbi4nXSlcclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogSGFuZGxlIGxvZ2luIGZvcm0gc3VibWlzc2lvbiBmcm9tIGxvZ2luIHBhZ2VcclxuICpcclxuICogRGVsZWdhdGVzIHRvIGNlbnRyYWxpemVkIGxvZ2luQWN0aW9uIGFuZCBoYW5kbGVzIHJlZGlyZWN0LlxyXG4gKiBUaGlzIGlzIHRoZSBhY3Rpb24gdGhhdCBzaG91bGQgYmUgdXNlZCBpbiBsb2dpbiBmb3Jtcy5cclxuICpcclxuICogQHBhcmFtIHByZXZTdGF0ZSAtIFByZXZpb3VzIGZvcm0gc3RhdGVcclxuICogQHBhcmFtIGZvcm1EYXRhIC0gRm9ybSBkYXRhIGNvbnRhaW5pbmcgY3JlZGVudGlhbHNcclxuICogQHJldHVybnMgTG9naW4gZm9ybSBzdGF0ZSBvciByZWRpcmVjdHMgdG8gZGFzaGJvYXJkXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlTG9naW5TdWJtaXNzaW9uKFxyXG4gIHByZXZTdGF0ZTogTG9naW5Gb3JtU3RhdGUsXHJcbiAgZm9ybURhdGE6IEZvcm1EYXRhXHJcbik6IFByb21pc2U8TG9naW5Gb3JtU3RhdGU+IHtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBsb2dpbkFjdGlvbihwcmV2U3RhdGUsIGZvcm1EYXRhKTtcclxuXHJcbiAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XHJcbiAgICAvLyBTdWNjZXNzZnVsIGxvZ2luIC0gcmV2YWxpZGF0ZSBhbmQgcmVkaXJlY3QgdG8gZGFzaGJvYXJkXHJcbiAgICByZXZhbGlkYXRlUGF0aCgnL2Rhc2hib2FyZCcsICdwYWdlJyk7XHJcbiAgICByZWRpcmVjdCgnL2Rhc2hib2FyZCcpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENsZWFyIGxvZ2luIGZvcm0gc3RhdGVcclxuICpcclxuICogVXRpbGl0eSBhY3Rpb24gZm9yIHJlc2V0dGluZyBmb3JtIHN0YXRlLlxyXG4gKlxyXG4gKiBAcmV0dXJucyBFbXB0eSBmb3JtIHN0YXRlXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xlYXJMb2dpbkZvcm0oKTogUHJvbWlzZTxMb2dpbkZvcm1TdGF0ZT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgIGVycm9yczogdW5kZWZpbmVkXHJcbiAgfTtcclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IndUQW1Sc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Login Page - Primary Authentication Interface using Server Actions
 *
 * This page implements the main authentication interface for White Cross Healthcare Platform
 * using Next.js server actions for secure server-side authentication. It provides secure 
 * credential-based login with JWT token management, comprehensive error handling, and 
 * follows HIPAA security requirements and WCAG 2.1 AA accessibility standards.
 *
 * @module app/login/page
 * @category Authentication
 * @subcategory Pages
 *
 * @route /login - Primary authentication endpoint
 * @route /login?redirect=/path - Login with redirect after success
 * @route /login?error=session_expired - Login with error context
 *
 * @requires react
 * @requires next/navigation
 * @requires handleLoginSubmission - Server action for form processing
 *
 * @security
 * - Server-side JWT token authentication with secure HttpOnly cookies
 * - Password visibility toggle for user convenience
 * - CSRF protection through Next.js server actions
 * - Rate limiting on authentication attempts (server-side)
 * - No password storage in client state or localStorage
 * - Server actions handle all authentication logic
 *
 * @compliance HIPAA
 * - User authentication required before PHI access
 * - Session timeout enforcement (server-side)
 * - Audit logging of authentication events (server-side)
 * - Complies with HIPAA Security Rule § 164.312(a)(2)(i) - Unique User Identification
 * - Complies with HIPAA Security Rule § 164.312(d) - Person or Entity Authentication
 *
 * @accessibility WCAG 2.1 AA
 * - Keyboard navigation support for all interactive elements
 * - Screen reader compatible with proper ARIA labels
 * - Error messages announced via aria-live regions
 * - High contrast mode support
 * - Focus management for form validation errors
 *
 * @since 1.0.0
 */ __turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/identity-access/actions/auth.actions.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$data$3a$bd6a02__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/identity-access/actions/data:bd6a02 [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
/**
 * Submit Button Component with loading state
 * Uses React 19 useFormStatus hook to show loading state during server action execution
 */ function SubmitButton() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "35d2d2c8b4db0b5f783416cacf98e815fccc3528473b5ac7272143ab2ffdfc0e") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "35d2d2c8b4db0b5f783416cacf98e815fccc3528473b5ac7272143ab2ffdfc0e";
    }
    const { pending } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormStatus"])();
    let t0;
    if ($[1] !== pending) {
        t0 = pending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    "aria-hidden": "true",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 73,
                            columnNumber: 133
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 73,
                            columnNumber: 227
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 73,
                    columnNumber: 22
                }, this),
                "Signing in..."
            ]
        }, void 0, true) : "Sign in";
        $[1] = pending;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    let t1;
    if ($[3] !== pending || $[4] !== t0) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "submit",
            disabled: pending,
            className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
            "aria-busy": pending,
            children: t0
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 81,
            columnNumber: 10
        }, this);
        $[3] = pending;
        $[4] = t0;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    return t1;
}
_s(SubmitButton, "jhoM4l+GnnRJq1+2o1VHFTL5Kos=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormStatus"]
    ];
});
_c = SubmitButton;
function LoginPage() {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(58);
    if ($[0] !== "35d2d2c8b4db0b5f783416cacf98e815fccc3528473b5ac7272143ab2ffdfc0e") {
        for(let $i = 0; $i < 58; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "35d2d2c8b4db0b5f783416cacf98e815fccc3528473b5ac7272143ab2ffdfc0e";
    }
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = {
            success: false
        };
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const [formState, formAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$data$3a$bd6a02__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["handleLoginSubmission"], t0);
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const errorParam = searchParams.get("error");
    let t1;
    bb0: {
        if (!errorParam) {
            t1 = "";
            break bb0;
        }
        switch(errorParam){
            case "invalid_token":
                {
                    t1 = "Your session has expired. Please log in again.";
                    break bb0;
                }
            case "session_expired":
                {
                    t1 = "Your session has expired due to inactivity. Please log in again.";
                    break bb0;
                }
            case "unauthorized":
                {
                    t1 = "You need to log in to access that page.";
                    break bb0;
                }
            default:
                {
                    t1 = "An error occurred. Please try logging in again.";
                }
        }
    }
    const urlError = t1;
    let t2;
    if ($[2] !== formState.errors || $[3] !== urlError) {
        const getErrorMessage = {
            "LoginPage[getErrorMessage]": ()=>{
                if (urlError) {
                    return urlError;
                }
                if (formState.errors?._form?.[0]) {
                    return formState.errors._form[0];
                }
                if (formState.errors?.email?.[0]) {
                    return formState.errors.email[0];
                }
                if (formState.errors?.password?.[0]) {
                    return formState.errors.password[0];
                }
                return "";
            }
        }["LoginPage[getErrorMessage]"];
        t2 = getErrorMessage();
        $[2] = formState.errors;
        $[3] = urlError;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const errorMessage = t2;
    let t3;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "mt-6 text-center text-3xl font-extrabold text-gray-900",
                    children: "Sign in to White Cross"
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 206,
                    columnNumber: 15
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-2 text-center text-sm text-gray-600",
                    children: "School Health Management System"
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 206,
                    columnNumber: 113
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 206,
            columnNumber: 10
        }, this);
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== errorMessage) {
        t4 = errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-md bg-red-50 p-4",
            role: "alert",
            "aria-live": "assertive",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "h-5 w-5 text-red-400",
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            "aria-hidden": "true",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                fillRule: "evenodd",
                                d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z",
                                clipRule: "evenodd"
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 213,
                                columnNumber: 253
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 213,
                            columnNumber: 156
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 213,
                        columnNumber: 125
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-sm font-medium text-red-800",
                            children: errorMessage
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 213,
                            columnNumber: 543
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 213,
                        columnNumber: 521
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/login/page.tsx",
                lineNumber: 213,
                columnNumber: 103
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 213,
            columnNumber: 26
        }, this);
        $[6] = errorMessage;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    if ($[8] !== formState.success) {
        t5 = formState.success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-md bg-green-50 p-4",
            role: "alert",
            "aria-live": "polite",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "h-5 w-5 text-green-400",
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            "aria-hidden": "true",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                fillRule: "evenodd",
                                d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.23a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
                                clipRule: "evenodd"
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 221,
                                columnNumber: 259
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 221,
                            columnNumber: 160
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 221,
                        columnNumber: 129
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-sm font-medium text-green-800",
                            children: "Login successful! Redirecting..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 221,
                            columnNumber: 495
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 221,
                        columnNumber: 473
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/login/page.tsx",
                lineNumber: 221,
                columnNumber: 107
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 221,
            columnNumber: 31
        }, this);
        $[8] = formState.success;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "email",
            className: "sr-only",
            children: "Email address"
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 229,
            columnNumber: 10
        }, this);
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    const t7 = `appearance-none rounded-none relative block w-full px-3 py-2 border ${formState.errors?.email ? "border-red-500" : "border-gray-300"} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`;
    const t8 = formState.errors?.email ? true : false;
    const t9 = formState.errors?.email ? "email-error" : undefined;
    let t10;
    if ($[11] !== t7 || $[12] !== t8 || $[13] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            id: "email",
            name: "email",
            type: "email",
            autoComplete: "email",
            required: true,
            className: t7,
            placeholder: "Email address",
            "aria-required": "true",
            "aria-invalid": t8,
            "aria-describedby": t9
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 239,
            columnNumber: 11
        }, this);
        $[11] = t7;
        $[12] = t8;
        $[13] = t9;
        $[14] = t10;
    } else {
        t10 = $[14];
    }
    let t11;
    if ($[15] !== formState.errors) {
        t11 = formState.errors?.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            id: "email-error",
            className: "mt-1 text-sm text-red-600",
            role: "alert",
            children: formState.errors.email[0]
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 249,
            columnNumber: 38
        }, this);
        $[15] = formState.errors;
        $[16] = t11;
    } else {
        t11 = $[16];
    }
    let t12;
    if ($[17] !== t10 || $[18] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t6,
                t10,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 257,
            columnNumber: 11
        }, this);
        $[17] = t10;
        $[18] = t11;
        $[19] = t12;
    } else {
        t12 = $[19];
    }
    let t13;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "password",
            className: "sr-only",
            children: "Password"
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 266,
            columnNumber: 11
        }, this);
        $[20] = t13;
    } else {
        t13 = $[20];
    }
    const t14 = showPassword ? "text" : "password";
    const t15 = `appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border ${formState.errors?.password ? "border-red-500" : "border-gray-300"} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`;
    const t16 = formState.errors?.password ? true : false;
    const t17 = formState.errors?.password ? "password-error" : undefined;
    let t18;
    if ($[21] !== t14 || $[22] !== t15 || $[23] !== t16 || $[24] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            id: "password",
            name: "password",
            type: t14,
            autoComplete: "current-password",
            required: true,
            className: t15,
            placeholder: "Password",
            "aria-required": "true",
            "aria-invalid": t16,
            "aria-describedby": t17
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 277,
            columnNumber: 11
        }, this);
        $[21] = t14;
        $[22] = t15;
        $[23] = t16;
        $[24] = t17;
        $[25] = t18;
    } else {
        t18 = $[25];
    }
    let t19;
    if ($[26] !== showPassword) {
        t19 = ({
            "LoginPage[<button>.onClick]": ()=>setShowPassword(!showPassword)
        })["LoginPage[<button>.onClick]"];
        $[26] = showPassword;
        $[27] = t19;
    } else {
        t19 = $[27];
    }
    const t20 = showPassword ? "Hide password" : "Show password";
    let t21;
    if ($[28] !== showPassword) {
        t21 = showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "h-5 w-5 text-gray-400",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            "aria-hidden": "true",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            }, void 0, false, {
                fileName: "[project]/src/app/login/page.tsx",
                lineNumber: 299,
                columnNumber: 138
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 299,
            columnNumber: 26
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "h-5 w-5 text-gray-400",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            "aria-hidden": "true",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 299,
                    columnNumber: 629
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 299,
                    columnNumber: 735
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 299,
            columnNumber: 517
        }, this);
        $[28] = showPassword;
        $[29] = t21;
    } else {
        t21 = $[29];
    }
    let t22;
    if ($[30] !== t19 || $[31] !== t20 || $[32] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: t19,
            className: "absolute inset-y-0 right-0 pr-3 flex items-center",
            "aria-label": t20,
            children: t21
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 307,
            columnNumber: 11
        }, this);
        $[30] = t19;
        $[31] = t20;
        $[32] = t21;
        $[33] = t22;
    } else {
        t22 = $[33];
    }
    let t23;
    if ($[34] !== formState.errors) {
        t23 = formState.errors?.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            id: "password-error",
            className: "mt-1 text-sm text-red-600",
            role: "alert",
            children: formState.errors.password[0]
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 317,
            columnNumber: 41
        }, this);
        $[34] = formState.errors;
        $[35] = t23;
    } else {
        t23 = $[35];
    }
    let t24;
    if ($[36] !== t18 || $[37] !== t22 || $[38] !== t23) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                t13,
                t18,
                t22,
                t23
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 325,
            columnNumber: 11
        }, this);
        $[36] = t18;
        $[37] = t22;
        $[38] = t23;
        $[39] = t24;
    } else {
        t24 = $[39];
    }
    let t25;
    if ($[40] !== t12 || $[41] !== t24) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-md shadow-sm -space-y-px",
            children: [
                t12,
                t24
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 335,
            columnNumber: 11
        }, this);
        $[40] = t12;
        $[41] = t24;
        $[42] = t25;
    } else {
        t25 = $[42];
    }
    let t26;
    if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    id: "remember-me",
                    name: "remember-me",
                    type: "checkbox",
                    className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 344,
                    columnNumber: 46
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    htmlFor: "remember-me",
                    className: "ml-2 block text-sm text-gray-900",
                    children: "Remember me"
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 344,
                    columnNumber: 185
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 344,
            columnNumber: 11
        }, this);
        $[43] = t26;
    } else {
        t26 = $[43];
    }
    let t27;
    let t28;
    if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                t26,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/forgot-password",
                        className: "font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                        children: "Forgot your password?"
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 352,
                        columnNumber: 92
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 352,
                    columnNumber: 67
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 352,
            columnNumber: 11
        }, this);
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SubmitButton, {}, void 0, false, {
                fileName: "[project]/src/app/login/page.tsx",
                lineNumber: 353,
                columnNumber: 16
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 353,
            columnNumber: 11
        }, this);
        $[44] = t27;
        $[45] = t28;
    } else {
        t27 = $[44];
        t28 = $[45];
    }
    let t29;
    if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 flex items-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full border-t border-gray-300"
            }, void 0, false, {
                fileName: "[project]/src/app/login/page.tsx",
                lineNumber: 362,
                columnNumber: 63
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 362,
            columnNumber: 11
        }, this);
        $[46] = t29;
    } else {
        t29 = $[46];
    }
    let t30;
    if ($[47] === Symbol.for("react.memo_cache_sentinel")) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                t29,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative flex justify-center text-sm",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "px-2 bg-gray-50 text-gray-500",
                        children: "Or continue with"
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 369,
                        columnNumber: 96
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 369,
                    columnNumber: 42
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 369,
            columnNumber: 11
        }, this);
        $[47] = t30;
    } else {
        t30 = $[47];
    }
    let t31;
    if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            className: "w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-5 h-5",
                    viewBox: "0 0 24 24",
                    "aria-hidden": "true",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
                            fill: "#4285F4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 376,
                            columnNumber: 329
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                            fill: "#34A853"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 376,
                            columnNumber: 476
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                            fill: "#FBBC05"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 376,
                            columnNumber: 637
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                            fill: "#EA4335"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 376,
                            columnNumber: 790
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 376,
                    columnNumber: 265
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "ml-2",
                    children: "Google"
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 376,
                    columnNumber: 955
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 376,
            columnNumber: 11
        }, this);
        $[48] = t31;
    } else {
        t31 = $[48];
    }
    let t32;
    if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
                t31,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: "w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-5 h-5",
                            viewBox: "0 0 24 24",
                            fill: "#00A4EF",
                            "aria-hidden": "true",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 383,
                                columnNumber: 389
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 383,
                            columnNumber: 310
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "ml-2",
                            children: "Microsoft"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 383,
                            columnNumber: 503
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 383,
                    columnNumber: 56
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 383,
            columnNumber: 11
        }, this);
        $[49] = t32;
    } else {
        t32 = $[49];
    }
    let t33;
    if ($[50] !== t25) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            className: "mt-8 space-y-6",
            action: formAction,
            noValidate: true,
            children: [
                t25,
                t27,
                t28,
                t30,
                t32
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 390,
            columnNumber: 11
        }, this);
        $[50] = t25;
        $[51] = t33;
    } else {
        t33 = $[51];
    }
    let t34;
    if ($[52] === Symbol.for("react.memo_cache_sentinel")) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-600",
                children: [
                    "Don't have an account?",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/register",
                        className: "font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                        children: "Create one"
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 398,
                        columnNumber: 104
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/login/page.tsx",
                lineNumber: 398,
                columnNumber: 40
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 398,
            columnNumber: 11
        }, this);
        $[52] = t34;
    } else {
        t34 = $[52];
    }
    let t35;
    if ($[53] === Symbol.for("react.memo_cache_sentinel")) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-600",
                children: "Need help? Contact your system administrator."
            }, void 0, false, {
                fileName: "[project]/src/app/login/page.tsx",
                lineNumber: 405,
                columnNumber: 40
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 405,
            columnNumber: 11
        }, this);
        $[53] = t35;
    } else {
        t35 = $[53];
    }
    let t36;
    if ($[54] !== t33 || $[55] !== t4 || $[56] !== t5) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md w-full space-y-8",
                children: [
                    t3,
                    t4,
                    t5,
                    t33,
                    t34,
                    t35
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/login/page.tsx",
                lineNumber: 412,
                columnNumber: 112
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 412,
            columnNumber: 11
        }, this);
        $[54] = t33;
        $[55] = t4;
        $[56] = t5;
        $[57] = t36;
    } else {
        t36 = $[57];
    }
    return t36;
}
_s1(LoginPage, "FfktNMGdOUIPjTGnOKhwvY+ND+E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionState"]
    ];
});
_c1 = LoginPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "SubmitButton");
__turbopack_context__.k.register(_c1, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assign: null,
    searchParamsToUrlQuery: null,
    urlQueryToSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    assign: function() {
        return assign;
    },
    searchParamsToUrlQuery: function() {
        return searchParamsToUrlQuery;
    },
    urlQueryToSearchParams: function() {
        return urlQueryToSearchParams;
    }
});
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    for (const [key, value] of searchParams.entries()){
        const existing = query[key];
        if (typeof existing === 'undefined') {
            query[key] = value;
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            query[key] = [
                existing,
                value
            ];
        }
    }
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === 'string') {
        return param;
    }
    if (typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
        return String(param);
    } else {
        return '';
    }
}
function urlQueryToSearchParams(query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)){
        if (Array.isArray(value)) {
            for (const item of value){
                searchParams.append(key, stringifyUrlQueryParam(item));
            }
        } else {
            searchParams.set(key, stringifyUrlQueryParam(value));
        }
    }
    return searchParams;
}
function assign(target, ...searchParamsList) {
    for (const searchParams of searchParamsList){
        for (const key of searchParams.keys()){
            target.delete(key);
        }
        for (const [key, value] of searchParams.entries()){
            target.append(key, value);
        }
    }
    return target;
} //# sourceMappingURL=querystring.js.map
}),
"[project]/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatUrl: null,
    formatWithValidation: null,
    urlObjectKeys: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    formatUrl: function() {
        return formatUrl;
    },
    formatWithValidation: function() {
        return formatWithValidation;
    },
    urlObjectKeys: function() {
        return urlObjectKeys;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/next/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _querystring = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)"));
const slashedProtocols = /https?|ftp|gopher|file/;
function formatUrl(urlObj) {
    let { auth, hostname } = urlObj;
    let protocol = urlObj.protocol || '';
    let pathname = urlObj.pathname || '';
    let hash = urlObj.hash || '';
    let query = urlObj.query || '';
    let host = false;
    auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';
    if (urlObj.host) {
        host = auth + urlObj.host;
    } else if (hostname) {
        host = auth + (~hostname.indexOf(':') ? `[${hostname}]` : hostname);
        if (urlObj.port) {
            host += ':' + urlObj.port;
        }
    }
    if (query && typeof query === 'object') {
        query = String(_querystring.urlQueryToSearchParams(query));
    }
    let search = urlObj.search || query && `?${query}` || '';
    if (protocol && !protocol.endsWith(':')) protocol += ':';
    if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
    } else if (!host) {
        host = '';
    }
    if (hash && hash[0] !== '#') hash = '#' + hash;
    if (search && search[0] !== '?') search = '?' + search;
    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace('#', '%23');
    return `${protocol}${host}${pathname}${search}${hash}`;
}
const urlObjectKeys = [
    'auth',
    'hash',
    'host',
    'hostname',
    'href',
    'path',
    'pathname',
    'port',
    'protocol',
    'query',
    'search',
    'slashes'
];
function formatWithValidation(url) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (url !== null && typeof url === 'object') {
            Object.keys(url).forEach((key)=>{
                if (!urlObjectKeys.includes(key)) {
                    console.warn(`Unknown key passed via urlObject into url.format: ${key}`);
                }
            });
        }
    }
    return formatUrl(url);
} //# sourceMappingURL=format-url.js.map
}),
"[project]/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useMergedRef", {
    enumerable: true,
    get: function() {
        return useMergedRef;
    }
});
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function useMergedRef(refA, refB) {
    const cleanupA = (0, _react.useRef)(null);
    const cleanupB = (0, _react.useRef)(null);
    // NOTE: In theory, we could skip the wrapping if only one of the refs is non-null.
    // (this happens often if the user doesn't pass a ref to Link/Form/Image)
    // But this can cause us to leak a cleanup-ref into user code (previously via `<Link legacyBehavior>`),
    // and the user might pass that ref into ref-merging library that doesn't support cleanup refs
    // (because it hasn't been updated for React 19)
    // which can then cause things to blow up, because a cleanup-returning ref gets called with `null`.
    // So in practice, it's safer to be defensive and always wrap the ref, even on React 19.
    return (0, _react.useCallback)((current)=>{
        if (current === null) {
            const cleanupFnA = cleanupA.current;
            if (cleanupFnA) {
                cleanupA.current = null;
                cleanupFnA();
            }
            const cleanupFnB = cleanupB.current;
            if (cleanupFnB) {
                cleanupB.current = null;
                cleanupFnB();
            }
        } else {
            if (refA) {
                cleanupA.current = applyRef(refA, current);
            }
            if (refB) {
                cleanupB.current = applyRef(refB, current);
            }
        }
    }, [
        refA,
        refB
    ]);
}
function applyRef(refA, current) {
    if (typeof refA === 'function') {
        const cleanup = refA(current);
        if (typeof cleanup === 'function') {
            return cleanup;
        } else {
            return ()=>refA(null);
        }
    } else {
        refA.current = current;
        return ()=>{
            refA.current = null;
        };
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=use-merged-ref.js.map
}),
"[project]/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DecodeError: null,
    MiddlewareNotFoundError: null,
    MissingStaticPage: null,
    NormalizeError: null,
    PageNotFoundError: null,
    SP: null,
    ST: null,
    WEB_VITALS: null,
    execOnce: null,
    getDisplayName: null,
    getLocationOrigin: null,
    getURL: null,
    isAbsoluteUrl: null,
    isResSent: null,
    loadGetInitialProps: null,
    normalizeRepeatedSlashes: null,
    stringifyError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DecodeError: function() {
        return DecodeError;
    },
    MiddlewareNotFoundError: function() {
        return MiddlewareNotFoundError;
    },
    MissingStaticPage: function() {
        return MissingStaticPage;
    },
    NormalizeError: function() {
        return NormalizeError;
    },
    PageNotFoundError: function() {
        return PageNotFoundError;
    },
    SP: function() {
        return SP;
    },
    ST: function() {
        return ST;
    },
    WEB_VITALS: function() {
        return WEB_VITALS;
    },
    execOnce: function() {
        return execOnce;
    },
    getDisplayName: function() {
        return getDisplayName;
    },
    getLocationOrigin: function() {
        return getLocationOrigin;
    },
    getURL: function() {
        return getURL;
    },
    isAbsoluteUrl: function() {
        return isAbsoluteUrl;
    },
    isResSent: function() {
        return isResSent;
    },
    loadGetInitialProps: function() {
        return loadGetInitialProps;
    },
    normalizeRepeatedSlashes: function() {
        return normalizeRepeatedSlashes;
    },
    stringifyError: function() {
        return stringifyError;
    }
});
const WEB_VITALS = [
    'CLS',
    'FCP',
    'FID',
    'INP',
    'LCP',
    'TTFB'
];
function execOnce(fn) {
    let used = false;
    let result;
    return (...args)=>{
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}
function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    const urlParts = url.split('?');
    const urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, '/').replace(/\/\/+/g, '/') + (urlParts[1] ? `?${urlParts.slice(1).join('?')}` : '');
}
async function loadGetInitialProps(App, ctx) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (App.prototype?.getInitialProps) {
            const message = `"${getDisplayName(App)}.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.`;
            throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
                value: "E394",
                enumerable: false,
                configurable: true
            });
        }
    }
    // when called from _app `ctx` is nested in `ctx`
    const res = ctx.res || ctx.ctx && ctx.ctx.res;
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            // @ts-ignore pageProps default
            return {
                pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
            };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) {
        return props;
    }
    if (!props) {
        const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
        throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (Object.keys(props).length === 0 && !ctx.ctx) {
            console.warn(`${getDisplayName(App)} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://nextjs.org/docs/messages/empty-object-getInitialProps`);
        }
    }
    return props;
}
const SP = typeof performance !== 'undefined';
const ST = SP && [
    'mark',
    'measure',
    'getEntriesByName'
].every((method)=>typeof performance[method] === 'function');
class DecodeError extends Error {
}
class NormalizeError extends Error {
}
class PageNotFoundError extends Error {
    constructor(page){
        super();
        this.code = 'ENOENT';
        this.name = 'PageNotFoundError';
        this.message = `Cannot find module for page: ${page}`;
    }
}
class MissingStaticPage extends Error {
    constructor(page, message){
        super();
        this.message = `Failed to load static file for page: ${page} ${message}`;
    }
}
class MiddlewareNotFoundError extends Error {
    constructor(){
        super();
        this.code = 'ENOENT';
        this.message = `Cannot find the middleware module`;
    }
}
function stringifyError(error) {
    return JSON.stringify({
        message: error.message,
        stack: error.stack
    });
} //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLocalURL", {
    enumerable: true,
    get: function() {
        return isLocalURL;
    }
});
const _utils = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _hasbasepath = __turbopack_context__.r("[project]/node_modules/next/dist/client/has-base-path.js [app-client] (ecmascript)");
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils.isAbsoluteUrl)(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils.getLocationOrigin)();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasbasepath.hasBasePath)(resolved.pathname);
    } catch (_) {
        return false;
    }
} //# sourceMappingURL=is-local-url.js.map
}),
"[project]/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "errorOnce", {
    enumerable: true,
    get: function() {
        return errorOnce;
    }
});
let errorOnce = (_)=>{};
if ("TURBOPACK compile-time truthy", 1) {
    const errors = new Set();
    errorOnce = (msg)=>{
        if (!errors.has(msg)) {
            console.error(msg);
        }
        errors.add(msg);
    };
} //# sourceMappingURL=error-once.js.map
}),
"[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    useLinkStatus: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * A React component that extends the HTML `<a>` element to provide
 * [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)
 * and client-side navigation. This is the primary way to navigate between routes in Next.js.
 *
 * @remarks
 * - Prefetching is only enabled in production.
 *
 * @see https://nextjs.org/docs/app/api-reference/components/link
 */ default: function() {
        return LinkComponent;
    },
    useLinkStatus: function() {
        return useLinkStatus;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/next/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _formaturl = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _usemergedref = __turbopack_context__.r("[project]/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _addbasepath = __turbopack_context__.r("[project]/node_modules/next/dist/client/add-base-path.js [app-client] (ecmascript)");
const _warnonce = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
const _links = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/links.js [app-client] (ecmascript)");
const _islocalurl = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)");
const _segmentcache = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/segment-cache.js [app-client] (ecmascript)");
const _erroronce = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)");
function isModifiedEvent(event) {
    const eventTarget = event.currentTarget;
    const target = eventTarget.getAttribute('target');
    return target && target !== '_self' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
    event.nativeEvent && event.nativeEvent.which === 2;
}
function linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate) {
    if (typeof window !== 'undefined') {
        const { nodeName } = e.currentTarget;
        // anchors inside an svg have a lowercase nodeName
        const isAnchorNodeName = nodeName.toUpperCase() === 'A';
        if (isAnchorNodeName && isModifiedEvent(e) || e.currentTarget.hasAttribute('download')) {
            // ignore click for browser’s default behavior
            return;
        }
        if (!(0, _islocalurl.isLocalURL)(href)) {
            if (replace) {
                // browser default behavior does not replace the history state
                // so we need to do it manually
                e.preventDefault();
                location.replace(href);
            }
            // ignore click for browser’s default behavior
            return;
        }
        e.preventDefault();
        if (onNavigate) {
            let isDefaultPrevented = false;
            onNavigate({
                preventDefault: ()=>{
                    isDefaultPrevented = true;
                }
            });
            if (isDefaultPrevented) {
                return;
            }
        }
        const { dispatchNavigateAction } = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/app-router-instance.js [app-client] (ecmascript)");
        _react.default.startTransition(()=>{
            dispatchNavigateAction(as || href, replace ? 'replace' : 'push', scroll ?? true, linkInstanceRef.current);
        });
    }
}
function formatStringOrUrl(urlObjOrString) {
    if (typeof urlObjOrString === 'string') {
        return urlObjOrString;
    }
    return (0, _formaturl.formatUrl)(urlObjOrString);
}
function LinkComponent(props) {
    const [linkStatus, setOptimisticLinkStatus] = (0, _react.useOptimistic)(_links.IDLE_LINK_STATUS);
    let children;
    const linkInstanceRef = (0, _react.useRef)(null);
    const { href: hrefProp, as: asProp, children: childrenProp, prefetch: prefetchProp = null, passHref, replace, shallow, scroll, onClick, onMouseEnter: onMouseEnterProp, onTouchStart: onTouchStartProp, legacyBehavior = false, onNavigate, ref: forwardedRef, unstable_dynamicOnHover, ...restProps } = props;
    children = childrenProp;
    if (legacyBehavior && (typeof children === 'string' || typeof children === 'number')) {
        children = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            children: children
        });
    }
    const router = _react.default.useContext(_approutercontextsharedruntime.AppRouterContext);
    const prefetchEnabled = prefetchProp !== false;
    const fetchStrategy = prefetchProp !== false ? getFetchStrategyFromPrefetchProp(prefetchProp) : _segmentcache.FetchStrategy.PPR;
    if ("TURBOPACK compile-time truthy", 1) {
        function createPropError(args) {
            return Object.defineProperty(new Error(`Failed prop type: The prop \`${args.key}\` expects a ${args.expected} in \`<Link>\`, but got \`${args.actual}\` instead.` + (typeof window !== 'undefined' ? "\nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                value: "E319",
                enumerable: false,
                configurable: true
            });
        }
        // TypeScript trick for type-guarding:
        const requiredPropsGuard = {
            href: true
        };
        const requiredProps = Object.keys(requiredPropsGuard);
        requiredProps.forEach((key)=>{
            if (key === 'href') {
                if (props[key] == null || typeof props[key] !== 'string' && typeof props[key] !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: props[key] === null ? 'null' : typeof props[key]
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
        // TypeScript trick for type-guarding:
        const optionalPropsGuard = {
            as: true,
            replace: true,
            scroll: true,
            shallow: true,
            passHref: true,
            prefetch: true,
            unstable_dynamicOnHover: true,
            onClick: true,
            onMouseEnter: true,
            onTouchStart: true,
            legacyBehavior: true,
            onNavigate: true
        };
        const optionalProps = Object.keys(optionalPropsGuard);
        optionalProps.forEach((key)=>{
            const valType = typeof props[key];
            if (key === 'as') {
                if (props[key] && valType !== 'string' && valType !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: valType
                    });
                }
            } else if (key === 'onClick' || key === 'onMouseEnter' || key === 'onTouchStart' || key === 'onNavigate') {
                if (props[key] && valType !== 'function') {
                    throw createPropError({
                        key,
                        expected: '`function`',
                        actual: valType
                    });
                }
            } else if (key === 'replace' || key === 'scroll' || key === 'shallow' || key === 'passHref' || key === 'legacyBehavior' || key === 'unstable_dynamicOnHover') {
                if (props[key] != null && valType !== 'boolean') {
                    throw createPropError({
                        key,
                        expected: '`boolean`',
                        actual: valType
                    });
                }
            } else if (key === 'prefetch') {
                if (props[key] != null && valType !== 'boolean' && props[key] !== 'auto') {
                    throw createPropError({
                        key,
                        expected: '`boolean | "auto"`',
                        actual: valType
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (props.locale) {
            (0, _warnonce.warnOnce)('The `locale` prop is not supported in `next/link` while using the `app` router. Read more about app router internalization: https://nextjs.org/docs/app/building-your-application/routing/internationalization');
        }
        if (!asProp) {
            let href;
            if (typeof hrefProp === 'string') {
                href = hrefProp;
            } else if (typeof hrefProp === 'object' && typeof hrefProp.pathname === 'string') {
                href = hrefProp.pathname;
            }
            if (href) {
                const hasDynamicSegment = href.split('/').some((segment)=>segment.startsWith('[') && segment.endsWith(']'));
                if (hasDynamicSegment) {
                    throw Object.defineProperty(new Error(`Dynamic href \`${href}\` found in <Link> while using the \`/app\` router, this is not supported. Read more: https://nextjs.org/docs/messages/app-dir-dynamic-href`), "__NEXT_ERROR_CODE", {
                        value: "E267",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
    }
    const { href, as } = _react.default.useMemo({
        "LinkComponent.useMemo": ()=>{
            const resolvedHref = formatStringOrUrl(hrefProp);
            return {
                href: resolvedHref,
                as: asProp ? formatStringOrUrl(asProp) : resolvedHref
            };
        }
    }["LinkComponent.useMemo"], [
        hrefProp,
        asProp
    ]);
    // This will return the first child, if multiple are provided it will throw an error
    let child;
    if (legacyBehavior) {
        if (children?.$$typeof === Symbol.for('react.lazy')) {
            throw Object.defineProperty(new Error(`\`<Link legacyBehavior>\` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's \`<a>\` tag.`), "__NEXT_ERROR_CODE", {
                value: "E863",
                enumerable: false,
                configurable: true
            });
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (onClick) {
                console.warn(`"onClick" was passed to <Link> with \`href\` of \`${hrefProp}\` but "legacyBehavior" was set. The legacy behavior requires onClick be set on the child of next/link`);
            }
            if (onMouseEnterProp) {
                console.warn(`"onMouseEnter" was passed to <Link> with \`href\` of \`${hrefProp}\` but "legacyBehavior" was set. The legacy behavior requires onMouseEnter be set on the child of next/link`);
            }
            try {
                child = _react.default.Children.only(children);
            } catch (err) {
                if (!children) {
                    throw Object.defineProperty(new Error(`No children were passed to <Link> with \`href\` of \`${hrefProp}\` but one child is required https://nextjs.org/docs/messages/link-no-children`), "__NEXT_ERROR_CODE", {
                        value: "E320",
                        enumerable: false,
                        configurable: true
                    });
                }
                throw Object.defineProperty(new Error(`Multiple children were passed to <Link> with \`href\` of \`${hrefProp}\` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children` + (typeof window !== 'undefined' ? " \nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                    value: "E266",
                    enumerable: false,
                    configurable: true
                });
            }
        } else //TURBOPACK unreachable
        ;
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            if (children?.type === 'a') {
                throw Object.defineProperty(new Error('Invalid <Link> with <a> child. Please remove <a> or use <Link legacyBehavior>.\nLearn more: https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor'), "__NEXT_ERROR_CODE", {
                    value: "E209",
                    enumerable: false,
                    configurable: true
                });
            }
        }
    }
    const childRef = legacyBehavior ? child && typeof child === 'object' && child.ref : forwardedRef;
    // Use a callback ref to attach an IntersectionObserver to the anchor tag on
    // mount. In the future we will also use this to keep track of all the
    // currently mounted <Link> instances, e.g. so we can re-prefetch them after
    // a revalidation or refresh.
    const observeLinkVisibilityOnMount = _react.default.useCallback({
        "LinkComponent.useCallback[observeLinkVisibilityOnMount]": (element)=>{
            if (router !== null) {
                linkInstanceRef.current = (0, _links.mountLinkInstance)(element, href, router, fetchStrategy, prefetchEnabled, setOptimisticLinkStatus);
            }
            return ({
                "LinkComponent.useCallback[observeLinkVisibilityOnMount]": ()=>{
                    if (linkInstanceRef.current) {
                        (0, _links.unmountLinkForCurrentNavigation)(linkInstanceRef.current);
                        linkInstanceRef.current = null;
                    }
                    (0, _links.unmountPrefetchableInstance)(element);
                }
            })["LinkComponent.useCallback[observeLinkVisibilityOnMount]"];
        }
    }["LinkComponent.useCallback[observeLinkVisibilityOnMount]"], [
        prefetchEnabled,
        href,
        router,
        fetchStrategy,
        setOptimisticLinkStatus
    ]);
    const mergedRef = (0, _usemergedref.useMergedRef)(observeLinkVisibilityOnMount, childRef);
    const childProps = {
        ref: mergedRef,
        onClick (e) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (!e) {
                    throw Object.defineProperty(new Error(`Component rendered inside next/link has to pass click event to "onClick" prop.`), "__NEXT_ERROR_CODE", {
                        value: "E312",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
            if (!legacyBehavior && typeof onClick === 'function') {
                onClick(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onClick === 'function') {
                child.props.onClick(e);
            }
            if (!router) {
                return;
            }
            if (e.defaultPrevented) {
                return;
            }
            linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate);
        },
        onMouseEnter (e) {
            if (!legacyBehavior && typeof onMouseEnterProp === 'function') {
                onMouseEnterProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onMouseEnter === 'function') {
                child.props.onMouseEnter(e);
            }
            if (!router) {
                return;
            }
            if ("TURBOPACK compile-time truthy", 1) {
                return;
            }
            //TURBOPACK unreachable
            ;
            const upgradeToDynamicPrefetch = undefined;
        },
        onTouchStart: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : function onTouchStart(e) {
            if (!legacyBehavior && typeof onTouchStartProp === 'function') {
                onTouchStartProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onTouchStart === 'function') {
                child.props.onTouchStart(e);
            }
            if (!router) {
                return;
            }
            if (!prefetchEnabled) {
                return;
            }
            const upgradeToDynamicPrefetch = unstable_dynamicOnHover === true;
            (0, _links.onNavigationIntent)(e.currentTarget, upgradeToDynamicPrefetch);
        }
    };
    // If the url is absolute, we can bypass the logic to prepend the basePath.
    if ((0, _utils.isAbsoluteUrl)(as)) {
        childProps.href = as;
    } else if (!legacyBehavior || passHref || child.type === 'a' && !('href' in child.props)) {
        childProps.href = (0, _addbasepath.addBasePath)(as);
    }
    let link;
    if (legacyBehavior) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, _erroronce.errorOnce)('`legacyBehavior` is deprecated and will be removed in a future ' + 'release. A codemod is available to upgrade your components:\n\n' + 'npx @next/codemod@latest new-link .\n\n' + 'Learn more: https://nextjs.org/docs/app/building-your-application/upgrading/codemods#remove-a-tags-from-link-components');
        }
        link = /*#__PURE__*/ _react.default.cloneElement(child, childProps);
    } else {
        link = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            ...restProps,
            ...childProps,
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(LinkStatusContext.Provider, {
        value: linkStatus,
        children: link
    });
}
const LinkStatusContext = /*#__PURE__*/ (0, _react.createContext)(_links.IDLE_LINK_STATUS);
const useLinkStatus = ()=>{
    return (0, _react.useContext)(LinkStatusContext);
};
function getFetchStrategyFromPrefetchProp(prefetchProp) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return prefetchProp === null || prefetchProp === 'auto' ? _segmentcache.FetchStrategy.PPR : // (although invalid values should've been filtered out by prop validation in dev)
        _segmentcache.FetchStrategy.Full;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=link.js.map
}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This file must be bundled in the app's client layer, it shouldn't be directly
// imported by the server.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    callServer: null,
    createServerReference: null,
    findSourceMapURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    callServer: function() {
        return _appcallserver.callServer;
    },
    createServerReference: function() {
        return _client.createServerReference;
    },
    findSourceMapURL: function() {
        return _appfindsourcemapurl.findSourceMapURL;
    }
});
const _appcallserver = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-call-server.js [app-client] (ecmascript)");
const _appfindsourcemapurl = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-find-source-map-url.js [app-client] (ecmascript)");
const _client = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-server-dom-turbopack/client.js [app-client] (ecmascript)"); //# sourceMappingURL=action-client-wrapper.js.map
}),
]);

//# sourceMappingURL=_b9ee124e._.js.map
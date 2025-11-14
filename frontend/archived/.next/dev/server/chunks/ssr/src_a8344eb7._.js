module.exports = [
"[project]/src/identity-access/actions/auth.actions.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
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
}),
"[project]/src/identity-access/actions/data:bd6a02 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60a76c9a9b4ad7c70ac5696a449c9886d3c1f7e0b7":"handleLoginSubmission"},"src/identity-access/actions/auth.login.ts",""] */ __turbopack_context__.s([
    "handleLoginSubmission",
    ()=>handleLoginSubmission
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var handleLoginSubmission = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("60a76c9a9b4ad7c70ac5696a449c9886d3c1f7e0b7", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "handleLoginSubmission"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXV0aC5sb2dpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGZpbGVvdmVydmlldyBBdXRoZW50aWNhdGlvbiBMb2dpbiBPcGVyYXRpb25zXHJcbiAqIEBtb2R1bGUgbGliL2FjdGlvbnMvYXV0aC5sb2dpblxyXG4gKlxyXG4gKiBTZXJ2ZXIgYWN0aW9ucyBmb3IgbG9naW4gYW5kIGF1dGhlbnRpY2F0aW9uIG9wZXJhdGlvbnMuXHJcbiAqXHJcbiAqIEZlYXR1cmVzOlxyXG4gKiAtIExvZ2luIGZvcm0gdmFsaWRhdGlvbiBhbmQgcHJvY2Vzc2luZ1xyXG4gKiAtIFNlc3Npb24gY3JlYXRpb24gYW5kIGNvb2tpZSBtYW5hZ2VtZW50XHJcbiAqIC0gSElQQUEgYXVkaXQgbG9nZ2luZyBmb3IgbG9naW4gZXZlbnRzXHJcbiAqIC0gUmF0ZSBsaW1pdGluZyAoSVAgYW5kIGVtYWlsIGJhc2VkKVxyXG4gKiAtIElucHV0IHNhbml0aXphdGlvbiBhbmQgQ1NSRiBwcm90ZWN0aW9uXHJcbiAqIC0gU3RhbmRhcmRpemVkIGVycm9yIGhhbmRsaW5nXHJcbiAqL1xyXG5cclxuJ3VzZSBzZXJ2ZXInO1xyXG5cclxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcclxuaW1wb3J0IHsgY29va2llcywgaGVhZGVycyB9IGZyb20gJ25leHQvaGVhZGVycyc7XHJcbmltcG9ydCB7IHJlZGlyZWN0IH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJztcclxuXHJcbi8vIEFQSSBpbnRlZ3JhdGlvblxyXG5pbXBvcnQgeyBzZXJ2ZXJQb3N0LCBOZXh0QXBpQ2xpZW50RXJyb3IgfSBmcm9tICdAL2xpYi9hcGkvbmV4dGpzLWNsaWVudCc7XHJcbmltcG9ydCB7IEFQSV9FTkRQT0lOVFMgfSBmcm9tICdAL2NvbnN0YW50cy9hcGknO1xyXG5pbXBvcnQgeyBhdWRpdExvZywgQVVESVRfQUNUSU9OUywgZXh0cmFjdElQQWRkcmVzcywgZXh0cmFjdFVzZXJBZ2VudCB9IGZyb20gJ0AvbGliL2F1ZGl0JztcclxuXHJcbi8vIFNlY3VyaXR5IGhlbHBlcnNcclxuaW1wb3J0IHsgY2hlY2tSYXRlTGltaXQsIFJBVEVfTElNSVRTIH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvcmF0ZS1saW1pdCc7XHJcbmltcG9ydCB7IHNhZmVGb3JtRGF0YUVtYWlsLCBzYWZlRm9ybURhdGFQYXNzd29yZCB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2lucHV0LXNhbml0aXphdGlvbic7XHJcbmltcG9ydCB7XHJcbiAgYWN0aW9uRXJyb3IsXHJcbiAgYWN0aW9uUmF0ZUxpbWl0RXJyb3IsXHJcbiAgYWN0aW9uVmFsaWRhdGlvbkVycm9yLFxyXG4gIHRvTG9naW5Gb3JtU3RhdGVcclxufSBmcm9tICcuLi9saWIvaGVscGVycy9hY3Rpb24tcmVzdWx0JztcclxuaW1wb3J0IHsgZm9ybWF0Wm9kRXJyb3JzIH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvem9kLWVycm9ycyc7XHJcblxyXG4vLyBDb29raWUgY29uZmlndXJhdGlvblxyXG5pbXBvcnQge1xyXG4gIENPT0tJRV9OQU1FUyxcclxuICBnZXRBY2Nlc3NUb2tlbkNvb2tpZU9wdGlvbnMsXHJcbiAgZ2V0UmVmcmVzaFRva2VuQ29va2llT3B0aW9uc1xyXG59IGZyb20gJ0AvaWRlbnRpdHktYWNjZXNzL2xpYi9jb25maWcvY29va2llcyc7XHJcblxyXG4vLyBUeXBlcyBhbmQgc2NoZW1hc1xyXG5pbXBvcnQgdHlwZSB7IEF1dGhSZXNwb25zZSwgTG9naW5Gb3JtU3RhdGUgfSBmcm9tICcuL2F1dGgudHlwZXMnO1xyXG5pbXBvcnQgeyBBVVRIX0NBQ0hFX1RBR1MsIGxvZ2luU2NoZW1hIH0gZnJvbSAnLi9hdXRoLmNvbnN0YW50cyc7XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gTE9HSU4gQUNUSU9OU1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKiBMb2dpbiBhY3Rpb24gd2l0aCBjb21wcmVoZW5zaXZlIHNlY3VyaXR5IGZlYXR1cmVzXHJcbiAqXHJcbiAqIFNlY3VyaXR5IGZlYXR1cmVzOlxyXG4gKiAtIFJhdGUgbGltaXRpbmcgKElQLWJhc2VkOiA1LzE1bWluLCBFbWFpbC1iYXNlZDogMy8xNW1pbilcclxuICogLSBJbnB1dCBzYW5pdGl6YXRpb25cclxuICogLSBab2QgdmFsaWRhdGlvblxyXG4gKiAtIEhJUEFBIGF1ZGl0IGxvZ2dpbmdcclxuICogLSBTZWN1cmUgY29va2llIG1hbmFnZW1lbnRcclxuICpcclxuICogQHBhcmFtIF9wcmV2U3RhdGUgLSBQcmV2aW91cyBmb3JtIHN0YXRlICh1bnVzZWQsIGZvciB1c2VBY3Rpb25TdGF0ZSlcclxuICogQHBhcmFtIGZvcm1EYXRhIC0gRm9ybSBkYXRhIGNvbnRhaW5pbmcgZW1haWwgYW5kIHBhc3N3b3JkXHJcbiAqIEByZXR1cm5zIFN0YW5kYXJkaXplZCBsb2dpbiBmb3JtIHN0YXRlXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW5BY3Rpb24oXHJcbiAgX3ByZXZTdGF0ZTogTG9naW5Gb3JtU3RhdGUsXHJcbiAgZm9ybURhdGE6IEZvcm1EYXRhXHJcbik6IFByb21pc2U8TG9naW5Gb3JtU3RhdGU+IHtcclxuICAvLyBFeHRyYWN0IElQIGFkZHJlc3MgZm9yIHJhdGUgbGltaXRpbmdcclxuICBjb25zdCBoZWFkZXJzTGlzdCA9IGF3YWl0IGhlYWRlcnMoKTtcclxuICBjb25zdCBtb2NrUmVxdWVzdCA9IHtcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgZ2V0OiAobmFtZTogc3RyaW5nKSA9PiBoZWFkZXJzTGlzdC5nZXQobmFtZSlcclxuICAgIH1cclxuICB9IGFzIFJlcXVlc3Q7XHJcbiAgY29uc3QgaXBBZGRyZXNzID0gZXh0cmFjdElQQWRkcmVzcyhtb2NrUmVxdWVzdCk7XHJcblxyXG4gIC8vIFNhbml0aXplIGlucHV0cyBiZWZvcmUgdmFsaWRhdGlvblxyXG4gIGNvbnN0IGVtYWlsID0gc2FmZUZvcm1EYXRhRW1haWwoZm9ybURhdGEsICdlbWFpbCcpO1xyXG4gIGNvbnN0IHBhc3N3b3JkID0gc2FmZUZvcm1EYXRhUGFzc3dvcmQoZm9ybURhdGEsICdwYXNzd29yZCcpO1xyXG5cclxuICAvLyBSYXRlIGxpbWl0aW5nOiBJUC1iYXNlZCAocHJldmVudHMgYnJ1dGUgZm9yY2UgZnJvbSBzaW5nbGUgSVApXHJcbiAgY29uc3QgaXBSYXRlTGltaXQgPSBjaGVja1JhdGVMaW1pdCgnbG9naW4taXAnLCBpcEFkZHJlc3MsIFJBVEVfTElNSVRTLkxPR0lOX0lQKTtcclxuICBpZiAoaXBSYXRlTGltaXQubGltaXRlZCkge1xyXG4gICAgLy8gQXVkaXQgcmF0ZSBsaW1pdCB2aW9sYXRpb25cclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgdXNlcklkOiBlbWFpbCB8fCAndW5rbm93bicsXHJcbiAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5MT0dJTl9GQUlMRUQsXHJcbiAgICAgIHJlc291cmNlOiAnQXV0aGVudGljYXRpb24nLFxyXG4gICAgICBkZXRhaWxzOiBgUmF0ZSBsaW1pdCBleGNlZWRlZCBmcm9tIElQICR7aXBBZGRyZXNzfWAsXHJcbiAgICAgIGlwQWRkcmVzcyxcclxuICAgICAgdXNlckFnZW50OiBleHRyYWN0VXNlckFnZW50KG1vY2tSZXF1ZXN0KSxcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yTWVzc2FnZTogJ1JhdGUgbGltaXQgZXhjZWVkZWQnXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdG9Mb2dpbkZvcm1TdGF0ZShhY3Rpb25SYXRlTGltaXRFcnJvcihpcFJhdGVMaW1pdC5yZXNldEluISkpO1xyXG4gIH1cclxuXHJcbiAgLy8gUmF0ZSBsaW1pdGluZzogRW1haWwtYmFzZWQgKHByZXZlbnRzIHRhcmdldGVkIGF0dGFja3Mgb24gc3BlY2lmaWMgYWNjb3VudHMpXHJcbiAgaWYgKGVtYWlsKSB7XHJcbiAgICBjb25zdCBlbWFpbFJhdGVMaW1pdCA9IGNoZWNrUmF0ZUxpbWl0KCdsb2dpbi1lbWFpbCcsIGVtYWlsLCBSQVRFX0xJTUlUUy5MT0dJTl9FTUFJTCk7XHJcbiAgICBpZiAoZW1haWxSYXRlTGltaXQubGltaXRlZCkge1xyXG4gICAgICAvLyBBdWRpdCByYXRlIGxpbWl0IHZpb2xhdGlvblxyXG4gICAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgICAgdXNlcklkOiBlbWFpbCxcclxuICAgICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuTE9HSU5fRkFJTEVELFxyXG4gICAgICAgIHJlc291cmNlOiAnQXV0aGVudGljYXRpb24nLFxyXG4gICAgICAgIGRldGFpbHM6IGBSYXRlIGxpbWl0IGV4Y2VlZGVkIGZvciBlbWFpbCAke2VtYWlsfWAsXHJcbiAgICAgICAgaXBBZGRyZXNzLFxyXG4gICAgICAgIHVzZXJBZ2VudDogZXh0cmFjdFVzZXJBZ2VudChtb2NrUmVxdWVzdCksXHJcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiAnUmF0ZSBsaW1pdCBleGNlZWRlZCdcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gdG9Mb2dpbkZvcm1TdGF0ZShhY3Rpb25SYXRlTGltaXRFcnJvcihlbWFpbFJhdGVMaW1pdC5yZXNldEluISkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gVmFsaWRhdGUgZm9ybSBkYXRhIHdpdGggWm9kXHJcbiAgY29uc3QgdmFsaWRhdGVkRmllbGRzID0gbG9naW5TY2hlbWEuc2FmZVBhcnNlKHtcclxuICAgIGVtYWlsLFxyXG4gICAgcGFzc3dvcmQsXHJcbiAgfSk7XHJcblxyXG4gIGlmICghdmFsaWRhdGVkRmllbGRzLnN1Y2Nlc3MpIHtcclxuICAgIHJldHVybiB0b0xvZ2luRm9ybVN0YXRlKFxyXG4gICAgICBhY3Rpb25WYWxpZGF0aW9uRXJyb3IoZm9ybWF0Wm9kRXJyb3JzKHZhbGlkYXRlZEZpZWxkcy5lcnJvcikpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgZW1haWw6IHZhbGlkYXRlZEVtYWlsLCBwYXNzd29yZDogdmFsaWRhdGVkUGFzc3dvcmQgfSA9IHZhbGlkYXRlZEZpZWxkcy5kYXRhO1xyXG5cclxuICAgIC8vIENhbGwgYmFja2VuZCBhdXRoZW50aWNhdGlvbiBlbmRwb2ludFxyXG4gICAgY29uc3Qgd3JhcHBlZFJlc3BvbnNlID0gYXdhaXQgc2VydmVyUG9zdDxhbnk+KFxyXG4gICAgICBBUElfRU5EUE9JTlRTLkFVVEguTE9HSU4sXHJcbiAgICAgIHsgZW1haWw6IHZhbGlkYXRlZEVtYWlsLCBwYXNzd29yZDogdmFsaWRhdGVkUGFzc3dvcmQgfSxcclxuICAgICAge1xyXG4gICAgICAgIGNhY2hlOiAnbm8tc3RvcmUnLFxyXG4gICAgICAgIHJlcXVpcmVzQXV0aDogZmFsc2UsXHJcbiAgICAgICAgbmV4dDogeyB0YWdzOiBbQVVUSF9DQUNIRV9UQUdTLkFVVEhdIH1cclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnW0xvZ2luIEFjdGlvbl0gUmVzcG9uc2UgcmVjZWl2ZWQ6Jywge1xyXG4gICAgICBoYXNSZXNwb25zZTogISF3cmFwcGVkUmVzcG9uc2UsXHJcbiAgICAgIGhhc0RhdGE6ICEhd3JhcHBlZFJlc3BvbnNlPy5kYXRhLFxyXG4gICAgICByZXNwb25zZUtleXM6IHdyYXBwZWRSZXNwb25zZSA/IE9iamVjdC5rZXlzKHdyYXBwZWRSZXNwb25zZSkgOiBbXSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEJhY2tlbmQgd3JhcHMgcmVzcG9uc2UgaW4gQXBpUmVzcG9uc2UgZm9ybWF0IC0gZXh0cmFjdCBkYXRhXHJcbiAgICBjb25zdCByZXNwb25zZTogQXV0aFJlc3BvbnNlID0gd3JhcHBlZFJlc3BvbnNlPy5kYXRhIHx8IHdyYXBwZWRSZXNwb25zZTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnW0xvZ2luIEFjdGlvbl0gRXh0cmFjdGVkIGF1dGggZGF0YTonLCB7XHJcbiAgICAgIGhhc0FjY2Vzc1Rva2VuOiAhIXJlc3BvbnNlPy5hY2Nlc3NUb2tlbixcclxuICAgICAgaGFzUmVmcmVzaFRva2VuOiAhIXJlc3BvbnNlPy5yZWZyZXNoVG9rZW4sXHJcbiAgICAgIGhhc1VzZXI6ICEhcmVzcG9uc2U/LnVzZXIsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDaGVjayBpZiB3ZSBoYXZlIHZhbGlkIGF1dGhlbnRpY2F0aW9uIGRhdGFcclxuICAgIGlmICghcmVzcG9uc2UgfHwgIXJlc3BvbnNlLmFjY2Vzc1Rva2VuKSB7XHJcbiAgICAgIC8vIEF1ZGl0IGZhaWxlZCBsb2dpbiBhdHRlbXB0XHJcbiAgICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgICB1c2VySWQ6IHZhbGlkYXRlZEVtYWlsLFxyXG4gICAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5MT0dJTl9GQUlMRUQsXHJcbiAgICAgICAgcmVzb3VyY2U6ICdBdXRoZW50aWNhdGlvbicsXHJcbiAgICAgICAgZGV0YWlsczogYEZhaWxlZCBsb2dpbiBhdHRlbXB0IGZvciAke3ZhbGlkYXRlZEVtYWlsfWAsXHJcbiAgICAgICAgaXBBZGRyZXNzLFxyXG4gICAgICAgIHVzZXJBZ2VudDogZXh0cmFjdFVzZXJBZ2VudChtb2NrUmVxdWVzdCksXHJcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiAnSW52YWxpZCBjcmVkZW50aWFscydcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gdG9Mb2dpbkZvcm1TdGF0ZShcclxuICAgICAgICBhY3Rpb25FcnJvcihbJ0ludmFsaWQgY3JlZGVudGlhbHMnXSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBFeHRyYWN0IGRhdGEgZnJvbSBzdWNjZXNzZnVsIHJlc3BvbnNlXHJcbiAgICBjb25zdCB7IGFjY2Vzc1Rva2VuOiB0b2tlbiwgcmVmcmVzaFRva2VuLCB1c2VyIH0gPSByZXNwb25zZTtcclxuXHJcbiAgICAvLyBTZXQgSFRUUC1vbmx5IGNvb2tpZXMgdXNpbmcgY2VudHJhbGl6ZWQgY29uZmlndXJhdGlvblxyXG4gICAgY29uc3QgY29va2llU3RvcmUgPSBhd2FpdCBjb29raWVzKCk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ1tMb2dpbiBBY3Rpb25dIFNldHRpbmcgYXV0aCB0b2tlbjonLCB7XHJcbiAgICAgIHRva2VuTGVuZ3RoOiB0b2tlbj8ubGVuZ3RoLFxyXG4gICAgICB0b2tlblN0YXJ0OiB0b2tlbj8uc3Vic3RyaW5nKDAsIDIwKSxcclxuICAgICAgY29va2llTmFtZTogQ09PS0lFX05BTUVTLkFDQ0VTU19UT0tFTlxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVXNlIGNlbnRyYWxpemVkIGNvb2tpZSBjb25maWd1cmF0aW9uIGZvciBjb25zaXN0ZW50LCBzZWN1cmUgc2V0dGluZ3NcclxuICAgIGNvb2tpZVN0b3JlLnNldChcclxuICAgICAgQ09PS0lFX05BTUVTLkFDQ0VTU19UT0tFTixcclxuICAgICAgdG9rZW4sXHJcbiAgICAgIGdldEFjY2Vzc1Rva2VuQ29va2llT3B0aW9ucygpXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdbTG9naW4gQWN0aW9uXSBBdXRoIHRva2VuIGNvb2tpZSBzZXQsIHZlcmlmeWluZzonLCB7XHJcbiAgICAgIGNvb2tpZUV4aXN0czogISFjb29raWVTdG9yZS5nZXQoQ09PS0lFX05BTUVTLkFDQ0VTU19UT0tFTiksXHJcbiAgICAgIGNvb2tpZVZhbHVlOiBjb29raWVTdG9yZS5nZXQoQ09PS0lFX05BTUVTLkFDQ0VTU19UT0tFTik/LnZhbHVlPy5zdWJzdHJpbmcoMCwgMjApXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAocmVmcmVzaFRva2VuKSB7XHJcbiAgICAgIGNvb2tpZVN0b3JlLnNldChcclxuICAgICAgICBDT09LSUVfTkFNRVMuUkVGUkVTSF9UT0tFTixcclxuICAgICAgICByZWZyZXNoVG9rZW4sXHJcbiAgICAgICAgZ2V0UmVmcmVzaFRva2VuQ29va2llT3B0aW9ucygpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQXVkaXQgc3VjY2Vzc2Z1bCBsb2dpblxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICB1c2VySWQ6IHVzZXIuaWQsXHJcbiAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5MT0dJTixcclxuICAgICAgcmVzb3VyY2U6ICdBdXRoZW50aWNhdGlvbicsXHJcbiAgICAgIGRldGFpbHM6IGBVc2VyICR7dmFsaWRhdGVkRW1haWx9IGxvZ2dlZCBpbiBzdWNjZXNzZnVsbHlgLFxyXG4gICAgICBpcEFkZHJlc3MsXHJcbiAgICAgIHVzZXJBZ2VudDogZXh0cmFjdFVzZXJBZ2VudChtb2NrUmVxdWVzdCksXHJcbiAgICAgIHN1Y2Nlc3M6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignW0xvZ2luIEFjdGlvbl0gRXJyb3I6JywgZXJyb3IpO1xyXG5cclxuICAgIC8vIEhhbmRsZSBOZXh0QXBpQ2xpZW50RXJyb3Igd2l0aCBtb3JlIHNwZWNpZmljIG1lc3NhZ2luZ1xyXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgTmV4dEFwaUNsaWVudEVycm9yKSB7XHJcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGVycm9yLm1lc3NhZ2UgfHwgJ0F1dGhlbnRpY2F0aW9uIGZhaWxlZC4gUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMuJztcclxuXHJcbiAgICAgIC8vIEF1ZGl0IEFQSSBlcnJvclxyXG4gICAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgICAgdXNlcklkOiBlbWFpbCB8fCAndW5rbm93bicsXHJcbiAgICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLkxPR0lOX0ZBSUxFRCxcclxuICAgICAgICByZXNvdXJjZTogJ0F1dGhlbnRpY2F0aW9uJyxcclxuICAgICAgICBkZXRhaWxzOiBgTG9naW4gZXJyb3I6ICR7ZXJyb3JNZXNzYWdlfWAsXHJcbiAgICAgICAgaXBBZGRyZXNzLFxyXG4gICAgICAgIHVzZXJBZ2VudDogZXh0cmFjdFVzZXJBZ2VudChtb2NrUmVxdWVzdCksXHJcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIHRvTG9naW5Gb3JtU3RhdGUoYWN0aW9uRXJyb3IoW2Vycm9yTWVzc2FnZV0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBdWRpdCB1bmV4cGVjdGVkIGVycm9yXHJcbiAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgIHVzZXJJZDogZW1haWwgfHwgJ3Vua25vd24nLFxyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuTE9HSU5fRkFJTEVELFxyXG4gICAgICByZXNvdXJjZTogJ0F1dGhlbnRpY2F0aW9uJyxcclxuICAgICAgZGV0YWlsczogJ1VuZXhwZWN0ZWQgZXJyb3IgZHVyaW5nIGxvZ2luJyxcclxuICAgICAgaXBBZGRyZXNzLFxyXG4gICAgICB1c2VyQWdlbnQ6IGV4dHJhY3RVc2VyQWdlbnQobW9ja1JlcXVlc3QpLFxyXG4gICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRvTG9naW5Gb3JtU3RhdGUoXHJcbiAgICAgIGFjdGlvbkVycm9yKFsnQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2Fpbi4nXSlcclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogSGFuZGxlIGxvZ2luIGZvcm0gc3VibWlzc2lvbiBmcm9tIGxvZ2luIHBhZ2VcclxuICpcclxuICogRGVsZWdhdGVzIHRvIGNlbnRyYWxpemVkIGxvZ2luQWN0aW9uIGFuZCBoYW5kbGVzIHJlZGlyZWN0LlxyXG4gKiBUaGlzIGlzIHRoZSBhY3Rpb24gdGhhdCBzaG91bGQgYmUgdXNlZCBpbiBsb2dpbiBmb3Jtcy5cclxuICpcclxuICogQHBhcmFtIHByZXZTdGF0ZSAtIFByZXZpb3VzIGZvcm0gc3RhdGVcclxuICogQHBhcmFtIGZvcm1EYXRhIC0gRm9ybSBkYXRhIGNvbnRhaW5pbmcgY3JlZGVudGlhbHNcclxuICogQHJldHVybnMgTG9naW4gZm9ybSBzdGF0ZSBvciByZWRpcmVjdHMgdG8gZGFzaGJvYXJkXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlTG9naW5TdWJtaXNzaW9uKFxyXG4gIHByZXZTdGF0ZTogTG9naW5Gb3JtU3RhdGUsXHJcbiAgZm9ybURhdGE6IEZvcm1EYXRhXHJcbik6IFByb21pc2U8TG9naW5Gb3JtU3RhdGU+IHtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBsb2dpbkFjdGlvbihwcmV2U3RhdGUsIGZvcm1EYXRhKTtcclxuXHJcbiAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XHJcbiAgICAvLyBTdWNjZXNzZnVsIGxvZ2luIC0gcmV2YWxpZGF0ZSBhbmQgcmVkaXJlY3QgdG8gZGFzaGJvYXJkXHJcbiAgICByZXZhbGlkYXRlUGF0aCgnL2Rhc2hib2FyZCcsICdwYWdlJyk7XHJcbiAgICByZWRpcmVjdCgnL2Rhc2hib2FyZCcpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENsZWFyIGxvZ2luIGZvcm0gc3RhdGVcclxuICpcclxuICogVXRpbGl0eSBhY3Rpb24gZm9yIHJlc2V0dGluZyBmb3JtIHN0YXRlLlxyXG4gKlxyXG4gKiBAcmV0dXJucyBFbXB0eSBmb3JtIHN0YXRlXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xlYXJMb2dpbkZvcm0oKTogUHJvbWlzZTxMb2dpbkZvcm1TdGF0ZT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgIGVycm9yczogdW5kZWZpbmVkXHJcbiAgfTtcclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IndUQW1Sc0IifQ==
}),
"[project]/src/app/login/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/identity-access/actions/auth.actions.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$data$3a$bd6a02__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/identity-access/actions/data:bd6a02 [app-ssr] (ecmascript) <text/javascript>");
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
    const { pending } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFormStatus"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "submit",
        disabled: pending,
        className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
        "aria-busy": pending,
        children: pending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    "aria-hidden": "true",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 77,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 71,
                    columnNumber: 11
                }, this),
                "Signing in..."
            ]
        }, void 0, true) : 'Sign in'
    }, void 0, false, {
        fileName: "[project]/src/app/login/page.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
function LoginPage() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [formState, formAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useActionState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$data$3a$bd6a02__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["handleLoginSubmission"], {
        success: false
    });
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    /**
   * Extract error context from URL query parameters
   */ const errorParam = searchParams.get('error');
    /**
   * Process URL error parameters into user-friendly error messages
   * Using useMemo to avoid the eslint warning about setState in useEffect
   */ const urlError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!errorParam) return '';
        switch(errorParam){
            case 'invalid_token':
                return 'Your session has expired. Please log in again.';
            case 'session_expired':
                return 'Your session has expired due to inactivity. Please log in again.';
            case 'unauthorized':
                return 'You need to log in to access that page.';
            default:
                return 'An error occurred. Please try logging in again.';
        }
    }, [
        errorParam
    ]);
    /**
   * Get the error message to display
   * Priority: URL errors > Server action form errors
   */ const getErrorMessage = ()=>{
        if (urlError) return urlError;
        if (formState.errors?._form?.[0]) return formState.errors._form[0];
        if (formState.errors?.email?.[0]) return formState.errors.email[0];
        if (formState.errors?.password?.[0]) return formState.errors.password[0];
        return '';
    };
    const errorMessage = getErrorMessage();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-md w-full space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "mt-6 text-center text-3xl font-extrabold text-gray-900",
                            children: "Sign in to White Cross"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-center text-sm text-gray-600",
                            children: "School Health Management System"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 183,
                    columnNumber: 9
                }, this),
                errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-md bg-red-50 p-4",
                    role: "alert",
                    "aria-live": "assertive",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5 text-red-400",
                                    viewBox: "0 0 20 20",
                                    fill: "currentColor",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/login/page.tsx",
                                        lineNumber: 207,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 200,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ml-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-medium text-red-800",
                                    children: errorMessage
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 215,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 214,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 199,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 194,
                    columnNumber: 11
                }, this),
                formState.success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-md bg-green-50 p-4",
                    role: "alert",
                    "aria-live": "polite",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5 text-green-400",
                                    viewBox: "0 0 20 20",
                                    fill: "currentColor",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.23a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/login/page.tsx",
                                        lineNumber: 236,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 230,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 229,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ml-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-medium text-green-800",
                                    children: "Login successful! Redirecting..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 244,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 243,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 228,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 223,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    className: "mt-8 space-y-6",
                    action: formAction,
                    noValidate: true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-md shadow-sm -space-y-px",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "email",
                                            className: "sr-only",
                                            children: "Email address"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 255,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "email",
                                            name: "email",
                                            type: "email",
                                            autoComplete: "email",
                                            required: true,
                                            className: `appearance-none rounded-none relative block w-full px-3 py-2 border ${formState.errors?.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`,
                                            placeholder: "Email address",
                                            "aria-required": "true",
                                            "aria-invalid": formState.errors?.email ? true : false,
                                            "aria-describedby": formState.errors?.email ? 'email-error' : undefined
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 258,
                                            columnNumber: 15
                                        }, this),
                                        formState.errors?.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            id: "email-error",
                                            className: "mt-1 text-sm text-red-600",
                                            role: "alert",
                                            children: formState.errors.email[0]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 273,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "password",
                                            className: "sr-only",
                                            children: "Password"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 281,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "password",
                                            name: "password",
                                            type: showPassword ? 'text' : 'password',
                                            autoComplete: "current-password",
                                            required: true,
                                            className: `appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border ${formState.errors?.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`,
                                            placeholder: "Password",
                                            "aria-required": "true",
                                            "aria-invalid": formState.errors?.password ? true : false,
                                            "aria-describedby": formState.errors?.password ? 'password-error' : undefined
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 284,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setShowPassword(!showPassword),
                                            className: "absolute inset-y-0 right-0 pr-3 flex items-center",
                                            "aria-label": showPassword ? 'Hide password' : 'Show password',
                                            children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "h-5 w-5 text-gray-400",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                "aria-hidden": "true",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/login/page.tsx",
                                                lineNumber: 305,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "h-5 w-5 text-gray-400",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                "aria-hidden": "true",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/login/page.tsx",
                                                        lineNumber: 310,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/login/page.tsx",
                                                        lineNumber: 311,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/login/page.tsx",
                                                lineNumber: 309,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 298,
                                            columnNumber: 15
                                        }, this),
                                        formState.errors?.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            id: "password-error",
                                            className: "mt-1 text-sm text-red-600",
                                            role: "alert",
                                            children: formState.errors.password[0]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 316,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "remember-me",
                                            name: "remember-me",
                                            type: "checkbox",
                                            className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 326,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "remember-me",
                                            className: "ml-2 block text-sm text-gray-900",
                                            children: "Remember me"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 332,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 325,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/forgot-password",
                                        className: "font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                        children: "Forgot your password?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/login/page.tsx",
                                        lineNumber: 338,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 337,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 324,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SubmitButton, {}, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 349,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 348,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 flex items-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full border-t border-gray-300"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/login/page.tsx",
                                        lineNumber: 355,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 354,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative flex justify-center text-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 bg-gray-50 text-gray-500",
                                        children: "Or continue with"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/login/page.tsx",
                                        lineNumber: 358,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 357,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 353,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5",
                                            viewBox: "0 0 24 24",
                                            "aria-hidden": "true",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
                                                    fill: "#4285F4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 369,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                                                    fill: "#34A853"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 373,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                                                    fill: "#FBBC05"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 377,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                                                    fill: "#EA4335"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 368,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-2",
                                            children: "Google"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 386,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 364,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5",
                                            viewBox: "0 0 24 24",
                                            fill: "#00A4EF",
                                            "aria-hidden": "true",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/login/page.tsx",
                                                lineNumber: 394,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 393,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-2",
                                            children: "Microsoft"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.tsx",
                                            lineNumber: 396,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.tsx",
                                    lineNumber: 389,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/login/page.tsx",
                            lineNumber: 363,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 251,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600",
                        children: [
                            "Don't have an account?",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/register",
                                className: "font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                children: "Create one"
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.tsx",
                                lineNumber: 405,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 403,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 402,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600",
                        children: "Need help? Contact your system administrator."
                    }, void 0, false, {
                        fileName: "[project]/src/app/login/page.tsx",
                        lineNumber: 416,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.tsx",
                    lineNumber: 415,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.tsx",
            lineNumber: 181,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/login/page.tsx",
        lineNumber: 180,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_a8344eb7._.js.map
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/actions/data:699773 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"402b8515ed8c2f2e22bbc4374c605b0f5e932dcc9a":"updateSystemConfiguration"},"src/lib/actions/admin.configuration.ts",""] */ __turbopack_context__.s([
    "updateSystemConfiguration",
    ()=>updateSystemConfiguration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var updateSystemConfiguration = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("402b8515ed8c2f2e22bbc4374c605b0f5e932dcc9a", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "updateSystemConfiguration"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWRtaW4uY29uZmlndXJhdGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQWRtaW4gQ29uZmlndXJhdGlvbiBTZXJ2ZXIgQWN0aW9ucyAtIFN5c3RlbSBzZXR0aW5ncyBtYW5hZ2VtZW50XHJcbiAqXHJcbiAqIEBtb2R1bGUgbGliL2FjdGlvbnMvYWRtaW4uY29uZmlndXJhdGlvblxyXG4gKiBAc2luY2UgMjAyNS0xMS0wNVxyXG4gKi9cclxuXHJcbid1c2Ugc2VydmVyJ1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTeXN0ZW1Db25maWd1cmF0aW9uIHtcclxuICBpZDogc3RyaW5nXHJcbiAgc2Vzc2lvblRpbWVvdXQ6IG51bWJlclxyXG4gIHBhc3N3b3JkTWluTGVuZ3RoOiBudW1iZXJcclxuICBwYXNzd29yZFJlcXVpcmVTcGVjaWFsQ2hhcnM6IGJvb2xlYW5cclxuICBtYXhMb2dpbkF0dGVtcHRzOiBudW1iZXJcclxuICBiYWNrdXBGcmVxdWVuY3k6ICdob3VybHknIHwgJ2RhaWx5JyB8ICd3ZWVrbHknXHJcbiAgZW5hYmxlQXVkaXRMb2dnaW5nOiBib29sZWFuXHJcbiAgZW5hYmxlRW1haWxOb3RpZmljYXRpb25zOiBib29sZWFuXHJcbiAgZW5hYmxlU01TTm90aWZpY2F0aW9uczogYm9vbGVhblxyXG4gIG1haW50ZW5hbmNlTW9kZTogYm9vbGVhblxyXG4gIGNyZWF0ZWRBdDogRGF0ZVxyXG4gIHVwZGF0ZWRBdDogRGF0ZVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZ3VyYXRpb25VcGRhdGVEYXRhIHtcclxuICBzZXNzaW9uVGltZW91dD86IG51bWJlclxyXG4gIHBhc3N3b3JkTWluTGVuZ3RoPzogbnVtYmVyXHJcbiAgcGFzc3dvcmRSZXF1aXJlU3BlY2lhbENoYXJzPzogYm9vbGVhblxyXG4gIG1heExvZ2luQXR0ZW1wdHM/OiBudW1iZXJcclxuICBiYWNrdXBGcmVxdWVuY3k/OiAnaG91cmx5JyB8ICdkYWlseScgfCAnd2Vla2x5J1xyXG4gIGVuYWJsZUF1ZGl0TG9nZ2luZz86IGJvb2xlYW5cclxuICBlbmFibGVFbWFpbE5vdGlmaWNhdGlvbnM/OiBib29sZWFuXHJcbiAgZW5hYmxlU01TTm90aWZpY2F0aW9ucz86IGJvb2xlYW5cclxuICBtYWludGVuYW5jZU1vZGU/OiBib29sZWFuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgY3VycmVudCBzeXN0ZW0gY29uZmlndXJhdGlvblxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFN5c3RlbUNvbmZpZ3VyYXRpb24oKTogUHJvbWlzZTxTeXN0ZW1Db25maWd1cmF0aW9uPiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7cHJvY2Vzcy5lbnYuQVBJX0JBU0VfVVJMfS9hcGkvY29uZmlndXJhdGlvbmAsIHtcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7cHJvY2Vzcy5lbnYuQVBJX1RPS0VOfWAsXHJcbiAgICAgIH0sXHJcbiAgICB9KVxyXG5cclxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQIGVycm9yISBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgcmV0dXJuIGRhdGEuY29uZmlndXJhdGlvblxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBzeXN0ZW0gY29uZmlndXJhdGlvbjonLCBlcnJvcilcclxuICAgIC8vIFJldHVybiBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gaWYgQVBJIGZhaWxzXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpZDogJ2RlZmF1bHQnLFxyXG4gICAgICBzZXNzaW9uVGltZW91dDogMzAsXHJcbiAgICAgIHBhc3N3b3JkTWluTGVuZ3RoOiA4LFxyXG4gICAgICBwYXNzd29yZFJlcXVpcmVTcGVjaWFsQ2hhcnM6IHRydWUsXHJcbiAgICAgIG1heExvZ2luQXR0ZW1wdHM6IDUsXHJcbiAgICAgIGJhY2t1cEZyZXF1ZW5jeTogJ2RhaWx5JyxcclxuICAgICAgZW5hYmxlQXVkaXRMb2dnaW5nOiB0cnVlLFxyXG4gICAgICBlbmFibGVFbWFpbE5vdGlmaWNhdGlvbnM6IHRydWUsXHJcbiAgICAgIGVuYWJsZVNNU05vdGlmaWNhdGlvbnM6IHRydWUsXHJcbiAgICAgIG1haW50ZW5hbmNlTW9kZTogZmFsc2UsXHJcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKSxcclxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBzeXN0ZW0gY29uZmlndXJhdGlvblxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVN5c3RlbUNvbmZpZ3VyYXRpb24oXHJcbiAgdXBkYXRlRGF0YTogQ29uZmlndXJhdGlvblVwZGF0ZURhdGFcclxuKTogUHJvbWlzZTx7IHN1Y2Nlc3M6IGJvb2xlYW47IG1lc3NhZ2U6IHN0cmluZzsgY29uZmlndXJhdGlvbj86IFN5c3RlbUNvbmZpZ3VyYXRpb24gfT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3Byb2Nlc3MuZW52LkFQSV9CQVNFX1VSTH0vYXBpL2NvbmZpZ3VyYXRpb25gLCB7XHJcbiAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Byb2Nlc3MuZW52LkFQSV9UT0tFTn1gLFxyXG4gICAgICB9LFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh1cGRhdGVEYXRhKSxcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgZXJyb3IhIHN0YXR1czogJHtyZXNwb25zZS5zdGF0dXN9YClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICBcclxuICAgIC8vIFJldmFsaWRhdGUgY2FjaGVcclxuICAgIGF3YWl0IGZldGNoKGAke3Byb2Nlc3MuZW52LkFQSV9CQVNFX1VSTH0vYXBpL3JldmFsaWRhdGU/dGFnPWFkbWluLWNvbmZpZ3VyYXRpb25gLCB7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Byb2Nlc3MuZW52LkFQSV9UT0tFTn1gIH0sXHJcbiAgICB9KVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6ICdDb25maWd1cmF0aW9uIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5JyxcclxuICAgICAgY29uZmlndXJhdGlvbjogZGF0YS5jb25maWd1cmF0aW9uLFxyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciB1cGRhdGluZyBzeXN0ZW0gY29uZmlndXJhdGlvbjonLCBlcnJvcilcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBtZXNzYWdlOiAnRmFpbGVkIHRvIHVwZGF0ZSBjb25maWd1cmF0aW9uJyxcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgY29uZmlndXJhdGlvbiBhdWRpdCB0cmFpbFxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbmZpZ3VyYXRpb25BdWRpdFRyYWlsKCk6IFByb21pc2U8QXJyYXk8e1xyXG4gIGlkOiBzdHJpbmdcclxuICBmaWVsZDogc3RyaW5nXHJcbiAgb2xkVmFsdWU6IHVua25vd25cclxuICBuZXdWYWx1ZTogdW5rbm93blxyXG4gIGNoYW5nZWRCeTogc3RyaW5nXHJcbiAgY2hhbmdlZEF0OiBEYXRlXHJcbiAgcmVhc29uPzogc3RyaW5nXHJcbn0+PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7cHJvY2Vzcy5lbnYuQVBJX0JBU0VfVVJMfS9hcGkvY29uZmlndXJhdGlvbi9hdWRpdGAsIHtcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7cHJvY2Vzcy5lbnYuQVBJX1RPS0VOfWAsXHJcbiAgICAgIH0sXHJcbiAgICB9KVxyXG5cclxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQIGVycm9yISBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgcmV0dXJuIGRhdGEuYXVkaXRUcmFpbCB8fCBbXVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBjb25maWd1cmF0aW9uIGF1ZGl0IHRyYWlsOicsIGVycm9yKVxyXG4gICAgcmV0dXJuIFtdXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmVzZXQgY29uZmlndXJhdGlvbiB0byBkZWZhdWx0c1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc2V0Q29uZmlndXJhdGlvblRvRGVmYXVsdHMoKTogUHJvbWlzZTx7IHN1Y2Nlc3M6IGJvb2xlYW47IG1lc3NhZ2U6IHN0cmluZyB9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7cHJvY2Vzcy5lbnYuQVBJX0JBU0VfVVJMfS9hcGkvY29uZmlndXJhdGlvbi9yZXNldGAsIHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Byb2Nlc3MuZW52LkFQSV9UT0tFTn1gLFxyXG4gICAgICB9LFxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCBlcnJvciEgc3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31gKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJldmFsaWRhdGUgY2FjaGVcclxuICAgIGF3YWl0IGZldGNoKGAke3Byb2Nlc3MuZW52LkFQSV9CQVNFX1VSTH0vYXBpL3JldmFsaWRhdGU/dGFnPWFkbWluLWNvbmZpZ3VyYXRpb25gLCB7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Byb2Nlc3MuZW52LkFQSV9UT0tFTn1gIH0sXHJcbiAgICB9KVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6ICdDb25maWd1cmF0aW9uIHJlc2V0IHRvIGRlZmF1bHRzIHN1Y2Nlc3NmdWxseScsXHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlc2V0dGluZyBjb25maWd1cmF0aW9uOicsIGVycm9yKVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIG1lc3NhZ2U6ICdGYWlsZWQgdG8gcmVzZXQgY29uZmlndXJhdGlvbicsXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoieVRBOEVzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/actions/data:41966a [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0039f13be7a2372585d08c26af331c6a113c4a216b":"resetConfigurationToDefaults"},"src/lib/actions/admin.configuration.ts",""] */ __turbopack_context__.s([
    "resetConfigurationToDefaults",
    ()=>resetConfigurationToDefaults
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var resetConfigurationToDefaults = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("0039f13be7a2372585d08c26af331c6a113c4a216b", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "resetConfigurationToDefaults"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWRtaW4uY29uZmlndXJhdGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQWRtaW4gQ29uZmlndXJhdGlvbiBTZXJ2ZXIgQWN0aW9ucyAtIFN5c3RlbSBzZXR0aW5ncyBtYW5hZ2VtZW50XHJcbiAqXHJcbiAqIEBtb2R1bGUgbGliL2FjdGlvbnMvYWRtaW4uY29uZmlndXJhdGlvblxyXG4gKiBAc2luY2UgMjAyNS0xMS0wNVxyXG4gKi9cclxuXHJcbid1c2Ugc2VydmVyJ1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTeXN0ZW1Db25maWd1cmF0aW9uIHtcclxuICBpZDogc3RyaW5nXHJcbiAgc2Vzc2lvblRpbWVvdXQ6IG51bWJlclxyXG4gIHBhc3N3b3JkTWluTGVuZ3RoOiBudW1iZXJcclxuICBwYXNzd29yZFJlcXVpcmVTcGVjaWFsQ2hhcnM6IGJvb2xlYW5cclxuICBtYXhMb2dpbkF0dGVtcHRzOiBudW1iZXJcclxuICBiYWNrdXBGcmVxdWVuY3k6ICdob3VybHknIHwgJ2RhaWx5JyB8ICd3ZWVrbHknXHJcbiAgZW5hYmxlQXVkaXRMb2dnaW5nOiBib29sZWFuXHJcbiAgZW5hYmxlRW1haWxOb3RpZmljYXRpb25zOiBib29sZWFuXHJcbiAgZW5hYmxlU01TTm90aWZpY2F0aW9uczogYm9vbGVhblxyXG4gIG1haW50ZW5hbmNlTW9kZTogYm9vbGVhblxyXG4gIGNyZWF0ZWRBdDogRGF0ZVxyXG4gIHVwZGF0ZWRBdDogRGF0ZVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZ3VyYXRpb25VcGRhdGVEYXRhIHtcclxuICBzZXNzaW9uVGltZW91dD86IG51bWJlclxyXG4gIHBhc3N3b3JkTWluTGVuZ3RoPzogbnVtYmVyXHJcbiAgcGFzc3dvcmRSZXF1aXJlU3BlY2lhbENoYXJzPzogYm9vbGVhblxyXG4gIG1heExvZ2luQXR0ZW1wdHM/OiBudW1iZXJcclxuICBiYWNrdXBGcmVxdWVuY3k/OiAnaG91cmx5JyB8ICdkYWlseScgfCAnd2Vla2x5J1xyXG4gIGVuYWJsZUF1ZGl0TG9nZ2luZz86IGJvb2xlYW5cclxuICBlbmFibGVFbWFpbE5vdGlmaWNhdGlvbnM/OiBib29sZWFuXHJcbiAgZW5hYmxlU01TTm90aWZpY2F0aW9ucz86IGJvb2xlYW5cclxuICBtYWludGVuYW5jZU1vZGU/OiBib29sZWFuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgY3VycmVudCBzeXN0ZW0gY29uZmlndXJhdGlvblxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFN5c3RlbUNvbmZpZ3VyYXRpb24oKTogUHJvbWlzZTxTeXN0ZW1Db25maWd1cmF0aW9uPiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7cHJvY2Vzcy5lbnYuQVBJX0JBU0VfVVJMfS9hcGkvY29uZmlndXJhdGlvbmAsIHtcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7cHJvY2Vzcy5lbnYuQVBJX1RPS0VOfWAsXHJcbiAgICAgIH0sXHJcbiAgICB9KVxyXG5cclxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQIGVycm9yISBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgcmV0dXJuIGRhdGEuY29uZmlndXJhdGlvblxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBzeXN0ZW0gY29uZmlndXJhdGlvbjonLCBlcnJvcilcclxuICAgIC8vIFJldHVybiBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gaWYgQVBJIGZhaWxzXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpZDogJ2RlZmF1bHQnLFxyXG4gICAgICBzZXNzaW9uVGltZW91dDogMzAsXHJcbiAgICAgIHBhc3N3b3JkTWluTGVuZ3RoOiA4LFxyXG4gICAgICBwYXNzd29yZFJlcXVpcmVTcGVjaWFsQ2hhcnM6IHRydWUsXHJcbiAgICAgIG1heExvZ2luQXR0ZW1wdHM6IDUsXHJcbiAgICAgIGJhY2t1cEZyZXF1ZW5jeTogJ2RhaWx5JyxcclxuICAgICAgZW5hYmxlQXVkaXRMb2dnaW5nOiB0cnVlLFxyXG4gICAgICBlbmFibGVFbWFpbE5vdGlmaWNhdGlvbnM6IHRydWUsXHJcbiAgICAgIGVuYWJsZVNNU05vdGlmaWNhdGlvbnM6IHRydWUsXHJcbiAgICAgIG1haW50ZW5hbmNlTW9kZTogZmFsc2UsXHJcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKSxcclxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBzeXN0ZW0gY29uZmlndXJhdGlvblxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVN5c3RlbUNvbmZpZ3VyYXRpb24oXHJcbiAgdXBkYXRlRGF0YTogQ29uZmlndXJhdGlvblVwZGF0ZURhdGFcclxuKTogUHJvbWlzZTx7IHN1Y2Nlc3M6IGJvb2xlYW47IG1lc3NhZ2U6IHN0cmluZzsgY29uZmlndXJhdGlvbj86IFN5c3RlbUNvbmZpZ3VyYXRpb24gfT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3Byb2Nlc3MuZW52LkFQSV9CQVNFX1VSTH0vYXBpL2NvbmZpZ3VyYXRpb25gLCB7XHJcbiAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Byb2Nlc3MuZW52LkFQSV9UT0tFTn1gLFxyXG4gICAgICB9LFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh1cGRhdGVEYXRhKSxcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgZXJyb3IhIHN0YXR1czogJHtyZXNwb25zZS5zdGF0dXN9YClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICBcclxuICAgIC8vIFJldmFsaWRhdGUgY2FjaGVcclxuICAgIGF3YWl0IGZldGNoKGAke3Byb2Nlc3MuZW52LkFQSV9CQVNFX1VSTH0vYXBpL3JldmFsaWRhdGU/dGFnPWFkbWluLWNvbmZpZ3VyYXRpb25gLCB7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Byb2Nlc3MuZW52LkFQSV9UT0tFTn1gIH0sXHJcbiAgICB9KVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6ICdDb25maWd1cmF0aW9uIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5JyxcclxuICAgICAgY29uZmlndXJhdGlvbjogZGF0YS5jb25maWd1cmF0aW9uLFxyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciB1cGRhdGluZyBzeXN0ZW0gY29uZmlndXJhdGlvbjonLCBlcnJvcilcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBtZXNzYWdlOiAnRmFpbGVkIHRvIHVwZGF0ZSBjb25maWd1cmF0aW9uJyxcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgY29uZmlndXJhdGlvbiBhdWRpdCB0cmFpbFxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbmZpZ3VyYXRpb25BdWRpdFRyYWlsKCk6IFByb21pc2U8QXJyYXk8e1xyXG4gIGlkOiBzdHJpbmdcclxuICBmaWVsZDogc3RyaW5nXHJcbiAgb2xkVmFsdWU6IHVua25vd25cclxuICBuZXdWYWx1ZTogdW5rbm93blxyXG4gIGNoYW5nZWRCeTogc3RyaW5nXHJcbiAgY2hhbmdlZEF0OiBEYXRlXHJcbiAgcmVhc29uPzogc3RyaW5nXHJcbn0+PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7cHJvY2Vzcy5lbnYuQVBJX0JBU0VfVVJMfS9hcGkvY29uZmlndXJhdGlvbi9hdWRpdGAsIHtcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7cHJvY2Vzcy5lbnYuQVBJX1RPS0VOfWAsXHJcbiAgICAgIH0sXHJcbiAgICB9KVxyXG5cclxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQIGVycm9yISBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgcmV0dXJuIGRhdGEuYXVkaXRUcmFpbCB8fCBbXVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBjb25maWd1cmF0aW9uIGF1ZGl0IHRyYWlsOicsIGVycm9yKVxyXG4gICAgcmV0dXJuIFtdXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmVzZXQgY29uZmlndXJhdGlvbiB0byBkZWZhdWx0c1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc2V0Q29uZmlndXJhdGlvblRvRGVmYXVsdHMoKTogUHJvbWlzZTx7IHN1Y2Nlc3M6IGJvb2xlYW47IG1lc3NhZ2U6IHN0cmluZyB9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7cHJvY2Vzcy5lbnYuQVBJX0JBU0VfVVJMfS9hcGkvY29uZmlndXJhdGlvbi9yZXNldGAsIHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Byb2Nlc3MuZW52LkFQSV9UT0tFTn1gLFxyXG4gICAgICB9LFxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCBlcnJvciEgc3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31gKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJldmFsaWRhdGUgY2FjaGVcclxuICAgIGF3YWl0IGZldGNoKGAke3Byb2Nlc3MuZW52LkFQSV9CQVNFX1VSTH0vYXBpL3JldmFsaWRhdGU/dGFnPWFkbWluLWNvbmZpZ3VyYXRpb25gLCB7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Byb2Nlc3MuZW52LkFQSV9UT0tFTn1gIH0sXHJcbiAgICB9KVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6ICdDb25maWd1cmF0aW9uIHJlc2V0IHRvIGRlZmF1bHRzIHN1Y2Nlc3NmdWxseScsXHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlc2V0dGluZyBjb25maWd1cmF0aW9uOicsIGVycm9yKVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIG1lc3NhZ2U6ICdGYWlsZWQgdG8gcmVzZXQgY29uZmlndXJhdGlvbicsXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiNFRBeUpzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Configuration Management Content Component - Client-side configuration form
 *
 * @module app/admin/settings/configuration/_components/ConfigurationManagementContent
 * @since 2025-11-05
 */ __turbopack_context__.s([
    "default",
    ()=>ConfigurationManagementContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$699773__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/data:699773 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$41966a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/data:41966a [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function ConfigurationManagementContent(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(106);
    if ($[0] !== "bca2696209138a56e2fbcc23131f7ba65caa4dccb86156ba59e31b75fe2ac265") {
        for(let $i = 0; $i < 106; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "bca2696209138a56e2fbcc23131f7ba65caa4dccb86156ba59e31b75fe2ac265";
    }
    const { initialConfiguration } = t0;
    const [configuration, setConfiguration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialConfiguration);
    const [isPending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = ({
            "ConfigurationManagementContent[handleUpdate]": (updates)=>{
                setConfiguration({
                    "ConfigurationManagementContent[handleUpdate > setConfiguration()]": (prev)=>({
                            ...prev,
                            ...updates
                        })
                }["ConfigurationManagementContent[handleUpdate > setConfiguration()]"]);
            }
        })["ConfigurationManagementContent[handleUpdate]"];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const handleUpdate = t1;
    let t2;
    if ($[2] !== configuration.backupFrequency || $[3] !== configuration.enableAuditLogging || $[4] !== configuration.enableEmailNotifications || $[5] !== configuration.enableSMSNotifications || $[6] !== configuration.maintenanceMode || $[7] !== configuration.maxLoginAttempts || $[8] !== configuration.passwordMinLength || $[9] !== configuration.passwordRequireSpecialChars || $[10] !== configuration.sessionTimeout) {
        t2 = ({
            "ConfigurationManagementContent[handleSave]": ()=>{
                startTransition({
                    "ConfigurationManagementContent[handleSave > startTransition()]": async ()=>{
                        ;
                        try {
                            const updateData = {
                                sessionTimeout: configuration.sessionTimeout,
                                passwordMinLength: configuration.passwordMinLength,
                                passwordRequireSpecialChars: configuration.passwordRequireSpecialChars,
                                maxLoginAttempts: configuration.maxLoginAttempts,
                                backupFrequency: configuration.backupFrequency,
                                enableAuditLogging: configuration.enableAuditLogging,
                                enableEmailNotifications: configuration.enableEmailNotifications,
                                enableSMSNotifications: configuration.enableSMSNotifications,
                                maintenanceMode: configuration.maintenanceMode
                            };
                            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$699773__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["updateSystemConfiguration"])(updateData);
                            if (result.success) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success(result.message);
                                if (result.configuration) {
                                    setConfiguration(result.configuration);
                                }
                            } else {
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(result.message);
                            }
                        } catch (t3) {
                            const error = t3;
                            console.error("Error saving configuration:", error);
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Failed to save configuration");
                        }
                    }
                }["ConfigurationManagementContent[handleSave > startTransition()]"]);
            }
        })["ConfigurationManagementContent[handleSave]"];
        $[2] = configuration.backupFrequency;
        $[3] = configuration.enableAuditLogging;
        $[4] = configuration.enableEmailNotifications;
        $[5] = configuration.enableSMSNotifications;
        $[6] = configuration.maintenanceMode;
        $[7] = configuration.maxLoginAttempts;
        $[8] = configuration.passwordMinLength;
        $[9] = configuration.passwordRequireSpecialChars;
        $[10] = configuration.sessionTimeout;
        $[11] = t2;
    } else {
        t2 = $[11];
    }
    const handleSave = t2;
    let t3;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = ({
            "ConfigurationManagementContent[handleReset]": ()=>{
                if (!confirm("Are you sure you want to reset all configuration to defaults? This action cannot be undone.")) {
                    return;
                }
                startTransition(_ConfigurationManagementContentHandleResetStartTransition);
            }
        })["ConfigurationManagementContent[handleReset]"];
        $[12] = t3;
    } else {
        t3 = $[12];
    }
    const handleReset = t3;
    let t4;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-semibold text-gray-900",
                    children: "System Configuration"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 116,
                    columnNumber: 15
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-600 mt-1",
                    children: "Manage system-wide settings and parameters"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 116,
                    columnNumber: 92
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 116,
            columnNumber: 10
        }, this);
        $[13] = t4;
    } else {
        t4 = $[13];
    }
    let t5;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 123,
            columnNumber: 10
        }, this);
        $[14] = t5;
    } else {
        t5 = $[14];
    }
    let t6;
    if ($[15] !== isPending) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleReset,
            disabled: isPending,
            className: "inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50",
            children: [
                t5,
                "Reset to Defaults"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 130,
            columnNumber: 10
        }, this);
        $[15] = isPending;
        $[16] = t6;
    } else {
        t6 = $[16];
    }
    let t7;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 138,
            columnNumber: 10
        }, this);
        $[17] = t7;
    } else {
        t7 = $[17];
    }
    const t8 = isPending ? "Saving..." : "Save Changes";
    let t9;
    if ($[18] !== handleSave || $[19] !== isPending || $[20] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleSave,
            disabled: isPending,
            className: "inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50",
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 146,
            columnNumber: 10
        }, this);
        $[18] = handleSave;
        $[19] = isPending;
        $[20] = t8;
        $[21] = t9;
    } else {
        t9 = $[21];
    }
    let t10;
    if ($[22] !== t6 || $[23] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-between items-center",
            children: [
                t4,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        t6,
                        t9
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 156,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 156,
            columnNumber: 11
        }, this);
        $[22] = t6;
        $[23] = t9;
        $[24] = t10;
    } else {
        t10 = $[24];
    }
    let t11;
    if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-lg font-semibold text-gray-900 mb-4",
            children: "Security Settings"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 165,
            columnNumber: 11
        }, this);
        $[25] = t11;
    } else {
        t11 = $[25];
    }
    let t12;
    if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: "Session Timeout (minutes)"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 172,
            columnNumber: 11
        }, this);
        $[26] = t12;
    } else {
        t12 = $[26];
    }
    let t13;
    if ($[27] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = ({
            "ConfigurationManagementContent[<input>.onChange]": (e)=>handleUpdate({
                    sessionTimeout: parseInt(e.target.value)
                })
        })["ConfigurationManagementContent[<input>.onChange]"];
        $[27] = t13;
    } else {
        t13 = $[27];
    }
    let t14;
    if ($[28] !== configuration.sessionTimeout) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            min: "5",
            max: "480",
            value: configuration.sessionTimeout,
            onChange: t13,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 190,
            columnNumber: 11
        }, this);
        $[28] = configuration.sessionTimeout;
        $[29] = t14;
    } else {
        t14 = $[29];
    }
    let t15;
    if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-xs text-gray-500 mt-1",
            children: "How long users can remain idle before being logged out (5-480 minutes)"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 198,
            columnNumber: 11
        }, this);
        $[30] = t15;
    } else {
        t15 = $[30];
    }
    let t16;
    if ($[31] !== t14) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t12,
                t14,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 205,
            columnNumber: 11
        }, this);
        $[31] = t14;
        $[32] = t16;
    } else {
        t16 = $[32];
    }
    let t17;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: "Password Minimum Length"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 213,
            columnNumber: 11
        }, this);
        $[33] = t17;
    } else {
        t17 = $[33];
    }
    let t18;
    if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = ({
            "ConfigurationManagementContent[<input>.onChange]": (e_0)=>handleUpdate({
                    passwordMinLength: parseInt(e_0.target.value)
                })
        })["ConfigurationManagementContent[<input>.onChange]"];
        $[34] = t18;
    } else {
        t18 = $[34];
    }
    let t19;
    if ($[35] !== configuration.passwordMinLength) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            min: "6",
            max: "32",
            value: configuration.passwordMinLength,
            onChange: t18,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 231,
            columnNumber: 11
        }, this);
        $[35] = configuration.passwordMinLength;
        $[36] = t19;
    } else {
        t19 = $[36];
    }
    let t20;
    if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-xs text-gray-500 mt-1",
            children: "Minimum number of characters required for passwords (6-32 characters)"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 239,
            columnNumber: 11
        }, this);
        $[37] = t20;
    } else {
        t20 = $[37];
    }
    let t21;
    if ($[38] !== t19) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t17,
                t19,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 246,
            columnNumber: 11
        }, this);
        $[38] = t19;
        $[39] = t21;
    } else {
        t21 = $[39];
    }
    let t22;
    if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
        t22 = ({
            "ConfigurationManagementContent[<input>.onChange]": (e_1)=>handleUpdate({
                    passwordRequireSpecialChars: e_1.target.checked
                })
        })["ConfigurationManagementContent[<input>.onChange]"];
        $[40] = t22;
    } else {
        t22 = $[40];
    }
    let t23;
    if ($[41] !== configuration.passwordRequireSpecialChars) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "checkbox",
            id: "requireSpecialChars",
            checked: configuration.passwordRequireSpecialChars,
            onChange: t22,
            className: "mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 265,
            columnNumber: 11
        }, this);
        $[41] = configuration.passwordRequireSpecialChars;
        $[42] = t23;
    } else {
        t23 = $[42];
    }
    let t24;
    if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    htmlFor: "requireSpecialChars",
                    className: "text-sm font-medium text-gray-700",
                    children: "Require special characters in passwords"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 273,
                    columnNumber: 16
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500 mt-1",
                    children: "Passwords must contain at least one special character (!@#$%^&*)"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 273,
                    columnNumber: 146
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 273,
            columnNumber: 11
        }, this);
        $[43] = t24;
    } else {
        t24 = $[43];
    }
    let t25;
    if ($[44] !== t23) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start gap-3",
            children: [
                t23,
                t24
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 280,
            columnNumber: 11
        }, this);
        $[44] = t23;
        $[45] = t25;
    } else {
        t25 = $[45];
    }
    let t26;
    if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: "Max Login Attempts"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 288,
            columnNumber: 11
        }, this);
        $[46] = t26;
    } else {
        t26 = $[46];
    }
    let t27;
    if ($[47] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = ({
            "ConfigurationManagementContent[<input>.onChange]": (e_2)=>handleUpdate({
                    maxLoginAttempts: parseInt(e_2.target.value)
                })
        })["ConfigurationManagementContent[<input>.onChange]"];
        $[47] = t27;
    } else {
        t27 = $[47];
    }
    let t28;
    if ($[48] !== configuration.maxLoginAttempts) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            min: "3",
            max: "10",
            value: configuration.maxLoginAttempts,
            onChange: t27,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 306,
            columnNumber: 11
        }, this);
        $[48] = configuration.maxLoginAttempts;
        $[49] = t28;
    } else {
        t28 = $[49];
    }
    let t29;
    if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-xs text-gray-500 mt-1",
            children: "Number of failed login attempts before account lockout (3-10 attempts)"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 314,
            columnNumber: 11
        }, this);
        $[50] = t29;
    } else {
        t29 = $[50];
    }
    let t30;
    if ($[51] !== t28) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t26,
                t28,
                t29
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 321,
            columnNumber: 11
        }, this);
        $[51] = t28;
        $[52] = t30;
    } else {
        t30 = $[52];
    }
    let t31;
    if ($[53] !== t16 || $[54] !== t21 || $[55] !== t25 || $[56] !== t30) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg shadow p-6",
            children: [
                t11,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        t16,
                        t21,
                        t25,
                        t30
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 329,
                    columnNumber: 64
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 329,
            columnNumber: 11
        }, this);
        $[53] = t16;
        $[54] = t21;
        $[55] = t25;
        $[56] = t30;
        $[57] = t31;
    } else {
        t31 = $[57];
    }
    let t32;
    if ($[58] === Symbol.for("react.memo_cache_sentinel")) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-lg font-semibold text-gray-900 mb-4",
            children: "System Settings"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 340,
            columnNumber: 11
        }, this);
        $[58] = t32;
    } else {
        t32 = $[58];
    }
    let t33;
    if ($[59] === Symbol.for("react.memo_cache_sentinel")) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: "Backup Frequency"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 347,
            columnNumber: 11
        }, this);
        $[59] = t33;
    } else {
        t33 = $[59];
    }
    let t34;
    if ($[60] === Symbol.for("react.memo_cache_sentinel")) {
        t34 = ({
            "ConfigurationManagementContent[<select>.onChange]": (e_3)=>handleUpdate({
                    backupFrequency: e_3.target.value
                })
        })["ConfigurationManagementContent[<select>.onChange]"];
        $[60] = t34;
    } else {
        t34 = $[60];
    }
    let t35;
    let t36;
    let t37;
    if ($[61] === Symbol.for("react.memo_cache_sentinel")) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "hourly",
            children: "Hourly"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 367,
            columnNumber: 11
        }, this);
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "daily",
            children: "Daily"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 368,
            columnNumber: 11
        }, this);
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "weekly",
            children: "Weekly"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 369,
            columnNumber: 11
        }, this);
        $[61] = t35;
        $[62] = t36;
        $[63] = t37;
    } else {
        t35 = $[61];
        t36 = $[62];
        t37 = $[63];
    }
    let t38;
    if ($[64] !== configuration.backupFrequency) {
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
            value: configuration.backupFrequency,
            onChange: t34,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
            children: [
                t35,
                t36,
                t37
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 380,
            columnNumber: 11
        }, this);
        $[64] = configuration.backupFrequency;
        $[65] = t38;
    } else {
        t38 = $[65];
    }
    let t39;
    if ($[66] === Symbol.for("react.memo_cache_sentinel")) {
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-xs text-gray-500 mt-1",
            children: "How often automatic system backups are performed"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 388,
            columnNumber: 11
        }, this);
        $[66] = t39;
    } else {
        t39 = $[66];
    }
    let t40;
    if ($[67] !== t38) {
        t40 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t33,
                t38,
                t39
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 395,
            columnNumber: 11
        }, this);
        $[67] = t38;
        $[68] = t40;
    } else {
        t40 = $[68];
    }
    let t41;
    if ($[69] === Symbol.for("react.memo_cache_sentinel")) {
        t41 = ({
            "ConfigurationManagementContent[<input>.onChange]": (e_4)=>handleUpdate({
                    enableAuditLogging: e_4.target.checked
                })
        })["ConfigurationManagementContent[<input>.onChange]"];
        $[69] = t41;
    } else {
        t41 = $[69];
    }
    let t42;
    if ($[70] !== configuration.enableAuditLogging) {
        t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "checkbox",
            id: "enableAuditLogging",
            checked: configuration.enableAuditLogging,
            onChange: t41,
            className: "mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 414,
            columnNumber: 11
        }, this);
        $[70] = configuration.enableAuditLogging;
        $[71] = t42;
    } else {
        t42 = $[71];
    }
    let t43;
    if ($[72] === Symbol.for("react.memo_cache_sentinel")) {
        t43 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    htmlFor: "enableAuditLogging",
                    className: "text-sm font-medium text-gray-700",
                    children: "Enable audit logging (HIPAA compliance)"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 422,
                    columnNumber: 16
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500 mt-1",
                    children: "Required for HIPAA compliance - logs all system access and changes"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 422,
                    columnNumber: 145
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 422,
            columnNumber: 11
        }, this);
        $[72] = t43;
    } else {
        t43 = $[72];
    }
    let t44;
    if ($[73] !== t42) {
        t44 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start gap-3",
            children: [
                t42,
                t43
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 429,
            columnNumber: 11
        }, this);
        $[73] = t42;
        $[74] = t44;
    } else {
        t44 = $[74];
    }
    let t45;
    if ($[75] === Symbol.for("react.memo_cache_sentinel")) {
        t45 = ({
            "ConfigurationManagementContent[<input>.onChange]": (e_5)=>handleUpdate({
                    enableEmailNotifications: e_5.target.checked
                })
        })["ConfigurationManagementContent[<input>.onChange]"];
        $[75] = t45;
    } else {
        t45 = $[75];
    }
    let t46;
    if ($[76] !== configuration.enableEmailNotifications) {
        t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "checkbox",
            id: "enableEmailNotifications",
            checked: configuration.enableEmailNotifications,
            onChange: t45,
            className: "mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 448,
            columnNumber: 11
        }, this);
        $[76] = configuration.enableEmailNotifications;
        $[77] = t46;
    } else {
        t46 = $[77];
    }
    let t47;
    if ($[78] === Symbol.for("react.memo_cache_sentinel")) {
        t47 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    htmlFor: "enableEmailNotifications",
                    className: "text-sm font-medium text-gray-700",
                    children: "Enable email notifications"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 456,
                    columnNumber: 16
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500 mt-1",
                    children: "Send system notifications via email to administrators"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 456,
                    columnNumber: 138
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 456,
            columnNumber: 11
        }, this);
        $[78] = t47;
    } else {
        t47 = $[78];
    }
    let t48;
    if ($[79] !== t46) {
        t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start gap-3",
            children: [
                t46,
                t47
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 463,
            columnNumber: 11
        }, this);
        $[79] = t46;
        $[80] = t48;
    } else {
        t48 = $[80];
    }
    let t49;
    if ($[81] === Symbol.for("react.memo_cache_sentinel")) {
        t49 = ({
            "ConfigurationManagementContent[<input>.onChange]": (e_6)=>handleUpdate({
                    enableSMSNotifications: e_6.target.checked
                })
        })["ConfigurationManagementContent[<input>.onChange]"];
        $[81] = t49;
    } else {
        t49 = $[81];
    }
    let t50;
    if ($[82] !== configuration.enableSMSNotifications) {
        t50 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "checkbox",
            id: "enableSMSNotifications",
            checked: configuration.enableSMSNotifications,
            onChange: t49,
            className: "mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 482,
            columnNumber: 11
        }, this);
        $[82] = configuration.enableSMSNotifications;
        $[83] = t50;
    } else {
        t50 = $[83];
    }
    let t51;
    if ($[84] === Symbol.for("react.memo_cache_sentinel")) {
        t51 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    htmlFor: "enableSMSNotifications",
                    className: "text-sm font-medium text-gray-700",
                    children: "Enable SMS notifications"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 490,
                    columnNumber: 16
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500 mt-1",
                    children: "Send critical alerts via SMS to emergency contacts"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 490,
                    columnNumber: 134
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 490,
            columnNumber: 11
        }, this);
        $[84] = t51;
    } else {
        t51 = $[84];
    }
    let t52;
    if ($[85] !== t50) {
        t52 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start gap-3",
            children: [
                t50,
                t51
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 497,
            columnNumber: 11
        }, this);
        $[85] = t50;
        $[86] = t52;
    } else {
        t52 = $[86];
    }
    let t53;
    if ($[87] !== t40 || $[88] !== t44 || $[89] !== t48 || $[90] !== t52) {
        t53 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg shadow p-6",
            children: [
                t32,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        t40,
                        t44,
                        t48,
                        t52
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 505,
                    columnNumber: 64
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 505,
            columnNumber: 11
        }, this);
        $[87] = t40;
        $[88] = t44;
        $[89] = t48;
        $[90] = t52;
        $[91] = t53;
    } else {
        t53 = $[91];
    }
    let t54;
    if ($[92] === Symbol.for("react.memo_cache_sentinel")) {
        t54 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-lg font-semibold text-gray-900 mb-4",
            children: "Maintenance Mode"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 516,
            columnNumber: 11
        }, this);
        $[92] = t54;
    } else {
        t54 = $[92];
    }
    let t55;
    if ($[93] === Symbol.for("react.memo_cache_sentinel")) {
        t55 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
            className: "h-5 w-5 text-yellow-600 mt-0.5"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 523,
            columnNumber: 11
        }, this);
        $[93] = t55;
    } else {
        t55 = $[93];
    }
    let t56;
    if ($[94] === Symbol.for("react.memo_cache_sentinel")) {
        t56 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4",
            children: [
                t55,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium text-yellow-900",
                            children: "Warning: Enabling maintenance mode will prevent users from accessing the system"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                            lineNumber: 530,
                            columnNumber: 138
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-yellow-700 mt-1",
                            children: "Only system administrators will be able to access the application during maintenance"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                            lineNumber: 530,
                            columnNumber: 272
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 530,
                    columnNumber: 114
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 530,
            columnNumber: 11
        }, this);
        $[94] = t56;
    } else {
        t56 = $[94];
    }
    let t57;
    if ($[95] === Symbol.for("react.memo_cache_sentinel")) {
        t57 = ({
            "ConfigurationManagementContent[<input>.onChange]": (e_7)=>handleUpdate({
                    maintenanceMode: e_7.target.checked
                })
        })["ConfigurationManagementContent[<input>.onChange]"];
        $[95] = t57;
    } else {
        t57 = $[95];
    }
    let t58;
    if ($[96] !== configuration.maintenanceMode) {
        t58 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "checkbox",
            id: "maintenanceMode",
            checked: configuration.maintenanceMode,
            onChange: t57,
            className: "mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 548,
            columnNumber: 11
        }, this);
        $[96] = configuration.maintenanceMode;
        $[97] = t58;
    } else {
        t58 = $[97];
    }
    let t59;
    if ($[98] === Symbol.for("react.memo_cache_sentinel")) {
        t59 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    htmlFor: "maintenanceMode",
                    className: "text-sm font-medium text-gray-700",
                    children: "Enable maintenance mode"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 556,
                    columnNumber: 16
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500 mt-1",
                    children: "Temporarily disable user access for system maintenance"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 556,
                    columnNumber: 126
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 556,
            columnNumber: 11
        }, this);
        $[98] = t59;
    } else {
        t59 = $[98];
    }
    let t60;
    if ($[99] !== t58) {
        t60 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg shadow p-6",
            children: [
                t54,
                t56,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3",
                    children: [
                        t58,
                        t59
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
                    lineNumber: 563,
                    columnNumber: 69
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 563,
            columnNumber: 11
        }, this);
        $[99] = t58;
        $[100] = t60;
    } else {
        t60 = $[100];
    }
    let t61;
    if ($[101] !== t10 || $[102] !== t31 || $[103] !== t53 || $[104] !== t60) {
        t61 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                t10,
                t31,
                t53,
                t60
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx",
            lineNumber: 571,
            columnNumber: 11
        }, this);
        $[101] = t10;
        $[102] = t31;
        $[103] = t53;
        $[104] = t60;
        $[105] = t61;
    } else {
        t61 = $[105];
    }
    return t61;
}
_s(ConfigurationManagementContent, "54FqlFpw0jnpWM1qFUON71dP0As=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
_c = ConfigurationManagementContent;
async function _ConfigurationManagementContentHandleResetStartTransition() {
    ;
    try {
        const result_0 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$41966a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["resetConfigurationToDefaults"])();
        if (result_0.success) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success(result_0.message);
            window.location.reload();
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(result_0.message);
        }
    } catch (t0) {
        const error_0 = t0;
        console.error("Error resetting configuration:", error_0);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Failed to reset configuration");
    }
}
var _c;
__turbopack_context__.k.register(_c, "ConfigurationManagementContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Save
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
            key: "1c8476"
        }
    ],
    [
        "path",
        {
            d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
            key: "1ydtos"
        }
    ],
    [
        "path",
        {
            d: "M7 3v4a1 1 0 0 0 1 1h7",
            key: "t51u73"
        }
    ]
];
const Save = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("save", __iconNode);
;
 //# sourceMappingURL=save.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Save",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>RotateCcw
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
            key: "1357e3"
        }
    ],
    [
        "path",
        {
            d: "M3 3v5h5",
            key: "1xhq8a"
        }
    ]
];
const RotateCcw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("rotate-ccw", __iconNode);
;
 //# sourceMappingURL=rotate-ccw.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RotateCcw",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript)");
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

//# sourceMappingURL=_661ec45b._.js.map
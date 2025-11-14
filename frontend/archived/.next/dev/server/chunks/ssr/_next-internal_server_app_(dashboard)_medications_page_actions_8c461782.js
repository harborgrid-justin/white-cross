module.exports = [
"[project]/.next-internal/server/app/(dashboard)/medications/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/medications.utils.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/actions/medications.cache.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/lib/actions/medications.crud.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/lib/actions/medications.administration.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/lib/actions/medications.status.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/medications.utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/medications.cache.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/medications.crud.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$administration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/medications.administration.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/medications.status.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/(dashboard)/medications/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/medications.utils.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/actions/medications.cache.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/lib/actions/medications.crud.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/lib/actions/medications.administration.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/lib/actions/medications.status.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "400393513545cdd62893942da58de8ac996dd17cb0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["medicationExists"],
    "400e6b793ec6e2aad3acd1b430e7347083cd165939",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteMedication"],
    "40140ad48672705c368f02508e39ce91ff0e087de7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clearMedicationCache"],
    "4055eb507e57b2e2429031b5cf7180bc546020fd5b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMedicationsDashboardData"],
    "4056addd475fb85124f1c2e5c64c6eb7e441eb3335",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$administration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["administerMedicationFromForm"],
    "4062815d8964f3a49334c8b8d64509b480200fcb44",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMedicationCount"],
    "408dccdd4b4eb522bfd0548cf3f788258e0a9c2c89",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createMedicationFromForm"],
    "40a9d57210a8f47ab3affe42bf20a146b4ebf9e42a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createMedication"],
    "40f9eee4752911fd22b402390581bc6c2141e61815",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$administration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["administerMedication"],
    "6028cdda10f910886a0b95ff2ba224a620853aef44",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateMedicationFromForm"],
    "604a6f6f331098cf6a807e3783a071cd7d3755191f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["discontinueMedication"],
    "60aafe6e826a7558366c3d04d475e8bdf1a1298e53",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateMedication"],
    "70c66053094e4ff095f7f4d3775bbe17c715768fa4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requestMedicationRefill"],
    "7f090b15eaa6ba59e64d0a5695468d2580649a852d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPaginatedMedications"],
    "7f1254e46fbfcba42143409be06dd95b6bfef5adc4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMedicationHistory"],
    "7f4fa70258d1ebca6a6798fdc410d4b32b9f01b10d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStudentMedications"],
    "7f7555da66663b3c9e93ecc9422786937377b717bd",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMedicationStats"],
    "7fabc7f03050f8d9bb16c1ed00934cfa5aad1874f6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMedications"],
    "7fac88345d8fc7c8edbd3ecb2513ed3718233e10bd",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMedication"],
    "7fb400f442e71c24467a1c520ab99a301a52b0e145",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOverdueMedications"],
    "7fed37e125bdc5e7be41e3a69fe030b2c64c132c07",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDueMedications"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$medications$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$administration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(dashboard)/medications/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/actions/medications.utils.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/actions/medications.cache.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/lib/actions/medications.crud.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/lib/actions/medications.administration.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/src/lib/actions/medications.status.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/medications.utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/medications.cache.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/medications.crud.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$administration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/medications.administration.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$medications$2e$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/medications.status.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_next-internal_server_app_%28dashboard%29_medications_page_actions_8c461782.js.map
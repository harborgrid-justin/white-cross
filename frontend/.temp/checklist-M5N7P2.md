# Checklist: Fix Utility & Hooks TypeScript Errors (M5N7P2)

## Phase 1: Missing Hook Barrel Exports
- [x] ~~Create `@/hooks/useToast.ts`~~ (already exists, added export to index.ts)
- [x] ~~Create `@/hooks/usePermissions.ts`~~ (already exists, added export to index.ts)
- [x] ~~Create `@/hooks/useStudentAllergies.ts`~~ (already exists, added export to index.ts)
- [x] ~~Create `@/hooks/useStudentPhoto.ts`~~ (already exists, added export to index.ts)
- [x] ~~Create `@/hooks/useConnectionMonitor.ts`~~ (already exists, added export to index.ts)
- [x] ~~Create `@/hooks/useOfflineQueue.ts`~~ (already exists, added export to index.ts)
- [x] ~~Create `@/hooks/useOptimisticStudents.ts`~~ (already exists, added export to index.ts)
- [x] ~~Create `@/hooks/useRouteState.ts`~~ (already exists, added export to index.ts)
- [x] Create `@/hooks/queries/useMessages.ts` (CREATED)
- [x] Create `@/hooks/queries/useConversations.ts` (CREATED)

## Phase 2: Apollo Client & React Query Types
- [x] Verify `@apollo/client` package version and types (v4.0.7 in package.json)
- [x] Check if Apollo Client types are correctly installed (BLOCKED: node_modules corrupted)
- [x] Verify `@tanstack/react-query` package version (v5.90.5 in package.json)
- [ ] **BLOCKED**: Fix requires `rm -rf node_modules && npm install`

## Phase 3: Missing Type Exports
- [x] ~~Add document types to `@/types/documents`~~ (ALL EXIST: DocumentMetadata, SignatureWorkflow, etc.)
- [x] ~~Add medication types to hooks API types~~ (verified exports exist)
- [x] ~~Add Redux store types to `@/stores/reduxStore`~~ (ALL EXPORTED: RootState, AppDispatch, store, etc.)
- [x] ~~Add student types~~ (verified exports exist)
- [x] ~~Add settings schema types~~ (verified exports exist)
- [x] ~~Add entity types for hooks~~ (verified exports exist)

## Phase 4: Service Layer Modules
- [x] ~~Create or fix services~~ (VERIFIED: Service layer errors are due to node_modules, not missing files)
- [ ] **BLOCKED**: Fix requires npm install

## Phase 5: Utilities and Imports
- [x] ~~Create or fix `cn` utility function~~ (EXISTS at src/utils/cn.ts)
- [x] ~~Create or fix route utilities~~ (EXIST, errors due to node_modules)
- [x] ~~Fix medications constants~~ (EXIST, errors due to node_modules)
- [x] ~~Fix config constants~~ (EXIST, errors due to node_modules)
- [x] ~~Update import paths in UI components~~ (paths are correct)
- [ ] **BLOCKED**: Remaining errors require npm install

## Phase 6: Verification
- [x] Analyzed all 128 utility/hooks/lib errors
- [x] Verified all code-level fixes are complete
- [x] Generated comprehensive final report
- [x] Documented node_modules issue and resolution steps
- [ ] **PENDING**: Post npm-install verification needed

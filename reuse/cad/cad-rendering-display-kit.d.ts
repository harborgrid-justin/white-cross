/**
 * LOC: CAD-REN-005
 * File: /reuse/cad/cad-rendering-display-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (foundational CAD utilities)
 *
 * DOWNSTREAM (imported by):
 *   - CAD drawing services
 *   - Rendering and Display modules
 */
/**
 * File: /reuse/cad/cad-rendering-display-kit.ts
 * Locator: WC-CAD-REN-005
 * Purpose: CAD Rendering and Display - Rendering engine utilities, display modes, and visualization
 *
 * Upstream: Independent CAD utility module
 * Downstream: CAD services, drawing engines, UI components
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 43 rendering and display functions
 *
 * LLM Context: Production-grade rendering and display utilities for White Cross CAD SaaS.
 * Provides comprehensive Rendering engine utilities, display modes, and visualization.
 */
/**
 * createRenderContext - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = createRenderContext(params);
 * ```
 */
export declare function createRenderContext(params: any): any;
/**
 * setRenderMode - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setRenderMode(params);
 * ```
 */
export declare function setRenderMode(params: any): any;
/**
 * setViewportSize - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setViewportSize(params);
 * ```
 */
export declare function setViewportSize(params: any): any;
/**
 * setBackgroundColor - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setBackgroundColor(params);
 * ```
 */
export declare function setBackgroundColor(params: any): any;
/**
 * enableAntialiasing - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = enableAntialiasing(params);
 * ```
 */
export declare function enableAntialiasing(params: any): any;
/**
 * setLineSmoothing - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setLineSmoothing(params);
 * ```
 */
export declare function setLineSmoothing(params: any): any;
/**
 * setTextQuality - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setTextQuality(params);
 * ```
 */
export declare function setTextQuality(params: any): any;
/**
 * enableShadows - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = enableShadows(params);
 * ```
 */
export declare function enableShadows(params: any): any;
/**
 * setAmbientLight - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setAmbientLight(params);
 * ```
 */
export declare function setAmbientLight(params: any): any;
/**
 * addDirectionalLight - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = addDirectionalLight(params);
 * ```
 */
export declare function addDirectionalLight(params: any): any;
/**
 * addPointLight - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = addPointLight(params);
 * ```
 */
export declare function addPointLight(params: any): any;
/**
 * addSpotLight - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = addSpotLight(params);
 * ```
 */
export declare function addSpotLight(params: any): any;
/**
 * setMaterialProperties - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setMaterialProperties(params);
 * ```
 */
export declare function setMaterialProperties(params: any): any;
/**
 * enableTextures - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = enableTextures(params);
 * ```
 */
export declare function enableTextures(params: any): any;
/**
 * setWireframeMode - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setWireframeMode(params);
 * ```
 */
export declare function setWireframeMode(params: any): any;
/**
 * setShadedMode - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setShadedMode(params);
 * ```
 */
export declare function setShadedMode(params: any): any;
/**
 * setHiddenLineMode - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setHiddenLineMode(params);
 * ```
 */
export declare function setHiddenLineMode(params: any): any;
/**
 * setConceptualMode - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setConceptualMode(params);
 * ```
 */
export declare function setConceptualMode(params: any): any;
/**
 * setRealisticMode - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setRealisticMode(params);
 * ```
 */
export declare function setRealisticMode(params: any): any;
/**
 * renderScene - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = renderScene(params);
 * ```
 */
export declare function renderScene(params: any): any;
/**
 * updateDisplay - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = updateDisplay(params);
 * ```
 */
export declare function updateDisplay(params: any): any;
/**
 * refreshViewport - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = refreshViewport(params);
 * ```
 */
export declare function refreshViewport(params: any): any;
/**
 * setZoomLevel - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setZoomLevel(params);
 * ```
 */
export declare function setZoomLevel(params: any): any;
/**
 * fitToScreen - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = fitToScreen(params);
 * ```
 */
export declare function fitToScreen(params: any): any;
/**
 * setPanOffset - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setPanOffset(params);
 * ```
 */
export declare function setPanOffset(params: any): any;
/**
 * setRotationAngle - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setRotationAngle(params);
 * ```
 */
export declare function setRotationAngle(params: any): any;
/**
 * create3DView - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = create3DView(params);
 * ```
 */
export declare function create3DView(params: any): any;
/**
 * create2DView - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = create2DView(params);
 * ```
 */
export declare function create2DView(params: any): any;
/**
 * enablePerspective - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = enablePerspective(params);
 * ```
 */
export declare function enablePerspective(params: any): any;
/**
 * setFieldOfView - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setFieldOfView(params);
 * ```
 */
export declare function setFieldOfView(params: any): any;
/**
 * setClippingPlanes - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setClippingPlanes(params);
 * ```
 */
export declare function setClippingPlanes(params: any): any;
/**
 * setDepthBuffer - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setDepthBuffer(params);
 * ```
 */
export declare function setDepthBuffer(params: any): any;
/**
 * enableStencilBuffer - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = enableStencilBuffer(params);
 * ```
 */
export declare function enableStencilBuffer(params: any): any;
/**
 * setBlendMode - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setBlendMode(params);
 * ```
 */
export declare function setBlendMode(params: any): any;
/**
 * setAlphaBlending - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setAlphaBlending(params);
 * ```
 */
export declare function setAlphaBlending(params: any): any;
/**
 * renderToTexture - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = renderToTexture(params);
 * ```
 */
export declare function renderToTexture(params: any): any;
/**
 * captureScreen - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = captureScreen(params);
 * ```
 */
export declare function captureScreen(params: any): any;
/**
 * exportImage - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = exportImage(params);
 * ```
 */
export declare function exportImage(params: any): any;
/**
 * setRenderQuality - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setRenderQuality(params);
 * ```
 */
export declare function setRenderQuality(params: any): any;
/**
 * enableVSync - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = enableVSync(params);
 * ```
 */
export declare function enableVSync(params: any): any;
/**
 * setFrameRate - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = setFrameRate(params);
 * ```
 */
export declare function setFrameRate(params: any): any;
/**
 * getMeasuredFPS - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = getMeasuredFPS(params);
 * ```
 */
export declare function getMeasuredFPS(params: any): any;
/**
 * optimizeRenderBatch - CAD rendering and display operation.
 *
 * @param {any} params - Operation parameters
 * @returns {any} Operation result
 *
 * @example
 * ```typescript
 * const result = optimizeRenderBatch(params);
 * ```
 */
export declare function optimizeRenderBatch(params: any): any;
//# sourceMappingURL=cad-rendering-display-kit.d.ts.map
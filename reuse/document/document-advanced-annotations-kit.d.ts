/**
 * LOC: DOC-ANNOT-ADV-001
 * File: /reuse/document/document-advanced-annotations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - three (3D library)
 *   - pdf-lib
 *   - sharp (image processing)
 *   - sequelize (v6.x)
 *   - fluent-ffmpeg (video/audio processing)
 *
 * DOWNSTREAM (imported by):
 *   - Document annotation controllers
 *   - Collaborative review services
 *   - 3D model viewer modules
 *   - Multimedia document services
 */
/**
 * File: /reuse/document/document-advanced-annotations-kit.ts
 * Locator: WC-UTL-DOCANNOT-001
 * Purpose: Advanced Document Annotations Kit - 3D annotations, multimedia attachments, collaborative markup, annotation layers, measurement tools
 *
 * Upstream: @nestjs/common, three, pdf-lib, sharp, sequelize, fluent-ffmpeg
 * Downstream: Annotation controllers, collaborative review services, 3D viewers, multimedia handlers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Three.js 0.160.x, pdf-lib 1.17.x, sharp 0.33.x
 * Exports: 45 utility functions for 3D annotations, multimedia attachments, collaborative markup, layers, measurements, stamps, import/export
 *
 * LLM Context: Production-grade advanced document annotation utilities for White Cross healthcare platform.
 * Provides 3D model annotations for medical imaging, multimedia attachments (audio/video notes), real-time
 * collaborative markup, annotation layers, precision measurement tools, custom stamp creation, and comprehensive
 * import/export capabilities. Exceeds Adobe Acrobat's annotation features with specialized healthcare workflows,
 * DICOM integration, voice notes for clinical documentation, multi-user collaboration, layer-based organization,
 * medical measurement tools (distance, angle, area), regulatory stamps, and standards-compliant interchange formats.
 */
import { Sequelize } from 'sequelize';
/**
 * Annotation type classification
 */
export type AnnotationType = 'text' | 'highlight' | 'sticky-note' | 'drawing' | 'stamp' | '3d-point' | '3d-measurement' | 'audio' | 'video' | 'image' | 'arrow' | 'callout' | 'redaction';
/**
 * 3D annotation types
 */
export type ThreeDAnnotationType = 'point' | 'measurement' | 'region' | 'cross-section' | 'label' | 'marker';
/**
 * Measurement unit types
 */
export type MeasurementUnit = 'mm' | 'cm' | 'in' | 'px' | 'pt' | 'degrees' | 'radians';
/**
 * Measurement types
 */
export type MeasurementType = 'distance' | 'area' | 'angle' | 'perimeter' | 'volume';
/**
 * Annotation layer visibility
 */
export type LayerVisibility = 'visible' | 'hidden' | 'locked' | 'print-only';
/**
 * Stamp types
 */
export type StampType = 'approved' | 'rejected' | 'reviewed' | 'confidential' | 'draft' | 'final' | 'custom';
/**
 * Annotation export format
 */
export type AnnotationExportFormat = 'XFDF' | 'JSON' | 'PDF' | 'XML' | 'FDF';
/**
 * Base annotation configuration
 */
export interface AnnotationConfig {
    type: AnnotationType;
    documentId: string;
    pageNumber?: number;
    position: {
        x: number;
        y: number;
        z?: number;
    };
    size?: {
        width: number;
        height: number;
        depth?: number;
    };
    color?: string;
    opacity?: number;
    author: string;
    content: string;
    layerId?: string;
    metadata?: Record<string, any>;
}
/**
 * 3D annotation configuration
 */
export interface ThreeDAnnotationConfig {
    type: ThreeDAnnotationType;
    modelId: string;
    position: {
        x: number;
        y: number;
        z: number;
    };
    normal?: {
        x: number;
        y: number;
        z: number;
    };
    rotation?: {
        x: number;
        y: number;
        z: number;
    };
    scale?: number;
    color?: string;
    label?: string;
    metadata?: Record<string, any>;
}
/**
 * 3D measurement configuration
 */
export interface ThreeDMeasurement {
    type: MeasurementType;
    points: Array<{
        x: number;
        y: number;
        z: number;
    }>;
    unit: MeasurementUnit;
    value: number;
    label?: string;
    color?: string;
    metadata?: Record<string, any>;
}
/**
 * Multimedia attachment configuration
 */
export interface MultimediaAttachment {
    type: 'audio' | 'video' | 'image';
    annotationId: string;
    url?: string;
    data?: Buffer;
    mimeType: string;
    duration?: number;
    size: number;
    thumbnail?: Buffer;
    metadata?: {
        codec?: string;
        bitrate?: number;
        sampleRate?: number;
        resolution?: {
            width: number;
            height: number;
        };
        [key: string]: any;
    };
}
/**
 * Audio annotation configuration
 */
export interface AudioAnnotationConfig {
    annotationId: string;
    audioData: Buffer;
    format: 'mp3' | 'wav' | 'ogg' | 'aac';
    duration: number;
    sampleRate?: number;
    transcription?: string;
    timestamp?: Date;
}
/**
 * Video annotation configuration
 */
export interface VideoAnnotationConfig {
    annotationId: string;
    videoData: Buffer;
    format: 'mp4' | 'webm' | 'avi';
    duration: number;
    resolution: {
        width: number;
        height: number;
    };
    frameRate?: number;
    thumbnail?: Buffer;
    timestamp?: Date;
}
/**
 * Collaborative markup configuration
 */
export interface CollaborativeMarkup {
    annotationId: string;
    documentId: string;
    userId: string;
    userName: string;
    action: 'created' | 'modified' | 'deleted' | 'resolved' | 'replied';
    timestamp: Date;
    data?: Record<string, any>;
    socketId?: string;
}
/**
 * Annotation reply
 */
export interface AnnotationReply {
    id: string;
    annotationId: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: Date;
    editedAt?: Date;
    attachments?: MultimediaAttachment[];
}
/**
 * Annotation layer configuration
 */
export interface AnnotationLayer {
    id: string;
    name: string;
    documentId: string;
    visibility: LayerVisibility;
    order: number;
    color?: string;
    description?: string;
    createdBy: string;
    createdAt: Date;
    locked?: boolean;
}
/**
 * Measurement tool configuration
 */
export interface MeasurementConfig {
    type: MeasurementType;
    unit: MeasurementUnit;
    precision: number;
    color?: string;
    showLabel?: boolean;
    calibration?: {
        scale: number;
        unit: string;
        reference?: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        };
    };
}
/**
 * Custom stamp configuration
 */
export interface StampConfig {
    type: StampType;
    text?: string;
    image?: Buffer;
    size: {
        width: number;
        height: number;
    };
    color?: string;
    borderColor?: string;
    borderWidth?: number;
    opacity?: number;
    rotation?: number;
    metadata?: Record<string, any>;
}
/**
 * Annotation export options
 */
export interface AnnotationExportOptions {
    format: AnnotationExportFormat;
    includeReplies?: boolean;
    includeAttachments?: boolean;
    includeLayers?: boolean;
    filterByUser?: string;
    filterByDateRange?: {
        start: Date;
        end: Date;
    };
    filterByType?: AnnotationType[];
}
/**
 * Annotation import result
 */
export interface AnnotationImportResult {
    success: boolean;
    importedCount: number;
    failedCount: number;
    errors?: Array<{
        index: number;
        error: string;
    }>;
    annotationIds?: string[];
}
/**
 * Annotation search criteria
 */
export interface AnnotationSearchCriteria {
    documentId?: string;
    userId?: string;
    type?: AnnotationType[];
    layerId?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
    contentSearch?: string;
    hasReplies?: boolean;
    hasAttachments?: boolean;
}
/**
 * Annotation model attributes
 */
export interface AnnotationAttributes {
    id: string;
    documentId: string;
    userId: string;
    userName: string;
    type: string;
    subtype?: string;
    pageNumber?: number;
    layerId?: string;
    position: Record<string, any>;
    size?: Record<string, any>;
    rotation?: number;
    color?: string;
    opacity?: number;
    borderColor?: string;
    borderWidth?: number;
    content: string;
    richContent?: Record<string, any>;
    metadata?: Record<string, any>;
    isResolved: boolean;
    resolvedBy?: string;
    resolvedAt?: Date;
    isDeleted: boolean;
    deletedAt?: Date;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Annotation reply model attributes
 */
export interface AnnotationReplyAttributes {
    id: string;
    annotationId: string;
    userId: string;
    userName: string;
    content: string;
    richContent?: Record<string, any>;
    parentReplyId?: string;
    isEdited: boolean;
    editedAt?: Date;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Annotation attachment model attributes
 */
export interface AnnotationAttachmentAttributes {
    id: string;
    annotationId?: string;
    replyId?: string;
    type: string;
    mimeType: string;
    fileName: string;
    fileSize: number;
    url?: string;
    storageKey?: string;
    duration?: number;
    resolution?: Record<string, any>;
    thumbnail?: Buffer;
    metadata?: Record<string, any>;
    uploadedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates Annotation model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AnnotationAttributes>>} Annotation model
 *
 * @example
 * ```typescript
 * const AnnotationModel = createAnnotationModel(sequelize);
 * const annotation = await AnnotationModel.create({
 *   documentId: 'doc-uuid',
 *   userId: 'user-uuid',
 *   userName: 'Dr. John Doe',
 *   type: 'text',
 *   content: 'Please review this section',
 *   position: { x: 100, y: 200 },
 *   pageNumber: 1
 * });
 * ```
 */
export declare const createAnnotationModel: (sequelize: Sequelize) => any;
/**
 * Creates AnnotationReply model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AnnotationReplyAttributes>>} AnnotationReply model
 *
 * @example
 * ```typescript
 * const ReplyModel = createAnnotationReplyModel(sequelize);
 * const reply = await ReplyModel.create({
 *   annotationId: 'annotation-uuid',
 *   userId: 'user-uuid',
 *   userName: 'Dr. Jane Smith',
 *   content: 'I agree with this observation'
 * });
 * ```
 */
export declare const createAnnotationReplyModel: (sequelize: Sequelize) => any;
/**
 * Creates AnnotationAttachment model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AnnotationAttachmentAttributes>>} AnnotationAttachment model
 *
 * @example
 * ```typescript
 * const AttachmentModel = createAnnotationAttachmentModel(sequelize);
 * const attachment = await AttachmentModel.create({
 *   annotationId: 'annotation-uuid',
 *   type: 'audio',
 *   mimeType: 'audio/mp3',
 *   fileName: 'voice-note.mp3',
 *   fileSize: 1024000,
 *   duration: 30,
 *   uploadedBy: 'user-uuid'
 * });
 * ```
 */
export declare const createAnnotationAttachmentModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates 3D point annotation on model.
 *
 * @param {ThreeDAnnotationConfig} config - 3D annotation configuration
 * @returns {Promise<string>} Annotation ID
 *
 * @example
 * ```typescript
 * const annotationId = await create3DPointAnnotation({
 *   type: 'point',
 *   modelId: 'ct-scan-123',
 *   position: { x: 10.5, y: 20.3, z: 15.7 },
 *   label: 'Potential tumor location',
 *   color: '#FF0000'
 * });
 * ```
 */
export declare const create3DPointAnnotation: (config: ThreeDAnnotationConfig) => Promise<string>;
/**
 * 2. Adds 3D measurement annotation.
 *
 * @param {ThreeDMeasurement} measurement - Measurement configuration
 * @param {string} modelId - 3D model identifier
 * @returns {Promise<string>} Measurement annotation ID
 *
 * @example
 * ```typescript
 * const measurementId = await add3DMeasurement({
 *   type: 'distance',
 *   points: [
 *     { x: 10, y: 20, z: 30 },
 *     { x: 15, y: 25, z: 35 }
 *   ],
 *   unit: 'mm',
 *   value: 8.66,
 *   label: 'Lesion diameter'
 * }, 'mri-scan-456');
 * ```
 */
export declare const add3DMeasurement: (measurement: ThreeDMeasurement, modelId: string) => Promise<string>;
/**
 * 3. Creates 3D region annotation (volumetric selection).
 *
 * @param {string} modelId - 3D model identifier
 * @param {Array<{ x: number; y: number; z: number }>} boundingBox - Region bounds
 * @param {string} label - Region label
 * @param {string} [color] - Region color
 * @returns {Promise<string>} Region annotation ID
 *
 * @example
 * ```typescript
 * const regionId = await create3DRegionAnnotation(
 *   'ct-scan-789',
 *   [
 *     { x: 10, y: 20, z: 30 },
 *     { x: 50, y: 60, z: 70 }
 *   ],
 *   'Area of interest',
 *   '#00FF00'
 * );
 * ```
 */
export declare const create3DRegionAnnotation: (modelId: string, boundingBox: Array<{
    x: number;
    y: number;
    z: number;
}>, label: string, color?: string) => Promise<string>;
/**
 * 4. Adds cross-section plane annotation to 3D model.
 *
 * @param {string} modelId - 3D model identifier
 * @param {object} plane - Plane definition
 * @param {string} [label] - Plane label
 * @returns {Promise<string>} Cross-section annotation ID
 *
 * @example
 * ```typescript
 * const crossSectionId = await add3DCrossSectionPlane('mri-123', {
 *   point: { x: 0, y: 0, z: 50 },
 *   normal: { x: 0, y: 0, z: 1 }
 * }, 'Axial view at z=50');
 * ```
 */
export declare const add3DCrossSectionPlane: (modelId: string, plane: {
    point: {
        x: number;
        y: number;
        z: number;
    };
    normal: {
        x: number;
        y: number;
        z: number;
    };
}, label?: string) => Promise<string>;
/**
 * 5. Creates 3D label annotation with leader line.
 *
 * @param {string} modelId - 3D model identifier
 * @param {object} config - Label configuration
 * @returns {Promise<string>} Label annotation ID
 *
 * @example
 * ```typescript
 * const labelId = await create3DLabelAnnotation('ct-scan-456', {
 *   targetPoint: { x: 25, y: 30, z: 40 },
 *   labelPosition: { x: 50, y: 50, z: 50 },
 *   text: 'Anatomical landmark',
 *   color: '#FFFFFF'
 * });
 * ```
 */
export declare const create3DLabelAnnotation: (modelId: string, config: {
    targetPoint: {
        x: number;
        y: number;
        z: number;
    };
    labelPosition: {
        x: number;
        y: number;
        z: number;
    };
    text: string;
    color?: string;
}) => Promise<string>;
/**
 * 6. Extracts 3D coordinates from annotation.
 *
 * @param {string} annotationId - Annotation identifier
 * @returns {Promise<{ x: number; y: number; z: number }>} 3D coordinates
 *
 * @example
 * ```typescript
 * const coords = await extract3DCoordinates('annotation-uuid');
 * console.log(`Position: (${coords.x}, ${coords.y}, ${coords.z})`);
 * ```
 */
export declare const extract3DCoordinates: (annotationId: string) => Promise<{
    x: number;
    y: number;
    z: number;
}>;
/**
 * 7. Calculates 3D distance between annotation points.
 *
 * @param {string} annotationId1 - First annotation ID
 * @param {string} annotationId2 - Second annotation ID
 * @param {MeasurementUnit} [unit] - Measurement unit
 * @returns {Promise<number>} Distance in specified units
 *
 * @example
 * ```typescript
 * const distance = await calculate3DDistance('anno-1', 'anno-2', 'mm');
 * console.log(`Distance: ${distance} mm`);
 * ```
 */
export declare const calculate3DDistance: (annotationId1: string, annotationId2: string, unit?: MeasurementUnit) => Promise<number>;
/**
 * 8. Attaches audio recording to annotation.
 *
 * @param {AudioAnnotationConfig} config - Audio configuration
 * @returns {Promise<string>} Attachment ID
 *
 * @example
 * ```typescript
 * const attachmentId = await attachAudioToAnnotation({
 *   annotationId: 'anno-123',
 *   audioData: audioBuffer,
 *   format: 'mp3',
 *   duration: 45,
 *   transcription: 'Patient shows improvement...'
 * });
 * ```
 */
export declare const attachAudioToAnnotation: (config: AudioAnnotationConfig) => Promise<string>;
/**
 * 9. Attaches video recording to annotation.
 *
 * @param {VideoAnnotationConfig} config - Video configuration
 * @returns {Promise<string>} Attachment ID
 *
 * @example
 * ```typescript
 * const attachmentId = await attachVideoToAnnotation({
 *   annotationId: 'anno-456',
 *   videoData: videoBuffer,
 *   format: 'mp4',
 *   duration: 120,
 *   resolution: { width: 1920, height: 1080 }
 * });
 * ```
 */
export declare const attachVideoToAnnotation: (config: VideoAnnotationConfig) => Promise<string>;
/**
 * 10. Generates audio waveform visualization.
 *
 * @param {Buffer} audioData - Audio file data
 * @param {object} [options] - Visualization options
 * @returns {Promise<Buffer>} Waveform image (PNG)
 *
 * @example
 * ```typescript
 * const waveform = await generateAudioWaveform(audioBuffer, {
 *   width: 800,
 *   height: 200,
 *   color: '#3B82F6'
 * });
 * ```
 */
export declare const generateAudioWaveform: (audioData: Buffer, options?: {
    width?: number;
    height?: number;
    color?: string;
}) => Promise<Buffer>;
/**
 * 11. Generates video thumbnail.
 *
 * @param {Buffer} videoData - Video file data
 * @param {number} [timestamp] - Timestamp in seconds for thumbnail
 * @param {object} [size] - Thumbnail size
 * @returns {Promise<Buffer>} Thumbnail image (JPEG)
 *
 * @example
 * ```typescript
 * const thumbnail = await generateVideoThumbnail(videoBuffer, 5, {
 *   width: 320,
 *   height: 180
 * });
 * ```
 */
export declare const generateVideoThumbnail: (videoData: Buffer, timestamp?: number, size?: {
    width: number;
    height: number;
}) => Promise<Buffer>;
/**
 * 12. Transcribes audio annotation.
 *
 * @param {string} attachmentId - Audio attachment ID
 * @param {string} [language] - Language code (default: 'en')
 * @returns {Promise<{ text: string; confidence: number }>} Transcription result
 *
 * @example
 * ```typescript
 * const transcription = await transcribeAudioAnnotation('audio-123', 'en');
 * console.log('Transcription:', transcription.text);
 * ```
 */
export declare const transcribeAudioAnnotation: (attachmentId: string, language?: string) => Promise<{
    text: string;
    confidence: number;
}>;
/**
 * 13. Compresses multimedia attachment.
 *
 * @param {string} attachmentId - Attachment ID
 * @param {object} options - Compression options
 * @returns {Promise<{ originalSize: number; compressedSize: number; ratio: number }>} Compression result
 *
 * @example
 * ```typescript
 * const result = await compressMultimediaAttachment('attach-789', {
 *   quality: 0.8,
 *   maxSize: 5 * 1024 * 1024 // 5MB
 * });
 * console.log(`Compressed ${result.ratio}%`);
 * ```
 */
export declare const compressMultimediaAttachment: (attachmentId: string, options: {
    quality?: number;
    maxSize?: number;
}) => Promise<{
    originalSize: number;
    compressedSize: number;
    ratio: number;
}>;
/**
 * 14. Extracts metadata from multimedia attachment.
 *
 * @param {Buffer} mediaData - Media file data
 * @param {string} mimeType - MIME type
 * @returns {Promise<Record<string, any>>} Media metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractMultimediaMetadata(videoBuffer, 'video/mp4');
 * console.log('Duration:', metadata.duration);
 * console.log('Codec:', metadata.codec);
 * ```
 */
export declare const extractMultimediaMetadata: (mediaData: Buffer, mimeType: string) => Promise<Record<string, any>>;
/**
 * 15. Broadcasts annotation update to collaborators.
 *
 * @param {CollaborativeMarkup} markup - Markup event data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await broadcastAnnotationUpdate({
 *   annotationId: 'anno-123',
 *   documentId: 'doc-456',
 *   userId: 'user-789',
 *   userName: 'Dr. Smith',
 *   action: 'created',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const broadcastAnnotationUpdate: (markup: CollaborativeMarkup) => Promise<void>;
/**
 * 16. Merges concurrent annotation edits.
 *
 * @param {string} annotationId - Annotation identifier
 * @param {Array<{ version: number; changes: Record<string, any> }>} edits - Concurrent edits
 * @returns {Promise<{ merged: boolean; conflicts?: string[] }>} Merge result
 *
 * @example
 * ```typescript
 * const result = await mergeConcurrentEdits('anno-123', [
 *   { version: 2, changes: { content: 'Updated text A' } },
 *   { version: 2, changes: { color: '#FF0000' } }
 * ]);
 * ```
 */
export declare const mergeConcurrentEdits: (annotationId: string, edits: Array<{
    version: number;
    changes: Record<string, any>;
}>) => Promise<{
    merged: boolean;
    conflicts?: string[];
}>;
/**
 * 17. Gets active collaborators on document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<Array<{ userId: string; userName: string; cursor?: any }>>} Active users
 *
 * @example
 * ```typescript
 * const collaborators = await getActiveCollaborators('doc-123');
 * collaborators.forEach(user => {
 *   console.log(`${user.userName} is viewing`);
 * });
 * ```
 */
export declare const getActiveCollaborators: (documentId: string) => Promise<Array<{
    userId: string;
    userName: string;
    cursor?: any;
}>>;
/**
 * 18. Creates annotation mention/notification.
 *
 * @param {string} annotationId - Annotation ID
 * @param {string[]} userIds - Users to mention
 * @param {string} message - Mention message
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createAnnotationMention('anno-456', [
 *   'user-123',
 *   'user-789'
 * ], 'Please review this finding');
 * ```
 */
export declare const createAnnotationMention: (annotationId: string, userIds: string[], message: string) => Promise<void>;
/**
 * 19. Resolves annotation thread.
 *
 * @param {string} annotationId - Annotation identifier
 * @param {string} userId - User resolving the annotation
 * @param {string} [resolution] - Resolution notes
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resolveAnnotationThread('anno-789', 'user-123', 'Issue addressed in revision 2');
 * ```
 */
export declare const resolveAnnotationThread: (annotationId: string, userId: string, resolution?: string) => Promise<void>;
/**
 * 20. Creates annotation reply.
 *
 * @param {string} annotationId - Parent annotation ID
 * @param {object} reply - Reply data
 * @returns {Promise<string>} Reply ID
 *
 * @example
 * ```typescript
 * const replyId = await createAnnotationReply('anno-123', {
 *   userId: 'user-456',
 *   userName: 'Dr. Johnson',
 *   content: 'I concur with this assessment'
 * });
 * ```
 */
export declare const createAnnotationReply: (annotationId: string, reply: {
    userId: string;
    userName: string;
    content: string;
}) => Promise<string>;
/**
 * 21. Tracks annotation view/read status.
 *
 * @param {string} annotationId - Annotation identifier
 * @param {string} userId - User who viewed annotation
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackAnnotationView('anno-123', 'user-789');
 * ```
 */
export declare const trackAnnotationView: (annotationId: string, userId: string) => Promise<void>;
/**
 * 22. Creates annotation layer.
 *
 * @param {string} documentId - Document identifier
 * @param {object} layerConfig - Layer configuration
 * @returns {Promise<string>} Layer ID
 *
 * @example
 * ```typescript
 * const layerId = await createAnnotationLayer('doc-123', {
 *   name: 'Radiology Review',
 *   visibility: 'visible',
 *   color: '#3B82F6',
 *   description: 'Annotations from radiology team'
 * });
 * ```
 */
export declare const createAnnotationLayer: (documentId: string, layerConfig: {
    name: string;
    visibility?: LayerVisibility;
    color?: string;
    description?: string;
    createdBy: string;
}) => Promise<string>;
/**
 * 23. Changes layer visibility.
 *
 * @param {string} layerId - Layer identifier
 * @param {LayerVisibility} visibility - New visibility state
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setLayerVisibility('layer-123', 'hidden');
 * ```
 */
export declare const setLayerVisibility: (layerId: string, visibility: LayerVisibility) => Promise<void>;
/**
 * 24. Reorders annotation layers.
 *
 * @param {string} documentId - Document identifier
 * @param {string[]} layerOrder - Array of layer IDs in desired order
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reorderAnnotationLayers('doc-123', [
 *   'layer-1',
 *   'layer-3',
 *   'layer-2'
 * ]);
 * ```
 */
export declare const reorderAnnotationLayers: (documentId: string, layerOrder: string[]) => Promise<void>;
/**
 * 25. Merges multiple annotation layers.
 *
 * @param {string[]} layerIds - Layer IDs to merge
 * @param {string} targetLayerId - Target layer to merge into
 * @returns {Promise<number>} Number of annotations merged
 *
 * @example
 * ```typescript
 * const merged = await mergeAnnotationLayers([
 *   'layer-1',
 *   'layer-2'
 * ], 'layer-target');
 * console.log(`Merged ${merged} annotations`);
 * ```
 */
export declare const mergeAnnotationLayers: (layerIds: string[], targetLayerId: string) => Promise<number>;
/**
 * 26. Exports layer annotations separately.
 *
 * @param {string} layerId - Layer identifier
 * @param {AnnotationExportFormat} format - Export format
 * @returns {Promise<Buffer>} Exported layer data
 *
 * @example
 * ```typescript
 * const exported = await exportLayerAnnotations('layer-123', 'XFDF');
 * await fs.writeFile('layer-export.xfdf', exported);
 * ```
 */
export declare const exportLayerAnnotations: (layerId: string, format: AnnotationExportFormat) => Promise<Buffer>;
/**
 * 27. Locks/unlocks annotation layer.
 *
 * @param {string} layerId - Layer identifier
 * @param {boolean} locked - Lock state
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await lockAnnotationLayer('layer-123', true);
 * ```
 */
export declare const lockAnnotationLayer: (layerId: string, locked: boolean) => Promise<void>;
/**
 * 28. Creates distance measurement annotation.
 *
 * @param {string} documentId - Document identifier
 * @param {MeasurementConfig} config - Measurement configuration
 * @param {Array<{ x: number; y: number }>} points - Measurement points
 * @returns {Promise<{ annotationId: string; value: number }>} Measurement result
 *
 * @example
 * ```typescript
 * const measurement = await createDistanceMeasurement('doc-123', {
 *   type: 'distance',
 *   unit: 'mm',
 *   precision: 2,
 *   color: '#FF0000'
 * }, [
 *   { x: 100, y: 200 },
 *   { x: 300, y: 400 }
 * ]);
 * console.log(`Distance: ${measurement.value} mm`);
 * ```
 */
export declare const createDistanceMeasurement: (documentId: string, config: MeasurementConfig, points: Array<{
    x: number;
    y: number;
}>) => Promise<{
    annotationId: string;
    value: number;
}>;
/**
 * 29. Creates area measurement annotation.
 *
 * @param {string} documentId - Document identifier
 * @param {MeasurementConfig} config - Measurement configuration
 * @param {Array<{ x: number; y: number }>} polygon - Polygon vertices
 * @returns {Promise<{ annotationId: string; value: number }>} Area measurement
 *
 * @example
 * ```typescript
 * const area = await createAreaMeasurement('doc-456', {
 *   type: 'area',
 *   unit: 'cm',
 *   precision: 2
 * }, [
 *   { x: 100, y: 100 },
 *   { x: 200, y: 100 },
 *   { x: 200, y: 200 },
 *   { x: 100, y: 200 }
 * ]);
 * console.log(`Area: ${area.value} cm²`);
 * ```
 */
export declare const createAreaMeasurement: (documentId: string, config: MeasurementConfig, polygon: Array<{
    x: number;
    y: number;
}>) => Promise<{
    annotationId: string;
    value: number;
}>;
/**
 * 30. Creates angle measurement annotation.
 *
 * @param {string} documentId - Document identifier
 * @param {MeasurementConfig} config - Measurement configuration
 * @param {Array<{ x: number; y: number }>} points - Three points defining angle
 * @returns {Promise<{ annotationId: string; value: number }>} Angle measurement
 *
 * @example
 * ```typescript
 * const angle = await createAngleMeasurement('doc-789', {
 *   type: 'angle',
 *   unit: 'degrees',
 *   precision: 1
 * }, [
 *   { x: 100, y: 200 }, // Point A
 *   { x: 150, y: 150 }, // Vertex
 *   { x: 200, y: 200 }  // Point B
 * ]);
 * console.log(`Angle: ${angle.value}°`);
 * ```
 */
export declare const createAngleMeasurement: (documentId: string, config: MeasurementConfig, points: Array<{
    x: number;
    y: number;
}>) => Promise<{
    annotationId: string;
    value: number;
}>;
/**
 * 31. Calibrates measurement scale.
 *
 * @param {string} documentId - Document identifier
 * @param {object} calibration - Calibration data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await calibrateMeasurementScale('doc-123', {
 *   referenceDistance: 100, // pixels
 *   actualDistance: 25,     // mm
 *   unit: 'mm'
 * });
 * ```
 */
export declare const calibrateMeasurementScale: (documentId: string, calibration: {
    referenceDistance: number;
    actualDistance: number;
    unit: MeasurementUnit;
}) => Promise<void>;
/**
 * 32. Converts measurement units.
 *
 * @param {number} value - Measurement value
 * @param {MeasurementUnit} fromUnit - Source unit
 * @param {MeasurementUnit} toUnit - Target unit
 * @returns {number} Converted value
 *
 * @example
 * ```typescript
 * const inches = convertMeasurementUnit(25.4, 'mm', 'in');
 * console.log(`${inches} inches`); // 1 inch
 * ```
 */
export declare const convertMeasurementUnit: (value: number, fromUnit: MeasurementUnit, toUnit: MeasurementUnit) => number;
/**
 * 33. Generates measurement summary report.
 *
 * @param {string} documentId - Document identifier
 * @param {string[]} [annotationIds] - Specific annotations to include
 * @returns {Promise<string>} Measurement report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateMeasurementReport('doc-123');
 * console.log(report);
 * ```
 */
export declare const generateMeasurementReport: (documentId: string, annotationIds?: string[]) => Promise<string>;
/**
 * 34. Creates custom annotation stamp.
 *
 * @param {StampConfig} config - Stamp configuration
 * @returns {Promise<{ stampId: string; image: Buffer }>} Stamp data
 *
 * @example
 * ```typescript
 * const stamp = await createCustomStamp({
 *   type: 'approved',
 *   text: 'APPROVED BY DR. SMITH',
 *   size: { width: 200, height: 80 },
 *   color: '#00FF00',
 *   borderColor: '#008000',
 *   borderWidth: 2
 * });
 * ```
 */
export declare const createCustomStamp: (config: StampConfig) => Promise<{
    stampId: string;
    image: Buffer;
}>;
/**
 * 35. Applies stamp to document.
 *
 * @param {string} documentId - Document identifier
 * @param {string} stampId - Stamp template ID
 * @param {object} position - Stamp position
 * @returns {Promise<string>} Annotation ID
 *
 * @example
 * ```typescript
 * const annotationId = await applyStampToDocument('doc-123', 'stamp-456', {
 *   pageNumber: 1,
 *   x: 400,
 *   y: 50
 * });
 * ```
 */
export declare const applyStampToDocument: (documentId: string, stampId: string, position: {
    pageNumber: number;
    x: number;
    y: number;
}) => Promise<string>;
/**
 * 36. Creates date/time stamp.
 *
 * @param {object} config - Date stamp configuration
 * @returns {Promise<{ stampId: string; image: Buffer }>} Date stamp
 *
 * @example
 * ```typescript
 * const dateStamp = await createDateTimeStamp({
 *   format: 'MM/DD/YYYY HH:mm',
 *   timezone: 'America/New_York',
 *   prefix: 'Reviewed on:',
 *   size: { width: 250, height: 60 }
 * });
 * ```
 */
export declare const createDateTimeStamp: (config: {
    format: string;
    timezone?: string;
    prefix?: string;
    size: {
        width: number;
        height: number;
    };
}) => Promise<{
    stampId: string;
    image: Buffer;
}>;
/**
 * 37. Creates signature stamp from image.
 *
 * @param {Buffer} signatureImage - Signature image data
 * @param {object} [options] - Stamp options
 * @returns {Promise<{ stampId: string; image: Buffer }>} Signature stamp
 *
 * @example
 * ```typescript
 * const sigStamp = await createSignatureStamp(signatureBuffer, {
 *   backgroundColor: 'transparent',
 *   size: { width: 180, height: 60 }
 * });
 * ```
 */
export declare const createSignatureStamp: (signatureImage: Buffer, options?: {
    backgroundColor?: string;
    size?: {
        width: number;
        height: number;
    };
}) => Promise<{
    stampId: string;
    image: Buffer;
}>;
/**
 * 38. Creates regulatory compliance stamp.
 *
 * @param {object} config - Compliance stamp configuration
 * @returns {Promise<{ stampId: string; image: Buffer }>} Compliance stamp
 *
 * @example
 * ```typescript
 * const complianceStamp = await createComplianceStamp({
 *   standard: 'HIPAA',
 *   certificationNumber: 'CERT-12345',
 *   expiryDate: new Date('2025-12-31'),
 *   size: { width: 300, height: 100 }
 * });
 * ```
 */
export declare const createComplianceStamp: (config: {
    standard: string;
    certificationNumber: string;
    expiryDate?: Date;
    size: {
        width: number;
        height: number;
    };
}) => Promise<{
    stampId: string;
    image: Buffer;
}>;
/**
 * 39. Lists available stamp templates.
 *
 * @param {object} [filter] - Filter criteria
 * @returns {Promise<Array<{ id: string; type: StampType; preview: Buffer }>>} Stamp templates
 *
 * @example
 * ```typescript
 * const stamps = await listStampTemplates({ type: 'approved' });
 * stamps.forEach(stamp => {
 *   console.log('Stamp:', stamp.id);
 * });
 * ```
 */
export declare const listStampTemplates: (filter?: {
    type?: StampType;
    createdBy?: string;
}) => Promise<Array<{
    id: string;
    type: StampType;
    preview: Buffer;
}>>;
/**
 * 40. Exports annotations to XFDF format.
 *
 * @param {string} documentId - Document identifier
 * @param {AnnotationExportOptions} options - Export options
 * @returns {Promise<Buffer>} XFDF data
 *
 * @example
 * ```typescript
 * const xfdf = await exportAnnotationsToXFDF('doc-123', {
 *   format: 'XFDF',
 *   includeReplies: true,
 *   includeAttachments: false
 * });
 * await fs.writeFile('annotations.xfdf', xfdf);
 * ```
 */
export declare const exportAnnotationsToXFDF: (documentId: string, options: AnnotationExportOptions) => Promise<Buffer>;
/**
 * 41. Imports annotations from XFDF.
 *
 * @param {string} documentId - Document identifier
 * @param {Buffer} xfdfData - XFDF file data
 * @param {object} [options] - Import options
 * @returns {Promise<AnnotationImportResult>} Import result
 *
 * @example
 * ```typescript
 * const result = await importAnnotationsFromXFDF('doc-456', xfdfBuffer, {
 *   mergeStrategy: 'append',
 *   preserveIds: false
 * });
 * console.log(`Imported ${result.importedCount} annotations`);
 * ```
 */
export declare const importAnnotationsFromXFDF: (documentId: string, xfdfData: Buffer, options?: {
    mergeStrategy?: "append" | "replace";
    preserveIds?: boolean;
}) => Promise<AnnotationImportResult>;
/**
 * 42. Exports annotations to JSON format.
 *
 * @param {string} documentId - Document identifier
 * @param {AnnotationExportOptions} options - Export options
 * @returns {Promise<string>} JSON data
 *
 * @example
 * ```typescript
 * const json = await exportAnnotationsToJSON('doc-789', {
 *   format: 'JSON',
 *   includeReplies: true,
 *   includeAttachments: true,
 *   includeLayers: true
 * });
 * await fs.writeFile('annotations.json', json);
 * ```
 */
export declare const exportAnnotationsToJSON: (documentId: string, options: AnnotationExportOptions) => Promise<string>;
/**
 * 43. Imports annotations from JSON.
 *
 * @param {string} documentId - Document identifier
 * @param {string} jsonData - JSON annotation data
 * @returns {Promise<AnnotationImportResult>} Import result
 *
 * @example
 * ```typescript
 * const result = await importAnnotationsFromJSON('doc-123', jsonString);
 * if (result.success) {
 *   console.log('Import successful');
 * }
 * ```
 */
export declare const importAnnotationsFromJSON: (documentId: string, jsonData: string) => Promise<AnnotationImportResult>;
/**
 * 44. Converts annotations between formats.
 *
 * @param {Buffer | string} sourceData - Source annotation data
 * @param {AnnotationExportFormat} sourceFormat - Source format
 * @param {AnnotationExportFormat} targetFormat - Target format
 * @returns {Promise<Buffer | string>} Converted data
 *
 * @example
 * ```typescript
 * const json = await convertAnnotationFormat(xfdfBuffer, 'XFDF', 'JSON');
 * ```
 */
export declare const convertAnnotationFormat: (sourceData: Buffer | string, sourceFormat: AnnotationExportFormat, targetFormat: AnnotationExportFormat) => Promise<Buffer | string>;
/**
 * 45. Searches annotations with advanced criteria.
 *
 * @param {AnnotationSearchCriteria} criteria - Search criteria
 * @returns {Promise<Array<{ id: string; type: string; content: string; matches: string[] }>>} Search results
 *
 * @example
 * ```typescript
 * const results = await searchAnnotations({
 *   documentId: 'doc-123',
 *   contentSearch: 'tumor',
 *   type: ['text', 'sticky-note'],
 *   dateRange: {
 *     start: new Date('2024-01-01'),
 *     end: new Date('2024-12-31')
 *   }
 * });
 * ```
 */
export declare const searchAnnotations: (criteria: AnnotationSearchCriteria) => Promise<Array<{
    id: string;
    type: string;
    content: string;
    matches: string[];
}>>;
declare const _default: {
    createAnnotationModel: (sequelize: Sequelize) => any;
    createAnnotationReplyModel: (sequelize: Sequelize) => any;
    createAnnotationAttachmentModel: (sequelize: Sequelize) => any;
    create3DPointAnnotation: (config: ThreeDAnnotationConfig) => Promise<string>;
    add3DMeasurement: (measurement: ThreeDMeasurement, modelId: string) => Promise<string>;
    create3DRegionAnnotation: (modelId: string, boundingBox: Array<{
        x: number;
        y: number;
        z: number;
    }>, label: string, color?: string) => Promise<string>;
    add3DCrossSectionPlane: (modelId: string, plane: {
        point: {
            x: number;
            y: number;
            z: number;
        };
        normal: {
            x: number;
            y: number;
            z: number;
        };
    }, label?: string) => Promise<string>;
    create3DLabelAnnotation: (modelId: string, config: {
        targetPoint: {
            x: number;
            y: number;
            z: number;
        };
        labelPosition: {
            x: number;
            y: number;
            z: number;
        };
        text: string;
        color?: string;
    }) => Promise<string>;
    extract3DCoordinates: (annotationId: string) => Promise<{
        x: number;
        y: number;
        z: number;
    }>;
    calculate3DDistance: (annotationId1: string, annotationId2: string, unit?: MeasurementUnit) => Promise<number>;
    attachAudioToAnnotation: (config: AudioAnnotationConfig) => Promise<string>;
    attachVideoToAnnotation: (config: VideoAnnotationConfig) => Promise<string>;
    generateAudioWaveform: (audioData: Buffer, options?: {
        width?: number;
        height?: number;
        color?: string;
    }) => Promise<Buffer>;
    generateVideoThumbnail: (videoData: Buffer, timestamp?: number, size?: {
        width: number;
        height: number;
    }) => Promise<Buffer>;
    transcribeAudioAnnotation: (attachmentId: string, language?: string) => Promise<{
        text: string;
        confidence: number;
    }>;
    compressMultimediaAttachment: (attachmentId: string, options: {
        quality?: number;
        maxSize?: number;
    }) => Promise<{
        originalSize: number;
        compressedSize: number;
        ratio: number;
    }>;
    extractMultimediaMetadata: (mediaData: Buffer, mimeType: string) => Promise<Record<string, any>>;
    broadcastAnnotationUpdate: (markup: CollaborativeMarkup) => Promise<void>;
    mergeConcurrentEdits: (annotationId: string, edits: Array<{
        version: number;
        changes: Record<string, any>;
    }>) => Promise<{
        merged: boolean;
        conflicts?: string[];
    }>;
    getActiveCollaborators: (documentId: string) => Promise<Array<{
        userId: string;
        userName: string;
        cursor?: any;
    }>>;
    createAnnotationMention: (annotationId: string, userIds: string[], message: string) => Promise<void>;
    resolveAnnotationThread: (annotationId: string, userId: string, resolution?: string) => Promise<void>;
    createAnnotationReply: (annotationId: string, reply: {
        userId: string;
        userName: string;
        content: string;
    }) => Promise<string>;
    trackAnnotationView: (annotationId: string, userId: string) => Promise<void>;
    createAnnotationLayer: (documentId: string, layerConfig: {
        name: string;
        visibility?: LayerVisibility;
        color?: string;
        description?: string;
        createdBy: string;
    }) => Promise<string>;
    setLayerVisibility: (layerId: string, visibility: LayerVisibility) => Promise<void>;
    reorderAnnotationLayers: (documentId: string, layerOrder: string[]) => Promise<void>;
    mergeAnnotationLayers: (layerIds: string[], targetLayerId: string) => Promise<number>;
    exportLayerAnnotations: (layerId: string, format: AnnotationExportFormat) => Promise<Buffer>;
    lockAnnotationLayer: (layerId: string, locked: boolean) => Promise<void>;
    createDistanceMeasurement: (documentId: string, config: MeasurementConfig, points: Array<{
        x: number;
        y: number;
    }>) => Promise<{
        annotationId: string;
        value: number;
    }>;
    createAreaMeasurement: (documentId: string, config: MeasurementConfig, polygon: Array<{
        x: number;
        y: number;
    }>) => Promise<{
        annotationId: string;
        value: number;
    }>;
    createAngleMeasurement: (documentId: string, config: MeasurementConfig, points: Array<{
        x: number;
        y: number;
    }>) => Promise<{
        annotationId: string;
        value: number;
    }>;
    calibrateMeasurementScale: (documentId: string, calibration: {
        referenceDistance: number;
        actualDistance: number;
        unit: MeasurementUnit;
    }) => Promise<void>;
    convertMeasurementUnit: (value: number, fromUnit: MeasurementUnit, toUnit: MeasurementUnit) => number;
    generateMeasurementReport: (documentId: string, annotationIds?: string[]) => Promise<string>;
    createCustomStamp: (config: StampConfig) => Promise<{
        stampId: string;
        image: Buffer;
    }>;
    applyStampToDocument: (documentId: string, stampId: string, position: {
        pageNumber: number;
        x: number;
        y: number;
    }) => Promise<string>;
    createDateTimeStamp: (config: {
        format: string;
        timezone?: string;
        prefix?: string;
        size: {
            width: number;
            height: number;
        };
    }) => Promise<{
        stampId: string;
        image: Buffer;
    }>;
    createSignatureStamp: (signatureImage: Buffer, options?: {
        backgroundColor?: string;
        size?: {
            width: number;
            height: number;
        };
    }) => Promise<{
        stampId: string;
        image: Buffer;
    }>;
    createComplianceStamp: (config: {
        standard: string;
        certificationNumber: string;
        expiryDate?: Date;
        size: {
            width: number;
            height: number;
        };
    }) => Promise<{
        stampId: string;
        image: Buffer;
    }>;
    listStampTemplates: (filter?: {
        type?: StampType;
        createdBy?: string;
    }) => Promise<Array<{
        id: string;
        type: StampType;
        preview: Buffer;
    }>>;
    exportAnnotationsToXFDF: (documentId: string, options: AnnotationExportOptions) => Promise<Buffer>;
    importAnnotationsFromXFDF: (documentId: string, xfdfData: Buffer, options?: {
        mergeStrategy?: "append" | "replace";
        preserveIds?: boolean;
    }) => Promise<AnnotationImportResult>;
    exportAnnotationsToJSON: (documentId: string, options: AnnotationExportOptions) => Promise<string>;
    importAnnotationsFromJSON: (documentId: string, jsonData: string) => Promise<AnnotationImportResult>;
    convertAnnotationFormat: (sourceData: Buffer | string, sourceFormat: AnnotationExportFormat, targetFormat: AnnotationExportFormat) => Promise<Buffer | string>;
    searchAnnotations: (criteria: AnnotationSearchCriteria) => Promise<Array<{
        id: string;
        type: string;
        content: string;
        matches: string[];
    }>>;
};
export default _default;
//# sourceMappingURL=document-advanced-annotations-kit.d.ts.map
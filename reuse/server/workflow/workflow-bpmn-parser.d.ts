/**
 * LOC: WF-BPMN-PARSER-001
 * File: /reuse/server/workflow/workflow-bpmn-parser.ts
 *
 * UPSTREAM (imports from):
 *   - xml2js (XML parsing)
 *   - zod (validation)
 *   - @nestjs/common (framework)
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend workflow services
 *   - BPMN modeling services
 *   - Process definition importers
 *   - Workflow diagram renderers
 *   - Process validation engines
 */
/**
 * BPMN element types
 */
export declare enum BPMNElementType {
    PROCESS = "process",
    TASK = "task",
    SERVICE_TASK = "serviceTask",
    USER_TASK = "userTask",
    MANUAL_TASK = "manualTask",
    SCRIPT_TASK = "scriptTask",
    BUSINESS_RULE_TASK = "businessRuleTask",
    SEND_TASK = "sendTask",
    RECEIVE_TASK = "receiveTask",
    SUBPROCESS = "subProcess",
    CALL_ACTIVITY = "callActivity",
    GATEWAY = "gateway",
    EXCLUSIVE_GATEWAY = "exclusiveGateway",
    PARALLEL_GATEWAY = "parallelGateway",
    INCLUSIVE_GATEWAY = "inclusiveGateway",
    EVENT_BASED_GATEWAY = "eventBasedGateway",
    COMPLEX_GATEWAY = "complexGateway",
    START_EVENT = "startEvent",
    END_EVENT = "endEvent",
    INTERMEDIATE_CATCH_EVENT = "intermediateCatchEvent",
    INTERMEDIATE_THROW_EVENT = "intermediateThrowEvent",
    BOUNDARY_EVENT = "boundaryEvent",
    SEQUENCE_FLOW = "sequenceFlow",
    MESSAGE_FLOW = "messageFlow",
    ASSOCIATION = "association",
    DATA_OBJECT = "dataObject",
    DATA_STORE = "dataStore",
    LANE = "lane",
    POOL = "pool",
    TEXT_ANNOTATION = "textAnnotation"
}
/**
 * BPMN event types
 */
export declare enum BPMNEventType {
    NONE = "none",
    MESSAGE = "message",
    TIMER = "timer",
    ERROR = "error",
    ESCALATION = "escalation",
    CANCEL = "cancel",
    COMPENSATION = "compensation",
    CONDITIONAL = "conditional",
    LINK = "link",
    SIGNAL = "signal",
    TERMINATE = "terminate",
    MULTIPLE = "multiple",
    PARALLEL_MULTIPLE = "parallelMultiple"
}
/**
 * BPMN gateway direction
 */
export declare enum GatewayDirection {
    DIVERGING = "diverging",
    CONVERGING = "converging",
    MIXED = "mixed",
    UNSPECIFIED = "unspecified"
}
/**
 * BPMN validation severity
 */
export declare enum ValidationSeverity {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info"
}
/**
 * BPMN document interface
 */
export interface BPMNDocument {
    definitions: BPMNDefinitions;
    processes: BPMNProcess[];
    collaborations: BPMNCollaboration[];
    diagrams: BPMNDiagram[];
    rawXml: string;
    metadata: BPMNMetadata;
}
/**
 * BPMN definitions root
 */
export interface BPMNDefinitions {
    id: string;
    name?: string;
    targetNamespace: string;
    expressionLanguage?: string;
    typeLanguage?: string;
    exporter?: string;
    exporterVersion?: string;
    rootElements: BPMNRootElement[];
    imports: BPMNImport[];
    extensions: BPMNExtension[];
}
/**
 * BPMN root element
 */
export interface BPMNRootElement {
    id: string;
    type: string;
    name?: string;
    documentation?: string;
}
/**
 * BPMN process
 */
export interface BPMNProcess extends BPMNRootElement {
    isExecutable: boolean;
    isClosed: boolean;
    processType?: 'None' | 'Public' | 'Private';
    flowElements: BPMNFlowElement[];
    laneSet?: BPMNLaneSet;
    properties: BPMNProperty[];
    artifacts: BPMNArtifact[];
}
/**
 * BPMN flow element
 */
export interface BPMNFlowElement {
    id: string;
    type: BPMNElementType;
    name?: string;
    documentation?: string;
    incoming: string[];
    outgoing: string[];
    extensionElements?: Record<string, any>;
}
/**
 * BPMN task
 */
export interface BPMNTask extends BPMNFlowElement {
    isForCompensation?: boolean;
    startQuantity?: number;
    completionQuantity?: number;
    ioSpecification?: BPMNIOSpecification;
    properties: BPMNProperty[];
    resources?: BPMNResourceRole[];
}
/**
 * BPMN user task
 */
export interface BPMNUserTask extends BPMNTask {
    implementation?: string;
    renderings?: BPMNRendering[];
    formKey?: string;
    assignee?: string;
    candidateUsers?: string[];
    candidateGroups?: string[];
    dueDate?: string;
    priority?: number;
}
/**
 * BPMN service task
 */
export interface BPMNServiceTask extends BPMNTask {
    implementation?: string;
    operationRef?: string;
    topic?: string;
    type?: string;
    resultVariable?: string;
}
/**
 * BPMN gateway
 */
export interface BPMNGateway extends BPMNFlowElement {
    gatewayDirection: GatewayDirection;
    default?: string;
}
/**
 * BPMN exclusive gateway
 */
export interface BPMNExclusiveGateway extends BPMNGateway {
}
/**
 * BPMN parallel gateway
 */
export interface BPMNParallelGateway extends BPMNGateway {
}
/**
 * BPMN event
 */
export interface BPMNEvent extends BPMNFlowElement {
    eventDefinitions: BPMNEventDefinition[];
    parallelMultiple?: boolean;
    properties: BPMNProperty[];
}
/**
 * BPMN start event
 */
export interface BPMNStartEvent extends BPMNEvent {
    isInterrupting?: boolean;
}
/**
 * BPMN end event
 */
export interface BPMNEndEvent extends BPMNEvent {
}
/**
 * BPMN boundary event
 */
export interface BPMNBoundaryEvent extends BPMNEvent {
    attachedToRef: string;
    cancelActivity: boolean;
}
/**
 * BPMN event definition
 */
export interface BPMNEventDefinition {
    type: BPMNEventType;
    id?: string;
    [key: string]: any;
}
/**
 * BPMN timer event definition
 */
export interface BPMNTimerEventDefinition extends BPMNEventDefinition {
    timeDuration?: string;
    timeDate?: string;
    timeCycle?: string;
}
/**
 * BPMN message event definition
 */
export interface BPMNMessageEventDefinition extends BPMNEventDefinition {
    messageRef?: string;
    operationRef?: string;
}
/**
 * BPMN error event definition
 */
export interface BPMNErrorEventDefinition extends BPMNEventDefinition {
    errorRef?: string;
    errorCode?: string;
    errorCodeVariable?: string;
    errorMessageVariable?: string;
}
/**
 * BPMN sequence flow
 */
export interface BPMNSequenceFlow {
    id: string;
    name?: string;
    sourceRef: string;
    targetRef: string;
    conditionExpression?: string;
    isImmediate?: boolean;
}
/**
 * BPMN subprocess
 */
export interface BPMNSubProcess extends BPMNTask {
    triggeredByEvent?: boolean;
    flowElements: BPMNFlowElement[];
    artifacts: BPMNArtifact[];
}
/**
 * BPMN call activity
 */
export interface BPMNCallActivity extends BPMNTask {
    calledElement?: string;
    calledElementBinding?: 'latest' | 'deployment' | 'version';
    calledElementVersion?: number;
    calledElementTenantId?: string;
}
/**
 * BPMN collaboration
 */
export interface BPMNCollaboration extends BPMNRootElement {
    participants: BPMNParticipant[];
    messageFlows: BPMNMessageFlow[];
    artifacts: BPMNArtifact[];
    conversationNodes: BPMNConversationNode[];
}
/**
 * BPMN participant (pool)
 */
export interface BPMNParticipant {
    id: string;
    name?: string;
    processRef?: string;
    partnerEntityRef?: string;
    partnerRoleRef?: string;
}
/**
 * BPMN message flow
 */
export interface BPMNMessageFlow {
    id: string;
    name?: string;
    sourceRef: string;
    targetRef: string;
    messageRef?: string;
}
/**
 * BPMN lane set
 */
export interface BPMNLaneSet {
    id: string;
    name?: string;
    lanes: BPMNLane[];
}
/**
 * BPMN lane
 */
export interface BPMNLane {
    id: string;
    name?: string;
    partitionElementRef?: string;
    flowNodeRefs: string[];
    childLaneSet?: BPMNLaneSet;
}
/**
 * BPMN data object
 */
export interface BPMNDataObject {
    id: string;
    name?: string;
    itemSubjectRef?: string;
    isCollection?: boolean;
}
/**
 * BPMN data store
 */
export interface BPMNDataStore {
    id: string;
    name?: string;
    capacity?: number;
    isUnlimited?: boolean;
    itemSubjectRef?: string;
}
/**
 * BPMN artifact
 */
export interface BPMNArtifact {
    id: string;
    type: string;
}
/**
 * BPMN text annotation
 */
export interface BPMNTextAnnotation extends BPMNArtifact {
    text?: string;
    textFormat?: string;
}
/**
 * BPMN diagram
 */
export interface BPMNDiagram {
    id: string;
    name?: string;
    plane: BPMNPlane;
    labelStyle?: BPMNLabelStyle[];
}
/**
 * BPMN plane
 */
export interface BPMNPlane {
    id: string;
    bpmnElement?: string;
    shapes: BPMNShape[];
    edges: BPMNEdge[];
}
/**
 * BPMN shape
 */
export interface BPMNShape {
    id: string;
    bpmnElement: string;
    bounds: BPMNBounds;
    isHorizontal?: boolean;
    isExpanded?: boolean;
    isMarkerVisible?: boolean;
    label?: BPMNLabel;
}
/**
 * BPMN edge
 */
export interface BPMNEdge {
    id: string;
    bpmnElement: string;
    waypoints: BPMNPoint[];
    label?: BPMNLabel;
}
/**
 * BPMN bounds
 */
export interface BPMNBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * BPMN point
 */
export interface BPMNPoint {
    x: number;
    y: number;
}
/**
 * BPMN label
 */
export interface BPMNLabel {
    bounds?: BPMNBounds;
    labelStyle?: string;
}
/**
 * BPMN label style
 */
export interface BPMNLabelStyle {
    id: string;
    font?: BPMNFont;
}
/**
 * BPMN font
 */
export interface BPMNFont {
    name?: string;
    size?: number;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    isStrikeThrough?: boolean;
}
/**
 * BPMN property
 */
export interface BPMNProperty {
    id: string;
    name: string;
    itemSubjectRef?: string;
}
/**
 * BPMN IO specification
 */
export interface BPMNIOSpecification {
    dataInputs: BPMNDataInput[];
    dataOutputs: BPMNDataOutput[];
    inputSets: BPMNInputSet[];
    outputSets: BPMNOutputSet[];
}
/**
 * BPMN data input
 */
export interface BPMNDataInput {
    id: string;
    name?: string;
    itemSubjectRef?: string;
    isCollection?: boolean;
}
/**
 * BPMN data output
 */
export interface BPMNDataOutput {
    id: string;
    name?: string;
    itemSubjectRef?: string;
    isCollection?: boolean;
}
/**
 * BPMN input set
 */
export interface BPMNInputSet {
    id: string;
    name?: string;
    dataInputRefs: string[];
}
/**
 * BPMN output set
 */
export interface BPMNOutputSet {
    id: string;
    name?: string;
    dataOutputRefs: string[];
}
/**
 * BPMN resource role
 */
export interface BPMNResourceRole {
    id: string;
    name?: string;
    resourceRef?: string;
    resourceParameterBindings?: BPMNResourceParameterBinding[];
}
/**
 * BPMN resource parameter binding
 */
export interface BPMNResourceParameterBinding {
    parameterRef: string;
    expression: string;
}
/**
 * BPMN rendering
 */
export interface BPMNRendering {
    id: string;
}
/**
 * BPMN import
 */
export interface BPMNImport {
    importType: string;
    location: string;
    namespace: string;
}
/**
 * BPMN extension
 */
export interface BPMNExtension {
    definition?: string;
    mustUnderstand?: boolean;
}
/**
 * BPMN conversation node
 */
export interface BPMNConversationNode {
    id: string;
    name?: string;
    participantRefs: string[];
    messageFlowRefs: string[];
}
/**
 * BPMN metadata
 */
export interface BPMNMetadata {
    processCount: number;
    taskCount: number;
    gatewayCount: number;
    eventCount: number;
    sequenceFlowCount: number;
    participantCount: number;
    laneCount: number;
    dataObjectCount: number;
    validationErrors: BPMNValidationResult[];
    complexity: number;
    version?: string;
    createdDate?: Date;
    modifiedDate?: Date;
}
/**
 * BPMN validation result
 */
export interface BPMNValidationResult {
    severity: ValidationSeverity;
    code: string;
    message: string;
    elementId?: string;
    elementType?: string;
    path?: string;
    line?: number;
    column?: number;
}
/**
 * BPMN flow path
 */
export interface BPMNFlowPath {
    elements: string[];
    conditions: string[];
    isValid: boolean;
    cycleDetected: boolean;
}
/**
 * BPMN element statistics
 */
export interface BPMNElementStatistics {
    elementType: BPMNElementType;
    count: number;
    percentage: number;
}
/**
 * BPMN element schema
 */
export declare const BPMNElementSchema: any;
/**
 * BPMN sequence flow schema
 */
export declare const BPMNSequenceFlowSchema: any;
/**
 * BPMN validation options schema
 */
export declare const BPMNValidationOptionsSchema: any;
/**
 * Parses BPMN XML document into structured object.
 *
 * @param {string} xml - BPMN XML content
 * @returns {Promise<BPMNDocument>} Parsed BPMN document
 *
 * @example
 * ```typescript
 * const document = await parseBPMNXml(bpmnXmlString);
 * // Result: { definitions: {...}, processes: [...], diagrams: [...] }
 * ```
 */
export declare const parseBPMNXml: (xml: string) => Promise<BPMNDocument>;
/**
 * Parses BPMN XML from file path.
 *
 * @param {string} filePath - Path to BPMN file
 * @returns {Promise<BPMNDocument>} Parsed BPMN document
 *
 * @example
 * ```typescript
 * const document = await parseBPMNFile('/path/to/workflow.bpmn');
 * // Result: Parsed BPMN document
 * ```
 */
export declare const parseBPMNFile: (filePath: string) => Promise<BPMNDocument>;
/**
 * Parses BPMN definitions element.
 *
 * @param {any} xmlObject - Parsed XML object
 * @returns {BPMNDefinitions} BPMN definitions
 *
 * @example
 * ```typescript
 * const definitions = parseBPMNDefinitions(xmlObject);
 * // Result: { id: '...', targetNamespace: '...', rootElements: [...] }
 * ```
 */
export declare const parseBPMNDefinitions: (xmlObject: any) => BPMNDefinitions;
/**
 * Converts BPMN XML to JSON representation.
 *
 * @param {string} xml - BPMN XML content
 * @returns {Promise<any>} JSON representation
 *
 * @example
 * ```typescript
 * const json = await bpmnXmlToJson(bpmnXml);
 * // Result: { definitions: {...}, processes: [...] } as JSON
 * ```
 */
export declare const bpmnXmlToJson: (xml: string) => Promise<any>;
/**
 * Converts JSON representation to BPMN XML.
 *
 * @param {any} json - JSON representation
 * @returns {string} BPMN XML
 *
 * @example
 * ```typescript
 * const xml = jsonToBpmnXml(jsonDocument);
 * // Result: Valid BPMN 2.0 XML string
 * ```
 */
export declare const jsonToBpmnXml: (json: any) => string;
/**
 * Extracts BPMN definitions from parsed XML.
 *
 * @param {any} parsedXml - Parsed XML object
 * @returns {BPMNDefinitions} BPMN definitions
 *
 * @example
 * ```typescript
 * const definitions = extractDefinitions(parsedXmlObject);
 * // Result: Complete definitions structure
 * ```
 */
export declare const extractDefinitions: (parsedXml: any) => BPMNDefinitions;
/**
 * Validates BPMN document structure and semantics.
 *
 * @param {BPMNDocument} document - BPMN document
 * @param {Record<string, any>} [options] - Validation options
 * @returns {BPMNValidationResult[]} Validation results
 *
 * @example
 * ```typescript
 * const results = validateBPMNDocument(document, { strictMode: true });
 * // Result: [{ severity: 'error', message: '...', elementId: '...' }]
 * ```
 */
export declare const validateBPMNDocument: (document: BPMNDocument, options?: Record<string, any>) => BPMNValidationResult[];
/**
 * Validates a BPMN process.
 *
 * @param {BPMNProcess} process - BPMN process
 * @param {Record<string, any>} [options] - Validation options
 * @returns {BPMNValidationResult[]} Validation results
 *
 * @example
 * ```typescript
 * const results = validateBPMNProcess(process);
 * // Result: Array of validation results
 * ```
 */
export declare const validateBPMNProcess: (process: BPMNProcess, options?: Record<string, any>) => BPMNValidationResult[];
/**
 * Validates a BPMN element.
 *
 * @param {BPMNFlowElement} element - BPMN element
 * @returns {BPMNValidationResult[]} Validation results
 *
 * @example
 * ```typescript
 * const results = validateBPMNElement(taskElement);
 * // Result: [{ severity: 'error', message: '...', ... }]
 * ```
 */
export declare const validateBPMNElement: (element: BPMNFlowElement) => BPMNValidationResult[];
/**
 * Validates BPMN sequence flows.
 *
 * @param {BPMNSequenceFlow[]} flows - Sequence flows
 * @param {BPMNFlowElement[]} elements - All flow elements
 * @returns {BPMNValidationResult[]} Validation results
 *
 * @example
 * ```typescript
 * const results = validateSequenceFlows(flows, allElements);
 * // Result: Validation results for all flows
 * ```
 */
export declare const validateSequenceFlows: (flows: BPMNSequenceFlow[], elements: BPMNFlowElement[]) => BPMNValidationResult[];
/**
 * Validates BPMN gateway semantics.
 *
 * @param {BPMNGateway} gateway - BPMN gateway
 * @param {BPMNSequenceFlow[]} flows - Related sequence flows
 * @returns {BPMNValidationResult[]} Validation results
 *
 * @example
 * ```typescript
 * const results = validateGateway(exclusiveGateway, sequenceFlows);
 * // Result: Gateway-specific validation results
 * ```
 */
export declare const validateGateway: (gateway: BPMNGateway, flows: BPMNSequenceFlow[]) => BPMNValidationResult[];
/**
 * Validates BPMN event definitions.
 *
 * @param {BPMNEvent} event - BPMN event
 * @returns {BPMNValidationResult[]} Validation results
 *
 * @example
 * ```typescript
 * const results = validateEvent(startEvent);
 * // Result: Event-specific validation results
 * ```
 */
export declare const validateEvent: (event: BPMNEvent) => BPMNValidationResult[];
/**
 * Extracts all tasks from BPMN process.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNTask[]} All tasks
 *
 * @example
 * ```typescript
 * const tasks = extractTasks(process);
 * // Result: [{ id: 'Task_1', type: 'userTask', ... }, ...]
 * ```
 */
export declare const extractTasks: (process: BPMNProcess) => BPMNTask[];
/**
 * Extracts all gateways from BPMN process.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNGateway[]} All gateways
 *
 * @example
 * ```typescript
 * const gateways = extractGateways(process);
 * // Result: [{ id: 'Gateway_1', type: 'exclusiveGateway', ... }, ...]
 * ```
 */
export declare const extractGateways: (process: BPMNProcess) => BPMNGateway[];
/**
 * Extracts all events from BPMN process.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNEvent[]} All events
 *
 * @example
 * ```typescript
 * const events = extractEvents(process);
 * // Result: [{ id: 'StartEvent_1', type: 'startEvent', ... }, ...]
 * ```
 */
export declare const extractEvents: (process: BPMNProcess) => BPMNEvent[];
/**
 * Extracts all start events from process.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNStartEvent[]} Start events
 *
 * @example
 * ```typescript
 * const startEvents = extractStartEvents(process);
 * // Result: [{ id: 'StartEvent_1', eventDefinitions: [...] }]
 * ```
 */
export declare const extractStartEvents: (process: BPMNProcess) => BPMNStartEvent[];
/**
 * Extracts all end events from process.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNEndEvent[]} End events
 *
 * @example
 * ```typescript
 * const endEvents = extractEndEvents(process);
 * // Result: [{ id: 'EndEvent_1', eventDefinitions: [...] }]
 * ```
 */
export declare const extractEndEvents: (process: BPMNProcess) => BPMNEndEvent[];
/**
 * Extracts all boundary events from process.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNBoundaryEvent[]} Boundary events
 *
 * @example
 * ```typescript
 * const boundaryEvents = extractBoundaryEvents(process);
 * // Result: [{ id: 'BoundaryEvent_1', attachedToRef: 'Task_1', ... }]
 * ```
 */
export declare const extractBoundaryEvents: (process: BPMNProcess) => BPMNBoundaryEvent[];
/**
 * Extracts all subprocesses from process.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNSubProcess[]} Subprocesses
 *
 * @example
 * ```typescript
 * const subprocesses = extractSubProcesses(process);
 * // Result: [{ id: 'SubProcess_1', flowElements: [...], ... }]
 * ```
 */
export declare const extractSubProcesses: (process: BPMNProcess) => BPMNSubProcess[];
/**
 * Extracts sequence flows from process.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNSequenceFlow[]} Sequence flows
 *
 * @example
 * ```typescript
 * const flows = extractSequenceFlows(process);
 * // Result: [{ id: 'Flow_1', sourceRef: 'Task_1', targetRef: 'Task_2' }]
 * ```
 */
export declare const extractSequenceFlows: (process: BPMNProcess) => BPMNSequenceFlow[];
/**
 * Extracts data objects from process.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNDataObject[]} Data objects
 *
 * @example
 * ```typescript
 * const dataObjects = extractDataObjects(process);
 * // Result: [{ id: 'DataObject_1', name: 'Invoice', ... }]
 * ```
 */
export declare const extractDataObjects: (process: BPMNProcess) => BPMNDataObject[];
/**
 * Analyzes flow paths from start to end events.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNFlowPath[]} All possible flow paths
 *
 * @example
 * ```typescript
 * const paths = analyzeFlowPaths(process);
 * // Result: [{ elements: ['Start', 'Task1', 'End'], conditions: [...] }]
 * ```
 */
export declare const analyzeFlowPaths: (process: BPMNProcess) => BPMNFlowPath[];
/**
 * Detects cycles in process flow.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {string[][]} Detected cycles (element IDs)
 *
 * @example
 * ```typescript
 * const cycles = detectCycles(process);
 * // Result: [['Task_1', 'Gateway_1', 'Task_2', 'Task_1']]
 * ```
 */
export declare const detectCycles: (process: BPMNProcess) => string[][];
/**
 * Finds all paths between two elements.
 *
 * @param {string} sourceId - Source element ID
 * @param {string} targetId - Target element ID
 * @param {BPMNProcess} process - BPMN process
 * @returns {string[][]} All paths (element IDs)
 *
 * @example
 * ```typescript
 * const paths = findPathsBetween('Task_1', 'Task_5', process);
 * // Result: [['Task_1', 'Gateway_1', 'Task_3', 'Task_5'], ...]
 * ```
 */
export declare const findPathsBetween: (sourceId: string, targetId: string, process: BPMNProcess) => string[][];
/**
 * Calculates process complexity metric.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {number} Complexity score
 *
 * @example
 * ```typescript
 * const complexity = calculateComplexity(process);
 * // Result: 42 (McCabe cyclomatic complexity)
 * ```
 */
export declare const calculateComplexity: (process: BPMNProcess) => number;
/**
 * Identifies unreachable elements in process.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {string[]} Unreachable element IDs
 *
 * @example
 * ```typescript
 * const unreachable = findUnreachableElements(process);
 * // Result: ['Task_7', 'Gateway_3']
 * ```
 */
export declare const findUnreachableElements: (process: BPMNProcess) => string[];
/**
 * Validates BPMN process structure for correctness.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNValidationResult[]} Structure validation results
 *
 * @example
 * ```typescript
 * const results = validateProcessStructure(process);
 * // Result: [{ severity: 'error', message: 'Missing start event' }]
 * ```
 */
export declare const validateProcessStructure: (process: BPMNProcess) => BPMNValidationResult[];
/**
 * Validates lane assignments in process.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNValidationResult[]} Lane validation results
 *
 * @example
 * ```typescript
 * const results = validateLanes(process);
 * // Result: Validation results for lane structure
 * ```
 */
export declare const validateLanes: (process: BPMNProcess) => BPMNValidationResult[];
/**
 * Validates message flows in collaboration.
 *
 * @param {BPMNCollaboration} collaboration - BPMN collaboration
 * @returns {BPMNValidationResult[]} Message flow validation results
 *
 * @example
 * ```typescript
 * const results = validateMessageFlows(collaboration);
 * // Result: Validation results for message flows
 * ```
 */
export declare const validateMessageFlows: (collaboration: BPMNCollaboration) => BPMNValidationResult[];
/**
 * Extracts comprehensive metadata from BPMN document.
 *
 * @param {BPMNDocument} document - BPMN document
 * @returns {BPMNMetadata} Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = extractBPMNMetadata(document);
 * // Result: { processCount: 3, taskCount: 25, complexity: 42, ... }
 * ```
 */
export declare const extractBPMNMetadata: (document: BPMNDocument) => BPMNMetadata;
/**
 * Generates element statistics for document.
 *
 * @param {BPMNDocument} document - BPMN document
 * @returns {BPMNElementStatistics[]} Element statistics
 *
 * @example
 * ```typescript
 * const stats = generateElementStatistics(document);
 * // Result: [{ elementType: 'userTask', count: 15, percentage: 30 }, ...]
 * ```
 */
export declare const generateElementStatistics: (document: BPMNDocument) => BPMNElementStatistics[];
/**
 * Extracts process documentation.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {Record<string, string>} Element documentation
 *
 * @example
 * ```typescript
 * const docs = extractProcessDocumentation(process);
 * // Result: { 'Task_1': 'Review approval request', ... }
 * ```
 */
export declare const extractProcessDocumentation: (process: BPMNProcess) => Record<string, string>;
/**
 * Simplifies BPMN process by removing empty elements.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNProcess} Simplified process
 *
 * @example
 * ```typescript
 * const simplified = simplifyBPMNProcess(process);
 * // Result: Process with unnecessary elements removed
 * ```
 */
export declare const simplifyBPMNProcess: (process: BPMNProcess) => BPMNProcess;
/**
 * Merges multiple BPMN processes into one.
 *
 * @param {BPMNProcess[]} processes - Processes to merge
 * @param {string} mergedProcessId - New process ID
 * @returns {BPMNProcess} Merged process
 *
 * @example
 * ```typescript
 * const merged = mergeBPMNProcesses([process1, process2], 'merged-process');
 * // Result: Single process containing all elements
 * ```
 */
export declare const mergeBPMNProcesses: (processes: BPMNProcess[], mergedProcessId: string) => BPMNProcess;
/**
 * Clones a BPMN element with new ID.
 *
 * @param {BPMNFlowElement} element - Element to clone
 * @param {string} newId - New element ID
 * @returns {BPMNFlowElement} Cloned element
 *
 * @example
 * ```typescript
 * const cloned = cloneBPMNElement(taskElement, 'Task_Copy_1');
 * // Result: New element with same properties but different ID
 * ```
 */
export declare const cloneBPMNElement: (element: BPMNFlowElement, newId: string) => BPMNFlowElement;
/**
 * Extracts diagram information from BPMN document.
 *
 * @param {BPMNDocument} document - BPMN document
 * @returns {BPMNDiagram[]} All diagrams
 *
 * @example
 * ```typescript
 * const diagrams = extractDiagrams(document);
 * // Result: [{ id: 'Diagram_1', plane: {...}, ... }]
 * ```
 */
export declare const extractDiagrams: (document: BPMNDocument) => BPMNDiagram[];
/**
 * Gets element position from diagram.
 *
 * @param {string} elementId - Element ID
 * @param {BPMNDiagram} diagram - BPMN diagram
 * @returns {BPMNBounds | undefined} Element bounds
 *
 * @example
 * ```typescript
 * const bounds = getElementPosition('Task_1', diagram);
 * // Result: { x: 100, y: 150, width: 100, height: 80 }
 * ```
 */
export declare const getElementPosition: (elementId: string, diagram: BPMNDiagram) => BPMNBounds | undefined;
/**
 * Validates diagram completeness.
 *
 * @param {BPMNDiagram} diagram - BPMN diagram
 * @param {BPMNProcess} process - Related process
 * @returns {BPMNValidationResult[]} Validation results
 *
 * @example
 * ```typescript
 * const results = validateDiagram(diagram, process);
 * // Result: [{ severity: 'warning', message: 'Element Task_1 has no shape' }]
 * ```
 */
export declare const validateDiagram: (diagram: BPMNDiagram, process: BPMNProcess) => BPMNValidationResult[];
/**
 * Generates BPMN documentation in markdown format.
 *
 * @param {BPMNDocument} document - BPMN document
 * @returns {string} Markdown documentation
 *
 * @example
 * ```typescript
 * const markdown = generateBPMNDocumentation(document);
 * // Result: "# Process Documentation\n## Overview\n..."
 * ```
 */
export declare const generateBPMNDocumentation: (document: BPMNDocument) => string;
/**
 * Exports BPMN process to simplified JSON format.
 *
 * @param {BPMNProcess} process - BPMN process
 * @returns {any} Simplified JSON
 *
 * @example
 * ```typescript
 * const json = exportProcessToJson(process);
 * // Result: { id: '...', tasks: [...], flows: [...] }
 * ```
 */
export declare const exportProcessToJson: (process: BPMNProcess) => any;
/**
 * Compares two BPMN processes for differences.
 *
 * @param {BPMNProcess} process1 - First process
 * @param {BPMNProcess} process2 - Second process
 * @returns {Record<string, any>} Differences
 *
 * @example
 * ```typescript
 * const diff = compareBPMNProcesses(v1Process, v2Process);
 * // Result: { added: [...], removed: [...], modified: [...] }
 * ```
 */
export declare const compareBPMNProcesses: (process1: BPMNProcess, process2: BPMNProcess) => Record<string, any>;
/**
 * Validates BPMN against schema specification.
 *
 * @param {BPMNDocument} document - BPMN document
 * @param {string} schemaVersion - BPMN schema version
 * @returns {BPMNValidationResult[]} Schema validation results
 *
 * @example
 * ```typescript
 * const results = validateBPMNSchema(document, '2.0');
 * // Result: [{ severity: 'error', message: 'Invalid namespace' }]
 * ```
 */
export declare const validateBPMNSchema: (document: BPMNDocument, schemaVersion?: string) => BPMNValidationResult[];
/**
 * Gets BPMN element by ID.
 *
 * @param {string} elementId - Element ID
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNFlowElement | undefined} Found element
 *
 * @example
 * ```typescript
 * const element = getElementById('Task_1', process);
 * // Result: { id: 'Task_1', type: 'userTask', name: 'Review', ... }
 * ```
 */
export declare const getElementById: (elementId: string, process: BPMNProcess) => BPMNFlowElement | undefined;
/**
 * Gets elements by type.
 *
 * @param {BPMNElementType} type - Element type
 * @param {BPMNProcess} process - BPMN process
 * @returns {BPMNFlowElement[]} Matching elements
 *
 * @example
 * ```typescript
 * const userTasks = getElementsByType(BPMNElementType.USER_TASK, process);
 * // Result: [{ id: 'Task_1', type: 'userTask', ... }, ...]
 * ```
 */
export declare const getElementsByType: (type: BPMNElementType, process: BPMNProcess) => BPMNFlowElement[];
//# sourceMappingURL=workflow-bpmn-parser.d.ts.map
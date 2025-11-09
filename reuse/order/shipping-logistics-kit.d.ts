/**
 * LOC: WC-ORD-SHPLGS-001
 * File: /reuse/order/shipping-logistics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Order management modules
 *   - Fulfillment services
 *   - Warehouse management systems
 *   - Inventory tracking services
 */
import { HttpService } from '@nestjs/axios';
/**
 * Supported shipping carriers
 */
export declare enum ShippingCarrier {
    FEDEX = "fedex",
    UPS = "ups",
    USPS = "usps",
    DHL = "dhl",
    CANADA_POST = "canada_post",
    CUSTOM = "custom"
}
/**
 * Shipping service levels
 */
export declare enum ShippingService {
    SAME_DAY = "same_day",
    OVERNIGHT = "overnight",
    TWO_DAY = "two_day",
    THREE_DAY = "three_day",
    GROUND = "ground",
    ECONOMY = "economy",
    FREIGHT = "freight",
    INTERNATIONAL_EXPRESS = "international_express",
    INTERNATIONAL_STANDARD = "international_standard"
}
/**
 * Package types
 */
export declare enum PackageType {
    LETTER = "letter",
    ENVELOPE = "envelope",
    SMALL_BOX = "small_box",
    MEDIUM_BOX = "medium_box",
    LARGE_BOX = "large_box",
    EXTRA_LARGE_BOX = "extra_large_box",
    TUBE = "tube",
    PALLET = "pallet",
    CUSTOM = "custom"
}
/**
 * Shipment status
 */
export declare enum ShipmentStatus {
    LABEL_CREATED = "label_created",
    PICKED_UP = "picked_up",
    IN_TRANSIT = "in_transit",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered",
    ATTEMPTED_DELIVERY = "attempted_delivery",
    RETURNED = "returned",
    CANCELLED = "cancelled",
    EXCEPTION = "exception",
    LOST = "lost"
}
/**
 * Freight class for LTL/FTL shipments
 */
export declare enum FreightClass {
    CLASS_50 = "50",
    CLASS_55 = "55",
    CLASS_60 = "60",
    CLASS_65 = "65",
    CLASS_70 = "70",
    CLASS_77_5 = "77.5",
    CLASS_85 = "85",
    CLASS_92_5 = "92.5",
    CLASS_100 = "100",
    CLASS_110 = "110",
    CLASS_125 = "125",
    CLASS_150 = "150",
    CLASS_175 = "175",
    CLASS_200 = "200",
    CLASS_250 = "250",
    CLASS_300 = "300",
    CLASS_400 = "400",
    CLASS_500 = "500"
}
/**
 * Hazmat classification
 */
export declare enum HazmatClass {
    CLASS_1 = "1",// Explosives
    CLASS_2 = "2",// Gases
    CLASS_3 = "3",// Flammable liquids
    CLASS_4 = "4",// Flammable solids
    CLASS_5 = "5",// Oxidizing substances
    CLASS_6 = "6",// Toxic substances
    CLASS_7 = "7",// Radioactive materials
    CLASS_8 = "8",// Corrosive substances
    CLASS_9 = "9"
}
/**
 * Signature requirements
 */
export declare enum SignatureType {
    NONE = "none",
    STANDARD = "standard",
    ADULT_SIGNATURE = "adult_signature",
    DIRECT_SIGNATURE = "direct_signature",
    INDIRECT_SIGNATURE = "indirect_signature"
}
/**
 * Address interface
 */
export interface Address {
    name: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    phone?: string;
    email?: string;
    isResidential?: boolean;
}
/**
 * Package dimensions
 */
export interface PackageDimensions {
    length: number;
    width: number;
    height: number;
    weight: number;
    dimensionalWeight?: number;
}
/**
 * Package item for customs
 */
export interface PackageItem {
    description: string;
    quantity: number;
    value: number;
    weight: number;
    countryOfOrigin: string;
    hsCode?: string;
    skuNumber?: string;
}
/**
 * Shipping rate quote
 */
export interface ShippingRate {
    carrier: ShippingCarrier;
    service: ShippingService;
    rate: number;
    currency: string;
    estimatedDays: number;
    rateId: string;
    carrierAccountId?: string;
    surcharges?: RateSurcharge[];
    totalCharge: number;
}
/**
 * Rate surcharge details
 */
export interface RateSurcharge {
    type: string;
    description: string;
    amount: number;
}
/**
 * Shipping label
 */
export interface ShippingLabel {
    labelId: string;
    trackingNumber: string;
    carrier: ShippingCarrier;
    service: ShippingService;
    labelFormat: 'PDF' | 'PNG' | 'ZPL';
    labelData: string;
    labelUrl?: string;
    postage: number;
    createdAt: Date;
}
/**
 * Tracking event
 */
export interface TrackingEvent {
    status: ShipmentStatus;
    timestamp: Date;
    location: string;
    description: string;
    carrierStatusCode?: string;
    exceptionType?: string;
}
/**
 * Tracking information
 */
export interface TrackingInfo {
    trackingNumber: string;
    carrier: ShippingCarrier;
    status: ShipmentStatus;
    estimatedDeliveryDate?: Date;
    actualDeliveryDate?: Date;
    events: TrackingEvent[];
    proofOfDelivery?: ProofOfDelivery;
    currentLocation?: string;
}
/**
 * Proof of delivery
 */
export interface ProofOfDelivery {
    signedBy: string;
    deliveryDate: Date;
    signatureImageUrl?: string;
    deliveryLocation?: string;
    deliveryNotes?: string;
}
/**
 * Customs declaration
 */
export interface CustomsDeclaration {
    contentType: 'merchandise' | 'documents' | 'gift' | 'returned_goods' | 'sample';
    contentDescription: string;
    items: PackageItem[];
    invoiceNumber?: string;
    certificateNumber?: string;
    licenseNumber?: string;
    nonDeliveryOption: 'return' | 'abandon';
    customsValue: number;
    currency: string;
    dutiesPaid: boolean;
}
/**
 * Hazmat declaration
 */
export interface HazmatDeclaration {
    class: HazmatClass;
    unNumber: string;
    properShippingName: string;
    packingGroup?: 'I' | 'II' | 'III';
    quantity: number;
    unit: string;
    emergencyContactPhone: string;
    isLimitedQuantity: boolean;
}
/**
 * Insurance details
 */
export interface ShipmentInsurance {
    provider: string;
    amount: number;
    currency: string;
    premium: number;
    policyNumber?: string;
}
/**
 * Freight shipment details
 */
export interface FreightShipment {
    freightClass: FreightClass;
    nmfcCode?: string;
    isStackable: boolean;
    handlingUnits: number;
    totalWeight: number;
    totalPallets?: number;
    dimensions: PackageDimensions[];
    pickupDate?: Date;
    deliveryDate?: Date;
    specialInstructions?: string;
}
/**
 * Shipment request
 */
export interface ShipmentRequest {
    shipper: Address;
    recipient: Address;
    packages: (PackageDimensions & {
        packageType: PackageType;
    })[];
    carrier: ShippingCarrier;
    service: ShippingService;
    signatureType?: SignatureType;
    insurance?: ShipmentInsurance;
    referenceNumbers?: string[];
    specialInstructions?: string;
    saturdayDelivery?: boolean;
    holdAtLocation?: boolean;
    customs?: CustomsDeclaration;
    hazmat?: HazmatDeclaration;
}
/**
 * Carrier configuration
 */
export interface CarrierConfig {
    carrier: ShippingCarrier;
    enabled: boolean;
    credentials: {
        accountNumber?: string;
        apiKey?: string;
        apiSecret?: string;
        meterNumber?: string;
        accessToken?: string;
    };
    apiEndpoint: string;
    testMode: boolean;
}
export declare const SHIPPING_CONFIG = "SHIPPING_CONFIG";
export declare const CARRIER_CONFIGS = "CARRIER_CONFIGS";
export declare const RATE_CALCULATOR = "RATE_CALCULATOR";
export declare const LABEL_GENERATOR = "LABEL_GENERATOR";
export declare const TRACKING_SERVICE = "TRACKING_SERVICE";
export interface ShippingConfig {
    defaultCarrier: ShippingCarrier;
    enableRateComparison: boolean;
    defaultInsuranceProvider: string;
    maxPackageWeight: number;
    maxPackageDimensions: {
        length: number;
        width: number;
        height: number;
    };
    freightThresholdWeight: number;
    requireSignatureForValueOver: number;
    autoSelectCheapestRate: boolean;
    labelFormat: 'PDF' | 'PNG' | 'ZPL';
    trackingWebhookUrl?: string;
}
/**
 * 1. Factory provider for multi-carrier integration service.
 * Creates carrier clients based on configuration.
 */
export declare const CARRIER_SERVICE_PROVIDER: {
    provide: string;
    useFactory: (httpService: HttpService, configs: CarrierConfig[]) => CarrierIntegrationService;
    inject: any[];
};
export declare class CarrierIntegrationService {
    private readonly httpService;
    private readonly carrierConfigs;
    private readonly logger;
    private carrierClients;
    constructor(httpService: HttpService, carrierConfigs: CarrierConfig[]);
    private initializeCarriers;
    private createCarrierClient;
    getCarrierClient(carrier: ShippingCarrier): any;
    isCarrierEnabled(carrier: ShippingCarrier): boolean;
}
/**
 * 2. Calculates shipping rates from multiple carriers.
 * Request-scoped for per-request caching.
 */
export declare class ShippingRateCalculator {
    private readonly carrierService;
    private readonly httpService;
    private readonly logger;
    private rateCache;
    constructor(carrierService: CarrierIntegrationService, httpService: HttpService);
    calculateRates(shipper: Address, recipient: Address, packages: (PackageDimensions & {
        packageType: PackageType;
    })[], carriers?: ShippingCarrier[]): Promise<ShippingRate[]>;
    private generateCacheKey;
    private fetchCarrierRates;
    private getMockRates;
}
/**
 * 3. Gets shipping rates for all available carriers.
 */
export declare function getAllCarrierRates(rateCalculator: ShippingRateCalculator, shipper: Address, recipient: Address, packages: (PackageDimensions & {
    packageType: PackageType;
})[]): Promise<ShippingRate[]>;
/**
 * 4. Finds the cheapest shipping rate from available options.
 */
export declare function findCheapestRate(rates: ShippingRate[]): ShippingRate;
/**
 * 5. Finds the fastest shipping option within budget.
 */
export declare function findFastestRateWithinBudget(rates: ShippingRate[], maxBudget: number): ShippingRate;
/**
 * 6. Compares rates across carriers for the same service level.
 */
export declare function compareRatesByService(rates: ShippingRate[], service: ShippingService): ShippingRate[];
/**
 * 7. Calculates dimensional weight for package pricing.
 */
export declare function calculateDimensionalWeight(dimensions: PackageDimensions, dimDivisor?: number): number;
/**
 * 8. Determines billable weight (actual vs dimensional).
 */
export declare function determineBillableWeight(dimensions: PackageDimensions): number;
/**
 * 9. Applies discount to shipping rate based on volume.
 */
export declare function applyVolumeDiscount(baseRate: number, shipmentCount: number, discountTiers: {
    threshold: number;
    discount: number;
}[]): number;
/**
 * 10. Calculates estimated delivery date based on service level.
 */
export declare function calculateEstimatedDeliveryDate(shipDate: Date, estimatedDays: number, excludeWeekends?: boolean): Date;
/**
 * 11. Async provider for label generation service.
 * Initializes connections to carrier label APIs.
 */
export declare const LABEL_GENERATOR_PROVIDER: {
    provide: string;
    useFactory: (httpService: HttpService, carrierService: CarrierIntegrationService) => Promise<LabelGeneratorService>;
    inject: any[];
};
export declare class LabelGeneratorService {
    private readonly httpService;
    private readonly carrierService;
    private readonly logger;
    private isInitialized;
    constructor(httpService: HttpService, carrierService: CarrierIntegrationService);
    initialize(): Promise<void>;
    generateLabel(shipmentRequest: ShipmentRequest): Promise<ShippingLabel>;
    private callCarrierLabelAPI;
    private generateTrackingNumber;
}
/**
 * 12. Generates a shipping label for a shipment.
 */
export declare function createShippingLabel(labelGenerator: LabelGeneratorService, shipmentRequest: ShipmentRequest): Promise<ShippingLabel>;
/**
 * 13. Generates batch labels for multiple shipments.
 */
export declare function generateBatchLabels(labelGenerator: LabelGeneratorService, shipments: ShipmentRequest[]): Promise<ShippingLabel[]>;
/**
 * 14. Converts label format (PDF to ZPL for thermal printers).
 */
export declare function convertLabelFormat(label: ShippingLabel, targetFormat: 'PDF' | 'PNG' | 'ZPL'): ShippingLabel;
/**
 * 15. Validates label data before printing.
 */
export declare function validateLabel(label: ShippingLabel): boolean;
/**
 * 16. Generates return label for a shipment.
 */
export declare function createReturnLabel(labelGenerator: LabelGeneratorService, originalShipment: ShipmentRequest): Promise<ShippingLabel>;
/**
 * 17. Retrieves label by tracking number.
 */
export declare function getLabelByTracking(trackingNumber: string, labelStorage: Map<string, ShippingLabel>): Promise<ShippingLabel>;
/**
 * 18. Voids a shipping label before pickup.
 */
export declare function voidLabel(trackingNumber: string, carrier: ShippingCarrier): Promise<{
    success: boolean;
    refundAmount?: number;
}>;
/**
 * 19. Reprints an existing label.
 */
export declare function reprintLabel(trackingNumber: string, labelStorage: Map<string, ShippingLabel>): Promise<ShippingLabel>;
/**
 * 20. Generates international shipping label with customs forms.
 */
export declare function createInternationalLabel(labelGenerator: LabelGeneratorService, shipmentRequest: ShipmentRequest, customsDeclaration: CustomsDeclaration): Promise<ShippingLabel>;
/**
 * 21. Tracking service for real-time shipment monitoring.
 */
export declare class TrackingService {
    private readonly carrierService;
    private readonly httpService;
    private readonly logger;
    private trackingCache;
    constructor(carrierService: CarrierIntegrationService, httpService: HttpService);
    getTrackingInfo(trackingNumber: string, carrier?: ShippingCarrier): Promise<TrackingInfo>;
    private fetchTrackingFromCarrier;
    trackMultipleShipments(trackingNumbers: string[]): Promise<TrackingInfo[]>;
}
/**
 * 22. Gets current status of a shipment.
 */
export declare function getShipmentStatus(trackingService: TrackingService, trackingNumber: string): Promise<ShipmentStatus>;
/**
 * 23. Gets estimated delivery date for a shipment.
 */
export declare function getEstimatedDelivery(trackingService: TrackingService, trackingNumber: string): Promise<Date | null>;
/**
 * 24. Checks if shipment is delayed.
 */
export declare function isShipmentDelayed(trackingService: TrackingService, trackingNumber: string, originalEstimatedDate: Date): Promise<boolean>;
/**
 * 25. Gets all tracking events for a shipment.
 */
export declare function getTrackingHistory(trackingService: TrackingService, trackingNumber: string): Promise<TrackingEvent[]>;
/**
 * 26. Notifies when shipment status changes.
 */
export declare function createTrackingWebhook(webhookUrl: string, trackingNumbers: string[]): {
    webhookId: string;
    trackingNumbers: string[];
};
/**
 * 27. Checks if shipment is out for delivery.
 */
export declare function isOutForDelivery(trackingService: TrackingService, trackingNumber: string): Promise<boolean>;
/**
 * 28. Gets proof of delivery information.
 */
export declare function getProofOfDelivery(trackingService: TrackingService, trackingNumber: string): Promise<ProofOfDelivery | null>;
/**
 * 29. Calculates freight class based on density.
 */
export declare function calculateFreightClass(weight: number, // in pounds
dimensions: PackageDimensions): FreightClass;
/**
 * 30. Determines if shipment qualifies for LTL vs FTL.
 */
export declare function determineFreightType(totalWeight: number, palletCount: number): 'LTL' | 'FTL' | 'PARCEL';
/**
 * 31. Calculates LTL freight quote.
 */
export declare function calculateLTLQuote(freightShipment: FreightShipment, originZip: string, destZip: string): {
    baseRate: number;
    surcharges: RateSurcharge[];
    totalCost: number;
};
/**
 * 32. Optimizes pallet configuration for freight.
 */
export declare function optimizePalletConfiguration(packages: PackageDimensions[], palletSize: {
    length: number;
    width: number;
    maxHeight: number;
}): {
    pallets: PackageDimensions[][];
    totalPallets: number;
};
/**
 * 33. Schedules freight pickup with carrier.
 */
export declare function scheduleFreightPickup(carrier: ShippingCarrier, pickupDate: Date, location: Address, freightDetails: FreightShipment): Promise<{
    confirmationNumber: string;
    pickupWindow: {
        start: Date;
        end: Date;
    };
}>;
/**
 * 34. Validates customs declaration for international shipment.
 */
export declare function validateCustomsDeclaration(customs: CustomsDeclaration): boolean;
/**
 * 35. Calculates estimated duties and taxes for international shipment.
 */
export declare function calculateDutiesAndTaxes(customs: CustomsDeclaration, destinationCountry: string): {
    duties: number;
    taxes: number;
    total: number;
};
/**
 * 36. Generates commercial invoice for international shipment.
 */
export declare function generateCommercialInvoice(shipper: Address, recipient: Address, customs: CustomsDeclaration): {
    invoiceNumber: string;
    invoiceDate: Date;
    shipper: Address;
    recipient: Address;
    items: PackageItem[];
    totalValue: number;
    currency: string;
};
/**
 * 37. Checks if destination country requires specific export documentation.
 */
export declare function getRequiredExportDocuments(destinationCountry: string, itemCategories: string[]): string[];
/**
 * 38. Validates hazmat declaration for shipping compliance.
 */
export declare function validateHazmatDeclaration(hazmat: HazmatDeclaration): boolean;
/**
 * 39. Checks if carrier accepts specific hazmat class.
 */
export declare function isHazmatAcceptedByCarrier(carrier: ShippingCarrier, hazmatClass: HazmatClass): boolean;
/**
 * 40. Calculates additional hazmat shipping surcharge.
 */
export declare function calculateHazmatSurcharge(baseRate: number, hazmatClass: HazmatClass, isLimitedQuantity: boolean): number;
/**
 * 41. Determines required signature type based on shipment value.
 */
export declare function determineSignatureRequirement(shipmentValue: number, recipientType: 'residential' | 'commercial', itemCategories: string[]): SignatureType;
/**
 * 42. Calculates insurance premium for shipment.
 */
export declare function calculateInsurancePremium(declaredValue: number, carrier: ShippingCarrier, itemCategories: string[]): number;
/**
 * 43. Processes insurance claim for lost or damaged shipment.
 */
export declare function fileInsuranceClaim(trackingNumber: string, insurance: ShipmentInsurance, claimAmount: number, claimType: 'loss' | 'damage', evidence: {
    photos?: string[];
    description: string;
    estimatedRepairCost?: number;
}): Promise<{
    claimNumber: string;
    status: 'submitted' | 'under_review' | 'approved' | 'denied';
    expectedResolutionDate: Date;
}>;
export declare const DEFAULT_SHIPPING_CONFIG: ShippingConfig;
export declare const SHIPPING_CONFIG_PROVIDER: {
    provide: string;
    useValue: ShippingConfig;
};
declare const _default: {
    CarrierIntegrationService: typeof CarrierIntegrationService;
    ShippingRateCalculator: typeof ShippingRateCalculator;
    LabelGeneratorService: typeof LabelGeneratorService;
    TrackingService: typeof TrackingService;
    CARRIER_SERVICE_PROVIDER: {
        provide: string;
        useFactory: (httpService: HttpService, configs: CarrierConfig[]) => CarrierIntegrationService;
        inject: any[];
    };
    LABEL_GENERATOR_PROVIDER: {
        provide: string;
        useFactory: (httpService: HttpService, carrierService: CarrierIntegrationService) => Promise<LabelGeneratorService>;
        inject: any[];
    };
    SHIPPING_CONFIG_PROVIDER: {
        provide: string;
        useValue: ShippingConfig;
    };
    getAllCarrierRates: typeof getAllCarrierRates;
    findCheapestRate: typeof findCheapestRate;
    findFastestRateWithinBudget: typeof findFastestRateWithinBudget;
    compareRatesByService: typeof compareRatesByService;
    calculateDimensionalWeight: typeof calculateDimensionalWeight;
    determineBillableWeight: typeof determineBillableWeight;
    applyVolumeDiscount: typeof applyVolumeDiscount;
    calculateEstimatedDeliveryDate: typeof calculateEstimatedDeliveryDate;
    createShippingLabel: typeof createShippingLabel;
    generateBatchLabels: typeof generateBatchLabels;
    convertLabelFormat: typeof convertLabelFormat;
    validateLabel: typeof validateLabel;
    createReturnLabel: typeof createReturnLabel;
    getLabelByTracking: typeof getLabelByTracking;
    voidLabel: typeof voidLabel;
    reprintLabel: typeof reprintLabel;
    createInternationalLabel: typeof createInternationalLabel;
    getShipmentStatus: typeof getShipmentStatus;
    getEstimatedDelivery: typeof getEstimatedDelivery;
    isShipmentDelayed: typeof isShipmentDelayed;
    getTrackingHistory: typeof getTrackingHistory;
    createTrackingWebhook: typeof createTrackingWebhook;
    isOutForDelivery: typeof isOutForDelivery;
    getProofOfDelivery: typeof getProofOfDelivery;
    calculateFreightClass: typeof calculateFreightClass;
    determineFreightType: typeof determineFreightType;
    calculateLTLQuote: typeof calculateLTLQuote;
    optimizePalletConfiguration: typeof optimizePalletConfiguration;
    scheduleFreightPickup: typeof scheduleFreightPickup;
    validateCustomsDeclaration: typeof validateCustomsDeclaration;
    calculateDutiesAndTaxes: typeof calculateDutiesAndTaxes;
    generateCommercialInvoice: typeof generateCommercialInvoice;
    getRequiredExportDocuments: typeof getRequiredExportDocuments;
    validateHazmatDeclaration: typeof validateHazmatDeclaration;
    isHazmatAcceptedByCarrier: typeof isHazmatAcceptedByCarrier;
    calculateHazmatSurcharge: typeof calculateHazmatSurcharge;
    determineSignatureRequirement: typeof determineSignatureRequirement;
    calculateInsurancePremium: typeof calculateInsurancePremium;
    fileInsuranceClaim: typeof fileInsuranceClaim;
};
export default _default;
//# sourceMappingURL=shipping-logistics-kit.d.ts.map
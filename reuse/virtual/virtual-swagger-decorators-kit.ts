/**
 * LOC: VIRTSWAG001
 * File: /reuse/virtual/virtual-swagger-decorators-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Virtual infrastructure API controllers
 *   - VMware vRealize API decorators
 *   - DTO validation and documentation
 */

/**
 * File: /reuse/virtual/virtual-swagger-decorators-kit.ts
 * Locator: WC-UTL-VIRTSWAG-001
 * Purpose: Reusable Swagger Decorator Factories for Virtual Infrastructure APIs - Custom decorators, validators, security schemes
 *
 * Upstream: Independent utility module for Swagger decorator composition
 * Downstream: ../backend/*, Virtual infrastructure controllers, VMware vRealize APIs, API DTOs, validation pipes
 * Dependencies: TypeScript 5.x, @nestjs/swagger 7.x, @nestjs/common 10.x, class-validator 0.14.x, Node 18+
 * Exports: 39 decorator factory functions for Swagger documentation, custom validators, security definitions, rate limiting
 *
 * LLM Context: Enterprise-grade Swagger decorator utilities for virtual infrastructure APIs compatible with VMware vSphere,
 * vRealize, and hypervisor management systems. Provides decorator composition, custom validators, security scheme decorators,
 * rate limiting documentation, API versioning decorators, and VMware-compatible response decorators essential for production
 * API documentation and validation.
 */

import { applyDecorators, Type, SetMetadata } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiParam,
  ApiQuery,
  ApiHeader,
  ApiSecurity,
  ApiBearerAuth,
  ApiBasicAuth,
  ApiOAuth2,
  ApiCookieAuth,
  ApiExtraModels,
  getSchemaPath,
  ApiPropertyOptions,
  ApiOperationOptions,
  ApiResponseOptions,
} from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsEnum,
  IsUUID,
  IsOptional,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  IsDate,
  IsIP,
  IsMACAddress,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface VirtualResourceDecorators {
  operation: MethodDecorator;
  responses: MethodDecorator;
  security: MethodDecorator;
}

interface SwaggerDecoratorOptions {
  tags?: string[];
  summary?: string;
  description?: string;
  deprecated?: boolean;
  security?: Array<Record<string, string[]>>;
}

interface RateLimitDecoratorOptions {
  limit: number;
  window: string;
  tier?: string;
}

interface PaginationDecoratorOptions {
  defaultLimit?: number;
  maxLimit?: number;
  defaultSort?: string;
}

interface ApiVersionDecoratorOptions {
  version: string;
  deprecated?: boolean;
  sunsetDate?: string;
}

interface VMwareErrorResponse {
  statusCode: number;
  description: string;
  vmwareErrorCode?: string;
}

// ============================================================================
// 1. VIRTUAL MACHINE DECORATORS (1-6)
// ============================================================================

/**
 * 1. Composite decorator for VM resource endpoints.
 *
 * @param {string} operation - Operation type (create, read, update, delete, clone, snapshot)
 * @param {SwaggerDecoratorOptions} [options] - Decorator options
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @VirtualMachineOperation('clone', {
 *   summary: 'Clone virtual machine',
 *   description: 'Creates a clone of an existing VM with optional customization'
 * })
 * async cloneVM(@Param('id') id: string, @Body() dto: CloneVMDto) {
 *   // Implementation
 * }
 * ```
 */
export const VirtualMachineOperation = (
  operation: 'create' | 'read' | 'update' | 'delete' | 'clone' | 'snapshot' | 'migrate' | 'power',
  options?: SwaggerDecoratorOptions,
): MethodDecorator => {
  const operationMap: Record<string, ApiOperationOptions> = {
    create: { summary: 'Create virtual machine', description: 'Provisions a new virtual machine' },
    read: { summary: 'Get virtual machine', description: 'Retrieves virtual machine details' },
    update: { summary: 'Update virtual machine', description: 'Updates virtual machine configuration' },
    delete: { summary: 'Delete virtual machine', description: 'Deletes virtual machine and releases resources' },
    clone: { summary: 'Clone virtual machine', description: 'Creates a clone of existing virtual machine' },
    snapshot: { summary: 'Create snapshot', description: 'Creates point-in-time snapshot of virtual machine' },
    migrate: { summary: 'Migrate virtual machine', description: 'Migrates VM to different host or datastore (vMotion)' },
    power: { summary: 'VM power operation', description: 'Controls virtual machine power state' },
  };

  const decorators = [
    ApiTags('Virtual Machines'),
    ApiOperation({
      ...operationMap[operation],
      summary: options?.summary || operationMap[operation].summary,
      description: options?.description || operationMap[operation].description,
      deprecated: options?.deprecated,
    }),
  ];

  if (options?.security) {
    decorators.push(ApiSecurity('bearer'));
  }

  return applyDecorators(...decorators);
};

/**
 * 2. Decorator for VM power state validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PowerOperationDto {
 *   @IsVMPowerState()
 *   targetState: string;
 * }
 * ```
 */
export function IsVMPowerState(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isVMPowerState',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const validStates = ['poweredOn', 'poweredOff', 'suspended'];
          return typeof value === 'string' && validStates.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Power state must be one of: poweredOn, poweredOff, suspended';
        },
      },
    });
  };
}

/**
 * 3. Decorator for VM ID validation (VMware format).
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class VMRequestDto {
 *   @IsVMwareVMId()
 *   vmId: string;
 * }
 * ```
 */
export function IsVMwareVMId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isVMwareVMId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /^vm-\d+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'VM ID must be in VMware format (vm-###)';
        },
      },
    });
  };
}

/**
 * 4. Decorator for CPU core count validation.
 *
 * @param {number} [min] - Minimum cores
 * @param {number} [max] - Maximum cores
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class VMConfigDto {
 *   @IsVMCPUCores(1, 128)
 *   cpuCores: number;
 * }
 * ```
 */
export function IsVMCPUCores(min: number = 1, max: number = 128, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isVMCPUCores',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [min, max],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [minimum, maximum] = args.constraints;
          return typeof value === 'number' && Number.isInteger(value) && value >= minimum && value <= maximum;
        },
        defaultMessage(args: ValidationArguments) {
          const [minimum, maximum] = args.constraints;
          return `CPU cores must be an integer between ${minimum} and ${maximum}`;
        },
      },
    });
  };
}

/**
 * 5. Decorator for VM memory size validation (in MB).
 *
 * @param {number} [min] - Minimum memory in MB
 * @param {number} [max] - Maximum memory in MB
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class VMConfigDto {
 *   @IsVMMemoryMB(128, 1048576)
 *   memoryMB: number;
 * }
 * ```
 */
export function IsVMMemoryMB(min: number = 128, max: number = 1048576, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isVMMemoryMB',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [min, max],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [minimum, maximum] = args.constraints;
          // Must be integer and power of 2 for optimal performance
          return (
            typeof value === 'number' &&
            Number.isInteger(value) &&
            value >= minimum &&
            value <= maximum &&
            (value & (value - 1)) === 0
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [minimum, maximum] = args.constraints;
          return `Memory must be a power of 2 between ${minimum}MB and ${maximum}MB`;
        },
      },
    });
  };
}

/**
 * 6. Composite decorator for VM resource responses with standard error codes.
 *
 * @param {Type<any>} type - Response DTO type
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @VirtualMachineResponses(VirtualMachineDto)
 * async getVM(@Param('id') id: string) {
 *   // Automatically documents 200, 404, 403, 500 responses
 * }
 * ```
 */
export const VirtualMachineResponses = (type: Type<any>): MethodDecorator => {
  return applyDecorators(
    ApiResponse({ status: 200, description: 'Virtual machine retrieved successfully', type }),
    ApiResponse({ status: 404, description: 'Virtual machine not found', schema: { example: { statusCode: 404, error: 'Not Found', message: 'Virtual machine not found', code: 'VM_NOT_FOUND' } } }),
    ApiResponse({ status: 403, description: 'Insufficient permissions', schema: { example: { statusCode: 403, error: 'Forbidden', message: 'Insufficient permissions to access this VM', code: 'INSUFFICIENT_PERMISSIONS' } } }),
    ApiResponse({ status: 500, description: 'Internal server error', schema: { example: { statusCode: 500, error: 'Internal Server Error', message: 'An unexpected error occurred', code: 'INTERNAL_ERROR' } } }),
  );
};

// ============================================================================
// 2. HYPERVISOR & INFRASTRUCTURE DECORATORS (7-12)
// ============================================================================

/**
 * 7. Composite decorator for ESXi host operations.
 *
 * @param {string} operation - Operation type
 * @param {SwaggerDecoratorOptions} [options] - Decorator options
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ESXiHostOperation('maintenance', {
 *   summary: 'Enter maintenance mode',
 *   description: 'Places ESXi host in maintenance mode with VM evacuation'
 * })
 * async enterMaintenanceMode(@Param('hostId') id: string) {
 *   // Implementation
 * }
 * ```
 */
export const ESXiHostOperation = (
  operation: 'read' | 'update' | 'maintenance' | 'reboot' | 'shutdown',
  options?: SwaggerDecoratorOptions,
): MethodDecorator => {
  const operationMap: Record<string, ApiOperationOptions> = {
    read: { summary: 'Get ESXi host', description: 'Retrieves ESXi host details and metrics' },
    update: { summary: 'Update ESXi host', description: 'Updates host configuration' },
    maintenance: { summary: 'Maintenance mode', description: 'Enter or exit maintenance mode' },
    reboot: { summary: 'Reboot host', description: 'Reboots ESXi host' },
    shutdown: { summary: 'Shutdown host', description: 'Shuts down ESXi host' },
  };

  return applyDecorators(
    ApiTags('ESXi Hosts'),
    ApiOperation({
      ...operationMap[operation],
      summary: options?.summary || operationMap[operation].summary,
      description: options?.description || operationMap[operation].description,
      deprecated: options?.deprecated,
    }),
    ApiBearerAuth(),
  );
};

/**
 * 8. Decorator for datastore ID validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class StorageAllocationDto {
 *   @IsDatastoreId()
 *   datastoreId: string;
 * }
 * ```
 */
export function IsDatastoreId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDatastoreId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /^datastore-\d+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Datastore ID must be in VMware format (datastore-###)';
        },
      },
    });
  };
}

/**
 * 9. Decorator for cluster ID validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ClusterConfigDto {
 *   @IsClusterId()
 *   clusterId: string;
 * }
 * ```
 */
export function IsClusterId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isClusterId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /^(cluster|domain-c)\d+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Cluster ID must be in VMware format (cluster-### or domain-c###)';
        },
      },
    });
  };
}

/**
 * 10. Decorator for resource pool configuration validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class ResourceAllocationDto {
 *   @IsResourcePoolShares()
 *   shares: string;
 * }
 * ```
 */
export function IsResourcePoolShares(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isResourcePoolShares',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const validShares = ['low', 'normal', 'high', 'custom'];
          return typeof value === 'string' && validShares.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Resource shares must be one of: low, normal, high, custom';
        },
      },
    });
  };
}

/**
 * 11. Composite decorator for cluster operations with DRS/HA context.
 *
 * @param {string} operation - Operation type
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ClusterOperation('configureDRS')
 * async configureDRS(@Param('clusterId') id: string, @Body() config: DRSConfigDto) {
 *   // Implementation with automatic Swagger docs
 * }
 * ```
 */
export const ClusterOperation = (
  operation: 'read' | 'create' | 'update' | 'delete' | 'configureDRS' | 'configureHA',
): MethodDecorator => {
  const operationMap: Record<string, ApiOperationOptions> = {
    read: { summary: 'Get cluster', description: 'Retrieves cluster configuration and status' },
    create: { summary: 'Create cluster', description: 'Creates new VMware cluster' },
    update: { summary: 'Update cluster', description: 'Updates cluster configuration' },
    delete: { summary: 'Delete cluster', description: 'Deletes cluster and releases resources' },
    configureDRS: { summary: 'Configure DRS', description: 'Configures Distributed Resource Scheduler settings' },
    configureHA: { summary: 'Configure HA', description: 'Configures High Availability settings' },
  };

  return applyDecorators(
    ApiTags('Clusters'),
    ApiOperation(operationMap[operation]),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Operation completed successfully' }),
    ApiResponse({ status: 404, description: 'Cluster not found' }),
    ApiResponse({ status: 403, description: 'Insufficient permissions' }),
  );
};

/**
 * 12. Decorator for vSphere managed object reference (MoRef) validation.
 *
 * @param {string} type - MoRef type (vm, host, cluster, etc.)
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class MigrationDto {
 *   @IsVSphereMoRef('host')
 *   targetHost: string;
 * }
 * ```
 */
export function IsVSphereMoRef(type: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isVSphereMoRef',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [type],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [moRefType] = args.constraints;
          const pattern = new RegExp(`^${moRefType}-\\d+$`);
          return typeof value === 'string' && pattern.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          const [moRefType] = args.constraints;
          return `Value must be a valid vSphere managed object reference for type ${moRefType}`;
        },
      },
    });
  };
}

// ============================================================================
// 3. NETWORK & STORAGE DECORATORS (13-18)
// ============================================================================

/**
 * 13. Decorator for VLAN ID validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class PortGroupDto {
 *   @IsVLANId()
 *   vlanId: number;
 * }
 * ```
 */
export function IsVLANId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isVLANId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 4094;
        },
        defaultMessage(args: ValidationArguments) {
          return 'VLAN ID must be an integer between 0 and 4094 (0=none, 4095=trunk)';
        },
      },
    });
  };
}

/**
 * 14. Decorator for virtual NIC adapter type validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class NetworkAdapterDto {
 *   @IsVirtualNICType()
 *   adapterType: string;
 * }
 * ```
 */
export function IsVirtualNICType(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isVirtualNICType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const validTypes = ['vmxnet3', 'vmxnet2', 'e1000', 'e1000e'];
          return typeof value === 'string' && validTypes.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'NIC adapter type must be one of: vmxnet3, vmxnet2, e1000, e1000e';
        },
      },
    });
  };
}

/**
 * 15. Decorator for disk provisioning type validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class DiskConfigDto {
 *   @IsDiskProvisioningType()
 *   diskType: string;
 * }
 * ```
 */
export function IsDiskProvisioningType(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDiskProvisioningType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const validTypes = ['thin', 'thick', 'eagerZeroedThick'];
          return typeof value === 'string' && validTypes.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Disk provisioning type must be one of: thin, thick, eagerZeroedThick';
        },
      },
    });
  };
}

/**
 * 16. Composite decorator for virtual network operations.
 *
 * @param {string} operation - Operation type
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @VirtualNetworkOperation('createPortGroup')
 * async createPortGroup(@Body() dto: CreatePortGroupDto) {
 *   // Automatic Swagger docs for network operations
 * }
 * ```
 */
export const VirtualNetworkOperation = (
  operation: 'read' | 'create' | 'update' | 'delete' | 'createPortGroup' | 'createvSwitch',
): MethodDecorator => {
  const operationMap: Record<string, ApiOperationOptions> = {
    read: { summary: 'Get virtual network', description: 'Retrieves virtual network configuration' },
    create: { summary: 'Create virtual network', description: 'Creates new virtual network' },
    update: { summary: 'Update virtual network', description: 'Updates virtual network configuration' },
    delete: { summary: 'Delete virtual network', description: 'Deletes virtual network' },
    createPortGroup: { summary: 'Create port group', description: 'Creates new port group on virtual switch' },
    createvSwitch: { summary: 'Create vSwitch', description: 'Creates new standard or distributed virtual switch' },
  };

  return applyDecorators(
    ApiTags('Virtual Networks'),
    ApiOperation(operationMap[operation]),
    ApiBearerAuth(),
  );
};

/**
 * 17. Decorator for NSX-T segment validation.
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class NSXSegmentDto {
 *   @IsNSXSegmentType()
 *   segmentType: string;
 * }
 * ```
 */
export function IsNSXSegmentType(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNSXSegmentType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const validTypes = ['overlay', 'vlan'];
          return typeof value === 'string' && validTypes.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'NSX segment type must be one of: overlay, vlan';
        },
      },
    });
  };
}

/**
 * 18. Decorator for storage capacity validation (in GB).
 *
 * @param {number} [min] - Minimum capacity in GB
 * @param {number} [max] - Maximum capacity in GB
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class DiskDto {
 *   @IsStorageCapacityGB(1, 62000)
 *   capacityGB: number;
 * }
 * ```
 */
export function IsStorageCapacityGB(min: number = 1, max: number = 62000, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStorageCapacityGB',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [min, max],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [minimum, maximum] = args.constraints;
          return typeof value === 'number' && Number.isInteger(value) && value >= minimum && value <= maximum;
        },
        defaultMessage(args: ValidationArguments) {
          const [minimum, maximum] = args.constraints;
          return `Storage capacity must be an integer between ${minimum}GB and ${maximum}GB`;
        },
      },
    });
  };
}

// ============================================================================
// 4. SECURITY & AUTHENTICATION DECORATORS (19-24)
// ============================================================================

/**
 * 19. Composite decorator for vSphere session authentication.
 *
 * @param {string[]} [scopes] - Required permission scopes
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @VSphereAuth(['VirtualMachine.Inventory.Create', 'Datastore.AllocateSpace'])
 * async createVM(@Body() dto: CreateVMDto) {
 *   // Endpoint protected with vSphere authentication
 * }
 * ```
 */
export const VSphereAuth = (scopes?: string[]): MethodDecorator => {
  const decorators = [
    ApiBearerAuth(),
    ApiHeader({
      name: 'vmware-api-session-id',
      description: 'vSphere API session ID',
      required: false,
      schema: { type: 'string', example: 'cst-VCT-...' },
    }),
  ];

  if (scopes && scopes.length > 0) {
    decorators.push(
      SetMetadata('requiredPermissions', scopes),
      ApiResponse({
        status: 403,
        description: `Insufficient permissions. Required: ${scopes.join(', ')}`,
      }),
    );
  }

  return applyDecorators(...decorators);
};

/**
 * 20. Decorator for OAuth2 with VMware Cloud Services.
 *
 * @param {string[]} [scopes] - Required OAuth2 scopes
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @VMwareCloudAuth(['csp:org_member', 'vra:catalog_admin'])
 * async deployBlueprint(@Body() dto: DeploymentDto) {
 *   // Protected by VMware Cloud Services OAuth2
 * }
 * ```
 */
export const VMwareCloudAuth = (scopes?: string[]): MethodDecorator => {
  const decorators = [
    ApiOAuth2(scopes || [], 'VMware Cloud Services OAuth2'),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or expired OAuth2 token',
    }),
  ];

  if (scopes && scopes.length > 0) {
    decorators.push(
      ApiResponse({
        status: 403,
        description: `Insufficient OAuth2 scopes. Required: ${scopes.join(', ')}`,
      }),
    );
  }

  return applyDecorators(...decorators);
};

/**
 * 21. Decorator for API key authentication.
 *
 * @param {string} headerName - API key header name
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ApiKeyAuth('X-API-Key')
 * async getMetrics(@Query() query: MetricsQueryDto) {
 *   // Protected by API key
 * }
 * ```
 */
export const ApiKeyAuth = (headerName: string = 'X-API-Key'): MethodDecorator => {
  return applyDecorators(
    ApiSecurity('apiKey'),
    ApiHeader({
      name: headerName,
      description: 'API Key for authentication',
      required: true,
      schema: { type: 'string', example: 'ak-xxxxxxxxxxxxxxxx' },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing API key',
    }),
  );
};

/**
 * 22. Composite decorator for multi-factor authentication requirement.
 *
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @RequireMFA()
 * async deleteCluster(@Param('id') id: string) {
 *   // Critical operation requiring MFA
 * }
 * ```
 */
export const RequireMFA = (): MethodDecorator => {
  return applyDecorators(
    SetMetadata('requireMFA', true),
    ApiHeader({
      name: 'X-MFA-Token',
      description: 'Multi-factor authentication token',
      required: true,
      schema: { type: 'string', example: 'mfa-token-...' },
    }),
    ApiResponse({
      status: 403,
      description: 'MFA verification required',
      schema: {
        example: {
          statusCode: 403,
          error: 'Forbidden',
          message: 'Multi-factor authentication required for this operation',
          code: 'MFA_REQUIRED',
        },
      },
    }),
  );
};

/**
 * 23. Decorator for role-based access control validation.
 *
 * @param {string[]} roles - Required roles
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @RequireRoles(['admin', 'infrastructure-admin'])
 * async configureCluster(@Body() config: ClusterConfigDto) {
 *   // Only admins can access
 * }
 * ```
 */
export const RequireRoles = (roles: string[]): MethodDecorator => {
  return applyDecorators(
    SetMetadata('roles', roles),
    ApiResponse({
      status: 403,
      description: `Forbidden - Requires one of the following roles: ${roles.join(', ')}`,
      schema: {
        example: {
          statusCode: 403,
          error: 'Forbidden',
          message: 'Insufficient role permissions',
          code: 'INSUFFICIENT_ROLE',
          requiredRoles: roles,
        },
      },
    }),
  );
};

/**
 * 24. Decorator for vSphere permission validation.
 *
 * @param {string[]} permissions - Required vSphere permissions
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * @RequireVSpherePermissions(['VirtualMachine.Config.AddNewDisk'])
 * async addDisk(@Param('vmId') id: string, @Body() disk: AddDiskDto) {
 *   // Validates vSphere permissions
 * }
 * ```
 */
export const RequireVSpherePermissions = (permissions: string[]): MethodDecorator => {
  return applyDecorators(
    SetMetadata('vSpherePermissions', permissions),
    ApiResponse({
      status: 403,
      description: 'Insufficient vSphere permissions',
      schema: {
        example: {
          statusCode: 403,
          error: 'Forbidden',
          message: 'Missing required vSphere permissions',
          code: 'INSUFFICIENT_VSPHERE_PERMISSIONS',
          requiredPermissions: permissions,
        },
      },
    }),
  );
};

// ============================================================================
// 5. RATE LIMITING & PAGINATION DECORATORS (25-30)
// ============================================================================

/**
 * 25. Decorator for rate limit documentation.
 *
 * @param {RateLimitDecoratorOptions} options - Rate limit options
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @RateLimitDoc({ limit: 1000, window: '1 hour', tier: 'standard' })
 * async listVMs(@Query() query: ListVMsDto) {
 *   // Documents rate limits in API spec
 * }
 * ```
 */
export const RateLimitDoc = (options: RateLimitDecoratorOptions): MethodDecorator => {
  return applyDecorators(
    SetMetadata('rateLimit', options),
    ApiHeader({
      name: 'X-RateLimit-Limit',
      description: 'Request limit per window',
      required: false,
      schema: { type: 'integer', example: options.limit },
    }),
    ApiHeader({
      name: 'X-RateLimit-Remaining',
      description: 'Remaining requests in current window',
      required: false,
      schema: { type: 'integer', example: Math.floor(options.limit * 0.75) },
    }),
    ApiHeader({
      name: 'X-RateLimit-Reset',
      description: 'Time when rate limit resets (ISO 8601)',
      required: false,
      schema: { type: 'string', format: 'date-time' },
    }),
    ApiResponse({
      status: 429,
      description: 'Too Many Requests - Rate limit exceeded',
      schema: {
        example: {
          statusCode: 429,
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Limit: ${options.limit} requests per ${options.window}`,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: 60,
        },
      },
      headers: {
        'Retry-After': {
          description: 'Seconds to wait before retrying',
          schema: { type: 'integer', example: 60 },
        },
      },
    }),
  );
};

/**
 * 26. Composite decorator for paginated endpoints.
 *
 * @param {PaginationDecoratorOptions} [options] - Pagination options
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @PaginatedEndpoint({ defaultLimit: 20, maxLimit: 100 })
 * async listVMs(@Query() query: PaginationDto) {
 *   // Automatic pagination query docs
 * }
 * ```
 */
export const PaginatedEndpoint = (options?: PaginationDecoratorOptions): MethodDecorator => {
  const defaultLimit = options?.defaultLimit || 20;
  const maxLimit = options?.maxLimit || 100;
  const defaultSort = options?.defaultSort || 'createdAt';

  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (1-indexed)',
      example: 1,
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      type: Number,
      description: `Items per page (max: ${maxLimit})`,
      example: defaultLimit,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: 'Field to sort by',
      example: defaultSort,
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['asc', 'desc'],
      description: 'Sort order',
      example: 'desc',
    }),
  );
};

/**
 * 27. Decorator for search query parameter documentation.
 *
 * @param {string[]} searchableFields - Fields that can be searched
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @SearchableEndpoint(['name', 'guestOS', 'ipAddress'])
 * async searchVMs(@Query() query: SearchDto) {
 *   // Documents searchable fields
 * }
 * ```
 */
export const SearchableEndpoint = (searchableFields: string[]): MethodDecorator => {
  return applyDecorators(
    ApiQuery({
      name: 'q',
      required: false,
      type: String,
      description: `Search query. Searches in: ${searchableFields.join(', ')}`,
      example: 'web-server',
    }),
    ApiQuery({
      name: 'fields',
      required: false,
      type: String,
      description: 'Comma-separated list of fields to search in',
      example: searchableFields.slice(0, 2).join(','),
    }),
  );
};

/**
 * 28. Decorator for filterable endpoint documentation.
 *
 * @param {Record<string, string[]>} filters - Filter fields and allowed values
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @FilterableEndpoint({
 *   powerState: ['poweredOn', 'poweredOff', 'suspended'],
 *   guestOS: ['ubuntu64Guest', 'windows9Server64Guest']
 * })
 * async filterVMs(@Query() filters: VMFilterDto) {
 *   // Documents available filters
 * }
 * ```
 */
export const FilterableEndpoint = (filters: Record<string, string[]>): MethodDecorator => {
  const decorators: MethodDecorator[] = [];

  Object.entries(filters).forEach(([field, values]) => {
    decorators.push(
      ApiQuery({
        name: field,
        required: false,
        enum: values,
        description: `Filter by ${field}`,
        example: values[0],
      }),
    );
  });

  return applyDecorators(...decorators);
};

/**
 * 29. Decorator for date range filtering documentation.
 *
 * @param {string[]} dateFields - Date fields that support range filtering
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @DateRangeFilter(['createdAt', 'modifiedAt'])
 * async filterByDate(@Query() query: DateRangeDto) {
 *   // Documents date range query params
 * }
 * ```
 */
export const DateRangeFilter = (dateFields: string[]): MethodDecorator => {
  const decorators: MethodDecorator[] = [];

  dateFields.forEach((field) => {
    decorators.push(
      ApiQuery({
        name: `${field}From`,
        required: false,
        type: String,
        description: `Filter ${field} from date (ISO 8601)`,
        example: '2024-01-01T00:00:00Z',
      }),
      ApiQuery({
        name: `${field}To`,
        required: false,
        type: String,
        description: `Filter ${field} to date (ISO 8601)`,
        example: '2024-12-31T23:59:59Z',
      }),
    );
  });

  return applyDecorators(...decorators);
};

/**
 * 30. Decorator for cursor-based pagination documentation.
 *
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @CursorPagination()
 * async listVMsCursor(@Query() query: CursorPaginationDto) {
 *   // Documents cursor-based pagination
 * }
 * ```
 */
export const CursorPagination = (): MethodDecorator => {
  return applyDecorators(
    ApiQuery({
      name: 'cursor',
      required: false,
      type: String,
      description: 'Pagination cursor for next page',
      example: 'eyJpZCI6InZtLTEyMyIsInRpbWVzdGFtcCI6MTcwNTMyMDAwMH0=',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items to return',
      example: 20,
    }),
  );
};

// ============================================================================
// 6. ASYNC OPERATIONS & TASK DECORATORS (31-35)
// ============================================================================

/**
 * 31. Decorator for async operation responses (202 Accepted).
 *
 * @param {string} operation - Operation name
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @AsyncOperation('VM Clone')
 * async cloneVMAsync(@Param('id') id: string, @Body() dto: CloneVMDto) {
 *   // Returns task ID for tracking
 * }
 * ```
 */
export const AsyncOperation = (operation: string): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      status: 202,
      description: `${operation} operation accepted and queued for processing`,
      schema: {
        example: {
          statusCode: 202,
          message: `${operation} operation accepted`,
          taskId: 'task-12345678-1234-1234-1234-123456789012',
          statusUrl: '/api/v1/tasks/task-12345678-1234-1234-1234-123456789012',
          operation: operation,
        },
      },
      headers: {
        Location: {
          description: 'URL to check task status',
          schema: { type: 'string', format: 'uri' },
        },
      },
    }),
  );
};

/**
 * 32. Decorator for task status endpoint documentation.
 *
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @TaskStatusEndpoint()
 * async getTaskStatus(@Param('taskId') taskId: string) {
 *   // Documents task status response
 * }
 * ```
 */
export const TaskStatusEndpoint = (): MethodDecorator => {
  return applyDecorators(
    ApiTags('Tasks'),
    ApiOperation({
      summary: 'Get task status',
      description: 'Retrieves status and progress of an asynchronous task',
    }),
    ApiParam({
      name: 'taskId',
      description: 'Task unique identifier',
      type: String,
      example: 'task-12345678-1234-1234-1234-123456789012',
    }),
    ApiResponse({
      status: 200,
      description: 'Task status retrieved successfully',
      schema: {
        example: {
          taskId: 'task-12345678-1234-1234-1234-123456789012',
          status: 'running',
          operation: 'VirtualMachine.clone',
          progress: 45,
          startTime: '2024-01-15T10:30:00Z',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Task not found',
    }),
  );
};

/**
 * 33. Decorator for long-running operation timeout documentation.
 *
 * @param {number} timeoutSeconds - Default timeout in seconds
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @LongRunningOperation(3600)
 * async migrateVM(@Body() dto: MigrationDto) {
 *   // Documents operation timeout
 * }
 * ```
 */
export const LongRunningOperation = (timeoutSeconds: number): MethodDecorator => {
  return applyDecorators(
    SetMetadata('operationTimeout', timeoutSeconds),
    ApiQuery({
      name: 'timeout',
      required: false,
      type: Number,
      description: `Operation timeout in seconds (default: ${timeoutSeconds})`,
      example: timeoutSeconds,
    }),
    ApiResponse({
      status: 408,
      description: 'Request Timeout - Operation exceeded timeout duration',
      schema: {
        example: {
          statusCode: 408,
          error: 'Request Timeout',
          message: `Operation exceeded timeout of ${timeoutSeconds} seconds`,
          code: 'OPERATION_TIMEOUT',
        },
      },
    }),
  );
};

/**
 * 34. Decorator for batch operation documentation.
 *
 * @param {string} operation - Batch operation name
 * @param {number} maxBatchSize - Maximum batch size
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @BatchOperation('VM Power On', 100)
 * async batchPowerOn(@Body() dto: BatchPowerOnDto) {
 *   // Documents batch constraints
 * }
 * ```
 */
export const BatchOperation = (operation: string, maxBatchSize: number): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: `Batch ${operation}`,
      description: `Performs ${operation} on multiple resources. Maximum batch size: ${maxBatchSize}`,
    }),
    ApiResponse({
      status: 207,
      description: 'Multi-Status - Batch operation completed with mixed results',
    }),
    ApiResponse({
      status: 413,
      description: `Payload Too Large - Batch size exceeds maximum of ${maxBatchSize}`,
      schema: {
        example: {
          statusCode: 413,
          error: 'Payload Too Large',
          message: `Batch size exceeds maximum of ${maxBatchSize} items`,
          code: 'BATCH_SIZE_EXCEEDED',
        },
      },
    }),
  );
};

/**
 * 35. Decorator for scheduled task documentation.
 *
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ScheduledTaskEndpoint()
 * async createScheduledSnapshot(@Body() dto: ScheduledTaskDto) {
 *   // Documents scheduled task creation
 * }
 * ```
 */
export const ScheduledTaskEndpoint = (): MethodDecorator => {
  return applyDecorators(
    ApiTags('Scheduled Tasks'),
    ApiOperation({
      summary: 'Create scheduled task',
      description: 'Creates a scheduled task with cron-based recurrence',
    }),
    ApiResponse({
      status: 201,
      description: 'Scheduled task created successfully',
    }),
  );
};

// ============================================================================
// 7. API VERSIONING & METADATA DECORATORS (36-39)
// ============================================================================

/**
 * 36. Decorator for API version documentation.
 *
 * @param {ApiVersionDecoratorOptions} options - Version options
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ApiVersionDoc({ version: 'v2', deprecated: false })
 * @Controller('api/v2/virtual-machines')
 * export class VirtualMachinesV2Controller {
 *   // Controller with version metadata
 * }
 * ```
 */
export const ApiVersionDoc = (options: ApiVersionDecoratorOptions): MethodDecorator => {
  const decorators: MethodDecorator[] = [
    SetMetadata('apiVersion', options.version),
    ApiHeader({
      name: 'API-Version',
      description: 'API version',
      required: false,
      schema: { type: 'string', example: options.version },
    }),
  ];

  if (options.deprecated) {
    decorators.push(
      ApiResponse({
        status: 299,
        description: `API version ${options.version} is deprecated${options.sunsetDate ? `. Sunset date: ${options.sunsetDate}` : ''}`,
        headers: {
          'Sunset': {
            description: 'Date when this API version will be removed',
            schema: { type: 'string', format: 'date' },
          },
          'Deprecation': {
            description: 'This API version is deprecated',
            schema: { type: 'boolean', example: true },
          },
        },
      }),
    );
  }

  return applyDecorators(...decorators);
};

/**
 * 37. Decorator for VMware vRealize Automation compatibility metadata.
 *
 * @param {boolean} compatible - vRA compatible
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @VRealizeCompatible(true)
 * @Controller('api/v1/blueprints')
 * export class BlueprintsController {
 *   // vRealize Automation compatible endpoints
 * }
 * ```
 */
export const VRealizeCompatible = (compatible: boolean): MethodDecorator => {
  return applyDecorators(
    SetMetadata('vRealizeCompatible', compatible),
    ApiHeader({
      name: 'X-vRealize-Compatible',
      description: 'Endpoint compatible with VMware vRealize Automation',
      required: false,
      schema: { type: 'boolean', example: compatible },
    }),
  );
};

/**
 * 38. Decorator for API capability discovery metadata.
 *
 * @param {string[]} capabilities - Supported capabilities
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ApiCapabilities(['vmotion', 'drs', 'ha', 'snapshots'])
 * async getCapabilities() {
 *   // Documents API capabilities
 * }
 * ```
 */
export const ApiCapabilities = (capabilities: string[]): MethodDecorator => {
  return applyDecorators(
    SetMetadata('apiCapabilities', capabilities),
    ApiResponse({
      status: 200,
      description: 'API capabilities',
      schema: {
        example: {
          capabilities: capabilities,
          features: capabilities.reduce((acc, cap) => ({ ...acc, [cap]: true }), {}),
        },
      },
    }),
  );
};

/**
 * 39. Decorator for export/import format documentation.
 *
 * @param {string[]} formats - Supported export/import formats
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * @ExportFormats(['ova', 'ovf', 'vmdk'])
 * async exportVM(@Param('id') id: string, @Query('format') format: string) {
 *   // Documents supported export formats
 * }
 * ```
 */
export const ExportFormats = (formats: string[]): MethodDecorator => {
  return applyDecorators(
    ApiQuery({
      name: 'format',
      required: true,
      enum: formats,
      description: `Export format. Supported: ${formats.join(', ')}`,
      example: formats[0],
    }),
    ApiResponse({
      status: 200,
      description: 'Export prepared successfully',
      headers: {
        'Content-Disposition': {
          description: 'Attachment filename',
          schema: { type: 'string', example: `attachment; filename="vm-export.${formats[0]}"` },
        },
      },
    }),
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // VM Decorators
  VirtualMachineOperation,
  IsVMPowerState,
  IsVMwareVMId,
  IsVMCPUCores,
  IsVMMemoryMB,
  VirtualMachineResponses,

  // Hypervisor & Infrastructure
  ESXiHostOperation,
  IsDatastoreId,
  IsClusterId,
  IsResourcePoolShares,
  ClusterOperation,
  IsVSphereMoRef,

  // Network & Storage
  IsVLANId,
  IsVirtualNICType,
  IsDiskProvisioningType,
  VirtualNetworkOperation,
  IsNSXSegmentType,
  IsStorageCapacityGB,

  // Security & Authentication
  VSphereAuth,
  VMwareCloudAuth,
  ApiKeyAuth,
  RequireMFA,
  RequireRoles,
  RequireVSpherePermissions,

  // Rate Limiting & Pagination
  RateLimitDoc,
  PaginatedEndpoint,
  SearchableEndpoint,
  FilterableEndpoint,
  DateRangeFilter,
  CursorPagination,

  // Async Operations & Tasks
  AsyncOperation,
  TaskStatusEndpoint,
  LongRunningOperation,
  BatchOperation,
  ScheduledTaskEndpoint,

  // API Versioning & Metadata
  ApiVersionDoc,
  VRealizeCompatible,
  ApiCapabilities,
  ExportFormats,
};

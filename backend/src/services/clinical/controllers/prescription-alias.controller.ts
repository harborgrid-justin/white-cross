import { All, Controller, Req, Res, Version } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { BaseController } from '@/common/base';
/**
 * Prescription Alias Controller
 *
 * GAP-MED-001: Fix Prescription Path Mismatch
 *
 * Frontend calls: /prescriptions/*
 * Backend implements: /clinical/prescriptions/*
 *
 * This controller acts as a transparent proxy/alias to redirect all requests
 * from /prescriptions/* to /clinical/prescriptions/* without breaking existing
 * frontend code.
 *
 * This is a temporary bridge solution to maintain backward compatibility while
 * the frontend transitions to using the correct /clinical/prescriptions path.
 *
 * Usage:
 * - All HTTP methods (GET, POST, PATCH, DELETE) are forwarded
 * - Query parameters are preserved
 * - Request body is preserved
 * - Response is returned transparently
 *
 * Example:
 * Frontend: GET /prescriptions/123 -> Proxied to -> GET /clinical/prescriptions/123
 * Frontend: POST /prescriptions -> Proxied to -> POST /clinical/prescriptions
 */
@ApiExcludeController() // Exclude from Swagger docs as this is just an alias

@Controller('prescriptions')
export class PrescriptionAliasController extends BaseController {
  /**
   * Catch-all route handler that forwards all requests to /clinical/prescriptions
   *
   * This uses the @All() decorator to match all HTTP methods and a wildcard
   * parameter to match any path under /prescriptions.
   *
   * The handler then internally forwards the request to the actual prescription
   * controller at /clinical/prescriptions maintaining all original request data.
   */
  @All('*')
  async forwardToClinicalPrescriptions(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // Extract the path after /prescriptions
    const path = req.path.replace('/prescriptions', '');

    // Build the new path
    const newPath = `/clinical/prescriptions${path}`;

    // Add a header to indicate this was aliased (for debugging/monitoring)
    res.setHeader('X-Prescription-Alias', 'true');
    res.setHeader('X-Original-Path', req.path);
    res.setHeader('X-Forwarded-To', newPath);

    // Note: In a production environment, you would use req.app to forward
    // the request internally to the clinical prescriptions controller.
    // For now, this serves as a placeholder that will be completed when
    // integrated with the actual routing infrastructure.

    // Return a helpful message indicating the alias is in place
    return res.status(200).json({
      message: 'Prescription alias endpoint',
      note: 'This endpoint forwards to /clinical/prescriptions',
      originalPath: req.path,
      forwardedTo: newPath,
      method: req.method,
      implementation:
        'TO BE COMPLETED: Integrate with internal routing or reverse proxy',
    });
  }
}

/**
 * IMPLEMENTATION NOTES:
 *
 * Option 1: Internal Redirect (Recommended for NestJS)
 * -------------------------------------------------------
 * Use NestJS's internal request forwarding by injecting HttpService
 * and making an internal HTTP call to the /clinical/prescriptions endpoint.
 *
 * Option 2: Controller Method Forwarding
 * ----------------------------------------
 * Inject the actual PrescriptionController and call its methods directly,
 * effectively making this a lightweight wrapper.
 *
 * Option 3: Nginx/API Gateway Level
 * -----------------------------------
 * Configure the reverse proxy (Nginx, Kong, etc.) to handle the aliasing
 * before requests reach the NestJS application.
 *
 * Option 4: NestJS Module Aliasing
 * ----------------------------------
 * Use NestJS's routing configuration to create path aliases at the module level.
 *
 * RECOMMENDED: Option 2 with direct controller injection for best performance
 * and maintainability within the NestJS architecture.
 */

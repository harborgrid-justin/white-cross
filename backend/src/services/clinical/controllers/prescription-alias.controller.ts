import { All, Controller, Req, Res, Version, Inject } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

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
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super('PrescriptionAliasController');
  }

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
    try {
      // Extract the path after /prescriptions
      const path = req.path.replace('/prescriptions', '');

      // Build the new path
      const newPath = `/clinical/prescriptions${path}`;

      // Get base URL from config or use localhost
      const baseUrl = this.configService.get<string>('API_BASE_URL', 'http://localhost:3000');
      const fullUrl = `${baseUrl}${newPath}`;

      // Add headers to indicate this was aliased (for debugging/monitoring)
      res.setHeader('X-Prescription-Alias', 'true');
      res.setHeader('X-Original-Path', req.path);
      res.setHeader('X-Forwarded-To', newPath);

      // Log the forwarding for audit purposes
      this.logInfo(`Forwarding ${req.method} request from ${req.path} to ${newPath}`);

      // Build query string
      const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
      const urlWithQuery = queryString ? `${fullUrl}?${queryString}` : fullUrl;

      // Forward the request based on HTTP method
      let response;

      switch (req.method.toUpperCase()) {
        case 'GET':
          response = await firstValueFrom(
            this.httpService.get(urlWithQuery, {
              headers: this.forwardHeaders(req),
              validateStatus: () => true, // Don't throw on any status code
            }),
          );
          break;

        case 'POST':
          response = await firstValueFrom(
            this.httpService.post(fullUrl, req.body, {
              headers: this.forwardHeaders(req),
              params: req.query,
              validateStatus: () => true,
            }),
          );
          break;

        case 'PATCH':
        case 'PUT':
          response = await firstValueFrom(
            this.httpService.patch(fullUrl, req.body, {
              headers: this.forwardHeaders(req),
              params: req.query,
              validateStatus: () => true,
            }),
          );
          break;

        case 'DELETE':
          response = await firstValueFrom(
            this.httpService.delete(fullUrl, {
              headers: this.forwardHeaders(req),
              params: req.query,
              data: req.body, // DELETE requests can have body
              validateStatus: () => true,
            }),
          );
          break;

        default:
          return res.status(405).json({
            error: 'Method Not Allowed',
            message: `HTTP method ${req.method} is not supported`,
          });
      }

      // Forward response headers
      Object.entries(response.headers).forEach(([key, value]) => {
        if (this.shouldForwardResponseHeader(key)) {
          res.setHeader(key, value as string);
        }
      });

      // Return the response with the same status code and body
      return res.status(response.status).json(response.data);
    } catch (error) {
      this.logError(`Failed to forward prescription request: ${error instanceof Error ? error.message : 'Unknown error'}`);

      // Return error response
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to forward request to prescription service',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Forward relevant headers from original request
   */
  private forwardHeaders(req: Request): Record<string, string> {
    const headersToForward: Record<string, string> = {};

    // Forward authentication headers
    if (req.headers.authorization) {
      headersToForward['authorization'] = req.headers.authorization;
    }

    // Forward content type
    if (req.headers['content-type']) {
      headersToForward['content-type'] = req.headers['content-type'];
    }

    // Forward accept header
    if (req.headers['accept']) {
      headersToForward['accept'] = req.headers['accept'];
    }

    // Forward user agent for tracking
    if (req.headers['user-agent']) {
      headersToForward['user-agent'] = req.headers['user-agent'];
    }

    // Add custom header to indicate internal forwarding
    headersToForward['X-Forwarded-From'] = 'PrescriptionAliasController';
    headersToForward['X-Internal-Forward'] = 'true';

    return headersToForward;
  }

  /**
   * Determine if response header should be forwarded back to client
   */
  private shouldForwardResponseHeader(headerName: string): boolean {
    const lowerHeaderName = headerName.toLowerCase();

    // Don't forward these headers as they're managed by NestJS/Express
    const skipHeaders = [
      'connection',
      'keep-alive',
      'transfer-encoding',
      'upgrade',
      'host',
    ];

    return !skipHeaders.includes(lowerHeaderName);
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

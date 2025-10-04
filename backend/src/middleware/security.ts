import { Server } from '@hapi/hapi';
import * as Boom from '@hapi/boom';

export const configureSecurity = async (server: Server) => {
  // Register security-related plugins
  await server.register([
    // Note: Hapi has built-in security features
    // Additional security plugins can be added here as needed
  ]);

  // Set security headers
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    // Set security headers for error responses
    if (Boom.isBoom(response)) {
      const boomResponse = response as Boom.Boom;
      boomResponse.output.headers['X-Content-Type-Options'] = 'nosniff';
      boomResponse.output.headers['X-Frame-Options'] = 'DENY';
      boomResponse.output.headers['X-XSS-Protection'] = '1; mode=block';
      boomResponse.output.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
    }

    return h.continue;
  });
};

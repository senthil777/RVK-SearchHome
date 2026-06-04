import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const startedAt = Date.now();
    const { method, originalUrl } = request;

    this.logger.log(`--> ${method} ${originalUrl}`);

    response.on('finish', () => {
      const duration = Date.now() - startedAt;
      const { statusCode } = response;
      const contentLength = response.getHeader('content-length') ?? 0;

      this.logger.log(
        `<-- ${method} ${originalUrl} ${statusCode} ${duration}ms ${contentLength}b`,
      );
    });

    next();
  }
}

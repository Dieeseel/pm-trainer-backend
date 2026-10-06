import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { AbstractHttpAdapter } from "@nestjs/core";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter: AbstractHttpAdapter) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.message : "Internal Server Error";

    const responseBody = {
      statusCode: httpStatus,
      message: message,
      success: false,
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse();

      if (typeof response === "object" && "message" in response) {
        Object.assign(responseBody, {
          error: response.message,
        });
      }
    }

    this.httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

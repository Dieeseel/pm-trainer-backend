// TODO: Исправить вывод ошибок
import { STATUS_CODES } from "http";

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { AbstractHttpAdapter } from "@nestjs/core";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter: AbstractHttpAdapter) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = exception instanceof HttpException ? exception.getResponse() : null;

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      response && typeof response === "object" && "message" in response
        ? response.message
        : "Internal Server Error";

    const error =
      response && typeof response === "object" && "error" in response
        ? (response.error as string)
        : STATUS_CODES[httpStatus];

    const errorCode =
      response && typeof response === "object" && "errorCode" in response
        ? (response.errorCode as string)
        : null;

    const responseBody = {
      statusCode: httpStatus,
      ...(error && { error }),
      ...(errorCode && { errorCode }),
      message: message,
      success: false,
      timestamp: new Date().toISOString(),
    };

    this.httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

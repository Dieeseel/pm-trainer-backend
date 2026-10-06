import { ArgumentsHost, Catch, type HttpServer, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { errorMessages } from "@/common/constants/error-messages";
import { PRISMA_ERRORS } from "@/common/constants/prisma-errors";
import { Prisma } from "@/generated/prisma/client";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly httpAdapter: HttpServer) {
    super(httpAdapter);
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const { meta } = exception;

    const target = meta?.modelName as string;
    const column = meta?.column_name as string;

    switch (exception.code) {
      case PRISMA_ERRORS.UNIQUE_CONSTRAINT: {
        this.replyResponse(
          host,
          HttpStatus.CONFLICT,
          errorMessages.PRISMA.UNIQUE_CONSTRAINT(target)
        );
        break;
      }
      case PRISMA_ERRORS.RECORD_NOT_FOUND: {
        this.replyResponse(
          host,
          HttpStatus.CONFLICT,
          errorMessages.PRISMA.RECORD_NOT_FOUND(target)
        );
        break;
      }
      case PRISMA_ERRORS.FOREIGN_KEY_CONSTRAINT: {
        this.replyResponse(
          host,
          HttpStatus.BAD_REQUEST,
          errorMessages.PRISMA.FOREIGN_KEY_CONSTRAINT
        );
        break;
      }
      case PRISMA_ERRORS.VALUE_TOO_LONG: {
        this.replyResponse(
          host,
          HttpStatus.BAD_REQUEST,
          errorMessages.PRISMA.VALUE_TOO_LONG(column)
        );
        break;
      }
      case PRISMA_ERRORS.VALIDATION_FAILED: {
        this.replyResponse(host, HttpStatus.BAD_REQUEST, errorMessages.PRISMA.VALIDATION_FAILED);
        break;
      }
      case PRISMA_ERRORS.CONNECTION_TIMEOUT: {
        this.replyResponse(
          host,
          HttpStatus.GATEWAY_TIMEOUT,
          errorMessages.PRISMA.CONNECTION_TIMEOUT
        );
        break;
      }
      case PRISMA_ERRORS.CANNOT_REACH_DB: {
        this.replyResponse(
          host,
          HttpStatus.SERVICE_UNAVAILABLE,
          errorMessages.PRISMA.CANNOT_REACH_DB
        );
        break;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }

  private replyResponse(host: ArgumentsHost, httpStatus: HttpStatus, message: string) {
    const ctx = host.switchToHttp();

    const responseBody = {
      statusCode: httpStatus,
      message: message,
      timestamp: new Date().toISOString(),
      success: false,
    };

    this.httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

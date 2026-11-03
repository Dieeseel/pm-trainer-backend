import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
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
      error: this.extractErrorDetails(exception),
    };

    this.httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private extractErrorDetails(exception: unknown): string | string[] | undefined {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === "object" && "message" in response) {
        const message = response.message;

        if (Array.isArray(message)) {
          return message as string[];
        } else {
          return "cause" in exception && typeof exception.cause === "string"
            ? exception.cause.replace(/[\\"]/g, "").replace(/\s+/g, " ").trim()
            : String(response.message);
        }
      }
    }
  }
}

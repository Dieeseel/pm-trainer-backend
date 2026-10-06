import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import type { Response } from "express";

import { IResponseBodyWithData } from "@/common/interfaces/responsy.interface";

@Injectable()
export class GlobalInterceptor implements NestInterceptor<unknown, IResponseBodyWithData> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<IResponseBodyWithData> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: unknown): IResponseBodyWithData => {
        const isObject = typeof data === "object" && data !== null;
        const dataRecord = isObject ? (data as Record<string, unknown>) : null;

        const message =
          dataRecord && typeof dataRecord.message === "string" ? dataRecord.message : undefined;

        const responseData = dataRecord && "data" in dataRecord ? dataRecord.data : data;

        return {
          success: true,
          statusCode,
          message,
          timestamp: new Date().toISOString(),
          data: responseData,
        };
      })
    );
  }
}

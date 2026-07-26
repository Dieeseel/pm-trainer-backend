import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Response as ExpressResponse } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IApiResponse } from "../interfaces/api-response.interface";

@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<ExpressResponse>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: unknown): IApiResponse<T> => {
        let message: string | undefined = undefined;
        let resultData: unknown = data;

        if (data && typeof data === "object") {
          const obj = data as Record<string, unknown>;

          if ("message" in obj && typeof obj.message === "string") {
            message = obj.message;
          }

          if (
            "data" in obj &&
            Object.keys(obj).length <= 2 &&
            ("message" in obj || "success" in obj)
          ) {
            resultData = obj.data;
          }
        }

        return {
          ok: true,
          statusCode,
          message,
          data: (resultData ?? null) as T,
          timestamp: new Date().toISOString(),
        };
      })
    );
  }
}

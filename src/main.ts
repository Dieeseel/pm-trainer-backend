import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "./exceptions/global.exception.filter";
import { HttpResponseInterceptor } from "./interceptors/http-response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

  app.useGlobalInterceptors(new HttpResponseInterceptor());

  app.enableCors();
  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

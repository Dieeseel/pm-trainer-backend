import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./filters/global.exception.filter";
import { PrismaClientExceptionFilter } from "./filters/prisma.exception.filter";
import { GlobalInterceptor } from "./interceptors/global.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new GlobalExceptionFilter(httpAdapter),
    new PrismaClientExceptionFilter(httpAdapter)
  );

  app.useGlobalInterceptors(new GlobalInterceptor());

  app.enableCors();
  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

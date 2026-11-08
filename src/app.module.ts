import { AuthenticationModule } from "@nestjs/authentication";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthModule } from "@/modules/auth/auth.module";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { UsersModule } from "@/modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthenticationModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (confgService: ConfigService) => ({
        accessToken: {
          key: confgService.getOrThrow<string>("JWT_SECRET"),
          ttl: "20s",
        },
        refreshToken: {
          key: confgService.getOrThrow<string>("JWT_REFRESH"),
          ttl: "7d",
        },
      }),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}

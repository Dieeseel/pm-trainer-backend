import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { validate, parse } from "@tma.js/init-data-node";
import { ITmaRequest } from "@/modules/auth/interfaces/jwt-payload.interface";

@Injectable()
export class TmaAuthGuard implements CanActivate {
  private readonly botToken: string;

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.get<string>("telegramBotToken")!;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ITmaRequest>();
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException("Missing Authorization header");
    }

    const [authType, initDataRaw] = authorization.split(" ");

    if (authType !== "tma" || !initDataRaw) {
      throw new UnauthorizedException('Invalid auth type. Expected "tma <raw_data>"');
    }

    try {
      validate(initDataRaw, this.botToken, { expiresIn: 86400 });
      request.tgInfo = parse(initDataRaw);

      if (!request.tgInfo.user) {
        throw new UnauthorizedException("Telegram user data is missing");
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(`TMA Validation failed: ${error.message}`);
      }
      return false;
    }
  }
}

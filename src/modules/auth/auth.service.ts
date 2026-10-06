import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { parse, validate } from "@tma.js/init-data-node";

import { UsersService } from "../users/users.service";
import { IUserData } from "./interfaces/user.data.interface";

import { errorMessages } from "@/common/constants/error-messages";

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {}

  async init(token: string | undefined) {
    const authData = this.validateData(token);
    const userData = this.extractUserData(authData);
    const user = await this.usersService.findById(userData.telegramId);

    if (!user) await this.usersService.create(userData);

    return { isNewUser: !user };
  }

  private validateData(token: string | undefined) {
    if (!token) {
      throw new UnauthorizedException(errorMessages.TELEGRAM.INIT_DATA_NOT_PROVIDED);
    }

    const [authType, authData = ""] = token.split(" ");

    if (authType !== "tma") {
      throw new ForbiddenException(errorMessages.TELEGRAM.INVALID_AUTH_HEADERS);
    }

    try {
      validate(authData, this.configService.getOrThrow<string>("BOT_TOKEN"));
    } catch (error) {
      throw new ForbiddenException(errorMessages.TELEGRAM.INVALID_INIT_DATA, {
        cause: error,
      });
    }

    return authData;
  }

  private extractUserData(authData: string): IUserData {
    try {
      const userData = parse(authData).user;

      if (!userData) throw new Error();

      return {
        telegramId: String(userData.id),
        firstName: userData.first_name,
        lastName: userData.last_name,
        photoUrl: userData.photo_url,
        username: userData.username,
      };
    } catch (error) {
      throw new ForbiddenException(errorMessages.TELEGRAM.INVALID_INIT_DATA, {
        cause: error,
      });
    }
  }
}

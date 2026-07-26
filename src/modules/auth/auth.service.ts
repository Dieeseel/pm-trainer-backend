import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InitData } from "@tma.js/init-data-node";
import { UsersService } from "../users/users.service";
import { IJwtPayload } from "./interfaces/jwt-payload.interface";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  private async generateTokens(payload: IJwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("jwtSecret"),
        expiresIn: "15m",
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("jwtRefreshSecret"),
        expiresIn: "7d",
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie("tg_refresh_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  async auth(
    userData: InitData,
    response: Response
  ): Promise<{
    accessToken: string;
    isNewUser: boolean;
  }> {
    try {
      if (!userData.user) {
        throw new BadRequestException("Не найдены данные пользователя");
      }

      const tgUserData = {
        telegramId: String(userData.user.id),
        firstName: userData.user?.first_name,
        lastName: userData.user?.last_name,
        username: userData.user?.username,
        photoUrl: userData.user?.photo_url,
      };

      let user = await this.usersService.findOne({ telegramId: tgUserData.telegramId });
      let isNewUser = false;

      if (!user) {
        user = await this.usersService.create(tgUserData);
        isNewUser = true;
      }

      const tokens = await this.generateTokens({
        sub: user.id,
        telegramId: user.telegramId,
        username: user.username,
      });

      this.setRefreshTokenCookie(response, tokens.refreshToken);
      return { accessToken: tokens.accessToken, isNewUser };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

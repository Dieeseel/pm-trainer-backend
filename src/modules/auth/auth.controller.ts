/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
import {
  Controller,
  Post,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Res,
} from "@nestjs/common";
import { TmaAuthGuard } from "@/guards/tma.guard";
import type { ITmaRequest } from "./interfaces/jwt-payload.interface";
import { AuthService } from "./auth.service";
import type { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("init")
  @HttpCode(HttpStatus.OK)
  @UseGuards(TmaAuthGuard)
  async initApp(
    @Req() request: ITmaRequest,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ accessToken: string; isNewUser: boolean }> {
    return await this.authService.auth(request.tgInfo, response);
  }
}

/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
import { Public, TokenService } from "@nestjs/authentication";
import { Body, Controller, Post, Req } from "@nestjs/common";

import { AuthService } from "./auth.service";

import type { Request } from "express";

@Public()
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  @Post()
  auth(@Req() request: Request) {
    return this.authService.auth(request.headers.authorization ?? "");
  }

  @Post("refresh")
  refreshToken(@Body("refreshToken") refreshToken: string) {
    return this.tokenService.refresh(refreshToken);
  }
}

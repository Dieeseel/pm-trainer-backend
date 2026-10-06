/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
import { Controller, Post, Req } from "@nestjs/common";

import { AuthService } from "./auth.service";

import type { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("init")
  init(@Req() request: Request) {
    return this.authService.init(request.headers.authorization ?? "");
  }
}

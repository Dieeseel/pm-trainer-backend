import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

import { IUser } from "../interfaces/user.data.interface";

import { UsersService } from "@/modules/users/users.service";

@Injectable()
export class JwtAuth extends JwtBearerProvider<IUser> {
  constructor(
    private readonly userService: UsersService,
    registry: AuthenticationRegistry
  ) {
    super({ realm: "store" });
    registry.registerProvider(this, { order: 0 });
  }

  validate({ sub }: JwtClaims) {
    return sub ? this.userService.findById(sub) : null;
  }
}

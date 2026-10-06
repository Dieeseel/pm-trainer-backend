import { Injectable } from "@nestjs/common";

import { Prisma } from "@/generated/prisma/client";
import { PrismaService } from "@/modules/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: Prisma.UserCreateInput) {
    return await this.prisma.user.create({ data: user });
  }

  async findById(telegramId: string) {
    return await this.prisma.user.findUnique({ where: { telegramId } });
  }
}

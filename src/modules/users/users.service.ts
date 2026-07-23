import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { Prisma } from "@/generated/prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: Prisma.UserCreateInput) {
    try {
      const data = await this.prisma.user.create({ data: user });
      return data;
    } catch (error) {
      throw new Error("", { cause: error });
    }
  }
}

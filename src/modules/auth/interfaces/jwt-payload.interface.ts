import { Request } from "express";
import { InitData } from "@tma.js/init-data-node";

export interface IJwtPayload {
  sub: number;
  telegramId: string;
  username: string | null;
}

export interface ITmaRequest extends Request {
  tgInfo: InitData;
}

export interface IJwtRequest extends Request {
  user: IJwtPayload;
}

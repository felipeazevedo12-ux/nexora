import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get("me")
  async getMe(
    @Req() request: Request & { user?: any },
  ) {
    return this.usersService.findById(
      request.user.id,
    );
  }

  @Patch("me")
  async updateMe(
    @Req() request: Request & { user?: any },
    @Body()
    body: {
      username?: string;
      nickname?: string | null;
      bio?: string | null;
      avatar?: string | null;
      banner?: string | null;
    },
  ) {
    return this.usersService.updateProfile(
      request.user.id,
      body,
    );
  }
}
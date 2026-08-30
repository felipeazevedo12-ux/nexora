import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { MessagesService } from "./messages.service";

@Controller("messages")
@UseGuards(JwtGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
  ) {}

  @Get("channel/:channelId")
  async findByChannel(
    @Param("channelId") channelId: string,
    @Req()
    request: Request & {
      user?: any;
    },
  ) {
    return this.messagesService.findByChannel(
      channelId,
      request.user.id,
    );
  }

  @Post("channel/:channelId")
  async create(
    @Param("channelId") channelId: string,
    @Body() body: { content: string },
    @Req()
    request: Request & {
      user?: any;
    },
  ) {
    return this.messagesService.create(
      channelId,
      request.user.id,
      body.content,
    );
  }
}
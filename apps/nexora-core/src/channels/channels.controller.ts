import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { ChannelsService } from "./channels.service";

@Controller("channels")
@UseGuards(JwtGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get("server/:serverId")
  async findByServer(
    @Param("serverId") serverId: string,
    @Req() request: Request & { user?: any },
  ) {
    return this.channelsService.findByServer(
      serverId,
      request.user.sub,
    );
  }

  @Get(":id")
  async findById(
    @Param("id") id: string,
    @Req() request: Request & { user?: any },
  ) {
    return this.channelsService.findById(
      id,
      request.user.sub,
    );
  }

  @Post("server/:serverId")
  async create(
    @Param("serverId") serverId: string,
    @Body() body: { name: string; type?: string },
    @Req() request: Request & { user?: any },
  ) {
    return this.channelsService.create(
      serverId,
      request.user.sub,
      body,
    );
  }

  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @Req() request: Request & { user?: any },
  ) {
    return this.channelsService.delete(
      id,
      request.user.sub,
    );
  }
}
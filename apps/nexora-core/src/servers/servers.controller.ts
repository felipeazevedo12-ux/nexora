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
import { ServersService } from "./servers.service";

@Controller("servers")
@UseGuards(JwtGuard)
export class ServersController {
  constructor(
    private readonly serversService: ServersService,
  ) {}

  @Get()
  async findUserServers(
    @Req() request: Request & { user?: any },
  ) {
    return this.serversService.findUserServers(
      request.user.id,
    );
  }

  @Get(":id")
  async findById(
    @Param("id") id: string,
    @Req() request: Request & { user?: any },
  ) {
    return this.serversService.findById(
      id,
      request.user.id,
    );
  }

  @Post()
  async create(
    @Body() body: {
      name: string;
      icon?: string;
    },
    @Req() request: Request & { user?: any },
  ) {
    return this.serversService.create(
      request.user.id,
      body,
    );
  }

  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @Req() request: Request & { user?: any },
  ) {
    return this.serversService.delete(
      id,
      request.user.id,
    );
  }

  /*
   * GERAR CONVITE
   *
   * POST /servers/:id/invites
   */
  @Post(":id/invites")
  async createInvite(
    @Param("id") id: string,
    @Req() request: Request & { user?: any },
  ) {
    return this.serversService.createInvite(
      id,
      request.user.id,
    );
  }

  /*
   * CONSULTAR CONVITE
   *
   * GET /servers/invites/:code
   */
  @Get("invites/:code")
  async findInvite(
    @Param("code") code: string,
  ) {
    return this.serversService.findInvite(
      code,
    );
  }

  /*
   * ENTRAR NO SERVIDOR
   *
   * POST /servers/invites/:code/join
   */
  @Post("invites/:code/join")
  async joinByInvite(
    @Param("code") code: string,
    @Req() request: Request & { user?: any },
  ) {
    return this.serversService.joinByInvite(
      code,
      request.user.id,
    );
  }
}
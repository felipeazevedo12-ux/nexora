import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class ServersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserServers(userId: string) {
    return this.prisma.servers.findMany({
      where: {
        server_members: {
          some: {
            user_id: userId,
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
      select: {
        id: true,
        name: true,
        icon: true,
        owner_id: true,
        created_at: true,
      },
    });
  }

  async findById(
    serverId: string,
    userId: string,
  ) {
    const server =
      await this.prisma.servers.findFirst({
        where: {
          id: serverId,
          server_members: {
            some: {
              user_id: userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          icon: true,
          owner_id: true,
          created_at: true,
        },
      });

    if (!server) {
      throw new NotFoundException(
        "Servidor não encontrado",
      );
    }

    return server;
  }

  async create(
    userId: string,
    data: {
      name: string;
      icon?: string;
    },
  ) {
    const name = data.name?.trim();

    if (!name) {
      throw new ForbiddenException(
        "O nome do servidor é obrigatório",
      );
    }

    if (name.length > 100) {
      throw new ForbiddenException(
        "O nome do servidor deve ter no máximo 100 caracteres",
      );
    }

    const server =
      await this.prisma.servers.create({
        data: {
          name,
          icon: data.icon ?? null,
          owner_id: userId,

          server_members: {
            create: {
              user_id: userId,
            },
          },

          channels: {
            create: {
              name: "geral",
              type: "text",
            },
          },
        },

        select: {
          id: true,
          name: true,
          icon: true,
          owner_id: true,
          created_at: true,
        },
      });

    return server;
  }

  async delete(
    serverId: string,
    userId: string,
  ) {
    const server =
      await this.prisma.servers.findUnique({
        where: {
          id: serverId,
        },
        select: {
          id: true,
          owner_id: true,
        },
      });

    if (!server) {
      throw new NotFoundException(
        "Servidor não encontrado",
      );
    }

    if (server.owner_id !== userId) {
      throw new ForbiddenException(
        "Apenas o dono pode excluir o servidor",
      );
    }

    await this.prisma.servers.delete({
      where: {
        id: serverId,
      },
    });

    return {
      message:
        "Servidor excluído com sucesso",
    };
  }

  /*
   * GERAR CONVITE
   */
  async createInvite(
    serverId: string,
    userId: string,
  ) {
    const server =
      await this.prisma.servers.findFirst({
        where: {
          id: serverId,
          server_members: {
            some: {
              user_id: userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

    if (!server) {
      throw new NotFoundException(
        "Servidor não encontrado",
      );
    }

    const code =
      randomBytes(6)
        .toString("base64url")
        .toUpperCase();

    const invite =
      await this.prisma.server_invites.create({
        data: {
          code,
          server_id: serverId,
          creator_id: userId,
        },
        select: {
          id: true,
          code: true,
          server_id: true,
          created_at: true,
          expires_at: true,
        },
      });

    return {
      ...invite,
      server: {
        id: server.id,
        name: server.name,
      },
    };
  }

  /*
   * CONSULTAR CONVITE
   */
  async findInvite(code: string) {
    const invite =
      await this.prisma.server_invites.findUnique({
        where: {
          code: code.toUpperCase(),
        },
        select: {
          id: true,
          code: true,
          created_at: true,
          expires_at: true,
          servers: {
            select: {
              id: true,
              name: true,
              icon: true,
              owner_id: true,
            },
          },
        },
      });

    if (!invite) {
      throw new NotFoundException(
        "Convite não encontrado",
      );
    }

    if (
      invite.expires_at &&
      invite.expires_at < new Date()
    ) {
      throw new ForbiddenException(
        "Este convite expirou",
      );
    }

    return invite;
  }

  /*
   * ENTRAR NO SERVIDOR ATRAVÉS DO CONVITE
   */
  async joinByInvite(
    code: string,
    userId: string,
  ) {
    const invite =
      await this.prisma.server_invites.findUnique({
        where: {
          code: code.toUpperCase(),
        },
        select: {
          server_id: true,
          expires_at: true,
          servers: {
            select: {
              id: true,
              name: true,
              icon: true,
              owner_id: true,
            },
          },
        },
      });

    if (!invite) {
      throw new NotFoundException(
        "Convite não encontrado",
      );
    }

    if (
      invite.expires_at &&
      invite.expires_at < new Date()
    ) {
      throw new ForbiddenException(
        "Este convite expirou",
      );
    }

    const existingMember =
      await this.prisma.server_members.findUnique({
        where: {
          user_id_server_id: {
            user_id: userId,
            server_id: invite.server_id,
          },
        },
      });

    if (existingMember) {
      return {
        message:
          "Você já pertence a este servidor",
        server: invite.servers,
      };
    }

    await this.prisma.server_members.create({
      data: {
        user_id: userId,
        server_id: invite.server_id,
      },
    });

    return {
      message:
        "Você entrou no servidor com sucesso",
      server: invite.servers,
    };
  }
}


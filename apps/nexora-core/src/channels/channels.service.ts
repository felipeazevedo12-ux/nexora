import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByServer(serverId: string, userId: string) {
    const member = await this.prisma.server_members.findUnique({
      where: {
        user_id_server_id: {
          user_id: userId,
          server_id: serverId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException(
        "Você não é membro deste servidor",
      );
    }

    return this.prisma.channels.findMany({
      where: {
        server_id: serverId,
      },
      orderBy: {
        created_at: "asc",
      },
    });
  }

  async findById(id: string, userId: string) {
    const channel = await this.prisma.channels.findUnique({
      where: {
        id,
      },
    });

    if (!channel) {
      throw new NotFoundException(
        "Canal não encontrado",
      );
    }

    const member = await this.prisma.server_members.findUnique({
      where: {
        user_id_server_id: {
          user_id: userId,
          server_id: channel.server_id,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException(
        "Você não é membro deste servidor",
      );
    }

    return channel;
  }

  async create(
    serverId: string,
    userId: string,
    data: {
      name: string;
      type?: string;
    },
  ) {
    const server = await this.prisma.servers.findUnique({
      where: {
        id: serverId,
      },
    });

    if (!server) {
      throw new NotFoundException(
        "Servidor não encontrado",
      );
    }

    console.log("DEBUG CHANNEL CREATE");
    console.log("serverId:", serverId);
    console.log("server.owner_id:", server.owner_id);
    console.log("userId:", userId);
    console.log(
      "iguais:",
      server.owner_id === userId,
    );

    if (server.owner_id !== userId) {
      throw new ForbiddenException(
        "Apenas o dono pode criar canais",
      );
    }

    return this.prisma.channels.create({
      data: {
        server_id: serverId,
        name: data.name,
        type: data.type ?? "text",
      },
    });
  }

  async delete(id: string, userId: string) {
    const channel = await this.prisma.channels.findUnique({
      where: {
        id,
      },
    });

    if (!channel) {
      throw new NotFoundException(
        "Canal não encontrado",
      );
    }

    const server = await this.prisma.servers.findUnique({
      where: {
        id: channel.server_id,
      },
    });

    if (!server) {
      throw new NotFoundException(
        "Servidor não encontrado",
      );
    }

    if (server.owner_id !== userId) {
      throw new ForbiddenException(
        "Apenas o dono pode excluir canais",
      );
    }

    return this.prisma.channels.delete({
      where: {
        id,
      },
    });
  }
}
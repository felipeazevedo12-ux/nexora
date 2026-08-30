import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByChannel(channelId: string, userId: string) {
    const channel = await this.prisma.channels.findUnique({
      where: {
        id: channelId,
      },
      select: {
        id: true,
        server_id: true,
      },
    });

    if (!channel) {
      throw new NotFoundException(
        "Canal não encontrado",
      );
    }

    const member =
      await this.prisma.server_members.findUnique({
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

    return this.prisma.messages.findMany({
      where: {
        channel_id: channelId,
      },
      orderBy: {
        created_at: "asc",
      },
      select: {
        id: true,
        channel_id: true,
        author_id: true,
        content: true,
        created_at: true,
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  async create(
    channelId: string,
    userId: string,
    content: string,
  ) {
    const channel =
      await this.prisma.channels.findUnique({
        where: {
          id: channelId,
        },
        select: {
          id: true,
          server_id: true,
        },
      });

    if (!channel) {
      throw new NotFoundException(
        "Canal não encontrado",
      );
    }

    const member =
      await this.prisma.server_members.findUnique({
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

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      throw new ForbiddenException(
        "A mensagem não pode estar vazia",
      );
    }

    if (trimmedContent.length > 2000) {
      throw new ForbiddenException(
        "A mensagem não pode ter mais de 2000 caracteres",
      );
    }

    return this.prisma.messages.create({
      data: {
        channel_id: channelId,
        author_id: userId,
        content: trimmedContent,
      },
      select: {
        id: true,
        channel_id: true,
        author_id: true,
        content: true,
        created_at: true,
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }
}
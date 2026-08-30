import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.users.findUnique({
      where: {
        username,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        nickname: true,
        bio: true,
        avatar: true,
        banner: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async create(data: {
    username: string;
    email: string;
    password_hash: string;
  }) {
    return this.prisma.users.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: data.password_hash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        nickname: true,
        bio: true,
        avatar: true,
        banner: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async updateProfile(
    userId: string,
    data: {
      username?: string;
      nickname?: string | null;
      bio?: string | null;
      avatar?: string | null;
      banner?: string | null;
    },
  ) {
    const updateData: {
      username?: string;
      nickname?: string | null;
      bio?: string | null;
      avatar?: string | null;
      banner?: string | null;
    } = {};

    if (data.username !== undefined) {
      const username = data.username.trim();

      if (username.length < 3 || username.length > 32) {
        throw new BadRequestException(
          "O nome de usuário deve ter entre 3 e 32 caracteres.",
        );
      }

      const existingUser =
        await this.prisma.users.findFirst({
          where: {
            username,
            NOT: {
              id: userId,
            },
          },
        });

      if (existingUser) {
        throw new BadRequestException(
          "Este nome de usuário já está em uso.",
        );
      }

      updateData.username = username;
    }

    if (data.nickname !== undefined) {
      const nickname =
        data.nickname?.trim() || null;

      if (
        nickname &&
        nickname.length > 32
      ) {
        throw new BadRequestException(
          "O nickname deve ter no máximo 32 caracteres.",
        );
      }

      updateData.nickname = nickname;
    }

    if (data.bio !== undefined) {
      const bio =
        data.bio?.trim() || null;

      if (
        bio &&
        bio.length > 500
      ) {
        throw new BadRequestException(
          "A bio deve ter no máximo 500 caracteres.",
        );
      }

      updateData.bio = bio;
    }

    if (data.avatar !== undefined) {
      updateData.avatar =
        data.avatar?.trim() || null;
    }

    if (data.banner !== undefined) {
      updateData.banner =
        data.banner?.trim() || null;
    }

    return this.prisma.users.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        nickname: true,
        bio: true,
        avatar: true,
        banner: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}
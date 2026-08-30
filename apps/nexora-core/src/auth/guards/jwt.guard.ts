import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<
        Request & {
          user?: any;
        }
      >();

    const token = request.cookies?.nexora_token;

    if (!token) {
      throw new UnauthorizedException("Token não encontrado");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const userId = payload.sub;

      if (!userId) {
        throw new UnauthorizedException("Token inválido");
      }

      const user = await this.usersService.findById(userId);

      if (!user) {
        throw new UnauthorizedException(
          "Usuário não encontrado",
        );
      }

      request.user = {
        ...user,
        sub: user.id,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        "Token inválido ou expirado",
      );
    }
  }
}
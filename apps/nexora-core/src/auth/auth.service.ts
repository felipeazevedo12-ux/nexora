import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import {
  registerSchema,
  RegisterInput,
} from "./schemas/register.schema";
import {
  loginSchema,
  LoginInput,
} from "./schemas/login.schema";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const data = registerSchema.parse(input);

    const existingEmail = await this.usersService.findByEmail(data.email);

    if (existingEmail) {
      throw new ConflictException("Email já está em uso");
    }

    const existingUsername =
      await this.usersService.findByUsername(data.username);

    if (existingUsername) {
      throw new ConflictException("Username já está em uso");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    return this.usersService.create({
      username: data.username,
      email: data.email,
      password_hash: passwordHash,
    });
  }

  async login(input: LoginInput) {
    const data = loginSchema.parse(input);

    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException("Email ou senha inválidos");
    }

    const passwordMatches = await bcrypt.compare(
      data.password,
      user.password_hash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException("Email ou senha inválidos");
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }
}
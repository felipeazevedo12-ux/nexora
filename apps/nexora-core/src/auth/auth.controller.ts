import {
  Body,
  Controller,
  Post,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() body: unknown) {
    return this.authService.register(body as any);
  }

  @Post("login")
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(body as any);

    response.cookie("nexora_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return {
      user: result.user,
    };
  }

  @Post("logout")
  async logout(
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie("nexora_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return {
      message: "Logout realizado com sucesso",
    };
  }
}
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { JwtGuard } from "../auth/guards/jwt.guard";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "7d",
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtGuard],
  exports: [UsersService],
})
export class UsersModule {}
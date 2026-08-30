import { Module } from "@nestjs/common";
import { ServersController } from "./servers.controller";
import { ServersService } from "./servers.service";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [ServersController],
  providers: [ServersService],
  exports: [ServersService],
})
export class ServersModule {}
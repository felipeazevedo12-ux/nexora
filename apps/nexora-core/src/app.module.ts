import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ServersModule } from "./servers/servers.module";
import { ChannelsModule } from "./channels/channels.module";
import { MessagesModule } from "./messages/messages.module";

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ServersModule,
    ChannelsModule,
    MessagesModule,
  ],
})
export class AppModule {}
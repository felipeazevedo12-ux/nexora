import { Module } from "@nestjs/common";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { DatabaseModule } from "../database/database.module";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [
    MessagesController,
  ],
  providers: [
    MessagesService,
  ],
})
export class MessagesModule {}
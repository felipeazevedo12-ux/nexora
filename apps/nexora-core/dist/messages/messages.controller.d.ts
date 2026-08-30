import { Request } from "express";
import { MessagesService } from "./messages.service";
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    findByChannel(channelId: string, request: Request & {
        user?: any;
    }): Promise<{
        id: string;
        created_at: Date;
        users: {
            username: string;
            id: string;
            avatar: string;
        };
        channel_id: string;
        author_id: string;
        content: string;
    }[]>;
    create(channelId: string, body: {
        content: string;
    }, request: Request & {
        user?: any;
    }): Promise<{
        id: string;
        created_at: Date;
        users: {
            username: string;
            id: string;
            avatar: string;
        };
        channel_id: string;
        author_id: string;
        content: string;
    }>;
}

import { PrismaService } from "../database/prisma.service";
export declare class MessagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByChannel(channelId: string, userId: string): Promise<{
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
    create(channelId: string, userId: string, content: string): Promise<{
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

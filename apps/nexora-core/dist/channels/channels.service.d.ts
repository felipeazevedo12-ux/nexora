import { PrismaService } from "../database/prisma.service";
export declare class ChannelsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByServer(serverId: string, userId: string): Promise<{
        type: string;
        id: string;
        created_at: Date;
        name: string;
        server_id: string;
    }[]>;
    findById(id: string, userId: string): Promise<{
        type: string;
        id: string;
        created_at: Date;
        name: string;
        server_id: string;
    }>;
    create(serverId: string, userId: string, data: {
        name: string;
        type?: string;
    }): Promise<{
        type: string;
        id: string;
        created_at: Date;
        name: string;
        server_id: string;
    }>;
    delete(id: string, userId: string): Promise<{
        type: string;
        id: string;
        created_at: Date;
        name: string;
        server_id: string;
    }>;
}

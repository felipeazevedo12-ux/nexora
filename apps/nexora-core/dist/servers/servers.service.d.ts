import { PrismaService } from "../database/prisma.service";
export declare class ServersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findUserServers(userId: string): Promise<{
        id: string;
        name: string;
        icon: string;
        owner_id: string;
        created_at: Date;
    }[]>;
    findById(serverId: string, userId: string): Promise<{
        id: string;
        name: string;
        icon: string;
        owner_id: string;
        created_at: Date;
    }>;
    create(userId: string, data: {
        name: string;
        icon?: string;
    }): Promise<{
        id: string;
        name: string;
        icon: string;
        owner_id: string;
        created_at: Date;
    }>;
    delete(serverId: string, userId: string): Promise<{
        message: string;
    }>;
    createInvite(serverId: string, userId: string): Promise<{
        server: {
            id: string;
            name: string;
        };
        id: string;
        created_at: Date;
        server_id: string;
        code: string;
        expires_at: Date;
    }>;
    findInvite(code: string): Promise<{
        servers: {
            id: string;
            name: string;
            icon: string;
            owner_id: string;
        };
        id: string;
        created_at: Date;
        code: string;
        expires_at: Date;
    }>;
    joinByInvite(code: string, userId: string): Promise<{
        message: string;
        server: {
            id: string;
            name: string;
            icon: string;
            owner_id: string;
        };
    }>;
}

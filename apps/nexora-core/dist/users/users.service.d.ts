import { PrismaService } from "../database/prisma.service";
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        username: string;
        email: string;
        id: string;
        password_hash: string;
        avatar: string | null;
        nickname: string | null;
        bio: string | null;
        banner: string | null;
        created_at: Date;
        updated_at: Date;
    }>;
    findByUsername(username: string): Promise<{
        username: string;
        email: string;
        id: string;
        password_hash: string;
        avatar: string | null;
        nickname: string | null;
        bio: string | null;
        banner: string | null;
        created_at: Date;
        updated_at: Date;
    }>;
    findById(id: string): Promise<{
        username: string;
        email: string;
        id: string;
        avatar: string;
        nickname: string;
        bio: string;
        banner: string;
        created_at: Date;
        updated_at: Date;
    }>;
    create(data: {
        username: string;
        email: string;
        password_hash: string;
    }): Promise<{
        username: string;
        email: string;
        id: string;
        avatar: string;
        nickname: string;
        bio: string;
        banner: string;
        created_at: Date;
        updated_at: Date;
    }>;
    updateProfile(userId: string, data: {
        username?: string;
        nickname?: string | null;
        bio?: string | null;
        avatar?: string | null;
        banner?: string | null;
    }): Promise<{
        username: string;
        email: string;
        id: string;
        avatar: string;
        nickname: string;
        bio: string;
        banner: string;
        created_at: Date;
        updated_at: Date;
    }>;
}

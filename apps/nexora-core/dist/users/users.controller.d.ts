import { Request } from "express";
import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(request: Request & {
        user?: any;
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
    updateMe(request: Request & {
        user?: any;
    }, body: {
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

import { Response } from "express";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: unknown): Promise<{
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
    login(body: unknown, response: Response): Promise<{
        user: {
            id: string;
            username: string;
            email: string;
            avatar: string;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}

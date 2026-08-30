import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { RegisterInput } from "./schemas/register.schema";
import { LoginInput } from "./schemas/login.schema";
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(input: RegisterInput): Promise<{
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
    login(input: LoginInput): Promise<{
        accessToken: string;
        user: {
            id: string;
            username: string;
            email: string;
            avatar: string;
            created_at: Date;
            updated_at: Date;
        };
    }>;
}

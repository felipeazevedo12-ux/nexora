import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../../users/users.service";
export declare class JwtGuard implements CanActivate {
    private readonly jwtService;
    private readonly usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

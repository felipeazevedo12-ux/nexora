"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../../users/users.service");
let JwtGuard = class JwtGuard {
    constructor(jwtService, usersService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.nexora_token;
        if (!token) {
            throw new common_1.UnauthorizedException("Token não encontrado");
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            const userId = payload.sub;
            if (!userId) {
                throw new common_1.UnauthorizedException("Token inválido");
            }
            const user = await this.usersService.findById(userId);
            if (!user) {
                throw new common_1.UnauthorizedException("Usuário não encontrado");
            }
            request.user = {
                ...user,
                sub: user.id,
            };
            return true;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException("Token inválido ou expirado");
        }
    }
};
exports.JwtGuard = JwtGuard;
exports.JwtGuard = JwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService])
], JwtGuard);
//# sourceMappingURL=jwt.guard.js.map
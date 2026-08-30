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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        return this.prisma.users.findUnique({
            where: {
                email,
            },
        });
    }
    async findByUsername(username) {
        return this.prisma.users.findUnique({
            where: {
                username,
            },
        });
    }
    async findById(id) {
        return this.prisma.users.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                username: true,
                email: true,
                nickname: true,
                bio: true,
                avatar: true,
                banner: true,
                created_at: true,
                updated_at: true,
            },
        });
    }
    async create(data) {
        return this.prisma.users.create({
            data: {
                username: data.username,
                email: data.email,
                password_hash: data.password_hash,
            },
            select: {
                id: true,
                username: true,
                email: true,
                nickname: true,
                bio: true,
                avatar: true,
                banner: true,
                created_at: true,
                updated_at: true,
            },
        });
    }
    async updateProfile(userId, data) {
        const updateData = {};
        if (data.username !== undefined) {
            const username = data.username.trim();
            if (username.length < 3 || username.length > 32) {
                throw new common_1.BadRequestException("O nome de usuário deve ter entre 3 e 32 caracteres.");
            }
            const existingUser = await this.prisma.users.findFirst({
                where: {
                    username,
                    NOT: {
                        id: userId,
                    },
                },
            });
            if (existingUser) {
                throw new common_1.BadRequestException("Este nome de usuário já está em uso.");
            }
            updateData.username = username;
        }
        if (data.nickname !== undefined) {
            const nickname = data.nickname?.trim() || null;
            if (nickname &&
                nickname.length > 32) {
                throw new common_1.BadRequestException("O nickname deve ter no máximo 32 caracteres.");
            }
            updateData.nickname = nickname;
        }
        if (data.bio !== undefined) {
            const bio = data.bio?.trim() || null;
            if (bio &&
                bio.length > 500) {
                throw new common_1.BadRequestException("A bio deve ter no máximo 500 caracteres.");
            }
            updateData.bio = bio;
        }
        if (data.avatar !== undefined) {
            updateData.avatar =
                data.avatar?.trim() || null;
        }
        if (data.banner !== undefined) {
            updateData.banner =
                data.banner?.trim() || null;
        }
        return this.prisma.users.update({
            where: {
                id: userId,
            },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                nickname: true,
                bio: true,
                avatar: true,
                banner: true,
                created_at: true,
                updated_at: true,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map
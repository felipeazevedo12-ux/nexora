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
exports.ServersService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../database/prisma.service");
let ServersService = class ServersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findUserServers(userId) {
        return this.prisma.servers.findMany({
            where: {
                server_members: {
                    some: {
                        user_id: userId,
                    },
                },
            },
            orderBy: {
                created_at: "asc",
            },
            select: {
                id: true,
                name: true,
                icon: true,
                owner_id: true,
                created_at: true,
            },
        });
    }
    async findById(serverId, userId) {
        const server = await this.prisma.servers.findFirst({
            where: {
                id: serverId,
                server_members: {
                    some: {
                        user_id: userId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                icon: true,
                owner_id: true,
                created_at: true,
            },
        });
        if (!server) {
            throw new common_1.NotFoundException("Servidor não encontrado");
        }
        return server;
    }
    async create(userId, data) {
        const name = data.name?.trim();
        if (!name) {
            throw new common_1.ForbiddenException("O nome do servidor é obrigatório");
        }
        if (name.length > 100) {
            throw new common_1.ForbiddenException("O nome do servidor deve ter no máximo 100 caracteres");
        }
        const server = await this.prisma.servers.create({
            data: {
                name,
                icon: data.icon ?? null,
                owner_id: userId,
                server_members: {
                    create: {
                        user_id: userId,
                    },
                },
                channels: {
                    create: {
                        name: "geral",
                        type: "text",
                    },
                },
            },
            select: {
                id: true,
                name: true,
                icon: true,
                owner_id: true,
                created_at: true,
            },
        });
        return server;
    }
    async delete(serverId, userId) {
        const server = await this.prisma.servers.findUnique({
            where: {
                id: serverId,
            },
            select: {
                id: true,
                owner_id: true,
            },
        });
        if (!server) {
            throw new common_1.NotFoundException("Servidor não encontrado");
        }
        if (server.owner_id !== userId) {
            throw new common_1.ForbiddenException("Apenas o dono pode excluir o servidor");
        }
        await this.prisma.servers.delete({
            where: {
                id: serverId,
            },
        });
        return {
            message: "Servidor excluído com sucesso",
        };
    }
    async createInvite(serverId, userId) {
        const server = await this.prisma.servers.findFirst({
            where: {
                id: serverId,
                server_members: {
                    some: {
                        user_id: userId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
            },
        });
        if (!server) {
            throw new common_1.NotFoundException("Servidor não encontrado");
        }
        const code = (0, crypto_1.randomBytes)(6)
            .toString("base64url")
            .toUpperCase();
        const invite = await this.prisma.server_invites.create({
            data: {
                code,
                server_id: serverId,
                creator_id: userId,
            },
            select: {
                id: true,
                code: true,
                server_id: true,
                created_at: true,
                expires_at: true,
            },
        });
        return {
            ...invite,
            server: {
                id: server.id,
                name: server.name,
            },
        };
    }
    async findInvite(code) {
        const invite = await this.prisma.server_invites.findUnique({
            where: {
                code: code.toUpperCase(),
            },
            select: {
                id: true,
                code: true,
                created_at: true,
                expires_at: true,
                servers: {
                    select: {
                        id: true,
                        name: true,
                        icon: true,
                        owner_id: true,
                    },
                },
            },
        });
        if (!invite) {
            throw new common_1.NotFoundException("Convite não encontrado");
        }
        if (invite.expires_at &&
            invite.expires_at < new Date()) {
            throw new common_1.ForbiddenException("Este convite expirou");
        }
        return invite;
    }
    async joinByInvite(code, userId) {
        const invite = await this.prisma.server_invites.findUnique({
            where: {
                code: code.toUpperCase(),
            },
            select: {
                server_id: true,
                expires_at: true,
                servers: {
                    select: {
                        id: true,
                        name: true,
                        icon: true,
                        owner_id: true,
                    },
                },
            },
        });
        if (!invite) {
            throw new common_1.NotFoundException("Convite não encontrado");
        }
        if (invite.expires_at &&
            invite.expires_at < new Date()) {
            throw new common_1.ForbiddenException("Este convite expirou");
        }
        const existingMember = await this.prisma.server_members.findUnique({
            where: {
                user_id_server_id: {
                    user_id: userId,
                    server_id: invite.server_id,
                },
            },
        });
        if (existingMember) {
            return {
                message: "Você já pertence a este servidor",
                server: invite.servers,
            };
        }
        await this.prisma.server_members.create({
            data: {
                user_id: userId,
                server_id: invite.server_id,
            },
        });
        return {
            message: "Você entrou no servidor com sucesso",
            server: invite.servers,
        };
    }
};
exports.ServersService = ServersService;
exports.ServersService = ServersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServersService);
//# sourceMappingURL=servers.service.js.map
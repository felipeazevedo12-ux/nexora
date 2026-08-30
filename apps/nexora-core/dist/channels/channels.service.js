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
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ChannelsService = class ChannelsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByServer(serverId, userId) {
        const member = await this.prisma.server_members.findUnique({
            where: {
                user_id_server_id: {
                    user_id: userId,
                    server_id: serverId,
                },
            },
        });
        if (!member) {
            throw new common_1.ForbiddenException("Você não é membro deste servidor");
        }
        return this.prisma.channels.findMany({
            where: {
                server_id: serverId,
            },
            orderBy: {
                created_at: "asc",
            },
        });
    }
    async findById(id, userId) {
        const channel = await this.prisma.channels.findUnique({
            where: {
                id,
            },
        });
        if (!channel) {
            throw new common_1.NotFoundException("Canal não encontrado");
        }
        const member = await this.prisma.server_members.findUnique({
            where: {
                user_id_server_id: {
                    user_id: userId,
                    server_id: channel.server_id,
                },
            },
        });
        if (!member) {
            throw new common_1.ForbiddenException("Você não é membro deste servidor");
        }
        return channel;
    }
    async create(serverId, userId, data) {
        const server = await this.prisma.servers.findUnique({
            where: {
                id: serverId,
            },
        });
        if (!server) {
            throw new common_1.NotFoundException("Servidor não encontrado");
        }
        console.log("DEBUG CHANNEL CREATE");
        console.log("serverId:", serverId);
        console.log("server.owner_id:", server.owner_id);
        console.log("userId:", userId);
        console.log("iguais:", server.owner_id === userId);
        if (server.owner_id !== userId) {
            throw new common_1.ForbiddenException("Apenas o dono pode criar canais");
        }
        return this.prisma.channels.create({
            data: {
                server_id: serverId,
                name: data.name,
                type: data.type ?? "text",
            },
        });
    }
    async delete(id, userId) {
        const channel = await this.prisma.channels.findUnique({
            where: {
                id,
            },
        });
        if (!channel) {
            throw new common_1.NotFoundException("Canal não encontrado");
        }
        const server = await this.prisma.servers.findUnique({
            where: {
                id: channel.server_id,
            },
        });
        if (!server) {
            throw new common_1.NotFoundException("Servidor não encontrado");
        }
        if (server.owner_id !== userId) {
            throw new common_1.ForbiddenException("Apenas o dono pode excluir canais");
        }
        return this.prisma.channels.delete({
            where: {
                id,
            },
        });
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelsService);
//# sourceMappingURL=channels.service.js.map
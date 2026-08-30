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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let MessagesService = class MessagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByChannel(channelId, userId) {
        const channel = await this.prisma.channels.findUnique({
            where: {
                id: channelId,
            },
            select: {
                id: true,
                server_id: true,
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
        return this.prisma.messages.findMany({
            where: {
                channel_id: channelId,
            },
            orderBy: {
                created_at: "asc",
            },
            select: {
                id: true,
                channel_id: true,
                author_id: true,
                content: true,
                created_at: true,
                users: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
        });
    }
    async create(channelId, userId, content) {
        const channel = await this.prisma.channels.findUnique({
            where: {
                id: channelId,
            },
            select: {
                id: true,
                server_id: true,
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
        const trimmedContent = content.trim();
        if (!trimmedContent) {
            throw new common_1.ForbiddenException("A mensagem não pode estar vazia");
        }
        if (trimmedContent.length > 2000) {
            throw new common_1.ForbiddenException("A mensagem não pode ter mais de 2000 caracteres");
        }
        return this.prisma.messages.create({
            data: {
                channel_id: channelId,
                author_id: userId,
                content: trimmedContent,
            },
            select: {
                id: true,
                channel_id: true,
                author_id: true,
                content: true,
                created_at: true,
                users: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map
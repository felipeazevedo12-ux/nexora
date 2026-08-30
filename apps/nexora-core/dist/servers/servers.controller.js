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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const servers_service_1 = require("./servers.service");
let ServersController = class ServersController {
    constructor(serversService) {
        this.serversService = serversService;
    }
    async findUserServers(request) {
        return this.serversService.findUserServers(request.user.id);
    }
    async findById(id, request) {
        return this.serversService.findById(id, request.user.id);
    }
    async create(body, request) {
        return this.serversService.create(request.user.id, body);
    }
    async delete(id, request) {
        return this.serversService.delete(id, request.user.id);
    }
    async createInvite(id, request) {
        return this.serversService.createInvite(id, request.user.id);
    }
    async findInvite(code) {
        return this.serversService.findInvite(code);
    }
    async joinByInvite(code, request) {
        return this.serversService.joinByInvite(code, request.user.id);
    }
};
exports.ServersController = ServersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServersController.prototype, "findUserServers", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServersController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ServersController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServersController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(":id/invites"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServersController.prototype, "createInvite", null);
__decorate([
    (0, common_1.Get)("invites/:code"),
    __param(0, (0, common_1.Param)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServersController.prototype, "findInvite", null);
__decorate([
    (0, common_1.Post)("invites/:code/join"),
    __param(0, (0, common_1.Param)("code")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServersController.prototype, "joinByInvite", null);
exports.ServersController = ServersController = __decorate([
    (0, common_1.Controller)("servers"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [servers_service_1.ServersService])
], ServersController);
//# sourceMappingURL=servers.controller.js.map
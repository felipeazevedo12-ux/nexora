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
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const channels_service_1 = require("./channels.service");
let ChannelsController = class ChannelsController {
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    async findByServer(serverId, request) {
        return this.channelsService.findByServer(serverId, request.user.sub);
    }
    async findById(id, request) {
        return this.channelsService.findById(id, request.user.sub);
    }
    async create(serverId, body, request) {
        return this.channelsService.create(serverId, request.user.sub, body);
    }
    async delete(id, request) {
        return this.channelsService.delete(id, request.user.sub);
    }
};
exports.ChannelsController = ChannelsController;
__decorate([
    (0, common_1.Get)("server/:serverId"),
    __param(0, (0, common_1.Param)("serverId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "findByServer", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)("server/:serverId"),
    __param(0, (0, common_1.Param)("serverId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "delete", null);
exports.ChannelsController = ChannelsController = __decorate([
    (0, common_1.Controller)("channels"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService])
], ChannelsController);
//# sourceMappingURL=channels.controller.js.map
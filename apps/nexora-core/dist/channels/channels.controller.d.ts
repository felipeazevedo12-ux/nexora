import { Request } from "express";
import { ChannelsService } from "./channels.service";
export declare class ChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
    findByServer(serverId: string, request: Request & {
        user?: any;
    }): Promise<{
        type: string;
        id: string;
        created_at: Date;
        name: string;
        server_id: string;
    }[]>;
    findById(id: string, request: Request & {
        user?: any;
    }): Promise<{
        type: string;
        id: string;
        created_at: Date;
        name: string;
        server_id: string;
    }>;
    create(serverId: string, body: {
        name: string;
        type?: string;
    }, request: Request & {
        user?: any;
    }): Promise<{
        type: string;
        id: string;
        created_at: Date;
        name: string;
        server_id: string;
    }>;
    delete(id: string, request: Request & {
        user?: any;
    }): Promise<{
        type: string;
        id: string;
        created_at: Date;
        name: string;
        server_id: string;
    }>;
}

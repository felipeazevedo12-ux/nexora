import { Request } from "express";
import { ServersService } from "./servers.service";
export declare class ServersController {
    private readonly serversService;
    constructor(serversService: ServersService);
    findUserServers(request: Request & {
        user?: any;
    }): Promise<{
        id: string;
        created_at: Date;
        name: string;
        icon: string;
        owner_id: string;
    }[]>;
    findById(id: string, request: Request & {
        user?: any;
    }): Promise<{
        id: string;
        created_at: Date;
        name: string;
        icon: string;
        owner_id: string;
    }>;
    create(body: {
        name: string;
        icon?: string;
    }, request: Request & {
        user?: any;
    }): Promise<{
        id: string;
        created_at: Date;
        name: string;
        icon: string;
        owner_id: string;
    }>;
    delete(id: string, request: Request & {
        user?: any;
    }): Promise<{
        message: string;
    }>;
    createInvite(id: string, request: Request & {
        user?: any;
    }): Promise<{
        server: {
            id: string;
            name: string;
        };
        id: string;
        created_at: Date;
        server_id: string;
        code: string;
        expires_at: Date;
    }>;
    findInvite(code: string): Promise<{
        id: string;
        created_at: Date;
        servers: {
            id: string;
            name: string;
            icon: string;
            owner_id: string;
        };
        code: string;
        expires_at: Date;
    }>;
    joinByInvite(code: string, request: Request & {
        user?: any;
    }): Promise<{
        message: string;
        server: {
            id: string;
            name: string;
            icon: string;
            owner_id: string;
        };
    }>;
}

import { REST } from "@discordjs/rest";
import { RESTGetAPICurrentUserConnectionsResult, RESTGetAPICurrentUserGuildsResult, RESTGetAPIOAuth2CurrentAuthorizationResult, RESTGetAPIUserResult } from "discord-api-types/v10";
import { MetaDataTypes } from "../Util/Constants";
import { Authorization } from "./Authorization";
import { DataBaseProvider, TokenStorage } from "./TokenStorage";
export declare class Application {
    token: string;
    id: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string[];
    rest: REST;
    authorization: Authorization;
    tokenStorage: TokenStorage;
    constructor(options: {
        token: string;
        id: string;
        clientSecret: string;
        redirectUri: string;
        scopes?: string[];
        databaseProvider?: DataBaseProvider;
    });
    registerMetaData(metadata: ApplicationMetaData[]): Promise<unknown>;
    getUserMetaData(userId: string): Promise<unknown>;
    setUserMetaData(userId: string, platformName: string, metadata: {
        [key: string]: string;
    }): Promise<unknown>;
    fetchUserAfterAuth(userId: string, access_token?: string): Promise<RESTGetAPIOAuth2CurrentAuthorizationResult>;
    fetchUser(userId: string, scope?: string, access_token?: string): Promise<RESTGetAPIUserResult>;
    fetchUserGuilds(userId: string, access_token?: string): Promise<RESTGetAPICurrentUserGuildsResult>;
    fetchUserConnections(userId: string, access_token?: string): Promise<RESTGetAPICurrentUserConnectionsResult>;
    fetchUserGuildMember(userId: string, guildId: string, access_token?: string): Promise<import("discord-api-types/v10").APIGuildMember>;
}
export interface ApplicationMetaData {
    key: string;
    name: string;
    description: string;
    type: typeof MetaDataTypes;
}
//# sourceMappingURL=Application.d.ts.map
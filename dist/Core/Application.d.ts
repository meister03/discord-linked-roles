import { REST } from "@discordjs/rest";
import { RESTGetAPIUserResult } from "discord-api-types/v10";
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
    fetchUser(userId: string, access_token?: string): Promise<RESTGetAPIUserResult>;
    fetchGuilds(userId: string, access_token?: string): Promise<any>;
}
export interface ApplicationMetaData {
    key: string;
    name: string;
    description: string;
    type: typeof MetaDataTypes;
}
//# sourceMappingURL=Application.d.ts.map
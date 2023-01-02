import { REST } from "@discordjs/rest";
import { RESTGetAPICurrentUserConnectionsResult, RESTGetAPICurrentUserGuildsResult, RESTGetAPIGuildMemberResult, RESTGetAPIOAuth2CurrentAuthorizationResult, RESTGetAPIUserResult, Routes } from "discord-api-types/v10";
import { DiscordConstants, MetaDataTypes, defaultScopes } from "../Util/Constants";
import { Authorization } from "./Authorization";
import { DataBaseProvider, TokenStorage } from "./TokenStorage";
import { MapProvider } from "../DatabaseProviders/mapstorage";

export class Application {
    token: string;
    id: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string[];
    rest: REST;
    authorization: Authorization;
    tokenStorage: TokenStorage;
    constructor(options: { token: string; id: string; clientSecret: string; redirectUri: string; scopes?: string[]; databaseProvider?: DataBaseProvider; }) {
        this.token = options.token;
        this.id = options.id;
        this.clientSecret = options.clientSecret;
        this.redirectUri = options.redirectUri;
        this.scopes = options.scopes || defaultScopes;

        if (!this.token) throw new Error('A token is required in the application options');
        if (!this.id) throw new Error('A application id is required in the application options');
        if (!this.clientSecret) throw new Error('A client secret is required in the application options');
        if (!this.redirectUri) throw new Error('A redirect uri is required in the application options');

        if (this.scopes.length < 1) throw new Error('At least one scope is required in the application options');

        this.rest = new REST({ version: DiscordConstants.http.version }).setToken(this.token);
        this.authorization = new Authorization(this);
        this.tokenStorage = new TokenStorage(options.databaseProvider as DataBaseProvider || new MapProvider());
    }

    async registerMetaData(metadata: ApplicationMetaData[]) {
        if (!metadata) throw new Error('Metadata is required to register it in the application.');
        if (metadata.length < 1) throw new Error('At least one metadata is required to register it in the application.');
        if (metadata.length > 5) throw new Error('You can only register 5 metadata fields in the application.');
        return this.rest.put(Routes.applicationRoleConnectionMetadata(this.id), {
            headers: {
                'Content-Type': 'application/json'
            },
            body: metadata
        });
    }

    async getUserMetaData(userId: string) {
        const tokens = await this.tokenStorage.get(userId);
        if(!tokens) throw new Error('No tokens found for the user');
        return this.rest.get(Routes.userApplicationRoleConnection(this.id), {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            },
            auth: false
        });
    };

    async setUserMetaData(userId: string, platformName: string, metadata: { [key: string]: string }) {
        const tokens = await this.tokenStorage.get(userId);
        if(!tokens) throw new Error('No tokens found for the user');
        return this.rest.put(Routes.userApplicationRoleConnection(this.id), {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                'Content-Type': 'application/json'
            },
            body: {
                platform_name: platformName,
                metadata: metadata
            },
            auth: false
        });
    };

    async fetchUserAfterAuth(userId: string, access_token?: string): Promise<RESTGetAPIOAuth2CurrentAuthorizationResult> {
        let tokens = await this.tokenStorage.get(userId);
        if(!tokens && !access_token) throw new Error('No tokens found for the user');
        if(!tokens && access_token) tokens = { access_token: access_token, refresh_token: '' } as any;
        return this.rest.get(Routes.oauth2CurrentAuthorization(), {
            headers: {
                Authorization: `Bearer ${tokens?.access_token}`
            },
            auth: false,
        }) as any;
    }

    async fetchUser(userId: string, scope?: string, access_token?: string ): Promise<RESTGetAPIUserResult>{
        let tokens = await this.tokenStorage.get(userId);
        if(!tokens && !access_token) throw new Error('No tokens found for the user');
        if(!tokens && access_token) tokens = { access_token: access_token, refresh_token: '' } as any;

        const url = scope ? Routes.user('@me') + `/${scope}` : Routes.user('@me');

        return this.rest.get(url as any, {
            headers: {
                Authorization: `Bearer ${tokens?.access_token}`
            },
            auth: false,
        }) as any;
    }

    async fetchUserGuilds(userId: string, access_token?: string) {
        if(!this.scopes.includes("guilds")) throw new Error(`The guilds scope is required to for this operation.`);
        return this.fetchUser(userId, 'guilds', access_token) as unknown as Promise<RESTGetAPICurrentUserGuildsResult>
    }

    async fetchUserConnections(userId: string, access_token?: string) {
        if(!this.scopes.includes("connections")) throw new Error(`The connections scope is required to for this operation.`);
        return this.fetchUser(userId, 'connections', access_token) as unknown as Promise<RESTGetAPICurrentUserConnectionsResult>
    }

    async fetchUserGuildMember(userId: string, guildId: string, access_token?: string) {
        if(!this.scopes.includes("guilds.members.read")) throw new Error(`The guilds.members.read scope is required to for this operation.`);

        let tokens = await this.tokenStorage.get(userId);
        if(!tokens && !access_token) throw new Error('No tokens found for the user');
        if(!tokens && access_token) tokens = { access_token: access_token, refresh_token: '' } as any;

        return this.fetchUser(userId, `guilds/${guildId}/member`, access_token) as unknown as Promise<RESTGetAPIGuildMemberResult>
    }
}

export interface ApplicationMetaData {
    key: string;
    name: string;
    description: string;
    type: typeof MetaDataTypes;
}
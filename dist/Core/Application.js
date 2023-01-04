"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
const Constants_1 = require("../Util/Constants");
const Authorization_1 = require("./Authorization");
const TokenStorage_1 = require("./TokenStorage");
const mapstorage_1 = require("../DatabaseProviders/mapstorage");
class Application {
    token;
    id;
    clientSecret;
    redirectUri;
    scopes;
    rest;
    authorization;
    tokenStorage;
    constructor(options) {
        this.token = options.token;
        this.id = options.id;
        this.clientSecret = options.clientSecret;
        this.redirectUri = options.redirectUri;
        this.scopes = options.scopes || Constants_1.defaultScopes;
        if (!this.token)
            throw new Error('A token is required in the application options');
        if (!this.id)
            throw new Error('A application id is required in the application options');
        if (!this.clientSecret)
            throw new Error('A client secret is required in the application options');
        if (!this.redirectUri)
            throw new Error('A redirect uri is required in the application options');
        if (this.scopes.length < 1)
            throw new Error('At least one scope is required in the application options');
        this.rest = new rest_1.REST({ version: Constants_1.DiscordConstants.http.version }).setToken(this.token);
        this.authorization = new Authorization_1.Authorization(this);
        const provider = options.databaseProvider || new mapstorage_1.MapProvider();
        this.tokenStorage = new TokenStorage_1.TokenStorage(provider);
    }
    async registerMetaData(metadata) {
        if (!metadata)
            throw new Error('Metadata is required to register it in the application.');
        if (metadata.length < 1)
            throw new Error('At least one metadata is required to register it in the application.');
        if (metadata.length > 5)
            throw new Error('You can only register 5 metadata fields in the application.');
        return this.rest.put(v10_1.Routes.applicationRoleConnectionMetadata(this.id), {
            headers: {
                'Content-Type': 'application/json'
            },
            body: metadata
        });
    }
    async getUserMetaData(userId) {
        const access_token = await this.authorization.getAccessToken(userId);
        if (!access_token)
            throw new Error('No access_token found for the user');
        return this.rest.get(v10_1.Routes.userApplicationRoleConnection(this.id), {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            auth: false
        });
    }
    ;
    async setUserMetaData(userId, platformName, metadata) {
        const access_token = await this.authorization.getAccessToken(userId);
        if (!access_token)
            throw new Error('No tokens found for the user');
        return this.rest.put(v10_1.Routes.userApplicationRoleConnection(this.id), {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: {
                platform_name: platformName,
                metadata: metadata
            },
            auth: false
        });
    }
    ;
    async fetchUserAfterAuth(userId, access_token) {
        let accessToken = await this.authorization.getAccessToken(userId);
        if (!accessToken && !access_token)
            throw new Error('No tokens found for the user');
        if (!accessToken && access_token)
            accessToken = access_token;
        return this.rest.get(v10_1.Routes.oauth2CurrentAuthorization(), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            auth: false,
        });
    }
    async fetchUser(userId, scope, access_token) {
        let accessToken = await this.authorization.getAccessToken(userId);
        if (!accessToken && !access_token)
            throw new Error('No tokens found for the user');
        if (!accessToken && access_token)
            accessToken = access_token;
        const url = scope ? v10_1.Routes.user('@me') + `/${scope}` : v10_1.Routes.user('@me');
        return this.rest.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            auth: false,
        });
    }
    async fetchUserGuilds(userId, access_token) {
        if (!this.scopes.includes("guilds"))
            throw new Error(`The guilds scope is required to for this operation.`);
        return this.fetchUser(userId, 'guilds', access_token);
    }
    async fetchUserConnections(userId, access_token) {
        if (!this.scopes.includes("connections"))
            throw new Error(`The connections scope is required to for this operation.`);
        return this.fetchUser(userId, 'connections', access_token);
    }
    async fetchUserGuildMember(userId, guildId, access_token) {
        if (!this.scopes.includes("guilds.members.read"))
            throw new Error(`The guilds.members.read scope is required to for this operation.`);
        return this.fetchUser(userId, `guilds/${guildId}/member`, access_token);
    }
}
exports.Application = Application;

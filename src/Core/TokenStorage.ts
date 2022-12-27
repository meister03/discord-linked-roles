import { OAuthTokens } from "../Util/Constants";

export class TokenStorage {
    provider: DataBaseProvider;
    tokens: Map<string, OAuthTokens>;
    constructor(provider: DataBaseProvider) {
        this.provider = provider;
        this.tokens = new Map();
    }

    async get(userId: string){
        if(!this.tokens.has(userId)){
            const token = await this.provider.fetchUser(userId);
            if(token) this.tokens.set(userId, token);
        }
        return this.tokens.get(userId);
    }

    async set(userId: string, token: OAuthTokens){
        this.tokens.set(userId, token);
        await this.provider.createOrUpdate(userId, token);
    }

    async delete(userId: string){
        this.tokens.delete(userId);
        await this.provider.deleteUser(userId);
    }

    async getAllUsers(){
        return this.provider.findAll();
    }
}

export type DataBaseProvider = {
    findAll(): Promise<{tokens: OAuthTokens, id: string}>;
    // Gets the token for the user
    fetchUser: (userId: string) => Promise<OAuthTokens | undefined>;
    createOrUpdate: (userId: string, token: OAuthTokens) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
};
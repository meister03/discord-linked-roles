import { OAuthTokens } from "../Util/Constants";
export declare class TokenStorage {
    provider: DataBaseProvider;
    tokens: Map<string, OAuthTokens>;
    constructor(provider: DataBaseProvider);
    get(userId: string): Promise<OAuthTokens | undefined>;
    set(userId: string, token: OAuthTokens): Promise<void>;
    delete(userId: string): Promise<void>;
    getAllUsers(): Promise<{
        tokens: OAuthTokens;
        id: string;
    }>;
}
export declare type DataBaseProvider = {
    findAll(): Promise<{
        tokens: OAuthTokens;
        id: string;
    }>;
    fetchUser: (userId: string) => Promise<OAuthTokens | undefined>;
    createOrUpdate: (userId: string, token: OAuthTokens) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
};
//# sourceMappingURL=TokenStorage.d.ts.map
import { OAuthTokens } from "../Util/Constants";
export declare class MapProvider {
    tokens: Map<string, OAuthTokens>;
    constructor();
    fetchUser(userId: string): Promise<OAuthTokens | undefined>;
    createOrUpdate(userId: string, tokens: OAuthTokens): Promise<OAuthTokens>;
    deleteUser(userId: string): Promise<boolean>;
    findAll(): Promise<{
        id: string;
        tokens: OAuthTokens;
    }[]>;
}
//# sourceMappingURL=mapstorage.d.ts.map
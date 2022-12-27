export declare const defaultScopes: string[];
export declare const DiscordConstants: {
    http: {
        version: string;
    };
};
export declare const OAuthGetTokenEndpoint = "https://discord.com/api/v10/oauth2/token";
export declare enum MetaDataTypes {
    INTEGER_LESS_THAN_OR_EQUAL = 1,
    INTEGER_GREATER_THAN_OR_EQUAL = 2,
    INTEGER_EQUAL = 3,
    INTEGER_NOT_EQUAL = 4,
    DATETIME_LESS_THAN_OR_EQUAL = 5,
    DATETIME_GREATER_THAN_OR_EQUAL = 6,
    BOOLEAN_EQUAL = 7,
    BOOLEAN_NOT_EQUAL = 8
}
export interface OAuthTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}
//# sourceMappingURL=Constants.d.ts.map
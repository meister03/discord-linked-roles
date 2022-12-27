import type { Application } from './Application';
import { OAuthTokens } from '../Util/Constants';
export declare class Authorization {
    application: Application;
    constructor(application: Application);
    getOAuthUrl(): {
        state: string;
        url: string;
    };
    getOAuthTokens(code: string): Promise<OAuthTokens>;
    getUserAndStoreToken(code: string): Promise<import("discord-api-types/v10").APIUser>;
    getAccessToken(userId: string): Promise<any>;
    setCookieAndRedirect(req: any, res: any): any;
    checkCookieAndReturnCode(req: any, res: any): any;
}
//# sourceMappingURL=Authorization.d.ts.map
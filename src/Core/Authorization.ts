import crypto from 'crypto';
import { Routes } from 'discord-api-types/v10';
import type { Application } from './Application';
import { OAuthTokens } from '../Util/Constants';
export class Authorization {
    application: Application;
    constructor(application: Application) {
        this.application = application
    }
    getOAuthUrl() {
        const state = crypto.randomUUID();

        const url = new URL('https://discord.com/api/oauth2/authorize');
        url.searchParams.set('client_id', this.application.id);
        url.searchParams.set('redirect_uri', this.application.redirectUri);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('state', state);
        url.searchParams.set('scope', this.application.scopes.join(' '));
        url.searchParams.set('prompt', 'consent');
        return { state, url: url.toString() };
    }

    async getOAuthTokens(code: string): Promise<OAuthTokens> {
        const body = new URLSearchParams({
            client_id: this.application.id,
            client_secret: this.application.clientSecret,
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.application.redirectUri,
        });
        return this.application.rest.post(Routes.oauth2TokenExchange(), {
            body,
            passThroughBody: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }) as Promise<OAuthTokens>;
    }

    async getUserAndStoreToken(code: string) {
        const tokens = await this.getOAuthTokens(code);
        const data = await this.application.fetchUserAfterAuth(null as any, tokens.access_token);
        this.application.tokenStorage.set(data.user?.id as string, tokens);
        return data;
    }

    async checkRequiredScopesPresent(scopes: string[]) {
        if (this.application.scopes.some(scope => !scopes.includes(scope as any))) {
            return false;
        }
        return true;
    }

    async getAccessToken(userId: string) {
        const tokens = await this.application.tokenStorage.get(userId);
        if (!tokens) return null;
        if (tokens.expires_at < Date.now()) {
            const body = new URLSearchParams({
                client_id: this.application.id,
                client_secret: this.application.clientSecret,
                grant_type: 'refresh_token',
                refresh_token: tokens.refresh_token,
            });
            const response: any = await this.application.rest.post(Routes.oauth2TokenExchange() as any, {
                body,
                passThroughBody: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (response) {
                const tokens = response;
                tokens.expires_at = Date.now() + tokens.expires_in * 1000;

                // Store Tokens
                this.application.tokenStorage.set(userId, tokens);
                return tokens.access_token;
            } else {
                throw new Error(`Error refreshing access token: [${response.status}] ${response.statusText}`);
            }
        }
        return tokens.access_token;
    }

    setCookieAndRedirect(req: any, res: any) {
        const { state, url } = this.getOAuthUrl();
        // Store the signed state param in the user's cookies so we can verify
        // the value later. See:
        // https://discord.com/developers/docs/topics/oauth2#state-and-security
        res.cookie('clientState', state, { maxAge: 1000 * 60 * 5, signed: true });
        return res.redirect(url);
    }

    checkCookieAndReturnCode(req: any, res: any) {
        const code = req.query['code'];
        const discordState = req.query['state'];
        
        // make sure the state parameter exists
        const { clientState } = req.signedCookies;
        if (clientState !== discordState) {
            return null;
        }
        return code;
    }
}
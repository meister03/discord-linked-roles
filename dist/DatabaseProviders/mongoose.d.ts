import mongoose from 'mongoose';
import { OAuthTokens } from '../Util/Constants';
export declare const UserModel: mongoose.Model<{
    id?: string | undefined;
    tokens?: {
        access_token?: string | undefined;
        refresh_token?: string | undefined;
        expires_at?: number | undefined;
    } | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    id?: string | undefined;
    tokens?: {
        access_token?: string | undefined;
        refresh_token?: string | undefined;
        expires_at?: number | undefined;
    } | undefined;
}>>;
export declare class MongooseProvider {
    constructor(mongoUri: string);
    fetchUser(userId: string): Promise<{
        access_token?: string | undefined;
        refresh_token?: string | undefined;
        expires_at?: number | undefined;
    } | undefined>;
    createOrUpdate(userId: string, tokens: OAuthTokens): Promise<OAuthTokens>;
    deleteUser(userId: string): Promise<import("mongodb").DeleteResult>;
    findAll(): Promise<(mongoose.Document<unknown, any, {
        id?: string | undefined;
        tokens?: {
            access_token?: string | undefined;
            refresh_token?: string | undefined;
            expires_at?: number | undefined;
        } | undefined;
    }> & {
        id?: string | undefined;
        tokens?: {
            access_token?: string | undefined;
            refresh_token?: string | undefined;
            expires_at?: number | undefined;
        } | undefined;
    } & {
        _id: mongoose.Types.ObjectId;
    })[]>;
}
//# sourceMappingURL=mongoose.d.ts.map
import mongoose from 'mongoose';
import { OAuthTokens } from '../Util/Constants';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String,
    tokens: {
        access_token: String,
        refresh_token: String,
        expires_at: Number,
    }
});

export const UserModel = mongoose.model('userTokens', userSchema);

export class MongooseProvider {
    constructor(mongoUri: string){
        mongoose.connect(mongoUri);
    }

    async fetchUser(userId: string){
        const user = await UserModel.findOne({ id: userId });
        if(!user) return undefined;
        return user.tokens;
    }

    async createOrUpdate(userId: string, tokens: OAuthTokens){
        // Check if user exits
        const user = await UserModel.findOne({ id: userId });
        if(!user){
            // Create new user
            const newUser = new UserModel({
                id: userId,
                tokens: tokens
            });
            await newUser.save();
        } else {
            // Update user
            user.tokens = tokens;
            await user.save();
        }
        return tokens;
    }

    async deleteUser(userId: string){
        return UserModel.deleteOne({
            id: userId
        });
    }

    async findAll(){
        return UserModel.find();
    }
}
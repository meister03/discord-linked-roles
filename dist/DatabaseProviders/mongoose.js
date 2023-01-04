"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseProvider = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    id: String,
    tokens: {
        access_token: String,
        refresh_token: String,
        expires_at: Number,
    }
});
exports.UserModel = mongoose_1.default.model('userTokens', userSchema);
class MongooseProvider {
    constructor(mongoUri) {
        mongoose_1.default.connect(mongoUri);
    }
    async fetchUser(userId) {
        const user = await exports.UserModel.findOne({ id: userId });
        if (!user)
            return undefined;
        return user.tokens;
    }
    async createOrUpdate(userId, tokens) {
        // Check if user exits
        const user = await exports.UserModel.findOne({ id: userId });
        if (!user) {
            // Create new user
            const newUser = new exports.UserModel({
                id: userId,
                tokens: tokens
            });
            await newUser.save();
        }
        else {
            // Update user
            user.tokens = tokens;
            await user.save();
        }
        return tokens;
    }
    async deleteUser(userId) {
        return exports.UserModel.deleteOne({
            id: userId
        });
    }
    async findAll() {
        return exports.UserModel.find();
    }
}
exports.MongooseProvider = MongooseProvider;

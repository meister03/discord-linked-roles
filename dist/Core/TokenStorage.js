"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenStorage = void 0;
class TokenStorage {
    provider;
    tokens;
    constructor(provider) {
        this.provider = provider;
        this.tokens = new Map();
    }
    async get(userId) {
        if (!this.tokens.has(userId)) {
            const token = await this.provider.fetchUser(userId);
            if (token)
                this.tokens.set(userId, token);
        }
        return this.tokens.get(userId);
    }
    async set(userId, token) {
        this.tokens.set(userId, token);
        await this.provider.createOrUpdate(userId, token);
    }
    async delete(userId) {
        this.tokens.delete(userId);
        await this.provider.deleteUser(userId);
    }
    async getAllUsers() {
        return this.provider.findAll();
    }
}
exports.TokenStorage = TokenStorage;

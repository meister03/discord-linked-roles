"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapProvider = void 0;
class MapProvider {
    tokens;
    constructor() {
        this.tokens = new Map();
    }
    async fetchUser(userId) {
        return this.tokens.get(userId);
    }
    async createOrUpdate(userId, tokens) {
        this.tokens.set(userId, tokens);
        return tokens;
    }
    async deleteUser(userId) {
        this.tokens.delete(userId);
        return true;
    }
    async findAll() {
        // Create an array in this foram to match the mongoose provider
        const newArray = [];
        for (const [key, value] of this.tokens) {
            newArray.push({
                id: key,
                tokens: value
            });
        }
        return newArray;
    }
}
exports.MapProvider = MapProvider;

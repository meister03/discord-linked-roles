import { OAuthTokens } from "../Util/Constants";

export class MapProvider {
    tokens: Map<string, OAuthTokens>;
    constructor() {
        this.tokens = new Map();
    }
    async fetchUser(userId: string){
        return this.tokens.get(userId);
    }
    async createOrUpdate(userId: string, tokens: OAuthTokens){
        this.tokens.set(userId, tokens);
        return tokens;
    }
    async deleteUser(userId: string){
        this.tokens.delete(userId);
        return true;
    }

    async findAll(){
        // Create an array in this foram to match the mongoose provider
        const newArray = [];
        for(const [key, value] of this.tokens){
            newArray.push({
                id: key,
                tokens: value
            });
        }
        return newArray;
    }
}
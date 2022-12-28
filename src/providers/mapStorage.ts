import { Snowflake } from "discord-api-types/globals";
import { OAuthTokens } from "types/OAuthTokens";

export class MapProvider {
  tokens: Map<string, OAuthTokens>;
  constructor() {
    this.tokens = new Map();
  }
  async fetchUser(userId: Snowflake) {
    return this.tokens.get(userId);
  }
  async createOrUpdate(userId: Snowflake, tokens: OAuthTokens) {
    this.tokens.set(userId, tokens);
    return tokens;
  }
  async deleteUser(userId: Snowflake) {
    this.tokens.delete(userId);
    return true;
  }

  async findAll() {
    return Object.entries(this.tokens).map(([value, key]) => ({
      id: key,
      tokens: value,
    }));
  }
}

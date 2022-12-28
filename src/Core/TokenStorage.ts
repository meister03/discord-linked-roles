import { Snowflake } from "discord-api-types/globals";
import { OAuthTokens } from "types/OAuthTokens";

export class TokenStorage {
  provider: DatabaseProvider;
  tokens: Map<string, OAuthTokens>;

  constructor(provider: DatabaseProvider) {
    this.provider = provider;
    this.tokens = new Map();
  }

  async get(userId: Snowflake) {
    if (!this.tokens.has(userId)) {
      const token = await this.provider.fetchUser(userId);
      if (token) this.tokens.set(userId, token);
    }
    return this.tokens.get(userId);
  }

  async set(userId: Snowflake, token: OAuthTokens) {
    this.tokens.set(userId, token);
    await this.provider.createOrUpdate(userId, token);
  }

  async delete(userId: Snowflake) {
    this.tokens.delete(userId);
    await this.provider.deleteUser(userId);
  }

  async getAllUsers() {
    return this.provider.findAll();
  }
}

export type DatabaseProvider = {
  findAll(): Promise<{ tokens: OAuthTokens; id: string }>;
  // Gets the token for the user
  fetchUser: (userId: Snowflake) => Promise<OAuthTokens | undefined>;
  createOrUpdate: (userId: Snowflake, token: OAuthTokens) => Promise<void>;
  deleteUser: (userId: Snowflake) => Promise<void>;
};

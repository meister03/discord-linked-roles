import { REST } from "@discordjs/rest";
import {
  RESTGetAPIUserResult,
  Routes,
  Snowflake,
  GatewayVersion,
} from "discord-api-types/v10";
import { defaultScopes } from "constants/discord";
import { Authorization } from "core/Authorization";
import { DatabaseProvider, TokenStorage } from "core/TokenStorage";
import { MapProvider } from "providers/mapStorage";
import { MetadataTypes } from "types/MetadataTypes";

export class Application {
  token: string;
  id: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  rest: REST;
  authorization: Authorization;
  tokenStorage: TokenStorage;

  constructor(options: {
    token: string;
    id: string;
    clientSecret: string;
    redirectUri: string;
    scopes?: string[];
    databaseProvider?: DatabaseProvider;
  }) {
    this.token = options.token;
    this.id = options.id;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
    this.scopes = options.scopes || defaultScopes;

    if (!this.token)
      throw new Error("A token is required in the application options");
    if (!this.id)
      throw new Error(
        "A application ID is required in the application options"
      );
    if (!this.clientSecret)
      throw new Error("A client secret is required in the application options");
    if (!this.redirectUri)
      throw new Error("A redirect URI is required in the application options");

    if (this.scopes.length < 1)
      throw new Error(
        "At least one scope is required in the application options"
      );

    this.rest = new REST({ version: GatewayVersion }).setToken(this.token);
    this.authorization = new Authorization(this);
    this.tokenStorage = new TokenStorage(
      (options.databaseProvider as DatabaseProvider) || new MapProvider()
    );
  }

  async registerMetadata(metadata: ApplicationMetadata[]) {
    if (!metadata)
      throw new Error(
        "Metadata is required to register it in the application."
      );
    if (metadata.length < 1)
      throw new Error(
        "At least one metadata is required to register it in the application."
      );
    if (metadata.length > 5)
      throw new Error(
        "You can only register 5 metadata fields in the application."
      );
    return this.rest.put(Routes.applicationRoleConnectionMetadata(this.id), {
      headers: {
        "Content-Type": "application/json",
      },
      body: metadata,
    });
  }

  async getUserMetadata(userId: Snowflake) {
    const tokens = await this.tokenStorage.get(userId);
    if (!tokens) throw new Error("No tokens found for the user");
    return this.rest.get(Routes.userApplicationRoleConnection(this.id), {
      auth: false,
    });
  }

  async setUserMetadata(
    userId: Snowflake,
    platformName: string,
    metadata: { [key: string]: string }
  ) {
    const tokens = await this.tokenStorage.get(userId);
    if (!tokens) throw new Error("No tokens found for the user");
    return this.rest.put(Routes.userApplicationRoleConnection(this.id), {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        platform_name: platformName,
        metadata: metadata,
      },
      auth: false,
    });
  }

  async fetchUser(
    userId: Snowflake,
    access_token?: string
  ): Promise<RESTGetAPIUserResult> {
    let tokens = await this.tokenStorage.get(userId);
    if (!tokens && !access_token)
      throw new Error("No tokens found for the user");
    if (!tokens && access_token)
      tokens = { access_token: access_token, refresh_token: "" } as any;
    return this.rest
      .get(Routes.oauth2CurrentAuthorization(), {
        auth: false,
      })
      .then((x: any) => x.user) as any;
  }
}

export interface ApplicationMetadata {
  key: string;
  name: string;
  description: string;
  type: MetadataTypes;
}

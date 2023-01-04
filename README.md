<p align="center"><a href="https://nodei.co/npm/discord-linked-roles/"><img src="https://nodei.co/npm/discord-linked-roles.png"></a></p>
<p align="center"><img src="https://img.shields.io/npm/v/discord-linked-roles"> <img src="https://img.shields.io/npm/dm/discord-linked-roles?label=downloads"> <img src="https://img.shields.io/npm/l/discord-linked-roles"> <img src="https://img.shields.io/github/repo-size/meister03/discord-linked-roles">  <a href="https://discord.gg/YTdNBHh"><img src="https://discordapp.com/api/guilds/697129454761410600/widget.png" alt="Discord server"/></a></p>

# Discord-linked-roles
A powerful and easy to use package to create linked roles and update user metadata.

## Features:
- Persistent storage of access tokens to avoid re-authorization (Mongoose or CustomProvider)
- OAuth2 Authorization flow
- Less backend code

### Featured by Discord Creators:
[Exclusive Private Community for Verified Bot Developers. ](https://discord.gg/R3hPevRtUV)

[Meet big bot (1 mio+) and small bot developers and have a nice exchange...](https://discord.gg/R3hPevRtUV)

Feel free to test the Feature in this Server:
<p>
<a href="https://discord.gg/R3hPevRtUV">
<img src="https://media.discordapp.net/attachments/980770619161448489/982938274677018624/banner.png?width=320&height=80">
<img src="https://media.discordapp.net/attachments/1051910435823169577/1056984485914230784/image.png?width=320&height=120">
</a>
</p>

## Getting Started
1. Create a new application on the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new bot and copy the token
3. [Go to the Information tab and set the following: `http://localhost:3000/linked-role` as `linked-role` url](https://media.discordapp.net/attachments/975812290198765588/1057386945786945546/image.png)
4. [Go to the OAuth2 Section and add the following `redirectUri`: `http://localhost:3000/auth-callback`](https://media.discordapp.net/attachments/975812290198765588/1057387153702801408/image.png?width=1440&height=285)
5. Get the `clientSecret` from the same page
6. Create a `config.json` file with following entries below:
```json
{
    "token": "...",
    "id": "...",
    "clientSecret": "...",
    "redirectUri": "http://localhost:3000/auth-callback"
}
```

## Registering the Application Metadata
- The application metadata is a schema that contains maximally 5 entries.
- The entries consist of the following types: `{key: string, name: string, description: string, type: number}`
- Once the OAuth2 takes place, you can set the metadata of the user by using the `setUserMetaData` method.
```js
const { Application, MapProvider, MetaDataTypes } = require('discord-linked-roles');
const config = require('./config.json');

const application = new Application({
    id: config.id,
    token: config.token,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
    scopes: config.scopes,
    databaseProvider: new MapProvider() // new MongooseProvider(databaseUrl),
});
// Following value types exists: Boolean, Date, Integer
application.registerMetaData([
        {
            key: 'level',
            name: 'Level',
            description: 'The level of the user',
            type: MetaDataTypes.INTEGER_GREATER_THAN_OR_EQUAL
        },
        {
            key: 'xp',
            name: 'Total XP',
            description: 'The total xp of the user',
            type: MetaDataTypes.INTEGER_GREATER_THAN_OR_EQUAL
        }
]);
```

## Set the User Metadata
- You need the `access_token` to set the user metadata.
- The `access_token` is provided after the OAuth2 flow.
- The `tokens` are saved under `application.tokenStorage`
- Install the required packages: `npm i express cookie-parser crypto express`
```js
const { Application, MapProvider, MetaDataTypes } = require('.discord-linked-roles');
const config = require('./config.json');
const crypto = require('crypto');
const express = require('express');
const cookieParser = require('cookie-parser');

const application = new Application({
    id: config.id,
    token: config.token,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
    scopes: config.scopes,
    databaseProvider: new MapProvider() // new MongooseProvider(databaseUrl),
});

const app = express();

app.use(cookieParser(crypto.randomUUID()));
app.get('/linked-role', application.authorization.setCookieAndRedirect.bind(application.authorization));
app.get('/auth-callback', async (req, res) => {
    try {
        // Verifies if the cookie equals the one given on the /linked-role route
        const code = application.authorization.checkCookieAndReturnCode(req, res);
        // Invalid Cookie
        if (!code) return res.sendStatus(403);

        // Gets the user and stores the tokens
        const data = await application.authorization.getUserAndStoreToken(code);
        if(!application.authorization.checkRequiredScopesPresent(data.scopes)) return res.redirect('/linked-role');
        const user = data.user;

        // const advancedUser = await application.fetchUser(user.id); , User with email, verified ...
        
        // Set Application MetaData
        application.setUserMetaData(user.id, user.username ,{ level: 24, xp: 523 })
        res.send("Successfully linked your account!")
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.listen(3000, () => {
  console.log(`Example app listening on port ${port}`);
});
```
![](https://media.discordapp.net/attachments/975812290198765588/1057401509790363738/image.png)

## Update Users Metadata
- You likely want to update the users metadata on some certain point
- You would need an access token to update the metadata, which is the reason you need a persistent storage
```js
async function startDailyMetaDataUpdates() {
    let users = await application.tokenStorage.getAllUsers();
    console.log("[Starting Daily Metadata Updates] Users to update:", users.length)
    for (let i = 0; i < users.length; i++) {
      setTimeout(async () => {
        await updateMetadata(users[i].id);
      }, i * 1000 * 180);
    }
}

async function updateMetadata(userId) {
    const user = await application.fetchUser(userId);
    application.setUserMetaData(user.id, user.username ,{ level: Number((Math.random()*24).toFixed(0)), xp: Number((Math.random()*523).toFixed(0)) })
}
```
### Get the User Metadata
- You can get the user metadata by using the `getUserMetaData` method.
- Access token is required to get the metadata.
```js
const metadata = await application.getUserMetaData(userId);
```
### Fetch the User
- You can fetch the user by using the `fetchUser` method.
- Access token is required to fetch the user.
- Based on the scopes in the authorization, you can get more information about the user such as email, verified, etc.
```js
const user = await application.fetchUser(userId);
```
### Fetch Guilds
- You can fetch the guilds by using the `fetchUserGuilds` method.
- Access token is required to fetch the guilds.
- You need the `guilds` scope to fetch the guilds.
```js
const guilds = await application.fetchUserGuilds(userId);
```
### Fetch User Connections
- You can fetch the user connections by using the `fetchUserConnections` method.
- Access token is required to fetch the user connections.
- You need the `connections` scope to fetch the user connections.
```js
const connections = await application.fetchUserConnections(userId);
```
### Fetch GuildMember of User in a Guild
- You can fetch the guild member of a user in a guild by using the `fetchUserGuildMember` method.
- Access token is required to fetch the guild member.
- You need the `guilds.members.read` scope to fetch the guild member.
```js
const guildMember = await application.fetchUserGuildMember(userId, guildId);
```

## Persistent Storage of Access Tokens
- You can use the `MapProvider` to store the access tokens in memory.
- You can use the `MongooseProvider` to store the access tokens in a MongoDB database.
- When you want to store the access tokens on your way, then you can create a database provider with following types:
```ts
export type DataBaseProvider = {
    findAll(): Promise<{tokens: OAuthTokens, id: string}>;
    // Gets the token for the user
    fetchUser: (userId: string) => Promise<OAuthTokens | undefined>;
    createOrUpdate: (userId: string, token: OAuthTokens) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
}

export interface OAuthTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}
```

# Bugs, glitches and issues

If you encounter any problems feel free to open an issue in our <a href="https://github.com/meister03/discord-linked-roles/issues">GitHub repository or join the Discord server.</a>

# Credits
All Credit of the Authorization flow goes to this repo: https://github.com/discord/linked-roles-sample
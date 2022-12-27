"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaDataTypes = exports.OAuthGetTokenEndpoint = exports.DiscordConstants = exports.defaultScopes = void 0;
exports.defaultScopes = [
    'role_connections.write',
    'identify'
];
exports.DiscordConstants = {
    http: {
        version: '10'
    }
};
exports.OAuthGetTokenEndpoint = 'https://discord.com/api/v10/oauth2/token';
var MetaDataTypes;
(function (MetaDataTypes) {
    // The metadata value (integer) is less than or equal to the guild's configured value (integer)
    MetaDataTypes[MetaDataTypes["INTEGER_LESS_THAN_OR_EQUAL"] = 1] = "INTEGER_LESS_THAN_OR_EQUAL";
    // The metadata value(integer) is greater than or equal to the guild's configured value (integer)
    MetaDataTypes[MetaDataTypes["INTEGER_GREATER_THAN_OR_EQUAL"] = 2] = "INTEGER_GREATER_THAN_OR_EQUAL";
    // The metadata value(integer) is equal to the guild's configured value (integer)
    MetaDataTypes[MetaDataTypes["INTEGER_EQUAL"] = 3] = "INTEGER_EQUAL";
    // The metadata value(integer) is not equal to the guild's configured value (integer)
    MetaDataTypes[MetaDataTypes["INTEGER_NOT_EQUAL"] = 4] = "INTEGER_NOT_EQUAL";
    // The metadata value(ISO8601 string) is less than or equal to the guild's configured value (integer; days before current date)
    MetaDataTypes[MetaDataTypes["DATETIME_LESS_THAN_OR_EQUAL"] = 5] = "DATETIME_LESS_THAN_OR_EQUAL";
    // The metadata value(ISO8601 string) is greater than or equal to the guild's configured value (integer; days before current date)
    MetaDataTypes[MetaDataTypes["DATETIME_GREATER_THAN_OR_EQUAL"] = 6] = "DATETIME_GREATER_THAN_OR_EQUAL";
    // The metadata value(integer) is equal to the guild's configured value (integer; 1)
    MetaDataTypes[MetaDataTypes["BOOLEAN_EQUAL"] = 7] = "BOOLEAN_EQUAL";
    // The metadata value(integer) is not equal to the guild's configured value (integer; 1)
    MetaDataTypes[MetaDataTypes["BOOLEAN_NOT_EQUAL"] = 8] = "BOOLEAN_NOT_EQUAL";
})(MetaDataTypes = exports.MetaDataTypes || (exports.MetaDataTypes = {}));

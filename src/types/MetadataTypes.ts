export enum MetadataTypes {
  // The metadata value (integer) is less than or equal to the guild's configured value (integer)
  INTEGER_LESS_THAN_OR_EQUAL = 1,
  // The metadata value(integer) is greater than or equal to the guild's configured value (integer)
  INTEGER_GREATER_THAN_OR_EQUAL,
  // The metadata value(integer) is equal to the guild's configured value (integer)
  INTEGER_EQUAL,
  // The metadata value(integer) is not equal to the guild's configured value (integer)
  INTEGER_NOT_EQUAL,
  // The metadata value(ISO8601 string) is less than or equal to the guild's configured value (integer; days before current date)
  DATETIME_LESS_THAN_OR_EQUAL,
  // The metadata value(ISO8601 string) is greater than or equal to the guild's configured value (integer; days before current date)
  DATETIME_GREATER_THAN_OR_EQUAL,
  // The metadata value(integer) is equal to the guild's configured value (integer; 1)
  BOOLEAN_EQUAL,
  // The metadata value(integer) is not equal to the guild's configured value (integer; 1)
  BOOLEAN_NOT_EQUAL,
}

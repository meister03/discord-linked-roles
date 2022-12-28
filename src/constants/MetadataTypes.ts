enum NumberTypes {
  LessThanOrEqual = 1, // Number is less than or equal to the guild's configured value
  GreaterThanOrEqual = 2, // Number is greater than or equal to the guild's configured value
  Equal = 3, // Number is equal to the guild's configured value
  NotEqual = 4, // Number is not equal to the guild's configured value
}

enum DateTimeTypes {
  LessThanOrEqual = 5, // Date (ISO8601 string) is less than or equal to the guild's configured value (days before current date)
  GreaterThanOrEqual = 6, // Date (ISO8601 string) is greater than or equal to the guild's configured value (days before current date)
}

enum BooleanTypes {
  Equal = 7, // Boolean is equal to the guild's configured value
  NotEqual = 8, // Boolean is not equal to the guild's configured value
}

export const MetadataTypes = {
  Integer: NumberTypes,
  Number: NumberTypes,
  DateTime: DateTimeTypes,
  Boolean: BooleanTypes,
};

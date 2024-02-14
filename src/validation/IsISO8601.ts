import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

/**
 * Validates that the string property that is decorated is an ISO8601 datetime string.
 * 
 * @decorator
 * @param validationOptions See `class-validator`
 * @returns 
 */
export function IsISO8601(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsISO8601",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [date, time] = value.split(" ");
          if (!date) return false;
          const [year, month, day] = date.split("-").map(s => parseInt(s));
          if (year === undefined || isNaN(year)) return false;
          if (!month || isNaN(month)) return false;
          if (!day || isNaN(day)) return false;

          if (month < 1 || month > 12) return false;
          if (day < 1 || day > 31) return false;

          if (time) {
            const [hour, minute, second] = time.split(":").map(s => parseInt(s));
            if (hour === undefined || isNaN(hour)) return false;
            if (minute === undefined || isNaN(minute)) return false;
            if (second === undefined || isNaN(second)) return false;
            
            if (hour < 0 || hour > 24) return false;
            if (minute < 0 || minute > 59) return false;
            if (second < 0 || second > 59) return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return "string `$value` is not a valid ISO8601 (YYYY-MM-DD hh:mm:ss) string!"
        }
      }
    })
  }
}
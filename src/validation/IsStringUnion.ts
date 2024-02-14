import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

/**
 * Validates that the string property that is decorated satisfies a string union type according to a type checker function
 * 
 * @decorator
 * @param unionTypeCheck The type check function `(val: string) => boolean`. 
 * @param name The name of the string union as it appears (for error messages)
 * @param validationOptions See `class-validator`
 * @returns 
 */
export function IsStringUnion(unionTypeCheck: (val: string ) => boolean, name: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsStringUnion",
      target: object.constructor,
      propertyName,
      constraints: [unionTypeCheck, name],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [typeCheck] = args.constraints;
          return typeof value === "string" && typeCheck(value);
        },
        defaultMessage(args: ValidationArguments) {
          return "string `$value` does not satisfy $constraint2"
        },
      }
    })
  }
}

export function ArrayIsStringUnion(unionTypeCheck: (val: string ) => boolean, name: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "ArrayIsStringUnion",
      target: object.constructor,
      propertyName,
      constraints: [unionTypeCheck, name],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [typeCheck] = args.constraints;
          if (typeof value !== "object" || !Array.isArray(value)) return false;
          for (let v of value) {
            if (typeof v !== "string" || !typeCheck(v)) return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          let values = args.value as string[];
          let failed = values.find((v) => typeof v !== "string" || !args.constraints[0](v));
          return `string \`${failed}\` does not satisfy union $constraint2`
        },
      }
    })
  }
}

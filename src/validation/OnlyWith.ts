import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";


/**
 * Only allows the decorated property to be valid when the property(s) are also defined.
 * 
 * @decorator
 * @param property property(s) that must be defined.
 * @param validationOptions See `class-validator`
 */
export function OnlyWith(property: string | string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "OnlyWith",
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          if (typeof relatedPropertyName === "object") {
            for (let i = 0; i < relatedPropertyName.length; i++) {
              let relatedProperty = (args.object as any)[relatedPropertyName[i]];
              if (relatedProperty === undefined || relatedProperty === null) return false; 
            }
            return true;
          } else {

            let relatedProperty = (args.object as any)[relatedPropertyName];
            return relatedProperty !== undefined && relatedProperty !== null;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return "property `$property` is only valid when property(s): `$constraint1` are defined!"
        }
      }
    })
  }
}
import {
  InputType,
  Field,
  Float,
  Int,
  ObjectType,
} from "type-graphql";
import {
  MethodName,
  Madhab,
  isMethodName,
  TimingName,
  isTimingName,
  METHOD_NAMES,
} from "../utils/Salah";
import { Min, Max, ArrayContains } from "class-validator";
import {
  IsStringUnion,
  ArrayIsStringUnion,
} from "../validation/IsStringUnion";

let ALL_TIMES: TimingName[] = [
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "midnight",
];

@ObjectType("CalculationType")
@InputType({
  description:
    "An input for the parameters used for the prayer times calculation. All values have defaults.",
})
class CalculationInput {
  @Field(type => String, {
    defaultValue: "MWL",
    description: `The calculation method to use for calculation. Relevant for Fajr and Isha calculations. Must be one of the following: \`${METHOD_NAMES.join(",")}\`. See docs for more details about this parameter.`,
  })
  @IsStringUnion(isMethodName, "MethodName")
  public method: MethodName = "MWL";

  @Field(type => Int, {
    defaultValue: 1,
    description:
      "The madhab (school of thought) used for Asr time calculation. 1 for Hanafi, 2 for Shafi (Hanbali and Maliki as well). The Ahnaf (Hanafi's) use a later time for Asr calculation. See docs for more details.",
  })
  @Min(1)
  @Max(2)
  public madhab: Madhab = Madhab.Shafi;

  @Field(type => String, {
    nullable: true,
    description:
      "The timezone to use for the calculation as per the IANA database. If not provided, will be determined based on your location.",
  })
  public timeZone?: string;

  @Field(type => String, {
    defaultValue: "en-US",
    description:
      "The locale to use for date outputs as per the JavaScript documentation.",
  })
  public locale: string = "en-US";

  @Field(type => [String], {
    defaultValue: ALL_TIMES,
    description: `A list of timings to calculate. Valid options are from the following: \`${ALL_TIMES.join(",")}\``,
  })
  @ArrayIsStringUnion(isTimingName, "TimingName")
  public timings: TimingName[] = ALL_TIMES;
}

export default CalculationInput;

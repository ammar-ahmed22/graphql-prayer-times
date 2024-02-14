import {
  ArgsType,
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

@ObjectType()
@ArgsType()
class CalculationInput {
  // TODO make these into a separate location input (lat, lng, city, country, address)
  // @Field(type => Float)
  // public lat: number;

  // @Field(type => Float)
  // public lng: number;

  @Field(type => String, { defaultValue: "MWL" })
  @IsStringUnion(isMethodName, "MethodName")
  public method: MethodName = "MWL";

  @Field(type => Int, { defaultValue: 1 })
  @Min(1)
  @Max(2)
  public madhab: Madhab = Madhab.Shafi;

  @Field(type => String, { defaultValue: "America/Toronto" })
  public timeZone: string = "America/Toronto";

  @Field(type => String, { defaultValue: "en-US" })
  public locale: string = "en-US";

  @Field(type => [String], { defaultValue: ALL_TIMES })
  @ArrayIsStringUnion(isTimingName, "TimingName")
  public timings: TimingName[] = ALL_TIMES;
}

export default CalculationInput;

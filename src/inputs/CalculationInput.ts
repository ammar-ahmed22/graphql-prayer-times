import { ArgsType, Field, Float, Int } from "type-graphql";
import { MethodName, Madhab } from "../utils/Salah";

@ArgsType()
class CalculationInput {
  @Field(type => Float)
  public lat: number;

  @Field(type => Float)
  public lng: number;

  @Field(type => String, { defaultValue: "MWL" })
  public method: MethodName = "MWL";

  @Field(type => Int, { defaultValue: 1 })
  public madhab: Madhab = Madhab.Shafi;

  @Field(type => String)
  public timeZone: string

  @Field(type => String)
  public locale: string
}

export default CalculationInput;
import { Field, InputType, Int, ArgsType } from "type-graphql";
import { OnlyWith } from "../validation/OnlyWith";
import { OnlyWithout } from "../validation/OnlyWithout";
import { IsISO8601 } from "../validation/IsISO8601";
import { Min, Max } from "class-validator";

@InputType({
  description:
    "An input for dates. year, month, and day inputs can be provided OR an ISO8601 (YYYY-MM-DD) date string. Either provide a string OR the year, month, day values. They cannot be provided together.",
})
class DateInput {
  @Field(type => Int, { nullable: true, description: "The year in the Gregorian calendar." })
  @OnlyWith(["day", "month"])
  @OnlyWithout("string")
  year: number;

  @Field(type => Int, { nullable: true, description: "Month of the year from 1-12." })
  @OnlyWith(["day", "year"])
  @OnlyWithout("string")
  @Min(1)
  @Max(12)
  month: number;

  @Field(type => Int, { nullable: true, description: "Day of the month from 1-31." })
  @OnlyWith(["year", "month"])
  @Min(1)
  @Max(31)
  day: number;

  @Field(type => String, { nullable: true, description: "An ISO8601 date string (`YYYY-MM-DD`)." })
  @OnlyWithout(["day", "month", "year"])
  @IsISO8601()
  string: string;

  get date(): Date {
    if (this.year && this.day && this.month) {
      return new Date(this.year, this.month - 1, this.day);
    }
    if (this.string) {
      const [year, month, day] = this.string
        .split("-")
        .map(s => parseInt(s));
      return new Date(year, month - 1, day);
    }
    return new Date();
  }
}

export default DateInput;

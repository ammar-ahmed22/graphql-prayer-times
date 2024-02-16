import { ObjectType, Field } from "type-graphql";
import Timing from "./Timing";
import Salah, { SalahOptions, TimingName, CalculationMethod } from "../utils/Salah";
import { DateField } from "./Datetime";
import LocationInput from "../inputs/LocationInput";

@ObjectType({
  description: "Detailed explanations of the calculation methods."
})
export class DetailedMethod {
  constructor(method: CalculationMethod) {
    this.id = method.id;
    this.name = method.fullName;
    this.description = `Fajr is calculated at ${method.fajrParam} degrees. Isha is calculated ${typeof method.ishaParam === "number" ? `at ${method.ishaParam} degrees.` : `as ${method.ishaParam.getMinutes()} minutes after maghrib.`}`
  }

  @Field({ description: "The id of the method. This value is used as the input."})
  public id: string;

  @Field({ description: "The full name of the calculation authority."})
  public name: string;

  @Field({ description: "A short description of the calculation."})
  public description: string;
}

@ObjectType({
  description: "Parameters used for the calculation of prayer times.",
})
export class PrayerTimesParams {
  constructor(
    salahOpts: SalahOptions,
    location: LocationInput,
    locale: string,
  ) {
    this.timeZone = salahOpts.timeZone;
    this.method = salahOpts.method && new DetailedMethod(salahOpts.method);
    this.locale = locale;
    this.madhab = salahOpts.madhab === 2 ? "Hanafi" : "Shafi";
    this.location = location;
  }

  @Field({
    description: "A timezone according to the IANA database.",
  })
  public timeZone?: string;

  @Field({
    description: "Locale used for date to string conversions.",
  })
  public locale?: string;

  @Field({
    description: "The name of the madhab used for Asr calculation.",
  })
  public madhab?: string;

  @Field(type => DetailedMethod, {
    description:
      "Detailed explanation of the calculation method used for Fajr and Isha.",
  })
  public method?: DetailedMethod;

  @Field(type => LocationInput, {
    description:
      "The location used for the calculation. Always includes `lat` and `lng`.",
  })
  public location: LocationInput;
}

export type TimingNameInput = {
  [K in TimingName]?: boolean;
};

@ObjectType({ description: "Response type containing requested prayer times, parameters used for calculation and the date."})
class PrayerTimes {
  private salah: Salah;
  constructor(
    salahOpts: SalahOptions,
    timingNames: TimingNameInput,
    date: Date,
    locale: string,
    location: LocationInput,
  ) {
    this.salah = new Salah(salahOpts);
    let timings: Timing[] = [];
    for (let t in timingNames) {
      let timingName = t as TimingName;
      if (timingNames[timingName]) {
        let timing = this.salah.getTiming(timingName, date);
        timings.push(
          new Timing(timingName as string, timing, locale),
        );
      }
    }
    this.timings = timings;
    this.date = new DateField(date, locale);
    this.params = new PrayerTimesParams(salahOpts, location, locale);
  }
  @Field(returns => DateField, { description: "The date for which the times were calculated for."})
  public date: DateField;

  @Field(returns => [Timing], { description: "An array of timings as requested."})
  public timings: Timing[];

  @Field(returns => PrayerTimesParams, { description: "The parameters used for the calculation."})
  public params: PrayerTimesParams;
}

export default PrayerTimes;

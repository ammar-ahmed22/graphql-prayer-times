import { ObjectType, Field } from "type-graphql";
import Timing from "./Timing";
import Salah, { SalahOptions, TimingName } from "../utils/Salah";
import Datetime, { DateField } from "./Datetime";
import LocationInput from "../inputs/LocationInput";

@ObjectType({ description: "Parameters used for the calculation of prayer times." })
export class PrayerTimesParams {
  constructor(
    salahOpts: SalahOptions,
    location: LocationInput,
    locale: string,
  ) {
    this.timeZone = salahOpts.timeZone
    this.method = salahOpts.method?.fullName;
    this.locale = locale;
    this.madhab = salahOpts.madhab === 2 ? "Hanafi" : "Shafi" 
    this.location = location;
  }

  @Field({ description: "A timezone according to the IANA database." })
  public timeZone?: string

  @Field({ description: "Locale used for date to string conversions." })
  public locale?: string

  @Field({ description: "The name of the madhab used for Asr calculation." })
  public madhab?: string

  @Field({ description: "The name of the calculation method used for the Fajr and Isha calculations."})
  public method?: string

  @Field(type => LocationInput, { description: "The location used for the calculation. Always includes `lat` and `lng`."})
  public location: LocationInput
}

export type TimingNameInput = {
  [K in TimingName]?: boolean;
};

@ObjectType()
class PrayerTimes {
  private salah: Salah;
  constructor(
    salahOpts: SalahOptions,
    timingNames: TimingNameInput,
    date: Date,
    locale: string,
    location: LocationInput
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
  @Field(returns => DateField)
  public date: DateField;

  @Field(returns => [Timing])
  public timings: Timing[];

  @Field(returns => PrayerTimesParams)
  public params: PrayerTimesParams;
}

export default PrayerTimes;

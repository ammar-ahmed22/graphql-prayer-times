import { ObjectType, Field } from "type-graphql";
import Timing from "./Timing";
import Salah, { SalahOptions, TimingName } from "../utils/Salah";
import Datetime, { DateField } from "./Datetime";

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
  }
  @Field(returns => DateField)
  public date: DateField;

  @Field(returns => [Timing])
  public timings: Timing[];
}

export default PrayerTimes;

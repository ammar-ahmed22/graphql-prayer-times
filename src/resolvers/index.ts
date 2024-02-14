import {
  Resolver as ResolverType,
  Query,
  Arg,
  Args,
} from "type-graphql";
import PrayerTimes, { TimingNameInput } from "../models/PrayerTimes";
import {
  Methods,
  SalahOptions,
} from "../utils/Salah";
import { find } from "geo-tz";
import { dateRange, timezoneConvert } from "../utils/time";
import Duration from "../utils/Duration";
import CalculationInput from "../inputs/CalculationInput";
import DateInput from "../inputs/DateInput";
import LocationInput from "../inputs/LocationInput";

@ResolverType()
class Resolver {

  @Query(returns => PrayerTimes, { description: "Calculates specified prayer timings for a provided date."})
  async byDate(
    @Args({ validate: true }) calculation: CalculationInput,
    @Arg("location", { validate: true, description: "The location to calculate timings for." }) location: LocationInput,
    @Arg("date", { validate: true, nullable: true, description: "The date to calculate for. If `null`, uses the date now in the provided timezone." })
    dateInput?: DateInput,
  ) {

    let { timeZone, madhab, method, timings, locale } = calculation;
    const [lat, lng] = await location.getCoords();
    location.setCoords([lat, lng]);

    if (!timeZone) {
      timeZone = find(lat, lng)[0];
      if (!timeZone) throw new Error("Could not find a timezone based on the provided location!")
    }

    let date: Date;
    if (dateInput) {
      date = dateInput.date;
    } else {
      date = timezoneConvert(timeZone, new Date());
    }

    const salahOpts: SalahOptions = {
      lat,
      lng,
      timeZone,
      madhab,
      method: Methods[method],
    };

    let timingsObj: TimingNameInput = {};
    timings.forEach(timing => {
      timingsObj[timing] = true;
    });

    return new PrayerTimes(salahOpts, timingsObj, date, locale, location);
  }

  @Query(returns => [PrayerTimes], { description: "Calculates specified prayer times for a provided range of dates [`start`, `end`]. Must be at least 2 days in the range."})
  async byRange(
    @Args({ validate: true }) calculation: CalculationInput,
    @Arg("location", { validate: true }) location: LocationInput,
    @Arg("start", { validate: true }) start: DateInput,
    @Arg("end", { validate: true }) end: DateInput
  ) {
    const range = dateRange(start.date, end.date, Duration.fromHours(24))

    let { timeZone, madhab, method, timings, locale } = calculation;
    const [lat, lng] = await location.getCoords();
    location.setCoords([lat, lng]);
    if (!timeZone) {
      timeZone = find(lat, lng)[0];
      if (!timeZone) throw new Error("Could not find a timezone based on the provided location!")
    }

    const salahOpts: SalahOptions = {
      lat,
      lng,
      timeZone,
      madhab,
      method: Methods[method],
    }

    let timingsObj: TimingNameInput = {};
    timings.forEach(timing => {
      timingsObj[timing] = true;
    })

    return range.map(date => {
      return new PrayerTimes(salahOpts, timingsObj, date, locale, location)
    })
  }

  // TODO Query for all methods
}

export default Resolver;

import {
  Resolver as ResolverType,
  Query,
  Arg,
  Args,
} from "type-graphql";
import PrayerTimes, { TimingNameInput } from "../models/PrayerTimes";
import { Methods, SalahOptions } from "../utils/Salah";
import { find } from "geo-tz";
import { dateRange, getTimezoneOffset } from "../utils/time";
import Duration from "../utils/Duration";
import CalculationInput from "../inputs/CalculationInput";
import DateInput from "../inputs/DateInput";
import LocationInput from "../inputs/LocationInput";

@ResolverType()
class Resolver {
  @Query(returns => PrayerTimes, {
    description:
      "Calculates specified prayer timings for a provided date.",
  })
  async byDate(
    @Arg("location", {
      validate: true,
      description: "The location to calculate timings for.",
    })
    location: LocationInput,
    @Arg("calculation", {
      validate: true,
      nullable: true,
      description:
        "Parameters used for calculation. If `null`, uses defaults.",
    })
    calculation?: CalculationInput,
    @Arg("date", {
      validate: true,
      nullable: true,
      description:
        "The date to calculate for. If `null`, uses the date now in the provided timezone.",
    })
    dateInput?: DateInput,
  ) {
    if (!calculation) calculation = new CalculationInput();
    let { timeZone, madhab, method, timings, locale } = calculation;
    const [lat, lng] = await location.getCoords();
    location.setCoords([lat, lng]);

    if (!timeZone) {
      timeZone = find(lat, lng)[0];
      if (!timeZone)
        throw new Error(
          "Could not find a timezone based on the provided location!",
        );
    }

    // TODO
    // FIGURE THIS OUT => if no date provided, want date in provided timezone!! (NEED YEAR MONTH DAY IN PROVIDED TIMEZONE FOR JULIAN DATE)
    let date: Date;
    if (dateInput) {
      date = dateInput.date; // This may be problematic as well
    } else {
      let now = new Date();
      date = new Date(now.getTime() + (getTimezoneOffset(timeZone) / 60 / 60 / 1000)); 
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

    return new PrayerTimes(
      salahOpts,
      timingsObj,
      date,
      locale,
      location,
    );
  }

  @Query(returns => [PrayerTimes], {
    description:
      "Calculates specified prayer times for a provided range of dates [`start`, `end`]. Must be at least 2 days in the range.",
  })
  async byRange(
    @Arg("location", {
      validate: true,
      description: "The location to calculate timings for.",
    })
    location: LocationInput,
    @Arg("start", {
      validate: true,
      description: "The `start` date for the range.",
    })
    start: DateInput,
    @Arg("end", {
      validate: true,
      description: "The `end` date for the range.",
    })
    end: DateInput,
    @Arg("calculation", {
      validate: true,
      nullable: true,
      description:
        "Parameters used for calculation. If `null`, uses defaults.",
    })
    calculation?: CalculationInput,
  ) {
    const range = dateRange(
      start.date,
      end.date,
      Duration.fromHours(24),
    );
    if (!calculation) calculation = new CalculationInput();

    let { timeZone, madhab, method, timings, locale } = calculation;
    const [lat, lng] = await location.getCoords();
    location.setCoords([lat, lng]);
    if (!timeZone) {
      timeZone = find(lat, lng)[0];
      if (!timeZone)
        throw new Error(
          "Could not find a timezone based on the provided location!",
        );
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

    return range.map(date => {
      return new PrayerTimes(
        salahOpts,
        timingsObj,
        date,
        locale,
        location,
      );
    });
  }

  // TODO Query for all methods
}

export default Resolver;

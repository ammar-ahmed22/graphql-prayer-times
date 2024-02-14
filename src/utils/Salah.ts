import { DMath } from "./math";
import { getTimezoneOffset, normalizeHour, NaiveDate } from "./time";
import Duration from "./Duration";

export type SalahOptions = {
  lat: number;
  lng: number;
  timeZone?: string;
  madhab?: Madhab;
  method?: CalculationMethod;
};

type CalculationMethodOptions = {
  id: string;
  fullName: string;
  fajrParam: number | Duration;
  ishaParam: number | Duration;
};

export class CalculationMethod {
  constructor(opts: CalculationMethodOptions) {
    Object.assign(this, opts);
  }
  public id: string;
  public fullName: string;
  public fajrParam: number | Duration;
  public ishaParam: number | Duration;
}

export const METHOD_NAMES = ["MWL", "ISNA", "Egypt"] as const;

export type MethodName = (typeof METHOD_NAMES)[number];

export function isMethodName(val: string): val is MethodName {
  if (METHOD_NAMES.includes(val as MethodName)) return true;
  return false;
}

export class Methods {
  // TODO Finish these
  static MWL = new CalculationMethod({
    id: "MWL",
    fullName: "Muslim World League",
    fajrParam: 15,
    ishaParam: 15,
  });

  static ISNA = new CalculationMethod({
    id: "ISNA",
    fullName: "Islamic Society of North America",
    fajrParam: 15,
    ishaParam: 15,
  });

  static Egypt = new CalculationMethod({
    id: "Egypt",
    fullName: "Egpyt",
    fajrParam: 15,
    ishaParam: 15,
  });
}

export enum Madhab {
  Shafi = 1,
  Hanafi = 2,
}

export const TIMING_NAMES = [
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "midnight",
] as const;

export type TimingName = (typeof TIMING_NAMES)[number];

export function isTimingName(val: string): val is TimingName {
  if (TIMING_NAMES.includes(val as TimingName)) return true;
  return false;
}

class Salah {
  private timeZone: string;
  private madhab: Madhab;
  private lat: number;
  private lng: number;
  private method: CalculationMethod;
  private tzOffset: number;
  constructor(opts: SalahOptions) {
    if (opts.lat > 60) {
      throw new Error("High latitudes are not available! (yet...)");
    }
    this.lat = opts.lat;
    this.lng = opts.lng;
    this.method = opts.method ?? Methods.MWL;
    this.timeZone = opts.timeZone ?? "America/Toronto";
    this.tzOffset = getTimezoneOffset(this.timeZone);
    this.madhab = opts.madhab ?? Madhab.Shafi;

    // To throw error of timezone is invalid
    new Intl.DateTimeFormat("en-US", { timeZone: this.timeZone });
  }

  /**
   * Returns the Julian Date for a given date
   *
   * @private
   * @param {Date} date The date to convert to Julian Date
   */
  private julian(date: Date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // +1 because 0 indexed
    let day = date.getDate();

    if (month <= 2) {
      year--;
      month += 12;
    }

    let a = Math.floor(year / 100);
    let b = 2 - a + Math.floor(a / 4);

    return (
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      b -
      1524.5
    );
  }

  /**
   * Returns the Equation of Time and Declination of the sun for a given Julian Date
   *
   * The algorithm is an approximation found on the {@link https://web.archive.org/web/20181115153648/http://aa.usno.navy.mil/faq/docs/SunApprox.php US Navy's website}
   *
   * @private
   * @param jd The Julian Date to calculate for
   */
  private sunCoords(jd: number): [number, number] {
    // All values in degrees
    // Number of days since Julian Date epoch (2000 Janaury 1.5)
    let D = jd - 2_451_545;

    // Mean anomaly of the sun
    let g = DMath.normalizeAngle(357.529 + 0.98560028 * D);

    // Mean longitude of the sun
    let q = DMath.normalizeAngle(280.459 + 0.98564736 * D);

    // Geocentric apparent ecliptic longitude of the Sun (adjusted for aberration)
    let L = DMath.normalizeAngle(
      q + 1.915 * DMath.sin(g) + 0.02 * DMath.sin(2.0 * g),
    );

    // Mean obliquity of the ecliptic, in degrees
    let e = 23.439 - 0.00000036 * D;

    // Right-ascension of the Sun
    let RA = DMath.atan2(DMath.cos(e) * DMath.sin(L), DMath.cos(L));
    // Converting to hours
    RA = normalizeHour(RA / 15);

    // Equation of Time
    let eqt = q / 15 - RA;

    // Declination of the sun
    let decl = DMath.asin(DMath.sin(e) * DMath.sin(L));

    return [eqt, decl];
  }

  /**
   * Returns the hour at which the zenith of the sun occurs
   *
   * @param jd The Julian date to calculate for
   */
  private zenith(jd: number) {
    let [eqt, _] = this.sunCoords(jd);
    return 12 + this.tzOffset - this.lng / 15 - eqt;
  }

  /**
   * Returns the hour at which the sun makes a specified angle from the horizon
   *
   * @param angle The angle to calculate for (degrees)
   * @param jd The Julian date to calculate for
   * @param direction If `1`, angle is calculated from the sunrise horizon, `-1` calculates from the sunset horizon
   */
  private horizonHourAngle(
    angle: number,
    jd: number,
    direction: 1 | -1,
  ) {
    let [_, decl] = this.sunCoords(jd);

    let Ta =
      (1 / 15) *
      DMath.acos(
        (-DMath.sin(angle) - DMath.sin(this.lat) * DMath.sin(decl)) /
          (DMath.cos(this.lat) * DMath.cos(decl)),
      );
    return this.zenith(jd) + Ta * direction;
  }

  /**
   * Returns the hour at which the shadow of an object is a specified length relative to the object
   *
   * @param length The length of the shadow relative to the object.
   * @param jd The Julian date to calculate for.
   */
  private shadowLengthHour(length: number, jd: number) {
    let [_, decl] = this.sunCoords(jd);
    let At =
      (1 / 15) *
      DMath.acos(
        (DMath.sin(DMath.acot(length + DMath.tan(this.lat - decl))) -
          DMath.sin(this.lat) * DMath.sin(decl)) /
          (DMath.cos(this.lat) * DMath.cos(decl)),
      );
    return this.zenith(jd) + At;
  }

  /**
   * Converts a fractional hour to a Date object by adding the duration to the date at midnight
   *
   * @param hour The fractional hour value to add.
   * @param date The date to add to.
   */
  private hour2date(hour: number, date: Date): Date {
    let dur = Duration.fromHours(hour);
    let naiveDate = NaiveDate.fromDate(date);
    return Duration.add(naiveDate.date, dur);
  }

  /**
   * Returns the Fajr time as a Date object
   *
   * @param date The date to calculate for.
   */
  private fajr(date: Date): Date {
    let angle = this.method.fajrParam as number;
    let jd = this.julian(date);
    let hour = this.horizonHourAngle(angle, jd, -1);
    return this.hour2date(hour, date);
  }

  /**
   * Returns the Sunrise time as a Date object
   *
   * @param date The date to calculate for.
   */
  private sunrise(date: Date): Date {
    let jd = this.julian(date);
    let hour = this.horizonHourAngle(0.833, jd, -1);
    return this.hour2date(hour, date);
  }

  /**
   * Returns the Dhuhr time as a Date object
   *
   * @param date The date to calculate for.
   */
  private dhuhr(date: Date): Date {
    let jd = this.julian(date);
    let hour = this.zenith(jd);
    return this.hour2date(hour, date);
  }

  /**
   * Returns the Asr time as a Date object
   *
   * @param date The date to calculate for.
   */
  private asr(date: Date): Date {
    let jd = this.julian(date);
    let hour = this.shadowLengthHour(this.madhab, jd);
    return this.hour2date(hour, date);
  }

  /**
   * Returns the Maghrib time as a Date object
   *
   * @param date The date to calculate for.
   */
  private maghrib(date: Date): Date {
    let jd = this.julian(date);
    let hour = this.horizonHourAngle(0.833, jd, 1);
    return this.hour2date(hour, date);
  }

  /**
   * Returns the Isha time as a Date object
   *
   * @param date The date to calculate for.
   */
  private isha(date: Date): Date {
    let angle = this.method.ishaParam as number;
    let jd = this.julian(date);
    let hour = this.horizonHourAngle(angle, jd, 1);
    return this.hour2date(hour, date);
  }

  /**
   * Returns the Islamic midnight time as a Date object
   *
   * @param date The date to calculate for.
   */
  private midnight(date: Date): Date {
    let sunsetToday = this.maghrib(date);
    let tomorrow = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
    );
    let sunriseTomorrow = this.sunrise(tomorrow);
    // Midpoint between sunset today and sunrise tomorrow
    let mid =
      Duration.fromDifference(
        sunsetToday,
        sunriseTomorrow,
      ).getMilliseconds() / 2;
    return Duration.add(sunsetToday, new Duration(mid));
  }

  /**
   * Calculates a prayer given prayer timing for a given date
   *
   * @param name The name of the prayer time to calculate.
   * @param date The date to calculate for.
   */
  public getTiming(name: TimingName, date: Date): Date {
    return this[name](date);
  }

  /**
   * Calculates an array of prayer times for one date or multiple dates
   *
   * @param names The names of the times to calculate for.
   * @param date The date or dates to calculate for. When providing an array of dates, the length must be the same as the `names`.
   * @returns
   */
  public getTimings(
    names: TimingName[],
    date: Date | Date[],
  ): Date[] {
    let dates: Date[] = [];
    if (Array.isArray(date)) {
      if (names.length !== date.length)
        throw new RangeError(
          "Array `names` must match the size of Array `date`!",
        );
      for (let i = 0; i < names.length; i++) {
        let d = date[i];
        let n = names[i];
        dates.push(this[n](d));
      }
    } else {
      for (let name of names) {
        dates.push(this[name](date));
      }
    }

    return dates;
  }
}

export default Salah;

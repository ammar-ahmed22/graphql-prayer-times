import { normalize } from "./math";
import Duration from "./Duration";

/**
 * Normalizes a fractional hour of the day to the range [0, 24]
 *
 * @param hour Fractional hour of the day (e.g. 12.5 = 12:30 PM)
 */
export function normalizeHour(hour: number): number {
  return normalize(hour, 24);
}

/**
 * Returns the GMT timezone offset given a valid timezone string
 *
 * @param timeZone A string representing the timezone as per the IANA database
 */
export function getTimezoneOffset(timeZone: string): number {
  // Today's date (in the system timezone)
  let localDate = new Date();
  localDate.setMinutes(0);
  localDate.setSeconds(0);
  localDate.setMilliseconds(0);

  // Create a UTC date object with hours using today's date
  const utcDate = new Date(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
    localDate.getUTCHours(),
  );

  // Create another date with the time set to the time in the required timezone
  const tzDate = timezoneConvert(timeZone, localDate);

  // Calculate the difference of the timezone date from UTC (GMT0)
  const diff = Duration.fromDifference(utcDate, tzDate);
  // GMT offset in hours
  const offset = diff.getHours();

  return offset;
}

export function timezoneConvert(timeZone: string, date: Date): Date {
  let formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    year: "numeric",
    day: "2-digit",
    month: "2-digit",
  });

  let formatted = formatter.format(date);
  const [dateStr, timeStr] = formatted.split(", ");
  let [month, day, year]: number[] = dateStr
    .split("/")
    .map(s => parseInt(s));
  let [hour, minute, second]: number[] = timeStr
    .split(":")
    .map(s => parseInt(s));

  if (hour === 24) hour = 0;
  return new Date(year, month - 1, day, hour, minute, second);
}

/**
 * Object that helps with creating dates without time
 */
export class NaiveDate {
  public date: Date;
  constructor(year: number = 0, month: number = 0, day: number = 0) {
    this.date = new Date(year, month, day);
  }

  static fromDate(date: Date) {
    return new NaiveDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
  }
}

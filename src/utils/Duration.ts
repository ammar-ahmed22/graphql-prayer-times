import { getTimezoneOffset } from "./time";

/**
 * Object representing time durations
 */
class Duration {
  private ms: number;
  constructor(ms: number = 0) {
    this.ms = ms;
  }

  // Getters
  /**
   * Gets the duration in milliseconds
   */
  public getMilliseconds(): number {
    return this.ms;
  }

  /**
   * Gets the duration in seconds
   */
  public getSeconds(): number {
    return this.getMilliseconds() / 1000;
  }

  /**
   * Gets the duration in minutes
   */
  public getMinutes(): number {
    return this.getSeconds() / 60;
  }

  /**
   * Gets the duration in hours
   */
  public getHours(): number {
    return this.getMinutes() / 60;
  }

  /**
   * Gets the duration in days
   */
  public getDays(): number {
    return this.getHours() / 24; 
  }
  

  /**
   * Creates a Duration object from a value in hours
   *
   * @param hours A numerical expression representing the hours
   */
  static fromHours(hours: number): Duration {
    const ms = hours * 60 * 60 * 1000;
    return new Duration(ms);
  }

  /**
   * Creates a Duration object from a value in minutes
   *
   * @param minutes A numerical expression representing the minutes
   */
  static fromMinutes(minutes: number): Duration {
    const ms = minutes * 60 * 1000;
    return new Duration(ms);
  }

  /**
   * Creates a Duration object from a value in seconds
   *
   * @param seconds A numerical expression representing the seconds
   */
  static fromSeconds(seconds: number): Duration {
    const ms = seconds * 1000;
    return new Duration(ms);
  }

  /**
   * Creates a Duration object from a value in milliseconds
   *
   * @param ms A numerical expression representing the milliseconds
   */
  static fromMilliseconds(ms: number): Duration {
    return new Duration(ms);
  }

  /**
   * Creates a Duration object from the difference between two dates (b - a)
   *
   * @param a Date object
   * @param b Date object
   * @returns
   */
  static fromDifference(a: Date, b: Date): Duration {
    const ms = b.getTime() - a.getTime();
    return new Duration(ms);
  }

  /**
   * Creates a Duration object by adding a duration to a dat
   *
   * @param date The date to add the duration to
   * @param duration The duration to add
   * @returns
   */
  static add(date: Date, duration: Duration): Date {
    return new Date(date.getTime() + duration.getMilliseconds());
  }
}

export default Duration;

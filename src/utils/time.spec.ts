import Duration from "./Duration";
import {
  getTimezoneOffset,
  timezoneConvert,
  dateRange,
} from "./time";
process.env.TZ = "America/Toronto"

describe("getTimezoneOffset", () => {
  it("calculates the GMT timezone offset correctly", () => {
    // These do not observe DST
    expect(getTimezoneOffset("Asia/Karachi")).toBe(5);
    expect(getTimezoneOffset("Asia/Shanghai")).toBe(8);
  });

  it("calulate the GMT timezone offset for a specified date", () => {
    let mar9 = new Date(2024, 2, 9); // GMT-5

    let mar11 = new Date(2024, 2, 11); // GMT-4 (DST ends)
    expect(getTimezoneOffset("America/Toronto", mar9)).toBe(-5);
    expect(getTimezoneOffset("America/Toronto", mar11)).toBe(-4);
  });

  it("calculates the GMT timezone offset correctly for when the DST changes", () => {
    let mar10_0 = new Date(2024, 2, 10, 0);
    let mar10_3 = new Date(2024, 2, 10, 3);
    expect(getTimezoneOffset("America/Toronto", mar10_0)).toBe(-5);
    expect(getTimezoneOffset("America/Toronto", mar10_3)).toBe(-4);
  });
});

describe("timezoneConvert", () => {
  it("converts a date to a specified timezone", () => {
    let feb13_12pm = new Date(2024, 1, 13, 12, 0, 0, 0);
    // let karachiNow = timezoneConvert("Asia/Karachi", feb13_12pm);
    let shanghaiNow = timezoneConvert("Asia/Shanghai", feb13_12pm);

    expect(shanghaiNow.getFullYear()).toBe(2024);
    expect(shanghaiNow.getMonth()).toBe(1);
    expect(shanghaiNow.getDate()).toBe(14); // date changed
    expect(shanghaiNow.getHours()).toBe(1); // 1 am
  });
});

describe("dateRange", () => {
  it("creates a range of dates correctly with step size of 1 day", () => {
    let start = new Date();
    let end = new Date(start.getTime());
    end.setDate(start.getDate() + 2);
    let step = Duration.fromHours(24);
    let range = dateRange(start, end, step);
    expect(range.length).toBe(3);
    expect(range[0].getTime()).toBe(start.getTime());
    expect(range.at(-1)?.getTime()).toBe(end.getTime());
    expect(
      Duration.fromDifference(range[0], range[1]).getDays(),
    ).toBe(1);
  });

  it("creates a range of dates correctly with step size of 1 hour", () => {
    let start = new Date();
    let end = new Date(start.getTime());
    end.setDate(start.getDate() + 1);
    let step = Duration.fromHours(1);
    let range = dateRange(start, end, step);
    expect(range.length).toBe(25);
    expect(range[0].getTime()).toBe(start.getTime());
    expect(range.at(-1)?.getTime()).toBe(end.getTime());
    expect(
      Duration.fromDifference(range[0], range[1]).getHours(),
    ).toBe(1);
  });
});

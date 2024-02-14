import { getTimezoneOffset, timezoneConvert } from "./time";

describe("getTimezoneOffset", () => {
  it("calculates the GMT timezone offset correctly", () => {
    // These do not observe DST
    expect(getTimezoneOffset("Asia/Karachi")).toBe(5);
    expect(getTimezoneOffset("Asia/Shanghai")).toBe(8);
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

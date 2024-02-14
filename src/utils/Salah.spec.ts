import Salah, { TimingName, Madhab } from "./Salah";
import Duration from "./Duration";

describe("Salah", () => {
  const salah = new Salah({
    lat: 43.8975,
    lng: -78.9429,
    timeZone: "America/Toronto",
    madhab: Madhab.Hanafi,
  });
  // February 12th, 2024
  let date = new Date(2024, 1, 12);
  let expectedTimes: {
    [K in TimingName]: Date;
  } = {
    fajr: new Date(2024, 1, 12, 5, 59, 0, 0),
    sunrise: new Date(2024, 1, 12, 7, 20, 0, 0),
    dhuhr: new Date(2024, 1, 12, 12, 30, 0, 0),
    asr: new Date(2024, 1, 12, 15, 57, 0, 0),
    maghrib: new Date(2024, 1, 12, 17, 41, 0, 0),
    isha: new Date(2024, 1, 12, 19, 1, 0, 0),
    midnight: new Date(2024, 1, 13, 0, 30, 0),
  };

  const testTime = (name: TimingName) => {
    let time = salah.getTiming(name, date);
    let expected = expectedTimes[name];
    let diff = Duration.fromDifference(time, expected);
    expect(diff.getHours()).toBeCloseTo(0, 1);
  };

  for (let key of Object.keys(expectedTimes)) {
    let k = key as TimingName;
    it(`calculates ${k} time correctly`, () => {
      testTime(k);
    });
  }

  it("generates multiple times for the same date correctly", () => {
    const names: TimingName[] = [
      "fajr",
      "dhuhr",
      "asr",
      "maghrib",
      "isha",
    ];
    const times = salah.getTimings(names, date);
    expect(times.length).toBe(names.length);
    for (let i = 0; i < names.length; i++) {
      let time = times[i];
      let name = names[i];
      let expected = expectedTimes[name];
      let diff = Duration.fromDifference(time, expected);
      expect(diff.getHours()).toBeCloseTo(0, 1);
    }
  });
});

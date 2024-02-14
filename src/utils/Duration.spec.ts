import Duration from "./Duration";

describe("Duration", () => {
  it("calculates the difference between two dates correctly", () => {
    let today = new Date();
    let tom = new Date();
    tom.setDate(today.getDate() + 1);
    let dur = Duration.fromDifference(today, tom);
    expect(dur.getHours()).toBeCloseTo(24);
  });

  it("adds durations correctly", () => {
    let today = new Date();
    let plus24 = Duration.fromHours(24);
    let tom = new Date();
    tom.setDate(today.getDate() + 1);
    expect(
      Duration.add(today, plus24).getTime() / 1000 / 60 / 60,
    ).toBeCloseTo(tom.getTime() / 1000 / 60 / 60);
  });
});

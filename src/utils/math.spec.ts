import { normalize, deg2rad, rad2deg, DMath } from "./math";

describe("normalize", () => {
  it("normalizes values correctly", () => {
    expect(normalize(360 + 90, 360)).toBe(90);
    expect(normalize(0 - 33, 360)).toBe(360 - 33);
  });
});

describe("deg2rad", () => {
  it("converts degrees to radians correctly", () => {
    expect(deg2rad(90)).toBeCloseTo(Math.PI / 2);
  });
});

describe("rad2deg", () => {
  it("converts radians to degrees correctly", () => {
    expect(rad2deg(Math.PI / 2)).toBeCloseTo(90);
  });
});

describe("DMath", () => {
  describe("DMath.cos", () => {
    it("calculates the cosine in degrees correctly", () => {
      expect(DMath.cos(90)).toBeCloseTo(0);
    });
  });

  describe("DMath.sin", () => {
    it("calculates the sine in degrees correctly", () => {
      expect(DMath.sin(90)).toBeCloseTo(1);
    });
  });

  describe("DMath.tan", () => {
    it("calculates the the tangent in degrees correctly", () => {
      expect(DMath.tan(60)).toBeCloseTo(Math.sqrt(3));
    });
  });

  describe("DMath.acos", () => {
    it("calculates the arccosine in degrees correctly", () => {
      expect(DMath.acos(0)).toBeCloseTo(90);
    });
  });

  describe("DMath.asin", () => {
    it("calculates the arcsine in degrees correctly", () => {
      expect(DMath.asin(1)).toBeCloseTo(90);
    });
  });

  describe("DMath.atan", () => {
    it("calculate the arctangent in degrees correctly", () => {
      expect(DMath.atan(Math.sqrt(3))).toBeCloseTo(60);
    });
  });

  describe("DMath.atan2", () => {
    it("calculate the angle between the X axis and point(x, y) in degrees correctly", () => {
      expect(DMath.atan2(1, 0)).toBeCloseTo(90);
    });
  });
});

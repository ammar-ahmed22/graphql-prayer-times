

/**
 * Normalizes a value to the range [0, max]
 *
 * @export
 * @param {number} v The value to normalize
 * @param {number} max Max value
 */
export function normalize(v: number, max: number): number {
  let normalized = v % max;
  if (normalized < 0) {
    return normalized + max;
  }

  return normalized;
}


/**
 * Converts radians value to degrees
 *
 * @export
 * @param {number} rad Radians value
 */
export function rad2deg(rad: number): number {
  return rad * (180 / Math.PI);
}


/**
 * Converts degrees value to radians
 *
 * @export
 * @param {number} deg Degrees value
 */
export function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * An object the provides mathematical functions related to trigonometry in degrees.
 */
export namespace DMath {
  
  /**
   * Normalizes an angle in degrees to the range [0, 360]
   *
   * @export
   * @param {number} angle Angle to normalize
   */
  export function normalizeAngle(angle: number): number {
    return normalize(angle, 360);
  }

  
  /**
   * Returns the sine of an angle
   *
   * @export
   * @param {number} x A numeric expression that contains an angle measured in degrees 
   */
  export function sin(x: number): number {
    return Math.sin(deg2rad(x))
  }

  /**
   * Returns the cosine of an angle
   *
   * @export
   * @param {number} x A numeric expression that contains an angle measured in degrees 
   */
  export function cos(x: number): number {
    return Math.cos(deg2rad(x))
  }

  /**
   * Returns the tangent of an angle
   *
   * @export
   * @param {number} x A numeric expression that contains an angle measured in degrees 
   */
  export function tan(x: number): number {
    return Math.tan(deg2rad(x))
  }

  /**
   * Returns the angle (in degrees) from the X axis to a point
   * 
   * @param {number} y A numeric expression representing the cartesian y-coordinate.
   * @param {number} x A numeric expression representing the cartesian x-coordinate.
   */
  export function atan2(y: number, x: number): number {
    return rad2deg(Math.atan2(y, x));
  }

  /**
   * Returns the arcsine of a number in degrees
   * 
   * @param x A numeric expression
   * @returns 
   */
  export function asin(x: number): number {
    return rad2deg(Math.asin(x));
  }

  /**
   * Returns the arccosine of a number in degrees
   * 
   * @param x A numeric expression
   * @returns 
   */
  export function acos(x: number): number {
    return rad2deg(Math.acos(x));
  }

  /**
   * Returns the arctangent of a number in degrees
   * 
   * @param x A numeric expression
   * @returns 
   */
  export function atan(x: number): number {
    return rad2deg(Math.atan(x));
  }

  /**
   * Returns the arccotangent of a number in degrees
   * 
   * @param x A numeric expression
   * @returns 
   */
  export function acot(x: number): number {
    return rad2deg(Math.atan(1 / x));
  }
}

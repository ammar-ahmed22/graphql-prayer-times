import { ObjectType, Field, Int, ArgsType } from "type-graphql";

type DateFieldProps = {
  year: number;
  month: number;
  day: number;
  localeString: string;
};

@ObjectType({
  description: "Object that stores a date in different formats.",
})
export class DateField implements DateFieldProps {
  constructor(date: Date, locale: string) {
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
    this.localeString = date.toLocaleDateString(locale);
  }
  @Field(returns => Int, { description: "The year value." })
  public year: number;

  @Field(returns => Int, {
    description: "The month value from 1-12.",
  })
  public month: number;

  @Field(returns => Int, { description: "The day value from 1-31" })
  public day: number;

  @Field(returns => String, {
    description:
      "The date as a string according to the locale provided.",
  })
  public localeString: string;
}

type TimeFieldProps = {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  localeString: string;
};

@ObjectType({
  description: "Object that stores a date in different formats.",
})
export class TimeField implements TimeFieldProps {
  constructor(date: Date, locale: string) {
    this.hour = date.getHours();
    this.minute = date.getMinutes();
    this.second = date.getSeconds();
    this.millisecond = date.getMilliseconds();
    this.localeString = date.toLocaleTimeString(locale);
  }

  @Field(returns => Int, {
    description: "The hour value in 24h format.",
  })
  public hour: number;

  @Field(returns => Int, { description: "The minute value." })
  public minute: number;

  @Field(returns => Int, { description: "The second value." })
  public second: number;

  @Field(returns => Int, { description: "The millisecond value." })
  public millisecond: number;

  @Field(returns => String, {
    description:
      "The time as a string according the locale provided.",
  })
  public localeString: string;
}

type DatetimeProps = {
  timestamp: Date;
  date: DateField;
  time: TimeField;
  locale: string;
};

@ObjectType({
  description:
    "Object that stores date and time in different formats.",
})
class Datetime implements DatetimeProps {
  constructor(date: Date, locale: string) {
    this.timestamp = date;
    this.date = new DateField(date, locale);
    this.time = new TimeField(date, locale);
    this.localeString = date.toLocaleString(locale);
    this.locale = locale;
  }

  @Field({
    description: "The amount of milliseconds since the epoch.",
  })
  public timestamp: Date;

  @Field(returns => DateField, { description: "The date in various formats."})
  public date: DateField;

  @Field(returns => TimeField, { description: "The time in various formats."})
  public time: TimeField;

  @Field(returns => String, { description: "The locale used." })
  public locale: string;

  @Field(returns => String, {
    description:
      "The date and time as a string according to the locale provided.",
  })
  public localeString: string;
}

export default Datetime;

import { ObjectType, Field, Int, ArgsType } from "type-graphql";

type DateFieldProps = {
  year: number;
  month: number;
  day: number;
  localeString: string;
};

@ObjectType()
export class DateField implements DateFieldProps {
  constructor(date: Date, locale: string) {
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
    this.localeString = date.toLocaleDateString(locale);
  }
  @Field(returns => Int)
  public year: number;

  @Field(returns => Int)
  public month: number;

  @Field(returns => Int)
  public day: number;

  @Field(returns => String)
  public localeString: string;
}

type TimeFieldProps = {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  localeString: string;
};

@ObjectType()
export class TimeField implements TimeFieldProps {
  constructor(date: Date, locale: string) {
    this.hour = date.getHours();
    this.minute = date.getMinutes();
    this.second = date.getSeconds();
    this.millisecond = date.getMilliseconds();
    this.localeString = date.toLocaleTimeString(locale);
  }

  @Field(returns => Int)
  public hour: number;

  @Field(returns => Int)
  public minute: number;

  @Field(returns => Int)
  public second: number;

  @Field(returns => Int)
  public millisecond: number;

  @Field(returns => String)
  public localeString: string;
}

type DatetimeProps = {
  timestamp: Date;
  date: DateField;
  time: TimeField;
  locale: string;
};

@ObjectType()
class Datetime implements DatetimeProps {
  constructor(date: Date, locale: string) {
    this.timestamp = date;
    this.date = new DateField(date, locale);
    this.time = new TimeField(date, locale);
    this.locale = locale;
  }

  @Field()
  public timestamp: Date;

  @Field(returns => DateField)
  public date: DateField;

  @Field(returns => TimeField)
  public time: TimeField;

  @Field(returns => String)
  public locale: string;
}

export default Datetime;

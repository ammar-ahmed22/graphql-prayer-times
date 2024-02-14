import { ObjectType, Field } from "type-graphql";
import Datetime from "./Datetime";

export type TimingProps = {
  name: string;
  datetime: Datetime;
};

@ObjectType()
class Timing implements TimingProps {
  constructor(name: string, date: Date, locale: string) {
    this.name = name;
    this.datetime = new Datetime(date, locale);
  }

  @Field()
  public name: string;

  @Field(returns => Datetime)
  public datetime: Datetime;
}

export default Timing;

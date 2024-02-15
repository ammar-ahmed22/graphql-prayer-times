import { ObjectType, Field } from "type-graphql";
import Datetime from "./Datetime";

export type TimingProps = {
  name: string;
  datetime: Datetime;
};

@ObjectType({ description: "Object that contains a name and datetime data."})
class Timing implements TimingProps {
  constructor(name: string, date: Date, locale: string) {
    this.name = name;
    this.datetime = new Datetime(date, locale);
  }

  @Field({ description: "Name of the prayer time." })
  public name: string;

  @Field(returns => Datetime, { description: "The date and time of the prayer time."})
  public datetime: Datetime;
}

export default Timing;

import { 
  Resolver as ResolverType,
  Query,
  Arg,
  Float,
  Int,
  Args
} from "type-graphql";
import PrayerTimes, { TimingNameInput } from "../models/PrayerTimes";
import { Madhab, Methods, MethodName, isMethodName, SalahOptions } from "../utils/Salah";
import { timezoneConvert } from "../utils/time";
import CalculationInput from "../inputs/CalculationInput";
import DateInput from "../inputs/DateInput";

@ResolverType()
class Resolver {

  @Query(returns => String)
  test(
    @Arg("name", { nullable: true }) name?: string
  ) {
    if (name) return `hello ${name}`
    return "hello world"
  }

  @Query(returns => PrayerTimes)
  today(
    @Args({ validate: true }) { lat, lng, timeZone, locale, method, madhab, timings } : CalculationInput,
    @Arg("date", { validate: true, nullable: true }) dateInput?: DateInput
  ) {

    let date: Date;
    if (dateInput) {
      date = dateInput.date;
    } else {
      date = timezoneConvert(timeZone, new Date());
    }
    
    console.log({ lat, lng, timeZone, locale, method, madhab, timings });
  

    const salahOpts: SalahOptions = {
      lat,
      lng,
      timeZone,
      madhab,
      method: Methods[method]
    }; 

    let timingsObj: TimingNameInput = {};
    timings.forEach(timing => {
      timingsObj[timing] = true;
    })
    
    return new PrayerTimes(
      salahOpts,
      timingsObj,
      date,
      locale
    )
  }
}

export default Resolver;
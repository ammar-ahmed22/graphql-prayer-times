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
    @Args(type => CalculationInput) { lat, lng, timeZone, locale, method, madhab } : CalculationInput
  ) {
    let today = timezoneConvert(timeZone, new Date());
    console.log({ lat, lng, timeZone, locale, method, madhab });
    if (!isMethodName(method)) {
      throw new Error(`method = \`${method}\` is not a MethodName`)
    }

    if (madhab < 1 || madhab > 2) {
      throw new Error(`madhab = \`${madhab}\` is invalid! Must be 1 or 2.`)
    }

    const salahOpts: SalahOptions = {
      lat,
      lng,
      timeZone,
      madhab,
      method: Methods[method]
    }; 

    let timings: TimingNameInput = {
      asr: true
    }

    return new PrayerTimes(
      salahOpts,
      timings,
      today,
      locale
    )
  }
}

export default Resolver;
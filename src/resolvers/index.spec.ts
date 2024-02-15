import "reflect-metadata";
import { GraphQLSchema } from "graphql";
import { createSchema, schemaRequest } from "../utils/graphql";
import PrayerTimes from "../models/PrayerTimes";


describe("Integration", () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    try {
      schema = await createSchema();
    } catch (error: any) {
      console.log(error.details);
    }
  })

  it("gets responses by date correctly", async () => {
    const query = `query ByDate($location: LocationInput!, $calculation: CalculationInput, $date: DateInput) {
      byDate(location: $location, calculation: $calculation, date: $date) {
        params {
          timeZone
          location {
            lat
            lng
          }
        }
        date {
          year
          month
          day
        }
        timings {
          name
          datetime {
            date {
              year
              month
              day
            }
            time {
              hour
              minute
              second
            }
          }
        }
      }
    }`
    const variableValues = {
      location: {
        city: "Whitby",
        country: "Canada"
      },
      calculation: {
        timings: ["fajr"],
        timeZone: "America/Toronto"
      },
      date: {
        string: "2024-02-15"
      }
    }
    const result = await schemaRequest<PrayerTimes>({ schema, source: query, variableValues });
    const fajrTime = {
      hour: 5,
      minute: 55,
      second: 55
    }
    const date = {
      year: 2024,
      day: 15,
      month: 2
    }

    expect(result.data).toBeDefined();
    expect(result.data.byDate).toBeDefined();
    expect(result.data.byDate.date).toMatchObject(date);
    expect(result.data.byDate.timings[0].name).toBe("fajr");
    expect(result.data.byDate.timings[0].datetime.date).toMatchObject(date);
    expect(result.data.byDate.timings[0].datetime.time).toMatchObject(fajrTime);
  })
})
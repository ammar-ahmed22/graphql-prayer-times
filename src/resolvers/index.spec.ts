import "reflect-metadata";
import { GraphQLSchema } from "graphql";
import { createSchema, schemaRequest } from "../utils/graphql";


describe("Integration", () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    try {
      schema = await createSchema();
    } catch (error: any) {
      console.log(error.details);
    }
  })

  it("runs", async () => {
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
      "location": {
        "city": "Whitby",
        "country": "Canada"
      },
      "calculation": {
        "timings": ["fajr"],
        "timeZone": "America/Toronto"
      },
      "date": {
        "string": "2024-02-15"
      }
    }
    const result = await schemaRequest({ schema, source: query, variableValues });
    console.log(result.data.byDate.date);
    console.log(result.data.byDate.timings[0].datetime.time);
    expect(true).toBe(true);
  })
})
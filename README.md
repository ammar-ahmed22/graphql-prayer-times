<div align="center">
  <img src="./images//graphql-prayer-times-logo.png" width="100" height="100" borderRadius="500" >
  <h1>Prayer Times GraphQL API</h1>
  <p>API is live here: <a href="https://graphql-prayer-times.fly.dev/graphql">https://graphql-prayer-times.fly.dev/graphql</a></p>
</div>

A public GraphQL API for calculating Islamic prayer times with highly configurable options. All calculations are done internally without any external dependencies (for the calculations).

## Available Queries:
```graphql
byDate(
  location: LocationInput!
  date: DateInput
  calculation: CalculationInput
) : PrayerTimes!

byRange(
 location: LocationInput!
 start: DateInput!
 end: DateInput!
 calculation: CalculationInput
) : [PrayerTimes!]!
```

## Inputs
### `LocationInput`
```graphql
input LocationInput {
  address: String
  city: String
  country: String
  lat: Float
  lng: Float
}
```
The location input can be provided in 3 distinct ways:
1. only `address`: Makes an [OpenStreetMaps API](https://nominatim.org/release-docs/latest/api/Overview/) request to search for the latitude/longitude
2. `city` and `country`: Makes an [OpenStreetMaps API](https://nominatim.org/release-docs/latest/api/Overview/) request to search for the latitude/longitude
3. `lat` and `lng`: Uses these values directly

> [!WARNING]
> Providing the `LocationInput` with a combination of any of the above 3 methods will throw a validation error.

### `DateInput`
```graphql
input DateInput {
  day: Int
  month: Int
  string: String
  year: Int
}
```
The date input can be provided in 2 distinct ways:
1. only `string`: Must be an ISO8601 date string (`YYYY-MM-DD`)
2. `year`, `month`, and `day`: All values must be valid (i.e. `month` cannot be `14`)

> [!WARNING]
> Providing the `DateInput` with a combination of the 2 methods will throw a validation error.

### `CalculationInput`
```graphql
input CalculationInput {
  locale: String! = "en-US"
  madhab: Int! = 1
  method: String! = "MWL"
  timeZone: String
  timings: [String!]! = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "midnight"]
}
```
The calculation input is never required, thus, all of the properties (aside from `timeZone`) have default values.

Provided below are descriptions for each of the properties:
| Name       | Description                                                                                                                          | Allowed Values                                                 | Default                                                          |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------- | :--------------------------------------------------------------- |
| `locale`   | The locale used for the output of date/time strings.                                                                                 | As per the [JavaScript documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)                            | `en-US`                                                          |
| `madhab`   | The madhab (school of thought) used for Asr time calculation. For more details, see the [calculation docs](./docs/calculation.md).   | `1` (for Shafi, Hanbali, Maliki), `2` (for Hanafi)         | `1`                                                              |
| `method`   | The calculation method used for Fajr/Isha times. For more details, see the [calculation docs](./docs/calculation.md).                | `MWL`, `ISNA`, `Egypt`                                         | `MWL`                                                            |
| `timeZone` | The timezone to use for calculation and output of the timings. If not provided, `lat` and `lng` are used to find the local timezone. | As per the [IANA database](https://www.iana.org/time-zones)                                       | `null`                                                           |
| `timings`  | The timings to calculate times for. For more details, see the [calculation docs](./docs/calculation.md)                              | `fajr`, `sunrise`, `dhuhr`, `asr`, `maghrib`, `isha`, `sunset` | [`fajr`, `sunrise`, `dhuhr`, `asr`, `maghrib`, `isha`, `sunset`] |

> [!WARNING]
> Providing a `timeZone` that does not match with the provided `LocationInput` may result in invalid/confusing results. 

## Output
### `PrayerTimes`
```graphql
type PrayerTimes {
  date: DateField!
  params: PrayerTimesParams!
  timings: [Timing!]!
}
```
For more information about these fields, check out the [playground/docs](https://graphql-prayer-times.fly.dev/graphql).

## Examples
### Get all times for Toronto, Canada
#### Query
```graphql
query AllTimesTorontoCanada {
  byDate(
    location: {
      city: "Toronto",
      country: "Canada"
    }
    date: {
      string: "2024-02-14"
    }
  ) {
    timings {
      name
      datetime {
        time {
          localeString
        }
      }
    }
  }
}
```
The above query will provide the below JSON output:

```json
{
  "data": {
    "byDate": {
      "timings": [
        {
          "name": "fajr",
          "datetime": {
            "time": {
              "localeString": "5:58:54 AM"
            }
          }
        },
        {
          "name": "sunrise",
          "datetime": {
            "time": {
              "localeString": "7:18:50 AM"
            }
          }
        },
        {
          "name": "dhuhr",
          "datetime": {
            "time": {
              "localeString": "12:31:42 PM"
            }
          }
        },
        {
          "name": "asr",
          "datetime": {
            "time": {
              "localeString": "3:18:44 PM"
            }
          }
        },
        {
          "name": "maghrib",
          "datetime": {
            "time": {
              "localeString": "5:44:34 PM"
            }
          }
        },
        {
          "name": "isha",
          "datetime": {
            "time": {
              "localeString": "7:04:31 PM"
            }
          }
        },
        {
          "name": "midnight",
          "datetime": {
            "time": {
              "localeString": "12:31:00 AM"
            }
          }
        }
      ]
    }
  }
}
```

### Asr time, Hanafi Madhab, Toronto, Canada, 1 week
#### Query
```graphql
query AsrHanafiWeekTorontoCanada {
  byRange(
    location: {
      city: "Toronto",
      country: "Canada"
    },
    start: {
      string: "2024-02-14"
    },
    end: {
      string: "2024-02-28"
    },
    calculation: {
      madhab: 2,
      timings: ["asr"]
    }
  ) {
    date {
      localeString
    }
    params {
      madhab
    }
    timings {
      name
      datetime {
        time {
          localeString
        }
      }
    }
  }
}
```
The above query outputs the following JSON:

```json
{
  "data": {
    "byRange": [
      {
        "date": {
          "localeString": "2/14/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:00:56 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/15/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:02:12 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/16/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:03:28 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/17/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:04:43 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/18/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:05:57 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/19/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:07:11 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/20/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:08:24 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/21/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:09:37 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/22/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:10:50 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/23/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:12:01 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/24/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:13:13 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/25/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:14:23 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/26/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:15:33 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/27/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:16:43 PM"
              }
            }
          }
        ]
      },
      {
        "date": {
          "localeString": "2/28/2024"
        },
        "params": {
          "madhab": "Hanafi"
        },
        "timings": [
          {
            "name": "asr",
            "datetime": {
              "time": {
                "localeString": "4:17:52 PM"
              }
            }
          }
        ]
      }
    ]
  }
}
```

## Docs

- [GraphQL](https://graphql.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [TypeGraphQL](https://typegraphql.com/docs/introduction.html)
- [Express](https://expressjs.com/)

## License
[MIT](./LICENSE)
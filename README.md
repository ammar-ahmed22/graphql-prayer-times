<div align="center">
  <img src="./images//graphql-prayer-times-logo.jpg" width="100" height="100" borderRadius="500" >
  <h1>Prayer Times GraphQL API</h1>
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
| `locale`   | The locale used for the output of date/time strings.                                                                                 | As per the JavaScript documentation                            | `en-US`                                                          |
| `madhab`   | The madhab (school of thought) used for Asr time calculation. For more details, see the [calculation docs](./docs/calculation.md).   | `1` (for Shafi, Hanbali, and Maliki), `2` (for Hanafi)         | `1`                                                              |
| `method`   | The calculation method used for Fajr/Isha times. For more details, see the [calculation docs](./docs/calculation.md).                | `MWL`, `ISNA`, `Egypt`                                         | `MWL`                                                            |
| `timeZone` | The timezone to use for calculation and output of the timings. If not provided, `lat` and `lng` are used to find the local timezone. | As per the IANA database                                       | `null`                                                           |
| `timings`  | The timings to calculate times for. For more details, see the [calculation docs](./docs/calculation.md)                              | `fajr`, `sunrise`, `dhuhr`, `asr`, `maghrib`, `isha`, `sunset` | [`fajr`, `sunrise`, `dhuhr`, `asr`, `maghrib`, `isha`, `sunset`] |

> [!WARNING]
> Providing a `timeZone` that does not match with the provided `LocationInput` may result in invalid/confusing results. 

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

## Schema

<!-- 
# Prayer Times GraphQL API

## Overview

This GraphQL API provides prayer times calculations for different locations and dates. It supports various calculation methods and madhabs.

## Schema

### Types

- **DateField**: Represents a date with day, month, and year fields.
- **Datetime**: Represents a date and time with additional formatting options.
- **LocationType**: Represents a geographical location with latitude and longitude.
- **PrayerTimes**: Represents the prayer times for a specific date and location.
- **PrayerTimesParams**: Parameters used for the calculation of prayer times.
- **TimeField**: Represents a time with hour, minute, and second fields.
- **Timing**: Represents a specific prayer time with its name and datetime.

### Inputs

- **DateInput**: An input for dates with options for providing a string or individual year, month, and day values.
- **LocationInput**: An input for locations with options for providing an address, city and country, or latitude and longitude.

### Queries

- **byDate**: Calculates prayer times for a provided date and location.
- **byRange**: Calculates prayer times for a range of dates and a specific location.

## Example Queries

### Get Prayer Times for a Specific Date

```graphql
query {
  byDate(
    date: { year: 2024, month: 2, day: 14 },
    locale: "en-US",
    location: { lat: 43.65107, lng: -79.347015 },
    madhab: 1,
    method: "MWL",
    timeZone: "America/Toronto",
    timings: ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "midnight"]
  ) {
    date {
      day
      month
      year
    }
    params {
      locale
      location {
        lat
        lng
      }
      madhab
      method
      timeZone
    }
    timings {
      name
      datetime {
        date {
          day
          month
          year
        }
        time {
          hour
          minute
        }
      }
    }
  }
}
``` 
-->


## Docs

- [GraphQL](https://graphql.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [TypeGraphQL](https://typegraphql.com/docs/introduction.html)
- [Express](https://expressjs.com/)

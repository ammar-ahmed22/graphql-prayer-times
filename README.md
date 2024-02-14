<div align="center">
  <img src="./images//graphql-prayer-times-logo.jpg" width="100" height="100" borderRadius="500" >
  <h1>Prayer Times GraphQL API</h1>
</div>

A public GraphQL API for calculating Islamic prayer times with highly configurable options. All calculations are done internally without any external dependencies (for the calculations).

## Examples
### Get all Fardh Prayer times for Toronto, Canada
#### Query
```graphql
query FardhTorontoCanada($location: LocationInput!, $date: DateInput, $timings: [String!]!) {
  byDate(location: $location, date: $date, timings: $timings) {
    params {
      timeZone
      method
      madhab
      locale
      location {
        lat
        lng
      }
    }
    date {
      localeString
      year
      month
      day
    }
    timings {
      name
      datetime {
        timestamp
        time {
          localeString
          hour
          minute
          second
        }
      }
    }
  }
}
```

#### Variables
```json
{
  "location": {
    "city": "Toronto",
    "country": "Canada"
  },
  "date": {
    "string": "2024-02-14"
  },
  "timings": ["fajr", "dhuhr", "asr", "maghrib", "isha"]
}
```
#### Output
```json
{
  "data": {
    "byDate": {
      "params": {
        "timeZone": "America/Toronto",
        "method": "Muslim World League",
        "madhab": "Hanafi",
        "locale": "en-US",
        "location": {
          "lat": 43.6534817,
          "lng": -79.3839347
        }
      },
      "date": {
        "localeString": "2/14/2024",
        "year": 2024,
        "month": 2,
        "day": 14
      },
      "timings": [
        {
          "name": "fajr",
          "datetime": {
            "timestamp": 1707908334287,
            "time": {
              "localeString": "5:58:54 AM",
              "hour": 5,
              "minute": 58,
              "second": 54
            }
          }
        },
        {
          "name": "dhuhr",
          "datetime": {
            "timestamp": 1707931902655,
            "time": {
              "localeString": "12:31:42 PM",
              "hour": 12,
              "minute": 31,
              "second": 42
            }
          }
        },
        {
          "name": "asr",
          "datetime": {
            "timestamp": 1707941924746,
            "time": {
              "localeString": "3:18:44 PM",
              "hour": 15,
              "minute": 18,
              "second": 44
            }
          }
        },
        {
          "name": "maghrib",
          "datetime": {
            "timestamp": 1707950674530,
            "time": {
              "localeString": "5:44:34 PM",
              "hour": 17,
              "minute": 44,
              "second": 34
            }
          }
        },
        {
          "name": "isha",
          "datetime": {
            "timestamp": 1707955471022,
            "time": {
              "localeString": "7:04:31 PM",
              "hour": 19,
              "minute": 4,
              "second": 31
            }
          }
        }
      ]
    }
  }
}
```
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

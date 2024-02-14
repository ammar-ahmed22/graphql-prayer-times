<div align="center">
  <img src="./images//graphql-prayer-times-logo.jpg" width="100" height="100">
  <h1>Prayer Times GraphQL API</h1>
</div>

A public GraphQL API for calculating Islamic prayer times with highly configurable options. All calculations are done internally without any external dependencies (for the calculations).

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

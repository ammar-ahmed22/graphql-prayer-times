import "reflect-metadata";
import { GraphQLSchema, graphql } from "graphql";
import Resolver from ".";
import { buildSchema, getMetadataStorage, GraphQLTimestamp } from "type-graphql";

describe("Integration", () => {
  let schema: GraphQLSchema;
  let argInput: any;
  let argData: any;

  beforeEach(() => {
    argData = undefined;
    argInput = undefined;
  })

  beforeAll(async () => {
    getMetadataStorage().clear();
    try {
      schema = await buildSchema({
        resolvers: [Resolver],
        validate: true,
        scalarsMap: [{ type: Date, scalar: GraphQLTimestamp }],
      })
    } catch (error: any) {
      console.log(error.details);
    }
  })

  it("runs", async () => {
    const query = `query {
      byDate(
        location: {
          city: "Whitby",
          country: "Canada",
        },
        calculation: {
          timings: ["fajr"]
        }
      ) {
        date {
          localeString
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
    }`
    const result = await graphql({ schema, source: query });
    console.log(result);
    expect(true).toBe(true);
  })
})
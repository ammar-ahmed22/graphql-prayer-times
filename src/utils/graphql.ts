import "reflect-metadata"
import { buildSchema, GraphQLTimestamp } from "type-graphql";
import Resolver from "../resolvers";
import { GraphQLSchema, graphql } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { ObjMapLike } from "graphql/jsutils/ObjMap";
import { ApolloServer, BaseContext } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"

export const createSchema = async (emitSchemaPath?: string): Promise<GraphQLSchema> => {
  const schema = await buildSchema({
    resolvers: [Resolver],
    emitSchemaFile: emitSchemaPath && {
      path: emitSchemaPath
    },
    scalarsMap: [{ type: Date, scalar: GraphQLTimestamp }],
    validate: true,
  });
  return schema;
}

export const createPlugin = () => {
  const document = `query AllTimings($location: LocationInput!) {
    byDate(location: $location) {
      params {
        madhab
        method
        locale
        timeZone
        location {
          city
          country
          lat
          lng
        }
      }
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
  const variables: Record<string, any> = {
    location: {
      city: "Toronto",
      country: "Canada"
    }
  }
  return ApolloServerPluginLandingPageLocalDefault({ document, variables });
}


export const createServer = async (schema: GraphQLSchema): Promise<ApolloServer<BaseContext>> => {
  const server = new ApolloServer({
    schema,
    introspection: true,
    plugins: [createPlugin()]
  });

  return server;
}

type SchemaRequestOptions = {
  schema: GraphQLSchema,
  source: string,
  variableValues?: Maybe<{
    [key: string]: any
  }>
}

export async function schemaRequest<TData = any>(opts: SchemaRequestOptions) {
  const { schema, source, variableValues } = opts;
  const result = await graphql({ schema, source, variableValues });
  const response = {
    ...result,
    data: result.data as ObjMapLike<TData>
  }
  return response;
}
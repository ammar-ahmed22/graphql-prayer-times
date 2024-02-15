import "reflect-metadata"
import { buildSchema, GraphQLTimestamp } from "type-graphql";
import Resolver from "../resolvers";
import { GraphQLSchema, graphql } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { ApolloServer, BaseContext } from "@apollo/server";

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


export const createServer = async (schema: GraphQLSchema): Promise<ApolloServer<BaseContext>> => {
  const server = new ApolloServer({
    schema,
    introspection: true
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

export const schemaRequest = async (opts: SchemaRequestOptions) => {
  const { schema, source, variableValues } = opts;
  const result: any = await graphql({ schema, source, variableValues })
  return result;
}
import "reflect-metadata"
import { buildSchema, GraphQLTimestamp } from "type-graphql";
import Resolver from "../resolvers";
import { GraphQLSchema } from "graphql";
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
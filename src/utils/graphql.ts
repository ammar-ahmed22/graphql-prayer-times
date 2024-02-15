import "reflect-metadata"
import { buildSchema, GraphQLTimestamp } from "type-graphql";
import Resolver from "../resolvers";
import { ExecutionResult, GraphQLSchema, graphql } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { ObjMapLike } from "graphql/jsutils/ObjMap";
import { ApolloServer, BaseContext } from "@apollo/server";
import { ObjMap } from "graphql/jsutils/ObjMap";

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

export async function schemaRequest<TData = any>(opts: SchemaRequestOptions) {
  const { schema, source, variableValues } = opts;
  const result = await graphql({ schema, source, variableValues });
  const response = {
    ...result,
    data: result.data as ObjMapLike<TData>
  }
  return response;
}
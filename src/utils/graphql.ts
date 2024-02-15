import "reflect-metadata"
import { buildSchema, GraphQLTimestamp } from "type-graphql";
import Resolver from "../resolvers";

export const createSchema = async (emitSchemaPath?: string) => {
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

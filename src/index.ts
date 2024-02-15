import "reflect-metadata"; // Required for TypeGraphQL
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import express from "express";
import cors from "cors";
import { createSchema, createServer } from "./utils/graphql";


(async () => {

  const schema = await createSchema();

  const app = express(); // the express server

  // the graphql server
  // const server = await createServer(schema);
  const server = new ApolloServer({
    schema,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageLocalDefault()]
  })

  console.log("ENV:", process.env.NODE_ENV);

  await server.start();

  app.use(
    "/graphql", // the endpoint where our graphql server is hosted
    cors<cors.CorsRequest>(), // cors middleware
    express.json(), // parsing request body to json middleware
    expressMiddleware(server), // middleware for apollo server
  );

  const PORT = process.env.PORT || 8080;

  // Starting express server
  app.listen(PORT, () =>
    console.log(
      `🚀 Server ready at http://localhost:${PORT}/graphql`,
    ),
  );
})();

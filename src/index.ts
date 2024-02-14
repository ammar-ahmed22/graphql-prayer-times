import "reflect-metadata"; // Required for TypeGraphQL
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
// import {
//   ObjectType,
//   Resolver,
//   Int,
//   Field,
//   Query,
//   Arg,
//   buildSchema,
//   Mutation
// } from "type-graphql";
import { buildSchema, GraphQLTimestamp } from "type-graphql";
import Resolver from "./resolvers";

// User Type
// @ObjectType()
// class User{
//   constructor(params : {
//     username: string,
//     email: string,
//     phoneNumber: string,
//     firstName: string,
//     lastName: string,
//     age: number
//   }){
//     Object.assign(this, params);
//   }
//   @Field()
//   public username: string;

//   @Field()
//   public email: string;

//   @Field()
//   public phoneNumber: string;

//   @Field()
//   public firstName: string;

//   @Field()
//   public lastName: string;

//   @Field(type => Int) // must specify this, otherwise, it will be float
//   public age: number;
// }

// // Game Type
// @ObjectType()
// class PlayerIDs{
//   constructor(w: string = "", b: string = "") {
//     this.white = w;
//     this.black = b;
//   }
//   @Field()
//   public white: string;

//   @Field()
//   public black: string;
// }

// @ObjectType()
// class Takes{
//   constructor(w: string[] = [], b: string[] = []){
//     this.white = w;
//     this.black = b;
//   }
//   @Field(type => [String])
//   public white: string[];

//   @Field(type => [String])
//   public black: string[];
// }

// @ObjectType()
// class Game{

//   constructor(params : {
//     id: string,
//     gameStatus: string,
//     colorToMove: string,
//     playerIDs: PlayerIDs,
//     takes: Takes
//   }){
//     Object.assign(this, params);
//   }

//   @Field()
//   public id: string;

//   @Field()
//   public gameStatus: string;

//   @Field()
//   public colorToMove: string;

//   @Field(type => PlayerIDs)
//   public playerIDs: PlayerIDs;

//   @Field(type => Takes)
//   public takes: Takes;
// }

// @Resolver()
// class MyResolver{
//   constructor(
//     private database = {
//       users: [{
//         username: "ammar123",
//         email: "ammar123@email.com",
//         firstName: "Ammar",
//         lastName: "Ahmed",
//         phoneNumber: "1234567890",
//         age: 21
//       }],
//       games: [{
//         id: "foobar",
//         gameStatus: "active",
//         colorToMove: "w",
//         playerIDs: new PlayerIDs("ammar123", "bingbong"),
//         takes: new Takes(["pawn", "pawn", "knight"], ["queen"])
//       }]
//     }
//   ){}
//   @Query(returns => User)
//   getUser(
//     @Arg("username") username: string
//   ){
//     // pull data from database
//     const user = this.database.users.find( user => user.username === username );

//     if (!user) throw new Error("User not found!");

//     return new User(user);
//   }

//   @Query(returns => Game)
//   getGame(
//     @Arg("id") id: string
//   ){
//     // pull data from database
//     const game = this.database.games.find( game => game.id === id );

//     if (!game) throw new Error("Game not found!")

//     return new Game(game);

//   }

//   @Mutation(returns => User)
//   updateName(
//     @Arg("username") username: string,
//     @Arg("firstName", { nullable: true }) firstName?: string,
//     @Arg("lastName", { nullable: true }) lastName?: string
//   ){
//     const userIdx = this.database.users.findIndex( user => user.username === username)

//     if (userIdx === -1) throw new Error("User not found!")

//     if (firstName){
//       this.database.users[userIdx].firstName = firstName;
//     }

//     if (lastName){
//       this.database.users[userIdx].lastName = lastName;
//     }

//     return new User(this.database.users[userIdx])
//   }

// }

(async () => {
  const schema = await buildSchema({
    resolvers: [Resolver],
    emitSchemaFile: {
      path: __dirname + "/schema.gql", // this wil generate a graphql schema file for us to look at
    },
    scalarsMap: [{ type: Date, scalar: GraphQLTimestamp }],
    validate: true,
  });

  const app = express(); // the express server

  // the graphql server
  const server = new ApolloServer({
    schema,
    introspection: true
  });

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

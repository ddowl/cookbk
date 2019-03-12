import { GraphQLServer } from 'graphql-yoga';
import { prisma } from './generated/prisma-client';
import * as Query from './resolvers/Query';
import * as Mutation from './resolvers/Mutation';
import * as User from './resolvers/User';
import * as Recipe from './resolvers/Recipe';
import * as RecipeStep from './resolvers/RecipeStep';
import * as Kitchen from './resolvers/Kitchen';

const resolvers = {
  Query,
  Mutation,
  User,
  Recipe,
  RecipeStep,
  Kitchen
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
});
server.start(() => console.log(`Server is running on http://localhost:4000`));

export {};
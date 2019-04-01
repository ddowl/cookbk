require('dotenv').config();

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

const graphQLServer = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
});

const httpServerPromise = graphQLServer.start(({port, endpoint}) => {
  console.log(`Server is running on http://localhost:${port}${endpoint}`);
});

export { graphQLServer, httpServerPromise }
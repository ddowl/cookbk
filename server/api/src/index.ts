require('dotenv').config();

import { GraphQLServer } from 'graphql-yoga';
import { ContextParameters } from "graphql-yoga/dist/types";
import { prisma } from './generated/prisma-client';
import session from 'express-session';
import ms from 'ms';
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

const context = (req: ContextParameters) => ({ prisma, session: req.request.session });

const graphQLServer = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context,
});

// session middleware
graphQLServer.express.use(
  session({
    name: 'cookbook.sid',
    secret: `some-random-secret-here`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // change to process.env.NODE_ENV === 'production' when HTTPS is set up
      maxAge: ms('1d'),
    }
  })
);

const serverOpts = {
  port: 4000,
  cors: {
    credentials: true,
    origin: ['http://localhost:3000'], // frontend url
  }
};

const httpServerPromise = graphQLServer.start(serverOpts,({port, endpoint}) => {
  console.log(`Server is running on http://localhost:${port}${endpoint}`);
});

export { graphQLServer, httpServerPromise }
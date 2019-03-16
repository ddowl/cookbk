import { graphql } from "graphql";
import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import { prisma } from '../generated/prisma-client';  // test db client
import * as Query from '../../src/resolvers/Query';
import { GraphQLServer } from "graphql-yoga";

const schemaFileName = 'src/schema.graphql';
const typeDefs = fs.readFileSync(schemaFileName, 'utf-8');
const resolvers = { Query };

const schema = makeExecutableSchema({typeDefs, resolvers});
let rootValue = {};
let context = { prisma };

const testGraphQLServer = new GraphQLServer({ schema, context });
const testHttpServerPromise = testGraphQLServer.start({port: 1234});

describe('Query', () => {
  afterAll(async () => {
    // clear DB
    await prisma.deleteManyUsers();
    await prisma.deleteManyKitchens();
    await prisma.deleteManyRecipes();
    await prisma.deleteManyRecipeSteps();
    // close connection
    testHttpServerPromise.then(httpServer => httpServer.close());
  });

  describe('info', () => {
    test('it runs something', async () => {
      const query = `
        query {
          info
        }
      `;

      const result = await graphql(schema, query, rootValue, context);
      expect(result.data.info).toEqual("This is a test to make sure the endpoint is working!");
    });
  });

  describe('users', () => {
    afterEach(async () => {
      await prisma.deleteManyUsers();
    });

    const query = `
      query {
        users {
          id
        }
      }
    `;

    describe('no users', () => {
      test('returns no users', async () => {
        const result = await graphql(schema, query, rootValue, context);
        expect(result.data.users).toEqual([]);
      });
    });

    describe('some users', () => {
      let testUser;
      beforeEach(async () => {
        testUser = await prisma.createUser({email: "", firstName: "", lastName: ""});
      });

      test('returns all users', async () => {
        const result = await graphql(schema, query, rootValue, context);
        const users = result.data.users;
        expect(users.length).toEqual(1);
        expect(users[0].id).toEqual(testUser.id);
      });
    });
  });
});

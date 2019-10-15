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
  afterEach(async () => {
    // clear DB
    await prisma.deleteManyUsers();
    await prisma.deleteManyKitchens();
    await prisma.deleteManyRecipeSteps();
    await prisma.deleteManyRecipes();
  });

  afterAll(async () => {
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

  describe('allUsers', () => {
    const query = `
      query {
        allUsers {
          id
        }
      }
    `;

    describe('no users', () => {
      test('returns no users', async () => {
        const result = await graphql(schema, query, rootValue, context);
        expect(result.data.allUsers).toEqual([]);
      });
    });

    describe('some users', () => {
      let testUser;
      beforeEach(async () => {
        testUser = await prisma.createUser({email: "", encryptedPassword: ""});
      });

      test('returns all users', async () => {
        const result = await graphql(schema, query, rootValue, context);
        const users = result.data.allUsers;
        expect(users.length).toEqual(1);
        expect(users[0].id).toEqual(testUser.id);
      });
    });
  });

  describe('user(id)', () => {
    const query = `
      query user($id: ID!){
        user(id: $id) {
          id
        }
      }
    `;
    const userId = "dummyId";

    describe('no users', () => {
      test('returns null', async () => {
        const result = await graphql(schema, query, rootValue, context, {id: userId});
        expect(result.data.user).toEqual(null);
      });
    });

    describe('some users', () => {
      let testUser;
      beforeEach(async () => {
        testUser = await prisma.createUser({email: "1", encryptedPassword: "1"});
        await prisma.createUser({email: "2", encryptedPassword: "2"});
        await prisma.createUser({email: "3", encryptedPassword: "3"});
      });

      describe('query for nonexistent user', () => {
        test('returns null', async () => {
          const result = await graphql(schema, query, rootValue, context, {id: userId});
          expect(result.data.user).toEqual(null);
        });
      });

      describe('query for existing user', () => {
        test('returns that user', async () => {
          const result = await graphql(schema, query, rootValue, context, {id: testUser.id});
          expect(result.data.user.id).toEqual(testUser.id);
        });
      });
    });
  });

  describe('allRecipes', () => {
    const query = `
      query {
        allRecipes {
          id
        }
      }
    `;

    describe('no recipes', () => {
      test('returns no recipes', async () => {
        const result = await graphql(schema, query, rootValue, context);
        expect(result.data.allRecipes).toEqual([]);
      });
    });

    describe('some recipes', () => {
      let testRecipe;
      beforeEach(async () => {
        const testUser = await prisma.createUser({email: "", encryptedPassword: ""});

        testRecipe = await prisma.createRecipe({
          name: "",
          description: "",
          maxServingWaitTime: 0,
          author: {
            connect: {
              id: testUser.id
            }
          }
        });
      });

      test('returns all recipes', async () => {
        const result = await graphql(schema, query, rootValue, context);
        const recipes = result.data.allRecipes;
        expect(recipes.length).toEqual(1);
        expect(recipes[0].id).toEqual(testRecipe.id);
      });
    });
  });

  describe('recipe(id)', () => {
    const query = `
      query recipe($id: ID!){
        recipe(id: $id) {
          id
        }
      }
    `;
    const recipeId = "dummyId";

    describe('no recipes', () => {
      test('returns null', async () => {
        const result = await graphql(schema, query, rootValue, context, {id: recipeId});
        expect(result.data.recipe).toEqual(null);
      });
    });

    describe('some recipes', () => {
      let testRecipe;
      beforeEach(async () => {
        const testUser = await prisma.createUser({email: "", encryptedPassword: ""});
        testRecipe = await prisma.createRecipe({
          name: "0",
          description: "0",
          maxServingWaitTime: 0,
          author: {
            connect: {
              id: testUser.id
            }
          }
        });
        await prisma.createRecipe({
          name: "1",
          description: "1",
          maxServingWaitTime: 1,
          author: {
            connect: {
              id: testUser.id
            }
          }
        });
        await prisma.createRecipe({
          name: "2",
          description: "2",
          maxServingWaitTime: 0,
          author: {
            connect: {
              id: testUser.id
            }
          }
        });
      });

      describe('query for nonexistent recipe', () => {
        test('returns null', async () => {
          const result = await graphql(schema, query, rootValue, context, {id: recipeId});
          expect(result.data.recipe).toEqual(null);
        });
      });

      describe('query for existing recipe', () => {
        test('returns that recipe', async () => {
          const result = await graphql(schema, query, rootValue, context, {id: testRecipe.id});
          expect(result.data.recipe.id).toEqual(testRecipe.id);
        });
      });
    });
  });
});

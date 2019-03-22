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
    await prisma.deleteManyRecipeSteps();
    await prisma.deleteManyRecipes();
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

  describe('user(id)', () => {
    afterEach(async () => {
      await prisma.deleteManyUsers();
    });

    const userId = "dummyId";

    const query = `
      query user($id: ID!){
        user(id: $id) {
          id
        }
      }
    `;

    describe('no users', () => {
      test('returns null', async () => {
        const result = await graphql(schema, query, rootValue, context, {id: userId});
        expect(result.data.user).toEqual(null);
      });
    });

    describe('some users', () => {
      let testUser;
      beforeEach(async () => {
        testUser = await prisma.createUser({email: "1", firstName: "1", lastName: "1"});
        await prisma.createUser({email: "2", firstName: "2", lastName: "2"});
        await prisma.createUser({email: "3", firstName: "3", lastName: "3"});
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

  describe('recipes', () => {
    afterEach(async () => {
      await prisma.deleteManyRecipes();
    });

    const query = `
      query {
        recipes {
          id
        }
      }
    `;

    describe('no recipes', () => {
      test('returns no recipes', async () => {
        const result = await graphql(schema, query, rootValue, context);
        expect(result.data.recipes).toEqual([]);
      });
    });

    describe('some recipes', () => {
      let testRecipe;
      beforeEach(async () => {
        testRecipe = await prisma.createRecipe({name: "", description: "", maxServingWaitTime: 0});
      });

      test('returns all recipes', async () => {
        const result = await graphql(schema, query, rootValue, context);
        const recipes = result.data.recipes;
        expect(recipes.length).toEqual(1);
        expect(recipes[0].id).toEqual(testRecipe.id);
      });
    });
  });

  describe('recipe(id)', () => {
    afterEach(async () => {
      await prisma.deleteManyRecipes();
    });

    const recipeId = "dummyId";

    const query = `
      query recipe($id: ID!){
        recipe(id: $id) {
          id
        }
      }
    `;

    describe('no recipes', () => {
      test('returns null', async () => {
        const result = await graphql(schema, query, rootValue, context, {id: recipeId});
        expect(result.data.recipe).toEqual(null);
      });
    });

    describe('some recipes', () => {
      let testRecipe;
      beforeEach(async () => {
        testRecipe = await prisma.createRecipe({name: "0", description: "0", maxServingWaitTime: 0});
        await prisma.createRecipe({name: "1", description: "1", maxServingWaitTime: 1});
        await prisma.createRecipe({name: "2", description: "2", maxServingWaitTime: 2});
      });

      describe('query for nonexistent recipe', () => {
        test('returns null', async () => {
          const result = await graphql(schema, query, rootValue, context, {id: recipeId});
          expect(result.data.recipe).toEqual(null);
        });
      });

      describe('query for existing user', () => {
        test('returns that user', async () => {
          const result = await graphql(schema, query, rootValue, context, {id: testRecipe.id});
          expect(result.data.recipe.id).toEqual(testRecipe.id);
        });
      });
    });
  });
});

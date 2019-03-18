import { graphql } from "graphql";
import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import {prisma, Recipe, User} from '../generated/prisma-client';  // test db client
import * as Mutation from '../../src/resolvers/Mutation';
import { GraphQLServer } from "graphql-yoga";

const schemaFileName = 'src/schema.graphql';
const typeDefs = fs.readFileSync(schemaFileName, 'utf-8');
const resolvers = { Mutation };

const schema = makeExecutableSchema({typeDefs, resolvers});
let rootValue = {};
let context = { prisma };

const testGraphQLServer = new GraphQLServer({ schema, context });
const testHttpServerPromise = testGraphQLServer.start({port: 1234});

describe('Mutation', () => {
  afterAll(async () => {
    // clear DB
    await prisma.deleteManyUsers();
    await prisma.deleteManyKitchens();
    // need to delete recipe steps first because cascading deletes aren't working with the Mongo connector
    // https://github.com/prisma/prisma/issues/1936
    await prisma.deleteManyRecipeSteps();
    await prisma.deleteManyRecipes();
    // close connection
    testHttpServerPromise.then(httpServer => httpServer.close());
  });

  // Users

  describe('createUser', () => {
    afterEach(async () => {
      await prisma.deleteManyUsers();
    });

    const query = `
      mutation createUser($firstName: String!, $lastName: String!, $email: String!){
        newUser: createUser(firstName: $firstName, lastName: $lastName, email: $email) {
          firstName
          lastName
          email
        }
      }
    `;

    const userData = {firstName: "First", lastName: "Lastman", email: "first.lastman@gmail.com"};

    describe('no users', () => {
      describe('create a user with distinct fields', () => {
        test('creates a new user', async () => {
          const result = await graphql(schema, query, rootValue, context, userData);
          expect(result.data.newUser).toEqual(userData);
          expect((await prisma.users()).length).toEqual(1);
        });
      });
    });

    describe('one user', () => {
      let testUser: User;
      beforeEach(async () => {
        testUser = await prisma.createUser({email: "1", firstName: "1", lastName: "1"});
      });

      describe('create a user with distinct fields', () => {
        test('creates a new user', async () => {
          const result = await graphql(schema, query, rootValue, context, userData);
          expect(result.data.newUser).toEqual(userData);
          expect((await prisma.users()).length).toEqual(2);
        });
      });

      describe('creating user with same email', () => {
        test('violates uniqueness', async () => {
          const userData = {firstName: "First", lastName: "Lastman", email: testUser.email};
          const errorMessage = 'A unique constraint would be violated on User. Details: Field name = email';

          const result = await graphql(schema, query, rootValue, context, userData);
          expect(result.errors[0].message).toEqual(errorMessage);
          expect((await prisma.users()).length).toEqual(1);
        });
      });
    });
  });

  describe('deleteUser', () => {
    afterEach(async () => {
      await prisma.deleteManyUsers();
    });

    const query =`
      mutation deleteUser($id: ID!){
        deletedUser: deleteUser(id: $id)
      }
    `;

    describe('deleting non-existent user', () => {
      const id = 'nonexistent';

      test('returns null, has no effect', async () => {
        const errorMessage = 'No Node for the model User with value nonexistent for id found.';

        const result = await graphql(schema, query, rootValue, context, {id});
        expect(result.data.deletedUser).toEqual(null);
        expect(result.errors[0].message).toEqual(errorMessage);
        expect((await prisma.users()).length).toEqual(0);
      });
    });

    describe('deleting existing user', () => {
      let testUser: User;
      beforeEach(async () => {
        testUser = await prisma.createUser({email: "1", firstName: "1", lastName: "1"});
      });

      test('deletes the user', async () => {
        const result = await graphql(schema, query, rootValue, context, {id: testUser.id});
        expect(result.data.deletedUser).toEqual(testUser.id);
        expect((await prisma.users()).length).toEqual(0);
      });
    });
  });


  // Recipes

  describe('createRecipe', () => {
    afterEach(async () => {
      await prisma.deleteManyRecipes();
    });

    const query = `
      mutation createRecipe($name: String!, $description: String!, $maxServingWaitTime: Int) {
        newRecipe: createRecipe(name: $name, description: $description, maxServingWaitTime: $maxServingWaitTime) {
          name
          description
          maxServingWaitTime
        }
      }
    `;

    const recipeData = {name: "Toast", description: "A simple breakfast", maxServingWaitTime: 5};

    describe('no recipes', () => {
      describe('create a recipe with distinct fields', () => {
        test('creates a new recipe', async () => {
          const result = await graphql(schema, query, rootValue, context, recipeData);
          expect(result.data.newRecipe).toEqual(recipeData);
          expect((await prisma.recipes()).length).toEqual(1);
        });
      });

      describe('omitting maxServingWaitTime', () => {
        const recipeData = {name: "Toast", description: "A simple breakfast"};

        test('creates the new recipe without it', async () => {
          const result = await graphql(schema, query, rootValue, context, recipeData);
          expect(result.data.newRecipe.name).toEqual(recipeData.name);
          expect(result.data.newRecipe.description).toEqual(recipeData.description);
          expect(result.data.newRecipe.maxServingWaitTime).toEqual(null);
          expect((await prisma.recipes()).length).toEqual(1);
        });
      });
    });

    describe('one recipe', () => {
      let testRecipe: Recipe;
      beforeEach(async () => {
        testRecipe = await prisma.createRecipe({name: "1", description: "1", maxServingWaitTime: 1});
      });

      describe('create a recipe with distinct fields', () => {
        test('creates a new recipe', async () => {
          const result = await graphql(schema, query, rootValue, context, recipeData);
          expect(result.data.newRecipe).toEqual(recipeData);
          expect((await prisma.recipes()).length).toEqual(2);
        });
      });
    });
  });

  describe('deleteRecipe', () => {
    afterEach(async () => {
      await prisma.deleteManyRecipes();
    });

    const query =`
      mutation deleteRecipe($id: ID!){
        deletedRecipe: deleteRecipe(id: $id)
      }
    `;

    describe('deleting non-existent recipe', () => {
      const id = 'nonexistent';

      test('returns null, has no effect', async () => {
        const errorMessage = 'No Node for the model Recipe with value nonexistent for id found.';

        const result = await graphql(schema, query, rootValue, context, {id});
        expect(result.data.deletedRecipe).toEqual(null);
        expect(result.errors[0].message).toEqual(errorMessage);
        expect((await prisma.recipes()).length).toEqual(0);
      });
    });

    describe('deleting existing recipe', () => {
      let testRecipe: Recipe;
      beforeEach(async () => {
        testRecipe = await prisma.createRecipe({name: "1", description: "1", maxServingWaitTime: 1});
      });

      test('deletes the recipe', async () => {
        const result = await graphql(schema, query, rootValue, context, {id: testRecipe.id});
        expect(result.data.deletedRecipe).toEqual(testRecipe.id);
        expect((await prisma.recipes()).length).toEqual(0);
      });
    });
  });

  // RecipeStep

  describe('addStepToRecipe', () => {
    afterEach(async () => {
      await prisma.deleteManyRecipeSteps();
      await prisma.deleteManyRecipes();
    });

    const query =`
      mutation addStepToRecipe($description: String!, $duration: Int!, $isAttended: Boolean!, $recipeId: ID!){
        newRecipeStep: addStepToRecipe(description: $description, durationInMinutes: $duration, isAttended: $isAttended, recipeId: $recipeId) {
          id
          description
          duration
          isAttended
        }
      }
    `;

    const stepData = { description: "stir soup", duration: 5, isAttended: true, recipeId: "" };

    describe('non-existent recipe', () => {
      test("can't create recipe step", async () => {
        stepData.recipeId = 'nonexistent';
        const result = await graphql(schema, query, rootValue, context, stepData);
        expect(result.data.newRecipeStep).toEqual(null);
        expect((await prisma.recipeSteps()).length).toEqual(0);
      });
    });

    describe('existing recipe with no steps', () => {
      let testRecipe: Recipe;
      beforeEach(async () => {
        testRecipe = await prisma.createRecipe({name: "1", description: "1", maxServingWaitTime: 1});
        expect((await prisma.recipe({id: testRecipe.id}).steps())).toEqual([]);
      });

      test('adds a step to the recipe', async () => {
        stepData.recipeId = testRecipe.id;
        const result = await graphql(schema, query, rootValue, context, stepData);

        expect(result.data.newRecipeStep.description).toEqual(stepData.description);
        expect(result.data.newRecipeStep.duration).toEqual(stepData.duration);
        expect(result.data.newRecipeStep.isAttended).toEqual(stepData.isAttended);
        expect((await prisma.recipeSteps()).length).toEqual(1);

        const steps = await prisma.recipe({id: testRecipe.id}).steps();
        expect(steps.length).toEqual(1);
        expect(steps[0].description).toEqual(stepData.description);
        expect(steps[0].duration).toEqual(stepData.duration);
        expect(steps[0].isAttended).toEqual(stepData.isAttended);
      });
    });

    describe('existing recipe with several steps', () => {
      let testRecipe: Recipe;
      beforeEach(async () => {
        testRecipe = await prisma.createRecipe({
          name: "1",
          description: "1",
          maxServingWaitTime: 1,
          steps: {
            create: [
              {
                idx: 0,
                description: "first",
                duration: 3,
                isAttended: true,
              },
              {
                idx: 1,
                description: "second",
                duration: 5,
                isAttended: true,
              },
              {
                idx: 2,
                description: "third",
                duration: 10,
                isAttended: true,
              },
            ]
          }
        });
      });

      test('adds the last step to the recipe', async () => {
        stepData.recipeId = testRecipe.id;
        const result = await graphql(schema, query, rootValue, context, stepData);

        expect(result.data.newRecipeStep.description).toEqual(stepData.description);
        expect(result.data.newRecipeStep.duration).toEqual(stepData.duration);
        expect(result.data.newRecipeStep.isAttended).toEqual(stepData.isAttended);
        expect((await prisma.recipeSteps()).length).toEqual(4);

        const steps = await prisma.recipe({id: testRecipe.id}).steps();
        expect(steps.length).toEqual(4);
        expect(steps[3].description).toEqual(stepData.description);
        expect(steps[3].duration).toEqual(stepData.duration);
        expect(steps[3].isAttended).toEqual(stepData.isAttended);
      })
    });
  });
});

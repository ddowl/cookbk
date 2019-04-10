import { graphql } from "graphql";
import { GraphQLServer } from "graphql-yoga";
import { makeExecutableSchema } from 'graphql-tools';
import * as fs from 'fs';
import { prisma, Recipe, RecipeStep, User } from '../generated/prisma-client';  // test db client
import * as Mutation from '../../src/resolvers/Mutation';
import * as bcrypt  from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../../src/constants';

const schemaFileName = 'src/schema.graphql';
const typeDefs = fs.readFileSync(schemaFileName, 'utf-8');
const resolvers = { Mutation };

const schema = makeExecutableSchema({typeDefs, resolvers});
let rootValue = {};
let context = { prisma };
let port = 1234;

const testGraphQLServer = new GraphQLServer({ schema, context });
const testHttpServerPromise = testGraphQLServer.start({ port });

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

  // TODO: not sure how to test setting session/auth cookie
  // Is a headless browser integration test the only way to access cookies?
  describe('login', () => {
    afterEach(async () => {
      await prisma.deleteManyUsers();
    });

    const query = `
      mutation login($email: String!, $password: String!) {
        existingUser: login(email: $email, password: $password) {
          id
          email
        }
      }
    `;

    let email;
    let plaintextPassword;

    describe('non-existent user credentials', () => {
      beforeEach(async () => {
        email = 'nonexistent';
        plaintextPassword = 'nonexistent';
      });

      test('returns error message, cookie not set', async () => {
        const result = await graphql(schema, query, rootValue, context, {email: email, password: plaintextPassword});
        const errorMessage = 'Cannot login non-existent user';
        expect(result.errors[0].message).toEqual(errorMessage);
        expect(result.data.existingUser).toEqual(null);
      });
    });


    describe('existing user', () => {
      beforeEach(async () => {
        email = 'email';
        plaintextPassword = 'plaintext';
        const encryptedPassword = await bcrypt.hash(plaintextPassword, BCRYPT_SALT_ROUNDS);
        await prisma.createUser({email: email, encryptedPassword: encryptedPassword});
      });

      let passwordParam;

      describe('correct password', () => {
        beforeEach(async () => {
          passwordParam = plaintextPassword;
        });

        test('returns true, cookie set with auth token', async () => {
          const result = await graphql(schema, query, rootValue, context, {email: email, password: passwordParam});
          expect(result.data.existingUser.id).toBeDefined();
          expect(result.data.existingUser.email).toEqual(email);
        });
      });

      describe('incorrect password', () => {
        beforeEach(async () => {
          passwordParam = 'some other password';
        });

        test('throws an error indicating the password was wrong', async () => {
          const result = await graphql(schema, query, rootValue, context, {email: email, password: passwordParam});
          const errorMessage = 'Incorrect password';
          expect(result.errors[0].message).toEqual(errorMessage);
          expect(result.data.existingUser).toBeNull();
        });
      });

    });
  });

  describe('signup', () => {
    afterEach(async () => {
      await prisma.deleteManyUsers();
    });

    const query = `
      mutation signup($email: String!, $password: String!) {
        newUser: signup(email: $email, password: $password) {
          id
          email
        }
      }
    `;

    let email;
    let plaintextPassword;

    describe('non-existent user credentials', () => {
      beforeEach(async () => {
        email = 'nonexistent';
        plaintextPassword = 'nonexistent';
      });

      test('returns true, cookie set with auth token', async () => {
        const result = await graphql(schema, query, rootValue, context, {email: email, password: plaintextPassword});
        expect(result.data.newUser.email).toEqual(email);
        expect(result.data.newUser.id).toBeDefined();
      });
    });

    describe('existing user', () => {
      beforeEach(async () => {
        email = 'email';
        plaintextPassword = 'plaintext';
        const encryptedPassword = await bcrypt.hash(plaintextPassword, BCRYPT_SALT_ROUNDS);
        await prisma.createUser({email: email, encryptedPassword: encryptedPassword});
      });

      test('returns error message, cookie not set', async () => {
        const result = await graphql(schema, query, rootValue, context, {email: email, password: plaintextPassword});
        const errorMessage = 'Cannot signup existing user';
        expect(result.errors[0].message).toEqual(errorMessage);
        expect(result.data.newUser).toBeNull();
      });
    });
  });

  // Users

  describe('deleteUser', () => {
    afterEach(async () => {
      await prisma.deleteManyUsers();
    });

    const query =`
      mutation deleteUser($id: ID!){
        deletedUser: deleteUser(id: $id)
      }
    `;

    let testUser: User;

    describe('no users', () => {
      test('returns null, has no effect', async () => {
        const errorMessage = 'No Node for the model User with value nonexistent for id found.';

        const result = await graphql(schema, query, rootValue, context, {id: 'nonexistent'});
        expect(result.data.deletedUser).toEqual(null);
        expect(result.errors[0].message).toEqual(errorMessage);
        expect((await prisma.users()).length).toEqual(0);
      });
    });

    describe('one user', () => {
      beforeEach(async () => {
        testUser = await prisma.createUser({email: "", encryptedPassword: ""});
      });

      test('deletes the user', async () => {
        const result = await graphql(schema, query, rootValue, context, {id: testUser.id});
        expect(result.data.deletedUser).toEqual(testUser.id);
        expect((await prisma.users()).length).toEqual(0);
      });

      // Not sure we actually want this behavior
      // Cascading deletes for recipes and their steps makes sense, but recipes _might_ be able
      // to exist independently of users if the dependency on kitchenware isn't too strict.
    //   describe('with populated recipes', () => {
    //     afterEach(async () => {
    //       await prisma.deleteManyRecipeSteps();
    //       await prisma.deleteManyRecipes();
    //     });
    //
    //     beforeEach(async () => {
    //       await prisma.createRecipe({
    //         name: "",
    //         description: "",
    //         maxServingWaitTime: 0,
    //         steps: {
    //           create: [
    //             {
    //               idx: 0,
    //               description: "first",
    //               duration: 0,
    //               isAttended: true
    //             },
    //             {
    //               idx: 1,
    //               description: "second",
    //               duration: 0,
    //               isAttended: true
    //             },
    //           ]
    //         }
    //       });
    //     });
    //
    //     test('deletes the user and all of its related data (recipe and steps)', async () => {
    //       const result = await graphql(schema, query, rootValue, context, {id: testUser.id});
    //       console.log(result);
    //       expect(result.data.deletedUser).toEqual(testUser.id);
    //       expect((await prisma.users()).length).toEqual(0);
    //       expect((await prisma.recipes()).length).toEqual(0);
    //       expect((await prisma.recipeSteps()).length).toEqual(0);
    //     })
    //   });
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
      await prisma.deleteManyRecipeSteps();
    });

    const query =`
      mutation deleteRecipe($id: ID!){
        deletedRecipe: deleteRecipe(id: $id)
      }
    `;

    let testRecipe: Recipe;

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

    describe('deleting existing recipe with steps', () => {
      beforeEach(async () => {
        testRecipe = await prisma.createRecipe({
          name: "",
          description: "",
          maxServingWaitTime: 0,
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

      test('deletes the recipe and its steps', async () => {
        const result = await graphql(schema, query, rootValue, context, {id: testRecipe.id});
        expect(result.data.deletedRecipe).toEqual(testRecipe.id);
        expect((await prisma.recipes()).length).toEqual(0);
        expect((await prisma.recipeSteps()).length).toEqual(0);
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

  describe('moveStep', () => {
    afterEach(async () => {
      await prisma.deleteManyRecipeSteps();
      await prisma.deleteManyRecipes();
    });

    const query =`
      mutation moveStep($stepId: ID!, $recipeId: ID!, $destIdx: Int!){
        movedStepId: moveStep(stepId: $stepId, recipeId: $recipeId, destIdx: $destIdx)
      }
    `;

    let testStep: RecipeStep;
    let testRecipe: Recipe;
    let destIdx: number;

    describe('moving non-existent recipe', () => {
      testStep = { id: 'nonexistent', idx: -1, description: "", duration: 0, isAttended: true };
      testRecipe = { id: 'nonexistent', name: "test", description: '', maxServingWaitTime: 0 };
      destIdx = -1;

      test('returns null', async () => {
        const result = await graphql(schema, query, rootValue, context, {stepId: testStep.id, recipeId: testRecipe.id, destIdx});
        expect(result.data.movedStepId).toEqual(null);
      });
    });

    describe('recipe with one step exists', () => {
      beforeEach(async () => {
        testRecipe = await prisma.createRecipe({name: "1", description: "1", maxServingWaitTime: 1});
        testStep = await prisma.createRecipeStep({
          idx: 0,
          description: "",
          duration: 0,
          isAttended: true,
          recipe: {
            connect: {
              id: testRecipe.id
            }
          }
        });
      });

      describe('moving to idx -1', () => {
        beforeEach(() => {
          destIdx = -1;
        });

        test('returns null', async () => {
          const result = await graphql(schema, query, rootValue, context, {stepId: testStep.id, recipeId: testRecipe.id, destIdx});
          expect(result.data.movedStepId).toEqual(null);
        });
      });

      describe('moving to out of bounds idx', () => {
        beforeEach(() => {
          destIdx = 1;
        });

        test('returns null', async () => {
          const result = await graphql(schema, query, rootValue, context, {stepId: testStep.id, recipeId: testRecipe.id, destIdx});
          expect(result.data.movedStepId).toEqual(null);
        });
      });

      describe('moving to idx 0', () => {
        beforeEach(() => {
          destIdx = 0;
        });

        test('returns step id, no-op', async () => {
          const result = await graphql(schema, query, rootValue, context, {stepId: testStep.id, recipeId: testRecipe.id, destIdx});
          expect(result.data.movedStepId).toEqual(testStep.id);
          const steps = await prisma.recipe({id: testRecipe.id}).steps();
          expect(steps.length).toEqual(1);
          expect(steps[0]).toEqual(testStep);
        });
      });
    });

    describe('recipe with several steps exists', () => {
      beforeEach(async () => {
        testRecipe = await prisma.createRecipe({
          name: "1", description: "1", maxServingWaitTime: 1,
          steps: {
            create: [
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
              {
                idx: 3,
                description: "fourth",
                duration: 13,
                isAttended: true,
              },
            ]
          }
        });
        testStep = await prisma.createRecipeStep({
          idx: 0,
          description: "first",
          duration: 0,
          isAttended: true,
          recipe: {
            connect: {
              id: testRecipe.id
            }
          }
        });
      });

      describe('moving to idx 0', () => {
        beforeEach(() => {
          destIdx = 0;
        });

        test('returns step id, no-op', async () => {
          const result = await graphql(schema, query, rootValue, context, {stepId: testStep.id, recipeId: testRecipe.id, destIdx});
          expect(result.data.movedStepId).toEqual(testStep.id);
          const steps = await prisma.recipe({id: testRecipe.id}).steps({orderBy: "idx_ASC"});
          expect(steps.length).toEqual(4);
          expect(steps[destIdx].id).toEqual(testStep.id);
        });
      });

      describe('moving to idx 1', () => {
        beforeEach(() => {
          destIdx = 1;
        });

        test('returns step id, moves step to 1, swaps with second step', async () => {
          const result = await graphql(schema, query, rootValue, context, {stepId: testStep.id, recipeId: testRecipe.id, destIdx});
          expect(result.data.movedStepId).toEqual(testStep.id);
          const steps = await prisma.recipe({id: testRecipe.id}).steps({orderBy: "idx_ASC"});
          expect(steps.length).toEqual(4);
          expect(steps[0].idx).toEqual(0);
          expect(steps[0].description).toEqual("second");
          expect(steps[1].idx).toEqual(1);
          expect(steps[1].description).toEqual("first");
          expect(steps[2].idx).toEqual(2);
          expect(steps[2].description).toEqual("third");
          expect(steps[3].idx).toEqual(3);
          expect(steps[3].description).toEqual("fourth");
        });
      });

      describe('moving to idx 3', () => {
        beforeEach(() => {
          destIdx = 3;
        });

        test('returns step id, moves step to 3, shifts all others back', async () => {
          const result = await graphql(schema, query, rootValue, context, {stepId: testStep.id, recipeId: testRecipe.id, destIdx});
          expect(result.data.movedStepId).toEqual(testStep.id);
          const steps = await prisma.recipe({id: testRecipe.id}).steps({orderBy: "idx_ASC"});
          expect(steps.length).toEqual(4);
          expect(steps[0].idx).toEqual(0);
          expect(steps[0].description).toEqual("second");
          expect(steps[1].idx).toEqual(1);
          expect(steps[1].description).toEqual("third");
          expect(steps[2].idx).toEqual(2);
          expect(steps[2].description).toEqual("fourth");
          expect(steps[3].idx).toEqual(3);
          expect(steps[3].description).toEqual("first");
        });
      });
    });
  });

  describe('deleteStep', () => {
    afterEach(async () => {
      await prisma.deleteManyRecipeSteps();
      await prisma.deleteManyRecipes();
    });

    const query =`
      mutation deleteStep($stepId: ID!, $recipeId: ID!){
        deletedRecipeStepId: deleteStep(stepId: $stepId, recipeId: $recipeId)
      }
    `;

    let testStep: RecipeStep;
    let testRecipe: Recipe;

    describe('deleting non-existent step', () => {
      test('returns null, has no effect', async () => {
        const result = await graphql(schema, query, rootValue, context, {stepId: 'nonexistent', recipeId: 'nonexistent'});
        expect(result.data.deletedRecipeStepId).toEqual(null);
      });
    });

    describe('recipe with one step', () => {
      beforeEach(async () => {
        testRecipe = await prisma.createRecipe({name: "", description: "", maxServingWaitTime: 0});
        testStep = await prisma.createRecipeStep({idx: 0, description: "", duration: 0, isAttended: true, recipe: {connect: {id: testRecipe.id}}});
      });

      test('deletes the step', async () => {
        const result = await graphql(schema, query, rootValue, context, {stepId: testStep.id, recipeId: testRecipe.id});
        expect(result.data.deletedRecipeStepId).toEqual(testStep.id);
        const steps = await prisma.recipe({id: testRecipe.id}).steps();
        expect(steps.length).toEqual(0);
      });
    });

    describe('recipe with several steps', () => {
      beforeEach(async () => {
        testRecipe = await prisma.createRecipe({
          name: "1", description: "1", maxServingWaitTime: 1,
          steps: {
            create: [
              {
                idx: 0,
                description: "first",
                duration: 5,
                isAttended: true,
              },
              {
                idx: 2,
                description: "third",
                duration: 10,
                isAttended: true,
              },
              {
                idx: 3,
                description: "fourth",
                duration: 13,
                isAttended: true,
              },
            ]
          }
        });
        testStep = await prisma.createRecipeStep({idx: 1, description: "second", duration: 0, isAttended: true, recipe: {connect: {id: testRecipe.id}}});
      });

      test('deletes the step, reorders other steps', async () => {
        const result = await graphql(schema, query, rootValue, context, {stepId: testStep.id, recipeId: testRecipe.id});
        expect(result.data.deletedRecipeStepId).toEqual(testStep.id);
        const steps = await prisma.recipe({id: testRecipe.id}).steps();
        expect(steps.length).toEqual(3);
        expect(steps[0].idx).toEqual(0);
        expect(steps[0].description).toEqual("first");
        expect(steps[1].idx).toEqual(1);
        expect(steps[1].description).toEqual("third");
        expect(steps[2].idx).toEqual(2);
        expect(steps[2].description).toEqual("fourth");
      });
    });
  });
});

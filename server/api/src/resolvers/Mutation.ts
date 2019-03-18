import {Recipe} from "../generated/prisma-client";

async function createUser(parent, args, context, info) {
  return context.prisma.createUser(args);
}

async function deleteUser(parent, args, context, info) {
  return context.prisma.deleteUser({id: args.id}).id();
}
async function createRecipe(parent, args, context, info) {
  return context.prisma.createRecipe(args);
}

async function deleteRecipe(parent, args, context, info) {
  return context.prisma.deleteRecipe({id: args.id}).id();
}

async function addStepToRecipe(parent, args, context, info) {
  const recipeExists = await context.prisma.$exists.recipe({id: args.recipeId});
  if (!recipeExists) return null;

  const steps = await context.prisma.recipe({id: args.recipeId}).steps();
  return context.prisma.createRecipeStep({
    idx: steps.length,
    description: args.description,
    duration: args.durationInMinutes,
    isAttended: args.isAttended,
    recipe: {
      connect: {
        id: args.recipeId
      }
    }
  });
}

async function moveStep(parent, args, context, info) {
  return null;
}

async function deleteStep(parent, args, context, info) {
  return null;
}

export {
  createUser,
  deleteUser,
  createRecipe,
  deleteRecipe,
  addStepToRecipe,
  moveStep,
  deleteStep
}
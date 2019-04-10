import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from "../constants";

async function login(parent, args, context, info) {
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("Cannot login non-existent user");
  }
  if (await bcrypt.compare(args.password, user.encryptedPassword)) {
    // matching password!
    // set cookie

    return user;
  } else {
    throw new Error("Incorrect password");
  }
}

async function signup(parent, args, context, info) {
  const userExists = await context.prisma.$exists.user({ email: args.email });
  if (userExists) {
    throw new Error("Cannot signup existing user");
  }

  const encryptedPassword = await bcrypt.hash(args.password, BCRYPT_SALT_ROUNDS);

  const newUser = await context.prisma.createUser({
    email: args.email,
    encryptedPassword: encryptedPassword
  });

  // set cookie

  return newUser;
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
  let steps = await context.prisma.recipe({ id: args.recipeId }).steps({orderBy: "idx_ASC"});
  if (steps == null) return null;
  if (args.destIdx < 0 || args.destIdx >= steps.length) return null;
  const srcIdx = steps.map(s => s.id).indexOf(args.stepId);
  if (srcIdx == -1) return null;

  // now we know
  // (1) recipe exists
  // (2) 0 <= destIdx <= steps.length - 1
  // (3) step exists in recipe
  // commence the move!
  const stepToMove = steps[srcIdx];
  steps.splice(srcIdx, 1);
  steps.splice(args.destIdx, 0, stepToMove);

  const updateStepsQuery = steps.map((s, i) => ({
    where: {
      id: s.id
    },
    data: {
      idx: i
    }
  }));

  await context.prisma.updateRecipe({
    where: { id: args.recipeId },
    data: {
      steps: {
        update: updateStepsQuery
      }
    }
  });
  return args.stepId;
}

async function deleteStep(parent, args, context, info) {
  await context.prisma.deleteRecipeStep({id: args.stepId}).id();

  const steps = await context.prisma.recipe({ id: args.recipeId }).steps({orderBy: "idx_ASC"});
  const updateStepsQuery = steps.map((s, i) => ({
    where: {
      id: s.id
    },
    data: {
      idx: i
    }
  }));

  await context.prisma.updateRecipe({
    where: { id: args.recipeId },
    data: {
      steps: {
        update: updateStepsQuery
      }
    }
  });

  return args.stepId;
}

export {
  login,
  signup,
  deleteUser,
  createRecipe,
  deleteRecipe,
  addStepToRecipe,
  moveStep,
  deleteStep
}
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const constants_1 = require("../constants");
async function login(parent, args, context, info) {
    const user = await context.prisma.user({ email: args.email });
    if (!user) {
        throw new Error("Cannot login non-existent user");
    }
    if (await bcrypt.compare(args.password, user.encryptedPassword)) {
        context.session.userId = user.id;
        return user;
    }
    else {
        throw new Error("Incorrect password");
    }
}
exports.login = login;
async function signup(parent, args, context, info) {
    const userExists = await context.prisma.$exists.user({ email: args.email });
    if (userExists) {
        throw new Error("Cannot signup existing user");
    }
    const encryptedPassword = await bcrypt.hash(args.password, constants_1.BCRYPT_SALT_ROUNDS);
    const newUser = await context.prisma.createUser({
        email: args.email,
        encryptedPassword: encryptedPassword
    });
    context.session.userId = newUser.id;
    return newUser;
}
exports.signup = signup;
async function deleteUser(parent, args, context, info) {
    return context.prisma.deleteUser({ id: args.id }).id();
}
exports.deleteUser = deleteUser;
async function createRecipe(parent, args, context, info) {
    if (!context.session.userId) {
        throw new Error("need to log in to create recipes");
    }
    return context.prisma.createRecipe({
        name: args.name,
        description: args.description,
        maxServingWaitTime: args.maxServingWaitTime,
        author: {
            connect: {
                id: args.authorId
            }
        }
    });
}
exports.createRecipe = createRecipe;
async function deleteRecipe(parent, args, context, info) {
    return context.prisma.deleteRecipe({ id: args.id }).id();
}
exports.deleteRecipe = deleteRecipe;
async function addStepToRecipe(parent, args, context, info) {
    const recipeExists = await context.prisma.$exists.recipe({ id: args.recipeId });
    if (!recipeExists)
        return null;
    const steps = await context.prisma.recipe({ id: args.recipeId }).steps();
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
exports.addStepToRecipe = addStepToRecipe;
async function moveStep(parent, args, context, info) {
    let steps = await context.prisma.recipe({ id: args.recipeId }).steps({ orderBy: "idx_ASC" });
    if (steps == null)
        return null;
    if (args.destIdx < 0 || args.destIdx >= steps.length)
        return null;
    const srcIdx = steps.map(s => s.id).indexOf(args.stepId);
    if (srcIdx == -1)
        return null;
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
exports.moveStep = moveStep;
async function deleteStep(parent, args, context, info) {
    await context.prisma.deleteRecipeStep({ id: args.stepId }).id();
    const steps = await context.prisma.recipe({ id: args.recipeId }).steps({ orderBy: "idx_ASC" });
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
exports.deleteStep = deleteStep;
//# sourceMappingURL=Mutation.js.map
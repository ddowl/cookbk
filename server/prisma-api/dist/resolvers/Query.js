"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function info(parent, args, context, info) {
    return "This is a test to make sure the endpoint is working!";
}
exports.info = info;
async function me(parent, args, context, info) {
    if (context.session.userId) {
        return context.prisma.user({ id: context.session.userId });
    }
    else {
        return null;
    }
}
exports.me = me;
async function allUsers(parent, args, context, info) {
    return await context.prisma.users();
}
exports.allUsers = allUsers;
async function user(parent, args, context, info) {
    return await context.prisma.user({ id: args.id });
}
exports.user = user;
async function allRecipes(parent, args, context, info) {
    return await context.prisma.recipes();
}
exports.allRecipes = allRecipes;
async function recipe(parent, args, context, info) {
    return await context.prisma.recipe({ id: args.id });
}
exports.recipe = recipe;
//# sourceMappingURL=Query.js.map
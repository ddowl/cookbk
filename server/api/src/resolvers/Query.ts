function info(parent, args, context, info) {
  return "This is a test to make sure the endpoint is working!";
}

// return userId from session if it exists,
// otherwise, return null
async function me(parent, args, context, info) {
  if (context.session.userId) {
    return context.prisma.user({id: context.session.userId});
  } else {
    return null;
  }
}

async function allUsers(parent, args, context, info) {
  return await context.prisma.users();
}

async function user(parent, args, context, info) {
  return await context.prisma.user({id: args.id});
}

async function allRecipes(parent, args, context, info) {
  return await context.prisma.recipes();
}

async function recipe(parent, args, context, info) {
  return await context.prisma.recipe({id: args.id});
}

export {
  info,
  me,
  allUsers,
  user,
  allRecipes,
  recipe
}
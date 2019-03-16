function info(parent, args, context, info) {
  return "This is a test to make sure the endpoint is working!";
}

async function users(parent, args, context, info) {
  return await context.prisma.users();
}

export {
  info,
  users
}
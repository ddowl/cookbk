async function recipes(user, args, context, info) {
  return await context.prisma.user({ id: user.id }).recipes();
}

export {
  recipes
}
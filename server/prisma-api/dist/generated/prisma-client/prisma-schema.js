"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = `type AggregateKitchen {
  count: Int!
}

type AggregateRecipe {
  count: Int!
}

type AggregateRecipeStep {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar DateTime

type Kitchen {
  id: ID!
  name: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type KitchenConnection {
  pageInfo: PageInfo!
  edges: [KitchenEdge]!
  aggregate: AggregateKitchen!
}

input KitchenCreateInput {
  name: String!
}

input KitchenCreateManyInput {
  create: [KitchenCreateInput!]
  connect: [KitchenWhereUniqueInput!]
}

type KitchenEdge {
  node: Kitchen!
  cursor: String!
}

enum KitchenOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type KitchenPreviousValues {
  id: ID!
  name: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input KitchenScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [KitchenScalarWhereInput!]
  OR: [KitchenScalarWhereInput!]
  NOT: [KitchenScalarWhereInput!]
}

type KitchenSubscriptionPayload {
  mutation: MutationType!
  node: Kitchen
  updatedFields: [String!]
  previousValues: KitchenPreviousValues
}

input KitchenSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: KitchenWhereInput
  AND: [KitchenSubscriptionWhereInput!]
  OR: [KitchenSubscriptionWhereInput!]
  NOT: [KitchenSubscriptionWhereInput!]
}

input KitchenUpdateDataInput {
  name: String
}

input KitchenUpdateInput {
  name: String
}

input KitchenUpdateManyDataInput {
  name: String
}

input KitchenUpdateManyInput {
  create: [KitchenCreateInput!]
  update: [KitchenUpdateWithWhereUniqueNestedInput!]
  upsert: [KitchenUpsertWithWhereUniqueNestedInput!]
  delete: [KitchenWhereUniqueInput!]
  connect: [KitchenWhereUniqueInput!]
  set: [KitchenWhereUniqueInput!]
  disconnect: [KitchenWhereUniqueInput!]
  deleteMany: [KitchenScalarWhereInput!]
  updateMany: [KitchenUpdateManyWithWhereNestedInput!]
}

input KitchenUpdateManyMutationInput {
  name: String
}

input KitchenUpdateManyWithWhereNestedInput {
  where: KitchenScalarWhereInput!
  data: KitchenUpdateManyDataInput!
}

input KitchenUpdateWithWhereUniqueNestedInput {
  where: KitchenWhereUniqueInput!
  data: KitchenUpdateDataInput!
}

input KitchenUpsertWithWhereUniqueNestedInput {
  where: KitchenWhereUniqueInput!
  update: KitchenUpdateDataInput!
  create: KitchenCreateInput!
}

input KitchenWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [KitchenWhereInput!]
  OR: [KitchenWhereInput!]
  NOT: [KitchenWhereInput!]
}

input KitchenWhereUniqueInput {
  id: ID
}

scalar Long

type Mutation {
  createKitchen(data: KitchenCreateInput!): Kitchen!
  updateKitchen(data: KitchenUpdateInput!, where: KitchenWhereUniqueInput!): Kitchen
  updateManyKitchens(data: KitchenUpdateManyMutationInput!, where: KitchenWhereInput): BatchPayload!
  upsertKitchen(where: KitchenWhereUniqueInput!, create: KitchenCreateInput!, update: KitchenUpdateInput!): Kitchen!
  deleteKitchen(where: KitchenWhereUniqueInput!): Kitchen
  deleteManyKitchens(where: KitchenWhereInput): BatchPayload!
  createRecipe(data: RecipeCreateInput!): Recipe!
  updateRecipe(data: RecipeUpdateInput!, where: RecipeWhereUniqueInput!): Recipe
  updateManyRecipes(data: RecipeUpdateManyMutationInput!, where: RecipeWhereInput): BatchPayload!
  upsertRecipe(where: RecipeWhereUniqueInput!, create: RecipeCreateInput!, update: RecipeUpdateInput!): Recipe!
  deleteRecipe(where: RecipeWhereUniqueInput!): Recipe
  deleteManyRecipes(where: RecipeWhereInput): BatchPayload!
  createRecipeStep(data: RecipeStepCreateInput!): RecipeStep!
  updateRecipeStep(data: RecipeStepUpdateInput!, where: RecipeStepWhereUniqueInput!): RecipeStep
  updateManyRecipeSteps(data: RecipeStepUpdateManyMutationInput!, where: RecipeStepWhereInput): BatchPayload!
  upsertRecipeStep(where: RecipeStepWhereUniqueInput!, create: RecipeStepCreateInput!, update: RecipeStepUpdateInput!): RecipeStep!
  deleteRecipeStep(where: RecipeStepWhereUniqueInput!): RecipeStep
  deleteManyRecipeSteps(where: RecipeStepWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  kitchen(where: KitchenWhereUniqueInput!): Kitchen
  kitchens(where: KitchenWhereInput, orderBy: KitchenOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Kitchen]!
  kitchensConnection(where: KitchenWhereInput, orderBy: KitchenOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): KitchenConnection!
  recipe(where: RecipeWhereUniqueInput!): Recipe
  recipes(where: RecipeWhereInput, orderBy: RecipeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Recipe]!
  recipesConnection(where: RecipeWhereInput, orderBy: RecipeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): RecipeConnection!
  recipeStep(where: RecipeStepWhereUniqueInput!): RecipeStep
  recipeSteps(where: RecipeStepWhereInput, orderBy: RecipeStepOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [RecipeStep]!
  recipeStepsConnection(where: RecipeStepWhereInput, orderBy: RecipeStepOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): RecipeStepConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Recipe {
  id: ID!
  name: String!
  description: String!
  maxServingWaitTime: Int
  steps(where: RecipeStepWhereInput, orderBy: RecipeStepOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [RecipeStep!]
  author: User!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type RecipeConnection {
  pageInfo: PageInfo!
  edges: [RecipeEdge]!
  aggregate: AggregateRecipe!
}

input RecipeCreateInput {
  name: String!
  description: String!
  maxServingWaitTime: Int
  steps: RecipeStepCreateManyWithoutRecipeInput
  author: UserCreateOneWithoutRecipesInput!
}

input RecipeCreateManyWithoutAuthorInput {
  create: [RecipeCreateWithoutAuthorInput!]
  connect: [RecipeWhereUniqueInput!]
}

input RecipeCreateOneWithoutStepsInput {
  create: RecipeCreateWithoutStepsInput
  connect: RecipeWhereUniqueInput
}

input RecipeCreateWithoutAuthorInput {
  name: String!
  description: String!
  maxServingWaitTime: Int
  steps: RecipeStepCreateManyWithoutRecipeInput
}

input RecipeCreateWithoutStepsInput {
  name: String!
  description: String!
  maxServingWaitTime: Int
  author: UserCreateOneWithoutRecipesInput!
}

type RecipeEdge {
  node: Recipe!
  cursor: String!
}

enum RecipeOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  description_ASC
  description_DESC
  maxServingWaitTime_ASC
  maxServingWaitTime_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type RecipePreviousValues {
  id: ID!
  name: String!
  description: String!
  maxServingWaitTime: Int
  createdAt: DateTime!
  updatedAt: DateTime!
}

input RecipeScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  maxServingWaitTime: Int
  maxServingWaitTime_not: Int
  maxServingWaitTime_in: [Int!]
  maxServingWaitTime_not_in: [Int!]
  maxServingWaitTime_lt: Int
  maxServingWaitTime_lte: Int
  maxServingWaitTime_gt: Int
  maxServingWaitTime_gte: Int
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [RecipeScalarWhereInput!]
  OR: [RecipeScalarWhereInput!]
  NOT: [RecipeScalarWhereInput!]
}

type RecipeStep {
  id: ID!
  idx: Int!
  description: String!
  duration: Int!
  isAttended: Boolean!
  recipe: Recipe!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type RecipeStepConnection {
  pageInfo: PageInfo!
  edges: [RecipeStepEdge]!
  aggregate: AggregateRecipeStep!
}

input RecipeStepCreateInput {
  idx: Int!
  description: String!
  duration: Int!
  isAttended: Boolean!
  recipe: RecipeCreateOneWithoutStepsInput!
}

input RecipeStepCreateManyWithoutRecipeInput {
  create: [RecipeStepCreateWithoutRecipeInput!]
  connect: [RecipeStepWhereUniqueInput!]
}

input RecipeStepCreateWithoutRecipeInput {
  idx: Int!
  description: String!
  duration: Int!
  isAttended: Boolean!
}

type RecipeStepEdge {
  node: RecipeStep!
  cursor: String!
}

enum RecipeStepOrderByInput {
  id_ASC
  id_DESC
  idx_ASC
  idx_DESC
  description_ASC
  description_DESC
  duration_ASC
  duration_DESC
  isAttended_ASC
  isAttended_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type RecipeStepPreviousValues {
  id: ID!
  idx: Int!
  description: String!
  duration: Int!
  isAttended: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input RecipeStepScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  idx: Int
  idx_not: Int
  idx_in: [Int!]
  idx_not_in: [Int!]
  idx_lt: Int
  idx_lte: Int
  idx_gt: Int
  idx_gte: Int
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  duration: Int
  duration_not: Int
  duration_in: [Int!]
  duration_not_in: [Int!]
  duration_lt: Int
  duration_lte: Int
  duration_gt: Int
  duration_gte: Int
  isAttended: Boolean
  isAttended_not: Boolean
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [RecipeStepScalarWhereInput!]
  OR: [RecipeStepScalarWhereInput!]
  NOT: [RecipeStepScalarWhereInput!]
}

type RecipeStepSubscriptionPayload {
  mutation: MutationType!
  node: RecipeStep
  updatedFields: [String!]
  previousValues: RecipeStepPreviousValues
}

input RecipeStepSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: RecipeStepWhereInput
  AND: [RecipeStepSubscriptionWhereInput!]
  OR: [RecipeStepSubscriptionWhereInput!]
  NOT: [RecipeStepSubscriptionWhereInput!]
}

input RecipeStepUpdateInput {
  idx: Int
  description: String
  duration: Int
  isAttended: Boolean
  recipe: RecipeUpdateOneRequiredWithoutStepsInput
}

input RecipeStepUpdateManyDataInput {
  idx: Int
  description: String
  duration: Int
  isAttended: Boolean
}

input RecipeStepUpdateManyMutationInput {
  idx: Int
  description: String
  duration: Int
  isAttended: Boolean
}

input RecipeStepUpdateManyWithoutRecipeInput {
  create: [RecipeStepCreateWithoutRecipeInput!]
  delete: [RecipeStepWhereUniqueInput!]
  connect: [RecipeStepWhereUniqueInput!]
  set: [RecipeStepWhereUniqueInput!]
  disconnect: [RecipeStepWhereUniqueInput!]
  update: [RecipeStepUpdateWithWhereUniqueWithoutRecipeInput!]
  upsert: [RecipeStepUpsertWithWhereUniqueWithoutRecipeInput!]
  deleteMany: [RecipeStepScalarWhereInput!]
  updateMany: [RecipeStepUpdateManyWithWhereNestedInput!]
}

input RecipeStepUpdateManyWithWhereNestedInput {
  where: RecipeStepScalarWhereInput!
  data: RecipeStepUpdateManyDataInput!
}

input RecipeStepUpdateWithoutRecipeDataInput {
  idx: Int
  description: String
  duration: Int
  isAttended: Boolean
}

input RecipeStepUpdateWithWhereUniqueWithoutRecipeInput {
  where: RecipeStepWhereUniqueInput!
  data: RecipeStepUpdateWithoutRecipeDataInput!
}

input RecipeStepUpsertWithWhereUniqueWithoutRecipeInput {
  where: RecipeStepWhereUniqueInput!
  update: RecipeStepUpdateWithoutRecipeDataInput!
  create: RecipeStepCreateWithoutRecipeInput!
}

input RecipeStepWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  idx: Int
  idx_not: Int
  idx_in: [Int!]
  idx_not_in: [Int!]
  idx_lt: Int
  idx_lte: Int
  idx_gt: Int
  idx_gte: Int
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  duration: Int
  duration_not: Int
  duration_in: [Int!]
  duration_not_in: [Int!]
  duration_lt: Int
  duration_lte: Int
  duration_gt: Int
  duration_gte: Int
  isAttended: Boolean
  isAttended_not: Boolean
  recipe: RecipeWhereInput
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [RecipeStepWhereInput!]
  OR: [RecipeStepWhereInput!]
  NOT: [RecipeStepWhereInput!]
}

input RecipeStepWhereUniqueInput {
  id: ID
}

type RecipeSubscriptionPayload {
  mutation: MutationType!
  node: Recipe
  updatedFields: [String!]
  previousValues: RecipePreviousValues
}

input RecipeSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: RecipeWhereInput
  AND: [RecipeSubscriptionWhereInput!]
  OR: [RecipeSubscriptionWhereInput!]
  NOT: [RecipeSubscriptionWhereInput!]
}

input RecipeUpdateInput {
  name: String
  description: String
  maxServingWaitTime: Int
  steps: RecipeStepUpdateManyWithoutRecipeInput
  author: UserUpdateOneRequiredWithoutRecipesInput
}

input RecipeUpdateManyDataInput {
  name: String
  description: String
  maxServingWaitTime: Int
}

input RecipeUpdateManyMutationInput {
  name: String
  description: String
  maxServingWaitTime: Int
}

input RecipeUpdateManyWithoutAuthorInput {
  create: [RecipeCreateWithoutAuthorInput!]
  delete: [RecipeWhereUniqueInput!]
  connect: [RecipeWhereUniqueInput!]
  set: [RecipeWhereUniqueInput!]
  disconnect: [RecipeWhereUniqueInput!]
  update: [RecipeUpdateWithWhereUniqueWithoutAuthorInput!]
  upsert: [RecipeUpsertWithWhereUniqueWithoutAuthorInput!]
  deleteMany: [RecipeScalarWhereInput!]
  updateMany: [RecipeUpdateManyWithWhereNestedInput!]
}

input RecipeUpdateManyWithWhereNestedInput {
  where: RecipeScalarWhereInput!
  data: RecipeUpdateManyDataInput!
}

input RecipeUpdateOneRequiredWithoutStepsInput {
  create: RecipeCreateWithoutStepsInput
  update: RecipeUpdateWithoutStepsDataInput
  upsert: RecipeUpsertWithoutStepsInput
  connect: RecipeWhereUniqueInput
}

input RecipeUpdateWithoutAuthorDataInput {
  name: String
  description: String
  maxServingWaitTime: Int
  steps: RecipeStepUpdateManyWithoutRecipeInput
}

input RecipeUpdateWithoutStepsDataInput {
  name: String
  description: String
  maxServingWaitTime: Int
  author: UserUpdateOneRequiredWithoutRecipesInput
}

input RecipeUpdateWithWhereUniqueWithoutAuthorInput {
  where: RecipeWhereUniqueInput!
  data: RecipeUpdateWithoutAuthorDataInput!
}

input RecipeUpsertWithoutStepsInput {
  update: RecipeUpdateWithoutStepsDataInput!
  create: RecipeCreateWithoutStepsInput!
}

input RecipeUpsertWithWhereUniqueWithoutAuthorInput {
  where: RecipeWhereUniqueInput!
  update: RecipeUpdateWithoutAuthorDataInput!
  create: RecipeCreateWithoutAuthorInput!
}

input RecipeWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  maxServingWaitTime: Int
  maxServingWaitTime_not: Int
  maxServingWaitTime_in: [Int!]
  maxServingWaitTime_not_in: [Int!]
  maxServingWaitTime_lt: Int
  maxServingWaitTime_lte: Int
  maxServingWaitTime_gt: Int
  maxServingWaitTime_gte: Int
  steps_every: RecipeStepWhereInput
  steps_some: RecipeStepWhereInput
  steps_none: RecipeStepWhereInput
  author: UserWhereInput
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [RecipeWhereInput!]
  OR: [RecipeWhereInput!]
  NOT: [RecipeWhereInput!]
}

input RecipeWhereUniqueInput {
  id: ID
}

type Subscription {
  kitchen(where: KitchenSubscriptionWhereInput): KitchenSubscriptionPayload
  recipe(where: RecipeSubscriptionWhereInput): RecipeSubscriptionPayload
  recipeStep(where: RecipeStepSubscriptionWhereInput): RecipeStepSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  email: String!
  encryptedPassword: String!
  recipes(where: RecipeWhereInput, orderBy: RecipeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Recipe!]
  kitchens(where: KitchenWhereInput, orderBy: KitchenOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Kitchen!]
  createdAt: DateTime!
  updatedAt: DateTime!
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  email: String!
  encryptedPassword: String!
  recipes: RecipeCreateManyWithoutAuthorInput
  kitchens: KitchenCreateManyInput
}

input UserCreateOneWithoutRecipesInput {
  create: UserCreateWithoutRecipesInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutRecipesInput {
  email: String!
  encryptedPassword: String!
  kitchens: KitchenCreateManyInput
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  email_ASC
  email_DESC
  encryptedPassword_ASC
  encryptedPassword_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  id: ID!
  email: String!
  encryptedPassword: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  email: String
  encryptedPassword: String
  recipes: RecipeUpdateManyWithoutAuthorInput
  kitchens: KitchenUpdateManyInput
}

input UserUpdateManyMutationInput {
  email: String
  encryptedPassword: String
}

input UserUpdateOneRequiredWithoutRecipesInput {
  create: UserCreateWithoutRecipesInput
  update: UserUpdateWithoutRecipesDataInput
  upsert: UserUpsertWithoutRecipesInput
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutRecipesDataInput {
  email: String
  encryptedPassword: String
  kitchens: KitchenUpdateManyInput
}

input UserUpsertWithoutRecipesInput {
  update: UserUpdateWithoutRecipesDataInput!
  create: UserCreateWithoutRecipesInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  encryptedPassword: String
  encryptedPassword_not: String
  encryptedPassword_in: [String!]
  encryptedPassword_not_in: [String!]
  encryptedPassword_lt: String
  encryptedPassword_lte: String
  encryptedPassword_gt: String
  encryptedPassword_gte: String
  encryptedPassword_contains: String
  encryptedPassword_not_contains: String
  encryptedPassword_starts_with: String
  encryptedPassword_not_starts_with: String
  encryptedPassword_ends_with: String
  encryptedPassword_not_ends_with: String
  recipes_every: RecipeWhereInput
  recipes_some: RecipeWhereInput
  recipes_none: RecipeWhereInput
  kitchens_every: KitchenWhereInput
  kitchens_some: KitchenWhereInput
  kitchens_none: KitchenWhereInput
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`;
//# sourceMappingURL=prisma-schema.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const graphql_yoga_1 = require("graphql-yoga");
const prisma_client_1 = require("./generated/prisma-client");
const express_session_1 = __importDefault(require("express-session"));
const ms_1 = __importDefault(require("ms"));
const Query = __importStar(require("./resolvers/Query"));
const Mutation = __importStar(require("./resolvers/Mutation"));
const User = __importStar(require("./resolvers/User"));
const Recipe = __importStar(require("./resolvers/Recipe"));
const RecipeStep = __importStar(require("./resolvers/RecipeStep"));
const Kitchen = __importStar(require("./resolvers/Kitchen"));
const resolvers = {
    Query,
    Mutation,
    User,
    Recipe,
    RecipeStep,
    Kitchen
};
const context = (req) => ({ prisma: prisma_client_1.prisma, session: req.request.session });
const graphQLServer = new graphql_yoga_1.GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context,
});
exports.graphQLServer = graphQLServer;
graphQLServer.express.use(express_session_1.default({
    name: 'cookbook.sid',
    secret: `some-random-secret-here`,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: ms_1.default('1d'),
    }
}));
const serverOpts = {
    port: 4000,
    cors: {
        credentials: true,
        origin: ['http://localhost:3000'],
    }
};
const httpServerPromise = graphQLServer.start(serverOpts, ({ port, endpoint }) => {
    console.log(`Server is running on http://localhost:${port}${endpoint}`);
});
exports.httpServerPromise = httpServerPromise;
//# sourceMappingURL=index.js.map
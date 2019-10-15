"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function recipes(user, args, context, info) {
    return await context.prisma.user({ id: user.id }).recipes();
}
exports.recipes = recipes;
//# sourceMappingURL=User.js.map
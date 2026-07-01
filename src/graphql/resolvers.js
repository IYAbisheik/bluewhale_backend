import prisma from "../config/prisma.js";

export const resolvers = {
    Query: {
        getUsers: async () => {
            return prisma.user.findMany();
        }
    },

    Mutation: {
        createUser: async (_, args) => {
            return prisma.user.create({
                data: args
            });
        }
    }
};
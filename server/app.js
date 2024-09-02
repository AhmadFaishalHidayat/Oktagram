if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
const { verifToken } = require("./helpers/jwt.js")

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const {
    typeDefs: userTypeDefs,
    resolvers: userResolvers
} = require("./schemas/user")

const {
    typeDefs: postTypeDefs,
    resolvers: postResolvers
} = require("./schemas/post.js")

const {
    typeDefs: followTypeDefs,
    resolvers: followResolvers,
} = require('./schemas/follow')

const server = new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
    resolvers: [userResolvers, postResolvers, followResolvers],
    introspection: true,
});

startStandaloneServer(server, {
    listen: { port: process.env.PORT || 4000 },
    context: async ({ req, res }) => {
        return {
            auth: () => {
                //1. ambil token dari headers, kalau tidak ada throw error
                //2. split, type token, check bearer
                //3. check token -> jwt verify
                //4. kirim ke controller

                const auth = req.headers.authorization;
                if (!auth) throw new Error("UnAuthenticated");
                const [bearer, token] = auth.split(" ");
                if (bearer !== "Bearer") throw new Error("Invalid token");
                const payload = verifToken(token);
                return payload;

            }
        }
    }
}).then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
});

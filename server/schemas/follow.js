const Follow = require("../models/Follow")

const typeDefs = `#graphql

    type Follow {
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
    }

    input NewFollow {
        followingId: ID
    }

    type Query {
        follows:[Follow]
    }

    type Mutation {
        addFollow(newFollow: NewFollow) : Follow
    }
`;


const resolvers = {

    Mutation: {
        addFollow: async (_, args, contextValue) => {
            const user = await contextValue.auth()
            const {newFollow} = args

            console.log(args);
            console.log(user, "Aut<<<<>>>>>");
            console.log(newFollow, "newFolow<<<<>>>>>");
            
            let result = await Follow.addFollow({ user }, newFollow)

            return result;
        }
    }
}


module.exports = { typeDefs, resolvers }
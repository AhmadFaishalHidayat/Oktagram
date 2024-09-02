const User = require("../models/User");
const { comparePassword } = require("../helpers/bcrypt")
const { signToken } = require("../helpers/jwt")

const typeDefs = `#graphql
    type User {
        _id: ID
        name: String
        username: String
        email: String
        

    }


    type UserDetail {
        _id: ID
        name: String
        username: String
        email: String
        followingDetail: [User]
        followerDetail: [User]
    }


    input NewUser {
        name: String
        username: String
        email: String
        password: String
    }

    type Query {
        userById(_id: ID): UserDetail,
        userByUsername(username: String): [User],
        userByName(name: String): User,
        searchUser(name: String, username: String): User
    }

    type AccessToken {
        accessToken: String
    }

    type Mutation {
        register(user: NewUser): User
        login(email: String, password: String): AccessToken
    }
`;

//Resolver itu sama aja seperti Controller
const resolvers = {
    Query: {
        userById: async (_, args, { auth }) => {
            let { _id } = args;
            if (!_id) {
                _id = auth()._id
            }
            const user = await User.findById(_id);
            return user
        },

        searchUser: async (_, args) => {
            const { username, name } = args;
            console.log(args);
            let users
            if (username) {
                users = await User.findByUsername(username);
            }
            if (name) {
                users = await User.findByName(name);
            }
            return users
        },

        userByUsername: async (_, args) => {
            const { username } = args;
            console.log(args);
            const users = await User.findByUsername(username);
            return users
        },

        userByName: async (_, args) => {
            const { name } = args;
            console.log(args);
            const users = await User.findByName(name);
            return users
        },

    },

    Mutation: {
        register: async (_, args) => {
            console.log(args);
            const newUser = { ...args.user };
            console.log(newUser);
            // lempar ke model user

            const result = await User.create(newUser);
            return result;
        },

        login: async (_, args) => {
            //ambil req.bodynya 
            const { email, password } = args;

            const user = await User.findByEmail(email);

            if (!user) throw new Error("Email or Password Invalid");

            const isPasswordValid = comparePassword(password, user.password)

            if (!isPasswordValid) throw new Error("Email or Password Invalid");

            let token = {
                accessToken: signToken({ _id: user._id, email: user.email, username: user.username })
            }
            return token
        },


    }
};

module.exports = { typeDefs, resolvers };
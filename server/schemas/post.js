const redis = require('../config/redis');
const Post = require('../models/Post')


const typeDefs = `#graphql

    type AuthorDetail {
        _id: ID
        username: String
        email: String
    }

    type Comment{
        content: String
        username: String
        createdAt: String
        updatedAt: String
    }

    type Like{
        username: String
        createdAt: String
        updatedAt: String
    }

    type Post {
        _id: ID
        content: String
        tags: [String]
        imgUrl: String
        authorId: String
        author: AuthorDetail
        comments: [Comment]
        likes: [Like]

    }

    input NewPost{
        content: String
        tags: [String]
        imgUrl: String
    }

    type Query {
        postById(_id: ID): Post,
        posts: [Post] 
    }

    type Mutation {
        addPost(post: NewPost): String
        addComment(content:String, postId: ID): String
        addLike(postId: ID): String
    }
`;

const resolvers = {
    Query: {
        posts: async (_, __, { auth }) => {
            auth();
            // redis
            /**
             * 1. All post -> di redis ada atau tidak
             * 2. jika tidak ada -> ambil ke mongodb -> simpan ke redis
             * 3. jika ada -> ambil dari redis
             */

            const postCache = await redis.get("posts:all");
            if (postCache) {
                console.log("dari cache redis");
                return JSON.parse(postCache);
            }

            console.log("dari mongodb");
            const posts = await Post.getAll()
            await redis.set("posts:all", JSON.stringify(posts));

            return posts

        },

        postById: async (_, args, { auth }) => {
            console.log(args._id, "<<<<<<<>>>>>>>>>");
            auth();
            const postId = args._id
            console.log(postId);
            const post = await Post.findById(postId)
            console.log(post, "schemas <<<<<<<>>>>>>>>>>");
            return post;


        },
    },

    Mutation: {
        addPost: async (_, args, contextValue) => {
            console.log(args);
            const user = contextValue.auth();
            console.log(user, "<<<<<<<<<<<<<<<<<User");
            const newPost = { content, tags, imgUrl } = args.post;

            if (!content) throw new Error("Content is Required")
            if (!imgUrl) throw new Error("ImageUrl is Required")
            if (!tags) throw new Error("Tags is Required")

            if (!user) throw new Error("Author not found")
            //simpan data ke db

            await Post.create({ content, tags, imgUrl }, user._id, user);

            await redis.del("posts:all"); //cache invalidation
            return "Success add new post";
        },

        addComment: async (_, args, contextValue) => {
            const { content, postId } = args;

            const { username } = contextValue.auth();
            console.log(username);

            await Post.addComment({ content, username }, postId);

            await redis.del("posts:all");
            return "Success add new comment";
        },

        addLike: async (_, args, contextValue) => {
            const { postId } = args;

            const { username } = contextValue.auth();

            await Post.addLike({ username }, postId);


            await redis.del("posts:all");

            return "Success like post";
        },
    },
};

module.exports = { typeDefs, resolvers }
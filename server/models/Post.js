const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class Post {
    static collection() {
        return database.collection("posts");
    };

    static async getAll() {
        const agg = [
            {
                $lookup: {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $unset: ['author.password']
            },
            {
                $unwind: {
                    path: "$author",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]
        // const posts = await this.collection().find().toArray();
        const posts = await this.collection().aggregate(agg).toArray();
        console.log(posts, "<<<<<<<<<<Di Post Model");
        return posts;
    };

    static async findById(postId) {
        console.log(postId, "Model");
        const agg = [
            {
                '$match': {
                    '_id': new ObjectId(String(postId))
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'authorId',
                    'foreignField': '_id',
                    'as': 'user'
                }
            }
        ]
        const post = await this.collection().aggregate(agg).toArray()
        console.log(post, "Modeelll<<<<<<<<<>>>>>>>>>>>");
        return post[0];
    }

    static async create(newPost, authorId, author) {
        newPost.createdAt = newPost.updatedAt = new Date();
        newPost.authorId = new ObjectId(String(authorId));
        newPost.author = { _id: new ObjectId(String(author._id)), username: author.username, email: author.email }
        const result = await this.collection().insertOne(newPost);

        return "Success create post";
    };

    static async addComment(payload, postId) {
        payload.createdAt = payload.updatedAt = new Date();

        await this.collection().updateOne(
            {
                _id: new ObjectId(String(postId)),
            },

            {
                $push: {
                    comments: payload,
                },
            }
        );

        return "Success Add new Comment";
    };

    static async addLike(payload, postId) {
        console.log(payload.username, "INI MODEL");
        let like = await this.collection().findOne({ 'likes.username': payload.username, _id: new ObjectId(String(postId)) })
        console.log(like, "SUDAH LIKE");
        if (!like) {
            await this.collection().updateOne(
                {
                    _id: new ObjectId(String(postId)),
                },

                {
                    $push: {
                        likes: {
                            username: payload.username,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    },
                }
            );


        } else {
            throw new Error("Sudah di like")
        }

        return "Success Like Post";
    };

};

module.exports = Post
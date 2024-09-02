const { ObjectId, ReturnDocument } = require("mongodb");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const database = require("../config/mongodb");

class User {



    static async findById(_id) {
        const agg = [
            {
                '$match': {
                    '_id': new ObjectId(String(_id))
                }
            }, {
                '$lookup': {
                    'from': 'follows',
                    'localField': '_id',
                    'foreignField': 'followerId',
                    'as': 'following'
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'following.followingId',
                    'foreignField': '_id',
                    'as': 'followingDetail'
                }
            }, {
                '$lookup': {
                    'from': 'follows',
                    'localField': '_id',
                    'foreignField': 'followingId',
                    'as': 'follower'
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'follower.followerId',
                    'foreignField': '_id',
                    'as': 'followerDetail'
                }
            }
        ]
        const user = await database.collection("users").aggregate(agg).toArray()
        console.log(user[0], "Modell");
        return user[0];
    }

    static async findByUsername(username) {
        const result = await database.collection("users").find({
            username: username,
        }).toArray();
        return result;
    }

    static async findByName(name) {

        const result = await database.collection("users").findOne({
            name: name,
        });
        return result;
    }

    static async create(newUser) {
        //find jangan lupa validasi
        if (!newUser.username) throw new Error("Username is required")


        let checkUniqEmail = await this.findByEmail(newUser.email)
        if (checkUniqEmail) throw new Error("Email must be unique")
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(newUser.email)) {
            throw new Error("Invalid email format");
        }
        if (!newUser.email) throw new Error("Email is required")

        if (!newUser.password) throw new Error("Password is required")
        if (newUser.password.length < 5) throw new Error("Password min 5 Characters")

        newUser.createdAt = new Date();
        newUser.updatedAt = new Date();
        newUser.password = hashPassword(newUser.password);
        const result = await database.collection("users").insertOne(newUser);

        return newUser;
    }

    static async findByEmail(email) {

        const result = await database.collection("users").findOne({
            email: email,
        })
        // console.log(result, "<<<<<<<<<<< email");
        return result
    }

}

module.exports = User
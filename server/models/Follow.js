const { ObjectId } = require('mongodb')
const database = require("../config/mongodb");

class Follow {
    static collection() {
        return database.collection("follows");
    };

    static async addFollow(payload, followingId) {
        
        
        console.log(payload, "Payload <>>>>>>");
        let newFolow = {
            followingId: new ObjectId(String(followingId.followingId)),
            followerId: new ObjectId(String(payload.user._id)),
            createdAt: new Date(),
            updatedAt: new Date()
        }

        let result = await this.collection().insertOne(newFolow)
        console.log(result, "Result <<<<<<<<<>>>>>>>>>>>");
        return newFolow;
    }
}

module.exports = Follow